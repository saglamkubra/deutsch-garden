import type { Level } from "../learning/types.ts";
import type { Question, Response } from "../exercises/types.ts";
export const categories = {
  basics: "Temeller",
  verbs: "Fiiller",
  nouns: "İsimler ve artikeller",
  sentences: "Cümle yapısı",
  cases: "Hâller ve edatlar",
  style: "Anlatım ve üslup",
} as const;
export type Category = keyof typeof categories;
export type Role = "subject" | "verb" | "object" | "article" | "preposition";
export const roleLabels: Record<Role, string> = {
  subject: "Özne",
  verb: "Fiil",
  object: "Nesne",
  article: "Artikel",
  preposition: "Edat",
};
export type Example = {
  de: string;
  tr: string;
  explanation?: string;
  highlights: { text: string; role: Role; hint: string }[];
};
export type Lesson = {
  objectives: string[];
  intro: string;
  rules: string[];
  ruleHeadings?: string[];
  examples: Example[];
  mistake: { wrong: string; right: string; why: string };
  tip: string;
  practice: Question;
  quiz: Question[];
};
export type Topic = {
  id: string;
  level: Level;
  title: string;
  german: string;
  category: Category;
  summary: string;
  lesson?: Lesson;
};
export type QuizAttempt = {
  id: string;
  topicId: string;
  startedAt: number;
  completedAt: number | null;
  index: number;
  questions: Question[];
  answers: Record<string, Response>;
};
export type TopicProgress = {
  startedAt: number;
  read: boolean;
  practicePassed: boolean;
  completedAt: number | null;
};
export type GrammarClaim = {
  id: string;
  xp: number;
  coins: number;
  seed: boolean;
  delivered: boolean;
};
export type GrammarState = {
  version: 1;
  progress: Record<string, TopicProgress>;
  bookmarks: string[];
  lastTopic: string | null;
  attempts: Record<string, QuizAttempt>;
  activeAttempt: Record<string, string>;
  claims: GrammarClaim[];
  xp: Record<string, number>;
};
export const initialGrammar = (): GrammarState => ({
  version: 1,
  progress: {},
  bookmarks: [],
  lastTopic: null,
  attempts: {},
  activeAttempt: {},
  claims: [],
  xp: {},
});
