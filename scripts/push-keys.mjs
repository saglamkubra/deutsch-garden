import webpush from "web-push";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
const target = ".cache/push-vapid.env";
if (existsSync(target))
  throw Error("Mevcut anahtar dosyası korundu. Yeniden anahtar üretmeyin.");
mkdirSync(".cache", { recursive: true });
const keys = webpush.generateVAPIDKeys();
writeFileSync(
  target,
  `WEB_PUSH_PUBLIC_KEY=${keys.publicKey}\nWEB_PUSH_PRIVATE_KEY=${keys.privateKey}\n`,
  { flag: "wx", mode: 0o600 },
);
console.log(
  "Anahtarlar .cache/push-vapid.env özel dosyasına yazıldı. Dosyayı paylaşmayın veya Git’e eklemeyin.",
);
