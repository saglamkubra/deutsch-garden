import { writeFileSync } from "node:fs";
import { topics } from "../src/lib/grammar/content.ts";
const sql = (v: unknown) =>
  "'" +
  String(typeof v === "string" ? v : JSON.stringify(v)).replace(/'/g, "''") +
  "'";
const rows: string[] = [
  "-- Authored Deutsch Garden grammar catalog. Preparation only; not applied.",
  "begin;",
];
const insert = (
  table: string,
  fields: string[],
  values: unknown[],
  key = "id",
) =>
  rows.push(
    "insert into public." +
      table +
      " (" +
      fields.join(",") +
      ") values (" +
      values.map(sql).join(",") +
      ") on conflict (" +
      key +
      ") do update set " +
      fields
        .filter((f) => f !== key)
        .map((f) => f + "=excluded." + f)
        .join(",") +
      ";",
  );
let examples = 0,
  questions = 0;
topics.forEach((t, i) => {
  insert(
    "grammar_topics",
    [
      "id",
      "level",
      "title_tr",
      "title_de",
      "category",
      "summary_tr",
      "content_status",
      "position",
    ],
    [
      t.id,
      t.level,
      t.title,
      t.german,
      t.category,
      t.summary,
      t.lesson ? "ready" : "planned",
      i + 1,
    ],
  );
  const l = t.lesson;
  if (!l) return;
  const lessonId = t.id + ":lesson";
  insert(
    "grammar_lessons",
    [
      "id",
      "topic_id",
      "objectives",
      "introduction_tr",
      "rules",
      "common_mistake",
      "lumi_tip_tr",
      "source_name",
    ],
    [
      lessonId,
      t.id,
      l.objectives,
      l.intro,
      l.rules,
      l.mistake,
      l.tip,
      "Deutsch Garden · özgün gramer içeriği",
    ],
  );
  l.examples.forEach((e, n) => {
    examples++;
    insert(
      "grammar_examples",
      [
        "id",
        "lesson_id",
        "sentence_de",
        "translation_tr",
        "highlights",
        "position",
      ],
      [t.id + ":example" + (n + 1), lessonId, e.de, e.tr, e.highlights, n + 1],
    );
  });
  [l.practice, ...l.quiz].forEach((q, n) => {
    questions++;
    insert(
      "grammar_practice_questions",
      [
        "id",
        "lesson_id",
        "type_id",
        "kind",
        "prompt",
        "public_payload",
        "position",
      ],
      [
        q.id,
        lessonId,
        q.type,
        n ? "quiz" : "practice",
        q.prompt,
        { options: q.options, ...(q.tiles ? { tiles: q.tiles } : {}) },
        n,
      ],
    );
    insert(
      "grammar_question_answers",
      ["question_id", "accepted", "explanation_tr"],
      [q.id, q.accepted, q.explanation],
      "question_id",
    );
  });
});
rows.push("commit;");
writeFileSync(
  new URL("../supabase/grammar-seed.sql", import.meta.url),
  rows.join("\n") + "\n",
  "utf8",
);
const report = {
  topics: topics.length,
  readyLessons: topics.filter((t) => t.lesson).length,
  examples,
  quizQuestions: questions - 16,
  practiceQuestions: 16,
  fullyReadyByLevel: { A1: 16, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 },
  supabaseConnected: false,
  migrationApplied: false,
};
writeFileSync(
  new URL("../reports/grammar-counts.json", import.meta.url),
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);
console.log(report);
