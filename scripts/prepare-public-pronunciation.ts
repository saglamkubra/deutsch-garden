import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  publicPronunciationTexts,
  audioText,
} from "../src/lib/learning/audio-catalog.ts";
import { miniCourses } from "../src/lib/courses/content.ts";
import { courseAudio } from "../src/lib/courses/audio.ts";
import vocabulary from "../src/data/vocabulary.json" with { type: "json" };
import legacy from "../src/data/listening/audio-manifest.json" with { type: "json" };
import worldGlossary from "../src/data/stories/world-glossary.json" with { type: "json" };
import libraryGlossary from "../src/data/stories/library-glossary.json" with { type: "json" };
type Asset = { url: string; sha256: string };
const existing: Record<string, Asset> = {};
for (const course of miniCourses)
  for (const example of course.examples) {
    const a = courseAudio[example.id];
    if (a) existing[audioText(example.de)] = { url: a.url, sha256: a.sha256 };
  }
for (const word of vocabulary) {
  const a = (legacy.words as Record<string, { url: string }>)[word.id];
  if (a && existsSync("public" + a.url))
    existing[
      audioText([word.article, word.german_word].filter(Boolean).join(" "))
    ] = {
      url: a.url,
      sha256: createHash("sha256")
        .update(readFileSync("public" + a.url))
        .digest("hex"),
    };
}
const worldPath = "src/data/stories/world-audio.json";
if (existsSync(worldPath)) {
  const world = JSON.parse(readFileSync(worldPath, "utf8"));
  for (const word of worldGlossary) {
    const asset = world.glossary[word.id];
    if (asset)
      existing[audioText([word.article, word.word].filter(Boolean).join(" "))] =
        { url: asset.url, sha256: asset.sha256 };
  }
}
const texts = publicPronunciationTexts();
const libraryPath = "src/data/stories/library-audio.json";
if (existsSync(libraryPath)) {
  const library = JSON.parse(readFileSync(libraryPath, "utf8"));
  for (const word of libraryGlossary) {
    const asset = library.glossary[word.id];
    if (asset)
      existing[audioText([word.article, word.word].filter(Boolean).join(" "))] =
        { url: asset.url, sha256: asset.sha256 };
  }
}
mkdirSync(".cache", { recursive: true });
writeFileSync(
  ".cache/public-pronunciation-input.json",
  JSON.stringify({ texts, existing }),
);
console.log(
  JSON.stringify({
    publicTexts: texts.length,
    reused: texts.filter((t) => existing[t]).length,
    toPrepare: texts.filter((t) => !existing[t]).length,
  }),
);
