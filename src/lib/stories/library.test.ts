import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { stories, glossary, annotatedParts, resolveWord } from "./content.ts";
import { validateStory } from "./graph.ts";
import {
  initialStories,
  startStory,
  chooseStory,
  currentRun,
  beginStoryQuiz,
  answerStoryQuiz,
  nextStoryQuestion,
  ensureStoryDaily,
  saveStoryWord,
} from "./engine.ts";
import { validStories } from "./persistence.ts";
import { validSnapshot } from "../account/snapshot.ts";
import { createStarter, grantReward } from "../garden/model.ts";
import type { Story, StoryState } from "./types.ts";
import audio from "../../data/stories/library-audio.json" with { type: "json" };
const additions = stories.filter((s) => s.id.startsWith("story-library-"));
function path(state: StoryState, story: Story, left: number, right: number) {
  state = startStory(
    state,
    story.id,
    "library-run-" + Object.keys(state.runs).length,
    100,
    true,
  );
  let scene = story.scenes.find((s) => s.id === story.start)!;
  state = chooseStory(state, story.id, scene.id, scene.choices[left].id, 101);
  scene = story.scenes.find(
    (s) => s.id === currentRun(state, story.id).path.at(-1),
  )!;
  return chooseStory(state, story.id, scene.id, scene.choices[right].id, 102);
}
function quiz(state: StoryState, id: string, wrong = false) {
  state = beginStoryQuiz(state, id);
  for (let i = 0; i < 3; i++) {
    const q = currentRun(state, id).quiz!.questions[i];
    state = answerStoryQuiz(
      state,
      id,
      q.id,
      wrong ? q.options.find((o) => !q.accepted.includes(o))! : q.accepted[0],
      110 + i,
    );
    state = nextStoryQuestion(state, id);
  }
  return state;
}
test("every level has ten stories, all categories and validated substantial branching additions", () => {
  assert.equal(stories.length, 60);
  assert.equal(additions.length, 38);
  for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
    const selected = stories.filter((s) => s.level === level);
    assert.equal(selected.length, 10, level);
    assert.deepEqual(
      new Set(selected.map((s) => s.category)),
      new Set([
        "daily",
        "friendship",
        "mystery",
        "fantasy",
        "travel",
        "work",
        "germany",
        "comedy",
      ]),
    );
  }
  for (const s of additions) {
    assert.deepEqual(validateStory(s), []);
    assert.equal(s.scenes.length, 7);
    assert.equal(s.scenes.filter((n) => n.ending).length, 4);
    for (const n of s.scenes) {
      assert.equal(n.lines.length, 4);
      assert.ok(n.question.explanation.length >= 70);
      assert.equal(n.question.options.length, 3);
      assert.ok(n.lines.every((l) => l.de.length > 25 && l.tr.length > 25));
      for (const word of n.words) {
        assert.ok(resolveWord(word));
        assert.ok(
          n.lines.some((l) => annotatedParts(l.de, [word]).some((p) => p.word)),
          s.id + ":" + n.id + " " + word,
        );
      }
    }
  }
});
test("all 152 endings restore, pass/fail quizzes and reward replay preserve original progress", () => {
  const base = stories[0];
  let state = quiz(path(initialStories(), base, 0, 0), base.id);
  const old = structuredClone(state.runs);
  for (const story of additions) {
    const failed = quiz(path(initialStories(), story, 0, 0), story.id, true);
    assert.equal(failed.claims.filter((c) => c.seed).length, 0);
    for (let a = 0; a < 2; a++)
      for (let b = 0; b < 2; b++) {
        state = path(state, story, a, b);
        state = JSON.parse(JSON.stringify(state));
        assert.ok(validStories(state));
        state = quiz(state, story.id);
        assert.ok(validSnapshot({ version: 1, modules: { stories: state } }));
      }
    assert.equal(state.endings[story.id].length, 4);
    assert.equal(
      state.claims.filter((c) => c.id === "story:complete:" + story.id).length,
      1,
    );
    assert.equal(
      state.claims.filter((c) => c.id === "story:quiz:" + story.id).length,
      1,
    );
    const count = state.claims.length;
    state = quiz(path(state, story, 0, 0), story.id);
    assert.equal(state.claims.length, count);
  }
  for (const [id, run] of Object.entries(old))
    assert.deepEqual(state.runs[id], run);
  let garden = createStarter(0);
  for (const claim of [...state.claims, ...state.claims])
    garden = grantReward(garden, {
      id: claim.id,
      source: "exercise",
      coins: claim.coins,
      ...(claim.seed ? { seeds: { lavender: 1 } } : {}),
    });
  assert.equal(
    garden.coins,
    createStarter(0).coins + state.claims.reduce((n, c) => n + c.coins, 0),
  );
});
test("daily assignments remain frozen and new glossary words save idempotently", () => {
  const initial = {
    ...initialStories(),
    daily: {
      "2026-10-30:A1": {
        date: "2026-10-30",
        level: "A1" as const,
        storyId: stories[0].id,
      },
    },
  };
  assert.deepEqual(ensureStoryDaily(initial, "2026-10-30", "A1"), initial);
  let state = initialStories();
  for (const word of glossary.filter((w) =>
    w.id.startsWith("story-library-"),
  )) {
    state = saveStoryWord(state, word.id);
    state = saveStoryWord(state, word.id);
  }
  assert.equal(state.savedWords.length, 256);
  assert.ok(validStories(state));
});
test("all new scene, line and word recordings match exact source text and content hashes", () => {
  type Asset = {
    url: string;
    duration: number;
    sha256: string;
    textSha256: string;
    sampleRate: number;
  };
  const manifest = audio as {
    scenes: Record<string, { full: Asset; lines: Asset[] }>;
    glossary: Record<string, Asset>;
  };
  let count = 0;
  function check(asset: Asset, text: string) {
    assert.ok(asset);
    assert.match(asset.url, /^\/audio\/stories-library\/[a-f0-9]+\.mp3$/);
    const bytes = readFileSync("public" + asset.url);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256,
    );
    assert.equal(
      createHash("sha256").update(text).digest("hex"),
      asset.textSha256,
    );
    assert.ok(asset.duration > 0.5);
    assert.equal(asset.sampleRate, 22050);
    let p = 0,
      duration = 0;
    while (p < bytes.length) {
      const h = bytes.readUInt32BE(p),
        version = (h >>> 19) & 3;
      assert.equal(h >>> 21, 0x7ff);
      assert.equal((h >>> 17) & 3, 1);
      assert.notEqual(version, 1);
      const rate =
        [44100, 48000, 32000][(h >>> 10) & 3] /
        (version === 3 ? 1 : version === 2 ? 2 : 4);
      const rates =
        version === 3
          ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
          : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
      const bitrate = rates[(h >>> 12) & 15] * 1000;
      assert.equal(bitrate, 64000);
      assert.equal((h >>> 6) & 3, 3);
      const size =
        Math.floor(((version === 3 ? 144 : 72) * bitrate) / rate) +
        ((h >>> 9) & 1);
      assert.ok(size > 4 && p + size <= bytes.length);
      p += size;
      duration += (version === 3 ? 1152 : 576) / rate;
    }
    assert.ok(Math.abs(duration - asset.duration) < 0.00001);
    count++;
  }
  for (const story of additions)
    for (const scene of story.scenes) {
      const a = manifest.scenes[story.id + ":" + scene.id];
      assert.equal(a.lines.length, 4);
      check(a.full, scene.lines.map((l) => l.de).join("\n"));
      scene.lines.forEach((line, i) => check(a.lines[i], line.de));
    }
  for (const word of glossary.filter((w) => w.id.startsWith("story-library-")))
    check(manifest.glossary[word.id], word.article + " " + word.word);
  assert.equal(Object.keys(manifest.scenes).length, 266);
  assert.equal(count, 1586);
});

test("new question prompts are Turkish, answers unique and explanations quote scene evidence", () => {
  for (const story of additions)
    for (const scene of story.scenes) {
      assert.match(
        scene.question.prompt,
        /(^|[^\p{L}])(kim\p{L}*|ne\p{L}*|hangi\p{L}*|nasıl\p{L}*|kaç\p{L}*|niçin\p{L}*)/iu,
        story.id + ":" + scene.id,
      );
      assert.equal(new Set(scene.question.options).size, 3);
      assert.equal(
        scene.question.options.filter((o) => o === scene.question.correct)
          .length,
        1,
      );
      const excerpts = [
        ...scene.question.explanation.matchAll(/[“„«"]([^”"“„»]+)[”"“»]/g),
      ].map((m) => m[1].replace(/[.!?]+$/u, ""));
      assert.ok(
        excerpts.some(
          (e) => e.length >= 4 && scene.lines.some((l) => l.de.includes(e)),
        ),
        story.id + ":" + scene.id,
      );
      for (const line of scene.lines)
        assert.doesNotMatch(line.de, /[ğışİĞŞçÇ\u0400-\u06ff]/u);
    }
});
test("context word IDs resolve exact inflected tokens without changing older lemma lookup", () => {
  const entries = glossary.filter((w) => w.id.startsWith("story-library-"));
  assert.equal(new Set(entries.map((w) => w.id)).size, 256);
  for (const word of entries) {
    assert.equal(resolveWord(word.id)?.id, word.id);
    for (const form of word.forms ?? [word.word]) {
      assert.equal(
        annotatedParts(form, [word.id]).find((p) => p.word)?.word?.id,
        word.id,
      );
      assert.ok(
        annotatedParts("Vor" + form + "nach", [word.id]).every((p) => !p.word),
      );
    }
  }
  assert.equal(resolveWord("Brot")?.repository, true);
});
