"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, LockKeyhole, Flower2, ShieldCheck } from "lucide-react";
import { useAccount } from "@/lib/account/sync";
import { accountClient } from "@/lib/account/client";
import { accountError } from "@/lib/account/errors";
import { Button } from "@/components/ui/button";
import { GardenIllustration } from "@/components/garden/illustration";
export function AuthForm({
  mode,
}: {
  mode: "login" | "register" | "reset" | "update" | "verify";
}) {
  const a = useAccount();
  const [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  const title = {
    login: "Bahçene yeniden hoş geldin",
    register: "Birlikte çiçek açalım",
    reset: "Yeni bir başlangıç",
    update: "Yeni parolanı belirle",
    verify: "E-postanı doğrula",
  }[mode];
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = new FormData(e.currentTarget),
      email = String(form.get("email") ?? "").trim(),
      password = String(form.get("password") ?? "");
    const c = accountClient();
    if (!c) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "login") {
        const r = await c.auth.signInWithPassword({ email, password });
        if (r.error) throw r.error;
        location.replace(new URL("/profilim", location.origin).href);
      } else if (mode === "register") {
        const r = await c.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: location.origin + "/hesap/dogrula" },
        });
        if (r.error) throw r.error;
        if (r.data.session)
          location.replace(new URL("/profilim", location.origin).href);
        else
          setNotice(
            "Kayıt isteğin alındı. E-posta doğrulaması açıksa gelen kutundaki bağlantıyı aç; ardından giriş yapabilirsin.",
          );
      } else if (mode === "reset") {
        const r = await c.auth.resetPasswordForEmail(email, {
          redirectTo: location.origin + "/hesap/sifre-guncelle",
        });
        if (r.error) throw r.error;
        setNotice(
          "Bu adresle bir hesap varsa parola yenileme bağlantısı gönderildi. Gelen kutunu ve istenmeyen postaları kontrol et. Bağlantıyı bu tarayıcıda aç.",
        );
      } else if (mode === "update") {
        const r = await c.auth.updateUser({ password });
        if (r.error) throw r.error;
        setNotice("Parolan güncellendi. Profiline dönebilirsin.");
      }
    } catch (e) {
      setError(accountError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-content">
      <section className="account-auth-shell">
        <div className="account-auth-art">
          <span className="eyebrow">
            <Flower2 size={16} />
            KÜÇÜK ADIMLAR, KALICI HATIRALAR
          </span>
          <h2>
            Bahçen seninle
            <br />
            her yere gelsin.
          </h2>
          <GardenIllustration />
          <p>
            Öğrendiğin kelimeler, büyüttüğün çiçekler ve biriktirdiğin güzel
            anlar… Hepsi kendi hesabında.
          </p>
          <span className="account-pill">
            <ShieldCheck size={16} />
            Yalnızca e-posta ve parola
          </span>
        </div>
        <div className="account-auth-form">
          <span className="account-flower" aria-hidden="true">
            🌸
          </span>
          <h1>{title}</h1>
          <p>Deutsch Garden · Almanca yolculuğun için sıcacık bir yer.</p>
          {!a.configured ? (
            <div className="account-notice" role="status">
              <strong>Hesaplar için kurulum gerekli</strong>
              <p>
                Supabase henüz bağlanmadı. Misafir olarak mevcut özellikleri
                kullanabilirsin; kayıtların bu tarayıcıda kalır.
              </p>
              <Link href="/profilim">Yerel profilime dön →</Link>
            </div>
          ) : mode === "verify" ? (
            <div className="account-notice">
              <p>
                {a.user
                  ? "E-posta bağlantın işlendi ve oturumun açık. Bahçene dönebilirsin."
                  : "Gelen kutundaki doğrulama bağlantısını bu tarayıcıda aç. Bağlantı süresi dolduysa yeniden kayıt isteği veya parola yenileme isteği gönderebilirsin."}
              </p>
              <Link href={a.user ? "/profilim" : "/giris"}>
                {a.user ? "Profilime dön" : "Giriş yap"} →
              </Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              {mode !== "update" && (
                <label>
                  <span>
                    <Mail size={16} />
                    E-posta adresin
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="ornek@eposta.com"
                  />
                </label>
              )}
              {mode !== "reset" && (
                <label>
                  <span>
                    <LockKeyhole size={16} />
                    {mode === "update" ? "Yeni parolan" : "Parolan"}
                  </span>
                  <input
                    type="password"
                    name="password"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    minLength={mode === "login" ? 1 : 10}
                    maxLength={1024}
                    required
                  />
                  <small>
                    {mode !== "login" && "En az 10 karakter kullan."}
                  </small>
                </label>
              )}
              {mode === "update" && !a.user && (
                <p className="account-notice">
                  Parola yenileme e-postasındaki bağlantıyı bu tarayıcıda açman
                  gerekiyor.
                </p>
              )}
              {error && (
                <p role="alert" className="account-error">
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className="account-notice">
                  {notice}
                </p>
              )}
              <Button
                disabled={busy || (mode === "update" && !a.user)}
                type="submit"
              >
                {busy
                  ? "Biraz bekle…"
                  : {
                      login: "Giriş yap",
                      register: "Bahçeme katıl",
                      reset: "Yenileme bağlantısı gönder",
                      update: "Parolamı güncelle",
                    }[mode]}
              </Button>
              {mode === "login" && (
                <Link href="/hesap/sifre-sifirla">Parolamı unuttum</Link>
              )}
            </form>
          )}
          <nav className="account-auth-links" aria-label="Hesap bağlantıları">
            <Link href="/giris">Giriş yap</Link>
            <Link href="/kayit">Hesap oluştur</Link>
            <Link href="/profilim">Profilim</Link>
          </nav>
          <small className="account-privacy-copy">
            Hesap açmadan da öğrenebilirsin. Yerel ilerlemen iznin olmadan
            hesabına aktarılmaz.
          </small>
        </div>
      </section>
    </div>
  );
}
