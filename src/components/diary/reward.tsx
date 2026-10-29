"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { accountClient } from "@/lib/account/client";
import { currentOwner } from "@/lib/account/storage";
import { deliverLearningXp } from "@/lib/exercises/store";
export function DiaryReward({
  entryId,
  owner,
}: {
  entryId: string;
  owner: string | null;
}) {
  const [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const lock = useRef(false);
  async function claim() {
    if (!owner || lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      const client = accountClient();
      if (!client || currentOwner() !== owner)
        throw Error("Önce hesabına giriş yap.");
      const r = await client.rpc("claim_diary_practice", { p_entry: entryId });
      if (r.error)
        throw Error(
          ["PGRST202", "42883"].includes(r.error.code)
            ? "Günlük ödülleri için 010_diary_practice SQL kurulumu gerekiyor."
            : r.error.message.includes("DIARY_TOO_SHORT")
              ? "Ödül için en az 20 kelime ve 80 karakter yazmalısın."
              : "Ödül doğrulanamadı. Kaydın korunuyor; yeniden deneyebilirsin.",
        );
      if (currentOwner() !== owner) return;
      if (
        typeof r.data !== "string" ||
        !/^diary:day:\d{4}-\d{2}-\d{2}$/.test(r.data)
      )
        throw Error("Ödül yanıtı doğrulanamadı.");
      if (!(await deliverLearningXp(r.data, 15, owner)))
        throw Error(
          "XP cihazda kaydedilemedi; aynı ödülü tekrar deneyebilirsin.",
        );
      setNotice(
        "15 XP kaydedildi. Günde bir hak; tekrar basmak ek ödül vermez. Bulut kayıt durumunu üstten kontrol et.",
      );
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <div>
      <Button
        variant="outline"
        disabled={!owner || busy}
        onClick={() => void claim()}
      >
        {busy ? "Doğrulanıyor…" : "Günlük çalışmamın ödülünü al · 15 XP"}
      </Button>
      <p role="status">
        {notice ||
          (!owner
            ? "Günlük ödülü için hesabına giriş yapıp yazını buluta kaydet."
            : "En az 20 kelime ve 80 karakterlik kayıtlı yazı: Türkiye gününe göre günde bir ödül.")}
      </p>
    </div>
  );
}
