import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LocalVocabularyRepository } from "../learning/repository.ts";
import type { VocabularyRecord } from "../learning/types.ts";
import { initialExercises } from "./types.ts";
import {
  generateQuestions,
  isCorrect,
  normalize,
  dailyPriority,
} from "./generate.ts";
import {
  startSession,
  submitAnswer,
  advance,
  sessionStats,
  matchingAttempt,
} from "./engine.ts";
import {
  createExercisePersistence,
  EXERCISE_KEY,
  validState,
} from "./persistence.ts";
import { initialLearning, ensureDaily } from "../learning/engine.ts";
import { createStarter, grantReward } from "../garden/model.ts";
const rows = JSON.parse(
  readFileSync(new URL("../../data/vocabulary.json", import.meta.url), "utf8"),
) as VocabularyRecord[];
// Preserve the original mode-contract fixture; full new levels are tested separately.
const repo = new LocalVocabularyRepository(
  rows.filter((w) => !w.id.startsWith("dg-course-")),
);
const date = "2026-10-27";
const make = (mode: "daily" | "choice" = "daily") =>
  generateQuestions(repo, "A1", mode, date);
function session(questions = make(), mode: "daily" | "choice" = "daily") {
  return startSession(
    initialExercises(),
    questions,
    mode,
    date,
    "A1",
    100,
    "one",
  );
}
function finish(state = session(), correct = true) {
  while (true) {
    const s = state.sessions[state.active!];
    const q = s.questions[s.index];
    state = submitAnswer(
      state,
      s.id,
      correct ? q.accepted[0] : "yanlış yanıt",
      1000 + s.index,
    );
    if (state.sessions[s.id].completedAt !== null) return state;
    state = advance(state, s.id);
  }
}
test("all eight modes preserve original repository behavior; original fixture has no B2 records", () => {
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
    const qs = generateQuestions(repo, "A1", mode, date);
    assert.equal(qs.length, 10);
    assert.ok(qs.every((q) => q.wordIds.every((id) => repo.get(id))));
    assert.deepEqual(generateQuestions(repo, "B2", mode, date), []);
  }
  const types = new Set(make().map((q) => q.type));
  assert.equal(types.size, 7);
});
test("four unique choices and exactly one valid choice; distractors share no accepted meaning", () => {
  for (let i = 0; i < 25; i++)
    for (const q of generateQuestions(repo, "A1", "choice", "seed" + i)) {
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options.map((x) => normalize(x, "tr"))).size, 4);
      assert.equal(q.options.filter((x) => isCorrect(q, x)).length, 1);
      const word = repo.get(q.wordIds[0])!;
      for (const alt of word.turkish_meaning.split(";"))
        assert.equal(
          q.options.filter((x) => normalize(x, "tr") === normalize(alt, "tr"))
            .length,
          normalize(alt, "tr") === normalize(q.accepted[0], "tr") ? 1 : 0,
        );
    }
});
test("translation alternatives, Turkish I, German ß, punctuation and spacing", () => {
  const qs = generateQuestions(repo, "A1", "de-tr", "alt", [], {}, 60);
  const q = qs.find(
    (q) => repo.get(q.wordIds[0])?.german_word === "Schwester",
  )!;
  assert.ok(isCorrect(q, "  ABLA!! "));
  assert.ok(isCorrect(q, "kız   kardeş"));
  assert.equal(normalize(" Straße! "), "strasse");
  assert.equal(normalize("ISLAK", "tr"), "ıslak");
  assert.ok(!isCorrect(q, "erkek kardeş"));
  const de = generateQuestions(repo, "A1", "tr-de", "de", [], {}, 60).find(
    (q) => repo.get(q.wordIds[0])?.german_word === "Apfel",
  )!;
  assert.ok(isCorrect(de, " DER   APFEL."));
  assert.ok(isCorrect(de, "Apfel"));
});
test("verified blanks and accepted sentence orders preserve exact tile multiset", () => {
  for (const q of generateQuestions(repo, "A1", "blank", "grammar")) {
    assert.ok(q.prompt.includes("___"));
    assert.ok(q.options.includes(q.accepted[0]));
    assert.equal(q.options.filter((x) => isCorrect(q, x)).length, 1);
  }
  for (const q of generateQuestions(repo, "A1", "sentence", "grammar")) {
    const sorted = q.tiles!.map((x) => normalize(x)).sort();
    for (const order of q.accepted)
      assert.deepEqual(normalize(order).split(" ").sort(), sorted);
    assert.ok(isCorrect(q, q.accepted.at(-1)!));
    assert.ok(!isCorrect(q, "Deutsch ich jeden lernen"));
  }
});
test("matching contains unique meanings and stable correct pair identity", () => {
  for (const q of generateQuestions(repo, "A1", "matching", "pairs")) {
    assert.equal(q.pairs!.length, 4);
    assert.equal(new Set(q.pairs!.map((p) => normalize(p.tr, "tr"))).size, 4);
    assert.ok(
      isCorrect(
        q,
        q
          .pairs!.map((p) => p.id)
          .sort()
          .join("|"),
      ),
    );
    assert.ok(
      !isCorrect(
        q,
        q
          .pairs!.slice(1)
          .map((p) => p.id)
          .sort()
          .join("|"),
      ),
    );
  }
});
test("daily stable assignment, next date rotates, saved snapshot survives content changes", () => {
  assert.deepEqual(make(), make());
  assert.notDeepEqual(
    make(),
    generateQuestions(repo, "A1", "daily", "2026-10-28"),
  );
  const state = session();
  const again = startSession(
    state,
    make().slice(0, 2),
    "daily",
    date,
    "A1",
    999,
    "two",
  );
  assert.equal(again.active, "one");
  assert.equal(Object.keys(again.sessions).length, 1);
  const learning = ensureDaily(initialLearning(), rows, date);
  const priority = dailyPriority(learning, date);
  assert.ok(priority.length);
  assert.ok(
    generateQuestions(
      repo,
      "A1",
      "choice",
      "priority",
      priority,
    )[0].wordIds.some((id) => priority.includes(id)),
  );
});
test("answers cannot be resubmitted, advance cannot skip; completed sessions immutable", () => {
  let state = session();
  assert.equal(advance(state, "one"), state);
  const q = state.sessions.one.questions[0];
  state = submitAnswer(state, "one", q.accepted[0], 500);
  assert.equal(submitAnswer(state, "one", "changed", 600), state);
  assert.equal(state.sessions.one.answers[q.id].xp, 5);
  const done = finish(state);
  assert.equal(submitAnswer(done, "one", "changed", 9999), done);
  assert.equal(sessionStats(done.sessions.one).correct, 10);
});
test("reward limits survive repeat modes, results reopen and crash replay", () => {
  let state = finish();
  assert.equal(
    Object.values(state.xp).reduce((n, x) => n + x, 0),
    50,
  );
  assert.equal(state.claims.filter((c) => c.coins === 10).length, 1);
  assert.equal(state.claims.filter((c) => c.seed).length, 1);
  state = startSession(state, make(), "daily", date, "A1", 999, "repeat", true);
  state = finish(state);
  assert.equal(
    Object.values(state.xp).reduce((n, x) => n + x, 0),
    50,
  );
  assert.equal(state.claims.length, 2);
  const garden = createStarter(0);
  const reward = {
    id: state.claims[0].id,
    source: "exercise" as const,
    coins: 10,
  };
  const awarded = grantReward(garden, reward);
  assert.equal(awarded.coins, 40);
  assert.equal(grantReward(awarded, reward), awarded);
  assert.deepEqual(awarded.plots, garden.plots);
});
test("wrong answers enter rule-based review; successful answers update counters", () => {
  const state = finish(session(), false);
  assert.equal(sessionStats(state.sessions.one).wrong, 10);
  assert.ok(Object.values(state.mistakes).some((x) => x.wrong > 0));
  assert.equal(Object.keys(state.xp).length, 0);
  const id = rows[0].id;
  const adaptive = generateQuestions(repo, "A1", "daily", "adapt", [], {
    [id]: { wordId: id, wrong: 5, right: 0, lastAt: 1 },
  });
  assert.equal(adaptive[0].type, "choice");
  assert.ok(adaptive[0].wordIds.includes(id));
});
test("listening can be skipped without XP, error count or a perfect seed", () => {
  const q = generateQuestions(repo, "A1", "listening", "audio")[0];
  assert.ok(q.audio);
  assert.ok(!q.prompt.includes(q.audio!));
  let state = startSession(
    initialExercises(),
    [q],
    "listening",
    date,
    "A1",
    0,
    "audio",
  );
  state = submitAnswer(state, "audio", "", 100, true);
  const stats = sessionStats(state.sessions.audio);
  assert.equal(stats.skipped, 1);
  assert.equal(stats.wrong, 0);
  assert.equal(stats.xp, 0);
  assert.equal(state.claims.length, 0);
  assert.deepEqual(state.mistakes, {});
});
test("durable session restoration includes questions, answer, index and immutable rewards", () => {
  const memory = new Map<string, string>();
  const storage = {
    getItem: (k: string) => memory.get(k) ?? null,
    setItem: (k: string, v: string) => {
      memory.set(k, v);
    },
  };
  const persistence = createExercisePersistence(() => storage);
  let state = session();
  const q = state.sessions.one.questions[0];
  state = advance(submitAnswer(state, "one", q.accepted[0], 10), "one");
  assert.ok(validState(state));
  persistence.save(state);
  assert.deepEqual(persistence.load().state, state);
  const done = finish(state);
  persistence.save(done);
  assert.deepEqual(persistence.load().state, done);
  memory.set(EXERCISE_KEY, "broken");
  const restored = persistence.load();
  assert.ok(restored.notice);
  assert.deepEqual(restored.state, state);
  assert.equal(memory.get(EXERCISE_KEY + ":corrupt"), "broken");
  memory.set(EXERCISE_KEY, JSON.stringify({ version: 2 }));
  assert.equal(persistence.load().readonly, true);
  assert.throws(() => persistence.save(done));
});
test("unavailable storage blocks writes; malformed saved questions are rejected", () => {
  const persistence = createExercisePersistence(() => {
    throw Error("blocked");
  });
  assert.equal(persistence.load().readonly, true);
  const state = session();
  state.sessions.one.questions[0].accepted = [];
  assert.ok(!validState(state));
});

test("matching attempts restore completed pairs and preserve mistakes without duplicate taps", () => {
  let state = startSession(
    initialExercises(),
    generateQuestions(repo, "A1", "matching", "tap"),
    "matching",
    date,
    "A1",
    0,
    "tap",
  );
  const q = state.sessions.tap.questions[0],
    left = q.pairs![0].id,
    right = q.pairs![1].id;
  state = matchingAttempt(state, "tap", left, right, 1);
  assert.equal(state.mistakes[left].wrong, 1);
  state = matchingAttempt(state, "tap", left, left, 2);
  assert.equal(state.sessions.tap.attempts?.length, 2);
  assert.equal(matchingAttempt(state, "tap", left, left, 3), state);
  const restored = JSON.parse(JSON.stringify(state));
  assert.ok(validState(restored));
  assert.deepEqual(
    restored.sessions.tap
      .attempts!.filter((a: { correct: boolean }) => a.correct)
      .map((a: { wordId: string }) => a.wordId),
    [left],
  );
});
test("tiny pools shorten quizzes safely; no options or matching duplicates are fabricated", () => {
  const tiny = new LocalVocabularyRepository(rows.slice(0, 1));
  assert.deepEqual(generateQuestions(tiny, "A1", "choice", "tiny"), []);
  assert.deepEqual(generateQuestions(tiny, "A1", "matching", "tiny"), []);
  assert.equal(generateQuestions(tiny, "A1", "tr-de", "tiny").length, 1);
  const two = new LocalVocabularyRepository(rows.slice(0, 2));
  const q = generateQuestions(two, "A1", "choice", "two")[0];
  assert.equal(q.options.length, 2);
});

test("short mistake replays never grant a perfect daily seed", () => {
  let state = finish(session(), false);
  state = startSession(
    state,
    make().slice(0, 1),
    "daily",
    date,
    "A1",
    10000,
    "short",
    true,
  );
  state = finish(state);
  assert.equal(state.claims.filter((c) => c.seed).length, 0);
  assert.equal(state.claims.filter((c) => c.coins === 10).length, 1);
});
test("matching corrections prevent a perfect seed and preserve review priority", () => {
  const qs = make();
  let state = session(qs);
  while (state.sessions.one.completedAt === null) {
    const s = state.sessions.one,
      q = s.questions[s.index];
    if (q.type === "matching") {
      state = matchingAttempt(
        state,
        "one",
        q.pairs![0].id,
        q.pairs![1].id,
        800,
      );
      state = matchingAttempt(
        state,
        "one",
        q.pairs![0].id,
        q.pairs![0].id,
        900,
      );
    }
    state = submitAnswer(state, "one", q.accepted[0], 1000 + s.index);
    if (state.sessions.one.completedAt === null)
      state = advance(state, "one", 1100 + s.index);
  }
  assert.equal(sessionStats(state.sessions.one).accuracy, 100);
  assert.equal(state.claims.filter((c) => c.seed).length, 0);
  assert.ok(sessionStats(state.sessions.one).reviewIds.length > 0);
});
test("parenthetical glosses accept natural Turkish equivalents", () => {
  const qs = generateQuestions(repo, "A1", "de-tr", "natural", [], {}, 60);
  for (const [de, tr] of [
    ["Uhr", "Saat"],
    ["arbeiten", "Çalışmak"],
    ["Haus", "Ev"],
    ["Danke", "Teşekkür ederim"],
  ]) {
    assert.ok(
      isCorrect(
        qs.find((q) => repo.get(q.wordIds[0])?.german_word === de)!,
        tr,
      ),
    );
  }
});
