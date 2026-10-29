import type { GardenState, GardenReward } from "./model.ts";
import { growth } from "./model.ts";
import { gardenDay } from "./calendar.ts";
import { gardenAreas, setArea } from "./worlds.ts";
export const CARE = {
  boostMs: 5000,
  maxPlantBonusMs: 30000,
  dailyBoosts: 6,
} as const;
export const isLearningActivity = (id: string) =>
  /^(daily-vocab:|exercise:coins:|grammar:topic:|listening:episode:|story:complete:|course:lesson:|lumi:daily:)/.test(
    id,
  );
export function applyLearningCare(
  before: GardenState,
  next: GardenState,
  reward: GardenReward,
  now: number,
): GardenState {
  if (
    !Number.isSafeInteger(now) ||
    now < before.createdAt ||
    !isLearningActivity(reward.id) ||
    !["exercise", "vocabulary", "conversation"].includes(reward.source)
  )
    return next;
  const day = gardenDay(now),
    previous = before.learningGarden;
  const total = Math.min(
    999999,
    (previous?.totalActivities ??
      before.appliedRewards.filter(isLearningActivity).length) + 1,
  );
  const count =
    previous?.day === day
      ? previous.dailyBoosts
      : previous && previous.day > day
        ? CARE.dailyBoosts
        : 0;
  const canBoost = count < CARE.dailyBoosts;
  let boosted = next;
  for (const { world, area } of gardenAreas(next)) {
    const plots = area.plots.map((p) =>
      p.plant && canBoost && growth(p.plant, now).stage !== "bloom"
        ? {
            ...p,
            plant: {
              ...p.plant,
              learningBonusMs: Math.min(
                CARE.maxPlantBonusMs,
                (p.plant.learningBonusMs ?? 0) + CARE.boostMs,
              ),
            },
          }
        : p,
    );
    boosted = setArea(boosted, world, { ...area, plots });
  }
  const milestones = [...(previous?.milestones ?? [])],
    seeds = { ...next.seeds },
    unlocked = new Set(next.unlockedFlowers);
  for (const [threshold, id] of [
    [5, "starlily"],
    [12, "forgetmenot"],
  ] as const) {
    if (total >= threshold && !milestones.includes(id)) {
      milestones.push(id);
      seeds[id] = Math.min(9999, seeds[id] + 1);
      unlocked.add(id);
    }
  }
  return {
    ...boosted,
    seeds,
    unlockedFlowers: [...unlocked],
    learningGarden: {
      day: previous && previous.day > day ? previous.day : day,
      dailyBoosts: Math.min(CARE.dailyBoosts, count + (canBoost ? 1 : 0)),
      totalActivities: total,
      milestones,
    },
  };
}
