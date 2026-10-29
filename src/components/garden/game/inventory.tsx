import Link from "next/link";
import { Coins, Droplets, Flower2, PackageCheck } from "lucide-react";
import {
  FLOWERS,
  visibleGardenFlowers,
  DECORATIONS,
  type DecorationId,
} from "@/lib/garden/catalog";
import { decorationWorld } from "@/lib/garden/worlds";
import { WORLDS } from "@/lib/garden/catalog";
import type { GardenState } from "@/lib/garden/model";
import { FlowerArt, DecorationArt } from "./flower-art";
export function Inventory({
  state,
  selectedDecoration,
  onChooseDecoration,
  disabled,
}: {
  state: GardenState;
  selectedDecoration: DecorationId | null;
  onChooseDecoration: (id: DecorationId) => void;
  disabled: boolean;
}) {
  return (
    <section className="garden-bag" id="garden-bag" aria-labelledby="bag-title">
      <div className="bag-heading">
        <div>
          <span className="eyebrow">HER ŞEY YANINDA</span>
          <h2 id="bag-title">Çantam 🎒</h2>
        </div>
        <span className="bag-coins">
          <Coins size={17} />
          {state.coins}
          <small>bahçe parası</small>
        </span>
      </div>
      <p className="bag-starter">
        <PackageCheck size={16} />{" "}
        {state.appliedRewards.some(
          (id) =>
            id.startsWith("daily-vocab:") ||
            id.startsWith("exercise:") ||
            id.startsWith("grammar:") ||
            id.startsWith("listening:") ||
            id.startsWith("story:") ||
            id.startsWith("course:") ||
            id.startsWith("lumi:"),
        )
          ? "Başlangıç çantası + öğrenme ödülleri"
          : "Başlangıç kaynakları · Henüz öğrenme ödülü yok"}
      </p>
      <h3>
        Tohumlarım{" "}
        <span>
          {FLOWERS.reduce((sum, f) => sum + state.seeds[f.id], 0)} adet
        </span>
      </h3>
      <div className="bag-seeds">
        {visibleGardenFlowers(state.unlockedFlowers).map((f) => (
          <div key={f.id} className="bag-seed">
            <FlowerArt species={f.id} stage="bloom" />
            <div>
              <strong>{f.name}</strong>
              <span>{state.seeds[f.id]} tohum</span>
            </div>
            <span className="seed-count">×{state.seeds[f.id]}</span>
          </div>
        ))}
      </div>
      <p className="bag-hint">Ekmek için bahçedeki boş bir toprağa dokun.</p>
      <h3>
        Süslerim <span>{state.decorations.length} çeşit</span>
      </h3>
      <p className="bag-hint">
        Bir süs seç, ardından bahçenin altındaki altı süs köşesinden birine
        dokun. Yerini değiştirmek ücretsiz.
      </p>
      <div className="bag-decorations">
        {DECORATIONS.filter((d) => state.decorations.includes(d.id)).map(
          (d) => {
            const location = decorationWorld(state, d.id);
            const placed = !!location;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onChooseDecoration(d.id)}
                disabled={disabled}
                aria-pressed={selectedDecoration === d.id}
                className={selectedDecoration === d.id ? "selected" : ""}
                title={d.description}
              >
                <DecorationArt kind={d.id} />
                <span>
                  <strong>{d.name}</strong>
                  <small>
                    {selectedDecoration === d.id
                      ? "Bir köşe seç"
                      : placed
                        ? `${WORLDS.find((w) => w.id === location)!.name} · Buraya taşı`
                        : "Çantada · Yerleştir"}
                  </small>
                </span>
              </button>
            );
          },
        )}
      </div>
      <div className="bag-tools">
        <span>
          <Droplets size={19} />
          <strong>Sulama kabım</strong>
          <small>Sınırsız su, sınırlı katkı</small>
        </span>
        <span>
          <Flower2 size={19} />
          <strong>{state.unlockedFlowers.length} açık çiçek</strong>
          <small>Altı başlangıç türü + dükkân çiçekleri</small>
        </span>
      </div>
      <p className="bag-hint">
        Bahçe paranı yeni tohumlar ve kalıcı süsler için kullanabilirsin.{" "}
        <Link href="/cicek-dukkani">Çiçek Dükkânım →</Link>
      </p>
    </section>
  );
}
