import type { Level } from "../learning/types.ts";
import type { Question } from "../exercises/types.ts";
export type StoryLine = { de: string; tr: string; speaker?: string };
export type StoryChoice = { id: string; de: string; tr: string; to: string };
export type StoryScene = {
  id: string;
  title: string;
  art: string;
  lines: StoryLine[];
  words: string[];
  choices: StoryChoice[];
  ending?: string;
  question: {
    prompt: string;
    options: string[];
    correct: string;
    explanation: string;
  };
};
export type Story = {
  id: string;
  title: string;
  germanTitle: string;
  level: Level;
  category: string;
  description: string;
  art: string;
  minutes: number;
  start: string;
  scenes: StoryScene[];
};
export type StoryRun = {
  id: string;
  storyId: string;
  path: string[];
  choices: string[];
  startedAt: number;
  updatedAt: number;
  quiz: {
    questions: Question[];
    answers: Record<string, { value: string; correct: boolean }>;
    index: number;
    completedAt: number | null;
  } | null;
};
export type StoryClaim = {
  id: string;
  xp: number;
  coins: number;
  seed: boolean;
  delivered: boolean;
};
export type StoryState = {
  version: 1;
  current: string | null;
  runs: Record<string, StoryRun>;
  active: Record<string, string>;
  endings: Record<string, string[]>;
  completed: string[];
  favorites: string[];
  savedWords: string[];
  daily: Record<string, { date: string; level: Level; storyId: string | null }>;
  claims: StoryClaim[];
};
export const initialStories = (): StoryState => ({
  version: 1,
  current: null,
  runs: {},
  active: {},
  endings: {},
  completed: [],
  favorites: [],
  savedWords: [],
  daily: {},
  claims: [],
});
