import { initialDiary, validDiary, type DiaryRecord } from "./model.ts";
export interface DiaryDisk {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function readDiary(disk: DiaryDisk, key: string): DiaryRecord {
  const raw = disk.getItem(key);
  if (raw === null) return initialDiary();
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw Error(
      "Cihazdaki günlük okunamadı. Mevcut verinin üzerine yazılmadı; önce yedeğini indir.",
    );
  }
  if (!validDiary(value))
    throw Error(
      "Günlük sürümü veya içeriği desteklenmiyor. Mevcut veri korundu.",
    );
  return value;
}
export function writeDiary(
  disk: DiaryDisk,
  key: string,
  next: DiaryRecord,
  revision: number,
) {
  if (!validDiary(next))
    throw Error("Günlük sınırı aşıldı; mevcut kayıt korundu.");
  if (readDiary(disk, key).revision !== revision)
    throw Error(
      "Günlük başka bir sekmede değişti. Metnini yedekleyip sayfayı yenile.",
    );
  disk.setItem(key, JSON.stringify(next));
}
