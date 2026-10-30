"use client";
import { useEffect, useRef, useState, useImperativeHandle } from "react";
import type { Ref } from "react";
import assets from "@/data/stories/audio.json";
import comedyAssets from "@/data/stories/comedy-audio.json";
import extraAssets from "@/data/stories/extra-audio.json";
import worldAssets from "@/data/stories/world-audio.json";
import libraryAssets from "@/data/stories/library-audio.json";
import { SpeechSequence, browserSpeechHost } from "@/lib/listening/speech";
import type { StoryScene } from "@/lib/stories/types";
import { Play, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
type Asset = { url: string; duration: number; sha256: string };
export const storyAudio = {
  ...assets.scenes,
  ...extraAssets.scenes,
  ...comedyAssets.scenes,
  ...worldAssets.scenes,
  ...libraryAssets.scenes,
} as Record<string, { full: Asset; lines: Asset[] }>;
export function StoryAudio({
  storyId,
  scene,
  ref,
}: {
  storyId: string;
  scene: StoryScene;
  ref?: Ref<{ pause: () => void }>;
}) {
  const data = storyAudio[storyId + ":" + scene.id],
    audio = useRef<HTMLAudioElement>(null),
    speech = useRef<SpeechSequence | null>(null);
  const [speed, setSpeed] = useState(1),
    [fallback, setFallback] = useState(false),
    [notice, setNotice] = useState("");
  useImperativeHandle(ref, () => ({
    pause() {
      audio.current?.pause();
      speech.current?.stop();
    },
  }));
  useEffect(
    () => () => {
      speech.current?.stop();
    },
    [],
  );
  async function play(index?: number) {
    setNotice("");
    if (fallback) {
      speech.current?.stop();
      speech.current = new SpeechSequence(browserSpeechHost(), {
        status: (_, message) => setNotice(message),
        active: () => {},
        heard: () => {},
        finished: () => {},
      });
      speech.current.setRate(speed);
      await speech.current.play(
        scene.lines.map((l) => l.de),
        index ?? 0,
        index !== undefined,
      );
      return;
    }
    const a = audio.current;
    if (!a) return;
    const url = index === undefined ? data.full.url : data.lines[index].url;
    a.pause();
    a.src = url;
    a.playbackRate = speed;
    a.preservesPitch = true;
    a.currentTime = 0;
    try {
      await a.play();
    } catch {
      setNotice(
        "Ses başlatılamadı. Yeniden deneyebilir veya cihaz sesini açabilirsin.",
      );
    }
  }
  return (
    <section className="story-audio" aria-label="Almanca hikâye seslendirmesi">
      <div className="story-audio-title">
        <span>♫ Sahneyi dinle</span>
        <label>
          Hız{" "}
          <select
            aria-label="Hikâye seslendirme hızı"
            value={speed}
            onChange={(e) => {
              const rate = Number(e.target.value);
              setSpeed(rate);
              if (audio.current) audio.current.playbackRate = rate;
              speech.current?.setRate(rate);
            }}
          >
            {[0.65, 0.85, 1, 1.25].map((n) => (
              <option key={n} value={n}>
                {n.toLocaleString("tr")}×
              </option>
            ))}
          </select>
        </label>
      </div>
      {!fallback && (
        <audio
          ref={audio}
          controls
          preload="metadata"
          src={data.full.url}
          aria-label="Sahnenin Almanca ses kaydı"
          onError={() =>
            setNotice(
              "Ses dosyası yüklenemedi. Cihaz sesi yedeğini kullanabilirsin.",
            )
          }
          onLoadedMetadata={() => {
            if (audio.current) {
              audio.current.preservesPitch = true;
              audio.current.playbackRate = speed;
            }
          }}
        />
      )}
      <div className="story-audio-actions">
        <Button variant="outline" onClick={() => void play()}>
          <RotateCcw size={15} />
          Sahneyi dinle / yeniden çal
        </Button>
        {fallback && (
          <>
            <Button variant="outline" onClick={() => speech.current?.pause()}>
              Duraklat
            </Button>
            <Button variant="outline" onClick={() => speech.current?.resume()}>
              Sürdür
            </Button>
          </>
        )}
        <Button
          variant="outline"
          onClick={() => {
            audio.current?.pause();
            speech.current?.stop();
            setNotice("Ses durduruldu.");
          }}
        >
          <Square size={14} />
          Durdur
        </Button>
      </div>
      <div className="story-line-audio">
        {scene.lines.map((l, i) => (
          <button
            key={i}
            onClick={() => void play(i)}
            aria-label={`${i + 1}. cümleyi dinle`}
          >
            <Play size={13} />
            {l.speaker ? l.speaker : `Cümle ${i + 1}`}
          </button>
        ))}
      </div>
      <p className="story-fine">
        {fallback
          ? "Cihaz sesi yedeği · Almanca ses gerekir; süre eşzamanlaması yok."
          : "Önceden oluşturulmuş Almanca yapay ses · Piper / Thorsten. Tek anlatıcı."}
      </p>
      <button
        className="story-text-button"
        aria-pressed={fallback}
        onClick={() => {
          audio.current?.pause();
          speech.current?.stop();
          setFallback(!fallback);
          setNotice("");
        }}
      >
        {fallback ? "Ses dosyasına dön" : "Cihaz sesi yedeğini kullan"}
      </button>
      {notice && <p role="status">{notice}</p>}
    </section>
  );
}
