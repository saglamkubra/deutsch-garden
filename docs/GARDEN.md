# Sihirli Bahçe · 3. adım

Yalnızca A1 Bahar Çayırı oynanabilir. Tam ders motoru, AI, dükkân ve diğer dünyalar uygulanmadı. 4. adımda günlük kelime ödülleri bu bahçeye bağlandı; ayrıntılar LEARNING.md belgesindedir.

## Nasıl oynanır?

1. /bahcem sayfasında boş bir toprağa dokun ve tohum seç. Çantandan 1 tohum düşer; dolu alan tekrar ekilemez.
2. Bitkine dokunarak aşamasını ve kalan süreyi gör. “Sula” düğmesi veya üstteki sulama kabıyla su ver.
3. Çantandan bir süs seç ve bahçenin altındaki altı süs köşesinden birine yerleştir. Süse dokunarak taşı veya çantana geri al.
4. Sayfayı yenile veya başka sayfadan geri dön: tohumlar, bitkiler, sulamalar ve süsler korunur.

## Kurallar

- Başlangıçta 12 tohum: 3 papatya, 2 lale, 2 gül, 2 ayçiçeği, 2 lavanta, 1 kiraz çiçeği.
- Altı tür ve beş başlangıç süsü açıktır. 30 bahçe parası başlangıç bakiyesidir; henüz harcanmaz.
- Türlere göre büyüme süreleri: 45, 60, 75, 90, 105 ve 120 saniye.
- Aşamalar: tohum → minik filiz → büyüyen bitki → çiçek.
- Çiçek başına en fazla 2 sulama, 20 saniye arayla; her sulama 10 saniye katkı.
- Bitkiler ölmez. Açan çiçekler kalır; hasat veya otomatik kaynak ödülü yoktur.
- Büyüme zaman damgalarından türetilir. Saniyelik sayaç yalnızca ekranı günceller; sayfa kapalıyken geçen süre sonraki ziyarette hesaplanır.
- Sesler başlangıçta kapalıdır. Araç çubuğundan açıldığında Web Audio ile iki yumuşak nota çalınır. Tarayıcı desteklemiyorsa oyun sessiz çalışır.
- Azaltılmış hareket tercihinde CSS hareketleri kapanır.

## Mimari

- src/lib/garden/catalog.ts: çiçek, süs ve dünya katalogları, süreler ve kurallar.
- model.ts: React'tan bağımsız, değişmez ekim/sulama/süs komutları; büyüme hesapları.
- storage.ts: değiştirilebilir GardenStorage arayüzü, localStorage uygulaması ve şema doğrulama.
- store.ts: useSyncExternalStore ile hydration güvenli ortak durum, saat, kayıt ve storage olayları.
- src/components/garden/game/: sahne, özgün SVG çizimler, çanta, yerel dialog, dünya önizlemeleri ve ses.
- src/app/bahcem/page.tsx ve garden.css: gerçek bahçe rotası ve kapsüllenmiş tema.
- Ana sayfanın demo XP, görev ve ilerleme değerleri ayrı tutulur.

## Yerel kayıt

deutsch-garden:garden:v1 anahtarında sürüm, revizyon, 12 alan, bitki türleri, ekim/sulama zamanları, çiçek açma durumu, tohumlar, para, süsler ve yerleşimleri, açık türler/dünyalar, ses tercihi ve işlenmiş ödül kimlikleri saklanır.

Her eylemde kayıt yapılır; her sayaç güncellemesinde yazılmaz. Önceki sağlam kayıt :backup anahtarına alınır. Hasarlı ana veri :corrupt altında korunup sağlam yedek denenir. Yedek yoksa kullanıcıya açıklayarak yeni başlangıç hazırlanır. Hasarlı kopya saklanamıyorsa veya kayıt daha yeni bir sürüme aitse değişiklikler kapatılır. Kayda erişim/yazma başarısızsa yalnızca oturum içi mod açıkça gösterilir.

Tarayıcı verisini temizlemek veya başka cihaz kullanmak bu kaydı taşımaz. Bu bir bulut yedeği değildir. Supabase geçişinde asenkron bir adaptör ve kimlik doğrulama eklenmelidir.

Büyüme aşaması zamanlardan türetilir; bloomedAt tamamlanma işaretini saklar. Yenileme çiçeği tekrar ödüllendirmez. Bu adımda çiçek açmak para veya tohum vermez.

## Gelecek ödül bağlantısı

grantReward(state, reward) saf ve tekrar çağrılmaya dayanıklıdır. deliverGardenReward(reward) kayıt ve Lumi geri bildirimi için istemci bağlantı noktasıdır. Benzersiz ödül kimliği daha önce işlendiyse kaynak yeniden eklenmez. Tohum, para, süs, tür ve dünya açma alanları hazırlanmıştır. Mevcut ders/alıştırma/sohbet sayfaları bu fonksiyonları çağırmaz. İstemci tarafındaki yerel para güvenilir sunucu ekonomisi değildir.

## Testler

Node.js 24 ile ek bağımlılık olmadan: npm test.

Ardından npm run lint, npm run typecheck ve npm run build.

15 otomatik test; ekim, tohum yokluğu, dolu alan, sulama katkısı/beklemesi/limiti, aşamalar, altı türün olgunlaşması, kapalıyken büyüme, tekrar kutlamama, süs taşıma/kaldırma, tekrar ödül işlememe, saat geri alma, kayıt geri yükleme ve bozuk/yeni sürüm/erişilemeyen kayıt davranışlarını kapsar.

Tarayıcıda papatya ekimi, sulama geri sayımı, çiçek açma, yenilemeden sonra 11 tohum ve olgun papatyanın korunması, mantar süsünü yerleştirme/taşıma/çantaya alma denendi. Test için ekilen papatya yerel bahçede bırakıldı. Tarayıcıdaki test kaydı silinmedi veya sıfırlanmadı.
