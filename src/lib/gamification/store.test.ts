import { test } from "node:test";
import assert from "node:assert/strict";
import { initialLearning, localDate } from "../learning/engine.ts";
import { createStarter, applyCommand } from "../garden/model.ts";
import { GARDEN_KEY } from "../garden/storage.ts";
import { LEARNING_KEY } from "../learning/persistence.ts";
import { EXERCISE_KEY } from "../exercises/persistence.ts";
import { setStorageOwner } from "../account/storage.ts";
test("Real achievement writer serializes double clicks and recovers after garden-success/metadata-failure", async () => {
  const data = new Map<string, string>(),
    events = new EventTarget();
  let failFinal = false;
  const storage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (
        failFinal &&
        k === EXERCISE_KEY &&
        JSON.parse(v).gamification?.badges["first-bloom"]?.claimed
      ) {
        failFinal = false;
        throw new Error("disk quota");
      }
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: storage,
      dispatchEvent: events.dispatchEvent.bind(events),
      addEventListener: events.addEventListener.bind(events),
      removeEventListener: events.removeEventListener.bind(events),
    },
  });
  Object.defineProperty(globalThis, "StorageEvent", {
    configurable: true,
    value: class extends Event {
      key: string | null;
      constructor(type: string, init: { key?: string }) {
        super(type);
        this.key = init.key ?? null;
      }
    },
  });
  const tails = new Map<string, Promise<void>>();
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      locks: {
        request: async <T>(name: string, run: () => Promise<T> | T) => {
          const before = tails.get(name) ?? Promise.resolve();
          let release!: () => void;
          const next = new Promise<void>((resolve) => {
            release = resolve;
          });
          tails.set(name, next);
          await before;
          try {
            return await run();
          } finally {
            release();
          }
        },
      },
    },
  });
  setStorageOwner(null);
  const now = Date.now(),
    day = localDate(),
    learning = initialLearning();
  learning.assignments[day + ":A1"] = {
    id: day + ":A1",
    date: day,
    level: "A1",
    goal: 5,
    newIds: ["word"],
    reviewIds: [],
    answers: { word: "known" },
  };
  storage.setItem(LEARNING_KEY, JSON.stringify(learning));
  let garden = createStarter(now - 200000);
  garden = applyCommand(
    garden,
    { type: "plant", plotId: 0, species: "daisy" },
    now - 100000,
  ).state;
  garden = applyCommand(garden, { type: "reconcile" }, now).state;
  storage.setItem(GARDEN_KEY, JSON.stringify(garden));
  const { claimAchievement, refreshGamification } = await import("./store.ts");
  await refreshGamification();
  const results = await Promise.all(
    Array.from({ length: 4 }, () => claimAchievement("first-vocabulary")),
  );
  assert.ok(results.every(Boolean));
  let saved = JSON.parse(storage.getItem(GARDEN_KEY)!);
  assert.equal(saved.seeds.daisy, garden.seeds.daisy + 2);
  assert.equal(
    saved.appliedRewards.filter(
      (id: string) => id === "achievement:first-vocabulary",
    ).length,
    1,
  );
  failFinal = true;
  await assert.rejects(claimAchievement("first-bloom"), /disk quota/);
  saved = JSON.parse(storage.getItem(GARDEN_KEY)!);
  const cherry = saved.seeds.cherry;
  assert.equal(await claimAchievement("first-bloom"), true);
  assert.equal(JSON.parse(storage.getItem(GARDEN_KEY)!).seeds.cherry, cherry);
  assert.equal(
    JSON.parse(storage.getItem(EXERCISE_KEY)!).gamification.badges[
      "first-bloom"
    ].claimed,
    true,
  );
  assert.equal(await claimAchievement("first-diary"), false);
});
