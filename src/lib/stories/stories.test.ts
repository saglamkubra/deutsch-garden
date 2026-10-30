import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  stories,
  resolveWord,
  wordById,
  glossary,
  annotatedParts,
} from "./content.ts";
import { validateStory, validPath } from "./graph.ts";
import {
  initialStories,
  startStory,
  chooseStory,
  currentRun,
  questionsFor,
  beginStoryQuiz,
  answerStoryQuiz,
  nextStoryQuestion,
  ensureStoryDaily,
  toggleStoryFavorite,
  saveStoryWord,
  filterStories,
} from "./engine.ts";
import {
  createStoryPersistence,
  validStories,
  STORY_KEY,
} from "./persistence.ts";
import { createStarter, grantReward } from "../garden/model.ts";
import { validState as validExercises } from "../exercises/persistence.ts";
import { initialExercises } from "../exercises/types.ts";
import originalAssets from "../../data/stories/audio.json" with { type: "json" };
import extraAssets from "../../data/stories/extra-audio.json" with { type: "json" };
const assets = {
  scenes: { ...originalAssets.scenes, ...extraAssets.scenes },
  glossary: { ...originalAssets.glossary, ...extraAssets.glossary },
};
import type { StoryState, Story } from "./types.ts";
import comedyAssets from "../../data/stories/comedy-audio.json" with { type: "json" };
import { validSnapshot } from "../account/snapshot.ts";
function path(s: StoryState, story: Story, branch = 0, ending = 0) {
  s = startStory(s, story.id, "run-" + Object.keys(s.runs).length, 1, true);
  let n = story.scenes.find((n) => n.id === story.start)!;
  s = chooseStory(s, story.id, n.id, n.choices[branch].id, 2);
  n = story.scenes.find((n) => n.id === currentRun(s, story.id).path.at(-1))!;
  return chooseStory(s, story.id, n.id, n.choices[ending].id, 3);
}
function quiz(s: StoryState, id: string, wrong = false) {
  s = beginStoryQuiz(s, id);
  for (let i = 0; i < 3; i++) {
    const r = currentRun(s, id),
      q = r.quiz!.questions[i];
    s = answerStoryQuiz(
      s,
      id,
      q.id,
      wrong ? q.options.find((v) => !q.accepted.includes(v))! : q.accepted[0],
      4 + i,
    );
    s = nextStoryQuestion(s, id);
  }
  return s;
}
test("all original and new comedy stories have valid bilingual graphs", () => {
  assert.equal(stories.length, 22);
  assert.equal(stories.filter((s) => s.level === "A1").length, 6);
  assert.equal(stories.filter((s) => s.level === "A2").length, 4);
  let edges = 0,
    ends = 0;
  for (const s of stories) {
    assert.deepEqual(validateStory(s), []);
    assert.ok(s.scenes.length >= 6);
    for (const n of s.scenes) {
      edges += n.choices.length;
      if (n.ending) ends++;
      assert.ok(n.words.length);
      n.words.forEach((w) => assert.ok(resolveWord(w), w));
    }
  }
  assert.equal(edges, 132);
  assert.equal(ends, 88);
});
test("higher-level stories preserve each branch and new glossary through refresh without repeat rewards", () => {
  for (const level of ["B1", "B2", "C1", "C2"] as const) {
    const story = stories.find((s) => s.level === level)!;
    assert.equal(story.scenes.length, 7);
    assert.ok(story.scenes.every((n) => n.lines.length === 4));
    let state = quiz(path(initialStories(), story), story.id);
    state = saveStoryWord(state, resolveWord(story.scenes[0].words[0])!.id);
    assert.ok(validStories(state));
    const storage = new Map<string, string>();
    const persistence = createStoryPersistence(() => ({
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => {
        storage.set(key, value);
      },
    }));
    persistence.save(state);
    assert.deepEqual(persistence.load().state, state);
    const claims = structuredClone(state.claims);
    state = quiz(path(state, story), story.id);
    assert.deepEqual(state.claims, claims);
  }
  const state = initialStories();
  state.daily["2026-10-27:C2"] = {
    date: "2026-10-27",
    level: "C2",
    storyId: null,
  };
  assert.equal(ensureStoryDaily(state, "2026-10-27", "C2"), state);
});

test("graph validator rejects missing starts, missing branches, duplicate IDs, unreachable endings and cycles", () => {
  for (const change of [
    (s: Story) => {
      s.start = "missing";
    },
    (s: Story) => {
      s.scenes[0].choices[0].to = "missing";
    },
    (s: Story) => {
      s.scenes.push(s.scenes[0]);
    },
    (s: Story) => {
      s.scenes[1].choices[0].to = s.start;
    },
    (s: Story) => {
      s.scenes[0].choices[0].to = s.scenes[0].choices[1].to;
    },
  ]) {
    const s = structuredClone(stories[0]);
    change(s);
    assert.ok(validateStory(s).length);
  }
});
test("every branch yields a distinct reachable ending and path-local questions", () => {
  for (const story of stories) {
    const ends = new Set<string>();
    for (let b = 0; b < 2; b++)
      for (let e = 0; e < 2; e++) {
        const s = path(initialStories(), story, b, e),
          run = currentRun(s, story.id);
        ends.add(run.path.at(-1)!);
        assert.ok(validPath(story, run.path, run.choices));
        const qs = questionsFor(run);
        assert.equal(qs.length, 3);
        assert.deepEqual(
          qs.map((q) => q.id),
          run.path.map((n) => story.id + ":" + n),
        );
        assert.ok(validStories(s));
      }
    assert.equal(ends.size, 4);
  }
});
test("invalid/stale choices and revisiting an ended run do not move or reward", () => {
  const story = stories[0];
  let s = startStory(initialStories(), story.id, "run", 1);
  assert.strictEqual(chooseStory(s, story.id, "missing", "bad", 2), s);
  const c = story.scenes[0].choices[0];
  s = chooseStory(s, story.id, "start", c.id, 2);
  assert.strictEqual(chooseStory(s, story.id, "start", c.id, 3), s);
  s = path(s, story);
  assert.strictEqual(
    chooseStory(s, story.id, currentRun(s, story.id).path.at(-1)!, "bad", 4),
    s,
  );
});
test("save/restore preserves exact current scene, choices, discovered endings, favorites and quiz", () => {
  let s = path(initialStories(), stories[0], 1, 0);
  s = quiz(s, stories[0].id);
  s = toggleStoryFavorite(s, stories[0].id);
  const mem = new Map<string, string>(),
    p = createStoryPersistence(() => ({
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => {
        mem.set(k, v);
      },
    }));
  p.save(s);
  assert.deepEqual(p.load().state, s);
  assert.equal(p.load().readonly, false);
  s = startStory(s, stories[0].id, "fresh", 10, true);
  p.save(s);
  assert.equal(p.load().state.runs.fresh.path[0], "start");
  assert.equal(p.load().state.endings[stories[0].id].length, 1);
});
test("mid-scene checkpoint and resume retain active run instead of restarting", () => {
  let s = startStory(initialStories(), stories[0].id, "one", 1);
  s = chooseStory(
    s,
    stories[0].id,
    "start",
    stories[0].scenes[0].choices[1].id,
    2,
  );
  const resumed = startStory(s, stories[0].id, "two", 4);
  assert.deepEqual(
    currentRun(resumed, stories[0].id),
    currentRun(s, stories[0].id),
  );
  assert.equal(Object.keys(resumed.runs).length, 1);
});
test("quiz requires a real ending, answers are ordered/immutable and explanations reference visited scenes", () => {
  let s = startStory(initialStories(), stories[0].id, "r", 1);
  assert.strictEqual(beginStoryQuiz(s, stories[0].id), s);
  s = path(s, stories[0]);
  s = beginStoryQuiz(s, stories[0].id);
  const q = currentRun(s, stories[0].id).quiz!.questions[0];
  assert.strictEqual(nextStoryQuestion(s, stories[0].id), s);
  assert.strictEqual(
    answerStoryQuiz(s, stories[0].id, "invalid", q.accepted[0], 4),
    s,
  );
  s = answerStoryQuiz(s, stories[0].id, q.id, q.accepted[0], 4);
  assert.strictEqual(answerStoryQuiz(s, stories[0].id, q.id, "another", 5), s);
  assert.ok(validStories(s));
});
test("first completion XP, new-ending coins and successful-quiz seed cannot be farmed on replay", () => {
  const story = stories[0];
  let s = quiz(path(initialStories(), story), story.id);
  assert.equal(
    s.claims.reduce((n, c) => n + c.xp, 0),
    20,
  );
  assert.equal(
    s.claims.reduce((n, c) => n + c.coins, 0),
    10,
  );
  assert.equal(s.claims.filter((c) => c.seed).length, 1);
  s = quiz(path(s, story), story.id);
  assert.equal(s.claims.length, 3);
  s = quiz(path(s, story, 1, 1), story.id);
  assert.equal(
    s.claims.reduce((n, c) => n + c.xp, 0),
    20,
  );
  assert.equal(
    s.claims.reduce((n, c) => n + c.coins, 0),
    20,
  );
  assert.equal(s.claims.filter((c) => c.seed).length, 1);
  assert.ok(validStories(s));
});
test("failed quiz gives no seed; later successful replay grants exactly one", () => {
  let s = quiz(path(initialStories(), stories[1]), stories[1].id, true);
  assert.equal(s.claims.filter((c) => c.seed).length, 0);
  assert.ok(validStories(s));
  s = quiz(path(s, stories[1]), stories[1].id);
  assert.equal(s.claims.filter((c) => c.seed).length, 1);
});
test("garden bridge preserves inventory and XP schema accepts scoped 20 XP receipts", () => {
  const s = quiz(path(initialStories(), stories[0]), stories[0].id);
  let g = createStarter(0);
  const coins = g.coins,
    seeds = g.seeds.lavender;
  for (const c of [...s.claims, ...s.claims])
    g = grantReward(g, {
      id: c.id,
      source: "exercise",
      coins: c.coins,
      ...(c.seed ? { seeds: { lavender: 1 } } : {}),
    });
  assert.equal(g.coins, coins + 10);
  assert.equal(g.seeds.lavender, seeds + 1);
  assert.ok(
    validExercises({
      ...initialExercises(),
      xp: { "story:complete:story-cafe": 20 },
    }),
  );
  assert.equal(
    validExercises({
      ...initialExercises(),
      xp: { "listening:episode:x": 20 },
    }),
    false,
  );
});
test("daily assignment matches CEFR, remains stable, rotates and safely persists empty levels", () => {
  let s = ensureStoryDaily(initialStories(), "2026-10-27", "A1");
  const first = s.daily["2026-10-27:A1"].storyId;
  assert.ok(stories.find((x) => x.id === first && x.level === "A1"));
  const next = ensureStoryDaily(
    { ...s, completed: [first!] },
    "2026-10-27",
    "A1",
  );
  assert.equal(next.daily["2026-10-27:A1"].storyId, first);
  s = ensureStoryDaily(s, "2026-10-28", "A1");
  assert.notEqual(s.daily["2026-10-28:A1"].storyId, first);
  s = ensureStoryDaily(s, "2026-10-27", "C2");
  assert.ok(
    stories.some(
      (story) =>
        story.id === s.daily["2026-10-27:C2"].storyId && story.level === "C2",
    ),
  );
  assert.ok(validStories(s));
});
test("favorites, level/category/duration/status/search filters use real stories only", () => {
  let s = toggleStoryFavorite(initialStories(), stories[0].id);
  assert.equal(filterStories(s, { level: "A1", favorite: true }).length, 1);
  s = path(s, stories[0]);
  assert.equal(filterStories(s, { level: "A1", status: "complete" }).length, 1);
  assert.equal(filterStories(s, { level: "A2", minutes: "short" }).length, 0);
  assert.equal(
    filterStories(s, { level: "A1", category: "fantasy" }).length,
    1,
  );
  assert.equal(filterStories(s, { level: "A1", search: "KAFE" }).length, 1);
  assert.equal(filterStories(s, { level: "C1" }).length, 3);
});
test("vocabulary resolves genuine repository or explicit glossary, saves uniquely and avoids substring highlights", () => {
  const w = resolveWord("Blume")!;
  assert.equal(w.repository, true);
  assert.equal(resolveWord("Geschenk")?.repository, false);
  assert.equal(resolveWord("Essen")?.article, "das");
  assert.equal(resolveWord("Essen")?.repository, false);
  assert.equal(resolveWord("essen")?.repository, true);
  assert.equal(resolveWord("NOT_A_WORD"), undefined);
  let s = saveStoryWord(initialStories(), w.id);
  assert.strictEqual(saveStoryWord(s, w.id), s);
  s = saveStoryWord(s, glossary[0].id);
  assert.equal(s.savedWords.length, 2);
  assert.ok(wordById(glossary[0].id));
  assert.equal(
    annotatedParts("Handel Hand", ["Hand"]).filter((p) => p.word).length,
    1,
  );
  assert.ok(validStories(s));
});
test("persistence rejects forged paths, unknown words, spoofed questions and duplicate rewards", () => {
  const s = quiz(path(initialStories(), stories[0]), stories[0].id);
  assert.ok(validStories(s));
  for (const bad of [
    { ...s, savedWords: ["invented"] },
    { ...s, claims: [...s.claims, s.claims[0]] },
    {
      ...s,
      claims: [
        {
          id: "story:complete:unknown",
          xp: 20,
          coins: 0,
          seed: false,
          delivered: false,
        },
      ],
    },
  ])
    assert.equal(validStories(bad), false);
  const bad = structuredClone(s);
  currentRun(bad, stories[0].id).quiz!.questions[0].accepted = ["forged"];
  assert.equal(validStories(bad), false);
});
test("corrupt and future versions are preserved; unavailable storage never pretends to save", () => {
  const mem = new Map([[STORY_KEY, "{broken"]]),
    p = createStoryPersistence(() => ({
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => {
        mem.set(k, v);
      },
    }));
  p.load();
  assert.equal(mem.get(STORY_KEY + ":corrupt"), "{broken");
  mem.set(STORY_KEY, '{"version":99}');
  assert.equal(p.load().readonly, true);
  assert.throws(() => p.save(initialStories()));
  assert.equal(mem.get(STORY_KEY), '{"version":99}');
  assert.equal(
    createStoryPersistence(() => {
      throw Error("denied");
    }).load().readonly,
    true,
  );
});
test("all original and additional hosted audio files match real PCM, duration and SHA", () => {
  let count = 0;
  for (const story of stories.filter(
    (s) =>
      !s.id.startsWith("story-comedy-") && !s.id.startsWith("story-world-"),
  ))
    for (const scene of story.scenes) {
      const a =
        assets.scenes[
          (story.id + ":" + scene.id) as keyof typeof assets.scenes
        ];
      assert.ok(a);
      assert.equal(a.lines.length, scene.lines.length);
      for (const audio of [a.full, ...a.lines]) {
        const b = readFileSync(
          new URL("../../../public" + audio.url, import.meta.url),
        );
        assert.equal(b.toString("ascii", 0, 4), "RIFF");
        assert.equal(b.toString("ascii", 8, 12), "WAVE");
        assert.equal(b.readUInt16LE(22), 1);
        assert.equal(b.readUInt16LE(34), 16);
        assert.ok(b.length > 1000);
        assert.ok(b.subarray(44).some((v) => v !== 0));
        assert.ok(
          Math.abs((b.length - 44) / 2 / b.readUInt32LE(24) - audio.duration) <
            0.01,
        );
        assert.equal(
          createHash("sha256").update(b).digest("hex"),
          audio.sha256,
        );
        count++;
      }
    }
  assert.equal(count, 266);
  assert.equal(
    Object.keys(assets.glossary).length,
    glossary.filter(
      (w) =>
        !w.id.startsWith("story-comedy-") && !w.id.startsWith("story-world-"),
    ).length,
  );
  for (const word of glossary.filter(
    (w) =>
      !w.id.startsWith("story-comedy-") && !w.id.startsWith("story-world-"),
  )) {
    const a = assets.glossary[word.id as keyof typeof assets.glossary];
    assert.ok(a);
    const b = readFileSync(new URL("../../../public" + a.url, import.meta.url));
    assert.equal(b.toString("ascii", 0, 4), "RIFF");
    assert.equal(b.readUInt16LE(34), 16);
    assert.ok(b.subarray(44).some((v) => v !== 0));
    assert.ok(
      Math.abs((b.length - 44) / 2 / b.readUInt32LE(24) - a.duration) < 0.01,
    );
    assert.equal(createHash("sha256").update(b).digest("hex"), a.sha256);
    count++;
  }
  assert.equal(count, 300);
});

test("all six comedy levels have substantial bilingual scenes, distinct endings and genuine word links", () => {
  const additions = stories.filter((s) => s.id.startsWith("story-comedy-"));
  assert.equal(additions.length, 6);
  assert.deepEqual(
    additions.map((s) => s.level),
    ["A1", "A2", "B1", "B2", "C1", "C2"],
  );
  for (const story of additions) {
    assert.equal(story.category, "comedy");
    assert.equal(story.scenes.length, 7);
    assert.equal(story.scenes.filter((s) => s.ending).length, 4);
    for (const scene of story.scenes) {
      assert.equal(scene.lines.length, 4);
      assert.ok(scene.lines.every((l) => l.de.length > 25 && l.tr.length > 25));
      assert.ok(scene.question.explanation.length > 70);
      for (const lemma of scene.words) {
        assert.ok(resolveWord(lemma));
        assert.ok(
          scene.lines.some((l) => l.de.includes(lemma)),
          lemma,
        );
      }
    }
  }
  for (const category of [
    "daily",
    "friendship",
    "mystery",
    "fantasy",
    "travel",
    "work",
    "germany",
    "comedy",
  ])
    assert.ok(stories.some((s) => s.category === category));
});

test("all new paths restore in existing snapshots, failed quizzes cannot grant seeds, rewards remain idempotent", () => {
  let combined = quiz(path(initialStories(), stories[0]), stories[0].id);
  const old = structuredClone(combined.runs);
  for (const story of stories.filter((s) => s.id.startsWith("story-comedy-"))) {
    const failed = quiz(path(initialStories(), story), story.id, true);
    assert.equal(failed.claims.filter((c) => c.seed).length, 0);
    for (let b = 0; b < 2; b++)
      for (let e = 0; e < 2; e++) {
        combined = path(combined, story, b, e);
        const resumed = JSON.parse(JSON.stringify(combined)) as StoryState;
        assert.ok(validStories(resumed));
        combined = quiz(resumed, story.id);
        assert.ok(
          validSnapshot({ version: 1, modules: { stories: combined } }),
        );
      }
    assert.equal(
      combined.claims.filter((c) => c.id === `story:complete:${story.id}`)
        .length,
      1,
    );
    assert.equal(
      combined.claims.filter((c) => c.id === `story:quiz:${story.id}`).length,
      1,
    );
    assert.equal(combined.endings[story.id].length, 4);
    const receipts = combined.claims.length;
    combined = quiz(path(combined, story), story.id);
    assert.equal(combined.claims.length, receipts);
  }
  for (const [key, run] of Object.entries(old))
    assert.deepEqual(combined.runs[key], run);
  let garden = createStarter(0);
  const before = garden.coins;
  for (const claim of [...combined.claims, ...combined.claims])
    garden = grantReward(garden, {
      id: claim.id,
      source: "exercise",
      coins: claim.coins,
      ...(claim.seed ? { seeds: { lavender: 1 } } : {}),
    });
  assert.equal(
    garden.coins,
    before + combined.claims.reduce((n, c) => n + c.coins, 0),
  );
});

test("frozen previous daily stories survive catalog expansion and new glossary saves once", () => {
  let state = initialStories();
  state.daily["2026-10-29:C2"] = {
    date: "2026-10-29",
    level: "C2",
    storyId: "story-c2-stimmen",
  };
  state = ensureStoryDaily(state, "2026-10-29", "C2");
  assert.equal(state.daily["2026-10-29:C2"].storyId, "story-c2-stimmen");
  for (const word of glossary.filter((w) => w.id.startsWith("story-comedy-"))) {
    state = saveStoryWord(state, word.id);
    state = saveStoryWord(state, word.id);
  }
  assert.equal(state.savedWords.length, 5);
  assert.ok(validStories(state));
});

test("215 new MP3 assets match text/file hashes, complete mono frames, declared duration and all scene lines", () => {
  type Asset = {
    url: string;
    duration: number;
    sha256: string;
    textSha256: string;
    sampleRate: number;
  };
  const manifest = comedyAssets as {
    scenes: Record<string, { full: Asset; lines: Asset[] }>;
    glossary: Record<string, Asset>;
  };
  let count = 0;
  function check(a: Asset, text: string) {
    assert.ok(a);
    const bytes = readFileSync(
      new URL("../../../public" + a.url, import.meta.url),
    );
    assert.equal(createHash("sha256").update(bytes).digest("hex"), a.sha256);
    assert.equal(createHash("sha256").update(text).digest("hex"), a.textSha256);
    let p = 0,
      duration = 0,
      frames = 0;
    while (p < bytes.length) {
      const h = bytes.readUInt32BE(p),
        version = (h >>> 19) & 3;
      assert.equal(h >>> 21, 0x7ff);
      assert.notEqual(version, 1);
      assert.equal((h >>> 17) & 3, 1);
      const rate =
        [44100, 48000, 32000][(h >>> 10) & 3] /
        (version === 3 ? 1 : version === 2 ? 2 : 4);
      assert.equal(rate, a.sampleRate);
      assert.equal((h >>> 6) & 3, 3);
      const bitrates =
        version === 3
          ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
          : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
      const bitrate = bitrates[(h >>> 12) & 15] * 1000;
      assert.equal(bitrate, 64000);
      const size =
        Math.floor(((version === 3 ? 144 : 72) * bitrate) / rate) +
        ((h >>> 9) & 1);
      assert.ok(size > 4 && p + size <= bytes.length);
      p += size;
      duration += (version === 3 ? 1152 : 576) / rate;
      frames++;
    }
    assert.ok(frames > 15);
    assert.ok(Math.abs(duration - a.duration) < 0.00001);
    count++;
  }
  for (const story of stories.filter((s) => s.id.startsWith("story-comedy-")))
    for (const scene of story.scenes) {
      const a = manifest.scenes[story.id + ":" + scene.id];
      assert.equal(a.lines.length, scene.lines.length);
      check(a.full, scene.lines.map((l) => l.de).join("\n"));
      scene.lines.forEach((l, i) => check(a.lines[i], l.de));
    }
  for (const word of glossary.filter((w) => w.id.startsWith("story-comedy-")))
    check(manifest.glossary[word.id], word.article + " " + word.word);
  assert.equal(Object.keys(manifest.scenes).length, 42);
  assert.equal(count, 215);
});
