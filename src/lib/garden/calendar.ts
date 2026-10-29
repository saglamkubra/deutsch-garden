// Fixed garden calendar: browser timezone changes do not reset the daily claim.
export function gardenDay(now: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function nextGardenDay(now: number): number {
  const day = gardenDay(now);
  return Date.parse(day + "T00:00:00+03:00") + 86400000;
}
