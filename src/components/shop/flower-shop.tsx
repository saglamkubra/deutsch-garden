"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Coins,
  History,
  LockKeyhole,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { PageHeading } from "@/components/garden/primitives";
import { LumiMascot } from "@/components/garden/lumi-mascot";
import { Button } from "@/components/ui/button";
import { GardenDialog } from "@/components/garden/game/dialog";
import { FlowerArt, DecorationArt } from "@/components/garden/game/flower-art";
import { useGarden, purchaseGardenItem } from "@/lib/garden/store";
import { useLearning } from "@/lib/learning/store";
import {
  SHOP_CATEGORIES,
  SHOP_PRODUCTS,
  productById,
  type ShopCategory,
  type ShopProduct,
} from "@/lib/shop/catalog";
import { shopAvailability } from "@/lib/shop/model";
export function ProductArt({ product }: { product: ShopProduct }) {
  return (
    <div className={`shop-product-art shop-tone-${product.tone}`}>
      <span className="shop-art-star">✦</span>
      <span className="shop-art-flower">✿</span>
      {product.inventory.kind === "seed" ? (
        <>
          <FlowerArt species={product.inventory.flower} stage="bloom" />
          <span className="shop-seed-label">
            {product.inventory.quantity} tohum
          </span>
        </>
      ) : (
        <DecorationArt kind={product.inventory.decoration} />
      )}
    </div>
  );
}
function ShopWindow() {
  return (
    <div className="shop-window" aria-hidden="true">
      <div className="shop-window-sign">
        Lumi’nin çiçekleri <span>✿</span>
      </div>
      <div className="shop-awning" />
      <div className="shop-window-shelf">
        <FlowerArt species="tulip" stage="bloom" />
        <DecorationArt kind="mint-pot" />
        <FlowerArt species="daisy" stage="bloom" />
      </div>
      <div className="shop-window-counter">
        <span>Her emek bir çiçek açar.</span>
        <span>✦</span>
      </div>
      <div className="shop-window-mascot">
        <LumiMascot expression="happy" decorative />
      </div>
    </div>
  );
}
export function FlowerShop() {
  const garden = useGarden(),
    learning = useLearning();
  const { state, ready, mode } = garden;
  const [category, setCategory] = useState<ShopCategory | "all">("all"),
    [search, setSearch] = useState(""),
    [onlyAvailable, setOnlyAvailable] = useState(false),
    [selected, setSelected] = useState<ShopProduct | null>(null),
    [message, setMessage] = useState(""),
    [success, setSuccess] = useState(false),
    [busy, setBusy] = useState(false),
    [historyCount, setHistoryCount] = useState(10);
  const transaction = useRef(""),
    buying = useRef(false);
  const unlocked = (p: ShopProduct) =>
    !shopAvailability(
      { ...state, coins: 999999 },
      p,
      learning.state.level,
    ).includes("düzeyinde");
  const owned = (p: ShopProduct) =>
    p.inventory.kind === "decoration" &&
    state.decorations.includes(p.inventory.decoration);
  const products = SHOP_PRODUCTS.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (!onlyAvailable || !shopAvailability(state, p, learning.state.level)) &&
      `${p.name} ${p.description}`
        .toLocaleLowerCase("tr")
        .includes(search.toLocaleLowerCase("tr").trim()),
  );
  const purchases = [...(state.purchases ?? [])].reverse();
  const enabled =
    ready && learning.ready && mode === "local" && !learning.readonly;
  const reason = selected
    ? shopAvailability(state, selected, learning.state.level)
    : "";
  function open(product: ShopProduct) {
    if (buying.current) return;
    transaction.current = crypto.randomUUID();
    setSelected(product);
    setMessage("");
    setSuccess(false);
  }
  function close() {
    if (!buying.current) setSelected(null);
  }
  async function buy() {
    if (!selected || buying.current || !enabled || reason || success) return;
    buying.current = true;
    setBusy(true);
    setMessage("");
    try {
      const result = await purchaseGardenItem(
        selected.id,
        transaction.current,
        learning.state.level,
      );
      setMessage(result.message);
      setSuccess(result.ok);
    } catch {
      setMessage(
        "Satın alma tamamlanamadı. Kaydın korundu; yeniden deneyebilirsin.",
      );
    } finally {
      buying.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="page-content shop-page">
      <PageHeading
        eyebrow="EMEĞİNLE BÜYÜYEN KÜÇÜK MUTLULUKLAR"
        title="Çiçek Dükkânım 🛍️🌷"
        description="Öğrendikçe biriken bahçe paranla kendi masal köşeni tasarla."
      >
        <div
          className="shop-wallet"
          aria-label={
            ready ? `${state.coins} bahçe parası` : "Bakiye yükleniyor"
          }
        >
          <span className="shop-coin">
            <Coins size={25} />
          </span>
          <div>
            <small>Bahçe cüzdanım</small>
            <strong>
              {ready ? state.coins : "—"}
              <span> bahçe parası</span>
            </strong>
          </div>
        </div>
      </PageHeading>
      <section className="shop-hero">
        <div className="shop-hero-copy">
          <span className="shop-kicker">
            <Sparkles size={14} /> KÜÇÜK BİR BAHÇE, BİNLERCE HAYAL
          </span>
          <h2>
            Biraz emek,
            <br />
            biraz sihir,
            <br />
            <em>bir bahçe dolusu sen.</em>
          </h2>
          <p>
            Hoş geldin! Tohumlar toprağa, süsler en sevdiğin köşeye… Hepsi senin
            öğrenme yolculuğunun bir hatırası.
          </p>
          <div className="shop-hero-actions">
            <Button asChild>
              <Link href="/bahcem">
                Bahçeme git <ArrowRight size={16} />
              </Link>
            </Button>
            <a href="#shop-catalog">Vitrine göz at ↓</a>
          </div>
          <div className="shop-trust">
            <Check size={14} /> Gerçek para yok · Sürpriz kutu yok · Sadece
            bahçe mutluluğu
          </div>
        </div>
        <ShopWindow />
      </section>
      <div className="shop-info-strip">
        <span>
          <span>🌱</span>
          <strong>Tohumları ek</strong>
          <small>Paketini al, boş toprağı seç.</small>
        </span>
        <span>
          <span>🦋</span>
          <strong>Süsünü yerleştir</strong>
          <small>Taşı, kaldır; hep senin kalsın.</small>
        </span>
        <span>
          <span>✨</span>
          <strong>Düzeyinle keşfet</strong>
          <small>
            Şu an {learning.ready ? learning.state.level : "…"} seçimine uygun
            ürünler açık.
          </small>
        </span>
      </div>
      {(mode !== "local" || learning.readonly) && (
        <p className="shop-notice" role="status">
          Kaydını korumak için alışveriş kapalı.{" "}
          {garden.notice || learning.notice}
        </p>
      )}
      <section id="shop-catalog" aria-labelledby="shop-catalog-title">
        <div className="shop-section-heading">
          <div>
            <span className="eyebrow">LUMİ’NİN ÖZENLE SEÇTİKLERİ</span>
            <h2 id="shop-catalog-title">Bugün bahçene ne katsak?</h2>
          </div>
          <span>
            {products.length} ürün · {learning.state.level} düzeyi
          </span>
        </div>
        <div
          className="shop-categories"
          role="group"
          aria-label="Ürün kategorileri"
        >
          <button
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            ✿ Tüm vitrin
          </button>
          {Object.entries(SHOP_CATEGORIES).map(([id, name]) => (
            <button
              key={id}
              aria-pressed={category === id}
              onClick={() => setCategory(id as ShopCategory)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="shop-filters">
          <label className="shop-search">
            <Search size={17} />
            <span className="sr-only">Dükkânda ürün ara</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Bir çiçek, bir renk, küçük bir hayal…"
            />
          </label>
          <label className="shop-check">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />{" "}
            Satın alabileceğim ürünler
          </label>
        </div>
        <div className="shop-grid">
          {products.map((p) => {
            const isOwned = owned(p),
              locked = !unlocked(p),
              why = shopAvailability(state, p, learning.state.level);
            return (
              <article
                className={`shop-card ${locked ? "shop-locked" : ""}`}
                key={p.id}
              >
                <div className="shop-card-picture">
                  <ProductArt product={p} />
                  <span className="shop-product-badge">
                    {isOwned ? (
                      <>
                        <Check size={12} /> Sende var
                      </>
                    ) : !p.available ? (
                      "Vitrin ürünü"
                    ) : locked ? (
                      <>
                        <LockKeyhole size={12} /> {p.level}
                      </>
                    ) : p.inventory.kind === "seed" ? (
                      "Ekilir, büyür, çiçek açar"
                    ) : (
                      "Kalıcı bahçe süsü"
                    )}
                  </span>
                </div>
                <div className="shop-card-copy">
                  <span className="shop-card-category">
                    {SHOP_CATEGORIES[p.category]}
                  </span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="shop-card-meta">
                    <strong>
                      <Coins size={16} />
                      {p.price}
                      <small>bahçe parası</small>
                    </strong>
                    <span>
                      {p.inventory.kind === "seed"
                        ? `Çantanda ${state.seeds[p.inventory.flower]}`
                        : isOwned
                          ? state.placements.includes(p.inventory.decoration)
                            ? "Bahçende"
                            : "Çantanda"
                          : `${p.level} ve üzeri`}
                    </span>
                  </div>
                  <button
                    className="shop-inspect"
                    onClick={() => open(p)}
                    aria-label={`${p.name} ürününü incele`}
                  >
                    {isOwned
                      ? "Ürünüm · İncele"
                      : locked
                        ? `${p.level} ile açılır · İncele`
                        : !p.available
                          ? "Vitrinde incele"
                          : why
                            ? "Ürünü incele"
                            : "İncele ve satın al"}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        {!products.length && (
          <div className="shop-empty">
            🌼<h3>Bu rafta henüz bir eşleşme yok.</h3>
            <p>Başka bir kategori veya arama deneyebilirsin.</p>
            <Button
              variant="outline"
              onClick={() => {
                setCategory("all");
                setSearch("");
                setOnlyAvailable(false);
              }}
            >
              Tüm vitrine dön
            </Button>
          </div>
        )}
      </section>
      <section className="shop-history" aria-labelledby="shop-history-title">
        <div className="shop-section-heading">
          <div>
            <span className="eyebrow">BAHÇENİN KÜÇÜK HATIRALARI</span>
            <h2 id="shop-history-title">
              <History size={21} /> Satın alma geçmişim
            </h2>
          </div>
          <span>{purchases.length} kayıtlı işlem</span>
        </div>
        {purchases.length ? (
          <>
            <ul>
              {purchases.slice(0, historyCount).map((t) => {
                const p = productById(t.productId)!;
                return (
                  <li key={t.id}>
                    <div className="shop-history-art">
                      <ProductArt product={p} />
                    </div>
                    <div>
                      <strong>{p.name}</strong>
                      <small>
                        {new Intl.DateTimeFormat("tr-TR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(t.at)}{" "}
                        · {t.quantity}{" "}
                        {p.inventory.kind === "seed" ? "tohum" : "kalıcı süs"}
                      </small>
                    </div>
                    <div className="shop-history-price">
                      <strong>
                        −{t.price} <Coins size={14} />
                      </strong>
                      <small>İşlem sonrası {t.after}</small>
                    </div>
                  </li>
                );
              })}
            </ul>
            {historyCount < purchases.length && (
              <Button
                variant="outline"
                onClick={() => setHistoryCount((n) => n + 10)}
              >
                Daha fazla işlem göster
              </Button>
            )}
          </>
        ) : (
          <div className="shop-history-empty">
            <ShoppingBag size={28} />
            <p>İlk bahçe hatıran burada yerini bekliyor.</p>
            <small>
              Satın aldıkların, harcadığın para ve işlem tarihi birlikte
              kaydedilir.
            </small>
          </div>
        )}
      </section>
      <p className="shop-storage-note">
        Bu dükkân mevcut bahçe paranı kullanır. Alışveriş ve çantan bu
        tarayıcıda birlikte saklanır. Hesabınla giriş yaptıysan başka cihazda
        devam etmeden önce Profilim’den bulut kaydını kontrol et. Ürün kilitleri
        öğrenme ayarındaki CEFR düzeyine göredir, bir sertifika anlamına gelmez.
      </p>
      <GardenDialog
        open={!!selected}
        onClose={close}
        title={selected?.name ?? "Ürün önizlemesi"}
      >
        {selected && (
          <div className="shop-confirm">
            <ProductArt product={selected} />
            <p>{selected.description}</p>
            <div className="shop-confirm-facts">
              <span>
                {selected.inventory.kind === "seed"
                  ? `${selected.inventory.quantity} tohum · Ekim alanlarında yetişir`
                  : "1 kalıcı süs · Altı süs köşesinden birine yerleşir"}
              </span>
              <span>
                {selected.level} ve üzeri ·{" "}
                {selected.inventory.kind === "seed"
                  ? "Tohum bitince yeniden alınabilir"
                  : "Bir kez alınır; sınırsız taşınır"}
              </span>
            </div>
            <div className="shop-receipt">
              <span>
                İşlem öncesi bakiye{" "}
                <strong>
                  {success ? state.coins + selected.price : state.coins}
                </strong>
              </span>
              <span>
                Ürün bedeli <strong>{selected.price}</strong>
              </span>
              <span>
                Satın alma sonrası{" "}
                <strong>
                  {success
                    ? state.coins
                    : state.coins >= selected.price
                      ? state.coins - selected.price
                      : "Yetersiz bakiye"}
                </strong>
              </span>
            </div>
            {message && (
              <p
                className={`shop-notice ${success ? "shop-success" : ""}`}
                role="status"
              >
                {message}
              </p>
            )}
            {!success && reason && <p className="shop-notice">{reason}</p>}
            {success ? (
              <Button asChild>
                <Link href="/bahcem">
                  Çantamı aç, bahçeme git <ArrowRight size={16} />
                </Link>
              </Button>
            ) : (
              <Button
                onClick={() => void buy()}
                disabled={!enabled || busy || !!reason}
              >
                <Coins size={16} />
                {busy
                  ? "Güvenle kaydediliyor…"
                  : `${selected.price} bahçe parasıyla satın al`}
              </Button>
            )}
            <button
              className="shop-dialog-cancel"
              disabled={busy}
              onClick={close}
            >
              {success ? "Vitrine dön" : "Vazgeç, vitrine dön"}
            </button>
          </div>
        )}
      </GardenDialog>
    </div>
  );
}
