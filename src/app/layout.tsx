import "@fontsource/nunito/latin-ext-400.css";
import "@fontsource/nunito/latin-ext-600.css";
import "@fontsource/nunito/latin-ext-700.css";
import "@fontsource/nunito/latin-ext-800.css";
import "@fontsource/nunito/latin-400.css";
import "@fontsource/nunito/latin-600.css";
import "@fontsource/nunito/latin-700.css";
import "@fontsource/nunito/latin-800.css";
import { ReminderRunner } from "@/components/pwa/reminders";
import { PwaRegistration } from "@/components/pwa/pwa";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./birthday.css";
import "./account.css";
import "./gamification.css";
import "./birthday-welcome.css";
import "./final-polish.css";
import { BirthdayWelcomeLayer } from "@/components/birthday/welcome";
import { GameCelebration } from "@/components/gamification/dashboard";
import { AccountBoundary, AccountStatus } from "@/components/account/boundary";
import { BirthdayEntrance } from "@/components/birthday/entrance";
import { Sidebar, MobileNavigation } from "@/components/layout/navigation";
import { Header } from "@/components/layout/header";
import {
  AnimatedDecorations,
  MotionProvider,
} from "@/components/garden/animated";
export const viewport: Viewport = { themeColor: "#B8A4F4" };
export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Deutsch Garden",
  },
  icons: { apple: "/icons/apple-touch-icon.png" },
  title: {
    default: "Deutsch Garden · Almanca ile çiçek aç",
    template: "%s · Deutsch Garden",
  },
  description:
    "Küçük adımlar, rengârenk keşifler. Sevgiyle hazırlanmış Almanca öğrenme bahçen.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <PwaRegistration />
        <MotionProvider>
          <AccountBoundary>
            <ReminderRunner />
            <a className="skip-link" href="#ana-icerik">
              İçeriğe geç
            </a>
            <Sidebar />
            <div className="app-shell">
              <Header />
              <AccountStatus />
              <main id="ana-icerik" tabIndex={-1}>
                <AnimatedDecorations />
                <BirthdayWelcomeLayer />
                <BirthdayEntrance />
                <GameCelebration />
                {children}
              </main>
              <footer className="site-footer">
                <span>Bir kelime, bir tohum. Birlikte büyüyoruz.</span>
                <span>
                  Deutsch Garden <span aria-hidden="true">✿</span> Sevgiyle
                  büyür.
                </span>
              </footer>
            </div>
            <MobileNavigation />
          </AccountBoundary>
        </MotionProvider>
      </body>
    </html>
  );
}
