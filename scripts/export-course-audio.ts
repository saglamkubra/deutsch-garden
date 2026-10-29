// Public curriculum only; never export learner progress or environment values.
import { mkdirSync, writeFileSync } from "node:fs";
import { miniCourses } from "../src/lib/courses/content.ts";
import original from "../src/data/courses/audio.json" with { type: "json" };
const originalIds = new Set(Object.keys(original));
const examples = miniCourses.flatMap((course) =>
  course.examples
    .filter((example) => !originalIds.has(example.id))
    .map(({ id, de }) => ({ id, de, course: course.id })),
);
mkdirSync(".cache", { recursive: true });
writeFileSync(".cache/course-audio-input.json", JSON.stringify(examples));
console.log(
  `${examples.length} genel ders örneği ses üretimine hazırlandı; özel kayıt okunmadı.`,
);
