import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="page-content">
      <section className="color-card placeholder-card">
        <div>
          <p className="eyebrow">404 · KÜÇÜK BİR SAPAK</p>
          <h1>Bu patika henüz açılmadı.</h1>
          <p>Bahçenin ana yoluna dönüp yeniden keşfedebilirsin.</p>
          <Button asChild>
            <Link href="/">Ana sayfaya dön</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
