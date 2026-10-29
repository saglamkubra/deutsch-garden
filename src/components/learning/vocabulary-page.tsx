"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  LibraryBig,
  Sparkles,
  ArrowRight,
  Flower2,
} from "lucide-react";
import { PageHeading } from "@/components/garden/primitives";
import { Button } from "@/components/ui/button";
import { useLearning, respond, selectGoal } from "@/lib/learning/store";
import { assignmentKey } from "@/lib/learning/engine";
import {
  LEVELS,
  CATEGORIES,
  WORD_TYPES,
  wordTypeLabels,
  type Level,
  type Category,
  type WordType,
} from "@/lib/learning/types";
import { Flashcards } from "./flashcards";
import { Pronunciation } from "./pronunciation";
import { ListeningSavedWords } from "@/components/listening/saved-words";
import { StorySavedWords } from "@/components/stories/saved-words";
import { LumiSavedWords } from "@/components/lumi/saved-words";
export function VocabularyPage() {
  const learning = useLearning();
  const { state, repository, date, ready } = learning;
  const assignment = state.assignments[assignmentKey(date, state.level)];
  const [tab, setTab] = useState<"new" | "review">("new");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [article, setArticle] = useState("");
  const [type, setType] = useState("");
  const [known, setKnown] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const knownIds = new Set(
    Object.keys(state.progress).filter((id) => state.progress[id].known),
  );
  const result = repository.query({
    search: query,
    level: (level as Level) || undefined,
    category: (category as Category) || undefined,
    article: article || undefined,
    type: (type as WordType) || undefined,
    known: known ? known === "yes" : undefined,
    knownIds,
    page,
    pageSize: 12,
  });
  const ids =
    tab === "new" ? (assignment?.newIds ?? []) : (assignment?.reviewIds ?? []);
  const words = ids.flatMap((id) => repository.get(id) ?? []);
  const available = repository.byLevel(state.level).length;
  const pending = state.outbox.filter((r) => !r.delivered).length;
  return (
    <div className="page-content learning-page">
      <PageHeading
        eyebrow="HER KELİME YENİ BİR TOHUM"
        title="Kelime Hazinem 💎"
        description="Almanca kelimeleri keşfet, kendini yokla ve küçük tekrarlarla büyüt."
      >
        <span className="learning-local-badge">
          Yerel kayıt · {repository.all().length} özgün kelime
        </span>
      </PageHeading>
      <div className="learning-notice" role="status">
        {ready ? learning.notice : "Kelime yolculuğun hazırlanıyor…"}
      </div>
      <section className="daily-words-section" id="gunun-kelimeleri">
        <div className="learning-section-heading">
          <div>
            <p className="eyebrow">BUGÜNÜN KÜÇÜK KEŞFİ</p>
            <h2>Günün Kelimeleri 🌸</h2>
            <p>
              {date
                ? new Date(date + "T12:00:00").toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Günlük seçim hazırlanıyor"}{" "}
              · {state.level}
            </p>
          </div>
          <label className="goal-picker">
            Günlük hedef
            <select
              value={state.goal}
              disabled={!ready || learning.readonly}
              onChange={(e) => selectGoal(Number(e.target.value))}
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} yeni kelime
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="daily-words-layout">
          <div className="daily-card-workspace">
            <div
              className="learning-tabs"
              role="group"
              aria-label="Kelime çalışma türü"
            >
              <button
                type="button"
                aria-pressed={tab === "new"}
                onClick={() => setTab("new")}
              >
                Yeni kelimeler <span>{assignment?.newIds.length ?? 0}</span>
              </button>
              <button
                type="button"
                aria-pressed={tab === "review"}
                onClick={() => setTab("review")}
              >
                Zamanı gelen tekrarlar{" "}
                <span>{assignment?.reviewIds.length ?? 0}</span>
              </button>
            </div>
            {ready && words.length > 0 ? (
              <Flashcards
                key={assignment!.id + ":" + tab}
                words={words}
                answers={assignment!.answers}
                onAnswer={(id, answer) => respond(id, answer)}
                disabled={learning.readonly}
                title={tab === "new" ? "Yeni kelime turu" : "Tekrar turu"}
              />
            ) : (
              <div className="learning-empty">
                <Flower2 size={39} />
                <h3>
                  {!ready
                    ? "Kartlar hazırlanıyor…"
                    : available === 0
                      ? "Bu düzeyin kelimeleri henüz hazırlanmadı."
                      : tab === "review"
                        ? "Bugün zamanı gelen tekrarın yok."
                        : "Yeni kelime havuzunun sonuna geldin."}
                </h3>
                <p>
                  {available === 0
                    ? "İçerik yüklenmesini bekle veya filtrelerini kontrol et. A1–C2 derslerinin kelime ve ifade kayıtları Kelime Hazinem bölümünde bulunur."
                    : tab === "review"
                      ? "Yanıt verdiğin veya henüz çalışmadığın kelimeler yarından itibaren tekrar planına girer."
                      : "Bugünkü listen korunur. Kelime Hazinem bölümünde mevcut kelimeleri inceleyebilirsin."}
                </p>
                <Link href="/derslerim" className="text-link">
                  Öğrenme haritasına git <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
          <aside className="daily-learning-guide">
            <span aria-hidden="true">🌱</span>
            <h3>
              Azıcık emek,
              <br />
              kalıcı bir alışkanlık.
            </h3>
            <p>
              Bugünün seçimi gün boyunca aynı kalır. Yeni hedef yarın uygulanır.
            </p>
            <dl>
              <div>
                <dt>Bugünün yeni kelimeleri</dt>
                <dd>
                  {assignment?.newIds.length ?? 0} /{" "}
                  {assignment?.goal ?? state.goal}
                </dd>
              </div>
              <div>
                <dt>Biliyorum işaretli</dt>
                <dd>{knownIds.size}</dd>
              </div>
              <div>
                <dt>{state.level} havuzu</dt>
                <dd>{available} kayıt</dd>
              </div>
            </dl>
            {assignment && assignment.newIds.length < assignment.goal && (
              <p className="learning-pool-note">
                Havuzda yeterli yeni kelime yok. Eksik kelime uydurulmaz; mevcut
                seçimle çalışabilirsin.
              </p>
            )}
            <div className="vocab-reward-note">
              <Sparkles size={17} />
              <strong>Bahçene küçük bir hediye</strong>
              <p>
                Günlük yeni kartlardan 5’ine “Biliyorum”: 1 papatya tohumu.
                10’unda toplam 2 tohum. Tüm yeni kartları yanıtlayınca 5 bahçe
                parası.
              </p>
              <p>Tekrar kartları bu adımda kaynak ödülü vermez.</p>
              {pending > 0 && (
                <p>
                  {pending} ödül güvenli kayıt için bekliyor. Sonraki açılışta
                  yeniden denenecek.
                </p>
              )}
              <Link href="/bahcem">
                Çantama bak <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
      <ListeningSavedWords />
      <StorySavedWords />
      <LumiSavedWords />
      <section className="vocabulary-library" aria-labelledby="library-title">
        <div className="learning-section-heading">
          <div>
            <p className="eyebrow">KÜÇÜK BİR DİL KOLEKSİYONU</p>
            <h2 id="library-title">
              <LibraryBig size={24} /> Kelime Hazinem 💎
            </h2>
          </div>
          <span>{result.total} kayıt</span>
        </div>
        <div className="vocabulary-filters">
          <label className="vocab-search">
            <span>
              <Search size={15} /> Almanca veya Türkçe ara
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Örn. Straße, çiçek, öğrenmek…"
            />
          </label>
          <label>
            Düzey
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tüm düzeyler</option>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label>
            Konu
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tüm konular</option>
              {Object.entries(CATEGORIES).map(([key, text]) => (
                <option key={key} value={key}>
                  {text}
                </option>
              ))}
            </select>
          </label>
          <label>
            Artikel
            <select
              value={article}
              onChange={(e) => {
                setArticle(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tümü</option>
              {["der", "die", "das"].map((a) => (
                <option key={a}>{a}</option>
              ))}
              <option value="none">Artikelsiz</option>
            </select>
          </label>
          <label>
            Kelime türü
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tümü</option>
              {WORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {wordTypeLabels[t]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Öğrenme durumu
            <select
              value={known}
              onChange={(e) => {
                setKnown(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tümü</option>
              <option value="yes">Biliyorum işaretli</option>
              <option value="no">Henüz biliyorum denmedi</option>
            </select>
          </label>
        </div>
        <div className="library-word-grid">
          {result.items.map((word) => (
            <article key={word.id} className="library-word">
              <div className="library-word-top">
                <span>
                  {word.cefr_level} · {wordTypeLabels[word.word_type]}
                </span>
                <span>
                  {state.progress[word.id]?.known
                    ? "✓ Biliyorum"
                    : "○ Keşfediliyor"}
                </span>
              </div>
              <h3 lang="de">
                <span className={`article-${word.article}`}>
                  {word.article}
                </span>{" "}
                {word.german_word}
              </h3>
              <p>{word.turkish_meaning}</p>
              <button
                type="button"
                className="library-details-button"
                aria-expanded={expanded === word.id}
                onClick={() =>
                  setExpanded((v) => (v === word.id ? null : word.id))
                }
              >
                {expanded === word.id ? "Örneği gizle" : "Örnek ve telaffuz"}{" "}
                <ArrowRight size={14} />
              </button>
              {expanded === word.id && (
                <div className="library-example">
                  {word.word_type === "noun" && (
                    <p>
                      Çoğul:{" "}
                      <span lang="de">
                        {word.plural_form ? "die " + word.plural_form : "—"}
                      </span>{" "}
                      {word.plural_note}
                    </p>
                  )}
                  <p lang="de">{word.example_sentence_de}</p>
                  <p>{word.example_sentence_tr}</p>
                  <Pronunciation
                    key={word.id}
                    text={(word.article ?? "") + " " + word.german_word}
                  />
                  <small>
                    Kaynak: {word.source_name}. Özgün örnek; AlmancaABC’den
                    aktarılmadı.
                  </small>
                </div>
              )}
            </article>
          ))}
        </div>
        {result.total === 0 && (
          <p className="learning-empty">
            Bu filtrelerde kayıt yok. Filtrelerini değiştirebilirsin.
          </p>
        )}
        <nav className="library-pagination" aria-label="Kelime sayfaları">
          <Button
            type="button"
            variant="outline"
            disabled={result.page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Önceki
          </Button>
          <span>
            {result.page} / {result.pages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={result.page === result.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Sonraki
          </Button>
        </nav>
        <p className="learning-source-note">
          İlk 60 başlangıç kelimesi korunur; A1–C2 derslerinden özgün kelime ve
          ifade kayıtları da eklenmiştir. Uzun cümleler ifade kartı olarak
          etiketlenir; bunlar resmî veya eksiksiz bir CEFR sözlük listesi
          değildir.{" "}
          <a
            href="https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions"
            target="_blank"
            rel="noreferrer"
          >
            CEFR düzey çerçevesi
          </a>
        </p>
      </section>
    </div>
  );
}
