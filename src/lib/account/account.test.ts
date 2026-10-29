import { test } from "node:test";
import assert from "node:assert/strict";
import { createStarter } from "../garden/model.ts";
import { initialLearning } from "../learning/engine.ts";
import {
  capture,
  restore,
  recoverRestore,
  canonical,
  fingerprint,
  validSnapshot,
} from "./snapshot.ts";
import {
  keyFor,
  physicalKey,
  setStorageOwner,
  progressStorage,
  freezeProgress,
} from "./storage.ts";
import { accountConfig } from "./config.ts";
import { accountError } from "./errors.ts";
class Disk implements Storage {
  data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  key(i: number) {
    return [...this.data.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.data.set(k, v);
  }
  removeItem(k: string) {
    this.data.delete(k);
  }
  clear() {
    this.data.clear();
  }
}
test("Guest and two account caches are isolated; switching freezes pending old writers", () => {
  const disk = new Disk();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: disk },
  });
  const key = keyFor("garden");
  setStorageOwner(null);
  progressStorage().setItem(key, "guest");
  setStorageOwner("user-a");
  assert.equal(progressStorage().getItem(key), null);
  progressStorage().setItem(key, "a");
  setStorageOwner("user-b");
  assert.equal(progressStorage().getItem(key), null);
  progressStorage().setItem(key, "b");
  freezeProgress();
  assert.throws(() => progressStorage().setItem(key, "old-writer"));
  setStorageOwner("user-a");
  assert.equal(progressStorage().getItem(key), "a");
  setStorageOwner(null);
  assert.equal(progressStorage().getItem(key), "guest");
});
test("Snapshot transfer preserves all garden resources/receipts, without merging or deleting guest", async () => {
  const disk = new Disk(),
    garden = createStarter(10);
  garden.coins = 78;
  garden.seeds.daisy = 7;
  garden.appliedRewards.push("learning:once");
  disk.setItem(keyFor("garden"), JSON.stringify(garden));
  disk.setItem(keyFor("learning"), JSON.stringify(initialLearning()));
  const guest = capture(disk, null),
    hash = await fingerprint(guest);
  restore(disk, "a", guest);
  assert.deepEqual(capture(disk, "a"), guest);
  assert.equal(await fingerprint(capture(disk, null)), hash);
  restore(disk, "a", guest);
  assert.deepEqual(capture(disk, "a"), guest);
  assert.equal(capture(disk, "b").modules.garden, undefined);
});
test("Future/invalid data is blocked without modification; canonical hashes ignore key ordering", async () => {
  const disk = new Disk();
  disk.setItem(keyFor("garden"), '{"version":99}');
  assert.throws(() => capture(disk, null));
  assert.equal(disk.getItem(keyFor("garden")), '{"version":99}');
  assert.equal(validSnapshot({ version: 1, modules: { unknown: {} } }), false);
  assert.equal(
    validSnapshot({
      version: 1,
      modules: { garden: { ...createStarter(1), coins: -1 } },
    }),
    false,
  );
  assert.equal(
    await fingerprint({ a: 1, b: 2 }),
    await fingerprint({ b: 2, a: 1 }),
  );
  assert.equal(canonical([1, 2]), "[1,2]");
});
test("Snapshot reader reuses zero-only legacy garden migration without refilling or rewriting it", () => {
  const disk = new Disk(),
    old = createStarter(10);
  const seeds = old.seeds as Record<string, number>;
  for (const id of [
    "moonflower",
    "royal",
    "starlily",
    "forgetmenot",
    "birthday-star",
  ])
    delete seeds[id];
  seeds.daisy = 1;
  const raw = JSON.stringify(old);
  disk.setItem(keyFor("garden"), raw);
  const migrated = capture(disk, null).modules.garden as typeof old;
  assert.equal(migrated.seeds.daisy, 1);
  assert.equal(migrated.seeds["birthday-star"], 0);
  assert.equal(disk.getItem(keyFor("garden")), raw);
});
test("An interrupted multi-key restore is rolled back before loading account stores", () => {
  const disk = new Disk(),
    key = physicalKey(keyFor("garden"), "a"),
    old = JSON.stringify(createStarter(7));
  disk.setItem(`deutsch-garden:restore:a`, JSON.stringify([[key, old]]));
  disk.setItem(key, "interrupted");
  recoverRestore(disk, "a");
  assert.equal(disk.getItem(key), old);
  assert.equal(disk.getItem("deutsch-garden:restore:a"), null);
  disk.setItem(
    "deutsch-garden:restore:a",
    JSON.stringify([[keyFor("garden"), "tamper"]]),
  );
  assert.throws(() => recoverRestore(disk, "a"));
  assert.equal(disk.getItem(key), old);
});
test("Failed writes roll back a transfer and preserve its original garden", () => {
  const disk = new Disk(),
    key = physicalKey(keyFor("garden"), "a"),
    old = createStarter(7);
  disk.setItem(key, JSON.stringify(old));
  let fail = true;
  const set = disk.setItem.bind(disk);
  disk.setItem = (k, v) => {
    if (k === physicalKey(keyFor("learning"), "a") && fail) {
      fail = false;
      throw new Error("quota");
    }
    set(k, v);
  };
  assert.throws(() =>
    restore(disk, "a", {
      version: 1,
      modules: { garden: createStarter(8), learning: initialLearning() },
    }),
  );
  assert.deepEqual(capture(disk, "a").modules.garden, old);
});
test("Public configuration never returns secret/service credentials", () => {
  const base = {
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "SERVER-ONLY",
  };
  for (const key of [
    "sb_secret_BAD",
    "invalid",
    "a." + Buffer.from('{"role":"service_role"}').toString("base64url") + ".c",
  ])
    assert.deepEqual(
      accountConfig({ ...base, SUPABASE_PUBLISHABLE_KEY: key }),
      { configured: false },
    );
  const c = accountConfig({
    ...base,
    SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
  });
  assert.equal(c.configured, true);
  for (const path of [
    "/rest/v1",
    "/rest/v1/",
    "/auth/v1",
    "/dashboard",
    "/anything",
  ]) {
    assert.deepEqual(
      accountConfig({
        ...base,
        SUPABASE_URL: base.SUPABASE_URL + path,
        SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      }),
      { configured: false },
    );
  }
  assert.equal(
    accountConfig({
      ...base,
      SUPABASE_URL: base.SUPABASE_URL + "/",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
    }).url,
    base.SUPABASE_URL,
  );
  assert.equal(JSON.stringify(c).includes("SERVER-ONLY"), false);
  assert.equal(
    accountConfig({
      ...base,
      SUPABASE_URL: "http://bad.example",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_x",
      NODE_ENV: "production",
    }).configured,
    false,
  );
  assert.match(accountError(new Error("SYNC_CONFLICT")), /cihaz/);
  assert.match(accountError(new Error("Invalid login credentials")), /hatalı/);
});
