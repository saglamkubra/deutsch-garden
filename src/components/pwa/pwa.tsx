"use client";
import { useEffect, useState } from "react";
import { Download, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorCard } from "@/components/garden/primitives";
interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
export function PwaRegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => {
        /* Online application remains available. */
      });
  }, []);
  return null;
}
export function InstallGarden() {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const available = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallEvent);
    };
    const installed = () => {
      setPrompt(null);
      setNotice("Deutsch Garden ana ekranına eklendi.");
    };
    window.addEventListener("beforeinstallprompt", available);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", available);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);
  async function install() {
    if (!prompt) return;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setNotice(
        choice.outcome === "accepted"
          ? "Yükleme isteğin alındı."
          : "İstersen daha sonra ekleyebilirsin.",
      );
    } catch {
      setNotice("Tarayıcı menüsünden ana ekrana eklemeyi deneyebilirsin.");
    } finally {
      setPrompt(null);
    }
  }
  return (
    <ColorCard tone="lavender" className="account-card">
      <div className="account-section-title">
        <Flower2 aria-hidden="true" />
        <h2>Bahçen hep yanında</h2>
      </div>
      <p>
        Deutsch Garden’ı ana ekranına ekleyebilirsin. Dersler, sesler, Lumi ve
        bulut kaydı için internet gerekir.
      </p>
      {prompt && (
        <Button onClick={install}>
          <Download size={18} aria-hidden="true" />
          Ana ekranıma ekle
        </Button>
      )}
      <p>
        iPhone veya iPad’de Safari’nin paylaş menüsünden “Ana Ekrana Ekle”yi
        seç. Android’de tarayıcı menüsündeki “Uygulamayı yükle” veya “Ana ekrana
        ekle” seçeneğini kullan. Seçenek tarayıcına göre değişebilir.
      </p>
      {notice && <p role="status">{notice}</p>}
    </ColorCard>
  );
}
