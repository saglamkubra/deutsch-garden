import { gardenDay } from "../garden/calendar.ts";
import type { GardenState } from "../garden/model.ts";
import { grantReward } from "../garden/model.ts";
export const BIRTHDAY_REWARD = {
  coins: 20,
  seeds: 1,
  flower: "birthday-star",
  decoration: "birthday-arch",
} as const;
export const DEFAULT_LETTER =
  "Bu küçük bahçe, yeni kelimeler öğrenirken sana eşlik etsin. Her çiçek sana kendi hızında büyümenin güzelliğini hatırlatsın.\n\nYeni yaşın; merakla, huzurla ve seni gülümseten küçük keşiflerle dolsun.\n\nİyi ki doğdun! 🌷";
export type BirthdayDraft = {
  date: string;
  recipientName: string;
  senderName: string;
  greeting: string;
  letter: string;
  showCountdown: boolean;
};
export type BirthdayConfig = BirthdayDraft & {
  version: 1;
  id: string;
  revision: number;
};
export type BirthdayMemory = { event: BirthdayConfig; openedAt: number };
export type BirthdayStatus = {
  state: "hidden" | "countdown" | "active" | "past";
  serverNow: number;
  date?: string;
  event?: BirthdayConfig;
  accessRequired?: boolean;
  authenticated?: boolean;
};
const object = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const text = (x: unknown, max: number) =>
  typeof x === "string" &&
  x.length <= max &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(x);
export function validBirthdayDate(x: unknown): x is string {
  if (typeof x !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(x)) return false;
  const d = new Date(x + "T00:00:00+03:00");
  return (
    Number.isFinite(d.getTime()) &&
    gardenDay(d.getTime()) === x &&
    Number(x.slice(0, 4)) >= 1970 &&
    Number(x.slice(0, 4)) <= 2200
  );
}
export function validDraft(x: unknown): x is BirthdayDraft {
  return (
    object(x) &&
    validBirthdayDate(x.date) &&
    text(x.recipientName, 80) &&
    text(x.senderName, 80) &&
    text(x.greeting, 300) &&
    text(x.letter, 8000) &&
    typeof x.showCountdown === "boolean"
  );
}
export function validConfig(x: unknown): x is BirthdayConfig {
  return (
    object(x) &&
    x.version === 1 &&
    typeof x.id === "string" &&
    /^[a-zA-Z0-9-]{8,80}$/.test(x.id) &&
    Number.isSafeInteger(x.revision) &&
    Number(x.revision) > 0 &&
    validDraft(x)
  );
}
export function publicBirthday(
  config: BirthdayConfig | null,
  now: number,
): BirthdayStatus {
  if (!config) return { state: "hidden", serverNow: now };
  const day = gardenDay(now);
  if (day < config.date)
    return config.showCountdown
      ? { state: "countdown", date: config.date, serverNow: now }
      : { state: "hidden", serverNow: now };
  return {
    state: day === config.date ? "active" : "past",
    serverNow: now,
    event: config,
  };
}
export function validMemory(x: unknown): x is BirthdayMemory {
  return (
    object(x) &&
    validConfig(x.event) &&
    Number.isSafeInteger(x.openedAt) &&
    Number(x.openedAt) >= 0 &&
    Number.isFinite(new Date(Number(x.openedAt)).getTime()) &&
    gardenDay(Number(x.openedAt)) >= x.event.date
  );
}
export function validMemories(x: unknown): x is BirthdayMemory[] {
  return (
    Array.isArray(x) &&
    x.length <= 100 &&
    x.every(validMemory) &&
    new Set(x.map((m) => m.event.id)).size === x.length
  );
}
export function receiveBirthday(
  state: GardenState,
  memory: BirthdayMemory,
): { state: GardenState; error?: string; duplicate?: boolean } {
  if (!validMemory(memory))
    return {
      state,
      error: "Doğum günü kaydı doğrulanamadı. Cihaz saatini kontrol et.",
    };
  const receipt = "birthday:" + memory.event.id;
  if (state.birthdayMemories?.some((m) => m.event.id === memory.event.id))
    return { state, duplicate: true };
  if (state.appliedRewards.includes(receipt))
    return {
      state,
      error:
        "Bu etkinliğin hediyesi zaten verilmiş; ikinci kez kaynak eklenmez.",
    };
  if ((state.birthdayMemories?.length ?? 0) >= 100)
    return {
      state,
      error: "Hatıra kayıt sınırına ulaşıldı; eski mektupların korunuyor.",
    };
  if (
    state.coins + BIRTHDAY_REWARD.coins > 999999 ||
    state.seeds["birthday-star"] + BIRTHDAY_REWARD.seeds > 9999
  )
    return {
      state,
      error:
        "Çantan veya cüzdanın dolu. Dükkânda ya da bahçede biraz yer açıp tekrar deneyebilirsin.",
    };
  const next = grantReward(state, {
    id: receipt,
    source: "birthday",
    coins: BIRTHDAY_REWARD.coins,
    seeds: { "birthday-star": BIRTHDAY_REWARD.seeds },
    flowers: ["birthday-star"],
    decorations: ["birthday-arch"],
  });
  return {
    state: {
      ...next,
      birthdayMemories: [...(state.birthdayMemories ?? []), memory],
    },
  };
}
export const BIRTHDAY_PHRASES = [
  { de: "Alles Gute zum Geburtstag!", tr: "Doğum günün kutlu olsun!" },
  { de: "Herzlichen Glückwunsch!", tr: "İçten tebrikler!" },
  {
    de: "Ich wünsche dir einen wunderschönen Tag!",
    tr: "Sana harika bir gün diliyorum!",
  },
] as const;
