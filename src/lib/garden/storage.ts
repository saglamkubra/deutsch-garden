import {
  FLOWERS,
  DECORATIONS,
  GARDEN_CONFIG as config,
  WORLDS,
} from "./catalog.ts";
import { validMemories } from "../birthday/model.ts";
import {
  validWelcomeRecord,
  WELCOME_RECEIPT,
  WELCOME_DECORATION,
} from "../birthday/welcome-model.ts";
import { validGiftClaims } from "../gifts/model.ts";
import { validPurchases } from "../shop/model.ts";
import { createStarter } from "./model.ts";
import type { GardenState } from "./model.ts";
import { isWorld, gardenAreas, flowerLocations, allPlots } from "./worlds.ts";
export const GARDEN_KEY = "deutsch-garden:garden:v1";
export type KeyValueStorage = Pick<Storage, "getItem" | "setItem">;
export interface GardenStorage {
  load(now: number): LoadResult;
  save(state: GardenState): void;
}
export type LoadResult = {
  state: GardenState;
  mode: "local" | "memory" | "readonly";
  notice: string;
};
const record = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
const integer = (
  x: unknown,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
): x is number =>
  typeof x === "number" && Number.isSafeInteger(x) && x >= min && x <= max;
const uniqueIds = (x: unknown, ids: readonly string[]): x is string[] =>
  Array.isArray(x) &&
  x.every((id) => typeof id === "string" && ids.includes(id)) &&
  new Set(x).size === x.length;
export function validateGarden(x: unknown): x is GardenState {
  if (
    !record(x) ||
    x.version !== 1 ||
    !integer(x.revision) ||
    !integer(x.createdAt) ||
    !integer(x.coins, 0, 999999) ||
    typeof x.muted !== "boolean"
  )
    return false;
  const flowerIds = FLOWERS.map((f) => f.id);
  if (
    x.birthdayWelcome !== undefined &&
    (!validWelcomeRecord(x.birthdayWelcome) ||
      !Array.isArray(x.appliedRewards) ||
      !x.appliedRewards.includes(WELCOME_RECEIPT) ||
      !Array.isArray(x.decorations) ||
      !x.decorations.includes(WELCOME_DECORATION))
  )
    return false;
  if (
    x.birthdayMemories !== undefined &&
    (!validMemories(x.birthdayMemories) ||
      !Array.isArray(x.appliedRewards) ||
      x.birthdayMemories.some(
        (m) =>
          !(x.appliedRewards as string[]).includes("birthday:" + m.event.id),
      ))
  )
    return false;
  if (
    x.collection !== undefined &&
    (!record(x.collection) ||
      Object.entries(x.collection).some(
        ([id, c]) =>
          !flowerIds.includes(id as never) ||
          !record(c) ||
          !integer(c.quantity, 1, 999999) ||
          !integer(c.firstHarvestedAt, x.createdAt as number) ||
          !integer(c.lastHarvestedAt, c.firstHarvestedAt as number),
      ))
  )
    return false;
  if (x.flowerPlacements !== undefined) {
    if (
      !Array.isArray(x.flowerPlacements) ||
      x.flowerPlacements.length !== config.decorationSlots ||
      x.flowerPlacements.some(
        (id) =>
          id !== null &&
          (!flowerIds.includes(id as never) ||
            !record(x.collection) ||
            !record(x.collection[id as string])),
      )
    )
      return false;
    for (const id of flowerIds)
      if (
        x.flowerPlacements.filter((p) => p === id).length >
        Number(
          (x.collection as Record<string, { quantity: number }> | undefined)?.[
            id
          ]?.quantity ?? 0,
        )
      )
        return false;
  }
  if (
    x.dailyGifts !== undefined &&
    (!validGiftClaims(x.dailyGifts, x.createdAt as number) ||
      !Array.isArray(x.appliedRewards) ||
      x.dailyGifts.some(
        (c) => !(x.appliedRewards as string[]).includes("gift:daily:" + c.day),
      ))
  )
    return false;
  if (x.learningGarden !== undefined) {
    const c = x.learningGarden;
    if (
      !record(c) ||
      typeof c.day !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(c.day) ||
      !integer(c.dailyBoosts, 0, 6) ||
      !integer(c.totalActivities, 0, 999999) ||
      !uniqueIds(c.milestones, ["starlily", "forgetmenot"])
    )
      return false;
  }
  if (
    x.purchases !== undefined &&
    !validPurchases(x.purchases, x.createdAt as number)
  )
    return false;
  if (
    !record(x.seeds) ||
    !FLOWERS.every((f) =>
      integer((x.seeds as Record<string, unknown>)[f.id], 0, 9999),
    )
  )
    return false;
  if (
    !uniqueIds(
      x.unlockedFlowers,
      FLOWERS.map((f) => f.id),
    ) ||
    !uniqueIds(
      x.decorations,
      DECORATIONS.map((d) => d.id),
    ) ||
    !uniqueIds(
      x.unlockedWorlds,
      WORLDS.map((w) => w.id),
    )
  )
    return false;
  if (
    !Array.isArray(x.appliedRewards) ||
    !x.appliedRewards.every(
      (r) => typeof r === "string" && r.length > 0 && r.length <= 200,
    ) ||
    new Set(x.appliedRewards).size !== x.appliedRewards.length ||
    !x.appliedRewards.includes("starter-v1")
  )
    return false;
  if (
    !Array.isArray(x.placements) ||
    x.placements.length !== config.decorationSlots ||
    !x.placements.every(
      (d) =>
        d === null ||
        (typeof d === "string" && (x.decorations as string[]).includes(d)),
    )
  )
    return false;
  const placed = x.placements.filter((d) => d !== null);
  if (new Set(placed).size !== placed.length) return false;
  if (!Array.isArray(x.plots) || x.plots.length !== config.plotCount)
    return false;
  const plotsValid = x.plots.every((p, i) => {
    if (!record(p) || p.id !== i) return false;
    if (p.plant === null) return true;
    const plant = p.plant;
    if (
      !record(plant) ||
      !FLOWERS.some((f) => f.id === plant.species) ||
      !(x.unlockedFlowers as string[]).includes(plant.species as string) ||
      !integer(plant.plantedAt, x.createdAt as number) ||
      !integer(plant.waterCount, 0, config.maxWaterings)
    )
      return false;
    if (
      (plant.id !== undefined &&
        (typeof plant.id !== "string" ||
          !/^[a-zA-Z0-9-]{1,120}$/.test(plant.id))) ||
      (plant.learningBonusMs !== undefined &&
        !integer(plant.learningBonusMs, 0, 30000))
    )
      return false;
    if (
      plant.waterCount === 0
        ? plant.lastWateredAt !== null
        : !integer(plant.lastWateredAt, plant.plantedAt as number)
    )
      return false;
    return (
      plant.bloomedAt === null ||
      integer(plant.bloomedAt, plant.plantedAt as number)
    );
  });
  if (!plotsValid) return false;
  if (
    x.activeWorld !== undefined &&
    (!isWorld(x.activeWorld) ||
      !(x.unlockedWorlds as string[]).includes(x.activeWorld))
  )
    return false;
  if (x.worldGardens !== undefined) {
    if (!record(x.worldGardens)) return false;
    for (const [world, area] of Object.entries(x.worldGardens)) {
      if (
        world === "a1" ||
        !isWorld(world) ||
        !(x.unlockedWorlds as string[]).includes(world) ||
        !record(area) ||
        Object.keys(area).some(
          (k) => !["plots", "placements", "flowerPlacements"].includes(k),
        )
      )
        return false;
      if (
        !validateGarden({
          ...x,
          ...area,
          worldGardens: undefined,
          activeWorld: undefined,
        })
      )
        return false;
    }
    const state = x as unknown as GardenState;
    const decorations = gardenAreas(state).flatMap(({ area }) =>
      area.placements.filter(Boolean),
    );
    if (new Set(decorations).size !== decorations.length) return false;
    for (const id of flowerIds)
      if (
        flowerLocations(state, id).length >
        (state.collection?.[id]?.quantity ?? 0)
      )
        return false;
    const plantIds = allPlots(state).flatMap((p) =>
      p.plant?.id ? [p.plant.id] : [],
    );
    if (new Set(plantIds).size !== plantIds.length) return false;
  }
  if (
    x.activeWorld &&
    x.activeWorld !== "a1" &&
    (!record(x.worldGardens) || !x.worldGardens[x.activeWorld as string])
  )
    return false;
  return true;
}
export function parseGardenRecord(raw: string | null): unknown {
  try {
    const data = raw ? JSON.parse(raw) : null;
    // Add only newly introduced zero-count seeds; never refill old inventories.
    if (record(data) && data.version === 1 && record(data.seeds)) {
      for (const id of [
        "moonflower",
        "royal",
        "starlily",
        "forgetmenot",
        "birthday-star",
      ])
        if (!(id in data.seeds)) data.seeds[id] = 0;
    }
    return data;
  } catch {
    return null;
  }
}
export function createLocalGardenStorage(
  getStorage: () => KeyValueStorage,
): GardenStorage {
  return {
    load(now) {
      let storage: KeyValueStorage;
      try {
        storage = getStorage();
        const raw = storage.getItem(GARDEN_KEY);
        if (raw === null)
          return {
            state: createStarter(now),
            mode: "local",
            notice:
              "Başlangıç çantan hazır: 12 tohum, 5 süs ve 30 bahçe parası! Bunlar yerel oyunun başlangıç kaynakları.",
          };
        const data = parseGardenRecord(raw);
        if (
          record(data) &&
          integer(data.version) &&
          data.version > config.version
        )
          return {
            state: createStarter(now),
            mode: "readonly",
            notice:
              "Bu kayıt daha yeni bir bahçe sürümüne ait. Kaydını korumak için bu sürümde değişiklik kapalı.",
          };
        if (validateGarden(data))
          return {
            state: data,
            mode: "local",
            notice: "Bahçen bu tarayıcıdan geri yüklendi. Hoş geldin!",
          };
        const backup = parseGardenRecord(
          storage.getItem(GARDEN_KEY + ":backup"),
        );
        // Keep the damaged raw snapshot for recovery; never erase it silently.
        try {
          if (storage.getItem(GARDEN_KEY + ":corrupt") === null)
            storage.setItem(GARDEN_KEY + ":corrupt", raw);
        } catch {
          return {
            state: validateGarden(backup) ? backup : createStarter(now),
            mode: "readonly",
            notice:
              "Kayıt hasarlı ve güvenli kopyası saklanamadı. Eski veriyi korumak için değişiklik kapalı.",
          };
        }
        return {
          state: validateGarden(backup) ? backup : createStarter(now),
          mode: "local",
          notice: validateGarden(backup)
            ? "Hasarlı kayıt korundu; son sağlam yedek geri yüklendi. Son işlemin eksik olabilir."
            : "Hasarlı kayıt kurtarma kopyasında korundu. Yeni bir başlangıç çantası hazırlandı.",
        };
      } catch {
        return {
          state: createStarter(now),
          mode: "memory",
          notice:
            "Tarayıcı kaydına erişilemiyor. Bu oturumda oynayabilirsin; sayfa kapanınca değişiklikler korunmayabilir.",
        };
      }
    },
    save(state) {
      if (!validateGarden(state)) throw new Error("Bahçe kaydı doğrulanamadı.");
      const storage = getStorage();
      const old = storage.getItem(GARDEN_KEY);
      const existing = parseGardenRecord(old);
      if (record(existing) && integer(existing.version) && existing.version > 1)
        throw new Error("Daha yeni sürüm kaydı korunuyor.");
      if (old && validateGarden(existing))
        storage.setItem(GARDEN_KEY + ":backup", old);
      storage.setItem(GARDEN_KEY, JSON.stringify(state));
    },
  };
}
