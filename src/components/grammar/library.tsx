"use client";
import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Search,
  ArrowRight,
  Check,
  Flower2,
  Clock,
  Sparkles,
} from "lucide-react";
import { topics } from "@/lib/grammar/content";
import { categories } from "@/lib/grammar/types";
import { filterTopics } from "@/lib/grammar/engine";
import {
  useGrammar,
  toggleBookmark,
  retryGrammarRewards,
} from "@/lib/grammar/store";
import { LEVELS } from "@/lib/learning/types";
import { PageHeading } from "@/components/garden/primitives";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { Button } from "@/components/ui/button";
const worlds = {
  A1: ["🌷", "İlk Filizler", "Temelleri birlikte ekelim."],
  A2: ["🦋", "Kelebek Patikası", "Cümlelerin yeni kanatlar kazansın."],
  B1: ["🌳", "Cümle Ormanı", "Düşüncelerini birbirine bağla."],
  B2: ["🌙", "Ay Işığı Kitaplığı", "Anlatımını derinleştir."],
  C1: ["💎", "Kristal Sözcükler", "İnce anlamları keşfet."],
  C2: ["👑", "Üslup Bahçesi", "Dilin farklı renklerini tanı."],
};
export function GrammarLibrary() {
  const { state, ready, readonly, notice } = useGrammar();
  const [level, setLevel] = useState("A1"),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState(""),
    [status, setStatus] = useState(""),
    [bookmarked, setBookmarked] = useState(false);
  const shown = filterTopics(state, {
    level,
    search,
    category,
    status,
    bookmarked,
  });
  const available = topics.filter((t) => t.level === level && t.lesson),
    done = available.filter(
      (t) => state.progress[t.id]?.completedAt != null,
    ).length;
  const last = topics.find((t) => t.id === state.lastTopic && t.lesson);
  const theme = worlds[level as keyof typeof worlds];
  return (
    <div
      className={
        "page-content grammar-library grammar-theme-" + level.toLowerCase()
      }
    >
      <PageHeading
        eyebrow="BİLGİYLE BÜYÜYEN BİR BAHÇE"
        title="Gramer Bahçem 📚🌷"
        description="Almanca dil bilgisini adım adım öğren, her konuyla bahçeni büyüt!"
      />
      <section className="grammar-library-hero">
        <div>
          <span className="grammar-eyebrow">
            KÜÇÜK KURALLAR, KOCAMAN KEŞİFLER
          </span>
          <h2>
            {theme[0]} {theme[1]}
          </h2>
          <p>{theme[2]} Her kural bir örnekle, her örnek küçük bir oyunla.</p>
          <Button asChild>
            <Link href={"/gramer/" + (last?.id ?? "grammar-a1-pronouns")}>
              <BookOpen size={17} />
              {last ? "Kaldığım yerden devam et" : "İlk konuyu keşfet"}
              <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
        <LumiMascot expression="happy" decorative />
      </section>
      <nav className="grammar-levels" aria-label="Gramer düzeyi">
        {LEVELS.map((l) => (
          <button
            key={l}
            aria-pressed={level === l}
            onClick={() => setLevel(l)}
          >
            <span>{worlds[l][0]}</span>
            <strong>{l}</strong>
            <small>{worlds[l][1]}</small>
          </button>
        ))}
      </nav>
      <div className="grammar-overview">
        <div>
          <span>
            <Flower2 size={18} /> {done} / {available.length} hazır konu
            tamamlandı
          </span>
          <div
            role="progressbar"
            aria-label={level + " gramer ilerlemesi"}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              available.length ? Math.round((done / available.length) * 100) : 0
            }
          >
            <span
              style={{
                width:
                  (available.length ? (done / available.length) * 100 : 0) +
                  "%",
              }}
            />
          </div>
        </div>
        <span>
          {available.length
            ? available.length + " etkileşimli ders"
            : "Bu düzeyde tam ders henüz yok"}
        </span>
      </div>
      <p className="grammar-alignment">
        Düzeyler yol gösterir; bir konu yalnızca tek bir CEFR düzeyine ait
        değildir. Tamamlanma bir yeterlik belgesi değildir.
      </p>
      {notice && (
        <p role="status" className="grammar-notice">
          {notice}
        </p>
      )}
      {state.claims.some((c) => !c.delivered) && (
        <p className="grammar-notice">
          Kaydedilmiş ödüllerin aktarılmayı bekliyor.{" "}
          <Button variant="outline" onClick={() => void retryGrammarRewards()}>
            Yeniden dene
          </Button>
        </p>
      )}
      <div className="grammar-filters">
        <label>
          <Search size={17} />
          <span className="sr-only">Türkçe veya Almanca konu ara</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Türkçe veya Almanca konu ara…"
          />
        </label>
        <label>
          <span className="sr-only">Konu kategorisi</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Tüm kategoriler</option>
            {Object.entries(categories).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Tamamlanma durumu</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tüm durumlar</option>
            <option value="ready">Hazır dersler</option>
            <option value="started">Devam edenler</option>
            <option value="completed">Tamamlananlar</option>
            <option value="review">Tekrar isteyenler</option>
            <option value="planned">Hazırlanacak konular</option>
          </select>
        </label>
        <button
          aria-pressed={bookmarked}
          onClick={() => setBookmarked(!bookmarked)}
        >
          <Bookmark size={17} />
          Kaydettiklerim
        </button>
      </div>
      <div className="grammar-grid-title">
        <h2>{level} konu patikası</h2>
        <span>{shown.length} konu</span>
      </div>
      <div className="grammar-topic-grid">
        {shown.map((t, i) => {
          const progress = state.progress[t.id],
            complete = progress?.completedAt != null,
            marked = state.bookmarks.includes(t.id);
          return (
            <article
              key={t.id}
              className={"grammar-topic-card grammar-card-" + (i % 4)}
            >
              <div className="grammar-card-top">
                <span>{categories[t.category]}</span>
                <button
                  disabled={!ready || readonly}
                  aria-label={
                    t.title +
                    (marked
                      ? " konusunu kayıtlardan çıkar"
                      : " konusunu kaydet")
                  }
                  aria-pressed={marked}
                  onClick={() => void toggleBookmark(t.id)}
                >
                  {marked ? (
                    <BookmarkCheck size={20} />
                  ) : (
                    <Bookmark size={20} />
                  )}
                </button>
              </div>
              <span className="grammar-topic-icon" aria-hidden="true">
                {complete ? "🌼" : t.lesson ? "📖" : "🌱"}
              </span>
              <h3>{t.title}</h3>
              <p lang="de" className="grammar-german-name">
                {t.german}
              </p>
              <p>{t.summary}</p>
              <div className="grammar-card-status">
                {complete ? (
                  <span>
                    <Check size={15} />
                    Tamamlandı
                  </span>
                ) : !t.lesson ? (
                  <span>
                    <Clock size={15} />
                    Müfredat taslağı
                  </span>
                ) : progress ? (
                  <span>
                    <Sparkles size={15} />
                    Devam ediyor
                  </span>
                ) : (
                  <span>
                    <Flower2 size={15} />
                    Keşfe hazır · {t.lesson.quiz.length} soru
                  </span>
                )}
              </div>
              {t.lesson ? (
                <Link href={"/gramer/" + t.id} className="grammar-open-link">
                  {complete
                    ? "Tekrar keşfet"
                    : progress
                      ? "Devam et"
                      : "Konuyu keşfet"}
                  <ArrowRight size={17} />
                </Link>
              ) : (
                <p className="grammar-planned-label">
                  Tam ders ve mini test henüz hazırlanmadı.
                </p>
              )}
            </article>
          );
        })}
      </div>
      {!shown.length && (
        <div className="grammar-empty">
          <Flower2 size={40} />
          <h3>Bu patikada eşleşme yok.</h3>
          <p>Aramayı veya filtreleri değiştirebilirsin.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setCategory("");
              setStatus("");
              setBookmarked(false);
            }}
          >
            Filtreleri temizle
          </Button>
        </div>
      )}
      <div className="grammar-library-footer">
        🌱 Konuyu oku + pratiği çöz + mini testte en az %80 başarı = tamamlanma.
        İlk tamamlamada 15 XP ve 10 bahçe parası; her beş farklı konuda bir
        lavanta tohumu. Tekrarlar yeni ödül vermez.
      </div>
      <p className="grammar-alignment">
        İlerleme ve yer imleri bu tarayıcıda saklanır. Konuşma asistanı veya AI
        API’si kullanılmaz.
      </p>
    </div>
  );
}
