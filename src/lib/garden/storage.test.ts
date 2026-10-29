import test from "node:test";
import assert from "node:assert/strict";
import { createStarter, applyCommand, growth } from "./model.ts";
import {
  createLocalGardenStorage,
  GARDEN_KEY,
  validateGarden,
} from "./storage.ts";
function memory() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}
const NOW = 1_000_000;
test("starter inventory is saved once and planting survives repeated reloads", () => {
  const disk = memory();
  const adapter = createLocalGardenStorage(() => disk);
  const starter = adapter.load(NOW);
  adapter.save(starter.state);
  const planted = applyCommand(
    starter.state,
    { type: "plant", plotId: 0, species: "daisy" },
    NOW,
  ).state;
  adapter.save(planted);
  const restored = adapter.load(NOW + 45000);
  assert.equal(restored.mode, "local");
  assert.equal(restored.state.seeds.daisy, 2);
  assert.equal(
    growth(restored.state.plots[0].plant!, NOW + 45000).stage,
    "bloom",
  );
  adapter.save(restored.state);
  assert.equal(adapter.load(NOW + 50000).state.seeds.daisy, 2);
  assert.equal(restored.state.coins, 30);
});
test("water timestamps, seeds and decorations all restore together", () => {
  const disk = memory();
  const adapter = createLocalGardenStorage(() => disk);
  let state = createStarter(NOW);
  state = applyCommand(
    state,
    { type: "plant", plotId: 0, species: "rose" },
    NOW,
  ).state;
  state = applyCommand(state, { type: "water", plotId: 0 }, NOW + 5).state;
  state = applyCommand(
    state,
    { type: "place", decoration: "mushroom", slot: 2 },
    NOW + 6,
  ).state;
  adapter.save(state);
  assert.deepEqual(adapter.load(NOW + 10).state, state);
  assert.equal(state.plots[0].plant?.lastWateredAt, NOW + 5);
});
test("corrupted primary restores last valid backup and preserves damaged raw data", () => {
  const disk = memory();
  const adapter = createLocalGardenStorage(() => disk);
  const starter = createStarter(NOW);
  adapter.save(starter);
  adapter.save(
    applyCommand(starter, { type: "plant", plotId: 0, species: "rose" }, NOW)
      .state,
  );
  disk.setItem(GARDEN_KEY, "{broken");
  const restored = adapter.load(NOW + 100);
  assert.deepEqual(restored.state, starter);
  assert.equal(disk.getItem(GARDEN_KEY + ":corrupt"), "{broken");
  assert.match(restored.notice, /yedek/);
});
test("corruption without a backup recovers explicitly, not as false progress", () => {
  const disk = memory();
  disk.setItem(GARDEN_KEY, '{"version":1}');
  const restored = createLocalGardenStorage(() => disk).load(NOW);
  assert.equal(
    restored.state.plots.every((p) => p.plant === null),
    true,
  );
  assert.match(restored.notice, /Hasarlı/);
  assert.equal(restored.state.appliedRewards.length, 1);
});
test("future versions are read-only and never overwritten", () => {
  const disk = memory();
  const raw = '{"version":2,"special":"keep"}';
  disk.setItem(GARDEN_KEY, raw);
  const adapter = createLocalGardenStorage(() => disk);
  assert.equal(adapter.load(NOW).mode, "readonly");
  assert.throws(() => adapter.save(createStarter(NOW)));
  assert.equal(disk.getItem(GARDEN_KEY), raw);
});
test("disabled storage and quota failures are explicit", () => {
  const blocked = createLocalGardenStorage(() => {
    throw new Error("blocked");
  });
  assert.equal(blocked.load(NOW).mode, "memory");
  assert.throws(() => blocked.save(createStarter(NOW)));
  const disk = memory();
  disk.setItem(GARDEN_KEY, "bad");
  const quota = {
    getItem: disk.getItem,
    setItem: () => {
      throw new Error("quota");
    },
  };
  assert.equal(
    createLocalGardenStorage(() => quota).load(NOW).mode,
    "readonly",
  );
  assert.equal(disk.getItem(GARDEN_KEY), "bad");
});
test("validation rejects malformed inventory, duplicate decoration placements and impossible watering", () => {
  const starter = createStarter(NOW);
  assert.equal(validateGarden(starter), true);
  assert.equal(
    validateGarden({ ...starter, seeds: { ...starter.seeds, rose: -1 } }),
    false,
  );
  assert.equal(
    validateGarden({
      ...starter,
      placements: ["fence", "fence", null, null, null, null],
    }),
    false,
  );
  const planted = applyCommand(
    starter,
    { type: "plant", plotId: 0, species: "rose" },
    NOW,
  ).state;
  planted.plots[0].plant!.waterCount = 3;
  assert.equal(validateGarden(planted), false);
  assert.equal(
    validateGarden({ ...starter, plots: starter.plots.slice(1) }),
    false,
  );
});
