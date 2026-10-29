import { test } from "node:test";
import assert from "node:assert/strict";
import {
  a1Topics,
  a2Topics,
  b1Topics,
  b2Topics,
  c1Topics,
  c2Topics,
  topics,
  topicById,
} from "./content.ts";
import { createGrammarTopics } from "./builder.ts";
import { a2Specs } from "./a2-specs.ts";
import { validSnapshot } from "../account/snapshot.ts";
import { initialGrammar } from "./types.ts";
import type { GrammarState } from "./types.ts";
import {
  openTopic,
  bookmark,
  markRead,
  practice,
  beginQuiz,
  answerQuiz,
  advanceQuiz,
  score,
  needsReview,
  filterTopics,
} from "./engine.ts";
import { isCorrect, normalize } from "../exercises/generate.ts";
import { exampleParts } from "./examples.ts";
import {
  createGrammarPersistence,
  GRAMMAR_KEY,
  validGrammar,
} from "./persistence.ts";
import { createStarter, grantReward } from "../garden/model.ts";
function finish(
  s: GrammarState,
  topicId: string,
  correct = 5,
  attemptId = "test-" + topicId,
) {
  s = beginQuiz(s, topicId, attemptId, 100);
  for (let i = 0; i < 5; i++) {
    const a = s.attempts[attemptId];
    s = answerQuiz(
      s,
      attemptId,
      i < correct ? a.questions[i].accepted[0] : "yanlış",
      200 + i,
    );
    if (i < 4) s = advanceQuiz(s, attemptId);
  }
  return s;
}
function complete(s: GrammarState, id: string, attempt = "test-" + id) {
  s = openTopic(s, id, 1);
  s = markRead(s, id, 2);
  s = practice(s, id, topicById(id)!.lesson!.practice.accepted[0], 3);
  return finish(s, id, 5, attempt);
}
test("66 stable topics, 16 authored A1 lessons, 80 quiz questions and 16 practices", () => {
  assert.equal(topics.length, 66);
  assert.equal(a1Topics.length, 16);
  const counts = Object.fromEntries(
    ["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => [
      l,
      topics.filter((t) => t.level === l).length,
    ]),
  );
  assert.deepEqual(counts, { A1: 16, A2: 12, B1: 12, B2: 10, C1: 9, C2: 7 });
  assert.equal(new Set(topics.map((t) => t.id)).size, 66);
  const ids: string[] = [];
  for (const t of a1Topics) {
    const l = t.lesson!;
    assert.ok(l.intro.length > 90);
    assert.equal(l.rules.length, 4);
    assert.ok(l.objectives.length >= 2);
    assert.ok(l.examples.length >= 2);
    assert.ok(l.tip && l.mistake.why);
    assert.equal(l.quiz.length, 5);
    ids.push(l.practice.id, ...l.quiz.map((q) => q.id));
    for (const q of [l.practice, ...l.quiz]) {
      assert.ok(q.accepted.length && q.explanation);
      assert.ok(isCorrect(q, q.accepted[0]));
      if (q.options.length) {
        assert.equal(
          new Set(q.options.map((x) => normalize(x))).size,
          q.options.length,
        );
        assert.equal(q.options.filter((x) => isCorrect(q, x)).length, 1);
      }
      if (q.tiles) {
        for (const accepted of q.accepted)
          assert.deepEqual(
            normalize(accepted).split(" ").sort(),
            q.tiles.map((x) => normalize(x)).sort(),
          );
      }
    }
  }
  assert.equal(new Set(ids).size, 96);
  assert.ok(topics.every((t) => t.lesson));
});
test("all 12 A2 topics retain stable IDs and contain substantial teaching, worked examples and 288 explained questions", () => {
  assert.equal(a2Topics.length, 12);
  assert.equal(topics.filter((t) => t.lesson).length, 66);
  assert.equal(topics.filter((t) => !t.lesson).length, 0);
  const ids = new Set<string>();
  for (const [i, t] of a2Topics.entries()) {
    assert.equal(t.id, `grammar-a2-${String(i + 1).padStart(2, "0")}`);
    assert.equal(topicById(t.id), t);
    const lesson = t.lesson!;
    assert.ok(lesson.intro.length > 200);
    assert.equal(lesson.rules.length, 8);
    assert.equal(lesson.ruleHeadings?.length, 8);
    assert.ok(lesson.ruleHeadings?.every((s) => s.length > 5));
    assert.ok(lesson.rules.every((s) => s.length > 150));
    assert.equal(lesson.examples.length, 8);
    assert.equal(lesson.quiz.length, 24);
    assert.equal(new Set(lesson.quiz.map((q) => q.prompt)).size, 24);
    assert.deepEqual([...new Set(lesson.quiz.map((q) => q.type))].sort(), [
      "blank",
      "choice",
      "sentence",
    ]);
    for (const q of [lesson.practice, ...lesson.quiz]) {
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.ok(q.explanation.length > 60);
      assert.ok(isCorrect(q, q.accepted[0]));
      if (q.options.length) {
        assert.equal(q.options.filter((x) => isCorrect(q, x)).length, 1);
        assert.equal(
          new Set(q.options.map((s) => normalize(s))).size,
          q.options.length,
        );
      }
      if (q.tiles)
        assert.deepEqual(
          q.tiles.map((s) => normalize(s)).sort(),
          normalize(q.accepted[0]).split(" ").sort(),
        );
    }
    for (const e of lesson.examples) {
      assert.ok(e.de && e.tr && e.explanation);
      assert.equal(
        exampleParts(e)
          .map((p) => p.text)
          .join(""),
        e.de,
      );
      for (const h of e.highlights)
        assert.ok(exampleParts(e).some((p) => p.highlight === h));
    }
    // Repairing only the marked fragment must actually produce the corrected example.
    assert.equal(
      [...a2Specs[i].mistake.wrong.matchAll(/\[([^\]]+)\]/g)].length,
      1,
    );
  }
  assert.equal(ids.size, 300);
});

test("A2 key distinctions have independently specified answers, not only self-consistent generated choices", () => {
  const expected: Record<string, [number, string][]> = {
    "grammar-a2-01": [
      [1, "den Autos"],
      [4, "helfen"],
    ],
    "grammar-a2-02": [
      [2, "Ich gebe es dir."],
      [8, "ihn sehen / ihm helfen"],
    ],
    "grammar-a2-03": [
      [2, "in das Zimmer"],
      [6, "mit"],
    ],
    "grammar-a2-04": [
      [1, "Ich bin nach Hause gegangen."],
      [6, "angerufen"],
    ],
    "grammar-a2-05": [
      [1, "Gelmem gerekmiyordu."],
      [2, "Gelmeme izin yoktu."],
    ],
    "grammar-a2-06": [
      [1, "ich ve du"],
      [5, "Setzen Sie sich bitte."],
    ],
    "grammar-a2-07": [
      [1, "gut"],
      [5, "lieber"],
    ],
    "grammar-a2-08": [
      [3, "roten"],
      [5, "die schönen Blumen"],
    ],
    "grammar-a2-09": [
      [3, "weil ich lernen muss"],
      [4, "dass er gekommen ist"],
    ],
    "grammar-a2-10": [
      [1, "denn"],
      [2, "sondern"],
    ],
    "grammar-a2-11": [
      [3, "Fahr!"],
      [4, "Arbeite!"],
    ],
    "grammar-a2-12": [
      [2, "Mastar"],
      [7, "Wann wirst du anrufen?"],
    ],
  };
  for (const [id, answers] of Object.entries(expected))
    for (const [number, answer] of answers) {
      const q = topicById(id)!.lesson!.quiz[number - 1];
      assert.ok(isCorrect(q, answer), q.id);
      for (const wrong of q.options.filter((x) => x !== answer))
        assert.ok(!isCorrect(q, wrong));
    }
});

function finishLongQuiz(
  s: GrammarState,
  id: string,
  attempt: string,
  correct: number,
) {
  s = beginQuiz(s, id, attempt, 100);
  const memory = new Map<string, string>();
  const persistence = createGrammarPersistence(() => ({
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value);
    },
  }));
  for (let i = 0; i < 24; i++) {
    const q = s.attempts[attempt].questions[i];
    s = answerQuiz(s, attempt, i < correct ? q.accepted[0] : "yanlış", 110 + i);
    assert.ok(validGrammar(s));
    persistence.save(s);
    const restored = persistence.load();
    assert.equal(restored.notice, "");
    assert.deepEqual(restored.state, s);
    s = advanceQuiz(restored.state, attempt);
  }
  return s;
}

test("all A2 tests persist each answer; 19/24 fails, 20/24 plus reading and practice completes once", () => {
  for (const topic of a2Topics) {
    const id = topic.id;
    let s = finishLongQuiz(
      openTopic(initialGrammar(), id, 1),
      id,
      "unread",
      24,
    );
    assert.equal(s.claims.length, 0);
    s = markRead(s, id, 200);
    assert.equal(s.claims.length, 0);
    s = practice(s, id, topic.lesson!.practice.accepted[0], 201);
    assert.ok(s.progress[id].completedAt);
    const claims = structuredClone(s.claims);
    s = finishLongQuiz(s, id, "repeat", 24);
    assert.deepEqual(s.claims, claims);

    s = markRead(openTopic(initialGrammar(), id, 1), id, 2);
    s = practice(s, id, topic.lesson!.practice.accepted[0], 3);
    s = finishLongQuiz(s, id, "failed", 19);
    assert.equal(s.progress[id].completedAt, null);
    assert.equal(s.claims.length, 0);
    s = finishLongQuiz(s, id, "passed", 20);
    assert.ok(s.progress[id].completedAt);
    assert.equal(
      s.claims.filter((c) => c.id === "grammar:topic:" + id).length,
      1,
    );
    assert.equal(Object.keys(s.attempts.failed.answers).length, 24);
  }
});

test("old A1 five-question history and all A2 completions coexist in the existing cloud snapshot", () => {
  const oldId = a1Topics[0].id;
  let s = openTopic(initialGrammar(), oldId, 1);
  s = markRead(s, oldId, 2);
  s = practice(s, oldId, a1Topics[0].lesson!.practice.accepted[0], 3);
  s = finish(s, oldId);
  const original = structuredClone(s);
  for (const topic of a2Topics) {
    s = openTopic(s, topic.id, 10);
    s = markRead(s, topic.id, 11);
    s = practice(s, topic.id, topic.lesson!.practice.accepted[0], 12);
    s = finishLongQuiz(s, topic.id, topic.id, 24);
  }
  assert.deepEqual(s.progress[oldId], original.progress[oldId]);
  assert.deepEqual(
    s.attempts["test-" + oldId],
    original.attempts["test-" + oldId],
  );
  assert.equal(
    Object.values(s.progress).filter((p) => p.completedAt !== null).length,
    13,
  );
  assert.equal(s.claims.filter((c) => c.xp === 15).length, 13);
  assert.equal(s.claims.filter((c) => c.seed).length, 2);
  assert.ok(
    validSnapshot(
      JSON.parse(JSON.stringify({ version: 1, modules: { grammar: s } })),
    ),
  );
});

test("shared grammar builder reproduces existing A2 lessons and question snapshots exactly", () => {
  assert.deepEqual(createGrammarTopics("A2", a2Specs), a2Topics);
});

test("12 B1 topics replace only their planned IDs and provide 96 substantial rules, 96 bilingual examples and 288 questions", () => {
  assert.equal(b1Topics.length, 12);
  const ids = new Set<string>();
  for (const [i, topic] of b1Topics.entries()) {
    assert.equal(topic.id, `grammar-b1-${String(i + 1).padStart(2, "0")}`);
    assert.equal(topicById(topic.id), topic);
    const lesson = topic.lesson!;
    assert.ok(lesson.intro.length > 200);
    assert.equal(lesson.rules.length, 8);
    assert.equal(lesson.ruleHeadings?.length, 8);
    assert.ok(lesson.rules.every((r) => r.length > 150));
    assert.ok(lesson.ruleHeadings?.every((h) => h.length > 5));
    assert.equal(lesson.examples.length, 8);
    assert.equal(lesson.quiz.length, 24);
    assert.equal(new Set(lesson.quiz.map((q) => q.prompt)).size, 24);
    assert.ok(!lesson.mistake.right.includes("["));
    for (const example of lesson.examples) {
      assert.ok(example.tr && example.de && example.explanation);
      assert.equal(
        exampleParts(example)
          .map((p) => p.text)
          .join(""),
        example.de,
      );
    }
    for (const q of [lesson.practice, ...lesson.quiz]) {
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.ok(q.explanation.length > 60);
      assert.ok(isCorrect(q, q.accepted[0]));
      if (q.options.length) {
        assert.equal(q.options.filter((v) => isCorrect(q, v)).length, 1);
        assert.equal(
          new Set(q.options.map((v) => normalize(v))).size,
          q.options.length,
        );
      }
      if (q.tiles)
        assert.deepEqual(
          q.tiles.map((v) => normalize(v)).sort(),
          normalize(q.accepted[0]).split(" ").sort(),
        );
    }
  }
  assert.equal(ids.size, 300);
  assert.equal(
    filterTopics(initialGrammar(), { level: "B1", status: "ready" }).length,
    12,
  );
  assert.equal(
    filterTopics(initialGrammar(), { level: "B1", status: "planned" }).length,
    0,
  );
});

test("B1 contrasting forms have independent reference answers and current infinitive comma guidance", () => {
  const expected: Record<string, [number, string][]> = {
    "grammar-b1-01": [
      [2, "denen"],
      [5, "der"],
    ],
    "grammar-b1-02": [
      [5, "wärst"],
      [7, "Nazik sipariş verir."],
    ],
    "grammar-b1-03": [
      [3, "worden"],
      [6, "muss gemacht werden"],
    ],
    "grammar-b1-04": [
      [2, "anzurufen"],
      [3, "zu besuchen"],
    ],
    "grammar-b1-05": [
      [2, "ob"],
      [6, "lernen kann"],
    ],
    "grammar-b1-06": [
      [2, "war gegangen"],
      [3, "hatte gearbeitet"],
    ],
    "grammar-b1-07": [
      [1, "des"],
      [4, "Dativ"],
    ],
    "grammar-b1-08": [
      [2, "an + Dativ"],
      [3, "mit wem"],
    ],
    "grammar-b1-09": [
      [3, "kalte Milch"],
      [7, "ein ailesi"],
    ],
    "grammar-b1-10": [
      [1, "immer wenn"],
      [7, "Olur olmaz"],
    ],
    "grammar-b1-11": [[8, "Ich weiß nicht, ob sie kommt."]],
    "grammar-b1-12": [
      [1, "ob"],
      [2, "wann er kommt"],
    ],
  };
  for (const [id, pairs] of Object.entries(expected))
    for (const [number, answer] of pairs) {
      const q = topicById(id)!.lesson!.quiz[number - 1];
      assert.ok(isCorrect(q, answer), q.id);
      for (const wrong of q.options.filter((v) => v !== answer))
        assert.ok(!isCorrect(q, wrong));
    }
  assert.match(topicById("grammar-b1-04")!.lesson!.rules[7], /2024/);
  assert.match(
    topicById("grammar-b1-04")!.lesson!.rules[7],
    /isteğe bağlı sayma/,
  );
});

test("every B1 quiz resumes at each answer, enforces all gates and 20/24, and cannot issue duplicate rewards", () => {
  for (const topic of b1Topics) {
    const id = topic.id;
    let s = finishLongQuiz(
      openTopic(initialGrammar(), id, 1),
      id,
      "unread",
      24,
    );
    assert.equal(s.claims.length, 0);
    s = markRead(s, id, 200);
    assert.equal(s.claims.length, 0);
    assert.equal(practice(s, id, "yanlış", 201), s);
    s = practice(s, id, topic.lesson!.practice.accepted[0], 202);
    assert.ok(s.progress[id].completedAt);
    const claims = structuredClone(s.claims);
    s = finishLongQuiz(s, id, "repeat", 24);
    assert.deepEqual(s.claims, claims);

    s = markRead(openTopic(initialGrammar(), id, 1), id, 2);
    s = practice(s, id, topic.lesson!.practice.accepted[0], 3);
    s = finishLongQuiz(s, id, "fail", 19);
    assert.equal(s.claims.length, 0);
    assert.equal(s.progress[id].completedAt, null);
    s = finishLongQuiz(s, id, "pass", 20);
    assert.ok(s.progress[id].completedAt);
    assert.equal(
      s.claims.filter((c) => c.id === "grammar:topic:" + id).length,
      1,
    );
    const last = s.attempts.pass.questions.at(-1)!;
    assert.equal(answerQuiz(s, "pass", last.accepted[0], 300), s);
  }
});

test("A1/A2 histories and inventory receipts survive all B1 completions in the existing cloud snapshot", () => {
  const a1 = a1Topics[0],
    a2 = a2Topics[0];
  let s = initialGrammar();
  for (const topic of [a1, a2]) {
    s = openTopic(s, topic.id, 1);
    s = markRead(s, topic.id, 2);
    s = practice(s, topic.id, topic.lesson!.practice.accepted[0], 3);
    s =
      topic.level === "A1"
        ? finish(s, topic.id)
        : finishLongQuiz(s, topic.id, topic.id, 24);
  }
  const old = structuredClone(s);
  for (const topic of b1Topics) {
    s = openTopic(s, topic.id, 1);
    s = markRead(s, topic.id, 2);
    s = practice(s, topic.id, topic.lesson!.practice.accepted[0], 3);
    s = finishLongQuiz(s, topic.id, topic.id, 24);
  }
  for (const topic of [a1, a2])
    assert.deepEqual(s.progress[topic.id], old.progress[topic.id]);
  for (const [id, attempt] of Object.entries(old.attempts))
    assert.deepEqual(s.attempts[id], attempt);
  for (const claim of old.claims)
    assert.deepEqual(
      s.claims.find((c) => c.id === claim.id),
      claim,
    );
  assert.equal(s.claims.filter((c) => c.xp === 15).length, 14);
  assert.equal(s.claims.filter((c) => c.seed).length, 2);
  assert.ok(
    validSnapshot(
      JSON.parse(JSON.stringify({ version: 1, modules: { grammar: s } })),
    ),
  );
});

test("examples preserve German and never highlight a substring inside another word", () => {
  for (const t of a1Topics)
    for (const e of t.lesson!.examples) {
      const pieces = exampleParts(e);
      assert.equal(pieces.map((p) => p.text).join(""), e.de);
      assert.ok(pieces.some((p) => p.highlight));
    }
  const example = a1Topics[0].lesson!.examples[1];
  const pieces = exampleParts(example);
  assert.equal(pieces.filter((p) => p.highlight?.text === "in").length, 1);
  assert.ok(pieces.some((p) => p.text.includes("Berlin")));
});
test("unknown topics cannot start, quiz, complete, or earn rewards", () => {
  const s = initialGrammar(),
    id = "grammar-c2-99";
  assert.equal(openTopic(s, id, 1), s);
  assert.equal(beginQuiz(s, id, "no", 1), s);
  assert.equal(markRead(s, id, 1), s);
  assert.equal(practice(s, id, "x", 1), s);
});
test("reading or passing alone never fakes completion; all three gates required", () => {
  const id = a1Topics[0].id;
  let s = openTopic(initialGrammar(), id, 1);
  s = finish(s, id);
  assert.equal(s.progress[id].completedAt, null);
  assert.equal(s.claims.length, 0);
  s = markRead(s, id, 300);
  assert.equal(s.progress[id].completedAt, null);
  assert.equal(practice(s, id, "yanlış", 301), s);
  s = practice(s, id, topicById(id)!.lesson!.practice.accepted[0], 302);
  assert.equal(s.progress[id].completedAt, 302);
  assert.equal(s.claims.length, 1);
  assert.equal(s.claims[0].xp, 15);
  assert.equal(s.claims[0].coins, 10);
});
test("80 percent passes; failed attempts request review; later retry preserves history", () => {
  const id = a1Topics[1].id;
  let s = openTopic(initialGrammar(), id, 1);
  s = markRead(s, id, 2);
  s = practice(s, id, topicById(id)!.lesson!.practice.accepted[0], 3);
  s = finish(s, id, 3, "fail");
  assert.equal(score(s.attempts.fail), 60);
  assert.ok(needsReview(s, id));
  assert.equal(s.progress[id].completedAt, null);
  s = finish(s, id, 4, "pass");
  assert.equal(score(s.attempts.pass), 80);
  assert.ok(s.progress[id].completedAt !== null);
  assert.equal(Object.keys(s.attempts).length, 2);
});
test("duplicate answer, premature advance and partial quiz cannot grant progress", () => {
  const id = a1Topics[2].id;
  let s = openTopic(initialGrammar(), id, 1);
  s = beginQuiz(s, id, "one", 2);
  assert.equal(advanceQuiz(s, "one"), s);
  assert.equal(beginQuiz(s, id, "other", 3), s);
  assert.equal(s.activeAttempt[id], "one");
  s = answerQuiz(s, "one", s.attempts.one.questions[0].accepted[0], 4);
  assert.equal(answerQuiz(s, "one", "change", 5), s);
  assert.equal(s.claims.length, 0);
});
test("replay cannot duplicate topic or milestone rewards, and inputs remain immutable", () => {
  let s = initialGrammar();
  for (const t of a1Topics.slice(0, 5)) s = complete(s, t.id);
  assert.equal(
    Object.values(s.progress).filter((p) => p.completedAt !== null).length,
    5,
  );
  assert.equal(s.claims.filter((c) => c.seed).length, 1);
  assert.equal(s.claims.filter((c) => c.coins === 10).length, 5);
  const before = JSON.stringify(s);
  const replay = complete(s, a1Topics[0].id, "replay");
  assert.equal(JSON.stringify(s), before);
  assert.deepEqual(replay.claims, s.claims);
  assert.deepEqual(replay.xp, s.xp);
  let garden = createStarter(0);
  for (const c of s.claims) {
    const reward = {
      id: c.id,
      source: "exercise" as const,
      coins: c.coins,
      ...(c.seed ? { seeds: { lavender: 1 } } : {}),
    };
    garden = grantReward(garden, reward);
    assert.equal(grantReward(garden, reward), garden);
  }
  assert.equal(garden.coins, 80);
  assert.equal(garden.seeds.lavender, 3);
  assert.deepEqual(garden.plots, createStarter(0).plots);
});
test("Turkish and German search, completion/category filters and bookmarks", () => {
  let s = initialGrammar();
  const id = a1Topics[2].id;
  s = bookmark(s, id);
  assert.equal(
    filterTopics(s, { search: "prasens", bookmarked: true }).length,
    1,
  );
  assert.equal(filterTopics(s, { search: "ŞİMDİ", level: "A1" }).length, 1);
  assert.equal(filterTopics(s, { level: "C1", status: "ready" }).length, 9);
  assert.equal(filterTopics(s, { level: "C1", status: "planned" }).length, 0);
  s = complete(s, id);
  assert.equal(filterTopics(s, { status: "completed" }).length, 1);
  assert.ok(
    filterTopics(s, { category: "verbs", bookmarked: true }).some(
      (t) => t.id === id,
    ),
  );
  s = bookmark(s, id);
  assert.equal(s.bookmarks.length, 0);
});
test("bookmarks, current question and answer restore; corrupted/future storage protected", () => {
  const memory = new Map<string, string>(),
    storage = {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => {
        memory.set(k, v);
      },
    };
  const p = createGrammarPersistence(() => storage),
    id = a1Topics[3].id;
  let s = bookmark(openTopic(initialGrammar(), id, 1), id);
  s = beginQuiz(s, id, "saved", 2);
  s = answerQuiz(s, "saved", s.attempts.saved.questions[0].accepted[0], 3);
  s = advanceQuiz(s, "saved");
  assert.ok(validGrammar(s));
  p.save(s);
  assert.deepEqual(p.load().state, s);
  const done = finish(s, id, 5, "saved");
  p.save(done);
  memory.set(GRAMMAR_KEY, "broken");
  assert.deepEqual(p.load().state, s);
  assert.equal(memory.get(GRAMMAR_KEY + ":corrupt"), "broken");
  memory.set(GRAMMAR_KEY, JSON.stringify({ version: 2 }));
  assert.equal(p.load().readonly, true);
  assert.throws(() => p.save(s));
});
test("unavailable storage and malformed quiz answers cannot pretend to be saved", () => {
  assert.equal(
    createGrammarPersistence(() => {
      throw Error("no");
    }).load().readonly,
    true,
  );
  const s = complete(initialGrammar(), a1Topics[4].id);
  assert.ok(validGrammar(s));
  const a = Object.values(s.attempts)[0];
  a.answers[a.questions[0].id].correct = false;
  assert.ok(!validGrammar(s));
});
test("grammar XP adapter uses the existing ledger and preserves exercise XP", async () => {
  const { initialExercises } = await import("../exercises/types.ts");
  const { EXERCISE_KEY } = await import("../exercises/persistence.ts");
  const old = Object.getOwnPropertyDescriptor(globalThis, "window");
  const memory = new Map<string, string>();
  const exercise = initialExercises();
  exercise.xp["existing-exercise"] = 5;
  memory.set(EXERCISE_KEY, JSON.stringify(exercise));
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (k: string) => memory.get(k) ?? null,
        setItem: (k: string, v: string) => {
          memory.set(k, v);
        },
      },
    },
  });
  try {
    const { deliverGrammarXp } = await import("../exercises/store.ts");
    assert.ok(await deliverGrammarXp("grammar:topic:test", 15));
    assert.ok(await deliverGrammarXp("grammar:topic:test", 15));
    const saved = JSON.parse(memory.get(EXERCISE_KEY)!);
    assert.equal(saved.xp["existing-exercise"], 5);
    assert.equal(saved.xp["grammar:topic:test"], 15);
    assert.equal(
      Object.values(saved.xp).reduce((n: number, x) => n + Number(x), 0),
      20,
    );
    assert.equal(await deliverGrammarXp("fake", 15), false);
  } finally {
    if (old) Object.defineProperty(globalThis, "window", old);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("10 B2 topics replace only their planned IDs and provide 80 substantial rules, 80 bilingual examples and 240 questions", () => {
  assert.equal(b2Topics.length, 10);
  const ids = new Set<string>();
  for (const [i, topic] of b2Topics.entries()) {
    assert.equal(topic.id, `grammar-b2-${String(i + 1).padStart(2, "0")}`);
    assert.equal(topicById(topic.id), topic);
    const lesson = topic.lesson!;
    assert.ok(lesson.intro.length > 200);
    assert.equal(lesson.rules.length, 8);
    assert.equal(lesson.ruleHeadings?.length, 8);
    assert.ok(lesson.rules.every((r) => r.length > 150));
    assert.ok(lesson.ruleHeadings?.every((h) => h.length > 5));
    assert.equal(lesson.examples.length, 8);
    assert.equal(lesson.quiz.length, 24);
    assert.equal(new Set(lesson.quiz.map((q) => q.prompt)).size, 24);
    assert.ok(!lesson.mistake.right.includes("["));
    for (const example of lesson.examples) {
      assert.ok(example.tr && example.de && example.explanation);
      assert.equal(
        exampleParts(example)
          .map((p) => p.text)
          .join(""),
        example.de,
      );
    }
    for (const q of [lesson.practice, ...lesson.quiz]) {
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.ok(q.explanation.length > 60);
      assert.ok(isCorrect(q, q.accepted[0]));
      if (q.options.length) {
        assert.equal(q.options.filter((v) => isCorrect(q, v)).length, 1);
        assert.equal(
          new Set(q.options.map((v) => normalize(v))).size,
          q.options.length,
        );
      }
      if (q.tiles)
        assert.deepEqual(
          q.tiles.map((v) => normalize(v)).sort(),
          normalize(q.accepted[0]).split(" ").sort(),
        );
    }
  }
  assert.equal(ids.size, 250);
  assert.equal(
    filterTopics(initialGrammar(), { level: "B2", status: "ready" }).length,
    10,
  );
  assert.equal(
    filterTopics(initialGrammar(), { level: "B2", status: "planned" }).length,
    0,
  );
});

test("B2 reference forms distinguish passive, relatives, nominalization, participles, irrealis, order, register and reporting", () => {
  const answers = [
    "wird",
    "dessen",
    "Das Lernen",
    "wartenden",
    "hätte",
    "fahre ich",
    "Ihnen",
    "als auch",
    "sei",
    "des Wetters",
  ];
  for (const [i, t] of b2Topics.entries())
    assert.ok(isCorrect(t.lesson!.quiz[8], answers[i]), t.id);
  assert.equal(
    b2Topics[7].lesson!.mistake.right,
    "Je mehr ich übe, desto sicherer werde ich.",
  );
});

test("every B2 quiz resumes at each answer, enforces all gates and 20/24, and cannot issue duplicate rewards", () => {
  for (const topic of b2Topics) {
    const id = topic.id;
    let s = finishLongQuiz(
      openTopic(initialGrammar(), id, 1),
      id,
      "unread",
      24,
    );
    assert.equal(s.claims.length, 0);
    s = markRead(s, id, 200);
    assert.equal(s.claims.length, 0);
    assert.equal(practice(s, id, "yanlış", 201), s);
    s = practice(s, id, topic.lesson!.practice.accepted[0], 202);
    assert.ok(s.progress[id].completedAt);
    const claims = structuredClone(s.claims);
    s = finishLongQuiz(s, id, "repeat", 24);
    assert.deepEqual(s.claims, claims);

    s = markRead(openTopic(initialGrammar(), id, 1), id, 2);
    s = practice(s, id, topic.lesson!.practice.accepted[0], 3);
    s = finishLongQuiz(s, id, "fail", 19);
    assert.equal(s.claims.length, 0);
    assert.equal(s.progress[id].completedAt, null);
    s = finishLongQuiz(s, id, "pass", 20);
    assert.ok(s.progress[id].completedAt);
    assert.equal(
      s.claims.filter((c) => c.id === "grammar:topic:" + id).length,
      1,
    );
    const last = s.attempts.pass.questions.at(-1)!;
    assert.equal(answerQuiz(s, "pass", last.accepted[0], 300), s);
  }
});

test("A1/A2/B1 histories and inventory receipts survive all B2 completions in the existing cloud snapshot", () => {
  const a1 = a1Topics[0],
    a2 = a2Topics[0],
    b1 = b1Topics[0];
  let s = initialGrammar();
  for (const topic of [a1, a2, b1]) {
    s = openTopic(s, topic.id, 1);
    s = markRead(s, topic.id, 2);
    s = practice(s, topic.id, topic.lesson!.practice.accepted[0], 3);
    s =
      topic.level === "A1"
        ? finish(s, topic.id)
        : finishLongQuiz(s, topic.id, topic.id, 24);
  }
  const old = structuredClone(s);
  for (const topic of b2Topics) {
    s = openTopic(s, topic.id, 1);
    s = markRead(s, topic.id, 2);
    s = practice(s, topic.id, topic.lesson!.practice.accepted[0], 3);
    s = finishLongQuiz(s, topic.id, topic.id, 24);
  }
  for (const topic of [a1, a2, b1])
    assert.deepEqual(s.progress[topic.id], old.progress[topic.id]);
  for (const [id, attempt] of Object.entries(old.attempts))
    assert.deepEqual(s.attempts[id], attempt);
  for (const claim of old.claims)
    assert.deepEqual(
      s.claims.find((c) => c.id === claim.id),
      claim,
    );
  assert.equal(s.claims.filter((c) => c.xp === 15).length, 13);
  assert.equal(s.claims.filter((c) => c.seed).length, 2);
  assert.ok(
    validSnapshot(
      JSON.parse(JSON.stringify({ version: 1, modules: { grammar: s } })),
    ),
  );
});

test("9 C1 topics replace only their planned IDs and provide 72 substantial rules, 72 bilingual examples and 216 questions", () => {
  assert.equal(c1Topics.length, 9);
  const ids = new Set<string>();
  for (const [i, topic] of c1Topics.entries()) {
    assert.equal(topic.id, `grammar-c1-${String(i + 1).padStart(2, "0")}`);
    assert.equal(topicById(topic.id), topic);
    const lesson = topic.lesson!;
    assert.ok(lesson.intro.length > 200);
    assert.equal(lesson.rules.length, 8);
    assert.equal(lesson.ruleHeadings?.length, 8);
    assert.ok(lesson.rules.every((r) => r.length > 150));
    assert.ok(lesson.ruleHeadings?.every((h) => h.length > 5));
    assert.equal(lesson.examples.length, 8);
    assert.equal(lesson.quiz.length, 24);
    assert.equal(new Set(lesson.quiz.map((q) => q.prompt)).size, 24);
    assert.ok(!lesson.mistake.right.includes("["));
    for (const example of lesson.examples) {
      assert.ok(example.tr && example.de && example.explanation);
      assert.equal(
        exampleParts(example)
          .map((p) => p.text)
          .join(""),
        example.de,
      );
    }
    for (const q of [lesson.practice, ...lesson.quiz]) {
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.ok(q.explanation.length > 60);
      assert.ok(isCorrect(q, q.accepted[0]));
      if (q.options.length) {
        assert.equal(q.options.filter((v) => isCorrect(q, v)).length, 1);
        assert.equal(
          new Set(q.options.map((v) => normalize(v))).size,
          q.options.length,
        );
      }
      if (q.tiles)
        assert.deepEqual(
          q.tiles.map((v) => normalize(v)).sort(),
          normalize(q.accepted[0]).split(" ").sort(),
        );
    }
  }
  assert.equal(ids.size, 225);
  assert.equal(
    filterTopics(initialGrammar(), { level: "C1", status: "ready" }).length,
    9,
  );
  assert.equal(
    filterTopics(initialGrammar(), { level: "C1", status: "planned" }).length,
    0,
  );
});

test("C1 independent reference answers preserve reporting, scope, case, register and passive distinctions", () => {
  const expected = [
    ["sei", "seien", "habe", "sei", "werde", "werde", "worden", "könnet"],
    [
      "ihrem Bruder",
      "ob",
      "wann",
      "zu warten",
      "verschoben wurde",
      "noch nicht",
      "habe",
      "wie viel",
    ],
    ["gehen wir", "ist", "ob", "können", "müssen wir", "falls", "der", "dass"],
    [
      "des Antrags",
      "des starken Regens",
      "am Seminar",
      "durch die Behörde",
      "Abschluss der Arbeiten",
      "der sorgfältigen Planung",
      "vollständigen",
      "Beginn des Kurses",
    ],
    [
      "arbeitende",
      "arbeitenden",
      "angekommenen",
      "empfohlenen",
      "prüfenden",
      "lebender",
      "verfassten",
      "entwickelten",
    ],
    [
      "zu vergleichen",
      "erhoben",
      "legen nahe",
      "könnte",
      "mit der Motivation",
      "anschließend",
      "besteht",
      "verallgemeinern",
    ],
    [
      "muss",
      "haben",
      "sein",
      "soll",
      "haben",
      "muss nicht",
      "müssen",
      "dürfte",
    ],
    [
      "Sie",
      "um eine Rückmeldung",
      "Ihre Unterstützung",
      "zustimmen",
      "dankbar",
      "zu verschieben",
      "ob",
      "darauf",
    ],
    [
      "lässt sich",
      "lassen sich",
      "einzureichen",
      "zu lesen",
      "bekommt",
      "wird",
      "lesbar",
      "worden",
    ],
  ];
  for (const [i, t] of c1Topics.entries())
    for (const [j, answer] of expected[i].entries())
      assert.ok(isCorrect(t.lesson!.quiz[8 + j], answer), t.id + ":" + j);
  const corrections = [
    "Die Gäste erklären, sie seien bereit.",
    "Sie fragt, ob der Kurs schon begonnen hat.",
    "Obwohl es regnet, gehen wir spazieren.",
    "Die Teilnahme am Seminar ist freiwillig.",
    "Wir sprechen mit dem im Garten arbeitenden Mann.",
    "Die Ergebnisse hängen mit der Motivation zusammen.",
    "Er könnte schon angekommen sein.",
    "Ich kann diesem Vorschlag nicht zustimmen.",
    "Den Gästen wird geholfen.",
  ];
  c1Topics.forEach((t, i) =>
    assert.equal(t.lesson!.mistake.right, corrections[i]),
  );
  assert.ok(
    isCorrect(
      c1Topics[6].lesson!.quiz[3],
      "Doğru olmasının zorunlu olmadığını",
    ),
  );
  assert.ok(
    isCorrect(c1Topics[8].lesson!.quiz[0], "Kapının gerçekten açıldığını"),
  );
});

test("every C1 quiz resumes at each answer, enforces all gates and 20/24, and cannot issue duplicate rewards", () => {
  for (const topic of c1Topics) {
    const id = topic.id;
    let s = finishLongQuiz(
      openTopic(initialGrammar(), id, 1),
      id,
      "unread",
      24,
    );
    assert.equal(s.claims.length, 0);
    s = markRead(s, id, 200);
    assert.equal(s.claims.length, 0);
    assert.equal(practice(s, id, "yanlış", 201), s);
    s = practice(s, id, topic.lesson!.practice.accepted[0], 202);
    assert.ok(s.progress[id].completedAt);
    const claims = structuredClone(s.claims);
    s = finishLongQuiz(s, id, "repeat", 24);
    assert.deepEqual(s.claims, claims);

    s = markRead(openTopic(initialGrammar(), id, 1), id, 2);
    s = practice(s, id, topic.lesson!.practice.accepted[0], 3);
    s = finishLongQuiz(s, id, "fail", 19);
    assert.equal(s.claims.length, 0);
    assert.equal(s.progress[id].completedAt, null);
    s = finishLongQuiz(s, id, "pass", 20);
    assert.ok(s.progress[id].completedAt);
    assert.equal(
      s.claims.filter((c) => c.id === "grammar:topic:" + id).length,
      1,
    );
    const last = s.attempts.pass.questions.at(-1)!;
    assert.equal(answerQuiz(s, "pass", last.accepted[0], 300), s);
  }
});

test("A1/A2/B1/B2 histories and inventory receipts survive all C1 completions in the existing cloud snapshot", () => {
  const a1 = a1Topics[0],
    a2 = a2Topics[0],
    b1 = b1Topics[0],
    b2 = b2Topics[0];
  let s = initialGrammar();
  for (const topic of [a1, a2, b1, b2]) {
    s = openTopic(s, topic.id, 1);
    s = markRead(s, topic.id, 2);
    s = practice(s, topic.id, topic.lesson!.practice.accepted[0], 3);
    s =
      topic.level === "A1"
        ? finish(s, topic.id)
        : finishLongQuiz(s, topic.id, topic.id, 24);
  }
  const old = structuredClone(s);
  for (const topic of c1Topics) {
    s = openTopic(s, topic.id, 1);
    s = markRead(s, topic.id, 2);
    s = practice(s, topic.id, topic.lesson!.practice.accepted[0], 3);
    s = finishLongQuiz(s, topic.id, topic.id, 24);
  }
  for (const topic of [a1, a2, b1, b2])
    assert.deepEqual(s.progress[topic.id], old.progress[topic.id]);
  for (const [id, attempt] of Object.entries(old.attempts))
    assert.deepEqual(s.attempts[id], attempt);
  for (const claim of old.claims)
    assert.deepEqual(
      s.claims.find((c) => c.id === claim.id),
      claim,
    );
  assert.equal(s.claims.filter((c) => c.xp === 15).length, 13);
  assert.equal(s.claims.filter((c) => c.seed).length, 2);
  assert.ok(
    validSnapshot(
      JSON.parse(JSON.stringify({ version: 1, modules: { grammar: s } })),
    ),
  );
});

test("7 C2 topics replace only their planned IDs and provide 56 substantial rules, 56 bilingual examples and 168 questions", () => {
  assert.equal(c2Topics.length, 7);
  const ids = new Set<string>();
  for (const [i, topic] of c2Topics.entries()) {
    assert.equal(topic.id, `grammar-c2-${String(i + 1).padStart(2, "0")}`);
    assert.equal(topicById(topic.id), topic);
    const lesson = topic.lesson!;
    assert.ok(lesson.intro.length > 200);
    assert.equal(lesson.rules.length, 8);
    assert.equal(lesson.ruleHeadings?.length, 8);
    assert.ok(lesson.rules.every((r) => r.length > 150));
    assert.ok(lesson.ruleHeadings?.every((h) => h.length > 5));
    assert.equal(lesson.examples.length, 8);
    assert.equal(lesson.quiz.length, 24);
    assert.equal(new Set(lesson.quiz.map((q) => q.prompt)).size, 24);
    assert.ok(!lesson.mistake.right.includes("["));
    for (const example of lesson.examples) {
      assert.ok(example.tr && example.de && example.explanation);
      assert.equal(
        exampleParts(example)
          .map((p) => p.text)
          .join(""),
        example.de,
      );
    }
    for (const q of [lesson.practice, ...lesson.quiz]) {
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.ok(q.explanation.length > 60);
      assert.ok(isCorrect(q, q.accepted[0]));
      if (q.options.length) {
        assert.equal(q.options.filter((v) => isCorrect(q, v)).length, 1);
        assert.equal(
          new Set(q.options.map((v) => normalize(v))).size,
          q.options.length,
        );
      }
      if (q.tiles)
        assert.deepEqual(
          q.tiles.map((v) => normalize(v)).sort(),
          normalize(q.accepted[0]).split(" ").sort(),
        );
    }
  }
  assert.equal(ids.size, 175);
  assert.equal(
    filterTopics(initialGrammar(), { level: "C2", status: "ready" }).length,
    7,
  );
  assert.equal(
    filterTopics(initialGrammar(), { level: "C2", status: "planned" }).length,
    0,
  );
});

test("C2 independent reference forms preserve focus, idioms, scope, reporting and transformations", () => {
  const expected = [
    [
      "der Redaktion",
      "des Stromausfalls",
      "der Verzögerung",
      "Nicht alle",
      "morgige",
      "einzureichen",
      "könnte",
      "durch die Redaktion",
    ],
    [
      "in Betracht",
      "trifft",
      "zur Verfügung",
      "zur Verfügung",
      "mich",
      "zur Sprache",
      "zur Sprache",
      "zur Kenntnis",
    ],
    ["ja", "doch", "machst", "ist", "hat", "noch nicht", "nicht mehr", "Sie"],
    [
      "dass",
      "Soweit",
      "auf die Genauigkeit",
      "ableiten",
      "Befragten",
      "wenngleich",
      "deren",
      "ausschließlich",
    ],
    [
      "ist",
      "kaufen wir",
      "sondern",
      "hingegen",
      "können wir",
      "Obwohl",
      "anschließend",
      "nicht",
    ],
    [
      "wüsste",
      "wäre",
      "wäre",
      "hätte ich",
      "haben",
      "musst nicht",
      "sollen",
      "müssen",
    ],
    [
      "ihrer Müdigkeit",
      "zu verabschieden",
      "um",
      "kann",
      "Abschluss der Arbeiten",
      "den Lernenden",
      "wurden",
      "sind",
    ],
  ];
  c2Topics.forEach((t, i) =>
    expected[i].forEach((answer, j) =>
      assert.ok(isCorrect(t.lesson!.quiz[8 + j], answer), t.id + ":" + j),
    ),
  );
  const corrections = [
    "Der Text wird morgen von der Redaktion geprüft.",
    "Wir ziehen diese Möglichkeit in Betracht.",
    "Sie arbeitet nicht mehr hier; sie hat die Stelle verlassen.",
    "In Bezug auf die Genauigkeit unterscheiden sich die Verfahren.",
    "Es ist teuer. Trotzdem kaufen wir es.",
    "Es wirkt, als ob niemand da wäre.",
    "Sie geht, ohne sich zu verabschieden.",
  ];
  c2Topics.forEach((t, i) =>
    assert.equal(t.lesson!.mistake.right, corrections[i]),
  );
  assert.ok(
    isCorrect(c2Topics[0].lesson!.quiz[1], "Hepsi değil ile hiçbiri ayrımı"),
  );
  assert.ok(
    isCorrect(c2Topics[5].lesson!.quiz[4], "Zorunluluk yokluğu ile yasak"),
  );
  assert.ok(
    isCorrect(c2Topics[6].lesson!.quiz[3], "A olmadan B'nin mümkün olmaması"),
  );
});

test("every C2 quiz resumes at each answer, enforces all gates and 20/24, and cannot issue duplicate rewards", () => {
  for (const topic of c2Topics) {
    const id = topic.id;
    let s = finishLongQuiz(
      openTopic(initialGrammar(), id, 1),
      id,
      "unread",
      24,
    );
    assert.equal(s.claims.length, 0);
    s = markRead(s, id, 200);
    assert.equal(s.claims.length, 0);
    assert.equal(practice(s, id, "yanlış", 201), s);
    s = practice(s, id, topic.lesson!.practice.accepted[0], 202);
    assert.ok(s.progress[id].completedAt);
    const claims = structuredClone(s.claims);
    s = finishLongQuiz(s, id, "repeat", 24);
    assert.deepEqual(s.claims, claims);

    s = markRead(openTopic(initialGrammar(), id, 1), id, 2);
    s = practice(s, id, topic.lesson!.practice.accepted[0], 3);
    s = finishLongQuiz(s, id, "fail", 19);
    assert.equal(s.claims.length, 0);
    assert.equal(s.progress[id].completedAt, null);
    s = finishLongQuiz(s, id, "pass", 20);
    assert.ok(s.progress[id].completedAt);
    assert.equal(
      s.claims.filter((c) => c.id === "grammar:topic:" + id).length,
      1,
    );
    const last = s.attempts.pass.questions.at(-1)!;
    assert.equal(answerQuiz(s, "pass", last.accepted[0], 300), s);
  }
});

test("A1/A2/B1/B2/C1 histories and inventory receipts survive all C2 completions in the existing cloud snapshot", () => {
  const a1 = a1Topics[0],
    a2 = a2Topics[0],
    b1 = b1Topics[0],
    b2 = b2Topics[0],
    c1 = c1Topics[0];
  let s = initialGrammar();
  for (const topic of [a1, a2, b1, b2, c1]) {
    s = openTopic(s, topic.id, 1);
    s = markRead(s, topic.id, 2);
    s = practice(s, topic.id, topic.lesson!.practice.accepted[0], 3);
    s =
      topic.level === "A1"
        ? finish(s, topic.id)
        : finishLongQuiz(s, topic.id, topic.id, 24);
  }
  const old = structuredClone(s);
  for (const topic of c2Topics) {
    s = openTopic(s, topic.id, 1);
    s = markRead(s, topic.id, 2);
    s = practice(s, topic.id, topic.lesson!.practice.accepted[0], 3);
    s = finishLongQuiz(s, topic.id, topic.id, 24);
  }
  for (const topic of [a1, a2, b1, b2, c1])
    assert.deepEqual(s.progress[topic.id], old.progress[topic.id]);
  for (const [id, attempt] of Object.entries(old.attempts))
    assert.deepEqual(s.attempts[id], attempt);
  for (const claim of old.claims)
    assert.deepEqual(
      s.claims.find((c) => c.id === claim.id),
      claim,
    );
  assert.equal(s.claims.filter((c) => c.xp === 15).length, 12);
  assert.equal(s.claims.filter((c) => c.seed).length, 2);
  assert.ok(
    validSnapshot(
      JSON.parse(JSON.stringify({ version: 1, modules: { grammar: s } })),
    ),
  );
});

test("all 66 ready grammar lessons fit the existing account snapshot without losing claims or attempts", () => {
  let s = initialGrammar();
  for (const t of topics.filter((t) => t.lesson)) {
    s = markRead(openTopic(s, t.id, 1), t.id, 2);
    s = practice(s, t.id, t.lesson!.practice.accepted[0], 3);
    s = t.level === "A1" ? finish(s, t.id) : finishLongQuiz(s, t.id, t.id, 24);
  }
  assert.equal(
    Object.values(s.progress).filter((p) => p.completedAt !== null).length,
    66,
  );
  assert.equal(s.claims.filter((c) => c.xp === 15).length, 66);
  assert.equal(s.claims.filter((c) => c.seed).length, 13);
  const snapshot = JSON.parse(
    JSON.stringify({ version: 1, modules: { grammar: s } }),
  );
  assert.equal(Object.keys(snapshot.modules.grammar.attempts).length, 66);
  assert.ok(validSnapshot(snapshot));
});

test("C1/C2 case complements are not mislabeled as the governing preposition", () => {
  for (const [id, indices] of [
    ["grammar-c1-04", [1, 5]],
    ["grammar-c2-01", [0, 1, 2]],
    ["grammar-c2-07", [0]],
  ] as const) {
    for (const i of indices)
      assert.ok(
        !topicById(id)!.lesson!.examples[i].highlights.some(
          (h) => h.role === "preposition",
        ),
      );
  }
});
