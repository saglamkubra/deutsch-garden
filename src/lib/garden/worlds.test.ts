import test from "node:test";
import assert from "node:assert/strict";
import {
  applyCommand,
  createStarter,
  growth,
  grantReward,
  plantKey,
  type GardenState,
  type GardenCommand,
} from "./model.ts";
import {
  areaOf,
  allPlots,
  decorationWorld,
  flowerLocations,
} from "./worlds.ts";
import { WORLDS } from "./catalog.ts";
import {
  validateGarden,
  createLocalGardenStorage,
  GARDEN_KEY,
} from "./storage.ts";
import { validSnapshot, restore, capture } from "../account/snapshot.ts";
import { withGardenLock } from "./transaction.ts";
import { activities } from "../gamification/model.ts";
import { initialExercises } from "../exercises/types.ts";
const NOW = 1_000_000;
const act = (s: GardenState, c: GardenCommand, now = NOW) => {
  const r = applyCommand(s, c, now);
  assert.equal(r.error, undefined);
  assert.ok(validateGarden(r.state));
  assert.deepEqual(JSON.parse(JSON.stringify(r.state)), r.state);
  return r.state;
};
test("legacy A1 data stays in its original fields; six visits are free and never refill resources", () => {
  let s = act(createStarter(NOW), {
    type: "plant",
    species: "daisy",
    plotId: 0,
  });
  s = act(s, { type: "place", decoration: "mushroom", slot: 0 });
  const old = structuredClone(s);
  for (const w of WORLDS) {
    s = act(s, { type: "visit-world", world: w.id });
    assert.equal(s.activeWorld ?? "a1", w.id);
    assert.deepEqual(s.plots, old.plots);
    assert.deepEqual(s.placements, old.placements);
    assert.deepEqual(s.seeds, old.seeds);
    assert.equal(s.coins, old.coins);
    assert.deepEqual(s.appliedRewards, old.appliedRewards);
  }
  assert.equal(s.unlockedWorlds.length, 6);
  assert.equal(allPlots(s).length, 72);
  const same = applyCommand(s, { type: "visit-world", world: "c2" }, NOW);
  assert.strictEqual(same.state, s);
});
test("each world owns its plots; shared seeds cannot be spent twice and explicit queued targets survive switching", () => {
  let s = createStarter(NOW);
  for (const w of WORLDS) {
    s = act(s, { type: "visit-world", world: w.id });
    s = grantReward(s, {
      id: "test-seed:" + w.id,
      source: "gift",
      seeds: { daisy: 1 },
    });
    s = act(s, { type: "plant", species: "daisy", plotId: 0, world: w.id });
  }
  assert.equal(allPlots(s).filter((p) => p.plant).length, 6);
  assert.equal(s.seeds.daisy, 3);
  s = act(s, { type: "water", plotId: 0, world: "a2" });
  assert.equal(areaOf(s, "a2").plots[0].plant?.waterCount, 1);
  assert.equal(areaOf(s, "c2").plots[0].plant?.waterCount, 0);
  const occupied = applyCommand(
    s,
    { type: "plant", species: "daisy", plotId: 0, world: "a2" },
    NOW,
  );
  assert.ok(occupied.error);
  assert.strictEqual(occupied.state, s);
});
test("growth reconciles every visited garden even when another world is selected; harvest is unique", () => {
  let s = act(createStarter(NOW), { type: "visit-world", world: "b2" });
  s = act(s, { type: "plant", species: "daisy", plotId: 3, world: "b2" });
  const key = plantKey(areaOf(s, "b2").plots[3].plant!, 3);
  s = act(s, { type: "visit-world", world: "a1" });
  s = act(s, { type: "reconcile" }, NOW + 45000);
  assert.equal(areaOf(s, "b2").plots[3].plant?.bloomedAt, NOW + 45000);
  s = act(
    s,
    { type: "harvest", plotId: 3, plantKey: key, world: "b2" },
    NOW + 45000,
  );
  assert.equal(s.collection?.daisy?.quantity, 1);
  const twice = applyCommand(
    s,
    { type: "harvest", plotId: 3, plantKey: key, world: "b2" },
    NOW + 45000,
  );
  assert.ok(twice.error);
  assert.strictEqual(twice.state, s);
});
test("one owned decoration moves atomically across worlds; occupied target never removes its source", () => {
  let s = act(createStarter(NOW), {
    type: "place",
    decoration: "mushroom",
    slot: 0,
  });
  s = act(s, { type: "visit-world", world: "c1" });
  s = act(s, { type: "place", decoration: "mushroom", slot: 2, world: "c1" });
  assert.equal(decorationWorld(s, "mushroom"), "c1");
  assert.equal(s.placements[0], null);
  s = act(s, { type: "place", decoration: "stone", slot: 1 });
  const blocked = applyCommand(
    s,
    { type: "place", decoration: "mushroom", slot: 1 },
    NOW,
  );
  assert.ok(blocked.error);
  assert.strictEqual(blocked.state, s);
  assert.equal(decorationWorld(s, "mushroom"), "c1");
  s = act(s, { type: "remove", slot: 2, world: "c1" });
  assert.ok(s.decorations.includes("mushroom"));
  assert.equal(decorationWorld(s, "mushroom"), undefined);
});
test("collection display quantities are global; cross-world moves are atomic and stale moves fail", () => {
  let s = createStarter(NOW);
  s = {
    ...s,
    collection: {
      daisy: { quantity: 1, firstHarvestedAt: NOW, lastHarvestedAt: NOW },
    },
  };
  s = act(s, { type: "display-flower", species: "daisy", slot: 0 });
  s = act(s, { type: "visit-world", world: "a2" });
  assert.ok(
    applyCommand(
      s,
      { type: "display-flower", species: "daisy", slot: 1, world: "a2" },
      NOW,
    ).error,
  );
  s = act(s, {
    type: "display-flower",
    species: "daisy",
    slot: 1,
    world: "a2",
    from: 0,
    fromWorld: "a1",
  });
  assert.deepEqual(flowerLocations(s, "daisy"), [{ world: "a2", slot: 1 }]);
  assert.equal(s.collection!.daisy!.quantity, 1);
  assert.ok(
    applyCommand(
      s,
      {
        type: "display-flower",
        species: "daisy",
        slot: 2,
        world: "a2",
        from: 0,
        fromWorld: "a1",
      },
      NOW,
    ).error,
  );
  s = act(s, { type: "remove-flower", slot: 1, world: "a2" });
  assert.equal(s.collection!.daisy!.quantity, 1);
});
test("invalid or forged world state is rejected without overwriting a valid primary or backup", () => {
  let s = act(createStarter(NOW), { type: "visit-world", world: "a2" });
  s = act(s, { type: "place", decoration: "mushroom", slot: 0, world: "a2" });
  for (const modify of [
    (v: GardenState) => {
      v.activeWorld = "bad" as never;
    },
    (v: GardenState) => {
      v.worldGardens!.a2!.placements[1] = "mushroom";
    },
    (v: GardenState) => {
      v.placements[0] = "mushroom";
    },
    (v: GardenState) => {
      v.worldGardens!.a2!.plots.pop();
    },
    (v: GardenState) => {
      (v.worldGardens as Record<string, unknown>).invalid = {};
    },
  ]) {
    const v = structuredClone(s);
    modify(v);
    assert.equal(validateGarden(v), false);
  }
  assert.ok(
    applyCommand(s, { type: "visit-world", world: "bad" as never }, NOW).error,
  );
  assert.ok(
    applyCommand(
      s,
      { type: "plant", world: "c2", species: "daisy", plotId: 0 },
      NOW,
    ).error,
  );
});
test("one learning receipt boosts growing plants in every world once under the existing shared daily cap", () => {
  let s = act(createStarter(NOW), {
    type: "plant",
    species: "daisy",
    plotId: 0,
  });
  s = act(s, { type: "visit-world", world: "b1" });
  s = act(s, { type: "plant", world: "b1", species: "daisy", plotId: 0 });
  const reward = {
    id: "course:lesson:world-test",
    source: "exercise" as const,
  };
  s = grantReward(s, reward, NOW);
  assert.equal(s.learningGarden?.dailyBoosts, 1);
  assert.ok(
    allPlots(s)
      .filter((p) => p.plant)
      .every((p) => p.plant!.learningBonusMs === 5000),
  );
  assert.strictEqual(grantReward(s, reward, NOW), s);
  for (let i = 0; i < 10; i++)
    s = grantReward(s, { ...reward, id: reward.id + i }, NOW);
  assert.equal(s.learningGarden?.dailyBoosts, 6);
  assert.ok(
    allPlots(s)
      .filter((p) => p.plant)
      .every((p) => p.plant!.learningBonusMs === 30000),
  );
  assert.equal(
    growth(areaOf(s, "b1").plots[0].plant!, NOW).readyAt,
    NOW + 15000,
  );
});
test("six worlds round-trip existing device storage and account snapshots without a new schema", () => {
  let s = createStarter(NOW);
  for (const w of WORLDS) s = act(s, { type: "visit-world", world: w.id });
  const data = new Map<string, string>();
  const disk = {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    key: (i: number) => [...data.keys()][i] ?? null,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
  };
  const local = createLocalGardenStorage(() => disk);
  local.save(s);
  assert.deepEqual(local.load(NOW).state, s);
  const snap = { version: 1 as const, modules: { garden: s } };
  assert.ok(validSnapshot(snap));
  restore(disk, "A", snap);
  assert.deepEqual(capture(disk, "A").modules.garden, s);
  assert.equal(data.get(GARDEN_KEY), JSON.stringify(s));
  assert.equal(capture(disk, "B").modules.garden, undefined);
});
test("parallel clicks share the existing garden lock; the last seed is consumed once across two worlds", async () => {
  let s = act(createStarter(NOW), { type: "visit-world", world: "a2" });
  s = { ...s, seeds: { ...s.seeds, daisy: 1 } };
  const results = await Promise.all(
    ["a1", "a2"].map((world) =>
      withGardenLock(() => {
        const r = applyCommand(
          s,
          {
            type: "plant",
            species: "daisy",
            plotId: 0,
            world: world as "a1" | "a2",
          },
          NOW,
        );
        s = r.state;
        return !r.error;
      }),
    ),
  );
  assert.equal(results.filter(Boolean).length, 1);
  assert.equal(s.seeds.daisy, 0);
  assert.equal(allPlots(s).filter((p) => p.plant).length, 1);
  assert.ok(validateGarden(s));
});
test("new-world harvest supplies existing first-bloom evidence without inventing rewards or changing SQL", () => {
  let s = act(createStarter(NOW), { type: "visit-world", world: "c2" });
  s = act(s, { type: "plant", world: "c2", species: "daisy", plotId: 0 });
  const plant = areaOf(s, "c2").plots[0].plant!;
  s = act(
    s,
    { type: "harvest", world: "c2", plotId: 0, plantKey: plantKey(plant, 0) },
    NOW + 45000,
  );
  assert.ok(
    activities({ exercises: initialExercises(), garden: s }, NOW + 45000).some(
      (e) => e.kind === "bloom",
    ),
  );
  assert.deepEqual(s.appliedRewards, ["starter-v1"]);
});
