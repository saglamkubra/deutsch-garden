import test from "node:test";
import assert from "node:assert/strict";
import type { GoogleGenAI } from "@google/genai";
import {
  callGeminiTutor,
  DEFAULT_GEMINI_MODEL,
  geminiFailure,
  verifyGeminiModel,
} from "./gemini.ts";
import type { TutorRequest } from "./protocol.ts";
const request: TutorRequest = {
  action: "message",
  conversationId: "gemini-test-chat",
  requestId: "gemini-test-request",
  level: "A2",
  mode: "cafe",
  correction: "summary",
  messages: [{ role: "user", content: "Ich möchte einen Kaffee." }],
};
const reply = {
  message: "Gerne! Mit Milch?",
  encouragementTr: "Güzel bir sipariş!",
  corrections: [],
  vocabulary: [],
};
test("Gemini model metadata cache and structured generation contract", async () => {
  let gets = 0;
  const client = {
    models: {
      get: async ({ model }: { model: string }) => {
        gets++;
        return {
          name: `models/${model}`,
          supportedActions: ["generateContent"],
        };
      },
      generateContent: async (input: Record<string, unknown>) => {
        assert.equal(input.model, "gemini-3.5-flash-lite");
        const config = input.config as Record<string, unknown>;
        assert.equal(config.responseMimeType, "application/json");
        assert.equal(config.maxOutputTokens, 1200);
        assert.ok(config.responseJsonSchema);
        assert.equal(
          (
            config.responseJsonSchema as {
              properties: { corrections: { maxItems: number } };
            }
          ).properties.corrections.maxItems,
          0,
        );
        assert.match(String(config.systemInstruction), /Target CEFR: A2/);
        assert.deepEqual(input.contents, [
          { role: "user", parts: [{ text: request.messages[0].content }] },
        ]);
        return {
          candidates: [{ finishReason: "STOP" }],
          text: JSON.stringify(reply),
        };
      },
    },
  } as unknown as GoogleGenAI;
  await Promise.all([
    verifyGeminiModel("fake-key-contract", DEFAULT_GEMINI_MODEL, client),
    verifyGeminiModel("fake-key-contract", DEFAULT_GEMINI_MODEL, client),
  ]);
  assert.equal(gets, 1);
  assert.deepEqual(
    await callGeminiTutor(
      request,
      {
        key: "fake-key-contract",
        model: DEFAULT_GEMINI_MODEL,
        outputTokens: 1200,
      },
      client,
    ),
    reply,
  );
  assert.equal(gets, 1);
});
test("Gemini quota, access, invalid model and connection failures are sanitized", async () => {
  for (const [status, code] of [
    [429, "PROVIDER_LIMIT"],
    [403, "PROVIDER_ACCESS"],
    [404, "INVALID_MODEL"],
    [503, "PROVIDER_UNAVAILABLE"],
  ] as const) {
    assert.equal(
      geminiFailure({ status, message: "private provider detail" }).message,
      code,
    );
  }
  const bad = {
    models: {
      get: async () => ({ name: "models/missing", supportedActions: [] }),
    },
  } as unknown as GoogleGenAI;
  await assert.rejects(
    verifyGeminiModel("fake-invalid-key", "missing", bad),
    /INVALID_MODEL/,
  );
});
test("Gemini incomplete, blocked, malformed and invented correction responses rejected", async () => {
  const cases = [
    [{ candidates: [{ finishReason: "MAX_TOKENS" }] }, "INCOMPLETE_RESPONSE"],
    [{ promptFeedback: { blockReason: "SAFETY" } }, "PROVIDER_REFUSAL"],
    [
      { candidates: [{ finishReason: "STOP" }], text: "not-json" },
      "INVALID_PROVIDER_RESPONSE",
    ],
    [
      {
        candidates: [{ finishReason: "STOP" }],
        text: JSON.stringify({
          ...reply,
          corrections: [
            {
              original: "invented error",
              corrected: "Hallo",
              explanationTr: "Hata",
              alternative: "Hallo",
            },
          ],
        }),
      },
      "INVALID_PROVIDER_RESPONSE",
    ],
  ] as const;
  for (const [index, [data, code]] of cases.entries()) {
    const client = {
      models: {
        get: async () => ({
          name: `models/${DEFAULT_GEMINI_MODEL}`,
          supportedActions: ["generateContent"],
        }),
        generateContent: async () => data,
      },
    } as unknown as GoogleGenAI;
    await assert.rejects(
      callGeminiTutor(
        request,
        {
          key: `fake-bad-reply-${index}`,
          model: DEFAULT_GEMINI_MODEL,
          outputTokens: 1200,
        },
        client,
      ),
      new RegExp(code),
    );
  }
});
