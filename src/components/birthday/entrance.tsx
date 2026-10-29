"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBirthday } from "@/lib/birthday/client";
import { useGarden } from "@/lib/garden/store";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { BIRTHDAY_PHRASES } from "@/lib/birthday/model";
export function BirthdayEntrance() {
  const pathname = usePathname();
  return ["/hediye-atolyesi", "/dogum-gunu"].includes(pathname) ? null : (
    <LiveBirthdayEntrance />
  );
}
function LiveBirthdayEntrance() {
  const { status, now } = useBirthday(),
    garden = useGarden();
  if (!status || status.state === "hidden") return null;
  if (status.state === "countdown")
    return (
      <aside className="birthday-countdown-banner">
        <span>✿</span>
        <p>Bahçede küçük bir sürpriz hazırlanıyor…</p>
        <strong>
          {Math.max(
            1,
            Math.ceil(
              (Date.parse(status.date + "T00:00:00+03:00") - now) / 86400000,
            ),
          )}{" "}
          gün
        </strong>
      </aside>
    );
  const memory = garden.state.birthdayMemories?.find(
    (m) => m.event.id === status.event?.id,
  );
  if (status.state === "past" && !memory) return null;
  if (!status.event)
    return status.accessRequired ? (
      <aside className="birthday-memory-shortcut">
        <span>🌷</span>
        <p>Sana özel bir doğum günü köşesi hazır.</p>
        <Link href="/hatira-bahcem">Özel bahçeme gir →</Link>
      </aside>
    ) : null;
  if (memory)
    return (
      <aside className="birthday-memory-shortcut">
        <span>💌</span>
        <p>Doğum gününden bir bahçe dolusu hatıra.</p>
        <Link href="/hatira-bahcem">Hatıra Bahçem →</Link>
      </aside>
    );
  return (
    <aside className="birthday-entrance">
      <div className="birthday-banner-lumi">
        <LumiMascot expression="celebrating" decorative />
      </div>
      <div>
        <span className="eyebrow">BUGÜN BAHÇENDE ÖZEL BİR GÜN</span>
        <h2>
          İyi ki doğdun
          {status.event.recipientName ? `, ${status.event.recipientName}` : ""}!
          🌷
        </h2>
        <p>{status.event.greeting}</p>
      </div>
      <Link className="garden-button button-primary" href="/hatira-bahcem">
        🎁 Sürprizimi Aç
      </Link>
      <span className="birthday-banner-petal" aria-hidden="true">
        ✿
      </span>
    </aside>
  );
}
export function BirthdayLumiGreeting({
  onPhrase,
}: {
  onPhrase: (text: string) => void;
}) {
  const { status } = useBirthday();
  if (status?.state !== "active" || !status.event) return null;
  return (
    <section className="birthday-lumi-greeting">
      <LumiMascot expression="celebrating" decorative />
      <div>
        <strong>Lumi’den doğum günü notu 🌸</strong>
        <p>
          İyi ki doğdun! Bugün bir Almanca dilekle başlayalım mı? Bu hazır
          kutlama mesajı AI isteği yapmaz.
        </p>
        <div>
          {BIRTHDAY_PHRASES.map((p) => (
            <button key={p.de} onClick={() => onPhrase(p.de)} title={p.tr}>
              {p.de}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
