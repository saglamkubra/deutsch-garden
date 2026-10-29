"use client";
import { DIARY_KEY, DIARY_CLEARED } from "../diary/model.ts";
import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { accountClient, connectAccount } from "./client.ts";
import { accountError } from "./errors.ts";
import {
  setStorageOwner,
  freezeProgress,
  relayStorageEvent,
  watchProgress,
  physicalKey,
  keyFor,
} from "./storage.ts";
import {
  archive,
  canonical,
  capture,
  fingerprint,
  hasProgress,
  recoverRestore,
  restore,
  validSnapshot,
  type Snapshot,
} from "./snapshot.ts";
type CloudRow = {
  user_id: string;
  revision: number;
  private_epoch: number;
  payload: Snapshot;
  updated_at: string;
};
type Pending = {
  epoch: number;
  operation: string;
  expected: number;
  payload: Snapshot;
  importHash: string | null;
  adopt: boolean;
  archive: boolean;
};
type Meta = {
  privacyEpoch?: number;
  revision: number;
  hash: string;
  pending?: Pending;
};
type AccountState = {
  ready: boolean;
  configured: boolean;
  user: User | null;
  status:
    "loading" | "local" | "saved" | "saving" | "error" | "conflict" | "remote";
  message: string;
  localImport: boolean;
  revision: number;
};
const server: AccountState = {
  ready: false,
  configured: false,
  user: null,
  status: "loading",
  message: "Bahçenin kayıtları hazırlanıyor…",
  localImport: false,
  revision: 0,
};
let state = server,
  bootPromise: Promise<void> | null = null,
  timer: ReturnType<typeof setTimeout> | undefined;
let busy = false,
  blocked = false,
  authSwitching = false,
  initialized = false;
let remote: CloudRow | null = null;
const listeners = new Set<() => void>();
const emit = (patch: Partial<AccountState>) => {
  state = { ...state, ...patch };
  listeners.forEach((f) => f());
};
export const useAccount = () =>
  useSyncExternalStore(
    (f) => {
      listeners.add(f);
      return () => {
        listeners.delete(f);
      };
    },
    () => state,
    () => server,
  );
export const accountSnapshot = () => state;
const metaKey = (id: string) => `deutsch-garden:sync:${id}`;
function readMeta(id: string): Meta {
  const raw = localStorage.getItem(metaKey(id));
  if (!raw) return { revision: 0, hash: "" };
  const m = JSON.parse(raw) as Meta;
  if (
    !Number.isSafeInteger(m.revision) ||
    m.revision < 0 ||
    typeof m.hash !== "string" ||
    (m.pending && !validSnapshot(m.pending.payload))
  )
    throw new Error("Eşitleme kaydı doğrulanamadı. Veriler korunuyor.");
  return m;
}
const saveMeta = (id: string, m: Meta) =>
  localStorage.setItem(metaKey(id), JSON.stringify(m));
async function fetchCloud(): Promise<CloudRow | null> {
  const c = accountClient();
  if (!c || !state.user) return null;
  const { data, error } = await c
    .from("user_progress")
    .select("user_id,revision,private_epoch,payload,updated_at")
    .eq("user_id", state.user.id)
    .maybeSingle();
  if (error) throw error;
  if (
    data &&
    (data.user_id !== state.user.id ||
      !Number.isSafeInteger(data.revision) ||
      !validSnapshot(data.payload))
  )
    throw new Error("Bulut kaydı doğrulanamadı; yerel kayıt korunuyor.");
  return data;
}
function scheduleSave() {
  if (!state.user || blocked || !state.ready || authSwitching) return;
  clearTimeout(timer);
  emit({
    status: "local",
    message: "Cihazına kaydedildi; buluta gönderilecek.",
  });
  timer = setTimeout(() => {
    void saveCloud();
  }, 2500);
}
async function applyCloud(row: CloudRow, savePrevious = true) {
  const id = state.user!.id;
  freezeProgress();
  emit({ ready: false, message: "Bulut kaydı güvenle yükleniyor…" });
  try {
    if (savePrevious) archive(localStorage, id, capture(localStorage, id));
    restore(localStorage, id, row.payload);
    saveMeta(id, {
      privacyEpoch: row.private_epoch,
      revision: row.revision,
      hash: await fingerprint(row.payload),
    });
    location.reload();
  } catch (e) {
    emit({
      status: "error",
      message:
        "Kayıt yüklenemedi. Önceki kayıt ve kurtarma günlüğü korunuyor; yeniden yükleyip tekrar dene.",
    });
    throw e;
  }
}
async function boot() {
  try {
    const c = await connectAccount();
    if (!c) {
      setStorageOwner(null);
      emit({
        ready: true,
        status: "local",
        message: "Yerel kullanım · Supabase kurulumu gerekli.",
        configured: false,
      });
      return;
    }
    const session = await c.auth.getSession();
    if (session.error) throw session.error;
    let user: User | null = null;
    if (session.data.session) {
      const verified = await c.auth.getUser();
      if (verified.error) throw verified.error;
      user = verified.data.user;
    }
    setStorageOwner(user?.id ?? null);
    emit({ configured: true, user });
    if (user) {
      recoverRestore(localStorage, user.id);
      const local = capture(localStorage, user.id),
        meta = readMeta(user.id);
      remote = await fetchCloud();
      if (meta.pending) {
        // A lost response may already have committed. Retrying its UUID is idempotent.
        emit({
          status: "error",
          message:
            "Yarım kalan eşitleme var. Yeniden dene; işlem iki kez uygulanmaz.",
        });
      } else if (remote) {
        if (
          !hasProgress(local) ||
          (meta.hash && (await fingerprint(local)) === meta.hash)
        ) {
          if (canonical(local) !== canonical(remote.payload)) {
            if (hasProgress(local)) archive(localStorage, user.id, local);
            restore(localStorage, user.id, remote.payload);
          }
          saveMeta(user.id, {
            privacyEpoch: remote.private_epoch,
            revision: remote.revision,
            hash: await fingerprint(remote.payload),
          });
          emit({
            status: "saved",
            message: "Bulut kaydın yüklendi.",
            revision: remote.revision,
          });
        } else if (canonical(local) === canonical(remote.payload)) {
          saveMeta(user.id, {
            privacyEpoch: remote.private_epoch,
            revision: remote.revision,
            hash: await fingerprint(local),
          });
          emit({
            status: "saved",
            message: "Bulut ve cihaz kaydın aynı.",
            revision: remote.revision,
          });
        } else if (remote.revision !== meta.revision) {
          blocked = true;
          emit({
            status: "conflict",
            message:
              "Cihaz ve bulut kayıtları farklı. Profilindeki eşitleme seçeneklerinden birini seç.",
            revision: remote.revision,
          });
        } else
          emit({
            status: "local",
            message: "Cihazındaki değişiklikler buluta gönderilmeyi bekliyor.",
          });
      } else
        emit({
          status: "local",
          message: "Bu hesap için henüz bulut kaydı yok.",
        });
      let guest = false;
      try {
        guest = hasProgress(capture(localStorage, null));
      } catch {
        /* Never modify invalid guest data. Export remains available. */
      }
      emit({ localImport: guest });
    } else
      emit({
        status: "local",
        message: "Misafir kaydı bu tarayıcıda tutuluyor.",
      });
    c.auth.onAuthStateChange((_event, next) => {
      if (!initialized) return;
      if ((next?.user.id ?? null) !== (state.user?.id ?? null)) {
        authSwitching = true;
        freezeProgress();
        emit({
          ready: false,
          message: "Hesap değişiyor; kayıtların korunuyor…",
        });
        // All existing module stores are recreated under the new account namespace.
        setTimeout(
          () =>
            location.replace(
              new URL(
                ["/giris", "/kayit"].includes(location.pathname)
                  ? "/profilim"
                  : location.href,
                location.origin,
              ).href,
            ),
          0,
        );
      }
    });
    initialized = true;
    window.addEventListener("storage", relayStorageEvent);
    watchProgress(scheduleSave);
    window.addEventListener("online", () => {
      if (!blocked) void saveCloud();
    });
    window.addEventListener("focus", () => {
      void checkCloud();
    });
    setInterval(() => {
      if (document.visibilityState === "visible") void checkCloud();
    }, 60000);
    emit({ ready: true });
    if (user && !blocked && !readMeta(user.id).pending) scheduleSave();
  } catch (e) {
    blocked = true;
    // Do not mount guest stores when an existing session cannot be verified.
    emit({ ready: false, status: "error", message: accountError(e) });
  }
}
export const startAccount = () => (bootPromise ??= boot());
async function withCloudLock<T>(run: () => Promise<T>): Promise<T> {
  if (state.user && navigator.locks)
    return navigator.locks.request(
      "deutsch-garden:cloud:" + state.user.id,
      run,
    );
  return run();
}
export async function saveCloud() {
  return withCloudLock(saveCloudUnlocked);
}
async function saveCloudUnlocked() {
  if (!state.user || busy || blocked || authSwitching || !state.ready) return;
  const c = accountClient();
  if (!c) return;
  busy = true;
  clearTimeout(timer);
  try {
    const id = state.user.id,
      meta = readMeta(id),
      local = capture(localStorage, id);
    if (!meta.pending && (await fingerprint(local)) === meta.hash) {
      emit({ status: "saved", message: "Buluta kaydedildi." });
      return;
    }
    const pending: Pending = meta.pending ?? {
      epoch: meta.privacyEpoch ?? 0,
      operation: crypto.randomUUID(),
      expected: meta.revision,
      payload: local,
      importHash: null,
      adopt: false,
      archive: false,
    };
    saveMeta(id, { ...meta, pending });
    emit({ status: "saving", message: "Buluta kaydediliyor…" });
    const { data, error } = await c.rpc("save_learning_snapshot", {
      p_expected: pending.expected,
      p_operation: pending.operation,
      p_payload: pending.payload,
      p_import_hash: pending.importHash,
      p_archive: pending.archive,
      p_private_epoch: pending.epoch,
    });
    if (error) throw error;
    if (
      !data ||
      data.user_id !== id ||
      !validSnapshot(data.payload) ||
      canonical(data.payload) !== canonical(pending.payload)
    ) {
      blocked = true;
      emit({
        status: "conflict",
        message:
          "İşlemden sonra bulut değişmiş. Kayıtları karşılaştırıp seçim yap.",
      });
      return;
    }
    remote = data;
    if (pending.adopt) {
      await applyCloud(data);
      return;
    }
    saveMeta(id, {
      privacyEpoch: data.private_epoch,
      revision: data.revision,
      hash: await fingerprint(pending.payload),
    });
    emit({
      status: "saved",
      message: "Buluta kaydedildi.",
      revision: data.revision,
    });
    if (canonical(capture(localStorage, id)) !== canonical(pending.payload))
      scheduleSave();
  } catch (e) {
    const raw =
      e && typeof e === "object" && "message" in e ? String(e.message) : "";
    if (
      /SYNC_CONFLICT|PRIVACY_CONFLICT|ALREADY_IMPORTED|OPERATION_MISMATCH|ACHIEVEMENT_ALREADY_CLAIMED|INVALID_ACHIEVEMENT|INVALID_XP_EVIDENCE|DAILY_XP_LIMIT/.test(
        raw,
      )
    )
      blocked = true;
    emit({ status: blocked ? "conflict" : "error", message: accountError(e) });
  } finally {
    busy = false;
  }
}
export async function checkCloud() {
  if (!state.user || busy || blocked || authSwitching || !state.ready) return;
  try {
    const row = await fetchCloud();
    remote = row;
    if (row && row.revision !== readMeta(state.user.id).revision) {
      blocked = true;
      const clean =
        (await fingerprint(capture(localStorage, state.user.id))) ===
        readMeta(state.user.id).hash;
      emit({
        status: clean ? "remote" : "conflict",
        message: clean
          ? "Başka cihazda yeni kayıt var. Profilinden yükleyebilirsin."
          : "İki cihazda farklı değişiklikler var. Profilinden korunacak kaydı seç.",
      });
    }
  } catch (e) {
    emit({ status: "error", message: accountError(e) });
  }
}
/** Explicit whole-snapshot replacement; never adds balances or replays rewards. */
export async function chooseSnapshot(source: "guest" | "device" | "cloud") {
  await withCloudLock(() => chooseSnapshotUnlocked(source));
  if (source !== "cloud") await saveCloud();
}
async function chooseSnapshotUnlocked(source: "guest" | "device" | "cloud") {
  if (!state.user || busy)
    throw new Error("Hesabına giriş yapıp mevcut işlemin bitmesini bekle.");
  busy = true;
  try {
    const id = state.user.id;
    const row = await fetchCloud();
    remote = row;
    if (source === "cloud") {
      if (!row) throw new Error("Bulutta henüz kayıt yok.");
      await applyCloud(row);
      return;
    }
    const payload = capture(localStorage, source === "guest" ? null : id);
    if (!hasProgress(payload))
      throw new Error("Aktarılacak ilerleme bulunamadı.");
    archive(localStorage, id, capture(localStorage, id));
    if (row) archive(localStorage, id, row.payload);
    saveMeta(id, {
      privacyEpoch: readMeta(id).privacyEpoch,
      revision: row?.revision ?? 0,
      hash: "",
      pending: {
        epoch: readMeta(id).privacyEpoch ?? 0,
        operation: crypto.randomUUID(),
        expected: row?.revision ?? 0,
        payload,
        importHash: source === "guest" ? await fingerprint(payload) : null,
        adopt: source === "guest",
        archive: true,
      },
    });
    blocked = false;
  } finally {
    busy = false;
  }
}
export async function signOutAccount() {
  if (busy) throw new Error("Kaydetme işleminin bitmesini bekle.");
  const c = accountClient();
  if (!c) return;
  // Pending writes remain in this account's cache; they never move to the next account.
  const r = await c.auth.signOut({ scope: "local" });
  if (r.error) throw r.error;
  freezeProgress();
  location.replace(new URL("/giris", location.origin).href);
}
export function downloadData(
  data: unknown,
  filename = "deutsch-garden-verilerim.json",
) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function deviceExport() {
  const id = state.user?.id ?? null;
  const device: Record<string, string> = {};
  // Include unreadable backups as strings too: export never discards damaged/future data.
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;
    if (
      id
        ? key.startsWith(`deutsch-garden:account:${id}:`) ||
          key.startsWith(`deutsch-garden:archive:${id}:`) ||
          key === `deutsch-garden:restore:${id}` ||
          key === metaKey(id)
        : /^deutsch-garden:(garden|learning|exercises|grammar|listening|stories|mini-courses|lumi|vocabulary|preferences|diary):v1/.test(
            key,
          )
    )
      device[key] = localStorage.getItem(key)!;
  }
  return device;
}
export function exportDeviceData() {
  downloadData(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      device: deviceExport(),
    },
    "deutsch-garden-cihaz-yedegi.json",
  );
}
export async function exportAccountData() {
  const id = state.user?.id ?? null;
  const device = deviceExport();
  let cloud: unknown = null,
    diary: unknown = null,
    archives: unknown = null;
  if (id && accountClient()) {
    cloud = await fetchCloud();
    const readAll = async (table: "diary_entries" | "progress_archives") => {
      const rows: unknown[] = [];
      for (;;) {
        const r = await accountClient()!
          .from(table)
          .select("*")
          .eq("user_id", id)
          .order("id")
          .range(rows.length, rows.length + 499);
        if (r.error) throw r.error;
        if (!r.data?.length) return rows;
        rows.push(...r.data);
      }
    };
    diary = await readAll("diary_entries");
    archives = await readAll("progress_archives");
  }
  downloadData({
    version: 1,
    exportedAt: new Date().toISOString(),
    device,
    cloud,
    diary,
    archives,
  });
}
export async function deletePrivateContent(kind: "diary" | "conversations") {
  return withCloudLock(() => deletePrivateContentUnlocked(kind));
}
async function deletePrivateContentUnlocked(kind: "diary" | "conversations") {
  if (!state.user || busy)
    throw new Error("Önce giriş yap ve eşitlemenin bitmesini bekle.");
  blocked = true;
  clearTimeout(timer);
  busy = true;
  try {
    const id = state.user.id;
    // Clear pending copies before issuing a privacy mutation; don't resurrect old text.
    const meta = readMeta(id);
    if (kind === "conversations")
      saveMeta(id, {
        privacyEpoch: meta.privacyEpoch,
        revision: meta.revision,
        hash: meta.hash,
      });
    const { data, error } = await accountClient()!.rpc(
      "delete_private_learning_data",
      { p_kind: kind },
    );
    if (error) throw error;
    if (kind === "conversations") {
      const prefix = `deutsch-garden:archive:${id}:`;
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i)!;
        if (k.startsWith(prefix)) {
          const entry = JSON.parse(localStorage.getItem(k)!);
          if (entry.snapshot?.modules?.lumi) {
            entry.snapshot.modules.lumi.conversations = [];
            entry.snapshot.modules.lumi.active = null;
            localStorage.setItem(k, JSON.stringify(entry));
          }
        }
        if (
          k.startsWith(physicalKey(keyFor("lumi"), id)) &&
          k !== physicalKey(keyFor("lumi"), id)
        )
          localStorage.removeItem(k);
      }
      // Preserve unsynced non-private learning changes, but remove conversations locally.
      const local = capture(localStorage, id);
      const lumi = local.modules.lumi as
        { conversations: unknown[]; active: string | null } | undefined;
      if (lumi) {
        lumi.conversations = [];
        lumi.active = null;
      }
      freezeProgress();
      restore(localStorage, id, local);
      if (data && validSnapshot(data.payload))
        saveMeta(id, {
          privacyEpoch: data.private_epoch,
          revision: data.revision,
          hash: await fingerprint(data.payload),
        });
      else saveMeta(id, { revision: 0, hash: "" });
      location.reload();
    } else {
      blocked = false;
      localStorage.removeItem(physicalKey(DIARY_KEY, id));
      window.dispatchEvent(new Event(DIARY_CLEARED));
      emit({ message: "Buluttaki günlük kayıtların silindi." });
    }
  } catch (e) {
    emit({
      status: "conflict",
      message:
        "Gizlilik işlemi tamamlanamadı. Eski içeriklerin yeniden gönderilmemesi için eşitleme durduruldu. İşlemi tekrar dene veya bulut kaydını yükle.",
    });
    throw e;
  } finally {
    busy = false;
  }
}
