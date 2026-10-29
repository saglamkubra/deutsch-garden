"use client";
import Link from "next/link";
import { useLumi } from "@/lib/lumi/store";
import { Pronunciation } from "@/components/learning/pronunciation";
export function LumiSavedWords() {
  const { state } = useLumi();
  return (
    <section className="lumi-saved-words" id="lumi-kelimelerim">
      <span className="lumi-eyebrow">SOHBETLERİNDEN KALAN KÜÇÜK HATIRALAR</span>
      <h2>Lumi’den kelimelerim 🌸</h2>
      <p>
        {state.words.length
          ? "Mevcut sözlükte eşleşen kelimeler tekrar listene de eklenir. Diğer ifadeler, doğrulanmış sözlük kaydı olarak gösterilmeden bu koleksiyonda saklanır."
          : "Sohbette bir kelimeyi kaydettiğinde burada bulabilirsin."}
      </p>
      <div>
        {state.words.map((w) => (
          <details key={w.key}>
            <summary lang="de">
              {w.word.article} {w.word.german}
            </summary>
            <p>{w.word.meaningTr}</p>
            <p lang="de">{w.word.exampleDe}</p>
            <p>{w.word.exampleTr}</p>
            <small>Lumi’nin AI açıklaması</small>
            {w.repositoryId ? (
              <Link href={"/kelimelerim/" + encodeURIComponent(w.repositoryId)}>
                Mevcut sözlük kartını ve tekrarını aç →
              </Link>
            ) : (
              <small>
                Ek ifade koleksiyonu · Sözlükte kesin eşleşme bulunmadı.
              </small>
            )}
            <Pronunciation
              text={[w.word.article, w.word.german].filter(Boolean).join(" ")}
            />
          </details>
        ))}
      </div>
    </section>
  );
}
