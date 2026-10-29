import { readFile } from "node:fs/promises";
import {
  initialLearning,
  ensureDaily,
  addDays,
  assignmentKey,
} from "../src/lib/learning/engine.ts";
import type { VocabularyRecord } from "../src/lib/learning/types.ts";
const date = process.argv[2] ?? "2026-10-27";
if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)))
  throw new Error("Tarih YYYY-AA-GG biçiminde olmalı.");
const records = JSON.parse(
  await readFile("src/data/vocabulary.json", "utf8"),
) as VocabularyRecord[];
let state = ensureDaily(initialLearning(), records, date);
const first = state.assignments[assignmentKey(date, "A1")];
const nextDate = addDays(date, 1);
state = ensureDaily(state, records, nextDate);
const second = state.assignments[assignmentKey(nextDate, "A1")];
console.log(
  JSON.stringify(
    {
      note: "Salt okunur simülasyon; tarayıcı kaydını değiştirmez.",
      first: {
        date,
        ids: first.newIds,
        words: first.newIds.map(
          (id) => records.find((v) => v.id === id)!.german_word,
        ),
      },
      second: {
        date: nextDate,
        ids: second.newIds,
        words: second.newIds.map(
          (id) => records.find((v) => v.id === id)!.german_word,
        ),
        reviews: second.reviewIds,
      },
      sameNewWords: first.newIds.filter((id) => second.newIds.includes(id)),
    },
    null,
    2,
  ),
);
