import {
  GARDEN_CONFIG,
  WORLDS,
  type WorldId,
  type FlowerId,
  type DecorationId,
} from "./catalog.ts";
import type { GardenState, Plot } from "./model.ts";
export type GardenArea = {
  plots: Plot[];
  placements: (DecorationId | null)[];
  flowerPlacements?: (FlowerId | null)[];
};
export function emptyArea(): GardenArea {
  return {
    plots: Array.from({ length: GARDEN_CONFIG.plotCount }, (_, id) => ({
      id,
      plant: null,
    })),
    placements: Array(GARDEN_CONFIG.decorationSlots).fill(null),
  };
}
export const isWorld = (id: unknown): id is WorldId =>
  WORLDS.some((w) => w.id === id);
export const selectedWorld = (state: GardenState): WorldId =>
  state.activeWorld ?? "a1";
export function areaOf(state: GardenState, world: WorldId): GardenArea {
  return world === "a1"
    ? {
        plots: state.plots,
        placements: state.placements,
        flowerPlacements: state.flowerPlacements,
      }
    : (state.worldGardens?.[world] ?? emptyArea());
}
export function setArea(
  state: GardenState,
  world: WorldId,
  area: GardenArea,
): GardenState {
  const clean = {
    plots: area.plots,
    placements: area.placements,
    ...(area.flowerPlacements
      ? { flowerPlacements: area.flowerPlacements }
      : {}),
  };
  if (world !== "a1")
    return {
      ...state,
      worldGardens: { ...state.worldGardens, [world]: clean },
    };
  const next = { ...state, ...clean };
  if (!area.flowerPlacements) delete next.flowerPlacements;
  return next;
}
export const gardenAreas = (state: GardenState) =>
  WORLDS.filter((w) => w.id === "a1" || !!state.worldGardens?.[w.id]).map(
    (w) => ({ world: w.id, area: areaOf(state, w.id) }),
  );
export const allPlots = (state: GardenState) =>
  gardenAreas(state).flatMap(({ area }) => area.plots);
export const flowerLocations = (state: GardenState, species: FlowerId) =>
  gardenAreas(state).flatMap(({ world, area }) =>
    (area.flowerPlacements ?? []).flatMap((id, slot) =>
      id === species ? [{ world, slot }] : [],
    ),
  );
export const decorationWorld = (state: GardenState, id: DecorationId) =>
  gardenAreas(state).find(({ area }) => area.placements.includes(id))?.world;
