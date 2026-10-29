// Node route entry only; never import from a browser component.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes, createHash } from "node:crypto";
import {
  storageMode,
  serverStateStore,
  StateUnavailable,
} from "../server-state/store.ts";
import { CloudBirthdayRepository } from "./cloud-repository.ts";
import { BirthdayServer } from "./server.ts";
const root = globalThis as typeof globalThis & {
  dgBirthdayServer?: { fingerprint: string; server: BirthdayServer };
};
export function birthdayServer() {
  const mode = storageMode();
  const dir =
      process.env.BIRTHDAY_DATA_DIR?.trim() ||
      join(process.cwd(), ".cache/birthday"),
    production = process.env.NODE_ENV === "production";
  let secret =
    process.env.BIRTHDAY_SESSION_SECRET ||
    process.env.LUMI_SESSION_SECRET ||
    "";
  if (mode === "supabase" && secret.length < 32) throw new StateUnavailable();
  if (!production && secret.length < 32) {
    mkdirSync(dir, { recursive: true });
    const file = join(dir, "session-secret");
    try {
      secret = readFileSync(file, "utf8");
    } catch {
      try {
        writeFileSync(file, randomBytes(32).toString("hex"), {
          flag: "wx",
          mode: 0o600,
        });
      } catch {}
      secret = readFileSync(file, "utf8");
    }
  }
  const config = {
    dir,
    production,
    secret,
    creatorPassword: process.env.BIRTHDAY_CREATOR_PASSWORD || "",
    recipientPassword:
      process.env.BIRTHDAY_ACCESS_PASSWORD ||
      process.env.LUMI_ACCESS_PASSWORD ||
      "",
    origin:
      process.env.BIRTHDAY_APP_ORIGIN?.trim() ||
      process.env.LUMI_APP_ORIGIN?.trim() ||
      "",
  };
  const fingerprint = createHash("sha256")
    .update(
      JSON.stringify([
        config,
        mode,
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVER_SECRET_KEY ||
          process.env.SUPABASE_SERVICE_ROLE_KEY,
      ]),
    )
    .digest("hex");
  if (
    root.dgBirthdayServer?.fingerprint === fingerprint &&
    root.dgBirthdayServer.server instanceof BirthdayServer
  )
    return root.dgBirthdayServer.server;
  const repository =
    mode === "supabase"
      ? new CloudBirthdayRepository(serverStateStore())
      : null;
  const server = new BirthdayServer(
    config,
    Date.now,
    repository
      ? { repository, accessAttempt: (now) => repository.accessAttempt(now) }
      : undefined,
  );
  root.dgBirthdayServer = { fingerprint, server };
  return server;
}
export function birthdayUnavailable() {
  return Response.json(
    {
      error: {
        code: "SERVER_ERROR",
        message:
          "Doğum günü hizmeti şu anda kullanılamıyor. Kurucu kalıcı sunucu deposunu ve ortam ayarlarını kontrol etmeli.",
      },
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
