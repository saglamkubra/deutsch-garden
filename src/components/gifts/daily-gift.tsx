"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Clock3, Coins, Gift, Sparkles } from "lucide-react";
import { useGarden, claimDailyGift } from "@/lib/garden/store";
import { giftStatus, GIFT_POOL, type GiftClaim } from "@/lib/gifts/model";
import { flushDailyGiftXp } from "@/lib/gifts/store";
import { flowerById, DECORATIONS } from "@/lib/garden/catalog";
import { PageHeading } from "@/components/garden/primitives";
import { Button } from "@/components/ui/button";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { FlowerArt, DecorationArt } from "@/components/garden/game/flower-art";
export function GiftArt({ opened = false }: { opened?: boolean }) {
  return (
    <svg
      viewBox="0 0 300 280"
      className={`daily-gift-art ${opened ? "opened" : ""}`}
      aria-hidden="true"
    >
      <ellipse cx="150" cy="248" rx="96" ry="14" fill="#B193CB20" />
      <g className="gift-sparkles" fill="#EBC773">
        <path d="m42 77 5 14 14 5-14 5-5 14-5-14-14-5 14-5Zm213 48 4 10 10 4-10 4-4 10-4-10-10-4 10-4ZM222 30l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
      </g>
      <path
        d="M67 133h166v101q-83 23-166 0Z"
        fill="#CDB8ED"
        stroke="#AD91C8"
        strokeWidth="2"
      />
      <path d="M67 148h166v15H67Z" fill="#B49AD2" opacity=".3" />
      <path d="M136 134h28v113h-28Z" fill="#FFE7A0" />
      <path
        d="M73 223q25 6 43 4"
        fill="none"
        stroke="#DFD0F6"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <g className="gift-lid">
        <path
          d="M57 112q93-24 186 0v36q-93 18-186 0Z"
          fill="#DFC9F6"
          stroke="#BBA0D6"
          strokeWidth="2"
        />
        <path d="M134 103h31v52h-31Z" fill="#FFE7A0" />
        <path
          d="M148 104C68 78 89 37 123 61q22 18 25 43Zm5 0c76-34 56-71 24-47-15 12-23 31-24 47Z"
          fill="#FFBCD5"
          stroke="#DE9FBB"
          strokeWidth="2"
        />
        <path
          d="M148 96q-20-35-33-27m39 27q15-35 29-31"
          fill="none"
          stroke="#FFE1EE"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <ellipse cx="150" cy="103" rx="18" ry="12" fill="#FFCEB4" />
      </g>
      <g className="gift-heart" transform="translate(150 179)">
        <path d="M0 9C-36-10-18-31 0-16c18-15 36 6 0 25Z" fill="#FFF6DA" />
        <path d="M-6 0q6 5 12 0" fill="none" stroke="#C7A78C" strokeWidth="2" />
      </g>
    </svg>
  );
}
function RewardView({ claim }: { claim: GiftClaim }) {
  return (
    <div className={`gift-reward ${claim.rare ? "is-rare" : ""}`}>
      <div className="gift-reward-picture">
        {claim.seed ? (
          <FlowerArt species={claim.seed} stage="bloom" />
        ) : claim.decoration ? (
          <DecorationArt kind={claim.decoration} />
        ) : claim.xp ? (
          <span>⭐</span>
        ) : (
          <Coins size={56} />
        )}
      </div>
      <span className="eyebrow">
        {claim.rare ? "NADİR BİR BAHÇE SÜRPRİZİ" : "BUGÜNÜN KÜÇÜK MUTLULUĞU"}
      </span>
      <h3>
        {claim.seed
          ? `${claim.quantity} ${flowerById(claim.seed).name} tohumu`
          : claim.decoration
            ? DECORATIONS.find((d) => d.id === claim.decoration)!.name
            : claim.xp
              ? `${claim.xp} XP`
              : `${claim.coins} bahçe parası`}
      </h3>
      <p>
        {claim.seed
          ? "Tohumların çantanda. Ektiğinde yeni bir bahçe hikâyesi başlayacak."
          : claim.decoration
            ? "Kalıcı süsün çantanda; dilediğin köşeye yerleştirebilirsin."
            : claim.xp
              ? claim.xpDelivered
                ? "Deneyim puanın mevcut öğrenme kaydına eklendi."
                : "XP hakkın kayıtlı. Öğrenme kaydına teslimi bekliyor; tekrar açmana gerek yok."
              : "Paran mevcut bahçe cüzdanına eklendi."}
      </p>
    </div>
  );
}
export function DailyGift() {
  const garden = useGarden(),
    { state, ready, now } = garden;
  const status = giftStatus(state, ready ? now : 0);
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [celebrating, setCelebrating] = useState(false);
  const opening = useRef(false);
  const claim = status.claimed;
  useEffect(() => {
    if (ready) void flushDailyGiftXp();
  }, [ready]);
  useEffect(() => {
    if (!celebrating) return;
    const timer = setTimeout(() => setCelebrating(false), 1800);
    return () => clearTimeout(timer);
  }, [celebrating]);
  async function open() {
    if (opening.current || !ready || !status.available) return;
    opening.current = true;
    setBusy(true);
    setMessage("");
    try {
      const result = await claimDailyGift();
      setMessage(result.message);
      if (result.ok) {
        setCelebrating(!result.duplicate);
        await flushDailyGiftXp();
      }
    } catch {
      setMessage("Hediye açılamadı. Kaydın korunuyor; yeniden deneyebilirsin.");
    } finally {
      opening.current = false;
      setBusy(false);
    }
  }
  const remaining = Math.max(0, status.nextAt - now),
    hours = Math.floor(remaining / 3600000),
    minutes = Math.floor((remaining % 3600000) / 60000),
    seconds = Math.floor((remaining % 60000) / 1000);
  return (
    <div className="page-content daily-gift-page">
      <PageHeading
        eyebrow="HER GÜN YENİ BİR GÜLÜMSEME"
        title="Günlük Hediyem 🎁"
        description="Bir küçük sürpriz, bahçene kocaman bir mutluluk. Her gün bir kutu, tamamen ücretsiz."
      >
        <div className="daily-wallet">
          <Coins size={20} />
          <strong>{ready ? state.coins : "—"}</strong> bahçe parası
        </div>
      </PageHeading>
      <section
        className={`daily-gift-hero ${claim ? "is-open" : ""} ${celebrating ? "is-celebrating" : ""}`}
      >
        <div className="gift-confetti" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
        <div className="daily-gift-copy">
          <span className="gift-available-chip">
            {!ready ? (
              "Kutun hazırlanıyor…"
            ) : claim ? (
              <>
                <Check size={14} /> Bugünün hediyesi sende
              </>
            ) : status.available ? (
              <>
                <Sparkles size={14} /> Bugünün kutusu seni bekliyor
              </>
            ) : (
              "Yeni hediye günü bekleniyor"
            )}
          </span>
          <h2>
            {claim ? (
              <>
                Biraz sihir,
                <br />
                <em>tam da senin için.</em>
              </>
            ) : (
              <>
                Kurdeleyi çöz,
                <br />
                <em>mutluluğu keşfet.</em>
              </>
            )}
          </h2>
          <p>
            İçinden bahçe parası, XP, tohum veya kalıcı bir süs çıkabilir. Her
            yedinci kutunda özel bir tohum garanti; aralıksız gelmen gerekmez.
          </p>
          <div className="gift-lumi-note">
            <LumiMascot
              expression={claim ? "celebrating" : "excited"}
              decorative
            />
            <span>
              “Hızın değil, her küçük adımın değerli. Bu hediye sadece seni
              gülümsetmek için!”
            </span>
          </div>
          {!claim && (
            <Button
              onClick={() => void open()}
              disabled={
                !ready || busy || !status.available || garden.mode !== "local"
              }
            >
              <Gift size={18} />
              {busy ? "Hediyen güvenle açılıyor…" : "Kutumu aç ✨"}
            </Button>
          )}
          {claim && (
            <Button asChild>
              <Link href="/bahcem">
                Hediyemle bahçeme git <ArrowRight size={16} />
              </Link>
            </Button>
          )}
          <small>Gerçek para veya satın alma şartı yok.</small>
        </div>
        <div className="gift-stage">
          <div className="gift-halo" />
          <GiftArt opened={!!claim} />
          {claim && <span className="gift-opened-seal">✓ Açıldı</span>}
        </div>
      </section>
      {message && (
        <p className="daily-gift-notice" role="status">
          {message}
        </p>
      )}
      {ready && garden.mode !== "local" && (
        <p className="daily-gift-notice" role="status">
          Hediyeyi tekrar vermemek ve kaynaklarını korumak için kalıcı tarayıcı
          kaydı gerekiyor. {garden.notice}
        </p>
      )}
      <div className="daily-gift-bottom">
        <section className="gift-today" aria-labelledby="gift-today-title">
          <h2 id="gift-today-title">
            {claim ? "Günün hediyesi" : "Kutunda neler saklı?"}
          </h2>
          {claim ? (
            <RewardView claim={claim} />
          ) : (
            <div className="gift-possibilities">
              <span>
                🪙 <strong>Bahçe parası</strong>
              </span>
              <span>
                ⭐ <strong>Deneyim puanı</strong>
              </span>
              <span>
                🌱 <strong>Çiçek tohumları</strong>
              </span>
              <span>
                🏮 <strong>Kalıcı süsler</strong>
              </span>
              <span>
                🌙 <strong>Nadir keşifler</strong>
              </span>
            </div>
          )}
          {claim?.xp && !claim.xpDelivered ? (
            <Button variant="outline" onClick={() => void flushDailyGiftXp()}>
              XP teslimini yeniden dene
            </Button>
          ) : null}
        </section>
        <section
          className="gift-countdown"
          aria-labelledby="gift-countdown-title"
        >
          <Clock3 size={26} />
          <span className="eyebrow">YARIN YİNE KÜÇÜK BİR SÜRPRİZ</span>
          <h2 id="gift-countdown-title">
            {ready && status.available
              ? "Bugünkü kutun hazır"
              : "Bir sonraki kutuna"}
          </h2>
          <div
            className="gift-clock"
            aria-label="Sonraki hediye için kalan süre"
          >
            {[
              [hours, "saat"],
              [minutes, "dakika"],
              [seconds, "saniye"],
            ].map(([value, label]) => (
              <span key={label}>
                <strong>{ready ? String(value).padStart(2, "0") : "—"}</strong>
                <small>{label}</small>
              </span>
            ))}
          </div>
          <p>
            Kutular Türkiye saatiyle 00.00’da yenilenir. Kaçırılan günler
            birikmez; seri zorunluluğu yok.
          </p>
          <div className="gift-guarantee">
            <Sparkles size={15} />
            <span>
              Bir sonraki garantili özel tohumu almana{" "}
              <strong>{7 - (status.count % 7)} kutu</strong> kaldı.
            </span>
          </div>
        </section>
      </div>
      <details className="gift-details">
        <summary>Sürprizler ve kayıt hakkında</summary>
        <p>
          Normal kutularda olasılıklar:{" "}
          {GIFT_POOL.map((p) => `${p.label} %${p.weight}`).join("; ")}. Her
          yedinci açılışta bu seçim yerine Yıldız Zambağı veya Unutma Beni
          tohumu verilir. Zaten sahip olduğun süs çıkarsa 10 bahçe parası
          alırsın. Hiçbir hediye için para harcanmaz.
        </p>
        <p>
          Hediye ve envanter bu tarayıcıda aynı kayda yazılır. Sayfayı
          yenilemek, farklı sekme açmak veya düğmeye tekrar basmak ikinci hediye
          vermez. Hesabınla cihazlar arasında devam etmeden önce Profilim’den
          bulut kaydını kontrol et. Misafir kayıtları cihazda kalır; cihaz
          saatini veya tarayıcı verisini elle değiştirmeye karşı sunucu
          doğrulaması bulunmaz.
        </p>
      </details>
      <section className="gift-history">
        <h2>
          Hediye hatıralarım <span>{status.count} kutu</span>
        </h2>
        {state.dailyGifts?.length ? (
          <ul>
            {[...state.dailyGifts]
              .reverse()
              .slice(0, 10)
              .map((c) => (
                <li key={c.day}>
                  <span>🎁</span>
                  <strong>
                    {new Intl.DateTimeFormat("tr-TR", {
                      dateStyle: "medium",
                    }).format(c.at)}
                  </strong>
                  <span>
                    {c.seed
                      ? `${c.quantity} ${flowerById(c.seed).name} tohumu`
                      : c.decoration
                        ? DECORATIONS.find((d) => d.id === c.decoration)!.name
                        : c.xp
                          ? `${c.xp} XP`
                          : `${c.coins} bahçe parası`}
                  </span>
                  {c.rare && <small>Nadir</small>}
                </li>
              ))}
          </ul>
        ) : (
          <p>İlk sürprizin burada yerini bekliyor.</p>
        )}
      </section>
    </div>
  );
}
