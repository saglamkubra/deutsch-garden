import test from "node:test";
import assert from "node:assert/strict";
import {
  createStarter,
  applyCommand,
  grantReward,
  growth,
  plantKey,
} from "../garden/model.ts";
import { FLOWERS } from "../garden/catalog.ts";
import {
  validateGarden,
  createLocalGardenStorage,
  GARDEN_KEY,
} from "../garden/storage.ts";
import { claimGift, giftStatus, validGiftClaims, GIFT_POOL } from "./model.ts";
import { gardenDay, nextGardenDay } from "../garden/calendar.ts";
import { validState as validXp } from "../exercises/persistence.ts";
import { initialExercises } from "../exercises/types.ts";
const NOW = Date.parse("2026-10-27T12:00:00+03:00");
function planted() {
  return applyCommand(
    createStarter(NOW),
    { type: "plant", plotId: 0, species: "daisy" },
    NOW,
  ).state;
}
function memory() {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}
test("all five growth stages are distinct, timestamp based, and every species matures offline", () => {
  for (const f of FLOWERS) {
    const s = applyCommand(
        grantReward(createStarter(NOW), {
          id: "test-seed",
          source: "exercise",
          flowers: [f.id],
          seeds: { [f.id]: 1 },
        }),
        { type: "plant", plotId: 0, species: f.id },
        NOW,
      ).state,
      p = s.plots[0].plant!;
    assert.equal(growth(p, NOW).stage, "seed");
    assert.equal(growth(p, NOW + f.durationMs * 0.2).stage, "sprout");
    assert.equal(growth(p, NOW + f.durationMs * 0.5).stage, "growing");
    assert.equal(growth(p, NOW + f.durationMs * 0.8).stage, "bud");
    assert.equal(growth(p, NOW + 86400000).stage, "bloom");
  }
});
test("harvest frees the plot and permanently collects exactly one flower; immature and stale actions fail", () => {
  const s = planted(),
    key = plantKey(s.plots[0].plant!, 0);
  assert.ok(
    applyCommand(s, { type: "harvest", plotId: 0, plantKey: key }, NOW + 1000)
      .error,
  );
  const result = applyCommand(
    s,
    { type: "harvest", plotId: 0, plantKey: key },
    NOW + 45000,
  );
  assert.equal(result.event, "harvested");
  assert.equal(result.state.plots[0].plant, null);
  assert.equal(result.state.collection?.daisy?.quantity, 1);
  assert.equal(result.state.coins, s.coins);
  assert.ok(validateGarden(result.state));
  const duplicate = applyCommand(
    result.state,
    { type: "harvest", plotId: 0, plantKey: key },
    NOW + 45000,
  );
  assert.ok(duplicate.error);
  assert.equal(duplicate.state, result.state);
  const replanted = applyCommand(
    result.state,
    { type: "plant", plotId: 0, species: "daisy" },
    NOW + 45000,
  ).state;
  assert.notEqual(plantKey(replanted.plots[0].plant!, 0), key);
  assert.ok(
    applyCommand(
      replanted,
      { type: "harvest", plotId: 0, plantKey: key },
      NOW + 90000,
    ).error,
  );
  assert.equal(replanted.collection?.daisy?.quantity, 1);
  const second = applyCommand(
    replanted,
    {
      type: "harvest",
      plotId: 0,
      plantKey: plantKey(replanted.plots[0].plant!, 0),
    },
    NOW + 90000,
  ).state;
  assert.equal(second.collection?.daisy?.quantity, 2);
  assert.equal(second.collection?.daisy?.firstHarvestedAt, NOW + 45000);
});
test("legacy mature flowers can be harvested without IDs or bloom bookkeeping", () => {
  const s = planted();
  delete s.plots[0].plant!.id;
  const key = plantKey(s.plots[0].plant!, 0);
  const next = applyCommand(
    s,
    { type: "harvest", plotId: 0, plantKey: key },
    NOW + 86400000,
  ).state;
  assert.equal(next.collection?.daisy?.quantity, 1);
  assert.ok(validateGarden(next));
});
test("collection display, move and remove preserve quantity and protect occupied slots", () => {
  const s = planted();
  let n = applyCommand(
    s,
    { type: "harvest", plotId: 0, plantKey: plantKey(s.plots[0].plant!, 0) },
    NOW + 45000,
  ).state;
  assert.ok(
    applyCommand(
      n,
      { type: "display-flower", species: "rose", slot: 0 },
      NOW + 45000,
    ).error,
  );
  n = applyCommand(
    n,
    { type: "display-flower", species: "daisy", slot: 0 },
    NOW + 45000,
  ).state;
  assert.equal(n.collection?.daisy?.quantity, 1);
  assert.ok(
    applyCommand(
      n,
      { type: "display-flower", species: "daisy", slot: 1 },
      NOW + 45000,
    ).error,
  );
  n = applyCommand(
    n,
    { type: "display-flower", species: "daisy", slot: 3, from: 0 },
    NOW + 45000,
  ).state;
  assert.equal(n.flowerPlacements?.[0], null);
  assert.equal(n.flowerPlacements?.[3], "daisy");
  assert.ok(
    applyCommand(
      n,
      { type: "display-flower", species: "daisy", slot: 2, from: 0 },
      NOW + 45000,
    ).error,
  );
  n = applyCommand(n, { type: "remove-flower", slot: 3 }, NOW + 45000).state;
  assert.equal(n.collection?.daisy?.quantity, 1);
  assert.deepEqual(n.decorations, s.decorations);
  assert.deepEqual(n.placements, s.placements);
  assert.ok(validateGarden(n));
});
test("new learning receipts boost current plants once, enforce daily and per-plant caps, and grant attainable special milestones", () => {
  let n = planted();
  const reward = {
    id: "course:lesson:one",
    source: "exercise" as const,
    coins: 10,
  };
  n = grantReward(n, reward, NOW + 1000);
  assert.equal(n.plots[0].plant?.learningBonusMs, 5000);
  assert.equal(grantReward(n, reward, NOW + 1000), n);
  for (let i = 2; i <= 12; i++)
    n = grantReward(n, { ...reward, id: `course:lesson:${i}` }, NOW + 1000);
  assert.equal(n.learningGarden?.dailyBoosts, 6);
  assert.equal(n.plots[0].plant?.learningBonusMs, 30000);
  assert.equal(n.seeds.starlily, 1);
  assert.equal(n.seeds.forgetmenot, 1);
  assert.ok(n.unlockedFlowers.includes("starlily"));
  assert.ok(validateGarden(n));
  n = applyCommand(n, { type: "water", plotId: 0 }, NOW + 1000).state;
  assert.ok(
    validateGarden(applyCommand(n, { type: "reconcile" }, NOW + 2000).state),
  );
  const next = grantReward(
    n,
    { ...reward, id: "course:lesson:tomorrow" },
    NOW + 86400000,
  );
  assert.equal(next.learningGarden?.dailyBoosts, 1);
  assert.equal(next.plots[0].plant?.learningBonusMs, 30000);
  const fresh = applyCommand(
    next,
    { type: "plant", plotId: 1, species: "daisy" },
    NOW + 86400000,
  ).state;
  assert.equal(fresh.plots[1].plant?.learningBonusMs, undefined);
});
test("gift and non-learning receipts do not accelerate growth or fabricate milestones", () => {
  const s = planted(),
    n = grantReward(
      s,
      { id: "gift:daily:2026-10-27", source: "gift", coins: 10 },
      NOW + 1000,
    );
  assert.deepEqual(n.plots, s.plots);
  assert.equal(n.learningGarden, undefined);
  assert.equal(s.collection, undefined);
});
test("daily gift selects each reward band, saves in existing inventory, and refresh cannot reroll", () => {
  assert.equal(
    GIFT_POOL.reduce((sum, p) => sum + p.weight, 0),
    100,
  );
  for (const [random, kind] of [
    [0, "coins"],
    [0.35, "xp"],
    [0.5, "daisy"],
    [0.75, "lavender"],
    [0.85, "lantern"],
    [0.93, "moon"],
    [0.99, "starlily"],
  ] as const) {
    const s = createStarter(NOW),
      result = claimGift(s, NOW, random);
    assert.ok(result.claim);
    assert.equal(result.claim.rewardId, kind);
    assert.ok(validateGarden(result.state));
    assert.equal(result.state.dailyGifts?.length, 1);
    assert.equal(result.state.appliedRewards.at(-1), "gift:daily:2026-10-27");
    const repeat = claimGift(
      JSON.parse(JSON.stringify(result.state)),
      NOW + 1000,
      0.99,
    );
    assert.equal(repeat.duplicate, true);
    assert.deepEqual(repeat.claim, result.claim);
    assert.equal(repeat.state.coins, result.state.coins);
  }
});
test("Istanbul midnight resets exactly once; clock rollback cannot claim an older day", () => {
  const midnight = Date.parse("2026-10-28T00:00:00+03:00");
  assert.equal(gardenDay(midnight - 1), "2026-10-27");
  assert.equal(nextGardenDay(midnight - 1), midnight);
  const first = claimGift(createStarter(NOW), midnight - 1, 0).state;
  assert.equal(giftStatus(first, midnight - 1).available, false);
  assert.equal(giftStatus(first, midnight).available, true);
  const second = claimGift(first, midnight, 0).state;
  assert.equal(second.dailyGifts?.length, 2);
  assert.ok(claimGift(second, NOW - 86400000, 0).error);
  assert.equal(claimGift(second, midnight + 1, 0.9).duplicate, true);
});
test("seventh non-consecutive gift guarantees an obtainable rare seed, owned decor becomes coins", () => {
  let s = createStarter(NOW);
  for (let i = 0; i < 7; i++) {
    const result = claimGift(s, NOW + i * 2 * 86400000, 0);
    s = result.state;
    if (i === 6) {
      assert.equal(result.claim?.rare, true);
      assert.equal(result.claim?.seed, "starlily");
      assert.equal(s.seeds.starlily, 1);
    }
  }
  assert.ok(validateGarden(s));
  const owned = grantReward(createStarter(NOW), {
    id: "existing-lantern",
    source: "exercise",
    decorations: ["lantern"],
  });
  const gift = claimGift(owned, NOW, 0.85);
  assert.equal(gift.claim?.rewardId, "owned-decoration-coins");
  assert.equal(gift.state.coins, 40);
  assert.equal(
    gift.state.decorations.filter((id) => id === "lantern").length,
    1,
  );
});
test("corrupt gift, collection, learning or flower-display records are rejected without resetting valid legacy data", () => {
  const s = claimGift(createStarter(NOW), NOW, 0.35).state;
  assert.ok(validGiftClaims(s.dailyGifts, NOW));
  assert.equal(
    validateGarden({ ...s, dailyGifts: [...s.dailyGifts!, ...s.dailyGifts!] }),
    false,
  );
  assert.equal(
    validateGarden({ ...s, dailyGifts: [{ ...s.dailyGifts![0], xp: 999 }] }),
    false,
  );
  assert.equal(
    validateGarden({
      ...s,
      flowerPlacements: ["daisy", null, null, null, null, null],
    }),
    false,
  );
  assert.equal(
    validateGarden({
      ...s,
      collection: {
        daisy: { quantity: -1, firstHarvestedAt: NOW, lastHarvestedAt: NOW },
      },
    }),
    false,
  );
  const d = memory(),
    legacy = JSON.parse(JSON.stringify(createStarter(NOW)));
  delete legacy.seeds.starlily;
  delete legacy.seeds.forgetmenot;
  d.setItem(GARDEN_KEY, JSON.stringify(legacy));
  const restored = createLocalGardenStorage(() => d).load(NOW);
  assert.equal(restored.mode, "local");
  assert.equal(restored.state.coins, 30);
  assert.equal(restored.state.collection, undefined);
  assert.equal(restored.state.seeds.starlily, 0);
});
test("gift XP reuses existing XP schema; wrong amount is rejected", () => {
  const s = initialExercises();
  s.xp["gift:daily:2026-10-27"] = 10;
  assert.ok(validXp(s));
  s.xp["gift:daily:2026-10-27"] = 100;
  assert.equal(validXp(s), false);
});
test("gift, harvest and collection survive reload together with shop receipts and pre-existing decorations", () => {
  const s = planted();
  let n = applyCommand(
    s,
    { type: "harvest", plotId: 0, plantKey: plantKey(s.plots[0].plant!, 0) },
    NOW + 45000,
  ).state;
  n = applyCommand(
    n,
    { type: "display-flower", species: "daisy", slot: 0 },
    NOW + 45000,
  ).state;
  n = claimGift(n, NOW + 45000, 0.93).state;
  const d = memory(),
    storage = createLocalGardenStorage(() => d);
  storage.save(n);
  assert.deepEqual(storage.load(NOW + 86400000).state, n);
});

test("shared locks prevent parallel gifts/harvest duplicates and gift XP retries recover after a partial delivery", async () => {
  const d = memory(),
    started = Date.now() - 60000;
  const initial = applyCommand(
    createStarter(started),
    { type: "plant", plotId: 0, species: "daisy" },
    started,
  ).state;
  createLocalGardenStorage(() => d).save(
    applyCommand(initial, { type: "reconcile" }, Date.now()).state,
  );
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window"),
    oldNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator"),
    oldCrypto = Object.getOwnPropertyDescriptor(globalThis, "crypto");
  const queues = new Map<string, Promise<unknown>>();
  let failAll = false,
    failGarden = false;
  Object.defineProperty(globalThis, "window", {
    value: {
      localStorage: {
        getItem: d.getItem,
        setItem: (key: string, value: string) => {
          if (failAll || (failGarden && key === GARDEN_KEY))
            throw Error("quota");
          d.setItem(key, value);
        },
      },
    },
    configurable: true,
  });
  Object.defineProperty(globalThis, "navigator", {
    value: {
      locks: {
        request: (key: string, run: () => unknown) => {
          const next = (queues.get(key) ?? Promise.resolve()).then(run);
          queues.set(
            key,
            next.catch(() => undefined),
          );
          return next;
        },
      },
    },
    configurable: true,
  });
  Object.defineProperty(globalThis, "crypto", {
    value: {
      getRandomValues: (values: Uint32Array) => {
        values.fill(Math.floor(0.35 * 4294967296));
        return values;
      },
    },
    configurable: true,
  });
  try {
    const { claimDailyGift, gardenAction } = await import("../garden/store.ts");
    const { flushDailyGiftXp } = await import("./store.ts");
    failAll = true;
    assert.equal((await claimDailyGift()).ok, false);
    assert.equal(
      createLocalGardenStorage(() => d).load(Date.now()).state.dailyGifts,
      undefined,
    );
    failAll = false;
    const claims = await Promise.all([claimDailyGift(), claimDailyGift()]);
    assert.ok(claims.every((c) => c.ok));
    let saved = createLocalGardenStorage(() => d).load(Date.now()).state;
    assert.equal(saved.dailyGifts?.length, 1);
    assert.equal(saved.dailyGifts?.[0].xp, 10);
    assert.equal(saved.dailyGifts?.[0].xpDelivered, false);
    failGarden = true;
    await flushDailyGiftXp();
    saved = createLocalGardenStorage(() => d).load(Date.now()).state;
    assert.equal(saved.dailyGifts?.[0].xpDelivered, false);
    const xpRaw = d.getItem("deutsch-garden:exercises:v1")!;
    assert.equal(
      Object.values(JSON.parse(xpRaw).xp).reduce(
        (sum: number, v) => sum + Number(v),
        0,
      ),
      10,
    );
    failGarden = false;
    await flushDailyGiftXp();
    saved = createLocalGardenStorage(() => d).load(Date.now()).state;
    assert.equal(saved.dailyGifts?.[0].xpDelivered, true);
    assert.equal(
      Object.values(
        JSON.parse(d.getItem("deutsch-garden:exercises:v1")!).xp,
      ).reduce((sum: number, v) => sum + Number(v), 0),
      10,
    );
    const key = plantKey(saved.plots[0].plant!, 0);
    failGarden = true;
    assert.equal(
      await gardenAction({ type: "harvest", plotId: 0, plantKey: key }),
      false,
    );
    assert.ok(
      createLocalGardenStorage(() => d).load(Date.now()).state.plots[0].plant,
    );
    failGarden = false;
    const harvests = await Promise.all([
      gardenAction({ type: "harvest", plotId: 0, plantKey: key }),
      gardenAction({ type: "harvest", plotId: 0, plantKey: key }),
    ]);
    assert.equal(harvests.filter(Boolean).length, 1);
    saved = createLocalGardenStorage(() => d).load(Date.now()).state;
    assert.equal(saved.collection?.daisy?.quantity, 1);
    assert.equal(saved.plots[0].plant, null);
    assert.equal(saved.dailyGifts?.length, 1);
    assert.equal(saved.coins, initial.coins);
  } finally {
    for (const [key, descriptor] of [
      ["window", oldWindow],
      ["navigator", oldNavigator],
      ["crypto", oldCrypto],
    ] as const) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
