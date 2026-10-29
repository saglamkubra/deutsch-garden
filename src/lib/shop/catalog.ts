import type { FlowerId, DecorationId } from "../garden/catalog.ts";
import type { Level } from "../learning/types.ts";
export const SHOP_CATEGORIES = {
  seeds: "Çiçek Tohumları",
  special: "Özel Çiçekler",
  pots: "Saksılar",
  ornaments: "Bahçe Süsleri",
  butterflies: "Kelebekler",
  trees: "Ağaçlar",
  seasonal: "Mevsimlik Dekorasyonlar",
} as const;
export type ShopCategory = keyof typeof SHOP_CATEGORIES;
export type ShopProduct = {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  description: string;
  level: Level;
  available: boolean;
  inventory:
    | { kind: "seed"; flower: FlowerId; quantity: number }
    | { kind: "decoration"; decoration: DecorationId };
  tone: string;
};
export const SHOP_PRODUCTS: readonly ShopProduct[] = [
  {
    id: "seeds-daisy-v1",
    name: "Güneşli Papatyalar",
    category: "seeds",
    price: 8,
    description:
      "Üç küçük tohum, üç yeni gülümseme. İlk bahçe arkadaşını çoğalt.",
    level: "A1",
    available: true,
    inventory: { kind: "seed", flower: "daisy", quantity: 3 },
    tone: "yellow",
  },
  {
    id: "seeds-tulip-v1",
    name: "Pembe Lale Paketi",
    category: "seeds",
    price: 10,
    description: "Bahçene bahar neşesi taşıyan üç lale tohumu.",
    level: "A1",
    available: true,
    inventory: { kind: "seed", flower: "tulip", quantity: 3 },
    tone: "pink",
  },
  {
    id: "seeds-rose-v1",
    name: "Sevgi Gülleri",
    category: "seeds",
    price: 12,
    description: "Kat kat pembe yapraklar için üç gül tohumu.",
    level: "A1",
    available: true,
    inventory: { kind: "seed", flower: "rose", quantity: 3 },
    tone: "peach",
  },
  {
    id: "seeds-sunflower-v1",
    name: "Minik Güneşler",
    category: "seeds",
    price: 12,
    description: "Güneşi seven üç ayçiçeği tohumu.",
    level: "A1",
    available: true,
    inventory: { kind: "seed", flower: "sunflower", quantity: 3 },
    tone: "yellow",
  },
  {
    id: "seeds-lavender-v1",
    name: "Lavanta Rüyası",
    category: "seeds",
    price: 14,
    description: "Sakin bir mor köşe için üç lavanta tohumu.",
    level: "A1",
    available: true,
    inventory: { kind: "seed", flower: "lavender", quantity: 3 },
    tone: "lavender",
  },
  {
    id: "seeds-cherry-v1",
    name: "Pembe Bahar",
    category: "seeds",
    price: 16,
    description: "İki kiraz çiçeği tohumu ile küçük bir bahar bulutu yetiştir.",
    level: "A1",
    available: true,
    inventory: { kind: "seed", flower: "cherry", quantity: 2 },
    tone: "pink",
  },
  {
    id: "seeds-moon-v1",
    name: "Ay Işığı Çiçeği",
    category: "special",
    price: 24,
    description:
      "Gece mavisi yıldız yaprakları açan iki özel tohum. Bahçede gerçekten büyür.",
    level: "B2",
    available: true,
    inventory: { kind: "seed", flower: "moonflower", quantity: 2 },
    tone: "sky",
  },
  {
    id: "seeds-royal-v1",
    name: "Kraliyet Çiçeği",
    category: "special",
    price: 32,
    description: "Altın kalpli mor çiçekler yetiştiren iki kraliyet tohumu.",
    level: "C2",
    available: true,
    inventory: { kind: "seed", flower: "royal", quantity: 2 },
    tone: "lavender",
  },
  {
    id: "mint-pot-v1",
    name: "Naneli Bulut Saksı",
    category: "pots",
    price: 18,
    description:
      "Bulut desenli mint bir süs saksısı. Süs köşesine yerleşir; ayrı ekim alanı açmaz.",
    level: "A1",
    available: true,
    inventory: { kind: "decoration", decoration: "mint-pot" },
    tone: "mint",
  },
  {
    id: "lantern-v1",
    name: "Yıldız Feneri",
    category: "ornaments",
    price: 20,
    description:
      "Küçük bir yıldız, kocaman bir sıcaklık. Bahçe köşenin yeni ışığı.",
    level: "A1",
    available: true,
    inventory: { kind: "decoration", decoration: "lantern" },
    tone: "yellow",
  },
  {
    id: "butterfly-pink-v1",
    name: "Şeker Kelebeği",
    category: "butterflies",
    price: 22,
    description:
      "Şeker pembesi kanatlarıyla çiçeklerine eşlik eden bir bahçe süsü.",
    level: "A2",
    available: true,
    inventory: { kind: "decoration", decoration: "pink-butterfly" },
    tone: "pink",
  },
  {
    id: "tree-magic-v1",
    name: "Dilek Ağacı",
    category: "trees",
    price: 30,
    description:
      "Yıldızlı lavanta yapraklarıyla masal köşeni tamamlayan kalıcı süs.",
    level: "B1",
    available: true,
    inventory: { kind: "decoration", decoration: "magic-tree" },
    tone: "mint",
  },
  {
    id: "crystal-v1",
    name: "Kristal Kümesi",
    category: "ornaments",
    price: 34,
    description: "Pastel kristallerden küçük bir ışık oyunu.",
    level: "C1",
    available: true,
    inventory: { kind: "decoration", decoration: "crystal" },
    tone: "sky",
  },
  {
    id: "royal-gate-v1",
    name: "Kraliyet Kemeri",
    category: "ornaments",
    price: 40,
    description: "Taçlı bir geçitle bahçene masalsı bir giriş ekle.",
    level: "C2",
    available: true,
    inventory: { kind: "decoration", decoration: "royal-gate" },
    tone: "lavender",
  },
  {
    id: "pumpkin-v1",
    name: "Sonbahar Balkabağı",
    category: "seasonal",
    price: 16,
    description:
      "Sıcacık bir sonbahar hatırası. Aldıktan sonra her mevsim kullanabilirsin.",
    level: "A1",
    available: true,
    inventory: { kind: "decoration", decoration: "pumpkin" },
    tone: "peach",
  },
  {
    id: "snowglobe-v1",
    name: "Kış Küresi",
    category: "seasonal",
    price: 20,
    description:
      "Minik bir kış ağacını saklayan cam küre. Şimdilik vitrinde; satışa açık değil.",
    level: "A1",
    available: false,
    inventory: { kind: "decoration", decoration: "snowglobe" },
    tone: "sky",
  },
];
export const productById = (id: string) =>
  SHOP_PRODUCTS.find((p) => p.id === id);
