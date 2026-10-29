import test from "node:test";
import assert from "node:assert/strict";
import {
  initialDiary,
  newDraft,
  entryFromDraft,
  editDraft,
  putGuest,
  removeGuest,
  filterDiary,
  wordCount,
  validDiary,
} from "./model.ts";
import { readDiary, writeDiary } from "./storage.ts";
import { entryFromRow, diaryRemote } from "./remote.ts";
import { createClient } from "@supabase/supabase-js";
const id = "11111111-1111-4111-8111-111111111111";
const entry = () =>
  entryFromDraft(
    {
      ...newDraft(id),
      title: "Schöner Tag",
      content: "Heute bin ich glücklich.",
    },
    Date.UTC(2026, 9, 29),
  );
function disk() {
  const values = new Map<string, string>();
  return {
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      values.set(k, v);
    },
  };
}
test("taslak ve misafir geçmişi yeniden yüklemede korunur", () => {
  const d = disk();
  const r = {
    ...initialDiary(),
    revision: 1,
    draft: { ...newDraft(id), content: "Mein Tag" },
  };
  writeDiary(d, "guest", r, 0);
  assert.deepEqual(readDiary(d, "guest"), r);
  const saved = putGuest(r, entry(), null);
  writeDiary(d, "guest", saved, 1);
  assert.equal(readDiary(d, "guest").entries.length, 1);
  assert.equal(readDiary(d, "guest").draft, null);
});
test("aynı kimlik iki kez eklenmez ve eski sürüm üzerine yazılmaz", () => {
  const r = putGuest(initialDiary(), entry(), null);
  assert.throws(() => putGuest(r, entry(), null));
  const updated = entryFromDraft(
    { ...editDraft(entry()), content: "Ein neuer Text." },
    0,
  );
  assert.ok(updated.updatedAt > entry().updatedAt);
  assert.equal(putGuest(r, updated, entry().updatedAt).entries.length, 1);
  assert.throws(() =>
    removeGuest(putGuest(r, updated, entry().updatedAt), entry()),
  );
});
test("silme yalnızca seçilen yazıyı kaldırır ve tekrar güvenlidir", () => {
  const r = putGuest(initialDiary(), entry(), null);
  const cleared = removeGuest(r, entry());
  assert.equal(cleared.entries.length, 0);
  assert.deepEqual(removeGuest(cleared, entry()), cleared);
});
test("arama Almanca harfleri ve ay filtresini destekler", () => {
  assert.equal(filterDiary([entry()], "schoner", "2026-10").length, 1);
  assert.equal(filterDiary([entry()], "", "2026-09").length, 0);
  assert.equal(wordCount("Grüße! Ich lerne Deutsch."), 4);
});
test("bozuk veya ileri sürümlü veri asla üzerine yazılmaz", () => {
  const d = disk();
  d.setItem("x", '{"version":9}');
  assert.throws(() => readDiary(d, "x"));
  assert.throws(() => writeDiary(d, "x", initialDiary(), 0));
  assert.equal(d.getItem("x"), '{"version":9}');
  assert.equal(
    validDiary({ ...initialDiary(), entries: [entry(), entry()] }),
    false,
  );
});
test("farklı hesaplar ayrılır ve sekmelerde eski revizyon reddedilir", () => {
  const d = disk();
  writeDiary(
    d,
    "A",
    { ...initialDiary(), revision: 1, draft: newDraft(id) },
    0,
  );
  assert.equal(readDiary(d, "B").draft, null);
  assert.throws(() => writeDiary(d, "A", initialDiary(), 0));
});
test("disk kotası hatası mevcut kayıtları değiştirmez", () => {
  const d = {
    getItem: () => null,
    setItem: () => {
      throw Error("quota");
    },
  };
  assert.throws(() => writeDiary(d, "x", initialDiary(), 0), /quota/);
});
test("geçersiz ve boş metin kaydedilemez", () => {
  assert.throws(() => entryFromDraft(newDraft(id), Date.now()));
  assert.throws(() =>
    entryFromDraft({ ...newDraft(id), content: "a".repeat(20001) }, Date.now()),
  );
});
test("bulut yanıtı sahipliği ve metni doğrulanır", () => {
  const e = entry();
  const row = {
    id,
    user_id: "A",
    title: e.title,
    content: e.content,
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  };
  assert.deepEqual(entryFromRow(row, "A"), e);
  assert.throws(() => entryFromRow(row, "B"));
  assert.throws(() => entryFromRow({ ...row, content: null }, "A"));
});
test("oturum sahibi değişince hiçbir veritabanı isteği gönderilmez", async () => {
  let queries = 0;
  const client = {
    auth: {
      getSession: async () => ({
        data: { session: { user: { id: "B" } } },
        error: null,
      }),
    },
    from: () => {
      queries++;
      throw Error("unexpected");
    },
  };
  const remote = diaryRemote(client as never, "A", () => true);
  await assert.rejects(remote.save(entry(), null));
  await assert.rejects(remote.list());
  await assert.rejects(remote.remove(entry()));
  assert.equal(queries, 0);
});

test("gerçek SDK taşıması: filtreler, kayıp yanıt tekrarı, çakışma ve bağlantı hatası", async () => {
  const e = entry();
  const rows = new Map<string, Record<string, unknown>>();
  let fail = false;
  const requests: { method: string; url: URL }[] = [];
  const client = createClient(
    "https://example.supabase.co",
    "test-publishable",
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: async (input, init) => {
          if (fail) throw Error("network unavailable");
          const url = new URL(String(input));
          const method = init?.method ?? "GET";
          requests.push({ method, url });
          assert.equal(url.pathname, "/rest/v1/diary_entries");
          if (method === "POST") {
            const row = JSON.parse(String(init?.body));
            if (rows.has(row.id))
              return new Response(
                JSON.stringify({ code: "23505", message: "duplicate" }),
                { status: 409 },
              );
            rows.set(row.id, row);
            return Response.json(row);
          }
          assert.equal(url.searchParams.get("user_id"), "eq.A");
          const target = url.searchParams.get("id")?.slice(3);
          const row = target ? rows.get(target) : undefined;
          if (method === "PATCH") {
            if (
              !row ||
              url.searchParams.get("updated_at") !== "eq." + row.updated_at
            )
              return Response.json(null);
            const changed = { ...row, ...JSON.parse(String(init?.body)) };
            rows.set(target!, changed);
            return Response.json(changed);
          }
          if (method === "DELETE") {
            if (
              row &&
              url.searchParams.get("updated_at") === "eq." + row.updated_at
            ) {
              rows.delete(target!);
              return Response.json([{ id: target }]);
            }
            return Response.json([]);
          }
          return Response.json(target ? (row ?? null) : [...rows.values()]);
        },
      },
    },
  );
  client.auth.getSession = async () =>
    ({ data: { session: { user: { id: "A" } } }, error: null }) as never;
  const r = diaryRemote(client, "A", () => true);
  assert.deepEqual(await r.save(e, null), e);
  assert.deepEqual(await r.save(e, null), e);
  assert.equal(rows.size, 1);
  assert.equal((await r.list()).length, 1);
  const changed = entryFromDraft(
    { ...editDraft(e), content: "Heute regnet es." },
    Date.now(),
  );
  await r.save(changed, e.updatedAt);
  await r.save(changed, e.updatedAt); // lost update acknowledgement
  await assert.rejects(
    r.save({ ...changed, content: "Konflikt." }, e.updatedAt),
  );
  await assert.rejects(r.remove(e));
  assert.equal(rows.size, 1);
  fail = true;
  await assert.rejects(
    r.save({ ...changed, content: "Offline." }, changed.updatedAt),
  );
  assert.equal(rows.size, 1);
  fail = false;
  await r.remove(changed);
  await r.remove(changed);
  assert.equal(rows.size, 0);
  assert.ok(requests.some((x) => x.method === "PATCH"));
});
