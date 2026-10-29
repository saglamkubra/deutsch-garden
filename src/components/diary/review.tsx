"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  validResult,
  type TutorRequest,
  type TutorResult,
} from "@/lib/lumi/protocol";
import type { Level } from "@/lib/learning/types";
export function DiaryReview({ text, level }: { text: string; level: Level }) {
  const [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [result, setResult] = useState<TutorResult | null>(null);
  const pending = useRef<TutorRequest | null>(null),
    lock = useRef(false);
  async function review() {
    if (lock.current || !consent) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const status = await fetch("/api/lumi/chat", { cache: "no-store" }).then(
        (r) => r.json(),
      );
      if (!status.configured) throw Error("Lumi sağlayıcı kurulumu gerekiyor.");
      if (!status.authenticated)
        throw Error("Önce Lumi AI sayfasında erişim parolanla giriş yap.");
      if (
        pending.current?.messages[0].content !== text ||
        pending.current?.level !== level
      )
        pending.current = {
          action: "message",
          conversationId: crypto.randomUUID(),
          requestId: crypto.randomUUID(),
          level,
          mode: "diary-review",
          correction: "gentle",
          messages: [{ role: "user", content: text }],
        };
      const response = await fetch("/api/lumi/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending.current),
        signal: AbortSignal.timeout(60000),
      });
      const data = await response.json();
      if (!response.ok || !validResult(data))
        throw Error(
          typeof data.message === "string"
            ? data.message
            : "AI yanıtı doğrulanamadı; metnin değiştirilmedi.",
        );
      setResult(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Bağlantı kurulamadı; yeniden deneyebilirsin.",
      );
    } finally {
      setBusy(false);
      lock.current = false;
    }
  }
  return (
    <section className="diary-import">
      <h2>Lumi ile yazını incele 🌸</h2>
      <p>
        Yalnızca düğmeye bastığında bu açık taslak Gemini’ye gönderilir. En
        fazla 800 karakter; uzun yazıdan kısa bir bölümü ayrı taslakta
        inceleyebilirsin. Her deneme mevcut Lumi kotasından düşer. Sonuç AI
        önerisidir; metnin kendiliğinden değiştirilmez.
      </p>
      <label>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />{" "}
        Bu taslağı AI sağlayıcısına göndermeyi onaylıyorum.
      </label>
      <Button
        disabled={!consent || busy || !text.trim() || text.length > 800}
        onClick={() => void review()}
      >
        {busy ? "İnceleniyor…" : "Yazımı incele"}
      </Button>{" "}
      <Link href="/lumi-ai">Lumi bağlantısını aç</Link>
      {error && <p role="alert">{error}</p>}
      {result && (
        <div aria-live="polite">
          <p>{result.reply.encouragementTr}</p>
          {result.reply.corrections.length === 0 ? (
            <p>
              Lumi bu parçada düzeltme önermedi; bu, metnin hatasız olduğu
              garantisi değildir.
            </p>
          ) : (
            result.reply.corrections.map((c, i) => (
              <article key={i}>
                <p lang="de">
                  {c.original} → <strong>{c.corrected}</strong>
                </p>
                <p>{c.explanationTr}</p>
                <p lang="de">Doğal alternatif: {c.alternative}</p>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}
