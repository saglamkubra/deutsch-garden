import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { miniCourses, highlightedExample } from "./content.ts";
import type { MiniCourse, CourseState } from "./types.ts";
import {
  initialCourses,
  openCourse,
  markCourseReading,
  exampleGate,
  submitCourseAnswer,
  nextCourseQuestion,
  confirmCourseSummary,
  unresolved,
  progressPercent,
} from "./engine.ts";
import {
  validCourses,
  createCoursePersistence,
  COURSE_KEY,
} from "./persistence.ts";
import {
  validQuestion,
  validState as validExercises,
} from "../exercises/persistence.ts";
import { isCorrect, normalize } from "../exercises/generate.ts";
import { curriculum } from "../learning/curriculum.ts";
import { originalA1 } from "../learning/seed.ts";
import {
  initialLearning,
  recordLessonCompletion,
  unitAvailable,
  enqueueReview,
} from "../learning/engine.ts";
import { createStarter, grantReward } from "../garden/model.ts";
import { initialExercises } from "../exercises/types.ts";
import assets from "../../data/courses/audio.json" with { type: "json" };
import additionalAudio from "../../data/courses/extra-audio.json" with { type: "json" };
import { courseAudio } from "./audio.ts";
const a1Courses = miniCourses.filter((c) =>
  ["a1-01-words", "a1-02-words"].includes(c.id),
);
let clock = 1;
const now = () => clock++;
function learned(c: MiniCourse) {
  let s = openCourse(initialCourses(), c.id, now());
  for (const step of c.steps)
    s = markCourseReading(s, c.id, "read", step.id, now());
  for (const e of c.examples)
    s = markCourseReading(s, c.id, "examples", e.id, now());
  return s;
}
function guided(s: CourseState, c: MiniCourse) {
  for (const q of c.guided) {
    s = submitCourseAnswer(s, c.id, "guided", q.id, q.accepted[0], now());
    s = nextCourseQuestion(s, c.id, "guided", now());
  }
  return s;
}
function practiced(s: CourseState, c: MiniCourse, firstWrong = false) {
  for (const [i, q] of c.independent.entries()) {
    const value =
      firstWrong && i === 0
        ? q.options.find((o) => !isCorrect(q, o))!
        : q.accepted[0];
    s = submitCourseAnswer(s, c.id, "independent", q.id, value, now());
    s = nextCourseQuestion(s, c.id, "independent", now());
  }
  return s;
}
test("existing IDs retained: two full A1 courses, 27 explained examples, 12 guided and 32 independent exercises", () => {
  assert.deepEqual(
    a1Courses.map((c) => c.id),
    ["a1-01-words", "a1-02-words"],
  );
  assert.equal(
    a1Courses.reduce((n, c) => n + c.examples.length, 0),
    27,
  );
  for (const c of a1Courses) {
    assert.ok(
      curriculum
        .find((u) => u.id === c.unitId)
        ?.lessons.some((l) => l.id === c.id),
    );
    assert.ok(c.steps.length >= 4);
    assert.ok(c.examples.length >= 10 && c.examples.length <= 15);
    assert.equal(c.guided.length, 6);
    assert.equal(c.independent.length, 16);
    assert.ok(
      c.summary.takeaways.length >= 5 && c.summary.takeaways.length <= 8,
    );
    for (const step of c.steps)
      for (const key of [
        "introduction",
        "rule",
        "usage",
        "structure",
        "mistake",
        "memory",
      ] as const)
        assert.ok(step[key].length > 25);
    for (const e of c.examples) {
      assert.ok(e.de && e.tr && e.explanation.length > 50);
      assert.ok(
        highlightedExample(e.de, e.highlights).some((p) => p.highlight),
      );
    }
  }
});
test("all 44 questions have meaningful rules, valid solutions, unique choices and exact sentence tile sets", () => {
  const ids = new Set<string>();
  for (const c of a1Courses) {
    const correctPositions = new Set<number>();
    for (const q of [...c.guided, ...c.independent]) {
      assert.ok(validQuestion(q));
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.ok(q.rule.length > 10 && q.explanation.length > 30);
      assert.ok(isCorrect(q, q.accepted[0]));
      assert.ok(
        q.reviewWordIds.every((id) => originalA1.some((w) => w.id === id)),
      );
      assert.ok(
        q.wordIds.every(
          (id) => id === c.id || originalA1.some((w) => w.id === id),
        ),
      );
      if (q.options.length) {
        assert.equal(q.options.filter((v) => isCorrect(q, v)).length, 1);
        correctPositions.add(q.options.findIndex((v) => isCorrect(q, v)));
      }
      if (q.tiles) {
        assert.deepEqual(
          normalize(q.accepted[0]).split(" ").sort(),
          q.tiles.map((v) => normalize(v)).sort(),
        );
        assert.ok(q.prompt.includes("İlk sözcük:"));
      }
    }
    assert.ok(correctPositions.size >= 2);
    assert.ok(new Set(c.independent.map((q) => q.type)).size >= 4);
  }
  assert.equal(ids.size, 44);
});
test("all 27 example recordings are real non-silent PCM with matching duration/hash; listening questions use actual examples", () => {
  assert.equal(Object.keys(assets).length, 27);
  for (const c of a1Courses) {
    for (const e of c.examples) {
      const a = assets[e.id as keyof typeof assets];
      assert.ok(a);
      const b = readFileSync(
        new URL("../../../public" + a.url, import.meta.url),
      );
      assert.equal(b.toString("ascii", 0, 4), "RIFF");
      assert.equal(b.toString("ascii", 8, 12), "WAVE");
      assert.equal(b.readUInt16LE(22), 1);
      assert.equal(b.readUInt16LE(34), 16);
      assert.ok(b.subarray(44).some((v) => v !== 0));
      assert.ok(
        Math.abs((b.length - 44) / 2 / b.readUInt32LE(24) - a.duration) < 0.01,
      );
      assert.equal(createHash("sha256").update(b).digest("hex"), a.sha256);
    }
    for (const q of c.independent.filter((q) => q.audioExampleId))
      assert.ok(c.examples.some((e) => e.id === q.audioExampleId));
    assert.equal(c.independent.filter((q) => q.audioExampleId).length, 1);
  }
});
test("reading, examples, guidance, independent work and summary are separate completion gates", () => {
  for (const c of miniCourses) {
    let s = openCourse(initialCourses(), c.id, now());
    assert.strictEqual(confirmCourseSummary(s, c.id, now()), s);
    assert.strictEqual(
      markCourseReading(s, c.id, "read", c.steps[1].id, now()),
      s,
    );
    assert.strictEqual(
      markCourseReading(s, c.id, "examples", c.examples[0].id, now()),
      s,
    );
    assert.strictEqual(
      submitCourseAnswer(
        s,
        c.id,
        "guided",
        c.guided[0].id,
        c.guided[0].accepted[0],
        now(),
      ),
      s,
    );
    s = learned(c);
    assert.equal(s.claims.length, 0);
    assert.strictEqual(
      submitCourseAnswer(
        s,
        c.id,
        "independent",
        c.independent[0].id,
        c.independent[0].accepted[0],
        now(),
      ),
      s,
    );
    s = guided(s, c);
    s = practiced(s, c);
    assert.equal(s.progress[c.id].completedAt, null);
    assert.equal(s.claims.length, 0);
    s = confirmCourseSummary(s, c.id, now());
    assert.ok(s.progress[c.id].completedAt !== null);
    assert.equal(s.claims.length, 1);
    assert.equal(progressPercent(c, s.progress[c.id]), 100);
    assert.ok(validCourses(s));
  }
});
test("guided wrong answer explains, persists attempts, queues a real review word and can be retried", () => {
  const c = miniCourses[0],
    q = c.guided[0];
  let s = learned(c);
  const wrong = q.options.find((o) => !isCorrect(q, o))!;
  s = submitCourseAnswer(s, c.id, "guided", q.id, wrong, now());
  assert.strictEqual(nextCourseQuestion(s, c.id, "guided", now()), s);
  assert.equal(s.progress[c.id].guided[q.id][0].correct, false);
  assert.equal(s.reviewQueue.length, 1);
  s = submitCourseAnswer(s, c.id, "guided", q.id, q.accepted[0], now());
  assert.equal(s.progress[c.id].guided[q.id].length, 2);
  assert.equal(s.progress[c.id].guided[q.id][0].value, wrong);
  assert.strictEqual(
    submitCourseAnswer(s, c.id, "guided", q.id, q.accepted[0], now()),
    s,
  );
  assert.ok(validCourses(s));
});
test("independent wrong answers cannot be overwritten; review preserves the original and unlocks completion", () => {
  for (const c of miniCourses) {
    let s = practiced(guided(learned(c), c), c, true);
    const q = c.independent[0],
      first = s.progress[c.id].independent[q.id];
    assert.equal(unresolved(c, s.progress[c.id]).length, 1);
    assert.strictEqual(confirmCourseSummary(s, c.id, now()), s);
    assert.strictEqual(
      submitCourseAnswer(s, c.id, "independent", q.id, q.accepted[0], now()),
      s,
    );
    s = submitCourseAnswer(s, c.id, "review", q.id, first.value, now());
    assert.equal(s.progress[c.id].reviews[q.id][0].correct, false);
    s = submitCourseAnswer(s, c.id, "review", q.id, q.accepted[0], now());
    assert.deepEqual(s.progress[c.id].independent[q.id], first);
    assert.equal(unresolved(c, s.progress[c.id]).length, 0);
    s = confirmCourseSummary(s, c.id, now());
    assert.equal(s.claims.length, 1);
    assert.ok(validCourses(s));
  }
});
test("last question cannot advance beyond bounds and stale/unknown submissions cannot award progress", () => {
  const c = miniCourses[0];
  let s = guided(learned(c), c);
  assert.equal(s.progress[c.id].guidedIndex, 5);
  assert.strictEqual(nextCourseQuestion(s, c.id, "guided", now()), s);
  const last = c.independent.at(-1)!;
  assert.strictEqual(
    submitCourseAnswer(
      s,
      c.id,
      "independent",
      last.id,
      last.accepted[0],
      now(),
    ),
    s,
  );
  s = practiced(s, c);
  assert.equal(s.progress[c.id].independentIndex, 15);
  assert.strictEqual(nextCourseQuestion(s, c.id, "independent", now()), s);
  assert.strictEqual(openCourse(s, "unknown", now()), s);
});
test("new full-course completion preserves existing words, SRS dates, assignments, milestones and unlocks old next node", () => {
  const original = {
    ...initialLearning(),
    milestones: ["a1-09-words"],
    progress: {
      [originalA1[0].id]: {
        introducedOn: "2026-10-26",
        dueOn: "2026-11-02",
        known: true,
        streak: 3,
        lastAnsweredOn: "2026-10-26",
        responses: 4,
      },
    },
  };
  const next = recordLessonCompletion(original, "a1-01-words");
  assert.equal(next.progress, original.progress);
  assert.equal(next.assignments, original.assignments);
  assert.equal(next.unitAnswers, original.unitAnswers);
  assert.deepEqual(next.milestones, ["a1-09-words", "a1-01-words"]);
  assert.ok(unitAvailable(next, "a1-02"));
  assert.strictEqual(recordLessonCompletion(next, "a1-01-words"), next);
  assert.strictEqual(recordLessonCompletion(original, "made-up"), original);
  const review = enqueueReview(
    next,
    originalA1[0].id,
    "2026-10-27",
    originalA1,
  );
  assert.equal(review.progress[originalA1[0].id].responses, 4);
  assert.equal(review.progress[originalA1[0].id].streak, 3);
});
test("completion receipts and existing garden/XP ledgers remain idempotent across refresh/reopen", () => {
  const c = miniCourses[0];
  let s = confirmCourseSummary(
    practiced(guided(learned(c), c), c),
    c.id,
    now(),
  );
  const prior = structuredClone(s);
  s = openCourse(s, c.id, now());
  s = confirmCourseSummary(s, c.id, now());
  assert.deepEqual(s, prior);
  let g = createStarter(0);
  const coins = g.coins;
  for (const receipt of [...s.claims, ...s.claims])
    g = grantReward(g, { id: receipt.id, source: "exercise", coins: 10 });
  assert.equal(g.coins, coins + 10);
  assert.ok(
    validExercises({
      ...initialExercises(),
      xp: { "existing-exercise": 5, [s.claims[0].id]: 20 },
    }),
  );
  assert.equal(
    validExercises({ ...initialExercises(), xp: { "course:lesson:x": 15 } }),
    false,
  );
});
test("storage restore preserves current question, initial mistakes, guided attempts and pending claims", () => {
  const c = miniCourses[0],
    mem = new Map<string, string>(),
    p = createCoursePersistence(() => ({
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => {
        mem.set(k, v);
      },
    }));
  let s = guided(learned(c), c);
  const q = c.independent[0];
  s = submitCourseAnswer(
    s,
    c.id,
    "independent",
    q.id,
    q.options.find((o) => !isCorrect(q, o))!,
    now(),
  );
  p.save(s);
  assert.deepEqual(p.load().state, s);
  assert.equal(p.load().state.progress[c.id].independentIndex, 0);
  s = nextCourseQuestion(s, c.id, "independent", now());
  p.save(s);
  assert.equal(p.load().state.progress[c.id].independentIndex, 1);
  assert.ok(mem.has(COURSE_KEY + ":backup"));
});
test("corrupt/future storage stays protected, unavailable storage is read-only and forged completion is rejected", () => {
  const mem = new Map([[COURSE_KEY, "broken"]]),
    p = createCoursePersistence(() => ({
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => {
        mem.set(k, v);
      },
    }));
  p.load();
  assert.equal(mem.get(COURSE_KEY + ":corrupt"), "broken");
  mem.set(COURSE_KEY, '{"version":99}');
  assert.equal(p.load().readonly, true);
  assert.throws(() => p.save(initialCourses()));
  assert.equal(mem.get(COURSE_KEY), '{"version":99}');
  assert.equal(
    createCoursePersistence(() => {
      throw Error("blocked");
    }).load().readonly,
    true,
  );
  const s = openCourse(initialCourses(), miniCourses[0].id, now());
  s.progress[miniCourses[0].id].completedAt = now();
  assert.equal(validCourses(s), false);
});
test("all 1419 examples have matching hosted speech, with unchanged originals and valid compact MP3 frames", () => {
  assert.equal(Object.keys(courseAudio).length, 1419);
  assert.equal(Object.keys(additionalAudio.examples).length, 1392);
  for (const [id, asset] of Object.entries(assets))
    assert.deepEqual(courseAudio[id], asset);
  const checked = new Set<string>();
  for (const course of miniCourses)
    for (const example of course.examples) {
      const asset = courseAudio[example.id];
      assert.ok(asset, example.id);
      if (!asset.textSha256) continue; // Existing original WAVs have their own PCM test above.
      assert.equal(
        asset.textSha256,
        createHash("sha256").update(example.de).digest("hex"),
      );
      if (checked.has(asset.url)) continue;
      checked.add(asset.url);
      const bytes = readFileSync(
        new URL("../../../public" + asset.url, import.meta.url),
      );
      assert.equal(
        createHash("sha256").update(bytes).digest("hex"),
        asset.sha256,
      );
      assert.ok(bytes.length > 1000);
      let offset = 0,
        duration = 0,
        frames = 0;
      while (offset < bytes.length) {
        const h = bytes.readUInt32BE(offset);
        assert.equal(h >>> 21, 2047, asset.url);
        const version = (h >>> 19) & 3,
          layer = (h >>> 17) & 3;
        assert.notEqual(version, 1);
        assert.equal(layer, 1);
        const frequency =
          [44100, 48000, 32000][(h >>> 10) & 3] /
          (version === 3 ? 1 : version === 2 ? 2 : 4);
        const table =
          version === 3
            ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
            : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
        const bitrate = table[(h >>> 12) & 15] * 1000;
        assert.ok(frequency > 0 && bitrate > 0);
        offset +=
          Math.floor(((version === 3 ? 144 : 72) * bitrate) / frequency) +
          ((h >>> 9) & 1);
        assert.ok(offset <= bytes.length);
        duration += (version === 3 ? 1152 : 576) / frequency;
        frames++;
      }
      assert.equal(offset, bytes.length);
      assert.ok(frames > 5 && duration > 0.3);
      assert.ok(Math.abs(asset.duration - duration) < 0.001);
    }
  assert.equal(checked.size, 608);
});

test("example gates identify the exact unfinished prerequisite; acknowledgement never requires device speech", () => {
  for (const course of miniCourses) {
    assert.equal(
      exampleGate(course, undefined, course.examples[0].id).kind,
      "loading",
    );
    let state = openCourse(initialCourses(), course.id, 1);
    assert.deepEqual(
      exampleGate(course, state.progress[course.id], course.examples[0].id),
      { kind: "teaching", index: 0 },
    );
    const blocked = markCourseReading(
      state,
      course.id,
      "examples",
      course.examples[0].id,
      2,
    );
    assert.equal(blocked, state);
    for (const step of course.steps)
      state = markCourseReading(state, course.id, "read", step.id, 3);
    assert.deepEqual(
      exampleGate(course, state.progress[course.id], course.examples[1].id),
      { kind: "example", index: 0 },
    );
    assert.equal(
      markCourseReading(state, course.id, "examples", course.examples[1].id, 4),
      state,
    );
    state = markCourseReading(
      state,
      course.id,
      "examples",
      course.examples[0].id,
      5,
    );
    assert.ok(
      state.progress[course.id].examples.includes(course.examples[0].id),
    );
    assert.equal(
      exampleGate(course, state.progress[course.id], course.examples[1].id)
        .kind,
      "ready",
    );
    assert.equal(state.claims.length, 0);
    assert.ok(validCourses(state));
  }
});

test("German highlights preserve exact text and do not match parts of unrelated words", () => {
  const parts = highlightedExample("Er wohnt hier. Berlin ist schön.", [
    "Er",
    "ist",
  ]);
  assert.equal(
    parts.map((p) => p.text).join(""),
    "Er wohnt hier. Berlin ist schön.",
  );
  assert.equal(parts.filter((p) => p.highlight).length, 2);
});
