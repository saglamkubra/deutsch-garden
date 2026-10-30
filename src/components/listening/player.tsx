"use client";
import { useEffect, useRef, useState, useImperativeHandle } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Headphones,
  RefreshCw,
} from "lucide-react";
import type { Episode } from "@/lib/listening/types";
import { formatDuration } from "@/lib/listening/content";
import {
  SpeechSequence,
  browserSpeechHost,
  type SpeechStatus,
} from "@/lib/listening/speech";
import {
  heardListening,
  checkpointListening,
  heardSpeechSentence,
} from "@/lib/listening/store";
import { Button } from "@/components/ui/button";
export type PlayerHandle = {
  sentence: (index: number) => void;
  pause: () => void;
};
export function ListeningPlayer({
  episode: e,
  initialPosition,
  onActive,
  ref,
}: {
  episode: Episode;
  initialPosition: number;
  onActive: (index: number) => void;
  ref: React.Ref<PlayerHandle>;
}) {
  const audio = useRef<HTMLAudioElement>(null),
    speech = useRef<SpeechSequence | null>(null),
    activeCallback = useRef(onActive);
  useEffect(() => {
    activeCallback.current = onActive;
  }, [onActive]);
  const [ready, setReady] = useState(false),
    [playing, setPlaying] = useState(false),
    [position, setPosition] = useState(initialPosition),
    [rate, setRate] = useState(1),
    [volume, setVolume] = useState(1),
    [muted, setMuted] = useState(false),
    [error, setError] = useState(""),
    [mode, setMode] = useState<"file" | "speech">("file"),
    [speechStatus, setSpeechStatus] = useState<SpeechStatus>("idle"),
    [notice, setNotice] = useState(""),
    [spokenCount, setSpokenCount] = useState(0);
  const modeRef = useRef(mode),
    last = useRef<number | null>(null),
    pending = useRef<{ start: number; end: number } | null>(null),
    lastFlush = useRef(0),
    boundary = useRef<number | null>(null),
    resume = useRef(initialPosition);
  function flush() {
    const range = pending.current;
    pending.current = null;
    if (range && range.end > range.start)
      void heardListening(e.id, range.start, range.end);
    lastFlush.current = Date.now();
  }
  useEffect(() => {
    speech.current = new SpeechSequence(browserSpeechHost(), {
      status: (status, message) => {
        setSpeechStatus(status);
        setNotice(message);
        setPlaying(status === "playing");
      },
      active: (index) => activeCallback.current(index),
      heard: (index) => {
        setSpokenCount((n) => n + 1);
        void heardSpeechSentence(e.id, index);
      },
      finished: () => setPlaying(false),
    });
    const element = audio.current;
    return () => {
      speech.current?.stop();
      if (element) {
        element.pause();
      }
    };
  }, [e.id]);
  function setAudioMode(next: "file" | "speech") {
    modeRef.current = next;
    setMode(next);
  }
  async function play() {
    if (mode === "speech") {
      speech.current?.setRate(rate);
      speech.current?.setVolume(muted ? 0 : volume);
      if (speechStatus === "paused") speech.current?.resume();
      else await speech.current?.play(e.sentences.map((s) => s.de));
      return;
    }
    const el = audio.current;
    if (!el) return;
    boundary.current = null;
    try {
      if (el.ended) el.currentTime = 0;
      await el.play();
      setError("");
    } catch {
      setError("Ses başlatılamadı. Oynat düğmesine yeniden dokunabilirsin.");
    }
  }
  function pause() {
    if (mode === "speech") speech.current?.pause();
    else audio.current?.pause();
  }
  function replay() {
    if (mode === "speech") {
      speech.current?.stop();
      setSpokenCount(0);
      void speech.current?.play(e.sentences.map((s) => s.de));
    } else {
      const el = audio.current;
      if (el) {
        flush();
        last.current = null;
        boundary.current = null;
        el.currentTime = 0;
        setPosition(0);
        void el.play().catch(() => setError("Ses başlatılamadı."));
      }
    }
  }
  function sentence(index: number) {
    if (!e.audio?.segments[index]) return;
    if (modeRef.current === "speech") {
      speech.current?.setRate(rate);
      speech.current?.setVolume(muted ? 0 : volume);
      void speech.current?.play(
        e.sentences.map((s) => s.de),
        index,
        true,
      );
      return;
    }
    const el = audio.current;
    if (!el || el.readyState < 1) {
      setError("Ses yükleniyor; birkaç saniye sonra yeniden dene.");
      return;
    }
    el.pause();
    flush();
    last.current = null;
    const segment = e.audio.segments[index];
    el.currentTime = segment.start;
    boundary.current = segment.end;
    setPosition(segment.start);
    activeCallback.current(index);
    void el.play().catch(() => setError("Cümle sesi başlatılamadı."));
  }
  useImperativeHandle(ref, () => ({ sentence, pause }));
  function timeUpdate() {
    const el = audio.current;
    if (!el || modeRef.current !== "file") return;
    const now = el.currentTime;
    setPosition(now);
    const selected =
      e.audio?.segments.findIndex((s) => now >= s.start && now < s.end) ?? -1;
    if (selected >= 0) activeCallback.current(selected);
    const previous = last.current;
    if (
      !el.paused &&
      !el.seeking &&
      !el.muted &&
      el.volume > 0 &&
      previous !== null &&
      now > previous &&
      now - previous <= Math.max(1.5, el.playbackRate * 1.5)
    ) {
      if (pending.current && Math.abs(pending.current.end - previous) < 0.08)
        pending.current.end = now;
      else {
        flush();
        pending.current = { start: previous, end: now };
      }
      if (Date.now() - lastFlush.current >= 800) flush();
    }
    last.current =
      !el.paused && !el.seeking && !el.muted && el.volume > 0 ? now : null;
    if (boundary.current !== null && now >= boundary.current) {
      boundary.current = null;
      el.pause();
    }
  }
  const duration = e.audio?.duration ?? 0;
  return (
    <section className="listening-player" aria-label="Almanca ses oynatıcı">
      <audio
        ref={audio}
        src={e.audio?.url}
        preload="metadata"
        onLoadedMetadata={() => {
          const el = audio.current;
          if (el) {
            el.preservesPitch = true;
            el.playbackRate = rate;
            el.volume = volume;
            el.currentTime = Math.min(
              resume.current,
              Number.isFinite(el.duration) ? el.duration : duration,
            );
            setReady(true);
          }
        }}
        onPlay={() => {
          setPlaying(true);
          last.current = audio.current?.currentTime ?? null;
        }}
        onPause={() => {
          setPlaying(false);
          flush();
          last.current = null;
          if (modeRef.current === "file")
            void checkpointListening(e.id, audio.current?.currentTime ?? 0);
        }}
        onTimeUpdate={timeUpdate}
        onSeeking={() => {
          flush();
          last.current = null;
        }}
        onSeeked={() => {
          last.current =
            audio.current && !audio.current.paused
              ? audio.current.currentTime
              : null;
        }}
        onEnded={() => {
          flush();
          setPlaying(false);
          void checkpointListening(e.id, duration);
        }}
        onError={() => {
          setPlaying(false);
          setError(
            "Ses dosyası yüklenemedi. Yeniden yükleyebilir veya cihaz sesini deneyebilirsin.",
          );
        }}
      />
      <div className="listening-player-label">
        <span>
          <Headphones size={17} />
          {mode === "file"
            ? "Özgün metin · Önceden üretilmiş yapay ses"
            : "Yedek seçenek · Cihazın Almanca sesi"}
        </span>
        <strong>{e.level}</strong>
      </div>
      <div className="listening-player-main">
        <button
          className="listening-play"
          aria-label={playing ? "Dinlemeyi duraklat" : "Almanca sesi oynat"}
          disabled={mode === "file" && !ready && !error}
          onClick={() => {
            if (playing) pause();
            else void play();
          }}
        >
          {playing ? (
            <Pause fill="currentColor" />
          ) : (
            <Play fill="currentColor" />
          )}
        </button>
        <div>
          <h2>{e.german}</h2>
          <p>
            {mode === "file"
              ? "Piper ile yerel üretildi · İnsan kaydı değildir."
              : "Cümleler sırayla seslenir; dosya zamanlarıyla eşzamanlanmaz."}
          </p>
        </div>
        <button
          className="listening-replay"
          aria-label="Baştan dinle"
          onClick={replay}
          disabled={mode === "file" && !ready}
        >
          <RotateCcw size={21} />
        </button>
      </div>
      {mode === "file" ? (
        <label className="listening-timeline">
          <span className="sr-only">Dinleme konumu</span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.05}
            value={Math.min(position, duration)}
            disabled={!ready}
            onChange={(event) => {
              const next = Number(event.target.value);
              const el = audio.current;
              if (el) {
                flush();
                last.current = null;
                boundary.current = null;
                el.currentTime = next;
                setPosition(next);
                void checkpointListening(e.id, next);
              }
            }}
          />
          <span>
            {formatDuration(position)} / {formatDuration(duration)}
          </span>
        </label>
      ) : (
        <p className="listening-speech-progress">
          {spokenCount} cümle seslendirildi · Kesin süre gösterilmez.
        </p>
      )}
      <div className="listening-player-controls">
        <label>
          Hız
          <select
            aria-label="Dinleme hızı"
            value={rate}
            onChange={(event) => {
              const next = Number(event.target.value);
              setRate(next);
              if (audio.current) audio.current.playbackRate = next;
              speech.current?.setRate(next);
            }}
          >
            {[0.65, 0.85, 1, 1.25].map((n) => (
              <option key={n} value={n}>
                {n === 0.85
                  ? "Yavaş · 0,85×"
                  : n === 1
                    ? "Normal · 1×"
                    : String(n).replace(".", ",") + "×"}
              </option>
            ))}
          </select>
        </label>
        <button
          aria-label={muted ? "Sesi aç" : "Sesi kapat"}
          aria-pressed={muted}
          onClick={() => {
            setMuted(!muted);
            if (audio.current) audio.current.muted = !muted;
            speech.current?.setVolume(!muted ? 0 : volume);
          }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <label className="listening-volume">
          <span className="sr-only">Ses düzeyi</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            aria-label="Ses düzeyi"
            onChange={(event) => {
              const next = Number(event.target.value);
              setVolume(next);
              if (audio.current) audio.current.volume = next;
              speech.current?.setVolume(muted ? 0 : next);
            }}
          />
        </label>
      </div>
      {(error || mode === "speech") && (
        <div className="listening-audio-notice" role="status">
          {error || notice}
          <div>
            {mode === "file" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setError("");
                    audio.current?.load();
                  }}
                >
                  <RefreshCw size={15} />
                  Dosyayı yeniden yükle
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    audio.current?.pause();
                    setAudioMode("speech");
                    setError("");
                    setNotice(
                      "Cihaz sesini başlatmak için oynat düğmesine dokun.",
                    );
                  }}
                >
                  Cihaz sesini dene
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  speech.current?.stop();
                  setAudioMode("file");
                  setPlaying(false);
                  setError("");
                  audio.current?.load();
                }}
              >
                Ses dosyasına dön
              </Button>
            )}
          </div>
        </div>
      )}
      <p className="listening-player-footnote">
        Sessiz oynatma ve ileri atlama, dinlenmiş ilerleme sayılmaz. Otomatik
        oynatma yapılmaz.
      </p>
    </section>
  );
}
