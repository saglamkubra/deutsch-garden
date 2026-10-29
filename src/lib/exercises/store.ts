"use client";
import { currentOwner } from "../account/storage.ts";
import { progressStorage } from "../account/storage.ts";
import { useSyncExternalStore } from "react";
import { initialExercises } from "./types.ts";
import type { ExerciseState, Mode, Question } from "./types.ts";
import { createExercisePersistence, EXERCISE_KEY } from "./persistence.ts";
import {
  startSession,
  submitAnswer,
  advance,
  matchingAttempt,
} from "./engine.ts";
import { localDate } from "../learning/engine.ts";
import type { Level } from "../learning/types.ts";
import { deliverGardenReward } from "../garden/store.ts";
const persistence = createExercisePersistence(() => progressStorage());
const server = {
  ready: false,
  state: initialExercises(),
  readonly: false,
  notice: "",
};
let snapshot = server;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());
function load() {
  const loaded = persistence.load();
  snapshot = { ready: true, ...loaded };
  emit();
}
function save(state: ExerciseState) {
  try {
    persistence.save(state);
    snapshot = { ...snapshot, state };
    emit();
    return true;
  } catch {
    snapshot = {
      ...snapshot,
      notice:
        "Yanıt kaydedilemedi; ilerlemen değiştirilmedi. Tarayıcı depolamasını kontrol et.",
    };
    emit();
    return false;
  }
}
async function flush() {
  for (const c of snapshot.state.claims.filter((c) => !c.delivered)) {
    try {
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
          "Bahçe ödülü henüz aktarılamadı; güvenle kayıtlı ve yeniden denenebilir.",
      };
      emit();
      return;
    }
  }
}
async function mutate(fn: (state: ExerciseState) => ExerciseState) {
  const run = async () => {
    load();
    if (snapshot.readonly) return;
    const next = fn(snapshot.state);
    if (next === snapshot.state || save(next)) await flush();
  };
  if (navigator.locks) await navigator.locks.request(EXERCISE_KEY, run);
  else await run();
}
function onStorage(e: StorageEvent) {
  if (e.key === EXERCISE_KEY) load();
}
function subscribe(fn: () => void) {
  listeners.add(fn);
  if (listeners.size === 1) {
    load();
    void mutate((s) => s);
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(fn);
    if (!listeners.size) window.removeEventListener("storage", onStorage);
  };
}
export const useExercises = () =>
  useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => server,
  );
export function beginExercise(
  questions: Question[],
  mode: Mode,
  level: Level,
  practice = false,
) {
  return mutate((s) =>
    startSession(
      s,
      questions,
      mode,
      localDate(),
      level,
      Date.now(),
      crypto.randomUUID(),
      practice,
    ),
  );
}
export function answerExercise(value: string, skipped = false) {
  return mutate((s) =>
    s.active ? submitAnswer(s, s.active, value, Date.now(), skipped) : s,
  );
}
export function nextExercise() {
  return mutate((s) => (s.active ? advance(s, s.active) : s));
}
export function closeExercise() {
  return mutate((s) => ({ ...s, active: null }));
}
export function resumeExercise(id: string) {
  return mutate((s) => (s.sessions[id] ? { ...s, active: id } : s));
}
export function retryGardenClaims() {
  return mutate((s) => ({ ...s }));
}

export function recordMatch(left: string, right: string) {
  return mutate((s) =>
    s.active ? matchingAttempt(s, s.active, left, right, Date.now()) : s,
  );
}

/** Grammar shares the existing XP ledger; reward receipts remain stable across reloads. */
export async function deliverLearningXp(
  id: string,
  amount: number,
  expectedOwner?: string,
): Promise<boolean> {
  const run = async () => {
    if (expectedOwner && currentOwner() !== expectedOwner) return false;
    load();
    if (
      snapshot.readonly ||
      !(
        (/^gift:daily:\d{4}-\d{2}-\d{2}$/.test(id) && amount === 10) ||
        ((id.startsWith("story:complete:") ||
          id.startsWith("course:lesson:")) &&
          amount === 20) ||
        ((id.startsWith("grammar:topic:") ||
          id.startsWith("listening:episode:") ||
          id.startsWith("lumi:daily:") ||
          /^diary:day:\d{4}-\d{2}-\d{2}$/.test(id)) &&
          amount === 15)
      )
    )
      return false;
    if (snapshot.state.xp[id] === amount) return true;
    return save({
      ...snapshot.state,
      xp: { ...snapshot.state.xp, [id]: amount },
    });
  };
  return navigator.locks
    ? await navigator.locks.request(EXERCISE_KEY, run)
    : run();
}
export const deliverGrammarXp = deliverLearningXp;
