"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";

import { ArrowRight, Pause, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LumiMascot,
  type LumiExpression,
} from "@/components/garden/lumi-mascot";
import { demoLearner } from "@/lib/home-demo";
const messages: { text: string; expression: LumiExpression }[] = [
  {
    text: "Her yeni kelime, bahçende yeni bir çiçek demek! 🌷",
    expression: "happy",
  },
  {
    text: "Bugün Almanca öğrenmek için harika bir gün!",
    expression: "excited",
  },
  {
    text: "Acaba bugün hangi yeni kelimeyi keşfedeceğiz?",
    expression: "thinking",
  },
  {
    text: "Küçük adımlar, büyük başarılar getirir. Yanındayım!",
    expression: "encouraging",
  },
  {
    text: "Buraya gelmen bile güzel bir başlangıç. Yaşasın keşfetmek! ✨",
    expression: "celebrating",
  },
];
function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getMotionPreference = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Keep SSR and the hydration snapshot identical; enable rotation after subscription.
const getServerMotionPreference = () => true;
export function Welcome() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  );
  const auto = reduced === false && !paused && !hovered && !focused;
  useEffect(() => {
    if (!auto) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      12000,
    );
    return () => window.clearInterval(timer);
  }, [auto, index]);
  const current = messages[index];
  return (
    <section className="adventure-welcome" aria-label="Lumi ile güne merhaba">
      <div className="adventure-welcome-copy">
        <span className="welcome-tag">
          <span /> HER GÜN YENİ BİR BAŞLANGIÇ
        </span>
        <p className="personal-greeting">
          Merhaba, {demoLearner.name}! 🌸 <small>Örnek profil</small>
        </p>
        <h2>
          Bugün biraz Almanca,
          <br />
          <em>yarın çiçek açan hayaller.</em>
        </h2>
        <p>
          Almanca bahçemizde yeni çiçekler açtırmaya hazır mısın? Kendi hızında,
          küçük adımlarla birlikte keşfedelim.
        </p>
        <Button asChild>
          <Link href="/derslerim">
            Maceraya Başla <ArrowRight size={19} />
          </Link>
        </Button>
        <span className="adventure-fineprint">
          Bir kelimeyle başlar, kocaman bir dünyaya açılır.
        </span>
      </div>
      <div
        className="lumi-corner"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(false);
        }}
      >
        <div className="lumi-bubble">
          <span className="lumi-bubble-label">
            <Sparkles size={14} /> LUMİ’DEN BİR NOT
          </span>
          <p aria-live={auto ? "off" : "polite"} aria-atomic="true">
            {current.text}
          </p>
          <div className="lumi-bubble-footer">
            <span>
              {index + 1} / {messages.length} · Hazır mesajlar
            </span>
            <button
              type="button"
              aria-label={
                paused
                  ? "Mesajların otomatik değişimini aç"
                  : "Mesajların otomatik değişimini durdur"
              }
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
              disabled={reduced === true}
              title={
                reduced
                  ? "Hareket azaltma tercihi nedeniyle otomatik değişim kapalı"
                  : undefined
              }
            >
              {paused || reduced ? <Play size={14} /> : <Pause size={14} />}
            </button>
          </div>
        </div>
        <button
          type="button"
          className="lumi-trigger"
          onClick={() => setIndex((i) => (i + 1) % messages.length)}
          aria-label="Lumi’ye dokun, sonraki motivasyon mesajını göster"
        >
          <LumiMascot expression={current.expression} decorative />
          <span>
            Lumi’ye dokun <Sparkles size={13} />
          </span>
        </button>
      </div>
      <div className="welcome-petals" aria-hidden="true">
        <span>✿</span>
        <span>✧</span>
        <span>❀</span>
        <span>✦</span>
        <span>🦋</span>
      </div>
    </section>
  );
}
