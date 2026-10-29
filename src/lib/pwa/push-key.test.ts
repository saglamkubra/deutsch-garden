import test from "node:test";
import assert from "node:assert/strict";
import { createECDH } from "node:crypto";
import {
  decodePushPublicKey,
  pushSubscriptionError,
  validPushEndpoint,
} from "./push.ts";
test("VAPID decoder accepts generated unpadded base64url and rejects placeholders", () => {
  const curve = createECDH("prime256v1");
  const bytes = curve.generateKeys();
  assert.deepEqual(
    Buffer.from(decodePushPublicKey(bytes.toString("base64url"))),
    bytes,
  );
  for (const value of ["...", "", null, "x".repeat(87), "abc+"])
    assert.throws(() => decodePushPublicKey(value), /Bildirim anahtarı/);
});
test("verified Chromium staging endpoint is allowed without broadening Google host access", () => {
  assert.ok(
    validPushEndpoint("https://jmt17.google.com/fcm/send/synthetic-token"),
  );
  assert.equal(
    pushSubscriptionError("https://jmt17.google.com/fcm/send/synthetic-token", {
      auth: "test",
      p256dh: "test",
    }),
    null,
  );
  for (const address of [
    "https://jmt17.google.com/other/token",
    "https://jmt17.google.com/fcm/send/",
    "https://jmt17.google.com.evil.example/fcm/send/token",
    "https://other.google.com/fcm/send/token",
    "http://jmt17.google.com/fcm/send/token",
    "https://jmt17.google.com:8443/fcm/send/token",
    "https://user:pass@jmt17.google.com/fcm/send/token",
  ])
    assert.equal(validPushEndpoint(address), false);
});
test("push diagnostics distinguish provider and missing keys without leaking endpoint tokens", () => {
  const diagnostic = pushSubscriptionError(
    "https://unknown.example/private-subscription-token",
    { auth: "secret", p256dh: "secret" },
  )!;
  assert.ok(diagnostic.includes("unknown.example"));
  assert.ok(!diagnostic.includes("private-subscription-token"));
  assert.ok(!diagnostic.includes("secret"));
  assert.match(
    pushSubscriptionError("https://fcm.googleapis.com/send/private", {})!,
    /anahtarlarını oluşturmadı/,
  );
  assert.equal(
    pushSubscriptionError("https://fcm.googleapis.com/send/private", {
      auth: "test",
      p256dh: "test",
    }),
    null,
  );
});
