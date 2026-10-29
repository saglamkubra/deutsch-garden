"use client";
import { useEffect, useRef, useState, useId } from "react";
import { Volume2, Turtle, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
export function Pronunciation({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "loading" | "speaking">("idle");
  const [notice, setNotice] = useState("");
  const statusId = useId();
  const active = useRef<SpeechSynthesisUtterance | null>(null);
  const cleanup = useRef<(() => void) | null>(null);
  function stop() {
    cleanup.current?.();
    cleanup.current = null;
    if (active.current) {
      active.current = null;
      window.speechSynthesis?.cancel();
    }
  }
  useEffect(() => () => stop(), []);
  function play(rate: number) {
    stop();
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      setNotice(
        "Bu tarayıcı seslendirmeyi desteklemiyor. Kelimeyi yazılı olarak çalışabilirsin.",
      );
      setState("idle");
      return;
    }
    const synth = window.speechSynthesis;
    function speak() {
      const voices = synth.getVoices();
      const voice =
        voices.find((v) => v.lang.toLowerCase() === "de-de") ??
        voices.find((v) => v.lang.toLowerCase().startsWith("de"));
      if (!voice) {
        setNotice("Cihazında Almanca ses bulunamadı.");
        setState("idle");
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.voice = voice;
      utterance.rate = rate;
      active.current = utterance;
      setState("speaking");
      setNotice("Almanca seslendiriliyor.");
      const finish = (error = false) => {
        if (active.current !== utterance) return;
        active.current = null;
        cleanup.current?.();
        cleanup.current = null;
        setState("idle");
        setNotice(
          error
            ? "Ses çalınamadı. Yeniden deneyebilirsin."
            : "Seslendirme tamamlandı.",
        );
      };
      const timeout = window.setTimeout(() => {
        finish(true);
        synth.cancel();
      }, 20000);
      cleanup.current = () => window.clearTimeout(timeout);
      utterance.onend = () => finish();
      utterance.onerror = () => finish(true);
      try {
        synth.speak(utterance);
      } catch {
        finish(true);
      }
    }
    if (synth.getVoices().length) {
      speak();
      return;
    }
    setState("loading");
    setNotice("Almanca sesler kontrol ediliyor.");
    const dispose = () => {
      window.clearTimeout(timer);
      synth.removeEventListener("voiceschanged", ready);
      cleanup.current = null;
    };
    function ready() {
      if (!synth.getVoices().length) return;
      dispose();
      speak();
    }
    const timer = window.setTimeout(() => {
      dispose();
      speak();
    }, 2500);
    cleanup.current = dispose;
    synth.addEventListener("voiceschanged", ready);
  }
  // Word changes remount this keyed component in cards; unmount stops its own audio.
  return (
    <div className="word-pronunciation">
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (state === "speaking") {
              stop();
              setState("idle");
              setNotice("Seslendirme durduruldu.");
            } else play(0.9);
          }}
          disabled={state === "loading"}
          aria-describedby={statusId}
          aria-label={
            state === "speaking"
              ? "Seslendirmeyi durdur"
              : "Almanca telaffuzu dinle"
          }
        >
          {state === "speaking" ? <Square size={16} /> : <Volume2 size={17} />}{" "}
          {state === "speaking" ? "Durdur" : "Dinle"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => play(0.65)}
          disabled={state === "loading"}
          aria-label="Almanca telaffuzu yavaş dinle"
        >
          <Turtle size={17} /> Yavaş
        </Button>
      </div>
      <p id={statusId} role="status">
        {notice || "Cihaz sesi · Profesyonel insan kaydı değildir."}
      </p>
    </div>
  );
}
