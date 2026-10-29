"use client";
import { useSyncExternalStore } from "react";
import { validConfig, type BirthdayStatus } from "./model.ts";
import { nextGardenDay } from "../garden/calendar.ts";
const initial = {
  ready: false,
  status: null as BirthdayStatus | null,
  error: "",
  now: 0,
};
let snapshot = initial,
  anchor = 0,
  receivedAt = 0,
  lastFetch = 0;
const listeners = new Set<() => void>();
let pending: Promise<void> | null = null,
  timer: ReturnType<typeof setInterval> | null = null;
const emit = () => listeners.forEach((f) => f());
export async function birthdayJson(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store" });
  let data;
  try {
    data = await response.json();
  } catch {
    throw Error("Doğum günü sunucusu okunabilir bir yanıt vermedi.");
  }
  if (!response.ok)
    throw Error(
      typeof data?.error?.message === "string"
        ? data.error.message
        : "Doğum günü isteği tamamlanamadı.",
    );
  return data;
}
export function refreshBirthday() {
  if (pending) return pending;
  pending = (async () => {
    try {
      const data = await birthdayJson("/api/birthday");
      if (
        !["hidden", "countdown", "active", "past"].includes(data.state) ||
        !Number.isSafeInteger(data.serverNow) ||
        (data.event !== undefined && !validConfig(data.event))
      )
        throw Error("Doğum günü durumu doğrulanamadı.");
      anchor = data.serverNow;
      receivedAt = performance.now();
      lastFetch = anchor;
      snapshot = { ready: true, status: data, error: "", now: anchor };
    } catch (e) {
      snapshot = {
        ...snapshot,
        ready: true,
        error:
          e instanceof Error ? e.message : "Doğum günü bağlantısı kurulamadı.",
      };
    } finally {
      emit();
    }
  })().finally(() => {
    pending = null;
  });
  return pending;
}
function onVisible() {
  if (
    document.visibilityState === "visible" &&
    performance.now() - receivedAt > 60000
  )
    void refreshBirthday();
}
function subscribe(f: () => void) {
  listeners.add(f);
  if (listeners.size === 1) {
    void refreshBirthday();
    timer = setInterval(() => {
      if (!anchor) return;
      const now = anchor + Math.max(0, performance.now() - receivedAt);
      snapshot = { ...snapshot, now };
      emit();
      if (now >= nextGardenDay(lastFetch)) void refreshBirthday();
    }, 60000);
    document.addEventListener("visibilitychange", onVisible);
  }
  return () => {
    listeners.delete(f);
    if (!listeners.size) {
      if (timer) clearInterval(timer);
      timer = null;
      document.removeEventListener("visibilitychange", onVisible);
    }
  };
}
export function useBirthday() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => initial,
  );
}
