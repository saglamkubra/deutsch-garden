import {
  createHmac,
  randomUUID,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import {
  validRequest,
  validReceipt,
  validId,
  LIMITS,
  LUMI_REWARDS,
} from "./protocol.ts";
import type { TutorResult } from "./protocol.ts";
import { callTutor, ProviderFailure } from "./provider.ts";
import { callGeminiTutor } from "./gemini.ts";
import type { LedgerPort } from "./cloud-ledger.ts";
import { TutorError } from "./ledger.ts";
export type LumiConfig = {
  provider?: "gemini" | "openai";
  key: string;
  model: string;
  secret: string;
  password: string;
  origin: string;
  production: boolean;
};
const COOKIE = "dg_lumi_session";
const ERRORS: Record<string, string> = {
  STORAGE_UNAVAILABLE:
    "Kalıcı kullanım kaydı şu anda kullanılamıyor. Kayıtlar korunuyor; biraz sonra yeniden dene.",
  INVALID_MODEL:
    "Seçilen Gemini modeli bulunamadı veya metin üretimini desteklemiyor. Sunucudaki GEMINI_MODEL değerini kontrol et.",
  PROVIDER_ACCESS:
    "AI anahtarı geçersiz veya seçilen modele erişim izni yok. Sunucu ayarlarını kontrol et.",
  SETUP_REQUIRED:
    "Lumi için sunucu kurulumu gerekiyor. Sağlayıcı anahtarı ve model henüz hazır değil.",
  ACCESS_REQUIRED: "Sohbet için uygulama erişim parolasını gir.",
  ACCESS_DENIED: "Bu konuşmaya erişilemiyor.",
  BAD_REQUEST: "İstek uygun değil. Mesajı ve konuşma sınırlarını kontrol et.",
  ORIGIN_DENIED: "Bu adresten sohbet isteği kabul edilmiyor.",
  RATE_LIMIT: "Biraz soluklanalım. Kısa süre sonra yeniden deneyebilirsin.",
  DAILY_LIMIT:
    "Bugünkü AI kullanım sınırına ulaşıldı. Yarın devam edebilirsin.",
  HISTORY_CONFLICT:
    "Sunucudaki konuşmayla cihaz kaydı uyuşmuyor. Yeni konuşma aç; mevcut geçmişin korunur.",
  SETTINGS_CONFLICT:
    "Bu konuşmanın düzey ve modu sabit. Yeni konuşma açabilirsin.",
  CLOSED: "Bu konuşma kapandı. Yeni konuşmayla devam et.",
  BUSY: "Bu konuşmada bir yanıt zaten hazırlanıyor. Biraz sonra tekrar dene.",
  REQUEST_CONFLICT:
    "Bu istek yeniden kullanılamıyor. Yeni konuşma açabilirsin.",
  SESSION_LIMIT:
    "Bu konuşmanın 12 yanıtlık sınırına ulaşıldı. Özeti alıp yeni konuşma aç.",
  RETRY_EXPIRED:
    "Önceki yanıt sunucuda tamamlandı ama kısa süreli kopyası artık yok. Yeni konuşma aç; geçmişin silinmez.",
  PROVIDER_LIMIT:
    "AI sağlayıcısının kotasına ulaşıldı. Biraz sonra yeniden dene.",
  PROVIDER_REFUSAL:
    "Bu istek için yanıt üretilemedi. Almanca öğrenmeyle ilgili farklı bir konu deneyebilirsin.",
  PROVIDER_ERROR:
    "AI sağlayıcısı yanıt veremedi. Kurulum veya sağlayıcı kotası kontrol edilmeli.",
  PROVIDER_UNAVAILABLE:
    "AI bağlantısı zaman aşımına uğradı veya kurulamadı. Yeniden deneyebilirsin.",
  INVALID_PROVIDER_RESPONSE:
    "AI yanıtı doğrulanamadı; sohbetine eklenmedi. Yeniden deneyebilirsin.",
  INCOMPLETE_RESPONSE:
    "AI yanıtı tamamlanamadı. Daha kısa bir mesajla yeniden deneyebilirsin.",
};
function json(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}
function equal(a: string, b: string) {
  const x = createHash("sha256").update(a).digest(),
    y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
}
export class LumiService {
  config: LumiConfig;
  ledger: LedgerPort;
  fetcher: typeof fetch;
  clock: () => number;
  cache = new Map<
    string,
    {
      owner: string;
      conversationId: string;
      expires: number;
      result: TutorResult;
    }
  >();
  constructor(
    config: LumiConfig,
    ledger: LedgerPort,
    fetcher: typeof fetch = fetch,
    clock: () => number = Date.now,
  ) {
    this.config = config;
    this.ledger = ledger;
    this.fetcher = fetcher;
    this.clock = clock;
  }
  origin(request: Request, post = false) {
    const url = new URL(request.url);
    const expected =
      this.config.origin ||
      (!this.config.production && request.headers.get("host")
        ? new URL(`${url.protocol}//${request.headers.get("host")}`).origin
        : url.origin);
    const expectedUrl = new URL(expected);
    const loopback = (host: string) =>
      ["127.0.0.1", "localhost", "[::1]"].includes(host);
    // Next dev can normalize request.url to localhost despite a 127.0.0.1 Host.
    // Accept this alias only locally, with the exact configured Host and port.
    const localAlias =
      !this.config.production &&
      loopback(url.hostname) &&
      loopback(expectedUrl.hostname) &&
      url.protocol === expectedUrl.protocol &&
      url.port === expectedUrl.port &&
      request.headers.get("host") === expectedUrl.host;
    if (
      (this.config.production && !this.config.origin) ||
      (url.origin !== expected && !localAlias) ||
      (request.headers.has("host") &&
        request.headers.get("host") !== expectedUrl.host) ||
      (!this.config.production &&
        !this.config.origin &&
        (!loopback(url.hostname) || !loopback(expectedUrl.hostname))) ||
      (post && request.headers.get("origin") !== expected)
    )
      throw new TutorError(403, "ORIGIN_DENIED");
  }
  signed(id: string, access: boolean) {
    const value = [id, this.clock() + 7 * 86400000, access ? "1" : "0"].join(
      ".",
    );
    return (
      value +
      "." +
      createHmac("sha256", this.config.secret).update(value).digest("hex")
    );
  }
  identity(request: Request) {
    const raw = request.headers
        .get("cookie")
        ?.split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith(COOKIE + "="))
        ?.slice(COOKIE.length + 1),
      parts = raw?.split(".");
    if (
      !parts ||
      parts.length !== 4 ||
      !validId(parts[0]) ||
      !Number.isFinite(Number(parts[1])) ||
      Number(parts[1]) < this.clock()
    )
      return null;
    const signature = createHmac("sha256", this.config.secret)
      .update(parts.slice(0, 3).join("."))
      .digest("hex");
    return equal(signature, parts[3])
      ? { id: parts[0], access: parts[2] === "1" }
      : null;
  }
  cookie(request: Request, id: string, access: boolean) {
    return `${COOKIE}=${this.signed(id, access)}; HttpOnly; Path=/api/lumi; SameSite=Strict; Max-Age=604800${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
  }
  owner(request: Request) {
    const who = this.identity(request);
    if (!who || (this.config.password && !who.access))
      throw new TutorError(401, "ACCESS_REQUIRED");
    return who.id;
  }
  async status(request: Request) {
    try {
      this.origin(request);
      const who = this.identity(request),
        id = who?.id ?? randomUUID();
      return json(
        {
          configured: true,
          accessRequired: !!this.config.password,
          authenticated: !this.config.password || !!who?.access,
          remaining: await this.ledger.remaining(id, this.clock()),
          limits: LIMITS,
        },
        200,
        { "Set-Cookie": this.cookie(request, id, !!who?.access) },
      );
    } catch (e) {
      return this.error(e);
    }
  }
  error(e: unknown) {
    const code =
        e instanceof TutorError || e instanceof ProviderFailure
          ? e.code
          : "PROVIDER_ERROR",
      status = e instanceof TutorError ? e.status : 502;
    return json(
      {
        error: {
          code,
          message: ERRORS[code] ?? ERRORS.PROVIDER_ERROR,
          retryAfter: e instanceof TutorError ? e.retry : 0,
        },
      },
      status,
      e instanceof TutorError && e.retry
        ? { "Retry-After": String(e.retry) }
        : {},
    );
  }
  async body(request: Request) {
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      throw new TutorError(400, "BAD_REQUEST");
    const reader = request.body?.getReader();
    if (!reader) throw new TutorError(400, "BAD_REQUEST");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 49152) {
        await reader.cancel();
        throw new TutorError(413, "BAD_REQUEST");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let at = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, at);
      at += chunk.length;
    }
    try {
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw new TutorError(400, "BAD_REQUEST");
    }
  }
  async handle(request: Request) {
    try {
      this.origin(request, true);
      const owner = this.owner(request),
        r = await this.body(request);
      if (!validRequest(r)) throw new TutorError(400, "BAD_REQUEST");
      const now = this.clock();
      for (const [id, c] of this.cache)
        if (c.expires < now) this.cache.delete(id);
      const reservation = await this.ledger.reserve(owner, r, now);
      if (reservation.cached) {
        const c = this.cache.get(r.requestId);
        if (c?.owner === owner) return json(c.result);
        throw new TutorError(409, "RETRY_EXPIRED");
      }
      try {
        const providerConfig = {
          key: this.config.key,
          model: this.config.model,
          outputTokens: LIMITS.outputTokens,
        };
        const reply =
            this.config.provider === "gemini"
              ? await callGeminiTutor(r, providerConfig)
              : await callTutor(r, providerConfig, this.fetcher),
          completion = await this.ledger.complete(
            owner,
            r,
            reply,
            this.clock(),
            this.config.secret,
          ),
          result = {
            requestId: r.requestId,
            reply,
            completion,
            remaining: reservation.remaining,
          };
        if (this.cache.size >= 80)
          this.cache.delete(this.cache.keys().next().value!);
        this.cache.set(r.requestId, {
          owner,
          conversationId: r.conversationId,
          expires: this.clock() + 120000,
          result,
        });
        const cacheId = r.requestId;
        const expiry = setTimeout(() => this.cache.delete(cacheId), 120000);
        expiry.unref();
        return json(result);
      } catch (e) {
        await this.ledger.failed(r.requestId);
        throw e;
      }
    } catch (e) {
      return this.error(e);
    }
  }
  async access(request: Request) {
    try {
      this.origin(request, true);
      await this.ledger.accessAttempt(this.clock());
      const body = await this.body(request);
      if (
        !body ||
        typeof body.password !== "string" ||
        body.password.length > 200 ||
        !this.config.password ||
        !equal(body.password, this.config.password)
      )
        throw new TutorError(401, "ACCESS_REQUIRED");
      const who = this.identity(request),
        id = who?.id ?? randomUUID();
      return json({ ok: true }, 200, {
        "Set-Cookie": this.cookie(request, id, true),
      });
    } catch (e) {
      return this.error(e);
    }
  }
  async reward(request: Request) {
    try {
      this.origin(request, true);
      const owner = this.owner(request),
        body = await this.body(request);
      if (
        !validReceipt(body) ||
        !(await this.ledger.verifyReceipt(body, owner, this.config.secret))
      )
        throw new TutorError(403, "ACCESS_DENIED");
      return json({
        id: body.id,
        xp: LUMI_REWARDS.practiceXp,
        coins: LUMI_REWARDS.practiceCoins,
      });
    } catch (e) {
      return this.error(e);
    }
  }
  async remove(request: Request) {
    try {
      this.origin(request, true);
      const owner = this.owner(request),
        body = await this.body(request);
      if (!validId(body?.conversationId))
        throw new TutorError(400, "BAD_REQUEST");
      await this.ledger.remove(owner, body.conversationId);
      for (const [id, c] of this.cache)
        if (c.owner === owner && c.conversationId === body.conversationId)
          this.cache.delete(id);
      return json({ ok: true });
    } catch (e) {
      return this.error(e);
    }
  }
}
