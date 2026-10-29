import { notFound } from "next/navigation";
import { episodes, episodeById } from "@/lib/listening/content";
import { ListeningEpisode } from "@/components/listening/episode";
import "../../listening.css";
import "../../grammar.css";
export const dynamicParams = false;
export function generateStaticParams() {
  return episodes.filter((e) => e.audio).map((e) => ({ episode: e.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ episode: string }>;
}) {
  const { episode } = await params;
  return { title: episodeById(episode)?.title ?? "Dinleme bulunamadı" };
}
export default async function EpisodePage({
  params,
}: {
  params: Promise<{ episode: string }>;
}) {
  const { episode } = await params;
  const item = episodeById(episode);
  if (!item?.audio) notFound();
  return <ListeningEpisode episode={item} />;
}
