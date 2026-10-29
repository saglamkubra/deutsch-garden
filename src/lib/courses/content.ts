import raw from "../../data/courses/mini-courses.json" with { type: "json" };
import a2 from "../../data/courses/a2-01.json" with { type: "json" };
import a202 from "../../data/courses/a2-02.json" with { type: "json" };
import a203 from "../../data/courses/a2-03.json" with { type: "json" };
import packed from "../../data/courses/curriculum-packed.json" with { type: "json" };
import { unpackCourses } from "./packed.ts";
import type { MiniCourse } from "./types.ts";
export const miniCourses = [
  ...raw,
  a2,
  a202,
  a203,
  ...(unpackCourses(packed) as MiniCourse[]),
] as MiniCourse[];
export const courseById = (id: string) => miniCourses.find((c) => c.id === id);
export const courseForUnit = (unitId: string) =>
  miniCourses.find((c) => c.unitId === unitId);
export function highlightedExample(text: string, highlights: string[]) {
  const ranges: { start: number; end: number }[] = [];
  for (const h of [...highlights].sort((a, b) => b.length - a.length)) {
    let from = 0;
    while (from < text.length) {
      const start = text.indexOf(h, from);
      if (start < 0) break;
      const end = start + h.length;
      from = end;
      if (
        (start > 0 && /\p{L}/u.test(text[start - 1])) ||
        (end < text.length && /\p{L}/u.test(text[end])) ||
        ranges.some((r) => start < r.end && end > r.start)
      )
        continue;
      ranges.push({ start, end });
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  const parts: { text: string; highlight: boolean }[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start > cursor)
      parts.push({ text: text.slice(cursor, r.start), highlight: false });
    parts.push({ text: text.slice(r.start, r.end), highlight: true });
    cursor = r.end;
  }
  if (cursor < text.length)
    parts.push({ text: text.slice(cursor), highlight: false });
  return parts;
}
