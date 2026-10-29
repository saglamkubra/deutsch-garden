import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { originalA1 } from "../src/lib/learning/seed.ts";
import {
  importVocabulary,
  validateVocabulary,
} from "../src/lib/learning/import.ts";
const args = process.argv.slice(2);
const value = (flag: string) => args[args.indexOf(flag) + 1];
const output = resolve(
  args.includes("--output") ? value("--output") : "src/data/vocabulary.json",
);
const input: unknown = args.includes("--input")
  ? JSON.parse(await readFile(resolve(value("--input")), "utf8"))
  : originalA1;
if (!Array.isArray(input)) throw new Error("Girdi JSON dizisi olmalı.");
let existing = [];
try {
  existing = JSON.parse(await readFile(output, "utf8"));
  if (
    !Array.isArray(existing) ||
    existing.some((v) => validateVocabulary(v).length)
  )
    throw new Error("Mevcut veri geçersiz; üzerine yazılmadı.");
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}
const result = importVocabulary(existing, input);
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(result.records, null, 2) + "\n", "utf8");
await mkdir("reports", { recursive: true });
await writeFile(
  "reports/vocabulary-import.json",
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      input: args.includes("--input")
        ? value("--input")
        : "Özgün A1 başlangıç verisi",
      output,
      ...result.report,
      total: result.records.length,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({ ...result.report, total: result.records.length }, null, 2),
);
if (result.report.rejected) process.exitCode = 1;
