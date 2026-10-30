// Public teaching examples only; never reads learner data or provider keys.
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { miniCourses } from "../src/lib/courses/content.ts";
import { courseAudio } from "../src/lib/courses/audio.ts";
import { publicPronunciationTexts } from "../src/lib/learning/audio-catalog.ts";
const index: Record<string, { url: string; sha256: string }> = {};
for (const course of miniCourses)
  for (const example of course.examples) {
    const text = example.de.normalize("NFC").replace(/\s+/g, " ").trim();
    const asset = courseAudio[example.id];
    if (asset && !index[text])
      index[text] = { url: asset.url, sha256: asset.sha256 };
  }
const manifestPath = "src/data/learning/pronunciation-recordings.json";
if (existsSync(manifestPath)) {
  const entries = JSON.parse(readFileSync(manifestPath, "utf8"))
    .entries as Record<string, { url: string; sha256: string }>;
  for (const [text, asset] of Object.entries(entries))
    if (!index[text]) index[text] = { url: asset.url, sha256: asset.sha256 };
}
const missing = publicPronunciationTexts().filter((text) => !index[text]);
if (missing.length)
  throw Error(
    `${missing.length} genel telaffuz kaydı eksik. Yerel ses üretimini tamamlayın.`,
  );
writeFileSync(
  "src/data/courses/pronunciation-index.json",
  JSON.stringify(index),
);
console.log(
  `${Object.keys(index).length} genel ifade için hazır telaffuz dizini oluşturuldu.`,
);
