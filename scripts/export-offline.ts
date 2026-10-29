import { writeFileSync, mkdirSync } from "node:fs";
import { miniCourses } from "../src/lib/courses/content.ts";
import { LEVELS } from "../src/lib/learning/types.ts";
import { courseAudio as audio } from "../src/lib/courses/audio.ts";
mkdirSync("public/offline-packs", { recursive: true });
for (const level of LEVELS) {
  const courses = miniCourses.filter((c) => c.level === level);
  writeFileSync(
    `public/offline-packs/${level}.json`,
    JSON.stringify({
      version: 1,
      level,
      courses,
      audio: Object.fromEntries(
        courses.flatMap((c) => c.examples.map((e) => [e.id, audio[e.id]])),
      ),
    }),
  );
}
console.log(
  "Altı genel ders paketi oluşturuldu. Özel kullanıcı verisi okunmadı.",
);
