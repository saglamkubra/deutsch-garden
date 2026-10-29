import type { GardenState } from "../garden/model.ts";
import { grantReward } from "../garden/model.ts";
export type WelcomeContent = {
  recipientName: string;
  message: string;
  senderSignature: string;
};
export type WelcomeConfiguration = WelcomeContent & { enabled: boolean };
export type WelcomeRecord = {
  version: 1;
  viewedAt: number;
  content: WelcomeContent;
  giftPreviouslyOwned: boolean;
};
export type WelcomeStatus = {
  enabled: boolean;
  previewAvailable: boolean;
  accessRequired?: boolean;
  preview?: boolean;
  content?: WelcomeContent;
};
export const WELCOME_RECEIPT = "birthday:welcome-v1";
export const WELCOME_DECORATION = "birthday-arch";
const object = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const text = (x: unknown, max: number) =>
  typeof x === "string" &&
  x.length <= max &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(x);
export function validWelcomeContent(x: unknown): x is WelcomeContent {
  return (
    object(x) &&
    text(x.recipientName, 80) &&
    text(x.senderSignature, 80) &&
    text(x.message, 8000) &&
    String(x.message).trim().length > 0
  );
}
export function validWelcomeConfiguration(
  x: unknown,
): x is WelcomeConfiguration {
  return object(x) && typeof x.enabled === "boolean" && validWelcomeContent(x);
}
export function validWelcomeRecord(x: unknown): x is WelcomeRecord {
  return (
    object(x) &&
    x.version === 1 &&
    Number.isSafeInteger(x.viewedAt) &&
    Number(x.viewedAt) >= 0 &&
    validWelcomeContent(x.content) &&
    typeof x.giftPreviouslyOwned === "boolean"
  );
}
export function validWelcomeStatus(x: unknown): x is WelcomeStatus {
  return (
    object(x) &&
    typeof x.enabled === "boolean" &&
    typeof x.previewAvailable === "boolean" &&
    (x.accessRequired === undefined || typeof x.accessRequired === "boolean") &&
    (x.preview === undefined || typeof x.preview === "boolean") &&
    (x.content === undefined || validWelcomeContent(x.content)) &&
    (!(x.enabled && !x.accessRequired) || x.content !== undefined)
  );
}
export function shouldShowWelcome(
  status: WelcomeStatus | null,
  record: WelcomeRecord | undefined,
  path: string,
  ready: boolean,
  dismissed = false,
) {
  return (
    ready &&
    !dismissed &&
    !!status?.enabled &&
    !status.accessRequired &&
    !!status.content &&
    !record &&
    !excludedWelcomePath(path)
  );
}
export function excludedWelcomePath(path: string) {
  return (
    path === "/dogum-gunu" ||
    path === "/hediye-atolyesi" ||
    path === "/giris" ||
    path === "/kayit" ||
    path.startsWith("/hesap/")
  );
}
export function enterBirthdayGarden(
  state: GardenState,
  content: WelcomeContent,
  viewedAt: number,
): { state: GardenState; duplicate?: boolean; error?: string } {
  if (
    !validWelcomeContent(content) ||
    !Number.isSafeInteger(viewedAt) ||
    viewedAt < 0
  )
    return {
      state,
      error: "Karşılama kaydı doğrulanamadı; mevcut bahçen değişmedi.",
    };
  if (state.birthdayWelcome) return { state, duplicate: true };
  if (
    state.appliedRewards.includes(WELCOME_RECEIPT) &&
    !state.decorations.includes(WELCOME_DECORATION)
  )
    return {
      state,
      error:
        "Önceki hediye kaydı ile çantan uyuşmuyor. İkinci ödül verilmedi; veri yedeğini kontrol et.",
    };
  const previous = state.decorations.includes(WELCOME_DECORATION);
  const next = grantReward(state, {
    id: WELCOME_RECEIPT,
    source: "birthday",
    decorations: [WELCOME_DECORATION],
  });
  return {
    state: {
      ...next,
      revision: next === state ? state.revision + 1 : next.revision,
      birthdayWelcome: {
        version: 1,
        viewedAt,
        content: {
          recipientName: content.recipientName,
          message: content.message,
          senderSignature: content.senderSignature,
        },
        giftPreviouslyOwned: previous,
      },
    },
  };
}
