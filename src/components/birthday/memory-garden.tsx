"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, BookHeart, Check, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/garden/primitives";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { FlowerArt, DecorationArt } from "@/components/garden/game/flower-art";
import { GiftArt } from "@/components/gifts/daily-gift";
import {
  BIRTHDAY_PHRASES,
  BIRTHDAY_REWARD,
  validMemory,
  type BirthdayConfig,
} from "@/lib/birthday/model";
import {
  birthdayJson,
  refreshBirthday,
  useBirthday,
} from "@/lib/birthday/client";
import { receiveBirthdayGift, useGarden } from "@/lib/garden/store";
export function BirthdayBouquet() {
  return (
    <div className="birthday-bouquet" aria-hidden="true">
      <div>
        <FlowerArt species="lavender" stage="bloom" />
      </div>
      <div>
        <FlowerArt species="rose" stage="bloom" />
      </div>
      <div>
        <FlowerArt species="birthday-star" stage="bloom" />
      </div>
      <div>
        <FlowerArt species="tulip" stage="bloom" />
      </div>
      <div>
        <FlowerArt species="daisy" stage="bloom" />
      </div>
      <span className="bouquet-wrap" />
      <span className="bouquet-ribbon">♡</span>
    </div>
  );
}
export function BirthdayExperience({
  event,
  opened,
  onOpen,
  busy = false,
  preview = false,
  openedAt,
}: {
  event: BirthdayConfig;
  opened: boolean;
  onOpen: () => void;
  busy?: boolean;
  preview?: boolean;
  openedAt?: number;
}) {
  const letterRef = useRef<HTMLElement>(null);
  function readLetter() {
    letterRef.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <div className={`birthday-experience ${opened ? "birthday-opened" : ""}`}>
      <section className="birthday-welcome">
        <div className="birthday-petals" aria-hidden="true">
          {["✿", "✦", "❀", "✧", "✿", "❀"].map((s, i) => (
            <span key={i} style={{ "--petal": i } as React.CSSProperties}>
              {s}
            </span>
          ))}
        </div>
        <div className="birthday-welcome-copy">
          <span className="eyebrow">BİR BAHÇE DOLUSU İYİ Kİ</span>
          <h2>
            İyi ki doğdun
            {event.recipientName ? (
              <>
                ,<br />
                <em>{event.recipientName}.</em>
              </>
            ) : (
              <>
                !<br />
                <em>Bugün senin günün.</em>
              </>
            )}
          </h2>
          <p>{event.greeting}</p>
          <div className="birthday-wish">
            <LumiMascot expression="celebrating" decorative />
            <span>
              Bugün acelemiz yok. Bir dilek tut; bu bahçede sana ayrılmış
              minicik bir sihir var.
            </span>
          </div>
          {opened ? (
            <Button onClick={readLetter}>
              <BookHeart size={17} />
              Mektubumu Tekrar Oku
            </Button>
          ) : (
            <Button onClick={onOpen} disabled={busy}>
              {busy ? "Hatıran güvenle saklanıyor…" : "🎁 Sürprizimi Aç"}
            </Button>
          )}
          <small>
            {preview
              ? "Kurucu önizlemesi · Gerçek ödül veya ilerleme kaydı oluşturulmaz."
              : opened
                ? "Bu an saklandı. Dilediğin zaman geri dönebilirsin."
                : "Mektubun ve küçük bahçe hediyelerin seni bekliyor."}
          </small>
        </div>
        <div className="birthday-box-stage">
          <div className="birthday-box-halo" />
          <GiftArt opened={opened} />
          <span className="birthday-wax">
            {opened ? "Hatıran burada" : "Senin için"}
            <span>✿</span>
          </span>
        </div>
      </section>
      {opened && (
        <div className="birthday-reveal">
          <section
            className="birthday-letter"
            ref={letterRef}
            aria-labelledby={`letter-${event.id}`}
          >
            <div className="letter-topline">
              <span>DEUTSCH GARDEN · SANA ÖZEL</span>
              <span>✿</span>
            </div>
            <div className="letter-flower" aria-hidden="true">
              ✿
            </div>
            <p className="letter-salutation">
              {event.recipientName
                ? `Sevgili ${event.recipientName},`
                : "Senin için,"}
            </p>
            <h3 id={`letter-${event.id}`}>Bir doğum günü dileği…</h3>
            <div className="letter-paragraphs">
              {event.letter
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
            <div className="letter-signature">
              <span>Sevgiyle,</span>
              <strong>
                {event.senderName || "Bu bahçeyi senin için hazırlayan kişi"}
              </strong>
            </div>
            <div className="letter-bottomline">
              <span>Hatırlamak istediğinde, bir çiçek kadar yakınım.</span>
              <span>♡</span>
            </div>
          </section>
          <aside className="birthday-keepsakes">
            <div className="birthday-bouquet-card">
              <span className="eyebrow">BİR DEMET GÜZEL DİLEK</span>
              <BirthdayBouquet />
              <p>Yeni yaşına renk, günlerine küçük mutluluklar.</p>
            </div>
            <section className="birthday-reward-card">
              <span className="eyebrow">
                {preview
                  ? "ÖNİZLEME HEDİYELERİ · TESLİM EDİLMEDİ"
                  : "BU DOĞUM GÜNÜNDEN SANA"}
              </span>
              <h3>Bahçene üç küçük hatıra</h3>
              <ul>
                <li>
                  <span>🌟</span>
                  <span>
                    <strong>
                      {BIRTHDAY_REWARD.seeds} Doğum Günü Yıldızı tohumu
                    </strong>
                    <small>Ek, büyüt, topla; kalıcı albümünde sakla.</small>
                  </span>
                </li>
                <li>
                  <span>🪙</span>
                  <span>
                    <strong>{BIRTHDAY_REWARD.coins} bahçe parası</strong>
                    <small>Mevcut bahçe cüzdanına eklenir.</small>
                  </span>
                </li>
                <li>
                  <span>🌷</span>
                  <span>
                    <strong>Dilek Çelengi</strong>
                    <small>Bir kez açılan, taşınabilir kalıcı süs.</small>
                  </span>
                </li>
              </ul>
              {openedAt && (
                <p className="birthday-first-open">
                  <Check size={14} /> İlk açılış:{" "}
                  {new Intl.DateTimeFormat("tr-TR", {
                    timeZone: "Europe/Istanbul",
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(openedAt)}
                </p>
              )}
            </section>
          </aside>
        </div>
      )}
      {opened && (
        <section className="birthday-lumi-card">
          <div>
            <LumiMascot expression="happy" decorative />
          </div>
          <section>
            <span className="eyebrow">LUMİ’DEN KÜÇÜK BİR DOĞUM GÜNÜ NOTU</span>
            <h3>Bir dilek de Almanca tutalım mı?</h3>
            <p>
              İyi ki doğdun! Bugün tek bir Almanca cümle bile güzel bir
              başlangıç. Bu kutlama için AI bağlantısı gerekmiyor.
            </p>
            <div className="birthday-phrases">
              {BIRTHDAY_PHRASES.map((p) => (
                <div key={p.de}>
                  <strong>{p.de}</strong>
                  <span>{p.tr}</span>
                </div>
              ))}
            </div>
            {!preview && (
              <Link href="/lumi-ai">
                İstersen Lumi ile kısa bir sohbet başlat{" "}
                <ArrowRight size={15} />
              </Link>
            )}
          </section>
        </section>
      )}
    </div>
  );
}
export function MemoryGarden() {
  const { status, ready, error } = useBirthday(),
    garden = useGarden();
  const [selected, setSelected] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [password, setPassword] = useState("");
  const opening = useRef(false);
  const memories = garden.state.birthdayMemories ?? [];
  const old = selected
    ? memories.find((m) => m.event.id === selected)
    : undefined;
  const event = old?.event ?? status?.event ?? memories.at(-1)?.event;
  const memory = event
    ? memories.find((m) => m.event.id === event.id)
    : undefined;
  const display = memory?.event ?? event;
  async function open() {
    if (!event || opening.current) return;
    opening.current = true;
    setBusy(true);
    setMessage("");
    try {
      const payload = await birthdayJson("/api/birthday/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!validMemory(payload)) throw Error("Sürpriz yanıtı doğrulanamadı.");
      if (payload.event.id !== event.id)
        throw Error(
          "Etkinlik değişti. Sayfayı yenileyip sürprizi yeniden açabilirsin.",
        );
      const result = await receiveBirthdayGift(payload);
      setMessage(result.message);
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Sürpriz açılamadı; kayıtların korunuyor.",
      );
    } finally {
      opening.current = false;
      setBusy(false);
    }
  }
  async function access(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await birthdayJson("/api/birthday/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "recipient", password }),
      });
      setPassword("");
      await refreshBirthday();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Giriş yapılamadı.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-content birthday-page">
      <PageHeading
        eyebrow="BAZI GÜZELLİKLER HEP BİZİMLE KALIR"
        title="Hatıra Bahçem 💌"
        description="Bir mektup, bir çiçek, saklamak istediğin küçük bir an."
      />
      {memories.length > 1 && (
        <label className="birthday-memory-select">
          Bir hatıra seç
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">
              {status?.event
                ? "Şu anki doğum günü etkinliği"
                : "En son hatıram"}
            </option>
            {memories.map((m) => (
              <option value={m.event.id} key={m.event.id}>
                {m.event.date} ·{" "}
                {m.event.recipientName || "Doğum günü hatırası"}
              </option>
            ))}
          </select>
        </label>
      )}
      {(message || error) && (
        <p role="status" className="birthday-notice">
          {message || error}
        </p>
      )}
      {error && (
        <Button variant="outline" onClick={() => void refreshBirthday()}>
          Bağlantıyı yeniden dene
        </Button>
      )}
      {display ? (
        <>
          <BirthdayExperience
            event={display}
            opened={!!memory}
            onOpen={() => void open()}
            busy={busy || !garden.ready || garden.mode !== "local"}
            openedAt={memory?.openedAt}
          />
          {memory && (
            <section className="birthday-memory-shelf">
              <article>
                <div className="birthday-memory-flower">
                  <FlowerArt species="birthday-star" stage="bloom" />
                </div>
                <span className="eyebrow">DOĞUM GÜNÜ YILDIZIM</span>
                <h3>Bir dilekten filizlenen hatıra</h3>
                <p>
                  {garden.state.collection?.["birthday-star"]?.quantity
                    ? `${garden.state.collection["birthday-star"]!.quantity} çiçeğin kalıcı koleksiyonunda.`
                    : garden.state.seeds["birthday-star"] > 0
                      ? "Özel tohumun çantanda; boş bir toprağa ekebilirsin."
                      : "Tohumun bahçende büyüyor. Açınca toplayıp kalıcı albümüne ekle."}
                </p>
                <Link href="/bahcem#flower-collection">
                  Bahçeme ve koleksiyonuma git →
                </Link>
              </article>
              <article className="birthday-postcard">
                <span>💌</span>
                <small>
                  {new Intl.DateTimeFormat("tr-TR", {
                    timeZone: "Europe/Istanbul",
                    dateStyle: "long",
                  }).format(Date.parse(display.date + "T12:00:00+03:00"))}
                </small>
                <h3>
                  İyi ki doğdun
                  {display.recipientName ? `, ${display.recipientName}` : ""}.
                </h3>
                <p>
                  Bu bahçede bir doğum günü dileği saklı. Yeniden okumak
                  istediğinde mektubun burada.
                </p>
                <strong>
                  {display.senderName
                    ? `${display.senderName}’den sevgiyle`
                    : "Sevgiyle hazırlanmış bir bahçe hatırası"}
                </strong>
              </article>
              <article>
                <div className="birthday-memory-decoration">
                  <DecorationArt kind="birthday-arch" />
                </div>
                <span className="eyebrow">KİLİDİ AÇILAN HATIRA</span>
                <h3>Dilek Çelengi</h3>
                <p>
                  {garden.state.placements.includes("birthday-arch")
                    ? "Çelengin bahçende. Taşıyabilir veya kaybetmeden çantana alabilirsin."
                    : "Kalıcı çelengin çantanda. Bahçendeki altı süs köşesinden birine yerleşir."}
                </p>
                <Link href="/bahcem#garden-bag">Süslerimi gör →</Link>
              </article>
            </section>
          )}
        </>
      ) : status?.accessRequired ? (
        <section className="birthday-private-entry">
          <LockKeyhole size={29} />
          <h2>Sana özel bahçene giriş</h2>
          <p>Uygulamanın erişim parolasıyla bu özel köşeyi açabilirsin.</p>
          <form onSubmit={access}>
            <label>
              Erişim parolası
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={200}
              />
            </label>
            <Button disabled={busy}>Özel bahçemi aç</Button>
          </form>
        </section>
      ) : (
        <section className="birthday-waiting">
          <span>✿</span>
          <h2>
            {!ready
              ? "Hatıra köşen hazırlanıyor…"
              : "Güzel hatıralara ayrılmış küçük bir bahçe."}
          </h2>
          <p>
            {status?.state === "countdown"
              ? "Bahçede küçük bir sürpriz hazırlanıyor. Doğru gün geldiğinde burada çiçek açacak."
              : "Sana özel bir an açıldığında burada saklanacak. O zamana kadar bahçende yeni çiçekler yetiştirebilirsin."}
          </p>
          <Button asChild>
            <Link href="/bahcem">
              Bahçeme dön <ArrowRight size={16} />
            </Link>
          </Button>
        </section>
      )}
    </div>
  );
}
