import { LumiLedger, TutorError } from "./ledger.ts";
import { mutateState, type StateStore } from "../server-state/store.ts";
type Operations =
  | "remaining"
  | "reserve"
  | "failed"
  | "complete"
  | "verifyReceipt"
  | "remove"
  | "accessAttempt";
export type LedgerPort = {
  [K in Operations]: (
    ...args: Parameters<LumiLedger[K]>
  ) => ReturnType<LumiLedger[K]> | Promise<ReturnType<LumiLedger[K]>>;
} & { close(): void };
export class CloudLumiLedger implements LedgerPort {
  private store: StateStore;
  constructor(store: StateStore) {
    this.store = store;
  }
  private async read<T>(fn: (ledger: LumiLedger) => T): Promise<T> {
    try {
      const row = await this.store.read("lumi-ledger-v1"),
        ledger = new LumiLedger(":memory:");
      try {
        if (row.payload === null)
          throw new TutorError(503, "STORAGE_UNAVAILABLE");
        ledger.importData(row.payload);
        return fn(ledger);
      } finally {
        ledger.close();
      }
    } catch (e) {
      if (e instanceof TutorError) throw e;
      throw new TutorError(503, "STORAGE_UNAVAILABLE", 15);
    }
  }
  private async change<T>(fn: (ledger: LumiLedger) => T): Promise<T> {
    try {
      return await mutateState(this.store, "lumi-ledger-v1", (payload) => {
        const ledger = new LumiLedger(":memory:");
        try {
          if (payload === null)
            throw new TutorError(503, "STORAGE_UNAVAILABLE");
          ledger.importData(payload);
          const result = fn(ledger);
          return { result, payload: ledger.exportData() };
        } finally {
          ledger.close();
        }
      });
    } catch (e) {
      if (e instanceof TutorError) throw e;
      throw new TutorError(503, "STORAGE_UNAVAILABLE", 15);
    }
  }
  remaining(...a: Parameters<LumiLedger["remaining"]>) {
    return this.read((l) => l.remaining(...a));
  }
  reserve(...a: Parameters<LumiLedger["reserve"]>) {
    return this.change((l) => l.reserve(...a));
  }
  failed(...a: Parameters<LumiLedger["failed"]>) {
    return this.change((l) => l.failed(...a));
  }
  complete(...a: Parameters<LumiLedger["complete"]>) {
    return this.change((l) => l.complete(...a));
  }
  verifyReceipt(...a: Parameters<LumiLedger["verifyReceipt"]>) {
    return this.read((l) => l.verifyReceipt(...a));
  }
  remove(...a: Parameters<LumiLedger["remove"]>) {
    return this.change((l) => l.remove(...a));
  }
  accessAttempt(...a: Parameters<LumiLedger["accessAttempt"]>) {
    return this.change((l) => l.accessAttempt(...a));
  }
  close() {}
}
