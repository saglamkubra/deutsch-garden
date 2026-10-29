export function decodePushPublicKey(value: unknown): Uint8Array<ArrayBuffer> {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{87}$/.test(value.trim()))
    throw new Error(
      "Bildirim anahtarı geçersiz. WEB_PUSH_PUBLIC_KEY alanına oluşturulan gerçek anahtar girilmeli.",
    );
  const encoded = value.trim().replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(encoded + "=".repeat((4 - (encoded.length % 4)) % 4));
  const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
  if (bytes.length !== 65 || bytes[0] !== 4)
    throw new Error("Bildirim anahtarı geçerli bir P-256 açık anahtarı değil.");
  return bytes;
}
export function validPushEndpoint(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const u = new URL(value);
    return (
      (u.protocol === "https:" &&
        !u.username &&
        !u.password &&
        !u.port &&
        !u.hash &&
        [
          "fcm.googleapis.com",
          "updates.push.services.mozilla.com",
          "web.push.apple.com",
        ].some((h) => u.hostname === h)) ||
      // Chromium's staging GCM endpoint; preserve the browser-issued URL.
      // Source: components/push_messaging/push_messaging_constants.cc
      (u.protocol === "https:" &&
        !u.username &&
        !u.password &&
        !u.port &&
        !u.hash &&
        u.hostname === "jmt17.google.com" &&
        u.pathname.startsWith("/fcm/send/") &&
        u.pathname.length > "/fcm/send/".length) ||
      (u.protocol === "https:" &&
        !u.username &&
        !u.password &&
        !u.port &&
        !u.hash &&
        u.hostname.endsWith(".notify.windows.com"))
    );
  } catch {
    return false;
  }
}

/** Only the public hostname is diagnostic; endpoint paths contain private IDs. */
export function pushSubscriptionError(
  endpoint: string,
  keys?: Record<string, string>,
): string | null {
  if (!validPushEndpoint(endpoint)) {
    let host = "geçersiz adres";
    try {
      host = new URL(endpoint).hostname;
    } catch {
      /* Do not display raw input. */
    }
    return `Bu tarayıcının bildirim sağlayıcısı destek listesinde değil (${host}). Tam bildirim adresini veya anahtarları paylaşma.`;
  }
  if (!keys?.auth || !keys?.p256dh)
    return "Tarayıcı şifreli bildirim aboneliği anahtarlarını oluşturmadı. Sayfayı normal Chrome veya Edge tarayıcısında açarak dene.";
  return null;
}
