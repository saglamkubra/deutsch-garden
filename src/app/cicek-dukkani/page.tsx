import type { Metadata } from "next";
import { FlowerShop } from "@/components/shop/flower-shop";
import "../bahcem/garden.css";
import "./shop.css";
export const metadata: Metadata = {
  title: "Çiçek Dükkânım",
  description:
    "Öğrenme emeğinle kazandığın bahçe parasını tohumlara ve kalıcı süslere dönüştür.",
};
export default function ShopPage() {
  return <FlowerShop />;
}
