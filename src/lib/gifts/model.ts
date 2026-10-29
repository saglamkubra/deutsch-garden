import type { GardenState } from "../garden/model.ts";
import { grantReward } from "../garden/model.ts";
import { gardenDay, nextGardenDay } from "../garden/calendar.ts";
import type { FlowerId, DecorationId } from "../garden/catalog.ts";
export type GiftClaim = {
  day: string;
  at: number;
  rewardId: string;
  coins: number;
  xp: number;
  seed: FlowerId | null;
  quantity: number;
  decoration: DecorationId | null;
  rare: boolean;
  xpDelivered: boolean;
};
export const GIFT_POOL = [
  {
    id: "coins",
    label: "10 bahçe parası",
    weight: 30,
    coins: 10,
    xp: 0,
    seed: null,
    quantity: 0,
    decoration: null,
    rare: false,
  },
  {
    id: "xp",
    label: "10 XP",
    weight: 18,
    coins: 0,
    xp: 10,
    seed: null,
    quantity: 0,
    decoration: null,
    rare: false,
  },
  {
    id: "daisy",
    label: "3 papatya tohumu",
    weight: 22,
    coins: 0,
    xp: 0,
    seed: "daisy",
    quantity: 3,
    decoration: null,
    rare: false,
  },
  {
    id: "lavender",
    label: "2 lavanta tohumu",
    weight: 12,
    coins: 0,
    xp: 0,
    seed: "lavender",
    quantity: 2,
    decoration: null,
    rare: false,
  },
  {
    id: "lantern",
    label: "Yıldız Feneri süsü",
    weight: 8,
    coins: 0,
    xp: 0,
    seed: null,
    quantity: 0,
    decoration: "lantern",
    rare: false,
  },
  {
    id: "moon",
    label: "2 ay ışığı tohumu",
    weight: 6,
    coins: 0,
    xp: 0,
    seed: "moonflower",
    quantity: 2,
    decoration: null,
    rare: true,
  },
  {
    id: "starlily",
    label: "1 yıldız zambağı tohumu",
    weight: 4,
    coins: 0,
    xp: 0,
    seed: "starlily",
    quantity: 1,
    decoration: null,
    rare: true,
  },
] as const;
export function giftStatus(state: GardenState, now: number) {
  const today = gardenDay(now),
    claims = state.dailyGifts ?? [],
    last = claims.at(-1);
  return {
    today,
    claimed: claims.find((c) => c.day === today) ?? null,
    available: !last || last.day < today,
    nextAt: Math.max(
      nextGardenDay(now),
      last ? Date.parse(last.day + "T00:00:00+03:00") + 86400000 : 0,
    ),
    count: claims.length,
  };
}
export function claimGift(
  state: GardenState,
  now: number,
  random: number,
): {
  state: GardenState;
  claim?: GiftClaim;
  error?: string;
  duplicate?: boolean;
} {
  if (
    !Number.isSafeInteger(now) ||
    now < state.createdAt ||
    !Number.isFinite(new Date(now).getTime()) ||
    !Number.isFinite(random) ||
    random < 0 ||
    random >= 1
  )
    return {
      state,
      error: "Hediye isteği doğrulanamadı. Cihaz saatini kontrol et.",
    };
  const status = giftStatus(state, now);
  if (status.claimed) return { state, claim: status.claimed, duplicate: true };
  if (!status.available)
    return {
      state,
      error:
        "Yeni bir hediye için kayıtlı son hediye gününün geçmesi gerekiyor. Cihaz saatini kontrol et.",
    };
  if (status.count >= 3650)
    return {
      state,
      error: "Hediye kayıt sınırına ulaşıldı. Eski kayıtların korunuyor.",
    };
  const id = "gift:daily:" + status.today;
  if (state.appliedRewards.includes(id))
    return {
      state,
      error:
        "Bugünün hediye makbuzu zaten kayıtlı; ikinci kez hediye verilemez.",
    };
  let cursor = random * 100;
  let selected: (typeof GIFT_POOL)[number] = GIFT_POOL[0];
  for (const item of GIFT_POOL) {
    cursor -= item.weight;
    if (cursor < 0) {
      selected = item;
      break;
    }
  }
  const claim: GiftClaim = {
    day: status.today,
    at: now,
    rewardId: selected.id,
    coins: selected.coins,
    xp: selected.xp,
    seed: selected.seed,
    quantity: selected.quantity,
    decoration: selected.decoration,
    rare: selected.rare,
    xpDelivered: selected.xp === 0,
  };
  // Every seventh claimed box guarantees a special seed, without consecutive-day pressure.
  if ((status.count + 1) % 7 === 0)
    Object.assign(claim, {
      rewardId: "seventh-special",
      coins: 0,
      xp: 0,
      seed: Math.floor((status.count + 1) / 7) % 2 ? "starlily" : "forgetmenot",
      quantity: 1,
      decoration: null,
      rare: true,
      xpDelivered: true,
    });
  if (claim.decoration && state.decorations.includes(claim.decoration))
    Object.assign(claim, {
      rewardId: "owned-decoration-coins",
      decoration: null,
      coins: 10,
    });
  if (claim.seed && state.seeds[claim.seed] + claim.quantity > 9999)
    return {
      state,
      error:
        "Bu tohum türü için çantan dolu. Bir tohum ekip hediyeni yeniden açabilirsin.",
    };
  if (state.coins + claim.coins > 999999)
    return {
      state,
      error: "Bahçe cüzdanın dolu. Önce dükkânda biraz yer açabilirsin.",
    };
  const next = grantReward(state, {
    id,
    source: "gift",
    coins: claim.coins,
    ...(claim.seed
      ? { seeds: { [claim.seed]: claim.quantity }, flowers: [claim.seed] }
      : {}),
    ...(claim.decoration ? { decorations: [claim.decoration] } : {}),
  });
  return {
    state: { ...next, dailyGifts: [...(state.dailyGifts ?? []), claim] },
    claim,
  };
}
export function validGiftClaims(
  value: unknown,
  createdAt: number,
): value is GiftClaim[] {
  if (!Array.isArray(value) || value.length > 3650) return false;
  let last = "";
  return value.every((c) => {
    if (
      !c ||
      typeof c !== "object" ||
      typeof c.day !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(c.day) ||
      c.day <= last ||
      !Number.isSafeInteger(c.at) ||
      c.at < createdAt ||
      !Number.isFinite(new Date(c.at).getTime()) ||
      gardenDay(c.at) !== c.day ||
      typeof c.xpDelivered !== "boolean" ||
      typeof c.rare !== "boolean"
    )
      return false;
    last = c.day;
    const base = GIFT_POOL.find((p) => p.id === c.rewardId);
    if (base)
      return (
        c.coins === base.coins &&
        c.xp === base.xp &&
        c.seed === base.seed &&
        c.quantity === base.quantity &&
        c.decoration === base.decoration &&
        c.rare === base.rare &&
        (c.xp > 0 || c.xpDelivered)
      );
    if (c.rewardId === "owned-decoration-coins")
      return (
        c.coins === 10 &&
        c.xp === 0 &&
        c.seed === null &&
        c.quantity === 0 &&
        c.decoration === null &&
        !c.rare &&
        c.xpDelivered
      );
    return (
      c.rewardId === "seventh-special" &&
      c.coins === 0 &&
      c.xp === 0 &&
      ["starlily", "forgetmenot"].includes(c.seed) &&
      c.quantity === 1 &&
      c.decoration === null &&
      c.rare &&
      c.xpDelivered
    );
  });
}
