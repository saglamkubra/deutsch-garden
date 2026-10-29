import type { Level } from "../learning/types.ts";
import type {
  TutorMode,
  CorrectionStyle,
  TutorReply,
  TutorWord,
  TutorResult,
  Receipt,
  TutorRequest,
  Line,
} from "./protocol.ts";
import { LIMITS } from "./protocol.ts";
export type ChatMessage = Line & { id: string; reply?: TutorReply };
export type Conversation = {
  id: string;
  level: Level;
  mode: TutorMode;
  correction: CorrectionStyle;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  pending: { id: string; action: "message" | "finish"; text: string } | null;
  closed: boolean;
  qualified: boolean;
};
export type SavedTutorWord = {
  key: string;
  word: TutorWord;
  repositoryId: string | null;
};
export type LumiState = {
  version: 1;
  active: string | null;
  conversations: Conversation[];
  words: SavedTutorWord[];
  completed: string[];
  claims: { receipt: Receipt; delivered: boolean }[];
  consent: boolean;
};
export const initialLumi = (): LumiState => ({
  version: 1,
  active: null,
  conversations: [],
  words: [],
  completed: [],
  claims: [],
  consent: false,
});
export const activeChat = (s: LumiState) =>
  s.conversations.find((c) => c.id === s.active);
export const wordKey = (w: TutorWord) =>
  w.german.normalize("NFC").trim().toLocaleLowerCase("de");
export function newChat(
  s: LumiState,
  id: string,
  level: Level,
  mode: TutorMode,
  correction: CorrectionStyle,
  now: number,
): LumiState {
  return s.conversations.length >= LIMITS.history ||
    s.conversations.some((c) => c.id === id)
    ? s
    : {
        ...s,
        active: id,
        conversations: [
          ...s.conversations,
          {
            id,
            level,
            mode,
            correction,
            createdAt: now,
            updatedAt: now,
            messages: [],
            pending: null,
            closed: false,
            qualified: false,
          },
        ],
      };
}
function update(s: LumiState, c: Conversation) {
  return {
    ...s,
    conversations: s.conversations.map((x) => (x.id === c.id ? c : x)),
  };
}
export function queueMessage(
  s: LumiState,
  cid: string,
  id: string,
  action: "message" | "finish",
  text: string,
  now: number,
): LumiState {
  const c = s.conversations.find((c) => c.id === cid);
  if (
    !c ||
    c.closed ||
    c.pending ||
    !s.consent ||
    (action === "message" &&
      (!text.trim() ||
        text.length > LIMITS.message ||
        c.messages.filter((m) => m.role === "user").length >= LIMITS.turns)) ||
    (action === "finish" && !c.messages.length)
  )
    return s;
  return update(s, {
    ...c,
    updatedAt: now,
    pending: { id, action, text: text.trim() },
  });
}
export function requestFor(c: Conversation): TutorRequest | null {
  return c.pending
    ? {
        action: c.pending.action,
        conversationId: c.id,
        requestId: c.pending.id,
        level: c.level,
        mode: c.mode,
        correction: c.correction,
        messages: [
          ...c.messages.map(({ role, content }) => ({ role, content })),
          ...(c.pending.action === "message"
            ? [{ role: "user" as const, content: c.pending.text }]
            : []),
        ],
      }
    : null;
}
export function receiveReply(
  s: LumiState,
  cid: string,
  result: TutorResult,
  now: number,
): LumiState {
  const c = s.conversations.find((c) => c.id === cid),
    p = c?.pending;
  if (
    !c ||
    !p ||
    p.id !== result.requestId ||
    (p.action === "finish" && !result.completion) ||
    (p.action === "message" && result.completion)
  )
    return s;
  let next = update(s, {
    ...c,
    updatedAt: now,
    pending: null,
    closed: p.action === "finish",
    qualified: !!result.completion?.qualified,
    messages: [
      ...c.messages,
      ...(p.action === "message"
        ? [{ id: p.id + "-user", role: "user" as const, content: p.text }]
        : []),
      {
        id: p.id + "-lumi",
        role: "assistant",
        content: result.reply.message,
        reply: result.reply,
      },
    ],
  });
  if (result.completion?.qualified && !next.completed.includes(cid))
    next = { ...next, completed: [...next.completed, cid] };
  const receipt = result.completion?.receipt;
  if (receipt && !next.claims.some((c) => c.receipt.id === receipt.id))
    next = { ...next, claims: [...next.claims, { receipt, delivered: false }] };
  return next;
}
export function removeChat(s: LumiState, cid: string): LumiState {
  const conversations = s.conversations.filter((c) => c.id !== cid);
  return {
    ...s,
    conversations,
    active: s.active === cid ? (conversations.at(-1)?.id ?? null) : s.active,
  };
}
export function saveTutorWord(
  s: LumiState,
  word: TutorWord,
  repositoryId: string | null,
): LumiState {
  const key = wordKey(word);
  return s.words.length >= LIMITS.words || s.words.some((w) => w.key === key)
    ? s
    : { ...s, words: [...s.words, { key, word, repositoryId }] };
}
