"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Heart,
  Sparkles,
  Sun,
  Clock,
  Search,
  LockKeyhole,
  Check,
} from "lucide-react";
import { useLearning } from "@/lib/learning/store";
import { LEVELS, type Level } from "@/lib/learning/types";
import { stories, categories, plannedStories } from "@/lib/stories/content";
import type { Story } from "@/lib/stories/types";
import { currentRun, filterStories } from "@/lib/stories/engine";
import { useStories, assignStoryDay, favoriteStory } from "@/lib/stories/store";
import { PageHeading } from "@/components/garden/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { StoryArt } from "./art";
export function StoryLibrary() {
  const { state, ready, readonly, notice } = useStories(),
    learning = useLearning();
  const [selected, setSelected] = useState<Level | null>(null),
    [category, setCategory] = useState(""),
    [minutes, setMinutes] = useState(""),
    [status, setStatus] = useState(""),
    [favorites, setFavorites] = useState(false),
    [search, setSearch] = useState("");
  const level = selected ?? learning.state.level;
  useEffect(() => {
    if (ready && !readonly && learning.ready) void assignStoryDay(level);
  }, [ready, readonly, learning.ready, learning.date, level]);
  const available = stories.filter((s) => s.level === level),
    result = filterStories(state, {
      level,
      category,
      minutes,
      status,
      favorite: favorites,
      search,
    });
  const daily = stories.find(
      (s) => s.id === state.daily[learning.date + ":" + level]?.storyId,
    ),
    featured = available[0];
  const last = Object.values(state.runs)
    .filter(
      (r) =>
        r.storyId &&
        stories.some((s) => s.id === r.storyId) &&
        !stories
          .find((s) => s.id === r.storyId)
          ?.scenes.find((n) => n.id === r.path.at(-1))?.ending &&
        state.active[r.storyId] === r.id,
    )
    .sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const continueStory = last
    ? stories.find((s) => s.id === last.storyId)
    : undefined;
  const discovered = Object.values(state.endings).reduce(
      (sum, e) => sum + e.length,
      0,
    ),
    total = stories.reduce(
      (sum, s) => sum + s.scenes.filter((n) => n.ending).length,
      0,
    );
  return (
    <div className="page-content story-library">
      <PageHeading
        eyebrow="BİR SAYFA AÇ, BİR DÜNYA KEŞFET"
        title="Hikâye Dünyam 📖✨"
        description="Her seçim yeni bir macera! Almanca öğrenirken kendi hikâyeni yaz."
      >
        <span className="story-library-stamp">
          <BookOpen size={18} />
          {stories.length} özgün macera
        </span>
      </PageHeading>
      {notice && (
        <p role="status" className="story-notice">
          {notice}
        </p>
      )}
      <div className="story-hero">
        <div>
          <span className="story-kicker">
            KÜÇÜK SEÇİMLER, BÜYÜLÜ İHTİMALLER
          </span>
          <h2>
            Bu hikâyenin
            <br />
            <em>kahramanı sensin.</em>
          </h2>
          <p>
            Bir kafede arkadaş edin, kayıp bir hediyenin izini sür ya da
            Lumi’nin bahçesindeki sırrı çöz. Her yolun sonunda başka bir hatıra
            var.
          </p>
          <div className="story-hero-tags">
            <span>🌿 Gerçek seçimler</span>
            <span>♫ Almanca seslendirme</span>
            <span>✨ Saklanan maceralar</span>
          </div>
          {featured && (
            <Button asChild>
              <Link href={"/hikayeler/" + featured.id}>
                İlk sayfayı aç <ArrowRight size={17} />
              </Link>
            </Button>
          )}
        </div>
        <div className="story-hero-illustration">
          <div className="story-cover-book">
            <StoryArt
              kind={featured?.art ?? "garden"}
              label="Çiçeklerle çevrili, keşfedilecek bir hikâye kitabı"
            />
            <div>
              <small>DEUTSCH GARDEN · HİKÂYE KİTAPLIĞI</small>
              <strong>
                {featured?.germanTitle ?? "Yeni dünyalar yakında…"}
              </strong>
              <span>Bir varmış, bir seçim varmış…</span>
            </div>
          </div>
          <span className="story-floating-star">✦</span>
          <span className="story-floating-flower">✿</span>
        </div>
      </div>
      <div className="story-stats" aria-label="Gerçek hikâye ilerlemen">
        <div>
          <span>📚</span>
          <strong>
            {state.completed.length}
            <small>Tamamlanan hikâye</small>
          </strong>
        </div>
        <div>
          <span>🗝️</span>
          <strong>
            {discovered} / {total}
            <small>Keşfedilen son</small>
          </strong>
        </div>
        <div>
          <span>💗</span>
          <strong>
            {state.favorites.length}
            <small>Favori hikâye</small>
          </strong>
        </div>
        <div>
          <span>🌱</span>
          <strong>
            %{Math.round((discovered / total) * 100)}
            <small>Sonlar koleksiyonu</small>
          </strong>
        </div>
      </div>
      <section className="story-levels" aria-label="Hikâye seviyeni seç">
        {LEVELS.map((l, i) => (
          <button
            key={l}
            aria-pressed={level === l}
            onClick={() => setSelected(l)}
          >
            <span>{["🌱", "🌷", "🌳", "🏰", "🌙", "✨"][i]}</span>
            <strong>{l}</strong>
            <small>
              {stories.filter((s) => s.level === l).length} hazır hikâye
            </small>
          </button>
        ))}
      </section>
      <div className="story-recommendations">
        <section className="story-daily">
          <div className="story-recommendation-icon">
            <Sun size={30} />
          </div>
          <div>
            <span className="story-kicker">
              {learning.date} · {level}
            </span>
            <h2>Günün Hikâye Macerası 🌞</h2>
            {daily ? (
              <>
                <p>{daily.title}</p>
                <small>
                  Bugün aynı öneri seni bekler; seçimlerin otomatik saklanır.
                </small>
                <Link href={"/hikayeler/" + daily.id}>
                  Bugünün sayfasını aç <ArrowRight size={15} />
                </Link>
              </>
            ) : !state.daily[learning.date + ":" + level] ? (
              <p>
                {readonly
                  ? "Günlük öneri için tarayıcı kaydı kullanılamıyor."
                  : "Günün hikâyesi hazırlanıyor…"}
              </p>
            ) : (
              <p>
                Bugünkü önerin önceki içerik listesiyle kaydedilmiş. Aşağıdaki
                hazır hikâyelerden birini seçebilirsin; yarın yeni öneri oluşur.
              </p>
            )}
          </div>
        </section>
        <section className="story-continue">
          <div>
            <span className="story-kicker">AYRACINI KOYDUĞUN YER</span>
            <h2>Bir sayfa daha?</h2>
            {continueStory && last ? (
              <>
                <p>
                  {continueStory.title} · {last.path.length}. sahne
                </p>
                <Link href={"/hikayeler/" + continueStory.id}>
                  Kaldığım yerden devam et <ArrowRight size={15} />
                </Link>
              </>
            ) : (
              <p>
                {available.length
                  ? "Henüz yarım kalmış bir hikâyen yok. Aşağıdan bir kitap seç."
                  : "Hazır bir macera için diğer seviyeleri seçebilirsin."}
              </p>
            )}
          </div>
          <LumiMascot decorative expression="happy" />
        </section>
      </div>
      <section className="story-shelf" aria-labelledby="story-shelf-title">
        <div className="story-section-heading">
          <div>
            <span className="story-kicker">SANA GÖRE BİR MACERA VAR</span>
            <h2 id="story-shelf-title">Bugün hangi dünyaya gidelim?</h2>
          </div>
          <span>
            {level} · {available.length} oynanabilir hikâye
          </span>
        </div>
        <div
          className="story-categories"
          role="group"
          aria-label="Hikâye kategorileri"
        >
          <button aria-pressed={!category} onClick={() => setCategory("")}>
            Tüm dünyalar
          </button>
          {Object.entries(categories).map(([id, label]) => (
            <button
              key={id}
              aria-pressed={category === id}
              onClick={() => setCategory(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="story-filters">
          <label className="story-search">
            <Search size={17} />
            <span className="sr-only">Hikâye ara</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Bir hikâye ara…"
            />
          </label>
          <label>
            <span className="sr-only">Okuma süresi</span>
            <select
              aria-label="Tahmini okuma süresi"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            >
              <option value="">Her süre</option>
              <option value="short">3 dakikaya kadar</option>
              <option value="all">5 dakikaya kadar</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Tamamlanma durumu</span>
            <select
              aria-label="Hikâye durumu"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tüm hikâyeler</option>
              <option value="new">Başlamadıklarım</option>
              <option value="reading">Devam ettiklerim</option>
              <option value="complete">Tamamladıklarım</option>
            </select>
          </label>
          <button
            aria-pressed={favorites}
            onClick={() => setFavorites(!favorites)}
          >
            <Heart size={16} />
            Favorilerim
          </button>
        </div>
        <div className="story-card-grid">
          {result.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
        {!result.length && (
          <div className="story-empty">
            <BookOpen size={32} />
            <h3>
              {available.length
                ? "Bu rafta henüz bir hikâye yok."
                : "Bu dünyanın sayfaları hazırlanıyor."}
            </h3>
            <p>
              {available.length
                ? "Filtreleri değiştirerek diğer hikâyeleri keşfedebilirsin."
                : "Diğer seviyelerdeki hazır hikâyeleri keşfedebilirsin."}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setCategory("");
                setMinutes("");
                setStatus("");
                setFavorites(false);
                setSearch("");
                if (!available.length) setSelected("A1");
              }}
            >
              Hazır hikâyeleri göster
            </Button>
          </div>
        )}
        {plannedStories
          .filter((s) => s.level === level)
          .map((s) => (
            <article className="story-planned" key={s.id}>
              <LockKeyhole size={30} />
              <div>
                <span className="story-kicker">{s.level} · MÜFREDAT PLANI</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <small>Hazırlanıyor · Okuma ve seslendirme henüz yok.</small>
              </div>
            </article>
          ))}
      </section>
      <section className="story-collection-banner">
        <span>🗝️</span>
        <div>
          <h2>Her son, koleksiyonunda bir çiçek.</h2>
          <p>
            {discovered} son keşfettin. Hikâye sayfasında gizli sonların
            albümünü görebilir, yeniden okuyarak farklı yolları açabilirsin.
          </p>
          <Progress
            value={(discovered / total) * 100}
            aria-label="Tüm hikâye sonlarının keşif oranı"
          />
        </div>
        <Sparkles size={34} />
      </section>
      <p className="story-fine story-library-note">
        Kayıt durumunu sayfanın üstündeki göstergeden kontrol edebilirsin. İlk
        bitiriş +20 XP, her farklı son +10 bahçe parası; başarılı test hikâye
        başına bir tohum verir. Bahçendeki sulama ücretsizdir.
      </p>
    </div>
  );
}
function StoryCard({ story: s }: { story: Story }) {
  const { state, ready, readonly } = useStories(),
    run = currentRun(state, s.id),
    ends = state.endings[s.id] ?? [],
    total = s.scenes.filter((n) => n.ending).length,
    complete = state.completed.includes(s.id);
  return (
    <article className={"story-card story-card-" + s.art}>
      <div className="story-card-image">
        <Link href={"/hikayeler/" + s.id} tabIndex={-1} aria-hidden>
          <StoryArt kind={s.art} label={s.title} />
        </Link>
        <span className="story-level-tag">{s.level}</span>
        <button
          className="story-heart"
          aria-label={s.title + " hikâyesini favorilere ekle"}
          aria-pressed={state.favorites.includes(s.id)}
          disabled={!ready || readonly}
          onClick={() => void favoriteStory(s.id)}
        >
          <Heart size={18} />
        </button>
        {complete && (
          <span className="story-complete-tag">
            <Check size={13} />
            Tamamlandı
          </span>
        )}
      </div>
      <div className="story-card-body">
        <span className="story-kicker">
          {categories[s.category as keyof typeof categories]}
        </span>
        <h3>
          <Link href={"/hikayeler/" + s.id}>{s.title}</Link>
        </h3>
        <p className="story-german-title" lang="de">
          {s.germanTitle}
        </p>
        <p>{s.description}</p>
        <div className="story-card-meta">
          <span>
            <Clock size={14} />~{s.minutes} dk / yol
          </span>
          <span>
            🗝 {ends.length}/{total} son
          </span>
        </div>
        <Progress
          value={(ends.length / total) * 100}
          aria-label={s.title + " keşfedilen sonlar"}
        />
        <Link className="story-open-link" href={"/hikayeler/" + s.id}>
          {run ? "Kitabıma dön" : "Maceraya başla"}
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
