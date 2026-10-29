import { initialStories } from "./types.ts";
import type { StoryState } from "./types.ts";
import { storyById, wordById } from "./content.ts";
import { validPath } from "./graph.ts";
import { questionsFor, storyQuizScore } from "./engine.ts";
import { isCorrect } from "../exercises/generate.ts";
import { validQuestion } from "../exercises/persistence.ts";
import { LEVELS } from "../learning/types.ts";
export const STORY_KEY = "deutsch-garden:stories:v1";
type StorageLike = Pick<Storage, "getItem" | "setItem">;
const obj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const strings = (v: unknown): v is string[] =>
  Array.isArray(v) &&
  v.every((x) => typeof x === "string") &&
  new Set(v).size === v.length;
const time = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
export function validStories(v: unknown): v is StoryState {
  try {
    if (
      !obj(v) ||
      v.version !== 1 ||
      !obj(v.runs) ||
      !obj(v.active) ||
      !obj(v.endings) ||
      !obj(v.daily) ||
      !strings(v.completed) ||
      !strings(v.favorites) ||
      !strings(v.savedWords) ||
      !Array.isArray(v.claims) ||
      (v.current !== null && typeof v.current !== "string")
    )
      return false;
    const s = v as unknown as StoryState;
    if (
      (s.current !== null && !storyById(s.current)) ||
      s.completed.some((id) => !storyById(id)) ||
      s.favorites.some((id) => !storyById(id)) ||
      s.savedWords.some((id) => !wordById(id))
    )
      return false;
    for (const [id, r] of Object.entries(s.runs)) {
      const story = storyById(r.storyId);
      if (
        !story ||
        r.id !== id ||
        !strings(r.path) ||
        !strings(r.choices) ||
        !time(r.startedAt) ||
        !time(r.updatedAt) ||
        r.updatedAt < r.startedAt ||
        !validPath(story, r.path, r.choices)
      )
        return false;
      if (r.quiz !== null) {
        const q = r.quiz,
          canonical = questionsFor(r);
        if (
          !obj(q) ||
          !Array.isArray(q.questions) ||
          !canonical.length ||
          q.questions.length !== canonical.length ||
          !q.questions.every(
            (question, i) =>
              validQuestion(question) &&
              question.id === canonical[i].id &&
              question.type === "choice" &&
              question.accepted.length === 1 &&
              question.options.includes(question.accepted[0]),
          ) ||
          !obj(q.answers) ||
          !Number.isInteger(q.index) ||
          q.index < 0 ||
          q.index >= canonical.length ||
          (q.completedAt !== null && !time(q.completedAt))
        )
          return false;
        for (const [qid, a] of Object.entries(q.answers)) {
          const question = q.questions.find((x) => x.id === qid);
          if (
            !question ||
            !obj(a) ||
            typeof a.value !== "string" ||
            !question.options.includes(a.value) ||
            typeof a.correct !== "boolean" ||
            a.correct !== isCorrect(question, a.value)
          )
            return false;
        }
        if (
          q.completedAt !== null &&
          Object.keys(q.answers).length !== canonical.length
        )
          return false;
        if (
          canonical.slice(0, q.index).some((x) => !q.answers[x.id]) ||
          canonical.slice(q.index + 1).some((x) => q.answers[x.id])
        )
          return false;
      }
    }
    for (const [storyId, id] of Object.entries(s.active))
      if (s.runs[id]?.storyId !== storyId) return false;
    if (s.current && !s.active[s.current]) return false;
    for (const [id, ends] of Object.entries(s.endings))
      if (
        !storyById(id) ||
        !strings(ends) ||
        ends.some(
          (e) =>
            !storyById(id)!.scenes.find((n) => n.id === e)?.ending ||
            !Object.values(s.runs).some(
              (r) => r.storyId === id && r.path.at(-1) === e,
            ),
        )
      )
        return false;
    if (
      s.completed.some((id) => !s.endings[id]?.length) ||
      Object.keys(s.endings).some(
        (id) => s.endings[id].length && !s.completed.includes(id),
      )
    )
      return false;
    for (const [key, d] of Object.entries(s.daily))
      if (
        !obj(d) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(d.date) ||
        !LEVELS.includes(d.level) ||
        key !== d.date + ":" + d.level ||
        (d.storyId !== null && storyById(d.storyId)?.level !== d.level)
      )
        return false;
    if (new Set(s.claims.map((c) => c.id)).size !== s.claims.length)
      return false;
    for (const c of s.claims) {
      if (
        !obj(c) ||
        typeof c.id !== "string" ||
        typeof c.delivered !== "boolean" ||
        typeof c.seed !== "boolean"
      )
        return false;
      const complete = s.completed.find(
        (id) => c.id === "story:complete:" + id,
      );
      const ending = Object.entries(s.endings).some(([id, ends]) =>
        ends.some((e) => c.id === "story:ending:" + id + ":" + e),
      );
      const quiz = Object.values(s.runs).some(
        (r) =>
          c.id === "story:quiz:" + r.storyId &&
          r.quiz?.completedAt != null &&
          storyQuizScore(r) >= 80,
      );
      if (
        complete
          ? c.xp !== 20 || c.coins !== 0 || c.seed
          : ending
            ? c.xp !== 0 || c.coins !== 10 || c.seed
            : quiz
              ? c.xp !== 0 || c.coins !== 0 || !c.seed
              : true
      )
        return false;
    }
    return true;
  } catch {
    return false;
  }
}
export function createStoryPersistence(get: () => StorageLike) {
  return {
    load(): { state: StoryState; readonly: boolean; notice: string } {
      try {
        const storage = get(),
          raw = storage.getItem(STORY_KEY);
        if (!raw)
          return { state: initialStories(), readonly: false, notice: "" };
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {}
        if (obj(parsed) && parsed.version !== 1)
          return {
            state: initialStories(),
            readonly: true,
            notice:
              "Bu hikâye kaydı farklı bir sürüme ait. Kaydını korumak için değişiklik kapalı.",
          };
        if (validStories(parsed))
          return { state: parsed, readonly: false, notice: "" };
        if (!storage.getItem(STORY_KEY + ":corrupt"))
          storage.setItem(STORY_KEY + ":corrupt", raw);
        let backup: unknown;
        try {
          backup = JSON.parse(storage.getItem(STORY_KEY + ":backup") ?? "null");
        } catch {}
        return {
          state: validStories(backup) ? backup : initialStories(),
          readonly: false,
          notice:
            "Bozuk hikâye kaydı ayrı korundu; geçerli yedek varsa geri yüklendi.",
        };
      } catch {
        return {
          state: initialStories(),
          readonly: true,
          notice:
            "Tarayıcı depolaması kullanılamıyor. İlerlemenin kaybolmaması için seçim ve ödül kaydı kapalı.",
        };
      }
    },
    save(state: StoryState) {
      if (!validStories(state)) throw Error("Geçersiz hikâye kaydı");
      const storage = get(),
        raw = storage.getItem(STORY_KEY);
      if (raw) {
        let prior: unknown;
        try {
          prior = JSON.parse(raw);
        } catch {}
        if (obj(prior) && prior.version !== 1) throw Error("Sürüm korunuyor");
        if (validStories(prior)) storage.setItem(STORY_KEY + ":backup", raw);
      }
      storage.setItem(STORY_KEY, JSON.stringify(state));
    },
  };
}
