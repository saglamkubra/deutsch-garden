"use client";
import { progressStorage } from "../account/storage.ts";
import { useSyncExternalStore } from "react";
import { initialListening } from "./types.ts";
import type { ListeningState } from "./types.ts";
import type { Level } from "../learning/types.ts";
import { createListeningPersistence, LISTENING_KEY } from "./persistence.ts";
import {
  openEpisode,
  savePosition,
  recordPlayback,
  recordSpokenSentence,
  favorite,
  saveWord,
  ensureDaily,
  startQuiz,
  answerQuiz,
  nextQuestion,
} from "./engine.ts";
import { localDate } from "../learning/engine.ts";
import vocabulary from "../../data/vocabulary.json";
import { queueWordReview } from "../learning/store.ts";
import { deliverLearningXp } from "../exercises/store.ts";
import { deliverGardenReward } from "../garden/store.ts";
const persistence = createListeningPersistence(() => progressStorage());
const server = {
  ready: false,
  state: initialListening(),
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
function save(state: ListeningState) {
  try {
    persistence.save(state);
    snapshot = { ...snapshot, state };
    emit();
    return true;
  } catch {
    snapshot = {
      ...snapshot,
      notice:
        "Kayıt yazılamadı; ilerlemen değiştirilmedi. Depolama alanını kontrol et.",
    };
    emit();
    return false;
  }
}
async function flush() {
  for (const c of snapshot.state.claims.filter((c) => !c.delivered)) {
    try {
      if (c.xp && !(await deliverLearningXp(c.id, c.xp))) continue;
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
          "Ödülün kayıtlı, aktarım bekliyor. Daha sonra yeniden deneyebilirsin.",
      };
      emit();
    }
  }
}
async function mutate(fn: (s: ListeningState) => ListeningState) {
  const run = async () => {
    load();
    if (snapshot.readonly) return;
    const next = fn(snapshot.state);
    if (next === snapshot.state || save(next)) await flush();
  };
  if (navigator.locks) await navigator.locks.request(LISTENING_KEY, run);
  else await run();
}
function storage(e: StorageEvent) {
  if (e.key === LISTENING_KEY) load();
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
export const useListening = () =>
  useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => server,
  );
export const startListening = (id: string) =>
  mutate((s) => openEpisode(s, id, Date.now()));
export const checkpointListening = (id: string, position: number) =>
  mutate((s) => savePosition(s, id, position, Date.now()));
export const heardListening = (id: string, start: number, end: number) =>
  mutate((s) => recordPlayback(s, id, start, end, Date.now()));
export const heardSpeechSentence = (id: string, index: number) =>
  mutate((s) => recordSpokenSentence(s, id, index, Date.now()));
export const toggleListeningFavorite = (id: string) =>
  mutate((s) => favorite(s, id));
export const assignListeningDay = (level: Level) =>
  mutate((s) => ensureDaily(s, localDate(), level));
export const beginListeningQuiz = (id: string) =>
  mutate((s) => startQuiz(s, id, crypto.randomUUID(), Date.now()));
export const answerListeningQuiz = (id: string, value: string) =>
  mutate((s) => answerQuiz(s, id, value, Date.now()));
export const nextListeningQuestion = (id: string) =>
  mutate((s) => nextQuestion(s, id));
export const retryListeningRewards = () => mutate((s) => ({ ...s }));
export const saveListeningWord = (id: string) =>
  mutate((s) => {
    if (s.savedWords.includes(id)) return s;
    if (!queueWordReview(id)) {
      snapshot = {
        ...snapshot,
        notice: "Kelime tekrara eklenemedi; öğrenme kaydını kontrol et.",
      };
      emit();
      return s;
    }
    return saveWord(
      s,
      id,
      vocabulary.map((w) => w.id),
    );
  });
