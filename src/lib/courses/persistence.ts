import type { CourseState, PracticeAnswer, CourseQuestion } from "./types.ts";
import { initialCourses } from "./types.ts";
import { courseById } from "./content.ts";
import {
  canComplete,
  teachingDone,
  examplesDone,
  guidedDone,
} from "./engine.ts";
import { isCorrect } from "../exercises/generate.ts";
import vocabulary from "../../data/vocabulary.json" with { type: "json" };
export const COURSE_KEY = "deutsch-garden:mini-courses:v1";
type StorageLike = Pick<Storage, "getItem" | "setItem">;
const obj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const time = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
const strings = (v: unknown): v is string[] =>
  Array.isArray(v) &&
  v.every((x) => typeof x === "string") &&
  new Set(v).size === v.length;
function validAnswer(a: unknown, q: CourseQuestion): a is PracticeAnswer {
  return (
    obj(a) &&
    typeof a.value === "string" &&
    a.value.length <= 600 &&
    !!a.value.trim() &&
    time(a.at) &&
    typeof a.correct === "boolean" &&
    a.correct === isCorrect(q, a.value) &&
    (!q.options.length || q.options.includes(a.value))
  );
}
export function validCourses(v: unknown): v is CourseState {
  try {
    if (
      !obj(v) ||
      v.version !== 1 ||
      !obj(v.progress) ||
      !Array.isArray(v.claims) ||
      !Array.isArray(v.reviewQueue)
    )
      return false;
    const s = v as unknown as CourseState;
    for (const [id, p] of Object.entries(s.progress)) {
      const c = courseById(id);
      if (
        !c ||
        !obj(p) ||
        !time(p.startedAt) ||
        !time(p.updatedAt) ||
        p.updatedAt < p.startedAt ||
        !strings(p.read) ||
        !strings(p.examples) ||
        !obj(p.guided) ||
        !obj(p.independent) ||
        !obj(p.reviews) ||
        typeof p.summary !== "boolean" ||
        (p.completedAt !== null && !time(p.completedAt)) ||
        !Number.isInteger(p.guidedIndex) ||
        !Number.isInteger(p.independentIndex) ||
        p.guidedIndex < 0 ||
        p.guidedIndex >= c.guided.length ||
        p.independentIndex < 0 ||
        p.independentIndex >= c.independent.length
      )
        return false;
      if (
        p.read.some((x, i) => x !== c.steps[i]?.id) ||
        p.examples.some((x, i) => x !== c.examples[i]?.id)
      )
        return false;
      if (
        (p.examples.length && !teachingDone(c, p)) ||
        ((Object.keys(p.guided).length || Object.keys(p.independent).length) &&
          (!teachingDone(c, p) || !examplesDone(c, p))) ||
        (Object.keys(p.independent).length && !guidedDone(c, p))
      )
        return false;
      for (const [qid, attempts] of Object.entries(p.guided)) {
        const q = c.guided.find((q) => q.id === qid);
        if (
          !q ||
          !Array.isArray(attempts) ||
          !attempts.length ||
          attempts.some((a) => !validAnswer(a, q)) ||
          attempts.slice(0, -1).some((a) => a.correct)
        )
          return false;
      }
      for (const [qid, a] of Object.entries(p.independent)) {
        const q = c.independent.find((q) => q.id === qid);
        if (!q || !validAnswer(a, q)) return false;
      }
      for (const [qid, attempts] of Object.entries(p.reviews)) {
        const q = c.independent.find((q) => q.id === qid);
        if (
          !q ||
          !p.independent[qid] ||
          p.independent[qid].correct ||
          !Array.isArray(attempts) ||
          !attempts.length ||
          attempts.some((a) => !validAnswer(a, q)) ||
          attempts.slice(0, -1).some((a) => a.correct)
        )
          return false;
      }
      if (
        c.guided
          .slice(0, p.guidedIndex)
          .some((q) => !p.guided[q.id]?.at(-1)?.correct) ||
        c.guided.slice(p.guidedIndex + 1).some((q) => p.guided[q.id]) ||
        c.independent
          .slice(0, p.independentIndex)
          .some((q) => !p.independent[q.id]) ||
        c.independent
          .slice(p.independentIndex + 1)
          .some((q) => p.independent[q.id])
      )
        return false;
      if (
        (p.completedAt !== null && !canComplete(c, p)) ||
        (p.summary && !canComplete(c, p))
      )
        return false;
    }
    if (
      new Set(s.claims.map((c) => c.id)).size !== s.claims.length ||
      s.claims.some(
        (c) =>
          !obj(c) ||
          typeof c.lessonId !== "string" ||
          c.id !== "course:lesson:" + c.lessonId ||
          typeof c.delivered !== "boolean" ||
          s.progress[c.lessonId]?.completedAt == null,
      )
    )
      return false;
    if (
      new Set(s.reviewQueue.map((r) => r.id)).size !== s.reviewQueue.length ||
      s.reviewQueue.some(
        (r) =>
          !obj(r) ||
          typeof r.id !== "string" ||
          typeof r.wordId !== "string" ||
          !vocabulary.some((w) => w.id === r.wordId) ||
          typeof r.delivered !== "boolean" ||
          !Object.entries(s.progress).some(
            ([id, p]) =>
              r.id === "course:review:" + id + ":" + r.wordId &&
              [...courseById(id)!.guided, ...courseById(id)!.independent].some(
                (q) =>
                  q.reviewWordIds.includes(r.wordId) &&
                  (p.guided[q.id]?.some((a) => !a.correct) ||
                    p.independent[q.id]?.correct === false),
              ),
          ),
      )
    )
      return false;
    return true;
  } catch {
    return false;
  }
}
export function createCoursePersistence(get: () => StorageLike) {
  return {
    load(): { state: CourseState; readonly: boolean; notice: string } {
      try {
        const storage = get(),
          raw = storage.getItem(COURSE_KEY);
        if (!raw)
          return { state: initialCourses(), readonly: false, notice: "" };
        let data: unknown;
        try {
          data = JSON.parse(raw);
        } catch {}
        if (obj(data) && data.version !== 1)
          return {
            state: initialCourses(),
            readonly: true,
            notice:
              "Bu mini-kurs kaydı farklı bir sürüme ait. Mevcut kaydını korumak için değişiklik kapalı.",
          };
        if (validCourses(data))
          return { state: data, readonly: false, notice: "" };
        if (!storage.getItem(COURSE_KEY + ":corrupt"))
          storage.setItem(COURSE_KEY + ":corrupt", raw);
        let backup: unknown;
        try {
          backup = JSON.parse(
            storage.getItem(COURSE_KEY + ":backup") ?? "null",
          );
        } catch {}
        return {
          state: validCourses(backup) ? backup : initialCourses(),
          readonly: false,
          notice:
            "Bozuk mini-kurs kaydı ayrı korundu; geçerli yedek varsa yüklendi.",
        };
      } catch {
        return {
          state: initialCourses(),
          readonly: true,
          notice:
            "Tarayıcı kaydı kullanılamıyor. İçeriği okuyabilirsin; yanıtlar ve ödüller kaydedilemez.",
        };
      }
    },
    save(state: CourseState) {
      if (!validCourses(state)) throw Error("Geçersiz mini-kurs kaydı");
      const storage = get(),
        raw = storage.getItem(COURSE_KEY);
      if (raw) {
        let old: unknown;
        try {
          old = JSON.parse(raw);
        } catch {}
        if (obj(old) && old.version !== 1)
          throw Error("Kayıt sürümü korunuyor");
        if (validCourses(old)) storage.setItem(COURSE_KEY + ":backup", raw);
      }
      storage.setItem(COURSE_KEY, JSON.stringify(state));
    },
  };
}
