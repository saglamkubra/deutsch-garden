"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import {
  startAccount,
  useAccount,
  signOutAccount,
  exportDeviceData,
} from "@/lib/account/sync";
import { accountError } from "@/lib/account/errors";
import { Button } from "@/components/ui/button";
export function AccountBoundary({ children }: { children: ReactNode }) {
  const account = useAccount();
  const [error, setError] = useState("");
  useEffect(() => {
    void startAccount();
  }, []);
  if (!account.ready)
    return (
      <div className="account-loading" role="status">
        <span className="account-flower" aria-hidden="true">
          🌷
        </span>
        <h1>Bahçene hoş geldin</h1>
        <p>{account.message}</p>
        {account.status === "error" && (
          <div className="account-actions">
            <Button onClick={() => location.reload()}>
              <RefreshCw size={16} />
              Yeniden dene
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                void signOutAccount().catch((e) => setError(accountError(e)));
              }}
            >
              Çıkış yap
            </Button>
            <Button variant="outline" onClick={exportDeviceData}>
              Cihaz yedeğimi indir
            </Button>
          </div>
        )}
        {error && <p role="alert">{error}</p>}
      </div>
    );
  return <>{children}</>;
}
export function AccountStatus() {
  const a = useAccount();
  return (
    <Link
      href="/profilim"
      className={`account-sync-strip status-${a.status}`}
      aria-live="polite"
    >
      {a.status === "saved" ? <Cloud size={15} /> : <CloudOff size={15} />}
      <span>{a.message}</span>
      <strong>{a.user ? "Hesabım" : "Profilim"} →</strong>
    </Link>
  );
}
