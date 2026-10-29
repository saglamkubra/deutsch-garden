"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Headphones,
  Play,
  Heart,
  Check,
  Clock,
  Search,
  ArrowRight,
  Sun,
  Bookmark,
  Music2,
} from "lucide-react";
import { useLearning } from "@/lib/learning/store";
import {
  useListening,
  assignListeningDay,
  toggleListeningFavorite,
  retryListeningRewards,
} from "@/lib/listening/store";
import { episodes, episodeById, formatDuration } from "@/lib/listening/content";
import { filterEpisodes, coverage, needsReview } from "@/lib/listening/engine";
import { CATEGORIES, type Episode } from "@/lib/listening/types";
import { LEVELS, type Level } from "@/lib/learning/types";
import { PageHeading } from "@/components/garden/primitives";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { Button } from "@/components/ui/button";
const levelLabels = {
  A1: "İlk sesler",
  A2: "Yeni sohbetler",
  B1: "Hikâyeler açılıyor",
  B2: "Derin sohbetler",
  C1: "İnce anlamlar",
  C2: "Dilin melodisi",
};
export function ListeningLibrary() {
  const learning = useLearning(),
    listening = useListening(),
    { state, ready, readonly, notice } = listening;
  const [chosen, setChosen] = useState<Level | null>(null),
    [category, setCategory] = useState(""),
    [status, setStatus] = useState(""),
    [duration, setDuration] = useState(""),
    [favorites, setFavorites] = useState(false),
    [search, setSearch] = useState("");
  const level = chosen ?? learning.state.level,
    date = learning.date;
  useEffect(() => {
    if (ready && date) void assignListeningDay(level);
  }, [ready, date, level]);
  const daily = state.daily[date + ":" + level],
    recommended = daily?.episodeId ? episodeById(daily.episodeId) : undefined;
  const pool = episodes.filter((e) => e.level === level),
    featured =
      pool.find((e) => state.progress[e.id]?.completedAt == null) ?? pool[0];
  const shown = filterEpisodes(state, {
    level,
    category,
    duration,
    status,
    favorites,
    search,
  });
  const completed = pool.filter(
    (e) => state.progress[e.id]?.completedAt != null,
  ).length;
  const recent = Object.entries(state.progress)
    .sort((a, b) => b[1].lastAt - a[1].lastAt)
    .map(([id]) => episodeById(id))
    .filter((e): e is Episode => !!e)
    .slice(0, 3);
  const suggestions = [...pool]
    .sort(
      (a, b) =>
        Number(needsReview(state, b.id)) - Number(needsReview(state, a.id)) ||
        Number(state.progress[a.id]?.completedAt != null) -
          Number(state.progress[b.id]?.completedAt != null),
    )
    .slice(0, 3);
  return (
    <div
      className={
        "page-content listening-library listening-theme-" + level.toLowerCase()
      }
    >
      <PageHeading
        eyebrow="KULAK VER, BAHÇEN ÇİÇEK AÇSIN"
        title="Dinleme Kulübüm 🎧🌷"
        description="Dinle, keşfet, öğren! Almancanın melodisini yakala."
      />
      <section className="listening-hero">
        <div>
          <span className="listening-eyebrow">HER CÜMLE YENİ BİR KEŞİF</span>
          <h2>
            Almancaya
            <br />
            biraz kulak verelim.
          </h2>
          <p>
            Özgün küçük hikâyeler, renkli kelimeler ve Lumi ile sana ait bir
            dinleme molası.
          </p>
          <div className="listening-hero-chips">
            <span>
              <Headphones size={15} />
              {pool.length} sesli ders
            </span>
            <span>
              <Check size={15} />
              {completed} tamamlanan
            </span>
            <span>
              <Bookmark size={15} />
              {state.favorites.length} kaydedilen
            </span>
          </div>
        </div>
        <ListeningIllustration />
      </section>
      <nav className="listening-levels" aria-label="Dinleme düzeyi">
        {LEVELS.map((l) => (
          <button
            key={l}
            aria-pressed={l === level}
            onClick={() => setChosen(l)}
          >
            <strong>{l}</strong>
            <span>{levelLabels[l]}</span>
          </button>
        ))}
      </nav>
      <p className="listening-level-note">
        Öneri bu dinleme düzeyine göre seçilir. Buradaki seçim ders düzeyini
        değiştirmez.
      </p>
      {notice && (
        <p className="listening-notice" role="status">
          {notice}
        </p>
      )}
      {state.claims.some((c) => !c.delivered) && (
        <div className="listening-notice">
          Kaydedilmiş ödüllerin aktarılmayı bekliyor.{" "}
          <Button
            variant="outline"
            onClick={() => void retryListeningRewards()}
          >
            Yeniden dene
          </Button>
        </div>
      )}
      <div className="listening-feature-row">
        <section className="listening-feature">
          <span className="listening-eyebrow">KULÜPTEN BİR SEÇKİ</span>
          {featured ? (
            <>
              <span className="listening-feature-art" aria-hidden="true">
                {featured.icon}
              </span>
              <div>
                <span className="listening-episode-meta">
                  {level} · {formatDuration(featured.audio!.duration)} · Yapay
                  ses
                </span>
                <h2>{featured.title}</h2>
                <p lang="de">{featured.german}</p>
                <Button asChild>
                  <Link href={"/dinleme-kulubu/" + featured.id}>
                    <Play size={16} />
                    Dinlemeye başla
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="listening-empty-feature">
              <Headphones size={36} />
              <h2>{level} içerikleri henüz hazırlanmadı.</h2>
              <p>
                Bu seçimde oynatılabilir içerik bulunamadı. Diğer filtreleri
                veya seviyeleri deneyebilirsin; ses kaydı olmayan kartlar konu
                planıdır.
              </p>
              <Button onClick={() => setChosen("A1")}>
                A1 seslerini keşfet <ArrowRight size={17} />
              </Button>
            </div>
          )}
        </section>
        <section className="listening-daily">
          <div className="listening-daily-sun">
            <Sun size={28} />
          </div>
          <span className="listening-eyebrow">GÜNÜN DİNLEME MACERASI 🌞</span>
          <h2>{recommended?.title ?? "Bu düzey için öneri henüz yok"}</h2>
          <p>
            {recommended
              ? needsReview(state, recommended.id)
                ? "Tekrar isteyen bu dinlemeye birlikte kulak verelim."
                : state.progress[recommended.id]?.completedAt != null
                  ? "Daha önce tamamladığın bir içeriği yeniden keşfet."
                  : "Bugüne özel küçük bir ses yolculuğu seni bekliyor."
              : "Hazır olmayan bir düzey için bölüm veya süre uydurulmaz."}
          </p>
          {recommended && (
            <Link href={"/dinleme-kulubu/" + recommended.id}>
              Bugünkü macerayı aç <ArrowRight size={16} />
            </Link>
          )}
          <small>
            {date || "Yerel gün yükleniyor"} · Gün içinde sabit kalır.
          </small>
        </section>
      </div>
      {recent.length > 0 && (
        <section className="listening-recent">
          <div className="listening-section-title">
            <h2>Son dinlediklerim</h2>
            <span>Kaldığın yerden devam et</span>
          </div>
          <div>
            {recent.map((e) => (
              <Link key={e.id} href={"/dinleme-kulubu/" + e.id}>
                <span>{e.icon}</span>
                <div>
                  <strong>{e.title}</strong>
                  <small>
                    {Math.round(coverage(state, e.id) * 100)}% ses bölümü
                    dinlendi
                    {state.progress[e.id]?.completedAt != null
                      ? " · Tamamlandı"
                      : ""}
                  </small>
                </div>
                <Play size={17} />
              </Link>
            ))}
          </div>
        </section>
      )}
      <div className="listening-section-title">
        <h2>Hangi ses patikasına çıkalım?</h2>
        <span>9 kategori</span>
      </div>
      <div className="listening-categories">
        {Object.entries(CATEGORIES).map(([id, label], i) => {
          const count = pool.filter((e) => e.category === id).length;
          return (
            <button
              key={id}
              className={"listening-category category-" + (i % 4)}
              aria-pressed={category === id}
              onClick={() => setCategory(category === id ? "" : id)}
            >
              <Music2 size={18} />
              <strong>{label}</strong>
              <small>{count} hazır dinleme</small>
            </button>
          );
        })}
      </div>
      <div className="listening-filters">
        <label className="listening-search">
          <Search size={17} />
          <span className="sr-only">Dinleme ara</span>
          <input
            placeholder="Bir hikâye, bir konu ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Dinleme süresi</span>
          <select
            aria-label="Dinleme süresi"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">Tüm süreler</option>
            <option value="short">30 sn. altı</option>
            <option value="medium">30–60 sn.</option>
            <option value="long">1 dk. ve üzeri</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Dinleme durumu</span>
          <select
            aria-label="Dinleme durumu"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Tüm durumlar</option>
            <option value="ready">Oynatılabilir</option>
            <option value="started">Devam edenler</option>
            <option value="completed">Tamamlananlar</option>
            <option value="review">Tekrar isteyenler</option>
            <option value="planned">Konu planları</option>
          </select>
        </label>
        <button
          aria-pressed={favorites}
          onClick={() => setFavorites(!favorites)}
        >
          <Heart size={16} />
          Kaydettiklerim
        </button>
      </div>
      <div className="listening-section-title">
        <h2>{level} dinleme kitaplığım</h2>
        <span>
          {shown.filter((e) => e.audio).length} sesli ders ·{" "}
          {shown.filter((e) => !e.audio).length} konu planı
        </span>
      </div>
      <div className="listening-episode-grid">
        {shown.map((e, i) => (
          <article
            key={e.id}
            className={"listening-episode episode-tone-" + (i % 4)}
          >
            <div className="listening-episode-top">
              <span>{CATEGORIES[e.category]}</span>
              {e.audio && (
                <button
                  disabled={!ready || readonly}
                  aria-pressed={state.favorites.includes(e.id)}
                  aria-label={e.title + " dinlemesini kaydet"}
                  onClick={() => void toggleListeningFavorite(e.id)}
                >
                  <Heart
                    size={19}
                    fill={
                      state.favorites.includes(e.id) ? "currentColor" : "none"
                    }
                  />
                </button>
              )}
            </div>
            <span className="listening-episode-art" aria-hidden="true">
              {e.icon}
            </span>
            <h3>{e.title}</h3>
            <p lang={e.german ? "de" : "tr"}>{e.german || e.summary}</p>
            <div className="listening-episode-meta">
              {e.audio ? (
                <>
                  <Clock size={14} />
                  {formatDuration(e.audio.duration)} · {e.quiz.length} soru ·
                  Yapay ses
                </>
              ) : (
                "Hazırlanacak konu · Ses dosyası yok"
              )}
            </div>
            {e.audio ? (
              <>
                <div className="listening-card-progress">
                  <span
                    style={{
                      width: Math.round(coverage(state, e.id) * 100) + "%",
                    }}
                  />
                </div>
                <Link href={"/dinleme-kulubu/" + e.id}>
                  {state.progress[e.id]?.completedAt != null ? (
                    <>
                      <Check size={16} />
                      Tamamlandı · Tekrar dinle
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      {state.progress[e.id] ? "Devam et" : "Kulak ver"}
                    </>
                  )}
                  <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <span className="listening-planned">
                Henüz oynatılabilir bölüm değildir.
              </span>
            )}
          </article>
        ))}
      </div>
      {!shown.length && (
        <div className="listening-empty">
          <Headphones size={36} />
          <h3>Bu filtrelerde bir dinleme yok.</h3>
          <p>Süre veya kategori filtresini değiştirebilirsin.</p>
          <Button
            variant="outline"
            onClick={() => {
              setCategory("");
              setDuration("");
              setStatus("");
              setFavorites(false);
              setSearch("");
            }}
          >
            Filtreleri temizle
          </Button>
        </div>
      )}
      {suggestions.length > 0 && (
        <section className="listening-suggestions">
          <div className="listening-section-title">
            <h2>Bir sonraki küçük keşfin</h2>
            <span>İlerlemene göre basit öneriler</span>
          </div>
          <div>
            {suggestions.map((e) => (
              <Link href={"/dinleme-kulubu/" + e.id} key={e.id}>
                <span>{e.icon}</span>
                <strong>{e.title}</strong>
                <small>
                  {needsReview(state, e.id)
                    ? "Tekrar için önerildi"
                    : state.progress[e.id]?.completedAt != null
                      ? "Yeniden dinleyebilirsin"
                      : "Keşfetmeye hazır"}
                </small>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="listening-lumi">
        <LumiMascot expression="encouraging" decorative />
        <div>
          <strong>İlk dinleyişte her kelimeyi anlaman gerekmiyor! 🌷</strong>
          <p>
            Önce dinle, sonra metni aç. Birkaç kelimeyi yakalamak bile güzel bir
            başlangıç.
          </p>
        </div>
      </section>
      <p className="listening-level-note">
        Özgün eğitim metinleri ve yerel üretilmiş yapay ses kullanılır.
        Profesyonel podcast veya insan ses kaydı değildir. İlerleme bu
        tarayıcıda saklanır.
      </p>
    </div>
  );
}
function ListeningIllustration() {
  return (
    <svg
      className="listening-illustration"
      viewBox="0 0 300 240"
      aria-hidden="true"
    >
      <ellipse cx="150" cy="217" rx="95" ry="14" fill="#A18BBE" opacity=".15" />
      <circle cx="151" cy="122" r="83" fill="#FFF4CF" />
      <path
        d="M77 125v-15a74 74 0 0 1 148 0v15"
        fill="none"
        stroke="#A38AD5"
        strokeWidth="19"
        strokeLinecap="round"
      />
      <rect x="63" y="108" width="39" height="68" rx="18" fill="#B8A4F4" />
      <rect x="204" y="108" width="39" height="68" rx="18" fill="#B8A4F4" />
      <path
        d="M150 207v-59"
        stroke="#79B493"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M148 190c-33-3-35-27-35-27 24-5 36 11 35 27m7-7c31-3 32-23 32-23-23-5-34 8-32 23"
        fill="#A8E6CF"
      />
      <g fill="#FFB7D5">
        <circle cx="150" cy="96" r="22" />
        <circle cx="124" cy="114" r="22" />
        <circle cx="134" cy="144" r="22" />
        <circle cx="168" cy="144" r="22" />
        <circle cx="179" cy="112" r="22" />
      </g>
      <circle cx="150" cy="122" r="25" fill="#FFE78F" />
      <circle cx="141" cy="119" r="3" fill="#725078" />
      <circle cx="160" cy="119" r="3" fill="#725078" />
      <path
        d="M144 130q7 8 14 0"
        fill="none"
        stroke="#725078"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="m46 47 4 10 11 3-11 4-4 10-4-10-11-4 11-3zm213 27 4 9 10 4-10 3-4 10-4-10-10-3 10-4z"
        fill="#C9ABE9"
      />
      <path
        d="M259 157v-22l15-5v23m-15-17 15-5"
        fill="none"
        stroke="#E79AB9"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx="253" cy="160" rx="8" ry="6" fill="#E79AB9" />
      <ellipse cx="268" cy="155" rx="8" ry="6" fill="#E79AB9" />
    </svg>
  );
}
