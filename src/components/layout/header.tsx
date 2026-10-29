"use client";
import { useGamification, summary } from "@/lib/gamification/store";
import { useAccount } from "@/lib/account/sync";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Flame, Sparkles, ChevronDown, Flower2 } from "lucide-react";
import { Logo } from "./navigation";
export function Header() {
  const account = useAccount();
  const game = useGamification(
      !["/hediye-atolyesi", "/dogum-gunu"].includes(usePathname()),
    ),
    stats = summary(game);
  return (
    <header className="top-header">
      <div className="mobile-brand">
        <Logo />
      </div>
      <Link
        href="/"
        className="header-breadcrumb"
        aria-label="Deutsch Garden ana sayfa"
      >
        <Flower2 size={17} />
        <strong>Deutsch Garden</strong>
      </Link>
      <div className="header-actions">
        <span className="header-demo">
          {game.ready ? stats.level.title : "Bahçene hoş geldin"}
        </span>
        <div
          className="stat-pill xp"
          aria-label={
            game.ready
              ? `Toplam deneyim puanı: ${stats.xp} XP`
              : "Deneyim puanı hazırlanıyor"
          }
        >
          <Sparkles size={17} />
          <strong>
            {game.ready ? stats.xp : "—"} <span>XP</span>
          </strong>
        </div>
        <div
          className="stat-pill streak"
          aria-label={
            game.ready
              ? `Öğrenme serisi: ${stats.streak.current} gün`
              : "Öğrenme serisi hazırlanıyor"
          }
        >
          <Flame size={18} />
          <strong>
            {game.ready ? stats.streak.current : "—"} <span>gün</span>
          </strong>
        </div>
        <span className="header-divider" />
        <Link
          href="/profilim"
          className="profile-link"
          aria-label="Profilim ve hesap ayarlarım"
        >
          <span className="avatar" aria-hidden="true">
            🌷
          </span>
          <span className="profile-text">
            {account.user ? "Hesabım" : "Bahçıvanım"}
            <small>{account.user ? "Bulut hesabım" : "Misafir profilim"}</small>
          </span>
          <ChevronDown size={15} />
        </Link>
      </div>
    </header>
  );
}
