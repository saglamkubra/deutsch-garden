import type { Metadata } from "next";
import { PageHeading, DemoLabel } from "@/components/garden/primitives";
import { Reveal } from "@/components/garden/animated";
import { Welcome } from "@/components/home/welcome";
import { DailyMissions } from "@/components/home/missions";
import { DailyProgress } from "@/components/home/daily-progress";
import { GardenPreview } from "@/components/home/garden-preview";
import { QuickAccess } from "@/components/home/quick-access";
import { DailyWord } from "@/components/home/daily-word";
import "./adventure.css";
export const metadata: Metadata = { title: "Bugünkü Maceram" };
export default function Home() {
  return (
    <div className="page-content adventure-page">
      <PageHeading
        eyebrow="ALMANCA BAHÇENE HOŞ GELDİN"
        title="Bugünkü Maceram"
        description="Bir tutam merak, biraz Almanca ve yepyeni başlangıçlar."
      >
        <span className="adventure-day-label">
          ✿ Bugün kendin için çiçek aç.
        </span>
      </PageHeading>
      <Reveal>
        <Welcome />
      </Reveal>
      <aside className="adventure-demo">
        <DemoLabel>Senin öğrenme kaydın</DemoLabel>
        <p>
          XP, görevler ve öğrenme serisi gerçek kayıtlarından hesaplanır. Bulut
          eşitleme durumunu Profilim sayfasından takip edebilirsin.
        </p>
      </aside>
      <DailyMissions />
      <div className="adventure-middle">
        <Reveal>
          <DailyProgress />
        </Reveal>
        <Reveal>
          <GardenPreview />
        </Reveal>
      </div>
      <QuickAccess />
      <div className="adventure-bottom">
        <Reveal>
          <DailyWord />
        </Reveal>
        <Reveal>
          <section
            className="lumi-daily-note"
            aria-labelledby="daily-note-title"
          >
            <span className="note-big-flower" aria-hidden="true">
              ✿
            </span>
            <p className="eyebrow">KENDİ HIZINDA BÜYÜ</p>
            <h2 id="daily-note-title">
              Her gün mükemmel olmak
              <br />
              zorunda değilsin.
            </h2>
            <p>
              Bazen tek bir kelime, bazen küçük bir tekrar.
              <br />
              Önemli olan merakına yeniden merhaba demen.
            </p>
            <span className="note-signature">
              Sevgiyle, Lumi <span aria-hidden="true">♡</span>
            </span>
          </section>
        </Reveal>
      </div>
      <p className="adventure-endnote">
        Bu bahçede acele yok. Senin yolun, senin hızın, senin maceran. ✧
      </p>
    </div>
  );
}
