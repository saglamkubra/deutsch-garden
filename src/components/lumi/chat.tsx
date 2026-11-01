"use client";
import { useEffect, useRef, useState } from "react";
import {
  Send,
  Plus,
  Trash2,
  RotateCcw,
  MessageCircle,
  ShieldCheck,
  Volume2,
  Square,
  BookOpen,
  Check,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { PageHeading } from "@/components/garden/primitives";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { Button } from "@/components/ui/button";
import { LEVELS, type Level } from "@/lib/learning/types";
import { useLearning } from "@/lib/learning/store";
import {
  MODES,
  STARTERS,
  LIMITS,
  validResult,
  object,
} from "@/lib/lumi/protocol";
import type {
  TutorMode,
  CorrectionStyle,
  TutorWord,
  TutorReply,
} from "@/lib/lumi/protocol";
import { activeChat, requestFor, wordKey } from "@/lib/lumi/model";
import {
  useLumi,
  lumiSnapshot,
  createLumiChat,
  selectLumiChat,
  consentLumi,
  queueLumiRequest,
  receiveLumiReply,
  deleteLumiChat,
  collectLumiWord,
  flushLumiRewards,
} from "@/lib/lumi/store";
import { SpeechSequence, browserSpeechHost } from "@/lib/listening/speech";
import { BirthdayLumiGreeting } from "@/components/birthday/entrance";
import { VoiceInput } from "./voice-input";
type Status = {
  configured: boolean;
  accessRequired: boolean;
  authenticated: boolean;
  remaining: number;
};
function clientError(e: unknown) {
  return e instanceof TypeError || e instanceof SyntaxError
    ? "Bağlantı kurulamadı veya yanıt okunamadı. Yeniden deneyebilirsin."
    : e instanceof Error
      ? e.message
      : "İstek tamamlanamadı. Yeniden deneyebilirsin.";
}
async function fetchLumiStatus(): Promise<Status> {
  const response = await fetch("/api/lumi/chat", { cache: "no-store" }),
    data = await response.json();
  if (!response.ok || !object(data) || typeof data.configured !== "boolean")
    throw Error(
      object(data) &&
        object(data.error) &&
        typeof data.error.message === "string"
        ? data.error.message
        : "Lumi sunucu durumu alınamadı.",
    );
  return {
    configured: data.configured,
    accessRequired: data.accessRequired === true,
    authenticated: data.authenticated === true,
    remaining: typeof data.remaining === "number" ? data.remaining : 0,
  };
}
export function LumiChat() {
  const { state, ready, readonly, notice } = useLumi(),
    learning = useLearning(),
    c = activeChat(state);
  const [status, setStatus] = useState<Status | null>(null),
    [statusError, setStatusError] = useState(""),
    [level, setLevel] = useState<Level>("A1"),
    [mode, setMode] = useState<TutorMode>("daily"),
    [correction, setCorrection] = useState<CorrectionStyle>("gentle"),
    [draft, setDraft] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [lookup, setLookup] = useState(""),
    [found, setFound] = useState<TutorReply | null>(null),
    [password, setPassword] = useState(""),
    [speechNotice, setSpeechNotice] = useState(""),
    [deleting, setDeleting] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null),
    controller = useRef<AbortController | null>(null),
    speaker = useRef<SpeechSequence | null>(null),
    deleteDialog = useRef<HTMLDialogElement>(null);
  const allowed =
    !!status?.configured &&
    status.authenticated &&
    state.consent &&
    !readonly &&
    ready;
  async function refresh() {
    try {
      const response = await fetch("/api/lumi/chat", { cache: "no-store" }),
        data = await response.json();
      if (!response.ok || !object(data) || typeof data.configured !== "boolean")
        throw Error(
          object(data) &&
            object(data.error) &&
            typeof data.error.message === "string"
            ? data.error.message
            : "Lumi sunucu durumu alınamadı.",
        );
      setStatus({
        configured: data.configured,
        accessRequired: data.accessRequired === true,
        authenticated: data.authenticated === true,
        remaining: typeof data.remaining === "number" ? data.remaining : 0,
      });
      setStatusError("");
      if (data.configured && data.authenticated) void flushLumiRewards();
    } catch (error) {
      setStatusError(clientError(error));
    }
  }
  useEffect(() => {
    let active = true;
    void fetchLumiStatus()
      .then((data) => {
        if (active) {
          setStatus(data);
          setStatusError("");
          if (data.configured && data.authenticated) void flushLumiRewards();
        }
      })
      .catch((error: unknown) => {
        if (active) setStatusError(clientError(error));
      });
    return () => {
      active = false;
      controller.current?.abort();
      speaker.current?.stop();
    };
  }, []);
  useEffect(() => {
    if (!c?.messages.length && !c?.pending) return;
    end.current?.scrollIntoView({
      block: "nearest",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [c?.messages.length, c?.pending]);
  useEffect(() => {
    if (deleting) deleteDialog.current?.showModal();
    else deleteDialog.current?.close();
  }, [deleting]);
  async function start() {
    speaker.current?.stop();
    setError("");
    setFound(null);
    if (state.conversations.length >= LIMITS.history) {
      setError(
        "En fazla 20 konuşma saklanabilir. Yeni konuşma için eskilerden birini silebilirsin.",
      );
      return;
    }
    await createLumiChat(level, mode, correction);
    setDraft("");
  }
  async function call(action: "message" | "finish", retry = false) {
    if (!c || !allowed || busy) return;
    setBusy(true);
    setError("");
    speaker.current?.stop();
    const cid = c.id;
    try {
      if (
        !retry &&
        !(await queueLumiRequest(cid, crypto.randomUUID(), action, draft))
      )
        throw Error("İstek kaydedilemedi; gönderilmedi.");
      const current = lumiSnapshot().state.conversations.find(
          (x) => x.id === cid,
        ),
        request = current ? requestFor(current) : null;
      if (!request) throw Error("Gönderilecek kayıtlı mesaj yok.");
      controller.current = new AbortController();
      const response = await fetch("/api/lumi/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.current.signal,
      });
      const data = await response.json();
      if (!response.ok) await refresh();
      if (!response.ok)
        throw Error(
          object(data) &&
            object(data.error) &&
            typeof data.error.message === "string"
            ? data.error.message
            : "AI yanıtı alınamadı.",
        );
      if (!validResult(data))
        throw Error("Sunucu yanıtı doğrulanamadı; geçmişe eklenmedi.");
      if (!(await receiveLumiReply(cid, data)))
        throw Error(
          "Yanıt henüz kayda alınamadı. Aynı isteği yeniden deneyebilirsin.",
        );
      setDraft("");
      setStatus((s) => (s ? { ...s, remaining: data.remaining } : s));
      void flushLumiRewards();
    } catch (e) {
      setError(
        e instanceof Error && e.name === "AbortError"
          ? "Yanıt bekleme durdu. Aynı kayıtlı isteği yeniden deneyebilirsin."
          : clientError(e),
      );
    } finally {
      setBusy(false);
    }
  }
  async function translate() {
    if (!c || !lookup.trim() || !allowed || busy || c.pending) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/lumi/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "translate",
            requestId: crypto.randomUUID(),
            conversationId: c.id,
            level: c.level,
            mode: c.mode,
            correction: c.correction,
            messages: c.messages.map(({ role, content }) => ({
              role,
              content,
            })),
            word: lookup.trim(),
          }),
        }),
        data = await response.json();
      if (!response.ok)
        throw Error(data.error?.message ?? "Kelime açıklaması alınamadı.");
      if (!validResult(data)) throw Error("Kelime yanıtı doğrulanamadı.");
      setFound(data.reply);
      setStatus((s) => (s ? { ...s, remaining: data.remaining } : s));
    } catch (e) {
      setError(clientError(e));
    } finally {
      setBusy(false);
    }
  }
  function speak(text: string) {
    speaker.current?.stop();
    const sequence = new SpeechSequence(browserSpeechHost(), {
      status: (_, message) => setSpeechNotice(message),
      active: () => {},
      heard: () => {},
      finished: () => {},
    });
    speaker.current = sequence;
    sequence.setRate(1);
    const lines = text
      .match(/[^.!?]+[.!?]?/g)
      ?.flatMap((s) => s.match(/.{1,300}(?:\s|$)|.{1,300}/g) ?? [s]) ?? [text];
    void sequence.play(lines);
  }
  async function save(word: TutorWord) {
    const existing = learning.repository
      .all()
      .find(
        (w) =>
          w.german_word === word.german &&
          (!word.article || w.article === word.article),
      );
    await collectLumiWord(word, existing?.id ?? null);
  }
  async function unlock() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/lumi/access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }),
        data = await response.json();
      setPassword("");
      if (!response.ok) throw Error(data.error?.message ?? "Erişim açılamadı.");
      await refresh();
    } catch (e) {
      setError(clientError(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!deleting) return;
    const id = deleting;
    speaker.current?.stop();
    if (!(await deleteLumiChat(id))) {
      setDeleting(null);
      setError(
        "Konuşma cihaz kaydından silinemedi. Depolama alanını kontrol edip yeniden dene.",
      );
      return;
    }
    setDeleting(null);
    if (status?.configured && status.authenticated) {
      try {
        const response = await fetch("/api/lumi/chat", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId: id }),
        });
        if (!response.ok) throw Error("metadata-delete");
      } catch {
        setError(
          "Cihazdaki sohbet silindi. Sunucudaki içeriksiz kullanım sayaçları korunur; kısa süreli yanıt önbelleği iki dakika içinde temizlenir.",
        );
      }
    }
  }
  const turns = c?.messages.filter((m) => m.role === "user").length ?? 0,
    characters =
      c?.messages
        .filter((m) => m.role === "user")
        .reduce((n, m) => n + m.content.trim().length, 0) ?? 0;
  return (
    <div className="page-content lumi-chat-page">
      <PageHeading
        eyebrow="KÜÇÜK SOHBETLER, BÜYÜYEN CESARET"
        title="Lumi ile Konuş 🤖🌸"
        description="Almancanı güvenle dene. Bir cümleyle başla, sohbet ettikçe çiçek aç."
      >
        <span className="lumi-private-badge">
          <ShieldCheck size={14} />
          Geçmişin bu cihazda
        </span>
      </PageHeading>
      <BirthdayLumiGreeting onPhrase={setDraft} />
      {notice && (
        <p className="lumi-alert" role="status">
          {notice}
        </p>
      )}
      {statusError && (
        <div className="lumi-alert" role="alert">
          {statusError}
          <Button variant="outline" onClick={() => void refresh()}>
            Bağlantıyı yeniden dene
          </Button>
        </div>
      )}
      {!status && !statusError && (
        <p role="status" className="lumi-status-loading">
          Lumi bağlantısı kontrol ediliyor…
        </p>
      )}
      {status && !status.configured && (
        <section className="lumi-setup" aria-labelledby="lumi-setup-title">
          <div>
            <KeyRound size={24} />
            <span className="lumi-eyebrow">BİR KÜÇÜK KURULUM KALDI</span>
            <h2 id="lumi-setup-title">
              Lumi henüz AI sağlayıcısına bağlı değil.
            </h2>
            <p>
              Gerçek sohbet için sunucudaki sağlayıcı anahtarı ve model
              ayarlanmalı. Anahtarını bu sayfaya veya sohbet mesajına yazma.
              Kurulum yapılana kadar AI yanıtı ve sohbet ödülü üretilmez.
            </p>
            <details>
              <summary>Kurulum adımlarını göster</summary>
              <ol>
                <li>
                  Projedeki <code>.env.example</code> dosyasını{" "}
                  <code>.env.local</code> olarak kopyala.
                </li>
                <li>
                  <code>GEMINI_API_KEY</code> ve <code>GEMINI_MODEL</code>{" "}
                  değerlerini sunucuda ayarla. Yapılandırılmış çıktıyı
                  destekleyen, hesabında erişilebilir bir model kullan. Tercih
                  edilen model: gemini-3.5-flash-lite. Sağlayıcıyı
                  LUMI_PROVIDER=gemini olarak ayarla.
                </li>
                <li>
                  Üretim için erişim parolası, en az 32 karakterlik oturum sırrı
                  ve uygulama adresini de ayarla.
                </li>
                <li>
                  Geliştirme sunucusunu yeniden başlat, sonra bağlantıyı kontrol
                  et.
                </li>
              </ol>
            </details>
            <Button variant="outline" onClick={() => void refresh()}>
              <RotateCcw size={15} />
              Bağlantıyı kontrol et
            </Button>
          </div>
          <LumiMascot expression="thinking" decorative />
        </section>
      )}
      {status?.configured && !status.authenticated && (
        <form
          className="lumi-access"
          onSubmit={(e) => {
            e.preventDefault();
            void unlock();
          }}
        >
          <KeyRound size={22} />
          <div>
            <h2>Konuşma alanını aç</h2>
            <p>
              Uygulama erişim parolasını gir. Bu, AI sağlayıcısının anahtarı
              değildir.
            </p>
          </div>
          <label>
            <span className="sr-only">Uygulama erişim parolası</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              maxLength={200}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Erişim parolası"
            />
          </label>
          <Button disabled={busy || !password}>Alanı aç</Button>
        </form>
      )}
      <div className="lumi-workspace">
        <aside className="lumi-chat-sidebar">
          <div className="lumi-sidebar-heading">
            <h2>Konuşmalarım</h2>
            <button
              disabled={!ready || readonly || busy}
              onClick={() => void start()}
              aria-label="Yeni konuşma"
            >
              <Plus size={18} />
            </button>
          </div>
          <p className="lumi-sidebar-note">Yeni konuşmanın ayarları</p>
          <label>
            Almanca düzeyi
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label>
            Konuşma modu
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as TutorMode)}
            >
              {Object.entries(MODES).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Düzeltme tercihi
            <select
              value={correction}
              onChange={(e) => setCorrection(e.target.value as CorrectionStyle)}
            >
              <option value="gentle">Sohbette nazik düzeltmeler</option>
              <option value="summary">Sohbet sonunda özet</option>
            </select>
          </label>
          <Button
            disabled={!ready || readonly || busy}
            onClick={() => void start()}
          >
            <Plus size={16} />
            Yeni konuşma
          </Button>
          <p className="lumi-fine">
            Ayarlar yeni konuşmaya uygulanır; açık konuşmanın ayarları korunur.
          </p>
          <div className="lumi-history" aria-label="Kaydedilen konuşmalar">
            {[...state.conversations].reverse().map((chat) => (
              <div
                className={chat.id === c?.id ? "selected" : ""}
                key={chat.id}
              >
                <button
                  disabled={busy}
                  onClick={() => {
                    speaker.current?.stop();
                    setDraft("");
                    setFound(null);
                    setError("");
                    void selectLumiChat(chat.id);
                  }}
                  aria-current={chat.id === c?.id ? "page" : undefined}
                >
                  <MessageCircle size={15} />
                  <span>
                    <strong>{MODES[chat.mode]}</strong>
                    <small>
                      {chat.level} ·{" "}
                      {chat.closed
                        ? "Kapandı"
                        : chat.pending
                          ? "Yanıt bekleniyor"
                          : "Devam ediyor"}
                    </small>
                  </span>
                </button>
                <button
                  aria-label={`${MODES[chat.mode]} konuşmasını sil`}
                  disabled={busy || readonly}
                  onClick={() => setDeleting(chat.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {!state.conversations.length && (
              <p>İlk sohbetinin ayracı burada kalacak. 🌿</p>
            )}
          </div>
          <div className="lumi-milestones">
            <strong>Pratik bahçen</strong>
            <p>{state.completed.length} tamamlanan gerçek pratik</p>
            <div>
              {[1, 3, 7].map((n) => (
                <span
                  className={state.completed.length >= n ? "earned" : ""}
                  key={n}
                >
                  {state.completed.length >= n ? "🌼" : "🌱"} {n} pratik
                </span>
              ))}
            </div>
          </div>
        </aside>
        <section className="lumi-conversation" aria-label="Lumi konuşması">
          <header className="lumi-chat-top">
            <LumiMascot decorative expression={busy ? "thinking" : "happy"} />
            <div>
              <h2>
                Lumi <span>Öğrenme arkadaşın</span>
              </h2>
              <p>
                {c
                  ? `${c.level} · ${MODES[c.mode]} · ${c.correction === "gentle" ? "Nazik düzeltme" : "Düzeltmeler sonda"}`
                  : "Sana uygun bir dünya seç, bir merhaba ile başla."}
              </p>
            </div>
            <span
              className={
                status?.configured && status.authenticated
                  ? "lumi-connection ready"
                  : "lumi-connection"
              }
            >
              {!status
                ? "Bağlantı bekleniyor"
                : status.configured
                  ? status.authenticated
                    ? "Bağlı"
                    : "Erişim gerekli"
                  : "Kurulum gerekli"}
            </span>
          </header>
          <div
            className="lumi-messages"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {!c || !c.messages.length ? (
              <div className="lumi-empty-chat">
                <div className="lumi-empty-orbit">
                  <LumiMascot expression="encouraging" decorative />
                  <span>✦</span>
                  <span>✿</span>
                </div>
                <span className="lumi-eyebrow">HER CÜMLE BİR KÜÇÜK TOHUM</span>
                <h3>Birlikte Almanca konuşalım.</h3>
                <p>
                  Hata yapabilirsin; burada amaç kusursuzluk değil, kendini
                  ifade etmek.{" "}
                  {c
                    ? "Bir başlangıç seçebilir veya kendi cümleni yazabilirsin."
                    : "Soldaki ayarlardan yeni bir konuşma aç."}
                </p>
                <p className="lumi-fine">
                  Bu bir karşılama metnidir; AI yanıtı değildir.
                </p>
              </div>
            ) : null}
            {c?.messages.map((m) => (
              <article className={"lumi-message " + m.role} key={m.id}>
                <span className="lumi-message-author">
                  {m.role === "user" ? "Sen" : "Lumi · AI yanıtı"}
                </span>
                <p lang="de">{m.content}</p>
                {m.role === "assistant" && (
                  <button
                    className="lumi-speak"
                    onClick={() => speak(m.content)}
                  >
                    <Volume2 size={14} />
                    Dinle / yeniden çal · Cihaz sesi
                  </button>
                )}
                {m.reply && (
                  <>
                    <p className="lumi-encouragement">
                      🌷 {m.reply.encouragementTr}
                    </p>
                    {m.reply.noticeTr && (
                      <p className="lumi-encouragement">{m.reply.noticeTr}</p>
                    )}
                    {m.reply.corrections.length > 0 && (
                      <details className="lumi-corrections" open={c.closed}>
                        <summary>
                          {c.closed
                            ? "Konuşmanın öğrenme notları"
                            : "Küçük bir dil ipucu"}
                        </summary>
                        {m.reply.corrections.map((fix, i) => (
                          <div key={i}>
                            <span>Senin ifaden</span>
                            <p lang="de">{fix.original}</p>
                            <span>Düzeltilmiş öneri</span>
                            <p lang="de">
                              <b>{fix.corrected}</b>
                            </p>
                            <p>{fix.explanationTr}</p>
                            <span>Doğal bir alternatif</span>
                            <p lang="de">{fix.alternative}</p>
                          </div>
                        ))}
                      </details>
                    )}
                    {m.reply.vocabulary.length > 0 && (
                      <WordSuggestions
                        words={m.reply.vocabulary}
                        saved={state.words.map((w) => w.key)}
                        disabled={
                          readonly || state.words.length >= LIMITS.words
                        }
                        onSave={(word) => void save(word)}
                      />
                    )}
                  </>
                )}
              </article>
            ))}
            {c?.pending?.action === "message" && (
              <article className="lumi-message user pending">
                <span className="lumi-message-author">
                  Sen · {busy ? "Gönderiliyor" : "Yanıt bekliyor"}
                </span>
                <p lang="de">{c.pending.text}</p>
              </article>
            )}
            {busy && c?.pending && (
              <div className="lumi-typing" role="status">
                <span>✿</span>Lumi düşünüyor…
              </div>
            )}
            <div ref={end} />
          </div>
          {c && !c.closed && !c.pending && turns === 0 && (
            <div
              className="lumi-starters"
              aria-label="Hazır konuşma başlangıçları"
            >
              {STARTERS[c.mode].map((s) => (
                <button
                  key={s.de}
                  disabled={busy}
                  onClick={() => setDraft(s.de)}
                >
                  <strong lang="de">{s.de}</strong>
                  <span>{s.tr}</span>
                </button>
              ))}
            </div>
          )}
          {error && (
            <div className="lumi-chat-error" role="alert">
              {error}
              {c?.pending && (
                <Button
                  variant="outline"
                  disabled={busy || !allowed}
                  onClick={() => void call(c.pending!.action, true)}
                >
                  <RotateCcw size={14} />
                  Aynı isteği yeniden dene
                </Button>
              )}
            </div>
          )}
          {speechNotice && (
            <div className="lumi-speech-status" role="status">
              {speechNotice}
              <button
                onClick={() => {
                  speaker.current?.stop();
                  setSpeechNotice("Seslendirme durduruldu.");
                }}
              >
                <Square size={12} />
                Sesi durdur
              </button>
            </div>
          )}
          {!state.consent && (
            <label className="lumi-consent">
              <input
                type="checkbox"
                checked={state.consent}
                disabled={readonly}
                onChange={(e) => void consentLumi(e.target.checked)}
              />
              Gönderdiğim sohbet metninin AI sağlayıcısına iletileceğini
              biliyorum. Özel bilgi yazmadan pratik yapacağım.
            </label>
          )}
          <form
            className="lumi-composer"
            onSubmit={(e) => {
              e.preventDefault();
              void call("message");
            }}
          >
            <label className="sr-only" htmlFor="lumi-message-draft">
              Almanca mesajın
            </label>
            <textarea
              id="lumi-message-draft"
              lang="de"
              maxLength={LIMITS.message}
              value={draft}
              rows={3}
              disabled={!c || c.closed || busy || !!c.pending || !allowed}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                !status?.configured
                  ? "Kurulum tamamlandığında buradan Almanca yazabilirsin…"
                  : !c
                    ? "Önce yeni bir konuşma aç…"
                    : c.closed
                      ? "Bu konuşma kapandı. Yeni bir konuşma açabilirsin."
                      : "Almanca bir cümle yaz…"
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  void call("message");
                }
              }}
            />
            <div>
              <VoiceInput
                disabled={!c || c.closed || busy || !!c.pending || !allowed}
                onStart={() => speaker.current?.stop()}
                onText={(text) =>
                  setDraft((old) =>
                    (old + " " + text).trim().slice(0, LIMITS.message),
                  )
                }
              />
              <span className="lumi-draft-count">
                {draft.length}/{LIMITS.message}
              </span>
              <Button
                type="submit"
                disabled={
                  !c ||
                  c.closed ||
                  busy ||
                  !!c.pending ||
                  !allowed ||
                  !draft.trim() ||
                  turns >= LIMITS.turns
                }
              >
                <Send size={16} />
                Gönder
              </Button>
            </div>
          </form>
          <footer className="lumi-chat-footer">
            <span>
              {turns}/{LIMITS.turns} yanıtlı tur · {characters} yazılan karakter
            </span>
            {c && !c.closed && (
              <button
                disabled={busy || !allowed || !!c.pending || !turns}
                onClick={() => void call("finish")}
              >
                Sohbeti bitir, öğrenme notlarımı al <ArrowRight size={14} />
              </button>
            )}
            {c?.closed && (
              <span>
                ✓{" "}
                {c.qualified
                  ? "Pratik tamamlandı"
                  : "Konuşma kapandı · Kısa pratik"}
              </span>
            )}
          </footer>
        </section>
      </div>
      <section className="lumi-bottom-grid">
        <div className="lumi-word-help">
          <span className="lumi-eyebrow">BİR KELİMEDE TAKILDIN MI?</span>
          <h2>Kelime arkadaşın</h2>
          <p>
            Sohbette geçen bir kelimeyi veya kısa ifadeyi yaz. Açıklama da
            günlük AI kullanımından sayılır.
          </p>
          <div>
            <label className="sr-only" htmlFor="lumi-word-lookup">
              Açıklanacak Almanca kelime
            </label>
            <input
              id="lumi-word-lookup"
              lang="de"
              maxLength={80}
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              placeholder="Örneğin: bestellen"
            />
            <Button
              variant="outline"
              disabled={
                !c ||
                c.closed ||
                !turns ||
                !allowed ||
                busy ||
                !!c.pending ||
                !lookup.trim()
              }
              onClick={() => void translate()}
            >
              Açıkla
            </Button>
          </div>
          {found && (
            <WordSuggestions
              words={found.vocabulary}
              saved={state.words.map((w) => w.key)}
              disabled={readonly || state.words.length >= LIMITS.words}
              onSave={(word) => void save(word)}
            />
          )}
        </div>
        <div className="lumi-practice-rules">
          <span className="lumi-eyebrow">KÜÇÜK, DÜZENLİ PRATİKLER</span>
          <h2>Her gün bir çiçek daha</h2>
          <p>
            Bir pratiğin tamamlanması için en az{" "}
            <b>
              4 gerçek yanıtlı tur, 60 yazılan karakter ve sunucuda ölçülen 60
              saniye
            </b>{" "}
            gerekir. Sonunda sohbeti bitirerek notlarını al.
          </p>
          <p>
            Günün ilk uygun pratiği: <b>15 XP + 10 bahçe parası.</b> Diğer
            tamamlamalar pratik sayına eklenir; aynı gün kaynak ödülü tekrar
            verilmez.
          </p>
          <small>
            Bugünkü cihaz kullanım hakkı:{" "}
            {status?.configured ? status.remaining : "—"} / {LIMITS.clientDay}.
            Tüm uygulamada en fazla {LIMITS.globalDay} sağlayıcı isteği/gün;
            sınırlar Türkiye takvim gününe göre hesaplanır. Yeniden denemeler de
            maliyet doğurabilir.
          </small>
          {state.claims.some((c) => !c.delivered) && (
            <Button variant="outline" onClick={() => void flushLumiRewards()}>
              Kayıtlı ödülleri aktar
            </Button>
          )}
        </div>
      </section>
      <p className="lumi-privacy-note">
        Günlük sayfaları otomatik paylaşılmaz. Sohbet geçmişi bu tarayıcıda
        tutulur; sunucu metinleri günlüğe yazmaz. Sağlayıcı kendi veri
        politikasıyla işler. Sesle yazma cihazına göre tarayıcı hizmetini
        kullanabilir. AI açıklamaları hata içerebilir; telaffuz doğruluğu
        ölçülmez.
      </p>
      <dialog
        ref={deleteDialog}
        className="lumi-delete-dialog"
        onCancel={() => setDeleting(null)}
        aria-labelledby="lumi-delete-title"
      >
        <Trash2 size={26} />
        <h2 id="lumi-delete-title">Bu konuşmayı sil?</h2>
        <p>
          Bu konuşmanın metinleri bu tarayıcıdan ve sohbet yedeklerinden
          kaldırılır. Kaydettiğin kelimeler, kazanılmış kaynaklar ve içeriksiz
          kullanım sayaçları korunur.
        </p>
        <div>
          <Button variant="outline" onClick={() => setDeleting(null)}>
            Vazgeç
          </Button>
          <Button onClick={() => void remove()}>Konuşmayı sil</Button>
        </div>
      </dialog>
    </div>
  );
}
export function WordSuggestions({
  words,
  saved,
  disabled,
  onSave,
}: {
  words: TutorWord[];
  saved: string[];
  disabled: boolean;
  onSave: (word: TutorWord) => void;
}) {
  return (
    <div className="lumi-word-suggestions">
      {words.map((w, i) => (
        <details key={wordKey(w) + i}>
          <summary lang="de">
            <BookOpen size={13} />
            {w.article} {w.german}
          </summary>
          <p>{w.meaningTr}</p>
          <p lang="de">{w.exampleDe}</p>
          <p>{w.exampleTr}</p>
          <span className="lumi-ai-word-label">
            Lumi’nin AI açıklaması · Sözlük kaydıyla ayrıca eşleştirilir
          </span>
          <button
            disabled={disabled || saved.includes(wordKey(w))}
            onClick={() => onSave(w)}
          >
            {saved.includes(wordKey(w)) ? (
              <>
                <Check size={13} />
                Kaydedildi
              </>
            ) : (
              <>
                <Plus size={13} />
                Kelimelerime kaydet
              </>
            )}
          </button>
        </details>
      ))}
    </div>
  );
}
