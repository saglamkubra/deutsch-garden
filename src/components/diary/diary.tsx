"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookHeart,
  Download,
  Flower2,
  LockKeyhole,
  RefreshCw,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { PageHeading } from "@/components/garden/primitives";
import { Button } from "@/components/ui/button";
import { useAccount, downloadData } from "@/lib/account/sync";
import { accountClient } from "@/lib/account/client";
import { currentOwner, physicalKey } from "@/lib/account/storage";
import {
  DIARY_KEY,
  DIARY_CLEARED,
  initialDiary,
  newDraft,
  editDraft,
  entryFromDraft,
  putGuest,
  removeGuest,
  filterDiary,
  wordCount,
  type DiaryRecord,
  type DiaryDraft,
  type DiaryEntry,
} from "@/lib/diary/model";
import { readDiary, writeDiary } from "@/lib/diary/storage";
import { DiaryReview } from "./review";
import { DiaryReward } from "./reward";
import { diaryRemote } from "@/lib/diary/remote";

const prompts = {
  A1: [
    "Bugününü 5 kısa cümleyle anlat. Saatleri ve sevdiğin bir şeyi ekle.",
    "Heute bin ich … Ich habe … Mein Tag ist …",
  ],
  A2: [
    "Dün yaptıklarını anlat. Önce, sonra ve sonunda ne oldu? Perfekt kullanmayı dene.",
    "Gestern habe ich … Danach bin ich … Zum Schluss …",
  ],
  B1: [
    "Seni mutlu eden bir anı anlat. Olayın neden önemli olduğunu ve nasıl hissettiğini açıkla.",
    "Als ich …, habe ich … Das war wichtig, weil …",
  ],
  B2: [
    "Günlük hayatında değiştirmek istediğin bir alışkanlığı tartış. Avantaj, zorluk ve somut bir çözüm sun.",
    "Einerseits … Andererseits … Deshalb habe ich vor, …",
  ],
  C1: [
    "Bir kararını farklı bakış açılarından değerlendir. Varsayımlarını sorgula ve nüanslı bir sonuca ulaş.",
    "Rückblickend lässt sich feststellen, dass … Allerdings …",
  ],
  C2: [
    "Bir anının zamanla değişen anlamını yaz. İmge, ton ve anlatıcı mesafesini bilinçli kullan.",
    "Was mir damals selbstverständlich erschien, …",
  ],
} as const;
export function Diary() {
  const [confirmation, setConfirmation] = useState<{
    text: string;
    resolve: (ok: boolean) => void;
  } | null>(null);
  function ask(text: string) {
    return new Promise<boolean>((resolve) =>
      setConfirmation({ text, resolve }),
    );
  }
  function answer(ok: boolean) {
    confirmation?.resolve(ok);
    setConfirmation(null);
  }
  const account = useAccount();
  const owner = account.user?.id ?? null;
  const [record, setRecord] = useState<DiaryRecord>(initialDiary);
  const ref = useRef(record);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [guest, setGuest] = useState<DiaryEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [protectedData, setProtected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("");
  const [level, setLevel] = useState<keyof typeof prompts>("A1");
  const [consent, setConsent] = useState(false);
  const [reviewChoice, setReviewChoice] = useState<{
    owner: string | null;
    id: string;
  } | null>(null);
  const reviewEntry =
    reviewChoice?.owner === owner
      ? entries.find((e) => e.id === reviewChoice.id)
      : undefined;
  const alive = useRef(false);
  const lock = useRef(false);
  const key = physicalKey(DIARY_KEY, owner);
  const active = () => alive.current && currentOwner() === owner;
  function remote() {
    const client = accountClient();
    if (!client || !owner) throw Error("Hesap bağlantısı hazır değil.");
    return diaryRemote(client, owner, active);
  }
  function local(next: DiaryRecord) {
    if (!active() || protectedData)
      throw Error("Günlük şu an yazmaya kapalı; metnini yedekleyebilirsin.");
    writeDiary(localStorage, key, next, ref.current.revision);
    ref.current = next;
    setRecord(next);
  }
  async function load() {
    if (owner) {
      const list = await remote().list();
      if (active()) setEntries(list);
    } else setEntries(ref.current.entries);
  }
  async function action(work: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (e) {
      if (active())
        setError(
          e instanceof Error
            ? e.message
            : "İşlem tamamlanamadı. Metnin korunuyor.",
        );
    } finally {
      lock.current = false;
      if (active()) setBusy(false);
    }
  }
  useEffect(() => {
    alive.current = true;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const r = readDiary(localStorage, key);
        ref.current = r;
        setRecord(r);
        setEntries(owner ? [] : r.entries);
        setProtected(false);
        if (owner) setGuest(readDiary(localStorage, DIARY_KEY).entries);
      } catch (e) {
        setProtected(true);
        setError((e as Error).message);
      }
      setReady(true);
      if (owner) {
        const client = accountClient();
        if (client)
          void diaryRemote(
            client,
            owner,
            () => alive.current && currentOwner() === owner,
          )
            .list()
            .then((list) => {
              if (!cancelled && currentOwner() === owner) setEntries(list);
            })
            .catch((e) => {
              if (!cancelled && currentOwner() === owner) setError(e.message);
            });
      }
    });
    const changed = (event: StorageEvent) => {
      if (event.key === key) {
        setProtected(true);
        setError(
          "Başka sekmede günlük değişti. Açık metnini yedekleyip sayfayı yenile.",
        );
      }
    };
    const cleared = () => {
      const r = initialDiary();
      ref.current = r;
      setRecord(r);
      setEntries([]);
      setMessage("Günlük kayıtları ve bu hesaptaki taslak temizlendi.");
    };
    window.addEventListener("storage", changed);
    window.addEventListener(DIARY_CLEARED, cleared);
    return () => {
      cancelled = true;
      alive.current = false;
      window.removeEventListener("storage", changed);
      window.removeEventListener(DIARY_CLEARED, cleared);
    };
  }, [key, owner]);
  function change(field: "title" | "content", value: string) {
    const d = ref.current.draft ?? newDraft(crypto.randomUUID());
    const next = {
      ...ref.current,
      revision: ref.current.revision + 1,
      draft: { ...d, [field]: value },
    };
    setRecord(next);
    try {
      local(next);
      setMessage(
        "Taslak bu cihazda saklandı; henüz günlük olarak kaydedilmedi.",
      );
      setError("");
    } catch (e) {
      setProtected(true);
      setError((e as Error).message);
    }
  }
  async function select(draft: DiaryDraft | null) {
    if (
      record.draft &&
      (record.draft.content || record.draft.title) &&
      !(await ask(
        "Açık taslak değiştirilecek. Önce yedek indirmediysen İptal’i seç. Devam edilsin mi?",
      ))
    )
      return;
    try {
      local({ ...ref.current, revision: ref.current.revision + 1, draft });
      setMessage(
        draft ? "Yazını düzenliyorsun." : "Yeni bir sayfa seni bekliyor.",
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const draft = record.draft;
  const results = filterDiary(entries, query, month);
  return (
    <div className="page-content diary-page">
      {confirmation && (
        <dialog
          className="diary-confirm"
          aria-labelledby="diary-confirm-title"
          aria-describedby="diary-confirm-text"
          ref={(el) => {
            if (el && !el.open) el.showModal();
          }}
          onCancel={(e) => {
            e.preventDefault();
            answer(false);
          }}
        >
          <h2 id="diary-confirm-title">Devam etmek istiyor musun?</h2>
          <p id="diary-confirm-text">{confirmation.text}</p>
          <div>
            <Button variant="outline" onClick={() => answer(false)}>
              İptal
            </Button>
            <Button onClick={() => answer(true)}>Onaylıyorum</Button>
          </div>
        </dialog>
      )}
      <PageHeading
        eyebrow="KELİMELERDEN HATIRALARA"
        title="Almanca Günlüğüm 🌷"
        description="Küçük bir anı seç, kendi Almanca cümlelerinle anlat. Kusursuz olmak zorunda değilsin."
      />
      <div className="diary-banner">
        <BookHeart size={36} />
        <div>
          <strong>Bugünün bir cümlesi, yarının güzel bir hatırası.</strong>
          <p>
            <LockKeyhole size={14} />{" "}
            {owner
              ? "Kaydettiğin yazılar özel hesabında tutulur. Taslak yalnızca bu cihazdadır."
              : "Misafir yazıları yalnızca bu tarayıcıda saklanır."}{" "}
            Hiçbir yazı Lumi’ye kendiliğinden gönderilmez.
          </p>
          {!owner && (
            <Link href="/giris">
              Cihazlar arasında kullanmak için giriş yap →
            </Link>
          )}
        </div>
      </div>
      <div className="diary-toolbar">
        <Button
          onClick={() => select(null)}
          disabled={!ready || busy || protectedData}
        >
          <Plus size={16} />
          Yeni sayfa
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            downloadData(
              {
                version: 1,
                entries,
                draft: record.draft,
                raw: protectedData ? localStorage.getItem(key) : undefined,
              },
              "almanca-gunlugum.json",
            )
          }
        >
          <Download size={16} />
          Yedeği indir
        </Button>
        <Button
          variant="outline"
          disabled={busy || !ready}
          onClick={() => void action(load)}
        >
          <RefreshCw size={16} />
          Listeyi yenile
        </Button>
      </div>
      {error && (
        <p className="diary-error" role="alert">
          {error} Yazını kopyalayabilir veya yedek indirebilirsin.
        </p>
      )}
      <p className="diary-status" role="status">
        {busy
          ? "İşlem sürüyor…"
          : message ||
            (!ready
              ? "Günlüğün hazırlanıyor…"
              : "Yeni bir sayfa açmaya hazırız.")}
      </p>
      <div className="diary-grid">
        <section className="diary-paper" aria-label="Günlük yazma alanı">
          <span className="diary-date">
            {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(
              new Date(),
            )}{" "}
            · Sana ait bir sayfa
          </span>
          <label htmlFor="diary-title">
            Yazının başlığı <small>(isteğe bağlı)</small>
          </label>
          <input
            id="diary-title"
            maxLength={200}
            value={draft?.title ?? ""}
            disabled={!ready || busy || protectedData}
            onChange={(e) => change("title", e.target.value)}
            placeholder="Küçük bir mutluluk…"
          />
          <label htmlFor="diary-body">Almanca yazın</label>
          <textarea
            id="diary-body"
            lang="de"
            spellCheck
            maxLength={20000}
            value={draft?.content ?? ""}
            disabled={!ready || busy || protectedData}
            onChange={(e) => change("content", e.target.value)}
            placeholder="Liebes Tagebuch, heute …"
          />
          <div className="diary-counter">
            <span>{wordCount(draft?.content ?? "")} kelime</span>
            <span>{draft?.content.length ?? 0} / 20.000 karakter</span>
          </div>
          <Button
            disabled={busy || !ready || protectedData || !draft?.content.trim()}
            onClick={() =>
              void action(async () => {
                const d = record.draft;
                if (!d) return;
                const entry = entryFromDraft(d, Date.now());
                if (owner) {
                  const saved = await remote().save(entry, d.baseUpdatedAt);
                  if (!active()) return;
                  setEntries((list) => [
                    saved,
                    ...list.filter((e) => e.id !== saved.id),
                  ]);
                  local({
                    ...ref.current,
                    entries: [],
                    draft: null,
                    revision: ref.current.revision + 1,
                  });
                  setMessage(
                    "Yazın buluta kaydedildi ve kayıt yanıtı doğrulandı.",
                  );
                } else {
                  const next = putGuest(ref.current, entry, d.baseUpdatedAt);
                  local(next);
                  setEntries(next.entries);
                  setMessage("Yazın bu tarayıcıya kaydedildi.");
                }
              })
            }
          >
            <Save size={17} />
            {draft?.baseUpdatedAt ? "Değişiklikleri kaydet" : "Günlüğü kaydet"}
          </Button>
        </section>
        <aside className="diary-coach">
          <Flower2 size={40} />
          <h2>Birlikte yazalım</h2>
          <label htmlFor="diary-level">Yazma önerisinin düzeyi</label>
          <select
            id="diary-level"
            value={level}
            onChange={(e) => setLevel(e.target.value as keyof typeof prompts)}
          >
            {Object.keys(prompts).map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <h3>Bugünün yazma fikri</h3>
          <p>{prompts[level][0]}</p>
          <blockquote lang="de">{prompts[level][1]}</blockquote>
          <h3>Bitirince kendine sor</h3>
          <ul>
            <li>İsimleri büyük harfle yazdım mı?</li>
            <li>Fiilin yeri ve özneyle uyumu doğru mu?</li>
            <li>Zaman ifadelerim birbiriyle uyumlu mu?</li>
            <li>En az bir yeni kelime kullandım mı?</li>
          </ul>
          <p className="diary-note">
            Bunlar öz değerlendirme ipuçlarıdır. AI incelemesi yalnızca onayınla
            çalışır. Kayıtlı yazın için günlük çalışma ödülünü ayrıca
            alabilirsin.
          </p>
        </aside>
      </div>
      <div id="diary-review" tabIndex={-1}>
        {reviewEntry && (
          <Button variant="outline" onClick={() => setReviewChoice(null)}>
            Açık taslağı incelemeye dön
          </Button>
        )}
        <DiaryReview
          key={`${owner}:${reviewEntry ? reviewEntry.id + ":" + reviewEntry.updatedAt : record.revision}:${level}`}
          text={reviewEntry?.content ?? record.draft?.content ?? ""}
          level={level}
          label={
            reviewEntry
              ? reviewEntry.title || "Kaydedilmiş yazı"
              : "Açık taslak"
          }
        />
      </div>
      {owner && guest.length > 0 && (
        <section className="diary-import">
          <h2>Bu cihazda {guest.length} misafir yazın var</h2>
          <p>
            Yalnızca kaydedilmiş misafir yazıları hesabına kopyalanır. Açık
            misafir taslağı gönderilmez; yerel kaynak silinmez. Farklı bulut
            sürümlerinin üzerine yazılmaz.
          </p>
          <label>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />{" "}
            Özel günlük yazılarımı hesabıma aktarmayı onaylıyorum.
          </label>
          <Button
            disabled={!consent || busy}
            onClick={() =>
              void action(async () => {
                for (const e of guest) {
                  await remote().save(e, null);
                  if (!active()) return;
                }
                await load();
                setMessage(
                  "Misafir yazıları bulutta doğrulandı. Yerel asılları korundu.",
                );
                setConsent(false);
              })
            }
          >
            Yazıları hesabıma kopyala
          </Button>
        </section>
      )}
      <section className="diary-history">
        <h2>
          Çiçeklenen sayfalarım <span>{entries.length} yazı</span>
        </h2>
        <div className="diary-filters">
          <label>
            Yazılarda ara
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Başlık veya kelime…"
            />
          </label>
          <label>
            Ay seç
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </label>
        </div>
        {!results.length ? (
          <div className="diary-empty">
            🌱
            <h3>
              {entries.length
                ? "Bu aramada yazı bulunamadı."
                : "İlk cümlenle küçük bir hatıra bırak."}
            </h3>
            <p>
              {entries.length
                ? "Arama veya ay filtresini değiştirebilirsin."
                : "Yukarıdaki sayfaya yazıp Günlüğü kaydet düğmesine bas."}
            </p>
          </div>
        ) : (
          <div className="diary-cards">
            {results.map((e) => (
              <article key={e.id}>
                <p className="diary-date">
                  {new Intl.DateTimeFormat("tr-TR", {
                    dateStyle: "medium",
                  }).format(new Date(e.createdAt))}{" "}
                  · {wordCount(e.content)} kelime
                </p>
                <h3>{e.title || "Başlıksız bir hatıra"}</h3>
                <p lang="de" className="diary-entry-text">
                  {e.content}
                </p>
                <DiaryReward entryId={e.id} owner={owner} />
                <div>
                  <Button
                    variant="outline"
                    disabled={busy || protectedData}
                    onClick={() => {
                      setReviewChoice({ owner, id: e.id });
                      requestAnimationFrame(() => {
                        const target = document.getElementById("diary-review");
                        target?.scrollIntoView({ block: "center" });
                        target?.focus({ preventScroll: true });
                      });
                    }}
                  >
                    Lumi ile incele
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy || protectedData}
                    onClick={() => select(editDraft(e))}
                  >
                    Aç / düzenle
                  </Button>
                  <Button
                    variant="outline"
                    aria-label={`${e.title || "Yazı"} kaydını sil`}
                    disabled={busy || protectedData}
                    onClick={async () => {
                      if (
                        !(await ask(
                          "Bu günlük yazısı kalıcı olarak silinsin mi? Önce yedeğini indirebilirsin.",
                        ))
                      )
                        return;
                      void action(async () => {
                        if (owner) {
                          await remote().remove(e);
                          if (active())
                            setEntries((list) =>
                              list.filter((x) => x.id !== e.id),
                            );
                          if (ref.current.draft?.id === e.id)
                            local({
                              ...ref.current,
                              draft: null,
                              revision: ref.current.revision + 1,
                            });
                        } else {
                          const next = removeGuest(ref.current, e);
                          local(next);
                          setEntries(next.entries);
                        }
                        setMessage("Seçtiğin yazı silindi.");
                      });
                    }}
                  >
                    <Trash2 size={16} />
                    Sil
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
