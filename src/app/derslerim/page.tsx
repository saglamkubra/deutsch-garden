import type { Metadata } from "next";
import { LevelMap } from "@/components/learning/level-map";
import "../learning.css";
import "../mini-courses.css";
import "../grammar.css";
export const metadata: Metadata = { title: "Almanca Öğrenme Haritam" };
export default function LessonsPage() {
  return <LevelMap />;
}
