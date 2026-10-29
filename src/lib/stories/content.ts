import authoredGlossary from "../../data/stories/glossary.json" with { type: "json" };
import raw from "../../data/stories/stories.json" with { type: "json" };
import extra from "../../data/stories/extra-stories.json" with { type: "json" };
import extraGlossary from "../../data/stories/extra-glossary.json" with { type: "json" };
import comedy from "../../data/stories/comedy-stories.json" with { type: "json" };
import comedyGlossary from "../../data/stories/comedy-glossary.json" with { type: "json" };
import { originalA1 } from "../learning/seed.ts";
import { LocalVocabularyRepository } from "../learning/repository.ts";
import type { Story } from "./types.ts";
import { validateStory } from "./graph.ts";
export const stories = [...raw, ...extra, ...comedy] as Story[];
for (const story of stories) {
  const errors = validateStory(story);
  if (errors.length) throw new Error(story.id + ": " + errors.join("; "));
}
export const storyById = (id: string) => stories.find((s) => s.id === id);
export const categories = {
  daily: "Günlük Hayat",
  friendship: "Arkadaşlık",
  mystery: "Gizem",
  fantasy: "Fantastik Maceralar",
  travel: "Seyahat",
  work: "Okul ve İş",
  germany: "Almanya’da Yaşam",
  comedy: "Komik Hikâyeler",
};
export const storyRepository = new LocalVocabularyRepository(originalA1);
// Explicitly authored glossary; these entries are never presented as database records.
export type StoryWord = {
  id: string;
  word: string;
  article: string;
  meaning: string;
  plural: string;
  de: string;
  tr: string;
  repository: boolean;
};
export const glossary = [
  ...authoredGlossary,
  ...extraGlossary,
  ...comedyGlossary,
] as StoryWord[];
export function resolveWord(lemma: string): StoryWord | undefined {
  const w = storyRepository.all().find((w) => w.german_word === lemma);
  return w
    ? {
        id: w.id,
        word: w.german_word,
        article: w.article ?? "",
        meaning: w.turkish_meaning,
        plural: w.plural_form ?? "",
        de: w.example_sentence_de,
        tr: w.example_sentence_tr,
        repository: true,
      }
    : glossary.find((w) => w.word === lemma);
}
export const wordById = (id: string) =>
  glossary.find((w) => w.id === id) ??
  (() => {
    const w = storyRepository.get(id);
    return w ? resolveWord(w.german_word) : undefined;
  })();
const storyPlans = [
  {
    id: "plan-b1-briefe",
    level: "B1",
    title: "Bir Mektubun İzinde",
    description: "Geçmiş deneyimler, görüşler ve gerekçeler.",
  },
  {
    id: "plan-b2-entscheidung",
    level: "B2",
    title: "İki Yolun Arasında",
    description: "Çelişen amaçlar, dolaylı anlatım ve ayrıntılı kararlar.",
  },
  {
    id: "plan-c1-stadt",
    level: "C1",
    title: "Şehrin Hafızası",
    description: "Soyut temalar ve farklı anlatım üslupları.",
  },
  {
    id: "plan-c2-stimmen",
    level: "C2",
    title: "Satır Arasındaki Sesler",
    description: "Deyimler, ince anlamlar ve güvenilmez anlatıcılar.",
  },
] as const;
export const plannedStories = storyPlans.filter(
  (p) => !stories.some((s) => s.level === p.level),
);
export function annotatedParts(text: string, lemmas: string[]) {
  const words = lemmas.map(resolveWord).filter((w): w is StoryWord => !!w);
  return text
    .split(/([\p{L}]+(?:[’'-][\p{L}]+)*)/u)
    .filter(Boolean)
    .map((text) => ({
      text,
      word: words.find(
        (w) => w.word.toLocaleLowerCase("de") === text.toLocaleLowerCase("de"),
      ),
    }));
}
