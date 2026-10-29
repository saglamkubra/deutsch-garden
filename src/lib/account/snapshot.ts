import { validateGarden, parseGardenRecord } from "../garden/storage.ts";
import { validLearning } from "../learning/persistence.ts";
import { validState } from "../exercises/persistence.ts";
import { validGrammar } from "../grammar/persistence.ts";
import { validListening } from "../listening/persistence.ts";
import { validStories } from "../stories/persistence.ts";
import { validCourses } from "../courses/persistence.ts";
import { validLumi } from "../lumi/persistence.ts";
import { validateVocabulary } from "../learning/import.ts";
import { MODULES, keyFor, physicalKey } from "./storage.ts";
export type Preferences = {
  displayName: string;
  learningGoal: string;
  notifications: boolean;
  sound: boolean;
};
export const defaultPreferences: Preferences = {
  displayName: "",
  learningGoal: "Her gün küçük bir adım",
  notifications: false,
  sound: false,
};
export const validPreferences = (x: unknown): x is Preferences => {
  if (!x || typeof x !== "object") return false;
  const p = x as Preferences;
  return (
    typeof p.displayName === "string" &&
    p.displayName.length <= 80 &&
    typeof p.learningGoal === "string" &&
    p.learningGoal.length <= 300 &&
    typeof p.notifications === "boolean" &&
    typeof p.sound === "boolean"
  );
};
export type Snapshot = { version: 1; modules: Record<string, unknown> };
export class InvalidProgressRecord extends Error {
  constructor(module: string) {
    const labels: Record<string, string> = {
      garden: "Bahçem",
      learning: "Kelimelerim",
      exercises: "Alıştırmalar",
      grammar: "Gramer",
      listening: "Dinleme",
      stories: "Hikâyeler",
      "mini-courses": "Derslerim",
      lumi: "Lumi",
      vocabulary: "Kelime hazinesi",
      preferences: "Tercihler",
    };
    super(
      `${labels[module] ?? "İlerleme"} kaydı doğrulanamadı. Eski kayıt korunuyor; veri yedeğini dışa aktararak kontrol edebilirsin.`,
    );
    this.name = "InvalidProgressRecord";
  }
}
const validators: Record<string, (x: unknown) => boolean> = {
  garden: validateGarden,
  learning: validLearning,
  exercises: validState,
  grammar: validGrammar,
  listening: validListening,
  stories: validStories,
  "mini-courses": validCourses,
  lumi: validLumi,
  vocabulary: (x) =>
    Array.isArray(x) &&
    x.length <= 20000 &&
    x.every((v) => validateVocabulary(v).length === 0),
  preferences: validPreferences,
};
export function validSnapshot(x: unknown): x is Snapshot {
  try {
    if (!x || typeof x !== "object") return false;
    const s = x as Snapshot;
    return (
      s.version === 1 &&
      !!s.modules &&
      typeof s.modules === "object" &&
      !Array.isArray(s.modules) &&
      JSON.stringify(s).length <= 2_000_000 &&
      Object.entries(s.modules).every(([k, v]) => validators[k]?.(v))
    );
  } catch {
    return false;
  }
}
export function capture(
  disk: Pick<Storage, "getItem">,
  owner: string | null,
): Snapshot {
  const modules: Record<string, unknown> = {};
  for (const name of MODULES) {
    const raw = disk.getItem(physicalKey(keyFor(name), owner));
    if (raw !== null) {
      try {
        modules[name] =
          name === "garden" ? parseGardenRecord(raw) : JSON.parse(raw);
      } catch {
        throw new InvalidProgressRecord(name);
      }
      if (!validators[name](modules[name]))
        throw new InvalidProgressRecord(name);
    }
  }
  const s: Snapshot = { version: 1, modules };
  if (!validSnapshot(s))
    throw new Error(
      "Yerel kayıtlardan biri geçersiz veya daha yeni bir sürümde. Veriler değiştirilmedi.",
    );
  return s;
}
export function canonical(x: unknown): string {
  if (Array.isArray(x)) return "[" + x.map(canonical).join(",") + "]";
  if (x && typeof x === "object")
    return (
      "{" +
      Object.entries(x)
        .sort(([a], [b]) => a.localeCompare(b, "en"))
        .map(([k, v]) => JSON.stringify(k) + ":" + canonical(v))
        .join(",") +
      "}"
    );
  return JSON.stringify(x);
}
export async function fingerprint(x: unknown) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical(x)),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
export const hasProgress = (s: Snapshot) =>
  Object.keys(s.modules).some((k) => k !== "vocabulary" && k !== "preferences");
export function archive(disk: Storage, owner: string, snapshot: Snapshot) {
  const key = `deutsch-garden:archive:${owner}:${crypto.randomUUID()}`;
  disk.setItem(
    key,
    JSON.stringify({ savedAt: new Date().toISOString(), snapshot }),
  );
  return key;
}
/** Journal is retained on failure; boot rolls back before any store can mount. */
export function restore(disk: Storage, owner: string, next: Snapshot) {
  if (!validSnapshot(next))
    throw new Error("Bulut kaydı doğrulanamadı; yerel kayıt korunuyor.");
  const journal = `deutsch-garden:restore:${owner}`;
  const previous = MODULES.map((m) => {
    const key = physicalKey(keyFor(m), owner);
    return [key, disk.getItem(key)] as const;
  });
  disk.setItem(journal, JSON.stringify(previous));
  try {
    for (const m of MODULES) {
      const key = physicalKey(keyFor(m), owner);
      // Backups must belong to the same snapshot, including deleted private content.
      disk.removeItem(key + ":backup");
      if (Object.hasOwn(next.modules, m))
        disk.setItem(key, JSON.stringify(next.modules[m]));
      else disk.removeItem(key);
    }
    if (canonical(capture(disk, owner)) !== canonical(next))
      throw new Error("Aktarım doğrulanamadı.");
    disk.removeItem(journal);
  } catch (error) {
    recoverRestore(disk, owner);
    throw error;
  }
}
export function recoverRestore(disk: Storage, owner: string) {
  const key = `deutsch-garden:restore:${owner}`,
    raw = disk.getItem(key);
  if (!raw) return;
  const entries: unknown = JSON.parse(raw);
  if (
    !Array.isArray(entries) ||
    entries.some(
      (e) =>
        !Array.isArray(e) ||
        typeof e[0] !== "string" ||
        !e[0].startsWith(physicalKey("deutsch-garden:", owner)) ||
        (e[1] !== null && typeof e[1] !== "string"),
    )
  )
    throw new Error(
      "Yarım kalan aktarım yedeği doğrulanamadı. Kayıtlar koruma altında.",
    );
  for (const [k, v] of entries) {
    if (v === null) disk.removeItem(k);
    else disk.setItem(k, v);
  }
  disk.removeItem(key);
}
