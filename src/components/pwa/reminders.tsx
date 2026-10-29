"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { currentOwner } from "@/lib/account/storage";
const KEY = "deutsch-garden:device-reminder:v1";
async function show() {
  const registration =
    "serviceWorker" in navigator
      ? await navigator.serviceWorker.getRegistration()
      : null;
  const options = {
    body: "Bugün bahçene bir kelime daha eklemek ister misin? Küçük bir adım yeter. 🌷",
    icon: "/icons/icon-192.png",
    tag: "deutsch-garden-learning",
    data: { url: "/derslerim" },
  };
  if (registration)
    await registration.showNotification(
      "Deutsch Garden seni bekliyor",
      options,
    );
  else new Notification("Deutsch Garden seni bekliyor", options);
}

export function ReminderRunner() {
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
        const now = new Date(),
          day = [
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate(),
            currentOwner() ?? "guest",
          ].join("-");
        if (
          v?.enabled &&
          v.last !== day &&
          now.getHours() >= 18 &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          localStorage.setItem(KEY, JSON.stringify({ ...v, last: day }));
          void show().catch(() => undefined);
        }
      } catch {
        // Invalid device preferences are left unchanged.
      }
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  return null;
}
export function LearningReminders() {
  const [notice, setNotice] = useState("");
  async function enable() {
    try {
      if (!("Notification" in window))
        throw Error(
          "Bu tarayıcı bildirimleri desteklemiyor. iPhone’da önce ana ekrana eklemen gerekebilir.",
        );
      const permission = await Notification.requestPermission();
      if (permission !== "granted")
        throw Error(
          "Bildirim izni verilmedi. Tarayıcı ayarlarından değiştirebilirsin.",
        );
      localStorage.setItem(KEY, JSON.stringify({ enabled: true, last: "" }));
      await show();
      setNotice(
        "Deneme bildirimi gönderildi. Bu cihazda uygulama açıkken 18.00 sonrasında günde bir hatırlatma yapılır.",
      );
    } catch (e) {
      setNotice((e as Error).message);
    }
  }
  return (
    <section className="color-card account-card">
      <h2>Öğrenme hatırlatıcım 🔔</h2>
      <p>
        Bu cihazda uygulama açıkken günlük hatırlatma gösterilir. Uygulama
        kapalıyken hatırlatma için ayrı push ayarını kullan. İzin yalnızca
        düğmeye bastığında istenir.
      </p>
      <Button variant="outline" onClick={() => void enable()}>
        Bildirim izni ver ve dene
      </Button>{" "}
      <Button
        variant="outline"
        onClick={() => {
          localStorage.setItem(
            KEY,
            JSON.stringify({ enabled: false, last: "" }),
          );
          setNotice("Bu cihazın hatırlatıcısı kapatıldı.");
        }}
      >
        Hatırlatıcıyı kapat
      </Button>
      <p role="status">{notice}</p>
    </section>
  );
}
