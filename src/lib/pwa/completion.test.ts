import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { validPushEndpoint } from "./push.ts";
import { miniCourses } from "../courses/content.ts";
import { validXpReceipt } from "../gamification/rewards.ts";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
test("six offline packs preserve every lesson and all 1419 public example recordings", () => {
  let examples = 0;
  for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
    const p = JSON.parse(
      readFileSync(`public/offline-packs/${level}.json`, "utf8"),
    );
    assert.equal(p.courses.length, 10);
    assert.deepEqual(
      p.courses,
      miniCourses.filter((c) => c.level === level),
    );
    for (const c of p.courses)
      for (const e of c.examples) {
        const a = p.audio[e.id];
        assert.ok(a);
        assert.match(
          a.url,
          /^\/audio\/(courses|course-examples)\/[a-zA-Z0-9_.-]+\.(wav|mp3)$/,
        );
        assert.ok(existsSync("public" + a.url));
        examples++;
      }
  }
  assert.equal(examples, 1419);
});
test("push accepts only supported HTTPS delivery hosts and rejects SSRF destinations", () => {
  for (const u of [
    "https://fcm.googleapis.com/send/a",
    "https://updates.push.services.mozilla.com/a",
    "https://web.push.apple.com/a",
    "https://x.notify.windows.com/a",
  ])
    assert.ok(validPushEndpoint(u));
  for (const u of [
    "http://fcm.googleapis.com/a",
    "https://localhost/a",
    "https://127.0.0.1/a",
    "https://fcm.googleapis.com.evil.test/a",
    "https://user:pass@fcm.googleapis.com/a",
    "https://fcm.googleapis.com:8080/a",
    "file:///private",
    null,
  ])
    assert.equal(validPushEndpoint(u), false);
});
test("diary receipts require the exact namespace and XP amount", () => {
  assert.ok(validXpReceipt("diary:day:2026-10-30", 15));
  for (const [id, amount] of [
    ["diary:day:2026-10-30", 5],
    ["diary:anything", 15],
    ["diary:anything", 5],
    ["diary:day:2026-10-30:extra", 15],
  ] as const)
    assert.equal(validXpReceipt(id, amount), false);
});
test("package sanitizer removes generated private copies while preserving originals and public code", () => {
  mkdirSync(".cache/package-test", { recursive: true });
  const dir = mkdtempSync(resolve(".cache/package-test/run-"));
  try {
    const out = join(dir, ".next/standalone");
    mkdirSync(join(out, ".cache/lumi"), { recursive: true });
    mkdirSync(join(dir, ".cache"), { recursive: true });
    writeFileSync(join(dir, ".cache/source"), "original");
    writeFileSync(join(dir, ".env.local"), "original");
    writeFileSync(join(out, ".env.local"), "copy");
    writeFileSync(join(out, ".cache/lumi/usage.sqlite"), "copy");
    writeFileSync(join(out, "server.js"), "public");
    writeFileSync(
      join(out, "server.nft.json"),
      JSON.stringify({
        version: 1,
        files: ["../../.cache/lumi/usage.sqlite", "server.js"],
      }),
    );
    const result = spawnSync(
      process.execPath,
      [resolve("scripts/sanitize-package.mjs")],
      { cwd: dir, encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(join(out, ".cache")), false);
    assert.equal(existsSync(join(out, ".env.local")), false);
    assert.equal(readFileSync(join(dir, ".env.local"), "utf8"), "original");
    assert.equal(readFileSync(join(dir, ".cache/source"), "utf8"), "original");
    assert.equal(readFileSync(join(out, "server.js"), "utf8"), "public");
    assert.deepEqual(
      JSON.parse(readFileSync(join(out, "server.nft.json"), "utf8")).files,
      ["server.js"],
    );
  } finally {
    assert.ok(
      dir.startsWith(
        resolve(".cache/package-test") +
          "/".replace("/", process.platform === "win32" ? "\\" : "/"),
      ),
    );
    rmSync(dir, { recursive: true });
  }
});
