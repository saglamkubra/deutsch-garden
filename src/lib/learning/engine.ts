import {
  LEVELS,
  type LearningState,
  type Level,
  type VocabularyRecord,
  type Assignment,
  type Answer,
} from "./types.ts";
import { curriculum } from "./curriculum.ts";
export function localDate(now: Date = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function addDays(date: string, days: number) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}
export function initialLearning(): LearningState {
  return {
    version: 1,
    revision: 0,
    level: "A1",
    goal: 10,
    progress: {},
    assignments: {},
    unitAnswers: {},
    milestones: [],
    outbox: [],
  };
}
function hash(s: string) {
  let h = 2166136261;
  for (const char of s) {
    h ^= char.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
export const assignmentKey = (date: string, level: Level) => date + ":" + level;
export function ensureDaily(
  state: LearningState,
  records: readonly VocabularyRecord[],
  date: string,
): LearningState {
  const key = assignmentKey(date, state.level);
  if (state.assignments[key]) return state;
  const pool = records.filter((v) => v.levels.includes(state.level));
  const newIds = pool
    .filter((v) => !state.progress[v.id])
    .sort(
      (a, b) =>
        hash(date + state.level + a.id) - hash(date + state.level + b.id) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, state.goal)
    .map((v) => v.id);
  const reviewIds = pool
    .filter((v) => state.progress[v.id] && state.progress[v.id].dueOn <= date)
    .sort(
      (a, b) =>
        state.progress[a.id].dueOn.localeCompare(state.progress[b.id].dueOn) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, 20)
    .map((v) => v.id);
  const progress = { ...state.progress };
  for (const id of newIds)
    progress[id] = {
      introducedOn: date,
      dueOn: addDays(date, 1),
      known: false,
      streak: 0,
      lastAnsweredOn: null,
      responses: 0,
    };
  const assignment: Assignment = {
    id: key,
    date,
    level: state.level,
    goal: state.goal,
    newIds,
    reviewIds,
    answers: {},
  };
  return {
    ...state,
    revision: state.revision + 1,
    progress,
    assignments: { ...state.assignments, [key]: assignment },
  };
}
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];
function updateProgress(
  state: LearningState,
  id: string,
  answer: Answer,
  date: string,
) {
  const old = state.progress[id];
  if (old?.lastAnsweredOn === date) return state.progress;
  const streak = answer === "known" ? (old?.streak ?? 0) + 1 : 0;
  const days =
    answer === "known"
      ? REVIEW_INTERVALS[Math.min(streak - 1, REVIEW_INTERVALS.length - 1)]
      : 1;
  return {
    ...state.progress,
    [id]: {
      introducedOn: old?.introducedOn ?? date,
      dueOn: addDays(date, days),
      known: answer === "known",
      streak,
      lastAnsweredOn: date,
      responses: (old?.responses ?? 0) + 1,
    },
  };
}
function milestones(
  state: LearningState,
  records: readonly VocabularyRecord[],
) {
  const completed = curriculum
    .filter((u) => {
      const words = records.filter((v) => v.unit_ids.includes(u.id));
      return (
        words.length > 0 &&
        words.every((v) => (state.progress[v.id]?.responses ?? 0) > 0)
      );
    })
    .map((u) => u.id + "-words");
  return {
    ...state,
    milestones: [...new Set([...state.milestones, ...completed])],
  };
}
export function answerDaily(
  state: LearningState,
  key: string,
  id: string,
  answer: Answer,
  date: string,
  records: readonly VocabularyRecord[],
): LearningState {
  const current = state.assignments[key];
  if (
    !current ||
    current.date !== date ||
    (!current.newIds.includes(id) && !current.reviewIds.includes(id)) ||
    current.answers[id] ||
    !records.some((v) => v.id === id)
  )
    return state;
  const assignment = {
    ...current,
    answers: { ...current.answers, [id]: answer },
  };
  let next: LearningState = {
    ...state,
    revision: state.revision + 1,
    progress: updateProgress(state, id, answer, date),
    assignments: { ...state.assignments, [key]: assignment },
  };
  const known = assignment.newIds.filter(
    (wordId) => assignment.answers[wordId] === "known",
  ).length;
  const rewards = [...state.outbox];
  function queue(suffix: string, kind: "seed" | "coins", amount: number) {
    const rewardId = "daily-vocab:" + assignment.id + ":" + suffix;
    if (!rewards.some((r) => r.id === rewardId))
      rewards.push({ id: rewardId, kind, amount, delivered: false });
  }
  if (known >= 5) queue("five", "seed", 1);
  if (known >= 10) queue("ten", "seed", 1);
  if (
    assignment.newIds.length > 0 &&
    assignment.newIds.every((wordId) => assignment.answers[wordId])
  )
    queue("complete", "coins", 5);
  next = { ...next, outbox: rewards };
  return milestones(next, records);
}
export function answerUnit(
  state: LearningState,
  unitId: string,
  id: string,
  answer: Answer,
  date: string,
  records: readonly VocabularyRecord[],
) {
  const unit = curriculum.find((u) => u.id === unitId);
  if (
    !unit ||
    !unitAvailable(state, unitId) ||
    !records.some((v) => v.id === id && v.unit_ids.includes(unitId))
  )
    return state;
  const session = unitId + ":" + date;
  const answers = state.unitAnswers[session] ?? {};
  if (answers[id]) return state;
  return milestones(
    {
      ...state,
      revision: state.revision + 1,
      progress: updateProgress(state, id, answer, date),
      unitAnswers: {
        ...state.unitAnswers,
        [session]: { ...answers, [id]: answer },
      },
    },
    records,
  );
}
export function unitAvailable(state: LearningState, unitId: string) {
  const unit = curriculum.find((u) => u.id === unitId);
  if (!unit || LEVELS.indexOf(unit.level) > LEVELS.indexOf(state.level))
    return false;
  return (
    unit.order === 1 ||
    state.milestones.includes(
      `${unit.level.toLowerCase()}-${String(unit.order - 1).padStart(2, "0")}-words`,
    )
  );
}
export function placeAt(state: LearningState, level: Level) {
  if (!LEVELS.includes(level) || state.level === level) return state;
  return { ...state, revision: state.revision + 1, level };
}
export function changeGoal(state: LearningState, goal: number) {
  if (![5, 10, 15, 20].includes(goal) || state.goal === goal) return state;
  return {
    ...state,
    revision: state.revision + 1,
    goal: goal as LearningState["goal"],
  };
}

/** Explicit review requests preserve existing response counts, streaks, and daily assignments. */
export function enqueueReview(
  state: LearningState,
  id: string,
  date: string,
  records: readonly VocabularyRecord[],
): LearningState {
  if (!records.some((w) => w.id === id)) return state;
  const old = state.progress[id],
    dueOn = old?.lastAnsweredOn === date ? addDays(date, 1) : date;
  if (old && old.dueOn <= dueOn) return state;
  return {
    ...state,
    revision: state.revision + 1,
    progress: {
      ...state.progress,
      [id]: old
        ? { ...old, dueOn }
        : {
            introducedOn: date,
            dueOn,
            known: false,
            streak: 0,
            lastAnsweredOn: null,
            responses: 0,
          },
    },
  };
}
export function answerStandalone(
  state: LearningState,
  id: string,
  answer: Answer,
  date: string,
  records: readonly VocabularyRecord[],
): LearningState {
  if (
    !records.some((w) => w.id === id) ||
    state.progress[id]?.lastAnsweredOn === date
  )
    return state;
  return {
    ...state,
    revision: state.revision + 1,
    progress: updateProgress(state, id, answer, date),
  };
}

/** Preserve word/SRS history when a full mini-course unlocks its existing path node. */
export function recordLessonCompletion(
  state: LearningState,
  lessonId: string,
): LearningState {
  if (
    !curriculum.some((u) =>
      u.lessons.some((l) => l.id === lessonId && l.kind === "vocabulary"),
    ) ||
    state.milestones.includes(lessonId)
  )
    return state;
  return {
    ...state,
    revision: state.revision + 1,
    milestones: [...state.milestones, lessonId],
  };
}
