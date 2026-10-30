// Static authored content only. Do not import learner stores or private history.
import vocabulary from "../../data/vocabulary.json" with { type: "json" };
import glossary from "../../data/stories/glossary.json" with { type: "json" };
import extraGlossary from "../../data/stories/extra-glossary.json" with { type: "json" };
import comedyGlossary from "../../data/stories/comedy-glossary.json" with { type: "json" };
import worldGlossary from "../../data/stories/world-glossary.json" with { type: "json" };
import { miniCourses } from "../courses/content.ts";
export const audioText = (text: string) =>
  text.normalize("NFC").replace(/\s+/g, " ").trim();
export function publicPronunciationTexts(): string[] {
  const texts = new Set<string>();
  const add = (text?: string | null) => {
    if (text?.trim()) texts.add(audioText(text));
  };
  for (const word of vocabulary) {
    const label = [word.article, word.german_word].filter(Boolean).join(" ");
    add(label);
    add(word.german_word);
    add(word.example_sentence_de);
    if (!(
      word.word_type === "expression" &&
      word.german_word === word.example_sentence_de
    ))
      add(label + ". " + word.example_sentence_de);
  }
  for (const course of miniCourses) {
    for (const example of course.examples) add(example.de);
    for (const q of [...course.guided, ...course.independent]) add(q.audio);
  }
  for (const word of [
    ...glossary,
    ...extraGlossary,
    ...comedyGlossary,
    ...worldGlossary,
  ])
    add([word.article, word.word].filter(Boolean).join(" "));
  return [...texts].sort();
}
