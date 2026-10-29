"use client";
import { progressStorage } from "../account/storage.ts";
import { useSyncExternalStore } from "react";
import { applyCommand, createStarter, grantReward } from "./model.ts";
import type {
  GardenState,
  GardenCommand,
  GardenEvent,
  GardenReward,
} from "./model.ts";
import { createLocalGardenStorage, GARDEN_KEY } from "./storage.ts";
import {
  receiveBirthday,
  validMemory,
  type BirthdayMemory,
} from "../birthday/model.ts";
import { claimGift } from "../gifts/model.ts";
import {
  enterBirthdayGarden,
  type WelcomeContent,
} from "../birthday/welcome-model.ts";
import { purchaseItem } from "../shop/model.ts";
import type { Level } from "../learning/types.ts";
import { withGardenLock } from "./transaction.ts";
import { GARDEN_CONFIG } from "./catalog.ts";
type Snapshot = {
  ready: boolean;
  state: GardenState;
  now: number;
  mode: "local" | "memory" | "readonly";
  notice: string;
  event: GardenEvent | null;
  eventAt: number;
  eventPlot: number | null;
  noticeId: number;
};
const serverSnapshot: Snapshot = {
  ready: false,
  state: createStarter(0),
  now: 0,
  mode: "local",
  notice: "",
  event: null,
  eventAt: 0,
  eventPlot: null,
  noticeId: 0,
};
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();
const storage = createLocalGardenStorage(() => progressStorage());
let timer: ReturnType<typeof setInterval> | null = null;
const emit = () => listeners.forEach((listener) => listener());
function persist(state: GardenState) {
  try {
    storage.save(state);
    return true;
  } catch {
    return false;
  }
}
function hydrate() {
  const now = Date.now();
  const loaded = storage.load(now);
  const mode = loaded.mode;
  const notice = loaded.notice;
  snapshot = {
    ...snapshot,
    ready: true,
    state: loaded.state,
    now,
    mode,
    notice,
    noticeId: snapshot.noticeId + 1,
  };
  tick();
  emit();
}
function tickUnlocked() {
  if (!snapshot.ready) return;
  const now = Date.now();
  const result = applyCommand(snapshot.state, { type: "reconcile" }, now);
  const changed = result.state !== snapshot.state;
  let mode = snapshot.mode;
  let notice = result.message ?? snapshot.notice;
  if (changed && mode === "local" && !persist(result.state)) {
    mode = "memory";
    notice =
      "Çiçeğin açtı ancak kayıt yapılamadı. Bu oturumdaki değişiklikler korunmayabilir.";
  }
  snapshot = {
    ...snapshot,
    state: result.state,
    now,
    mode,
    notice,
    ...(changed
      ? {
          event: result.event ?? null,
          eventAt: now,
          eventPlot: null,
          noticeId: snapshot.noticeId + 1,
        }
      : {}),
  };
  emit();
}
function onStorage(event: StorageEvent) {
  if (event.key !== GARDEN_KEY) return;
  if (event.newValue === null) {
    snapshot = {
      ...snapshot,
      mode: "memory",
      notice:
        "Tarayıcıdaki bahçe kaydı başka bir sekmede kaldırıldı. Bu açık oturumdaki bahçen korunuyor.",
      noticeId: snapshot.noticeId + 1,
    };
    emit();
    return;
  }
  const loaded = storage.load(Date.now());
  snapshot = {
    ...snapshot,
    state: loaded.state,
    mode: loaded.mode,
    now: Date.now(),
    notice: "Başka sekmedeki bahçe kaydı güncellendi. " + loaded.notice,
    noticeId: snapshot.noticeId + 1,
  };
  tick();
  emit();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    if (!snapshot.ready) hydrate();
    else tick();
    timer = setInterval(tick, GARDEN_CONFIG.tickMs);
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      if (timer) clearInterval(timer);
      timer = null;
      window.removeEventListener("storage", onStorage);
    }
  };
}
function gardenActionUnlocked(command: GardenCommand) {
  if (!snapshot.ready) return false;
  if (snapshot.mode === "readonly") {
    snapshot = {
      ...snapshot,
      notice: "Kaydını korumak için bu oturumda değişiklik yapılamıyor.",
      noticeId: snapshot.noticeId + 1,
    };
    emit();
    return false;
  }
  const durableOnly =
    command.type === "visit-world" ||
    command.world !== undefined ||
    ["harvest", "display-flower", "remove-flower"].includes(command.type);
  if (durableOnly && snapshot.mode !== "local") {
    snapshot = {
      ...snapshot,
      notice:
        "Kalıcı koleksiyonu korumak için bu işlemde tarayıcı kaydı gerekiyor.",
      noticeId: snapshot.noticeId + 1,
    };
    emit();
    return false;
  }
  const now = Date.now();
  const result = applyCommand(snapshot.state, command, now);
  if (result.error) {
    snapshot = {
      ...snapshot,
      notice: result.error,
      noticeId: snapshot.noticeId + 1,
    };
    emit();
    return false;
  }
  if (result.state === snapshot.state) return true;
  let mode = snapshot.mode;
  let notice = result.message ?? snapshot.notice;
  if (mode === "local" && !persist(result.state)) {
    if (durableOnly) {
      snapshot = {
        ...snapshot,
        notice: "İşlem kaydedilemedi; çiçeğin ve koleksiyonun değiştirilmedi.",
        noticeId: snapshot.noticeId + 1,
      };
      emit();
      return false;
    }
    mode = "memory";
    notice +=
      " Tarayıcı kaydı yapılamadı; bu oturumdaki değişiklikler kaybolabilir.";
  }
  snapshot = {
    ...snapshot,
    state: result.state,
    now,
    mode,
    notice,
    event: result.event ?? null,
    eventAt: now,
    eventPlot: result.plotId ?? null,
    noticeId: snapshot.noticeId + 1,
  };
  emit();
  // A watering bonus may make a flower mature immediately.
  if (command.type === "water") tick();
  return true;
}
export function useGarden() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot,
  );
}

// Learning outbox calls this only after its own response has been saved.
// A successful return means the garden receipt is durably saved, or already exists.
function deliverGardenRewardUnlocked(reward: GardenReward) {
  if (!snapshot.ready) hydrate();
  if (snapshot.mode !== "local") return false;
  const loaded = storage.load(Date.now());
  if (loaded.mode !== "local") return false;
  const previous = loaded.state;
  const next = grantReward(previous, reward, Date.now());
  if (next === previous) {
    snapshot = { ...snapshot, state: previous };
    emit();
    return true;
  }
  const unlocked = next.decorations.length > previous.decorations.length;
  if (!persist(next)) {
    snapshot = {
      ...snapshot,
      notice:
        "Öğrenme ödülünü güvenle kaydedemedim. Öğrenme kaydında bekliyor; sonra yeniden denenecek.",
      noticeId: snapshot.noticeId + 1,
    };
    emit();
    return false;
  }
  snapshot = {
    ...snapshot,
    state: next,
    mode: "local",
    now: Date.now(),
    notice: unlocked
      ? "Yaşasın! Yeni bir süs açıldı! 🦋"
      : "Öğrenme emeğinin bahçe hediyesi çantana eklendi. 🌱",
    event: unlocked ? "unlocked" : null,
    eventAt: Date.now(),
    eventPlot: null,
    noticeId: snapshot.noticeId + 1,
  };
  emit();
  return true;
}

function reloadDurable() {
  if (!snapshot.ready) hydrate();
  if (snapshot.mode !== "local") return;
  const loaded = storage.load(Date.now());
  snapshot = { ...snapshot, state: loaded.state, mode: loaded.mode };
}
function tick() {
  void withGardenLock(() => {
    reloadDurable();
    tickUnlocked();
  });
}
export async function gardenAction(command: GardenCommand) {
  return withGardenLock(() => {
    reloadDurable();
    return gardenActionUnlocked(command);
  });
}
export async function deliverGardenReward(reward: GardenReward) {
  return withGardenLock(() => {
    reloadDurable();
    return deliverGardenRewardUnlocked(reward);
  });
}
export async function purchaseGardenItem(
  productId: string,
  id: string,
  level: Level,
) {
  if (typeof navigator === "undefined" || !navigator.locks)
    return {
      ok: false,
      message:
        "Güvenli alışveriş için güncel bir tarayıcı ve HTTPS veya localhost gerekiyor.",
    };
  return withGardenLock(() => {
    reloadDurable();
    if (snapshot.mode !== "local")
      return {
        ok: false,
        message: "Bahçe kaydı güvenle yazılamıyor; para harcanmadı.",
      };
    const result = purchaseItem(
      snapshot.state,
      productId,
      id,
      level,
      Date.now(),
    );
    if (result.error) return { ok: false, message: result.error };
    if (result.duplicate)
      return {
        ok: true,
        message: "Bu satın alma zaten tamamlandı; yeniden para harcanmadı.",
      };
    if (!persist(result.state))
      return {
        ok: false,
        message:
          "Satın alma kaydedilemedi; para ve çantan değiştirilmedi. Yeniden deneyebilirsin.",
      };
    snapshot = {
      ...snapshot,
      state: result.state,
      now: Date.now(),
      notice: "Yeni bahçe arkadaşın çantana eklendi!",
      noticeId: snapshot.noticeId + 1,
    };
    emit();
    return {
      ok: true,
      message: "Satın alma tamamlandı! Yeni bahçe arkadaşın çantanda. 🌷",
    };
  });
}

export function gardenSnapshot() {
  return snapshot;
}
export async function claimDailyGift() {
  if (typeof navigator === "undefined" || !navigator.locks)
    return {
      ok: false,
      message:
        "Günlük hediye için güvenli tarayıcı kaydı ve Web Locks desteği gerekiyor.",
    };
  return withGardenLock(() => {
    reloadDurable();
    if (snapshot.mode !== "local")
      return {
        ok: false,
        message:
          "Hediyeni güvenle kaydetmek için tarayıcı depolamasını açmalısın.",
      };
    const value = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
    const result = claimGift(snapshot.state, Date.now(), value);
    if (result.error) return { ok: false, message: result.error };
    if (!result.duplicate && !persist(result.state))
      return {
        ok: false,
        message:
          "Hediye kaydedilemedi; kaynakların değiştirilmedi. Yeniden deneyebilirsin.",
      };
    snapshot = {
      ...snapshot,
      state: result.state,
      now: Date.now(),
      notice: "Günün sürprizi çantana eklendi! 🎁",
      noticeId: snapshot.noticeId + 1,
    };
    emit();
    return {
      ok: true,
      claim: result.claim,
      duplicate: !!result.duplicate,
      message: result.duplicate
        ? "Bugünün hediyesi zaten sende."
        : "Hediyen açıldı!",
    };
  });
}
export async function acknowledgeGiftXp(day: string) {
  return withGardenLock(() => {
    reloadDurable();
    if (snapshot.mode !== "local") return false;
    const claim = snapshot.state.dailyGifts?.find((c) => c.day === day);
    if (!claim) return false;
    if (claim.xpDelivered) return true;
    const next = {
      ...snapshot.state,
      revision: snapshot.state.revision + 1,
      dailyGifts: snapshot.state.dailyGifts!.map((c) =>
        c.day === day ? { ...c, xpDelivered: true } : c,
      ),
    };
    if (!persist(next)) return false;
    snapshot = { ...snapshot, state: next };
    emit();
    return true;
  });
}

// Only the live birthday API calls this adapter; creator preview never imports it.
export async function receiveBirthdayGift(memory: BirthdayMemory) {
  if (typeof navigator === "undefined" || !navigator.locks)
    return {
      ok: false,
      message:
        "Hatıranı güvenle kaydetmek için güncel bir tarayıcı ve HTTPS/localhost gerekiyor.",
    };
  return withGardenLock(() => {
    reloadDurable();
    if (snapshot.mode !== "local" || !validMemory(memory))
      return {
        ok: false,
        message:
          "Kalıcı bahçe kaydı kullanılamıyor; doğum günü hediyen henüz teslim edilmedi.",
      };
    const result = receiveBirthday(snapshot.state, memory);
    if (result.error) return { ok: false, message: result.error };
    if (!result.duplicate && !persist(result.state))
      return {
        ok: false,
        message:
          "Hediyen kaydedilemedi; kaynakların değiştirilmedi. Yeniden deneyebilirsin.",
      };
    snapshot = {
      ...snapshot,
      state: result.state,
      now: Date.now(),
      notice:
        "İyi ki doğdun! Özel tohumun, 20 bahçe paran ve Dilek Çelengin çantanda. 🌸",
      noticeId: snapshot.noticeId + 1,
    };
    emit();
    return {
      ok: true,
      message: result.duplicate
        ? "Bu doğum günü hediyesi zaten sende; mektubun her zaman burada."
        : "Doğum günü hediyen çantana eklendi!",
    };
  });
}

/** A single atomic garden write records the welcome and unique decoration together. */
export async function completeBirthdayWelcome(
  content: WelcomeContent,
  viewedAt: number,
) {
  if (typeof navigator === "undefined" || !navigator.locks)
    return {
      ok: false,
      message:
        "Güvenli kayıt için güncel bir tarayıcı ve HTTPS veya localhost gerekiyor.",
    };
  return withGardenLock(() => {
    reloadDurable();
    if (snapshot.mode !== "local")
      return {
        ok: false,
        message:
          "Kalıcı bahçe kaydı kullanılamıyor; görüldü durumu ve hediye henüz kaydedilmedi.",
      };
    const result = enterBirthdayGarden(snapshot.state, content, viewedAt);
    if (result.error) return { ok: false, message: result.error };
    if (!result.duplicate && !persist(result.state))
      return {
        ok: false,
        message:
          "Karşılama kaydedilemedi. Mevcut bahçen değişmedi; yeniden deneyebilirsin.",
      };
    snapshot = {
      ...snapshot,
      state: result.state,
      now: Date.now(),
      notice: "İyi ki doğdun! Dilek Çelengin bahçende seni bekliyor. 🌷",
      noticeId: snapshot.noticeId + 1,
    };
    emit();
    return {
      ok: true,
      duplicate: !!result.duplicate,
      message: result.duplicate
        ? "Bu karşılama ve hediyen zaten kayıtlı."
        : "Hatıran ve Dilek Çelengin güvenle kaydedildi.",
    };
  });
}
