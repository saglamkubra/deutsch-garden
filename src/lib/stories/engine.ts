import { initialStories } from "./types.ts";
import type { StoryState, StoryRun } from "./types.ts";
import type { Level } from "../learning/types.ts";
import type { Question } from "../exercises/types.ts";
import { isCorrect } from "../exercises/generate.ts";
import { REWARDS } from "../exercises/engine.ts";
import { storyById, stories, wordById, resolveWord } from "./content.ts";
import { addDays } from "../learning/engine.ts";
export { initialStories };
export const currentRun = (s: StoryState, id: string) => s.runs[s.active[id]];
export function startStory(
  s: StoryState,
  id: string,
  runId: string,
  now: number,
  replay = false,
): StoryState {
  const story = storyById(id);
  if (!story) return s;
  if (!replay && currentRun(s, id)) return { ...s, current: id };
  if (s.runs[runId]) return s;
  const run: StoryRun = {
    id: runId,
    storyId: id,
    path: [story.start],
    choices: [],
    startedAt: now,
    updatedAt: now,
    quiz: null,
  };
  return {
    ...s,
    current: id,
    runs: { ...s.runs, [runId]: run },
    active: { ...s.active, [id]: runId },
  };
}
function claim(s: StoryState, id: string, xp = 0, coins = 0, seed = false) {
  return s.claims.some((c) => c.id === id)
    ? s
    : {
        ...s,
        claims: [...s.claims, { id, xp, coins, seed, delivered: false }],
      };
}
export function chooseStory(
  s: StoryState,
  id: string,
  expectedScene: string,
  choiceId: string,
  now: number,
): StoryState {
  const story = storyById(id),
    run = currentRun(s, id);
  if (!story || !run || run.path.at(-1) !== expectedScene) return s;
  const choice = story.scenes
    .find((n) => n.id === expectedScene)
    ?.choices.find((c) => c.id === choiceId);
  if (!choice || run.path.includes(choice.to)) return s;
  const next = {
    ...run,
    path: [...run.path, choice.to],
    choices: [...run.choices, choice.id],
    updatedAt: now,
  };
  let result: StoryState = {
    ...s,
    current: id,
    runs: { ...s.runs, [run.id]: next },
  };
  if (story.scenes.find((n) => n.id === choice.to)?.ending) {
    result = {
      ...result,
      completed: [...new Set([...result.completed, id])],
      endings: {
        ...result.endings,
        [id]: [...new Set([...(result.endings[id] ?? []), choice.to])],
      },
    };
    result = claim(result, "story:complete:" + id, REWARDS.stories.storyXp);
    result = claim(
      result,
      "story:ending:" + id + ":" + choice.to,
      0,
      REWARDS.stories.endingCoins,
    );
  }
  return result;
}
export function questionsFor(run: StoryRun): Question[] {
  const story = storyById(run.storyId);
  if (!story || !story.scenes.find((n) => n.id === run.path.at(-1))?.ending)
    return [];
  return run.path.map((id, i) => {
    const n = story.scenes.find((n) => n.id === id)!;
    const q = n.question;
    // Deterministic rotation prevents placing every correct answer in the first slot.
    const offset = (story.id.length + i) % q.options.length,
      options = [...q.options.slice(offset), ...q.options.slice(0, offset)];
    return {
      id: story.id + ":" + id,
      type: "choice",
      wordIds: [resolveWord(n.words[0])!.id],
      prompt: q.prompt,
      options,
      accepted: [q.correct],
      explanation: q.explanation,
    };
  });
}
export function beginStoryQuiz(s: StoryState, id: string): StoryState {
  const run = currentRun(s, id);
  if (!run || run.quiz) return s;
  const questions = questionsFor(run);
  if (!questions.length) return s;
  return {
    ...s,
    runs: {
      ...s.runs,
      [run.id]: {
        ...run,
        quiz: { questions, answers: {}, index: 0, completedAt: null },
      },
    },
  };
}
export function storyQuizScore(run: StoryRun) {
  const q = run.quiz;
  return q
    ? Math.round(
        (Object.values(q.answers).filter((a) => a.correct).length /
          q.questions.length) *
          100,
      )
    : 0;
}
export function answerStoryQuiz(
  s: StoryState,
  id: string,
  questionId: string,
  value: string,
  now: number,
): StoryState {
  const run = currentRun(s, id),
    quiz = run?.quiz,
    q = quiz?.questions[quiz.index];
  if (
    !run ||
    !quiz ||
    !q ||
    q.id !== questionId ||
    quiz.completedAt !== null ||
    quiz.answers[q.id] ||
    !q.options.includes(value)
  )
    return s;
  const answers = {
    ...quiz.answers,
    [q.id]: { value, correct: isCorrect(q, value) },
  };
  const complete = Object.keys(answers).length === quiz.questions.length;
  const nextRun = {
    ...run,
    updatedAt: now,
    quiz: { ...quiz, answers, completedAt: complete ? now : null },
  };
  let next = { ...s, runs: { ...s.runs, [run.id]: nextRun } };
  if (complete && storyQuizScore(nextRun) >= REWARDS.stories.quizPass)
    next = claim(next, "story:quiz:" + id, 0, 0, true);
  return next;
}
export function nextStoryQuestion(s: StoryState, id: string) {
  const run = currentRun(s, id),
    q = run?.quiz;
  if (
    !run ||
    !q ||
    q.completedAt !== null ||
    !q.answers[q.questions[q.index].id] ||
    q.index >= q.questions.length - 1
  )
    return s;
  return {
    ...s,
    runs: {
      ...s.runs,
      [run.id]: { ...run, quiz: { ...q, index: q.index + 1 } },
    },
  };
}
export function toggleStoryFavorite(s: StoryState, id: string) {
  return !storyById(id)
    ? s
    : {
        ...s,
        favorites: s.favorites.includes(id)
          ? s.favorites.filter((x) => x !== id)
          : [...s.favorites, id],
      };
}
export function saveStoryWord(s: StoryState, id: string) {
  return !wordById(id) || s.savedWords.includes(id)
    ? s
    : { ...s, savedWords: [...s.savedWords, id] };
}
export function ensureStoryDaily(
  s: StoryState,
  date: string,
  level: Level,
): StoryState {
  const key = date + ":" + level;
  if (s.daily[key]) return s;
  const previous = s.daily[addDays(date, -1) + ":" + level]?.storyId;
  let pool = stories.filter((x) => x.level === level);
  if (pool.length > 1) pool = pool.filter((x) => x.id !== previous);
  const hash = (id: string) =>
    [...(date + id)].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 0);
  const priority = (id: string) =>
    s.completed.includes(id) ? 2 : currentRun(s, id) ? 1 : 0;
  pool.sort(
    (a, b) => priority(a.id) - priority(b.id) || hash(a.id) - hash(b.id),
  );
  return {
    ...s,
    daily: { ...s.daily, [key]: { date, level, storyId: pool[0]?.id ?? null } },
  };
}
export function filterStories(
  s: StoryState,
  q: {
    level: Level;
    category?: string;
    minutes?: string;
    status?: string;
    favorite?: boolean;
    search?: string;
  },
) {
  const fold = (v: string) =>
    v.toLocaleLowerCase("tr").normalize("NFD").replace(/\p{M}/gu, "");
  return stories.filter(
    (x) =>
      x.level === q.level &&
      (!q.category || x.category === q.category) &&
      (!q.minutes || x.minutes <= (q.minutes === "short" ? 3 : 99)) &&
      (!q.favorite || s.favorites.includes(x.id)) &&
      (!q.status ||
        (q.status === "complete"
          ? s.completed.includes(x.id)
          : q.status === "reading"
            ? !!currentRun(s, x.id) && !s.completed.includes(x.id)
            : !currentRun(s, x.id))) &&
      (!q.search ||
        fold(x.title + " " + x.germanTitle).includes(fold(q.search))),
  );
}
