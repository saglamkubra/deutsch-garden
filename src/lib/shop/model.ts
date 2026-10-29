import type { GardenState } from "../garden/model.ts";
import { LEVELS, type Level } from "../learning/types.ts";
import { productById, type ShopProduct } from "./catalog.ts";
export type ShopTransaction = {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  before: number;
  after: number;
  at: number;
};
export const MAX_PURCHASES = 1000;
export function shopAvailability(
  state: GardenState,
  product: ShopProduct,
  level: Level,
) {
  if (!product.available) return "Bu ürün şu anda satışa açık değil.";
  if (
    LEVELS.indexOf(level) < 0 ||
    LEVELS.indexOf(level) < LEVELS.indexOf(product.level)
  )
    return `${product.level} düzeyinde açılır.`;
  if (
    product.inventory.kind === "decoration" &&
    state.decorations.includes(product.inventory.decoration)
  )
    return "Bu süs zaten senin; yeniden satın alman gerekmiyor.";
  if (
    product.inventory.kind === "seed" &&
    state.seeds[product.inventory.flower] + product.inventory.quantity > 9999
  )
    return "Tohum çantan bu tür için dolu.";
  if ((state.purchases?.length ?? 0) >= MAX_PURCHASES)
    return "Satın alma kayıt sınırına ulaşıldı; yeni işlem yapılamıyor.";
  if (state.coins < product.price)
    return `Bu ürün için ${product.price - state.coins} bahçe parası daha gerekiyor.`;
  return "";
}
export function purchaseItem(
  state: GardenState,
  productId: string,
  transactionId: string,
  level: Level,
  now: number,
): { state: GardenState; error?: string; duplicate?: boolean } {
  if (
    !/^[a-zA-Z0-9-]{8,80}$/.test(transactionId) ||
    !Number.isSafeInteger(now) ||
    now < state.createdAt
  )
    return { state, error: "Satın alma isteği doğrulanamadı." };
  const previous = state.purchases?.find((p) => p.id === transactionId);
  if (previous)
    return previous.productId === productId
      ? { state, duplicate: true }
      : { state, error: "Bu işlem kimliği başka bir üründe kullanılmış." };
  const product = productById(productId);
  if (!product) return { state, error: "Ürün katalogda bulunamadı." };
  const error = shopAvailability(state, product, level);
  if (error) return { state, error };
  const inventory = product.inventory;
  const after = state.coins - product.price;
  const next: GardenState = {
    ...state,
    revision: state.revision + 1,
    coins: after,
    purchases: [
      ...(state.purchases ?? []),
      {
        id: transactionId,
        productId,
        price: product.price,
        quantity: inventory.kind === "seed" ? inventory.quantity : 1,
        before: state.coins,
        after,
        at: now,
      },
    ],
  };
  if (inventory.kind === "seed") {
    next.seeds = {
      ...state.seeds,
      [inventory.flower]: state.seeds[inventory.flower] + inventory.quantity,
    };
    next.unlockedFlowers = [
      ...new Set([...state.unlockedFlowers, inventory.flower]),
    ];
  } else next.decorations = [...state.decorations, inventory.decoration];
  return { state: next };
}
export function validPurchases(
  value: unknown,
  createdAt: number,
): value is ShopTransaction[] {
  if (!Array.isArray(value) || value.length > MAX_PURCHASES) return false;
  const ids = new Set<string>();
  return value.every((p) => {
    if (
      !p ||
      typeof p !== "object" ||
      typeof p.id !== "string" ||
      !/^[a-zA-Z0-9-]{8,80}$/.test(p.id) ||
      ids.has(p.id)
    )
      return false;
    ids.add(p.id);
    const product = productById(p.productId);
    return (
      !!product &&
      Number.isSafeInteger(p.price) &&
      p.price > 0 &&
      Number.isSafeInteger(p.before) &&
      p.before <= 999999 &&
      Number.isSafeInteger(p.after) &&
      p.after >= 0 &&
      p.before - p.after === p.price &&
      p.quantity ===
        (product.inventory.kind === "seed" ? product.inventory.quantity : 1) &&
      Number.isSafeInteger(p.at) &&
      p.at >= createdAt
    );
  });
}
