// No implicit uploads. Keys/private letters must NEVER be printed.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createHash, randomUUID } from "node:crypto";
import {
  LumiLedger,
  LEDGER_TABLES,
  type LedgerData,
} from "../src/lib/lumi/ledger.ts";
import {
  serverStateStore,
  type Namespace,
} from "../src/lib/server-state/store.ts";
import {
  sealBackup,
  validateBackup,
  checkBackupSecrets,
  canonical,
  type Backup,
} from "../src/lib/server-state/backup.ts";
const args = process.argv.slice(2),
  command = args[0],
  flag = (s: string) => args.includes(s),
  value = (s: string) => {
    const index = args.indexOf(s);
    return index >= 0 ? args[index + 1] || "" : "";
  };
const keys: Namespace[] = [
  "lumi-ledger-v1",
  "birthday-config-v1",
  "birthday-access-v1",
];
const fingerprint = (s: string | null) =>
  s ? createHash("sha256").update(s).digest("hex") : null;
const readOptional = async (p: string) => {
  try {
    return await readFile(p, "utf8");
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "ENOENT")
      return null;
    throw e;
  }
};
function privateOutput() {
  const root = resolve(".cache/server-backups"),
    path = resolve(
      value("--out") || join(root, "backup-" + Date.now() + ".json"),
    );
  if (!path.startsWith(root + sep)) throw Error("PRIVATE_OUTPUT_REQUIRED");
  return path;
}
function confirmProject() {
  const expected = flag("--project-ref") ? value("--project-ref") : "",
    host = new URL(process.env.SUPABASE_URL || "").hostname;
  if (!expected || host !== expected + ".supabase.co")
    throw Error("PROJECT_CONFIRMATION_REQUIRED");
}
async function secrets(local: boolean) {
  const lumi =
    process.env.LUMI_SESSION_SECRET ||
    (local
      ? await readOptional(
          join(process.env.LUMI_DATA_DIR || ".cache/lumi", "session-secret"),
        )
      : null);
  const birthday =
    process.env.BIRTHDAY_SESSION_SECRET ||
    process.env.LUMI_SESSION_SECRET ||
    (local
      ? await readOptional(
          join(
            process.env.BIRTHDAY_DATA_DIR || ".cache/birthday",
            "session-secret",
          ),
        )
      : null);
  return { lumi, birthday };
}
async function output(backup: Backup) {
  const path = privateOutput();
  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(path, JSON.stringify(backup, null, 2), {
    flag: "wx",
    mode: 0o600,
  });
  console.log(
    "Özel yedek .cache/server-backups altında oluşturuldu; kaynak kayıtlar değiştirilmedi. Bu dosyayı paylaşmayın veya Git'e eklemeyin.",
  );
}
async function run() {
  if (command === "export-local") {
    const path = join(
      process.env.LUMI_DATA_DIR || ".cache/lumi",
      "usage.sqlite",
    );
    let ledger: LedgerData;
    let db: DatabaseSync | null = null;
    try {
      db = new DatabaseSync(path, { readOnly: true });
      db.exec("BEGIN");
      ledger = {
        version: 1,
        tables: Object.fromEntries(
          LEDGER_TABLES.map((t) => [
            t,
            db!.prepare("SELECT * FROM " + t).all(),
          ]),
        ),
      } as LedgerData;
      db.exec("COMMIT");
    } catch (e) {
      if (!flag("--allow-empty-lumi")) throw e;
      const existing = await readOptional(path);
      if (existing !== null) throw e;
      const memory = new LumiLedger(":memory:");
      ledger = memory.exportData();
      memory.close();
    } finally {
      db?.close();
    }
    const raw = await readOptional(
      join(process.env.BIRTHDAY_DATA_DIR || ".cache/birthday", "config.json"),
    );
    const s = await secrets(true),
      at = Date.now();
    const backup = validateBackup(
      sealBackup({
        format: 1,
        createdAt: at,
        secretHashes: {
          lumi: fingerprint(s.lumi),
          birthday: fingerprint(s.birthday),
        },
        states: {
          "lumi-ledger-v1": ledger,
          "birthday-config-v1": {
            config: raw === null ? null : JSON.parse(raw),
          },
          "birthday-access-v1": { attempts: Array(8).fill(at) },
        },
      }),
    );
    if (ledger.tables.lumi_conversations.length && !s.lumi)
      throw Error("SECRET_REQUIRED");
    await output(backup);
    console.log(
      "Atölye denemeleri eski süreçte yalnızca bellekteydi; geçişte güvenli 15 dakikalık bekleme penceresi uygulanır.",
    );
    return;
  }
  if (command === "import" || command === "verify") {
    const file = flag("--file") ? value("--file") : null;
    if (!file) throw Error("FILE_REQUIRED");
    const backup = validateBackup(
      JSON.parse(await readFile(resolve(file), "utf8")),
    );
    confirmProject();
    const s = await secrets(false);
    checkBackupSecrets(backup, s.lumi || "", s.birthday || "");
    if (
      command === "import" &&
      (!flag("--confirm-private-import") || !flag("--confirm-source-stopped"))
    )
      throw Error("IMPORT_CONFIRMATION_REQUIRED");
    const store = serverStateStore();
    for (const key of keys) {
      const row = await store.read(key),
        payload = backup.states[key];
      if (command === "verify") {
        if (row.revision < 1 || canonical(row.payload) !== canonical(payload))
          throw Error("VERIFICATION_FAILED");
        continue;
      }
      if (row.revision > 0) {
        if (canonical(row.payload) !== canonical(payload))
          throw Error("REMOTE_NOT_EMPTY");
        continue;
      }
      if (!(await store.cas(key, 0, payload, randomUUID())))
        throw Error("REMOTE_CHANGED");
      if (canonical((await store.read(key)).payload) !== canonical(payload))
        throw Error("VERIFICATION_FAILED");
    }
    console.log(
      command === "verify"
        ? "Üç uzak kayıt yedekle birebir doğrulandı. Canlı API kabul testleri ayrıca gerekir."
        : "Üç kayıt aktarıldı ve geri okunarak karşılaştırıldı. Yerel kaynaklar korundu. Şimdi verify komutunu çalıştırın.",
    );
    return;
  }
  if (command === "export-cloud") {
    if (!flag("--confirm-private-export"))
      throw Error("EXPORT_CONFIRMATION_REQUIRED");
    confirmProject();
    const store = serverStateStore(),
      s = await secrets(false);
    const states = {} as Backup["states"];
    for (const key of keys) {
      const row = await store.read(key);
      if (row.payload === null) throw Error("REMOTE_NOT_READY");
      states[key] = row.payload;
    }
    await output(
      validateBackup(
        sealBackup({
          format: 1,
          createdAt: Date.now(),
          secretHashes: {
            lumi: fingerprint(s.lumi),
            birthday: fingerprint(s.birthday),
          },
          states,
        }),
      ),
    );
    return;
  }
  if (command === "restore-local") {
    if (!flag("--confirm-private-restore") || !flag("--file") || !flag("--out"))
      throw Error("RESTORE_CONFIRMATION_REQUIRED");
    const backup = validateBackup(
        JSON.parse(await readFile(resolve(value("--file")), "utf8")),
      ),
      s = await secrets(false);
    checkBackupSecrets(backup, s.lumi || "", s.birthday || "");
    const root = resolve(".cache/server-restores"),
      dir = resolve(value("--out"));
    if (!dir.startsWith(root + sep)) throw Error("PRIVATE_OUTPUT_REQUIRED");
    await mkdir(root, { recursive: true });
    await mkdir(dir);
    await mkdir(join(dir, "lumi"));
    await mkdir(join(dir, "birthday"));
    const ledger = new LumiLedger(join(dir, "lumi/usage.sqlite"));
    try {
      ledger.importData(backup.states["lumi-ledger-v1"]);
    } finally {
      ledger.close();
    }
    const config = (backup.states["birthday-config-v1"] as { config: unknown })
      .config;
    if (config !== null)
      await writeFile(
        join(dir, "birthday/config.json"),
        JSON.stringify(config),
        { flag: "wx", mode: 0o600 },
      );
    console.log(
      "Yeni ve ayrı bir yerel geri dönüş dizini oluşturuldu. Orijinal kayıtlar değiştirilmedi. Aynı oturum sırlarını ortamda koruyun; bulutla eşzamanlı yazıcı çalıştırmayın.",
    );
    return;
  }
  console.log(
    "Komutlar: export-local | import | verify | export-cloud | restore-local. Kullanım ve onay bayrakları: docs/STATELESS-HOSTING.md. Hiçbir otomatik aktarım yapılmadı.",
  );
}
run().catch((error: unknown) => {
  const messages: Record<string, string> = {
    INVALID_BACKUP:
      "Yedek doğrulanamadı; dosya değiştirilmiş veya eksik olabilir.",
    SECRET_REQUIRED:
      "Aynı oturum sırları sunucu ortamında ayarlanmalı; en az 32 karakter gerekir.",
    SECRET_MISMATCH:
      "Oturum sırları kaynak yedekle eşleşmiyor. Eski oturum ve ödülleri korumak için aktarım durduruldu.",
    IMPORT_CONFIRMATION_REQUIRED:
      "Özel içeriğin aktarımı ve kaynak sunucunun durdurulduğu açıkça onaylanmalı.",
    PROJECT_CONFIRMATION_REQUIRED:
      "Hedef proje kimliği açıkça belirtilmeli ve sunucu URL’siyle eşleşmeli.",
    REMOTE_NOT_EMPTY:
      "Hedefte farklı kayıt var. Üzerine yazılmadı; birleştirme otomatik yapılmaz.",
    VERIFICATION_FAILED:
      "Uzak kayıt yedekle birebir doğrulanamadı. Geçişi tamamlandı saymayın.",
    PRIVATE_OUTPUT_REQUIRED:
      "Özel çıktı yalnızca belgede belirtilen .cache alt dizinine yazılabilir.",
    FILE_REQUIRED: "Yedek dosyasını --file ile belirtin.",
    EXPORT_CONFIRMATION_REQUIRED:
      "Özel uzak yedeğin indirilmesini açıkça onaylayın.",
    RESTORE_CONFIRMATION_REQUIRED:
      "Yerel geri dönüş için dosya, yeni dizin ve açık onay gerekir.",
    REMOTE_CHANGED: "Hedef kayıt başka bir işlemle değişti. Üzerine yazılmadı.",
    REMOTE_NOT_READY: "Uzak sunucu kayıtları henüz hazırlanmadı.",
    BACKUP_TOO_LARGE:
      "Yedek izin verilen boyutu aşıyor; kayıtlar kırpılmadı veya silinmedi.",
  };
  if (error instanceof Error && messages[error.message])
    console.error(messages[error.message]);
  console.error(
    "İşlem tamamlanmadı. Sırlar veya özel içerik yazdırılmadı. Dosya, hedef proje, açık onaylar, aynı oturum sırları ve SQL kurulumunu kontrol edin. Mevcut kayıtların üzerine yazılmadı.",
  );
  process.exitCode = 1;
});
