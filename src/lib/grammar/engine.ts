import { topicById, topics } from "./content.ts";
import { isCorrect, shuffle } from "../exercises/generate.ts";
import { REWARDS } from "../exercises/engine.ts";
import type { GrammarState, QuizAttempt } from "./types.ts";
import { searchFold } from "../learning/import.ts";
export function openTopic(
  s: GrammarState,
  id: string,
  now: number,
): GrammarState {
  if (!topicById(id)?.lesson) return s;
  return {
    ...s,
    lastTopic: id,
    progress: {
      ...s.progress,
      [id]: s.progress[id] ?? {
        startedAt: now,
        read: false,
        practicePassed: false,
        completedAt: null,
      },
    },
  };
}
export function bookmark(s: GrammarState, id: string): GrammarState {
  if (!topicById(id)) return s;
  return {
    ...s,
    bookmarks: s.bookmarks.includes(id)
      ? s.bookmarks.filter((x) => x !== id)
      : [...s.bookmarks, id],
  };
}
export function reconcile(
  s: GrammarState,
  id: string,
  now: number,
): GrammarState {
  const p = s.progress[id];
  if (!p || p.completedAt !== null || !p.read || !p.practicePassed) return s;
  const passed = Object.values(s.attempts).some(
    (a) => a.topicId === id && a.completedAt !== null && score(a) >= 80,
  );
  if (!passed) return s;
  const key = "grammar:topic:" + id;
  const claims = s.claims.some((c) => c.id === key)
    ? [...s.claims]
    : [
        ...s.claims,
        {
          id: key,
          xp: REWARDS.grammar.topicXp,
          coins: REWARDS.grammar.topicCoins,
          seed: false,
          delivered: false,
        },
      ];
  const progress = { ...s.progress, [id]: { ...p, completedAt: now } };
  const completed = Object.values(progress).filter(
    (p) => p.completedAt !== null,
  ).length;
  const milestone = Math.floor(completed / REWARDS.grammar.seedInterval);
  const seedKey = "grammar:milestone:" + milestone;
  if (
    completed % REWARDS.grammar.seedInterval === 0 &&
    milestone > 0 &&
    !claims.some((c) => c.id === seedKey)
  )
    claims.push({ id: seedKey, xp: 0, coins: 0, seed: true, delivered: false });
  return {
    ...s,
    progress,
    claims,
    xp: { ...s.xp, [key]: REWARDS.grammar.topicXp },
  };
}
export function markRead(s: GrammarState, id: string, now: number) {
  if (!s.progress[id]) return s;
  return reconcile(
    {
      ...s,
      progress: { ...s.progress, [id]: { ...s.progress[id], read: true } },
    },
    id,
    now,
  );
}
export function practice(
  s: GrammarState,
  id: string,
  value: string,
  now: number,
) {
  const q = topicById(id)?.lesson?.practice;
  if (!q || !s.progress[id] || !isCorrect(q, value)) return s;
  return reconcile(
    {
      ...s,
      progress: {
        ...s.progress,
        [id]: { ...s.progress[id], practicePassed: true },
      },
    },
    id,
    now,
  );
}
export function beginQuiz(
  s: GrammarState,
  id: string,
  attemptId: string,
  now: number,
): GrammarState {
  const topic = topicById(id);
  if (!topic?.lesson || !s.progress[id]) return s;
  const old = s.attempts[s.activeAttempt[id]];
  if (old && old.completedAt === null) return s;
  const questions = topic.lesson.quiz.map((q) => ({
    ...q,
    options: shuffle(q.options, attemptId + q.id),
    ...(q.tiles ? { tiles: shuffle(q.tiles, attemptId + q.id) } : {}),
  }));
  const attempt: QuizAttempt = {
    id: attemptId,
    topicId: id,
    startedAt: now,
    completedAt: null,
    index: 0,
    questions,
    answers: {},
  };
  return {
    ...s,
    attempts: { ...s.attempts, [attemptId]: attempt },
    activeAttempt: { ...s.activeAttempt, [id]: attemptId },
  };
}
export function answerQuiz(
  s: GrammarState,
  id: string,
  value: string,
  now: number,
): GrammarState {
  const a = s.attempts[id],
    q = a?.questions[a.index];
  if (!a || a.completedAt !== null || !q || a.answers[q.id] || !value.trim())
    return s;
  const answers = {
    ...a.answers,
    [q.id]: { value, correct: isCorrect(q, value), at: now, xp: 0 },
  };
  const done = Object.keys(answers).length === a.questions.length;
  return reconcile(
    {
      ...s,
      attempts: {
        ...s.attempts,
        [id]: { ...a, answers, completedAt: done ? now : null },
      },
    },
    a.topicId,
    now,
  );
}
export function advanceQuiz(s: GrammarState, id: string): GrammarState {
  const a = s.attempts[id];
  if (
    !a ||
    a.completedAt !== null ||
    !a.answers[a.questions[a.index].id] ||
    a.index >= a.questions.length - 1
  )
    return s;
  return {
    ...s,
    attempts: { ...s.attempts, [id]: { ...a, index: a.index + 1 } },
  };
}
export const score = (a: QuizAttempt) =>
  Math.round(
    (Object.values(a.answers).filter((v) => v.correct).length /
      a.questions.length) *
      100,
  );
export const needsReview = (s: GrammarState, id: string) => {
  const latest = Object.values(s.attempts)
    .filter((a) => a.topicId === id && a.completedAt !== null)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))[0];
  return !!latest && score(latest) < 80;
};
export function filterTopics(
  s: GrammarState,
  q: {
    search?: string;
    level?: string;
    category?: string;
    status?: string;
    bookmarked?: boolean;
  },
) {
  const term = searchFold(q.search ?? "");
  return topics.filter(
    (t) =>
      (!q.level || t.level === q.level) &&
      (!q.category || t.category === q.category) &&
      (!q.bookmarked || s.bookmarks.includes(t.id)) &&
      (!term ||
        searchFold(t.title + " " + t.german + " " + t.summary).includes(
          term,
        )) &&
      (!q.status ||
        (q.status === "completed"
          ? s.progress[t.id]?.completedAt != null
          : q.status === "started"
            ? !!s.progress[t.id] && s.progress[t.id].completedAt === null
            : q.status === "review"
              ? needsReview(s, t.id)
              : q.status === "ready"
                ? !!t.lesson
                : !t.lesson)),
  );
}
