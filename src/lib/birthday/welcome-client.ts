"use client";
import { useSyncExternalStore } from "react";
import { validWelcomeStatus, type WelcomeStatus } from "./welcome-model.ts";
const initial = {
  ready: false,
  status: null as WelcomeStatus | null,
  error: "",
  dismissed: false,
};
let snapshot = initial,
  pending: Promise<void> | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((f) => f());
export async function welcomeJson(url: string, init?: RequestInit) {
  let r: Response;
  try {
    r = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      "Karşılama hizmetine ulaşılamadı. Bağlantını kontrol edip yeniden dene; bahçen korunuyor.",
    );
  }
  const data = await r.json().catch(() => null);
  if (!r.ok || !data)
    throw new Error(
      typeof data?.error?.message === "string"
        ? data.error.message
        : "Karşılama yanıtı okunamadı. Bahçen korunuyor; yeniden dene.",
    );
  return data;
}
export function refreshWelcome() {
  if (pending) return pending;
  pending = (async () => {
    try {
      const data = await welcomeJson("/api/birthday/welcome");
      if (!validWelcomeStatus(data))
        throw new Error("Karşılama ayarı doğrulanamadı.");
      snapshot = { ...snapshot, ready: true, status: data, error: "" };
    } catch {
      snapshot = {
        ...snapshot,
        ready: true,
        error:
          "Karşılama hizmetine ulaşılamadı. Öğrenmeye devam edebilir veya yeniden deneyebilirsin.",
      };
    }
    emit();
  })().finally(() => {
    pending = null;
  });
  return pending;
}
const subscribe = (f: () => void) => {
  listeners.add(f);
  if (listeners.size === 1 && !snapshot.ready) void refreshWelcome();
  return () => {
    listeners.delete(f);
  };
};
const inactive = () => () => {};
export const useBirthdayWelcome = (enabled = true) =>
  useSyncExternalStore(
    enabled ? subscribe : inactive,
    () => (enabled ? snapshot : initial),
    () => initial,
  );
export function dismissWelcomeForSession() {
  snapshot = { ...snapshot, dismissed: true };
  emit();
}
