import { writeFileSync } from "node:fs";
import {
  stories,
  glossary,
  plannedStories,
} from "../src/lib/stories/content.ts";
import { validateStory } from "../src/lib/stories/graph.ts";
import { LEVELS } from "../src/lib/learning/types.ts";
import assets from "../src/data/stories/audio.json" with { type: "json" };
for (const s of stories) {
  const errors = validateStory(s);
  if (errors.length) throw Error(errors.join("\n"));
}
const report = {
  readyByLevel: Object.fromEntries(
    LEVELS.map((l) => [l, stories.filter((s) => s.level === l).length]),
  ),
  plannedByLevel: Object.fromEntries(
    LEVELS.map((l) => [l, plannedStories.filter((s) => s.level === l).length]),
  ),
  stories: stories.map((s) => ({
    id: s.id,
    level: s.level,
    scenes: s.scenes.length,
    decisionPoints: s.scenes.filter((n) => n.choices.length).length,
    branches: s.scenes.reduce((sum, n) => sum + n.choices.length, 0),
    endings: s.scenes.filter((n) => n.ending).length,
  })),
  totalScenes: stories.reduce((sum, s) => sum + s.scenes.length, 0),
  totalBranches: stories.reduce(
    (sum, s) => sum + s.scenes.reduce((v, n) => v + n.choices.length, 0),
    0,
  ),
  totalEndings: stories.reduce(
    (sum, s) => sum + s.scenes.filter((n) => n.ending).length,
    0,
  ),
  authoredComprehensionQuestions: stories.reduce(
    (sum, s) => sum + s.scenes.length,
    0,
  ),
  questionsPerVisitedPath: 3,
  sceneAudio: Object.keys(assets.scenes).length,
  lineAudio: Object.values(assets.scenes).reduce(
    (sum, s) => sum + s.lines.length,
    0,
  ),
  glossaryEntries: glossary.length,
  glossaryAudio: Object.keys(assets.glossary).length,
  supabaseConnected: false,
  migrationApplied: false,
  persistence: "deutsch-garden:stories:v1",
};
writeFileSync(
  new URL("../reports/stories-counts.json", import.meta.url),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
