"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { accountClient } from "@/lib/account/client";
import { currentOwner } from "@/lib/account/storage";
import { pushSubscriptionError, decodePushPublicKey } from "@/lib/pwa/push";
import { ensurePushRegistration } from "@/lib/pwa/registration";
export function PushSettings() {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function update(enable: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      const owner = currentOwner(),
        db = accountClient();
      if (!owner || !db)
        throw Error("Kapalı uygulama bildirimleri için hesabına giriş yap.");
      if (
        !("PushManager" in window) ||
        !("serviceWorker" in navigator) ||
        !window.isSecureContext
      )
        throw Error(
          "Bu cihazda web push kullanılamıyor. iPhone’da HTTPS adresini önce ana ekrana ekle.",
        );
      let reg: ServiceWorkerRegistration;
      try {
        reg = enable
          ? await ensurePushRegistration(navigator.serviceWorker)
          : (await navigator.serviceWorker.getRegistration("/"))!;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.startsWith("Bildirim hizmeti")
        )
          throw error;
        throw Error(
          `Bildirim hizmeti kaydedilemedi (${error instanceof Error ? error.name : "tarayıcı hatası"}). Tarayıcı desteğini ve /sw.js erişimini kontrol et.`,
        );
      }
      if (!reg) {
        setMessage("Bu tarayıcıda kayıtlı push bildirimi bulunmuyor.");
        return;
      }
      let sub = await reg.pushManager.getSubscription();
      if (!enable) {
        if (sub) {
          const r = await db
            .from("push_subscriptions")
            .delete()
            .eq("user_id", owner)
            .eq("endpoint", sub.endpoint);
          if (r.error)
            throw Error("Bildirim tercihi bulutta silinemedi; yeniden dene.");
          await sub.unsubscribe();
        }
        setMessage("Bu cihazdaki push bildirimleri kapatıldı.");
        return;
      }
      const config = await fetch("/api/reminders/config", {
        cache: "no-store",
      }).then((r) => r.json());
      if (!config.configured)
        throw Error(
          "Web push sunucu kurulumu gerekiyor; kurulum rehberindeki VAPID ve zamanlayıcı adımlarını tamamla.",
        );
      const key = decodePushPublicKey(config.publicKey);
      if ((await Notification.requestPermission()) !== "granted")
        throw Error("Bildirim izni verilmedi.");
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: key,
        });
      }
      if (currentOwner() !== owner)
        throw Error("Hesap değişti; bildirim kaydı gönderilmedi.");
      const data = sub.toJSON();
      const subscriptionError = pushSubscriptionError(sub.endpoint, data.keys);
      if (subscriptionError) throw Error(subscriptionError);
      if (!data.keys?.auth || !data.keys?.p256dh)
        throw Error("Bildirim aboneliği anahtarları eksik.");
      const saved = await db.from("push_subscriptions").upsert(
        {
          user_id: owner,
          endpoint: sub.endpoint,
          p256dh: data.keys.p256dh,
          auth: data.keys.auth,
        },
        { onConflict: "endpoint" },
      );
      if (saved.error)
        throw Error(
          "Bildirim kaydı doğrulanamadı. 011 SQL kurulumu veya bağlantını kontrol et.",
        );
      setMessage(
        "Bu cihaz için push kaydı yapıldı. Sunucu zamanlayıcısı kurulduğunda uygulama kapalıyken de günde bir hatırlatma gönderilir.",
      );
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="color-card account-card">
      <h2>Uygulama kapalıyken hatırlat 🔔</h2>
      <p>
        İzin verdiğin bu cihaza Türkiye saatiyle 18.00’de genel bir öğrenme
        hatırlatması gönderilir. Bildirim metninde günlük veya sohbet içeriği
        bulunmaz.
      </p>
      <Button disabled={busy} onClick={() => void update(true)}>
        Bu cihazda push bildirimini aç
      </Button>{" "}
      <Button
        variant="outline"
        disabled={busy}
        onClick={() => void update(false)}
      >
        Push bildirimini kapat
      </Button>
      <p role="status">{message}</p>
    </section>
  );
}
