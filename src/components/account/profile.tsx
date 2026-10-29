"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Cloud,
  Download,
  LogOut,
  ShieldCheck,
  Sprout,
  RefreshCw,
  Heart,
} from "lucide-react";
import { PushSettings } from "@/components/pwa/push-settings";
import { LearningReminders } from "@/components/pwa/reminders";
import { PageHeading, ColorCard } from "@/components/garden/primitives";
import { Button } from "@/components/ui/button";
import { useLearning, selectLevel, selectGoal } from "@/lib/learning/store";
import { allPlots } from "@/lib/garden/worlds";
import { useGarden, gardenAction } from "@/lib/garden/store";
import { LEVELS, type Level } from "@/lib/learning/types";
import { progressStorage, keyFor } from "@/lib/account/storage";
import {
  validPreferences,
  defaultPreferences,
  type Preferences,
} from "@/lib/account/snapshot";
import {
  useAccount,
  saveCloud,
  checkCloud,
  chooseSnapshot,
  signOutAccount,
  exportAccountData,
  exportDeviceData,
  deletePrivateContent,
  downloadData,
} from "@/lib/account/sync";
import { accountClient, publicConfiguration } from "@/lib/account/client";
import { accountError } from "@/lib/account/errors";
import { InstallGarden } from "@/components/pwa/pwa";
import { BirthdayWelcomeProfile } from "@/components/birthday/welcome";
function readPreferences() {
  try {
    const p = JSON.parse(
      progressStorage().getItem(keyFor("preferences")) ?? "null",
    );
    return validPreferences(p) ? p : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}
function ProfileEditor({
  level,
  goal,
  muted,
}: {
  level: Level;
  goal: number;
  muted: boolean;
}) {
  const [prefs, setPrefs] = useState<Preferences>(readPreferences),
    [notice, setNotice] = useState("");
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice("");
    const form = new FormData(e.currentTarget);
    try {
      const next: Preferences = {
        displayName: String(form.get("displayName")).trim(),
        learningGoal: String(form.get("learningGoal")).trim(),
        notifications: form.get("notifications") === "on",
        sound: form.get("sound") === "on",
      };
      if (!validPreferences(next))
        throw new Error("Profil alanlarını kontrol et.");
      if (
        !selectLevel(String(form.get("level")) as Level) ||
        !selectGoal(Number(form.get("goal")))
      )
        throw new Error(
          "Öğrenme tercihlerin kaydedilemedi. Tarayıcı depolamasını kontrol et.",
        );
      await gardenAction({ type: "mute", value: !next.sound });
      progressStorage().setItem(keyFor("preferences"), JSON.stringify(next));
      setPrefs(next);
      setNotice(
        "Tercihlerin cihazına kaydedildi. Giriş yaptıysan bulut durumu yukarıda görünür.",
      );
    } catch {
      setNotice(
        "Tercihlerin kaydedilemedi. Depolama alanını kontrol edip yeniden dene.",
      );
    }
  }
  return (
    <ColorCard tone="white" className="account-card">
      <div className="account-section-title">
        <span className="account-icon mint">
          <Sprout />
        </span>
        <div>
          <h2>Kendi ritminde büyü</h2>
          <p>Öğrenme tercihlerin</p>
        </div>
      </div>
      <form className="account-profile-form" onSubmit={save}>
        <label>
          Görünen adın
          <input
            name="displayName"
            maxLength={80}
            defaultValue={prefs.displayName}
            placeholder="Bahçıvanım"
            autoComplete="nickname"
          />
          <small>İsteğe bağlı. Gerçek adını yazman gerekmez.</small>
        </label>
        <div className="account-two-fields">
          <label>
            Almanca düzeyin
            <select name="level" defaultValue={level}>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label>
            Günlük kelime hedefin
            <select name="goal" defaultValue={goal}>
              {[5, 10, 15, 20].map((n) => (
                <option value={n} key={n}>
                  {n} kelime
                </option>
              ))}
            </select>
          </label>
        </div>
        <small>
          Hedef değişikliği yarının listesine uygulanır; bugünün listesi
          korunur. Düzey seçimi bir yeterlik belgesi değildir.
        </small>
        <label>
          Öğrenme niyetin
          <textarea
            name="learningGoal"
            rows={3}
            maxLength={300}
            defaultValue={prefs.learningGoal}
            placeholder="Almanca günlük sohbetlerde daha rahat olmak istiyorum."
          />
        </label>
        <label className="account-check">
          <input
            type="checkbox"
            name="notifications"
            defaultChecked={prefs.notifications}
          />
          <span>
            Hatırlatma tercihim açık olsun
            <small>
              Hesap tercihin saklanır; cihaz bildirim iznini aşağıdaki
              hatırlatıcıdan ayrıca yönet.
            </small>
          </span>
        </label>
        <label className="account-check">
          <input type="checkbox" name="sound" defaultChecked={!muted} />
          <span>Bahçe sesleri açık olsun</span>
        </label>
        <Button type="submit">Tercihlerimi kaydet</Button>
        {notice && (
          <p role="status" className="account-notice">
            {notice}
          </p>
        )}
      </form>
    </ColorCard>
  );
}
export function ProfilePage() {
  const a = useAccount(),
    learning = useLearning(),
    garden = useGarden();
  const [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [confirmed, setConfirmed] = useState(false),
    [privacy, setPrivacy] = useState(""),
    [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState("");
  async function action(fn: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setNotice(accountError(e));
    } finally {
      setBusy(false);
    }
  }
  function exportRawGuest() {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (
        /^deutsch-garden:(garden|learning|exercises|grammar|listening|stories|mini-courses|lumi|vocabulary|preferences|diary):v1/.test(
          k,
        )
      )
        data[k] = localStorage.getItem(k)!;
    }
    downloadData(
      { version: 1, exportedAt: new Date().toISOString(), localGuest: data },
      "deutsch-garden-misafir-yedegi.json",
    );
  }
  async function removeAccount() {
    const c = accountClient();
    if (!c) return;
    const session = await c.auth.getSession();
    const r = await fetch("/api/account/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data.session?.access_token ?? ""}`,
      },
      body: JSON.stringify({ password, confirmation }),
    });
    const body = await r.json();
    if (!r.ok) {
      setNotice(body.error);
      return;
    }
    await c.auth.signOut({ scope: "local" });
    location.replace(new URL("/giris", location.origin).href);
  }
  const needsChoice = a.status === "conflict" || a.status === "remote";
  return (
    <div className="page-content account-page">
      <PageHeading
        eyebrow="HER ÇİÇEĞİN KENDİ RİTMİ VAR"
        title="Profilim 🌷"
        description="Küçük hedeflerin, biriken emeğin ve sana ait bir bahçe."
      />
      <div className="account-hero">
        <span className="account-profile-avatar" aria-hidden="true">
          🌼
        </span>
        <div>
          <span className="account-pill">
            {a.user ? "Kendi hesabın" : "Misafir bahçıvan"}
          </span>
          <h2>
            {a.user
              ? "Bahçen artık seninle yolculuk edebilir."
              : "Burada büyüyen her şey kıymetli."}
          </h2>
          <p>
            {a.user
              ? "Eşitleme durumunu kontrol et; yerel kayıtların kendi hesabında tutulur."
              : "Misafir ilerlemen bu cihazda kalır. Hesap açınca aktarımı sen onaylarsın."}
          </p>
        </div>
        <Heart className="account-hero-heart" size={80} />
      </div>
      <div className="account-grid">
        <div className="account-column">
          {learning.ready && garden.ready ? (
            <ProfileEditor
              level={learning.state.level}
              goal={learning.state.goal}
              muted={garden.state.muted}
            />
          ) : (
            <p role="status">Tercihlerin yükleniyor…</p>
          )}
          <BirthdayWelcomeProfile />
          <PushSettings />
          <LearningReminders />
          <ColorCard tone="mint" className="account-card">
            <h2>Çevrimdışı ders çantam 🎒</h2>
            <p>
              Düzey paketlerini ve seçtiğin dersin seslerini internet varken
              indir; daha sonra bağlantısız tekrar et. AI ve bulut eşitlemesi
              internetsiz çalışmaz.
            </p>
            <Link href="/cevrimdisi.html">Ders paketlerini yönet →</Link>
          </ColorCard>
          <InstallGarden />
          <ColorCard tone="peach" className="account-card">
            <div className="account-section-title">
              <span className="account-icon peach">
                <ShieldCheck />
              </span>
              <div>
                <h2>Gizlilik senin elinde</h2>
                <p>Verilerin üzerinde söz sahibisin.</p>
              </div>
            </div>
            <p>
              Günlüklerin ve sohbetlerin başka kullanıcılara açılmaz. Günlükler
              Lumi’ye kendiliğinden gönderilmez.
            </p>
            <p>
              Misafir günlüklerini Almanca Günlüğüm sayfasından ayrıca
              onaylayarak aktarabilirsin. Genel ilerleme aktarımı günlük
              yazılarını göndermez.
            </p>
            <div className="account-actions">
              <Button
                disabled={busy}
                variant="outline"
                onClick={() => {
                  void action(exportAccountData);
                }}
              >
                <Download size={16} />
                Verilerimi dışa aktar
              </Button>
              <Button
                variant="outline"
                disabled={busy}
                onClick={exportDeviceData}
              >
                Cihaz yedeğimi indir
              </Button>
              <Button variant="ghost" onClick={exportRawGuest}>
                Misafir kaydının yedeğini indir
              </Button>
            </div>
            <small>
              JSON yedeği kişisel içerik barındırabilir; güvenli bir yerde
              sakla. Bu cihazdaki hesap önbelleği çıkıştan sonra da korunur.
              Ortak cihazlarda kendi tarayıcı profilini kullan.
            </small>
            {a.user && (
              <>
                <label className="account-check">
                  <input
                    type="checkbox"
                    checked={privacy === "yes"}
                    onChange={(e) => setPrivacy(e.target.checked ? "yes" : "")}
                  />
                  <span>
                    Seçtiğim özel içerikleri kalıcı olarak silmek istediğimi
                    onaylıyorum.
                  </span>
                </label>
                <div className="account-actions">
                  <Button
                    variant="outline"
                    disabled={busy || privacy !== "yes"}
                    onClick={() => {
                      void action(() => deletePrivateContent("conversations"));
                    }}
                  >
                    Sohbet geçmişimi sil
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy || privacy !== "yes"}
                    onClick={() => {
                      void action(async () => {
                        await deletePrivateContent("diary");
                        setNotice("Buluttaki günlük kayıtların silindi.");
                      });
                    }}
                  >
                    Günlük kayıtlarımı sil
                  </Button>
                </div>
                <small>
                  Silme işlemi bu hesabın bulut yedeklerindeki sohbetleri de
                  temizler. Misafir kaydı ve daha önce indirdiğin dosyalar ayrı
                  kalır. Başka cihazdaki açık oturumlarda eski önbellek için
                  yeniden yükleme gerekir.
                </small>
              </>
            )}
          </ColorCard>
        </div>
        <div className="account-column">
          <ColorCard tone="lavender" className="account-card">
            <div className="account-section-title">
              <span className="account-icon lavender">
                <Cloud />
              </span>
              <div>
                <h2>Bahçemin bulut kaydı</h2>
                <p>
                  {a.user?.email ?? "Hesabınla cihazlar arasında devam et."}
                </p>
              </div>
            </div>
            <div
              className={`account-sync-box status-${a.status}`}
              role="status"
            >
              <strong>
                {a.user
                  ? `Bulut sürümü: ${a.revision}`
                  : a.configured
                    ? "Hesabına giriş yapabilirsin"
                    : "Supabase kurulumu gerekli"}
              </strong>
              <p>{a.message}</p>
            </div>
            {a.user ? (
              <>
                <div className="account-actions">
                  <Button
                    disabled={busy}
                    onClick={() => {
                      void action(saveCloud);
                    }}
                  >
                    <RefreshCw size={16} />
                    Yeniden eşitle
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => {
                      void action(checkCloud);
                    }}
                  >
                    Bulutu kontrol et
                  </Button>
                </div>
                <p className="account-small">
                  Değişiklikler yaklaşık 3 saniye sonra gönderilir. İnternet
                  yokken yalnızca bu cihazda saklanır; buluta kaydedildi
                  yazısını görmeden diğer cihazda hazır sayılmaz.
                </p>
                {(a.localImport || needsChoice) && (
                  <div className="account-migration">
                    <h3>
                      {needsChoice
                        ? "Hangi kaydı kullanmak istersin?"
                        : "Bu cihazda misafir ilerlemesi var"}
                    </h3>
                    <p>
                      Kayıtlar birleştirilmez. Seçtiğin kayıt etkin olur; mevcut
                      bulut kaydı arşive, hesap kaydı cihaz yedeğine alınır.
                      Para, envanter ve ödül kimlikleri birlikte taşınır.
                      Misafir kaydı silinmez.
                    </p>
                    <p>
                      <strong>Bu hesapta:</strong> {garden.state.coins} bahçe
                      parası · {garden.state.purchases?.length ?? 0} satın alma
                      · {allPlots(garden.state).filter((p) => p.plant).length}{" "}
                      ekili alan
                    </p>
                    <p className="account-small">
                      Aktarım; kelimeler, dersler, bahçe ve mevcut Lumi
                      sohbetleri dahil tüm yerel öğrenme modüllerini içerir.
                      Özel içerikleri buluta göndermeden önce bu seçimi kontrol
                      et.
                    </p>
                    <label className="account-check">
                      <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                      />
                      <span>
                        Etkin kaydın değişeceğini ve özel içeriklerin
                        aktarılacağını anladım; aktarımı onaylıyorum.
                      </span>
                    </label>
                    <div className="account-actions">
                      {a.localImport && (
                        <Button
                          disabled={!confirmed || busy}
                          onClick={() => {
                            void action(() => chooseSnapshot("guest"));
                          }}
                        >
                          Misafir ilerlememi aktar
                        </Button>
                      )}
                      {needsChoice && (
                        <>
                          <Button
                            disabled={!confirmed || busy}
                            onClick={() => {
                              void action(() => chooseSnapshot("cloud"));
                            }}
                          >
                            Buluttaki kaydı yükle
                          </Button>
                          <Button
                            variant="outline"
                            disabled={!confirmed || busy}
                            onClick={() => {
                              void action(() => chooseSnapshot("device"));
                            }}
                          >
                            Bu hesapta cihaz kaydını kullan
                          </Button>
                        </>
                      )}
                    </div>
                    <small>
                      Yarım kalan aktarım için “Yeniden eşitle” aynı işlemi
                      tekrar dener. Önce yedek indirmek her zaman mümkün.
                    </small>
                  </div>
                )}
                <Button
                  variant="ghost"
                  disabled={busy}
                  onClick={() => {
                    void action(signOutAccount);
                  }}
                >
                  <LogOut size={16} />
                  Çıkış yap
                </Button>
              </>
            ) : (
              <>
                <p>
                  {a.configured
                    ? "E-posta ve parolanla oturum aç. Aynı hesapla giriş yaptığın yeni cihazda bulut kaydın yüklenir."
                    : "Hesap hizmeti henüz bağlanmadı. Yerel özellikler çalışmaya devam eder; buluta kayıt yapılmıyor."}
                </p>
                <div className="account-actions">
                  <Button asChild>
                    <Link href="/giris">Giriş yap</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/kayit">Hesap oluştur</Link>
                  </Button>
                </div>
              </>
            )}
          </ColorCard>
          {a.user && (
            <ColorCard tone="pink" className="account-card">
              <h2>Hesap ayarları</h2>
              <p>
                Parolanı yenilemek için e-postana güvenli bir bağlantı
                gönderebilirsin.
              </p>
              <Button asChild variant="outline">
                <Link href="/hesap/sifre-sifirla">Parolamı yenile</Link>
              </Button>
              <details className="account-danger">
                <summary>Hesabımı kalıcı olarak sil</summary>
                <p>
                  Hesabın ve ilişkili bulut kayıtların kalıcı silinir. Önce
                  verilerini dışa aktar. Cihazdaki yerel yedekler otomatik
                  silinmez.
                </p>
                {publicConfiguration().deletionConfigured ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void action(removeAccount);
                    }}
                  >
                    <label>
                      Mevcut parolan
                      <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        maxLength={1024}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </label>
                    <label>
                      Onay için HESABIMI SİL yaz
                      <input
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        autoComplete="off"
                        required
                      />
                    </label>
                    <Button
                      disabled={busy || confirmation !== "HESABIMI SİL"}
                      type="submit"
                    >
                      Hesabımı ve bulut verilerimi sil
                    </Button>
                  </form>
                ) : (
                  <p className="account-notice">
                    Güvenli hesap silme için sunucuda yönetici anahtarı
                    kurulmalı. Kurulum belgesindeki hesap silme adımlarıyla
                    proje yöneticisi, kimliğini doğruladıktan sonra hesabını
                    silebilir.
                  </p>
                )}
              </details>
            </ColorCard>
          )}
        </div>
      </div>
      {notice && (
        <p className="account-notice" role="status">
          {notice}
        </p>
      )}
      <p className="account-bottom-note">
        🌱 Öğrenme ilerlemen bir yarış değil. Bugün attığın küçük adım yeter.
      </p>
    </div>
  );
}
