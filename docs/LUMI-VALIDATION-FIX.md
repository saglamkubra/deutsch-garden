# Lumi yanıt doğrulaması — 1 Kasım 2026

Ekrandaki hata gerçek Gemini yanıtıyla yeniden üretildi. Yapay test sohbetinde
son mesaj `ich wohne in ankara` iken model, önceki `ich liebe in ankara`
mesajına ait düzeltmeyi yeniden verdi. Son mesaja dayanmayan düzeltme
reddedildiği için geçerli Almanca sohbet yanıtı da kullanıcıya ulaşmıyordu.
Hata aralıklıydı; ilk dört denemede aynı kısa örnek normal yanıt verdi.

## Düzeltme

- Yalnızca önceki kullanıcı mesajına ait olduğu gerçekten doğrulanan tekrar
  düzeltmesi ayıklanır. Geçerli sohbet yanıtı korunur; atlama Türkçe bir
  uygulama notuyla görünür. Hiçbir kullanıcı mesajına dayanmayan uydurma
  düzeltmeler yine reddedilir.
- Bir düzeltmenin bütün mesaj alıntısında yalnızca harf büyüklüğü veya son
  noktalama farklıysa kullanıcının gerçek metni geri yerleştirilir. Sözcük,
  fiil, olumsuzluk veya anlam değişikliği bu yolla kabul edilmez.
- İstenen düzeltme sayısı üretim şemasında da belirtilir: nazik sohbette 1,
  özet tercihli sohbette 0, günlük incelemesinde 3, kapanışta 2. Sunucu
  doğrulaması ayrıca uygulanmaya devam eder.
- Diğer doğrulama hataları metin biçimi, son mesaja dayanmayan düzeltme,
  düzeltme sınırı veya kelime açıklaması olarak anlaşılır Türkçeyle ayrılır.
  Hata yanıtına özel metin veya sağlayıcının ham hata ayrıntısı konmaz.
- Yeni otomatik AI denemesi eklenmedi. Aynı başarılı isteğin tekrarında
  mevcut önbellek kullanılır; ikinci bir sağlayıcı çağrısı yapılmaz.

API anahtarı/model, geçmiş, yerel/bulut ilerleme ve ödül kuralları değiştirilmedi.
Eski kayıtlar yeni isteğe bağlı `noticeTr` alanı olmadan da geçerlidir. Yeni
not, mevcut sohbet saklama şeması içinde korunur; SQL geçişi gerekmez.

## Doğrulama kapsamı

Gerçekte gözlenen yanıt, yerel servis testinde yeniden oynatıldı: önceki
düzeltme atlandı, sohbet yanıtı ve görünen not döndü; aynı istek tekrarı ek
sağlayıcı çağrısı yapmadı. Sözcük/olumsuzluk değişikliği ve uydurulmuş alıntı
testleri reddedilmeye devam ediyor. Gemini bağlantısı ayrıca yalnızca yapay
test mesajlarıyla kontrol edildi; özel geçmiş okunmadı ve canlı veritabanına
yazılmadı. Bu değişiklik canlıya kendiliğinden dağıtılmaz.

Sonuçlar: tam test kümesi 345/345; Lumi/Gemini testleri 32/32 geçti. Lint,
TypeScript ve 378 sayfalık üretim derlemesi başarılı. Paket denetiminde özel
dosya ve tarayıcıda bulunan mevcut sır sayısı sıfır. Yeni uygulama notunun
sohbet durumuna alınması ve JSON üzerinden geri yüklenmesi de doğrulandı.
Gerçek tarayıcıda görsel kabul ve canlı Render sürümü ayrıca kontrol edilmelidir.
