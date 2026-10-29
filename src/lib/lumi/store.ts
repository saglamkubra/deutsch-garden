"use client";
import { progressStorage } from "../account/storage.ts";
import { useSyncExternalStore } from "react";
import type { Level } from "../learning/types";
import { LUMI_REWARDS } from "./protocol";
import type {
  TutorMode,
  CorrectionStyle,
  TutorResult,
  TutorWord,
} from "./protocol";
import {
  initialLumi,
  newChat,
  queueMessage,
  receiveReply,
  removeChat,
  saveTutorWord,
} from "./model";
import type { LumiState } from "./model";
import { createLumiPersistence, LUMI_KEY } from "./persistence";
import { queueWordReview } from "../learning/store";
import { deliverLearningXp } from "../exercises/store";
import { deliverGardenReward } from "../garden/store";
const persistence = createLumiPersistence(() => progressStorage()),
  server = { ready: false, state: initialLumi(), readonly: false, notice: "" };
let snapshot = server;
const listeners = new Set<() => void>(),
  emit = () => listeners.forEach((f) => f());
function load() {
  snapshot = { ready: true, ...persistence.load() };
  emit();
}
async function mutate(fn: (s: LumiState) => LumiState, purge = false) {
  const run = () => {
    load();
    if (snapshot.readonly) return false;
    const next = fn(snapshot.state);
    if (next === snapshot.state) return true;
    try {
      persistence.save(next, purge);
      snapshot = { ...snapshot, state: next };
      emit();
      return true;
    } catch {
      snapshot = {
        ...snapshot,
        notice:
          "Sohbet kaydedilemedi. Depolama alanını kontrol et; mesajın gönderilmedi veya son yanıt henüz kayda alınamadı.",
      };
      emit();
      return false;
    }
  };
  return navigator.locks ? await navigator.locks.request(LUMI_KEY, run) : run();
}
function changed(e: StorageEvent) {
  if (e.key === LUMI_KEY) load();
}
function subscribe(f: () => void) {
  listeners.add(f);
  if (listeners.size === 1) {
    load();
    window.addEventListener("storage", changed);
  }
  return () => {
    listeners.delete(f);
    if (!listeners.size) window.removeEventListener("storage", changed);
  };
}
export const useLumi = () =>
  useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => server,
  );
export const lumiSnapshot = () => snapshot;
export const createLumiChat = (
  level: Level,
  mode: TutorMode,
  correction: CorrectionStyle,
) =>
  mutate((s) =>
    newChat(s, crypto.randomUUID(), level, mode, correction, Date.now()),
  );
export const selectLumiChat = (id: string) =>
  mutate((s) =>
    s.conversations.some((c) => c.id === id) ? { ...s, active: id } : s,
  );
export const consentLumi = (value: boolean) =>
  mutate((s) => ({ ...s, consent: value }));
export const queueLumiRequest = (
  cid: string,
  id: string,
  action: "message" | "finish",
  text: string,
) => mutate((s) => queueMessage(s, cid, id, action, text, Date.now()));
export const receiveLumiReply = (cid: string, result: TutorResult) =>
  mutate((s) => receiveReply(s, cid, result, Date.now()));
export const deleteLumiChat = (id: string) =>
  mutate((s) => removeChat(s, id), true);
export const collectLumiWord = (word: TutorWord, repositoryId: string | null) =>
  mutate((s) => {
    if (repositoryId && !queueWordReview(repositoryId)) return s;
    return saveTutorWord(s, word, repositoryId);
  });
export async function flushLumiRewards() {
  for (const c of snapshot.state.claims.filter((c) => !c.delivered)) {
    try {
      const response = await fetch("/api/lumi/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c.receipt),
      });
      if (!response.ok) continue;
      const verified = await response.json();
      if (
        verified.id !== c.receipt.id ||
        verified.xp !== LUMI_REWARDS.practiceXp ||
        verified.coins !== LUMI_REWARDS.practiceCoins
      )
        continue;
      if (!(await deliverLearningXp(verified.id, LUMI_REWARDS.practiceXp)))
        continue;
      if (
        !(await deliverGardenReward({
          id: verified.id,
          source: "conversation",
          coins: LUMI_REWARDS.practiceCoins,
        }))
      )
        continue;
      await mutate((s) => ({
        ...s,
        claims: s.claims.map((x) =>
          x.receipt.id === verified.id ? { ...x, delivered: true } : x,
        ),
      }));
    } catch {
      break;
    }
  }
}
