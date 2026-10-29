import type { Metadata } from "next";
import { GardenGame } from "@/components/garden/game/garden-game";
import "./garden.css";
import "./worlds.css";
export const metadata: Metadata = {
  title: "Benim Sihirli Bahçem",
  description:
    "Altı sihirli dünyada tohum ek, çiçeklerini sula ve ortak koleksiyonunu büyüt. Her bahçenin ekimleri ayrı saklanır.",
};
export default function GardenPage() {
  return <GardenGame />;
}
