export {};
// Read-only HTTP smoke check. Never print response bodies, cookies or credentials.
const base = process.argv[2] || "http://127.0.0.1:3000";
const origin = new URL(base);
if (origin.username || origin.password || origin.search || origin.hash)
  throw Error("Yalnızca uygulamanın adresini gir.");
const routes = [
  "/",
  "/bahcem",
  "/derslerim",
  "/kelimelerim",
  "/alistirmalar",
  "/gramer",
  "/dinleme-kulubu",
  "/hikayeler",
  "/gunlugum",
  "/lumi-ai",
  "/cicek-dukkani",
  "/gunluk-hediyem",
  "/giris",
  "/kayit",
  "/profilim",
  "/basarilarim",
  "/hatira-bahcem",
  "/dogum-gunu",
  "/offline.html",
  "/sw.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/manifest.webmanifest",
  "/api/health",
];
let failed = 0;
for (const path of routes) {
  try {
    const r = await fetch(new URL(path, origin), {
      signal: AbortSignal.timeout(30000),
      redirect: "manual",
    });
    const ok = r.status === 200;
    console.log((ok ? "GEÇTİ" : "HATA") + " " + path + " HTTP " + r.status);
    if (!ok) failed++;
    if (path === "/manifest.webmanifest" && ok) {
      const m = await r.json();
      if (
        m.name !== "Deutsch Garden" ||
        m.display !== "standalone" ||
        m.icons.filter((i: { type: string }) => i.type === "image/png").length <
          3
      )
        failed++;
    } else await r.arrayBuffer();
  } catch {
    console.log("HATA " + path + " bağlantı kurulamadı");
    failed++;
  }
}
const missing = await fetch(new URL("/bilinmeyen-sayfa-qa", origin), {
  signal: AbortSignal.timeout(30000),
});
if (missing.status !== 404) {
  failed++;
  console.log("HATA bulunamayan sayfa 404 dönmüyor");
}
console.log(
  "Sonuç: " +
    failed +
    " hata. Bu kontrol giriş, AI yanıtı veya bulut eşitlemesi doğrulaması değildir.",
);
process.exitCode = failed ? 1 : 0;
