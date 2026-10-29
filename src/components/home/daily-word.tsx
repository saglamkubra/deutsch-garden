"use client";
import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";
import { ColorCard } from "@/components/garden/primitives";
import { Button } from "@/components/ui/button";
import { useLearning } from "@/lib/learning/store";
import { assignmentKey } from "@/lib/learning/engine";
export function DailyWord() {
  const { state, repository, date, ready } = useLearning();
  const assignment = state.assignments[assignmentKey(date, state.level)];
  const word = assignment?.newIds[0]
    ? repository.get(assignment.newIds[0])
    : null;
  return (
    <ColorCard className="daily-word" tone="peach">
      <div className="card-heading">
        <h2>
          <Flower2 size={21} /> Günün Kelimeleri 🌸
        </h2>
        <span className="word-type">{state.level}</span>
      </div>
      {word ? (
        <>
          <div className="word-display">
            <div>
              <span className="word-article" lang="de">
                {word.article}
              </span>
              <h3 lang="de">{word.german_word}</h3>
              <p>{word.turkish_meaning}</p>
            </div>
            <span className="word-flower" aria-hidden="true">
              ✿
            </span>
          </div>
          <div className="word-example">
            <p lang="de">{word.example_sentence_de}</p>
            <p>{word.example_sentence_tr}</p>
          </div>
        </>
      ) : (
        <p className="speech-notice">
          {!ready
            ? "Günün seçimi hazırlanıyor…"
            : "Bu düzeyde yeni kelime yok. Hazinendeki kelimelere ve tekrarlarına bakabilirsin."}
        </p>
      )}
      <Button asChild variant="outline">
        <Link href="/kelimelerim#gunun-kelimeleri">
          {assignment?.newIds.length ?? 0} yeni kelimeyi keşfet{" "}
          <ArrowRight size={16} />
        </Link>
      </Button>
      <p className="speech-notice">
        Kelime seçimin ve öğrenme yanıtların kaydedilir. XP ve günlük
        görevlerini Başarılarım sayfasından takip edebilirsin.
      </p>
    </ColorCard>
  );
}
