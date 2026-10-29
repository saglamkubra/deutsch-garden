import { test } from "node:test";
import assert from "node:assert/strict";
import { createStarter } from "../garden/model.ts";
import { capture, fingerprint } from "./snapshot.ts";
import { progressStorage, keyFor } from "./storage.ts";
import { connectAccount } from "./client.ts";
import {
  startAccount,
  accountSnapshot,
  saveCloud,
  chooseSnapshot,
} from "./sync.ts";
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
test("Actual sync coordinator: device loading, unchanged saves, lost response retry, in-flight edits, conflict and confirmed import", async (t) => {
  const disk = new Disk(),
    events = new EventTarget();
  const user = {
    id: "33333333-3333-4333-8333-333333333333",
    aud: "authenticated",
    email: "test@example.invalid",
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
  };
  let reloads = 0;
  const location = {
    href: "http://127.0.0.1:3000/profilim",
    origin: "http://127.0.0.1:3000",
    pathname: "/profilim",
    reload: () => {
      reloads++;
    },
    replace: () => {
      reloads++;
    },
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: disk,
      addEventListener: events.addEventListener.bind(events),
      dispatchEvent: events.dispatchEvent.bind(events),
      location,
    },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { visibilityState: "visible" },
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: disk,
  });
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: location,
  });
  const interval = globalThis.setInterval;
  // Coordinator polling must not keep a Node test process alive.
  t.mock.method(
    globalThis,
    "setInterval",
    (...args: Parameters<typeof setInterval>) => {
      const timer = interval(...args);
      timer.unref();
      return timer;
    },
  );
  const guest = createStarter(1);
  guest.coins = 70;
  disk.setItem(keyFor("garden"), JSON.stringify(guest));
  let cloud = {
    user_id: user.id,
    revision: 4,
    private_epoch: 0,
    payload: {
      version: 1 as const,
      modules: { garden: { ...createStarter(2), coins: 40 } },
    },
    updated_at: new Date().toISOString(),
  };
  let failAfterCommit = false,
    pauseNext = false,
    release: (() => void) | null = null,
    rpcCalls = 0;
  const receipts = new Set<string>();
  t.mock.method(
    globalThis,
    "fetch",
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(String(input), location.origin),
        body = init?.body ? JSON.parse(String(init.body)) : {};
      if (url.pathname === "/api/account/config")
        return Response.json({
          configured: true,
          url: "https://test.example.invalid",
          key: "sb_publishable_test",
        });
      if (url.pathname.endsWith("/token"))
        return Response.json({
          access_token:
            "test." +
            Buffer.from(
              JSON.stringify({
                exp: Math.floor(Date.now() / 1000) + 3600,
                sub: user.id,
              }),
            ).toString("base64url") +
            ".test",
          refresh_token: "test-refresh",
          token_type: "bearer",
          expires_in: 3600,
          user,
        });
      if (url.pathname.endsWith("/user")) return Response.json(user);
      if (url.pathname.endsWith("/user_progress"))
        return Response.json([cloud]);
      if (url.pathname.endsWith("/rpc/save_learning_snapshot")) {
        rpcCalls++;
        if (!receipts.has(body.p_operation)) {
          if (body.p_expected !== cloud.revision)
            return Response.json(
              { code: "P0001", message: "SYNC_CONFLICT" },
              { status: 400 },
            );
          cloud = {
            ...cloud,
            revision: cloud.revision + 1,
            payload: body.p_payload,
          };
          receipts.add(body.p_operation);
        }
        if (pauseNext) {
          pauseNext = false;
          await new Promise<void>((resolve) => {
            release = resolve;
          });
        }
        if (failAfterCommit) {
          failAfterCommit = false;
          throw new TypeError("network failure after commit");
        }
        return Response.json(cloud);
      }
      throw new Error("Unexpected mocked request: " + url.pathname);
    },
  );
  const client = await connectAccount();
  assert.ok(client);
  await client.auth.signInWithPassword({
    email: user.email,
    password: "test-only-password",
  });
  try {
    await startAccount();
    assert.equal(accountSnapshot().ready, true);
    assert.equal(
      (capture(disk, user.id).modules.garden as typeof guest).coins,
      40,
    );
    assert.equal(
      (capture(disk, null).modules.garden as typeof guest).coins,
      70,
    );
    await saveCloud();
    assert.equal(rpcCalls, 0, "unchanged state needs no write");
    const update = (coins: number) => {
      const s = capture(disk, user.id).modules.garden as typeof guest;
      s.coins = coins;
      s.revision++;
      progressStorage().setItem(keyFor("garden"), JSON.stringify(s));
    };
    update(39);
    failAfterCommit = true;
    await saveCloud();
    assert.equal(accountSnapshot().status, "error");
    assert.equal(cloud.revision, 5);
    await saveCloud();
    assert.equal(accountSnapshot().status, "saved");
    assert.equal(cloud.revision, 5, "same operation must not commit twice");
    update(38);
    pauseNext = true;
    const saving = saveCloud();
    // Wait for the fake transport's explicit checkpoint, without a real network.
    while (!release) await new Promise((resolve) => setImmediate(resolve));
    update(37);
    (release as () => void)();
    await saving;
    const meta = JSON.parse(disk.getItem("deutsch-garden:sync:" + user.id)!);
    assert.notEqual(
      meta.hash,
      await fingerprint(capture(disk, user.id)),
      "an in-flight edit remains dirty",
    );
    await saveCloud();
    assert.equal(cloud.payload.modules.garden.coins, 37);
    update(36);
    cloud = { ...cloud, revision: cloud.revision + 1 };
    await saveCloud();
    assert.equal(accountSnapshot().status, "conflict");
    assert.equal(
      (capture(disk, user.id).modules.garden as typeof guest).coins,
      36,
    );
    await chooseSnapshot("guest");
    assert.equal(cloud.payload.modules.garden.coins, 70);
    assert.equal(
      (capture(disk, user.id).modules.garden as typeof guest).coins,
      70,
    );
    assert.equal(
      (capture(disk, null).modules.garden as typeof guest).coins,
      70,
    );
    assert.ok(
      [...disk.data.keys()].some((k) =>
        k.startsWith("deutsch-garden:archive:" + user.id + ":"),
      ),
    );
    assert.equal(reloads, 1);
  } finally {
    await client.auth.dispose();
  }
});
