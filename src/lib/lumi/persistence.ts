import { initialLumi, wordKey } from "./model.ts";
import type { LumiState } from "./model.ts";
import {
  object,
  validId,
  validReply,
  validReceipt,
  MODES,
  LIMITS,
} from "./protocol.ts";
import { LEVELS } from "../learning/types.ts";
export const LUMI_KEY = "deutsch-garden:lumi:v1";
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const time = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
export function validLumi(v: unknown): v is LumiState {
  try {
    if (
      !object(v) ||
      v.version !== 1 ||
      !Array.isArray(v.conversations) ||
      v.conversations.length > LIMITS.history ||
      !Array.isArray(v.words) ||
      v.words.length > LIMITS.words ||
      !Array.isArray(v.completed) ||
      !v.completed.every(validId) ||
      new Set(v.completed).size !== v.completed.length ||
      !Array.isArray(v.claims) ||
      typeof v.consent !== "boolean"
    )
      return false;
    const s = v as unknown as LumiState;
    if (
      (s.active !== null && !s.conversations.some((c) => c.id === s.active)) ||
      new Set(s.conversations.map((c) => c.id)).size !== s.conversations.length
    )
      return false;
    for (const c of s.conversations) {
      if (
        !object(c) ||
        !validId(c.id) ||
        !LEVELS.includes(c.level) ||
        !Object.hasOwn(MODES, c.mode) ||
        !["gentle", "summary"].includes(c.correction) ||
        !time(c.createdAt) ||
        !time(c.updatedAt) ||
        typeof c.closed !== "boolean" ||
        typeof c.qualified !== "boolean" ||
        (c.qualified && !c.closed) ||
        !Array.isArray(c.messages) ||
        c.messages.length > 25 ||
        new Set(c.messages.map((m) => m.id)).size !== c.messages.length
      )
        return false;
      if (
        c.messages.some(
          (m, i) =>
            !object(m) ||
            typeof m.id !== "string" ||
            typeof m.content !== "string" ||
            !m.content.trim() ||
            m.content.length > (m.role === "user" ? 800 : 1800) ||
            m.role !==
              (c.closed && i === c.messages.length - 1
                ? "assistant"
                : i % 2 === 0
                  ? "user"
                  : "assistant") ||
            (m.role === "assistant" &&
              (!validReply(m.reply) || m.reply.message !== m.content)),
        )
      )
        return false;
      if (
        c.closed
          ? c.messages.length % 2 !== 1 || c.messages.length < 3
          : c.messages.length % 2 !== 0
      )
        return false;
      if (
        c.pending !== null &&
        (!object(c.pending) ||
          !validId(c.pending.id) ||
          !["message", "finish"].includes(c.pending.action) ||
          typeof c.pending.text !== "string" ||
          c.pending.text.length > 800 ||
          (c.pending.action === "message" && !c.pending.text.trim()) ||
          (c.pending.action === "finish" && !c.messages.length) ||
          c.closed)
      )
        return false;
    }
    if (
      new Set(s.words.map((w) => w.key)).size !== s.words.length ||
      s.words.some(
        (w) =>
          !object(w) ||
          !validReply({
            message: "x",
            encouragementTr: "x",
            corrections: [],
            vocabulary: [w.word],
          }) ||
          w.key !== wordKey(w.word) ||
          (w.repositoryId !== null && typeof w.repositoryId !== "string"),
      )
    )
      return false;
    if (
      new Set(s.claims.map((c) => c.receipt.id)).size !== s.claims.length ||
      s.claims.some(
        (c) =>
          !object(c) ||
          !validReceipt(c.receipt) ||
          typeof c.delivered !== "boolean",
      )
    )
      return false;
    return true;
  } catch {
    return false;
  }
}
export function createLumiPersistence(get: () => StorageLike) {
  return {
    load(): { state: LumiState; readonly: boolean; notice: string } {
      try {
        const storage = get(),
          raw = storage.getItem(LUMI_KEY);
        if (!raw) return { state: initialLumi(), readonly: false, notice: "" };
        let data: unknown;
        try {
          data = JSON.parse(raw);
        } catch {}
        if (object(data) && data.version !== 1)
          return {
            state: initialLumi(),
            readonly: true,
            notice:
              "Lumi kaydı farklı bir sürüme ait. Kaydını korumak için değişiklik kapalı.",
          };
        if (validLumi(data))
          return { state: data, readonly: false, notice: "" };
        if (!storage.getItem(LUMI_KEY + ":corrupt"))
          storage.setItem(LUMI_KEY + ":corrupt", raw);
        let backup: unknown;
        try {
          backup = JSON.parse(storage.getItem(LUMI_KEY + ":backup") ?? "null");
        } catch {}
        return {
          state: validLumi(backup) ? backup : initialLumi(),
          readonly: false,
          notice:
            "Bozuk sohbet kaydı ayrı korundu; geçerli yedek varsa geri yüklendi.",
        };
      } catch {
        return {
          state: initialLumi(),
          readonly: true,
          notice:
            "Tarayıcı kaydı kullanılamıyor. Mesajlar kaybolmasın diye sohbet gönderimi kapalı.",
        };
      }
    },
    save(state: LumiState, purgeBackups = false) {
      if (!validLumi(state)) throw Error("Geçersiz Lumi kaydı");
      const storage = get(),
        raw = storage.getItem(LUMI_KEY);
      if (raw) {
        let old: unknown;
        try {
          old = JSON.parse(raw);
        } catch {}
        if (object(old) && old.version !== 1)
          throw Error("Kayıt sürümü korunuyor");
        if (validLumi(old) && !purgeBackups)
          storage.setItem(LUMI_KEY + ":backup", raw);
      }
      const serialized = JSON.stringify(state);
      storage.setItem(LUMI_KEY, serialized);
      if (purgeBackups) {
        storage.setItem(LUMI_KEY + ":backup", serialized);
        storage.removeItem(LUMI_KEY + ":corrupt");
      }
    },
  };
}
