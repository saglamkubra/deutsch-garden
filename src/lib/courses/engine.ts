import { initialCourses } from "./types.ts";
import type { CourseState, CourseProgress, MiniCourse } from "./types.ts";
import { courseById } from "./content.ts";
import { isCorrect } from "../exercises/generate.ts";
import { REWARDS } from "../exercises/engine.ts";
export { initialCourses };
export const teachingDone = (c: MiniCourse, p: CourseProgress) =>
  c.steps.every((s) => p.read.includes(s.id));
// Shared by the lesson UI and writer, so an unavailable action has an actionable reason.
export function exampleGate(
  c: MiniCourse,
  p: CourseProgress | undefined,
  itemId: string,
):
  | { kind: "loading" | "unknown" | "ready" }
  | { kind: "teaching" | "example"; index: number } {
  if (!p) return { kind: "loading" };
  const at = c.examples.findIndex((e) => e.id === itemId);
  if (at < 0) return { kind: "unknown" };
  const teaching = c.steps.findIndex((step) => !p.read.includes(step.id));
  if (teaching >= 0) return { kind: "teaching", index: teaching };
  const earlier = c.examples.findIndex(
    (e, index) => index < at && !p.examples.includes(e.id),
  );
  return earlier >= 0 ? { kind: "example", index: earlier } : { kind: "ready" };
}
export const examplesDone = (c: MiniCourse, p: CourseProgress) =>
  c.examples.every((e) => p.examples.includes(e.id));
export const guidedDone = (c: MiniCourse, p: CourseProgress) =>
  c.guided.every((q) => p.guided[q.id]?.at(-1)?.correct);
export const unresolved = (c: MiniCourse, p: CourseProgress) =>
  c.independent.filter(
    (q) =>
      p.independent[q.id] &&
      !p.independent[q.id].correct &&
      !p.reviews[q.id]?.at(-1)?.correct,
  );
export const independentDone = (c: MiniCourse, p: CourseProgress) =>
  c.independent.every((q) => p.independent[q.id]) &&
  unresolved(c, p).length === 0;
export const canComplete = (c: MiniCourse, p: CourseProgress) =>
  teachingDone(c, p) &&
  examplesDone(c, p) &&
  guidedDone(c, p) &&
  independentDone(c, p) &&
  p.summary;
export const progressPercent = (c: MiniCourse, p?: CourseProgress) =>
  !p
    ? 0
    : Math.round(
        ((p.read.length +
          p.examples.length +
          c.guided.filter((q) => p.guided[q.id]?.at(-1)?.correct).length +
          c.independent.filter(
            (q) =>
              p.independent[q.id]?.correct || p.reviews[q.id]?.at(-1)?.correct,
          ).length +
          (p.summary ? 1 : 0)) /
          (c.steps.length +
            c.examples.length +
            c.guided.length +
            c.independent.length +
            1)) *
          100,
      );
export const initialCourseProgress = (now: number): CourseProgress => ({
  startedAt: now,
  updatedAt: now,
  read: [],
  examples: [],
  guided: {},
  independent: {},
  reviews: {},
  summary: false,
  completedAt: null,
  guidedIndex: 0,
  independentIndex: 0,
});
export function openCourse(
  s: CourseState,
  id: string,
  now: number,
): CourseState {
  return !courseById(id) || s.progress[id]
    ? s
    : { ...s, progress: { ...s.progress, [id]: initialCourseProgress(now) } };
}
function change(
  s: CourseState,
  id: string,
  p: CourseProgress,
  now: number,
): CourseState {
  const c = courseById(id);
  if (!c) return s;
  let next: CourseState = {
    ...s,
    progress: { ...s.progress, [id]: { ...p, updatedAt: now } },
  };
  if (canComplete(c, p) && p.completedAt === null) {
    next = {
      ...next,
      progress: {
        ...next.progress,
        [id]: { ...next.progress[id], completedAt: now },
      },
    };
    const receipt = "course:lesson:" + id;
    if (!next.claims.some((x) => x.id === receipt))
      next = {
        ...next,
        claims: [
          ...next.claims,
          { id: receipt, lessonId: id, delivered: false },
        ],
      };
  }
  return next;
}
export function markCourseReading(
  s: CourseState,
  id: string,
  section: "read" | "examples",
  itemId: string,
  now: number,
): CourseState {
  const c = courseById(id),
    p = s.progress[id];
  if (!c || !p || p[section].includes(itemId)) return s;
  const items = section === "read" ? c.steps : c.examples,
    at = items.findIndex((x) => x.id === itemId);
  if (
    at < 0 ||
    (at > 0 && !p[section].includes(items[at - 1].id)) ||
    (section === "examples" && exampleGate(c, p, itemId).kind !== "ready")
  )
    return s;
  return change(s, id, { ...p, [section]: [...p[section], itemId] }, now);
}
export function submitCourseAnswer(
  s: CourseState,
  id: string,
  mode: "guided" | "independent" | "review",
  qid: string,
  value: string,
  now: number,
): CourseState {
  const c = courseById(id),
    p = s.progress[id];
  if (!c || !p || !value.trim() || value.length > 600) return s;
  const list = mode === "guided" ? c.guided : c.independent,
    q = list.find((q) => q.id === qid);
  if (!q) return s;
  if (!teachingDone(c, p) || !examplesDone(c, p)) return s;
  if (mode !== "guided" && !guidedDone(c, p)) return s;
  if (
    mode === "guided" &&
    (list[p.guidedIndex].id !== qid || p.guided[qid]?.at(-1)?.correct)
  )
    return s;
  if (
    mode === "independent" &&
    (list[p.independentIndex].id !== qid || p.independent[qid])
  )
    return s;
  if (
    mode === "review" &&
    (!p.independent[qid] ||
      p.independent[qid].correct ||
      p.reviews[qid]?.at(-1)?.correct)
  )
    return s;
  if (q.options.length && !q.options.includes(value)) return s;
  const answer = { value, correct: isCorrect(q, value), at: now };
  let next = change(
    s,
    id,
    {
      ...p,
      [mode === "review" ? "reviews" : mode]:
        mode === "independent"
          ? { ...p.independent, [qid]: answer }
          : {
              ...(mode === "guided" ? p.guided : p.reviews),
              [qid]: [
                ...(mode === "guided"
                  ? (p.guided[qid] ?? [])
                  : (p.reviews[qid] ?? [])),
                answer,
              ],
            },
    },
    now,
  );
  if (!answer.correct) {
    for (const wordId of q.reviewWordIds) {
      const rid = "course:review:" + id + ":" + wordId;
      if (!next.reviewQueue.some((x) => x.id === rid))
        next = {
          ...next,
          reviewQueue: [
            ...next.reviewQueue,
            { id: rid, wordId, delivered: false },
          ],
        };
    }
  }
  return next;
}
export function nextCourseQuestion(
  s: CourseState,
  id: string,
  mode: "guided" | "independent",
  now: number,
): CourseState {
  const c = courseById(id),
    p = s.progress[id];
  if (!c || !p) return s;
  const key = mode === "guided" ? "guidedIndex" : "independentIndex",
    index = p[key],
    q = c[mode][index];
  if (
    index >= c[mode].length - 1 ||
    (mode === "guided"
      ? !p.guided[q.id]?.at(-1)?.correct
      : !p.independent[q.id])
  )
    return s;
  return change(s, id, { ...p, [key]: index + 1 }, now);
}
export function confirmCourseSummary(s: CourseState, id: string, now: number) {
  const c = courseById(id),
    p = s.progress[id];
  if (
    !c ||
    !p ||
    p.summary ||
    !teachingDone(c, p) ||
    !examplesDone(c, p) ||
    !guidedDone(c, p) ||
    !independentDone(c, p)
  )
    return s;
  return change(s, id, { ...p, summary: true }, now);
}
export const COURSE_REWARDS = REWARDS.courses;
