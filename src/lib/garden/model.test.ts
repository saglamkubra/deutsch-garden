import test from "node:test";
import assert from "node:assert/strict";
import {
  createStarter,
  applyCommand,
  growth,
  watering,
  grantReward,
} from "./model.ts";
import { FLOWERS, GARDEN_CONFIG as config } from "./catalog.ts";
const NOW = 1_000_000;
test("planting consumes exactly one owned seed and preserves the input", () => {
  const initial = createStarter(NOW);
  const result = applyCommand(
    initial,
    { type: "plant", plotId: 0, species: "daisy" },
    NOW,
  );
  assert.equal(result.event, "planted");
  assert.equal(result.state.seeds.daisy, 2);
  assert.equal(initial.seeds.daisy, 3);
  assert.equal(initial.plots[0].plant, null);
  assert.equal(result.state.plots[0].plant?.plantedAt, NOW);
});
test("no seeds and occupied plots cannot be planted; invalid plot is rejected", () => {
  const empty = createStarter(NOW);
  empty.seeds.rose = 0;
  assert.ok(
    applyCommand(empty, { type: "plant", plotId: 1, species: "rose" }, NOW)
      .error,
  );
  const planted = applyCommand(
    empty,
    { type: "plant", plotId: 1, species: "daisy" },
    NOW,
  ).state;
  const duplicate = applyCommand(
    planted,
    { type: "plant", plotId: 1, species: "tulip" },
    NOW + 1,
  );
  assert.ok(duplicate.error);
  assert.equal(duplicate.state, planted);
  assert.equal(planted.seeds.tulip, 2);
  assert.ok(
    applyCommand(empty, { type: "plant", plotId: 99, species: "daisy" }, NOW)
      .error,
  );
});
test("watering applies one bonus, enforces cooldown and a lifetime limit", () => {
  let state = applyCommand(
    createStarter(NOW),
    { type: "plant", plotId: 0, species: "cherry" },
    NOW,
  ).state;
  assert.equal(watering(state.plots[0].plant!, NOW).allowed, true);
  state = applyCommand(state, { type: "water", plotId: 0 }, NOW + 1000).state;
  assert.equal(state.plots[0].plant?.waterCount, 1);
  assert.equal(growth(state.plots[0].plant!, NOW + 1000).remainingMs, 109000);
  const repeated = applyCommand(
    state,
    { type: "water", plotId: 0 },
    NOW + 1001,
  );
  assert.ok(repeated.error);
  assert.equal(repeated.state, state);
  assert.equal(watering(state.plots[0].plant!, NOW + 1001).remainingMs, 19999);
  state = applyCommand(state, { type: "water", plotId: 0 }, NOW + 21000).state;
  assert.equal(state.plots[0].plant?.waterCount, 2);
  assert.ok(
    applyCommand(state, { type: "water", plotId: 0 }, NOW + 41001).error,
  );
  assert.equal(
    growth(state.plots[0].plant!, NOW + 41001).readyAt,
    NOW + 100000,
  );
});
test("five growth stages use timestamps and continue while closed", () => {
  const state = applyCommand(
    createStarter(NOW),
    { type: "plant", plotId: 0, species: "daisy" },
    NOW,
  ).state;
  const plant = state.plots[0].plant!;
  assert.equal(growth(plant, NOW).stage, "seed");
  assert.equal(growth(plant, NOW + 9000).stage, "sprout");
  assert.equal(growth(plant, NOW + 22500).stage, "growing");
  assert.equal(growth(plant, NOW + 36000).stage, "bud");
  assert.equal(growth(plant, NOW + 45000).stage, "bloom");
  assert.equal(growth(plant, NOW + 86_400_000).progress, 1);
  const reopened = JSON.parse(JSON.stringify(state));
  const bloomed = applyCommand(
    reopened,
    { type: "reconcile" },
    NOW + 86_400_000,
  );
  assert.equal(bloomed.event, "bloomed");
  assert.equal(bloomed.state.plots[0].plant?.bloomedAt, NOW + 45000);
  const again = applyCommand(
    bloomed.state,
    { type: "reconcile" },
    NOW + 90_000_000,
  );
  assert.equal(again.state, bloomed.state);
  assert.equal(again.event, undefined);
  assert.equal(again.state.coins, 30);
  assert.ok(
    applyCommand(bloomed.state, { type: "water", plotId: 0 }, NOW + 90_000_000)
      .error,
  );
});
test("all species mature at their catalog durations", () => {
  for (const flower of FLOWERS) {
    const state = applyCommand(
      grantReward(createStarter(NOW), {
        id: "test-seed-" + flower.id,
        source: "exercise",
        seeds: { [flower.id]: 1 },
        flowers: [flower.id],
      }),
      { type: "plant", plotId: 0, species: flower.id },
      NOW,
    ).state;
    const plant = state.plots[0].plant!;
    assert.notEqual(growth(plant, NOW + flower.durationMs - 1).stage, "bloom");
    assert.equal(growth(plant, NOW + flower.durationMs).stage, "bloom");
  }
});
test("decoration move and removal preserve ownership and protect occupied slots", () => {
  const initial = createStarter(NOW);
  let state = applyCommand(
    initial,
    { type: "place", decoration: "fence", slot: 0 },
    NOW,
  ).state;
  state = applyCommand(
    state,
    { type: "place", decoration: "fence", slot: 4 },
    NOW + 1,
  ).state;
  assert.equal(state.placements[0], null);
  assert.equal(state.placements[4], "fence");
  assert.equal(state.placements.filter((d) => d === "fence").length, 1);
  assert.ok(
    applyCommand(
      state,
      { type: "place", decoration: "stone", slot: 4 },
      NOW + 2,
    ).error,
  );
  state = applyCommand(state, { type: "remove", slot: 4 }, NOW + 3).state;
  assert.equal(state.placements[4], null);
  assert.deepEqual(state.decorations, initial.decorations);
  assert.equal(state.coins, initial.coins);
  assert.ok(
    applyCommand(
      state,
      { type: "place", decoration: "fence", slot: config.decorationSlots },
      NOW,
    ).error,
  );
  const unowned = {
    ...state,
    decorations: state.decorations.filter((d) => d !== "stone"),
  };
  assert.ok(
    applyCommand(unowned, { type: "place", decoration: "stone", slot: 0 }, NOW)
      .error,
  );
});
test("future reward adapter is idempotent after serialization and rejects invalid amounts", () => {
  const reward = {
    id: "future-exercise-123",
    source: "exercise" as const,
    coins: 5,
    seeds: { daisy: 1 },
  };
  const state = grantReward(createStarter(NOW), reward);
  assert.equal(state.coins, 35);
  assert.equal(state.seeds.daisy, 4);
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(grantReward(restored, reward), restored);
  assert.throws(() =>
    grantReward(state, { id: "bad", source: "exercise", coins: -1 }),
  );
  assert.throws(() =>
    grantReward(state, { id: "bad", source: "exercise", seeds: { rose: 1.5 } }),
  );
});
test("clock rollback does not award growth or consume resources through actions", () => {
  const state = createStarter(NOW);
  assert.ok(
    applyCommand(state, { type: "plant", plotId: 0, species: "daisy" }, NOW - 1)
      .error,
  );
  assert.equal(state.seeds.daisy, 3);
});
