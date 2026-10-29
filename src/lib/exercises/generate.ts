import type { VocabularyRepository } from "../learning/repository.ts";
import type {
  LearningState,
  Level,
  VocabularyRecord,
} from "../learning/types.ts";
import type { ExerciseState, Mode, Question } from "./types.ts";
import { grammar } from "./grammar.ts";
export function normalize(value: string, language: "de" | "tr" = "de") {
  return value
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase(language === "tr" ? "tr-TR" : "de-DE")
    .replace(/ß/g, "ss")
    .replace(/[.,!?;:„“"'’‘()–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function alternatives(word: VocabularyRecord, german = false) {
  if (german)
    return [
      word.german_word,
      ...(word.article ? [word.article + " " + word.german_word] : []),
    ];
  const curated: Record<string, string[]> = {
    Uhr: ["Saat"],
    arbeiten: ["Çalışmak"],
    Haus: ["Ev"],
    spielen: ["Çalmak"],
    Danke: ["Teşekkür ederim", "Sağ ol"],
    "Entschuldigung!": ["Özür dilerim", "Pardon", "Affedersin"],
    Bruder: ["Abi"],
    Freund: ["Arkadaş"],
    heißen: ["İsmi olmak"],
    fahren: ["Gitmek (araçla)", "Sürmek"],
  };
  return [
    ...word.turkish_meaning
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean),
    ...(curated[word.german_word] ?? []),
  ];
}
export function hash(value: string) {
  let n = 2166136261;
  for (const c of value) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  return n >>> 0;
}
export function shuffle<T>(items: readonly T[], seed: string): T[] {
  return items
    .map((v, i) => ({ v, n: hash(seed + ":" + i) }))
    .sort((a, b) => a.n - b.n)
    .map((x) => x.v);
}
const display = (w: VocabularyRecord) =>
  [w.article, w.german_word].filter(Boolean).join(" ");
function uniqueWords(rows: VocabularyRecord[]) {
  const seen = new Set<string>();
  return rows.filter((w) => {
    const keys = alternatives(w).map((x) => normalize(x, "tr"));
    const de = normalize(w.german_word);
    if (seen.has("de:" + de) || keys.some((k) => seen.has(k))) return false;
    seen.add("de:" + de);
    keys.forEach((k) => seen.add(k));
    return true;
  });
}
export function generateQuestions(
  repo: VocabularyRepository,
  level: Level,
  mode: Mode,
  seed: string,
  priority: string[] = [],
  mistakes: ExerciseState["mistakes"] = {},
  count = 10,
): Question[] {
  const pool = uniqueWords(repo.byLevel(level));
  if (!pool.length) return [];
  const rows = [...pool].sort((a, b) => {
    const score = (w: VocabularyRecord) =>
      (mistakes[w.id]?.wrong ?? 0) * 4 -
      (mistakes[w.id]?.right ?? 0) * 2 +
      (priority.includes(w.id) ? 20 : 0);
    return score(b) - score(a) || hash(seed + a.id) - hash(seed + b.id);
  });
  const result: Question[] = [];
  const used = new Set<string>();
  const types: Question["type"][] = [
    "choice",
    "blank",
    "matching",
    "sentence",
    "tr-de",
    "de-tr",
    "listening",
  ];
  for (
    let attempt = 0;
    attempt < rows.length * types.length && result.length < count;
    attempt++
  ) {
    let w = rows[attempt % rows.length];
    let type = mode === "daily" ? types[result.length % types.length] : mode;
    // Repeated mistakes receive scaffolding; consolidated words get sentence practice in mixed quizzes.
    if (
      mode === "daily" &&
      (mistakes[w.id]?.wrong ?? 0) > (mistakes[w.id]?.right ?? 0) + 1
    )
      type = "choice";
    if (mode === "daily" && (type === "blank" || type === "sentence")) {
      const candidates = rows.filter(
        (v) =>
          grammar[v.german_word]?.sentence === v.example_sentence_de &&
          !used.has("exercise-v1:" + type + ":" + v.id),
      );
      w = candidates[0] ?? w;
    }
    if (
      mode === "daily" &&
      type === "choice" &&
      (mistakes[w.id]?.right ?? 0) >= 3 &&
      (mistakes[w.id]?.right ?? 0) > (mistakes[w.id]?.wrong ?? 0) &&
      grammar[w.german_word]?.sentence === w.example_sentence_de
    )
      type = "sentence";
    const meta = grammar[w.german_word];
    if (
      (type === "blank" || type === "sentence") &&
      (!meta || meta.sentence !== w.example_sentence_de)
    ) {
      if (mode === "daily") type = "choice";
      else continue;
    }
    const id = "exercise-v1:" + type + ":" + w.id;
    if (used.has(id)) continue;
    const base: Question = {
      id,
      type,
      wordIds: [w.id],
      prompt: "",
      options: [],
      accepted: [],
      explanation: "",
    };
    if (type === "choice" || type === "listening") {
      const answers = alternatives(w);
      const correct = answers[0];
      const distractors = shuffle(
        pool.filter((x) => x.id !== w.id),
        seed + w.id,
      )
        .sort(
          (a, b) =>
            Number(b.word_type === w.word_type) -
            Number(a.word_type === w.word_type),
        )
        .filter(
          (x) =>
            !alternatives(x).some((a) =>
              answers.some((b) => normalize(a, "tr") === normalize(b, "tr")),
            ),
        );
      const seen = new Set([normalize(correct, "tr")]);
      const wrong: string[] = [];
      for (const d of distractors) {
        const text = alternatives(d)[0];
        const key = normalize(text, "tr");
        if (!seen.has(key)) {
          seen.add(key);
          wrong.push(text);
        }
        if (wrong.length === 3) break;
      }
      if (wrong.length < 1) continue;
      base.prompt =
        type === "listening"
          ? "Duyduğun Almanca sözcüğün Türkçe karşılığı hangisi?"
          : display(w) +
            (w.word_type === "expression"
              ? " ifadesinin Türkçe karşılığı hangisi?"
              : " kelimesinin Türkçe karşılığı hangisi?");
      base.options = shuffle([correct, ...wrong], seed + id);
      base.accepted = [correct];
      if (type === "listening") base.audio = display(w);
      base.explanation =
        display(w) +
        " → " +
        w.turkish_meaning +
        ". Örnek: " +
        w.example_sentence_de +
        " — " +
        w.example_sentence_tr;
    } else if (type === "blank" && meta) {
      base.prompt = meta.sentence.replace(
        new RegExp("\\b" + meta.missing + "\\b"),
        "___",
      );
      // Unicode letters do not use JS word boundaries (e.g. schläft); exact token replacement below.
      base.prompt = meta.sentence
        .split(" ")
        .map((t) => (normalize(t) === normalize(meta.missing) ? "___" : t))
        .join(" ");
      if (meta.phrase)
        base.prompt = meta.blank ?? meta.sentence.replace(meta.missing, "___");
      if (w.german_word === "arbeiten") base.prompt += " (sie = o, tekil)";
      base.options = shuffle(meta.forms, seed + id);
      base.accepted = [meta.missing];
      base.explanation = meta.explanation;
    } else if (type === "sentence" && meta) {
      base.prompt = w.example_sentence_tr;
      base.tiles = shuffle(
        meta.sentence.replace(/[.!?]/g, "").split(" "),
        seed + id,
      );
      base.accepted = meta.orders;
      base.explanation =
        meta.explanation +
        " Kabul edilen dizilişler: " +
        meta.orders.join(" / ");
    } else if (type === "matching") {
      const pairs = uniqueWords([
        w,
        ...shuffle(
          pool.filter((x) => x.id !== w.id),
          seed + id,
        ),
      ]).slice(0, 4);
      if (pairs.length < 2) continue;
      base.pairs = pairs.map((v) => ({
        id: v.id,
        de: display(v),
        tr: alternatives(v)[0],
      }));
      base.wordIds = pairs.map((v) => v.id);
      base.prompt = "Almanca sözcükleri Türkçe anlamlarıyla eşleştir.";
      base.accepted = [
        pairs
          .map((v) => v.id)
          .sort()
          .join("|"),
      ];
      base.explanation = pairs
        .map((v) => display(v) + " → " + v.turkish_meaning)
        .join(" · ");
    } else {
      const german = type === "tr-de";
      base.prompt = german ? w.turkish_meaning : display(w);
      base.accepted = alternatives(w, german);
      base.explanation =
        display(w) +
        " → " +
        w.turkish_meaning +
        ". " +
        w.example_sentence_de +
        " — " +
        w.example_sentence_tr;
    }
    used.add(id);
    result.push(base);
  }
  return result;
}
export function isCorrect(q: Question, value: string) {
  return q.accepted.some(
    (a) =>
      normalize(
        a,
        q.type === "de-tr" || q.type === "choice" || q.type === "listening"
          ? "tr"
          : "de",
      ) ===
      normalize(
        value,
        q.type === "de-tr" || q.type === "choice" || q.type === "listening"
          ? "tr"
          : "de",
      ),
  );
}
export function dailyPriority(state: LearningState, date: string) {
  const assignment = state.assignments[date + ":" + state.level];
  return [
    ...(assignment?.reviewIds ?? []),
    ...(assignment?.newIds ?? []),
    ...Object.entries(state.progress)
      .filter(([, p]) => p.dueOn <= date)
      .map(([id]) => id),
  ];
}
