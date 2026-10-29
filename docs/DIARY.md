# Almanca Günlüğüm

`/gunlugum` artık yer tutucu değildir. Başlık, Almanca metin, kelime sayısı,
A1–C2 yazma önerileri, öz değerlendirme, arama/ay filtresi, düzenleme,
onaylı kalıcı silme ve JSON dışa aktarma içerir. Metinler düz yazı olarak
gösterilir; HTML çalıştırılmaz. İsteğe bağlı Lumi incelemesi ve doğrulanmış günlük XP/rozeti için güncel kurulum: [REMAINING-SETUP.md](REMAINING-SETUP.md).

## Saklama ve gizlilik

- Misafir: `deutsch-garden:diary:v1`, en fazla 500 kayıt ve 1,5 milyon JSON
  karakteri. Tarayıcı verisi temizlenirse kaybolabilir; JSON yedeği indirin.
- Hesap: mevcut `diary_entries` tablosu; mevcut 006 migration içindeki
  `own_diary` RLS politikası ve kullanıcı oturumlu Supabase SDK kullanılır.
  Temel günlük için ek SQL gerekmez; isteğe bağlı günlük ödülü 010 migration ister. Canlı veritabanına
  bu geliştirme sırasında işlem yapılmaz.
- Hesap taslağı yalnızca hesaba özel cihaz anahtarında saklanır. Kaydet
  düğmesi açıkça basılmadan buluta gönderilmez. Başarısız bulut isteğinde
  taslak korunur. Tam çevrimdışı bulut eşitleme veya arka plan kuyruğu yoktur.
- Misafir kayıtlarının aktarımı günlük ekranında ayrı onay ister. Mevcut genel
  ilerleme aktarımı günlükleri içermez. Yalnızca kaydedilmiş yazılar aktarılır;
  kaynak silinmez. Sabit UUID tekrarları çoğaltmaz; farklı metin üzerine yazılmaz.
- Düzenleme/silme, kayıt sahibini ve son değişiklik zamanını filtreler.
  Eski sürümler sessizce yeni metnin üzerine yazamaz. Birden fazla yazının
  aktarımı tek işlem değildir; yarıda kalırsa aynı kayıtlarla tekrar denenebilir.
- Günlük verileri Gemini/Lumi'ye kendiliğinden gönderilmez ve konsola yazılmaz.
  JSON yedekleri özel metin içerir; herkese açık paylaşmayın.
- Profildeki günlük silme işlemi bulut kayıtlarını ve bu cihazdaki hesap
  taslağını temizler. Diğer cihazlardaki henüz gönderilmemiş taslaklar ve
  indirilmiş yedekler uzaktan silinmez. Otomatik yükleme olmadığı için silinen
  bulut yazıları cihaz önbelleğinden kendiliğinden geri gelmez.

## Doğrulama

`node --test src/lib/diary/diary.test.ts` model, taslak yenileme, kimlik tekrarı,
eski sürüm çatışması, silme, Unicode arama, kota/bozuk veri koruması, hesap
ayrımı ve gerçek Supabase SDK üzerinden sahte HTTP taşımasıyla ağ hatalarını
test eder. Mevcut `account/database.test.ts`, gerçek yerel Postgres motorunda
tüm migration'ları ve günlük RLS kullanıcı ayrımını kontrol eder.

Gerçek Supabase hesabında uçtan uca test ayrıca gerekir: giriş → deneme yazısı
kaydet → yenile → ikinci cihazda aynı hesaptan aç → düzenle → doğrula.
Bu doğrulama yapılmadan canlı cihazlar arası test geçtiği iddia edilmez.

### Bu geliştirmedeki sonuçlar

- Genel test paketi: 291/291 geçti; son ek SDK ağ/çakışma testi dahil günlük dosyası: 11/11 geçti (ilk 10 test genel pakette de vardır).
- Tam lint ve TypeScript kontrolü geçti. Son kaynak üretim derlemesi `npm run build -- --webpack` ile 328 sayfada başarılı. Varsayılan Turbopack Windows ortamında alt süreç bağlantı hatası verdi; bu hata gizlenmedi, varsayılan build komutu değiştirilmedi.
- İlk test çalışmasında Windows sandbox geçici klasöründeki rename izinleri doğum günü testlerini engelledi. TEMP/TMP proje içindeki `.cache/diary-test-temp` olarak ayarlanarak tüm paket başarılı çalıştı; uygulama kodu bu nedenle değiştirilmedi.
- Ayrı yerel 3001 test ortamında taslak yenileme, kayıt, düzenleme, Almanca arama, silme onayını iptal, sayfa yenilemede ve başka rotadan dönüşte kayıt korunması doğrulandı. 390×844 mobil görünümünde yatay taşma yok; uygulama içi dialog odağı İptal düğmesinde başlıyor. Kalıcı UI silme yapılmadı; silme mantığı ve RLS yerel otomatik testlerle kontrol edildi.
- Canlı Supabase hesabında veya ikinci fiziksel telefonda test yapılmadı. Mevcut 3000 kullanıcı ilerlemesine, canlı DB’ye ve Gemini yapılandırmasına dokunulmadı.
