"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Play,
  BookOpen,
  Eye,
  EyeOff,
  Languages,
  Check,
  BookmarkPlus,
  Headphones,
  X,
  RotateCcw,
  Volume2,
  Trophy,
} from "lucide-react";
import type { Episode } from "@/lib/listening/types";
import type { VocabularyRecord } from "@/lib/learning/types";
import { useLearning } from "@/lib/learning/store";
import {
  useListening,
  startListening,
  toggleListeningFavorite,
  saveListeningWord,
  beginListeningQuiz,
  answerListeningQuiz,
  nextListeningQuestion,
  retryListeningRewards,
} from "@/lib/listening/store";
import { coverage, score, needsReview } from "@/lib/listening/engine";
import { transcriptParts } from "@/lib/listening/transcript";
import { formatDuration, wordAudio } from "@/lib/listening/content";
import { ListeningPlayer, type PlayerHandle } from "./player";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { AnswerInput } from "@/components/exercises/answer-input";
export function ListeningEpisode({ episode: e }: { episode: Episode }) {
  const { state, ready, readonly, notice } = useListening(),
    learning = useLearning();
  const player = useRef<PlayerHandle>(null);
  const [showTranscript, setShowTranscript] = useState(false),
    [showTranslation, setShowTranslation] = useState(false),
    [active, setActive] = useState(-1),
    [selectedWord, setSelectedWord] = useState<string | null>(null),
    [tip, setTip] = useState(0);
  useEffect(() => {
    if (ready && !readonly) void startListening(e.id);
  }, [e.id, ready, readonly]);
  const p = state.progress[e.id],
    percent = Math.floor(coverage(state, e.id) * 100),
    a = state.attempts[state.activeAttempt[e.id]],
    attemptId = a?.id,
    questionIndex = a?.index;
  useEffect(() => {
    if (!attemptId) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById("dinleme-mini-test")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [attemptId, questionIndex]);
  const word = selectedWord ? learning.repository.get(selectedWord) : undefined;
  const words = e.lemmas
    .map((lemma) =>
      learning.repository.all().find((w) => w.german_word === lemma),
    )
    .filter((w): w is VocabularyRecord => !!w);
  const attempts = Object.values(state.attempts).filter(
      (x) => x.episodeId === e.id && x.completedAt !== null,
    ),
    passed = attempts.some((x) => score(x) >= 80),
    done = p?.completedAt != null;
  const tips = done
    ? [
        "Harika! Bir dinleme macerasını daha tamamladın! 🌷",
        "İstersen metni kapatıp bir kez daha kulak ver.",
      ]
    : [
        "İlk dinleyişte her kelimeyi anlaman gerekmiyor! 🌷",
        "Önce dinle, sonra metni açmayı dene.",
        "Bir cümleyi tekrar dinlemek çok iyi bir öğrenme adımıdır.",
      ];
  return (
    <div className="page-content listening-detail">
      <Link href="/dinleme-kulubu" className="listening-back">
        <ArrowLeft size={16} />
        Dinleme kulübüne dön
      </Link>
      <header className="listening-detail-heading">
        <div>
          <span className="listening-eyebrow">
            {e.level} · ÖZGÜN MİNİ DİNLEME · {formatDuration(e.audio!.duration)}
          </span>
          <h1>{e.title}</h1>
          <p lang="de">{e.german}</p>
        </div>
        <button
          disabled={!ready || readonly}
          aria-pressed={state.favorites.includes(e.id)}
          aria-label="Bu dinlemeyi kaydet"
          onClick={() => void toggleListeningFavorite(e.id)}
        >
          <Heart
            size={20}
            fill={state.favorites.includes(e.id) ? "currentColor" : "none"}
          />
          {state.favorites.includes(e.id) ? "Kaydedildi" : "Kaydet"}
        </button>
      </header>
      {notice && (
        <p role="status" className="listening-notice">
          {notice}
        </p>
      )}
      <div className="listening-detail-grid">
        <div>
          {ready ? (
            <ListeningPlayer
              ref={player}
              episode={e}
              initialPosition={p?.position ?? 0}
              onActive={setActive}
            />
          ) : (
            <div className="listening-player-loading">
              Ses oynatıcı hazırlanıyor…
            </div>
          )}
          <section className="listening-step-progress">
            <div>
              <span>
                <Headphones size={17} />
                {percent}% ses bölümü dinlendi
              </span>
              <span>
                {passed ? (
                  <>
                    <Check size={16} />
                    Mini test geçildi
                  </>
                ) : (
                  "Mini test hedefi: %80"
                )}
              </span>
            </div>
            <Progress
              value={percent}
              aria-label="Dinlenen ses bölümlerinin oranı"
            />
            <small>
              Tamamlamak için ses bölümlerinin en az %90’ını dinle ve mini
              testte en az {Math.ceil(e.quiz.length * 0.8)} doğru yap. İleri
              atlamak veya yalnızca metni açmak dinleme sayılmaz.
            </small>
          </section>
          {e.guidance?.length ? (
            <section
              className="listening-transcript"
              aria-labelledby="dinleme-rehberi"
            >
              <div className="listening-section-title">
                <div>
                  <span className="listening-eyebrow">ADIM ADIM BİRLİKTE</span>
                  <h2 id="dinleme-rehberi">Nasıl çalışalım?</h2>
                </div>
                <BookOpen size={22} aria-hidden="true" />
              </div>
              <p>
                Bu özgün metin yapay Almanca sesle okunur; gerçek bir röportaj
                veya haber kaydı değildir.
              </p>
              <ol>
                {e.guidance.map((step, index) => (
                  <li key={index}>
                    <span className="listening-line-number" aria-hidden="true">
                      {index + 1}
                    </span>
                    <div>
                      <p>{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
          <section className="listening-transcript">
            <div className="listening-section-title">
              <div>
                <span className="listening-eyebrow">SESİN İZİNİ SÜR</span>
                <h2>Almanca metin</h2>
              </div>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                aria-expanded={showTranscript}
                aria-controls="dinleme-metni"
              >
                {showTranscript ? <EyeOff size={17} /> : <Eye size={17} />}{" "}
                {showTranscript ? "Metni gizle" : "Metni göster"}
              </button>
            </div>
            {showTranscript ? (
              <div id="dinleme-metni">
                <label className="listening-translation-toggle">
                  <input
                    type="checkbox"
                    checked={showTranslation}
                    onChange={(event) =>
                      setShowTranslation(event.target.checked)
                    }
                  />
                  <Languages size={17} />
                  Türkçe çeviriyi göster
                </label>
                <p className="listening-transcript-note">
                  Renkli sözcüklere dokunarak anlamını keşfet. Vurgu, ses
                  dosyasındaki gerçek cümle sınırlarını izler; kelime düzeyinde
                  zamanlama iddiası yoktur.
                </p>
                <ol>
                  {e.sentences.map((s, i) => (
                    <li
                      key={s.id}
                      className={active === i ? "is-active" : ""}
                      aria-current={active === i ? "true" : undefined}
                    >
                      <span className="listening-line-number">{i + 1}</span>
                      <div>
                        {s.speaker && (
                          <small className="listening-speaker">
                            {s.speaker} · Aynı yapay ses
                          </small>
                        )}
                        <p lang="de">
                          {transcriptParts(s, learning.repository).map(
                            (part, n) =>
                              part.wordId ? (
                                <button
                                  key={n}
                                  className="listening-word-link"
                                  aria-label={part.text + " anlamını göster"}
                                  aria-expanded={selectedWord === part.wordId}
                                  onClick={() => setSelectedWord(part.wordId!)}
                                >
                                  {part.text}
                                </button>
                              ) : (
                                <span key={n}>{part.text}</span>
                              ),
                          )}
                        </p>
                        {showTranslation && (
                          <p className="listening-line-translation">{s.tr}</p>
                        )}
                        {active === i && (
                          <small className="listening-active-label">
                            Seçili cümle
                          </small>
                        )}
                      </div>
                      <button
                        className="listening-line-replay"
                        aria-label={i + 1 + ". cümleyi yeniden dinle"}
                        onClick={() => {
                          setActive(i);
                          player.current?.sentence(i);
                        }}
                      >
                        <Play size={17} />
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="listening-transcript-hidden">
                <Headphones size={32} />
                <p>Önce kulakların keşfetsin. İstediğinde metni açabilirsin.</p>
              </div>
            )}
          </section>
          <section className="listening-quiz" id="dinleme-mini-test">
            <div className="listening-section-title">
              <div>
                <span className="listening-eyebrow">
                  DUYDUKLARIN FİLİZLENSİN
                </span>
                <h2>Küçük anlama oyunu</h2>
              </div>
              <Trophy size={30} />
            </div>
            <p>
              {e.quiz.length} açıklamalı soru ile anlamı ve ayrıntıları kontrol
              et. Başarı hedefi: %80. Yanlışlarını okuyup yeniden
              deneyebilirsin.
            </p>
            {!a ? (
              <Button
                disabled={!p || readonly}
                onClick={() => {
                  player.current?.pause();
                  void beginListeningQuiz(e.id);
                }}
              >
                Mini testi başlat <ArrowRight size={17} />
              </Button>
            ) : a.completedAt !== null ? (
              <div className="listening-quiz-results">
                <LumiMascot
                  expression={score(a) >= 80 ? "celebrating" : "encouraging"}
                  decorative
                />
                <strong>%{score(a)} başarı</strong>
                <p>
                  {Object.values(a.answers).filter((x) => x.correct).length} /{" "}
                  {a.questions.length}
                  doğru · {attempts.length} tamamlanan deneme
                </p>
                <p>
                  {score(a) >= 80
                    ? "Dinlediklerini güzelce yakaladın!"
                    : "Birlikte yeniden kulak verelim. Hata yapmak öğrenmenin bir parçası."}
                </p>
                <div className="listening-answer-review" role="status">
                  <strong>
                    Son yanıt:{" "}
                    {a.answers[a.questions[a.index].id].correct
                      ? "Doğru 🌼"
                      : "Birlikte bakalım 🌷"}
                  </strong>
                  <p>Doğru karşılık: {a.questions[a.index].accepted[0]}</p>
                  <p>{a.questions[a.index].explanation}</p>
                </div>
                <Button
                  variant="outline"
                  disabled={readonly}
                  onClick={() => void beginListeningQuiz(e.id)}
                >
                  <RotateCcw size={17} />
                  Yeniden dene
                </Button>
                <details>
                  <summary>Yanıtları ve açıklamaları incele</summary>
                  {a.questions.map((q) => (
                    <div key={q.id} className="listening-answer-review">
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
                <div className="listening-quiz-position">
                  <span>
                    Soru {a.index + 1} / {a.questions.length}
                  </span>
                  <Progress
                    value={
                      (Object.keys(a.answers).length / a.questions.length) * 100
                    }
                    aria-label="Dinleme mini testi ilerlemesi"
                  />
                </div>
                <AnswerInput
                  key={a.id + ":" + a.index}
                  question={a.questions[a.index]}
                  savedValue={a.answers[a.questions[a.index].id]?.value ?? ""}
                  locked={readonly || !!a.answers[a.questions[a.index].id]}
                  onSubmit={(value) => void answerListeningQuiz(a.id, value)}
                />
                {a.answers[a.questions[a.index].id] && (
                  <div
                    className={
                      "listening-feedback " +
                      (a.answers[a.questions[a.index].id].correct
                        ? "feedback-correct"
                        : "feedback-gentle")
                    }
                    role="status"
                  >
                    <strong>
                      {a.answers[a.questions[a.index].id].correct
                        ? "İşte bu! 🌼"
                        : "Güzel bir deneme; birlikte bakalım. 🌷"}
                    </strong>
                    <p>Doğru karşılık: {a.questions[a.index].accepted[0]}</p>
                    <p>{a.questions[a.index].explanation}</p>
                    <Button onClick={() => void nextListeningQuestion(a.id)}>
                      Sonraki soru <ArrowRight size={17} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
          <section
            className={"listening-completion " + (done ? "is-complete" : "")}
          >
            <span aria-hidden="true">{done ? "🌼" : "🌱"}</span>
            <div>
              <h2>
                {done
                  ? "Bu dinleme bahçende çiçek açtı!"
                  : "Her dinleyişte bir adım daha."}
              </h2>
              <p>
                {done
                  ? "İlk tamamlama: 15 XP + 10 bahçe parası. Her üç farklı tamamlamada bir lavanta tohumu. Tekrarlar yeni ödül vermez."
                  : percent < 90
                    ? "Ses bölümlerinin en az %90’ını dinleyerek devam et."
                    : `Mini testte en az ${Math.ceil(e.quiz.length * 0.8)} doğru yanıtla devam et.`}
              </p>
              {needsReview(state, e.id) && (
                <p>
                  Son mini testin tekrar istiyor; önceki tamamlanman korunur.
                </p>
              )}
            </div>
          </section>
          {state.claims.some((c) => !c.delivered) && (
            <div className="listening-notice">
              Ödülün kaydedildi; çantaya aktarılmayı bekliyor.{" "}
              <Button
                variant="outline"
                onClick={() => void retryListeningRewards()}
              >
                Yeniden dene
              </Button>
            </div>
          )}
        </div>
        <aside className="listening-side">
          <section className="listening-lumi-card">
            <LumiMascot
              expression={done ? "celebrating" : "encouraging"}
              decorative
            />
            <span className="listening-eyebrow">LUMI SENİNLE</span>
            <p aria-live="polite">{tips[tip % tips.length]}</p>
            <button onClick={() => setTip(tip + 1)}>Bir ipucu daha ✦</button>
            <small>Hazır ipuçları · AI kullanılmaz.</small>
          </section>
          {word && (
            <WordDialog
              key={word.id}
              word={word}
              saved={state.savedWords.includes(word.id)}
              disabled={readonly}
              onClose={() => setSelectedWord(null)}
              onSave={() => void saveListeningWord(word.id)}
              onPlay={() => player.current?.pause()}
            />
          )}
          <section className="listening-important-words">
            <h2>Bu dinlemeden kelimeler</h2>
            <p>Dokun, anlamını ve kelime kartını keşfet.</p>
            {words.map((w) => (
              <button
                key={w.id}
                lang="de"
                aria-pressed={selectedWord === w.id}
                onClick={() => setSelectedWord(w.id)}
              >
                {w.article} {w.german_word}
                {state.savedWords.includes(w.id) && <Check size={14} />}
              </button>
            ))}
            <Link href="/kelimelerim#dinleme-tekrari">
              Kaydettiğim kelimeler <ArrowRight size={15} />
            </Link>
          </section>
        </aside>
      </div>
      <nav
        className="listening-bottom-nav"
        aria-label="Dinleme sonrası gezinme"
      >
        <Button asChild variant="outline">
          <Link href="/dinleme-kulubu">
            <Headphones size={17} />
            Kulübe dön
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/kelimelerim#dinleme-tekrari">Kelime tekrarlarım</Link>
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
function WordAudio({
  word,
  onPlay,
}: {
  word: VocabularyRecord;
  onPlay: () => void;
}) {
  const ref = useRef<HTMLAudioElement>(null),
    [notice, setNotice] = useState("");
  useEffect(() => {
    const el = ref.current;
    return () => el?.pause();
  }, []);
  return (
    <div className="listening-word-audio">
      <audio
        ref={ref}
        src={wordAudio[word.id]?.url}
        preload="none"
        onError={() =>
          setNotice(
            "Kelime sesi yüklenemedi. Kartını açarak cihaz sesini deneyebilirsin.",
          )
        }
      />
      <button
        onClick={() => {
          onPlay();
          void ref.current
            ?.play()
            .catch(() => setNotice("Kelime sesi başlatılamadı."));
        }}
      >
        <Volume2 size={16} />
        Kelimeyi dinle
      </button>
      {notice && <p role="status">{notice}</p>}
    </div>
  );
}

function WordDialog({
  word,
  saved,
  disabled,
  onClose,
  onSave,
  onPlay,
}: {
  word: VocabularyRecord;
  saved: boolean;
  disabled: boolean;
  onClose: () => void;
  onSave: () => void;
  onPlay: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="listening-word-dialog"
      aria-labelledby="dinleme-kelime-baslik"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <section className="listening-word-panel">
        <button
          className="listening-word-close"
          aria-label="Kelime açıklamasını kapat"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <span className="listening-eyebrow">KELİME HAZİNENDEN</span>
        <h2 id="dinleme-kelime-baslik" lang="de">
          {word.article} {word.german_word}
        </h2>
        <p>{word.turkish_meaning}</p>
        {word.plural_form && (
          <small>
            Çoğul: <span lang="de">die {word.plural_form}</span>
          </small>
        )}
        <p lang="de" className="listening-word-example">
          {word.example_sentence_de}
        </p>
        <p>{word.example_sentence_tr}</p>
        <WordAudio word={word} onPlay={onPlay} />
        <Button disabled={disabled || saved} onClick={onSave}>
          <BookmarkPlus size={16} />
          {saved ? "Tekrara eklendi" : "Tekrarıma ekle"}
        </Button>
        <Link href={"/kelimelerim/" + word.id} onClick={onClose}>
          <BookOpen size={15} />
          Kelime kartını aç
        </Link>
      </section>
    </dialog>
  );
}
