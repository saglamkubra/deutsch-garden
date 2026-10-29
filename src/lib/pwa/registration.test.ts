import test from "node:test";
import assert from "node:assert/strict";
import { ensurePushRegistration } from "./registration.ts";
const active = { active: {} } as ServiceWorkerRegistration;
test("push button creates missing development registration and waits for activation", async () => {
  let calls = 0;
  const registration = await ensurePushRegistration({
    getRegistration: async () => undefined,
    register: async (url, options) => {
      calls++;
      assert.equal(url, "/sw.js");
      assert.equal(options?.scope, "/");
      return { active: null } as ServiceWorkerRegistration;
    },
    ready: Promise.resolve(active),
  });
  assert.equal(registration, active);
  assert.equal(calls, 1);
});
test("existing active worker is reused without registration or extra requests", async () => {
  assert.equal(
    await ensurePushRegistration({
      getRegistration: async () => active,
      register: async () => {
        throw Error("unexpected registration");
      },
      ready: Promise.resolve(active),
    }),
    active,
  );
});
test("registration failures and activation timeout remain visible", async () => {
  await assert.rejects(
    ensurePushRegistration({
      getRegistration: async () => undefined,
      register: async () => {
        throw new DOMException("blocked", "SecurityError");
      },
      ready: Promise.resolve(active),
    }),
    { name: "SecurityError" },
  );
  await assert.rejects(
    ensurePushRegistration(
      {
        getRegistration: async () =>
          ({ active: null }) as ServiceWorkerRegistration,
        register: async () => active,
        ready: new Promise(() => {}),
      },
      5,
    ),
    /zamanında etkinleşmedi/,
  );
});
