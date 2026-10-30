"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LIMITS,
  type TutorRequest,
  type TutorResult,
} from "@/lib/lumi/protocol";
import {
  diaryReviewRequest,
  reviewBlockReason,
  reviewExcerpt,
  sendDiaryReview,
} from "@/lib/diary/review";
import type { Level } from "@/lib/learning/types";

export function DiaryReview({
  text,
  level,
  label,
}: {
  text: string;
  level: Level;
  label: string;
}) {
  const [excerpt, setExcerpt] = useState(() => reviewExcerpt(text)),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [result, setResult] = useState<TutorResult | null>(null);
  const pending = useRef<TutorRequest | null>(null),
    lock = useRef(false),
    controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function review() {
    if (
      lock.current ||
      !consent ||
      !excerpt.trim() ||
      excerpt.length > LIMITS.message
    )
      return;
    lock.current = true;
    setBusy(true);
    setError("");
    const abort = new AbortController();
    controller.current = abort;
    const timeout = setTimeout(() => abort.abort("timeout"), 60000);
    try {
      if (
        pending.current?.messages[0].content !== excerpt ||
        pending.current?.level !== level
      )
        pending.current = diaryReviewRequest(excerpt, level);
      const data = await sendDiaryReview(
        pending.current,
        consent,
        abort.signal,
      );
      if (!abort.signal.aborted) setResult(data);
    } catch (e) {
      if (!abort.signal.aborted || abort.signal.reason === "timeout")
        setError(
          abort.signal.aborted
            ? "Yanıt gecikti. Yazın korunuyor; aynı incelemeyi yeniden deneyebilirsin."
            : e instanceof TypeError || e instanceof SyntaxError
              ? "Bağlantı kurulamadı. Yazın korunuyor; yeniden dene."
              : e instanceof Error
                ? e.message
                : "İnceleme tamamlanamadı; yazın korunuyor.",
        );
    } finally {
      clearTimeout(timeout);
      lock.current = false;
      if (!abort.signal.aborted || abort.signal.reason === "timeout")
        setBusy(false);
    }
  }
  const disabled =
    !consent || busy || !excerpt.trim() || excerpt.length > LIMITS.message;
  return (
    <section
      className="diary-import diary-review-panel"
      aria-label="Lumi yazı incelemesi"
    >
      <h2>Lumi ile yazını incele 🌸</h2>
      <p>
        <strong>İncelenen yazı: {label}</strong>
      </p>
      <p>
        Yalnızca onayınla ve düğmeye bastığında aşağıdaki bölüm AI sağlayıcısına
        gönderilir. Her inceleme mevcut Lumi kotasını kullanır. Öneriler asıl
        yazını kendiliğinden değiştirmez.
      </p>
      {text.length > LIMITS.message && (
        <p role="note">
          Yazın {text.length.toLocaleString("tr-TR")} karakter. Tek incelemede
          en fazla {LIMITS.message} karakter gönderilebilir. İlk bölüm aşağıda
          hazır; başka bir bölümü buraya yapıştırarak da inceletebilirsin.
          Yazının tamamı kısaltılmaz veya silinmez.
        </p>
      )}
      <label htmlFor="diary-review-excerpt">İncelenecek Almanca bölüm</label>
      <textarea
        id="diary-review-excerpt"
        lang="de"
        value={excerpt}
        disabled={busy || !text.trim()}
        maxLength={LIMITS.message}
        aria-describedby="diary-review-hint"
        onChange={(e) => {
          setExcerpt(e.target.value);
          setConsent(false);
          setResult(null);
          setError("");
          pending.current = null;
        }}
      />
      <p>
        {excerpt.length} / {LIMITS.message} karakter · {level}
      </p>
      <p id="diary-review-hint" role="status">
        {busy ? "Lumi yazını inceliyor…" : reviewBlockReason(excerpt, consent)}
      </p>
      <label>
        <input
          type="checkbox"
          checked={consent}
          disabled={busy || !excerpt.trim()}
          onChange={(e) => setConsent(e.target.checked)}
        />{" "}
        Bu görünen bölümü AI sağlayıcısına göndermeyi onaylıyorum.
      </label>
      <Button
        disabled={disabled}
        aria-describedby="diary-review-hint"
        onClick={() => void review()}
      >
        {busy
          ? "İnceleniyor…"
          : error
            ? "İncelemeyi yeniden dene"
            : "Bu bölümü incele"}
      </Button>{" "}
      <Link href="/lumi-ai">Lumi bağlantısını aç</Link>
      {error && <p role="alert">{error}</p>}
      {result && (
        <div aria-live="polite">
          <p>{result.reply.encouragementTr}</p>
          <p>Bu incelemeden sonra kalan günlük hak: {result.remaining}.</p>
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
                <p>
                  <span>Doğal alternatif: </span>
                  <span lang="de">{c.alternative}</span>
                </p>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}
