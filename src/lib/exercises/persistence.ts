import { validGame } from "../gamification/model.ts";
import { validXpReceipt } from "../gamification/rewards.ts";
import { initialExercises } from "./types.ts";
import type { ExerciseState, Question, Session } from "./types.ts";
import { LEVELS } from "../learning/types.ts";
import { isCorrect } from "./generate.ts";
export const EXERCISE_KEY = "deutsch-garden:exercises:v1";
type StorageLike = Pick<Storage, "getItem" | "setItem">;
function record(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
const strings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");
export function validQuestion(v: unknown): v is Question {
  if (
    !record(v) ||
    typeof v.id !== "string" ||
    ![
      "choice",
      "blank",
      "matching",
      "sentence",
      "tr-de",
      "de-tr",
      "listening",
    ].includes(String(v.type)) ||
    !strings(v.wordIds) ||
    !v.wordIds.length ||
    typeof v.prompt !== "string" ||
    typeof v.explanation !== "string" ||
    !strings(v.options) ||
    !strings(v.accepted) ||
    !v.accepted.length
  )
    return false;
  if (new Set(v.options).size !== v.options.length) return false;
  if (v.type === "sentence" && (!strings(v.tiles) || !v.tiles.length))
    return false;
  if (
    v.type === "matching" &&
    (!Array.isArray(v.pairs) ||
      v.pairs.length < 2 ||
      !v.pairs.every(
        (p) =>
          record(p) &&
          typeof p.id === "string" &&
          typeof p.de === "string" &&
          typeof p.tr === "string",
      ))
  )
    return false;
  if (v.type === "listening" && typeof v.audio !== "string") return false;
  return true;
}
export function validState(v: unknown): v is ExerciseState {
  if (
    !record(v) ||
    v.version !== 1 ||
    !record(v.sessions) ||
    !record(v.daily) ||
    !record(v.xp) ||
    !record(v.mistakes) ||
    !Array.isArray(v.claims) ||
    (v.active !== null && typeof v.active !== "string")
  )
    return false;
  for (const [key, item] of Object.entries(v.sessions)) {
    if (
      !record(item) ||
      item.id !== key ||
      !/^\d{4}-\d{2}-\d{2}$/.test(String(item.date)) ||
      !LEVELS.includes(item.level as never) ||
      ![
        "choice",
        "blank",
        "matching",
        "sentence",
        "tr-de",
        "de-tr",
        "listening",
        "daily",
      ].includes(String(item.mode)) ||
      !Array.isArray(item.questions) ||
      !item.questions.length ||
      !item.questions.every(validQuestion) ||
      new Set(item.questions.map((q) => q.id)).size !== item.questions.length ||
      !record(item.answers) ||
      !Number.isInteger(item.index) ||
      Number(item.index) < 0 ||
      Number(item.index) >= item.questions.length ||
      typeof item.startedAt !== "number" ||
      (item.completedAt !== null && typeof item.completedAt !== "number") ||
      typeof item.rewardKey !== "string" ||
      typeof item.practice !== "boolean"
    )
      return false;
    const s = item as unknown as Session;
    if (
      s.attempts !== undefined &&
      (!Array.isArray(s.attempts) ||
        s.attempts.some(
          (a) =>
            !record(a) ||
            typeof a.questionId !== "string" ||
            typeof a.wordId !== "string" ||
            typeof a.value !== "string" ||
            typeof a.correct !== "boolean" ||
            typeof a.at !== "number",
        ))
    )
      return false;
    for (const [id, a] of Object.entries(s.answers)) {
      const q = s.questions.find((q) => q.id === id);
      if (
        !q ||
        !record(a) ||
        typeof a.value !== "string" ||
        typeof a.correct !== "boolean" ||
        typeof a.at !== "number" ||
        ![0, 5].includes(a.xp) ||
        (a.skipped !== undefined && typeof a.skipped !== "boolean") ||
        a.correct !== (!a.skipped && isCorrect(q, a.value))
      )
        return false;
    }
    if (
      s.completedAt !== null &&
      Object.keys(s.answers).length !== s.questions.length
    )
      return false;
  }
  if (v.active !== null && !v.sessions[v.active]) return false;
  if (v.gamification !== undefined && !validGame(v.gamification)) return false;
  const sessions = v.sessions;
  if (
    Object.values(v.daily).some((id) => typeof id !== "string" || !sessions[id])
  )
    return false;
  if (
    Object.entries(v.xp).some(
      ([id, x]) => typeof x !== "number" || !validXpReceipt(id, x),
    )
  )
    return false;
  if (
    v.claims.some(
      (c) =>
        !record(c) ||
        typeof c.id !== "string" ||
        ![0, 10].includes(Number(c.coins)) ||
        typeof c.seed !== "boolean" ||
        typeof c.delivered !== "boolean",
    )
  )
    return false;
  if (
    Object.values(v.mistakes).some(
      (m) =>
        !record(m) ||
        typeof m.wordId !== "string" ||
        !Number.isInteger(m.wrong) ||
        Number(m.wrong) < 0 ||
        !Number.isInteger(m.right) ||
        Number(m.right) < 0 ||
        typeof m.lastAt !== "number",
    )
  )
    return false;
  return true;
}
export function createExercisePersistence(getStorage: () => StorageLike) {
  return {
    load(): { state: ExerciseState; readonly: boolean; notice: string } {
      try {
        const storage = getStorage(),
          raw = storage.getItem(EXERCISE_KEY);
        if (!raw)
          return { state: initialExercises(), readonly: false, notice: "" };
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {}
        if (record(parsed) && parsed.version !== 1)
          return {
            state: initialExercises(),
            readonly: true,
            notice:
              "Bu alıştırma kaydı daha yeni bir sürüme ait. Kaydı korumak için değişiklik kapalı.",
          };
        if (validState(parsed))
          return { state: parsed, readonly: false, notice: "" };
        if (!storage.getItem(EXERCISE_KEY + ":corrupt"))
          storage.setItem(EXERCISE_KEY + ":corrupt", raw);
        const backup = storage.getItem(EXERCISE_KEY + ":backup");
        let prior: unknown;
        try {
          prior = backup ? JSON.parse(backup) : null;
        } catch {}
        return {
          state: validState(prior) ? prior : initialExercises(),
          readonly: false,
          notice:
            "Bozuk alıştırma kaydı ayrı korundu; geçerli yedek varsa geri yüklendi.",
        };
      } catch {
        return {
          state: initialExercises(),
          readonly: true,
          notice:
            "Tarayıcı kaydı kullanılamıyor. İlerlemeni korumak için alıştırmalar başlatılamıyor.",
        };
      }
    },
    save(state: ExerciseState) {
      if (!validState(state)) throw new Error("Geçersiz alıştırma kaydı.");
      const storage = getStorage(),
        raw = storage.getItem(EXERCISE_KEY);
      if (raw) {
        let prior: unknown;
        try {
          prior = JSON.parse(raw);
        } catch {}
        if (record(prior) && prior.version !== 1)
          throw new Error("Yeni sürüm korunuyor.");
        if (validState(prior)) storage.setItem(EXERCISE_KEY + ":backup", raw);
      }
      storage.setItem(EXERCISE_KEY, JSON.stringify(state));
    },
  };
}
