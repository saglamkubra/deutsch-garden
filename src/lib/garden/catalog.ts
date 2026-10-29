export const GARDEN_CONFIG = {
  version: 1,
  plotCount: 12,
  decorationSlots: 6,
  wateringCooldownMs: 20_000,
  wateringBonusMs: 10_000,
  maxWaterings: 2,
  tickMs: 1_000,
} as const;
export const FLOWERS = [
  {
    id: "daisy",
    name: "Papatya",
    color: "#FFF9EB",
    center: "#EDBD5B",
    accent: "#CDB57E",
    durationMs: 45_000,
    starterSeeds: 3,
    description:
      "Sade, neşeli ve güneşi görünce gülümseyen ilk bahçe arkadaşın.",
  },
  {
    id: "tulip",
    name: "Lale",
    color: "#F299B5",
    center: "#F6BDCA",
    accent: "#CB729B",
    durationMs: 60_000,
    starterSeeds: 2,
    description:
      "Pembe bir fincan gibi açılan, bahar neşesi taşıyan zarif bir çiçek.",
  },
  {
    id: "rose",
    name: "Gül",
    color: "#EA91AF",
    center: "#C66390",
    accent: "#B95F88",
    durationMs: 75_000,
    starterSeeds: 2,
    description: "Kat kat yapraklarında küçük bir sevgi hikâyesi saklar.",
  },
  {
    id: "sunflower",
    name: "Ayçiçeği",
    color: "#F6CD65",
    center: "#A77B56",
    accent: "#D9A23C",
    durationMs: 90_000,
    starterSeeds: 2,
    description: "Minik bahçenin sıcacık, güneş gibi parlayan yüzü.",
  },
  {
    id: "lavender",
    name: "Lavanta",
    color: "#B39BDD",
    center: "#D5C1EF",
    accent: "#8D71BD",
    durationMs: 105_000,
    starterSeeds: 2,
    description: "Mor tomurcuklarıyla bahçene sakin ve masalsı bir hava katar.",
  },
  {
    id: "cherry",
    name: "Kiraz Çiçeği",
    color: "#F6BDCF",
    center: "#F4D282",
    accent: "#DA8EA9",
    durationMs: 120_000,
    starterSeeds: 1,
    description: "İncecik dalında pembe bahar bulutları açtırır.",
  },
  {
    id: "moonflower",
    name: "Ay Işığı Çiçeği",
    color: "#CEE3FF",
    center: "#FFE78F",
    accent: "#9E9ADC",
    durationMs: 135000,
    starterSeeds: 0,
    description: "Yıldız biçimli yapraklarında gece göğünün huzurunu taşır.",
  },
  {
    id: "royal",
    name: "Kraliyet Çiçeği",
    color: "#BB9BE8",
    center: "#FFE78F",
    accent: "#9672BD",
    durationMs: 150000,
    starterSeeds: 0,
    description: "Altın kalpli, mor yapraklı küçük bir bahçe tacı.",
  },
  {
    id: "starlily",
    name: "Yıldız Zambağı",
    color: "#D8BBF4",
    center: "#FFE78F",
    accent: "#A184C8",
    durationMs: 150000,
    starterSeeds: 0,
    description: "Öğrenme ışığında parlayan yıldız yapraklı özel bir zambak.",
  },
  {
    id: "forgetmenot",
    name: "Unutma Beni",
    color: "#A9DDF7",
    center: "#FFE78F",
    accent: "#78AFD1",
    durationMs: 165000,
    starterSeeds: 0,
    description: "Her yeni kelimeyi hatırlatan gök mavisi minik çiçekler.",
  },
  {
    id: "birthday-star",
    name: "Doğum Günü Yıldızı 🌟🌸",
    color: "#F7C0DD",
    center: "#FFE78F",
    accent: "#B69BD7",
    durationMs: 120000,
    starterSeeds: 0,
    description:
      "Bir doğum günü dileğinden filizlenen, pastel yıldız yapraklı kalıcı hatıran.",
  },
] as const;
export const SHOP_FLOWER_IDS = ["moonflower", "royal"] as const;
export type FlowerId = (typeof FLOWERS)[number]["id"];
export const flowerById = (id: FlowerId) => FLOWERS.find((f) => f.id === id)!;
export const STARTER_DECORATION_IDS = [
  "fence",
  "mushroom",
  "stone",
  "butterfly",
  "pot",
] as const;
export const DECORATIONS = [
  {
    id: "fence",
    name: "Ahşap Çit",
    description: "Bahçe kenarı için küçük bir çit.",
  },
  {
    id: "mushroom",
    name: "Minik Mantar",
    description: "Masallardan çıkmış benekli bir mantar.",
  },
  {
    id: "stone",
    name: "Bahçe Taşı",
    description: "Üzerinde minicik bir kalp taşıyan taş.",
  },
  {
    id: "butterfly",
    name: "Kelebek Süsü",
    description: "Çiçeklerinin yanında renkli bir dost.",
  },
  {
    id: "pot",
    name: "Sevimli Saksı",
    description: "Bahçenin köşesine sıcacık bir dokunuş.",
  },
  {
    id: "mint-pot",
    name: "Naneli Bulut Saksı",
    description: "Bulut kabartmalı, mint renkli bir süs saksısı.",
  },
  {
    id: "pink-butterfly",
    name: "Şeker Kelebeği",
    description: "Pembe kanatlarıyla bahçene konan kalıcı süs.",
  },
  {
    id: "magic-tree",
    name: "Dilek Ağacı",
    description: "Lavanta yapraklarında minik yıldızlar saklar.",
  },
  {
    id: "crystal",
    name: "Kristal Kümesi",
    description: "Güneşte parıldayan pastel kristaller.",
  },
  {
    id: "royal-gate",
    name: "Kraliyet Kemeri",
    description: "Bahçene taçlı bir giriş.",
  },
  {
    id: "pumpkin",
    name: "Sonbahar Balkabağı",
    description: "Her mevsim kullanabileceğin sıcacık sonbahar süsü.",
  },
  {
    id: "lantern",
    name: "Yıldız Feneri",
    description: "Köşene yumuşacık bir yıldız ışığı.",
  },
  {
    id: "snowglobe",
    name: "Kış Küresi",
    description: "Camında minik bir kış ağacı taşıyan kalıcı dekor.",
  },
  {
    id: "birthday-arch",
    name: "Dilek Çelengi",
    description:
      "Minik çiçekler ve pastel kurdelelerle doğum gününden kalıcı bir hatıra.",
  },
] as const;
export type DecorationId = (typeof DECORATIONS)[number]["id"];
export const WORLDS = [
  { id: "a1", level: "A1", name: "Bahar Çayırı", symbol: "🌷" },
  { id: "a2", level: "A2", name: "Kelebek Vadisi", symbol: "🦋" },
  { id: "b1", level: "B1", name: "Büyülü Orman", symbol: "🌳" },
  { id: "b2", level: "B2", name: "Ay Işığı Bahçesi", symbol: "🌙" },
  { id: "c1", level: "C1", name: "Kristal Sera", symbol: "💎" },
  { id: "c2", level: "C2", name: "Kraliyet Çiçek Diyarı", symbol: "👑" },
] as const;
export type WorldId = (typeof WORLDS)[number]["id"];

export const RARITY_LABELS = {
  common: "Bahçe dostu",
  uncommon: "Özenli keşif",
  rare: "Nadir",
  magical: "Sihirli",
} as const;
export function flowerRarity(id: FlowerId): keyof typeof RARITY_LABELS {
  return ["starlily", "forgetmenot", "royal", "birthday-star"].includes(id)
    ? "magical"
    : id === "moonflower"
      ? "rare"
      : ["cherry", "lavender", "rose"].includes(id)
        ? "uncommon"
        : "common";
}

export function visibleGardenFlowers(unlocked: readonly FlowerId[]) {
  return FLOWERS.filter(
    (f) => f.id !== "birthday-star" || unlocked.includes("birthday-star"),
  );
}
