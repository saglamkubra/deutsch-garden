"use client";
import { progressStorage } from "../account/storage.ts";
import { useSyncExternalStore } from "react";
import { initialGrammar } from "./types.ts";
import type { GrammarState } from "./types.ts";
import { createGrammarPersistence, GRAMMAR_KEY } from "./persistence.ts";
import {
  openTopic,
  bookmark,
  markRead,
  practice,
  beginQuiz,
  answerQuiz,
  advanceQuiz,
} from "./engine.ts";
import { deliverGardenReward } from "../garden/store.ts";
import { deliverGrammarXp } from "../exercises/store.ts";
const persistence = createGrammarPersistence(() => progressStorage());
const server = {
  ready: false,
  state: initialGrammar(),
  readonly: false,
  notice: "",
};
let snapshot = server;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((f) => f());
function load() {
  snapshot = { ready: true, ...persistence.load() };
  emit();
}
function save(state: GrammarState) {
  try {
    persistence.save(state);
    snapshot = { ...snapshot, state };
    emit();
    return true;
  } catch {
    snapshot = {
      ...snapshot,
      notice:
        "Kayıt yazılamadı; ilerlemen değiştirilmedi. Tarayıcı depolamasını kontrol et.",
    };
    emit();
    return false;
  }
}
async function flush() {
  for (const c of snapshot.state.claims.filter((c) => !c.delivered)) {
    try {
      const xpOk = !c.xp || (await deliverGrammarXp(c.id, c.xp));
      if (!xpOk) continue;
      if (
        await deliverGardenReward({
          id: c.id,
          source: "exercise",
          coins: c.coins,
          ...(c.seed ? { seeds: { lavender: 1 } } : {}),
        })
      )
        if (
          !save({
            ...snapshot.state,
            claims: snapshot.state.claims.map((x) =>
              x.id === c.id ? { ...x, delivered: true } : x,
            ),
          })
        )
          return;
    } catch {
      snapshot = {
        ...snapshot,
        notice:
          "Ödülün kayıtlı; çantaya aktarmayı daha sonra yeniden deneyebilirsin.",
      };
      emit();
    }
  }
}
async function mutate(fn: (s: GrammarState) => GrammarState) {
  const run = async () => {
    load();
    if (snapshot.readonly) return;
    const next = fn(snapshot.state);
    if (next === snapshot.state || save(next)) await flush();
  };
  if (navigator.locks) await navigator.locks.request(GRAMMAR_KEY, run);
  else await run();
}
function storage(e: StorageEvent) {
  if (e.key === GRAMMAR_KEY) load();
}
function subscribe(f: () => void) {
  listeners.add(f);
  if (listeners.size === 1) {
    load();
    void mutate((s) => s);
    window.addEventListener("storage", storage);
  }
  return () => {
    listeners.delete(f);
    if (!listeners.size) window.removeEventListener("storage", storage);
  };
}
export const useGrammar = () =>
  useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => server,
  );
export const startTopic = (id: string) =>
  mutate((s) => openTopic(s, id, Date.now()));
export const toggleBookmark = (id: string) => mutate((s) => bookmark(s, id));
export const finishReading = (id: string) =>
  mutate((s) => markRead(s, id, Date.now()));
export const submitPractice = (id: string, value: string) =>
  mutate((s) => practice(s, id, value, Date.now()));
export const startGrammarQuiz = (id: string) =>
  mutate((s) => beginQuiz(s, id, crypto.randomUUID(), Date.now()));
export const submitGrammarQuiz = (id: string, value: string) =>
  mutate((s) => answerQuiz(s, id, value, Date.now()));
export const nextGrammarQuestion = (id: string) =>
  mutate((s) => advanceQuiz(s, id));
export const retryGrammarRewards = () => mutate((s) => ({ ...s }));
