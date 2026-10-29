import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { resolve, join, sep } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { LumiLedger } from "../lumi/ledger.ts";
import {
  sealBackup,
  validateBackup,
  checkBackupSecrets,
  canonical,
} from "./backup.ts";
import { serverStateStore } from "./store.ts";
const secret = "fake-test-secret-at-least-32-characters";
function example() {
  const l = new LumiLedger(":memory:");
  try {
    return sealBackup({
      format: 1,
      createdAt: 1,
      secretHashes: {
        lumi: createHash("sha256").update(secret).digest("hex"),
        birthday: createHash("sha256").update(secret).digest("hex"),
      },
      states: {
        "lumi-ledger-v1": l.exportData(),
        "birthday-config-v1": { config: null },
        "birthday-access-v1": { attempts: [] },
      },
    });
  } finally {
    l.close();
  }
}
test("Private migration backup round-trips with integrity and never contains session secret values", () => {
  const b = example();
  assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(b))), b);
  assert.ok(!JSON.stringify(b).includes(secret));
  assert.equal(canonical({ b: 1, a: 2 }), canonical({ a: 2, b: 1 }));
  checkBackupSecrets(b, secret, secret);
});
test("Tampered backups, wrong session secrets and malformed ledger rows cannot be imported", () => {
  const b = example(),
    bad = structuredClone(b);
  bad.createdAt++;
  assert.throws(() => validateBackup(bad), /INVALID_BACKUP/);
  assert.throws(
    () =>
      checkBackupSecrets(
        b,
        "different-test-secret-at-least-32-characters",
        secret,
      ),
    /SECRET_MISMATCH/,
  );
  assert.throws(() => checkBackupSecrets(b, "", secret), /SECRET_REQUIRED/);
  const { digest: _, ...rest } = b;
  void _;
  rest.states["lumi-ledger-v1"] = { version: 1, tables: {} };
  assert.throws(() => validateBackup(sealBackup(rest)), /STORAGE_UNAVAILABLE/);
});
test("Malformed empty birthday state must not turn a broken backup into a silently empty letter", () => {
  const { digest: _, ...b } = example();
  void _;
  b.states["birthday-config-v1"] = {};
  assert.throws(() => validateBackup(sealBackup(b)), /INVALID_BACKUP/);
});
test("Server PostgREST adapter retries lost CAS acknowledgement with the same operation and no duplicate revision", async () => {
  const original = globalThis.fetch;
  let calls = 0,
    operation = "",
    revision = 0;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert.ok(url.startsWith("https://test-project.supabase.co/rest/v1/rpc/"));
    assert.equal(init?.cache, "no-store");
    const args = JSON.parse(String(init?.body));
    if (url.endsWith("dg_server_state_cas")) {
      calls++;
      if (!operation) {
        operation = args.p_operation;
        revision++;
        throw new TypeError("fetch failed");
      }
      assert.equal(args.p_operation, operation);
      return Response.json(true);
    }
    return Response.json({ revision, payload: { attempts: [] } });
  };
  try {
    const store = serverStateStore({
      SUPABASE_URL: "https://test-project.supabase.co",
      SUPABASE_SERVER_SECRET_KEY: "sb_secret_fake_server_only_test",
    });
    assert.equal(
      await store.cas("birthday-access-v1", 0, { attempts: [] }, randomUUID()),
      true,
    );
    assert.equal(calls, 2);
    assert.equal(revision, 1);
    assert.equal((await store.read("birthday-access-v1")).revision, 1);
  } finally {
    globalThis.fetch = original;
  }
});

test("Operator export and restore use synthetic local files only, preserve originals, and refuse overwrites", () => {
  const id = "qa-" + randomUUID(),
    root = resolve(".cache/stateless-fixtures", id),
    out = resolve(".cache/server-backups", id),
    restore = resolve(".cache/server-restores", id);
  const env = {
    ...process.env,
    LUMI_DATA_DIR: join(root, "lumi"),
    BIRTHDAY_DATA_DIR: join(root, "birthday"),
    LUMI_SESSION_SECRET: secret,
    BIRTHDAY_SESSION_SECRET: secret,
  };
  const run = (args: string[]) =>
    execFileSync(process.execPath, ["scripts/server-storage.ts", ...args], {
      env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  try {
    mkdirSync(join(root, "lumi"), { recursive: true });
    mkdirSync(join(root, "birthday"));
    const l = new LumiLedger(join(root, "lumi/usage.sqlite"));
    l.close();
    const config = {
      version: 1,
      id: randomUUID(),
      revision: 1,
      date: "2026-10-28",
      recipientName: "",
      senderName: "",
      greeting: "İyi ki doğdun",
      letter: "PRIVATE_SYNTHETIC_LETTER_ONLY",
      showCountdown: false,
    };
    writeFileSync(join(root, "birthday/config.json"), JSON.stringify(config));
    const source = readFileSync(join(root, "lumi/usage.sqlite"));
    const file = join(out, "backup.json"),
      result = run(["export-local", "--out", file]);
    assert.ok(!result.includes(config.letter));
    assert.ok(!result.includes(secret));
    const backup = validateBackup(JSON.parse(readFileSync(file, "utf8")));
    assert.equal(
      (backup.states["birthday-config-v1"] as { config: typeof config }).config
        .letter,
      config.letter,
    );
    assert.deepEqual(readFileSync(join(root, "lumi/usage.sqlite")), source);
    assert.throws(() => run(["export-local", "--out", file]));
    run([
      "restore-local",
      "--file",
      file,
      "--out",
      restore,
      "--confirm-private-restore",
    ]);
    assert.deepEqual(
      JSON.parse(readFileSync(join(restore, "birthday/config.json"), "utf8")),
      config,
    );
    assert.throws(() =>
      run([
        "restore-local",
        "--file",
        file,
        "--out",
        restore,
        "--confirm-private-restore",
      ]),
    );
    assert.equal(
      JSON.parse(readFileSync(join(root, "birthday/config.json"), "utf8"))
        .letter,
      config.letter,
    );
  } finally {
    for (const path of [root, out, restore]) {
      if (!path.startsWith(resolve(".cache") + sep))
        throw Error("Unsafe test cleanup");
      rmSync(path, { recursive: true, force: true });
    }
  }
});
