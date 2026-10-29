import { GARDEN_KEY } from "./storage.ts";
let queue: Promise<unknown> = Promise.resolve();
export function withGardenLock<T>(run: () => T): Promise<T> {
  if (typeof navigator !== "undefined" && navigator.locks)
    return navigator.locks.request(GARDEN_KEY, run);
  const next = queue.then(run, run);
  queue = next.catch(() => undefined);
  return next;
}
