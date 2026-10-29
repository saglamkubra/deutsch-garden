import type { Metadata } from "next";
import { MemoryGarden } from "@/components/birthday/memory-garden";
export const metadata: Metadata = {
  title: "Hatıra Bahçem",
  description: "Bir mektup, bir çiçek, saklamak istediğin küçük bir an.",
};
export default function MemoryPage() {
  return <MemoryGarden />;
}
