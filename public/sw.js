/* Deutsch Garden: private pages and API responses are NEVER stored. */
const CACHE = "deutsch-garden-public-v1";
const PUBLIC = [
  "/offline.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
];
const LEARNING = "deutsch-garden-learning-v1";
const learningPath = (p) =>
  p === "/cevrimdisi.html" ||
  p === "/offline-reader.js" ||
  /^\/offline-packs\/(A1|A2|B1|B2|C1|C2)\.json$/.test(p) ||
  /^\/audio\/(courses|course-examples|course-extension|pronunciation|deutsch-garden|extensions|stories|stories-comedy|stories-worlds|stories-library|listening|listening-complete)\/[a-zA-Z0-9_.-]+\.(mp3|wav)$/.test(
    p,
  );
self.addEventListener("install", (event) =>
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await cache.addAll(PUBLIC);
      await self.skipWaiting?.();
    }),
  ),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys())
        if (name.startsWith("deutsch-garden-public-") && name !== CACHE)
          await caches.delete(name);
      await self.clients.claim();
    })(),
  ),
);
self.addEventListener("fetch", (event) => {
  const request = event.request,
    url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (!url.search && learningPath(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(LEARNING);
        const saved = await cache.match(url.pathname);
        if (saved) {
          const range = request.headers?.get("range");
          if (range) {
            const match = /^bytes=(\d+)-(\d*)$/.exec(range);
            if (match) {
              const bytes = await saved.arrayBuffer(),
                start = Number(match[1]),
                end = match[2]
                  ? Math.min(Number(match[2]), bytes.byteLength - 1)
                  : bytes.byteLength - 1;
              if (start > end)
                return new Response(null, {
                  status: 416,
                  headers: { "Content-Range": "bytes */" + bytes.byteLength },
                });
              return new Response(bytes.slice(start, end + 1), {
                status: 206,
                headers: {
                  "Content-Type":
                    saved.headers.get("content-type") || "audio/mpeg",
                  "Content-Range": `bytes ${start}-${end}/${bytes.byteLength}`,
                  "Accept-Ranges": "bytes",
                  "Content-Length": String(end - start + 1),
                },
              });
            }
          }
          return saved;
        }
        return fetch(request, { cache: "no-store" });
      })(),
    );
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" }).catch(() =>
        caches.match("/offline.html"),
      ),
    );
    return;
  }
  if (!url.search && PUBLIC.includes(url.pathname))
    event.respondWith(
      caches.match(url.pathname).then((hit) => hit || fetch(request)),
    );
});
self.addEventListener("push", (event) =>
  event.waitUntil(
    self.registration.showNotification("Deutsch Garden seni bekliyor", {
      body: "Bugün bahçene bir kelime daha eklemek ister misin? 🌷",
      icon: "/icons/icon-192.png",
      tag: "deutsch-garden-learning",
      data: { url: "/derslerim" },
    }),
  ),
);
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/derslerim"));
});
