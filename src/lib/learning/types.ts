export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type Level = (typeof LEVELS)[number];
export const WORD_TYPES = [
  "noun",
  "verb",
  "adjective",
  "expression",
  "adverb",
  "number",
] as const;
export type WordType = (typeof WORD_TYPES)[number];
export const wordTypeLabels: Record<WordType, string> = {
  noun: "İsim",
  verb: "Fiil",
  adjective: "Sıfat",
  expression: "İfade",
  adverb: "Zarf",
  number: "Sayı",
};
export const CATEGORIES = {
  greetings: "Selamlaşma",
  family: "Aile ve arkadaşlar",
  time: "Sayılar ve zaman",
  food: "Yiyecek ve içecek",
  routines: "Günlük yaşam",
  home: "Ev ve okul",
  shopping: "Alışveriş",
  travel: "Seyahat ve yönler",
  hobbies: "Hobiler",
  conversation: "Temel konuşmalar",
} as const;
export type Category = keyof typeof CATEGORIES;
export type VocabularyRecord = {
  id: string;
  german_word: string;
  turkish_meaning: string;
  article: "der" | "die" | "das" | null;
  plural_form: string | null;
  plural_note: string | null;
  word_type: WordType;
  cefr_level: Level;
  levels: Level[];
  category: Category;
  topics: Category[];
  unit_ids: string[];
  sense_key: string;
  example_sentence_de: string;
  example_sentence_tr: string;
  pronunciation_hint: string | null;
  audio_url: string | null;
  difficulty: number;
  source_name: string;
  source_url: string | null;
  license: string;
  created_at: string;
  updated_at: string;
};
export type Lesson = {
  id: string;
  title: string;
  kind: "vocabulary" | "planned";
  description: string;
};
export type Unit = {
  id: string;
  level: Level;
  order: number;
  title: string;
  goal: string;
  lessons: Lesson[];
};
export type Answer = "known" | "again";
export type WordProgress = {
  introducedOn: string;
  dueOn: string;
  known: boolean;
  streak: number;
  lastAnsweredOn: string | null;
  responses: number;
};
export type Assignment = {
  id: string;
  date: string;
  level: Level;
  goal: number;
  newIds: string[];
  reviewIds: string[];
  answers: Record<string, Answer>;
};
export type RewardIntent = {
  id: string;
  kind: "seed" | "coins";
  amount: number;
  delivered: boolean;
};
export type LearningState = {
  version: 1;
  revision: number;
  level: Level;
  goal: 5 | 10 | 15 | 20;
  progress: Record<string, WordProgress>;
  assignments: Record<string, Assignment>;
  unitAnswers: Record<string, Record<string, Answer>>;
  milestones: string[];
  outbox: RewardIntent[];
};
