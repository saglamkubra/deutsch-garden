import { Check, ArrowUpRight } from "lucide-react";
import { WORLDS, type WorldId } from "@/lib/garden/catalog";
import { areaOf } from "@/lib/garden/worlds";
import { useGarden } from "@/lib/garden/store";
const descriptions = {
  a1: "Güneşli çayır, küçük başlangıçlar.",
  a2: "Pastel tepeler, rengârenk kanatlar.",
  b1: "Yaprakların arasında masalsı bir köşe.",
  b2: "Ay ışığında sakin bir çiçek bahçesi.",
  c1: "Cam kubbenin altında kristal parıltılar.",
  c2: "Altın kemerlerle çevrili kraliyet bahçen.",
};
export function GardenWorlds({
  active,
  disabled,
  onSelect,
}: {
  active: WorldId;
  disabled: boolean;
  onSelect: (world: WorldId) => void;
}) {
  const { state } = useGarden();
  return (
    <section
      className="garden-worlds playable-worlds"
      aria-labelledby="worlds-title"
    >
      <div className="world-heading">
        <div>
          <p className="eyebrow">ALTI DÜNYA, TEK BAHÇE ÇANTASI</p>
          <h2 id="worlds-title">Bugün hangi bahçende büyütelim?</h2>
        </div>
        <span>6 oynanabilir dünya</span>
      </div>
      <p className="world-explanation">
        Her dünyanın ekim ve süs alanları ayrı; tohumların, paran ve çiçek
        koleksiyonun ortak. Geçiş ücretsizdir. A1–C2 etiketleri bahçe temalarını
        belirtir; burada gezmek Almanca düzeyini değiştirmez.
      </p>
      <div className="world-cards" role="group" aria-label="Bahçe dünyası seç">
        {WORLDS.map((w) => {
          const count = areaOf(state, w.id).plots.filter((p) => p.plant).length;
          return (
            <button
              type="button"
              key={w.id}
              className={`world-card world-${w.id} ${active === w.id ? "world-selected" : ""}`}
              disabled={disabled}
              aria-pressed={active === w.id}
              onClick={() => onSelect(w.id)}
              aria-label={`${w.name} bahçesini aç`}
            >
              <span
                className={`world-thumbnail world-thumbnail-${w.id}`}
                aria-hidden="true"
              >
                <span>{w.symbol}</span>
                <i />
                <b />
              </span>
              <span className="world-card-body">
                <span className="world-level">
                  {w.level} · {count} ekili alan
                </span>
                <strong>{w.name}</strong>
                <span className="world-caption">{descriptions[w.id]}</span>
                <span className="world-open">
                  {active === w.id ? (
                    <>
                      <Check size={14} />
                      Şu an buradasın
                    </>
                  ) : (
                    <>
                      Bahçeyi aç
                      <ArrowUpRight size={14} />
                    </>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
