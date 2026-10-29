"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Check,
  RotateCcw,
  Save,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import type { Story } from "@/lib/stories/types";
import { annotatedParts, resolveWord } from "@/lib/stories/content";
import type { StoryWord } from "@/lib/stories/content";
import { currentRun, storyQuizScore } from "@/lib/stories/engine";
import { longestRemaining } from "@/lib/stories/graph";
import {
  useStories,
  openStory,
  chooseScene,
  favoriteStory,
  checkpointStory,
  startStoryQuiz,
  submitStoryQuiz,
  advanceStoryQuiz,
  retryStoryRewards,
} from "@/lib/stories/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { AnswerInput } from "@/components/exercises/answer-input";
import { StoryArt } from "./art";
import { StoryAudio } from "./audio";
import { StoryWordDialog } from "./word-dialog";
export function StoryReader({ story }: { story: Story }) {
  const { state, ready, readonly, notice } = useStories(),
    router = useRouter(),
    reduce = useReducedMotion();
  const [translation, setTranslation] = useState(false),
    [word, setWord] = useState<StoryWord | null>(null),
    [busy, setBusy] = useState(false);
  const audio = useRef<{ pause: () => void }>(null),
    sceneHeading = useRef<HTMLHeadingElement>(null),
    quizSection = useRef<HTMLElement>(null);
  const run = currentRun(state, story.id),
    sceneId = run?.path.at(-1),
    scene = story.scenes.find((n) => n.id === sceneId),
    quiz = run?.quiz,
    q = quiz?.questions[quiz.index],
    response = q ? quiz?.answers[q.id] : undefined;
  useEffect(() => {
    if (ready && !readonly && !run) void openStory(story.id);
  }, [ready, readonly, run, story.id]);
  const previous = useRef(sceneId);
  useEffect(() => {
    if (previous.current && previous.current !== sceneId)
      sceneHeading.current?.focus();
    previous.current = sceneId;
  }, [sceneId]);
  async function choose(id: string) {
    if (busy || !scene) return;
    audio.current?.pause();
    setBusy(true);
    try {
      await chooseScene(story.id, scene.id, id);
    } finally {
      setBusy(false);
    }
  }
  function showWord(w: StoryWord) {
    audio.current?.pause();
    setWord(w);
  }
  function scrollQuiz() {
    requestAnimationFrame(() =>
      quizSection.current?.scrollIntoView({
        block: "start",
        behavior: reduce ? "instant" : "smooth",
      }),
    );
  }
  const discovered = state.endings[story.id] ?? [],
    endings = story.scenes.filter((n) => n.ending),
    remaining = scene ? longestRemaining(story, scene.id) : 0,
    percent = run
      ? Math.round((run.path.length / (run.path.length + remaining)) * 100)
      : 0;
  return (
    <div className="page-content story-reader">
      <div className="story-reader-nav">
        <Link href="/hikayeler">
          <ArrowLeft size={16} /> Hikâye kütüphanesi
        </Link>
        <div>
          <button
            className="story-heart"
            aria-label="Hikâyeyi favorilere ekle"
            aria-pressed={state.favorites.includes(story.id)}
            disabled={!ready || readonly}
            onClick={() => void favoriteStory(story.id)}
          >
            <Heart size={19} />
          </button>
          <Button
            variant="outline"
            disabled={!ready || readonly || busy}
            onClick={async () => {
              audio.current?.pause();
              if (await checkpointStory()) router.push("/hikayeler");
            }}
          >
            <Save size={16} />
            Kaydet ve çık
          </Button>
        </div>
      </div>
      <header className="story-reader-heading">
        <span className="story-kicker">
          {story.level} · SEÇİMLERİNLE ŞEKİLLENEN BİR HİKÂYE
        </span>
        <h1>{story.title}</h1>
        <p lang="de">{story.germanTitle}</p>
      </header>
      {notice && (
        <p className="story-notice" role="status">
          {notice}
        </p>
      )}
      {!scene ? (
        <div className="story-empty">
          {ready
            ? "Hikâyeyi başlatmak için kayıt kullanılabilir olmalı."
            : "Kitabının sayfaları açılıyor…"}
          <Button
            disabled={!ready || readonly}
            onClick={() => void openStory(story.id)}
          >
            Maceraya başla
          </Button>
        </div>
      ) : (
        <>
          <div className="story-reading-progress">
            <span>Bu okuma yolculuğu · {run.path.length}. sahne</span>
            <strong>%{percent}</strong>
            <Progress
              value={percent}
              aria-label="Mevcut hikâye yolunun ilerlemesi"
            />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={scene.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              onAnimationComplete={() => sceneHeading.current?.focus()}
              className="story-book"
            >
              <div className="story-scene-picture">
                <StoryArt kind={scene.art} label={scene.title} />
                <span className="story-scene-ribbon">
                  {scene.ending ? "SON SAYFA" : "SENİN MACERAN"} ·{" "}
                  {String(run.path.length).padStart(2, "0")}
                </span>
                <div className="story-picture-caption">
                  <Sparkles size={17} />
                  {scene.title}
                </div>
              </div>
              <div className="story-page">
                <div className="story-page-top">
                  <span className="story-kicker">
                    BİR SONRAKİ SAYFA SENİN ELİNDE
                  </span>
                  <div
                    className="story-language"
                    role="group"
                    aria-label="Hikâye çevirisi"
                  >
                    <button
                      aria-pressed={!translation}
                      onClick={() => setTranslation(false)}
                    >
                      Almanca
                    </button>
                    <button
                      aria-pressed={translation}
                      onClick={() => setTranslation(true)}
                    >
                      Almanca + Türkçe
                    </button>
                  </div>
                </div>
                <h2 ref={sceneHeading} tabIndex={-1}>
                  {scene.title}
                </h2>
                <div className="story-narration">
                  {scene.lines.map((line, i) => (
                    <div
                      className={
                        line.speaker ? "story-dialogue" : "story-paragraph"
                      }
                      key={i}
                    >
                      {line.speaker && (
                        <span className="story-speaker">{line.speaker}</span>
                      )}
                      <p lang="de">
                        {annotatedParts(line.de, scene.words).map((part, k) =>
                          part.word ? (
                            <button
                              key={k}
                              className="story-word"
                              onClick={() => showWord(part.word!)}
                            >
                              {part.text}
                            </button>
                          ) : (
                            part.text
                          ),
                        )}
                      </p>
                      {translation && (
                        <p className="story-translation">{line.tr}</p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="story-fine">
                  Önce Almancasını anlamayı dene. Renkli kelimelere dokunarak
                  yardım alabilirsin.
                </p>
                <div
                  className="story-word-chips"
                  aria-label="Bu sahnenin kelimeleri"
                >
                  {scene.words.map((lemma) => {
                    const w = resolveWord(lemma);
                    return w ? (
                      <button key={lemma} lang="de" onClick={() => showWord(w)}>
                        {w.article} {w.word} <span>＋</span>
                      </button>
                    ) : null;
                  })}
                </div>
                <StoryAudio
                  key={scene.id}
                  storyId={story.id}
                  scene={scene}
                  ref={audio}
                />
                {scene.choices.length > 0 ? (
                  <section className="story-choices">
                    <span className="story-kicker">
                      PEKİ, ŞİMDİ NE YAPACAKSIN?
                    </span>
                    <h3>Hikâyenin yönünü seç 🌿</h3>
                    <p className="story-fine">
                      Burada doğru veya yanlış yok. Her yol farklı bir son
                      getirir.
                    </p>
                    {scene.choices.map((c, i) => (
                      <button
                        key={c.id}
                        disabled={readonly || busy}
                        onClick={() => void choose(c.id)}
                      >
                        <span className="story-choice-letter">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>
                          <strong lang="de">{c.de}</strong>
                          {translation && <small>{c.tr}</small>}
                        </span>
                        <ArrowRight size={19} />
                      </button>
                    ))}
                  </section>
                ) : (
                  <section className="story-ending-celebration">
                    <span>✦ BİR HİKÂYE SONU KOLEKSİYONUNDA ✦</span>
                    <h3>{scene.ending}</h3>
                    <p>
                      Bu sonu keşfettin! Şimdi yalnızca okuduğun sahnelerle
                      ilgili üç küçük soru seni bekliyor.
                    </p>
                    {!quiz && (
                      <Button
                        disabled={readonly}
                        onClick={async () => {
                          await startStoryQuiz(story.id);
                          scrollQuiz();
                        }}
                      >
                        Hikâyeyi ne kadar anladım? <ArrowRight size={16} />
                      </Button>
                    )}
                  </section>
                )}
              </div>
            </motion.article>
          </AnimatePresence>
          <aside className="story-lumi">
            <LumiMascot
              expression={scene.ending ? "celebrating" : "encouraging"}
              decorative
            />
            <p>
              {scene.ending
                ? "Harika! Bir hikâye sonu daha keşfettin! 🌷"
                : "Bu hikâyede seçimler tamamen sana ait! Bilmediğin kelimelere dokunabilirsin. 📖"}
            </p>
          </aside>
          {quiz && q && (
            <section
              className="story-quiz"
              ref={quizSection}
              aria-labelledby="story-quiz-title"
            >
              <span className="story-kicker">
                YALNIZCA SENİN YOLUNDA OLANLAR
              </span>
              <h2 id="story-quiz-title">Hikâyenin küçük hatırası</h2>
              <p>
                Soru {quiz.index + 1} / {quiz.questions.length} · Tohum için en
                az %80 doğru yanıt. Üç soruda üçünü de doğru yanıtlamalısın.
              </p>
              <AnswerInput
                key={run.id + q.id}
                question={q}
                locked={!!response || readonly}
                savedValue={response?.value}
                onSubmit={(v) => void submitStoryQuiz(story.id, q.id, v)}
              />
              {response && (
                <div
                  className={
                    response.correct
                      ? "story-feedback correct"
                      : "story-feedback"
                  }
                  role="status"
                >
                  <strong>
                    {response.correct
                      ? "Harika, hatırladın!"
                      : "Birlikte hatırlayalım."}
                  </strong>
                  <p>{q.explanation}</p>
                  {!response.correct && <p>Doğru yanıt: {q.accepted[0]}</p>}
                  {quiz.completedAt === null && (
                    <Button
                      onClick={async () => {
                        await advanceStoryQuiz(story.id);
                        scrollQuiz();
                      }}
                    >
                      Sonraki soru <ArrowRight size={16} />
                    </Button>
                  )}
                </div>
              )}
              {quiz.completedAt !== null && (
                <div className="story-quiz-result">
                  <h3>
                    %{storyQuizScore(run)} ·{" "}
                    {storyQuizScore(run) >= 80
                      ? "Minik tohumunu kazandın!"
                      : "Hikâyeyi yeniden keşfedebilirsin."}
                  </h3>
                  <p>
                    İlk hikâye sonu: +20 XP. Her farklı son: +10 bahçe parası.
                    Başarılı test: hikâye başına bir lavanta tohumu. Aynı ödül
                    tekrar verilmez.
                  </p>
                  <details>
                    <summary>Yanıtlarıma bak</summary>
                    {quiz.questions.map((question) => (
                      <div key={question.id}>
                        <strong>{question.prompt}</strong>
                        <p>
                          {quiz.answers[question.id]?.correct ? "✓" : "○"}{" "}
                          Yanıtın: {quiz.answers[question.id]?.value}
                        </p>
                        <p>{question.explanation}</p>
                      </div>
                    ))}
                  </details>
                </div>
              )}
            </section>
          )}
          <section className="story-ending-collection">
            <div>
              <span className="story-kicker">SONLAR ALBÜMÜ</span>
              <h2>Bir kitap, dört küçük ihtimal</h2>
              <p>
                {discovered.length} / {endings.length} son keşfedildi · %
                {Math.round((discovered.length / endings.length) * 100)}
              </p>
            </div>
            <div className="story-ending-grid">
              {endings.map((e, i) => (
                <div
                  key={e.id}
                  className={discovered.includes(e.id) ? "discovered" : ""}
                >
                  {discovered.includes(e.id) ? (
                    <Check size={23} />
                  ) : (
                    <LockKeyhole size={23} />
                  )}
                  <strong>
                    {discovered.includes(e.id)
                      ? e.ending
                      : `Gizli son ${i + 1}`}
                  </strong>
                  <small>
                    {discovered.includes(e.id)
                      ? "Koleksiyonunda"
                      : "Keşfetmeni bekliyor"}
                  </small>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              disabled={readonly || busy}
              onClick={async () => {
                audio.current?.pause();
                await openStory(story.id, true);
              }}
            >
              <RotateCcw size={16} />
              Baştan oku, başka bir yol keşfet
            </Button>
            <p className="story-fine">
              Yeni okuma mevcut yolun yerine geçer; önceki okumaların,
              keşfettiğin sonlar ve ödüller saklanır.
            </p>
          </section>
          {state.claims.some((c) => !c.delivered) && (
            <div role="status" className="story-notice">
              Kayıtlı ödüllerinin aktarımı bekliyor.{" "}
              <button onClick={() => void retryStoryRewards()}>
                Aktarımı yeniden dene
              </button>
            </div>
          )}
          <footer className="story-footer">
            <Link href="/hikayeler">Diğer hikâyeler</Link>
            <Link href="/kelimelerim#hikaye-kelimeleri">
              Hikâyeden kelimelerim
            </Link>
            <Link href="/bahcem">Bahçeme git →</Link>
            <span>Seçimler otomatik kaydedilir · Bu cihazda</span>
          </footer>
        </>
      )}
      {word && (
        <StoryWordDialog
          key={word.id}
          word={word}
          onClose={() => setWord(null)}
        />
      )}
    </div>
  );
}
