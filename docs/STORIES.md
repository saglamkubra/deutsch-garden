# 8. adım · Hikâye Dünyam

Yalnızca 8. adım uygulandı. 9. adım, AI öğretmen, günlük ve çiçek dükkânı bu kapsamda değil.

## İçerik ve gerçek dallar

| Seviye | Oynanabilir | İçerik |
| --- | ---: | --- |
| A1 | 4 | Ein Tag im Café, Das verlorene Geschenk, Ein neuer Freund, Das Geheimnis im Garten |
| A2 | 2 | Eine Überraschung im Zug, Der erste Tag im neuen Viertel |
| B1–C2 | 0 | Seviye başına bir müfredat planı; açılamaz |

Her hikâyede 7 sahne, 3 karar noktası, 6 dal bağlantısı ve 4 ulaşılabilir son var. Toplam 42 sahne, 36 bağlantı ve 24 son. Bir okuma yolu üç sahneden oluşur; kısa başlangıç maceralarıdır. İki ardışık seçim, birbirinden farklı olaylara ve dört farklı sona götürür. Hikâye kararları sınav yanıtı olarak puanlanmaz.

Almanca metinler ve Türkçe çeviriler özgün olarak yazıldı. A1 metinleri kısa ve şimdiki zamanda, A2 metinleri geçmiş deneyimler ve daha ayrıntılı gündelik konuşmalar içerir. İleri seviye planları hazır içerik gibi gösterilmez. Tahmini 3–4 dakika, çeviri/kelime yardımı ve seçimlerle bir okuma yolu içindir; ses süresi değildir.

## Dosya düzeni

- `src/data/stories/stories.json`: hikâye metadata, sahneler, iki dilli metin, sabit seçim/hedef kimlikleri, sonlar ve sahneye ait sorular.
- `src/data/stories/glossary.json`: 30 açıkça yazılmış hikâye sözlüğü maddesi; kelime veritabanından ayrı.
- `src/data/stories/audio.json`: gerçek ses dosyalarının yolları, ölçülen süreleri, SHA-256 değerleri ve model bilgisi.
- `src/lib/stories/`: TypeScript türleri, içerik/kelime çözümleme, grafik doğrulama, saf motor, kayıt doğrulayıcı ve kilitli yerel store.
- `src/components/stories/`: kütüphane, okuyucu, özgün SVG resimler, ses oynatıcı, kelime penceresi ve kaydedilen kelimeler.
- `src/app/hikayeler/`: kütüphane ve altı statik hikâye rotası; `src/app/stories.css`: duyarlı hikâye tasarımı.
- `scripts/create-story-content.py`, `scripts/generate-story-audio.py`, `scripts/report-stories.ts`: özgün kaynak üretimi, mevcut Piper altyapısıyla çevrimdışı ses üretimi ve sayım/doğrulama raporu.

Grafikler içerik yüklenirken ve testlerde doğrulanır: eksik/tekrarlı kimlik, geçersiz başlangıç, bozuk hedef, ulaşılamayan sahne/son, döngü ve aynı hedefe giden sahte seçim hata verir. Yeni hikâyeler veri eklenerek hazırlanabilir; mevcut sabit sahne kimlikleri korunmalıdır.

## Okuyucu ve ses

42 sahne kaydı + 84 tek cümle kaydı + 30 sözlük telaffuzu = **156 gerçek WAV**. Step 7’nin Piper 1.8.0 / Thorsten Almanca modeli yeniden kullanıldı; metinler özgün. Tarayıcıya Python, model veya TTS motoru gönderilmez. Kullanım için API anahtarı veya cihazda Almanca ses gerekmez. Kaynak/model lisans notları `public/audio/stories/README.md` içinde.

Ses kendiliğinden başlamaz. HTMLAudioElement ile gerçek oynat/duraklat, durdur, yeniden çal, ses düzeyi ve 0,65/0,85/1/1,25 hız seçenekleri var. Her cümle ayrı dosyadan dinlenebilir. Senkron cümle vurgusu veya uydurma süre kullanılmaz. Tüm karakterler aynı yapay anlatıcıdır. Kullanıcı açıkça cihaz sesi yedeğini seçerse mevcut `SpeechSequence` yardımcı sınıfı kullanılır; Almanca ses yoksa Türkçe açıklama gösterilir.

“Almanca” ve “Almanca + Türkçe” düğmeleri cümle çevirilerini ve seçim çevirilerini açar/kapatır. Hareket azaltma tercihi geçişleri ve dekoratif animasyonları durdurur. Dokunma/klavye düğmeleri, odaklanan sahne başlığı, etiketli kontroller ve Escape ile kapanan yerel dialog kullanılır.

## Kelimeler ve sorular

Gerçek kelimeler mevcut `LocalVocabularyRepository` üzerinden eşlenir. Kaydetmek mevcut `queueWordReview` SRS akışını kullanır; önceki seri, günlük seçimler ve yanıtlar sıfırlanmaz. Veritabanında olmayan kelimeler “Özgün hikâye sözlüğü” etiketiyle gösterilir; sahte kelime kimliği eşleşmesi yapılmaz. Bunlar kendi koleksiyonunda, benzersiz kimlikle saklanır; ana veritabanına otomatik eklenmez. Her iki tür `/kelimelerim#hikaye-kelimeleri` alanında görülebilir. Tam sözcük sınırları alt sözcüklerin yanlış vurgulanmasını önler.

42 özgün soru var. Her tamamlanan yol için yalnızca ziyaret edilen üç sahnenin sorusu alınır. Mevcut `Question`, `AnswerInput` ve `isCorrect` kullanılır; her yanıt Türkçe açıklama verir. Soruların doğru seçenekleri sabit şekilde farklı konumlara dağıtılır. Yanıtlar tekrar gönderilemez veya atlanamaz. Soru/yanıt anlık görüntüsü kayıtta korunur; metin düzenlemeleri mevcut quiz anlık görüntüsünü değiştirmez. Test yeniden denemek için hikâye yeniden okunabilir; önceki okumalar ve sonuçlar silinmez.

## Kayıt ve günlük öneri

`deutsch-garden:stories:v1` anahtarı mevcut diğer kayıt anahtarlarından ayrıdır. Aktif hikâye/okuma, mevcut sahneye ulaşan yol, seçimler, ziyaret edilen sahneler, tüm önceki okumalar, sonlar, tamamlananlar, quiz sonuçları, favoriler, kelimeler, günlük atama ve ödül makbuzları saklanır. Her seçim yazıldıktan sonra UI güncellenir. “Kaydet ve çık” başarılı yazımdan sonra kütüphaneye döner; devam kartı son yarım kalmış hikâyeyi seviyeler arasında da bulur.

Web Locks ve her değişiklikte en güncel kaydı okuma, sekmeler arası kayıt yarışlarını azaltır. `storage` olayı diğer sekmeleri günceller. Geçerli yedek, bozuk ham kayıt koruması, ilerideki sürümler için salt okunur davranış ve depolama hatası mesajları var. Mevcut bahçe, kelime, dinleme ve gramer kayıtları değiştirilmez; yalnızca kazanılmış ödül/kelime tekrarı kendi mevcut bağdaştırıcısına iletilir.

Öneri yerel takvim günü + CEFR seviyesi anahtarıyla bir kez atanır. Okunmamışlar, ardından yarım kalanlar öncelikli; mümkünse dünkü hikâye dışlanır. Sayfa yenilemek, bitirmek veya favorilemek aynı günkü öneriyi değiştirmez. Küçük kitaplık tekrar kullanılabilir; hazır içerik olmayan seviyeye `null` atama kaydedilir. Kütüphane seviyesi genel öğrenme seviyesini değiştirmez.

## Bahçe ödülleri ve veritabanı

- Hikâyede ilk kez bir sona ulaşmak: **20 XP**, `story:complete:{storyId}`.
- Her benzersiz son: **10 bahçe parası**, `story:ending:{storyId}:{sceneId}`.
- Hikâyenin testinde en az %80: **bir lavanta tohumu**, `story:quiz:{storyId}`. Üç soruluk başlangıç testinde üç doğru gerekir.

`REWARDS.stories` merkezi politikadır. XP mevcut alıştırma/gramer/dinleme defterine, para/tohum mevcut `deliverGardenReward` bağdaştırıcısına gider. Makbuz önce kalıcılaştırılır, aktarım ardından onaylanır. Yeniden okuma, yenileme veya aktarım tekrarında aynı kaynak ikinci kez verilmez. Envanter ve bitkiler korunur. Yeni bir su damlası para birimi oluşturulmadı; bahçedeki sulama ücretsiz kalır. Günlük önerinin ayrıca sınırsız tekrarlanabilir ödülü yoktur.

Supabase bağlantısı kurulmadı; canlı veritabanına işlem yapılmadı. `202610270005_story_xp.sql` yalnızca önceki XP miktarı kısıtına 20 XP ekleyen **uygulanmamış hazırlık migration’ıdır**. Hikâye durumu şimdilik yerel adaptördedir; cihazlar arası eşitleme veya sunucu doğrulaması yoktur.

## Elle deneme

1. `npm run dev`, ardından `http://127.0.0.1:3000/hikayeler`. Genel seviyen ileri düzeyse A1 veya A2 seç.
2. “Kafede Bir Gün” aç. Çeviriyi ve sesi dene. Kahve seçeneğini seç, ikinci sahnede “Kaydet ve çık” de.
3. Sayfayı yenile; “Kaldığım yerden devam et” aynı kahve sahnesine döner. “Bahçeye gidiyorum” ile konser sonuna ulaş.
4. Testte kafeyi, bahçeyi ve gitarı hatırla. Çay dalındaki Ben hakkında soru sorulmaz.
5. Yeniden oku; çay → birlikte öğrenme yolunu seç. Farklı anlatı ve ikinci son açılır. İlk bitiriş XP’si tekrarlanmaz.
6. Renkli kelimeyi kaydet; Kelimelerim’de kontrol et. Favori/seviye/kategori/süre/durum filtrelerini dene.

## Sınırlar

B1–C2 metinleri plan aşamasında. Başlangıç hikâyeleri kısadır. İllüstrasyonlar sahne temasına göre yeniden kullanılan özgün SVG’lerdir. Tek yapay ses kullanılır. Depolama temizlenirse yerel ilerleme kaybolabilir; çevrimdışı servis çalışanı, hesap ve cihaz eşitlemesi yoktur. Yerel kayıtlar sunucu tarafı hile önleme sistemi değildir.

## Tamamlanan doğrulama

- `npm test`: 86/86 başarılı; 16 hikâye testi dahil. Tüm 24 yol/son, geçersiz grafikler, kayıt geri yükleme, günlük öneri, tekil ödüller ve 156 WAV dosyasının gerçek PCM içeriği/süresi/hash değeri doğrulandı.
- `npm run lint`, `npm run typecheck`, `npm run build`: başarılı. Üretim derlemesi 110 statik sayfa oluşturdu.
- Mevcut sekiz ana rota ve altı hikâye rotası HTTP 200 döndü.
- Tarayıcı: gerçek sahne sesi, 0,65 hızda tek cümle sesi, gerçek sözlük telaffuzu, çeviri açma, kelime kaydı ve yenilemede korunması, favori filtresi, ikinci sahnede kaydet/çık/devam, kahve → bahçede konser sonu ve yalnızca bu yolun üç sorusu doğrulandı. %100 quiz sonucu yenilemede korundu.
- Mobil 390 px: okuyucu ve dört kartlı kütüphanede belge genişliği/scroll genişliği 375/375. Tablet 768 px: 753/753; masaüstü: 1265/1265. Yatay taşma yok. Geçici ekran boyutu ayarı sıfırlandı.
- Mevcut kullanıcı sekmeleri ve öğrenme/bahçe kayıtları temizlenmedi. Gerçek tarayıcı testi bir kafede konser sonu, bir favori ve Sonne sözlük kelimesi kaydetti; önceki ilerleme korunur.
