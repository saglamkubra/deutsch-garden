"use client";
import Link from "next/link";
import { useLearning, reviewStandaloneWord } from "@/lib/learning/store";
import { wordAudio } from "@/lib/listening/content";
import { Flashcards } from "@/components/learning/flashcards";
import { PageHeading } from "@/components/garden/primitives";
export function ListeningWordCard({ wordId }: { wordId: string }) {
  const { repository, state, date, ready, readonly, notice } = useLearning(),
    word = repository.get(wordId);
  if (!word)
    return (
      <div className="page-content">
        <h1>Bu kelime kaydı bulunamadı.</h1>
        <Link href="/kelimelerim">Kelime hazineme dön</Link>
      </div>
    );
  const p = state.progress[wordId],
    graded = p?.lastAnsweredOn === date,
    answers = graded
      ? { [wordId]: p.known ? ("known" as const) : ("again" as const) }
      : {};
  return (
    <div className="page-content listening-single-word">
      <PageHeading
        eyebrow="DİNLEDİĞİN BİR KELİME, YENİ BİR FİLİZ"
        title={
          word.word_type === "expression"
            ? "İfade Kartım 🌱"
            : "Kelime Kartım 🌱"
        }
        description="Aynı kelime hazinesi, aynı tekrar planı. Buradaki tekrar ek kaynak ödülü vermez."
      />
      {notice && <p role="status">{notice}</p>}
      <Flashcards
        key={wordId}
        words={[word]}
        answers={answers}
        onAnswer={(id, answer) => void reviewStandaloneWord(id, answer)}
        disabled={!ready || readonly || graded}
        title={
          word.word_type === "expression" ? "İfade tekrarı" : "Kelime tekrarı"
        }
        audioUrl={wordAudio[wordId]?.url}
      />
      {graded && (
        <p>Bugünkü yanıtın kayıtlı. Sonraki tekrar günü: {p.dueOn}.</p>
      )}
      <nav>
        <Link href="/kelimelerim#dinleme-tekrari">
          ← Kaydettiğim kelimelere dön
        </Link>
        <Link href="/dinleme-kulubu">Dinleme kulübüne git →</Link>
      </nav>
    </div>
  );
}
