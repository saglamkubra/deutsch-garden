// Server entry points only. Never import into client components.
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
export type Namespace =
  "lumi-ledger-v1" | "birthday-config-v1" | "birthday-access-v1";
export type StateRow = { revision: number; payload: unknown };
export interface StateStore {
  read(key: Namespace): Promise<StateRow>;
  cas(
    key: Namespace,
    expected: number,
    payload: unknown,
    operation: string,
  ): Promise<boolean>;
}
export class StateUnavailable extends Error {
  constructor() {
    super(
      "Kalıcı sunucu kaydına ulaşılamadı. Eski kayıt korunuyor; kurulum ve bağlantı kontrol edilmeli.",
    );
  }
}
export function storageMode(
  env: Record<string, string | undefined> = process.env,
): "local" | "supabase" {
  const selected = env.SERVER_STORAGE?.trim();
  if (selected === "supabase") return "supabase";
  if (
    selected === "local" &&
    (env.NODE_ENV !== "production" ||
      env.SERVER_LOCAL_DISK_CONFIRMED === "true")
  )
    return "local";
  if (!selected && env.NODE_ENV !== "production") return "local";
  throw new StateUnavailable();
}
export function serverStateStore(
  env: Record<string, string | undefined> = process.env,
): StateStore {
  const url = env.SUPABASE_URL?.trim(),
    key = (
      env.SUPABASE_SERVER_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY
    )?.trim();
  if (!url || !key) throw new StateUnavailable();
  try {
    const u = new URL(url);
    if (u.origin !== url.replace(/\/$/, "") || u.protocol !== "https:")
      throw Error();
  } catch {
    throw new StateUnavailable();
  }
  // Reject publishable/anon credentials; never share this client with the user-auth client.
  let privileged = key.startsWith("sb_secret_");
  try {
    privileged ||=
      JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString())
        .role === "service_role";
  } catch {}
  if (!privileged) throw new StateUnavailable();
  const client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        }),
    },
  });
  const rpc = async (name: string, args: Record<string, unknown>) => {
    const { data, error } = await client.rpc(name, args);
    if (error) throw new StateUnavailable();
    return data;
  };
  return {
    async read(key) {
      const x = await rpc("dg_server_state_read", { p_key: key });
      if (
        !x ||
        !Number.isSafeInteger(x.revision) ||
        x.revision < 0 ||
        !("payload" in x)
      )
        throw new StateUnavailable();
      return x;
    },
    async cas(key, expected, payload, operation) {
      // A lost acknowledgement may retry exactly the same operation, never regenerate the AI answer.
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const ok = await rpc("dg_server_state_cas", {
            p_key: key,
            p_expected: expected,
            p_payload: payload,
            p_operation: operation,
          });
          if (typeof ok !== "boolean") throw new StateUnavailable();
          return ok;
        } catch {
          if (attempt) throw new StateUnavailable();
        }
      }
      throw new StateUnavailable();
    },
  };
}
export async function mutateState<T>(
  store: StateStore,
  key: Namespace,
  change: (payload: unknown) => { payload: unknown; result: T },
): Promise<T> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const row = await store.read(key),
      next = change(row.payload);
    if (await store.cas(key, row.revision, next.payload, randomUUID()))
      return next.result;
  }
  throw new StateUnavailable();
}
