import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { episodes, library, wordAudio } from "../src/lib/listening/content.ts";
import { CATEGORIES } from "../src/lib/listening/types.ts";
const root = new URL("../", import.meta.url),
  q = (v: unknown) =>
    "'" +
    String(typeof v === "string" ? v : JSON.stringify(v)).replace(/'/g, "''") +
    "'";
const lines = [
  "-- Original Deutsch Garden content and pre-generated speech. Preparation only.",
  "begin;",
];
function insert(
  table: string,
  fields: string[],
  values: unknown[],
  key = "id",
) {
  lines.push(
    "insert into public." +
      table +
      " (" +
      fields.join(",") +
      ") values (" +
      values.map((v) => (v === null ? "null" : q(v))).join(",") +
      ") on conflict (" +
      key +
      ") do update set " +
      fields
        .filter((f) => f !== key)
        .map((f) => f + "=excluded." + f)
        .join(",") +
      ";",
  );
}
Object.entries(CATEGORIES).forEach(([id, label], i) =>
  insert(
    "listening_categories",
    ["id", "title_tr", "position"],
    [id, label, i + 1],
  ),
);
const sourceUrl =
  "https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD";
for (const e of library) {
  insert(
    "listening_episodes",
    [
      "id",
      "level",
      "category_id",
      "title_tr",
      "title_de",
      "summary_tr",
      "icon",
      "content_status",
      "audio_kind",
      "lemmas",
      "source_name",
    ],
    [
      e.id,
      e.level,
      e.category,
      e.title,
      e.german,
      e.summary,
      e.icon,
      e.audio ? "ready" : "planned",
      e.audio ? "generated" : "none",
      e.lemmas,
      "Deutsch Garden · özgün eğitim metni",
    ],
  );
  if (!e.audio) continue;
  insert(
    "listening_audio_assets",
    [
      "id",
      "episode_id",
      "vocabulary_id",
      "url",
      "duration",
      "sample_rate",
      "sha256",
      "voice_name",
      "engine",
      "source_url",
      "license",
    ],
    [
      e.id + ":audio",
      e.id,
      null,
      e.audio.url,
      e.audio.duration,
      e.audio.sampleRate,
      e.audio.sha256,
      "Thorsten (Almanca)",
      "Piper 1.8.0",
      sourceUrl,
      "LicenseRef-DeutschGarden-Original",
    ],
  );
  e.sentences.forEach((s, i) => {
    const segment = e.audio!.segments[i];
    insert(
      "listening_transcripts",
      [
        "id",
        "episode_id",
        "position",
        "sentence_de",
        "translation_tr",
        "speaker",
        "word_links",
        "audio_start",
        "audio_end",
      ],
      [
        s.id,
        e.id,
        i,
        s.de,
        s.tr,
        s.speaker ?? null,
        s.links,
        segment.start,
        segment.end,
      ],
    );
  });
  e.quiz.forEach((question, i) => {
    insert(
      "listening_questions",
      ["id", "episode_id", "type_id", "position", "prompt", "public_payload"],
      [
        question.id,
        e.id,
        question.type,
        i,
        question.prompt,
        { options: question.options },
      ],
    );
    insert(
      "listening_question_answers",
      ["question_id", "accepted", "explanation_tr"],
      [question.id, question.accepted, question.explanation],
      "question_id",
    );
  });
}
for (const [id, audio] of Object.entries(wordAudio)) {
  const bytes = readFileSync(new URL("public" + audio.url, root)),
    sha = createHash("sha256").update(bytes).digest("hex");
  insert(
    "listening_audio_assets",
    [
      "id",
      "episode_id",
      "vocabulary_id",
      "url",
      "duration",
      "sample_rate",
      "sha256",
      "voice_name",
      "engine",
      "source_url",
      "license",
    ],
    [
      "word:" + id,
      null,
      id,
      audio.url,
      audio.duration,
      bytes.readUInt32LE(24),
      sha,
      "Thorsten (Almanca)",
      "Piper 1.8.0",
      sourceUrl,
      "LicenseRef-DeutschGarden-Original",
    ],
  );
}
lines.push("commit;");
writeFileSync(
  new URL("supabase/listening-seed.sql", root),
  lines.join("\n") + "\n",
  "utf8",
);
const report = {
  readyByLevel: Object.fromEntries(
    ["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => [
      l,
      episodes.filter((e) => e.level === l && e.audio).length,
    ]),
  ),
  readyEpisodes: episodes.length,
  plannedTopics: library.length - episodes.length,
  transcriptSentences: episodes.reduce((n, e) => n + e.sentences.length, 0),
  comprehensionQuizzes: episodes.length,
  quizQuestions: episodes.reduce((n, e) => n + e.quiz.length, 0),
  hostedEpisodeAudio: episodes.length,
  hostedWordAudio: Object.keys(wordAudio).length,
  browserSpeechPrimaryEpisodes: 0,
  totalEpisodeDuration: episodes.reduce((n, e) => n + e.audio!.duration, 0),
  supabaseConnected: false,
  migrationApplied: false,
};
writeFileSync(
  new URL("reports/listening-counts.json", root),
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);
console.log(report);
