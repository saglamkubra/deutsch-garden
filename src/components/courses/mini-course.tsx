"use client";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  Sprout,
  Volume2,
} from "lucide-react";
import type {
  MiniCourse as Course,
  CourseProgress,
  CourseQuestion,
  PracticeAnswer,
  CourseExample,
} from "@/lib/courses/types";
import { Pronunciation } from "@/components/learning/pronunciation";
import { highlightedExample } from "@/lib/courses/content";
import {
  useCourses,
  startMiniCourse,
  acknowledgeCourse,
  answerCourse,
  advanceCourse,
  finishMiniCourse,
  retryCourseDelivery,
} from "@/lib/courses/store";
import {
  teachingDone,
  exampleGate,
  examplesDone,
  guidedDone,
  independentDone,
  unresolved,
  progressPercent,
} from "@/lib/courses/engine";
import { courseAudio as audioAssets } from "@/lib/courses/audio";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnswerInput } from "@/components/exercises/answer-input";
import { LumiMascot } from "@/components/garden/lumi-mascot";
const sections = [
  ["learn", "Konuyu Öğren"],
  ["examples", "Örneklerle Öğren"],
  ["guided", "Birlikte Deneyelim"],
  ["practice", "Şimdi Sıra Sende"],
  ["summary", "Ders Özeti"],
  ["mistakes", "Hatalarımı Tekrar Et"],
] as const;
type Section = (typeof sections)[number][0];
export function MiniCourse({
  course: c,
  disabled = false,
}: {
  course: Course;
  disabled?: boolean;
}) {
  const { state, ready, readonly, notice } = useCourses(),
    p = state.progress[c.id];
  const [section, setSection] = useState<Section>("learn");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (ready && !readonly && !p) void startMiniCourse(c.id);
  }, [ready, readonly, p, c.id]);
  const blocked = disabled || readonly || !ready;
  function go(next: Section) {
    setSection(next);
    requestAnimationFrame(() => {
      heading.current?.focus();
      heading.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }
  const marks = p
    ? {
        learn: teachingDone(c, p),
        examples: examplesDone(c, p),
        guided: guidedDone(c, p),
        practice: independentDone(c, p),
        summary: p.summary,
        mistakes: unresolved(c, p).length === 0,
      }
    : null;
  return (
    <section className="mini-course" aria-labelledby="mini-course-heading">
      <header className="course-welcome">
        <div>
          <span className="course-eyebrow">
            {c.level} · MEVCUT KELİME PATİKANIN İÇİNDE
          </span>
          <h2 id="mini-course-heading">{c.title}</h2>
          <p>{c.goal}</p>
          <div className="course-session-tags">
            <span>📖 Açıklamalı öğretim</span>
            <span>🌼 {c.examples.length} açıklamalı örnek</span>
            <span>✏️ {c.guided.length + c.independent.length} soru</span>
            <span>🌱 Adım adım pratik</span>
          </div>
        </div>
        <LumiMascot
          expression={p?.completedAt != null ? "celebrating" : "encouraging"}
          decorative
        />
      </header>
      {c.studyPlan && (
        <details className="course-study-plan" open>
          <summary>Bu derste nasıl ilerleyeceğiz?</summary>
          <h3>Başlamadan önce</h3>
          <ul>
            {c.studyPlan.prerequisites.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h3>Ders sonunda yapabileceklerin</h3>
          <ul>
            {c.studyPlan.objectives.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <div className="course-study-sessions">
            {c.studyPlan.sessions.map((x) => (
              <article key={x.title}>
                <h4>{x.title}</h4>
                <p>{x.description}</p>
              </article>
            ))}
          </div>
          <p>
            İlk yanıtın ve düzeltmelerin ayrı saklanır. Yazılı sorular verilen
            kalıbı denetler; serbest bir çevirinin başka doğru karşılıkları da
            olabilir.
          </p>
        </details>
      )}
      {notice && (
        <p className="course-notice" role="status">
          {notice}
        </p>
      )}
      <div className="course-overall">
        <span>
          {p?.completedAt != null
            ? "Mini-kurs tamamlandı · İstediğin zaman tekrar bakabilirsin"
            : "Mini-kurs ilerlemen · Bu cihazda kaydedilir"}
        </span>
        <strong>%{progressPercent(c, p)}</strong>
        <Progress
          value={progressPercent(c, p)}
          aria-label="Mini-kursun gerçek etkinlik ilerlemesi"
        />
      </div>
      <nav className="course-tabs" aria-label="Dersin bölümleri">
        {sections.map(([id, label], i) => (
          <button
            key={id}
            aria-current={section === id ? "step" : undefined}
            onClick={() => go(id)}
          >
            <span>{marks?.[id] ? <Check size={14} /> : i + 1}</span>
            {label}
            {id === "mistakes" && p && unresolved(c, p).length > 0 && (
              <small>{unresolved(c, p).length}</small>
            )}
          </button>
        ))}
      </nav>
      <div className="course-section-title">
        <span className="course-eyebrow">
          KÜÇÜK ADIMLARLA KALICI BİR ÖĞRENME
        </span>
        <h3 ref={heading} tabIndex={-1}>
          {sections.find((s) => s[0] === section)?.[1]}
        </h3>
      </div>
      {!p ? (
        <p className="course-notice">
          {readonly
            ? "Kayıt kullanılamıyor. Öğretim içeriği için aşağıdaki açıklamaları inceleyebilirsin."
            : "Ders kaydın hazırlanıyor…"}
        </p>
      ) : null}
      {section === "learn" && (
        <Teaching
          course={c}
          progress={p}
          disabled={blocked}
          onNext={() => go("examples")}
        />
      )}
      {section === "examples" && (
        <Examples
          course={c}
          progress={p}
          disabled={blocked}
          onNext={() => go("guided")}
          onTeaching={() => go("learn")}
        />
      )}
      {section === "guided" && p && (
        <Practice
          course={c}
          progress={p}
          mode="guided"
          disabled={blocked}
          onNext={() => go("practice")}
        />
      )}
      {section === "practice" && p && (
        <Practice
          course={c}
          progress={p}
          mode="independent"
          disabled={blocked}
          onNext={() => go(unresolved(c, p).length ? "mistakes" : "summary")}
        />
      )}
      {section === "summary" && (
        <CourseSummary
          course={c}
          progress={p}
          disabled={blocked}
          onMistakes={() => go("mistakes")}
        />
      )}
      {section === "mistakes" && p && (
        <Mistakes
          course={c}
          progress={p}
          disabled={blocked}
          onNext={() => go("summary")}
        />
      )}
      {p && state.claims.some((x) => x.lessonId === c.id && !x.delivered) && (
        <p className="course-notice" role="status">
          Tamamlanman kayıtlı; ödül aktarımı bekliyor.{" "}
          <button onClick={() => void retryCourseDelivery()}>
            Yeniden dene
          </button>
        </p>
      )}
      <footer className="course-footnote">
        Önceki kelime turların ve bahçe kaynakların korunur. Mini-kursun yeni
        tamamlanma kaydı; öğretim, örnekler, pratikler, hata düzeltmeleri ve
        özet bitince oluşur. Ödüller bir kez verilir.
      </footer>
    </section>
  );
}
function Teaching({
  course: c,
  progress: p,
  disabled,
  onNext,
}: {
  course: Course;
  progress?: CourseProgress;
  disabled: boolean;
  onNext: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null),
    index = selected ?? Math.min(p?.read.length ?? 0, c.steps.length - 1),
    step = c.steps[index];
  const done = !!p?.read.includes(step.id);
  return (
    <div className="course-teaching">
      <p className="course-intro">
        Kuralları birer birer keşfet. Her adımın kullanımını, yapısını ve sık
        yapılan hatasını birlikte inceleyelim.
      </p>
      <div className="course-step-picker" aria-label="Öğretim adımları">
        {c.steps.map((s, i) => (
          <button
            key={s.id}
            aria-pressed={index === i}
            disabled={!!p && i > p.read.length}
            onClick={() => setSelected(i)}
          >
            {p?.read.includes(s.id) ? "✓" : i + 1}
          </button>
        ))}
      </div>
      <article className="course-rule-card" key={step.id}>
        <span className="course-eyebrow">
          ADIM {index + 1} / {c.steps.length}
        </span>
        <h4>{step.title}</h4>
        <p>{step.introduction}</p>
        <div className="course-rule">
          <Lightbulb size={20} />
          <div>
            <strong>Kuralı keşfet</strong>
            <p>{step.rule}</p>
          </div>
        </div>
        <h5>Ne zaman kullanırım?</h5>
        <p>{step.usage}</p>
        <div className="course-structure">
          <span>CÜMLE YAPISI</span>
          <p>{step.structure}</p>
        </div>
        {step.details?.map((detail) => (
          <section className="course-teacher-detail" key={detail.title}>
            <h5>{detail.title}</h5>
            <p>{detail.body}</p>
          </section>
        ))}
        {index === c.steps.length - 1 &&
          c.texts?.map((text) => <CourseText key={text.id} text={text} />)}
        {step.table && <Conjugation key={step.id} table={step.table} />}
        <details className="course-common-mistake">
          <summary>Sık yapılan hata · Türkçeden farklı olan ne?</summary>
          <p>{step.mistake}</p>
        </details>
        <div className="course-memory">
          🌼{" "}
          <div>
            <strong>Lumi’nin hatırlama ipucu</strong>
            <p>{step.memory}</p>
          </div>
        </div>
        <div className="course-lesson-actions">
          {index > 0 && (
            <Button variant="outline" onClick={() => setSelected(index - 1)}>
              <ArrowLeft size={15} />
              Önceki açıklama
            </Button>
          )}
          {!done ? (
            <Button
              disabled={disabled}
              onClick={async () => {
                await acknowledgeCourse(c.id, "read", step.id);
                setSelected(null);
              }}
            >
              <Check size={16} />
              Bu açıklamayı anladım
            </Button>
          ) : index < c.steps.length - 1 ? (
            <Button onClick={() => setSelected(index + 1)}>
              Sonraki açıklama <ArrowRight size={15} />
            </Button>
          ) : (
            <Button onClick={onNext}>
              Örneklerle devam et <ArrowRight size={15} />
            </Button>
          )}
        </div>
      </article>
      {p && teachingDone(c, p) && (
        <p className="course-success">
          ✓ Öğretim açıklamalarının tamamını çalıştın. Eski adımlara istediğin
          zaman geri dönebilirsin.
        </p>
      )}
    </div>
  );
}
function Conjugation({
  table,
}: {
  table: { heading: string; rows: [string, string, string][] };
}) {
  const [row, setRow] = useState<number | null>(null);
  return (
    <section className="course-conjugation">
      <h5>{table.heading}</h5>
      <p>Bir satıra dokun; ilgili biçimi ve anlamı aç.</p>
      <div>
        {table.rows.map(([subject, form, meaning], i) => (
          <button
            key={i}
            aria-expanded={row === i}
            onClick={() => setRow(row === i ? null : i)}
          >
            <strong
              lang="de"
              className={
                subject.startsWith("der")
                  ? "article-der"
                  : subject.startsWith("die")
                    ? "article-die"
                    : subject.startsWith("das")
                      ? "article-das"
                      : ""
              }
            >
              {subject}
            </strong>
            {row === i ? (
              <span>
                <b lang="de">{form}</b>
                <small>{meaning}</small>
              </span>
            ) : (
              <span className="course-table-reveal">Biçimi göster +</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
function Examples({
  course: c,
  progress: p,
  disabled,
  onNext,
  onTeaching,
}: {
  course: Course;
  progress?: CourseProgress;
  disabled: boolean;
  onNext: () => void;
  onTeaching: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null),
    index =
      selected ?? Math.min(p?.examples.length ?? 0, c.examples.length - 1),
    e = c.examples[index],
    gate = exampleGate(c, p, e.id),
    allowed = gate.kind === "ready",
    done = !!p?.examples.includes(e.id);
  const noticeId = useId();
  return (
    <>
      <p className="course-intro">
        Kısa cümlelerden daha ayrıntılı yapılara doğru ilerle. Her örnekte
        Almanca yapıyı, Türkçe karşılığını ve neden doğru olduğunu incele.
      </p>
      <div className="course-example-picker" aria-label="Açıklamalı örnekler">
        {c.examples.map((example, i) => (
          <button
            key={example.id}
            aria-pressed={index === i}
            onClick={() => setSelected(i)}
          >
            {i + 1}
            {p?.examples.includes(example.id) && " ✓"}
          </button>
        ))}
      </div>
      <ExampleCard key={e.id} example={e} />
      {!done && disabled && allowed && (
        <p className="course-notice" role="status">
          Öğrenme kaydı şu anda değiştirilemiyor. Sayfanın üstündeki kayıt
          uyarısını kontrol et; ses dosyasını dinlemek için ilerleme kaydı
          gerekmez.
        </p>
      )}
      {!done && !allowed && (
        <div className="course-notice" id={noticeId} role="status">
          {gate.kind === "teaching" ? (
            <>
              <p>
                Bu örneği kaydetmeden önce {gate.index + 1}. anlatımı tamamla:{" "}
                <strong>{c.steps[gate.index].title}</strong>. Önceki kayıtların
                korunuyor; ses dinlemek bu düğmenin koşulu değildir.
              </p>
              <Button variant="outline" onClick={onTeaching}>
                Eksik anlatıma dön
              </Button>
            </>
          ) : gate.kind === "example" ? (
            <>
              <p>
                Örnekler sırayla kaydedilir. Önce {gate.index + 1}. örneği
                onaylamalısın.
              </p>
              <Button variant="outline" onClick={() => setSelected(gate.index)}>
                Sıradaki tamamlanmamış örneğe dön
              </Button>
            </>
          ) : (
            <p>
              Ders kaydı hazırlanıyor. Kayıt uyarısı varsa sayfanın üstündeki
              açıklamayı kontrol et.
            </p>
          )}
        </div>
      )}
      <div className="course-lesson-actions">
        {index > 0 && (
          <Button variant="outline" onClick={() => setSelected(index - 1)}>
            <ArrowLeft size={15} />
            Önceki örnek
          </Button>
        )}
        {!done ? (
          <Button
            disabled={disabled || !allowed}
            aria-describedby={!allowed ? noticeId : undefined}
            onClick={async () => {
              await acknowledgeCourse(c.id, "examples", e.id);
              setSelected(null);
            }}
          >
            <Check size={16} />
            Bu örneği anladım
          </Button>
        ) : index < c.examples.length - 1 ? (
          <Button onClick={() => setSelected(index + 1)}>
            Sonraki örnek <ArrowRight size={15} />
          </Button>
        ) : (
          <Button onClick={onNext}>
            Birlikte deneyelim <ArrowRight size={15} />
          </Button>
        )}
      </div>
      {p && examplesDone(c, p) && (
        <p className="course-success">
          ✓ {c.examples.length} örneği açıklamalarıyla çalıştın.
        </p>
      )}
    </>
  );
}
function ExampleCard({ example: e }: { example: CourseExample }) {
  const [translation, setTranslation] = useState(false);
  return (
    <article className="course-example-card">
      <span className="course-eyebrow">
        ALMANCAYI ÖNCE KENDİN ANLAMAYI DENE
      </span>
      <p className="course-example-german" lang="de">
        {highlightedExample(e.de, e.highlights).map((part, i) =>
          part.highlight ? <mark key={i}>{part.text}</mark> : part.text,
        )}
      </p>
      <button
        className="course-reveal"
        aria-expanded={translation}
        onClick={() => setTranslation(!translation)}
      >
        {translation ? "Türkçeyi gizle" : "Türkçe anlamını aç"}{" "}
        <span>{translation ? "−" : "+"}</span>
      </button>
      {translation && <p className="course-example-translation">{e.tr}</p>}
      <div className="course-example-why">
        <strong>Neden böyle söylüyoruz?</strong>
        <p>{e.explanation}</p>
      </div>
      {!audioAssets[e.id] && (
        <div className="course-device-audio">
          <Pronunciation text={e.de} />
          <small>
            Desteklenen cihazın Almanca sesiyle okunur; önceden kaydedilmiş ses
            dosyası değildir.
          </small>
        </div>
      )}
      {audioAssets[e.id] && (
        <RecordedAudio assetId={e.id} label="Almanca örnek cümleyi dinle" />
      )}
    </article>
  );
}
function RecordedAudio({ assetId, label }: { assetId: string; label: string }) {
  const ref = useRef<HTMLAudioElement>(null),
    asset = audioAssets[assetId];
  const [error, setError] = useState(false),
    [rate, setRate] = useState(1);
  useEffect(() => {
    const a = ref.current;
    return () => {
      a?.pause();
    };
  }, []);
  return asset ? (
    <div className="course-recording">
      <span>
        <Volume2 size={15} />
        {label}
      </span>
      <audio
        ref={ref}
        controls
        preload="none"
        src={asset.url}
        aria-label={label}
        onLoadedMetadata={() => {
          if (ref.current) {
            ref.current.preservesPitch = true;
            ref.current.playbackRate = rate;
          }
        }}
        onError={() => setError(true)}
      />
      <label>
        Ses hızı{" "}
        <select
          aria-label="Örnek ses hızı"
          value={rate}
          onChange={(event) => {
            const speed = Number(event.target.value);
            setRate(speed);
            if (ref.current) ref.current.playbackRate = speed;
          }}
        >
          <option value={0.65}>Çok yavaş · 0,65×</option>
          <option value={0.85}>Yavaş · 0,85×</option>
          <option value={1}>Normal · 1×</option>
        </select>
      </label>
      {error && (
        <div role="status">
          <p>
            Ses dosyası yüklenemedi. Bağlantını kontrol edip yeniden
            deneyebilirsin. Bu durum örneği anladığını kaydetmeni engellemez.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setError(false);
              ref.current?.load();
            }}
          >
            Sesi yeniden yükle
          </Button>
        </div>
      )}
      <small>
        Gerçek ses dosyası · Önceden oluşturulmuş Almanca yapay ses, Piper /
        Thorsten.
      </small>
    </div>
  ) : null;
}
function Practice({
  course: c,
  progress: p,
  mode,
  disabled,
  onNext,
}: {
  course: Course;
  progress: CourseProgress;
  mode: "guided" | "independent";
  disabled: boolean;
  onNext: () => void;
}) {
  const list = c[mode],
    index = mode === "guided" ? p.guidedIndex : p.independentIndex,
    q = list[index],
    answer = mode === "guided" ? p.guided[q.id]?.at(-1) : p.independent[q.id],
    allowed =
      teachingDone(c, p) &&
      examplesDone(c, p) &&
      (mode === "guided" || guidedDone(c, p)),
    finished =
      mode === "guided"
        ? guidedDone(c, p)
        : list.every((q) => p.independent[q.id]);
  return (
    <>
      <p className="course-intro">
        {mode === "guided"
          ? "Burada birlikte öğreniyoruz. Yanlış yanıttan sonra açıklamayı oku ve aynı soruyu yeniden dene. Doğru yanıt, sonraki adıma geçmeni sağlar."
          : "Artık kendi başınasın. İlk yanıtın kaydedilir; yanlışları Hatalarımı Tekrar Et bölümünde açıklamalarıyla düzeltebilirsin. Yanıtlar için ayrı ayrı XP verilmez."}
      </p>
      {!allowed && (
        <p className="course-notice">
          {!teachingDone(c, p) || !examplesDone(c, p)
            ? "Önce öğretim açıklamalarını ve tüm örnekleri çalış."
            : "Önce yönlendirmeli altı soruyu doğru yanıtlayarak tamamla."}
        </p>
      )}
      <div className="course-question-counter">
        <strong>
          {mode === "guided" ? "Birlikte" : "Kendi başına"} · {index + 1} /{" "}
          {list.length}
        </strong>
        <span>{q.kindLabel}</span>
      </div>
      <Progress
        value={
          ((mode === "guided"
            ? list.filter((q) => p.guided[q.id]?.at(-1)?.correct).length
            : Object.keys(p.independent).length) /
            list.length) *
          100
        }
        aria-label={
          mode === "guided"
            ? "Yönlendirmeli pratik ilerlemesi"
            : "Bağımsız pratikte yanıtlanan sorular"
        }
      />
      <QuestionCard
        question={q}
        context={c.texts?.find((t) => t.id === q.contextId)}
        answer={answer}
        attemptCount={mode === "guided" ? (p.guided[q.id]?.length ?? 0) : 0}
        retryable={mode === "guided"}
        disabled={disabled || !allowed}
        onAnswer={(value) => void answerCourse(c.id, mode, q.id, value)}
      />
      {answer &&
        (mode === "independent" || answer.correct) &&
        index < list.length - 1 && (
          <Button onClick={() => void advanceCourse(c.id, mode)}>
            Sonraki soru <ArrowRight size={16} />
          </Button>
        )}
      {finished && (
        <div className="course-practice-finished">
          <h4>
            {mode === "guided"
              ? `Harika! Birlikte ${c.guided.length} soruyu tamamladık.`
              : "Bağımsız pratiğin yanıtlandı."}
          </h4>
          {mode === "independent" && (
            <p>
              İlk yanıtlarında{" "}
              {Object.values(p.independent).filter((a) => a.correct).length}/
              {list.length} doğru. {unresolved(c, p).length} soru yeniden
              çalışılmayı bekliyor.
            </p>
          )}
          <Button onClick={onNext}>
            {mode === "guided"
              ? "Şimdi sıra sende"
              : unresolved(c, p).length
                ? "Hatalarımı tekrar edeyim"
                : "Ders özetine geç"}
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </>
  );
}
function QuestionCard({
  question: q,
  context,
  answer,
  attemptCount,
  retryable,
  disabled,
  onAnswer,
}: {
  question: CourseQuestion;
  context?: NonNullable<Course["texts"]>[number];
  answer?: PracticeAnswer;
  attemptCount: number;
  retryable: boolean;
  disabled: boolean;
  onAnswer: (value: string) => void;
}) {
  const [hint, setHint] = useState(false),
    locked = disabled || (!!answer && (!retryable || answer.correct));
  return (
    <article className="course-question-card">
      {context && <CourseText text={context} />}
      {q.audioExampleId && (
        <RecordedAudio
          key={q.id}
          assetId={q.audioExampleId}
          label="Sorunun Almanca kaydını dinle"
        />
      )}
      <AnswerInput
        key={q.id + ":" + (retryable ? attemptCount : 0)}
        question={q}
        locked={locked}
        savedValue={locked ? answer?.value : ""}
        onSubmit={onAnswer}
      />
      {retryable && (
        <>
          <button
            className="course-reveal"
            aria-expanded={hint}
            onClick={() => setHint(!hint)}
          >
            <Lightbulb size={15} />
            Bir ipucu al
          </button>
          {hint && <p className="course-hint">{q.hints.join(" ")}</p>}
        </>
      )}
      {answer && (
        <div
          className={
            answer.correct
              ? "course-answer-feedback correct"
              : "course-answer-feedback"
          }
          role="status"
        >
          <strong>
            {answer.correct
              ? "Doğru, yapıyı yakaladın!"
              : "Birlikte yeniden düşünelim."}
          </strong>
          <p>{q.explanation}</p>
          <p>
            <b>Hatırla:</b> {q.rule}
          </p>
          {!answer.correct && q.optionNotes?.[answer.value] && (
            <p>
              <b>Seçtiğin seçenek:</b> {q.optionNotes[answer.value]}
            </p>
          )}
          {!answer.correct && (
            <p>
              Doğru yanıt: <span lang="de">{q.accepted[0]}</span>
            </p>
          )}
          {!answer.correct && retryable && (
            <p>
              Yukarıdaki alanı kullanarak yeniden deneyebilirsin. Yanlış denemen
              geçmişte korunur.
            </p>
          )}
          {q.optionNotes && (
            <details>
              <summary>Diğer seçeneklerin açıklaması</summary>
              {Object.entries(q.optionNotes).map(([option, note]) => (
                <p key={option}>
                  <b lang="de">{option}</b>: {note}
                </p>
              ))}
            </details>
          )}
        </div>
      )}
    </article>
  );
}
function CourseSummary({
  course: c,
  progress: p,
  disabled,
  onMistakes,
}: {
  course: Course;
  progress?: CourseProgress;
  disabled: boolean;
  onMistakes: () => void;
}) {
  const canFinish =
    !!p &&
    teachingDone(c, p) &&
    examplesDone(c, p) &&
    guidedDone(c, p) &&
    independentDone(c, p);
  return (
    <div className="course-summary">
      <p className="course-intro">
        Bu özet hep burada kalır. Dersi tamamladıktan sonra da tekrar için
        açabilirsin.
      </p>
      <article>
        <h4>Yanına alacağın küçük kurallar</h4>
        <ol>
          {c.summary.takeaways.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </article>
      <article>
        <h4>Anahtar kelimeler ve yapılar</h4>
        <div className="course-summary-words">
          {c.summary.vocabulary.map((w) => (
            <div key={w.de}>
              <strong lang="de">{w.de}</strong>
              <span>{w.tr}</span>
            </div>
          ))}
        </div>
      </article>
      <article>
        <h4>Bu hatalara dikkat</h4>
        {c.summary.mistakes.map((m) => (
          <p key={m}>🌿 {m}</p>
        ))}
      </article>
      <article>
        <h4>Üç küçük hatırlatma cümlesi</h4>
        {c.summary.examples.map((e) => (
          <p key={e} lang="de">
            {e}
          </p>
        ))}
      </article>
      {c.summary.writingChecklist && (
        <section className="course-study-plan">
          <h4>Kendi anlatını oluştur · İsteğe bağlı</h4>
          <ul>
            {c.summary.writingChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {p?.completedAt != null ? (
        <div className="course-completed">
          <Sprout size={32} />
          <h4>Mini-kursu tamamladın!</h4>
          <p>
            20 XP ve 10 bahçe parası için tekil ödül kaydın oluşturuldu. Tekrar
            okumak aynı ödülü yeniden vermez.
          </p>
        </div>
      ) : (
        <div className="course-completion-checklist">
          <h4>Tamamlamaya giden adımlar</h4>
          {[
            ["Öğretim açıklamaları", !!p && teachingDone(c, p)],
            ["Açıklamalı örnekler", !!p && examplesDone(c, p)],
            [`${c.guided.length} yönlendirmeli soru`, !!p && guidedDone(c, p)],
            [
              `${c.independent.length} bağımsız soru ve yanlışların düzeltilmesi`,
              !!p && independentDone(c, p),
            ],
          ].map(([label, done]) => (
            <p key={String(label)}>
              {done ? "✓" : "○"} {label}
            </p>
          ))}
          {p && unresolved(c, p).length > 0 && (
            <Button variant="outline" onClick={onMistakes}>
              <RotateCcw size={16} />
              Yanlışlarımı çalış
            </Button>
          )}
          <Button
            disabled={disabled || !canFinish}
            onClick={() => void finishMiniCourse(c.id)}
          >
            <Check size={17} />
            Özeti okudum, dersi tamamla
          </Button>
        </div>
      )}
    </div>
  );
}
function Mistakes({
  course: c,
  progress: p,
  disabled,
  onNext,
}: {
  course: Course;
  progress: CourseProgress;
  disabled: boolean;
  onNext: () => void;
}) {
  const missed = c.independent.filter(
      (q) => p.independent[q.id]?.correct === false,
    ),
    [selected, setSelected] = useState<string | null>(null),
    q =
      missed.find((q) => q.id === selected) ?? unresolved(c, p)[0] ?? missed[0],
    guidedErrors = c.guided.filter((q) =>
      p.guided[q.id]?.some((a) => !a.correct),
    );
  return (
    <>
      <p className="course-intro">
        Yanlış yapmak öğrenmenin parçası. Kuralı hatırla, yanıtını düzelt.
        Kelimeye bağlı hatalar mevcut aralıklı tekrar listene de tekil kayıtla
        eklenir; dilbilgisi hataları bu derste saklanır.
      </p>
      {!missed.length && !guidedErrors.length && (
        <p className="course-success">
          Henüz kayıtlı yanlışın yok. Yeni bir hata olursa burada bulacaksın.
        </p>
      )}
      {guidedErrors.length > 0 && (
        <details className="course-guided-history">
          <summary>
            Yönlendirmeli çalışmada öğrendiğim hatalar ({guidedErrors.length})
          </summary>
          {guidedErrors.map((q) => (
            <div key={q.id}>
              <strong>{q.prompt}</strong>
              <p>{q.rule}</p>
              <small>
                {p.guided[q.id].length} deneme ·{" "}
                {p.guided[q.id].at(-1)?.correct
                  ? "Düzeltildi"
                  : "Birlikte Deneyelim bölümünde sürüyor"}
              </small>
            </div>
          ))}
        </details>
      )}
      {missed.length > 0 && (
        <>
          <div
            className="course-example-picker"
            aria-label="Kaydedilen yanlış sorular"
          >
            {missed.map((question, i) => (
              <button
                key={question.id}
                aria-pressed={q?.id === question.id}
                onClick={() => setSelected(question.id)}
              >
                {i + 1} {p.reviews[question.id]?.at(-1)?.correct ? "✓" : "↻"}
              </button>
            ))}
          </div>
          {q && (
            <>
              <p className="course-mistake-original">
                İlk yanıtın: {p.independent[q.id].value} · Kayıt korunuyor.
              </p>
              <QuestionCard
                question={q}
                context={c.texts?.find((t) => t.id === q.contextId)}
                answer={p.reviews[q.id]?.at(-1)}
                attemptCount={p.reviews[q.id]?.length ?? 0}
                retryable
                disabled={disabled}
                onAnswer={(value) => {
                  setSelected(q.id);
                  void answerCourse(c.id, "review", q.id, value);
                }}
              />
              {p.reviews[q.id]?.at(-1)?.correct &&
                unresolved(c, p).length > 0 && (
                  <Button onClick={() => setSelected(unresolved(c, p)[0].id)}>
                    Sonraki hatayı çalış <ArrowRight size={16} />
                  </Button>
                )}
            </>
          )}
        </>
      )}
      {unresolved(c, p).length === 0 && (
        <Button onClick={onNext}>
          Özete dön <ArrowRight size={16} />
        </Button>
      )}
    </>
  );
}

function CourseText({ text }: { text: NonNullable<Course["texts"]>[number] }) {
  return (
    <section className="course-reading">
      <h4>{text.title}</h4>
      <p lang="de">{text.de}</p>
      <details>
        <summary>Türkçesini ve öğretmen notunu aç</summary>
        <p>{text.tr}</p>
        <p>
          <strong>Öğretmen notu:</strong> {text.notes}
        </p>
      </details>
    </section>
  );
}
