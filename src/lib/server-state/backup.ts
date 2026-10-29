// Explicit local operator tool only: never imported by an API/client route.
import { createHash } from "node:crypto";
import { LumiLedger } from "../lumi/ledger.ts";
import { validConfig } from "../birthday/model.ts";
import type { Namespace } from "./store.ts";
export const canonical = (x: unknown): string =>
  Array.isArray(x)
    ? "[" + x.map(canonical).join(",") + "]"
    : x && typeof x === "object"
      ? "{" +
        Object.entries(x)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => JSON.stringify(k) + ":" + canonical(v))
          .join(",") +
        "}"
      : JSON.stringify(x);
export const digest = (x: unknown) =>
  createHash("sha256").update(canonical(x)).digest("hex");
export type Backup = {
  format: 1;
  createdAt: number;
  secretHashes: { lumi: string | null; birthday: string | null };
  states: Record<Namespace, unknown>;
  digest: string;
};
export function sealBackup(input: Omit<Backup, "digest">): Backup {
  return { ...input, digest: digest(input) };
}
export function validateBackup(input: unknown): Backup {
  if (!input || typeof input !== "object") throw Error("INVALID_BACKUP");
  const b = input as Backup,
    { digest: hash, ...rest } = b;
  if (
    b.format !== 1 ||
    !Number.isSafeInteger(b.createdAt) ||
    b.createdAt < 0 ||
    hash !== digest(rest) ||
    !b.states ||
    Object.keys(b.states).sort().join() !==
      ["birthday-access-v1", "birthday-config-v1", "lumi-ledger-v1"].join()
  )
    throw Error("INVALID_BACKUP");
  for (const key of ["lumi", "birthday"] as const)
    if (
      !b.secretHashes ||
      (b.secretHashes[key] !== null &&
        !/^[a-f0-9]{64}$/.test(b.secretHashes[key]!))
    )
      throw Error("INVALID_BACKUP");
  const ledger = new LumiLedger(":memory:");
  try {
    ledger.importData(b.states["lumi-ledger-v1"]);
  } finally {
    ledger.close();
  }
  const c = b.states["birthday-config-v1"] as { config: unknown };
  if (
    !c ||
    !Object.hasOwn(c, "config") ||
    (c.config !== null && !validConfig(c.config))
  )
    throw Error("INVALID_BACKUP");
  const a = b.states["birthday-access-v1"] as { attempts: unknown[] };
  if (
    !a ||
    !Array.isArray(a.attempts) ||
    a.attempts.length > 8 ||
    a.attempts.some((n) => !Number.isSafeInteger(n))
  )
    throw Error("INVALID_BACKUP");
  if (
    Object.values(b.states).some(
      (s) => Buffer.byteLength(JSON.stringify(s)) > 2000000,
    )
  )
    throw Error("BACKUP_TOO_LARGE");
  return b;
}
export function checkBackupSecrets(b: Backup, lumi: string, birthday: string) {
  if (lumi.length < 32 || birthday.length < 32) throw Error("SECRET_REQUIRED");
  const hash = (s: string) => createHash("sha256").update(s).digest("hex");
  if (
    (b.secretHashes.lumi && b.secretHashes.lumi !== hash(lumi)) ||
    (b.secretHashes.birthday && b.secretHashes.birthday !== hash(birthday))
  )
    throw Error("SECRET_MISMATCH");
}
