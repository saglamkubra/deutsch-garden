import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  BirthdayServer,
  BirthdayRepository,
  type BirthdayServerConfig,
} from "./server.ts";
import {
  DEFAULT_LETTER,
  publicBirthday,
  receiveBirthday,
  validConfig,
  validMemories,
  validBirthdayDate,
  type BirthdayConfig,
} from "./model.ts";
import {
  createStarter,
  applyCommand,
  growth,
  plantKey,
} from "../garden/model.ts";
import {
  createLocalGardenStorage,
  validateGarden,
  GARDEN_KEY,
} from "../garden/storage.ts";
import { visibleGardenFlowers } from "../garden/catalog.ts";
const DATE = "2026-10-28",
  BIRTHDAY = Date.parse(DATE + "T00:00:00+03:00");
const draft = {
  date: DATE,
  recipientName: "Deneme Alıcısı",
  senderName: "Deneme Göndereni",
  greeting: "Sana özel deneme kutlaması.",
  letter: "Birinci deneme paragrafı.\n\nİkinci deneme paragrafı.",
  showCountdown: true,
};
const fixture: BirthdayConfig = {
  ...draft,
  version: 1,
  id: "birthday-test-event",
  revision: 1,
};
async function harness(overrides: Partial<BirthdayServerConfig> = {}) {
  const dir = await mkdtemp(join(tmpdir(), "dg-birthday-test-"));
  let time = BIRTHDAY - 1;
  const config: BirthdayServerConfig = {
    dir,
    creatorPassword: "not-real-creator-test-password",
    recipientPassword: "",
    secret: "not-real-session-secret-for-birthday-tests-32",
    origin: "http://127.0.0.1:3000",
    production: false,
    ...overrides,
  };
  const server = new BirthdayServer(config, () => time);
  const request = (
    path = "/api/birthday",
    method = "GET",
    body?: unknown,
    cookie = "",
    origin = config.origin,
  ) =>
    new Request("http://localhost:3000" + path, {
      method,
      headers: {
        host: "127.0.0.1:3000",
        origin,
        "content-type": "application/json",
        cookie,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  const login = async (role = "creator", password = config.creatorPassword) =>
    server.login(request("/api/birthday/access", "POST", { role, password }));
  return {
    dir,
    server,
    config,
    request,
    login,
    time: (value: number) => {
      time = value;
    },
    cleanup: () => rm(dir, { recursive: true, force: true }),
  };
}
test("birthday date validation rejects impossible dates; Istanbul calendar gates the exact midnight", () => {
  assert.ok(validBirthdayDate(DATE));
  for (const date of [
    "2026-02-30",
    "2026-13-01",
    "28/10/2026",
    "",
    "0000-01-01",
  ])
    assert.equal(validBirthdayDate(date), false);
  assert.equal(publicBirthday(fixture, BIRTHDAY - 1).state, "countdown");
  assert.equal(publicBirthday(fixture, BIRTHDAY).state, "active");
  assert.equal(publicBirthday(fixture, BIRTHDAY + 86400000).state, "past");
  assert.equal(publicBirthday(null, BIRTHDAY).state, "hidden");
});
test("before birthday, neither countdown nor hidden responses disclose private config or full surprise", () => {
  for (const c of [fixture, { ...fixture, showCountdown: false }]) {
    const data = publicBirthday(c, BIRTHDAY - 1),
      raw = JSON.stringify(data);
    for (const privateValue of [
      draft.recipientName,
      draft.senderName,
      draft.letter,
      fixture.id,
      "birthday-star",
    ])
      assert.ok(!raw.includes(privateValue));
    assert.equal(data.event, undefined);
  }
  assert.equal(
    publicBirthday({ ...fixture, showCountdown: false }, BIRTHDAY - 1).date,
    undefined,
  );
});
test("private creator endpoints require signed authorization, exact Origin, and bounded login attempts", async () => {
  const h = await harness();
  try {
    assert.equal(
      (
        await h.server.save(
          h.request("/api/birthday/creator", "POST", {
            draft,
            expectedRevision: 0,
            newEvent: false,
          }),
        )
      ).status,
      401,
    );
    const unauth = await (await h.server.creatorStatus(h.request())).json();
    assert.equal(unauth.authenticated, false);
    assert.equal(unauth.config, undefined);
    assert.equal(
      (
        await h.server.login(
          h.request(
            "/api/birthday/access",
            "POST",
            { role: "creator", password: h.config.creatorPassword },
            "",
            "https://evil.example",
          ),
        )
      ).status,
      403,
    );
    for (let i = 0; i < 8; i++)
      assert.equal(
        (await h.login("creator", "incorrect-test-password")).status,
        401,
      );
    assert.equal((await h.login()).status, 429);
  } finally {
    await h.cleanup();
  }
});
test("creator saves multi-paragraph letter privately; ordinary status and preview query cannot reveal it early", async () => {
  const h = await harness();
  try {
    const login = await h.login();
    assert.equal(login.status, 200);
    const cookie = login.headers.get("set-cookie")!.split(";")[0];
    assert.match(login.headers.get("set-cookie")!, /HttpOnly/);
    assert.match(login.headers.get("set-cookie")!, /SameSite=Strict/);
    const saved = await h.server.save(
      h.request(
        "/api/birthday/creator",
        "POST",
        { draft, expectedRevision: 0, newEvent: false },
        cookie,
      ),
    );
    assert.equal(saved.status, 200);
    const { config } = await saved.json();
    assert.ok(validConfig(config));
    assert.equal(config.letter, draft.letter);
    const privateRead = await (
      await h.server.creatorStatus(
        h.request("/api/birthday/creator", "GET", undefined, cookie),
      )
    ).json();
    assert.deepEqual(privateRead.config, config);
    const publicRead = await (
      await h.server.publicStatus(
        h.request("/api/birthday?preview=1", "GET", undefined, cookie),
      )
    ).json();
    assert.equal(publicRead.event, undefined);
    assert.ok(!JSON.stringify(publicRead).includes(draft.letter));
    assert.equal(
      (await h.server.open(h.request("/api/birthday/open", "POST", {}))).status,
      409,
    );
    h.time(BIRTHDAY);
    const opening = await (
      await h.server.open(h.request("/api/birthday/open", "POST", {}))
    ).json();
    assert.ok(validMemories([opening]));
    assert.equal(opening.event.id, config.id);
    assert.equal(opening.openedAt, BIRTHDAY);
    h.time(BIRTHDAY + 3 * 86400000);
    assert.equal(
      (await h.server.open(h.request("/api/birthday/open", "POST", {}))).status,
      200,
    );
  } finally {
    await h.cleanup();
  }
});
test("editing date, name or letter retains event identity; explicit new event is distinct; stale saves fail", async () => {
  const h = await harness();
  try {
    const r = h.server.repository,
      first = await r.save({ draft, expectedRevision: 0, newEvent: false });
    const changed = await r.save({
      draft: {
        ...draft,
        date: "2026-11-01",
        letter: "Düzenlenmiş deneme mektubu.",
      },
      expectedRevision: first.revision,
      newEvent: false,
    });
    assert.equal(first.id, changed.id);
    assert.equal(changed.revision, 2);
    await assert.rejects(
      r.save({ draft, expectedRevision: 1, newEvent: false }),
      /REVISION_CONFLICT/,
    );
    const next = await r.save({ draft, expectedRevision: 2, newEvent: true });
    assert.notEqual(first.id, next.id);
    assert.deepEqual(await new BirthdayRepository(h.dir).read(), next);
  } finally {
    await h.cleanup();
  }
});
test("missing creator settings fail closed, empty optional names remain tasteful and invalid/oversized data is rejected", async () => {
  const h = await harness({ creatorPassword: "" });
  try {
    assert.equal(
      (await (await h.server.creatorStatus(h.request())).json()).setupRequired,
      true,
    );
    assert.equal((await h.login()).status, 503);
    const c = await h.server.repository.save({
      draft: {
        ...draft,
        recipientName: "",
        senderName: "",
        letter: "",
        greeting: "",
      },
      expectedRevision: 0,
      newEvent: false,
    });
    assert.equal(c.recipientName, "");
    assert.equal(c.senderName, "");
    assert.equal(c.letter, DEFAULT_LETTER);
    await assert.rejects(
      h.server.repository.save({
        draft: { ...draft, letter: "x".repeat(8001) },
        expectedRevision: 1,
        newEvent: false,
      }),
      /BAD_REQUEST/,
    );
    const oversized = new Request("http://localhost:3000/api/birthday/access", {
      method: "POST",
      headers: {
        host: "127.0.0.1:3000",
        origin: h.config.origin,
        "content-type": "application/json",
      },
      body: JSON.stringify({ role: "creator", password: "x".repeat(50000) }),
    });
    assert.equal((await h.server.login(oversized)).status, 413);
  } finally {
    await h.cleanup();
  }
});
test("configured recipient password protects letter and real gift independently from creator preview session", async () => {
  const h = await harness({
    recipientPassword: "not-real-recipient-test-password",
  });
  try {
    await h.server.repository.save({
      draft,
      expectedRevision: 0,
      newEvent: false,
    });
    h.time(BIRTHDAY);
    const publicRead = await (await h.server.publicStatus(h.request())).json();
    assert.equal(publicRead.accessRequired, true);
    assert.equal(publicRead.event, undefined);
    const creator = await h.login();
    const creatorCookie = creator.headers.get("set-cookie")!.split(";")[0];
    assert.equal(
      (
        await h.server.open(
          h.request("/api/birthday/open", "POST", {}, creatorCookie),
        )
      ).status,
      401,
    );
    const recipient = await h.login("recipient", h.config.recipientPassword);
    const cookie = recipient.headers.get("set-cookie")!.split(";")[0];
    assert.equal(
      (await h.server.open(h.request("/api/birthday/open", "POST", {}, cookie)))
        .status,
      200,
    );
    h.time(BIRTHDAY + 5 * 3600000);
    assert.equal(
      (await h.server.open(h.request("/api/birthday/open", "POST", {}, cookie)))
        .status,
      401,
    );
  } finally {
    await h.cleanup();
  }
});
test("forged or expired creator cookie never authorizes updates, and logout clears only the creator session", async () => {
  const h = await harness();
  try {
    const login = await h.login();
    const cookie = login.headers.get("set-cookie")!.split(";")[0];
    assert.ok(
      h.server.authenticated(
        h.request(undefined, "GET", undefined, cookie),
        "creator",
      ),
    );
    assert.equal(
      h.server.authenticated(
        h.request(undefined, "GET", undefined, cookie + "tampered"),
        "creator",
      ),
      false,
    );
    const out = await h.server.logout(
      h.request("/api/birthday/creator", "DELETE", {}, cookie),
    );
    assert.match(out.headers.get("set-cookie")!, /Max-Age=0/);
    h.time(BIRTHDAY + 5 * 3600000);
    assert.equal(
      h.server.authenticated(
        h.request(undefined, "GET", undefined, cookie),
        "creator",
      ),
      false,
    );
  } finally {
    await h.cleanup();
  }
});
test("exclusive birthday reward is once per event and preserves all existing garden data across reload", () => {
  const initial = applyCommand(
    createStarter(BIRTHDAY - 100000),
    { type: "plant", plotId: 0, species: "rose" },
    BIRTHDAY - 100000,
  ).state;
  const memory = { event: fixture, openedAt: BIRTHDAY },
    result = receiveBirthday(initial, memory);
  assert.ok(!result.error);
  assert.equal(result.state.coins, initial.coins + 20);
  assert.equal(result.state.seeds["birthday-star"], 1);
  assert.ok(result.state.decorations.includes("birthday-arch"));
  assert.deepEqual(result.state.plots, initial.plots);
  assert.deepEqual(result.state.placements, initial.placements);
  assert.equal(result.state.collection, initial.collection);
  assert.ok(validateGarden(result.state));
  const restored = JSON.parse(JSON.stringify(result.state));
  assert.equal(
    receiveBirthday(restored, { ...memory, openedAt: BIRTHDAY + 1000 })
      .duplicate,
    true,
  );
  assert.deepEqual(restored.birthdayMemories, [memory]);
  const edited = receiveBirthday(restored, {
    event: { ...fixture, revision: 2, letter: "Sonradan değişen mektup." },
    openedAt: BIRTHDAY + 1000,
  });
  assert.equal(edited.state.coins, restored.coins);
  assert.equal(edited.state.birthdayMemories?.[0].event.letter, draft.letter);
  const different = receiveBirthday(restored, {
    event: { ...fixture, id: "birthday-test-next-event" },
    openedAt: BIRTHDAY + 86400000,
  });
  assert.equal(different.state.coins, initial.coins + 40);
  assert.equal(different.state.birthdayMemories?.length, 2);
});
test("birthday seed plants, grows, harvests, and displays permanently through existing garden commands", () => {
  let s = receiveBirthday(createStarter(BIRTHDAY), {
    event: fixture,
    openedAt: BIRTHDAY,
  }).state;
  s = applyCommand(
    s,
    { type: "plant", plotId: 0, species: "birthday-star" },
    BIRTHDAY,
  ).state;
  assert.equal(s.seeds["birthday-star"], 0);
  assert.equal(growth(s.plots[0].plant!, BIRTHDAY + 120000).stage, "bloom");
  s = applyCommand(
    s,
    { type: "harvest", plotId: 0, plantKey: plantKey(s.plots[0].plant!, 0) },
    BIRTHDAY + 120000,
  ).state;
  s = applyCommand(
    s,
    { type: "display-flower", species: "birthday-star", slot: 0 },
    BIRTHDAY + 120000,
  ).state;
  s = applyCommand(
    s,
    { type: "remove-flower", slot: 0 },
    BIRTHDAY + 120000,
  ).state;
  assert.equal(s.collection?.["birthday-star"]?.quantity, 1);
  assert.equal(s.birthdayMemories?.length, 1);
  assert.equal(s.coins, 50);
  assert.ok(validateGarden(s));
});
test("birthday content remains hidden from ordinary garden inventory until unlocked; corrupt memories and overflow are rejected", () => {
  const initial = createStarter(BIRTHDAY);
  assert.equal(visibleGardenFlowers(initial.unlockedFlowers).length, 10);
  assert.ok(
    !visibleGardenFlowers(initial.unlockedFlowers).some(
      (f) => f.id === "birthday-star",
    ),
  );
  const reward = receiveBirthday(initial, {
    event: fixture,
    openedAt: BIRTHDAY,
  }).state;
  assert.ok(
    visibleGardenFlowers(reward.unlockedFlowers).some(
      (f) => f.id === "birthday-star",
    ),
  );
  assert.equal(
    validateGarden({
      ...reward,
      birthdayMemories: [
        ...reward.birthdayMemories!,
        ...reward.birthdayMemories!,
      ],
    }),
    false,
  );
  assert.ok(
    receiveBirthday(
      { ...initial, coins: 999999 },
      { event: fixture, openedAt: BIRTHDAY },
    ).error,
  );
  assert.ok(
    receiveBirthday(initial, { event: fixture, openedAt: BIRTHDAY - 1 }).error,
  );
});
test("stage 12 garden migrates only the new zero seed and keeps gifts, shop, XP and old progress", () => {
  const values = new Map<string, string>();
  const original = JSON.parse(JSON.stringify(createStarter(BIRTHDAY)));
  delete original.seeds["birthday-star"];
  values.set(GARDEN_KEY, JSON.stringify(original));
  const disk = {
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      values.set(k, v);
    },
  };
  const store = createLocalGardenStorage(() => disk),
    loaded = store.load(BIRTHDAY);
  assert.equal(loaded.mode, "local");
  assert.equal(loaded.state.seeds["birthday-star"], 0);
  assert.equal(loaded.state.coins, 30);
  assert.equal(loaded.state.birthdayMemories, undefined);
});

test("first visit may receive server opening just before garden initialization; parallel tabs and failed writes do not duplicate rewards", async () => {
  const values = new Map<string, string>();
  const created = Date.now();
  const firstEvent = {
    ...fixture,
    date: new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(created),
  };
  const initial = createStarter(created);
  const payload = { event: firstEvent, openedAt: created - 50 };
  assert.ok(!receiveBirthday(initial, payload).error);
  const xpKey = "deutsch-garden:exercises:v1";
  values.set(xpKey, "existing-xp-is-untouched");
  let fail = false,
    queue: Promise<unknown> = Promise.resolve();
  const disk = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (fail) throw Error("quota");
      values.set(key, value);
    },
  };
  createLocalGardenStorage(() => disk).save(initial);
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window"),
    oldNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "window", {
    value: { localStorage: disk },
    configurable: true,
  });
  Object.defineProperty(globalThis, "navigator", {
    value: {
      locks: {
        request: (_key: string, run: () => unknown) => {
          const next = queue.then(run);
          queue = next.catch(() => undefined);
          return next;
        },
      },
    },
    configurable: true,
  });
  try {
    const { receiveBirthdayGift } = await import("../garden/store.ts");
    fail = true;
    assert.equal((await receiveBirthdayGift(payload)).ok, false);
    assert.equal(
      createLocalGardenStorage(() => disk).load(created).state.coins,
      30,
    );
    fail = false;
    const results = await Promise.all([
      receiveBirthdayGift(payload),
      receiveBirthdayGift({ ...payload, openedAt: created + 1 }),
    ]);
    assert.ok(results.every((r) => r.ok));
    const restored = createLocalGardenStorage(() => disk).load(
      created + 10,
    ).state;
    assert.equal(restored.coins, 50);
    assert.equal(restored.seeds["birthday-star"], 1);
    assert.equal(restored.birthdayMemories?.length, 1);
    assert.equal(restored.birthdayMemories?.[0].openedAt, payload.openedAt);
    assert.equal(values.get(xpKey), "existing-xp-is-untouched");
    assert.ok(validateGarden(restored));
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (oldNavigator)
      Object.defineProperty(globalThis, "navigator", oldNavigator);
    else Reflect.deleteProperty(globalThis, "navigator");
  }
});
