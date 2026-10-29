import type { Level } from "../learning/types.ts";
export const MODES = [
  "choice",
  "blank",
  "matching",
  "sentence",
  "tr-de",
  "de-tr",
  "listening",
  "daily",
] as const;
export type Mode = (typeof MODES)[number];
export type Question = {
  id: string;
  type: Exclude<Mode, "daily">;
  wordIds: string[];
  prompt: string;
  options: string[];
  accepted: string[];
  explanation: string;
  pairs?: { id: string; de: string; tr: string }[];
  tiles?: string[];
  audio?: string;
};
export type Response = {
  value: string;
  correct: boolean;
  at: number;
  xp: number;
  skipped?: boolean;
};
export type Session = {
  questionStartedAt?: Record<string, number>;
  id: string;
  date: string;
  level: Level;
  mode: Mode;
  questions: Question[];
  answers: Record<string, Response>;
  index: number;
  startedAt: number;
  completedAt: number | null;
  rewardKey: string;
  practice: boolean;
  attempts?: {
    questionId: string;
    wordId: string;
    value: string;
    correct: boolean;
    at: number;
  }[];
};
export type Mistake = {
  wrong: number;
  right: number;
  lastAt: number;
  wordId: string;
};
export type Claim = {
  id: string;
  coins: number;
  seed: boolean;
  delivered: boolean;
};
export type ExerciseState = {
  gamification?: import("../gamification/model.ts").GameState;
  version: 1;
  sessions: Record<string, Session>;
  daily: Record<string, string>;
  active: string | null;
  xp: Record<string, number>;
  claims: Claim[];
  mistakes: Record<string, Mistake>;
};
export const initialExercises = (): ExerciseState => ({
  version: 1,
  sessions: {},
  daily: {},
  active: null,
  xp: {},
  claims: [],
  mistakes: {},
});
