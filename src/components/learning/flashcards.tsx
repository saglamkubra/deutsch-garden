"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Check,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { VocabularyRecord, Answer } from "@/lib/learning/types";
import { wordTypeLabels } from "@/lib/learning/types";
import { Pronunciation } from "./pronunciation";
export function Flashcards({
  words,
  answers,
  onAnswer,
  disabled,
  title,
  audioUrl,
}: {
  words: VocabularyRecord[];
  answers: Record<string, Answer>;
  onAnswer: (id: string, answer: Answer) => void;
  disabled: boolean;
  title: string;
  audioUrl?: string;
}) {
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);
  const word = words[Math.min(index, words.length - 1)];
  if (!word)
    return <p className="learning-empty">Bu çalışma için henüz kelime yok.</p>;
  const answered = words.filter((v) => answers[v.id]).length;
  const response = answers[word.id];
  const repeatedExpression =
    word.word_type === "expression" &&
    word.german_word === word.example_sentence_de;
  function move(delta: number) {
    setIndex((i) => Math.max(0, Math.min(words.length - 1, i + delta)));
    setBack(false);
  }
  return (
    <section className="flashcard-session" aria-label={title}>
      <div className="flashcard-session-heading">
        <span>{title}</span>
        <strong>
          {index + 1} / {words.length}
        </strong>
      </div>
      <Progress
        value={(answered / words.length) * 100}
        aria-label="Kartlara verilen yanıtların ilerlemesi"
      />
      <p className="session-count">
        {answered} / {words.length} kart yanıtlandı
      </p>
      <div
        className={`vocabulary-flashcard ${back ? "flipped" : ""} ${repeatedExpression ? "is-expression" : ""}`}
      >
        <span className="flashcard-kind">
          {word.cefr_level} · {wordTypeLabels[word.word_type]}
        </span>
        <div className="flashcard-word" lang="de">
          <span className={`article-${word.article ?? "none"}`}>
            {word.article}
          </span>
          <h3>{word.german_word}</h3>
        </div>
        {back ? (
          <div className="flashcard-back" key={word.id + "back"}>
            <p className="flashcard-meaning">{word.turkish_meaning}</p>
            {word.word_type === "noun" && (
              <p className="flashcard-plural">
                Çoğul:{" "}
                <span lang="de">
                  {word.plural_form ? "die " + word.plural_form : "—"}
                </span>
                {word.plural_note && <small>{word.plural_note}</small>}
              </p>
            )}
            {!repeatedExpression && (
              <div className="flashcard-example">
                <p lang="de">{word.example_sentence_de}</p>
                <p>{word.example_sentence_tr}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flashcard-front">
            <span aria-hidden="true">✿</span>
            <p>Anlamını hatırlayabiliyor musun?</p>
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={() => setBack((v) => !v)}
          aria-pressed={back}
        >
          <RotateCw size={16} />
          {back ? "Ön yüzü göster" : "Kartı çevir"}
        </Button>
      </div>
      {audioUrl ? (
        <div className="listening-word-recording">
          <audio
            controls
            preload="metadata"
            src={audioUrl}
            aria-label="Almanca kelime telaffuzu"
          />
          <small>Önceden üretilmiş yapay ses · İnsan kaydı değildir.</small>
        </div>
      ) : (
        <Pronunciation
          key={word.id}
          text={
            repeatedExpression
              ? word.german_word
              : (word.article ? word.article + " " : "") +
                word.german_word +
                ". " +
                word.example_sentence_de
          }
        />
      )}
      <div className="flashcard-answer">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !back || Boolean(response)}
          onClick={() => onAnswer(word.id, "again")}
        >
          <RefreshCw size={17} /> Tekrar Etmeliyim
        </Button>
        <Button
          type="button"
          disabled={disabled || !back || Boolean(response)}
          onClick={() => onAnswer(word.id, "known")}
        >
          <Check size={17} /> Biliyorum
        </Button>
      </div>
      <p className="flashcard-feedback" role="status">
        {response
          ? response === "known"
            ? "Bu kartı biliyorum olarak işaretledin."
            : "Bu kartı tekrar listene aldın."
          : !back
            ? "Yanıtlamak için önce kartın arka yüzüne bak."
            : "Yanıtın bu tarayıcıda saklanır."}
      </p>
      <div className="flashcard-navigation">
        <Button
          type="button"
          variant="outline"
          onClick={() => move(-1)}
          disabled={index === 0}
        >
          <ArrowLeft size={17} /> Önceki
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => move(1)}
          disabled={index >= words.length - 1}
        >
          Sonraki <ArrowRight size={17} />
        </Button>
      </div>
      <p className="srs-note">
        Basit tekrar planı: “Biliyorum” → 1, 3, 7, 14, 30 gün. “Tekrar
        Etmeliyim” → yarın. Aynı kelime bir günde yalnızca bir kez zamanlanır.
      </p>
    </section>
  );
}
