import { initialLearning } from "./engine.ts";
import { LEVELS, type LearningState } from "./types.ts";
export const LEARNING_KEY = "deutsch-garden:learning:v1";
export type LearningStorage = Pick<Storage, "getItem" | "setItem">;
const object = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
const date = (x: unknown) =>
  typeof x === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(x) &&
  !Number.isNaN(Date.parse(x + "T12:00:00Z"));
const answer = (x: unknown) => x === "known" || x === "again";
export function validLearning(x: unknown): x is LearningState {
  if (
    !object(x) ||
    x.version !== 1 ||
    !Number.isSafeInteger(x.revision) ||
    (x.revision as number) < 0 ||
    !LEVELS.includes(x.level as never) ||
    ![5, 10, 15, 20].includes(x.goal as number) ||
    !object(x.progress) ||
    !object(x.assignments) ||
    !object(x.unitAnswers) ||
    !Array.isArray(x.milestones) ||
    !x.milestones.every((i) => typeof i === "string") ||
    !Array.isArray(x.outbox)
  )
    return false;
  if (
    !Object.entries(x.progress).every(
      ([id, p]) =>
        id.length > 0 &&
        object(p) &&
        date(p.introducedOn) &&
        date(p.dueOn) &&
        typeof p.known === "boolean" &&
        Number.isSafeInteger(p.streak) &&
        (p.streak as number) >= 0 &&
        Number.isSafeInteger(p.responses) &&
        (p.responses as number) >= 0 &&
        (p.lastAnsweredOn === null || date(p.lastAnsweredOn)),
    )
  )
    return false;
  if (
    !Object.entries(x.assignments).every(
      ([key, a]) =>
        object(a) &&
        a.id === key &&
        date(a.date) &&
        LEVELS.includes(a.level as never) &&
        key === a.date + ":" + a.level &&
        [5, 10, 15, 20].includes(a.goal as number) &&
        Array.isArray(a.newIds) &&
        a.newIds.every((id) => typeof id === "string") &&
        new Set(a.newIds).size === a.newIds.length &&
        a.newIds.length <= (a.goal as number) &&
        Array.isArray(a.reviewIds) &&
        a.reviewIds.every(
          (id) =>
            typeof id === "string" && !(a.newIds as string[]).includes(id),
        ) &&
        new Set(a.reviewIds).size === a.reviewIds.length &&
        object(a.answers) &&
        Object.entries(a.answers).every(
          ([id, value]) =>
            answer(value) &&
            [...(a.newIds as string[]), ...(a.reviewIds as string[])].includes(
              id,
            ),
        ),
    )
  )
    return false;
  if (
    !Object.values(x.unitAnswers).every(
      (a) => object(a) && Object.values(a).every(answer),
    )
  )
    return false;
  return (
    x.outbox.every(
      (r) =>
        object(r) &&
        typeof r.id === "string" &&
        r.id.length < 200 &&
        (r.kind === "seed" || r.kind === "coins") &&
        Number.isSafeInteger(r.amount) &&
        (r.amount as number) > 0 &&
        typeof r.delivered === "boolean",
    ) && new Set(x.outbox.map((r) => r.id)).size === x.outbox.length
  );
}
export interface LearningPersistence {
  load(): { state: LearningState; notice: string; readonly: boolean };
  save(state: LearningState): void;
}
export function createLearningPersistence(
  getStorage: () => LearningStorage,
): LearningPersistence {
  return {
    load() {
      try {
        const storage = getStorage();
        const raw = storage.getItem(LEARNING_KEY);
        if (!raw)
          return {
            state: initialLearning(),
            notice: "Kelime yolculuğun bu tarayıcıda saklanacak.",
            readonly: false,
          };
        let data: unknown;
        try {
          data = JSON.parse(raw);
        } catch {
          data = null;
        }
        if (
          object(data) &&
          typeof data.version === "number" &&
          data.version > 1
        )
          return {
            state: initialLearning(),
            notice:
              "Kayıt daha yeni bir sürüme ait. Verini korumak için öğrenme yanıtları kapalı.",
            readonly: true,
          };
        if (validLearning(data))
          return {
            state: data,
            notice: "Öğrenme kaydın geri yüklendi.",
            readonly: false,
          };
        try {
          if (!storage.getItem(LEARNING_KEY + ":corrupt"))
            storage.setItem(LEARNING_KEY + ":corrupt", raw);
        } catch {
          return {
            state: initialLearning(),
            notice: "Hasarlı kayıt korunamadı; veri değişikliği kapalı.",
            readonly: true,
          };
        }
        let backup: unknown;
        try {
          backup = JSON.parse(
            storage.getItem(LEARNING_KEY + ":backup") ?? "null",
          );
        } catch {
          backup = null;
        }
        return {
          state: validLearning(backup) ? backup : initialLearning(),
          notice: validLearning(backup)
            ? "Hasarlı kayıt korundu, son sağlam öğrenme yedeği yüklendi."
            : "Hasarlı kayıt korundu; yeni öğrenme kaydı hazırlandı.",
          readonly: false,
        };
      } catch {
        return {
          state: initialLearning(),
          notice:
            "Tarayıcı kaydı kullanılamıyor. İlerleme kaybolmasın diye yanıtlar kapalı.",
          readonly: true,
        };
      }
    },
    save(state) {
      if (!validLearning(state)) throw new Error("Öğrenme kaydı geçersiz.");
      const storage = getStorage();
      const previous = storage.getItem(LEARNING_KEY);
      if (previous) {
        let data: unknown;
        try {
          data = JSON.parse(previous);
        } catch {
          data = null;
        }
        if (
          object(data) &&
          typeof data.version === "number" &&
          data.version > 1
        )
          throw new Error("Yeni sürüm kaydı korunuyor.");
        if (validLearning(data))
          storage.setItem(LEARNING_KEY + ":backup", previous);
      }
      storage.setItem(LEARNING_KEY, JSON.stringify(state));
    },
  };
}
