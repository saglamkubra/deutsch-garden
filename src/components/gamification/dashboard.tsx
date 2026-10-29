"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  Trophy,
  Flame,
  Sparkles,
  ArrowUpRight,
  Check,
  RefreshCw,
  Gift,
  LockKeyhole,
} from "lucide-react";
import { ColorCard, PageHeading } from "@/components/garden/primitives";
import { GardenIllustration } from "@/components/garden/illustration";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BADGES,
  GAME_LEVELS,
  missionProgress,
  type Kind,
} from "@/lib/gamification/model";
import {
  useGamification,
  summary,
  claimAchievement,
  refreshGamification,
  dismissCelebration,
} from "@/lib/gamification/store";
const labels: Record<Kind, string> = {
  word: "Kelime çalışması",
  exercise: "Alıştırma tamamlandı",
  grammar: "Gramer konusu tamamlandı",
  listening: "Dinleme tamamlandı",
  story: "Hikâye tamamlandı",
  course: "Kelime dersi tamamlandı",
  conversation: "Lumi ile anlamlı pratik",
  diary: "Günlük yazma",
  bloom: "Bir çiçek açtı",
};
function dateLabel(day: string) {
  return new Date(day + "T12:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
export function BadgeArt({
  icon,
  locked = false,
}: {
  icon: string;
  locked?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 125"
      className={`game-badge-art ${locked ? "is-locked" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M32 77 22 120 48 109 60 123 66 80M60 80 69 123 84 109 108 120 89 77"
        fill="var(--badge-ribbon,#b8a4f4)"
      />
      <path
        d="M60 3 71 10 84 8 91 21 105 26 105 41 115 52 107 65 108 79 94 85 88 99 73 97 60 106 47 98 32 100 26 86 12 80 13 65 4 53 14 40 14 26 28 21 35 8 49 10Z"
        fill="var(--badge-bg,#ffe78f)"
      />
      <circle
        cx="60"
        cy="54"
        r="38"
        fill="#fffaf1"
        stroke="#fff"
        strokeWidth="4"
      />
      <text x="60" y="69" textAnchor="middle" fontSize="40">
        {locked ? "✧" : icon}
      </text>
    </svg>
  );
}
export function DailyMissionsPanel() {
  const v = useGamification(),
    s = summary(v),
    day = v.sources.exercises.gamification?.days[v.today];
  return (
    <section className="game-missions" aria-labelledby="game-missions-title">
      <div className="game-section-heading">
        <div>
          <p className="eyebrow">BUGÜNÜN KÜÇÜK KEŞİFLERİ</p>
          <h2 id="game-missions-title">Bugünün Görevleri 🌼</h2>
        </div>
        <span className="game-pill">
          {day?.level ?? v.sources.learning?.level ?? "A1"} ·{" "}
          {v.today ? dateLabel(v.today) : "Yükleniyor"}
        </span>
      </div>
      <div className="game-mission-grid">
        {day?.missions.map((m, i) => {
          const value = missionProgress(m, s.events, v.today),
            done = m.completedAt !== null;
          return (
            <ColorCard
              tone={["pink", "lavender", "sky", "yellow"][i % 4]}
              className="game-mission"
              key={m.id}
            >
              <span className="game-mission-number" aria-hidden="true">
                {done ? <Check size={20} /> : i + 1}
              </span>
              <h3>{m.title}</h3>
              <p>
                {done
                  ? "Bugünkü emeğin kaydedildi. Kendinle gurur duyabilirsin."
                  : "Kendi hızında ilerle. Yarım kalanlar da öğrenmenin bir parçası."}
              </p>
              <div className="game-progress-caption">
                <span>
                  {value} / {m.target}
                </span>
                <strong>{done ? "Tamamlandı" : "Seni bekliyor"}</strong>
              </div>
              <Progress
                value={(value / m.target) * 100}
                aria-label={`${m.title}: ${value} / ${m.target}`}
              />
              <Button variant="outline" asChild>
                <Link href={m.href}>
                  {done ? "Çalışmaya devam et" : "Bir küçük adım at"}
                  <ArrowUpRight size={15} />
                </Link>
              </Button>
            </ColorCard>
          );
        })}
      </div>
      {!day?.missions.length && (
        <div className="game-empty">
          <span aria-hidden="true">🌱</span>
          <p>
            {!v.ready
              ? "Görevlerin hazırlanıyor…"
              : v.notice ||
                "Seçili düzeyinde uygun görev içeriği henüz yok. Kelimelerim sayfasından içeriği bulunan bir düzey seçebilirsin."}
          </p>
        </div>
      )}
      <p className="game-subtle">
        Görevler yerel takvim gününde yenilenir. Ek görev XP’si verilmez;
        çalışmanın mevcut XP ve bahçe ödülleri korunur.
      </p>
    </section>
  );
}
export function LearningSummary() {
  const v = useGamification(),
    s = summary(v);
  return (
    <ColorCard className="daily-progress game-summary">
      <p className="eyebrow">GERÇEK ÖĞRENME KAYDIN</p>
      <h2>
        <Sparkles size={20} /> Bugün ne kadar büyüdük?
      </h2>
      <div className="game-summary-number">
        {v.ready ? s.xp : "—"}
        <small>toplam XP</small>
      </div>
      <h3>
        {s.level.icon} {s.level.title}
      </h3>
      <Progress
        value={s.level.percent}
        aria-label="Sonraki oyun seviyesine ilerleme"
      />
      <p>
        {s.level.next
          ? `${s.level.next.title} için ${Math.max(0, s.level.next.xp - s.xp)} XP daha.`
          : "Bütün oyun seviyesi unvanlarını açtın. Öğrenme yolculuğun sürüyor."}
      </p>
      <span className="game-pill">
        <Flame size={16} />
        {s.streak.current} günlük öğrenme serisi
      </span>
      <small>Oyun unvanı, resmî CEFR yeterlik düzeyi değildir.</small>
      <Button asChild variant="outline">
        <Link href="/basarilarim">
          Başarılarımı keşfet <ArrowUpRight size={16} />
        </Link>
      </Button>
    </ColorCard>
  );
}
export function GameCelebration() {
  const v = useGamification(
      !["/hediye-atolyesi", "/dogum-gunu"].includes(usePathname()),
    ),
    reduce = useReducedMotion(),
    badge = BADGES.find((b) => b.id === v.celebration);
  if (!badge) return null;
  return (
    <motion.aside
      className="game-celebration"
      role="status"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="game-confetti" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <span className="game-celebration-flower" aria-hidden="true">
        🌸
      </span>
      <div>
        <strong>Yeni bir rozetin çiçek açtı!</strong>
        <p>{badge.name} · Lumi: “Her küçük adımın kıymetli!”</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          void dismissCelebration();
        }}
      >
        Ne güzel!
      </Button>
    </motion.aside>
  );
}
export function AchievementsDashboard() {
  const v = useGamification(),
    s = summary(v),
    game = v.sources.exercises.gamification;
  const [busy, setBusy] = useState<string | null>(null),
    [notice, setNotice] = useState("");
  const [historyLimit, setHistoryLimit] = useState(15);
  const unlocked = Object.keys(game?.badges ?? {}).length;
  async function claim(id: string) {
    if (busy) return;
    setBusy(id);
    setNotice("");
    try {
      const ok = await claimAchievement(id);
      setNotice(
        ok
          ? "Ödülün bahçe çantana kaydedildi. 🌷"
          : "Ödül henüz aktarılamadı. Kaydın korunuyor; yeniden deneyebilirsin.",
      );
    } catch {
      setNotice(
        "Ödül kaydedilemedi. Mevcut puanların ve envanterin korunuyor.",
      );
    } finally {
      setBusy(null);
    }
  }
  return (
    <div className="page-content game-page">
      <PageHeading
        eyebrow="HER KÜÇÜK ADIMIN BİR ÇİÇEĞİ VAR"
        title="Başarılarım 🏆🌸"
        description="Emeklerini kutla, kendi ritminde büyü. Burada aceleye gerek yok."
      />
      <section className="game-hero">
        <div className="game-hero-copy">
          <span className="game-pill">
            <Trophy size={16} />
            Seviye {s.level.number} · Oyun unvanın
          </span>
          <h2>
            {s.level.title}
            <span aria-hidden="true">{s.level.icon}</span>
          </h2>
          <p>Bugünün küçük adımı, yarının rengârenk bahçesi.</p>
          <div className="game-hero-xp">
            <strong>{v.ready ? s.xp : "—"}</strong>
            <span>toplam XP</span>
          </div>
          <Progress
            value={s.level.percent}
            aria-label="Oyun seviyesinde ilerleme"
          />
          <p className="game-next-level">
            {s.level.next
              ? `${s.level.next.title} için ${s.level.next.xp - s.xp} XP kaldı.`
              : "En yüksek oyun unvanına ulaştın. Merakınla yeni keşiflere devam!"}
          </p>
          <small>
            Seçili Almanca düzeyin:{" "}
            <strong>{v.sources.learning?.level ?? "A1"}</strong>. Oyun seviyesi
            ve CEFR düzeyi birbirinden bağımsızdır.
          </small>
        </div>
        <GardenIllustration />
      </section>
      {v.notice && (
        <div className="game-alert" role="status">
          <p>{v.notice}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refreshGamification();
            }}
          >
            <RefreshCw size={15} />
            Yeniden kontrol et
          </Button>
        </div>
      )}
      <div className="game-stat-grid">
        <ColorCard tone="pink">
          <span>🏅 Kazanılan rozet</span>
          <strong>
            {unlocked}
            <small> / {BADGES.length}</small>
          </strong>
        </ColorCard>
        <ColorCard tone="peach">
          <span>🔥 Güncel öğrenme serisi</span>
          <strong>
            {s.streak.current}
            <small> gün</small>
          </strong>
        </ColorCard>
        <ColorCard tone="mint">
          <span>🌿 En uzun öğrenme serisi</span>
          <strong>
            {s.streak.longest}
            <small> gün</small>
          </strong>
        </ColorCard>
        <ColorCard tone="sky">
          <span>📚 Tamamlanan oturum</span>
          <strong>{s.events.filter((e) => e.session).length}</strong>
        </ColorCard>
      </div>
      <p className="game-kind-note">
        {s.streak.activeToday
          ? "Bugün kendine zaman ayırdın. Ne güzel!"
          : s.streak.current
            ? "Serin bugün küçük bir çalışmayla devam edebilir."
            : "Yeni bir başlangıç için güzel bir gün."}{" "}
        Ara vermek kazanılmış XP’ni, rozetlerini veya bahçeni silmez.
      </p>
      <DailyMissionsPanel />
      <section className="game-badges">
        <div className="game-section-heading">
          <div>
            <p className="eyebrow">EMEĞİNİN RENGÂRENK HATIRALARI</p>
            <h2>Rozet Bahçem</h2>
          </div>
          <span className="game-pill">{unlocked} rozet açtı</span>
        </div>
        <div className="game-badge-grid">
          {BADGES.map((b) => {
            const earned = game?.badges[b.id];
            return (
              <ColorCard
                tone={earned ? b.tone : "white"}
                key={b.id}
                className={`game-badge ${earned ? "earned" : "locked"}`}
              >
                <BadgeArt icon={b.icon} locked={!earned} />
                <span className="game-badge-state">
                  {earned ? (
                    <>
                      <Check size={13} />
                      Kazanıldı
                    </>
                  ) : (
                    <>
                      <LockKeyhole size={12} />
                      {b.id === "first-diary"
                        ? "Henüz etkin değil"
                        : "Keşfedilmeyi bekliyor"}
                    </>
                  )}
                </span>
                <h3>{b.name}</h3>
                <p>{b.description}</p>
                <small>
                  {earned
                    ? `Kazanıldığı gün: ${dateLabel(earned.earnedOn)}`
                    : "Küçük adımlarla ulaşabilirsin."}
                </small>
                <div className="game-badge-reward">
                  <Gift size={14} />
                  {b.reward}
                </div>
                {earned && (
                  <Button
                    disabled={!!busy || earned.claimed}
                    variant={earned.claimed ? "outline" : "default"}
                    onClick={() => {
                      void claim(b.id);
                    }}
                  >
                    {busy === b.id
                      ? "Kaydediliyor…"
                      : earned.claimed
                        ? "Ödül alındı"
                        : "Bahçe ödülümü al"}
                  </Button>
                )}
              </ColorCard>
            );
          })}
        </div>
        {notice && (
          <p className="game-alert" role="status">
            {notice}
          </p>
        )}
      </section>
      <div className="game-lower-grid">
        <ColorCard tone="white" className="game-milestones">
          <div className="game-section-heading">
            <h2>Öğrenme Kilometre Taşların</h2>
            <span aria-hidden="true">🌱</span>
          </div>
          <ol>
            {GAME_LEVELS.map((l, i) => (
              <li key={l.title} className={s.xp >= l.xp ? "reached" : ""}>
                <span className="game-milestone-icon" aria-hidden="true">
                  {l.icon}
                </span>
                <div>
                  <strong>
                    {i + 1}. {l.title}
                  </strong>
                  <small>
                    {l.xp} XP {s.xp >= l.xp ? "· Ulaşıldı" : "· Seni bekliyor"}
                  </small>
                </div>
                {s.xp >= l.xp && <Check size={18} />}
              </li>
            ))}
          </ol>
        </ColorCard>
        <ColorCard tone="white" className="game-history">
          <h2>Öğrenme Etkinliklerin</h2>
          <p className="game-subtle">
            Yalnızca kayıtlı etkinlikler. Saat bilgisi olmayan eski kayıtlarda
            gün gösterilir.
          </p>
          {s.events.length ? (
            <ol>
              {[...s.events]
                .sort(
                  (a, b) =>
                    b.day.localeCompare(a.day) || (b.at ?? 0) - (a.at ?? 0),
                )
                .slice(0, historyLimit)
                .map((e) => (
                  <li key={e.id}>
                    <span aria-hidden="true">
                      {e.kind === "bloom" ? "🌷" : "✦"}
                    </span>
                    <div>
                      <strong>{labels[e.kind]}</strong>
                      <small>
                        {dateLabel(e.day)}
                        {e.at !== null
                          ? " · " +
                            new Date(e.at).toLocaleTimeString("tr-TR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </small>
                    </div>
                  </li>
                ))}
            </ol>
          ) : (
            <div className="game-empty">
              🌱<p>İlk kelimen veya tamamlanan dersin burada çiçek açacak.</p>
              <Button asChild>
                <Link href="/kelimelerim">Kelime bahçeme git</Link>
              </Button>
            </div>
          )}
          {s.events.length > historyLimit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryLimit((n) => n + 15)}
            >
              Daha fazla etkinlik göster
            </Button>
          )}
        </ColorCard>
      </div>
      <details className="game-rules">
        <summary>XP ve ödüller nasıl hesaplanır?</summary>
        <p>
          Kelime pratiği: aynı kelimeye aynı yerel günde bir kez 5 XP, en fazla
          20 kelime / 100 XP. Alıştırma: doğru soruya aynı gün ve düzeyde bir
          kez 5 XP, tüm düzeylerde günlük en fazla 100 yeni XP. Yanlış yanıtlar
          da anlamlı çalışma sayılır, alıştırma XP’si getirmez.
        </p>
        <p>
          Mini ders ve hikâye: ilk tamamlamada 20 XP. Gramer ve dinleme: ilk
          tamamlamada 15 XP. Lumi: sunucunun doğruladığı, koşulları karşılayan
          konuşma için günde bir kez 15 XP. Önceki kazanımlar silinmez. Günlük
          hediye kaynaklı mevcut XP toplamda korunur, öğrenme serisini uzatmaz.
        </p>
        <p>
          Rozet ödülleri mevcut bahçe işlem kimlikleriyle bir kez verilir.
          Günlük görevler ikinci bir XP ödülü oluşturmaz. Günlük editörü
          bulunmadığından günlük yazma XP’si ve rozeti henüz etkin değildir.
        </p>
      </details>
    </div>
  );
}
