"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Gift,
  LockKeyhole,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorCard } from "@/components/garden/primitives";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { FlowerArt, DecorationArt } from "@/components/garden/game/flower-art";
import { completeBirthdayWelcome, useGarden } from "@/lib/garden/store";
import {
  dismissWelcomeForSession,
  refreshWelcome,
  useBirthdayWelcome,
  welcomeJson,
} from "@/lib/birthday/welcome-client";
import {
  excludedWelcomePath,
  shouldShowWelcome,
  validWelcomeContent,
  validWelcomeStatus,
  type WelcomeContent,
  type WelcomeStatus,
} from "@/lib/birthday/welcome-model";

export function BirthdayPresent({ opened = false }: { opened?: boolean }) {
  return (
    <svg
      className={`welcome-present ${opened ? "is-open" : ""}`}
      viewBox="0 0 350 320"
      role="img"
      aria-label="Çiçekli kurdeleyle sarılmış, sana özel doğum günü hediyesi"
    >
      <defs>
        <linearGradient id="welcome-box" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFCEE2" />
          <stop offset="1" stopColor="#D3B8F5" />
        </linearGradient>
        <linearGradient id="welcome-ribbon">
          <stop stopColor="#FFF0AD" />
          <stop offset="1" stopColor="#F5D67E" />
        </linearGradient>
      </defs>
      <ellipse
        cx="175"
        cy="280"
        rx="133"
        ry="20"
        fill="#B59BC3"
        opacity=".12"
      />
      <path
        d="M62 142h226v119q0 14-14 14H76q-14 0-14-14Z"
        fill="url(#welcome-box)"
      />
      <path d="M69 147h212" stroke="#B69CCB" opacity=".25" strokeWidth="5" />
      <path d="M159 144h32v131h-32Z" fill="url(#welcome-ribbon)" />
      {[84, 116, 230, 263].map((x, i) => (
        <g
          key={x}
          transform={`translate(${x} ${181 + (i % 2) * 45})`}
          fill="#FFF9F0"
          opacity=".64"
        >
          <path d="M0-8C4-13 11-9 8-3c9 2 7 11 0 10-4 8-13 3-9-3-9-4-5-12 1-12Z" />
          <circle r="2.8" fill="#F5D67E" />
        </g>
      ))}
      <g className="welcome-present-lid">
        <rect x="49" y="119" width="252" height="39" rx="10" fill="#B8A4E8" />
        <path d="M157 119h36v39h-36Z" fill="url(#welcome-ribbon)" />
        <path
          d="M174 117c-101 1-104-66-59-60 24 3 40 35 59 60Zm4 0c100-2 100-67 56-60-25 4-41 35-56 60Z"
          fill="#FFE78F"
          stroke="#F2CD77"
          strokeWidth="3"
        />
        <path
          d="M167 114c-4-26-15-40-28-48m44 48c4-25 17-41 29-49"
          fill="none"
          stroke="#EEC77C"
          strokeWidth="3"
        />
        <ellipse cx="176" cy="116" rx="15" ry="11" fill="#F8DE91" />
        <path d="m185 135 44 33-3-23 25 2-51-29" fill="#FFE9AA" />
        <path d="m167 134-42 29 2-22-24 2 50-25" fill="#FFE9AA" />
      </g>
      <path d="m227 224 9-37 42 10-8 36Z" fill="#FFFCF4" stroke="#E7D4E4" />
      <path
        d="M243 197c-6 7-9 18-7 25"
        stroke="#A8C99D"
        strokeWidth="2"
        fill="none"
      />
      <g transform="translate(244 207)" fill="#E0B7DE">
        <circle cy="-5" r="5" />
        <circle cx="-5" cy="2" r="5" />
        <circle cx="5" cy="2" r="5" />
        <circle cy="1" r="2.5" fill="#F2D37A" />
      </g>
      <path d="m301 74 4 10 11 3-11 4-4 11-4-11-11-4 11-3Z" fill="#FFE78F" />
      <path d="m49 66 3 8 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="#C8B1ED" />
    </svg>
  );
}
export function BirthdayWelcomeExperience({
  content,
  onEnter,
  busy = false,
  preview = false,
  replay = false,
  entered = false,
  error = "",
  onSkip,
}: {
  content: WelcomeContent;
  onEnter: () => void;
  busy?: boolean;
  preview?: boolean;
  replay?: boolean;
  entered?: boolean;
  error?: string;
  onSkip?: () => void;
}) {
  return (
    <section
      className={`welcome-experience ${entered ? "welcome-entered" : ""}`}
    >
      <div className="welcome-sparkles" aria-hidden="true">
        {["✧", "✦", "✿", "✧", "❀", "✦"].map((s, i) => (
          <span key={i} style={{ "--n": i } as React.CSSProperties}>
            {s}
          </span>
        ))}
      </div>
      <div className="welcome-butterfly butterfly-one" aria-hidden="true">
        🦋
      </div>
      <div className="welcome-butterfly butterfly-two" aria-hidden="true">
        🦋
      </div>
      <div className="welcome-confetti" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ "--n": i } as React.CSSProperties} />
        ))}
      </div>
      <div className="welcome-story">
        <span className="welcome-eyebrow">
          <Sparkles size={14} />
          SANA ÖZEL KÜÇÜK BİR DÜNYA
        </span>
        {preview && (
          <span className="welcome-preview-label">
            Önizleme · Kayıt ve ödül oluşturulmaz
          </span>
        )}
        <h1 id="birthday-welcome-title" tabIndex={-1}>
          İyi ki doğdun
          {content.recipientName ? (
            <>
              ,<br />
              <em>{content.recipientName}!</em>
            </>
          ) : (
            <>
              !<span aria-hidden="true"> 🌷</span>
            </>
          )}
        </h1>
        <div className="welcome-letter">
          {content.message
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </div>
        {content.senderSignature && (
          <p className="welcome-signature">
            Sevgiyle,<strong>{content.senderSignature}</strong>
          </p>
        )}
        <div className="welcome-cta">
          <Button onClick={onEnter} disabled={busy}>
            {busy
              ? "Hatıran güvenle saklanıyor…"
              : preview && entered
                ? "Önizlemeyi yeniden oynat"
                : replay
                  ? "Bahçeme dön"
                  : "Deutsch Garden’a Gir"}
            {preview && entered ? (
              <RotateCcw size={17} />
            ) : (
              <ArrowRight size={17} />
            )}
          </Button>
          <p className="welcome-save-note">
            {preview
              ? entered
                ? "Önizleme tamamlandı. Gerçek hediyen ve ilerlemen değiştirilmedi."
                : "Buradaki düğme yalnızca önizlemeyi oynatır."
              : replay
                ? "Bu güzel anı tekrar yaşamak yeni bir ödül oluşturmaz."
                : "Giriş yaptığında bu an saklanır; sonraki ziyaretlerini bölmeyiz."}
          </p>
          {error && (
            <p className="welcome-error" role="alert">
              {error}
            </p>
          )}
          {error && onSkip && (
            <Button variant="outline" onClick={onSkip} disabled={busy}>
              Bu oturumda kaydetmeden devam et
            </Button>
          )}
        </div>
      </div>
      <div className="welcome-art-scene">
        <div className="welcome-lumi">
          <LumiMascot expression="celebrating" decorative />
          <div>
            Lumi’den kocaman bir gülümseme!
            <span>Bugün bahçenin en özel çiçeği sensin. ♡</span>
          </div>
        </div>
        <div className="welcome-gift-scene">
          <div className="welcome-gift-halo" />
          <BirthdayPresent opened={entered} />
          <span className="welcome-gift-seal">Senin için hazırlandı ♡</span>
        </div>
        <div className="welcome-flower-row" aria-hidden="true">
          {(
            ["lavender", "daisy", "birthday-star", "tulip", "rose"] as const
          ).map((species, i) => (
            <div key={species} style={{ "--n": i } as React.CSSProperties}>
              <FlowerArt species={species} stage="bloom" />
            </div>
          ))}
        </div>
        <div className="welcome-keepsake">
          <span className="welcome-keepsake-art">
            <DecorationArt kind="birthday-arch" />
          </span>
          <div>
            <span className="welcome-eyebrow">BAHÇENE KALICI BİR HATIRA</span>
            <strong>Dilek Çelengi</strong>
            <p>
              {preview
                ? "Yalnızca önizleme; çantana eklenmez."
                : replay
                  ? "Hatıran çantanda kalır. Dilediğin zaman bahçene yerleştirebilirsin."
                  : "Satın alınamaz. Bir kez çantana eklenir; taşısan veya kaldırsan da seninle kalır."}
            </p>
          </div>
          {replay && <Check size={18} />}
        </div>
      </div>
    </section>
  );
}
async function enterWelcome() {
  const data = await welcomeJson("/api/birthday/welcome", { method: "POST" });
  if (
    !validWelcomeContent(data.content) ||
    !Number.isSafeInteger(data.viewedAt)
  )
    throw new Error("Karşılama kaydı doğrulanamadı; hediye teslim edilmedi.");
  const result = await completeBirthdayWelcome(data.content, data.viewedAt);
  if (!result.ok) throw new Error(result.message);
}
export function BirthdayWelcomeLayer() {
  const path = usePathname();
  return excludedWelcomePath(path) ? null : <AutomaticWelcome path={path} />;
}
function AutomaticWelcome({ path }: { path: string }) {
  const welcome = useBirthdayWelcome(),
    garden = useGarden(),
    dialogRef = useRef<HTMLDialogElement>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const show = shouldShowWelcome(
    welcome.status,
    garden.state.birthdayWelcome,
    path,
    garden.ready && welcome.ready,
    welcome.dismissed,
  );
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!show || !dialog) return;
    const before = document.activeElement;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      if (before instanceof HTMLElement && before.isConnected)
        before.focus({ preventScroll: true });
    };
  }, [show]);
  async function enter() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await enterWelcome();
      dismissWelcomeForSession();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Karşılama kaydedilemedi. Bahçen korunuyor.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (
    welcome.status?.enabled &&
    welcome.status.accessRequired &&
    !garden.state.birthdayWelcome &&
    !welcome.dismissed
  )
    return (
      <aside className="birthday-memory-shortcut">
        <span>🎁</span>
        <p>Sana özel bir doğum günü karşılaması hazır.</p>
        <Link href="/dogum-gunu">Karşılamamı aç →</Link>
      </aside>
    );
  if (!show || !welcome.status?.content) return null;
  return (
    <dialog
      ref={dialogRef}
      className="birthday-welcome-dialog"
      aria-labelledby="birthday-welcome-title"
      onCancel={(e) => {
        e.preventDefault();
        dismissWelcomeForSession();
      }}
    >
      <BirthdayWelcomeExperience
        content={welcome.status.content}
        onEnter={() => {
          void enter();
        }}
        busy={busy}
        error={error}
        onSkip={dismissWelcomeForSession}
      />
      <small className="welcome-keyboard-note">
        Esc ile bu oturumluk geçebilirsin; giriş düğmesi hatıranı kaydeder.
      </small>
    </dialog>
  );
}
function RecipientAccess({ onSuccess }: { onSuccess: () => void }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const password = String(
      new FormData(e.currentTarget).get("accessPassword") ?? "",
    );
    setBusy(true);
    setError("");
    try {
      await welcomeJson("/api/birthday/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "recipient", password }),
      });
      await refreshWelcome();
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erişim doğrulanamadı.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="welcome-state-card">
      <span aria-hidden="true">💌</span>
      <h1>Sana özel bir karşılama</h1>
      <p>
        Bu sürpriz bir erişim parolasıyla korunuyor. Bu alan hesap giriş
        parolanı istemez.
      </p>
      <form onSubmit={submit}>
        <label>
          <LockKeyhole size={16} />
          Karşılama erişim parolası
          <input
            name="accessPassword"
            type="password"
            autoComplete="off"
            required
            maxLength={200}
          />
        </label>
        {error && (
          <p className="welcome-error" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy}>
          {busy ? "Kontrol ediliyor…" : "Karşılamamı aç"}
        </Button>
      </form>
      <Link href="/profilim">Profilime dön →</Link>
    </div>
  );
}
export function BirthdayWelcomePage({ preview }: { preview: boolean }) {
  return preview ? <WelcomePreview /> : <WelcomeReplay />;
}
function WelcomePreview() {
  const [status, setStatus] = useState<WelcomeStatus | null>(null),
    [error, setError] = useState(""),
    [entered, setEntered] = useState(false),
    [retry, setRetry] = useState(0),
    [modal, setModal] = useState(false);
  useEffect(() => {
    let active = true;
    void welcomeJson("/api/birthday/welcome?onizleme=1")
      .then((data) => {
        if (!validWelcomeStatus(data) || !data.preview || !data.content)
          throw new Error("Önizleme ayarı doğrulanamadı.");
        if (active) setStatus(data);
      })
      .catch((e) => {
        if (active)
          setError(e instanceof Error ? e.message : "Önizleme açılamadı.");
      });
    return () => {
      active = false;
    };
  }, [retry]);
  if (!status?.content)
    return (
      <div className="page-content">
        <div className="welcome-state-card" role="status">
          <span aria-hidden="true">🌷</span>
          <h1>Karşılama önizlemesi</h1>
          <p>{error || "Rengârenk bir dünya hazırlanıyor…"}</p>
          {error && (
            <Button
              onClick={() => {
                setError("");
                setRetry((n) => n + 1);
              }}
            >
              Yeniden dene
            </Button>
          )}
          <Link href="/profilim">Profilime dön →</Link>
        </div>
      </div>
    );
  return (
    <div className="page-content welcome-page">
      {modal ? (
        <WelcomePreviewDialog
          content={status.content}
          onClose={() => setModal(false)}
        />
      ) : (
        <BirthdayWelcomeExperience
          content={status.content}
          preview
          entered={entered}
          onEnter={() => setEntered((v) => !v)}
        />
      )}
      <Button variant="outline" onClick={() => setModal(true)}>
        İlk ziyaret penceresini dene
      </Button>
      <Link className="welcome-return" href="/profilim">
        ← Profilime dön
      </Link>
    </div>
  );
}
function WelcomePreviewDialog({
  content,
  onClose,
}: {
  content: WelcomeContent;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null),
    [entered, setEntered] = useState(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const before = document.activeElement;
    dialog.showModal();
    dialog.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      if (before instanceof HTMLElement && before.isConnected) before.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className="birthday-welcome-dialog"
      aria-labelledby="birthday-welcome-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <BirthdayWelcomeExperience
        content={content}
        preview
        entered={entered}
        onEnter={() => setEntered((v) => !v)}
      />
      <div className="welcome-preview-close">
        <Button variant="outline" onClick={onClose}>
          Önizlemeyi kapat
        </Button>
      </div>
    </dialog>
  );
}
function WelcomeReplay() {
  const welcome = useBirthdayWelcome(),
    garden = useGarden(),
    router = useRouter(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const record = garden.state.birthdayWelcome;
  if (!garden.ready || (!record && !welcome.ready))
    return (
      <div className="page-content">
        <div className="welcome-state-card" role="status">
          🌷 Karşılaman hazırlanıyor…
        </div>
      </div>
    );
  if (!record && welcome.status?.accessRequired)
    return (
      <div className="page-content">
        <RecipientAccess
          onSuccess={() => {
            void refreshWelcome();
          }}
        />
      </div>
    );
  const content = record?.content ?? welcome.status?.content;
  if (!content || (!record && !welcome.status?.enabled))
    return (
      <div className="page-content">
        <div className="welcome-state-card">
          <span aria-hidden="true">🌱</span>
          <h1>Karşılama şimdilik kapalı</h1>
          <p>
            {welcome.error ||
              "Etkin bir ilk ziyaret sürprizi yok. Kaydedilmiş bahçen ve doğum günü hatıraların korunuyor."}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              void refreshWelcome();
            }}
          >
            Yeniden kontrol et
          </Button>
          <Link href="/profilim">Profilime dön →</Link>
        </div>
      </div>
    );
  async function enter() {
    if (busy) return;
    if (record) {
      router.push("/");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await enterWelcome();
      dismissWelcomeForSession();
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hatıran kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-content welcome-page">
      <BirthdayWelcomeExperience
        content={content}
        replay={!!record}
        entered={!!record}
        busy={busy}
        error={error}
        onEnter={() => {
          void enter();
        }}
        onSkip={() => {
          dismissWelcomeForSession();
          router.push("/");
        }}
      />
      <Link className="welcome-return" href="/profilim">
        ← Profilime dön
      </Link>
    </div>
  );
}
export function BirthdayWelcomeProfile() {
  const welcome = useBirthdayWelcome(),
    garden = useGarden(),
    record = garden.state.birthdayWelcome;
  return (
    <ColorCard tone="pink" className="account-card welcome-profile-card">
      <div className="account-section-title">
        <span className="account-icon peach">
          <Gift />
        </span>
        <div>
          <h2>Doğum günü karşılamam</h2>
          <p>Sana ayrılmış küçük bir mutluluk.</p>
        </div>
      </div>
      <p>
        {record
          ? "İlk gülümsemen saklandı. Bu güzel anı dilediğin zaman yeniden yaşayabilirsin."
          : welcome.status?.enabled
            ? "Sana özel bir karşılama ve kalıcı bir Dilek Çelengi hazır."
            : "İlk ziyaret karşılaması şu anda kapalı. Mevcut doğum günü hatıraların Hatıra Bahçem’de korunur."}
      </p>
      <div className="account-actions">
        {(record || welcome.status?.enabled) && (
          <Button asChild>
            <Link href="/dogum-gunu">
              <RotateCcw size={16} />
              {record ? "Karşılamamı yeniden izle" : "Karşılamamı aç"}
            </Link>
          </Button>
        )}
        {welcome.status?.previewAvailable && (
          <Button variant="outline" asChild>
            <Link href="/dogum-gunu?onizleme=1">Kayıtsız önizleme</Link>
          </Button>
        )}
        <Button variant="ghost" asChild>
          <Link href="/hatira-bahcem">Hatıra Bahçem</Link>
        </Button>
      </div>
      {record && (
        <small>
          İlk giriş: {new Date(record.viewedAt).toLocaleDateString("tr-TR")} ·
          Dilek Çelengin kalıcı olarak çantanda. Tekrar izlemek yeni ödül
          vermez.
        </small>
      )}
      {welcome.error && (
        <p className="welcome-error" role="status">
          {welcome.error}
        </p>
      )}
    </ColorCard>
  );
}
