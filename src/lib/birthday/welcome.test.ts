import { test } from "node:test";
import assert from "node:assert/strict";
import { birthdayWelcome } from "../../config/birthday-welcome.ts";
import { BirthdayServer } from "./server.ts";
import { welcomeResponse } from "./welcome-server.ts";
import {
  enterBirthdayGarden,
  validWelcomeContent,
  validWelcomeConfiguration,
  validWelcomeRecord,
  validWelcomeStatus,
  shouldShowWelcome,
  WELCOME_RECEIPT,
  WELCOME_DECORATION,
} from "./welcome-model.ts";
import { createStarter, applyCommand, grantReward } from "../garden/model.ts";
import {
  validateGarden,
  createLocalGardenStorage,
  GARDEN_KEY,
} from "../garden/storage.ts";
import { capture, restore } from "../account/snapshot.ts";
import { SHOP_PRODUCTS } from "../shop/catalog.ts";
const content = {
  recipientName: "",
  senderSignature: "",
  message: birthdayWelcome.message,
};
const now = Date.now(),
  origin = "http://127.0.0.1:3000";
const server = (extra = {}) =>
  new BirthdayServer(
    {
      dir: "unused-welcome-test",
      creatorPassword: "test-creator-password",
      recipientPassword: "",
      secret: "test-welcome-session-secret-more-than-32-characters",
      origin,
      production: false,
      ...extra,
    },
    () => now,
  );
const request = (method = "GET", query = "", cookie = "") =>
  new Request(origin + "/api/birthday/welcome" + query, {
    method,
    headers: { host: "127.0.0.1:3000", origin, cookie },
  });
test("Configuration is opt-in, name-free and uses the requested warm default verbatim", () => {
  assert.equal(birthdayWelcome.enabled, false);
  assert.equal(birthdayWelcome.recipientName, "");
  assert.equal(birthdayWelcome.senderSignature, "");
  assert.equal(
    birthdayWelcome.message,
    "İyi ki doğdun! 🌷\n\nSenin için küçük ama rengârenk bir dünya hazırladım.\n\nBurada öğrendiğin her yeni Almanca kelime, bahçende açan yeni bir çiçek olsun.\n\nUmarım bu bahçe sana öğrenmenin ne kadar güzel olabileceğini hatırlatır.\n\nAlles Gute zum Geburtstag! 💜",
  );
  assert.equal(validWelcomeConfiguration(birthdayWelcome), true);
  assert.equal(validWelcomeContent({ ...content, message: " " }), false);
  assert.equal(
    validWelcomeContent({ ...content, recipientName: "x".repeat(81) }),
    false,
  );
  assert.equal(validWelcomeContent({ ...content, message: "x\u0000y" }), false);
});
test("First-visit rules respect enabled, viewed, authentication pages, creator and preview routes", () => {
  const status = { enabled: true, previewAvailable: true, content };
  const record = enterBirthdayGarden(createStarter(now), content, now).state
    .birthdayWelcome!;
  assert.equal(shouldShowWelcome(status, undefined, "/", true), true);
  assert.equal(shouldShowWelcome(status, record, "/", true), false);
  assert.equal(
    shouldShowWelcome({ ...status, enabled: false }, undefined, "/", true),
    false,
  );
  assert.equal(shouldShowWelcome(status, undefined, "/", false), false);
  assert.equal(shouldShowWelcome(status, undefined, "/", true, true), false);
  for (const path of [
    "/giris",
    "/kayit",
    "/hesap/dogrula",
    "/hesap/sifre-guncelle",
    "/hediye-atolyesi",
    "/dogum-gunu",
  ])
    assert.equal(shouldShowWelcome(status, undefined, path, true), false, path);
  assert.equal(
    shouldShowWelcome(
      { ...status, accessRequired: true },
      undefined,
      "/",
      true,
    ),
    false,
  );
});
test("One atomic state preserves progress and grants a single permanent non-purchasable decoration", () => {
  let initial = createStarter(now - 1000);
  initial.coins = 87;
  initial.seeds.daisy = 1;
  initial.appliedRewards.push("learning:preserved");
  initial = applyCommand(
    initial,
    { type: "plant", plotId: 0, species: "rose" },
    now - 500,
  ).state;
  const result = enterBirthdayGarden(initial, content, now);
  assert.equal(result.error, undefined);
  assert.equal(
    SHOP_PRODUCTS.some(
      (p) =>
        p.inventory.kind === "decoration" &&
        p.inventory.decoration === WELCOME_DECORATION,
    ),
    false,
  );
  assert.equal(validateGarden(result.state), true);
  assert.equal(result.state.coins, 87);
  assert.deepEqual(result.state.seeds, initial.seeds);
  assert.deepEqual(result.state.plots, initial.plots);
  assert.ok(result.state.appliedRewards.includes("learning:preserved"));
  assert.equal(
    result.state.decorations.filter((id) => id === WELCOME_DECORATION).length,
    1,
  );
  assert.ok(result.state.appliedRewards.includes(WELCOME_RECEIPT));
  const again = enterBirthdayGarden(
    result.state,
    { ...content, message: "Edited after viewing" },
    now + 1,
  );
  assert.equal(again.duplicate, true);
  assert.equal(again.state, result.state);
  assert.equal(again.state.birthdayWelcome!.content.message, content.message);
  assert.equal(again.state.birthdayWelcome!.viewedAt, now);
  let placed = applyCommand(
    result.state,
    { type: "place", decoration: WELCOME_DECORATION, slot: 0 },
    now,
  ).state;
  placed = applyCommand(
    placed,
    { type: "place", decoration: WELCOME_DECORATION, slot: 1 },
    now,
  ).state;
  assert.equal(placed.placements[0], null);
  placed = applyCommand(placed, { type: "remove", slot: 1 }, now).state;
  assert.ok(placed.decorations.includes(WELCOME_DECORATION));
  assert.equal(validWelcomeRecord(placed.birthdayWelcome), true);
});
test("Previously owned birthday gift and old memories are preserved without an extra coin or seed", () => {
  const old = grantReward(createStarter(now - 10), {
    id: "birthday:old-event",
    source: "birthday",
    coins: 20,
    seeds: { "birthday-star": 1 },
    flowers: ["birthday-star"],
    decorations: [WELCOME_DECORATION],
  });
  const result = enterBirthdayGarden(old, content, now).state;
  assert.equal(result.birthdayWelcome!.giftPreviouslyOwned, true);
  assert.equal(result.coins, old.coins);
  assert.deepEqual(result.seeds, old.seeds);
  assert.equal(
    result.decorations.filter((id) => id === WELCOME_DECORATION).length,
    1,
  );
  assert.ok(result.appliedRewards.includes("birthday:old-event"));
});
test("Local/account persistence retains viewed state, replay letter, inventory and user isolation", () => {
  class Disk implements Storage {
    map = new Map<string, string>();
    get length() {
      return this.map.size;
    }
    key(i: number) {
      return [...this.map.keys()][i] ?? null;
    }
    getItem(k: string) {
      return this.map.get(k) ?? null;
    }
    setItem(k: string, v: string) {
      this.map.set(k, v);
    }
    removeItem(k: string) {
      this.map.delete(k);
    }
    clear() {
      this.map.clear();
    }
  }
  const disk = new Disk(),
    state = enterBirthdayGarden(createStarter(now - 1), content, now).state,
    p = createLocalGardenStorage(() => disk);
  p.save(state);
  assert.deepEqual(p.load(now).state, state);
  const guest = capture(disk, null);
  restore(disk, "account-a", guest);
  assert.deepEqual(capture(disk, "account-a").modules.garden, state);
  assert.equal(capture(disk, "account-b").modules.garden, undefined);
  assert.deepEqual(capture(disk, null), guest);
  const malformed = structuredClone(state);
  malformed.appliedRewards = malformed.appliedRewards.filter(
    (id) => id !== WELCOME_RECEIPT,
  );
  assert.equal(validateGarden(malformed), false);
  assert.equal(
    validWelcomeRecord({ ...state.birthdayWelcome, viewedAt: -1 }),
    false,
  );
});
test("Disabled content stays private; enabled status and entitlement use the current file configuration", async () => {
  const s = server(),
    config = {
      ...birthdayWelcome,
      recipientName: "Deneme Alıcısı",
      senderSignature: "Deneme Göndereni",
    };
  const hidden = await welcomeResponse(request(), config, s, "GET");
  const h = await hidden.json();
  assert.deepEqual(h, { enabled: false, previewAvailable: true });
  assert.equal(JSON.stringify(h).includes("Deneme"), false);
  assert.equal(
    (await welcomeResponse(request("POST"), config, s, "POST")).status,
    409,
  );
  const enabled = { ...config, enabled: true };
  const active = await (
    await welcomeResponse(request(), enabled, s, "GET")
  ).json();
  assert.equal(validWelcomeStatus(active), true);
  assert.equal(active.content.recipientName, config.recipientName);
  const entered = await (
    await welcomeResponse(request("POST"), enabled, s, "POST")
  ).json();
  assert.equal(entered.viewedAt, now);
  assert.equal(entered.content.message, config.message);
  assert.equal(
    (await welcomeResponse(request(), { ...config, message: "" }, s, "GET"))
      .status,
    503,
  );
});
test("Preview never returns a grant; production preview and existing recipient password stay protected", async () => {
  const config = {
    ...birthdayWelcome,
    enabled: true,
    recipientName: "Private preview",
  };
  const s = server({ recipientPassword: "test-recipient-password" });
  const locked = await (
    await welcomeResponse(request(), config, s, "GET")
  ).json();
  assert.equal(locked.accessRequired, true);
  assert.equal(locked.content, undefined);
  assert.equal(
    (await welcomeResponse(request("POST"), config, s, "POST")).status,
    401,
  );
  const preview = await (
    await welcomeResponse(request("GET", "?onizleme=1"), config, s, "GET")
  ).json();
  assert.equal(preview.preview, true);
  assert.equal(preview.content.recipientName, config.recipientName);
  assert.equal(preview.viewedAt, undefined);
  assert.equal(
    (await welcomeResponse(request("POST", "?onizleme=1"), config, s, "POST"))
      .status,
    400,
  );
  const production = server({
    production: true,
    recipientPassword: "test-recipient-password",
  });
  assert.equal(
    (
      await welcomeResponse(
        request("GET", "?onizleme=1"),
        config,
        production,
        "GET",
      )
    ).status,
    403,
  );
  const creatorCookie = production.cookie(request(), "creator").split(";")[0];
  assert.equal(
    (
      await welcomeResponse(
        request("GET", "?onizleme=1", creatorCookie),
        config,
        production,
        "GET",
      )
    ).status,
    200,
  );
  const recipientCookie = production
    .cookie(request(), "recipient")
    .split(";")[0];
  assert.equal(
    (
      await welcomeResponse(
        request("POST", "", recipientCookie),
        config,
        production,
        "POST",
      )
    ).status,
    200,
  );
  const wrongOrigin = new Request(origin + "/api/birthday/welcome", {
    method: "POST",
    headers: { host: "127.0.0.1:3000", origin: "https://wrong.example" },
  });
  assert.equal(
    (await welcomeResponse(wrongOrigin, config, s, "POST")).status,
    403,
  );
});
test("Real garden writer prevents concurrent/duplicate claims and does not mark viewed on failed writes", async () => {
  const { setStorageOwner } = await import("../account/storage.ts");
  setStorageOwner(null);
  const data = new Map<string, string>();
  let fail = false;
  const disk = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (fail && k === GARDEN_KEY) throw new Error("quota");
      data.set(k, v);
    },
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: disk },
  });
  const tails = new Map<string, Promise<void>>();
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      locks: {
        request: async <T>(name: string, run: () => T) => {
          const before = tails.get(name) ?? Promise.resolve();
          let release!: () => void;
          tails.set(
            name,
            new Promise<void>((r) => {
              release = r;
            }),
          );
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
  const initial = createStarter(now - 10);
  disk.setItem(GARDEN_KEY, JSON.stringify(initial));
  const { completeBirthdayWelcome } = await import("../garden/store.ts");
  fail = true;
  assert.equal((await completeBirthdayWelcome(content, now)).ok, false);
  assert.deepEqual(JSON.parse(disk.getItem(GARDEN_KEY)!), initial);
  fail = false;
  const results = await Promise.all(
    Array.from({ length: 5 }, () => completeBirthdayWelcome(content, now)),
  );
  assert.ok(results.every((r) => r.ok));
  const saved = JSON.parse(disk.getItem(GARDEN_KEY)!);
  assert.equal(
    saved.decorations.filter((id: string) => id === WELCOME_DECORATION).length,
    1,
  );
  assert.equal(
    saved.appliedRewards.filter((id: string) => id === WELCOME_RECEIPT).length,
    1,
  );
  assert.equal(saved.birthdayWelcome.viewedAt, now);
});
