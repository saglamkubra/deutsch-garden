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
import audio from "../../data/stories/world-audio.json" with { type: "json" };
const additions = stories.filter((s) => s.id.startsWith("story-world-"));
function path(state: StoryState, story: Story, left: number, right: number) {
  state = startStory(
    state,
    story.id,
    "world-run-" + Object.keys(state.runs).length,
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
test("six additions fill previously empty level/category pairs with substantial, genuinely branching stories", () => {
  assert.equal(stories.length, 22);
  assert.equal(additions.length, 6);
  assert.deepEqual(
    additions.map((s) => [s.level, s.category]),
    [
      ["A1", "travel"],
      ["A2", "friendship"],
      ["B1", "germany"],
      ["B2", "mystery"],
      ["C1", "fantasy"],
      ["C2", "work"],
    ],
  );
  for (const s of additions) {
    assert.ok(
      !stories.some(
        (old) =>
          !old.id.startsWith("story-world-") &&
          old.level === s.level &&
          old.category === s.category,
      ),
    );
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
test("all 24 endings restore, pass/fail quizzes and reward replay preserve original progress", () => {
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
  for (const word of glossary.filter((w) => w.id.startsWith("story-world-"))) {
    state = saveStoryWord(state, word.id);
    state = saveStoryWord(state, word.id);
  }
  assert.equal(state.savedWords.length, 6);
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
    assert.match(asset.url, /^\/audio\/stories-worlds\/[a-f0-9]+\.mp3$/);
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
  for (const word of glossary.filter((w) => w.id.startsWith("story-world-")))
    check(manifest.glossary[word.id], word.article + " " + word.word);
  assert.equal(Object.keys(manifest.scenes).length, 42);
  assert.equal(count, 216);
});
