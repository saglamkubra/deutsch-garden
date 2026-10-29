import type { Category, Role, Topic } from "./types.ts";
import type { Question } from "../exercises/types.ts";
import { shuffle } from "../exercises/generate.ts";
import { a2Specs } from "./a2-specs.ts";

export type A2Spec = {
  title: string;
  german: string;
  category: Category;
  intro: string;
  goals: string[];
  rules: string[];
  tip: string;
  mistake: { wrong: string; right: string; why: string };
  // [marked German, translation, explanation, two wrong forms, optional grammatical role]
  examples: [string, string, string, string, string, Role?][];
  checks: [string, string, string, string, string][];
};

export const a2Topics: Topic[] = a2Specs.map((spec, index) => {
  const id = `grammar-a2-${String(index + 1).padStart(2, "0")}`;
  const rows = spec.examples.map(([marked, tr, why, wrong1, wrong2, role]) => {
    const matches = [...marked.matchAll(/\[([^\]]+)\]/g)];
    if (matches.length !== 1) throw new Error(id + ": tek odak alanı gerekir");
    return {
      de: marked.replace(/\[|\]/g, ""),
      blank: marked.replace(/\[[^\]]+\]/, "___"),
      answer: matches[0][1],
      tr,
      why,
      wrong1,
      wrong2,
      role,
    };
  });
  const quiz: Question[] = [
    ...spec.checks.map(
      ([prompt, answer, wrong1, wrong2, explanation], i): Question => ({
        id: `${id}:q${i + 1}`,
        type: "choice",
        wordIds: [id],
        prompt,
        accepted: [answer],
        options: shuffle([answer, wrong1, wrong2], id + i),
        explanation,
      }),
    ),
    ...rows.map((row, i): Question => ({
      id: `${id}:q${i + 9}`,
      type: "blank",
      wordIds: [id],
      prompt: `Boşluğu tamamla: ${row.blank}\nAnlamı: ${row.tr}`,
      accepted: [row.answer],
      options: shuffle([row.answer, row.wrong1, row.wrong2], id + "blank" + i),
      explanation: row.why,
    })),
    ...rows.map((row, i): Question => ({
      id: `${id}:q${i + 17}`,
      type: "sentence",
      wordIds: [id],
      prompt: `Verilen sözcüklerle örnekteki sırayı kur: ${row.tr}`,
      accepted: [row.de],
      options: [],
      tiles: shuffle(
        row.de.replace(/[.,!?;:]/g, "").split(/\s+/),
        id + "order" + i,
      ),
      explanation: `${row.why} Bu etkinlik verilen örnek dizilişini çalıştırır; diğer bütün doğal cümle dizilişlerini değerlendirmez.`,
    })),
  ];
  return {
    id,
    level: "A2",
    title: spec.title,
    german: spec.german,
    category: spec.category,
    summary: spec.goals[0],
    lesson: {
      intro: spec.intro,
      objectives: spec.goals,
      rules: spec.rules.map((r) => r.split(" :: ")[1]),
      ruleHeadings: spec.rules.map((r) => r.split(" :: ")[0]),
      examples: rows.map((r) => ({
        de: r.de,
        tr: r.tr,
        explanation: r.why,
        highlights: r.role
          ? [{ text: r.answer, role: r.role, hint: r.why }]
          : [],
      })),
      mistake: {
        ...spec.mistake,
        right: spec.mistake.wrong.replace(/\[[^\]]+\]/, spec.mistake.right),
      },
      tip: spec.tip,
      practice: {
        id: id + ":practice",
        type: "tr-de",
        wordIds: [id],
        prompt: `Yalnızca hatalı kısmın doğrusunu yaz: ${spec.mistake.wrong}`,
        accepted: [spec.mistake.right],
        options: [],
        explanation: spec.mistake.why,
      },
      quiz,
    },
  };
});
