import test from "node:test";
import assert from "node:assert/strict";
import {
  createStarter,
  applyCommand,
  grantReward,
  growth,
} from "../garden/model.ts";
import {
  createLocalGardenStorage,
  GARDEN_KEY,
  validateGarden,
} from "../garden/storage.ts";
import { SHOP_PRODUCTS, SHOP_CATEGORIES } from "./catalog.ts";
import { purchaseItem, validPurchases } from "./model.ts";
const NOW = 1000000;
function disk() {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  };
}
const funded = () =>
  grantReward(createStarter(NOW), {
    id: "test-legitimate-study-reward",
    source: "exercise",
    coins: 200,
  });
test("catalog has stable unique products covering all seven categories and original inventory targets", () => {
  assert.equal(
    new Set(SHOP_PRODUCTS.map((p) => p.id)).size,
    SHOP_PRODUCTS.length,
  );
  assert.equal(Object.keys(SHOP_CATEGORIES).length, 7);
  for (const category of Object.keys(SHOP_CATEGORIES))
    assert.ok(SHOP_PRODUCTS.some((p) => p.category === category));
  for (const p of SHOP_PRODUCTS) {
    assert.ok(p.price > 0 && Number.isSafeInteger(p.price));
    const result = purchaseItem(
      funded(),
      p.id,
      `transaction-${p.id}`,
      "C2",
      NOW + 1,
    );
    if (p.available) {
      assert.ok(!result.error);
      assert.ok(validateGarden(result.state));
    } else assert.ok(result.error);
  }
});
test("purchase deducts exact existing coins, adds inventory and receipt in one immutable state", () => {
  const s = createStarter(NOW),
    r = purchaseItem(s, "seeds-daisy-v1", "transaction-daisy-1", "A1", NOW + 1);
  assert.equal(r.state.coins, 22);
  assert.equal(r.state.seeds.daisy, 6);
  assert.equal(r.state.purchases?.length, 1);
  assert.equal(s.coins, 30);
  assert.equal(s.seeds.daisy, 3);
  assert.deepEqual(r.state.plots, s.plots);
  assert.deepEqual(r.state.appliedRewards, s.appliedRewards);
  assert.ok(validPurchases(r.state.purchases, NOW));
});
test("insufficient funds, unavailable/unknown products, locks and invalid IDs never spend coins", () => {
  const s = createStarter(NOW);
  s.coins = 0;
  for (const [id, level] of [
    ["seeds-daisy-v1", "A1"],
    ["snowglobe-v1", "C2"],
    ["missing", "C2"],
    ["tree-magic-v1", "A1"],
  ] as const) {
    const r = purchaseItem(s, id, "transaction-invalid", level, NOW);
    assert.ok(r.error);
    assert.equal(r.state, s);
  }
  assert.ok(purchaseItem(funded(), "seeds-daisy-v1", "bad", "A1", NOW).error);
  assert.ok(
    purchaseItem(funded(), "seeds-daisy-v1", "transaction-valid", "A1", NOW - 1)
      .error,
  );
});
test("duplicate IDs and single ownership prevent repeat charges, repeat seed packs use new transactions", () => {
  const a = purchaseItem(
    funded(),
    "mint-pot-v1",
    "transaction-pot-1",
    "A1",
    NOW,
  ).state;
  assert.equal(
    purchaseItem(a, "mint-pot-v1", "transaction-pot-1", "A1", NOW).state,
    a,
  );
  assert.ok(
    purchaseItem(a, "lantern-v1", "transaction-pot-1", "A1", NOW).error,
  );
  assert.ok(
    purchaseItem(a, "mint-pot-v1", "transaction-pot-2", "A1", NOW).error,
  );
  const b = purchaseItem(
    a,
    "seeds-daisy-v1",
    "transaction-pack-1",
    "A1",
    NOW,
  ).state;
  assert.equal(
    purchaseItem(b, "seeds-daisy-v1", "transaction-pack-1", "A1", NOW).state,
    b,
  );
  assert.equal(
    purchaseItem(b, "seeds-daisy-v1", "transaction-pack-2", "A1", NOW).state
      .seeds.daisy,
    b.seeds.daisy + 3,
  );
});
test("level gates cover A1 through C2 without removing any previously owned items", () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
  for (const p of SHOP_PRODUCTS.filter((p) => p.available)) {
    const required = levels.indexOf(p.level);
    if (required > 0)
      assert.ok(
        purchaseItem(
          funded(),
          p.id,
          "transaction-low-level",
          levels[required - 1],
          NOW,
        ).error,
      );
    assert.ok(
      !purchaseItem(funded(), p.id, "transaction-level-ok", p.level, NOW).error,
    );
  }
  const s = funded();
  assert.equal(s.decorations.length, 5);
  assert.equal(s.unlockedFlowers.length, 6);
  assert.equal(s.seeds.moonflower, 0);
  assert.equal(s.seeds.royal, 0);
});
test("purchased special seeds really plant, water and mature; decorations move/remove without losing ownership", () => {
  let s = purchaseItem(
    funded(),
    "seeds-moon-v1",
    "transaction-moon-1",
    "B2",
    NOW,
  ).state;
  s = applyCommand(
    s,
    { type: "plant", plotId: 0, species: "moonflower" },
    NOW,
  ).state;
  assert.equal(s.seeds.moonflower, 1);
  assert.equal(growth(s.plots[0].plant!, NOW + 135000).stage, "bloom");
  s = applyCommand(s, { type: "water", plotId: 0 }, NOW + 1).state;
  assert.equal(s.plots[0].plant?.waterCount, 1);
  s = purchaseItem(
    s,
    "tree-magic-v1",
    "transaction-tree-1",
    "B1",
    NOW + 2,
  ).state;
  s = applyCommand(
    s,
    { type: "place", decoration: "magic-tree", slot: 0 },
    NOW + 3,
  ).state;
  s = applyCommand(
    s,
    { type: "place", decoration: "magic-tree", slot: 4 },
    NOW + 4,
  ).state;
  assert.equal(s.placements[0], null);
  assert.equal(s.placements[4], "magic-tree");
  s = applyCommand(s, { type: "remove", slot: 4 }, NOW + 5).state;
  assert.ok(s.decorations.includes("magic-tree"));
  assert.equal(s.placements[4], null);
  assert.ok(validateGarden(s));
});
test("legacy garden migration preserves coins, plots, rewards, old seeds and every owned decoration", () => {
  const d = disk();
  let s = funded();
  s = applyCommand(s, { type: "plant", plotId: 2, species: "rose" }, NOW).state;
  s = applyCommand(
    s,
    { type: "place", decoration: "butterfly", slot: 1 },
    NOW,
  ).state;
  const legacy = JSON.parse(JSON.stringify(s));
  delete legacy.seeds.moonflower;
  delete legacy.seeds.royal;
  d.setItem(GARDEN_KEY, JSON.stringify(legacy));
  const storage = createLocalGardenStorage(() => d),
    r = storage.load(NOW + 1);
  assert.equal(r.mode, "local");
  assert.deepEqual(r.state, s);
  assert.equal(r.state.seeds.moonflower, 0);
  storage.save(r.state);
  assert.ok(validateGarden(storage.load(NOW + 2).state));
});
test("purchases survive refresh alongside inventory, and receipt corruption is rejected", () => {
  const d = disk(),
    storage = createLocalGardenStorage(() => d),
    s = purchaseItem(
      funded(),
      "mint-pot-v1",
      "transaction-refresh",
      "A1",
      NOW,
    ).state;
  storage.save(s);
  assert.deepEqual(storage.load(NOW + 1).state, s);
  assert.equal(validPurchases([{ ...s.purchases![0], after: -1 }], NOW), false);
  assert.equal(validPurchases([s.purchases![0], s.purchases![0]], NOW), false);
  assert.equal(
    validateGarden({ ...s, purchases: [{ ...s.purchases![0], quantity: 99 }] }),
    false,
  );
});
test("seed capacity refuses overflow without corrupting existing inventory", () => {
  const s = funded();
  s.seeds.daisy = 9999;
  assert.equal(
    purchaseItem(s, "seeds-daisy-v1", "transaction-capacity", "A1", NOW).state,
    s,
  );
});
test("shared browser lock serializes double-click purchases, rewards and planting; write failure spends nothing", async () => {
  const d = disk();
  createLocalGardenStorage(() => d).save(createStarter(Date.now()));
  const prevWindow = Object.getOwnPropertyDescriptor(globalThis, "window"),
    prevNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  let chain: Promise<unknown> = Promise.resolve();
  let fail = false;
  const memory = {
    getItem: d.getItem,
    setItem: (k: string, v: string) => {
      if (fail) throw Error("quota");
      d.setItem(k, v);
    },
  };
  Object.defineProperty(globalThis, "window", {
    value: { localStorage: memory },
    configurable: true,
  });
  Object.defineProperty(globalThis, "navigator", {
    value: {
      locks: {
        request: (_key: string, run: () => unknown) => {
          const next = chain.then(run);
          chain = next.catch(() => undefined);
          return next;
        },
      },
    },
    configurable: true,
  });
  try {
    const { purchaseGardenItem, deliverGardenReward, gardenAction } =
      await import("../garden/store.ts");
    const results = await Promise.all([
      purchaseGardenItem("seeds-daisy-v1", "transaction-double", "A1"),
      purchaseGardenItem("seeds-daisy-v1", "transaction-double", "A1"),
      deliverGardenReward({
        id: "test-parallel-learning",
        source: "exercise",
        coins: 10,
      }),
    ]);
    assert.ok(results.every(Boolean));
    let saved = createLocalGardenStorage(() => d).load(Date.now()).state;
    assert.equal(saved.coins, 32);
    assert.equal(saved.seeds.daisy, 6);
    assert.equal(saved.purchases?.length, 1);
    await gardenAction({ type: "plant", plotId: 0, species: "daisy" });
    saved = createLocalGardenStorage(() => d).load(Date.now()).state;
    assert.equal(saved.seeds.daisy, 5);
    fail = true;
    const failed = await purchaseGardenItem(
      "mint-pot-v1",
      "transaction-failure",
      "A1",
    );
    assert.equal(failed.ok, false);
    assert.deepEqual(
      createLocalGardenStorage(() => d).load(Date.now()).state,
      saved,
    );
    fail = false;
    assert.equal(
      (await purchaseGardenItem("mint-pot-v1", "transaction-failure", "A1")).ok,
      true,
    );
    saved = createLocalGardenStorage(() => d).load(Date.now()).state;
    assert.equal(saved.coins, 14);
    assert.ok(saved.decorations.includes("mint-pot"));
    assert.equal(saved.purchases?.length, 2);
  } finally {
    if (prevWindow) Object.defineProperty(globalThis, "window", prevWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (prevNavigator)
      Object.defineProperty(globalThis, "navigator", prevNavigator);
    else Reflect.deleteProperty(globalThis, "navigator");
  }
});
