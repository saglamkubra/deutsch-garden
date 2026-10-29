import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import { navigation } from "@/lib/navigation";
import { futureSections } from "@/lib/home-demo";
const sections: {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: (typeof navigation)[number]["icon"];
}[] = [...navigation, ...futureSections];
import {
  PageHeading,
  ColorCard,
  DemoLabel,
} from "@/components/garden/primitives";
import { Button } from "@/components/ui/button";
import { GardenIllustration } from "@/components/garden/illustration";
export const dynamicParams = false;
export function generateStaticParams() {
  return sections
    .filter(
      (item) =>
        item.href !== "/" &&
        item.href !== "/bahcem" &&
        item.href !== "/derslerim" &&
        item.href !== "/kelimelerim" &&
        item.href !== "/alistirmalar" &&
        item.href !== "/gramer" &&
        item.href !== "/dinleme-kulubu" &&
        item.href !== "/hikayeler" &&
        item.href !== "/lumi-ai" &&
        item.href !== "/gunlugum" &&
        item.href !== "/cicek-dukkani" &&
        item.href !== "/gunluk-hediyem" &&
        item.href !== "/hatira-bahcem" &&
        item.href !== "/profilim" &&
        item.href !== "/basarilarim",
    )
    .map((item) => ({ section: item.href.slice(1) }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return {
    title:
      sections.find((item) => item.href === "/" + section)?.title ??
      "Sayfa bulunamadı",
  };
}
export default async function PlaceholderPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const item = sections.find((item) => item.href === "/" + section);
  if (!item) notFound();
  const Icon = item.icon;
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="BAHÇENDE YENİ BİR KÖŞE"
        title={item.title}
        description={item.description}
      >
        <DemoLabel>Gelecek bölüm · Tasarım önizlemesi</DemoLabel>
      </PageHeading>
      <ColorCard tone={item.color} className="placeholder-card">
        <div className="placeholder-copy">
          <span className="placeholder-icon">
            <Icon size={34} />
          </span>
          <span className="eyebrow">YAKINDA FİLİZLENECEK</span>
          <h2>Buraya güzel şeyler ekeceğiz.</h2>
          <p>
            Bu sayfa şimdilik bir tasarım taslağı. {item.title} özellikleri
            sonraki adımlarda hazırlanacak.
          </p>
          <div className="placeholder-status">
            <Sprout size={18} /> Henüz etkin bir özellik veya kaydedilen
            ilerleme yok.
          </div>
          <Button asChild>
            <Link href="/">
              <ArrowLeft size={16} /> Ana sayfaya dön
            </Link>
          </Button>
        </div>
        <GardenIllustration />
      </ColorCard>
    </div>
  );
}
