"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Lightbulb,
  RotateCcw,
  Trophy,
  BookOpen,
  Flower2,
} from "lucide-react";
import type { Topic, Example } from "@/lib/grammar/types";
import { roleLabels } from "@/lib/grammar/types";
import { exampleParts } from "@/lib/grammar/examples";
import { useLearning } from "@/lib/learning/store";
import {
  useGrammar,
  startTopic,
  toggleBookmark,
  finishReading,
  submitPractice,
  startGrammarQuiz,
  submitGrammarQuiz,
  nextGrammarQuestion,
} from "@/lib/grammar/store";
import { score, needsReview } from "@/lib/grammar/engine";
import { isCorrect } from "@/lib/exercises/generate";
import { AnswerInput } from "@/components/exercises/answer-input";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
export function GrammarLesson({ topic: t }: { topic: Topic }) {
  const { state, ready, readonly, notice } = useGrammar();
  const lesson = t.lesson!;
  useEffect(() => {
    if (ready && !readonly) void startTopic(t.id);
  }, [t.id, ready, readonly]);
  const p = state.progress[t.id],
    a = state.attempts[state.activeAttempt[t.id]],
    [practiceFeedback, setPracticeFeedback] = useState<{
      correct: boolean;
      value: string;
    } | null>(null),
    [flipped, setFlipped] = useState(false),
    [tip, setTip] = useState(0);
  const passed = Object.values(state.attempts).some(
    (x) => x.topicId === t.id && x.completedAt !== null && score(x) >= 80,
  );
  const done = p?.completedAt != null;
  const attemptId = a?.id,
    questionIndex = a?.index,
    completedAt = a?.completedAt;
  useEffect(() => {
    if (!attemptId || completedAt !== null) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById("mini-test")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [attemptId, questionIndex, completedAt]);
  const steps = [!!p?.read, !!p?.practicePassed, passed];
  const attempts = Object.values(state.attempts).filter(
    (x) => x.topicId === t.id && x.completedAt !== null,
  );
  const tips = [
    lesson.tip,
    "Hata yapmak öğrenmenin bir parçası. Bir örnekle yeniden deneyelim! 🌷",
    "Kuralı kendi cümlende kullanmak hatırlamayı kolaylaştırır. ✨",
  ];
  return (
    <div className="page-content grammar-lesson grammar-theme-a1">
      <Link href="/gramer" className="grammar-back">
        <ArrowLeft size={17} />
        Gramer bahçesine dön
      </Link>
      <header className="grammar-lesson-header">
        <div>
          <span className="grammar-eyebrow">{t.level} · ETKİLEŞİMLİ DERS</span>
          <h1>{t.title}</h1>
          <p lang="de">{t.german}</p>
        </div>
        <button
          disabled={!ready || readonly}
          aria-label="Bu konuyu kaydet"
          aria-pressed={state.bookmarks.includes(t.id)}
          onClick={() => void toggleBookmark(t.id)}
        >
          <Bookmark size={20} />
          {state.bookmarks.includes(t.id) ? "Kaydedildi" : "Kaydet"}
        </button>
      </header>
      <div className="grammar-lesson-progress">
        <div>
          {steps.map((value, i) => (
            <span key={i} className={value ? "is-done" : ""}>
              {value ? <Check size={15} /> : i + 1}
              {["Oku ve keşfet", "Pratik yap", "Mini testi geç"][i]}
            </span>
          ))}
        </div>
        <Progress
          value={(steps.filter(Boolean).length / 3) * 100}
          aria-label="Konu adımları"
        />
      </div>
      {notice && (
        <p className="grammar-notice" role="status">
          {notice}
        </p>
      )}
      <section className="grammar-intro-card">
        <span className="grammar-eyebrow">BU KONU SANA NE KAZANDIRACAK?</span>
        <h2>Küçük bir kural, yeni bir kapı.</h2>
        <p>{lesson.intro}</p>
        <ul>
          {lesson.objectives.map((goal) => (
            <li key={goal}>
              <Check size={17} />
              {goal}
            </li>
          ))}
        </ul>
      </section>
      <div className="grammar-lesson-columns">
        <div>
          <section className="grammar-rules" aria-labelledby="grammar-rules">
            <h2 id="grammar-rules">Adım adım birlikte çözelim</h2>
            {lesson.rules.map((rule, i) => (
              <details key={rule} open={i === 0}>
                <summary>
                  <span>{i + 1}</span>
                  {lesson.ruleHeadings?.[i] ??
                    [
                      "Temel kural",
                      "Bir adım daha",
                      "Kullanırken dikkat",
                      "Küçük ama önemli",
                    ][i]}
                </summary>
                <p>{rule}</p>
              </details>
            ))}
          </section>
          <section className="grammar-examples">
            <div className="grammar-section-heading">
              <h2>Cümleler renklerle canlansın</h2>
              <span>
                {lesson.examples.some((e) => e.highlights.length)
                  ? "Dokun ve keşfet"
                  : "Örnek ve açıklamayı birlikte oku"}
              </span>
            </div>
            <div className="grammar-legend">
              {Object.entries(roleLabels).map(([id, label]) => (
                <span className={"grammar-role-" + id} key={id}>
                  {label}
                </span>
              ))}
            </div>
            {lesson.examples.map((e, i) => (
              <InteractiveExample key={i} example={e} />
            ))}
            {t.id === "grammar-a1-articles" && <RelatedWords />}
          </section>
          <section className="grammar-mistake">
            <h2>Minik bir hatayı birlikte düzeltelim</h2>
            <button
              className="grammar-flip-card"
              aria-pressed={flipped}
              onClick={() => setFlipped(!flipped)}
            >
              <span>
                {flipped ? "Doğru biçim" : "Sık görülen hata"} · Kartı çevirmek
                için dokun
              </span>
              <strong lang="de">
                {flipped ? lesson.mistake.right : lesson.mistake.wrong}
              </strong>
              <small>
                {flipped
                  ? lesson.mistake.why
                  : "Neresi değişmeli? Önce kendin düşün."}
              </small>
              <RotateCcw size={17} />
            </button>
          </section>
          <Button
            className="grammar-read-button"
            disabled={!ready || readonly || !!p?.read}
            onClick={() => void finishReading(t.id)}
          >
            <Check size={17} />
            {p?.read
              ? "Okuma adımı kaydedildi"
              : "Konuyu okudum, örnekleri keşfettim"}
          </Button>
        </div>
        <aside className="grammar-lumi-tip">
          <LumiMascot
            expression={done ? "celebrating" : "encouraging"}
            decorative
          />
          <span className="grammar-eyebrow">LUMI’NİN KÜÇÜK NOTU</span>
          <p aria-live="polite">{tips[tip]}</p>
          <button onClick={() => setTip((tip + 1) % tips.length)}>
            Bir ipucu daha <ArrowRight size={15} />
          </button>
          <small>Önceden hazırlanmış ipuçları</small>
        </aside>
      </div>
      <section className="grammar-practice" id="pratik">
        <span className="grammar-eyebrow">MİNİ MEYDAN OKUMA</span>
        <h2>Şimdi sıra sende 🌱</h2>
        <p>
          Hatalı bölümün doğrusunu yaz. Noktalama ve büyük/küçük harf
          farklılıkları kabul edilir.
        </p>
        <AnswerInput
          key={t.id + ":practice:" + Number(practiceFeedback?.correct)}
          question={lesson.practice}
          locked={readonly || !p || !!practiceFeedback?.correct}
          savedValue={practiceFeedback?.correct ? practiceFeedback.value : ""}
          onSubmit={(value) => {
            const correct = isCorrect(lesson.practice, value);
            setPracticeFeedback({ correct, value });
            if (correct) void submitPractice(t.id, value);
          }}
        />
        {practiceFeedback && (
          <div
            className={
              "grammar-feedback " +
              (practiceFeedback.correct ? "grammar-success" : "grammar-gentle")
            }
            role="status"
          >
            <strong>
              {practiceFeedback.correct
                ? "Harika, küçük bir filiz daha!"
                : "Güzel bir deneme, birlikte bakalım."}
            </strong>
            <p>
              Doğru yanıt: <span lang="de">{lesson.practice.accepted[0]}</span>
            </p>
            <p>{lesson.practice.explanation}</p>
          </div>
        )}
        {p?.practicePassed && (
          <p className="grammar-passed">
            <Check size={16} />
            Bu pratiği başarıyla tamamladın; yeniden okumak ödülleri
            tekrarlamaz.
          </p>
        )}
      </section>
      <section className="grammar-quiz" id="mini-test">
        <div className="grammar-section-heading">
          <div>
            <span className="grammar-eyebrow">BİLGİNİ ÇİÇEKLENDİR</span>
            <h2>{lesson.quiz.length} soruluk konu testi</h2>
          </div>
          <Trophy size={32} />
        </div>
        <p>
          Geçme hedefi: {lesson.quiz.length} soruda en az{" "}
          {Math.ceil(lesson.quiz.length * 0.8)} doğru (%80). Yanlışlar kaynak
          kaybettirmez. İstediğin kadar tekrar deneyebilirsin.
        </p>
        {!a ? (
          <Button
            disabled={!p || readonly}
            onClick={() => void startGrammarQuiz(t.id)}
          >
            Mini testi başlat <ArrowRight size={17} />
          </Button>
        ) : a.completedAt !== null ? (
          <div className="grammar-quiz-result">
            <strong>%{score(a)} başarı</strong>
            <p>
              {Object.values(a.answers).filter((x) => x.correct).length} /{" "}
              {a.questions.length}
              doğru · {attempts.length} tamamlanan deneme
            </p>
            <p>
              {score(a) >= 80
                ? "Mini testi geçtin!"
                : "Bazı konular tekrar istiyor. İpuçlarına göz atıp yeniden deneyebilirsin."}
            </p>
            <Button
              disabled={readonly}
              onClick={() => void startGrammarQuiz(t.id)}
            >
              <RotateCcw size={17} />
              Yeniden dene
            </Button>
            <div className="grammar-answer-review" role="status">
              <strong>
                Son yanıtın:{" "}
                {a.answers[a.questions[a.index].id].correct
                  ? "Doğru 🌼"
                  : "Birlikte yeniden bakalım 🌷"}
              </strong>
              <p>Doğru karşılık: {a.questions[a.index].accepted[0]}</p>
              <p>{a.questions[a.index].explanation}</p>
            </div>
            <details>
              <summary>Yanıtları ve nedenlerini incele</summary>
              {a.questions.map((q) => (
                <div className="grammar-answer-review" key={q.id}>
                  <strong>{q.prompt}</strong>
                  <p>Yanıtın: {a.answers[q.id]?.value}</p>
                  <p>Doğru karşılık: {q.accepted[0]}</p>
                  <p>{q.explanation}</p>
                </div>
              ))}
            </details>
          </div>
        ) : (
          <>
            <div className="grammar-quiz-position">
              <span>
                Soru {a.index + 1} / {a.questions.length}
              </span>
              <Progress
                value={
                  (Object.keys(a.answers).length / a.questions.length) * 100
                }
                aria-label="Mini test ilerlemesi"
              />
            </div>
            <AnswerInput
              key={a.id + ":" + a.index}
              question={a.questions[a.index]}
              savedValue={a.answers[a.questions[a.index].id]?.value ?? ""}
              locked={readonly || !!a.answers[a.questions[a.index].id]}
              onSubmit={(value) => void submitGrammarQuiz(a.id, value)}
            />
            {a.answers[a.questions[a.index].id] && (
              <div
                className={
                  "grammar-feedback " +
                  (a.answers[a.questions[a.index].id].correct
                    ? "grammar-success"
                    : "grammar-gentle")
                }
                role="status"
              >
                <strong>
                  {a.answers[a.questions[a.index].id].correct
                    ? "İşte bu! 🌼"
                    : "Birlikte yeniden bakalım 🌷"}
                </strong>
                <p>Doğru karşılık: {a.questions[a.index].accepted[0]}</p>
                <p>{a.questions[a.index].explanation}</p>
                <Button onClick={() => void nextGrammarQuestion(a.id)}>
                  Sonraki soru <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
      <section
        className={
          "grammar-completion " + (done ? "grammar-completion-done" : "")
        }
      >
        <Flower2 size={34} />
        <div>
          <h2>
            {done
              ? "Bu konu bahçende çiçek açtı!"
              : "Üç küçük adımın ardından çiçek açacak."}
          </h2>
          <p>
            {done
              ? "İlk tamamlama ödülü: 15 XP + 10 bahçe parası. Tekrarlar ek ödül vermez."
              : !p?.read
                ? "Okuma adımını onaylayarak devam et."
                : !p.practicePassed
                  ? "Pratiği doğru yanıtlayarak devam et."
                  : "Mini testte en az %80 başarıya ulaş."}
          </p>
          {needsReview(state, t.id) && (
            <p>
              Son mini testin tekrar istiyor. Daha önce kazanılmış tamamlanma
              kaydın korunur.
            </p>
          )}
          {state.claims.some((c) => !c.delivered) && (
            <p>Kaydedilmiş ödüller aktarılmayı bekliyor.</p>
          )}
        </div>
      </section>
      <nav className="grammar-lesson-bottom" aria-label="Ders sonrası gezinme">
        <Button asChild variant="outline">
          <Link href="/gramer">
            <BookOpen size={17} />
            Gramer bahçesine dön
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/derslerim">Öğrenme haritama git</Link>
        </Button>
        <Button asChild>
          <Link href="/bahcem">
            Bahçeme git <ArrowRight size={17} />
          </Link>
        </Button>
      </nav>
    </div>
  );
}
function InteractiveExample({ example: e }: { example: Example }) {
  const [hint, setHint] = useState(
    e.highlights.length
      ? "Renkli bir bölüme dokun; cümledeki görevini keşfet."
      : "Biçimi ve sözcük sırasını, örneğin açıklamasıyla birlikte kontrol et.",
  );
  const pieces = exampleParts(e);
  return (
    <article className="grammar-example">
      <p lang="de">
        {pieces.map(({ text, highlight: h }, i) => {
          return h ? (
            <button
              key={i}
              className={"grammar-role-" + h.role}
              aria-label={text + " — " + roleLabels[h.role]}
              onClick={() => setHint(roleLabels[h.role] + ": " + h.hint)}
            >
              {text}
              <small>{roleLabels[h.role]}</small>
            </button>
          ) : (
            <span key={i}>{text}</span>
          );
        })}
      </p>
      <p className="grammar-example-translation">{e.tr}</p>
      {e.explanation && (
        <p>
          <strong>Neden böyle?</strong> {e.explanation}
        </p>
      )}
      <div className="grammar-example-hint" role="status">
        <Lightbulb size={15} />
        {hint}
      </div>
    </article>
  );
}

function RelatedWords() {
  const { repository } = useLearning();
  const words = repository
    .all()
    .filter((w) => ["Apfel", "Blume", "Buch"].includes(w.german_word));
  return (
    <div className="grammar-related-words">
      <h3>Kelime hazinenden küçük örnekler</h3>
      {words.map((w) => (
        <div key={w.id}>
          <strong lang="de">
            {w.article} {w.german_word}
          </strong>
          <span>{w.turkish_meaning}</span>
          <small lang="de">Çoğul: {w.plural_form ?? w.plural_note}</small>
        </div>
      ))}
      <Link href="/kelimelerim">Kelime hazineme git →</Link>
    </div>
  );
}
