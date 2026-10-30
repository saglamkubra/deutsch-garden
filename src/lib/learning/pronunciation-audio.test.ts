import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { pronunciationAudio } from "./pronunciation-audio.ts";
import { miniCourses } from "../courses/content.ts";
import { courseAudio } from "../courses/audio.ts";
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
  assert.equal(miniCourses.reduce((n,c)=>n+c.examples.length,0),1419);
  assert.equal(pronunciationAudio("unlisted expression"), null);
  assert.equal(pronunciationAudio("__proto__"), null);
});
