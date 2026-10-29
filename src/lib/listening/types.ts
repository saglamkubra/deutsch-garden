import type { Level } from "../learning/types.ts";
import type { Question, Response } from "../exercises/types.ts";
export const CATEGORIES = {
  conversation: "Günlük Konuşmalar",
  stories: "Kısa Hikâyeler",
  germany: "Almanya’da Yaşam",
  travel: "Seyahat",
  culture: "Kültür",
  education: "İş ve Eğitim",
  technology: "Teknoloji",
  grammar: "Gramer Dinleme",
  words: "Kelime Tekrarı",
} as const;
export type Category = keyof typeof CATEGORIES;
export type Transcript = {
  id: string;
  de: string;
  tr: string;
  links: { text: string; lemma: string }[];
  speaker?: string;
};
export type AudioAsset = {
  url: string;
  duration: number;
  sampleRate: number;
  sha256: string;
  segments: { id: string; start: number; end: number }[];
};
export type Episode = {
  id: string;
  level: Level;
  title: string;
  german: string;
  category: Category;
  icon: string;
  summary: string;
  guidance?: string[];
  lemmas: string[];
  sentences: Transcript[];
  quiz: Question[];
  audio?: AudioAsset;
};
export type ListeningProgress = {
  startedAt: number;
  lastAt: number;
  position: number;
  heard: number[];
  completedAt: number | null;
};
export type ListeningAttempt = {
  id: string;
  episodeId: string;
  startedAt: number;
  completedAt: number | null;
  index: number;
  questions: Question[];
  answers: Record<string, Response>;
};
export type ListeningClaim = {
  id: string;
  xp: number;
  coins: number;
  seed: boolean;
  delivered: boolean;
};
export type ListeningState = {
  version: 1;
  progress: Record<string, ListeningProgress>;
  favorites: string[];
  savedWords: string[];
  daily: Record<
    string,
    { date: string; level: Level; episodeId: string | null }
  >;
  attempts: Record<string, ListeningAttempt>;
  activeAttempt: Record<string, string>;
  claims: ListeningClaim[];
};
export const initialListening = (): ListeningState => ({
  version: 1,
  progress: {},
  favorites: [],
  savedWords: [],
  daily: {},
  attempts: {},
  activeAttempt: {},
  claims: [],
});
