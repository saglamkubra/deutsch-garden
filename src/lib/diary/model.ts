export const DIARY_KEY = "deutsch-garden:diary:v1";
export const DIARY_CLEARED = "deutsch-garden:diary-cleared";
export const MAX_CONTENT = 20_000;
export const MAX_ENTRIES = 500;
export type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
export type DiaryDraft = {
  id: string;
  title: string;
  content: string;
  baseUpdatedAt: string | null;
  createdAt: string | null;
};
export type DiaryRecord = {
  version: 1;
  revision: number;
  entries: DiaryEntry[];
  draft: DiaryDraft | null;
};
export const initialDiary = (): DiaryRecord => ({
  version: 1,
  revision: 0,
  entries: [],
  draft: null,
});
export const uuid = (s: unknown): s is string =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s,
  );
const object = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const date = (x: unknown): x is string =>
  typeof x === "string" &&
  /^\d{4}-\d\d-\d\dT/.test(x) &&
  Number.isFinite(Date.parse(x));
const text = (x: unknown, max: number): x is string =>
  typeof x === "string" && x.length <= max && !x.includes("\u0000");
export function validEntry(x: unknown): x is DiaryEntry {
  return (
    object(x) &&
    uuid(x.id) &&
    text(x.title, 200) &&
    text(x.content, MAX_CONTENT) &&
    !!x.content.trim() &&
    date(x.createdAt) &&
    date(x.updatedAt) &&
    Date.parse(x.updatedAt) >= Date.parse(x.createdAt)
  );
}
export function validDraft(x: unknown): x is DiaryDraft {
  return (
    object(x) &&
    uuid(x.id) &&
    text(x.title, 200) &&
    text(x.content, MAX_CONTENT) &&
    (x.baseUpdatedAt === null || date(x.baseUpdatedAt)) &&
    (x.createdAt === null || date(x.createdAt))
  );
}
export function validDiary(x: unknown): x is DiaryRecord {
  return (
    object(x) &&
    x.version === 1 &&
    Number.isSafeInteger(x.revision) &&
    Number(x.revision) >= 0 &&
    Array.isArray(x.entries) &&
    x.entries.length <= MAX_ENTRIES &&
    x.entries.every(validEntry) &&
    new Set(x.entries.map((e) => e.id)).size === x.entries.length &&
    (x.draft === null || validDraft(x.draft)) &&
    JSON.stringify(x).length <= 1_500_000
  );
}
export function newDraft(id: string): DiaryDraft {
  if (!uuid(id)) throw Error("Yazı kimliği hazırlanamadı.");
  return { id, title: "", content: "", baseUpdatedAt: null, createdAt: null };
}
export const editDraft = (e: DiaryEntry): DiaryDraft => ({
  id: e.id,
  title: e.title,
  content: e.content,
  createdAt: e.createdAt,
  baseUpdatedAt: e.updatedAt,
});
export function entryFromDraft(draft: DiaryDraft, now: number): DiaryEntry {
  if (!validDraft(draft) || !draft.content.trim())
    throw Error("Kaydetmeden önce bir şeyler yaz.");
  const next = Math.max(
    now,
    draft.baseUpdatedAt ? Date.parse(draft.baseUpdatedAt) + 1 : 0,
  );
  const entry = {
    id: draft.id,
    title: draft.title.trim(),
    content: draft.content.trim(),
    createdAt: draft.createdAt ?? new Date(next).toISOString(),
    updatedAt: new Date(next).toISOString(),
  };
  if (!validEntry(entry))
    throw Error("Başlık veya metin sınırı aşıldı; yazın değiştirilmedi.");
  return entry;
}
export function putGuest(
  record: DiaryRecord,
  entry: DiaryEntry,
  expected: string | null,
): DiaryRecord {
  if (!validEntry(entry)) throw Error("Günlük kaydı doğrulanamadı.");
  const old = record.entries.find((e) => e.id === entry.id);
  if ((old?.updatedAt ?? null) !== expected)
    throw Error(
      "Bu yazı başka bir yerde değişti. Taslağın korunuyor; güncel kaydı yeniden yükle.",
    );
  const next = {
    ...record,
    revision: record.revision + 1,
    entries: [entry, ...record.entries.filter((e) => e.id !== entry.id)],
    draft: null,
  };
  if (!validDiary(next))
    throw Error(
      "Bu cihazdaki günlük alanı doldu. Önce yedeğini indir; mevcut yazılar korunuyor.",
    );
  return next;
}
export function removeGuest(
  record: DiaryRecord,
  entry: DiaryEntry,
): DiaryRecord {
  const old = record.entries.find((e) => e.id === entry.id);
  if (!old) return record;
  if (old.updatedAt !== entry.updatedAt)
    throw Error(
      "Yazı başka bir yerde değişti; silmeden önce güncel kaydı kontrol et.",
    );
  return {
    ...record,
    revision: record.revision + 1,
    entries: record.entries.filter((e) => e.id !== entry.id),
    draft: record.draft?.id === entry.id ? null : record.draft,
  };
}
export const wordCount = (s: string) =>
  s.match(/\p{L}+(?:['’\-]\p{L}+)*/gu)?.length ?? 0;
const fold = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ß/g, "ss");
export function filterDiary(
  entries: DiaryEntry[],
  query: string,
  month: string,
) {
  const q = fold(query.trim());
  return entries
    .filter(
      (e) =>
        (!q || fold(e.title + " " + e.content).includes(q)) &&
        (!month || e.createdAt.startsWith(month)),
    )
    .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
