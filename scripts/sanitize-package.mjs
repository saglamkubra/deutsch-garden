// Windows Next tracing can retain private runtime paths despite tracing excludes.
// Only generated standalone copies and trace references are removed; originals stay intact.
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
} from "node:fs";
import { resolve, relative, join, sep } from "node:path";
const root = resolve(".next/standalone");
const forbidden = (p) =>
  /(^|[\\/])(?:\.env[^\\/]*|\.cache)(?:[\\/]|$)|\.(?:sqlite|db)(?:-[^\\/]*)?$/.test(
    p,
  );
if (!existsSync(root)) throw Error("Önce üretim derlemesi gerekir.");
const paths = readdirSync(root, { recursive: true })
  .map(String)
  .filter(forbidden)
  .sort((a, b) => b.length - a.length);
let removed = 0;
for (const p of paths) {
  const target = resolve(root, p),
    rel = relative(root, target);
  if (
    !rel ||
    rel.startsWith(".." + sep) ||
    rel === ".." ||
    resolve(target) === root
  )
    throw Error("Paket sınırı ihlali");
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: false });
    removed++;
  }
}
for (const p of readdirSync(root, { recursive: true })
  .map(String)
  .filter((p) => p.endsWith(".nft.json"))) {
  const target = join(root, p),
    trace = JSON.parse(readFileSync(target, "utf8"));
  if (Array.isArray(trace.files)) {
    trace.files = trace.files.filter((f) => !forbidden(f));
    writeFileSync(target, JSON.stringify(trace));
  }
}
console.log(
  "Üretilmiş paketten çıkarılan özel yol sayısı: " +
    removed +
    ". Kaynak .cache ve ortam dosyaları korundu.",
);
