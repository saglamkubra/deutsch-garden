import type { Transcript } from "./types.ts";
import type { VocabularyRepository } from "../learning/repository.ts";
export function transcriptParts(
  sentence: Transcript,
  repo: VocabularyRepository,
) {
  const ranges: { start: number; end: number; wordId: string }[] = [];
  const letter = /[\p{L}\p{N}]/u;
  for (const link of [...sentence.links].sort(
    (a, b) => b.text.length - a.text.length,
  )) {
    const word = repo.all().find((w) => w.german_word === link.lemma);
    if (!word) continue;
    let from = 0;
    while (from < sentence.de.length) {
      const start = sentence.de.indexOf(link.text, from);
      if (start < 0) break;
      const end = start + link.text.length;
      from = end;
      if (
        (start > 0 && letter.test(sentence.de[start - 1])) ||
        (end < sentence.de.length && letter.test(sentence.de[end])) ||
        ranges.some((r) => start < r.end && end > r.start)
      )
        continue;
      ranges.push({ start, end, wordId: word.id });
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  const parts: { text: string; wordId?: string }[] = [];
  let pos = 0;
  for (const r of ranges) {
    if (r.start > pos) parts.push({ text: sentence.de.slice(pos, r.start) });
    parts.push({ text: sentence.de.slice(r.start, r.end), wordId: r.wordId });
    pos = r.end;
  }
  if (pos < sentence.de.length) parts.push({ text: sentence.de.slice(pos) });
  return parts;
}
