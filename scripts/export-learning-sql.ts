import { readFile, writeFile } from "node:fs/promises";
import { curriculum, levelThemes } from "../src/lib/learning/curriculum.ts";
import { LEVELS, type VocabularyRecord } from "../src/lib/learning/types.ts";
import {
  vocabularyKey,
  validateVocabulary,
} from "../src/lib/learning/import.ts";
const records = JSON.parse(
  await readFile("src/data/vocabulary.json", "utf8"),
) as VocabularyRecord[];
if (records.some((v) => validateVocabulary(v).length))
  throw new Error("Kelime dosyası doğrulanamadı.");
const sql = (value: unknown) =>
  value === null
    ? "null"
    : typeof value === "number"
      ? String(value)
      : "'" + String(value).replaceAll("'", "''") + "'";
let out =
  "-- Generated from original local content; not scraped from AlmancaABC.\nbegin;\n";
for (const [i, level] of LEVELS.entries())
  out += `insert into public.learning_levels(code,world_name,description,position) values (${[level, levelThemes[level].name, levelThemes[level].description, i + 1].map(sql).join(",")}) on conflict(code) do update set world_name=excluded.world_name,description=excluded.description;\n`;
for (const unit of curriculum) {
  out += `insert into public.learning_units(id,level_code,position,title,goal) values (${[unit.id, unit.level, unit.order, unit.title, unit.goal].map(sql).join(",")}) on conflict(id) do update set title=excluded.title,goal=excluded.goal;\n`;
  for (const lesson of unit.lessons) {
    const ready =
      lesson.kind === "vocabulary" &&
      records.some((v) => v.unit_ids.includes(unit.id));
    out += `insert into public.learning_lessons(id,unit_id,title,kind,description,content_status) values (${[lesson.id, unit.id, lesson.title, lesson.kind, lesson.description, ready ? "ready" : "planned"].map(sql).join(",")}) on conflict(id) do update set title=excluded.title,kind=excluded.kind,description=excluded.description,content_status=excluded.content_status;\n`;
  }
}
const columns = [
  "id",
  "german_word",
  "turkish_meaning",
  "article",
  "plural_form",
  "plural_note",
  "word_type",
  "cefr_level",
  "category",
  "sense_key",
  "normalized_key",
  "example_sentence_de",
  "example_sentence_tr",
  "pronunciation_hint",
  "audio_url",
  "difficulty",
  "source_name",
  "source_url",
  "license",
  "created_at",
  "updated_at",
];
for (const record of records) {
  const row = { ...record, normalized_key: vocabularyKey(record) } as Record<
    string,
    unknown
  >;
  out += `insert into public.vocabulary(${columns.join(",")}) values (${columns.map((c) => sql(row[c])).join(",")}) on conflict(id) do update set ${columns
    .filter((c) => c !== "id" && c !== "created_at")
    .map((c) => c + "=excluded." + c)
    .join(",")};\n`;
  for (const level of record.levels)
    out += `insert into public.vocabulary_levels values (${sql(record.id)},${sql(level)}) on conflict do nothing;\n`;
  for (const topic of record.topics)
    out += `insert into public.vocabulary_topics values (${sql(record.id)},${sql(topic)}) on conflict do nothing;\n`;
  for (const unit of record.unit_ids)
    out += `insert into public.vocabulary_units values (${sql(record.id)},${sql(unit)}) on conflict do nothing;\n`;
}
out += "commit;\n";
await writeFile("supabase/seed.sql", out, "utf8");
console.log(
  `${LEVELS.length} düzey, ${curriculum.length} ünite, ${curriculum.length * 2} ders, ${records.length} kelime SQL dosyasına hazırlandı. Veritabanına gönderilmedi.`,
);
