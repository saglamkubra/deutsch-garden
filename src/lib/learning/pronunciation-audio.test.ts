import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { pronunciationAudio } from "./pronunciation-audio.ts";
import { miniCourses } from "../courses/content.ts";
import { courseAudio } from "../courses/audio.ts";
import { publicPronunciationTexts } from "./audio-catalog.ts";
import vocabulary from "../../data/vocabulary.json" with { type: "json" };
import { LocalVocabularyRepository } from "./repository.ts";
import { generateQuestions } from "../exercises/generate.ts";
import type { VocabularyRecord } from "./types.ts";
test("reported A1 expression uses its existing hosted recording, including whitespace normalization", () => {
  const course = miniCourses.find(
    (c) =>
      c.level === "A1" &&
      c.examples.some((e) => e.de === "Wie viel kostet die Jacke?"),
  )!;
  assert.ok(course);
  const example = course.examples.find(
    (e) => e.de === "Wie viel kostet die Jacke?",
  )!;
  assert.deepEqual(pronunciationAudio("  Wie viel kostet\n die Jacke?  "), {
    url: courseAudio[example.id].url,
    sha256: courseAudio[example.id].sha256,
  });
});

test("all static vocabulary/card texts and listening exercise prompts have hosted recordings at every CEFR level", () => {
  const texts = publicPronunciationTexts();
  assert.ok(texts.length >= 1170);
  for (const text of texts) {
    const a = pronunciationAudio(text);
    assert.ok(a, text);
    const bytes = readFileSync("public" + a.url);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), a.sha256);
  }
  const repo = new LocalVocabularyRepository(vocabulary as VocabularyRecord[]);
  for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"] as const) {
    const questions = generateQuestions(
      repo,
      level,
      "listening",
      "audio-audit-" + level,
      [],
      {},
      1000,
    );
    assert.ok(questions.length > 0);
    for (const q of questions) {
      assert.ok(q.audio);
      assert.ok(pronunciationAudio(q.audio), level + " " + q.id);
    }
  }
});
test("every mapped teaching expression resolves to a real unchanged public audio file", () => {
  const checked = new Set<string>();
  for (const course of miniCourses)
    for (const example of course.examples) {
      const asset = pronunciationAudio(example.de);
      assert.ok(asset);
      assert.match(
        asset.url,
        /^\/audio\/(courses|course-examples)\/[a-zA-Z0-9_.-]+\.(mp3|wav)$/,
      );
      if (!checked.has(asset.url)) {
        assert.equal(
          createHash("sha256")
            .update(readFileSync("public" + asset.url))
            .digest("hex"),
          asset.sha256,
        );
        checked.add(asset.url);
      }
    }
  assert.equal(
    miniCourses.reduce((n, c) => n + c.examples.length, 0),
    1419,
  );
  assert.equal(pronunciationAudio("unlisted expression"), null);
  assert.equal(pronunciationAudio("__proto__"), null);
});
