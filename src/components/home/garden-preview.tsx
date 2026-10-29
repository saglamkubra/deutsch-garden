import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";
import { ColorCard } from "@/components/garden/primitives";
import { GardenIllustration } from "@/components/garden/illustration";
import { Button } from "@/components/ui/button";
export function GardenPreview() {
  return (
    <ColorCard tone="mint" className="magic-garden">
      <div className="card-heading">
        <h2>
          Benim Sihirli Bahçem <span aria-hidden="true">🌷</span>
        </h2>
        <Flower2 size={22} />
      </div>
      <p>Tohumlarını ek, sula; küçük dünyanı kendi hızında büyüt.</p>
      <div className="magic-garden-scene">
        <GardenIllustration />
        <span className="garden-scene-tag">
          Hayallerin için büyüyecek bir yer.
        </span>
      </div>
      <div className="magic-garden-bottom">
        <div>
          <strong>Oynanabilir bahçen seni bekliyor</strong>
          <span>
            Bu görsel örnektir. Yerel oyunun Bahçem sayfasında kaydedilir.
          </span>
        </div>
        <Button asChild variant="outline">
          <Link href="/bahcem">
            Bahçemi Ziyaret Et
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </ColorCard>
  );
}
