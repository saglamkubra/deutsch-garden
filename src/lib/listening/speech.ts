export type SpeechStatus = "idle" | "loading" | "playing" | "paused" | "error";
type Host = {
  synth: SpeechSynthesis;
  create: (text: string) => SpeechSynthesisUtterance;
};
export type SpeechCallbacks = {
  status: (status: SpeechStatus, message: string) => void;
  active: (index: number) => void;
  heard: (index: number) => void;
  finished: () => void;
};
export class SpeechSequence {
  private generation = 0;
  private current: SpeechSynthesisUtterance | null = null;
  private paused = false;
  private waitingNext: (() => void) | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private rate = 0.85;
  private volume = 1;
  private host: Host | null;
  private callbacks: SpeechCallbacks;
  constructor(host: Host | null, callbacks: SpeechCallbacks) {
    this.host = host;
    this.callbacks = callbacks;
  }
  stop() {
    this.generation++;
    if (this.current) this.host?.synth.cancel();
    this.current = null;
    this.paused = false;
    this.waitingNext = null;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
  setRate(rate: number) {
    this.rate = rate;
  }
  setVolume(volume: number) {
    this.volume = volume;
    if (this.current) this.current.volume = volume;
  }
  pause() {
    if (!this.current) return;
    this.host?.synth.pause();
    this.paused = true;
    this.callbacks.status("paused", "Cihaz sesi duraklatıldı.");
  }
  resume() {
    if (!this.host) return;
    this.paused = false;
    this.host.synth.resume();
    this.callbacks.status("playing", "Cihaz sesi sürüyor.");
    if (this.waitingNext) {
      const next = this.waitingNext;
      this.waitingNext = null;
      next();
    }
  }
  async play(lines: string[], start = 0, single = false) {
    this.stop();
    const token = this.generation;
    if (!this.host) {
      this.callbacks.status(
        "error",
        "Bu tarayıcı cihaz sesini desteklemiyor. Metni okuyabilirsin; dinleme kaydı oluşmaz.",
      );
      return;
    }
    this.callbacks.status("loading", "Almanca cihaz sesi kontrol ediliyor.");
    const synth = this.host.synth;
    let voices = synth.getVoices();
    if (!voices.some((v) => v.lang.toLowerCase().startsWith("de"))) {
      await new Promise<void>((resolve) => {
        const done = () => {
          clearTimeout(timeout);
          synth.removeEventListener("voiceschanged", changed);
          resolve();
        };
        const changed = () => {
          if (
            synth.getVoices().some((v) => v.lang.toLowerCase().startsWith("de"))
          )
            done();
        };
        const timeout = setTimeout(done, 2500);
        synth.addEventListener("voiceschanged", changed);
      });
      voices = synth.getVoices();
    }
    if (token !== this.generation) return;
    const voice =
      voices.find((v) => v.lang.toLowerCase() === "de-de") ??
      voices.find((v) => v.lang.toLowerCase().startsWith("de"));
    if (!voice) {
      this.callbacks.status(
        "error",
        "Cihazında Almanca ses bulunamadı. Ses dosyasını yeniden yükleyebilir veya metni okuyabilirsin.",
      );
      return;
    }
    const speak = (index: number) => {
      if (token !== this.generation || !this.host) return;
      if (index >= lines.length || (single && index > start)) {
        this.current = null;
        this.callbacks.status("idle", "Cihaz seslendirmesi tamamlandı.");
        this.callbacks.finished();
        return;
      }
      const utterance = this.host.create(lines[index]);
      this.current = utterance;
      utterance.lang = "de-DE";
      utterance.voice = voice;
      utterance.rate = this.rate;
      utterance.volume = this.volume;
      let seconds = 0;
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (!this.paused && ++seconds > 45) {
          this.stop();
          this.callbacks.status(
            "error",
            "Cihaz sesi yanıt vermedi. Yeniden deneyebilirsin.",
          );
        }
      }, 1000);
      utterance.onstart = () => {
        if (token !== this.generation) return;
        this.callbacks.active(index);
        this.callbacks.status(
          "playing",
          "Cihaz sesi · Süre eşzamanlaması kullanılmaz.",
        );
      };
      utterance.onend = () => {
        if (token !== this.generation) return;
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
        if (this.volume > 0) this.callbacks.heard(index);
        const next = () => speak(index + 1);
        if (this.paused) this.waitingNext = next;
        else next();
      };
      utterance.onerror = () => {
        if (token !== this.generation) return;
        this.stop();
        this.callbacks.status(
          "error",
          "Cihaz sesi çalınamadı. Yeniden deneyebilirsin.",
        );
      };
      try {
        synth.speak(utterance);
      } catch {
        this.stop();
        this.callbacks.status("error", "Cihaz sesi başlatılamadı.");
      }
    };
    speak(start);
  }
}
export function browserSpeechHost(): Host | null {
  return typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
    ? {
        synth: window.speechSynthesis,
        create: (text) => new SpeechSynthesisUtterance(text),
      }
    : null;
}
