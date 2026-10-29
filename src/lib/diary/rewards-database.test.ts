import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("diary and push migrations enforce ownership, daily idempotency and privileged delivery", async () => {
  const db = new PGlite(),
    u = "11111111-1111-4111-8111-111111111111",
    other = "22222222-2222-4222-8222-222222222222",
    entry = "33333333-3333-4333-8333-333333333333";
  try {
    await db.exec(
      "create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth,public to anon,authenticated,service_role;",
    );
    for (const f of (await readdir("supabase/migrations"))
      .filter((f) => f.endsWith(".sql"))
      .sort())
      await db.exec(await readFile("supabase/migrations/" + f, "utf8"));
    await db.query("insert into auth.users values($1),($2)", [u, other]);
    await db.query(
      "insert into public.diary_entries(id,user_id,content) values($1,$2,$3)",
      [
        entry,
        u,
        "Heute habe ich mit meiner Schwester im Garten gearbeitet und danach zusammen mit meiner Familie gekocht und ein interessantes deutsches Buch gelesen.",
      ],
    );
    await db.exec("set role authenticated");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
      other,
    ]);
    await assert.rejects(
      db.query("select public.claim_diary_practice($1)", [entry]),
      /DIARY_NOT_FOUND/,
    );
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [u]);
    const first = await db.query("select public.claim_diary_practice($1) id", [
      entry,
    ]);
    assert.deepEqual(
      (await db.query("select public.claim_diary_practice($1) id", [entry]))
        .rows,
      first.rows,
    );
    assert.equal(
      (await db.query("select * from public.diary_practice_claims")).rows
        .length,
      1,
    );
    await assert.rejects(
      db.query(
        "insert into public.diary_practice_claims(user_id,day) values($1,current_date)",
        [u],
      ),
      /permission denied/,
    );
    const receipt = (first.rows[0] as { id: string }).id,
      payload = {
        version: 1,
        modules: { exercises: { xp: { [receipt]: 15 } } },
      };
    await db.query("select public.save_learning_snapshot(0,$1,$2::jsonb)", [
      crypto.randomUUID(),
      JSON.stringify(payload),
    ]);
    const forged = structuredClone(payload);
    forged.modules.exercises.xp["diary:day:2000-01-01"] = 15;
    await assert.rejects(
      db.query("select public.save_learning_snapshot(1,$1,$2::jsonb)", [
        crypto.randomUUID(),
        JSON.stringify(forged),
      ]),
      /INVALID_XP_EVIDENCE/,
    );
    await db.query(
      "insert into public.push_subscriptions(user_id,endpoint,p256dh,auth) values($1,'https://fcm.googleapis.com/test','test','test')",
      [u],
    );
    await assert.rejects(
      db.exec("update public.push_subscriptions set last_day=null"),
      /permission denied/,
    );
    await assert.rejects(
      db.exec("select public.claim_push_batch()"),
      /permission denied/,
    );
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
      other,
    ]);
    assert.equal(
      (await db.query("select * from public.push_subscriptions")).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select * from public.diary_practice_claims")).rows
        .length,
      0,
    );
    await db.exec("reset role;set role service_role");
    assert.equal(
      (await db.query("select * from public.claim_push_batch()")).rows.length,
      1,
    );
    assert.equal(
      (await db.query("select * from public.claim_push_batch()")).rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});
