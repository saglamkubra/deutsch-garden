"use client";
import Link from "next/link";
import { Headphones, ArrowRight, BookmarkCheck } from "lucide-react";
import { useListening } from "@/lib/listening/store";
import { useLearning } from "@/lib/learning/store";
export function ListeningSavedWords() {
  const { state } = useListening(),
    { repository } = useLearning();
  const words = state.savedWords
    .map((id) => repository.get(id))
    .filter((w) => !!w);
  return (
    <section id="dinleme-tekrari" className="listening-saved-vocabulary">
      <div>
        <Headphones size={23} />
        <h2>Dinlemeden kelime çantam</h2>
        <span>{words.length} kelime</span>
      </div>
      <p>
        Kaydettiğin sözcükler mevcut tekrar planına eklenir. Kartları açıp aynı
        öğrenme sistemiyle çalışabilirsin.
      </p>
      {words.length ? (
        <div className="listening-saved-word-links">
          {words.map((w) => (
            <Link key={w.id} href={"/kelimelerim/" + w.id}>
              <BookmarkCheck size={16} />
              <strong lang="de">
                {w.article} {w.german_word}
              </strong>
              <span>{w.turkish_meaning}</span>
              <ArrowRight size={15} />
            </Link>
          ))}
        </div>
      ) : (
        <Link href="/dinleme-kulubu">
          Bir dinleme keşfet, ilk kelimeni kaydet →
        </Link>
      )}
    </section>
  );
}
