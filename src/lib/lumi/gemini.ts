import { GoogleGenAI } from "@google/genai";
import {
  ProviderFailure,
  tutorReplySchema,
  tutorInstructions,
  validateTutorReply,
} from "./provider.ts";
import type { TutorRequest } from "./protocol.ts";

export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";
export function geminiFailure(error: unknown): ProviderFailure {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? Number(error.status)
      : 0;
  return new ProviderFailure(
    status === 404 || status === 400
      ? "INVALID_MODEL"
      : status === 401 || status === 403
        ? "PROVIDER_ACCESS"
        : status === 429
          ? "PROVIDER_LIMIT"
          : "PROVIDER_UNAVAILABLE",
  );
}
export function geminiClient(key: string) {
  return new GoogleGenAI({
    apiKey: key,
    // Structured tutoring can exceed 25s even when model metadata is healthy.
    // Keep one bounded attempt; do not silently retry billable generation.
    httpOptions: { timeout: 45000, retryOptions: { attempts: 1 } },
  });
}
// Metadata only: no generated tokens, no conversation content. Share in-flight checks.
const checks = new Map<string, { expires: number; result: Promise<void> }>();
export async function verifyGeminiModel(
  key: string,
  model: string,
  client = geminiClient(key),
) {
  const { createHash } = await import("node:crypto");
  const id = createHash("sha256")
    .update(key + ":" + model)
    .digest("hex");
  const prior = checks.get(id);
  if (prior && prior.expires > Date.now()) return prior.result;
  if (checks.size > 20) checks.clear();
  const entry = { expires: Date.now() + 15 * 60000, result: Promise.resolve() };
  entry.result = (async () => {
    try {
      const found = await client.models.get({ model });
      if (found.name !== `models/${model}` && found.name !== model)
        throw new ProviderFailure("INVALID_MODEL");
      if (!found.supportedActions?.includes("generateContent"))
        throw new ProviderFailure("INVALID_MODEL");
    } catch (error) {
      entry.expires =
        Date.now() + (error instanceof ProviderFailure ? 300000 : 30000);
      throw error instanceof ProviderFailure ? error : geminiFailure(error);
    }
  })();
  checks.set(id, entry);
  return entry.result;
}
export async function callGeminiTutor(
  r: TutorRequest,
  config: { key: string; model: string; outputTokens: number },
  client = geminiClient(config.key),
) {
  await verifyGeminiModel(config.key, config.model, client);
  try {
    const response = await client.models.generateContent({
      model: config.model,
      contents: [
        ...r.messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        ...(r.action === "finish"
          ? [
              {
                role: "user",
                parts: [
                  {
                    text: "Please close this practice and summarize my learning notes according to the tutor rules.",
                  },
                ],
              },
            ]
          : []),
        ...(r.action === "translate"
          ? [
              {
                role: "user",
                parts: [
                  {
                    text:
                      "Explain this German expression as vocabulary data: " +
                      JSON.stringify(r.word),
                  },
                ],
              },
            ]
          : []),
      ],
      config: {
        systemInstruction: tutorInstructions(r),
        responseMimeType: "application/json",
        responseJsonSchema: tutorReplySchema(r),
        maxOutputTokens: config.outputTokens,
        candidateCount: 1,
      },
    });
    const candidate = response.candidates?.[0];
    if (
      response.promptFeedback?.blockReason ||
      candidate?.finishReason === "SAFETY"
    )
      throw new ProviderFailure("PROVIDER_REFUSAL");
    if (candidate?.finishReason !== "STOP")
      throw new ProviderFailure("INCOMPLETE_RESPONSE");
    const raw = response.text;
    if (!raw || raw.length > 20000)
      throw new ProviderFailure("INVALID_PROVIDER_RESPONSE");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new ProviderFailure("INVALID_PROVIDER_RESPONSE");
    }
    return validateTutorReply(parsed, r);
  } catch (error) {
    throw error instanceof ProviderFailure ? error : geminiFailure(error);
  }
}
