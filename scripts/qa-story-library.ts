// Read-only HTTP checks. No login, progress writes or AI generation requests.
import assert from "node:assert/strict";
import { stories } from "../src/lib/stories/content.ts";
import audio from "../src/data/stories/library-audio.json" with { type: "json" };
const base = new URL(process.argv[2] ?? "http://127.0.0.1:3103");
assert.ok(["http:", "https:"].includes(base.protocol));
assert.ok(!base.username && !base.password && !base.search && !base.hash);
let routes = 0,
  recordings = 0;
const scripts = new Set<string>();
for (const story of stories) {
  const response = await fetch(new URL("/hikayeler/" + story.id, base), {
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, 200, story.id);
  const html = await response.text();
  assert.ok(html.includes(story.id), story.id + ": correct story payload");
  for (const match of html.matchAll(
    /<script[^>]+src="(\/_next\/static\/[^"?]+\.js)"/g,
  )) {
    scripts.add(match[1]);
  }
  routes++;
}
assert.ok(scripts.size > 0);
for (const path of scripts) {
  const response = await fetch(new URL(path, base), {
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get("content-type") ?? "", /javascript/);
  await response.arrayBuffer();
}
const manifest = audio.scenes as Record<string, { full: { url: string } }>;
for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
  const story = stories.find(
    (s) => s.level === level && s.id.startsWith("story-library-"),
  )!;
  const url = manifest[story.id + ":" + story.start].full.url;
  const response = await fetch(new URL(url, base), {
    headers: { Range: "bytes=0-1023" },
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, 206, level);
  assert.match(response.headers.get("content-type") ?? "", /audio\/mpeg/);
  assert.match(response.headers.get("content-range") ?? "", /^bytes 0-1023\//);
  assert.equal((await response.arrayBuffer()).byteLength, 1024);
  recordings++;
}
assert.equal(
  (await fetch(new URL("/hikayeler/story-does-not-exist", base))).status,
  404,
);
console.log(
  JSON.stringify({
    routes,
    scripts: scripts.size,
    rangedRecordings: recordings,
    unknownStory404: true,
  }),
);
