import {
  LIMITS,
  object,
  validResult,
  type TutorRequest,
  type TutorResult,
} from "../lumi/protocol.ts";
import type { Level } from "../learning/types.ts";

export function reviewExcerpt(text: string) {
  if (text.length <= LIMITS.message) return text;
  let part = text.slice(0, LIMITS.message);
  if (/[\uD800-\uDBFF]$/.test(part)) part = part.slice(0, -1);
  const boundary = part.lastIndexOf(" ");
  return boundary > LIMITS.message - 120 ? part.slice(0, boundary) : part;
}
export function reviewBlockReason(text: string, consent: boolean) {
  if (!text.trim())
    return "Önce bir yazı yaz veya kayıtlı yazılarından birini incelemeye aç.";
  if (text.length > LIMITS.message)
    return `İncelenecek bölümü ${LIMITS.message} karaktere kısalt. Asıl yazın korunur.`;
  if (!consent)
    return "Düğmeyi açmak için aşağıdaki gönderme onayını işaretle.";
  return "Hazır. Yalnızca aşağıdaki bölüm gönderilecek; asıl yazın değiştirilmeyecek.";
}
export function diaryReviewRequest(
  text: string,
  level: Level,
  id: () => string = () => crypto.randomUUID(),
): TutorRequest {
  return {
    action: "message",
    conversationId: id(),
    requestId: id(),
    level,
    mode: "diary-review",
    correction: "gentle",
    messages: [{ role: "user", content: text }],
  };
}
function responseError(data: unknown, fallback: string) {
  return object(data) &&
    object(data.error) &&
    typeof data.error.message === "string"
    ? data.error.message
    : fallback;
}
export async function sendDiaryReview(
  request: TutorRequest,
  consent: boolean,
  signal: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<TutorResult> {
  const text = request.messages[0]?.content ?? "";
  if (!consent || !text.trim() || text.length > LIMITS.message)
    throw Error(reviewBlockReason(text, consent));
  const response = await fetcher("/api/lumi/chat", {
    cache: "no-store",
    signal,
  });
  const status: unknown = await response.json();
  if (!response.ok || !object(status) || typeof status.configured !== "boolean")
    throw Error(
      responseError(
        status,
        "Lumi bağlantısı kontrol edilemedi. Yazın korunuyor; yeniden dene.",
      ),
    );
  if (!status.configured) throw Error("Lumi sağlayıcı kurulumu gerekiyor.");
  if (!status.authenticated)
    throw Error(
      "Önce Lumi AI sayfasında erişim parolanla giriş yap; sonra burada yeniden dene.",
    );
  const result = await fetcher("/api/lumi/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  const data: unknown = await result.json();
  if (!result.ok || !validResult(data))
    throw Error(
      responseError(data, "AI yanıtı doğrulanamadı; metnin değiştirilmedi."),
    );
  if (data.requestId !== request.requestId)
    throw Error("Yanıt bu incelemeyle eşleşmedi; metnin değiştirilmedi.");
  return data;
}
