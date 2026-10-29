import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { createStarter, grantReward } from "../garden/model.ts";
import { initialLearning, localDate } from "../learning/engine.ts";
import { initialExercises } from "../exercises/types.ts";
import { badgeReward, reconcile } from "./model.ts";
test("Cloud snapshot RPC validates XP evidence, permanent achievement receipts, auth and rollback", async (t) => {
  const db = new PGlite(),
    user = "44444444-4444-4444-8444-444444444444",
    other = "55555555-5555-4555-8555-555555555555";
  try {
    await db.exec(
      "create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth,public to anon,authenticated,service_role;",
    );
    for (const f of (await readdir("supabase/migrations"))
      .filter((f) => f.endsWith(".sql"))
      .sort())
      await db.exec(await readFile("supabase/migrations/" + f, "utf8"));
    await db.query("insert into auth.users(id) values($1),($2)", [user, other]);
    await db.exec(
      "insert into public.learning_levels(code,world_name,description,position) values('A1','a','a',1)",
    );
    await db.exec("set role authenticated");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
      user,
    ]);
    const now = Date.now(),
      day = localDate(),
      learning = initialLearning();
    learning.progress.word = {
      introducedOn: day,
      dueOn: day,
      known: true,
      streak: 1,
      lastAnsweredOn: day,
      responses: 1,
    };
    learning.assignments[day + ":A1"] = {
      id: day + ":A1",
      date: day,
      level: "A1",
      goal: 5,
      newIds: ["word"],
      reviewIds: [],
      answers: { word: "known" },
    };
    const garden = createStarter(now),
      exercises = reconcile(
        { learning, garden, exercises: initialExercises() },
        {
          words: 1,
          exercise: false,
          listening: false,
          grammar: false,
          story: false,
        },
        now,
      );
    exercises.gamification!.badges["first-vocabulary"].claimed = true;
    const payload = {
      version: 1,
      modules: {
        learning,
        garden: grantReward(garden, badgeReward("first-vocabulary")!),
        exercises,
      },
    };
    const save = (revision: number, op: string, p: unknown) =>
      db.query<{ revision: number; payload: typeof payload }>(
        "select (r).* from public.save_learning_snapshot($1,$2,$3::jsonb) r",
        [revision, op, JSON.stringify(p)],
      );
    const operation = crypto.randomUUID();
    await t.test(
      "verified evidence saves vocabulary XP and a single garden receipt",
      async () => {
        assert.equal(
          (
            await db.query<{ v: number }>(
              "select public.gamification_rules_version() as v",
            )
          ).rows[0].v,
          14,
        );
        assert.equal(
          Number((await save(0, operation, payload)).rows[0].revision),
          1,
        );
        assert.equal(
          Number((await save(0, operation, payload)).rows[0].revision),
          1,
        );
        assert.equal(
          (await db.query("select * from public.learning_reward_receipts")).rows
            .length,
          1,
        );
        await save(1, crypto.randomUUID(), payload);
      },
    );
    await t.test(
      "unsupported or forged badges fail atomically without balance changes",
      async () => {
        const forged = structuredClone(payload);
        forged.modules.exercises.gamification!.badges["first-perfect"] = {
          earnedOn: day,
          claimed: true,
        };
        await assert.rejects(
          save(2, crypto.randomUUID(), forged),
          /INVALID_ACHIEVEMENT/,
        );
        const bypass = structuredClone(payload);
        delete bypass.modules.exercises.gamification;
        bypass.modules.garden.appliedRewards.push("achievement:made-up");
        await assert.rejects(
          save(2, crypto.randomUUID(), bypass),
          /INVALID_ACHIEVEMENT/,
        );
        assert.equal(
          (await db.query("select * from public.learning_reward_receipts")).rows
            .length,
          1,
        );
      },
    );
    await t.test(
      "XP without learning evidence and excessive daily receipts are rejected",
      async () => {
        const forged = structuredClone(payload);
        forged.modules.exercises.xp[`vocabulary:${day}:never-practiced`] = 5;
        await assert.rejects(
          save(2, crypto.randomUUID(), forged),
          /INVALID_XP_EVIDENCE/,
        );
        const excess = structuredClone(payload);
        for (let i = 0; i < 21; i++) {
          const id = "w" + i;
          excess.modules.learning.progress[id] = { ...learning.progress.word };
          excess.modules.exercises.xp[`vocabulary:${day}:${id}`] = 5;
        }
        await assert.rejects(
          save(2, crypto.randomUUID(), excess),
          /DAILY_XP_LIMIT/,
        );
      },
    );
    await t.test(
      "a snapshot reset cannot reissue a permanent achievement receipt",
      async () => {
        const reset = structuredClone(payload);
        reset.modules.garden.appliedRewards =
          reset.modules.garden.appliedRewards.filter(
            (id) => !id.startsWith("achievement:"),
          );
        reset.modules.garden.seeds.daisy -= 2;
        reset.modules.exercises.gamification!.badges[
          "first-vocabulary"
        ].claimed = false;
        await save(2, crypto.randomUUID(), reset);
        await assert.rejects(
          save(3, crypto.randomUUID(), payload),
          /ACHIEVEMENT_ALREADY_CLAIMED/,
        );
        const row = await db.query<{ payload: typeof payload }>(
          "select payload from public.user_progress",
        );
        assert.equal(
          row.rows[0].payload.modules.garden.seeds.daisy,
          garden.seeds.daisy,
        );
      },
    );
    await t.test(
      "other users and anonymous clients cannot access or mint reward receipts",
      async () => {
        await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
          other,
        ]);
        assert.equal(
          (await db.query("select * from public.learning_reward_receipts")).rows
            .length,
          0,
        );
        await assert.rejects(
          db.query(
            "select public.validate_gamification_snapshot($1,$2::jsonb,$3::jsonb)",
            [user, JSON.stringify(payload), JSON.stringify(payload)],
          ),
          /permission denied/,
        );
        await assert.rejects(
          db.query(
            "insert into public.learning_reward_receipts(user_id,id,kind,amount) values($1,'x','seed',1)",
            [other],
          ),
          /permission denied/,
        );
        await db.exec("reset role;set role anon");
        await assert.rejects(
          db.query("select public.gamification_rules_version()"),
          /permission denied/,
        );
      },
    );
  } finally {
    await db.close();
  }
});
