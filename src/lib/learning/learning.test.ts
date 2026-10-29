import test from "node:test";
import assert from "node:assert/strict";
import { originalA1 } from "./seed.ts";
import { curriculum, unitsFor, isUnlocked } from "./curriculum.ts";
import { LEVELS, type VocabularyRecord } from "./types.ts";
import {
  validateVocabulary,
  importVocabulary,
  normalizeGerman,
} from "./import.ts";
import { LocalVocabularyRepository } from "./repository.ts";
import {
  initialLearning,
  ensureDaily,
  assignmentKey,
  answerDaily,
  answerUnit,
  addDays,
  localDate,
  changeGoal,
  placeAt,
  unitAvailable,
} from "./engine.ts";
import {
  createLearningPersistence,
  validLearning,
  LEARNING_KEY,
} from "./persistence.ts";
import { createStarter, applyCommand, grantReward } from "../garden/model.ts";
const day = "2026-10-27";
test("original starter has 60 validated records and 6 words per A1 unit; all levels have plans", () => {
  assert.equal(originalA1.length, 60);
  for (const word of originalA1) assert.deepEqual(validateVocabulary(word), []);
  for (const level of LEVELS) {
    assert.equal(unitsFor(level).length, 10);
    assert.equal(unitsFor(level).flatMap((u) => u.lessons).length, 20);
  }
  assert.equal(curriculum.length, 60);
  for (const unit of unitsFor("A1"))
    assert.equal(
      originalA1.filter((v) => v.unit_ids.includes(unit.id)).length,
      6,
    );
  assert.equal(originalA1.filter((v) => v.cefr_level !== "A1").length, 0);
});
test("imports insert, skip, update and reject; repeated exposure merges without duplicate records", () => {
  const first = importVocabulary([], originalA1);
  assert.equal(first.report.inserted, 60);
  const second = importVocabulary(first.records, originalA1);
  assert.equal(second.report.skipped, 60);
  assert.equal(second.report.inserted, 0);
  const repeated = {
    ...originalA1[0],
    id: "another-id",
    levels: ["A1", "A2"] as VocabularyRecord["levels"],
    topics: ["greetings", "conversation"] as VocabularyRecord["topics"],
    unit_ids: ["a1-01", "a2-01"],
  };
  const merged = importVocabulary(first.records, [repeated]);
  assert.equal(merged.records.length, 60);
  assert.equal(merged.report.updated, 1);
  assert.deepEqual(merged.records[0].levels, ["A1", "A2"]);
  assert.equal(merged.records[0].id, originalA1[0].id);
  assert.equal(
    importVocabulary(first.records, [
      { ...originalA1[0], german_word: "anders", sense_key: "different" },
    ]).report.rejected,
    1,
  );
  assert.equal(
    importVocabulary([], [{ german_word: "Hallo" }]).report.rejected,
    1,
  );
  assert.equal(
    importVocabulary([], [{ ...originalA1[0], license: "No permission" }])
      .report.rejected,
    1,
  );
  assert.equal(
    importVocabulary(
      [],
      [{ ...originalA1[0], audio_url: "https://example.test/audio.mp3" }],
    ).report.rejected,
    1,
  );
});
test("German and Turkish text stays Unicode correct; search supports accents and sharp s", () => {
  assert.equal(normalizeGerman(" STRAẞE "), normalizeGerman("Straße"));
  const repo = new LocalVocabularyRepository(originalA1);
  assert.equal(
    repo.query({ search: "strasse" }).items[0].german_word,
    "Straße",
  );
  assert.ok(
    repo
      .query({ search: "çiçek" })
      .items.some((v) => v.german_word === "Blume"),
  );
  assert.ok(
    repo
      .query({ search: "ogrenmek" })
      .items.some((v) => v.german_word === "lernen"),
  );
  assert.ok(
    repo
      .query({ search: "schon" })
      .items.some((v) => v.german_word === "schön"),
  );
  const apple = repo.query({ search: "Apfel" }).items[0];
  assert.equal(apple.plural_form, "Äpfel");
});
test("daily list is stable across refreshes, new days are distinct, reviews stay separate", () => {
  let state = ensureDaily(initialLearning(), originalA1, day);
  const key = assignmentKey(day, "A1");
  const ids = state.assignments[key].newIds;
  assert.equal(ids.length, 10);
  assert.equal(new Set(ids).size, 10);
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(ensureDaily(restored, originalA1, day), restored);
  for (const id of ids)
    state = answerDaily(state, key, id, "known", day, originalA1);
  const tomorrow = addDays(day, 1);
  state = ensureDaily(state, originalA1, tomorrow);
  const next = state.assignments[assignmentKey(tomorrow, "A1")];
  assert.equal(
    next.newIds.some((id) => ids.includes(id)),
    false,
  );
  assert.deepEqual([...next.reviewIds].sort(), [...ids].sort());
  assert.equal(
    next.reviewIds.some((id) => next.newIds.includes(id)),
    false,
  );
});
test("goal changes apply tomorrow and vocabulary exhaustion is honest", () => {
  let state = ensureDaily(initialLearning(), originalA1, day);
  state = changeGoal(state, 20);
  assert.equal(
    ensureDaily(state, originalA1, day).assignments[assignmentKey(day, "A1")]
      .newIds.length,
    10,
  );
  state = ensureDaily(state, originalA1, addDays(day, 1));
  assert.equal(
    state.assignments[assignmentKey(addDays(day, 1), "A1")].newIds.length,
    20,
  );
  for (let i = 2; i < 6; i++)
    state = ensureDaily(state, originalA1, addDays(day, i));
  assert.equal(
    state.assignments[assignmentKey(addDays(day, 5), "A1")].newIds.length,
    0,
  );
  const high = ensureDaily(placeAt(state, "C2"), originalA1, day);
  assert.equal(high.assignments[assignmentKey(day, "C2")].newIds.length, 0);
  assert.equal(high.outbox.length, 0);
});
test("SRS schedules 1 then 3 days; again resets; stale and repeated submissions do not alter progress", () => {
  let state = ensureDaily(initialLearning(), originalA1, day);
  const key = assignmentKey(day, "A1"),
    id = state.assignments[key].newIds[0];
  state = answerDaily(state, key, id, "known", day, originalA1);
  assert.equal(state.progress[id].dueOn, addDays(day, 1));
  assert.equal(answerDaily(state, key, id, "again", day, originalA1), state);
  assert.equal(
    answerDaily(
      state,
      key,
      state.assignments[key].newIds[1],
      "known",
      addDays(day, 1),
      originalA1,
    ),
    state,
  );
  const nextDay = addDays(day, 1);
  state = ensureDaily(state, originalA1, nextDay);
  state = answerDaily(
    state,
    assignmentKey(nextDay, "A1"),
    id,
    "known",
    nextDay,
    originalA1,
  );
  assert.equal(state.progress[id].dueOn, addDays(nextDay, 3));
  const later = addDays(nextDay, 3);
  state = ensureDaily(state, originalA1, later);
  state = answerDaily(
    state,
    assignmentKey(later, "A1"),
    id,
    "again",
    later,
    originalA1,
  );
  assert.equal(state.progress[id].dueOn, addDays(later, 1));
  assert.equal(state.progress[id].streak, 0);
});
test("placement skips old levels without completing them; empty and locked units never complete", () => {
  let state = placeAt(initialLearning(), "B1");
  assert.equal(isUnlocked("A2", state.level), true);
  assert.equal(isUnlocked("C1", state.level), false);
  assert.deepEqual(state.milestones, []);
  assert.equal(unitAvailable(state, "b1-01"), true);
  assert.equal(unitAvailable(state, "b1-02"), false);
  const first = originalA1.filter((v) => v.unit_ids.includes("a1-01"));
  for (const v of first)
    state = answerUnit(state, "a1-01", v.id, "known", day, originalA1);
  assert.ok(state.milestones.includes("a1-01-words"));
  assert.equal(unitAvailable(state, "a1-02"), true);
  assert.equal(
    state.milestones.some((s) => s.startsWith("b1")),
    false,
  );
  assert.equal(state.outbox.length, 0);
});
test("rewards are idempotent and preserve an existing garden across replay and restore", () => {
  let state = ensureDaily(initialLearning(), originalA1, day);
  const key = assignmentKey(day, "A1");
  for (const id of state.assignments[key].newIds)
    state = answerDaily(state, key, id, "known", day, originalA1);
  assert.equal(state.outbox.length, 3);
  assert.equal(
    state.outbox
      .filter((r) => r.kind === "seed")
      .reduce((s, r) => s + r.amount, 0),
    2,
  );
  const previous = applyCommand(
    createStarter(100),
    { type: "plant", plotId: 0, species: "rose" },
    100,
  ).state;
  let garden = previous;
  for (let repeat = 0; repeat < 2; repeat++)
    for (const reward of state.outbox)
      garden = grantReward(garden, {
        id: reward.id,
        source: "vocabulary",
        ...(reward.kind === "seed"
          ? { seeds: { daisy: reward.amount } }
          : { coins: reward.amount }),
      });
  assert.deepEqual(garden.plots, previous.plots);
  assert.deepEqual(garden.decorations, previous.decorations);
  assert.equal(garden.seeds.rose, previous.seeds.rose);
  assert.equal(garden.seeds.daisy, previous.seeds.daisy + 2);
  assert.equal(garden.coins, previous.coins + 5);
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(
    answerDaily(
      restored,
      key,
      state.assignments[key].newIds[0],
      "known",
      day,
      originalA1,
    ),
    restored,
  );
});
test("local persistence restores assignments and response receipts; damaged and future data is protected", () => {
  const disk = new Map<string, string>();
  const memory = {
    getItem: (key: string) => disk.get(key) ?? null,
    setItem: (key: string, value: string) => {
      disk.set(key, value);
    },
  };
  const adapter = createLearningPersistence(() => memory);
  let state = ensureDaily(initialLearning(), originalA1, day);
  state = answerDaily(
    state,
    assignmentKey(day, "A1"),
    state.assignments[assignmentKey(day, "A1")].newIds[0],
    "again",
    day,
    originalA1,
  );
  assert.equal(validLearning(state), true);
  adapter.save(state);
  assert.deepEqual(adapter.load().state, state);
  adapter.save(state);
  disk.set(LEARNING_KEY, "broken");
  assert.equal(
    adapter.load().state.assignments[assignmentKey(day, "A1")].newIds.length,
    10,
  );
  assert.equal(disk.get(LEARNING_KEY + ":corrupt"), "broken");
  disk.set(LEARNING_KEY, '{"version":99}');
  assert.equal(adapter.load().readonly, true);
  assert.throws(() => adapter.save(state));
  const blocked = createLearningPersistence(() => {
    throw new Error("blocked");
  });
  assert.equal(blocked.load().readonly, true);
});
test("pagination bounds DOM-sized results with thousands of records", () => {
  const records = Array.from({ length: 4000 }, (_, i) => ({
    ...originalA1[i % 60],
    id: "large-" + i,
    german_word: originalA1[i % 60].german_word + " " + i,
    sense_key: "large-" + i,
  }));
  const repo = new LocalVocabularyRepository(records);
  const result = repo.query({ page: 200, pageSize: 12 });
  assert.equal(result.items.length, 12);
  assert.equal(result.total, 4000);
  assert.equal(
    repo
      .query({ article: "das", type: "noun", pageSize: 12 })
      .items.every((v) => v.article === "das"),
    true,
  );
});
test("calendar arithmetic uses local dates and handles month, year and DST boundaries", () => {
  assert.equal(localDate(new Date(2026, 9, 27, 0, 1)), "2026-10-27");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2026-03-28", 2), "2026-03-30");
  assert.equal(addDays("2028-02-28", 1), "2028-02-29");
});

test("empty noun fields are rejected without crashing the import", () => {
  const malformed = {
    ...originalA1.find((v) => v.word_type === "noun")!,
    german_word: "",
  };
  const result = importVocabulary([], [malformed]);
  assert.equal(result.report.rejected, 1);
  assert.equal(result.records.length, 0);
});

test("actual garden delivery adapter loads saved plants and survives replay and failed writes", async () => {
  const { createLocalGardenStorage, GARDEN_KEY } =
    await import("../garden/storage.ts");
  const data = new Map<string, string>();
  let failWrites = false;
  const disk = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (failWrites) throw new Error("quota");
      data.set(key, value);
    },
  };
  const now = Date.now();
  let garden = applyCommand(
    createStarter(now),
    { type: "plant", plotId: 0, species: "rose" },
    now,
  ).state;
  garden = applyCommand(
    garden,
    { type: "place", decoration: "fence", slot: 3 },
    now,
  ).state;
  createLocalGardenStorage(() => disk).save(garden);
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    value: { localStorage: disk },
    configurable: true,
  });
  try {
    const { deliverGardenReward } = await import("../garden/store.ts");
    const reward = {
      id: "adapter-test-once",
      source: "vocabulary" as const,
      seeds: { daisy: 1 },
      coins: 5,
    };
    assert.equal(await deliverGardenReward(reward), true);
    assert.equal(await deliverGardenReward(reward), true);
    let saved = JSON.parse(data.get(GARDEN_KEY)!);
    assert.equal(saved.seeds.daisy, garden.seeds.daisy + 1);
    assert.equal(saved.coins, garden.coins + 5);
    assert.deepEqual(saved.plots, garden.plots);
    assert.deepEqual(saved.placements, garden.placements);
    failWrites = true;
    const retry = { ...reward, id: "adapter-test-retry" };
    assert.equal(await deliverGardenReward(retry), false);
    assert.equal(
      JSON.parse(data.get(GARDEN_KEY)!).seeds.daisy,
      garden.seeds.daisy + 1,
    );
    failWrites = false;
    assert.equal(await deliverGardenReward(retry), true);
    saved = JSON.parse(data.get(GARDEN_KEY)!);
    assert.equal(saved.seeds.daisy, garden.seeds.daisy + 2);
    assert.equal(saved.coins, garden.coins + 10);
  } finally {
    if (previousWindow)
      Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
