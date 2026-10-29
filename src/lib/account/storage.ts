/** Logical keys stay unchanged; authenticated learners get isolated device caches. */
export const MODULES = [
  "garden",
  "learning",
  "exercises",
  "grammar",
  "listening",
  "stories",
  "mini-courses",
  "lumi",
  "vocabulary",
  "preferences",
] as const;
export const keyFor = (module: string) => `deutsch-garden:${module}:v1`;
export const accountPrefix = (id: string) => `deutsch-garden:account:${id}:`;
let owner: string | null = null;
let frozen = false;
const listeners = new Set<() => void>();
export function setStorageOwner(id: string | null) {
  owner = id;
  frozen = false;
}
export function freezeProgress() {
  frozen = true;
}
export const currentOwner = () => owner;
export const watchProgress = (f: () => void) => {
  listeners.add(f);
  return () => {
    listeners.delete(f);
  };
};
export const physicalKey = (key: string, id = owner) =>
  id ? accountPrefix(id) + key : key;
export function progressStorage(): Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
> {
  return {
    getItem: (key) => window.localStorage.getItem(physicalKey(key)),
    setItem(key, value) {
      if (frozen) throw new Error("Hesap değişiyor; kaydın korunuyor.");
      const disk = window.localStorage;
      if (disk.getItem(physicalKey(key)) === value) return;
      disk.setItem(physicalKey(key), value);
      if (MODULES.some((m) => key === keyFor(m))) listeners.forEach((f) => f());
    },
    removeItem(key) {
      if (frozen) throw new Error("Hesap değişiyor; kaydın korunuyor.");
      window.localStorage.removeItem(physicalKey(key));
      listeners.forEach((f) => f());
    },
  };
}
/** Existing stores listen for logical keys. Never relay another account's events. */
export function relayStorageEvent(e: StorageEvent) {
  if (!owner || !e.key?.startsWith(accountPrefix(owner))) return;
  const key = e.key.slice(accountPrefix(owner).length);
  window.dispatchEvent(
    new StorageEvent("storage", {
      key,
      oldValue: e.oldValue,
      newValue: e.newValue,
    }),
  );
  listeners.forEach((f) => f());
}
