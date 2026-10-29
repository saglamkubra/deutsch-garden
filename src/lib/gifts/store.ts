"use client";
import { acknowledgeGiftXp, gardenSnapshot } from "../garden/store.ts";
import { deliverLearningXp } from "../exercises/store.ts";
let running: Promise<void> | null = null;
export function flushDailyGiftXp() {
  if (running) return running;
  running = (async () => {
    const pending =
      gardenSnapshot().state.dailyGifts?.filter((c) => !c.xpDelivered) ?? [];
    for (const claim of pending)
      if (await deliverLearningXp("gift:daily:" + claim.day, claim.xp))
        await acknowledgeGiftXp(claim.day);
  })().finally(() => {
    running = null;
  });
  return running;
}
