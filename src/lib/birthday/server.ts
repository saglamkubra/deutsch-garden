// Server-only: private configuration must never be imported by client components.
import { readFile, writeFile, mkdir, rename, unlink } from "node:fs/promises";
import { join } from "node:path";
import {
  randomUUID,
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import {
  validConfig,
  validDraft,
  publicBirthday,
  DEFAULT_LETTER,
  type BirthdayConfig,
} from "./model.ts";
export class BirthdayError extends Error {
  status: number;
  constructor(code: string, status = 400) {
    super(code);
    this.status = status;
  }
}
export interface BirthdayStorage {
  read(): Promise<BirthdayConfig | null>;
  save(input: unknown): Promise<BirthdayConfig>;
}
export function prepareBirthdayConfig(
  input: unknown,
  previous: BirthdayConfig | null,
): BirthdayConfig {
  if (!input || typeof input !== "object")
    throw new BirthdayError("BAD_REQUEST");
  const x = input as Record<string, unknown>;
  if (
    !validDraft(x.draft) ||
    !Number.isSafeInteger(x.expectedRevision) ||
    typeof x.newEvent !== "boolean"
  )
    throw new BirthdayError("BAD_REQUEST");
  if (x.expectedRevision !== (previous?.revision ?? 0))
    throw new BirthdayError("REVISION_CONFLICT", 409);
  const d = x.draft;
  const config: BirthdayConfig = {
    version: 1,
    id: !previous || x.newEvent ? randomUUID() : previous.id,
    revision: (previous?.revision ?? 0) + 1,
    date: d.date,
    recipientName: d.recipientName.trim(),
    senderName: d.senderName.trim(),
    greeting:
      d.greeting.trim() || "Bugün Deutsch Garden’ın en güzel çiçeği sensin.",
    letter: d.letter.trim() || DEFAULT_LETTER,
    showCountdown: d.showCountdown,
  };

  return config;
}
const locks = new Map<string, Promise<unknown>>();
export class BirthdayRepository {
  dir: string;
  constructor(dir: string) {
    this.dir = dir;
  }
  async read(): Promise<BirthdayConfig | null> {
    try {
      const data = JSON.parse(
        await readFile(join(this.dir, "config.json"), "utf8"),
      );
      if (!validConfig(data)) throw new BirthdayError("CONFIG_CORRUPT", 503);
      return data;
    } catch (e) {
      if (e && typeof e === "object" && "code" in e && e.code === "ENOENT")
        return null;
      throw e;
    }
  }
  async save(input: unknown): Promise<BirthdayConfig> {
    const run = async () => {
      const config = prepareBirthdayConfig(input, await this.read());
      await mkdir(this.dir, { recursive: true });
      const temp = join(this.dir, "config-" + randomUUID() + ".tmp");
      try {
        await writeFile(temp, JSON.stringify(config), {
          encoding: "utf8",
          mode: 0o600,
          flag: "wx",
        });
        await rename(temp, join(this.dir, "config.json"));
      } finally {
        await unlink(temp).catch(() => {});
      }
      return config;
    };
    const result = (locks.get(this.dir) ?? Promise.resolve()).then(run, run);
    locks.set(
      this.dir,
      result.catch(() => undefined),
    );
    return result;
  }
}
export type BirthdayServerConfig = {
  dir: string;
  creatorPassword: string;
  recipientPassword: string;
  secret: string;
  origin: string;
  production: boolean;
};
const messages: Record<string, string> = {
  BAD_REQUEST: "Bilgileri ve mektup uzunluğunu kontrol et.",
  ORIGIN_DENIED: "Bu adresten doğum günü isteği kabul edilmiyor.",
  ACCESS_REQUIRED: "Bu alan için erişim parolasını gir.",
  CREATOR_SETUP:
    "Kurucu erişimi için sunucuda doğum günü parolası ve oturum ayarları hazırlanmalı.",
  RATE_LIMIT: "Çok fazla deneme yapıldı. Biraz sonra yeniden dene.",
  NOT_READY: "Sürpriz henüz hazır değil; doğru günü bekleyelim.",
  CONFIG_CORRUPT:
    "Doğum günü ayarı okunamadı. Eski dosya korundu; kurucu ayarı kontrol etmeli.",
  REVISION_CONFLICT:
    "Ayar başka bir sekmede değişti. Yazdıklarını koruyup kayıtlı ayarı yeniden yükle.",
  SERVER_ERROR:
    "Doğum günü hizmeti şu anda kullanılamıyor. Biraz sonra yeniden dene.",
};
function json(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}
function equal(a: string, b: string) {
  return timingSafeEqual(
    createHash("sha256").update(a).digest(),
    createHash("sha256").update(b).digest(),
  );
}
export class BirthdayServer {
  config: BirthdayServerConfig;
  repository: BirthdayStorage;
  accessAttempt?: (now: number) => Promise<void>;
  clock: () => number;
  attempts: number[] = [];
  constructor(
    config: BirthdayServerConfig,
    clock: () => number = Date.now,
    storage?: {
      repository: BirthdayStorage;
      accessAttempt: (now: number) => Promise<void>;
    },
  ) {
    this.config = config;
    this.repository = storage?.repository ?? new BirthdayRepository(config.dir);
    this.accessAttempt = storage?.accessAttempt;
    this.clock = clock;
  }
  origin(request: Request, post = false) {
    const url = new URL(request.url),
      raw =
        this.config.origin ||
        (!this.config.production
          ? url.protocol + "//" + (request.headers.get("host") || url.host)
          : "");
    if (!raw) throw new BirthdayError("ORIGIN_DENIED", 403);
    let expected: URL;
    try {
      expected = new URL(raw);
    } catch {
      throw new BirthdayError("ORIGIN_DENIED", 403);
    }
    const loopback = ["localhost", "127.0.0.1", "[::1]"];
    if (
      expected.origin !== raw ||
      (!this.config.production &&
        !this.config.origin &&
        !loopback.includes(expected.hostname)) ||
      (expected.protocol !== "https:" &&
        !loopback.includes(expected.hostname)) ||
      (request.headers.get("host") || url.host) !== expected.host ||
      (post && request.headers.get("origin") !== expected.origin)
    )
      throw new BirthdayError("ORIGIN_DENIED", 403);
  }
  authenticated(request: Request, role: "creator" | "recipient") {
    if (!this.config.secret) return false;
    const raw = request.headers
      .get("cookie")
      ?.split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith(`dg_birthday_${role}=`))
      ?.split("=")
      .slice(1)
      .join("=");
    const parts = raw?.split(".");
    if (
      !parts ||
      parts.length !== 3 ||
      !/^\d+$/.test(parts[0]) ||
      Number(parts[0]) < this.clock() ||
      !/^[-a-zA-Z0-9]{8,80}$/.test(parts[1])
    )
      return false;
    const signature = createHmac("sha256", this.config.secret)
      .update(role + ":" + parts.slice(0, 2).join("."))
      .digest("hex");
    return equal(signature, parts[2]);
  }
  cookie(request: Request, role: "creator" | "recipient", expire = false) {
    const value = `${this.clock() + 4 * 3600000}.${randomUUID()}`,
      signature = createHmac("sha256", this.config.secret)
        .update(role + ":" + value)
        .digest("hex");
    return `dg_birthday_${role}=${expire ? "" : value + "." + signature}; HttpOnly; Path=/api/birthday; SameSite=Strict; Max-Age=${expire ? 0 : 14400}${this.config.production || new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
  }
  creatorReady() {
    return (
      this.config.creatorPassword.length >= 12 &&
      this.config.secret.length >= 32
    );
  }
  async body(request: Request) {
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      throw new BirthdayError("BAD_REQUEST");
    const reader = request.body?.getReader();
    if (!reader) throw new BirthdayError("BAD_REQUEST");
    let total = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > 49152) {
        await reader.cancel();
        throw new BirthdayError("BAD_REQUEST", 413);
      }
      chunks.push(value);
    }
    const buffer = new Uint8Array(total);
    let at = 0;
    for (const c of chunks) {
      buffer.set(c, at);
      at += c.length;
    }
    try {
      return JSON.parse(new TextDecoder().decode(buffer));
    } catch {
      throw new BirthdayError("BAD_REQUEST");
    }
  }
  error(e: unknown) {
    const code = e instanceof BirthdayError ? e.message : "SERVER_ERROR";
    return json(
      { error: { code, message: messages[code] ?? messages.SERVER_ERROR } },
      e instanceof BirthdayError ? e.status : 503,
      code === "RATE_LIMIT" ? { "Retry-After": "900" } : {},
    );
  }
  async publicStatus(request: Request) {
    try {
      this.origin(request);
      const status = publicBirthday(await this.repository.read(), this.clock());
      if (
        status.event &&
        this.config.recipientPassword &&
        !this.authenticated(request, "recipient")
      )
        return json({
          state: status.state,
          serverNow: status.serverNow,
          accessRequired: true,
          authenticated: false,
        });
      return json({ ...status, authenticated: true });
    } catch (e) {
      return this.error(e);
    }
  }
  async creatorStatus(request: Request) {
    try {
      this.origin(request);
      if (!this.creatorReady())
        return json({ setupRequired: true, authenticated: false });
      if (!this.authenticated(request, "creator"))
        return json({ setupRequired: false, authenticated: false });
      return json({
        setupRequired: false,
        authenticated: true,
        config: await this.repository.read(),
      });
    } catch (e) {
      return this.error(e);
    }
  }
  async login(request: Request) {
    try {
      this.origin(request, true);
      const body = await this.body(request);
      if (
        !body ||
        !["creator", "recipient"].includes(body.role) ||
        typeof body.password !== "string" ||
        body.password.length > 200
      )
        throw new BirthdayError("BAD_REQUEST");
      const role = body.role as "creator" | "recipient";
      if (
        this.config.secret.length < 32 ||
        (role === "creator" && !this.creatorReady())
      )
        throw new BirthdayError("CREATOR_SETUP", 503);
      if (this.accessAttempt) await this.accessAttempt(this.clock());
      else {
        this.attempts = this.attempts.filter((t) => t > this.clock() - 900000);
        if (this.attempts.length >= 8)
          throw new BirthdayError("RATE_LIMIT", 429);
        this.attempts.push(this.clock());
      }
      const expected =
        role === "creator"
          ? this.config.creatorPassword
          : this.config.recipientPassword;
      if (!expected || !equal(body.password, expected))
        throw new BirthdayError("ACCESS_REQUIRED", 401);
      return json({ ok: true }, 200, {
        "Set-Cookie": this.cookie(request, role),
      });
    } catch (e) {
      return this.error(e);
    }
  }
  async save(request: Request) {
    try {
      this.origin(request, true);
      if (!this.creatorReady() || !this.authenticated(request, "creator"))
        throw new BirthdayError("ACCESS_REQUIRED", 401);
      return json({
        config: await this.repository.save(await this.body(request)),
      });
    } catch (e) {
      return this.error(e);
    }
  }
  async open(request: Request) {
    try {
      this.origin(request, true);
      if (
        this.config.recipientPassword &&
        !this.authenticated(request, "recipient")
      )
        throw new BirthdayError("ACCESS_REQUIRED", 401);
      const config = await this.repository.read(),
        now = this.clock();
      if (!config || publicBirthday(config, now).event === undefined)
        throw new BirthdayError("NOT_READY", 409);
      return json({ event: config, openedAt: now });
    } catch (e) {
      return this.error(e);
    }
  }
  async logout(request: Request) {
    try {
      this.origin(request, true);
      return json({ ok: true }, 200, {
        "Set-Cookie": this.cookie(request, "creator", true),
      });
    } catch (e) {
      return this.error(e);
    }
  }
}
