import { isCorrect } from "./generate.ts";
import type { ExerciseState, Session, Question, Mode } from "./types.ts";
import type { Level } from "../learning/types.ts";
import { REWARDS, XP_LIMITS } from "../gamification/rewards.ts";
export { REWARDS } from "../gamification/rewards.ts";
export function startSession(
  state: ExerciseState,
  questions: Question[],
  mode: Mode,
  date: string,
  level: Level,
  now: number,
  id: string,
  practice = false,
): ExerciseState {
  const dailyKey = date + ":" + level;
  if (mode === "daily" && !practice && state.daily[dailyKey])
    return { ...state, active: state.daily[dailyKey] };
  if (!questions.length) return state;
  const session: Session = {
    id,
    date,
    level,
    mode,
    questions,
    answers: {},
    index: 0,
    startedAt: now,
    completedAt: null,
    rewardKey: dailyKey,
    practice,
    questionStartedAt: { [questions[0].id]: now },
  };
  return {
    ...state,
    active: id,
    sessions: { ...state.sessions, [id]: session },
    daily:
      mode === "daily" && !practice
        ? { ...state.daily, [dailyKey]: id }
        : state.daily,
  };
}
export function submitAnswer(
  state: ExerciseState,
  sessionId: string,
  value: string,
  now: number,
  skipped = false,
): ExerciseState {
  const s = state.sessions[sessionId];
  if (!s || s.completedAt !== null) return state;
  const q = s.questions[s.index];
  if (!q || s.answers[q.id] || (!value.trim() && !skipped)) return state;
  const correct = !skipped && isCorrect(q, value);
  const key = s.rewardKey + ":" + q.id;
  const todayXp = Object.entries(state.xp)
    .filter(([id]) => id.startsWith(s.date + ":"))
    .reduce((sum, [, value]) => sum + value, 0);
  const xp =
    correct &&
    !skipped &&
    !state.xp[key] &&
    todayXp < XP_LIMITS.exerciseXpPerDay
      ? REWARDS.correctXp
      : 0;
  const answers = {
    ...s.answers,
    [q.id]: { value, correct, at: now, xp, skipped },
  };
  const mistakes = { ...state.mistakes };
  if (!skipped)
    for (const id of q.wordIds) {
      const prior = mistakes[id] ?? {
        wordId: id,
        wrong: 0,
        right: 0,
        lastAt: 0,
      };
      mistakes[id] = {
        ...prior,
        wrong: prior.wrong + Number(!correct),
        right: prior.right + Number(correct),
        lastAt: now,
      };
    }
  const done = Object.keys(answers).length === s.questions.length;
  let claims = state.claims;
  // One completion purse per local day and level across all modes. Perfect daily seed once.
  if (done && Object.values(answers).some((a) => !a.skipped)) {
    const claimId = "exercise:coins:" + s.rewardKey;
    if (!claims.some((c) => c.id === claimId))
      claims = [
        ...claims,
        {
          id: claimId,
          coins: REWARDS.completionCoins,
          seed: false,
          delivered: false,
        },
      ];
    const seedId = "exercise:perfect:" + s.rewardKey;
    if (
      s.mode === "daily" &&
      !s.practice &&
      Object.values(answers).every((a) => a.correct) &&
      !(s.attempts ?? []).some((a) => !a.correct) &&
      !claims.some((c) => c.id === seedId)
    )
      claims = [
        ...claims,
        { id: seedId, coins: 0, seed: true, delivered: false },
      ];
  }
  return {
    ...state,
    xp: xp ? { ...state.xp, [key]: xp } : state.xp,
    mistakes,
    claims,
    sessions: {
      ...state.sessions,
      [s.id]: { ...s, answers, completedAt: done ? now : null },
    },
  };
}
export function advance(
  state: ExerciseState,
  id: string,
  now = Date.now(),
): ExerciseState {
  const s = state.sessions[id];
  if (
    !s ||
    !s.answers[s.questions[s.index]?.id] ||
    s.index >= s.questions.length - 1
  )
    return state;
  return {
    ...state,
    sessions: {
      ...state.sessions,
      [id]: {
        ...s,
        index: s.index + 1,
        questionStartedAt: {
          ...s.questionStartedAt,
          [s.questions[s.index + 1].id]: now,
        },
      },
    },
  };
}
export function sessionStats(s: Session) {
  const values = Object.values(s.answers),
    correct = values.filter((a) => a.correct).length,
    skipped = values.filter((a) => a.skipped).length;
  return {
    correct,
    wrong: values.length - correct - skipped,
    skipped,
    accuracy: values.length ? Math.round((correct / values.length) * 100) : 0,
    xp: values.reduce((n, a) => n + a.xp, 0),
    reviewIds: [
      ...new Set([
        ...(s.attempts ?? []).filter((a) => !a.correct).map((a) => a.wordId),
        ...s.questions
          .filter(
            (q) =>
              s.answers[q.id] &&
              !s.answers[q.id].correct &&
              !s.answers[q.id].skipped,
          )
          .flatMap((q) => q.wordIds),
      ]),
    ],
    reinforcedIds: [
      ...new Set(
        s.questions
          .filter((q) => s.answers[q.id]?.correct)
          .flatMap((q) => q.wordIds),
      ),
    ],
  };
}

export function matchingAttempt(
  state: ExerciseState,
  id: string,
  left: string,
  right: string,
  now: number,
): ExerciseState {
  const s = state.sessions[id],
    q = s?.questions[s.index];
  if (
    !s ||
    s.completedAt !== null ||
    !q ||
    q.type !== "matching" ||
    s.answers[q.id] ||
    !q.pairs?.some((p) => p.id === left) ||
    !q.pairs.some((p) => p.id === right)
  )
    return state;
  if (
    s.attempts?.some(
      (a) => a.questionId === q.id && a.wordId === left && a.correct,
    )
  )
    return state;
  const correct = left === right;
  const attempts = [
    ...(s.attempts ?? []),
    { questionId: q.id, wordId: left, value: right, correct, at: now },
  ];
  const mistakes = { ...state.mistakes };
  if (!correct) {
    const prior = mistakes[left] ?? {
      wordId: left,
      wrong: 0,
      right: 0,
      lastAt: 0,
    };
    mistakes[left] = { ...prior, wrong: prior.wrong + 1, lastAt: now };
  }
  return {
    ...state,
    mistakes,
    sessions: { ...state.sessions, [id]: { ...s, attempts } },
  };
}
