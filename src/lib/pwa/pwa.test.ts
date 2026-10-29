/* eslint-disable @typescript-eslint/no-explicit-any */
import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const code = readFileSync("public/sw.js", "utf8");
function worker(online = true) {
  const handlers: Record<string, (event: any) => void> = {},
    saved = new Map(),
    removed: string[] = [],
    fetched: any[] = [];
  const context = {
    URL,
    Response,
    self: {
      location: { origin: "https://garden.example" },
      clients: { claim: async () => {} },
      addEventListener: (kind: string, fn: any) => {
        handlers[kind] = fn;
      },
    },
    caches: {
      open: async () => ({
        match: async (path: string) =>
          saved.get(path)?.clone?.() ?? saved.get(path),
        addAll: async (paths: string[]) => {
          for (const p of paths) saved.set(p, { url: p });
        },
      }),
      keys: async () => ["deutsch-garden-public-v0", "another-app"],
      delete: async (name: string) => {
        removed.push(name);
      },
      match: async (p: string) => saved.get(p),
    },
    fetch: async (req: any, options: any) => {
      fetched.push({ req, options });
      if (!online) throw Error("offline");
      return { url: typeof req === "string" ? req : req.url };
    },
  };
  vm.runInNewContext(code, context);
  return { handlers, saved, removed, fetched };
}
async function lifecycle(fn: any) {
  let work: Promise<unknown> = Promise.resolve();
  fn({ waitUntil: (p: Promise<unknown>) => (work = p) });
  await work;
}
async function request(
  w: ReturnType<typeof worker>,
  path: string,
  mode = "cors",
  method = "GET",
  range?: string,
) {
  let response: Promise<any> | undefined;
  w.handlers.fetch({
    request: {
      url: new URL(path, "https://garden.example").href,
      mode,
      method,
      headers: new Headers(range ? { range } : {}),
    },
    respondWith: (p: Promise<any>) => (response = p),
  });
  return response ? await response : null;
}
test("PWA cache contains only public fallback and icons; activation never removes unrelated caches", async () => {
  const w = worker();
  await lifecycle(w.handlers.install);
  await lifecycle(w.handlers.activate);
  assert.equal(w.saved.size, 5);
  assert.deepEqual(w.removed, ["deutsch-garden-public-v0"]);
  assert.ok(
    [...w.saved.keys()].every(
      (p) => p === "/offline.html" || p.startsWith("/icons/"),
    ),
  );
});
test("downloaded public lessons and ranged audio work with network unavailable", async () => {
  const w = worker(false);
  w.saved.set("/offline-packs/A2.json", Response.json({ level: "A2" }));
  w.saved.set(
    "/audio/course-examples/example.mp3",
    new Response(new Uint8Array([1, 2, 3, 4, 5]), {
      headers: { "Content-Type": "audio/mpeg" },
    }),
  );
  assert.equal(
    (await (await request(w, "/offline-packs/A2.json")).json()).level,
    "A2",
  );
  const audio = await request(
    w,
    "/audio/course-examples/example.mp3",
    "cors",
    "GET",
    "bytes=1-3",
  );
  assert.equal(audio.status, 206);
  assert.equal(audio.headers.get("Content-Range"), "bytes 1-3/5");
  assert.deepEqual([...new Uint8Array(await audio.arrayBuffer())], [2, 3, 4]);
  assert.equal(
    (
      await request(
        w,
        "/audio/course-examples/example.mp3",
        "cors",
        "GET",
        "bytes=9-",
      )
    ).status,
    416,
  );
  assert.equal(await request(w, "/api/account/config"), null);
  assert.equal(w.fetched.length, 0);
});
test("Offline navigation uses a generic Turkish page; APIs, RSC, private files and cross-origin requests are never intercepted", async () => {
  const w = worker(false);
  await lifecycle(w.handlers.install);
  assert.equal(
    (await request(w, "/profilim", "navigate")).url,
    "/offline.html",
  );
  for (const p of [
    "/api/account/config",
    "/api/lumi/chat",
    "/profilim?_rsc=1",
    "/private.json",
    "https://supabase.example/rest/v1/user_progress",
  ])
    assert.equal(await request(w, p), null);
  assert.equal(await request(w, "/api/lumi/chat", "cors", "POST"), null);
  assert.equal(w.saved.size, 5);
});
test("Online personal navigation always uses network no-store and never populates shared caches", async () => {
  const w = worker();
  await lifecycle(w.handlers.install);
  assert.equal(
    (await request(w, "/lumi-ai", "navigate")).url,
    "https://garden.example/lumi-ai",
  );
  assert.equal(w.fetched[0].options.cache, "no-store");
  assert.equal(w.saved.size, 5);
});
test("PNG icons have declared dimensions and offline page has no scripts or private data", () => {
  for (const [name, size] of [
    ["icon-192", 192],
    ["icon-512", 512],
    ["maskable-512", 512],
    ["apple-touch-icon", 180],
  ] as const) {
    const b = readFileSync("public/icons/" + name + ".png");
    assert.equal(b.readUInt32BE(16), size);
    assert.equal(b.readUInt32BE(20), size);
  }
  const html = readFileSync("public/offline.html", "utf8");
  assert.ok(html.includes('lang="tr"'));
  assert.ok(!/<script|localStorage|SUPABASE|GEMINI_API_KEY/.test(html));
});
