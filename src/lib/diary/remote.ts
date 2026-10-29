import type { SupabaseClient } from "@supabase/supabase-js";
import { validEntry, type DiaryEntry } from "./model.ts";

export interface DiaryRemote {
  list(): Promise<DiaryEntry[]>;
  save(entry: DiaryEntry, expected: string | null): Promise<DiaryEntry>;
  remove(entry: DiaryEntry): Promise<void>;
}
type Row = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};
const fields = "id,user_id,title,content,created_at,updated_at";
const conflict = () =>
  new Error(
    "Buluttaki yazı değişmiş veya silinmiş. Taslağın korunuyor; listeyi yeniden yükleyip iki sürümü karşılaştır.",
  );
export function entryFromRow(row: unknown, owner: string): DiaryEntry {
  const r = row as Row;
  if (!r || r.user_id !== owner)
    throw Error("Günlük kaydının sahibi doğrulanamadı.");
  const e = {
    id: r.id,
    title: r.title,
    content: r.content,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
  if (!validEntry(e))
    throw Error("Buluttaki günlük kaydı doğrulanamadı; veri değiştirilmedi.");
  return e;
}
export function diaryRemote(
  client: SupabaseClient,
  owner: string,
  active: () => boolean,
): DiaryRemote {
  async function authorized() {
    if (!active()) throw Error("Hesap değişti; önceki yazı gönderilmedi.");
    const { data, error } = await client.auth.getSession();
    if (error || data.session?.user.id !== owner || !active())
      throw Error("Günlük için hesabına yeniden giriş yap.");
  }
  async function get(id: string) {
    const r = await client
      .from("diary_entries")
      .select(fields)
      .eq("user_id", owner)
      .eq("id", id)
      .maybeSingle();
    if (r.error)
      throw Error(
        "Bulut kaydı kontrol edilemedi. Taslağın korunuyor; bağlantını kontrol edip yeniden dene.",
      );
    return r.data ? entryFromRow(r.data, owner) : null;
  }
  return {
    async list() {
      await authorized();
      const rows: DiaryEntry[] = [];
      for (let offset = 0; offset <= 5000; offset += 100) {
        const r = await client
          .from("diary_entries")
          .select(fields)
          .eq("user_id", owner)
          .order("created_at", { ascending: false })
          .order("id")
          .range(offset, offset + 99);
        if (r.error)
          throw Error(
            "Günlüklerin yüklenemedi. Bağlantını ve Supabase hesap kurulumunu kontrol edip yeniden dene.",
          );
        if (!active()) throw Error("Hesap değişti.");
        for (const row of r.data ?? []) rows.push(entryFromRow(row, owner));
        if ((r.data?.length ?? 0) < 100) return rows;
      }
      throw Error(
        "Çok sayıda günlük kaydı var; tam listeyi Profilim üzerinden dışa aktar. Kayıtlar değiştirilmedi.",
      );
    },
    async save(entry, expected) {
      await authorized();
      if (!validEntry(entry)) throw Error("Yazı doğrulanamadı; gönderilmedi.");
      if (expected === null) {
        const r = await client
          .from("diary_entries")
          .insert({
            id: entry.id,
            user_id: owner,
            title: entry.title,
            content: entry.content,
            created_at: entry.createdAt,
            updated_at: entry.updatedAt,
          })
          .select(fields)
          .single();
        if (r.error && r.error.code !== "23505")
          throw Error(
            "Buluta kayıt doğrulanamadı. Taslağın cihazında korunuyor; aynı kaydı yeniden deneyebilirsin.",
          );
        const saved = r.data
          ? entryFromRow(r.data, owner)
          : await get(entry.id);
        if (
          !saved ||
          saved.title !== entry.title ||
          saved.content !== entry.content
        )
          throw conflict();
        return saved;
      }
      const r = await client
        .from("diary_entries")
        .update({
          title: entry.title,
          content: entry.content,
          updated_at: entry.updatedAt,
        })
        .eq("user_id", owner)
        .eq("id", entry.id)
        .eq("updated_at", expected)
        .select(fields)
        .maybeSingle();
      if (r.error)
        throw Error(
          "Değişiklik bulutta doğrulanamadı. Taslağın korunuyor; yeniden deneyebilirsin.",
        );
      const saved = r.data ? entryFromRow(r.data, owner) : await get(entry.id);
      // A lost acknowledgement can be retried safely; never overwrite a different remote version.
      if (
        !saved ||
        saved.title !== entry.title ||
        saved.content !== entry.content
      )
        throw conflict();
      return saved;
    },
    async remove(entry) {
      await authorized();
      const r = await client
        .from("diary_entries")
        .delete()
        .eq("user_id", owner)
        .eq("id", entry.id)
        .eq("updated_at", entry.updatedAt)
        .select("id");
      if (r.error)
        throw Error(
          "Silme bulutta doğrulanamadı. Yazıyı listeden kaldırmadık; yeniden kontrol et.",
        );
      if (!r.data?.length && (await get(entry.id))) throw conflict();
    },
  };
}
