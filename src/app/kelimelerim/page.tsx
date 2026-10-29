import type { Metadata } from "next";
import { VocabularyPage } from "@/components/learning/vocabulary-page";
import "../learning.css";
import "../stories.css";
import "../lumi.css";
export const metadata: Metadata = { title: "Kelime Hazinem" };
export default function WordsPage() {
  return <VocabularyPage />;
}
