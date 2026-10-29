import vocabulary from "@/data/vocabulary.json";
import { ListeningWordCard } from "@/components/listening/word-card";
import "../../learning.css";
import "../../listening.css";
export const metadata = { title: "Kelime Kartım" };
export const dynamicParams = true;
export function generateStaticParams() {
  // Keep existing prebuilt paths; new expression pages are generated on demand.
  return vocabulary
    .filter((w) => !w.id.startsWith("dg-course-"))
    .map((w) => ({ word: w.id }));
}
export default async function WordPage({
  params,
}: {
  params: Promise<{ word: string }>;
}) {
  const { word } = await params;
  return <ListeningWordCard wordId={word} />;
}
