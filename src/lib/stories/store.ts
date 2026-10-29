"use client";
import { progressStorage } from "../account/storage.ts";
import { useSyncExternalStore } from "react";
import type { StoryState } from "./types";
import type { Level } from "../learning/types";
import {
  initialStories,
  startStory,
  chooseStory,
  beginStoryQuiz,
  answerStoryQuiz,
  nextStoryQuestion,
  toggleStoryFavorite,
  saveStoryWord,
  ensureStoryDaily,
} from "./engine";
import { createStoryPersistence, STORY_KEY } from "./persistence";
import { localDate } from "../learning/engine";
import { wordById } from "./content";
import { queueWordReview } from "../learning/store";
import { deliverLearningXp } from "../exercises/store";
import { deliverGardenReward } from "../garden/store";
const persistence = createStoryPersistence(() => progressStorage());
const server = {
  ready: false,
  state: initialStories(),
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
function save(state: StoryState) {
  try {
    persistence.save(state);
    snapshot = { ...snapshot, state };
    emit();
    return true;
  } catch {
    snapshot = {
      ...snapshot,
      notice:
        "Kaydedilemedi; son kayıtlı sahnen korundu. Depolama alanını kontrol et.",
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
      ) {
        if (
          !save({
            ...snapshot.state,
            claims: snapshot.state.claims.map((x) =>
              x.id === c.id ? { ...x, delivered: true } : x,
            ),
          })
        )
          return;
      }
    } catch {
      snapshot = {
        ...snapshot,
        notice: "Ödülün kayıtlı; aktarım bekliyor. Yeniden deneyebilirsin.",
      };
      emit();
    }
  }
}
async function mutate(fn: (s: StoryState) => StoryState) {
  const run = async () => {
    load();
    if (snapshot.readonly) return false;
    const next = fn(snapshot.state);
    if (next === snapshot.state || save(next)) {
      await flush();
      return true;
    }
    return false;
  };
  return navigator.locks
    ? await navigator.locks.request(STORY_KEY, run)
    : await run();
}
function storage(e: StorageEvent) {
  if (e.key === STORY_KEY) load();
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
export const useStories = () =>
  useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => server,
  );
export const openStory = (id: string, replay = false) =>
  mutate((s) => startStory(s, id, crypto.randomUUID(), Date.now(), replay));
export const chooseScene = (id: string, scene: string, choice: string) =>
  mutate((s) => chooseStory(s, id, scene, choice, Date.now()));
export const favoriteStory = (id: string) =>
  mutate((s) => toggleStoryFavorite(s, id));
export const assignStoryDay = (level: Level) =>
  mutate((s) => ensureStoryDaily(s, localDate(), level));
export const startStoryQuiz = (id: string) =>
  mutate((s) => beginStoryQuiz(s, id));
export const submitStoryQuiz = (id: string, qid: string, value: string) =>
  mutate((s) => answerStoryQuiz(s, id, qid, value, Date.now()));
export const advanceStoryQuiz = (id: string) =>
  mutate((s) => nextStoryQuestion(s, id));
export const retryStoryRewards = () => mutate((s) => s);
export const checkpointStory = () => mutate((s) => ({ ...s }));
export const collectStoryWord = (id: string) =>
  mutate((s) => {
    if (s.savedWords.includes(id) || !wordById(id)) return s;
    if (wordById(id)!.repository && !queueWordReview(id)) {
      snapshot = {
        ...snapshot,
        notice: "Kelime tekrara eklenemedi. Öğrenme kaydını kontrol et.",
      };
      emit();
      return s;
    }
    return saveStoryWord(s, id);
  });
