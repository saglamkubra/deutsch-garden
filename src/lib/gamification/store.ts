"use client";
import { useSyncExternalStore } from "react";
import { accountClient } from "../account/client.ts";
import bundled from "../../data/vocabulary.json" with { type: "json" };
import { episodes } from "../listening/content.ts";
import { topics } from "../grammar/content.ts";
import { stories } from "../stories/content.ts";
import { capture, InvalidProgressRecord } from "../account/snapshot.ts";
import {
  progressStorage,
  currentOwner,
  watchProgress,
} from "../account/storage.ts";
import { initialExercises } from "../exercises/types.ts";
import {
  createExercisePersistence,
  EXERCISE_KEY,
} from "../exercises/persistence.ts";
import { deliverGardenReward } from "../garden/store.ts";
import { localDate } from "../learning/engine.ts";
import {
  BADGES,
  badgeReward,
  gameLevel,
  reconcile,
  streak,
  earnedXp,
  type Sources,
  type Availability,
} from "./model.ts";
const persistence = createExercisePersistence(progressStorage);
let rules: boolean | null = null;
class GameConnectionError extends Error {}
async function ensureRules() {
  if (!currentOwner()) return true;
  if (rules === null) {
    const client = accountClient();
    if (!client) return false;
    const r = await client.rpc("gamification_rules_version");
    if (r.error && !["PGRST202", "42883"].includes(r.error.code))
      throw new GameConnectionError(
        "Başarılar için bulut güvenlik kontrolü tamamlanamadı. Bağlantını ve oturumunu kontrol edip yeniden dene. Mevcut ilerlemen korunuyor.",
      );
    rules = !r.error && r.data === 14;
  }
  return rules;
}
type View = {
  ready: boolean;
  sources: Sources;
  today: string;
  notice: string;
  celebration: string | null;
};
const server: View = {
  ready: false,
  sources: { exercises: initialExercises() },
  today: "",
  notice: "",
  celebration: null,
};
let snapshot = server,
  timer: ReturnType<typeof setTimeout> | undefined,
  unwatch: (() => void) | undefined,
  clock: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((f) => f());
function sources(): Sources {
  const m = capture(window.localStorage, currentOwner()).modules;
  return {
    exercises: (m.exercises as Sources["exercises"]) ?? initialExercises(),
    learning: m.learning as Sources["learning"],
    garden: m.garden as Sources["garden"],
    grammar: m.grammar as Sources["grammar"],
    listening: m.listening as Sources["listening"],
    stories: m.stories as Sources["stories"],
    courses: m["mini-courses"] as Sources["courses"],
    lumi: m.lumi as Sources["lumi"],
  };
}
export function availability(s: Sources): Availability {
  const level = s.learning?.level ?? "A1";
  let custom: typeof bundled = [];
  try {
    const x = JSON.parse(
      progressStorage().getItem("deutsch-garden:vocabulary:v1") ?? "[]",
    );
    if (Array.isArray(x)) custom = x;
  } catch {}
  const wordIds = [
    ...new Set(
      [...bundled, ...custom]
        .filter((v) => v.levels.includes(level as never))
        .map((v) => v.id),
    ),
  ];
  const words = wordIds.length;
  return {
    words,
    wordIds,
    exercise: words >= 2,
    listening: episodes.some(
      (e) =>
        e.level === level &&
        e.audio &&
        !s.listening?.progress[e.id]?.completedAt,
    ),
    grammar: topics.some(
      (t) =>
        t.level === level &&
        t.lesson &&
        !s.grammar?.progress[t.id]?.completedAt,
    ),
    story: stories.some(
      (t) => t.level === level && !s.stories?.completed.includes(t.id),
    ),
  };
}
function publish(next: Sources, notice = "") {
  const after = next.exercises.gamification?.badges ?? {};
  const unlocked = Object.keys(after).find(
    (id) => !next.exercises.gamification?.celebrated?.includes(id),
  );
  snapshot = {
    ready: true,
    sources: next,
    today: localDate(),
    notice,
    celebration: unlocked ?? snapshot.celebration,
  };
  emit();
}
async function locked<T>(fn: () => Promise<T> | T) {
  return navigator.locks ? navigator.locks.request(EXERCISE_KEY, fn) : fn();
}
async function refresh() {
  try {
    if (!(await ensureRules())) {
      publish(
        sources(),
        "Bulut başarı kaydı için 14. adım SQL kurulumu gerekli. Önceki öğrenme kayıtların korunuyor.",
      );
      return;
    }
    await locked(() => {
      const s = sources(),
        next = reconcile(s, availability(s), Date.now());
      if (next !== s.exercises) {
        persistence.save(next);
        window.dispatchEvent(
          new StorageEvent("storage", { key: EXERCISE_KEY }),
        );
      }
      publish({ ...s, exercises: next });
    });
  } catch (error) {
    snapshot = {
      ...snapshot,
      ready: true,
      today: localDate(),
      notice:
        error instanceof InvalidProgressRecord ||
        error instanceof GameConnectionError
          ? error.message
          : "Başarı kaydı güvenle okunamadı veya yazılamadı. İlerlemen korunuyor; depolama alanını kontrol edip yeniden dene.",
    };
    emit();
  }
}
function schedule() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    void refresh();
  }, 150);
}
function onStorage(e: StorageEvent) {
  if (e.key?.startsWith("deutsch-garden:") && !e.key.includes(":account:"))
    schedule();
}
function subscribe(f: () => void) {
  listeners.add(f);
  if (listeners.size === 1) {
    void refresh();
    unwatch = watchProgress(schedule);
    window.addEventListener("storage", onStorage);
    clock = setInterval(schedule, 30000);
  }
  return () => {
    listeners.delete(f);
    if (!listeners.size) {
      unwatch?.();
      window.removeEventListener("storage", onStorage);
      clearInterval(clock);
      clearTimeout(timer);
    }
  };
}
const inactive = () => () => {};
export const useGamification = (enabled = true) =>
  useSyncExternalStore(
    enabled ? subscribe : inactive,
    () => (enabled ? snapshot : server),
    () => server,
  );
export const refreshGamification = () => {
  rules = null;
  return refresh();
};
export async function dismissCelebration() {
  await locked(() => {
    const s = sources();
    if (!s.exercises.gamification) return;
    const next = {
      ...s.exercises,
      gamification: {
        ...s.exercises.gamification,
        celebrated: Object.keys(s.exercises.gamification.badges),
      },
    };
    persistence.save(next);
    snapshot = {
      ...snapshot,
      sources: { ...s, exercises: next },
      celebration: null,
    };
    emit();
  }).catch(() => {
    snapshot = {
      ...snapshot,
      celebration: null,
      notice:
        "Kutlamayı kapattık; görüldü durumu kaydedilemedi. Başarıların korunuyor.",
    };
    emit();
  });
}
export async function claimAchievement(id: string): Promise<boolean> {
  if (!(await ensureRules())) return false;
  return locked(async () => {
    const s = sources(),
      next = reconcile(s, availability(s), Date.now()),
      badge = next.gamification?.badges[id],
      reward = badgeReward(id);
    if (!badge || !reward) return false;
    if (badge.claimed) return true;
    // Persist entitlement before the garden write. Its existing receipt prevents crash replay.
    persistence.save(next);
    if (!(await deliverGardenReward(reward))) {
      publish(
        { ...s, exercises: next },
        "Bahçe ödülü henüz kaydedilemedi. Tekrar denediğinde iki kez verilmez.",
      );
      return false;
    }
    const final = {
      ...next,
      gamification: {
        ...next.gamification!,
        badges: {
          ...next.gamification!.badges,
          [id]: { ...badge, claimed: true },
        },
      },
    };
    persistence.save(final);
    window.dispatchEvent(new StorageEvent("storage", { key: EXERCISE_KEY }));
    publish(
      { ...sources(), exercises: final },
      `${BADGES.find((b) => b.id === id)?.name} ödülün bahçene eklendi. 🌸`,
    );
    return true;
  });
}
export function summary(view: View) {
  const xp = earnedXp(view.sources.exercises),
    events = Object.values(view.sources.exercises.gamification?.events ?? {});
  return {
    xp,
    level: gameLevel(xp),
    streak: streak(events, view.today || localDate()),
    events,
  };
}
