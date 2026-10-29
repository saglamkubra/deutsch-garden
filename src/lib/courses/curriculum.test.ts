import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { miniCourses, courseForUnit } from "./content.ts";
import { unpackCourses } from "./packed.ts";
import packed from "../../data/courses/curriculum-packed.json" with { type: "json" };
import vocabulary from "../../data/vocabulary.json" with { type: "json" };
import { curriculum } from "../learning/curriculum.ts";
import { LocalVocabularyRepository } from "../learning/repository.ts";
import { LEVELS, type VocabularyRecord } from "../learning/types.ts";
import { validateVocabulary } from "../learning/import.ts";
import { validQuestion } from "../exercises/persistence.ts";
import {
  generateQuestions,
  isCorrect,
  normalize,
} from "../exercises/generate.ts";
import {
  initialCourses,
  openCourse,
  markCourseReading,
  submitCourseAnswer,
  nextCourseQuestion,
  confirmCourseSummary,
} from "./engine.ts";
import { validCourses, createCoursePersistence } from "./persistence.ts";
import { initialLearning, ensureDaily, placeAt } from "../learning/engine.ts";
import { validSnapshot } from "../account/snapshot.ts";

const repo = new LocalVocabularyRepository(vocabulary as VocabularyRecord[]);
const newCourses = miniCourses.filter(
  (c) => !["a1-01", "a1-02", "a2-01", "a2-02", "a2-03"].includes(c.unitId),
);

test("all 60 completed courses fit the existing cloud snapshot and retain exactly 60 unique claims", () => {
  let state = initialCourses(),
    tick = 1;
  for (const c of miniCourses) {
    state = openCourse(state, c.id, tick++);
    for (const step of c.steps)
      state = markCourseReading(state, c.id, "read", step.id, tick++);
    for (const e of c.examples)
      state = markCourseReading(state, c.id, "examples", e.id, tick++);
    for (const mode of ["guided", "independent"] as const)
      for (const q of c[mode]) {
        state = submitCourseAnswer(
          state,
          c.id,
          mode,
          q.id,
          q.accepted[0],
          tick++,
        );
        state = nextCourseQuestion(state, c.id, mode, tick++);
      }
    state = confirmCourseSummary(state, c.id, tick++);
  }
  assert.equal(Object.keys(state.progress).length, 60);
  assert.equal(state.claims.length, 60);
  assert.equal(new Set(state.claims.map((c) => c.id)).size, 60);
  assert.ok(validCourses(state));
  const snapshot = { version: 1, modules: { "mini-courses": state } };
  assert.ok(JSON.stringify(snapshot).length < 1_500_000);
  assert.ok(validSnapshot(JSON.parse(JSON.stringify(snapshot))));
});
test("all 60 unit IDs have genuine linked lessons, examples and repository content", () => {
  assert.equal(miniCourses.length, 60);
  assert.equal(new Set(miniCourses.map((c) => c.id)).size, 60);
  for (const level of LEVELS) {
    assert.equal(miniCourses.filter((c) => c.level === level).length, 10);
    assert.ok(repo.byLevel(level).length >= 60);
  }
  for (const unit of curriculum) {
    const c = courseForUnit(unit.id)!;
    assert.ok(c, unit.id);
    assert.equal(c.level, unit.level);
    assert.ok(repo.byUnit(unit.id).length > 0);
  }
  assert.equal(newCourses.length, 55);
});

test("packed curriculum decodes exactly to authored full content and preserves five existing courses", () => {
  const json = (name: string) =>
    JSON.parse(
      readFileSync(
        new URL("../../data/courses/" + name, import.meta.url),
        "utf8",
      ),
    );
  assert.deepEqual(unpackCourses(packed), json("complete-curriculum.json"));
  assert.deepEqual(miniCourses.slice(0, 2), json("mini-courses.json"));
  for (const id of ["a2-01", "a2-02", "a2-03"])
    assert.deepEqual(courseForUnit(id), json(id + ".json"));
  for (const id of ["a2-01", "a2-02", "a2-03"])
    for (const word of json(id + "-vocabulary.json"))
      assert.deepEqual(repo.get(word.id), word);
  assert.throws(() => unpackCourses({ version: 2 }));
});

test("55 new lessons contain substantial teaching, 24 explained examples, 80 valid solutions and two contexts each", () => {
  const allIds = new Set<string>();
  for (const c of newCourses) {
    assert.equal(c.steps.length, 14, c.id);
    assert.equal(c.examples.length, 24, c.id);
    assert.equal(c.guided.length, 20, c.id);
    assert.equal(c.independent.length, 60, c.id);
    assert.equal(c.texts?.length, 2, c.id);
    assert.ok(new Set(c.examples.map((e) => e.de)).size >= 22, c.id);
    const teaching = c.steps
      .map((s) =>
        [
          s.introduction,
          s.rule,
          s.usage,
          ...(s.details ?? []).map((d) => d.body),
        ].join(" "),
      )
      .join(" ");
    assert.ok(teaching.split(/\s+/).length >= 1800, c.id);
    assert.ok(!/\{[^}]*~|TODO|Lorem ipsum/.test(JSON.stringify(c)), c.id);
    for (const q of [...c.guided, ...c.independent]) {
      assert.ok(!allIds.has(q.id));
      allIds.add(q.id);
      assert.ok(validQuestion(q), q.id);
      assert.ok(q.explanation.length >= 24, q.id);
      assert.ok(
        q.accepted.every((v) => v.length <= 600 && isCorrect(q, v)),
        q.id,
      );
      if (q.options.length)
        assert.equal(q.options.filter((v) => isCorrect(q, v)).length, 1, q.id);
      if (q.contextId)
        assert.ok(
          c.texts!.some((t) => t.id === q.contextId),
          q.id,
        );
      for (const id of q.reviewWordIds)
        assert.ok(repo.get(id)?.unit_ids.includes(c.unitId), q.id);
      if (q.tiles)
        assert.deepEqual(
          q.tiles.map((v) => normalize(v)).sort(),
          q.accepted[0]
            .replace(/[.!?]/g, "")
            .split(/\s+/)
            .map((v) => normalize(v))
            .sort(),
          q.id,
        );
    }
  }
  assert.equal(allIds.size, 4400);
});

test("new expression records are real labelled phrases, unique, licensed and do not replace the 156 earlier records", () => {
  const added = vocabulary.filter((w) => w.id.startsWith("dg-course-"));
  assert.equal(added.length, 536);
  assert.equal(vocabulary.length - added.length, 156);
  assert.equal(new Set(vocabulary.map((w) => w.id)).size, vocabulary.length);
  assert.equal(
    new Set(added.map((w) => normalize(w.german_word))).size,
    added.length,
  );
  for (const word of vocabulary)
    assert.deepEqual(validateVocabulary(word), [], word.id);
  for (const word of added) {
    assert.equal(word.word_type, "expression");
    assert.equal(word.german_word, word.example_sentence_de);
    assert.equal(word.turkish_meaning, word.example_sentence_tr);
  }
});

for (const level of LEVELS)
  test(`${level}: all eight exercise modes use actual content and valid blanks/tiles`, () => {
    for (const mode of [
      "choice",
      "blank",
      "matching",
      "sentence",
      "tr-de",
      "de-tr",
      "listening",
      "daily",
    ] as const) {
      const qs = generateQuestions(repo, level, mode, "2026-10-29");
      assert.equal(qs.length, 10, mode);
      for (const q of qs) {
        assert.ok(validQuestion(q), q.id);
        assert.ok(isCorrect(q, q.accepted[0]), q.id);
        assert.ok(
          q.wordIds.every((id) => repo.get(id)),
          q.id,
        );
        if (mode === "blank") assert.ok(q.prompt.includes("___"), q.id);
        if (q.options.length)
          assert.equal(
            q.options.filter((v) => isCorrect(q, v)).length,
            1,
            q.id,
          );
      }
    }
  });

test("new C2 course restores first mistake and correction without changing an existing A1 progress record", () => {
  const c = courseForUnit("c2-01")!;
  let tick = 1;
  let s = openCourse(initialCourses(), "a1-01-words", tick++);
  const old = structuredClone(s.progress["a1-01-words"]);
  s = openCourse(s, c.id, tick++);
  for (const step of c.steps)
    s = markCourseReading(s, c.id, "read", step.id, tick++);
  for (const e of c.examples)
    s = markCourseReading(s, c.id, "examples", e.id, tick++);
  const q = c.guided[0];
  s = submitCourseAnswer(
    s,
    c.id,
    "guided",
    q.id,
    q.options.find((v) => !isCorrect(q, v))!,
    tick++,
  );
  const mem = new Map<string, string>();
  const p = createCoursePersistence(() => ({
    getItem: (k) => mem.get(k) ?? null,
    setItem: (k, v) => {
      mem.set(k, v);
    },
  }));
  p.save(s);
  s = p.load().state;
  s = submitCourseAnswer(s, c.id, "guided", q.id, q.accepted[0], tick++);
  assert.deepEqual(
    s.progress[c.id].guided[q.id].map((a) => a.correct),
    [false, true],
  );
  assert.deepEqual(s.progress["a1-01-words"], old);
  assert.ok(validCourses(s));
  s = nextCourseQuestion(s, c.id, "guided", tick++);
  assert.equal(s.progress[c.id].guidedIndex, 1);
  assert.strictEqual(confirmCourseSummary(s, c.id, tick++), s);
});

test("adding the complete catalogue never changes an existing day's assignment", () => {
  for (const level of LEVELS) {
    const old = ensureDaily(
      placeAt(initialLearning(), level),
      vocabulary.filter(
        (w) => !w.id.startsWith("dg-course-"),
      ) as VocabularyRecord[],
      "2026-10-28",
    );
    assert.strictEqual(
      ensureDaily(old, vocabulary as VocabularyRecord[], "2026-10-28"),
      old,
    );
  }
});
