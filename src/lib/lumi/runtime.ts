// Server-only entry: never import this module from client components.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { storageMode, serverStateStore } from "../server-state/store.ts";
import { CloudLumiLedger } from "./cloud-ledger.ts";
import { LumiLedger } from "./ledger.ts";
import { LumiService, type LumiConfig } from "./service.ts";
import { DEFAULT_GEMINI_MODEL, verifyGeminiModel } from "./gemini.ts";
import { ProviderFailure } from "./provider.ts";
import { LIMITS } from "./protocol.ts";
function config(): LumiConfig | null {
  const provider =
    process.env.LUMI_PROVIDER?.trim() ||
    (process.env.GEMINI_API_KEY
      ? "gemini"
      : process.env.OPENAI_API_KEY
        ? "openai"
        : "gemini");
  if (provider !== "gemini" && provider !== "openai") return null;
  const key =
      (provider === "gemini"
        ? process.env.GEMINI_API_KEY
        : process.env.OPENAI_API_KEY
      )?.trim() ?? "",
    model =
      (provider === "gemini"
        ? process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL
        : process.env.OPENAI_MODEL?.trim()) ?? "",
    production = process.env.NODE_ENV === "production",
    password = process.env.LUMI_ACCESS_PASSWORD ?? "",
    origin = process.env.LUMI_APP_ORIGIN?.trim() ?? "";
  let secret = process.env.LUMI_SESSION_SECRET ?? "";
  if (
    !key ||
    !model ||
    !/^[-a-zA-Z0-9._:]{1,100}$/.test(model) ||
    (password && password.length < 12)
  )
    return null;
  if (production && (!password || secret.length < 32 || !origin)) return null;
  if (origin) {
    try {
      const url = new URL(origin);
      if (
        url.origin !== origin ||
        (url.protocol !== "https:" &&
          !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
      )
        return null;
    } catch {
      return null;
    }
  }
  if (storageMode() === "supabase" && secret.length < 32) return null;
  if (secret.length < 32) {
    const dir =
      process.env.LUMI_DATA_DIR?.trim() || join(process.cwd(), ".cache/lumi");
    mkdirSync(dir, { recursive: true });
    const path = join(dir, "session-secret");
    try {
      secret = readFileSync(path, "utf8");
    } catch {
      try {
        writeFileSync(path, randomBytes(32).toString("hex"), {
          flag: "wx",
          mode: 0o600,
        });
      } catch {}
      secret = readFileSync(path, "utf8");
    }
  }
  return { provider, key, model, production, password, origin, secret };
}
const globalService = globalThis as typeof globalThis & {
  deutschGardenLumi?: { fingerprint: string; service: LumiService };
};
export async function lumiService() {
  const mode = storageMode();
  const c = config();
  if (!c) return null;
  if (c.provider === "gemini") await verifyGeminiModel(c.key, c.model);
  const fingerprint = [
    c.provider,
    mode,
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVER_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.LUMI_DATA_DIR,
    c.model,
    c.origin,
    c.production,
    c.password,
    c.secret,
    c.key,
  ].join("|");
  if (
    globalService.deutschGardenLumi?.fingerprint === fingerprint &&
    globalService.deutschGardenLumi.service instanceof LumiService
  )
    return globalService.deutschGardenLumi.service;
  globalService.deutschGardenLumi?.service.ledger.close();
  const dir =
    process.env.LUMI_DATA_DIR?.trim() || join(process.cwd(), ".cache/lumi");
  if (mode === "local") mkdirSync(dir, { recursive: true });
  const ledger =
    mode === "supabase"
      ? new CloudLumiLedger(serverStateStore())
      : new LumiLedger(join(dir, "usage.sqlite"));
  const service = new LumiService(c, ledger);
  globalService.deutschGardenLumi = { fingerprint, service };
  return service;
}
export function setupResponse(status = 503) {
  return Response.json(
    {
      configured: false,
      accessRequired: false,
      authenticated: false,
      remaining: 0,
      limits: LIMITS,
      error: {
        code: "SETUP_REQUIRED",
        message:
          "Lumi için sunucuda GEMINI_API_KEY ve GEMINI_MODEL ayarlanmalı (LUMI_PROVIDER=gemini). Üretimde ayrıca erişim parolası, oturum sırrı, uygulama adresi ve kalıcı sunucu deposu ayarlanmalı.",
        retryAfter: 0,
      },
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
export function runtimeFailure(error?: unknown) {
  if (error instanceof ProviderFailure) {
    const messages: Record<string, string> = {
      INVALID_MODEL:
        "GEMINI_MODEL bulunamadı veya metin üretimini desteklemiyor. Model kimliğini kontrol et.",
      PROVIDER_ACCESS:
        "Gemini anahtarı veya model erişim izni geçersiz. Sunucu ayarlarını kontrol et.",
      PROVIDER_LIMIT:
        "Gemini kotası doldu. Biraz sonra bağlantıyı yeniden kontrol et.",
      PROVIDER_UNAVAILABLE:
        "Gemini model erişimi doğrulanamadı. Bağlantıyı biraz sonra yeniden kontrol et.",
    };
    return Response.json(
      {
        configured: false,
        accessRequired: false,
        authenticated: false,
        remaining: 0,
        error: {
          code: error.code,
          message: messages[error.code] || messages.PROVIDER_UNAVAILABLE,
          retryAfter: 30,
        },
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store", "Retry-After": "30" },
      },
    );
  }
  return Response.json(
    {
      error: {
        code: "SERVER_UNAVAILABLE",
        message:
          "Lumi sunucusu veya kullanım kaydı şu anda kullanılamıyor. Biraz sonra yeniden dene.",
        retryAfter: 0,
      },
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
