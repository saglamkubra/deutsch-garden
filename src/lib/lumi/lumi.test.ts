import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, unlinkSync, rmdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { LumiService, type LumiConfig } from "./service.ts";
import {
  callTutor,
  ProviderFailure,
  tutorInstructions,
  validateTutorReply,
} from "./provider.ts";
import { setupResponse } from "./runtime.ts";
import { LumiLedger, dayStamp } from "./ledger.ts";
import {
  validRequest,
  validReply,
  validResult,
  MODES,
  LIMITS,
} from "./protocol.ts";
import type {
  TutorRequest,
  TutorReply,
  Line,
  TutorResult,
} from "./protocol.ts";
import {
  initialLumi,
  newChat,
  queueMessage,
  requestFor,
  receiveReply,
  removeChat,
  saveTutorWord,
} from "./model.ts";
import { createLumiPersistence, validLumi, LUMI_KEY } from "./persistence.ts";
import {
  recognizedText,
  recognitionError,
  recognitionConstructor,
} from "./voice.ts";
import { createStarter, grantReward } from "../garden/model.ts";
import { validState as validExercises } from "../exercises/persistence.ts";
import { initialExercises } from "../exercises/types.ts";
const fixture: TutorReply = {
  message: "Hallo! Was machst du heute?",
  encouragementTr: "Bir cümleyle başlamak güzel bir adım.",
  corrections: [],
  vocabulary: [
    {
      german: "Blume",
      article: "die",
      meaningTr: "çiçek",
      exampleDe: "Die Blume ist schön.",
      exampleTr: "Çiçek güzel.",
    },
  ],
};
const config: LumiConfig = {
  key: "fake-test-key-not-real",
  model: "test-structured-model",
  secret: "test-secret-that-is-at-least-32-characters",
  password: "",
  origin: "",
  production: false,
};
let serial = 0;
const request = (
  messages: Line[],
  id = "conversation-test-0001",
  action: TutorRequest["action"] = "message",
): TutorRequest => ({
  conversationId: id,
  requestId: "request-test-" + ++serial,
  action,
  level: "A1",
  mode: "daily",
  correction: "gentle",
  messages,
});
async function harness(overrides: Partial<LumiConfig> = {}, file = ":memory:") {
  let time = Date.UTC(2026, 9, 27, 10),
    calls = 0,
    reply: unknown = fixture,
    status = 200;
  const bodies: Record<string, unknown>[] = [];
  const fetcher: typeof fetch = async (_url, init) => {
    calls++;
    bodies.push(JSON.parse(String(init?.body)));
    if (status !== 200)
      return Response.json(
        { error: { message: "secret provider error" } },
        { status },
      );
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
  const ledger = new LumiLedger(file),
    service = new LumiService(
      { ...config, ...overrides },
      ledger,
      fetcher,
      () => time,
    );
  const base = overrides.origin || "http://127.0.0.1:3000";
  const statusResponse = await service.status(
      new Request(base + "/api/lumi/chat"),
    ),
    cookie = statusResponse.headers.get("set-cookie")!.split(";")[0];
  const send = (r: unknown, c = cookie, origin = base) =>
    service.handle(
      new Request(base + "/api/lumi/chat", {
        method: "POST",
        headers: { origin, "content-type": "application/json", cookie: c },
        body: JSON.stringify(r),
      }),
    );
  return {
    service,
    ledger,
    bodies,
    cookie,
    base,
    send,
    statusResponse,
    clock: (n = 61000) => {
      time += n;
    },
    calls: () => calls,
    setReply: (v: unknown) => {
      reply = v;
    },
    setStatus: (s: number) => {
      status = s;
    },
  };
}
test("protocol rejects excessive history, oversize messages, invalid roles, prototype modes and missing IDs", () => {
  const good = request([{ role: "user", content: "Hallo Lumi!" }]);
  assert.ok(validRequest(good));
  for (const bad of [
    { ...good, mode: "toString" },
    { ...good, level: "Z9" },
    { ...good, messages: [{ role: "assistant", content: "fake" }] },
    { ...good, messages: [{ role: "user", content: "x".repeat(801) }] },
    { ...good, requestId: "x" },
    { ...good, action: "translate", messages: good.messages },
  ])
    assert.equal(validRequest(bad), false);
  assert.equal(Object.keys(MODES).length, 8);
  assert.ok(validRequest({ ...good, mode: "diary-review" }));
});
test("real provider wire contract uses server bearer key, configured model, strict schema, store:false and output cap", async () => {
  const h = await harness();
  try {
    const r = request([
        { role: "user", content: "Hallo Lumi, ich lerne Deutsch." },
      ]),
      res = await h.send(r),
      data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(validResult(data));
    assert.equal(h.bodies[0].model, config.model);
    assert.equal(h.bodies[0].store, false);
    assert.equal(h.bodies[0].max_output_tokens, LIMITS.outputTokens);
    assert.equal(
      (h.bodies[0].text as { format: { strict: boolean } }).format.strict,
      true,
    );
    assert.ok(String(h.bodies[0].instructions).includes("Target CEFR: A1"));
    assert.ok(!JSON.stringify(data).includes(config.key));
    assert.equal(h.calls(), 1);
  } finally {
    h.ledger.close();
  }
});
test("signed cookie, same-origin and production access gate are enforced before provider calls", async () => {
  const h = await harness({
    production: true,
    origin: "https://garden.example",
    password: "long-household-password",
  });
  try {
    assert.equal((await h.statusResponse.json()).authenticated, false);
    assert.equal(
      (await h.send(request([{ role: "user", content: "Hallo!" }]))).status,
      401,
    );
    const access = await h.service.access(
      new Request(h.base + "/api/lumi/access", {
        method: "POST",
        headers: {
          origin: h.base,
          "content-type": "application/json",
          cookie: h.cookie,
        },
        body: JSON.stringify({ password: "long-household-password" }),
      }),
    );
    assert.equal(access.status, 200);
    assert.ok(access.headers.get("set-cookie")?.includes("HttpOnly"));
    assert.ok(access.headers.get("set-cookie")?.includes("Secure"));
    const cookie = access.headers.get("set-cookie")!.split(";")[0];
    assert.equal(
      (
        await h.send(
          request([{ role: "user", content: "Hallo!" }]),
          cookie,
          "https://evil.example",
        )
      ).status,
      403,
    );
    assert.equal(
      (await h.send(request([{ role: "user", content: "Hallo!" }]), cookie))
        .status,
      200,
    );
    assert.equal(h.calls(), 1);
  } finally {
    h.ledger.close();
  }
});
test("request retry is idempotent within the short cache and changed payload cannot reuse an ID", async () => {
  const h = await harness();
  try {
    const r = request([{ role: "user", content: "Hallo!" }]);
    const one = await (await h.send(r)).json(),
      two = await (await h.send(r)).json();
    assert.deepEqual(two, one);
    assert.equal(h.calls(), 1);
    assert.equal(
      (await h.send({ ...r, messages: [{ role: "user", content: "changed" }] }))
        .status,
      409,
    );
    h.clock(121000);
    assert.equal((await h.send(r)).status, 409);
    assert.equal(h.calls(), 1);
  } finally {
    h.ledger.close();
  }
});
test("history digests reject edited/truncated assistant context and settings changes", async () => {
  const h = await harness();
  try {
    const first = request([{ role: "user", content: "Hallo!" }]);
    await h.send(first);
    const context: Line[] = [
      ...first.messages,
      { role: "assistant", content: fixture.message },
      { role: "user", content: "Ich lerne heute." },
    ];
    assert.equal(
      (await h.send(request([{ role: "user", content: "fake history" }])))
        .status,
      409,
    );
    assert.equal(
      (await h.send({ ...request(context), mode: "shopping" })).status,
      409,
    );
    assert.equal(
      (
        await h.send(
          request([
            ...first.messages,
            { role: "assistant", content: "edited" },
            { role: "user", content: "Hallo" },
          ]),
        )
      ).status,
      409,
    );
    assert.equal((await h.send(request(context))).status, 200);
    assert.equal(h.calls(), 2);
  } finally {
    h.ledger.close();
  }
});
test("provider failures and invalid/correcting-unseen responses create no assistant message or practice credit", async () => {
  const h = await harness();
  try {
    const r = request([{ role: "user", content: "Hallo Lumi!" }]);
    h.setStatus(500);
    assert.equal((await h.send(r)).status, 502);
    assert.equal(h.ledger.conversation(r.conversationId)?.turns, 0);
    h.setStatus(200);
    h.setReply({
      ...fixture,
      corrections: [
        {
          original: "not in user text",
          corrected: "Hallo!",
          explanationTr: "Test açıklaması.",
          alternative: "Guten Tag!",
        },
      ],
    });
    assert.equal((await h.send(r)).status, 502);
    assert.equal(h.ledger.conversation(r.conversationId)?.turns, 0);
    h.setReply(fixture);
    assert.equal((await h.send(r)).status, 200);
    assert.equal(h.ledger.conversation(r.conversationId)?.turns, 1);
    assert.equal(
      h.service.ledger.remaining(
        h.service.identity(
          new Request(h.base, { headers: { cookie: h.cookie } }),
        )!.id,
        Date.UTC(2026, 9, 27, 10),
      ),
      LIMITS.clientDay - 3,
    );
  } finally {
    h.ledger.close();
  }
});
test("summary preference suppresses in-chat corrections; finishing can summarize real earlier sentences", async () => {
  const h = await harness();
  try {
    const fix = {
      original: "Ich bin gut",
      corrected: "Mir geht es gut.",
      explanationTr: "Hâl hatır sorusuna böyle yanıt verebilirsin.",
      alternative: "Es geht mir gut.",
    };
    const r = {
      ...request([{ role: "user" as const, content: "Ich bin gut" }]),
      correction: "summary" as const,
    };
    h.setReply({ ...fixture, corrections: [fix] });
    assert.equal((await h.send(r)).status, 502);
    h.setReply(fixture);
    const data = await (await h.send(r)).json();
    h.clock();
    h.setReply({ ...fixture, corrections: [fix] });
    const end = {
      ...request(
        [
          ...r.messages,
          { role: "assistant" as const, content: data.reply.message },
        ],
        r.conversationId,
        "finish",
      ),
      correction: "summary" as const,
    };
    const res = await h.send(end);
    assert.equal(res.status, 200);
    assert.equal(
      (await res.json()).reply.corrections[0].original,
      fix.original,
    );
  } finally {
    h.ledger.close();
  }
});
test("word lookup is separate untrusted input, consumes usage and never increases practice turns", async () => {
  const h = await harness();
  try {
    const r = request([{ role: "user", content: "Hallo!" }]);
    await h.send(r);
    const lookup = {
      ...request(
        [
          ...r.messages,
          { role: "assistant" as const, content: fixture.message },
        ],
        r.conversationId,
        "translate",
      ),
      word: "Blume",
    };
    assert.equal((await h.send(lookup)).status, 200);
    assert.equal(h.ledger.conversation(r.conversationId)?.turns, 1);
    assert.equal(h.calls(), 2);
    assert.ok(!String(h.bodies[1].instructions).includes("Requested lookup:"));
    assert.ok(JSON.stringify(h.bodies[1].input).includes("Blume"));
  } finally {
    h.ledger.close();
  }
});
test("per-minute limits cap retries and successful requests, login attempts are bounded", async () => {
  const h = await harness({ password: "correct-access-password" });
  try {
    for (let i = 0; i < 8; i++) {
      const response = await h.service.access(
        new Request(h.base + "/api/lumi/access", {
          method: "POST",
          headers: {
            origin: h.base,
            "content-type": "application/json",
            cookie: h.cookie,
          },
          body: JSON.stringify({ password: "wrong" }),
        }),
      );
      assert.equal(response.status, 401);
    }
    assert.equal(
      (
        await h.service.access(
          new Request(h.base + "/api/lumi/access", {
            method: "POST",
            headers: { origin: h.base, "content-type": "application/json" },
            body: JSON.stringify({ password: "wrong" }),
          }),
        )
      ).status,
      429,
    );
  } finally {
    h.ledger.close();
  }
  const g = await harness();
  try {
    for (let i = 0; i < 3; i++)
      assert.equal(
        (
          await g.send(
            request(
              [{ role: "user", content: "Hallo!" }],
              "conversation-rate-" + i,
            ),
          )
        ).status,
        200,
      );
    const limited = await g.send(
      request([{ role: "user", content: "Hallo!" }], "conversation-rate-last"),
    );
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get("Retry-After"), "60");
    assert.equal(g.calls(), 3);
  } finally {
    g.ledger.close();
  }
});
test("daily global budget cannot be bypassed by changing anonymous cookies", async () => {
  const h = await harness();
  try {
    for (let owner = 0; owner < 2; owner++) {
      const status = await h.service.status(
          new Request(h.base + "/api/lumi/chat"),
        ),
        cookie = status.headers.get("set-cookie")!.split(";")[0];
      for (
        let i = 0;
        i <
        Math.min(LIMITS.clientDay, LIMITS.globalDay - owner * LIMITS.clientDay);
        i++
      ) {
        h.clock();
        assert.equal(
          (
            await h.send(
              request(
                [{ role: "user", content: "Hallo!" }],
                `conversation-budget-${owner}-${i}`,
              ),
              cookie,
            )
          ).status,
          200,
        );
      }
      assert.equal(
        (
          await h.send(
            request(
              [{ role: "user", content: "Hallo!" }],
              `conversation-budget-over-${owner}`,
            ),
            cookie,
          )
        ).status,
        429,
      );
    }
    const third = (
      await h.service.status(new Request(h.base + "/api/lumi/chat"))
    ).headers
      .get("set-cookie")!
      .split(";")[0];
    assert.equal(
      (
        await h.send(
          request(
            [{ role: "user", content: "Hallo!" }],
            "conversation-budget-third",
          ),
          third,
        )
      ).status,
      429,
    );
    assert.equal(h.calls(), LIMITS.globalDay);
  } finally {
    h.ledger.close();
  }
});
test("four real exchanges plus chars/time qualify; one daily signed reward survives replay and chat deletion", async () => {
  const h = await harness();
  try {
    let receipt: unknown;
    for (let session = 0; session < 2; session++) {
      const id = "conversation-qualified-" + session;
      let messages: Line[] = [];
      for (let i = 0; i < 4; i++) {
        h.clock();
        messages = [
          ...messages,
          { role: "user", content: "Ich lerne heute gern Deutsch. Runde " + i },
        ];
        const res = await h.send(request(messages, id));
        assert.equal(res.status, 200);
        messages = [
          ...messages,
          { role: "assistant", content: fixture.message },
        ];
      }
      h.clock();
      const finish = request(messages, id, "finish"),
        res = await h.send(finish),
        data = await res.json();
      assert.equal(data.completion.qualified, true);
      if (session === 0) {
        receipt = data.completion.receipt;
        assert.ok(receipt);
        assert.deepEqual(
          (await (await h.send(finish)).json()).completion.receipt,
          receipt,
        );
      } else assert.equal(data.completion.receipt, null);
    }
    const verify = () =>
      h.service.reward(
        new Request(h.base + "/api/lumi/reward", {
          method: "POST",
          headers: {
            origin: h.base,
            "content-type": "application/json",
            cookie: h.cookie,
          },
          body: JSON.stringify(receipt),
        }),
      );
    assert.equal((await verify()).status, 200);
    const removed = await h.service.remove(
      new Request(h.base + "/api/lumi/chat", {
        method: "DELETE",
        headers: {
          origin: h.base,
          "content-type": "application/json",
          cookie: h.cookie,
        },
        body: JSON.stringify({ conversationId: "conversation-qualified-0" }),
      }),
    );
    assert.equal(removed.status, 200);
    assert.equal((await verify()).status, 200);
    const forged = await h.service.reward(
      new Request(h.base + "/api/lumi/reward", {
        method: "POST",
        headers: {
          origin: h.base,
          "content-type": "application/json",
          cookie: h.cookie,
        },
        body: JSON.stringify({
          ...(receipt as object),
          signature: "0".repeat(64),
        }),
      }),
    );
    assert.equal(forged.status, 403);
  } finally {
    h.ledger.close();
  }
});
test("short practice closes without invented completion or rewards", async () => {
  const h = await harness();
  try {
    const messages: Line[] = [{ role: "user", content: "Hallo!" }];
    await h.send(request(messages));
    const data = await (
      await h.send(
        request(
          [...messages, { role: "assistant", content: fixture.message }],
          "conversation-test-0001",
          "finish",
        ),
      )
    ).json();
    assert.equal(data.completion.qualified, false);
    assert.equal(data.completion.receipt, null);
  } finally {
    h.ledger.close();
  }
});
test("persistent SQLite usage survives restart, and no transcript text is stored in tables", async () => {
  const dir = mkdtempSync(join(tmpdir(), "dg-lumi-test-")),
    file = join(dir, "usage.sqlite");
  try {
    const h = await harness({}, file);
    const id = "conversation-persistent",
      text = "A private sentence that must not be stored in SQLite.";
    await h.send(request([{ role: "user", content: text }], id));
    const owner = h.service.identity(
      new Request(h.base, { headers: { cookie: h.cookie } }),
    )!.id;
    h.ledger.close();
    const next = new LumiLedger(file);
    try {
      assert.equal(
        next.remaining(owner, Date.UTC(2026, 9, 27, 10)),
        LIMITS.clientDay - 1,
      );
      const rows = next.db.prepare("SELECT * FROM lumi_conversations").all();
      assert.ok(!JSON.stringify(rows).includes(text));
      assert.ok(
        !JSON.stringify(
          next.db.prepare("SELECT * FROM lumi_calls").all(),
        ).includes(text),
      );
    } finally {
      next.close();
    }
  } finally {
    assert.ok(resolve(dir).startsWith(resolve(tmpdir())));
    for (const name of readdirSync(dir)) unlinkSync(join(dir, name));
    rmdirSync(dir);
  }
});
test("local pending/history/corrections restore, deletion purges text backups but preserves earned progress", () => {
  let s = newChat(
    initialLumi(),
    "conversation-local",
    "A1",
    "daily",
    "gentle",
    1,
  );
  s = { ...s, consent: true };
  s = queueMessage(
    s,
    "conversation-local",
    "request-local",
    "message",
    "Hallo Lumi!",
    2,
  );
  const req = requestFor(s.conversations[0]);
  assert.equal(req?.messages[0].content, "Hallo Lumi!");
  const result: TutorResult = {
    requestId: "request-local",
    reply: fixture,
    completion: null,
    remaining: 19,
  };
  s = receiveReply(s, "conversation-local", result, 3);
  assert.ok(validLumi(s));
  const storage = new Map<string, string>(),
    p = createLumiPersistence(() => ({
      getItem: (k) => storage.get(k) ?? null,
      setItem: (k, v) => {
        storage.set(k, v);
      },
      removeItem: (k) => {
        storage.delete(k);
      },
    }));
  p.save(s);
  assert.deepEqual(p.load().state, s);
  const removed = removeChat(
    { ...s, completed: ["completed-session"] },
    "conversation-local",
  );
  p.save(removed, true);
  assert.equal(removed.completed.length, 1);
  assert.ok(!storage.get(LUMI_KEY + ":backup")?.includes("Hallo Lumi!"));
  assert.equal(p.load().state.conversations.length, 0);
});
test("vocabulary deduplicates, local storage futures/corruption are protected and voice fallbacks do not score speech", () => {
  const word = fixture.vocabulary[0];
  let s = saveTutorWord(initialLumi(), word, "dg-a1-09-2");
  s = saveTutorWord(s, word, "dg-a1-09-2");
  assert.equal(s.words.length, 1);
  assert.ok(validLumi(s));
  const mem = new Map([[LUMI_KEY, '{"version":99}']]),
    p = createLumiPersistence(() => ({
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => {
        mem.set(k, v);
      },
      removeItem: (k) => {
        mem.delete(k);
      },
    }));
  assert.equal(p.load().readonly, true);
  assert.throws(() => p.save(s));
  mem.set(LUMI_KEY, "broken");
  p.load();
  assert.equal(mem.get(LUMI_KEY + ":corrupt"), "broken");
  assert.equal(recognitionConstructor(), null);
  assert.ok(recognitionError("not-allowed").includes("izin"));
  assert.deepEqual(
    recognizedText({
      resultIndex: 0,
      results: {
        length: 2,
        0: { isFinal: true, 0: { transcript: "Guten Tag" } },
        1: { isFinal: false, 0: { transcript: "ich" } },
      },
    }),
    { final: "Guten Tag", interim: "ich" },
  );
  assert.ok(!Object.hasOwn(fixture, "pronunciationScore"));
});
test("signed reward IDs reuse existing XP/garden receipts and Türkiye midnight uses server clock", () => {
  assert.equal(dayStamp(Date.UTC(2026, 9, 27, 21, 1)), "2026-10-28");
  assert.ok(
    validExercises({
      ...initialExercises(),
      xp: { "lumi:daily:2026-10-27": 15 },
    }),
  );
  let garden = createStarter(0);
  const coins = garden.coins;
  garden = grantReward(garden, {
    id: "lumi:daily:2026-10-27",
    source: "conversation",
    coins: 10,
  });
  garden = grantReward(garden, {
    id: "lumi:daily:2026-10-27",
    source: "conversation",
    coins: 10,
  });
  assert.equal(garden.coins, coins + 10);
  assert.ok(validReply(fixture));
});

test("provider refusal, incomplete/invalid JSON, timeout and quota errors are explicit; no fallback answer is invented", async () => {
  const r = request([{ role: "user", content: "Hallo Lumi!" }]);
  const cases: [typeof fetch, string][] = [
    [
      async () => {
        throw Error("fake-test-secret-must-not-leak");
      },
      "PROVIDER_UNAVAILABLE",
    ],
    [
      async () => Response.json({ error: "rate" }, { status: 429 }),
      "PROVIDER_LIMIT",
    ],
    [
      async () => Response.json({ status: "incomplete", output: [] }),
      "INCOMPLETE_RESPONSE",
    ],
    [
      async () =>
        Response.json({
          status: "completed",
          output: [
            { type: "message", content: [{ type: "refusal", refusal: "no" }] },
          ],
        }),
      "PROVIDER_REFUSAL",
    ],
    [
      async () =>
        Response.json({
          status: "completed",
          output: [
            {
              type: "message",
              content: [{ type: "output_text", text: "{broken" }],
            },
          ],
        }),
      "INVALID_PROVIDER_RESPONSE",
    ],
  ];
  for (const [fetcher, code] of cases)
    await assert.rejects(
      () =>
        callTutor(
          r,
          { key: "dummy", model: "test", outputTokens: 1200 },
          fetcher,
        ),
      (e) =>
        e instanceof ProviderFailure &&
        e.code === code &&
        !e.message.includes("must-not-leak"),
    );
  const setup = setupResponse();
  assert.equal(setup.status, 503);
  const body = await setup.json();
  assert.equal(body.configured, false);
  assert.equal(body.reply, undefined);
  assert.equal(body.completion, undefined);
});
test("oversize bodies never reach the provider and every CEFR/mode is passed to tutor instructions", async () => {
  const h = await harness();
  try {
    const res = await h.service.handle(
      new Request(h.base + "/api/lumi/chat", {
        method: "POST",
        headers: {
          origin: h.base,
          "content-type": "application/json",
          cookie: h.cookie,
        },
        body: JSON.stringify({ text: "x".repeat(50000) }),
      }),
    );
    assert.equal(res.status, 413);
    assert.equal(h.calls(), 0);
  } finally {
    h.ledger.close();
  }
  for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"] as const)
    for (const mode of Object.keys(MODES) as (keyof typeof MODES)[]) {
      const text = tutorInstructions({
        ...request([{ role: "user", content: "Hallo!" }]),
        level,
        mode,
      });
      assert.ok(text.includes("Target CEFR: " + level));
      assert.ok(text.includes(MODES[mode]));
    }
});

test("Next dev loopback normalization accepts only exact Host, port and browser Origin", async () => {
  const h = await harness({ origin: "http://127.0.0.1:3000" });
  try {
    const make = (
      host = "127.0.0.1:3000",
      origin = "http://127.0.0.1:3000",
      url = "http://localhost:3000/api/lumi/chat",
    ) =>
      new Request(url, {
        method: "POST",
        headers: {
          host,
          origin,
          cookie: h.cookie,
          "content-type": "application/json",
        },
        body: JSON.stringify(
          request([{ role: "user", content: "Hallo Lumi!" }]),
        ),
      });
    assert.equal(
      (
        await h.service.status(
          new Request("http://localhost:3000/api/lumi/chat", {
            headers: { host: "127.0.0.1:3000" },
          }),
        )
      ).status,
      200,
    );
    assert.equal((await h.service.handle(make())).status, 200);
    assert.equal((await h.service.handle(make("evil.example"))).status, 403);
    assert.equal(
      (await h.service.handle(make("127.0.0.1:3000", "https://evil.example")))
        .status,
      403,
    );
    assert.equal(
      (
        await h.service.handle(
          make(
            "127.0.0.1:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001/api/lumi/chat",
          ),
        )
      ).status,
      403,
    );
    assert.equal(h.calls(), 1);
  } finally {
    h.ledger.close();
  }
});
test("Development without configured origin supports exact loopback Host but rejects public hosts", async () => {
  const h = await harness();
  try {
    assert.equal(
      (
        await h.service.status(
          new Request("http://localhost:3000/api/lumi/chat", {
            headers: { host: "127.0.0.1:3000" },
          }),
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await h.service.status(
          new Request("http://localhost:3000/api/lumi/chat", {
            headers: { host: "evil.example" },
          }),
        )
      ).status,
      403,
    );
    h.service.config.production = true;
    h.service.config.origin = "http://127.0.0.1:3000";
    assert.equal(
      (
        await h.service.status(
          new Request("http://localhost:3000/api/lumi/chat", {
            headers: { host: "127.0.0.1:3000" },
          }),
        )
      ).status,
      403,
    );
  } finally {
    h.ledger.close();
  }
});

test("slow bounded Gemini requests keep their reservation; overlapping retries cannot start another billable call", () => {
  const ledger = new LumiLedger(":memory:");
  try {
    const now = Date.UTC(2026, 9, 28, 10);
    const first: TutorRequest = {
      action: "message",
      conversationId: "slow-gemini-chat",
      requestId: "slow-gemini-first",
      level: "A1",
      mode: "daily",
      correction: "gentle",
      messages: [{ role: "user", content: "Hallo!" }],
    };
    ledger.reserve("test-owner", first, now);
    assert.throws(
      () =>
        ledger.reserve(
          "test-owner",
          { ...first, requestId: "slow-gemini-second" },
          now + 40000,
        ),
      /BUSY/,
    );
    assert.equal(
      ledger.remaining("test-owner", now + 40000),
      LIMITS.clientDay - 1,
    );
    assert.equal(
      ledger.reserve(
        "test-owner",
        { ...first, requestId: "slow-gemini-recovery" },
        now + 120001,
      ).cached,
      false,
    );
  } finally {
    ledger.close();
  }
});

test("diary review consumes real provider usage but never awards conversation XP", async () => {
  const h = await harness();
  try {
    const messages: Line[] = [];
    const id = "conversation-diary-review";
    for (let i = 0; i < 4; i++) {
      h.clock();
      messages.push({
        role: "user",
        content:
          "Heute habe ich viel Deutsch gelernt und einen Text geschrieben. Runde " +
          i,
      });
      const r = await h.send({
        ...request(messages, id),
        mode: "diary-review",
      });
      assert.equal(r.status, 200);
      messages.push({ role: "assistant", content: fixture.message });
    }
    h.clock();
    const result = await (
      await h.send({ ...request(messages, id, "finish"), mode: "diary-review" })
    ).json();
    assert.equal(result.completion.qualified, false);
    assert.equal(result.completion.receipt, null);
    assert.ok(h.calls() >= 4);
  } finally {
    h.ledger.close();
  }
});

test("diary mode validates three grounded corrections while ordinary chat retains gentle limit", () => {
  const content = "Ich bin müde. Ich lerne Deutsch. Heute regnet es.";
  const r = {
    ...request([{ role: "user", content }]),
    mode: "diary-review" as const,
  };
  const reply = {
    ...fixture,
    corrections: [
      "Ich bin müde.",
      "Ich lerne Deutsch.",
      "Heute regnet es.",
    ].map((original) => ({
      original,
      corrected: original,
      explanationTr: "Örnek açıklama.",
      alternative: original,
    })),
  };
  assert.equal(validateTutorReply(reply, r).corrections.length, 3);
  assert.throws(
    () => validateTutorReply(reply, { ...r, mode: "daily" }),
    /INVALID_PROVIDER_RESPONSE/,
  );
  assert.throws(
    () =>
      validateTutorReply(
        {
          ...reply,
          corrections: [{ ...reply.corrections[0], original: "invented" }],
        },
        r,
      ),
    /INVALID_PROVIDER_RESPONSE/,
  );
});
