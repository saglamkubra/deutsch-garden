"use client";
import { useEffect, useRef, useState, useId } from "react";
import { Volume2, Turtle, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pronunciationAudio } from "@/lib/learning/pronunciation-audio";
export function Pronunciation({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "loading" | "speaking">("idle");
  const [notice, setNotice] = useState("");
  const statusId = useId();
  const active = useRef<SpeechSynthesisUtterance | null>(null);
  const recording = useRef<HTMLAudioElement | null>(null);
  const hosted = pronunciationAudio(text);
  const cleanup = useRef<(() => void) | null>(null);
  function stop() {
    cleanup.current?.();
    cleanup.current = null;
    if (recording.current) {
      const player = recording.current;
      recording.current = null;
      player.onended = null;
      player.onerror = null;
      player.pause();
      player.removeAttribute("src");
      player.load();
    }
    if (active.current) {
      active.current = null;
      window.speechSynthesis?.cancel();
    }
  }
  useEffect(() => () => stop(), []);
  function play(rate: number) {
    stop();
    if (hosted) {
      const player = new Audio(hosted.url);
      recording.current = player;
      player.playbackRate = rate < 0.8 ? 0.8 : 1;
      player.preservesPitch = true;
      setState("loading");
      setNotice("Hazır Almanca ses kaydı açılıyor.");
      const finish = (error = false) => {
        if (recording.current !== player) return;
        stop();
        setState("idle");
        setNotice(
          error
            ? "Hazır ses kaydı çalınamadı. Bağlantını kontrol edip yeniden dene."
            : "Seslendirme tamamlandı.",
        );
      };
      player.onended = () => finish();
      player.onerror = () => finish(true);
      const timeout = window.setTimeout(() => finish(true), 20000);
      cleanup.current = () => window.clearTimeout(timeout);
      void player
        .play()
        .then(() => {
          if (recording.current !== player) return;
          // The timeout bounds loading, not the duration of a slow recording.
          cleanup.current?.();
          cleanup.current = null;
          setState("speaking");
          setNotice("Hazır Almanca ses kaydı çalınıyor.");
        })
        .catch(() => finish(true));
      return;
    }
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
        {notice ||
          (hosted
            ? "Hazır Almanca ses · Yapay seslendirme kaydıdır."
            : "Cihaz sesi · Profesyonel insan kaydı değildir.")}
      </p>
    </div>
  );
}
