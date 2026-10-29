import { notFound } from "next/navigation";
import { topics, topicById } from "@/lib/grammar/content";
import { GrammarLesson } from "@/components/grammar/lesson";
import "../../grammar.css";
export const dynamicParams = false;
export function generateStaticParams() {
  return topics.filter((t) => t.lesson).map((t) => ({ topic: t.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  return { title: topicById(topic)?.title ?? "Konu bulunamadı" };
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const item = topicById(topic);
  if (!item?.lesson) notFound();
  return <GrammarLesson topic={item} />;
}
