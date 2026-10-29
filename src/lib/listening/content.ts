import raw from "../../data/listening/episodes.json" with { type: "json" };
import assets from "../../data/listening/audio-manifest.json" with { type: "json" };
import extra from "../../data/listening/extra-episodes.json" with { type: "json" };
import extraAssets from "../../data/listening/extra-audio.json" with { type: "json" };
import complete from "../../data/listening/complete-episodes.json" with { type: "json" };
import completeAssets from "../../data/listening/complete-audio.json" with { type: "json" };
import { LocalVocabularyRepository } from "../learning/repository.ts";
import { originalA1 } from "../learning/seed.ts";
import { generateQuestions, shuffle } from "../exercises/generate.ts";
import type { Question } from "../exercises/types.ts";
import type { Episode, AudioAsset, Category, Transcript } from "./types.ts";
import type { Level } from "../learning/types.ts";
const repo = new LocalVocabularyRepository(originalA1);
const audioMap = assets.episodes as Record<string, AudioAsset>;
export const wordAudio = assets.words as Record<
  string,
  { url: string; duration: number }
>;
const originalEpisodes: Episode[] = raw.map((ep) => {
  const quiz: Question[] = ep.quiz.map((q) => ({
    id: q.id,
    type: q.kind === "blank" ? "tr-de" : "choice",
    wordIds: [ep.id],
    prompt: q.prompt,
    accepted: [q.answer],
    options: q.kind === "blank" ? [] : shuffle([q.answer, ...q.options], q.id),
    explanation: q.explanation,
  }));
  const target = repo
    .all()
    .find((w) => w.german_word === ep.vocabularyQuestion)!;
  const vocabulary = generateQuestions(
    repo,
    "A1",
    "choice",
    ep.id,
    [target.id],
    {},
    60,
  ).find((q) => q.wordIds[0] === target.id)!;
  quiz.push({
    ...vocabulary,
    id: ep.id + ":q5",
    prompt: "Kelime keşfi: " + vocabulary.prompt,
  });
  return {
    ...ep,
    level: ep.level as Level,
    category: ep.category as Category,
    sentences: ep.sentences as Transcript[],
    quiz,
    audio: audioMap[ep.id],
  };
});
const extraAudio = extraAssets.episodes as Record<string, AudioAsset>;
const completeAudio = completeAssets.episodes as Record<string, AudioAsset>;
export const episodes: Episode[] = [
  ...originalEpisodes,
  ...(extra as Omit<Episode, "audio">[]).map((ep) => ({
    ...ep,
    audio: extraAudio[ep.id],
  })),
  ...(complete as Omit<Episode, "audio">[]).map((ep) => ({
    ...ep,
    audio: completeAudio[ep.id],
  })),
];
const plans: Record<Exclude<Level, "A1">, [string, Category][]> = {
  A2: [
    ["Hafta sonu planları", "conversation"],
    ["Yolculuk hazırlığı", "travel"],
    ["Restoranda konuşmalar", "conversation"],
    ["Ev ararken", "germany"],
    ["Günlük sorunlar", "conversation"],
    ["Davetler", "culture"],
    ["Kişisel deneyimler", "stories"],
  ],
  B1: [
    ["İş yerinde konuşmalar", "education"],
    ["Almanya’da yaşam", "germany"],
    ["Eğitim üzerine", "education"],
    ["Seyahat deneyimleri", "travel"],
    ["Kültür farkları", "culture"],
    ["Kişisel görüşler", "conversation"],
    ["Günlük hikâyeler", "stories"],
  ],
  B2: [
    ["Röportajlar", "culture"],
    ["Toplumsal konular", "germany"],
    ["Teknoloji üzerine", "technology"],
    ["Çevre ve gelecek", "culture"],
    ["İş yeri tartışmaları", "education"],
    ["Haber diliyle açıklamalar", "germany"],
  ],
  C1: [
    ["Akademik tartışmalar", "education"],
    ["İleri röportajlar", "culture"],
    ["Karmaşık toplumsal konular", "germany"],
    ["Kültürel çözümlemeler", "culture"],
    ["Mesleki sunumlar", "education"],
  ],
  C2: [
    ["İnce ayrımlı tartışmalar", "conversation"],
    ["İleri kültür yorumları", "culture"],
    ["Karmaşık savlar", "education"],
    ["Deyimsel anlatım", "words"],
    ["Edebiyat sohbetleri", "stories"],
  ],
};
export const plannedEpisodes: Episode[] = (
  Object.entries(plans) as [Exclude<Level, "A1">, [string, Category][]][]
)
  .flatMap(([level, items]) =>
    items.map(([title, category], i) => ({
      id: "listen-" + level.toLowerCase() + "-plan-" + (i + 1),
      level,
      title,
      german: "",
      category,
      icon: "🌱",
      summary: "Ses kaydı, transkript ve mini test henüz hazırlanmadı.",
      lemmas: [],
      sentences: [],
      quiz: [],
    })),
  )
  .filter((ep) => !episodes.some((ready) => ready.id === ep.id));
export const library = [...episodes, ...plannedEpisodes];
export const episodeById = (id: string) => library.find((e) => e.id === id);
export const formatDuration = (seconds: number) =>
  Math.floor(seconds / 60) +
  ":" +
  String(Math.floor(seconds % 60)).padStart(2, "0");
