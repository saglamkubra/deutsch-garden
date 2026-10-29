"use client";
import { progressStorage } from "../account/storage.ts";
import { useSyncExternalStore } from "react";
import type { CourseState } from "./types";
import {
  initialCourses,
  openCourse,
  markCourseReading,
  submitCourseAnswer,
  nextCourseQuestion,
  confirmCourseSummary,
  COURSE_REWARDS,
} from "./engine";
import { createCoursePersistence, COURSE_KEY } from "./persistence";
import { queueWordReview, recordCourseMilestone } from "../learning/store";
import { deliverLearningXp } from "../exercises/store";
import { deliverGardenReward } from "../garden/store";
const persistence = createCoursePersistence(() => progressStorage());
const server = {
  ready: false,
  state: initialCourses(),
  readonly: false,
  notice: "",
};
let snapshot = server;
const listeners = new Set<() => void>(),
  emit = () => listeners.forEach((f) => f());
function load() {
  snapshot = { ready: true, ...persistence.load() };
  emit();
}
function save(state: CourseState) {
  try {
    persistence.save(state);
    snapshot = { ...snapshot, state };
    emit();
    return true;
  } catch {
    snapshot = {
      ...snapshot,
      notice:
        "Ders kaydı yazılamadı. Son kayıt korundu; depolama alanını kontrol et.",
    };
    emit();
    return false;
  }
}
async function flush() {
  for (const r of snapshot.state.reviewQueue.filter((r) => !r.delivered))
    if (queueWordReview(r.wordId)) {
      if (
        !save({
          ...snapshot.state,
          reviewQueue: snapshot.state.reviewQueue.map((x) =>
            x.id === r.id ? { ...x, delivered: true } : x,
          ),
        })
      )
        return;
    }
  for (const c of snapshot.state.claims.filter((c) => !c.delivered)) {
    if (!recordCourseMilestone(c.lessonId)) continue;
    if (!(await deliverLearningXp(c.id, COURSE_REWARDS.lessonXp))) continue;
    if (
      await deliverGardenReward({
        id: c.id,
        source: "exercise",
        coins: COURSE_REWARDS.lessonCoins,
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
  }
}
async function mutate(fn: (s: CourseState) => CourseState) {
  const run = async () => {
    load();
    if (snapshot.readonly) return;
    const next = fn(snapshot.state);
    if (next === snapshot.state || save(next)) {
      try {
        await flush();
      } catch {
        snapshot = {
          ...snapshot,
          notice: "Yanıtın kayıtlı; tekrar veya ödül aktarımı bekliyor.",
        };
        emit();
      }
    }
  };
  return navigator.locks
    ? await navigator.locks.request(COURSE_KEY, run)
    : await run();
}
function changed(e: StorageEvent) {
  if (e.key === COURSE_KEY) load();
}
function subscribe(f: () => void) {
  listeners.add(f);
  if (listeners.size === 1) {
    load();
    void mutate((s) => s);
    window.addEventListener("storage", changed);
  }
  return () => {
    listeners.delete(f);
    if (!listeners.size) window.removeEventListener("storage", changed);
  };
}
export const useCourses = () =>
  useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => server,
  );
export const startMiniCourse = (id: string) =>
  mutate((s) => openCourse(s, id, Date.now()));
export const acknowledgeCourse = (
  id: string,
  section: "read" | "examples",
  itemId: string,
) => mutate((s) => markCourseReading(s, id, section, itemId, Date.now()));
export const answerCourse = (
  id: string,
  mode: "guided" | "independent" | "review",
  qid: string,
  value: string,
) => mutate((s) => submitCourseAnswer(s, id, mode, qid, value, Date.now()));
export const advanceCourse = (id: string, mode: "guided" | "independent") =>
  mutate((s) => nextCourseQuestion(s, id, mode, Date.now()));
export const finishMiniCourse = (id: string) =>
  mutate((s) => confirmCourseSummary(s, id, Date.now()));
export const retryCourseDelivery = () => mutate((s) => s);
