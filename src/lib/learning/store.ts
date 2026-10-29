"use client";
import { progressStorage } from "../account/storage.ts";
import { useSyncExternalStore } from "react";
import bundled from "@/data/vocabulary.json";
import { importVocabulary, validateVocabulary } from "./import.ts";
import { LocalVocabularyRepository } from "./repository.ts";
import {
  initialLearning,
  localDate,
  ensureDaily,
  assignmentKey,
  answerDaily,
  answerUnit,
  placeAt,
  changeGoal,
  enqueueReview,
  answerStandalone,
  recordLessonCompletion,
} from "./engine.ts";
import { createLearningPersistence, LEARNING_KEY } from "./persistence.ts";
import type {
  LearningState,
  Level,
  Answer,
  VocabularyRecord,
} from "./types.ts";
import { deliverGardenReward } from "../garden/store.ts";
const persistence = createLearningPersistence(() => progressStorage());
const initialRepository = new LocalVocabularyRepository(
  bundled as VocabularyRecord[],
);
type Snapshot = {
  ready: boolean;
  state: LearningState;
  date: string;
  repository: LocalVocabularyRepository;
  notice: string;
  readonly: boolean;
};
const server: Snapshot = {
  ready: false,
  state: initialLearning(),
  date: "",
  repository: initialRepository,
  notice: "",
  readonly: false,
};
let snapshot = server;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;
const emit = () => listeners.forEach((fn) => fn());
function lexicalRepository() {
  try {
    const key = "deutsch-garden:vocabulary:v1";
    const raw = progressStorage().getItem(key);
    let existing: VocabularyRecord[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        !Array.isArray(parsed) ||
        parsed.some((v) => validateVocabulary(v).length)
      ) {
        if (!progressStorage().getItem(key + ":corrupt"))
          progressStorage().setItem(key + ":corrupt", raw);
      } else existing = parsed;
    }
    const result = importVocabulary(existing, bundled);
    if (
      !raw ||
      result.report.inserted ||
      result.report.updated ||
      existing.length === 0
    )
      progressStorage().setItem(key, JSON.stringify(result.records));
    return new LocalVocabularyRepository(result.records);
  } catch {
    return initialRepository;
  }
}
function commit(state: LearningState, notice?: string) {
  if (snapshot.readonly) return false;
  try {
    persistence.save(state);
  } catch {
    snapshot = {
      ...snapshot,
      notice:
        "Kayıt yazılamadı. Kaybolmaması için yanıtını işlemedim. Tarayıcı depolamasını kontrol et.",
    };
    emit();
    return false;
  }
  snapshot = { ...snapshot, state, notice: notice ?? snapshot.notice };
  emit();
  return true;
}
let flushingRewards = false;
async function flushRewards() {
  if (snapshot.readonly || flushingRewards) return;
  flushingRewards = true;
  try {
    for (const item of snapshot.state.outbox.filter((r) => !r.delivered)) {
      const delivered = await deliverGardenReward({
        id: item.id,
        source: "vocabulary",
        ...(item.kind === "seed"
          ? { seeds: { daisy: item.amount } }
          : { coins: item.amount }),
      });
      if (delivered) {
        const current = snapshot.state;
        if (
          !commit(
            {
              ...current,
              revision: current.revision + 1,
              outbox: current.outbox.map((r) =>
                r.id === item.id ? { ...r, delivered: true } : r,
              ),
            },
            "Kelime emeğinin bahçe ödülü çantana eklendi. 🌱",
          )
        )
          return;
      }
    }
  } finally {
    flushingRewards = false;
  }
}

function tick() {
  if (!snapshot.ready) return;
  const date = localDate();
  if (date !== snapshot.date) {
    snapshot = { ...snapshot, date };
    const next = ensureDaily(snapshot.state, snapshot.repository.all(), date);
    if (next !== snapshot.state)
      commit(next, "Yeni bir gün, yeni kelimeler! 🌸");
    else emit();
  }
}
function initialize() {
  const loaded = persistence.load();
  const repository = lexicalRepository();
  const date = localDate();
  snapshot = {
    ready: true,
    state: loaded.state,
    date,
    repository,
    notice: loaded.notice,
    readonly: loaded.readonly,
  };
  if (!loaded.readonly) {
    const next = ensureDaily(loaded.state, repository.all(), date);
    commit(next);
  }
  flushRewards();
  emit();
}
function storageChanged(event: StorageEvent) {
  if (event.key === LEARNING_KEY) {
    const loaded = persistence.load();
    snapshot = {
      ...snapshot,
      state: loaded.state,
      readonly: loaded.readonly,
      notice: loaded.notice,
    };
    tick();
    emit();
  }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    if (!snapshot.ready) initialize();
    else tick();
    timer = setInterval(tick, 30_000);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("storage", storageChanged);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      if (timer) clearInterval(timer);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("storage", storageChanged);
    }
  };
}
export function useLearning() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => server,
  );
}
export function selectLevel(level: Level) {
  tick();
  const next = ensureDaily(
    placeAt(snapshot.state, level),
    snapshot.repository.all(),
    snapshot.date,
  );
  return commit(
    next,
    "Başlangıç düzeyin seçildi. Bu bir seviye tespit sınavı veya yeterlik belgesi değildir.",
  );
}
export function selectGoal(goal: number) {
  return commit(
    changeGoal(snapshot.state, goal),
    "Yeni hedefin yarınki seçimde kullanılacak. Bugünün listesi korunuyor.",
  );
}
export function respond(id: string, answer: Answer, unitId?: string) {
  tick();
  const date = localDate();
  const next = unitId
    ? answerUnit(
        snapshot.state,
        unitId,
        id,
        answer,
        date,
        snapshot.repository.all(),
      )
    : answerDaily(
        snapshot.state,
        assignmentKey(date, snapshot.state.level),
        id,
        answer,
        date,
        snapshot.repository.all(),
      );
  if (next === snapshot.state) return false;
  if (
    !commit(
      next,
      answer === "known"
        ? "Kaydedildi. Bu kelime bir sonraki tekrar gününde gelecek."
        : "Kaydedildi. Yarın tekrar birlikte bakalım.",
    )
  )
    return false;
  flushRewards();
  return true;
}

export function queueWordReview(id: string) {
  if (!snapshot.ready) initialize();
  const loaded = persistence.load();
  if (loaded.readonly) return false;
  snapshot = { ...snapshot, state: loaded.state };
  const next = enqueueReview(
    loaded.state,
    id,
    localDate(),
    snapshot.repository.all(),
  );
  if (!snapshot.repository.get(id)) return false;
  return (
    next === loaded.state ||
    commit(next, "Kelime tekrar listene eklendi. Önceki yanıtların korundu.")
  );
}
export function reviewStandaloneWord(id: string, answer: Answer) {
  if (!snapshot.ready) initialize();
  const loaded = persistence.load();
  if (loaded.readonly) return false;
  snapshot = { ...snapshot, state: loaded.state };
  const next = answerStandalone(
    loaded.state,
    id,
    answer,
    localDate(),
    snapshot.repository.all(),
  );
  return (
    next !== loaded.state &&
    commit(next, "Tekrarın kaydedildi. Bu kart için ek kaynak ödülü verilmez.")
  );
}

/** Mini-course completion unlocks the existing lesson ID without fabricating SRS responses. */
export function recordCourseMilestone(lessonId: string) {
  if (!snapshot.ready) initialize();
  const loaded = persistence.load();
  if (loaded.readonly) return false;
  snapshot = { ...snapshot, state: loaded.state };
  if (loaded.state.milestones.includes(lessonId)) return true;
  const next = recordLessonCompletion(loaded.state, lessonId);
  if (next === loaded.state) return false;
  return commit(
    next,
    "Mini-kurs tamamlandı; patikadaki mevcut ders kaydın güncellendi.",
  );
}
