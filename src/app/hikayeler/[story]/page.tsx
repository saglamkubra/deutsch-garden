import { notFound } from "next/navigation";
import { stories, storyById } from "@/lib/stories/content";
import { StoryReader } from "@/components/stories/reader";
import "../../stories.css";
import "../../grammar.css";
export const dynamicParams = false;
export function generateStaticParams() {
  return stories.map((s) => ({ story: s.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ story: string }>;
}) {
  const { story } = await params;
  return { title: storyById(story)?.title ?? "Hikâye bulunamadı" };
}
export default async function StoryPage({
  params,
}: {
  params: Promise<{ story: string }>;
}) {
  const { story } = await params;
  const content = storyById(story);
  if (!content) notFound();
  return <StoryReader story={content} />;
}
