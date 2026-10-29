import {
  LEVELS,
  WORD_TYPES,
  CATEGORIES,
  type VocabularyRecord,
} from "./types.ts";
import { curriculum } from "./curriculum.ts";
export const ORIGINAL_LICENSE = "LicenseRef-DeutschGarden-Original";
const acceptedLicenses = [
  ORIGINAL_LICENSE,
  "CC0-1.0",
  "CC-BY-4.0",
  "CC-BY-SA-4.0",
];
export const normalizeGerman = (s: string) =>
  s
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("de-DE")
    .replace(/ß/g, "ss");
export const searchFold = (s: string) =>
  s
    .normalize("NFKD")
    .toLocaleLowerCase("tr-TR")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ß/g, "ss");
export function vocabularyKey(v: VocabularyRecord) {
  return [
    normalizeGerman(v.german_word),
    v.word_type,
    v.article ?? "",
    v.sense_key.normalize("NFC").trim().toLowerCase(),
  ].join("|");
}
const obj = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
export function validateVocabulary(x: unknown): string[] {
  if (!obj(x)) return ["Kayıt nesne olmalı."];
  const errors: string[] = [];
  for (const key of [
    "id",
    "german_word",
    "turkish_meaning",
    "sense_key",
    "example_sentence_de",
    "example_sentence_tr",
    "source_name",
    "license",
    "created_at",
    "updated_at",
  ])
    if (typeof x[key] !== "string" || !(x[key] as string).trim())
      errors.push(key + " eksik.");
  if (typeof x.id === "string" && !/^[a-z0-9][a-z0-9_-]{1,100}$/.test(x.id))
    errors.push("Geçersiz kimlik.");
  if (!WORD_TYPES.includes(x.word_type as never))
    errors.push("Kelime türü geçersiz.");
  if (!LEVELS.includes(x.cefr_level as never)) errors.push("Düzey geçersiz.");
  if (
    !Array.isArray(x.levels) ||
    !x.levels.length ||
    x.levels.some((l) => !LEVELS.includes(l)) ||
    !x.levels.includes(x.cefr_level)
  )
    errors.push("Düzey bağlantıları geçersiz.");
  if (!Object.hasOwn(CATEGORIES, x.category as string))
    errors.push("Kategori geçersiz.");
  if (
    !Array.isArray(x.topics) ||
    !x.topics.length ||
    x.topics.some((t) => !Object.hasOwn(CATEGORIES, t)) ||
    !x.topics.includes(x.category)
  )
    errors.push("Konu bağlantıları geçersiz.");
  if (
    !Array.isArray(x.unit_ids) ||
    !x.unit_ids.length ||
    x.unit_ids.some((id) => !curriculum.some((u) => u.id === id))
  )
    errors.push("Ünite bağlantıları geçersiz.");
  if (x.word_type === "noun") {
    if (!["der", "die", "das"].includes(x.article as string))
      errors.push("İsim artikeli gerekli.");
    if (!x.plural_form && !x.plural_note)
      errors.push("Çoğul veya çoğul notu gerekli.");
    if (
      typeof x.german_word === "string" &&
      x.german_word.length > 0 &&
      x.german_word[0] !== x.german_word[0].toLocaleUpperCase("de-DE")
    )
      errors.push("İsim büyük harfle başlamalı.");
  } else if (x.article !== null || x.plural_form !== null)
    errors.push("İsim olmayan kayıtta artikel/çoğul olmamalı.");
  for (const key of [
    "plural_form",
    "plural_note",
    "pronunciation_hint",
    "audio_url",
    "source_url",
  ])
    if (x[key] !== null && typeof x[key] !== "string")
      errors.push(key + " metin veya null olmalı.");
  if (
    !Number.isInteger(x.difficulty) ||
    (x.difficulty as number) < 1 ||
    (x.difficulty as number) > 5
  )
    errors.push("Zorluk 1–5 olmalı.");
  for (const key of ["created_at", "updated_at"])
    if (
      typeof x[key] === "string" &&
      !Number.isFinite(Date.parse(x[key] as string))
    )
      errors.push("Tarih geçersiz.");
  if (!acceptedLicenses.includes(x.license as string))
    errors.push("İzinli lisans listesinde olmayan kaynak.");
  if (
    x.license === ORIGINAL_LICENSE &&
    x.source_name !== "Deutsch Garden · özgün içerik"
  )
    errors.push("Özgün içerik kaynak etiketi eşleşmiyor.");
  if (
    x.license !== ORIGINAL_LICENSE &&
    !(typeof x.source_url === "string" && /^https:\/\//.test(x.source_url))
  )
    errors.push("Haricî kaynak için HTTPS atıf adresi gerekli.");
  if (x.audio_url !== null)
    errors.push("Bu hat üçüncü taraf ses dosyası içe aktarmaz.");
  return errors;
}
export type ImportReport = {
  inserted: number;
  updated: number;
  skipped: number;
  rejected: number;
  errors: { index: number; reasons: string[] }[];
};
export function importVocabulary(
  existing: VocabularyRecord[],
  incoming: unknown[],
): { records: VocabularyRecord[]; report: ImportReport } {
  const records = existing.map((v) => ({ ...v }));
  const byKey = new Map(records.map((v, i) => [vocabularyKey(v), i]));
  const byId = new Map(records.map((v, i) => [v.id, i]));
  const exposureKey = (v: VocabularyRecord) =>
    [
      normalizeGerman(v.german_word),
      v.word_type,
      v.article ?? "",
      searchFold(v.turkish_meaning.trim()),
    ].join("|");
  const byExposure = new Map(records.map((v, i) => [exposureKey(v), i]));
  const report: ImportReport = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    rejected: 0,
    errors: [],
  };
  incoming.forEach((raw, index) => {
    const errors = validateVocabulary(raw);
    if (errors.length) {
      report.rejected++;
      report.errors.push({ index, reasons: errors });
      return;
    }
    const item = {
      ...(raw as VocabularyRecord),
      german_word: (raw as VocabularyRecord).german_word
        .normalize("NFC")
        .trim(),
    };
    const key = vocabularyKey(item);
    const sameKey = byKey.get(key) ?? byExposure.get(exposureKey(item)) ?? -1;
    const sameId = byId.get(item.id) ?? -1;
    if (sameId >= 0 && sameKey !== sameId) {
      report.rejected++;
      report.errors.push({
        index,
        reasons: ["Kimlik başka bir anlam kaydıyla çakışıyor."],
      });
      return;
    }
    if (sameKey >= 0) {
      const old = records[sameKey];
      const merged = {
        ...item,
        id: old.id,
        sense_key: old.sense_key,
        created_at: old.created_at,
        levels: [...new Set([...old.levels, ...item.levels])],
        topics: [...new Set([...old.topics, ...item.topics])],
        unit_ids: [...new Set([...old.unit_ids, ...item.unit_ids])],
      };
      const comparable = (v: VocabularyRecord) =>
        JSON.stringify({ ...v, updated_at: "", created_at: "" });
      if (comparable(old) === comparable(merged)) {
        report.skipped++;
        return;
      }
      records[sameKey] = merged;
      byExposure.set(exposureKey(merged), sameKey);
      report.updated++;
    } else {
      byKey.set(key, records.length);
      byId.set(item.id, records.length);
      byExposure.set(exposureKey(item), records.length);
      records.push(item);
      report.inserted++;
    }
  });
  return { records, report };
}
