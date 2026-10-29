"use client";
import { useEffect, useState } from "react";
import {
  Droplets,
  Hand,
  Plus,
  Sparkles,
  Volume2,
  VolumeX,
  Backpack,
  Info,
  Check,
  ArrowRight,
} from "lucide-react";
import { PageHeading } from "@/components/garden/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LumiMascot,
  type LumiExpression,
} from "@/components/garden/lumi-mascot";
import {
  visibleGardenFlowers,
  DECORATIONS,
  GARDEN_CONFIG as config,
  flowerById,
  type DecorationId,
} from "@/lib/garden/catalog";
import {
  plantKey,
  growth,
  watering,
  stageNames,
  formatTime,
} from "@/lib/garden/model";
import { useGarden, gardenAction } from "@/lib/garden/store";
import { areaOf, selectedWorld } from "@/lib/garden/worlds";
import type { GardenCommand } from "@/lib/garden/model";
import { WORLDS } from "@/lib/garden/catalog";
import { FlowerArt, DecorationArt } from "./flower-art";
import { GardenScenery } from "./scenery";
import { Inventory } from "./inventory";
import { GardenWorlds } from "./worlds";
import { FlowerCollection } from "./collection";
import { GardenDialog } from "./dialog";
import { useGardenSound } from "./use-garden-sound";
const eventExpressions: Record<string, LumiExpression> = {
  harvested: "celebrating",
  planted: "excited",
  watered: "happy",
  bloomed: "celebrating",
  decorated: "encouraging",
  removed: "thinking",
  unlocked: "celebrating",
};
export function GardenGame() {
  const { state } = useGarden();
  return <GardenGameArea key={selectedWorld(state)} />;
}
function GardenGameArea() {
  const garden = useGarden();
  const { state, now, ready } = garden;
  const world = selectedWorld(state);
  const area = areaOf(state, world);
  const worldInfo = WORLDS.find((w) => w.id === world)!;
  const [switching, setSwitching] = useState(false);
  const act = (command: GardenCommand) =>
    gardenAction({ ...command, world } as GardenCommand);
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [decoration, setDecoration] = useState<DecorationId | null>(null);
  const [tool, setTool] = useState<"hand" | "water">("hand");
  const [soundNotice, setSoundNotice] = useState("");
  const { enable: enableSound, play: playSound } = useGardenSound();
  useEffect(() => {
    if (!state.muted && garden.event && garden.event !== "muted") playSound();
  }, [garden.eventAt, garden.event, state.muted, playSound]);
  const disabled = !ready || garden.mode === "readonly" || switching;
  const plot = area.plots.find((p) => p.id === selectedPlot);
  const plant = plot?.plant;
  const plantGrowth = plant ? growth(plant, now) : null;
  const waterInfo = plant ? watering(plant, now) : null;
  const activeEvent = now - garden.eventAt < 3500;
  const bloomCount = area.plots.filter(
    (p) => p.plant && growth(p.plant, now).stage === "bloom",
  ).length;
  const plantedCount = area.plots.filter((p) => p.plant).length;
  const message = !ready
    ? "Bahçeni hazırlıyorum…"
    : garden.notice || "Bir tohum ekerek başlayalım! 🌱";
  function openPlot(id: number) {
    if (disabled) return;
    setDecoration(null);
    if (tool === "water" && area.plots[id].plant) {
      act({ type: "water", plotId: id });
      return;
    }
    setSelectedPlot(id);
  }
  async function clickSlot(slot: number) {
    if (disabled) return;
    if (decoration) {
      if (await act({ type: "place", decoration, slot })) {
        setDecoration(null);
      }
      return;
    }
    setSelectedSlot(slot);
  }
  function closeDialog() {
    setSelectedPlot(null);
    setSelectedSlot(null);
  }
  function toggleSound() {
    if (state.muted && !enableSound()) {
      setSoundNotice(
        "Bu tarayıcıda bahçe sesleri açılamadı. Sessizce oynamaya devam edebilirsin.",
      );
      return;
    }
    setSoundNotice("");
    act({ type: "mute", value: !state.muted });
  }
  return (
    <div
      className="page-content garden-game-page"
      onClickCapture={() => {
        if (!state.muted) enableSound();
      }}
    >
      <PageHeading
        eyebrow="BİR TOHUM, BİNLERCE KÜÇÜK MUTLULUK"
        title="Benim Sihirli Bahçem 🌷"
        description="Öğrendikçe büyüyen, sana özel küçük bir dünya!"
      >
        <span className={`local-save-status mode-${garden.mode}`}>
          <span />
          {!ready
            ? "Bahçen yükleniyor"
            : garden.mode === "local"
              ? "Bu tarayıcıda kayıtlı"
              : garden.mode === "readonly"
                ? "Kayıt koruma modu"
                : "Yalnızca bu oturum"}
        </span>
      </PageHeading>
      <div className="garden-lumi-guide">
        <div className="garden-lumi-art">
          <LumiMascot
            expression={
              activeEvent && garden.event
                ? (eventExpressions[garden.event] ?? "happy")
                : "happy"
            }
            decorative
          />
        </div>
        <div>
          <strong>
            Lumi yanında <Sparkles size={14} />
          </strong>
          <p key={garden.noticeId} role="status" aria-live="polite">
            {message}
          </p>
        </div>
        <a href="#garden-rules" className="garden-rules-link">
          <Info size={17} />
          <span>Nasıl oynanır?</span>
        </a>
      </div>
      {garden.mode !== "local" && ready && (
        <p className="garden-storage-warning">
          {garden.mode === "readonly"
            ? "Mevcut veriyi korumak için ekim ve düzenleme kapalı."
            : "Bu oturumdaki oyun çalışır; tarayıcı kaydı kullanılamadığı için yeniden yüklemede ilerlemen kaybolabilir."}
        </p>
      )}
      <GardenWorlds
        active={world}
        disabled={disabled || garden.mode !== "local"}
        onSelect={async (id) => {
          setSwitching(true);
          try {
            await gardenAction({ type: "visit-world", world: id });
          } finally {
            setSwitching(false);
          }
        }}
      />
      <div className="garden-layout">
        <section
          className="garden-play-column"
          aria-label={`Etkileşimli ${worldInfo.name} bahçesi`}
        >
          <div className="garden-toolbar">
            <div className="garden-tool-options">
              <button
                type="button"
                aria-pressed={tool === "hand"}
                onClick={async () => {
                  setTool("hand");
                  setDecoration(null);
                }}
                disabled={disabled}
              >
                <Hand size={18} /> Ekim / İncele
              </button>
              <button
                type="button"
                aria-pressed={tool === "water"}
                onClick={async () => {
                  setTool("water");
                  setDecoration(null);
                }}
                disabled={disabled}
              >
                <Droplets size={18} /> Sulama kabı
              </button>
            </div>
            <div className="garden-toolbar-right">
              <a href="#garden-bag" aria-label="Çantama git">
                <Backpack size={19} />
                <span>Çantam</span>
              </a>
              <button
                type="button"
                onClick={toggleSound}
                disabled={disabled}
                aria-label={
                  state.muted ? "Bahçe seslerini aç" : "Bahçe seslerini kapat"
                }
                aria-pressed={!state.muted}
                title={state.muted ? "Sesler kapalı" : "Sesler açık"}
              >
                {state.muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>
            </div>
          </div>
          {soundNotice && (
            <p className="garden-sound-notice" role="status">
              {soundNotice}
            </p>
          )}
          <div
            className={`garden-playground theme-${world} tool-${tool} ${decoration ? "placing-decoration" : ""}`}
            aria-busy={!ready}
          >
            <GardenScenery world={world} />
            <div className="meadow-sign">
              <span>
                {worldInfo.symbol} {worldInfo.level} · {worldInfo.name}
              </span>
              <strong>
                {plantedCount === 0
                  ? "Küçük mucizeler burada başlar."
                  : `${plantedCount} tohum ekildi, ${bloomCount} çiçek açtı.`}
              </strong>
            </div>
            <div className="planting-field" aria-label="12 ekim alanı">
              {area.plots.map((p) => {
                const info = p.plant ? growth(p.plant, now) : null;
                const watered =
                  p.plant &&
                  activeEvent &&
                  garden.event === "watered" &&
                  garden.eventPlot === p.id;
                const justPlanted =
                  activeEvent &&
                  garden.event === "planted" &&
                  garden.eventPlot === p.id;
                const name = p.plant
                  ? flowerById(p.plant.species).name
                  : "Boş toprak";
                const canWater = p.plant && watering(p.plant, now).allowed;
                return (
                  <button
                    type="button"
                    key={p.id}
                    className={`garden-plot ${activeEvent && garden.event === "harvested" && garden.eventPlot === p.id ? "just-harvested" : ""} ${p.plant ? "occupied" : "empty"} ${info?.stage === "bloom" ? "is-bloom" : ""} ${watered ? "is-watering" : ""} ${justPlanted ? "just-planted" : ""}`}
                    disabled={disabled}
                    onClick={() => openPlot(p.id)}
                    aria-label={`${p.id + 1}. alan: ${name}${info ? ", " + stageNames[info.stage] : "; tohum ek"}${tool === "water" && p.plant ? "; sulamak için dokun" : ""}`}
                    title={
                      p.plant
                        ? `${name} · ${stageNames[info!.stage]}`
                        : "Bir tohum ekmek için dokun"
                    }
                  >
                    <span className="plot-soil" />
                    {activeEvent &&
                      garden.event === "harvested" &&
                      garden.eventPlot === p.id && (
                        <span className="harvest-burst" aria-hidden="true">
                          ✿ ✧ 🌸 ✦
                        </span>
                      )}
                    {p.plant ? (
                      <FlowerArt
                        key={info!.stage}
                        species={p.plant.species}
                        stage={info!.stage}
                      />
                    ) : (
                      <span className="empty-plot-icon">
                        <Plus size={21} />
                      </span>
                    )}
                    {p.plant && info?.stage !== "bloom" && (
                      <span
                        className={`plot-water-hint ${canWater ? "available" : ""}`}
                      >
                        <Droplets size={12} />
                      </span>
                    )}
                    {info?.stage === "bloom" && (
                      <span
                        className="plot-bloom-star plot-harvest-hint"
                        aria-hidden="true"
                      >
                        🌸 Topla
                      </span>
                    )}
                    <span className="plot-name">
                      {p.id + 1}. {p.plant ? name : "Tohum ek"}
                    </span>
                    {watered && (
                      <span className="watering-drops" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                    )}
                    {justPlanted && (
                      <span className="planting-sparkle" aria-hidden="true">
                        ✦
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div
              className="garden-decoration-rail"
              aria-label="Altı süs köşesi"
            >
              {area.placements.map((item, i) => (
                <button
                  type="button"
                  key={i}
                  disabled={disabled}
                  onClick={() => clickSlot(i)}
                  className={`decoration-slot ${item ? "has-decoration" : ""}`}
                  aria-label={`${i + 1}. süs köşesi: ${item ? DECORATIONS.find((d) => d.id === item)!.name : "boş"}${decoration ? "; seçili süsü buraya yerleştir" : ""}`}
                  title={
                    item
                      ? "Süsü taşımak veya çantana almak için dokun"
                      : "Buraya bir süs yerleştir"
                  }
                >
                  {item ? (
                    <DecorationArt kind={item} />
                  ) : (
                    <span>
                      <Plus size={15} />
                    </span>
                  )}
                  <small>{i + 1}. köşe</small>
                </button>
              ))}
            </div>
          </div>
          <div className="garden-ground-note" role="status">
            {decoration ? (
              <>
                <Sparkles size={16} />
                <span>
                  {DECORATIONS.find((d) => d.id === decoration)!.name} için
                  aşağıdaki boş süs köşelerinden birini seç.
                </span>
                <button type="button" onClick={() => setDecoration(null)}>
                  Vazgeç
                </button>
              </>
            ) : (
              <>
                <span className="garden-note-dot" />
                <span>
                  {tool === "water"
                    ? "Sulama kabı seçili: bir bitkiye dokun."
                    : "Boş toprağa dokun, bir tohum seç. Bitkine dokunarak gelişimini incele."}
                </span>
              </>
            )}
          </div>
          <section
            className="garden-rules"
            id="garden-rules"
            aria-labelledby="rules-title"
          >
            <h2 id="rules-title">
              <Droplets size={19} /> Biraz su, biraz sabır, bolca mutluluk.
            </h2>
            <div>
              <p>
                <strong>1 tohum → 1 çiçek</strong>
                <span>
                  Büyüme 45 sn.–2 dk. 45 sn. sürer. Sayfa kapalıyken de ilerler.
                </span>
              </p>
              <p>
                <strong>2 küçük sulama hakkı</strong>
                <span>
                  20 sn. arayla sulanır; her sulama 10 sn. kazandırır.
                </span>
              </p>
              <p>
                <strong>Çiçeklerin hep seninle</strong>
                <span>
                  Susuz kalınca ölmezler. Açınca topla; kalıcı koleksiyonunda
                  sakla.
                </span>
              </p>
            </div>
            <p className="garden-local-note">
              Başlangıç çantası hediye edilir; kelime, alıştırma, gramer,
              dinleme ve hikâye çalışmaları ek kaynak kazandırabilir. Misafir
              kaydı bu tarayıcıda tutulur. Hesabınla giriş yaptıysan cihazlar
              arasında devam etmek için Profilim’den bulut kaydının başarılı
              olduğunu kontrol et.
            </p>
          </section>
        </section>
        <Inventory
          state={state}
          selectedDecoration={decoration}
          onChooseDecoration={(id) => {
            setDecoration((d) => (d === id ? null : id));
            setTool("hand");
          }}
          disabled={disabled}
        />
      </div>
      <FlowerCollection />

      <GardenDialog
        open={selectedPlot !== null || selectedSlot !== null}
        title={
          selectedPlot !== null
            ? plant
              ? flowerById(plant.species).name
              : `${selectedPlot + 1}. alana ne ekelim?`
            : "Bahçenin süs köşesi"
        }
        onClose={closeDialog}
      >
        {selectedPlot !== null && !plant && (
          <>
            <p className="garden-dialog-intro">
              Çantandan bir tohum seç. Ekim için çantandan 1 tohum kullanılır.
            </p>
            <div className="seed-picker">
              {visibleGardenFlowers(state.unlockedFlowers).map((f) => (
                <button
                  type="button"
                  key={f.id}
                  disabled={
                    disabled ||
                    state.seeds[f.id] === 0 ||
                    !state.unlockedFlowers.includes(f.id)
                  }
                  onClick={async () => {
                    if (
                      await act({
                        type: "plant",
                        plotId: selectedPlot,
                        species: f.id,
                      })
                    )
                      closeDialog();
                  }}
                  aria-label={`${f.name} ek, ${state.seeds[f.id]} tohum mevcut`}
                >
                  <FlowerArt species={f.id} stage="bloom" />
                  <div>
                    <strong>{f.name}</strong>
                    <p>{f.description}</p>
                    <span>
                      {formatTime(f.durationMs)} · {state.seeds[f.id]} tohum
                    </span>
                  </div>
                  <span className="seed-plant-action">
                    {state.seeds[f.id] > 0 ? "Ek" : "Tükendi"}
                    <ArrowRight size={14} />
                  </span>
                </button>
              ))}
            </div>
            <p className="garden-dialog-footnote">
              Ekim sırasında ayrıca para harcanmaz; çantandan bir tohum
              kullanılır.
            </p>
          </>
        )}
        {plant && plantGrowth && waterInfo && (
          <div className="plant-details">
            <div className="plant-detail-art">
              {activeEvent &&
                garden.event === "watered" &&
                garden.eventPlot === selectedPlot && (
                  <span className="watering-drops" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              <FlowerArt species={plant.species} stage={plantGrowth.stage} />
              {plantGrowth.stage === "bloom" && (
                <span aria-hidden="true">✦</span>
              )}
            </div>
            <span className="plant-stage-chip">
              {plantGrowth.stage === "bloom" ? (
                <Check size={15} />
              ) : (
                <Sparkles size={15} />
              )}{" "}
              {stageNames[plantGrowth.stage]}
            </span>
            <p>{flowerById(plant.species).description}</p>
            <div className="plant-detail-progress">
              <span>{Math.floor(plantGrowth.progress * 100)}% büyüdü</span>
              <strong>
                {plantGrowth.remainingMs > 0
                  ? `Yaklaşık ${formatTime(plantGrowth.remainingMs)} kaldı`
                  : "Çiçeğin tamamen büyüdü!"}
              </strong>
            </div>
            <Progress
              value={plantGrowth.progress * 100}
              aria-label={`${flowerById(plant.species).name} büyümesi`}
            />
            <div className="plant-stage-path">
              {["Tohum", "Filiz", "Bitki", "Tomurcuk", "Çiçek"].map(
                (label, i) => (
                  <span
                    key={label}
                    className={
                      i <=
                      ["seed", "sprout", "growing", "bud", "bloom"].indexOf(
                        plantGrowth.stage,
                      )
                        ? "reached"
                        : ""
                    }
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
            {plantGrowth.stage === "bloom" && (
              <Button
                className="harvest-button"
                disabled={disabled || garden.mode !== "local"}
                onClick={async () => {
                  const key = plantKey(plant, selectedPlot!);
                  if (
                    await act({
                      type: "harvest",
                      plotId: selectedPlot!,
                      plantKey: key,
                    })
                  )
                    closeDialog();
                }}
              >
                🌸 Topla · Koleksiyonuma ekle
              </Button>
            )}
            <Button
              type="button"
              disabled={disabled || !waterInfo.allowed}
              onClick={() => act({ type: "water", plotId: selectedPlot! })}
            >
              <Droplets size={18} />
              {plantGrowth.stage === "bloom"
                ? "Çiçeğin mutlu, sulama gerekmiyor"
                : waterInfo.allowed
                  ? "Sula · 10 sn. katkı"
                  : waterInfo.remainingMs > 0
                    ? `${formatTime(waterInfo.remainingMs)} sonra sula`
                    : "İki sulama hakkı kullanıldı"}
            </Button>
            <p className="garden-dialog-footnote">
              {plant.waterCount} / {config.maxWaterings} sulama kullanıldı.{" "}
              {waterInfo.reason}
            </p>
            {plantGrowth.stage === "bloom" && (
              <p className="bloom-keepsake">
                Topladığında koleksiyonunda kalır ve toprağın yeni bir tohuma
                açılır. Dilersen toplamadan bahçende de bırakabilirsin. 🌸
              </p>
            )}
          </div>
        )}
        {selectedSlot !== null && (
          <div className="slot-details">
            {area.placements[selectedSlot] ? (
              <>
                <DecorationArt kind={area.placements[selectedSlot]!} />
                <h3>
                  {
                    DECORATIONS.find(
                      (d) => d.id === area.placements[selectedSlot],
                    )!.name
                  }
                </h3>
                <p>
                  Bu süs sana ait. Taşıyabilir veya kaybetmeden çantana
                  alabilirsin.
                </p>
                <div className="slot-actions">
                  <Button
                    type="button"
                    onClick={async () => {
                      setDecoration(area.placements[selectedSlot]);
                      closeDialog();
                    }}
                  >
                    Başka köşeye taşı
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      if (
                        await act({
                          type: "remove",
                          slot: selectedSlot,
                        })
                      )
                        closeDialog();
                    }}
                  >
                    Çantama al
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p>Buraya bir süs koyabilirsin. Çantandan birini seç.</p>
                <div className="slot-decor-picker">
                  {DECORATIONS.filter((d) =>
                    state.decorations.includes(d.id),
                  ).map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      onClick={async () => {
                        if (
                          await act({
                            type: "place",
                            decoration: d.id,
                            slot: selectedSlot,
                          })
                        )
                          closeDialog();
                      }}
                      disabled={disabled}
                    >
                      <DecorationArt kind={d.id} />
                      <strong>{d.name}</strong>
                      <small>
                        {area.placements.includes(d.id)
                          ? "Buraya taşı"
                          : "Yerleştir"}
                      </small>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </GardenDialog>
      {ready && activeEvent && garden.event && (
        <div className="garden-toast" key={garden.noticeId} aria-hidden="true">
          <span>
            {garden.event === "watered"
              ? "💧"
              : garden.event === "bloomed"
                ? "🌸"
                : "✨"}
          </span>
          {garden.notice}
        </div>
      )}
    </div>
  );
}
