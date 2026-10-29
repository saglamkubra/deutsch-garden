import {
  validWelcomeConfiguration,
  type WelcomeConfiguration,
} from "./welcome-model.ts";
import { BirthdayError, type BirthdayServer } from "./server.ts";
export async function welcomeResponse(
  request: Request,
  configuration: WelcomeConfiguration,
  server: BirthdayServer,
  method: "GET" | "POST",
) {
  const send = (data: unknown, status = 200) =>
    Response.json(data, {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  try {
    server.origin(request, method === "POST");
    if (!validWelcomeConfiguration(configuration))
      return send(
        {
          error: {
            message:
              "Karşılama yapılandırması geçersiz. Kurucu mesaj dosyasını kontrol etmeli.",
          },
        },
        503,
      );
    const previewRequested =
      new URL(request.url).searchParams.get("onizleme") === "1";
    const previewAvailable =
      !server.config.production ||
      (server.creatorReady() && server.authenticated(request, "creator"));
    if (previewRequested && !previewAvailable)
      return send(
        { error: { message: "Önizleme için kurucu erişimi gerekiyor." } },
        403,
      );
    // Preview never grants an entitlement, regardless of request body.
    if (method === "POST" && previewRequested)
      return send(
        {
          error: {
            message: "Önizleme gerçek hediye veya görüldü kaydı oluşturmaz.",
          },
        },
        400,
      );
    if (!configuration.enabled && !previewRequested) {
      if (method === "POST")
        return send(
          {
            error: {
              message:
                "Karşılama şu anda kapalı. Bahçene kayıt yapmadan devam edebilirsin.",
            },
          },
          409,
        );
      return send({ enabled: false, previewAvailable });
    }
    if (
      !previewRequested &&
      server.config.recipientPassword &&
      !server.authenticated(request, "recipient")
    ) {
      if (method === "POST")
        return send(
          {
            error: { message: "Bu karşılama için erişim parolasını doğrula." },
          },
          401,
        );
      return send({ enabled: true, previewAvailable, accessRequired: true });
    }
    const content = {
      recipientName: configuration.recipientName.trim(),
      message: configuration.message.trim(),
      senderSignature: configuration.senderSignature.trim(),
    };
    if (method === "POST") return send({ content, viewedAt: server.clock() });
    return send({
      enabled: configuration.enabled,
      previewAvailable,
      preview: previewRequested,
      content,
    });
  } catch (e) {
    return send(
      {
        error: {
          message:
            e instanceof BirthdayError
              ? "Karşılama isteğinin kaynağı doğrulanamadı."
              : "Karşılama hizmetine ulaşılamadı. Mevcut ilerlemen korunuyor.",
        },
      },
      e instanceof BirthdayError ? e.status : 503,
    );
  }
}
