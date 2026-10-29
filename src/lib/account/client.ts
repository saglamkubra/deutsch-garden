"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { PublicAccountConfig } from "./config.ts";
let client: SupabaseClient | null = null;
let configuration: PublicAccountConfig = { configured: false };
export const accountClient = () => client;
export const publicConfiguration = () => configuration;
export async function connectAccount() {
  const r = await fetch("/api/account/config", {
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error("network config");
  configuration = await r.json();
  if (configuration.configured && configuration.url && configuration.key)
    client ??= createClient(configuration.url, configuration.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storageKey: "deutsch-garden:auth",
      },
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            signal: init?.signal ?? AbortSignal.timeout(20000),
          }),
      },
    });
  return client;
}
