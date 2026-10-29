import { test } from "node:test";
import assert from "node:assert/strict";
import { initialLearning, localDate } from "../learning/engine.ts";
import { initialExercises } from "../exercises/types.ts";
import {
  validState,
  createExercisePersistence,
} from "../exercises/persistence.ts";
import { createStarter, grantReward, applyCommand } from "../garden/model.ts";
import { startSession, submitAnswer, advance } from "../exercises/engine.ts";
import {
  BADGES,
  activities,
  badgeReward,
  gameLevel,
  missionProgress,
  reconcile,
  streak,
  validGame,
  type Activity,
  type Sources,
} from "./model.ts";
import { totalXp } from "./rewards.ts";
const now = new Date(2026, 9, 28, 14).getTime(),
  today = localDate(new Date(now));
const available = {
  words: 60,
  exercise: true,
  listening: true,
  grammar: true,
  story: true,
};
const source = (): Sources => ({
  exercises: initialExercises(),
  learning: initialLearning(),
  garden: createStarter(now - 1000000),
});
function practice(s: Sources, n: number, date = today) {
  for (let i = 0; i < n; i++)
    s.learning!.progress["word-" + i] = {
      introducedOn: date,
      dueOn: date,
      known: true,
      streak: 1,
      lastAnsweredOn: date,
      responses: 1,
    };
  return s;
}
function quiz(s: Sources, id = "quiz", wrong = false) {
  const questions = Array.from({ length: 3 }, (_, i) => ({
    id: "q" + i,
    type: "choice" as const,
    wordIds: ["word-" + i],
    prompt: "Seç",
    options: ["doğru", "yanlış"],
    accepted: ["doğru"],
    explanation: "Açıklama",
  }));
  s.exercises = startSession(
    s.exercises,
    questions,
    "daily",
    today,
    "A1",
    now - 1000,
    id,
    true,
  );
  for (let i = 0; i < 3; i++) {
    s.exercises = submitAnswer(
      s.exercises,
      id,
      wrong && i === 0 ? "yanlış" : "doğru",
      now,
    );
    s.exercises = advance(s.exercises, id);
  }
  return s;
}
test("Existing XP is preserved; vocabulary uses same ledger, 20 daily receipts and no replay credit", () => {
  const s = practice(source(), 25);
  s.exercises.xp = { "grammar:topic:legacy": 15, "gift:daily:2026-10-27": 10 };
  const next = reconcile(s, available, now);
  assert.equal(totalXp(next.xp), 125);
  assert.equal(
    Object.keys(next.xp).filter((id) => id.startsWith("vocabulary:")).length,
    20,
  );
  assert.equal(validState(next), true);
  assert.equal(reconcile({ ...s, exercises: next }, available, now), next);
  const copy = JSON.parse(JSON.stringify(next));
  assert.equal(
    totalXp(reconcile({ ...s, exercises: copy }, available, now).xp),
    125,
  );
  assert.equal(s.exercises.xp["vocabulary:" + today + ":word-0"], undefined);
});
test("Older practice is recognized without inventing retrospective XP", () => {
  const s = practice(source(), 2, "2026-10-20"),
    n = reconcile(s, available, now);
  assert.equal(totalXp(n.xp), 0);
  assert.equal(Object.keys(n.gamification!.events).length, 2);
});
test("Mission selection uses available content; targets freeze for day and reset at local midnight", () => {
  const s = practice(source(), 5);
  s.learning!.goal = 5;
  let n = reconcile(s, available, now);
  const m = n.gamification!.days[today].missions.find((m) => m.id === "words")!;
  assert.equal(m.target, 5);
  assert.equal(m.completedAt, now);
  assert.equal(
    missionProgress(m, Object.values(n.gamification!.events), today),
    5,
  );
  s.learning!.goal = 20;
  n = reconcile({ ...s, exercises: n }, available, now);
  assert.equal(n.gamification!.days[today].missions[0].target, 5);
  const tomorrow = new Date(2026, 9, 29, 0, 0, 1).getTime();
  n = reconcile({ ...s, exercises: n }, available, tomorrow);
  assert.equal(
    n.gamification!.days[localDate(new Date(tomorrow))].missions[0].target,
    20,
  );
  assert.equal(n.gamification!.days[today].missions[0].completedAt, now);
  const empty = reconcile(
    source(),
    {
      words: 0,
      exercise: false,
      listening: false,
      grammar: false,
      story: false,
    },
    now,
  );
  assert.deepEqual(empty.gamification!.days[today].missions, []);
  s.learning!.progress.unavailable = {
    introducedOn: "2026-10-20",
    dueOn: today,
    known: false,
    streak: 0,
    lastAnsweredOn: "2026-10-20",
    responses: 1,
  };
  const noReview = reconcile(
    { ...s, exercises: initialExercises() },
    { ...available, wordIds: ["different-word"] },
    now,
  );
  assert.equal(
    noReview.gamification!.days[today].missions.some((m) => m.id === "review"),
    false,
  );
});
test("Streaks ignore gifts and garden growth; a missed day keeps rewards and longest streak", () => {
  const events: Activity[] = ["2026-10-25", "2026-10-26", "2026-10-27"].map(
    (day) => ({ id: day, kind: "word", day, at: null, word: day }),
  );
  assert.equal(streak(events, "2026-10-28").current, 3);
  assert.equal(streak(events, "2026-10-29").current, 0);
  assert.equal(streak(events, "2026-10-29").longest, 3);
  assert.equal(
    streak(
      [...events, { id: "bloom", kind: "bloom", day: "2026-10-28", at: now }],
      "2026-10-28",
    ).current,
    3,
  );
  assert.equal(
    streak(
      [
        { id: "a", kind: "word", day: "2024-02-29", at: null },
        { id: "b", kind: "word", day: "2024-03-01", at: null },
      ],
      "2024-03-01",
    ).current,
    2,
  );
  const s = source();
  s.exercises.xp = { "gift:daily:2026-10-28": 10 };
  assert.equal(streak(activities(s, now), today).current, 0);
});
test("Perfect quiz badge requires complete first answers; mistakes never count as perfect", () => {
  const good = reconcile(quiz(source()), available, now);
  assert.ok(good.gamification!.badges["first-perfect"]);
  assert.equal(good.gamification!.badges["first-perfect"].earnedOn, today);
  const bad = reconcile(quiz(source(), "bad", true), available, now);
  assert.equal(bad.gamification!.badges["first-perfect"], undefined);
  assert.equal(validState(good), true);
});
test("100 unique words, ten sessions and blooming unlock real badges; diary requires its own verified receipt", () => {
  const s = practice(source(), 100);
  for (let i = 0; i < 10; i++) quiz(s, "quiz" + i);
  s.garden = applyCommand(
    s.garden!,
    { type: "plant", plotId: 0, species: "daisy" },
    now - 100000,
  ).state;
  const n = reconcile(s, available, now);
  assert.ok(n.gamification!.badges["words-100"]);
  assert.ok(n.gamification!.badges["sessions-10"]);
  assert.ok(n.gamification!.badges["first-bloom"]);
  assert.equal(n.gamification!.badges["first-diary"], undefined);
  assert.equal(BADGES.length, 10);
  assert.equal(streak(Object.values(n.gamification!.events), today).current, 1);
});
test("Badge rewards reuse garden receipts and placement; duplicate clicks cannot mint seeds or decorations", () => {
  let garden = createStarter(now);
  const reward = badgeReward("first-vocabulary")!;
  garden = grantReward(garden, reward);
  assert.equal(garden.seeds.daisy, createStarter(now).seeds.daisy + 2);
  assert.equal(grantReward(garden, reward), garden);
  garden = grantReward(garden, badgeReward("first-conversation")!);
  const owned = garden.decorations.length;
  assert.equal(
    grantReward(garden, badgeReward("first-conversation")!).decorations.length,
    owned,
  );
  assert.equal(
    applyCommand(
      garden,
      { type: "place", decoration: "pink-butterfly", slot: 0 },
      now,
    ).state.placements[0],
    "pink-butterfly",
  );
  assert.equal(badgeReward("first-diary")?.seeds?.tulip, 1);
  assert.equal(garden.coins, 30);
  garden = grantReward(garden, badgeReward("words-100")!);
  assert.ok(garden.unlockedFlowers.includes("moonflower"));
  assert.equal(
    applyCommand(
      garden,
      { type: "plant", plotId: 0, species: "moonflower" },
      now,
    ).state.plots[0].plant?.species,
    "moonflower",
  );
});
test("Exercise XP has global daily cap; repeats retain session progress without more XP", () => {
  const s = source();
  for (let i = 0; i < 12; i++) {
    const questions = Array.from({ length: 3 }, (_, j) => ({
      id: `unique-${i}-${j}`,
      type: "choice" as const,
      wordIds: ["word"],
      prompt: "Seç",
      options: ["x", "y"],
      accepted: ["x"],
      explanation: "Örnek",
    }));
    const id = "s" + i;
    s.exercises = startSession(
      s.exercises,
      questions,
      "choice",
      today,
      "A1",
      now,
      id,
    );
    for (let j = 0; j < 3; j++) {
      s.exercises = submitAnswer(s.exercises, id, "x", now);
      s.exercises = advance(s.exercises, id);
    }
  }
  assert.equal(totalXp(s.exercises.xp), 100);
  assert.equal(
    Object.values(s.exercises.sessions).filter((s) => s.completedAt).length,
    12,
  );
});
test("Additive metadata round-trips with old storage; malformed records stay protected", () => {
  const state = reconcile(source(), available, now),
    disk = new Map<string, string>();
  const p = createExercisePersistence(() => ({
    getItem: (k) => disk.get(k) ?? null,
    setItem: (k, v) => {
      disk.set(k, v);
    },
  }));
  p.save(state);
  assert.deepEqual(p.load().state, state);
  assert.equal(validState(initialExercises()), true);
  assert.equal(validGame({ ...state.gamification, version: 2 }), false);
  assert.equal(validState({ ...state, xp: { bad: "5" } }), false);
  assert.equal(
    validGame({
      ...state.gamification,
      badges: { "unknown-badge": { earnedOn: today, claimed: true } },
    }),
    false,
  );
});
test("Progression thresholds increase and game titles are independent of CEFR", () => {
  assert.equal(gameLevel(0).title, "Tohum Kaşifi");
  assert.equal(gameLevel(100).title, "Küçük Filiz");
  assert.equal(gameLevel(299).number, 2);
  assert.equal(gameLevel(2500).percent, 100);
  assert.equal(gameLevel(300).next?.xp, 700);
});
