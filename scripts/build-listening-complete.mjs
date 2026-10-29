// Only public authored content is generated. Existing lessons and learner data are never written.
import { readFileSync, writeFileSync } from "node:fs";
import a2 from "./listening-complete/a2.mjs";
import b1 from "./listening-complete/b1.mjs";
import b2 from "./listening-complete/b2.mjs";
import c1 from "./listening-complete/c1.mjs";
import c2 from "./listening-complete/c2.mjs";
import basic from "./listening-complete/supplement-basic.mjs";
import moreB2 from "./listening-complete/supplement-b2.mjs";
import moreC1 from "./listening-complete/supplement-c1.mjs";
import moreC2 from "./listening-complete/supplement-c2.mjs";
import { shuffle } from "../src/lib/exercises/generate.ts";

const vocabulary = JSON.parse(readFileSync("src/data/vocabulary.json", "utf8"));
const words = vocabulary.filter(
  (w) => !w.german_word.includes(" ") && w.german_word.length > 2,
);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = (s) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${escape(s)}(?![\\p{L}\\p{N}])`, "u");
const all = [];
const supplements = [...basic, ...moreB2, ...moreC1, ...moreC2];
for (const [level, originals] of Object.entries({
  A1: [],
  A2: a2,
  B1: b1,
  B2: b2,
  C1: c1,
  C2: c2,
})) {
  const specs = [...originals, ...supplements.filter((s) => s.level === level)];
  for (const spec of specs) {
    const id = spec.id ?? `listen-${level.toLowerCase()}-plan-${spec.n}`;
    const sentences = spec.lines.map(([de, tr], i) => ({
      id: `${id}:s${i + 1}`,
      de,
      tr,
      links: words
        .filter((w) => pattern(w.german_word).test(de))
        .map((w) => ({ text: w.german_word, lemma: w.german_word })),
    }));
    const quiz = spec.checks.map(
      ([prompt, answer, w1, w2, explanation], i) => ({
        id: `${id}:q${i + 1}`,
        type: "choice",
        wordIds: [id],
        prompt,
        accepted: [answer],
        options: shuffle([answer, w1, w2], id + ":" + i),
        explanation,
      }),
    );
    for (const [i, [line, answer, w1, w2, why]] of spec.focus.entries()) {
      const sentence = sentences[line];
      const re = pattern(answer);
      if (!re.test(sentence.de))
        throw Error(`${id}: odak bulunamadı: ${answer}`);
      quiz.push({
        id: `${id}:q${5 + i}`,
        type: "blank",
        wordIds: [id],
        prompt: `Duyduğun biçimi tamamla: ${sentence.de.replace(re, "___")}\nAnlamı: ${sentence.tr}`,
        accepted: [answer],
        options: shuffle([answer, w1, w2], id + ":blank:" + i),
        explanation: why,
      });
    }
    for (const [i, [line, , , , why]] of spec.focus.entries()) {
      const sentence = sentences[line];
      quiz.push({
        id: `${id}:q${9 + i}`,
        type: "sentence",
        wordIds: [id],
        prompt: `Verilen sözcüklerle kayıttaki sırayı kur: ${sentence.tr}`,
        accepted: [sentence.de],
        options: [],
        tiles: shuffle(
          sentence.de.replace(/[.,!?;:]/g, "").split(/\s+/),
          id + ":order:" + i,
        ),
        explanation:
          why +
          " Bu etkinlik kayıttaki örnek sırayı çalıştırır; bütün doğal alternatifleri değerlendirmez.",
      });
    }
    all.push({
      id,
      level,
      title: spec.title,
      german: spec.german,
      category: spec.category,
      icon: spec.category === "grammar" ? "📚" : "🎧",
      summary: spec.goal,
      lemmas: [
        ...new Set(sentences.flatMap((s) => s.links.map((l) => l.lemma))),
      ],
      sentences,
      quiz,
      guidance: [
        "İlk dinleyişte metni açmadan ana konuyu ve konuşmacının amacını bul. " +
          spec.goal,
        "İkinci dinleyişte cümleleri tekrar çal, Türkçe çeviriyle karşılaştır. " +
          spec.focus[0][4],
        "Ayrıntı ile yorumu ayır; duymadığın bilgiyi tahmin ederek kesinleştirme. " +
          spec.checks[3][4],
        "Dil odağı: " +
          spec.focus[1][4] +
          " Ardından 12 soruyu çöz; yanlış açıklamasına dönüp ilgili bölümü yeniden dinle.",
      ],
    });
  }
}
if (all.length !== 50 || new Set(all.map((e) => e.id)).size !== 50)
  throw Error("Katalog sayısı veya kimlikler geçersiz");
writeFileSync(
  "src/data/listening/complete-episodes.json",
  JSON.stringify(all, null, 2) + "\n",
);
console.log(
  `${all.length} özgün dinleme, ${all.reduce((n, e) => n + e.sentences.length, 0)} iki dilli bölüm, ${all.reduce((n, e) => n + e.quiz.length, 0)} soru hazırlandı. Eski içerik ve özel kayıtlar değiştirilmedi.`,
);
