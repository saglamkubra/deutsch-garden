"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ListChecks,
  TextCursorInput,
  Blocks,
  Languages,
  BookOpen,
  Headphones,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  RotateCcw,
  Check,
  Heart,
  Star,
  Trophy,
  Flower2,
  Play,
  Clock,
} from "lucide-react";
import { useLearning } from "@/lib/learning/store";
import { localDate } from "@/lib/learning/engine";
import {
  useExercises,
  beginExercise,
  answerExercise,
  nextExercise,
  closeExercise,
  resumeExercise,
  retryGardenClaims,
  recordMatch,
} from "@/lib/exercises/store";
import {
  generateQuestions,
  dailyPriority,
  shuffle,
  normalize,
} from "@/lib/exercises/generate";
import { sessionStats } from "@/lib/exercises/engine";
import type { Mode, Question, Session } from "@/lib/exercises/types";
import { PageHeading } from "@/components/garden/primitives";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { Pronunciation } from "@/components/learning/pronunciation";
import { Button } from "@/components/ui/button";
const modes = [
  {
    id: "choice",
    title: "Çoktan Seçmeli",
    description: "Dört küçük seçenek, kocaman bir keşif.",
    icon: ListChecks,
    color: "mint",
    tag: "Sözcük avı",
  },
  {
    id: "blank",
    title: "Boşluk Doldurma",
    description: "Cümlenin eksik parçasını birlikte bulalım.",
    icon: TextCursorInput,
    color: "peach",
    tag: "Dilbilgisi",
  },
  {
    id: "matching",
    title: "Kelime Eşleştirme",
    description: "Almanca ve Türkçe sözcükleri buluştur.",
    icon: Flower2,
    color: "pink",
    tag: "Hafıza bahçesi",
  },
  {
    id: "sentence",
    title: "Cümle Oluşturma",
    description: "Sözcükleri diz, kendi cümleni yetiştir.",
    icon: Blocks,
    color: "lavender",
    tag: "Cümle atölyesi",
  },
  {
    id: "tr-de",
    title: "Türkçeden Almancaya",
    description: "Aklındaki sözcüğü Almancaya taşı.",
    icon: Languages,
    color: "yellow",
    tag: "Yaz ve keşfet",
  },
  {
    id: "de-tr",
    title: "Almancadan Türkçeye",
    description: "Anlamları hatırla, bağları güçlendir.",
    icon: BookOpen,
    color: "blue",
    tag: "Anlam yolculuğu",
  },
  {
    id: "listening",
    title: "Dinleme Alıştırması",
    description: "Kulak ver, duyduğun sözcüğü yakala.",
    icon: Headphones,
    color: "lilac",
    tag: "Sesli keşif",
  },
  {
    id: "daily",
    title: "Günlük Karışık Test",
    description: "Bugüne özel on soruluk minik macera.",
    icon: Sparkles,
    color: "rose",
    tag: "Günün meydan okuması",
  },
] as const;
export function ExerciseCenter() {
  const learning = useLearning(),
    ex = useExercises();
  const [message, setMessage] = useState("");
  const active = ex.state.active
    ? ex.state.sessions[ex.state.active]
    : undefined;
  const [chosenLevel, setChosenLevel] = useState<
    import("@/lib/learning/types").Level | null
  >(null);
  const level = chosenLevel ?? learning.state.level;
  const totalXp = Object.values(ex.state.xp).reduce((n, x) => n + x, 0);
  function start(mode: Mode, practice = false, questions?: Question[]) {
    const date = localDate();
    const generated =
      questions ??
      generateQuestions(
        learning.repository,
        level,
        mode,
        date +
          ":" +
          level +
          ":" +
          (mode === "daily" && !practice ? "daily" : crypto.randomUUID()),
        dailyPriority(learning.state, date),
        ex.state.mistakes,
      );
    if (!generated.length) {
      setMessage(
        level +
          " düzeyinde bu etkinlik için doğrulanmış içerik henüz yok. Derslerim bölümünden A1 düzeyini seçebilirsin.",
      );
      return;
    }
    setMessage("");
    void beginExercise(generated, mode, level, practice);
  }
  const recent = Object.values(ex.state.sessions)
    .filter((s) => s.completedAt === null)
    .sort((a, b) => b.startedAt - a.startedAt)
    .slice(0, 3);
  const pending = ex.state.claims.filter((c) => !c.delivered);
  return (
    <div className="page-content exercise-center">
      <PageHeading
        eyebrow="HER YANIT BİR FİLİZ"
        title="Almanca Oyun Alanım 🎮"
        description="Her doğru cevapla hem Almancanı geliştir hem de bahçeni büyüt!"
      />
      <section className="exercise-hero">
        <div>
          <span className="exercise-kicker">
            KÜÇÜK OYUNLAR · BÜYÜK KEŞİFLER
          </span>
          <h2>
            Bugün hangi
            <br />
            maceraya çıkalım?
          </h2>
          <p>Lumi yanında. Yanlış yapmak da öğrenmenin bir parçası.</p>
          <div className="exercise-chips">
            <span>
              <Star size={16} /> {totalXp} kazanılan XP
            </span>
            <span>
              {level} · {learning.repository.byLevel(level).length} sözcük
            </span>
            <span>
              <Heart size={16} /> Sınırsız deneme
            </span>
          </div>
        </div>
        <LumiMascot expression="excited" decorative />
        <span className="exercise-float float-one" aria-hidden="true">
          ✦
        </span>
        <span className="exercise-float float-two" aria-hidden="true">
          ✿
        </span>
      </section>
      <label className="exercise-level-selector">
        Alıştırma düzeyi{" "}
        <select
          value={level}
          onChange={(e) => setChosenLevel(e.target.value as typeof level)}
        >
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <span>Yalnızca bu oyun seçimini etkiler; ders ilerlemen korunur.</span>
      </label>
      <section className="daily-challenge">
        <div className="challenge-icon">
          <Trophy />
        </div>
        <div>
          <span className="exercise-kicker">HER GÜN YENİ BİR YOLCULUK</span>
          <h2>Günün Almanca Meydan Okuması 🌟</h2>
          <p>
            Günlük sözcüklerin, zamanı gelen tekrarların ve farklı oyunlar.
            Bugünkü testin yenilemede korunur.
          </p>
        </div>
        <Button
          onClick={() => start("daily")}
          disabled={!ex.ready || !learning.ready || ex.readonly}
        >
          Maceraya Başla <ArrowRight size={18} />
        </Button>
      </section>
      {(message || ex.notice) && (
        <p className="exercise-notice" role="status">
          {message || ex.notice}
        </p>
      )}
      {pending.length > 0 && (
        <div className="exercise-notice">
          Bahçeye iletilmeyi bekleyen {pending.length} ödül var.{" "}
          <Button variant="outline" onClick={() => void retryGardenClaims()}>
            Yeniden dene
          </Button>
        </div>
      )}
      {recent.length > 0 && (
        <section className="exercise-resume" aria-label="Yarım kalan oyunlar">
          <h2>Kaldığın yerden filizlen</h2>
          {recent.map((s) => (
            <button key={s.id} onClick={() => void resumeExercise(s.id)}>
              <Play size={17} />
              {modes.find((m) => m.id === s.mode)?.title} · {s.level} ·{" "}
              {Object.keys(s.answers).length}/{s.questions.length}
              <ArrowRight size={17} />
            </button>
          ))}
        </section>
      )}
      <div className="exercise-section-title">
        <h2>Oyununu seç</h2>
        <span>8 keşif yolu</span>
      </div>
      <div className="exercise-mode-grid">
        {modes.map((m) => (
          <button
            className={"exercise-mode mode-" + m.color}
            key={m.id}
            disabled={!ex.ready || !learning.ready || ex.readonly}
            onClick={() => start(m.id)}
          >
            <span className="mode-icon">
              <m.icon size={27} />
            </span>
            <span className="mode-tag">{m.tag}</span>
            <h3>{m.title}</h3>
            <p>{m.description}</p>
            <span className="mode-start">
              Haydi oynayalım <ArrowRight size={18} />
            </span>
          </button>
        ))}
      </div>
      <div className="exercise-footnote">
        <Flower2 size={24} />
        <p>
          <strong>Emeğin bahçende çiçek açsın.</strong> İlk doğru yanıta +5 XP
          (soru başına, gün ve düzey başına bir kez). Günün ilk tamamlanan
          oyununa +10 bahçe parası. Kusursuz günlük teste +1 lavanta tohumu.
          Tekrarlar ek ödeme yapmaz.
        </p>
      </div>
      <p className="exercise-local">
        İlerlemen bu tarayıcıda saklanır. XP, alıştırma, gramer, dinleme ve
        hikâye çalışmalarının ortak puanıdır; ana sayfadaki örnek profil puanı
        ayrı gösterilir. Yanıt kontrolü tanımlı karşılıklarla yapılır; serbest
        cümlelerin anlamını yorumlayan bir yapay zekâ kullanılmaz.
      </p>
      {active && (
        <SessionDialog
          session={active}
          onReplay={(mistakesOnly) => {
            const qs = mistakesOnly
              ? active.questions.filter(
                  (q) =>
                    (active.answers[q.id] &&
                      !active.answers[q.id].correct &&
                      !active.answers[q.id].skipped) ||
                    (active.attempts ?? []).some(
                      (a) => a.questionId === q.id && !a.correct,
                    ),
                )
              : active.questions;
            if (qs.length)
              void beginExercise(qs, active.mode, active.level, true);
          }}
        />
      )}
    </div>
  );
}
function SessionDialog({
  session: s,
  onReplay,
}: {
  session: Session;
  onReplay: (mistakesOnly: boolean) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    element.showModal();
    return () => element.close();
  }, []);
  useEffect(() => {
    heading.current?.focus();
  }, [s.id, s.index, s.completedAt]);
  const q = s.questions[s.index],
    answer = s.answers[q.id],
    stats = sessionStats(s);
  const { state } = useExercises();
  const claim = state.claims.find(
    (c) => c.id === "exercise:coins:" + s.rewardKey,
  );
  const perfectClaim = state.claims.find(
    (c) => c.id === "exercise:perfect:" + s.rewardKey,
  );
  const firstSession = Object.values(state.sessions)
    .filter(
      (x) =>
        x.rewardKey === s.rewardKey &&
        x.completedAt !== null &&
        Object.values(x.answers).some((a) => !a.skipped),
    )
    .sort((a, b) => (a.completedAt ?? 0) - (b.completedAt ?? 0))[0];
  const coins = claim && firstSession?.id === s.id ? claim.coins : 0;
  return (
    <dialog
      ref={dialog}
      className="exercise-dialog"
      aria-labelledby="session-heading"
      onCancel={(e) => {
        e.preventDefault();
        void closeExercise();
      }}
    >
      <div className="exercise-session">
        <header className="session-top">
          <Button
            variant="outline"
            onClick={() => void closeExercise()}
            aria-label="Oyundan çık ve ilerlemeyi sakla"
          >
            <X size={18} /> Çık
          </Button>
          <span>
            <Star size={17} />
            {stats.xp} XP
          </span>
          <span>
            <Heart size={17} /> Birlikte öğreniyoruz
          </span>
        </header>
        <div className="session-progress">
          <div
            role="progressbar"
            aria-label="Oyun ilerlemesi"
            aria-valuenow={Object.keys(s.answers).length}
            aria-valuemin={0}
            aria-valuemax={s.questions.length}
          >
            <span
              style={{
                width:
                  (Object.keys(s.answers).length / s.questions.length) * 100 +
                  "%",
              }}
            />
          </div>
          <small>
            {Object.keys(s.answers).length} / {s.questions.length}
          </small>
        </div>
        {s.completedAt !== null ? (
          <div className="exercise-results">
            <LumiMascot expression="celebrating" decorative />
            <span className="exercise-kicker">BAHÇENE BİR PARÇA EMEK DAHA</span>
            <h2 ref={heading} tabIndex={-1} id="session-heading">
              Harika bir adım attın! ✨
            </h2>
            <p>Her deneme bir şey öğretir. Yeniden filizlenmeye hazır mısın?</p>
            <div className="result-grid">
              <span>
                <strong>{stats.correct}</strong>Doğru
              </span>
              <span>
                <strong>{stats.wrong}</strong>Tekrar isteyen
              </span>
              <span>
                <strong>%{stats.accuracy}</strong>Doğruluk
              </span>
              <span>
                <strong>+{stats.xp}</strong>Kazanılan XP
              </span>
              <span>
                <strong>+{coins}</strong>Bahçe parası
              </span>
              <span>
                <strong>{stats.reinforcedIds.length}</strong>Pekiştirilen sözcük
              </span>
            </div>
            {stats.skipped > 0 && (
              <p>{stats.skipped} ses sorusu atlandı; ödül puanı verilmedi.</p>
            )}
            <p>
              {Math.round((s.completedAt - s.startedAt) / 1000)} saniyelik
              macera · Açık oturum süresi, molalar dahil.
            </p>
            {perfectClaim &&
              s.mode === "daily" &&
              !s.practice &&
              stats.accuracy === 100 && (
                <p>
                  Günün kusursuz test hediyesi: 1 lavanta tohumu 🌱 (gün başına
                  bir kez).
                </p>
              )}
            <p>
              {stats.reviewIds.length
                ? stats.reviewIds.length + " sözcük tekrar listene alındı."
                : "Bu oyunda tekrar gerektiren bir sözcük kalmadı."}{" "}
              Pekiştirme sayısı kesin ustalık belgesi değildir.
            </p>
            <div className="result-words">
              {stats.reviewIds.map((id) => (
                <ReviewWord key={id} id={id} />
              ))}
            </div>
            {state.claims.some(
              (c) => !c.delivered && c.id.endsWith(s.rewardKey),
            ) && (
              <p role="status">
                Bahçe ödülün kayıtlı; çantaya aktarılmayı bekliyor.
              </p>
            )}
            <details className="result-review">
              <summary>Yanıtları ve açıklamaları gözden geçir</summary>
              {s.questions.map((item, i) => (
                <div key={item.id}>
                  <strong>
                    {i + 1}. {item.prompt}
                  </strong>
                  <p>
                    Yanıtın:{" "}
                    {s.answers[item.id]?.value.includes("|")
                      ? "Eşleştirme tamamlandı"
                      : s.answers[item.id]?.value || "Atlandı"}
                  </p>
                  <p>{item.explanation}</p>
                </div>
              ))}
            </details>
            <div className="result-actions">
              <Button onClick={() => onReplay(false)}>
                <RotateCcw size={17} />
                Tekrar Dene
              </Button>
              <Button
                variant="outline"
                disabled={!stats.reviewIds.length}
                onClick={() => onReplay(true)}
              >
                Hatalarımı Çalış
              </Button>
              <Button asChild variant="outline">
                <Link href="/bahcem" onClick={() => void closeExercise()}>
                  Bahçeme Git
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/" onClick={() => void closeExercise()}>
                  Ana Sayfaya Dön
                </Link>
              </Button>
            </div>
            <p className="exercise-local">
              Tekrar oynamak günlük ödül sınırını yenilemez. Bekleyen bahçe
              ödülleri bağlantı yeniden kurulunca güvenle denenir.
            </p>
          </div>
        ) : (
          <>
            <div className="question-intro">
              <div>
                <span className="exercise-kicker">
                  {modes.find((m) => m.id === q.type)?.title} · {s.level}
                </span>
                <h2 id="session-heading" tabIndex={-1} ref={heading}>
                  Soru {s.index + 1}:{" "}
                  {q.type === "sentence"
                    ? "Sözcükleri bir araya getir"
                    : q.type === "tr-de"
                      ? "Almancasını yaz"
                      : q.type === "de-tr"
                        ? "Türkçesini yaz"
                        : "Birlikte keşfedelim"}
                </h2>
                <p>
                  {s.practice
                    ? "Tekrar çalışması"
                    : s.mode === "daily"
                      ? "Günün karışık testi"
                      : "Kendi hızında öğren"}{" "}
                  · {s.date}
                </p>
              </div>
              <LumiMascot
                expression={
                  answer
                    ? answer.correct
                      ? "celebrating"
                      : "encouraging"
                    : "thinking"
                }
                decorative
              />
            </div>
            <QuestionActivity
              key={s.id + ":" + q.id}
              question={q}
              locked={!!answer}
              savedValue={answer?.value ?? ""}
            />
            {answer && (
              <section
                role="status"
                className={
                  "answer-feedback " +
                  (answer.correct ? "feedback-correct" : "feedback-gentle")
                }
              >
                <strong>
                  {answer.skipped
                    ? "Bu soruyu geçtik."
                    : answer.correct
                      ? "İşte bu! Bir filiz daha 🌱"
                      : "Güzel bir deneme. Birlikte bakalım 🌸"}
                </strong>
                <p>
                  Yanıt:{" "}
                  <span
                    lang={
                      q.type === "de-tr" ||
                      q.type === "choice" ||
                      q.type === "listening"
                        ? "tr"
                        : "de"
                    }
                  >
                    {q.accepted[0].includes("|")
                      ? "Eşleşmeler aşağıda"
                      : q.accepted[0]}
                  </span>
                </p>
                <p>{q.explanation}</p>
                {answer.xp > 0 && <span>+{answer.xp} XP ✦</span>}
              </section>
            )}
            {answer && (
              <Button
                className="session-next"
                onClick={() => void nextExercise()}
              >
                Sonraki soru <ArrowRight size={18} />
              </Button>
            )}
          </>
        )}
      </div>
    </dialog>
  );
}
function ReviewWord({ id }: { id: string }) {
  const { repository } = useLearning();
  return <span>{repository.get(id)?.german_word ?? "Sözcük"}</span>;
}
function QuestionActivity({
  question: q,
  locked,
  savedValue,
}: {
  question: Question;
  locked: boolean;
  savedValue: string;
}) {
  const [value, setValue] = useState(savedValue);
  const [tiles, setTiles] = useState<number[]>(() => {
    const used: number[] = [];
    for (const word of normalize(savedValue).split(" ")) {
      const i =
        q.tiles?.findIndex(
          (t, n) => normalize(t) === word && !used.includes(n),
        ) ?? -1;
      if (i >= 0) used.push(i);
    }
    return used;
  });
  const [selected, setSelected] = useState<string | null>(null);
  const ex = useExercises();
  const current = ex.state.active
    ? ex.state.sessions[ex.state.active]
    : undefined;
  const [matched, setMatched] = useState<string[]>(() => [
    ...new Set(
      (current?.attempts ?? [])
        .filter((a) => a.questionId === q.id && a.correct)
        .map((a) => a.wordId),
    ),
  ]);
  const [feedback, setFeedback] = useState("");
  const [reveal, setReveal] = useState(false);
  const started = useRef(0);
  const [seconds, setSeconds] = useState(0);
  const questionStart = current?.questionStartedAt?.[q.id];
  useEffect(() => {
    started.current = questionStart ?? Date.now();
    if (q.type !== "matching" || locked) return;
    const t = setInterval(
      () => setSeconds(Math.floor((Date.now() - started.current) / 1000)),
      1000,
    );
    return () => clearInterval(t);
  }, [q.type, questionStart, locked]);
  const right = shuffle(q.pairs ?? [], q.id + ":right");
  function match(id: string) {
    if (!selected || locked) return;
    void recordMatch(selected, id);
    if (selected === id) {
      const next = [...matched, id];
      setMatched(next);
      setSelected(null);
      setFeedback("Eşleşti! 🌿");
      if (next.length === q.pairs?.length)
        void answerExercise(next.sort().join("|"));
    } else {
      setFeedback("Henüz eşleşmedi. Yeniden deneyebilirsin.");
      setSelected(null);
    }
  }
  const typed = q.type === "tr-de" || q.type === "de-tr";
  const answerValue =
    q.type === "sentence" ? tiles.map((i) => q.tiles?.[i]).join(" ") : value;
  return (
    <div className="question-activity">
      <p
        className="question-prompt"
        lang={q.type === "blank" || q.type === "de-tr" ? "de" : "tr"}
      >
        {q.prompt}
      </p>
      {q.type === "listening" && (
        <div className="listening-panel">
          <Headphones size={40} />
          <Pronunciation text={q.audio ?? ""} />
          <Button
            variant="outline"
            onClick={() => setReveal(true)}
            disabled={locked}
          >
            Sesi kullanamıyorum · Yazılı ipucu
          </Button>
          {reveal && <p lang="de">{q.audio}</p>}
          <p>
            Yazılı ipucuyla da çalışabilirsin; tarayıcı sesi insan kaydı
            değildir.
          </p>
          <button
            className="exercise-text-button"
            onClick={() => void answerExercise("", true)}
            disabled={locked}
          >
            Ses sorusunu puansız geç
          </button>
        </div>
      )}
      {q.type === "matching" ? (
        <>
          <span className="matching-time">
            <Clock size={16} /> {seconds} saniye · Çiftlere dokun
          </span>
          <div className="matching-board">
            <div>
              {q.pairs?.map((p) => (
                <button
                  key={p.id}
                  lang="de"
                  disabled={locked || matched.includes(p.id)}
                  aria-pressed={selected === p.id}
                  onClick={() => setSelected(p.id)}
                >
                  {matched.includes(p.id) && <Check size={16} />} {p.de}
                </button>
              ))}
            </div>
            <div>
              {right.map((p) => (
                <button
                  key={p.id}
                  disabled={locked || matched.includes(p.id)}
                  onClick={() => match(p.id)}
                >
                  {matched.includes(p.id) && <Check size={16} />} {p.tr}
                </button>
              ))}
            </div>
          </div>
          <p role="status">
            {feedback || "Soldan bir sözcük, sağdan anlamını seç."}
          </p>
          {!locked && matched.length === q.pairs?.length && (
            <Button
              onClick={() => void answerExercise([...matched].sort().join("|"))}
            >
              Eşleştirmeyi tamamla
            </Button>
          )}
        </>
      ) : q.type === "sentence" ? (
        <>
          <div className="sentence-answer" aria-label="Oluşturduğun cümle">
            {tiles.length ? (
              tiles.map((index, i) => (
                <button
                  key={index}
                  lang="de"
                  disabled={locked}
                  onClick={() => setTiles(tiles.filter((_, n) => n !== i))}
                >
                  {q.tiles?.[index]}
                </button>
              ))
            ) : (
              <span>Burada cümlen filizlenecek…</span>
            )}
          </div>
          <div className="sentence-bank">
            {q.tiles?.map((tile, i) => (
              <button
                lang="de"
                key={i}
                disabled={locked || tiles.includes(i)}
                onClick={() => setTiles([...tiles, i])}
              >
                {tile}
              </button>
            ))}
          </div>
          <div className="tile-tools">
            <Button
              variant="outline"
              disabled={locked || !tiles.length}
              onClick={() => setTiles(tiles.slice(0, -1))}
            >
              <ArrowLeft size={16} />
              Geri al
            </Button>
            <Button
              variant="outline"
              disabled={locked || !tiles.length}
              onClick={() => setTiles([])}
            >
              <RotateCcw size={16} />
              Sıfırla
            </Button>
          </div>
        </>
      ) : typed ? (
        <label className="translation-input">
          {q.type === "tr-de"
            ? "Almanca yanıtın (artikel isteğe bağlı)"
            : "Türkçe yanıtın"}
          <input
            lang={q.type === "tr-de" ? "de" : "tr"}
            autoComplete="off"
            spellCheck={false}
            disabled={locked}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim() && !locked)
                void answerExercise(value);
            }}
            placeholder="Yanıtını buraya yaz…"
          />
          <small>
            Büyük/küçük harf, noktalama ve fazladan boşluklar dikkate alınmaz.
            Tanımlı eş anlamlı karşılıklar kabul edilir.
          </small>
        </label>
      ) : (
        <div className="answer-options">
          {q.options.map((option, i) => (
            <button
              key={option}
              disabled={locked}
              onClick={() => setValue(option)}
              aria-pressed={value === option}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              <span lang={q.type === "blank" ? "de" : "tr"}>{option}</span>
              {value === option && <Check size={19} />}
            </button>
          ))}
        </div>
      )}
      {q.type !== "matching" && (
        <Button
          className="check-answer"
          disabled={
            locked ||
            !answerValue.trim() ||
            (q.type === "sentence" && tiles.length !== q.tiles?.length)
          }
          onClick={() => void answerExercise(answerValue)}
        >
          <Check size={18} />
          Yanıtımı kontrol et
        </Button>
      )}
    </div>
  );
}
