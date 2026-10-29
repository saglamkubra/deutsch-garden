import { LEVELS, type Level } from "../learning/types.ts";
import { REWARDS } from "../exercises/engine.ts";
export const LUMI_REWARDS = REWARDS.lumi;
export const MODES = {
  daily: "Günlük Sohbet",
  cafe: "Kafede Sipariş",
  interview: "İş Görüşmesi",
  travel: "Seyahat",
  shopping: "Alışveriş",
  friends: "Arkadaşlarla Konuşma",
  free: "Serbest Konuşma",
  "diary-review": "Yazı İncelemesi",
} as const;
export type TutorMode = keyof typeof MODES;
export type CorrectionStyle = "gentle" | "summary";
export type Line = { role: "user" | "assistant"; content: string };
export type Correction = {
  original: string;
  corrected: string;
  explanationTr: string;
  alternative: string;
};
export type TutorWord = {
  german: string;
  article: "" | "der" | "die" | "das";
  meaningTr: string;
  exampleDe: string;
  exampleTr: string;
};
export type TutorReply = {
  message: string;
  encouragementTr: string;
  corrections: Correction[];
  vocabulary: TutorWord[];
};
export type Receipt = {
  id: string;
  sessionId: string;
  date: string;
  signature: string;
};
export type Completion = {
  qualified: boolean;
  turns: number;
  characters: number;
  seconds: number;
  receipt: Receipt | null;
};
export type TutorRequest = {
  action: "message" | "finish" | "translate";
  conversationId: string;
  requestId: string;
  level: Level;
  mode: TutorMode;
  correction: CorrectionStyle;
  messages: Line[];
  word?: string;
};
export type TutorResult = {
  requestId: string;
  reply: TutorReply;
  completion: Completion | null;
  remaining: number;
};
export const LIMITS = {
  turns: 12,
  message: 800,
  context: 14000,
  history: 20,
  words: 100,
  clientDay: 400,
  globalDay: 450,
  clientMinute: 3,
  globalMinute: 10,
  outputTokens: 1200,
  practiceTurns: 4,
  practiceChars: 60,
  practiceSeconds: 60,
} as const;
export const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, max: number) =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max;
export const validId = (v: unknown): v is string =>
  typeof v === "string" && /^[a-zA-Z0-9-]{8,80}$/.test(v);
export function validRequest(v: unknown): v is TutorRequest {
  if (
    !object(v) ||
    !["message", "finish", "translate"].includes(String(v.action)) ||
    !validId(v.conversationId) ||
    !validId(v.requestId) ||
    !LEVELS.includes(v.level as Level) ||
    !Object.hasOwn(MODES, String(v.mode)) ||
    !["gentle", "summary"].includes(String(v.correction)) ||
    !Array.isArray(v.messages) ||
    v.messages.length < 1 ||
    v.messages.length > LIMITS.turns * 2
  )
    return false;
  if (
    v.messages.some(
      (m, i) =>
        !object(m) ||
        m.role !== (i % 2 === 0 ? "user" : "assistant") ||
        !str(m.content, i % 2 === 0 ? LIMITS.message : 1800),
    )
  )
    return false;
  if (
    v.messages.reduce((n, m) => n + String(m.content).length, 0) >
    LIMITS.context - (v.action === "message" ? 1800 : 0)
  )
    return false;
  if (
    v.action === "message"
      ? v.messages.length % 2 !== 1
      : v.messages.length % 2 !== 0
  )
    return false;
  return v.action !== "translate" || str(v.word, 80);
}
export function validReply(v: unknown): v is TutorReply {
  if (
    !object(v) ||
    !str(v.message, 1800) ||
    !str(v.encouragementTr, 250) ||
    !Array.isArray(v.corrections) ||
    v.corrections.length > 3 ||
    !Array.isArray(v.vocabulary) ||
    v.vocabulary.length > 4
  )
    return false;
  return (
    v.corrections.every(
      (c) =>
        object(c) &&
        str(c.original, 800) &&
        str(c.corrected, 800) &&
        str(c.explanationTr, 650) &&
        str(c.alternative, 800),
    ) &&
    v.vocabulary.every(
      (w) =>
        object(w) &&
        str(w.german, 80) &&
        ["", "der", "die", "das"].includes(String(w.article)) &&
        str(w.meaningTr, 250) &&
        str(w.exampleDe, 350) &&
        str(w.exampleTr, 350),
    )
  );
}
export function validReceipt(v: unknown): v is Receipt {
  return (
    object(v) &&
    typeof v.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(v.date) &&
    v.id === "lumi:daily:" + v.date &&
    validId(v.sessionId) &&
    typeof v.signature === "string" &&
    /^[a-f0-9]{64}$/.test(v.signature)
  );
}
export function validResult(v: unknown): v is TutorResult {
  return (
    object(v) &&
    validId(v.requestId) &&
    validReply(v.reply) &&
    Number.isInteger(v.remaining) &&
    Number(v.remaining) >= 0 &&
    (v.completion === null ||
      (object(v.completion) &&
        typeof v.completion.qualified === "boolean" &&
        Number.isInteger(v.completion.turns) &&
        Number.isInteger(v.completion.characters) &&
        typeof v.completion.seconds === "number" &&
        v.completion.seconds >= 0 &&
        (v.completion.receipt === null || validReceipt(v.completion.receipt))))
  );
}
export const STARTERS: Record<TutorMode, { de: string; tr: string }[]> = {
  "diary-review": [
    { de: "Heute habe ich viel gelernt.", tr: "Bugün çok şey öğrendim." },
  ],
  daily: [
    { de: "Hallo Lumi! Wie geht es dir?", tr: "Selam ver, hâl hatır sor." },
    {
      de: "Heute möchte ich über meinen Tag sprechen.",
      tr: "Günün hakkında konuş.",
    },
  ],
  cafe: [
    {
      de: "Guten Tag! Ich möchte einen Tee, bitte.",
      tr: "Kafede bir çay sipariş et.",
    },
    { de: "Was empfehlen Sie mir?", tr: "Bir öneri iste." },
  ],
  interview: [
    {
      de: "Guten Tag. Ich möchte mich kurz vorstellen.",
      tr: "Kendini kısaca tanıt.",
    },
    {
      de: "Können Sie mir etwas über die Stelle erzählen?",
      tr: "Pozisyon hakkında bilgi iste.",
    },
  ],
  travel: [
    { de: "Entschuldigung, wo ist der Bahnhof?", tr: "İstasyonun yerini sor." },
    {
      de: "Ich möchte ein Zimmer reservieren.",
      tr: "Oda ayırtmak istediğini söyle.",
    },
  ],
  shopping: [
    { de: "Wie viel kostet diese Tasche?", tr: "Bir ürünün fiyatını sor." },
    {
      de: "Haben Sie das in einer anderen Größe?",
      tr: "Başka beden olup olmadığını sor.",
    },
  ],
  friends: [
    { de: "Hast du am Wochenende Zeit?", tr: "Hafta sonu buluşmayı öner." },
    {
      de: "Was machst du gern in deiner Freizeit?",
      tr: "Hobiler üzerine sohbet et.",
    },
  ],
  free: [
    {
      de: "Ich möchte über mein Lieblingsbuch sprechen.",
      tr: "Sevdiğin bir kitaptan söz et.",
    },
    {
      de: "Stell mir bitte eine Frage auf Deutsch.",
      tr: "Lumi’den bir soru iste.",
    },
  ],
};
