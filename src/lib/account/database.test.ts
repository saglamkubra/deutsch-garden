import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { createStarter } from "../garden/model.ts";
const A = "11111111-1111-4111-8111-111111111111",
  B = "22222222-2222-4222-8222-222222222222";
test("All migrations: RLS, account isolation, atomic CAS, import idempotence, archives and privacy", async (t) => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth,public to anon,authenticated,service_role; grant execute on function auth.uid() to anon,authenticated,service_role;`,
    );
    for (const f of (await readdir("supabase/migrations"))
      .filter((f) => f.endsWith(".sql"))
      .sort())
      await db.exec(await readFile("supabase/migrations/" + f, "utf8"));
    await db.query("insert into auth.users(id) values($1),($2)", [A, B]);
    await db.exec(
      "insert into public.learning_levels(code,world_name,description,position) values('A1','a','a',1)",
    );
    const asUser = async (id: string) => {
      await db.exec("reset role; set role authenticated");
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
        id,
      ]);
    };
    const payload = {
      version: 1,
      modules: {
        garden: createStarter(1),
        lumi: {
          conversations: [{ id: "private", messages: ["secret"] }],
          active: "private",
        },
      },
    };
    const save = async (
      expected: number,
      operation: string,
      p: unknown,
      hash: string | null = null,
      archive = false,
    ) =>
      db.query<{ revision: number; payload: typeof payload }>(
        "select (r).* from public.save_learning_snapshot($1,$2,$3::jsonb,$4,$5) r",
        [expected, operation, JSON.stringify(p), hash, archive],
      );
    const op1 = crypto.randomUUID(),
      op2 = crypto.randomUUID(),
      hash = "a".repeat(64);
    await asUser(A);
    await t.test(
      "authenticated save is one atomic document and repeat UUID does not add currency",
      async () => {
        const first = await save(0, op1, payload, hash);
        assert.equal(Number(first.rows[0].revision), 1);
        const again = await save(0, op1, payload, hash);
        assert.equal(Number(again.rows[0].revision), 1);
        assert.equal(again.rows[0].payload.modules.garden.coins, 30);
        await assert.rejects(
          save(1, crypto.randomUUID(), payload, hash),
          /ALREADY_IMPORTED/,
        );
        await assert.rejects(
          save(0, crypto.randomUUID(), payload),
          /SYNC_CONFLICT/,
        );
        await assert.rejects(
          save(1, op1, { ...payload, version: 2 }, hash),
          /INVALID_PAYLOAD/,
        );
      },
    );
    await t.test(
      "stale devices cannot overwrite inventory and explicit replacement archives the previous document",
      async () => {
        const next = structuredClone(payload);
        next.modules.garden.coins = 29;
        await save(1, op2, next, null, true);
        const archives = await db.query<{ payload: typeof payload }>(
          "select payload from public.progress_archives",
        );
        assert.equal(archives.rows.length, 1);
        assert.equal(archives.rows[0].payload.modules.garden.coins, 30);
        await assert.rejects(
          save(1, crypto.randomUUID(), payload),
          /SYNC_CONFLICT/,
        );
        await assert.rejects(
          db.exec(`update public.user_progress set revision=99`),
          /permission denied/,
        );
      },
    );
    await t.test(
      "another user sees no profile, conversations, inventory, receipts, archive or diary",
      async () => {
        await db.query(
          "insert into public.diary_entries(user_id,content) values($1,'private diary')",
          [A],
        );
        await asUser(B);
        for (const table of [
          "user_progress",
          "learning_user_settings",
          "progress_archives",
          "progress_sync_receipts",
          "diary_entries",
          "garden_accounts",
          "ai_conversation_history",
          "cloud_learning_modules",
        ])
          assert.equal(
            (await db.query(`select * from public.${table}`)).rows.length,
            0,
            table,
          );
        await assert.rejects(
          db.query(
            "insert into public.diary_entries(user_id,content) values($1,'forged')",
            [A],
          ),
          /row-level security/,
        );
        await db.query("delete from public.diary_entries where user_id=$1", [
          A,
        ]);
        await asUser(A);
        assert.equal(
          (await db.query("select * from public.diary_entries")).rows.length,
          1,
        );
      },
    );
    await t.test(
      "privacy redacts history and archived copies but keeps rewards and coins",
      async () => {
        await db.query(
          "select public.delete_private_learning_data('conversations')",
        );
        assert.equal(
          (await db.query("select * from public.ai_conversation_history")).rows
            .length,
          0,
        );
        const a = await db.query<{ payload: typeof payload }>(
          "select payload from public.progress_archives",
        );
        assert.deepEqual(a.rows[0].payload.modules.lumi.conversations, []);
        const g = await db.query<{ coins: number }>(
          "select coins from public.garden_accounts",
        );
        assert.equal(g.rows[0].coins, 29);
        await assert.rejects(
          save(3, crypto.randomUUID(), payload),
          /PRIVACY_CONFLICT/,
        );
        await db.query("select public.delete_private_learning_data('diary')");
        assert.equal(
          (await db.query("select * from public.diary_entries")).rows.length,
          0,
        );
      },
    );
    await t.test(
      "anonymous access to private tables and mutation RPCs is denied",
      async () => {
        await db.exec("reset role; set role anon");
        await assert.rejects(
          db.query("select * from public.user_progress"),
          /permission denied/,
        );
        await assert.rejects(
          save(0, crypto.randomUUID(), payload),
          /permission denied/,
        );
        await assert.rejects(
          db.query("select * from public.ai_conversation_history"),
          /permission denied/,
        );
      },
    );
    await t.test(
      "account deletion cascades through progress and archives",
      async () => {
        await db.exec("reset role");
        await db.query("delete from auth.users where id=$1", [A]);
        for (const table of [
          "user_progress",
          "learning_user_settings",
          "progress_sync_receipts",
          "progress_archives",
          "diary_entries",
        ])
          assert.equal(
            (
              await db.query(`select * from public.${table} where user_id=$1`, [
                A,
              ])
            ).rows.length,
            0,
          );
      },
    );
  } finally {
    await db.close();
  }
});
