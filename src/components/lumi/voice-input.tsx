"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Mic, Square } from "lucide-react";
import {
  recognitionConstructor,
  recognizedText,
  recognitionError,
} from "@/lib/lumi/voice";
import type { RecognitionLike } from "@/lib/lumi/voice";
const subscribe = () => () => {};
export function VoiceInput({
  onText,
  onStart,
  disabled,
}: {
  onText: (text: string) => void;
  onStart: () => void;
  disabled: boolean;
}) {
  const available = useSyncExternalStore(
      subscribe,
      () => !!recognitionConstructor(),
      () => false,
    ),
    [active, setActive] = useState(false),
    [notice, setNotice] = useState(""),
    [interim, setInterim] = useState("");
  const current = useRef<RecognitionLike | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      current.current?.abort();
    },
    [],
  );
  function start() {
    const Ctor = recognitionConstructor();
    if (!Ctor) return;
    onStart();
    current.current?.abort();
    const r = new Ctor();
    current.current = r;
    r.lang = "de-DE";
    r.continuous = false;
    r.interimResults = true;
    r.maxAlternatives = 1;
    setNotice(
      "Mikrofon izni bekleniyor; konuştuğun metin otomatik gönderilmez.",
    );
    r.onstart = () => {
      setActive(true);
      setNotice("Dinliyorum… Almanca konuşabilirsin.");
    };
    r.onresult = (e) => {
      const text = recognizedText(e);
      setInterim(text.interim);
      if (text.final) onText(text.final);
    };
    r.onerror = (e) => {
      setNotice(recognitionError(e.error));
      setActive(false);
    };
    r.onend = () => {
      setActive(false);
      setInterim("");
      if (timer.current) clearTimeout(timer.current);
      current.current = null;
    };
    try {
      r.start();
      timer.current = setTimeout(() => r.stop(), 30000);
    } catch {
      setNotice("Mikrofon başlatılamadı. Yazılı sohbeti kullanabilirsin.");
      setActive(false);
    }
  }
  return (
    <div className="lumi-voice-input">
      <button
        type="button"
        disabled={disabled || !available}
        aria-label={active ? "Mikrofonu durdur" : "Almanca sesle yaz"}
        aria-pressed={active}
        onClick={() => (active ? current.current?.stop() : start())}
      >
        {active ? <Square size={17} /> : <Mic size={18} />}{" "}
        {active ? "Durdur" : "Sesle yaz"}
      </button>
      <span role="status">
        {notice ||
          (!available
            ? "Bu tarayıcıda sesle yazma yok; metin sohbeti kullanılabilir."
            : "Ses yalnızca taslağa yazılır; telaffuz puanlanmaz.")}
        {interim && " " + interim}
      </span>
    </div>
  );
}
