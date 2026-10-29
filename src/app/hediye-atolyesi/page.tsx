import type { Metadata } from "next";
import { BirthdayCreator } from "@/components/birthday/creator";
export const metadata: Metadata = {
  title: "Hediye Atölyesi",
  robots: { index: false, follow: false },
};
export default function CreatorPage() {
  return <BirthdayCreator />;
}
