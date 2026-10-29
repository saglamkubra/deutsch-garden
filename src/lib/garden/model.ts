import {
  FLOWERS,
  DECORATIONS,
  GARDEN_CONFIG as config,
  flowerById,
  WORLDS,
  STARTER_DECORATION_IDS,
} from "./catalog.ts";
import { applyLearningCare } from "./learning-care.ts";
import type { FlowerId, DecorationId, WorldId } from "./catalog.ts";
import {
  areaOf,
  setArea,
  emptyArea,
  isWorld,
  gardenAreas,
  flowerLocations,
  type GardenArea,
} from "./worlds.ts";
export type GrowthStage = "seed" | "sprout" | "growing" | "bud" | "bloom";
export type Plant = {
  id?: string;
  learningBonusMs?: number;
  species: FlowerId;
  plantedAt: number;
  lastWateredAt: number | null;
  waterCount: number;
  bloomedAt: number | null;
};
export type Plot = { id: number; plant: Plant | null };
export type GardenState = {
  version: 1;
  revision: number;
  createdAt: number;
  plots: Plot[];
  seeds: Record<FlowerId, number>;
  coins: number;
  unlockedFlowers: FlowerId[];
  decorations: DecorationId[];
  placements: (DecorationId | null)[];
  unlockedWorlds: WorldId[];
  appliedRewards: string[];
  muted: boolean;
  activeWorld?: WorldId;
  worldGardens?: Partial<Record<Exclude<WorldId, "a1">, GardenArea>>;
  collection?: Partial<
    Record<
      FlowerId,
      { quantity: number; firstHarvestedAt: number; lastHarvestedAt: number }
    >
  >;
  flowerPlacements?: (FlowerId | null)[];
  birthdayMemories?: import("../birthday/model.ts").BirthdayMemory[];
  birthdayWelcome?: import("../birthday/welcome-model.ts").WelcomeRecord;
  dailyGifts?: import("../gifts/model.ts").GiftClaim[];
  learningGarden?: {
    day: string;
    dailyBoosts: number;
    totalActivities: number;
    milestones: FlowerId[];
  };
  purchases?: import("../shop/model.ts").ShopTransaction[];
};
export function createStarter(now: number): GardenState {
  return {
    version: 1,
    revision: 0,
    createdAt: now,
    plots: Array.from({ length: config.plotCount }, (_, id) => ({
      id,
      plant: null,
    })),
    seeds: Object.fromEntries(
      FLOWERS.map((f) => [f.id, f.starterSeeds]),
    ) as Record<FlowerId, number>,
    coins: 30,
    unlockedFlowers: FLOWERS.filter((f) => f.starterSeeds > 0).map((f) => f.id),
    decorations: [...STARTER_DECORATION_IDS],
    placements: Array(config.decorationSlots).fill(null),
    unlockedWorlds: ["a1"],
    appliedRewards: ["starter-v1"],
    muted: true,
  };
}
export function growth(plant: Plant, now: number) {
  const duration = flowerById(plant.species).durationMs;
  const bonus = Math.min(
    duration,
    plant.waterCount * config.wateringBonusMs + (plant.learningBonusMs ?? 0),
  );
  const readyAt = plant.plantedAt + duration - bonus;
  const elapsed = Math.max(0, now - plant.plantedAt) + bonus;
  const progress = Math.min(1, elapsed / duration);
  const stage: GrowthStage =
    progress >= 1
      ? "bloom"
      : progress >= 0.8
        ? "bud"
        : progress >= 0.5
          ? "growing"
          : progress >= 0.2
            ? "sprout"
            : "seed";
  return { stage, progress, readyAt, remainingMs: Math.max(0, readyAt - now) };
}
export function watering(plant: Plant, now: number) {
  const cooldown =
    plant.lastWateredAt === null
      ? 0
      : Math.max(0, plant.lastWateredAt + config.wateringCooldownMs - now);
  if (growth(plant, now).stage === "bloom")
    return {
      allowed: false,
      remainingMs: 0,
      reason: "Bu çiçek açtı; artık suya ihtiyacı yok.",
    };
  if (plant.waterCount >= config.maxWaterings)
    return {
      allowed: false,
      remainingMs: 0,
      reason: "Bu çiçeğin iki sulama hakkı kullanıldı.",
    };
  return {
    allowed: cooldown === 0,
    remainingMs: cooldown,
    reason:
      cooldown > 0 ? "Birazdan yeniden sulayabilirsin." : "Sulamaya hazır.",
  };
}
export const stageNames: Record<GrowthStage, string> = {
  seed: "Tohum",
  sprout: "Minik filiz",
  growing: "Büyüyen bitki",
  bud: "Tomurcuk",
  bloom: "Çiçek açtı",
};
export function formatTime(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return seconds >= 60
    ? `${Math.floor(seconds / 60)} dk. ${seconds % 60} sn.`
    : `${seconds} sn.`;
}
export const plantKey = (plant: Plant, plotId: number) =>
  plant.id ?? `legacy-${plotId}-${plant.species}-${plant.plantedAt}`;
type AreaCommand =
  | { type: "harvest"; plotId: number; plantKey: string }
  | {
      type: "display-flower";
      species: FlowerId;
      slot: number;
      from?: number;
      fromWorld?: WorldId;
    }
  | { type: "remove-flower"; slot: number }
  | { type: "plant"; plotId: number; species: FlowerId }
  | { type: "water"; plotId: number }
  | { type: "place"; decoration: DecorationId; slot: number }
  | { type: "remove"; slot: number }
  | { type: "mute"; value: boolean }
  | { type: "reconcile" };
export type GardenCommand =
  (AreaCommand & { world?: WorldId }) | { type: "visit-world"; world: WorldId };
export type GardenEvent =
  | "harvested"
  | "planted"
  | "watered"
  | "decorated"
  | "removed"
  | "bloomed"
  | "muted"
  | "unlocked";
export type CommandResult = {
  state: GardenState;
  event?: GardenEvent;
  message?: string;
  error?: string;
  plotId?: number;
};
const error = (state: GardenState, message: string): CommandResult => ({
  state,
  error: message,
});
export function applyCommand(
  state: GardenState,
  command: GardenCommand,
  now: number,
): CommandResult {
  if (!Number.isFinite(now) || now < state.createdAt)
    return error(state, "Cihaz saatini kontrol edip yeniden dene.");
  if (command.type === "visit-world") {
    if (!isWorld(command.world))
      return error(state, "Bu bahçe dünyası bulunamadı.");
    if ((state.activeWorld ?? "a1") === command.world) return { state };
    const visited =
      command.world === "a1"
        ? state
        : setArea(
            state,
            command.world,
            state.worldGardens?.[command.world] ?? emptyArea(),
          );
    return {
      state: {
        ...visited,
        activeWorld: command.world,
        revision: state.revision + 1,
        unlockedWorlds: [...new Set([...state.unlockedWorlds, command.world])],
      },
      message: `${WORLDS.find((w) => w.id === command.world)!.name} bahçene hoş geldin! Çantan ve diğer bahçelerin korunuyor.`,
      event: "unlocked",
    };
  }
  if (command.type === "mute") return applyAreaCommand(state, command, now);
  if (command.type === "reconcile") {
    let next = state,
      changed = false;
    for (const { world, area } of gardenAreas(state)) {
      const view = { ...state, ...area };
      const result = applyAreaCommand(view, command, now);
      if (result.state !== view) {
        next = setArea(next, world, {
          plots: result.state.plots,
          placements: area.placements,
          flowerPlacements: area.flowerPlacements,
        });
        changed = true;
      }
    }
    return changed
      ? {
          state: { ...next, revision: state.revision + 1 },
          event: "bloomed",
          message:
            "Bahçelerinde yeni çiçekler açtı! Hazır çiçeklerini koleksiyonuna alabilirsin. 🌸",
        }
      : { state };
  }
  const world = command.world ?? "a1";
  if (!isWorld(world) || (world !== "a1" && !state.worldGardens?.[world]))
    return error(state, "Önce bu bahçeyi dünya seçicisinden açmalısın.");
  let base = state;
  let localCommand: AreaCommand = command;
  if (command.type === "display-flower") {
    const fromWorld = command.fromWorld ?? world;
    if (command.fromWorld !== undefined && command.from === undefined)
      return error(state, "Taşınacak çiçeğin köşesini seç.");
    if (command.from !== undefined && fromWorld !== world) {
      if (!isWorld(fromWorld))
        return error(state, "Çiçeğin önceki bahçesi bulunamadı.");
      const source = areaOf(state, fromWorld);
      if (source.flowerPlacements?.[command.from] !== command.species)
        return error(state, "Taşınacak çiçek artık o köşede değil.");
      base = setArea(state, fromWorld, {
        ...source,
        flowerPlacements: source.flowerPlacements.map((id, i) =>
          i === command.from ? null : id,
        ),
      });
      localCommand = { ...command, from: undefined, fromWorld: undefined };
    }
    if (
      localCommand.type === "display-flower" &&
      localCommand.from === undefined &&
      flowerLocations(base, command.species).length >=
        (base.collection?.[command.species]?.quantity ?? 0)
    )
      return error(
        state,
        "Bu çiçeklerinin tamamı bahçelerinde sergileniyor. Birini taşıyabilir veya yeni bir çiçek yetiştirebilirsin.",
      );
  }
  const area = areaOf(base, world),
    view = { ...base, ...area };
  const result = applyAreaCommand(view, localCommand, now);
  if (result.error || result.state === view) return { ...result, state };
  const { plots, placements, flowerPlacements } = result.state;
  let next = setArea(setArea(result.state, "a1", areaOf(base, "a1")), world, {
    plots,
    placements,
    flowerPlacements,
  });
  if (command.type === "place")
    for (const other of gardenAreas(next))
      if (
        other.world !== world &&
        other.area.placements.includes(command.decoration)
      )
        next = setArea(next, other.world, {
          ...other.area,
          placements: other.area.placements.map((id) =>
            id === command.decoration ? null : id,
          ),
        });
  return { ...result, state: next };
}
function applyAreaCommand(
  state: GardenState,
  command: AreaCommand,
  now: number,
): CommandResult {
  if (!Number.isFinite(now) || now < state.createdAt)
    return error(state, "Cihaz saatini kontrol edip yeniden dene.");
  if (command.type === "plant") {
    const plot = state.plots.find((p) => p.id === command.plotId);
    if (!plot) return error(state, "Bu ekim alanı bulunamadı.");
    if (plot.plant) return error(state, "Bu alanda zaten bir bitki büyüyor.");
    if (
      !state.unlockedFlowers.includes(command.species) ||
      !(state.seeds[command.species] > 0)
    )
      return error(state, "Bu çiçeğin tohumu çantanda yok.");
    const plant: Plant = {
      id: `plant-${state.revision + 1}-${command.plotId}-${now}`,
      species: command.species,
      plantedAt: now,
      lastWateredAt: null,
      waterCount: 0,
      bloomedAt: null,
    };
    return {
      state: {
        ...state,
        revision: state.revision + 1,
        seeds: {
          ...state.seeds,
          [command.species]: state.seeds[command.species] - 1,
        },
        plots: state.plots.map((p) =>
          p.id === command.plotId ? { ...p, plant } : p,
        ),
      },
      event: "planted",
      plotId: command.plotId,
      message: `${flowerById(command.species).name} tohumun toprağa kavuştu! 🌱`,
    };
  }
  if (command.type === "harvest") {
    const plant = state.plots.find((p) => p.id === command.plotId)?.plant;
    if (!plant || plantKey(plant, command.plotId) !== command.plantKey)
      return error(
        state,
        "Bu çiçek zaten toplandı veya bu alana yeni bir tohum ekildi.",
      );
    if (growth(plant, now).stage !== "bloom")
      return error(state, "Çiçeğin henüz tamamen açmadı; biraz daha büyüsün.");
    const previous = state.collection?.[plant.species];
    if ((previous?.quantity ?? 0) >= 999999)
      return error(state, "Bu çiçeğin koleksiyon sayısı sınırına ulaştın.");
    return {
      state: {
        ...state,
        revision: state.revision + 1,
        plots: state.plots.map((p) =>
          p.id === command.plotId ? { ...p, plant: null } : p,
        ),
        collection: {
          ...state.collection,
          [plant.species]: {
            quantity: (previous?.quantity ?? 0) + 1,
            firstHarvestedAt: previous?.firstHarvestedAt ?? now,
            lastHarvestedAt: now,
          },
        },
      },
      event: "harvested",
      plotId: command.plotId,
      message: `${flowerById(plant.species).name} koleksiyonuna eklendi! Toprağın yeni bir tohuma hazır. 🌸`,
    };
  }
  if (command.type === "display-flower" || command.type === "remove-flower") {
    if (
      !Number.isInteger(command.slot) ||
      command.slot < 0 ||
      command.slot >= config.decorationSlots
    )
      return error(state, "Bu çiçek köşesi bulunamadı.");
    const placements = [
      ...(state.flowerPlacements ?? Array(config.decorationSlots).fill(null)),
    ];
    if (command.type === "remove-flower") {
      if (!placements[command.slot])
        return error(state, "Bu köşede kaldırılacak çiçek yok.");
      placements[command.slot] = null;
    } else {
      if (!state.collection?.[command.species]?.quantity)
        return error(
          state,
          "Önce bu çiçeği yetiştirip koleksiyonuna eklemelisin.",
        );
      if (command.from !== undefined) {
        if (
          !Number.isInteger(command.from) ||
          placements[command.from] !== command.species
        )
          return error(state, "Taşınacak çiçek artık o köşede değil.");
        if (command.from === command.slot) return { state };
      }
      if (placements[command.slot])
        return error(
          state,
          "Bu köşede bir çiçek var; önce onu kaldır veya taşı.",
        );
      if (command.from !== undefined) placements[command.from] = null;
      if (
        placements.filter((id) => id === command.species).length >=
        state.collection[command.species]!.quantity
      )
        return error(
          state,
          "Topladığın bu türün tamamı zaten sergileniyor. Birini taşıyabilir veya yeni bir çiçek yetiştirebilirsin.",
        );
      placements[command.slot] = command.species;
    }
    return {
      state: {
        ...state,
        revision: state.revision + 1,
        flowerPlacements: placements,
      },
      event: command.type === "remove-flower" ? "removed" : "decorated",
      message: "Çiçek köşen güncellendi; kalıcı koleksiyonun korunuyor. 🌷",
    };
  }
  if (command.type === "water") {
    const plot = state.plots.find((p) => p.id === command.plotId);
    if (!plot?.plant) return error(state, "Önce bu alana bir tohum ekmelisin.");
    const info = watering(plot.plant, now);
    if (!info.allowed)
      return error(
        state,
        info.remainingMs > 0
          ? `Yeniden sulamak için ${formatTime(info.remainingMs)} bekle.`
          : info.reason,
      );
    const plant = {
      ...plot.plant,
      lastWateredAt: now,
      waterCount: plot.plant.waterCount + 1,
    };
    return {
      state: {
        ...state,
        revision: state.revision + 1,
        plots: state.plots.map((p) =>
          p.id === command.plotId ? { ...p, plant } : p,
        ),
      },
      event: "watered",
      plotId: command.plotId,
      message: "Şıp şıp! Çiçeğin büyümesine 10 saniyelik katkı yaptın. 💧",
    };
  }
  if (command.type === "place") {
    if (
      !Number.isInteger(command.slot) ||
      command.slot < 0 ||
      command.slot >= config.decorationSlots
    )
      return error(state, "Bu köşeye süs yerleştirilemez.");
    if (!state.decorations.includes(command.decoration))
      return error(state, "Bu süs henüz çantanda yok.");
    if (
      state.placements[command.slot] &&
      state.placements[command.slot] !== command.decoration
    )
      return error(state, "Bu köşede başka bir süs var; önce onu çantana al.");
    const placements = state.placements.map((d) =>
      d === command.decoration ? null : d,
    );
    placements[command.slot] = command.decoration;
    return {
      state: { ...state, revision: state.revision + 1, placements },
      event: "decorated",
      message: "Ne güzel oldu! Bahçene yeni bir renk kattın. ✨",
    };
  }
  if (command.type === "remove") {
    if (!Number.isInteger(command.slot) || !state.placements[command.slot])
      return error(state, "Bu köşede kaldırılacak süs yok.");
    return {
      state: {
        ...state,
        revision: state.revision + 1,
        placements: state.placements.map((d, i) =>
          i === command.slot ? null : d,
        ),
      },
      event: "removed",
      message: "Süs çantana döndü. Dilediğin zaman yeniden yerleştirebilirsin.",
    };
  }
  if (command.type === "mute")
    return {
      state: { ...state, revision: state.revision + 1, muted: command.value },
      event: "muted",
      message: command.value
        ? "Bahçe sesleri kapatıldı."
        : "Bahçe sesleri açıldı.",
    };
  let count = 0;
  const plots = state.plots.map((p) => {
    if (
      p.plant &&
      p.plant.bloomedAt === null &&
      growth(p.plant, now).stage === "bloom"
    ) {
      count++;
      return {
        ...p,
        plant: { ...p.plant, bloomedAt: growth(p.plant, now).readyAt },
      };
    }
    return p;
  });
  return count
    ? {
        state: { ...state, revision: state.revision + 1, plots },
        event: "bloomed",
        message: `Harika! Bahçende ${count === 1 ? "yeni bir çiçek" : count + " çiçek"} açtı! 🌸`,
      }
    : { state };
}
type RewardSource =
  | "vocabulary"
  | "exercise"
  | "achievement"
  | "conversation"
  | "level"
  | "gift"
  | "birthday";
export type GardenReward = {
  id: string;
  source: RewardSource;
  seeds?: Partial<Record<FlowerId, number>>;
  coins?: number;
  decorations?: DecorationId[];
  flowers?: FlowerId[];
  worlds?: WorldId[];
};
// Integration seam only. No unfinished lesson, exercise or chat calls this function.
export function grantReward(
  state: GardenState,
  reward: GardenReward,
  now?: number,
): GardenState {
  if (!reward.id || state.appliedRewards.includes(reward.id)) return state;
  const seeds = { ...state.seeds };
  for (const f of FLOWERS) {
    const amount = reward.seeds?.[f.id] ?? 0;
    if (!Number.isInteger(amount) || amount < 0 || seeds[f.id] + amount > 9999)
      throw new Error("Geçersiz tohum ödülü.");
    seeds[f.id] += amount;
  }
  const coins = state.coins + (reward.coins ?? 0);
  if (!Number.isInteger(coins) || coins < state.coins || coins > 999999)
    throw new Error("Geçersiz bahçe parası ödülü.");
  if (
    reward.decorations?.some((id) => !DECORATIONS.some((d) => d.id === id)) ||
    reward.flowers?.some((id) => !FLOWERS.some((f) => f.id === id)) ||
    reward.worlds?.some((id) => !WORLDS.some((w) => w.id === id))
  )
    throw new Error("Geçersiz kilit açma ödülü.");
  const next: GardenState = {
    ...state,
    revision: state.revision + 1,
    seeds,
    coins,
    decorations: [
      ...new Set([...state.decorations, ...(reward.decorations ?? [])]),
    ],
    unlockedFlowers: [
      ...new Set([...state.unlockedFlowers, ...(reward.flowers ?? [])]),
    ],
    unlockedWorlds: [
      ...new Set([...state.unlockedWorlds, ...(reward.worlds ?? [])]),
    ],
    appliedRewards: [...state.appliedRewards, reward.id],
  };
  return now === undefined ? next : applyLearningCare(state, next, reward, now);
}
