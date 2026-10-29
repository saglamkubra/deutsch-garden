import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import {
  storageMode,
  serverStateStore,
  type StateStore,
  type StateRow,
} from "./store.ts";
import { LumiService } from "../lumi/service.ts";
import { CloudLumiLedger } from "../lumi/cloud-ledger.ts";
import { LumiLedger } from "../lumi/ledger.ts";
import { LIMITS } from "../lumi/protocol.ts";
import type { TutorRequest } from "../lumi/protocol.ts";
import { CloudBirthdayRepository } from "../birthday/cloud-repository.ts";
import { BirthdayServer } from "../birthday/server.ts";
import { createStarter } from "../garden/model.ts";
import { claimGift } from "../gifts/model.ts";
const A = "11111111-1111-4111-8111-111111111111",
  B = "22222222-2222-4222-8222-222222222222";
const now = Date.UTC(2026, 9, 28, 10);
const make = (id: string): TutorRequest => ({
  action: "message",
  conversationId: "chat-" + id,
  requestId: "call-" + id,
  level: "A1",
  mode: "daily",
  correction: "gentle",
  messages: [{ role: "user", content: "Hallo, ich lerne Deutsch." }],
});
const reply = {
  message: "Hallo! Wie geht es dir?",
  encouragementTr: "Güzel bir başlangıç.",
  corrections: [],
  vocabulary: [],
};
test("Production never silently falls back to disk or accepts browser credentials", () => {
  assert.throws(() => storageMode({ NODE_ENV: "production" }));
  assert.throws(() =>
    storageMode({ NODE_ENV: "production", SERVER_STORAGE: "local" }),
  );
  assert.equal(
    storageMode({ NODE_ENV: "production", SERVER_STORAGE: "supabase" }),
    "supabase",
  );
  assert.equal(
    storageMode({
      NODE_ENV: "production",
      SERVER_STORAGE: "local",
      SERVER_LOCAL_DISK_CONFIRMED: "true",
    }),
    "local",
  );
  assert.equal(storageMode({ NODE_ENV: "development" }), "local");
  assert.throws(() =>
    serverStateStore({
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVER_SECRET_KEY: "sb_publishable_fake",
    }),
  );
});
test("Stateless Postgres backend: restarts, concurrent reservations, private letters, atomic claims and RLS", async (t) => {
  const db = new PGlite();
  try {
    await db.exec(
      "create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth,public to anon,authenticated,service_role;",
    );
    for (const file of (await readdir("supabase/migrations"))
      .filter((f) => f.endsWith(".sql"))
      .sort())
      await db.exec(await readFile("supabase/migrations/" + file, "utf8"));
    await db.query("insert into auth.users(id) values($1),($2)", [A, B]);
    await db.exec(
      "insert into public.learning_levels(code,world_name,description,position) values('A1','a','a',1);set role service_role",
    );
    const connection = (): StateStore => ({
      async read(key) {
        return (
          await db.query<{ value: StateRow }>(
            "select public.dg_server_state_read($1) as value",
            [key],
          )
        ).rows[0].value;
      },
      async cas(key, expected, payload, operation) {
        return (
          await db.query<{ value: boolean }>(
            "select public.dg_server_state_cas($1,$2,$3::jsonb,$4) as value",
            [key, expected, JSON.stringify(payload), operation],
          )
        ).rows[0].value;
      },
    });
    const store = connection(),
      memory = new LumiLedger(":memory:");
    await store.cas("lumi-ledger-v1", 0, memory.exportData(), randomUUID());
    memory.close();
    await store.cas("birthday-config-v1", 0, { config: null }, randomUUID());
    await store.cas("birthday-access-v1", 0, { attempts: [] }, randomUUID());
    await t.test(
      "CAS operation retry is idempotent; mismatched and stale writes cannot overwrite state",
      async () => {
        const op = randomUUID(),
          p = { attempts: [now] },
          row = await store.read("birthday-access-v1");
        assert.equal(
          await store.cas("birthday-access-v1", row.revision, p, op),
          true,
        );
        assert.equal(
          await store.cas("birthday-access-v1", row.revision, p, op),
          true,
        );
        assert.equal(
          await store.cas(
            "birthday-access-v1",
            row.revision,
            { attempts: [] },
            randomUUID(),
          ),
          false,
        );
        await assert.rejects(
          store.cas("birthday-access-v1", row.revision, { attempts: [] }, op),
          /OPERATION_MISMATCH/,
        );
      },
    );
    await t.test(
      "usage survives new server instances; parallel requests cannot exceed owner budget or access another conversation",
      async () => {
        const first = new CloudLumiLedger(connection()),
          r = make("restart-first");
        await first.reserve("owner-one", r, now);
        await first.complete(
          "owner-one",
          r,
          reply,
          now + 1000,
          "test-secret-at-least-32-characters",
        );
        first.close();
        const restarted = new CloudLumiLedger(connection());
        assert.equal(
          await restarted.remaining("owner-one", now),
          LIMITS.clientDay - 1,
        );
        await assert.rejects(
          restarted.reserve(
            "owner-two",
            { ...r, requestId: "foreign-attempt" },
            now,
          ),
          /ACCESS_DENIED/,
        );
        assert.equal(
          (await restarted.reserve("owner-one", r, now)).cached,
          true,
        );
        const attempts = await Promise.allSettled(
          Array.from({ length: 9 }, (_, i) =>
            new CloudLumiLedger(connection()).reserve(
              "parallel-owner",
              make("parallel-" + i),
              now + 2000,
            ),
          ),
        );
        assert.equal(
          attempts.filter((r) => r.status === "fulfilled").length,
          3,
        );
        assert.equal(
          await restarted.remaining("parallel-owner", now + 2000),
          LIMITS.clientDay - 3,
        );
        const stored = JSON.stringify(
          (await store.read("lumi-ledger-v1")).payload,
        );
        assert.ok(!stored.includes(r.messages[0].content));
        assert.ok(!stored.includes(reply.message));
      },
    );
    await t.test(
      "qualified Lumi receipt survives restart; completion and failed acknowledgement cannot issue twice",
      async () => {
        const l = new CloudLumiLedger(connection()),
          secret = "test-secret-at-least-32-characters";
        const messages: TutorRequest["messages"] = [];
        const id = "qualified-conversation";
        for (let i = 0; i < 4; i++) {
          messages.push({
            role: "user",
            content: "Hallo, ich lerne heute viele deutsche Wörter.",
          });
          const r = {
            ...make("qualified-" + i),
            conversationId: id,
            messages: [...messages],
          };
          await l.reserve("qualified-owner", r, now + (i + 2) * 61000);
          await l.complete(
            "qualified-owner",
            r,
            reply,
            now + (i + 2) * 61000 + 1000,
            secret,
          );
          messages.push({ role: "assistant", content: reply.message });
        }
        const finish = {
          ...make("qualified-finish"),
          action: "finish" as const,
          conversationId: id,
          messages,
        };
        const at = now + 7 * 61000;
        await l.reserve("qualified-owner", finish, at);
        const result = await l.complete(
          "qualified-owner",
          finish,
          reply,
          at + 1000,
          secret,
        );
        assert.ok(result?.receipt);
        assert.equal(result.qualified, true);
        const restart = new CloudLumiLedger(connection());
        assert.equal(
          await restart.verifyReceipt(
            result.receipt,
            "qualified-owner",
            secret,
          ),
          true,
        );
        assert.equal(
          await restart.verifyReceipt(result.receipt, "other-owner", secret),
          false,
        );
        await restart.failed(finish.requestId);
        assert.equal(
          (await restart.reserve("qualified-owner", finish, at + 2000)).cached,
          true,
        );
        const payload = (await store.read("lumi-ledger-v1"))
          .payload as ReturnType<LumiLedger["exportData"]>;
        assert.equal(payload.tables.lumi_awards.length, 1);
      },
    );
    await t.test(
      "API service restart keeps usage and does not regenerate a lost cached answer",
      async () => {
        let calls = 0;
        const fetcher: typeof fetch = async () => {
          calls++;
          return Response.json({
            status: "completed",
            output: [
              {
                type: "message",
                content: [{ type: "output_text", text: JSON.stringify(reply) }],
              },
            ],
          });
        };
        const config = {
          key: "fake-key",
          model: "fake-test-model",
          secret: "fake-session-secret-at-least-32-characters",
          password: "",
          origin: "http://localhost:3000",
          production: false,
        };
        const service = () =>
          new LumiService(
            config,
            new CloudLumiLedger(connection()),
            fetcher,
            () => now + 1200000,
          );
        const first = service(),
          status = await first.status(
            new Request(config.origin + "/api/lumi/chat"),
          ),
          cookie = status.headers.get("set-cookie")!.split(";")[0],
          body = make("service-restart");
        const request = () =>
          new Request(config.origin + "/api/lumi/chat", {
            method: "POST",
            headers: {
              origin: config.origin,
              "content-type": "application/json",
              cookie,
            },
            body: JSON.stringify(body),
          });
        assert.equal((await first.handle(request())).status, 200);
        const restarted = service();
        const state = await (
          await restarted.status(
            new Request(config.origin + "/api/lumi/chat", {
              headers: { cookie },
            }),
          )
        ).json();
        assert.equal(state.remaining, LIMITS.clientDay - 1);
        const replay = await restarted.handle(request());
        assert.equal(replay.status, 409);
        assert.equal((await replay.json()).error.code, "RETRY_EXPIRED");
        assert.equal(calls, 1);
      },
    );
    await t.test(
      "global daily budget survives changing cookies and server instances",
      async () => {
        const payload = (await store.read("lumi-ledger-v1"))
          .payload as ReturnType<LumiLedger["exportData"]>;
        const remaining = LIMITS.globalDay - payload.tables.lumi_usage.length;
        for (let i = 0; i < remaining; i++)
          await new CloudLumiLedger(connection()).reserve(
            "rotating-cookie-" + i,
            make("global-budget-" + i),
            now + 3600000 + i * 61000,
          );
        await assert.rejects(
          new CloudLumiLedger(connection()).reserve(
            "another-new-cookie",
            make("global-over"),
            now + 10 * 3600000,
          ),
          /DAILY_LIMIT/,
        );
      },
    );
    await t.test(
      "birthday letters and edit revisions persist; public unauthenticated callers cannot read private letters",
      async () => {
        const repository = new CloudBirthdayRepository(connection()),
          draft = {
            date: "2026-10-28",
            recipientName: "",
            senderName: "",
            greeting: "İyi ki doğdun!",
            letter: "Yalnızca test için özel mektup.",
            showCountdown: true,
          };
        const saved = await repository.save({
          draft,
          expectedRevision: 0,
          newEvent: false,
        });
        assert.deepEqual(
          await new CloudBirthdayRepository(connection()).read(),
          saved,
        );
        const edits = await Promise.allSettled(
          ["Birinci taslak", "İkinci taslak"].map((letter) =>
            new CloudBirthdayRepository(connection()).save({
              draft: { ...draft, letter },
              expectedRevision: 1,
              newEvent: false,
            }),
          ),
        );
        assert.equal(edits.filter((x) => x.status === "fulfilled").length, 1);
        const repo = new CloudBirthdayRepository(connection()),
          server = new BirthdayServer(
            {
              dir: "/must-not-write",
              production: false,
              secret: "test-secret-at-least-32-characters",
              origin: "http://localhost:3000",
              creatorPassword: "test-creator-password",
              recipientPassword: "test-recipient-password",
            },
            () => now,
            { repository: repo, accessAttempt: (n) => repo.accessAttempt(n) },
          );
        const publicResult = await server.publicStatus(
          new Request("http://localhost:3000/api/birthday"),
        );
        const data = await publicResult.json();
        assert.equal(data.accessRequired, true);
        assert.ok(!JSON.stringify(data).includes("taslak"));
        assert.equal(
          (
            await server.creatorStatus(
              new Request("http://localhost:3000/api/birthday/creator"),
            )
          ).status,
          200,
        );
        const attempts = await Promise.allSettled(
          Array.from({ length: 9 }, () =>
            new CloudBirthdayRepository(connection()).accessAttempt(
              now + 1000000,
            ),
          ),
        );
        assert.equal(
          attempts.filter((x) => x.status === "fulfilled").length,
          8,
        );
        await assert.rejects(
          new CloudBirthdayRepository(connection()).accessAttempt(
            now + 1000001,
          ),
          /RATE_LIMIT/,
        );
      },
    );
    await t.test(
      "uninitialized cloud state and unavailable storage fail closed without replacing local data",
      async () => {
        const absent: StateStore = {
          read: async () => ({ revision: 0, payload: null }),
          cas: async () => {
            throw Error("must not write");
          },
        };
        await assert.rejects(
          new CloudLumiLedger(absent).reserve("owner", make("absent"), now),
          /STORAGE_UNAVAILABLE/,
        );
        await assert.rejects(new CloudBirthdayRepository(absent).read());
      },
    );
    const user = async (id: string) => {
      await db.exec("reset role;set role authenticated");
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
        id,
      ]);
    };
    const save = async (revision: number, op: string, payload: unknown) =>
      db.query<{
        revision: number;
        payload: { modules: { garden: { coins: number } } };
      }>("select (r).* from public.save_learning_snapshot($1,$2,$3::jsonb) r", [
        revision,
        op,
        JSON.stringify(payload),
      ]);
    await t.test(
      "daily gift + inventory save is atomic, idempotent and cannot be replayed after restoring an older snapshot",
      async () => {
        await user(A);
        const base = {
          version: 1,
          modules: { garden: createStarter(now - 1) },
        };
        await save(0, randomUUID(), base);
        const gift = claimGift(base.modules.garden, now, 0);
        assert.ok(gift.claim);
        const payload = { version: 1, modules: { garden: gift.state } },
          op = randomUUID();
        const row = await save(1, op, payload);
        assert.equal(row.rows[0].payload.modules.garden.coins, 40);
        assert.equal(Number((await save(1, op, payload)).rows[0].revision), 2);
        await assert.rejects(save(1, randomUUID(), payload), /SYNC_CONFLICT/);
        await save(2, randomUUID(), base);
        await assert.rejects(
          save(3, randomUUID(), payload),
          /REWARD_ALREADY_CLAIMED/,
        );
        const current = await db.query<{
          revision: number;
          payload: typeof base;
        }>("select revision,payload from public.user_progress");
        assert.equal(Number(current.rows[0].revision), 3);
        assert.equal(current.rows[0].payload.modules.garden.coins, 30);
        assert.equal(
          (await db.query("select * from public.dg_permanent_claims")).rows
            .length,
          1,
        );
        await user(B);
        assert.equal(
          (await db.query("select * from public.dg_permanent_claims")).rows
            .length,
          0,
        );
        assert.equal(
          (await db.query("select * from public.user_progress")).rows.length,
          0,
        );
      },
    );
    await t.test(
      "anonymous and authenticated clients cannot inspect or modify server counters or workshop data",
      async () => {
        for (const role of ["anon", "authenticated"]) {
          await db.exec("reset role;set role " + role);
          await assert.rejects(
            db.query("select * from public.dg_server_state"),
            /permission denied/,
          );
          await assert.rejects(
            db.query(
              "select public.dg_server_state_read('birthday-config-v1')",
            ),
            /permission denied/,
          );
          await assert.rejects(
            db.query(
              "select public.dg_server_state_cas('lumi-ledger-v1',0,'{}', $1)",
              [randomUUID()],
            ),
            /permission denied/,
          );
        }
      },
    );
  } finally {
    await db.close();
  }
});
