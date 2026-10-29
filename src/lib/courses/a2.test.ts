import test from "node:test";
import assert from "node:assert/strict";
import { miniCourses } from "./content.ts";
import {
  initialCourses,
  openCourse,
  markCourseReading,
  submitCourseAnswer,
  nextCourseQuestion,
  confirmCourseSummary,
  progressPercent,
} from "./engine.ts";
import { createCoursePersistence, validCourses } from "./persistence.ts";
import { validQuestion } from "../exercises/persistence.ts";
import { isCorrect, normalize } from "../exercises/generate.ts";
import { LocalVocabularyRepository } from "../learning/repository.ts";
import type { VocabularyRecord } from "../learning/types.ts";
import { originalA1 } from "../learning/seed.ts";
import { createStarter, grantReward } from "../garden/model.ts";
import vocabulary from "../../data/vocabulary.json" with { type: "json" };
import {
  initialLearning,
  ensureDaily,
  placeAt,
  recordLessonCompletion,
  unitAvailable,
} from "../learning/engine.ts";

for (const c of miniCourses.filter((course) =>
  ["a2-01-words", "a2-02-words", "a2-03-words"].includes(course.id),
)) {
  test(
    c.id +
      " has substantial teaching, bilingual contexts and 80 explained questions",
    () => {
      assert.equal(c.level, "A2");
      assert.equal(c.steps.length, 14);
      assert.equal(c.examples.length, 24);
      assert.equal(c.guided.length, 20);
      assert.equal(c.independent.length, 60);
      assert.equal(c.texts?.length, 2);
      for (const step of c.steps) {
        assert.ok(step.details && step.details.length >= 2);
        assert.ok(
          [
            step.introduction,
            step.rule,
            step.usage,
            ...step.details.map((d) => d.body),
          ]
            .join(" ")
            .split(/\s+/).length >= 100,
        );
      }
      for (const text of c.texts!) {
        assert.ok(text.de.length > 250 && text.tr.length > 250);
        assert.ok(text.notes.length > 30);
      }
      const questions = [...c.guided, ...c.independent];
      assert.equal(new Set(questions.map((q) => q.id)).size, 80);
      for (const q of questions) {
        assert.ok(validQuestion(q), q.id);
        assert.ok(q.explanation.length > 30 && q.rule.length >= 8, q.id);
        for (const answer of q.accepted) assert.ok(isCorrect(q, answer), q.id);
        if (q.options.length) {
          assert.equal(
            q.options.filter((o) => isCorrect(q, o)).length,
            1,
            q.id,
          );
          for (const option of q.options)
            assert.ok(q.optionNotes?.[option], q.id);
        }
        if (q.contextId)
          assert.ok(
            c.texts!.some((t) => t.id === q.contextId),
            q.id,
          );
        if (q.tiles?.length)
          assert.deepEqual(
            q.tiles.map((value) => normalize(value)).sort(),
            q.accepted[0]
              .replace(/[.!?]/g, "")
              .split(/\s+/)
              .map((value) => normalize(value))
              .sort(),
            q.id,
          );
      }
    },
  );

  test(
    c.id + " vocabulary integrates without altering 60 existing A1 words",
    () => {
      const repo = new LocalVocabularyRepository(
        vocabulary as VocabularyRecord[],
      );
      assert.equal(
        repo.byUnit(c.unitId).length,
        c.unitId === "a2-01" ? 36 : 30,
      );
      assert.equal(
        repo.byLevel("A2").filter((w) => !w.id.startsWith("dg-course-")).length,
        96,
      );
      for (const old of originalA1) assert.deepEqual(repo.get(old.id), old);
      for (const q of [...c.guided, ...c.independent]) {
        for (const id of q.reviewWordIds) assert.ok(repo.get(id), id);
      }
    },
  );

  test(
    c.id +
      " incorrect attempt and real review word persist before a successful retry",
    () => {
      let time = 1;
      let state = openCourse(initialCourses(), c.id, time++);
      for (const step of c.steps)
        state = markCourseReading(state, c.id, "read", step.id, time++);
      for (const example of c.examples)
        state = markCourseReading(state, c.id, "examples", example.id, time++);
      const q = c.guided[0];
      const wrong = q.options.find((value) => !isCorrect(q, value))!;
      state = submitCourseAnswer(state, c.id, "guided", q.id, wrong, time++);
      assert.equal(state.progress[c.id].guided[q.id][0].correct, false);
      assert.ok(state.reviewQueue.length > 0);
      assert.ok(
        state.reviewQueue.every((r) =>
          vocabulary.some((w) => w.id === r.wordId),
        ),
      );
      const mem = new Map<string, string>();
      const storage = createCoursePersistence(() => ({
        getItem: (k) => mem.get(k) ?? null,
        setItem: (k, v) => {
          mem.set(k, v);
        },
      }));
      storage.save(state);
      state = storage.load().state;
      assert.strictEqual(
        nextCourseQuestion(state, c.id, "guided", time++),
        state,
      );
      state = submitCourseAnswer(
        state,
        c.id,
        "guided",
        q.id,
        q.accepted[0],
        time++,
      );
      assert.deepEqual(
        state.progress[c.id].guided[q.id].map((a) => a.correct),
        [false, true],
      );
      assert.equal(state.claims.length, 0);
      assert.ok(validCourses(state));
    },
  );

  test(
    c.id +
      " completion survives restore, preserves A1 progress and awards one receipt only",
    () => {
      let time = 1;
      let state = openCourse(initialCourses(), "a1-01-words", time++);
      state = markCourseReading(
        state,
        "a1-01-words",
        "read",
        miniCourses[0].steps[0].id,
        time++,
      );
      const old = structuredClone(state.progress["a1-01-words"]);
      state = openCourse(state, c.id, time++);
      assert.strictEqual(confirmCourseSummary(state, c.id, time++), state);
      for (const step of c.steps)
        state = markCourseReading(state, c.id, "read", step.id, time++);
      for (const example of c.examples)
        state = markCourseReading(state, c.id, "examples", example.id, time++);
      for (const mode of ["guided", "independent"] as const) {
        for (const q of c[mode]) {
          state = submitCourseAnswer(
            state,
            c.id,
            mode,
            q.id,
            q.accepted[0],
            time++,
          );
          state = nextCourseQuestion(state, c.id, mode, time++);
        }
      }
      state = confirmCourseSummary(state, c.id, time++);
      assert.equal(progressPercent(c, state.progress[c.id]), 100);
      assert.ok(validCourses(state));
      assert.deepEqual(state.progress["a1-01-words"], old);
      const mem = new Map<string, string>();
      const storage = createCoursePersistence(() => ({
        getItem: (k) => mem.get(k) ?? null,
        setItem: (k, v) => {
          mem.set(k, v);
        },
      }));
      storage.save(state);
      assert.deepEqual(storage.load().state, state);
      state = confirmCourseSummary(
        openCourse(storage.load().state, c.id, time++),
        c.id,
        time++,
      );
      assert.equal(state.claims.length, 1);
      let garden = createStarter(0);
      const coins = garden.coins;
      for (const receipt of [...state.claims, ...state.claims])
        garden = grantReward(garden, {
          id: receipt.id,
          source: "exercise",
          coins: 10,
        });
      assert.equal(garden.coins, coins + 10);
    },
  );
}

test("new A2 units follow existing unlocks and do not replace a frozen daily assignment", () => {
  const before = ensureDaily(
    placeAt(initialLearning(), "A2"),
    vocabulary.filter((w) =>
      w.unit_ids.includes("a2-01"),
    ) as VocabularyRecord[],
    "2026-10-28",
  );
  assert.strictEqual(
    ensureDaily(before, vocabulary as VocabularyRecord[], "2026-10-28"),
    before,
  );
  assert.equal(unitAvailable(before, "a2-02"), false);
  const first = recordLessonCompletion(before, "a2-01-words");
  assert.equal(unitAvailable(first, "a2-02"), true);
  assert.equal(unitAvailable(first, "a2-03"), false);
  const second = recordLessonCompletion(first, "a2-02-words");
  assert.equal(unitAvailable(second, "a2-03"), true);
  assert.strictEqual(second.assignments, before.assignments);
  assert.strictEqual(second.progress, before.progress);
  assert.strictEqual(recordLessonCompletion(second, "a2-02-words"), second);
});

test("all added A2 vocabulary has stable unique IDs and no accidental duplicate headwords", () => {
  const originalBatch = vocabulary.filter(
    (w) => !w.id.startsWith("dg-course-"),
  );
  assert.equal(originalBatch.length, 156);
  assert.equal(new Set(vocabulary.map((w) => w.id)).size, vocabulary.length);
  const key = (w: { german_word: string }) =>
    w.german_word.normalize("NFC").toLocaleLowerCase("de-DE");
  for (const word of vocabulary.filter((w) => w.cefr_level === "A2")) {
    assert.equal(
      vocabulary.filter((w) => key(w) === key(word)).length,
      1,
      word.german_word,
    );
  }
});
