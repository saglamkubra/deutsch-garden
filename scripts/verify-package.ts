// Build gate: never publish local secrets, SQLite files or private cache data.
import { readdirSync, readFileSync } from "node:fs";
const server = readdirSync(".next/standalone", { recursive: true }) as string[];
const forbidden = server.filter((p) =>
  /(^|[\\/])(?:\.env[^\\/]*|\.cache)(?:[\\/]|$)|\.(?:sqlite|db)(?:-[^\\/]*)?$/.test(
    p,
  ),
);
const browser = (
  readdirSync(".next/static", { recursive: true }) as string[]
).filter((p) => /\.(js|json)$/.test(p));
let leaks = 0;
for (const name of [
  "GEMINI_API_KEY",
  "WEB_PUSH_PRIVATE_KEY",
  "REMINDER_CRON_SECRET",
  "OPENAI_API_KEY",
  "SUPABASE_SERVER_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "LUMI_SESSION_SECRET",
  "BIRTHDAY_SESSION_SECRET",
  "LUMI_ACCESS_PASSWORD",
  "BIRTHDAY_CREATOR_PASSWORD",
  "BIRTHDAY_ACCESS_PASSWORD",
]) {
  const value = process.env[name];
  if (
    value &&
    value.length >= 12 &&
    browser.some((p) =>
      readFileSync(".next/static/" + p, "utf8").includes(value),
    )
  )
    leaks++;
}
console.log(
  "Paket denetimi: özel dosya sayısı=" +
    forbidden.length +
    ", tarayıcıda bulunan mevcut sır sayısı=" +
    leaks +
    ". Değerler yazdırılmadı.",
);
if (forbidden.length || leaks) process.exitCode = 1;
