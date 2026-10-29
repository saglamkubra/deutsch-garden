import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  episodes,
  plannedEpisodes,
  wordAudio,
  episodeById,
} from "./content.ts";
import { initialListening } from "./types.ts";
import type { ListeningState } from "./types.ts";
import { CATEGORIES } from "./types.ts";
import completeEpisodes from "../../data/listening/complete-episodes.json" with { type: "json" };
import completeAudio from "../../data/listening/complete-audio.json" with { type: "json" };
import originalData from "../../data/listening/episodes.json" with { type: "json" };
import oldExtra from "../../data/listening/extra-episodes.json" with { type: "json" };
import oldExtraAudio from "../../data/listening/extra-audio.json" with { type: "json" };
import { validSnapshot } from "../account/snapshot.ts";
import {
  openEpisode,
  recordPlayback,
  recordSpokenSentence,
  coverage,
  savePosition,
  favorite,
  saveWord,
  ensureDaily,
  startQuiz,
  answerQuiz,
  nextQuestion,
  score,
  filterEpisodes,
  needsReview,
} from "./engine.ts";
import {
  createListeningPersistence,
  LISTENING_KEY,
  validListening,
} from "./persistence.ts";
import { isCorrect, normalize } from "../exercises/generate.ts";
import { originalA1 } from "../learning/seed.ts";
import bundled from "../../data/vocabulary.json" with { type: "json" };
import type { VocabularyRecord } from "../learning/types.ts";
import { LocalVocabularyRepository } from "../learning/repository.ts";
import { transcriptParts } from "./transcript.ts";
import {
  initialLearning,
  enqueueReview,
  answerStandalone,
} from "../learning/engine.ts";
import { createStarter, grantReward } from "../garden/model.ts";
import { SpeechSequence } from "./speech.ts";
const date = "2026-10-27";
function hear(s: ListeningState, id: string) {
  const duration = episodeById(id)!.audio!.duration;
  for (let n = 0; n < duration; n += 1)
    s = recordPlayback(s, id, n, Math.min(n + 1, duration), 100 + n);
  return s;
}
function quiz(
  s: ListeningState,
  id: string,
  correct = Infinity,
  attempt = "quiz-" + id,
) {
  s = startQuiz(s, id, attempt, 1000);
  for (let i = 0; i < s.attempts[attempt].questions.length; i++) {
    const a = s.attempts[attempt];
    s = answerQuiz(
      s,
      attempt,
      i < correct ? a.questions[i].accepted[0] : "yanlış",
      1100 + i,
    );
    s = nextQuestion(s, attempt);
  }
  return s;
}
function complete(s: ListeningState, id: string, attempt = "quiz-" + id) {
  s = openEpisode(s, id, 1);
  s = hear(s, id);
  return quiz(s, id, Infinity, attempt);
}
test("10 original A1 lessons retain 50 questions; all planned listening IDs are now ready", () => {
  assert.equal(episodes.length, 65);
  assert.equal(plannedEpisodes.length, 0);
  assert.ok(
    plannedEpisodes.every(
      (e) => !e.audio && !e.sentences.length && !e.quiz.length,
    ),
  );
  const ids = new Set<string>();
  for (const e of episodes.filter((e) =>
    originalData.some((old) => old.id === e.id),
  )) {
    assert.equal(e.level, "A1");
    assert.ok(e.audio);
    assert.ok(e.sentences.length >= 6);
    assert.equal(e.quiz.length, 5);
    for (const q of e.quiz) {
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.ok(isCorrect(q, q.accepted[0]));
      assert.ok(q.explanation);
      if (q.options.length) {
        assert.equal(
          new Set(q.options.map((x) => normalize(x))).size,
          q.options.length,
        );
        assert.equal(q.options.filter((x) => isCorrect(q, x)).length, 1);
      }
    }
  }
  assert.equal(ids.size, 50);
  assert.equal(Object.keys(wordAudio).length, 60);
});
test("all hosted audio is genuine non-silent PCM; hashes, durations and sentence intervals match files", () => {
  for (const e of episodes.filter((e) => e.audio?.url.endsWith(".wav"))) {
    const a = e.audio!,
      bytes = readFileSync(
        new URL("../../.." + "/public" + a.url, import.meta.url),
      );
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WAVE");
    assert.equal(bytes.readUInt16LE(22), 1);
    assert.equal(bytes.readUInt16LE(34), 16);
    const rate = bytes.readUInt32LE(24),
      duration = bytes.readUInt32LE(40) / 2 / rate;
    assert.ok(Math.abs(duration - a.duration) < 0.0001);
    assert.equal(rate, a.sampleRate);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), a.sha256);
    let energy = 0;
    for (let n = 44; n < bytes.length; n += 2)
      energy += bytes.readInt16LE(n) ** 2;
    assert.ok(energy > 1000000);
    assert.equal(a.segments.length, e.sentences.length);
    for (let n = 0; n < a.segments.length; n++) {
      const s = a.segments[n];
      assert.equal(s.id, e.sentences[n].id);
      assert.ok(s.start >= 0 && s.end > s.start && s.end <= a.duration);
      if (n) assert.ok(s.start >= a.segments[n - 1].end);
    }
  }
  for (const audio of Object.values(wordAudio)) {
    const bytes = readFileSync(
      new URL("../../../public" + audio.url, import.meta.url),
    );
    assert.ok(bytes.length > 1000);
  }
});
test("A2–C2 eight-question attempts persist; seven correct plus real audio completes only once", () => {
  for (const level of ["A2", "B1", "B2", "C1", "C2"] as const) {
    const ep = episodes.find((e) => e.level === level)!;
    assert.equal(ep.quiz.length, 8);
    assert.equal(ep.sentences.length, 10);
    assert.ok(ep.audio!.duration > 40);
    assert.equal(new Set(ep.quiz.map((q) => q.id)).size, 8);
    for (const q of ep.quiz) {
      assert.ok(q.explanation.length > 60);
      assert.equal(q.options.filter((v) => isCorrect(q, v)).length, 1);
    }
    let s = openEpisode(initialListening(), ep.id, 1);
    s = quiz(s, ep.id, Infinity, "unheard");
    assert.equal(s.progress[ep.id].completedAt, null);
    assert.equal(s.claims.length, 0);
    s = hear(s, ep.id);
    assert.ok(s.progress[ep.id].completedAt);
    const originalClaims = structuredClone(s.claims);
    s = quiz(s, ep.id, Infinity, "repeat");
    assert.deepEqual(s.claims, originalClaims);
    assert.ok(validListening(s));

    s = hear(openEpisode(initialListening(), ep.id, 1), ep.id);
    s = quiz(s, ep.id, 6, "six");
    assert.equal(score(s.attempts.six), 75);
    assert.equal(s.claims.length, 0);
    s = startQuiz(s, ep.id, "seven", 2000);
    const storage = new Map<string, string>();
    const persistence = createListeningPersistence(() => ({
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => {
        storage.set(key, value);
      },
    }));
    for (let i = 0; i < 8; i++) {
      const q = s.attempts.seven.questions[i];
      s = answerQuiz(s, "seven", i < 7 ? q.accepted[0] : "yanlış", 2100 + i);
      assert.ok(validListening(s), `${level}: answer ${i + 1}`);
      persistence.save(s);
      s = persistence.load().state;
      assert.equal(Object.keys(s.attempts.seven.answers).length, i + 1);
      s = nextQuestion(s, "seven");
    }
    assert.ok(s.progress[ep.id].completedAt);
    assert.equal(s.claims.filter((c) => c.coins === 10).length, 1);
  }
});

test("new vocabulary saves uniquely and existing empty daily assignments stay frozen", () => {
  const word = bundled.find((w) => w.german_word === "Nachricht")!;
  let state = saveWord(
    initialListening(),
    word.id,
    bundled.map((w) => w.id),
  );
  state = saveWord(
    state,
    word.id,
    bundled.map((w) => w.id),
  );
  assert.deepEqual(state.savedWords, [word.id]);
  state.daily[date + ":C2"] = { date, level: "C2", episodeId: null };
  assert.equal(ensureDaily(state, date, "C2"), state);
  assert.ok(validListening(state));
});

test("transcript links resolve to existing vocabulary and preserve the exact German text", () => {
  const repo = new LocalVocabularyRepository(bundled as VocabularyRecord[]);
  for (const e of episodes)
    for (const s of e.sentences) {
      const parts = transcriptParts(s, repo);
      assert.equal(parts.map((p) => p.text).join(""), s.de);
      for (const p of parts) if (p.wordId) assert.ok(repo.get(p.wordId));
      for (const link of s.links)
        assert.ok(repo.all().some((w) => w.german_word === link.lemma));
    }
});
test("seeking to the end and opening a transcript do not fabricate heard progress", () => {
  const e = episodes[0];
  let s = openEpisode(initialListening(), e.id, 1);
  s = savePosition(s, e.id, e.audio!.duration, 2);
  assert.equal(coverage(s, e.id), 0);
  assert.equal(recordPlayback(s, e.id, 0, e.audio!.duration, 3), s);
  assert.equal(recordPlayback(s, e.id, 5, 1, 3), s);
  s = quiz(s, e.id);
  assert.equal(score(s.attempts["quiz-" + e.id]), 100);
  assert.equal(s.progress[e.id].completedAt, null);
  assert.equal(s.claims.length, 0);
});
test("actual coverage plus 80 percent quiz passes; audio-only or a failed quiz does not complete", () => {
  const id = episodes[1].id;
  let s = hear(openEpisode(initialListening(), id, 1), id);
  assert.equal(coverage(s, id), 1);
  assert.equal(s.progress[id].completedAt, null);
  s = quiz(s, id, 3, "fail");
  assert.equal(s.claims.length, 0);
  assert.ok(needsReview(s, id));
  s = quiz(s, id, 4, "pass");
  assert.equal(score(s.attempts.pass), 80);
  assert.ok(s.progress[id].completedAt !== null);
  assert.equal(s.claims.length, 1);
  assert.equal(s.claims[0].xp, 15);
  assert.equal(s.claims[0].coins, 10);
});
test("browser speech completion is sentence-based, repeated sentences do not duplicate coverage", () => {
  const id = episodes[2].id;
  let s = openEpisode(initialListening(), id, 1);
  episodes[2].sentences.forEach((_, i) => {
    s = recordSpokenSentence(s, id, i, 10 + i);
  });
  assert.equal(coverage(s, id), 1);
  const count = s.progress[id].heard.length;
  s = recordSpokenSentence(s, id, 0, 20);
  assert.equal(s.progress[id].heard.length, count);
  assert.equal(recordSpokenSentence(s, id, 999, 21), s);
});
test("daily assignment is stable after completion and refresh; next local day rotates", () => {
  let s = ensureDaily(initialListening(), date, "A1");
  const id = s.daily[date + ":A1"].episodeId!;
  const original = s.daily[date + ":A1"];
  s = complete(s, id);
  assert.deepEqual(ensureDaily(s, date, "A1").daily[date + ":A1"], original);
  s = ensureDaily(s, "2026-10-28", "A1");
  assert.notEqual(s.daily["2026-10-28:A1"].episodeId, id);
  const empty = ensureDaily(s, date, "C2");
  assert.ok(
    episodes.some(
      (e) => e.level === "C2" && e.id === empty.daily[date + ":C2"].episodeId,
    ),
  );
  assert.equal(empty.claims.length, s.claims.length);
});
test("same-day quiz answers and incomplete attempt restore; repeated submissions never count twice", () => {
  const id = episodes[3].id;
  let s = openEpisode(initialListening(), id, 1);
  s = startQuiz(s, id, "saved", 2);
  assert.equal(nextQuestion(s, "saved"), s);
  assert.equal(startQuiz(s, id, "other", 3), s);
  const q = s.attempts.saved.questions[0];
  s = answerQuiz(s, "saved", q.accepted[0], 4);
  assert.equal(answerQuiz(s, "saved", "change", 5), s);
  s = nextQuestion(s, "saved");
  const memory = new Map<string, string>(),
    storage = {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => {
        memory.set(k, v);
      },
    };
  const p = createListeningPersistence(() => storage);
  assert.ok(validListening(s));
  p.save(s);
  assert.deepEqual(p.load().state, s);
  const next = hear(s, id);
  p.save(next);
  memory.set(LISTENING_KEY, "broken");
  assert.deepEqual(p.load().state, s);
  assert.equal(memory.get(LISTENING_KEY + ":corrupt"), "broken");
  memory.set(LISTENING_KEY, JSON.stringify({ version: 2 }));
  assert.equal(p.load().readonly, true);
  assert.throws(() => p.save(s));
});
test("three unique completions produce one seed; replay, refresh and repeated answers cannot re-award", () => {
  let s = initialListening();
  for (const e of episodes.slice(0, 3)) s = complete(s, e.id);
  assert.equal(s.claims.filter((c) => c.seed).length, 1);
  assert.equal(s.claims.filter((c) => c.coins === 10).length, 3);
  const before = JSON.stringify(s);
  const replay = complete(s, episodes[0].id, "replay");
  assert.equal(JSON.stringify(s), before);
  assert.deepEqual(replay.claims, s.claims);
  let garden = createStarter(0);
  garden.plots[0].plant = {
    species: "daisy",
    plantedAt: 0,
    lastWateredAt: null,
    waterCount: 0,
    bloomedAt: null,
  };
  for (const c of s.claims) {
    const reward = {
      id: c.id,
      source: "exercise" as const,
      coins: c.coins,
      ...(c.seed ? { seeds: { lavender: 1 } } : {}),
    };
    garden = grantReward(garden, reward);
    assert.equal(grantReward(garden, reward), garden);
  }
  assert.equal(garden.coins, 60);
  assert.equal(garden.seeds.lavender, 3);
  assert.ok(garden.plots[0].plant);
});
test("favorites and category/duration/completion filters report real available counts", () => {
  const id = episodes[0].id;
  let s = favorite(initialListening(), id);
  assert.equal(filterEpisodes(s, { level: "A1", favorites: true }).length, 1);
  assert.equal(filterEpisodes(s, { level: "C1", status: "ready" }).length, 11);
  assert.equal(filterEpisodes(s, { level: "C1", status: "planned" }).length, 0);
  assert.equal(filterEpisodes(s, { level: "A1", duration: "long" }).length, 0);
  assert.equal(
    filterEpisodes(s, { level: "A1", duration: "short" }).length,
    10,
  );
  s = complete(s, id);
  assert.equal(
    filterEpisodes(s, { level: "A1", status: "completed" }).length,
    1,
  );
  assert.equal(
    filterEpisodes(s, { level: "A1", category: "conversation" }).length,
    3,
  );
  s = favorite(s, id);
  assert.equal(s.favorites.length, 0);
});
test("saved vocabulary is unique; review requests preserve streaks, old answers and daily lists", () => {
  const id = originalA1[0].id,
    ids = originalA1.map((w) => w.id);
  const s = saveWord(initialListening(), id, ids);
  assert.equal(saveWord(s, id, ids), s);
  assert.equal(saveWord(s, "unknown", ids), s);
  const learning = initialLearning();
  learning.progress[id] = {
    introducedOn: "2026-10-20",
    dueOn: "2026-11-10",
    known: true,
    streak: 3,
    lastAnsweredOn: "2026-10-25",
    responses: 8,
  };
  const queued = enqueueReview(learning, id, date, originalA1);
  assert.equal(queued.progress[id].dueOn, date);
  assert.equal(queued.progress[id].streak, 3);
  assert.equal(queued.progress[id].responses, 8);
  assert.equal(queued.progress[id].known, true);
  assert.equal(queued.assignments, learning.assignments);
  assert.equal(learning.progress[id].dueOn, "2026-11-10");
  assert.equal(enqueueReview(queued, id, date, originalA1), queued);
  const answered = answerStandalone(queued, id, "known", date, originalA1);
  assert.equal(answered.progress[id].streak, 4);
  assert.equal(answered.progress[id].responses, 9);
  assert.equal(answered.outbox.length, 0);
  assert.equal(
    answerStandalone(answered, id, "again", date, originalA1),
    answered,
  );
});
test("blocked storage cannot claim persistence; malformed progress is rejected", () => {
  assert.equal(
    createListeningPersistence(() => {
      throw Error("blocked");
    }).load().readonly,
    true,
  );
  const s = openEpisode(initialListening(), episodes[0].id, 1);
  s.progress[episodes[0].id].heard = [-1];
  assert.equal(validListening(s), false);
});
test("speech fallback handles missing support without awarding a sentence", async () => {
  let status = "",
    heard = 0;
  const sequence = new SpeechSequence(null, {
    status: (_, msg) => {
      status = msg;
    },
    active: () => {},
    heard: () => heard++,
    finished: () => {},
  });
  await sequence.play(["Hallo"]);
  assert.ok(status.includes("desteklemiyor"));
  assert.equal(heard, 0);
  sequence.stop();
});
test("speech playback, pause/resume, slow rate, replay and cancellation use real callbacks", async () => {
  let utterance: SpeechSynthesisUtterance | undefined,
    status = "";
  const heard: number[] = [];
  const synth = {
    getVoices: () => [{ lang: "de-DE" }],
    speak: (u: SpeechSynthesisUtterance) => {
      utterance = u;
      u.onstart?.({} as SpeechSynthesisEvent);
    },
    cancel: () => {},
    pause: () => {},
    resume: () => {},
  } as unknown as SpeechSynthesis;
  const sequence = new SpeechSequence(
    { synth, create: (text) => ({ text }) as SpeechSynthesisUtterance },
    {
      status: (s) => {
        status = s;
      },
      active: () => {},
      heard: (i) => heard.push(i),
      finished: () => {},
    },
  );
  sequence.setRate(0.65);
  sequence.setVolume(0.7);
  await sequence.play(["Hallo", "Guten Morgen"]);
  assert.equal(status, "playing");
  assert.equal(utterance?.rate, 0.65);
  assert.equal(utterance?.volume, 0.7);
  assert.equal(utterance?.lang, "de-DE");
  sequence.pause();
  assert.equal(status, "paused");
  sequence.resume();
  assert.equal(status, "playing");
  utterance?.onend?.({} as SpeechSynthesisEvent);
  assert.deepEqual(heard, [0]);
  const stale = utterance;
  await sequence.play(["Hallo"], 0, true);
  stale?.onend?.({} as SpeechSynthesisEvent);
  assert.deepEqual(heard, [0]);
  utterance?.onend?.({} as SpeechSynthesisEvent);
  assert.deepEqual(heard, [0, 0]);
  sequence.stop();
});

test("every CEFR level has real audio in all nine categories; 25 old plans and 25 category supplements are ready", () => {
  assert.equal(completeEpisodes.length, 50);
  assert.equal(episodes.length, 65);
  assert.equal(new Set(episodes.map((e) => e.id)).size, 65);
  const counts = { A1: 13, A2: 11, B1: 10, B2: 11, C1: 11, C2: 9 };
  for (const [level, count] of Object.entries(counts)) {
    const pool = episodes.filter((e) => e.level === level);
    assert.equal(pool.length, count);
    for (const category of Object.keys(CATEGORIES))
      assert.ok(
        pool.some((e) => e.category === category && e.audio),
        level + ":" + category,
      );
  }
  const ids = new Set<string>();
  for (const raw of completeEpisodes) {
    const ep = episodeById(raw.id)!;
    assert.ok(ep.audio);
    assert.ok(ep.sentences.length >= 6);
    assert.ok(
      ep.sentences.reduce((n, s) => n + s.de.split(/\s+/).length, 0) >= 100,
    );
    assert.equal(ep.guidance?.length, 4);
    assert.ok(ep.guidance!.every((g) => g.length > 110));
    assert.equal(ep.quiz.length, 12);
    assert.equal(new Set(ep.quiz.map((q) => q.prompt)).size, 12, ep.id);
    for (const q of ep.quiz) {
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.ok(q.explanation.length > 60, q.id);
      assert.ok(isCorrect(q, q.accepted[0]));
      if (q.options.length) {
        assert.equal(q.options.filter((v) => isCorrect(q, v)).length, 1, q.id);
        assert.equal(
          new Set(q.options.map((v) => normalize(v))).size,
          q.options.length,
          q.id,
        );
      }
      if (q.tiles)
        assert.deepEqual(
          q.tiles.map((v) => normalize(v)).sort(),
          normalize(q.accepted[0]).split(" ").sort(),
          q.id,
        );
    }
  }
  assert.equal(ids.size, 600);
  assert.equal(
    episodes.reduce((n, e) => n + e.quiz.length, 0),
    690,
  );
});

test("new MP3 assets have complete valid frames, exact durations, matching text/file hashes and ordered transcript ranges", () => {
  const manifest = completeAudio.episodes as Record<
    string,
    {
      url: string;
      duration: number;
      sampleRate: number;
      sha256: string;
      textSha256: string;
      segments: { id: string; start: number; end: number }[];
    }
  >;
  assert.equal(Object.keys(manifest).length, 50);
  for (const ep of completeEpisodes) {
    const a = manifest[ep.id];
    const bytes = readFileSync(
      new URL("../../../public" + a.url, import.meta.url),
    );
    assert.equal(createHash("sha256").update(bytes).digest("hex"), a.sha256);
    assert.equal(
      createHash("sha256")
        .update(ep.sentences.map((s) => s.de).join("\n"))
        .digest("hex"),
      a.textSha256,
    );
    let p = 0,
      duration = 0,
      frames = 0;
    while (p < bytes.length) {
      const h = bytes.readUInt32BE(p);
      assert.equal(h >>> 21, 0x7ff);
      const version = (h >>> 19) & 3;
      assert.notEqual(version, 1);
      assert.equal((h >>> 17) & 3, 1);
      const rates = [44100, 48000, 32000];
      const rate =
        rates[(h >>> 10) & 3] / (version === 3 ? 1 : version === 2 ? 2 : 4);
      assert.equal(rate, a.sampleRate);
      const bitrates =
        version === 3
          ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
          : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
      const bitrate = bitrates[(h >>> 12) & 15] * 1000;
      assert.equal(bitrate, 64000);
      assert.equal((h >>> 6) & 3, 3); // mono
      const size =
        Math.floor(((version === 3 ? 144 : 72) * bitrate) / rate) +
        ((h >>> 9) & 1);
      assert.ok(p + size <= bytes.length);
      duration += (version === 3 ? 1152 : 576) / rate;
      p += size;
      frames++;
    }
    assert.ok(frames > 1000);
    assert.ok(Math.abs(duration - a.duration) < 0.00001);
    assert.ok(duration > 30);
    assert.equal(a.segments.length, ep.sentences.length);
    a.segments.forEach((segment, i) => {
      assert.equal(segment.id, ep.sentences[i].id);
      assert.ok(segment.end > segment.start && segment.end <= duration);
      if (i) assert.ok(segment.start >= a.segments[i - 1].end);
    });
  }
});

test("all new 12-question lessons require coverage and 10 correct; every answer restores and repeated rewards stay unique", () => {
  for (const raw of completeEpisodes) {
    const ep = episodeById(raw.id)!;
    let s = quiz(
      openEpisode(initialListening(), ep.id, 1),
      ep.id,
      12,
      "unheard",
    );
    assert.equal(s.progress[ep.id].completedAt, null);
    assert.equal(s.claims.length, 0);
    s = hear(s, ep.id);
    assert.ok(s.progress[ep.id].completedAt);
    const receipts = structuredClone(s.claims);
    s = quiz(s, ep.id, 12, "repeat");
    assert.deepEqual(s.claims, receipts);
    s = hear(openEpisode(initialListening(), ep.id, 1), ep.id);
    s = quiz(s, ep.id, 9, "fail");
    assert.equal(score(s.attempts.fail), 75);
    assert.equal(s.progress[ep.id].completedAt, null);
    s = startQuiz(s, ep.id, "pass", 2000);
    const memory = new Map<string, string>();
    const persistence = createListeningPersistence(() => ({
      getItem: (k) => memory.get(k) ?? null,
      setItem: (k, v) => {
        memory.set(k, v);
      },
    }));
    for (let i = 0; i < 12; i++) {
      const q = s.attempts.pass.questions[i];
      s = answerQuiz(s, "pass", i < 10 ? q.accepted[0] : "yanlış", 2100 + i);
      assert.ok(validListening(s), ep.id + ":" + i);
      persistence.save(s);
      assert.deepEqual(persistence.load().state, s);
      s = persistence.load().state;
      s = nextQuestion(s, "pass");
    }
    assert.ok(s.progress[ep.id].completedAt);
    assert.equal(s.claims.filter((c) => c.xp === 15).length, 1);
    assert.equal(Object.keys(s.attempts).length, 2);
  }
});

test("all original lesson transcripts, question answers and higher-level audio remain exactly unchanged", () => {
  for (const raw of originalData) {
    const ep = episodeById(raw.id)!;
    assert.equal(ep.title, raw.title);
    assert.deepEqual(ep.sentences, raw.sentences);
    raw.quiz.forEach((q, i) => {
      assert.equal(ep.quiz[i].id, q.id);
      assert.equal(ep.quiz[i].accepted[0], q.answer);
      assert.equal(ep.quiz[i].explanation, q.explanation);
    });
  }
  const audio = oldExtraAudio.episodes as Record<string, unknown>;
  for (const raw of oldExtra) {
    const ep = episodeById(raw.id)!;
    const { audio: a, ...content } = ep;
    assert.deepEqual(content, raw);
    assert.deepEqual(a, audio[raw.id]);
  }
});

test("all 65 lessons coexist in account snapshots, preserving old progress, frozen daily picks and unique inventory receipts", () => {
  let s = ensureDaily(initialListening(), date, "C2");
  s.daily[date + ":A2"] = { date, level: "A2", episodeId: null };
  for (const ep of episodes.filter(
    (e) => !completeEpisodes.some((n) => n.id === e.id),
  ))
    s = complete(s, ep.id);
  const old = structuredClone(s);
  for (const raw of completeEpisodes) {
    const ep = episodeById(raw.id)!;
    s = openEpisode(s, ep.id, 1);
    ep.sentences.forEach((_, i) => {
      s = recordSpokenSentence(s, ep.id, i, 50 + i);
    });
    s = quiz(s, ep.id, 12, ep.id);
  }
  for (const [id, progress] of Object.entries(old.progress))
    assert.deepEqual(s.progress[id], progress);
  for (const [id, attempt] of Object.entries(old.attempts))
    assert.deepEqual(s.attempts[id], attempt);
  for (const c of old.claims)
    assert.deepEqual(
      s.claims.find((x) => x.id === c.id),
      c,
    );
  assert.deepEqual(s.daily, old.daily);
  assert.equal(ensureDaily(s, date, "A2"), s);
  assert.equal(
    Object.values(s.progress).filter((p) => p.completedAt !== null).length,
    65,
  );
  assert.equal(s.claims.filter((c) => c.xp === 15).length, 65);
  assert.equal(s.claims.filter((c) => c.seed).length, 21);
  assert.ok(
    validSnapshot(
      JSON.parse(JSON.stringify({ version: 1, modules: { listening: s } })),
    ),
  );
});

test("independent language reference answers keep time, reporting and grammatical scope intact", () => {
  const references: [string, number, string][] = [
    ["listen-a1-grammar-person", 4, "wohne"],
    ["listen-a2-plan-6", 4, "halb vier"],
    ["listen-a2-grammar-perfekt", 6, "angekommen"],
    ["listen-b1-grammar-relatives", 5, "den"],
    ["listen-b2-grammar-modal", 6, "haben"],
    ["listen-c1-grammar-reporting", 6, "hätten"],
    ["listen-c2-plan-3", 4, "ließen"],
    ["listen-c2-grammar-scope", 4, "Nur wenn"],
  ];
  for (const [id, index, value] of references)
    assert.ok(isCorrect(episodeById(id)!.quiz[index], value), id);
});
