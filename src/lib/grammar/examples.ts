import type { Example } from "./types.ts";
export function exampleParts(example: Example) {
  const ranges: {
    start: number;
    end: number;
    highlight: Example["highlights"][number];
  }[] = [];
  const letter = /[\p{L}\p{N}]/u;
  for (const highlight of [...example.highlights].sort(
    (a, b) => b.text.length - a.text.length,
  )) {
    let from = 0;
    while (from < example.de.length) {
      const start = example.de.indexOf(highlight.text, from);
      if (start < 0) break;
      const end = start + highlight.text.length;
      from = end;
      if (
        (start > 0 && letter.test(example.de[start - 1])) ||
        (end < example.de.length && letter.test(example.de[end]))
      )
        continue;
      if (ranges.some((r) => start < r.end && end > r.start)) continue;
      ranges.push({ start, end, highlight });
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  let position = 0;
  const parts: { text: string; highlight?: Example["highlights"][number] }[] =
    [];
  for (const r of ranges) {
    if (r.start > position)
      parts.push({ text: example.de.slice(position, r.start) });
    parts.push({
      text: example.de.slice(r.start, r.end),
      highlight: r.highlight,
    });
    position = r.end;
  }
  if (position < example.de.length)
    parts.push({ text: example.de.slice(position) });
  return parts;
}
