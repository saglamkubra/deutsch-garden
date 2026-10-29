# Altı oynanabilir bahçe dünyası

Bahar Çayırı, Kelebek Vadisi, Büyülü Orman, Ay Işığı Bahçesi, Kristal Sera ve
Kraliyet Çiçek Diyarı oynanabilir. Her dünyada 12 ekim, 6 süs ve 6 toplanmış
çiçek sergileme köşesi vardır. Arka planlar ve dünya kartları özgün SVG/CSS ile
oluşturuldu; dış görsel hizmeti veya yeni çalışma zamanı bağımlılığı yoktur.

## Oyun kuralları

- Dünyalar ücretsiz açılır. A1–C2 etiketleri temaları tanımlar; dünyaya gitmek
  ders bitirme, CEFR yeterliği, XP, para veya yeni bir başlangıç çantası vermez.
  Dükkândaki mevcut ürün ve seviye kuralları değişmez.
- Para, tohumlar, süs sahipliği, çiçek koleksiyonu ve ödül makbuzları ortaktır.
  Bir tohum yalnızca bir yerde ekilir. Yeni dünya açmak tohumları doldurmaz.
- Aynı süs tek yerde durur. Diğer dünyaya yerleştirmek eski yerinden taşır;
  dolu hedefe başarısız taşıma eski yerini bozmaz. Kaldırmak sahipliği silmez.
- Koleksiyon çiçekleri sahip olunan toplam adet kadar sergilenebilir. Diğer
  dünyadan çiçek taşıma tek bahçe işlemiyle kaynak ve hedefi birlikte günceller.
- Büyüme bütün ziyaret edilmiş dünyalarda zaman damgalarına göre devam eder.
  Yeni öğrenme makbuzu, mevcut ortak günlük sınır içinde bütün büyüyen
  çiçeklere katkı verir; dünya başına ayrı sınırsız hızlandırma hakkı oluşmaz.
- Yeni dünyalarda açan çiçeği toplamak mevcut ortak koleksiyon üzerinden ilk
  çiçek başarısının kanıtını oluşturur. Mevcut SQL'nin başarı koşulu korunur;
  dünya açma veya dolaşma için yeni başarı ödülü icat edilmez.

## Geriye uyumlu saklama

`GardenState.version` ve `deutsch-garden:garden:v1` değişmez. A1'in eski `plots`,
`placements`, `flowerPlacements` alanları yerinde kalır. İsteğe bağlı yeni
`activeWorld` ve `worldGardens` alanları eklenir. Henüz ziyaret edilmeyen dünya
verisi yazılmaz. Eski kayıt yüklemek otomatik olarak envanter üretmez veya
kaydı sıfırlamaz.

Mevcut bahçe kilidi, atomik yerel kayıt ve Supabase kullanıcı snapshot akışı
kullanılır. Yeni SQL, tablo, ortam değişkeni veya canlı DB işlemi gerekmez.
Yerel kayıt doğrulanmadan dünya/alan değişikliği başarılı gösterilmez. Hesaplar
arası önbellek ayrımı ve mevcut Supabase RLS politikaları korunur. Gerçek bulut
kaydının durumunu sayfa üstünden kontrol edin; tam çevrimdışı bulut eşitleme
ve gerçek zamanlı çok cihaz düzenleme garantisi verilmez.

Doğrulayıcı, bilinmeyen dünya kimliklerini, bozuk alanları, dünyalar arasında
çoğaltılmış süs/bitki kimliklerini ve koleksiyon adedini aşan sergilemeyi
reddeder. Bozuk kayıtlar mevcut yedek/koruma akışına gider; sessizce silinmez.
Eski bir uygulama sürümünde açık kalan sekmeleri güncel sürümle yenileyin.

## Testler

`node --test src/lib/garden/worlds.test.ts` eski A1 verisinin korunmasını,
ücretsiz geçişleri, ayrı ekimleri, ortak kaynakları, beklerken büyümeyi,
bir defalık toplamayı, dünya arası taşımayı, bozuk kayıt reddini, ortak
öğrenme katkısı sınırını, eşzamanlı son tohum harcamayı ve mevcut hesap
snapshot'ına gidiş/dönüşü kontrol eder. Eski bahçe, hediye, dükkân, doğum günü,
XP ve RLS testleri de genel pakette korunur.

Canlı Supabase'de ikinci fiziksel cihaz testi bu geliştirme ile otomatik
gerçekleştirilmiş sayılmaz. Üretim veritabanına migration uygulanmaz ve yayın
yapılmaz.

### Bu geliştirmedeki doğrulama sonuçları

- Genel paket 306/306, yeni dünya testleri 10/10 başarılı. Tam lint, TypeScript ve son kaynakla `npm run build -- --webpack` başarılı; 334 sayfa üretildi.
- 3001 yerel misafir test ortamında altı dünya açıldı; A2 ekim/sulama/toplama, B2 ekim/sulama ve başka dünyada beklerken büyüme, C2’den B2’ye aynı süsü taşıma ve A2’den C1’e koleksiyon çiçeğini taşıma gerçek tarayıcıda doğrulandı.
- Yenileme sonrası seçili dünya, bitki, süs ve koleksiyon çiçeği korundu. Eski A1 bitkisi yerinde kaldı. Dünya ziyaretleri para, XP veya başlangıç tohumu üretmedi.
- 390×844 telefon görünümünde yatay taşma yok; dünya kartları 163×200 piksel, ekim penceresi 341×717 piksel olarak ekrana sığıyor. Gece başlığının kontrastı ve eski kart stilinden taşınan seviye etiketleri görsel kontrolde düzeltildi.
- Gerçek Supabase hesabında iki fiziksel cihazla test yapılmadı. Ana 3000 kullanıcı kaydı, özel mektuplar, Gemini/Lumi ayarları ve canlı veritabanı değiştirilmedi; yayın yapılmadı.
