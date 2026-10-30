// Public teaching examples only; never reads learner data or provider keys.
import { writeFileSync } from "node:fs";
import { miniCourses } from "../src/lib/courses/content.ts";
import { courseAudio } from "../src/lib/courses/audio.ts";
const index: Record<string, { url: string; sha256: string }> = {};
for (const course of miniCourses)
  for (const example of course.examples) {
    const text = example.de.normalize("NFC").replace(/\s+/g, " ").trim();
    const asset = courseAudio[example.id];
    if (asset && !index[text])
      index[text] = { url: asset.url, sha256: asset.sha256 };
  }
writeFileSync(
  "src/data/courses/pronunciation-index.json",
  JSON.stringify(index),
);
console.log("Genel ifadelerin hazır telaffuz dizini oluşturuldu.");
