"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Flower2, Sparkles, X } from "lucide-react";
import { useGarden, gardenAction } from "@/lib/garden/store";
import {
  visibleGardenFlowers,
  flowerById,
  flowerRarity,
  RARITY_LABELS,
  GARDEN_CONFIG,
  type FlowerId,
} from "@/lib/garden/catalog";
import { areaOf, selectedWorld, flowerLocations } from "@/lib/garden/worlds";
import { WORLDS, type WorldId } from "@/lib/garden/catalog";
import type { GardenCommand } from "@/lib/garden/model";
import { isLearningActivity, CARE } from "@/lib/garden/learning-care";
import { flushDailyGiftXp } from "@/lib/gifts/store";
import { FlowerArt } from "./flower-art";
import { GardenDialog } from "./dialog";
import { Button } from "@/components/ui/button";
export function FlowerCollection() {
  const displayRef = useRef<HTMLDivElement>(null);
  const { state, ready, mode } = useGarden();
  const world = selectedWorld(state),
    area = areaOf(state, world);
  const act = (command: GardenCommand) =>
    gardenAction({ ...command, world } as GardenCommand);
  const [choice, setChoice] = useState<{
      species: FlowerId;
      from?: number;
      fromWorld?: WorldId;
    } | null>(null),
    [editing, setEditing] = useState<number | null>(null),
    [busy, setBusy] = useState(false);
  const placements =
    area.flowerPlacements ??
    Array<FlowerId | null>(GARDEN_CONFIG.decorationSlots).fill(null);
  const flowers = visibleGardenFlowers(state.unlockedFlowers);
  const discovered = flowers.filter(
    (f) => (state.collection?.[f.id]?.quantity ?? 0) > 0,
  ).length;
  const total = Object.values(state.collection ?? {}).reduce(
    (sum, c) => sum + (c?.quantity ?? 0),
    0,
  );
  const activities =
    state.learningGarden?.totalActivities ??
    state.appliedRewards.filter(isLearningActivity).length;
  const disabled = !ready || mode !== "local" || busy;
  useEffect(() => {
    if (ready) void flushDailyGiftXp();
  }, [ready]);
  function chooseFlower(value: {
    species: FlowerId;
    from?: number;
    fromWorld?: WorldId;
  }) {
    setChoice(value);
    setEditing(null);
    displayRef.current?.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  async function place(slot: number) {
    if (disabled) return;
    if (!choice) {
      if (placements[slot]) setEditing(slot);
      return;
    }
    setBusy(true);
    try {
      if (await act({ type: "display-flower", ...choice, slot }))
        setChoice(null);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className="flower-collection-section"
      aria-labelledby="flower-collection-title"
      id="flower-collection"
    >
      <div className="collection-heading">
        <div>
          <span className="eyebrow">TOPLADIĞIN HER ÇİÇEK BİR HATIRA</span>
          <h2 id="flower-collection-title">Çiçek Koleksiyonum 🌸</h2>
          <p>Topla, sakla, yeniden ek. Bahçenin hikâyesi burada biriksin.</p>
        </div>
        <div className="collection-count">
          <strong>
            {discovered} / {flowers.length}
          </strong>
          <span>tür keşfedildi · {total} çiçek toplandı</span>
        </div>
      </div>
      <div
        className="collection-progress"
        role="progressbar"
        aria-label="Keşfedilen çiçek türleri"
        aria-valuemin={0}
        aria-valuemax={flowers.length}
        aria-valuenow={discovered}
      >
        <span style={{ width: `${(100 * discovered) / flowers.length}%` }} />
      </div>
      <div className="collection-learning">
        <Sparkles size={25} />
        <div>
          <strong>Öğrendikçe bahçen de büyür.</strong>
          <p>
            Yeni ders, günlük kelime veya tamamlanan çalışma ödülü, o anda
            büyüyen çiçeklere {CARE.boostMs / 1000} saniye katkı verir. Günde en
            fazla {CARE.dailyBoosts} katkı; bir çiçekte en fazla{" "}
            {CARE.maxPlantBonusMs / 1000} saniye. Hızlandırma şart değil;
            zamanla da açarlar.
          </p>
          <span>
            {activities} kayıtlı öğrenme etkinliği · 5 etkinlikte Yıldız
            Zambağı, 12 etkinlikte Unutma Beni tohumu. Hak edilen tohumlar yeni
            öğrenme ödülüyle çantana gelir.
          </span>
        </div>
        <Link href="/derslerim">
          Öğrenmeye git <ArrowRight size={15} />
        </Link>
      </div>
      <div className="collection-display" id="flower-display" ref={displayRef}>
        <div className="collection-display-heading">
          <div>
            <span className="eyebrow">KOLEKSİYONUNDAN BAHÇENE</span>
            <h3>{WORLDS.find((w) => w.id === world)!.name} · Çiçek köşem</h3>
          </div>
          <span>Yerleştirmek koleksiyonunu azaltmaz.</span>
        </div>
        {choice ? (
          <div className="collection-choice" role="status">
            <Flower2 size={17} />
            <span>
              {flowerById(choice.species).name} için boş bir köşe seç.
              {choice.from !== undefined ? " Önceki köşesinden taşınacak." : ""}
            </span>
            <button
              aria-label="Çiçek yerleştirmekten vazgeç"
              onClick={() => setChoice(null)}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <p className="collection-display-hint">
            Albümden “Bahçede göster” seç. Yerleşmiş bir çiçeğe dokunarak taşı
            veya kaldır.
          </p>
        )}
        <div className="collection-display-slots">
          {placements.map((id, slot) => (
            <button
              key={slot}
              onClick={() => void place(slot)}
              disabled={disabled || (!!choice && !!id)}
              aria-label={`${slot + 1}. çiçek köşesi: ${id ? flowerById(id).name : "boş"}${choice ? "; seçili çiçeği yerleştir" : ""}`}
              className={id ? "filled" : ""}
            >
              {id ? <FlowerArt species={id} stage="bloom" /> : <span>＋</span>}
              <small>{slot + 1}. köşe</small>
            </button>
          ))}
        </div>
      </div>
      <div className="collection-album">
        {flowers.map((f) => {
          const collected = state.collection?.[f.id],
            quantity = collected?.quantity ?? 0,
            placed = flowerLocations(state, f.id).length,
            rarity = flowerRarity(f.id);
          return (
            <article
              className={`collection-card rarity-${rarity} ${quantity ? "discovered" : "mystery"}`}
              key={f.id}
            >
              <div className="collection-card-art">
                <FlowerArt species={f.id} stage="bloom" />
                {!quantity && <span aria-hidden="true">?</span>}
                <small>
                  {quantity ? `×${quantity}` : "Keşfedilmeyi bekliyor"}
                </small>
              </div>
              <div className="collection-card-copy">
                <span className="collection-rarity">
                  {RARITY_LABELS[rarity]}
                </span>
                <h3>{quantity ? f.name : "Gizemli çiçek"}</h3>
                <p>
                  {quantity
                    ? f.description
                    : ["starlily", "forgetmenot"].includes(f.id)
                      ? "Öğrenme kilometre taşlarında veya özel hediye kutularında bir tohum seni bekliyor."
                      : "Tohumunu ek, büyüt ve açınca topla. Bu sayfa o zaman renklenir."}
                </p>
                {quantity ? (
                  <>
                    <small>
                      {placed} tanesi dünyalarında · İlk toplama{" "}
                      {new Intl.DateTimeFormat("tr-TR", {
                        dateStyle: "medium",
                      }).format(collected!.firstHarvestedAt)}
                    </small>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={disabled || placed >= quantity}
                      onClick={() => {
                        chooseFlower({ species: f.id });
                      }}
                    >
                      {placed >= quantity
                        ? "Hepsi dünyalarında"
                        : "Bu bahçede göster"}
                    </Button>
                    {flowerLocations(state, f.id)
                      .filter((p) => p.world !== world)
                      .map((p) => (
                        <Button
                          key={`${p.world}-${p.slot}`}
                          variant="outline"
                          size="sm"
                          disabled={disabled}
                          onClick={() =>
                            chooseFlower({
                              species: f.id,
                              from: p.slot,
                              fromWorld: p.world,
                            })
                          }
                        >
                          {WORLDS.find((w) => w.id === p.world)!.name} → buraya
                          taşı
                        </Button>
                      ))}
                  </>
                ) : (
                  <Link
                    href={
                      ["starlily", "forgetmenot"].includes(f.id)
                        ? "/gunluk-hediyem"
                        : "/cicek-dukkani"
                    }
                  >
                    {["starlily", "forgetmenot"].includes(f.id)
                      ? "Günlük hediyemi gör"
                      : "Tohumlara göz at"}{" "}
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <GardenDialog
        open={editing !== null}
        title="Çiçek hatıram"
        onClose={() => setEditing(null)}
      >
        {editing !== null && placements[editing] && (
          <div className="collection-manage">
            <FlowerArt species={placements[editing]!} stage="bloom" />
            <h3>{flowerById(placements[editing]!).name}</h3>
            <p>
              Bu çiçek kalıcı koleksiyonunda kalır. Yerini değiştirmek veya
              kaldırmak çiçek sayını azaltmaz.
            </p>
            <Button
              disabled={disabled}
              onClick={() => {
                chooseFlower({ species: placements[editing]!, from: editing });
              }}
            >
              Başka köşeye taşı
            </Button>
            <Button
              variant="outline"
              disabled={disabled}
              onClick={async () => {
                setBusy(true);
                try {
                  if (await act({ type: "remove-flower", slot: editing }))
                    setEditing(null);
                } finally {
                  setBusy(false);
                }
              }}
            >
              Koleksiyonda sakla, buradan kaldır
            </Button>
          </div>
        )}
      </GardenDialog>
    </section>
  );
}
