import {
  BirthdayError,
  prepareBirthdayConfig,
  type BirthdayStorage,
} from "./server.ts";
import { validConfig, type BirthdayConfig } from "./model.ts";
import {
  mutateState,
  type StateStore,
  StateUnavailable,
} from "../server-state/store.ts";
export class CloudBirthdayRepository implements BirthdayStorage {
  private store: StateStore;
  constructor(store: StateStore) {
    this.store = store;
  }
  async read(): Promise<BirthdayConfig | null> {
    const row = await this.store.read("birthday-config-v1");
    if (row.payload === null) throw new StateUnavailable();
    return this.config(row.payload);
  }
  private config(payload: unknown): BirthdayConfig | null {
    if (
      !payload ||
      typeof payload !== "object" ||
      !Object.hasOwn(payload, "config") ||
      ((payload as { config: unknown }).config !== null &&
        !validConfig((payload as { config: unknown }).config))
    )
      throw new BirthdayError("CONFIG_CORRUPT", 503);
    return (payload as { config: BirthdayConfig }).config;
  }
  async save(input: unknown) {
    return mutateState(this.store, "birthday-config-v1", (payload) => {
      if (payload === null) throw new StateUnavailable();
      const config = prepareBirthdayConfig(input, this.config(payload));
      return { payload: { config }, result: config };
    });
  }
  async accessAttempt(now: number) {
    return mutateState(this.store, "birthday-access-v1", (payload) => {
      if (payload === null) throw new StateUnavailable();
      let attempts: number[] = [];
      if (payload !== null) {
        if (
          !payload ||
          typeof payload !== "object" ||
          !Array.isArray((payload as { attempts: unknown }).attempts)
        )
          throw new StateUnavailable();
        attempts = (payload as { attempts: number[] }).attempts;
        if (attempts.some((t) => !Number.isSafeInteger(t)))
          throw new StateUnavailable();
      }
      attempts = attempts.filter((t) => t > now - 900000);
      if (attempts.length >= 8) throw new BirthdayError("RATE_LIMIT", 429);
      return { payload: { attempts: [...attempts, now] }, result: undefined };
    });
  }
}
