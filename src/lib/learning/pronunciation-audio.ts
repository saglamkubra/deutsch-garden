import index from "../../data/courses/pronunciation-index.json" with { type: "json" };
type Asset = { url: string; sha256: string };
export function pronunciationAudio(text: string): Asset | null {
  const key = text.normalize("NFC").replace(/\s+/g, " ").trim();
  return Object.hasOwn(index, key)
    ? (index as Record<string, Asset>)[key]
    : null;
}
