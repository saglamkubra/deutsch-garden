import type { Level } from "../learning/types.ts";
import type { Question } from "../exercises/types.ts";
export type CourseQuestion = Question & {
  rule: string;
  hints: string[];
  kindLabel: string;
  optionNotes?: Record<string, string>;
  reviewWordIds: string[];
  audioExampleId?: string;
  contextId?: string;
};
export type TeachingStep = {
  id: string;
  title: string;
  introduction: string;
  rule: string;
  usage: string;
  structure: string;
  mistake: string;
  memory: string;
  details?: { title: string; body: string }[];
  table?: { heading: string; rows: [string, string, string][] };
};
export type CourseExample = {
  id: string;
  de: string;
  tr: string;
  explanation: string;
  highlights: string[];
};
export type MiniCourse = {
  id: string;
  unitId: string;
  level: Level;
  title: string;
  goal: string;
  studyPlan?: {
    prerequisites: string[];
    objectives: string[];
    sessions: { title: string; description: string }[];
  };
  texts?: {
    id: string;
    title: string;
    de: string;
    tr: string;
    notes: string;
  }[];
  steps: TeachingStep[];
  examples: CourseExample[];
  guided: CourseQuestion[];
  independent: CourseQuestion[];
  summary: {
    writingChecklist?: string[];
    takeaways: string[];
    vocabulary: { de: string; tr: string }[];
    mistakes: string[];
    examples: string[];
  };
};
export type PracticeAnswer = { value: string; correct: boolean; at: number };
export type CourseProgress = {
  startedAt: number;
  updatedAt: number;
  read: string[];
  examples: string[];
  guided: Record<string, PracticeAnswer[]>;
  independent: Record<string, PracticeAnswer>;
  reviews: Record<string, PracticeAnswer[]>;
  summary: boolean;
  completedAt: number | null;
  guidedIndex: number;
  independentIndex: number;
};
export type CourseState = {
  version: 1;
  progress: Record<string, CourseProgress>;
  claims: { id: string; lessonId: string; delivered: boolean }[];
  reviewQueue: { id: string; wordId: string; delivered: boolean }[];
};
export const initialCourses = (): CourseState => ({
  version: 1,
  progress: {},
  claims: [],
  reviewQueue: [],
});
