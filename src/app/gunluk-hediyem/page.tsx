import type { Metadata } from "next";
import { DailyGift } from "@/components/gifts/daily-gift";
import "../bahcem/garden.css";
import "./gift.css";
export const metadata: Metadata = {
  title: "Günlük Hediyem",
  description:
    "Her gün bir ücretsiz sürpriz: bahçe parası, XP, tohumlar ve küçük bahçe mutlulukları.",
};
export default function DailyGiftPage() {
  return <DailyGift />;
}
