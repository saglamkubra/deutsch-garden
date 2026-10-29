import { initialGrammar } from "./types.ts";
import type { GrammarState } from "./types.ts";
import { topicById } from "./content.ts";
import { validQuestion } from "../exercises/persistence.ts";
import { isCorrect } from "../exercises/generate.ts";
export const GRAMMAR_KEY = "deutsch-garden:grammar:v1";
type StorageLike = Pick<Storage, "getItem" | "setItem">;
function obj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
const time = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
export function validGrammar(v: unknown): v is GrammarState {
  if (
    !obj(v) ||
    v.version !== 1 ||
    !obj(v.progress) ||
    !obj(v.attempts) ||
    !obj(v.activeAttempt) ||
    !obj(v.xp) ||
    !Array.isArray(v.claims) ||
    !Array.isArray(v.bookmarks) ||
    (v.lastTopic !== null && typeof v.lastTopic !== "string")
  )
    return false;
  if (
    v.bookmarks.some((id) => typeof id !== "string" || !topicById(id)) ||
    new Set(v.bookmarks).size !== v.bookmarks.length
  )
    return false;
  for (const [id, p] of Object.entries(v.progress))
    if (
      !topicById(id)?.lesson ||
      !obj(p) ||
      !time(p.startedAt) ||
      typeof p.read !== "boolean" ||
      typeof p.practicePassed !== "boolean" ||
      (p.completedAt !== null &&
        (!time(p.completedAt) || !p.read || !p.practicePassed))
    )
      return false;
  for (const [id, a] of Object.entries(v.attempts)) {
    if (
      !obj(a) ||
      a.id !== id ||
      typeof a.topicId !== "string" ||
      !topicById(a.topicId)?.lesson ||
      !time(a.startedAt) ||
      (a.completedAt !== null && !time(a.completedAt)) ||
      !Number.isInteger(a.index) ||
      Number(a.index) < 0 ||
      !Array.isArray(a.questions) ||
      a.questions.length !== topicById(a.topicId)?.lesson?.quiz.length ||
      Number(a.index) >= a.questions.length ||
      !a.questions.every(validQuestion) ||
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
      ([id, a]) =>
        typeof a !== "string" ||
        !obj(attempts[a]) ||
        attempts[a].topicId !== id,
    )
  )
    return false;
  if (
    v.claims.some(
      (c) =>
        !obj(c) ||
        typeof c.id !== "string" ||
        ![0, 15].includes(Number(c.xp)) ||
        ![0, 10].includes(Number(c.coins)) ||
        typeof c.seed !== "boolean" ||
        typeof c.delivered !== "boolean",
    ) ||
    new Set(v.claims.map((c) => (c as { id: string }).id)).size !==
      v.claims.length
  )
    return false;
  if (Object.values(v.xp).some((x) => x !== 15)) return false;
  if (v.lastTopic !== null && !v.progress[v.lastTopic]) return false;
  return true;
}
export function createGrammarPersistence(get: () => StorageLike) {
  return {
    load(): { state: GrammarState; readonly: boolean; notice: string } {
      try {
        const storage = get(),
          raw = storage.getItem(GRAMMAR_KEY);
        if (!raw)
          return { state: initialGrammar(), readonly: false, notice: "" };
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {}
        if (obj(parsed) && parsed.version !== 1)
          return {
            state: initialGrammar(),
            readonly: true,
            notice:
              "Bu gramer kaydı başka bir sürüme ait. Kaydı korumak için değişiklik kapalı.",
          };
        if (validGrammar(parsed))
          return { state: parsed, readonly: false, notice: "" };
        if (!storage.getItem(GRAMMAR_KEY + ":corrupt"))
          storage.setItem(GRAMMAR_KEY + ":corrupt", raw);
        let backup: unknown;
        try {
          backup = JSON.parse(
            storage.getItem(GRAMMAR_KEY + ":backup") ?? "null",
          );
        } catch {}
        return {
          state: validGrammar(backup) ? backup : initialGrammar(),
          readonly: false,
          notice:
            "Bozuk kayıt ayrı korundu. Geçerli yedek varsa geri yüklendi.",
        };
      } catch {
        return {
          state: initialGrammar(),
          readonly: true,
          notice:
            "Tarayıcı kaydı kullanılamıyor. Okuyabilirsin; ilerleme ve ödül kaydedilemez.",
        };
      }
    },
    save(state: GrammarState) {
      if (!validGrammar(state)) throw Error("Geçersiz gramer kaydı.");
      const storage = get(),
        raw = storage.getItem(GRAMMAR_KEY);
      if (raw) {
        let old: unknown;
        try {
          old = JSON.parse(raw);
        } catch {}
        if (obj(old) && old.version !== 1) throw Error("Sürüm korunuyor.");
        if (validGrammar(old)) storage.setItem(GRAMMAR_KEY + ":backup", raw);
      }
      storage.setItem(GRAMMAR_KEY, JSON.stringify(state));
    },
  };
}
