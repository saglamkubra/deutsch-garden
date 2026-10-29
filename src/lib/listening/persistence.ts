import { initialListening } from "./types.ts";
import type { ListeningState } from "./types.ts";
import { episodeById } from "./content.ts";
import { speechBins } from "./engine.ts";
import { LEVELS } from "../learning/types.ts";
import vocabulary from "../../data/vocabulary.json" with { type: "json" };
import { validQuestion } from "../exercises/persistence.ts";
import { isCorrect } from "../exercises/generate.ts";
export const LISTENING_KEY = "deutsch-garden:listening:v1";
type StorageLike = Pick<Storage, "getItem" | "setItem">;
function obj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
const time = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
export function validListening(v: unknown): v is ListeningState {
  if (
    !obj(v) ||
    v.version !== 1 ||
    !obj(v.progress) ||
    !obj(v.daily) ||
    !obj(v.attempts) ||
    !obj(v.activeAttempt) ||
    !Array.isArray(v.favorites) ||
    !Array.isArray(v.savedWords) ||
    !Array.isArray(v.claims)
  )
    return false;
  if (
    v.favorites.some(
      (id) => typeof id !== "string" || !episodeById(id)?.audio,
    ) ||
    new Set(v.favorites).size !== v.favorites.length ||
    v.savedWords.some(
      (id) => typeof id !== "string" || !vocabulary.some((w) => w.id === id),
    ) ||
    new Set(v.savedWords).size !== v.savedWords.length
  )
    return false;
  for (const [id, p] of Object.entries(v.progress)) {
    const e = episodeById(id);
    if (
      !e?.audio ||
      !obj(p) ||
      !time(p.startedAt) ||
      !time(p.lastAt) ||
      !time(p.position) ||
      Number(p.position) > e.audio.duration + 0.1 ||
      (p.completedAt !== null && !time(p.completedAt)) ||
      !Array.isArray(p.heard) ||
      new Set(p.heard).size !== p.heard.length ||
      p.heard.some((n) => !Number.isInteger(n) || !speechBins(id).has(n))
    )
      return false;
  }
  for (const [key, a] of Object.entries(v.daily))
    if (
      !obj(a) ||
      typeof a.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(a.date) ||
      !LEVELS.includes(a.level as never) ||
      key !== a.date + ":" + a.level ||
      (a.episodeId !== null &&
        (typeof a.episodeId !== "string" ||
          episodeById(a.episodeId)?.level !== a.level ||
          !episodeById(a.episodeId)?.audio))
    )
      return false;
  for (const [id, a] of Object.entries(v.attempts)) {
    if (
      !obj(a) ||
      a.id !== id ||
      typeof a.episodeId !== "string" ||
      !episodeById(a.episodeId)?.audio ||
      !time(a.startedAt) ||
      (a.completedAt !== null && !time(a.completedAt)) ||
      !Number.isInteger(a.index) ||
      Number(a.index) < 0 ||
      !Array.isArray(a.questions) ||
      a.questions.length !== episodeById(a.episodeId)?.quiz.length ||
      Number(a.index) >= a.questions.length ||
      !a.questions.every(validQuestion) ||
      new Set(a.questions.map((q) => q.id)).size !== a.questions.length ||
      !obj(a.answers)
    )
      return false;
    const questions = a.questions;
    for (const [qid, r] of Object.entries(a.answers)) {
      const q = questions.find((q) => q.id === qid);
      if (
        !q ||
        !obj(r) ||
        typeof r.value !== "string" ||
        !time(r.at) ||
        r.xp !== 0 ||
        typeof r.correct !== "boolean" ||
        r.correct !== isCorrect(q, r.value)
      )
        return false;
    }
    if (
      a.completedAt !== null &&
      Object.keys(a.answers).length !== questions.length
    )
      return false;
  }
  const attempts = v.attempts;
  if (
    Object.entries(v.activeAttempt).some(
      ([episodeId, id]) =>
        typeof id !== "string" ||
        !obj(attempts[id]) ||
        attempts[id].episodeId !== episodeId,
    )
  )
    return false;
  if (
    v.claims.some(
      (c) =>
        !obj(c) ||
        typeof c.id !== "string" ||
        !c.id.startsWith("listening:") ||
        typeof c.xp !== "number" ||
        ![0, 15].includes(c.xp) ||
        typeof c.coins !== "number" ||
        ![0, 10].includes(c.coins) ||
        typeof c.seed !== "boolean" ||
        typeof c.delivered !== "boolean",
    ) ||
    new Set(v.claims.map((c) => (c as { id: string }).id)).size !==
      v.claims.length
  )
    return false;
  return true;
}
export function createListeningPersistence(get: () => StorageLike) {
  return {
    load(): { state: ListeningState; readonly: boolean; notice: string } {
      try {
        const storage = get(),
          raw = storage.getItem(LISTENING_KEY);
        if (!raw)
          return { state: initialListening(), readonly: false, notice: "" };
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {}
        if (obj(parsed) && parsed.version !== 1)
          return {
            state: initialListening(),
            readonly: true,
            notice:
              "Bu dinleme kaydı başka bir sürüme ait. Kaydını korumak için değişiklik kapalı.",
          };
        if (validListening(parsed))
          return { state: parsed, readonly: false, notice: "" };
        if (!storage.getItem(LISTENING_KEY + ":corrupt"))
          storage.setItem(LISTENING_KEY + ":corrupt", raw);
        let backup: unknown;
        try {
          backup = JSON.parse(
            storage.getItem(LISTENING_KEY + ":backup") ?? "null",
          );
        } catch {}
        return {
          state: validListening(backup) ? backup : initialListening(),
          readonly: false,
          notice:
            "Bozuk kayıt ayrı korundu; geçerli yedek varsa geri yüklendi.",
        };
      } catch {
        return {
          state: initialListening(),
          readonly: true,
          notice:
            "Tarayıcı kaydı kullanılamıyor. Dinleyebilirsin; ilerleme ve ödül kaydedilemez.",
        };
      }
    },
    save(state: ListeningState) {
      if (!validListening(state)) throw Error("Geçersiz dinleme kaydı.");
      const storage = get(),
        raw = storage.getItem(LISTENING_KEY);
      if (raw) {
        let old: unknown;
        try {
          old = JSON.parse(raw);
        } catch {}
        if (obj(old) && old.version !== 1) throw Error("Sürüm korunuyor.");
        if (validListening(old))
          storage.setItem(LISTENING_KEY + ":backup", raw);
      }
      storage.setItem(LISTENING_KEY, JSON.stringify(state));
    },
  };
}
