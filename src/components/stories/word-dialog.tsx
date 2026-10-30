"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, BookmarkPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pronunciation } from "@/components/learning/pronunciation";
import { wordAudio } from "@/lib/listening/content";
import storyAssets from "@/data/stories/audio.json";
import comedyAssets from "@/data/stories/comedy-audio.json";
import extraAssets from "@/data/stories/extra-audio.json";
import worldAssets from "@/data/stories/world-audio.json";
import { collectStoryWord, useStories } from "@/lib/stories/store";
import type { StoryWord } from "@/lib/stories/content";
export function StoryWordDialog({
  word,
  onClose,
}: {
  word: StoryWord;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    { state, readonly } = useStories();
  useEffect(() => {
    const d = dialog.current;
    d?.showModal();
    return () => d?.close();
  }, []);
  const saved = state.savedWords.includes(word.id);
  const recorded =
    wordAudio[word.id] ??
    (
      {
        ...storyAssets.glossary,
        ...extraAssets.glossary,
        ...comedyAssets.glossary,
        ...worldAssets.glossary,
      } as Record<string, { url: string }>
    )[word.id];
  return (
    <dialog
      ref={dialog}
      className="story-word-dialog"
      aria-labelledby="story-word-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="story-dialog-close"
        onClick={onClose}
        aria-label="Kelime yardımını kapat"
      >
        <X />
      </button>
      <span className="story-kicker">
        {word.repository ? "KELİME KÜTÜPHANENDEN" : "ÖZGÜN HİKÂYE SÖZLÜĞÜ"}
      </span>
      <h2 id="story-word-title" lang="de">
        <small>{word.article}</small> {word.word}
      </h2>
      <p className="story-word-meaning">{word.meaning}</p>
      {word.plural && (
        <p>
          Çoğul: <span lang="de">{word.plural}</span>
        </p>
      )}
      <blockquote lang="de">{word.de}</blockquote>
      <p>{word.tr}</p>
      {recorded ? (
        <audio
          controls
          preload="none"
          src={recorded.url}
          aria-label={`${word.word} Almanca telaffuzu`}
        />
      ) : (
        <Pronunciation
          text={[word.article, word.word].filter(Boolean).join(" ")}
        />
      )}
      <Button
        disabled={readonly || saved}
        onClick={() => void collectStoryWord(word.id)}
      >
        {saved ? <Check size={16} /> : <BookmarkPlus size={16} />}{" "}
        {saved ? "Kelimelerime eklendi" : "Kelimelerime ekle"}
      </Button>
      <p className="story-fine">
        {word.repository
          ? "Mevcut kelime tekrarı listene eklenir; ilerlemen korunur."
          : "Bu, hikâye için yazılmış bir sözlük maddesi. Kelimelerim sayfasındaki hikâye koleksiyonunda saklanır; ana kelime veritabanına eklenmez."}
      </p>
      {word.repository && (
        <Link href={"/kelimelerim/" + word.id}>Kelime kartını aç →</Link>
      )}
    </dialog>
  );
}
