# Günlükte Lumi incelemesine erişim düzeltmesi

Önceki arayüz, boş açık taslakta, onay verilmediğinde veya yazı 800 karakteri
aştığında inceleme düğmesini açıklama göstermeden kapatıyordu. Günlük
kaydedilince açık taslak temizlendiğinden kayıtlı metin doğrudan incelenemiyordu.
Sunucunun `{error:{message}}` biçimi de eski bileşende doğru okunmuyordu.

- Pasif düğmenin nedeni yanında açıkça gösterilir.
- Uzun günlükte ilk bölüm görünür bir inceleme alanına hazırlanır. İstenen
  başka bölüm buraya konabilir; asıl günlük kısaltılmaz veya değiştirilmez.
- Kaydedilmiş her yazıda **Lumi ile incele** vardır. Taslağın veya kayıtlı
  yazının üzerine yazmadan aynı inceleme alanına geçilir.
- Onay yalnızca görünen bölüm içindir. Bölüm, yazı, hesap veya düzey değişince
  onay/sonuç yenilenir; arka planda kendiliğinden AI isteği gönderilmez.
- Aynı incelemenin yeniden denenmesi aynı istek kimliğini kullanır. Bağlantı,
  kurulum, erişim, kota ve doğrulanamayan sonuçlar anlaşılır biçimde gösterilir.
- Geçerli sonuçta Türkçe açıklama, düzeltilmiş Almanca ve doğal alternatif
  gösterilir. Günlük veya başka bir veri kendiliğinden değiştirilmez.

Mevcut `/api/lumi/chat`, `diary-review` modu, oturum denetimi ve kota kullanılır.
Yeni API anahtarı, SQL geçişi veya veri taşıması gerekmez. Tek parçada sınır
800 karakterdir; bütün uzun günlüğün tek istekle incelendiği iddia edilmez.
Sonuç mevcut sayfada gösterilir; günlük kaydına otomatik eklenmez.

Testler: boş/onaysız/uzun metinde sıfır istek; UTF-16 güvenli bölüm; doğru mod
ve metin; kurulum/erişim/origin hataları; kota hatası ve aynı kimlikle tekrar;
geçersiz/yanlış isteğe ait yanıtların reddi; mevcut günlük saklama testleri.
Gerçek Gemini bağlantısına tek bir yapay, kişisel olmayan hatalı Almanca
cümle gönderildi: doğrulanmış yanıt, bir düzeltme ve Türkçe açıklama geldi.
Bu testte kullanıcının günlükleri okunmadı ve veritabanına yazılmadı.

Sonuç: tam test kümesi 340/340, günlük testleri 17/17 geçti. Lint ve TypeScript
hatası yok; 378 sayfalık üretim derlemesi doğrulandı. Gerçek tarayıcıda tıklama
ve telefonda görsel kabul testi ayrıca yapılmalı. Değişiklik yerelde hazırlanır;
GitHub'a gönderme ve Render dağıtımı ayrıca gerekir.
