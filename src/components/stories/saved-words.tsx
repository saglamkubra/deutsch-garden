"use client";
import { useState } from "react";
import { useStories } from "@/lib/stories/store";
import { wordById } from "@/lib/stories/content";
import type { StoryWord } from "@/lib/stories/content";
import { StoryWordDialog } from "./word-dialog";
export function StorySavedWords() {
  const { state } = useStories(),
    [selected, setSelected] = useState<StoryWord | null>(null);
  const words = state.savedWords
    .map(wordById)
    .filter((w): w is StoryWord => !!w);
  return (
    <section className="story-saved-words" id="hikaye-kelimeleri">
      <span className="story-kicker">OKUDUĞUN SAYFALARDAN</span>
      <h2>Hikâyeden kelimelerim 📖</h2>
      <p>
        {words.length
          ? "Kütüphane kelimeleri mevcut tekrar listene de eklenir. Özgün hikâye sözlüğü maddeleri bu koleksiyonda saklanır."
          : "Hikâyelerde renkli bir kelimeye dokunup kaydettiğinde burada bulabilirsin."}
      </p>
      <div>
        {words.map((w) => (
          <button key={w.id} onClick={() => setSelected(w)}>
            <strong lang="de">
              {w.article} {w.word}
            </strong>
            <span>{w.meaning}</span>
            <small>
              {w.repository ? "Kelime kütüphanesi" : "Hikâye sözlüğü"}
            </small>
          </button>
        ))}
      </div>
      {selected && (
        <StoryWordDialog
          key={selected.id}
          word={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
