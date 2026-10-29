"use client";
import { useEffect, useState } from "react";
import { Eye, LockKeyhole, Save, ShieldCheck } from "lucide-react";
import { PageHeading } from "@/components/garden/primitives";
import { Button } from "@/components/ui/button";
import { BirthdayExperience } from "./memory-garden";
import { birthdayJson } from "@/lib/birthday/client";
import {
  DEFAULT_LETTER,
  validConfig,
  validDraft,
  type BirthdayConfig,
  type BirthdayDraft,
} from "@/lib/birthday/model";
const blank: BirthdayDraft = {
  date: "",
  recipientName: "",
  senderName: "",
  greeting: "Bugün Deutsch Garden’ın en güzel çiçeği sensin.",
  letter: DEFAULT_LETTER,
  showCountdown: true,
};
function draftOf(c: BirthdayConfig): BirthdayDraft {
  return {
    date: c.date,
    recipientName: c.recipientName,
    senderName: c.senderName,
    greeting: c.greeting,
    letter: c.letter,
    showCountdown: c.showCountdown,
  };
}
export function BirthdayCreator() {
  const [authenticated, setAuthenticated] = useState(false),
    [setup, setSetup] = useState(false),
    [loaded, setLoaded] = useState(false),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [config, setConfig] = useState<BirthdayConfig | null>(null),
    [draft, setDraft] = useState<BirthdayDraft>(blank),
    [phase, setPhase] = useState<"before" | "day" | "after">("day"),
    [opened, setOpened] = useState(false),
    [newConfirmed, setNewConfirmed] = useState(false);
  useEffect(() => {
    let active = true;
    void birthdayJson("/api/birthday/creator")
      .then((data) => {
        if (!active) return;
        setLoaded(true);
        setSetup(data.setupRequired === true);
        setAuthenticated(data.authenticated === true);
        if (validConfig(data.config)) {
          setConfig(data.config);
          setDraft(draftOf(data.config));
        }
      })
      .catch((e) => {
        if (active) {
          setLoaded(true);
          setNotice(e instanceof Error ? e.message : "Atölye açılamadı.");
        }
      });
    return () => {
      active = false;
    };
  }, []);
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      await birthdayJson("/api/birthday/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "creator", password }),
      });
      setPassword("");
      const data = await birthdayJson("/api/birthday/creator");
      setAuthenticated(data.authenticated === true);
      if (validConfig(data.config)) {
        setConfig(data.config);
        setDraft(draftOf(data.config));
      }
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Giriş yapılamadı.");
    } finally {
      setBusy(false);
    }
  }
  async function save(newEvent = false) {
    if (busy) return;
    if (!validDraft(draft)) {
      setNotice(
        "Geçerli bir etkinlik tarihi seç; adları 80, kutlamayı 300 ve mektubu 8000 karakterle sınırla.",
      );
      return;
    }
    if (newEvent && !newConfirmed) return;
    setBusy(true);
    setNotice("");
    try {
      const data = await birthdayJson("/api/birthday/creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft,
          expectedRevision: config?.revision ?? 0,
          newEvent,
        }),
      });
      if (!validConfig(data.config))
        throw Error("Kaydedilen ayar doğrulanamadı.");
      setConfig(data.config);
      setDraft(draftOf(data.config));
      setNewConfirmed(false);
      setNotice(
        newEvent
          ? "Ayrı doğum günü etkinliği oluşturuldu. Eski hatıralar korunur."
          : "Doğum günü ayarı sunucuda güvenle kaydedildi. Aynı etkinliğe ikinci kez ödül verilmez.",
      );
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Ayar kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }
  async function reload() {
    setBusy(true);
    try {
      const data = await birthdayJson("/api/birthday/creator");
      if (validConfig(data.config)) {
        setConfig(data.config);
        setNotice(
          "Kayıtlı sürüm bilgisi yenilendi; yazdığın form korunuyor. Tekrar kaydedebilirsin.",
        );
      }
      setAuthenticated(data.authenticated === true);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Kayıt alınamadı.");
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    try {
      await birthdayJson("/api/birthday/creator", { method: "DELETE" });
      setAuthenticated(false);
      setConfig(null);
      setDraft(blank);
      setOpened(false);
      setNotice("Kurucu oturumu kapatıldı.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Oturum kapatılamadı.");
    }
  }
  const preview: BirthdayConfig = {
    ...draft,
    letter: draft.letter.trim() || DEFAULT_LETTER,
    greeting: draft.greeting.trim() || blank.greeting,
    id: config?.id || "creator-preview-event",
    version: 1,
    revision: config?.revision ?? 1,
  };
  return (
    <div className="page-content birthday-page birthday-creator">
      <PageHeading
        eyebrow="YALNIZCA HEDİYEYİ HAZIRLAYAN KİŞİ İÇİN"
        title="Hediye Atölyesi 🌷"
        description="Tarihi, hitabı ve kendi sözlerini güvenli bir yerde hazırla. Gerçek hatıraları değiştirmeden önizle."
      />
      {notice && (
        <p className="birthday-notice" role="status">
          {notice}
        </p>
      )}
      {!loaded ? (
        <p>Atölye erişimi kontrol ediliyor…</p>
      ) : setup ? (
        <section className="birthday-private-entry">
          <ShieldCheck size={32} />
          <h2>Önce özel kurucu erişimini hazırla</h2>
          <p>
            Sunucudaki <code>.env.local</code> dosyasında en az 12 karakterlik{" "}
            <code>BIRTHDAY_CREATOR_PASSWORD</code> ayarla ve geliştirme
            sunucusunu yeniden başlat. Bu parolayı alıcıyla paylaşma.
          </p>
          <p>
            Üretimde ayrıca en az 32 karakterlik{" "}
            <code>BIRTHDAY_SESSION_SECRET</code> ve gerçek HTTPS adresini{" "}
            <code>BIRTHDAY_APP_ORIGIN</code> olarak ayarla. Yerelde oturum sırrı
            güvenli bir dosyada otomatik hazırlanır.
          </p>
          <p>
            Henüz hiçbir kişisel ad, tarih veya mektup kaydedilmedi. Ayrıntılar:{" "}
            <code>docs/STAGE-13.md</code>
          </p>
        </section>
      ) : !authenticated ? (
        <section className="birthday-private-entry">
          <LockKeyhole size={32} />
          <h2>Kurucu girişi</h2>
          <p>
            Bu alanın parolası, alıcının uygulama erişim parolasından ayrıdır.
          </p>
          <form onSubmit={login}>
            <label>
              Kurucu parolası
              <input
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={200}
                required
              />
            </label>
            <Button disabled={busy}>
              {busy ? "Kontrol ediliyor…" : "Özel atölyemi aç"}
            </Button>
          </form>
        </section>
      ) : (
        <>
          <div className="birthday-creator-toolbar">
            <span>
              <ShieldCheck size={16} /> Güvenli kurucu oturumu · Önizleme ödül
              vermez
            </span>
            <button onClick={() => void logout()}>Oturumu kapat</button>
          </div>
          <div className="birthday-editor">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void save();
              }}
            >
              <h2>Senin sözlerin, onun bahçesi.</h2>
              <p>
                Bu tarih, kutlamanın gerçekleşeceği yılın tarihidir; doğum yılı
                gerekmez. Gün Europe/Istanbul saatine göre açılır.
              </p>
              <label>
                Doğum günü etkinlik tarihi
                <input
                  type="date"
                  required
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                />
              </label>
              <div className="birthday-form-row">
                <label>
                  Alıcının adı
                  <input
                    maxLength={80}
                    value={draft.recipientName}
                    onChange={(e) =>
                      setDraft({ ...draft, recipientName: e.target.value })
                    }
                    placeholder="İstersen boş bırakabilirsin"
                  />
                </label>
                <label>
                  Gönderenin adı
                  <input
                    maxLength={80}
                    value={draft.senderName}
                    onChange={(e) =>
                      setDraft({ ...draft, senderName: e.target.value })
                    }
                    placeholder="Mektubun imzası"
                  />
                </label>
              </div>
              <label>
                Karşılama mesajı
                <textarea
                  rows={3}
                  maxLength={300}
                  value={draft.greeting}
                  onChange={(e) =>
                    setDraft({ ...draft, greeting: e.target.value })
                  }
                />
              </label>
              <label>
                Kişisel doğum günü mektubun
                <textarea
                  rows={12}
                  maxLength={8000}
                  value={draft.letter}
                  onChange={(e) =>
                    setDraft({ ...draft, letter: e.target.value })
                  }
                />
                <small>
                  {draft.letter.length} / 8000 · Paragrafların arasına boş satır
                  bırak. HTML çalıştırılmaz.
                </small>
              </label>
              <label className="birthday-checkbox">
                <input
                  type="checkbox"
                  checked={draft.showCountdown}
                  onChange={(e) =>
                    setDraft({ ...draft, showCountdown: e.target.checked })
                  }
                />{" "}
                Tarihten önce yalnızca küçük geri sayımı göster
              </label>
              <div className="birthday-form-actions">
                <Button type="submit" disabled={busy}>
                  <Save size={16} />
                  {busy ? "Kaydediliyor…" : "Ayarları kaydet"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void reload()}
                  disabled={busy}
                >
                  Kayıtlı sürümü kontrol et
                </Button>
              </div>
              <p className="birthday-editor-help">
                Tarih, ad veya mektup düzenlemek etkinlik kimliğini değiştirmez.
                Bir kez açılan mektubun ilk kopyası alıcının hatırasında
                saklanır.
              </p>
            </form>
            <aside>
              <div className="birthday-editor-note">
                <span>💌</span>
                <h3>En güzel cümle, sana ait olan.</h3>
                <p>
                  Kişisel bir anı uydurmana gerek yok. İçinden gelen birkaç
                  cümle yeterli. Hazır metin yalnızca düzenleyebileceğin sade
                  bir başlangıçtır.
                </p>
              </div>
              {config && (
                <details className="birthday-new-event">
                  <summary>Ayrı bir doğum günü etkinliği oluştur</summary>
                  <p>
                    Örneğin başka bir yıl için kullan. Bu işlem ayrı bir ödül
                    hakkı oluşturur; önceki mektup ve hatıraları silmez.
                  </p>
                  <label className="birthday-checkbox">
                    <input
                      type="checkbox"
                      checked={newConfirmed}
                      onChange={(e) => setNewConfirmed(e.target.checked)}
                    />{" "}
                    Ayrı bir etkinlik oluşturmak istediğimi biliyorum.
                  </label>
                  <Button
                    variant="outline"
                    disabled={busy || !newConfirmed}
                    onClick={() => void save(true)}
                  >
                    Yeni etkinliği oluştur ve kaydet
                  </Button>
                </details>
              )}
            </aside>
          </div>
          <section className="birthday-preview">
            <div className="birthday-preview-heading">
              <div>
                <Eye size={22} />
                <h2>Güvenli önizleme</h2>
              </div>
              <span>Bu bölüm gerçek bahçe kaydına dokunmaz.</span>
            </div>
            <div
              className="birthday-preview-modes"
              role="group"
              aria-label="Önizleme zamanı"
            >
              {[
                ["before", "Doğum günü öncesi"],
                ["day", "Doğum günü"],
                ["after", "Doğum günü sonrası"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  aria-pressed={phase === id}
                  onClick={() => {
                    setPhase(id as typeof phase);
                    setOpened(id === "after");
                  }}
                >
                  {label}
                </button>
              ))}
              <button onClick={() => setOpened(false)}>
                Kutuyu yeniden dene
              </button>
            </div>
            {!validDraft(draft) ? (
              <p className="birthday-notice">
                Önizleme için önce geçerli bir etkinlik tarihi seç.
              </p>
            ) : phase === "before" ? (
              <div className="birthday-preview-before">
                {draft.showCountdown
                  ? "✿ Bahçede küçük bir sürpriz hazırlanıyor…"
                  : "Geri sayım kapalı: alıcıya henüz hiçbir doğum günü içeriği gösterilmez."}
                <p>
                  Mektup, kişisel adlar ve hediyeler halka açık API yanıtına
                  dahil edilmez.
                </p>
              </div>
            ) : (
              <BirthdayExperience
                event={preview}
                opened={opened}
                onOpen={() => setOpened(true)}
                preview
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}
