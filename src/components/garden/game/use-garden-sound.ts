"use client";
import { useRef, useEffect, useCallback } from "react";
export function useGardenSound() {
  const audio = useRef<AudioContext | null>(null);
  const enable = useCallback(() => {
    try {
      if (!window.AudioContext) return false;
      audio.current ??= new AudioContext();
      void audio.current.resume().catch(() => {});
      return true;
    } catch {
      return false;
    }
  }, []);
  const play = useCallback(() => {
    const context = audio.current;
    if (!context || context.state !== "running") return;
    try {
      [523.25, 659.25].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        const start = context.currentTime + index * 0.11;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.035, start + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.26);
        oscillator.onended = () => {
          oscillator.disconnect();
          gain.disconnect();
        };
      });
    } catch {
      /* Sound is optional; gameplay remains available. */
    }
  }, []);
  useEffect(
    () => () => {
      if (audio.current) {
        void audio.current.close().catch(() => {});
        audio.current = null;
      }
    },
    [],
  );
  return { enable, play };
}
