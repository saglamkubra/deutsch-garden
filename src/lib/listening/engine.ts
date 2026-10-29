import type { ListeningState, ListeningAttempt } from "./types.ts";
import type { Level } from "../learning/types.ts";
import { episodeById, episodes, library } from "./content.ts";
import { hash, isCorrect, shuffle } from "../exercises/generate.ts";
import { REWARDS } from "../exercises/engine.ts";
import { addDays } from "../learning/engine.ts";
import { searchFold } from "../learning/import.ts";
const coverageBins = (id: string) =>
  Math.ceil((episodeById(id)?.audio?.duration ?? 0) * 4);
export function speechBins(id: string) {
  const bins = new Set<number>();
  for (const segment of episodeById(id)?.audio?.segments ?? [])
    for (
      let n = Math.floor(segment.start * 4);
      n < Math.ceil(segment.end * 4);
      n++
    )
      bins.add(n);
  return bins;
}
export function coverage(s: ListeningState, id: string) {
  const valid = speechBins(id);
  return valid.size
    ? Math.min(
        1,
        (s.progress[id]?.heard.filter((n) => valid.has(n)).length ?? 0) /
          valid.size,
      )
    : 0;
}
export const score = (a: ListeningAttempt) =>
  Math.round(
    (Object.values(a.answers).filter((v) => v.correct).length /
      a.questions.length) *
      100,
  );
export function needsReview(s: ListeningState, id: string) {
  const a = Object.values(s.attempts)
    .filter((a) => a.episodeId === id && a.completedAt !== null)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))[0];
  return !!a && score(a) < 80;
}
export function openEpisode(
  s: ListeningState,
  id: string,
  now: number,
): ListeningState {
  if (!episodeById(id)?.audio) return s;
  return {
    ...s,
    progress: {
      ...s.progress,
      [id]: s.progress[id]
        ? { ...s.progress[id], lastAt: now }
        : {
            startedAt: now,
            lastAt: now,
            position: 0,
            heard: [],
            completedAt: null,
          },
    },
  };
}
function reconcile(s: ListeningState, id: string, now: number): ListeningState {
  const p = s.progress[id];
  if (
    !p ||
    p.completedAt !== null ||
    coverage(s, id) < REWARDS.listening.coverage
  )
    return s;
  if (
    !Object.values(s.attempts).some(
      (a) => a.episodeId === id && a.completedAt !== null && score(a) >= 80,
    )
  )
    return s;
  const key = "listening:episode:" + id;
  let claims = [...s.claims];
  if (!claims.some((c) => c.id === key))
    claims.push({
      id: key,
      xp: REWARDS.listening.episodeXp,
      coins: REWARDS.listening.episodeCoins,
      seed: false,
      delivered: false,
    });
  const progress = { ...s.progress, [id]: { ...p, completedAt: now } };
  const completed = Object.values(progress).filter(
    (p) => p.completedAt !== null,
  ).length;
  if (completed % REWARDS.listening.seedInterval === 0) {
    const seedId = "listening:milestone:" + completed;
    if (!claims.some((c) => c.id === seedId))
      claims = [
        ...claims,
        { id: seedId, xp: 0, coins: 0, seed: true, delivered: false },
      ];
  }
  return { ...s, progress, claims };
}
export function savePosition(
  s: ListeningState,
  id: string,
  position: number,
  now: number,
): ListeningState {
  const e = episodeById(id),
    p = s.progress[id];
  if (!p || !e?.audio || !Number.isFinite(position)) return s;
  return {
    ...s,
    progress: {
      ...s.progress,
      [id]: {
        ...p,
        position: Math.min(e.audio.duration, Math.max(0, position)),
        lastAt: now,
      },
    },
  };
}
function mergeHeard(
  s: ListeningState,
  id: string,
  start: number,
  end: number,
  now: number,
) {
  const p = s.progress[id],
    e = episodeById(id);
  if (!p || !e?.audio) return s;
  const bins = new Set(p.heard),
    valid = speechBins(id);
  for (
    let n = Math.floor(start * 4);
    n < Math.ceil(end * 4) && n < coverageBins(id);
    n++
  )
    if (n >= 0 && valid.has(n)) bins.add(n);
  return reconcile(
    {
      ...s,
      progress: {
        ...s.progress,
        [id]: {
          ...p,
          heard: [...bins].sort((a, b) => a - b),
          position: end,
          lastAt: now,
        },
      },
    },
    id,
    now,
  );
}
export function recordPlayback(
  s: ListeningState,
  id: string,
  start: number,
  end: number,
  now: number,
): ListeningState {
  const duration = episodeById(id)?.audio?.duration;
  if (
    !duration ||
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end <= start ||
    end > duration + 0.05 ||
    end - start > 3
  )
    return s;
  return mergeHeard(s, id, start, Math.min(end, duration), now);
}
export function recordSpokenSentence(
  s: ListeningState,
  id: string,
  index: number,
  now: number,
): ListeningState {
  const segment = episodeById(id)?.audio?.segments[index];
  return segment ? mergeHeard(s, id, segment.start, segment.end, now) : s;
}
export function favorite(s: ListeningState, id: string): ListeningState {
  if (!episodeById(id)?.audio) return s;
  return {
    ...s,
    favorites: s.favorites.includes(id)
      ? s.favorites.filter((x) => x !== id)
      : [...s.favorites, id],
  };
}
export function saveWord(
  s: ListeningState,
  id: string,
  validIds: readonly string[],
): ListeningState {
  if (!validIds.includes(id) || s.savedWords.includes(id)) return s;
  return { ...s, savedWords: [...s.savedWords, id] };
}
export function ensureDaily(
  s: ListeningState,
  date: string,
  level: Level,
): ListeningState {
  const key = date + ":" + level;
  if (s.daily[key]) return s;
  let pool = episodes.filter((e) => e.level === level && e.audio);
  const prior = s.daily[addDays(date, -1) + ":" + level]?.episodeId;
  if (pool.length > 1) pool = pool.filter((e) => e.id !== prior);
  const ranked = pool.sort((a, b) => {
    const priority = (id: string) =>
      Number(needsReview(s, id)) * 100 +
      Number(s.progress[id]?.completedAt == null) * 30 +
      Number(!s.progress[id]) * 10;
    return (
      priority(b.id) - priority(a.id) ||
      hash(date + level + a.id) - hash(date + level + b.id)
    );
  });
  return {
    ...s,
    daily: {
      ...s.daily,
      [key]: { date, level, episodeId: ranked[0]?.id ?? null },
    },
  };
}
export function startQuiz(
  s: ListeningState,
  id: string,
  attemptId: string,
  now: number,
): ListeningState {
  const e = episodeById(id);
  if (!e?.audio || !s.progress[id]) return s;
  const old = s.attempts[s.activeAttempt[id]];
  if (old && old.completedAt === null) return s;
  return {
    ...s,
    activeAttempt: { ...s.activeAttempt, [id]: attemptId },
    attempts: {
      ...s.attempts,
      [attemptId]: {
        id: attemptId,
        episodeId: id,
        startedAt: now,
        completedAt: null,
        index: 0,
        questions: e.quiz.map((q) => ({
          ...q,
          options: shuffle(q.options, attemptId + q.id),
        })),
        answers: {},
      },
    },
  };
}
export function answerQuiz(
  s: ListeningState,
  id: string,
  value: string,
  now: number,
): ListeningState {
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
    a.episodeId,
    now,
  );
}
export function nextQuestion(s: ListeningState, id: string): ListeningState {
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
export function filterEpisodes(
  s: ListeningState,
  q: {
    level: string;
    category?: string;
    duration?: string;
    status?: string;
    favorites?: boolean;
    search?: string;
  },
) {
  const search = searchFold(q.search ?? "");
  return library.filter(
    (e) =>
      e.level === q.level &&
      (!q.category || e.category === q.category) &&
      (!q.search || searchFold(e.title + " " + e.german).includes(search)) &&
      (!q.favorites || s.favorites.includes(e.id)) &&
      (!q.duration ||
        (!!e.audio &&
          (q.duration === "short"
            ? e.audio.duration < 30
            : q.duration === "medium"
              ? e.audio.duration >= 30 && e.audio.duration < 60
              : e.audio.duration >= 60))) &&
      (!q.status ||
        (q.status === "ready"
          ? !!e.audio
          : q.status === "completed"
            ? s.progress[e.id]?.completedAt != null
            : q.status === "started"
              ? !!s.progress[e.id] && s.progress[e.id].completedAt === null
              : q.status === "review"
                ? needsReview(s, e.id)
                : !e.audio)),
  );
}
