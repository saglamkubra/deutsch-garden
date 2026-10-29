# Deutsch Garden — 7. adım: Dinleme Kulübüm

## Çalışan içerik ve dürüst sayılar
- A1: 10 oynatılabilir özgün mini dinleme.
- A2/B1/B2/C1/C2: 0 oynatılabilir; sırasıyla 7/7/6/5/5 konu planı.
- 65 Almanca cümle ve Türkçe çeviri.
- 10 anlama mini testi, toplam 50 doğrulanan soru.
- 10 tam bölüm WAV dosyası + mevcut kelime deposundaki 60 kelime için telaffuz WAV'ı.
- Toplam bölüm sesi yaklaşık 126 saniye; bölümler dosya hızında 9–18 saniyelik kısa alıştırmalardır. Varsayılan yavaş oynatma ile daha uzun sürer.
- Profesyonel podcast, insan kaydı veya bütün CEFR seviyeleri için tamamlanmış kütüphane iddiası yoktur.

Hazır A1 dinlemeleri: Merhaba, ben Elif; Benim küçük ailem; Birlikte güne başlayalım; Kafede küçük bir mola; Pazardan çantama; Saat kaç, günlerden ne?; Bahçede bir hafta sonu; Güneşten yağmura; Sınıfımda bir gün; Birlikte öğrenelim.

## Sesin kaynağı ve yeniden üretimi
Bütün metinler, çeviriler ve sorular bu proje için özgün hazırlanmıştır. Haricî podcast kopyalanmadı ve hayalî ses URL'si oluşturulmadı.

Piper 1.8.0 ve de_DE-thorsten-medium modeliyle sesler yerel olarak üretildi:
- [Piper resmî Python API](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/API_PYTHON.md)
- [Thorsten model kartı](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD): Almanca de_DE, 22.050 Hz, veri kümesi lisansı CC0 olarak belirtilir.
- Motor GPL-3.0'dır; motor/model .cache/ içinde yalnızca üretim aracıdır. Next.js çalışma zamanına veya public çıktısına eklenmez.
- public/audio/deutsch-garden/README.md kaynak bilgisini içerir.

Mevcut WAV dosyalarıyla uygulamayı kullanmak için Python, ses modeli veya API anahtarı gerekmez. npm ci ve npm run dev yeterlidir. scripts/generate-listening-audio.py isteğe bağlı yeniden üretim aracıdır; .cache/listening-tts altında Piper, .cache/listening-model altında model/config bekler. Model:
https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx
ve aynı URL'nin .onnx.json eşleniğidir.

Üretim aracı her cümleyi ayrı üretir, gerçek PCM örnek sayısıyla başlangıç/bitişini ölçer ve küçük aralıklarla tek WAV'da birleştirir. Süre ve SHA256 değerleri src/data/listening/audio-manifest.json içindedir. Cümle sınırları gerçek dosya parçalarına dayanır; kelime zamanlaması iddiası yoktur. Windows'ta Unicode kullanıcı adları için eSpeak verisine göreli ASCII yol kullanılır.

## Arayüz ve oynatıcı
/dinleme-kulubu: öne çıkan ders, günlük öneri, altı düzey, dokuz kategori, arama, süre/durum/favori filtreleri, son dinlenenler, tamamlanma ve ilerlemeye göre basit öneriler.
/dinleme-kulubu/[episode]: gerçek HTMLAudioElement ile oynat/duraklat, baştan dinle, kaynak konumu kaydırma, 0,65/0,85/1/1,25 hızları, ses aç/kapat ve tarayıcının desteklediği ses düzeyi.

Otomatik oynatma yapılmaz. Yeni sayfa açılması veya transkripti okumak dinlenmiş kabul edilmez. Konum son kayıt noktasından devam eder. Ses ayarı bazı mobil işletim sistemlerinde cihazın kendi düğmeleri tarafından yönetilebilir.

Dosya yüklenemezse yeniden yükleme ve açıkça etiketlenmiş browser speech synthesis yedeği sunulur. Cihazda Almanca ses yoksa Türkçe açıklama gösterilir; kayıtlı WAV'ların çalınması buna bağlı değildir. Yedek ses gerçek utterance onstart/onend olaylarıyla cümle bazında ilerler; dosyanın saniyeleriyle sahte eşzamanlama yapmaz. Desteklenmeyen cihaz sesini tamamlanmış saymaz. Duraklat/devam, yeniden oynatma, hız ve iptal akışları ayrı test edilir.

## Transkript ve kelimeler
Metin göster/gizle, isteğe bağlı Türkçe çeviri, cümle bazında düzen, seçili cümle vurgusu ve cümle yeniden oynatma vardır. Dosya çalarken kaynak zamanı gerçek cümle aralıklarıyla karşılaştırılır. Cihaz sesi yedeğinde yalnızca gerçekten başlayan cümle vurgulanır.

İşaretli sözcükler mevcut VocabularyRepository üzerinden açıklanır; çekimli biçimler açıkça tanımlı lemma bağlantılarıyla bulunur. Anlam için erişilebilir native dialog açılır; Escape ve kapatma düğmesi çalışır. Sözcüğün anlamı, örneği, çoğulu, kayıtlı telaffuzu ve kart bağlantısı vardır.

“Tekrarıma ekle”:
1. Mevcut öğrenme deposundaki sözcüğü tekrar planına alır.
2. Eski yanıtları, biliniyor durumunu, seri ve yanıt sayısını silmez; yalnızca tekrar tarihini öne çeker. Bugün yanıtlandıysa en erken yarın hedeflenir.
3. Aynı kelimeyi savedWords listesine ikinci kez eklemez.
4. /kelimelerim#dinleme-tekrari içinde gösterir.
5. /kelimelerim/[word] mevcut Flashcards bileşeniyle karşılık gelen gerçek kartı açar. Yanıtlar mevcut 1/3/7/14/30 günlük SRS kuralını kullanır; bu bağımsız tekrar ek kaynak ödülü üretmez.

Yeni bir kopya kelime veritabanı kurulmadı; eski günlük yeni kelime atamaları değiştirilmez.

## Günlük öneri
Atama tarayıcının yerel takvim günü + seçili dinleme düzeyi anahtarıyla saklanır. Başlangıç düzeyi mevcut öğrenme düzeyinden gelir; dinleme düzeyi seçimi onu değiştirmez.

Henüz tamamlanmamış ve son testinde zorlanılmış içerikler öncelik alır. Tarih ve kararlı bölüm kimliği deterministik sıralama sağlar. Önceki günkü bölüm, birden fazla uygun içerik varsa tekrar seçilmez. Aynı gün sayfa yenilemek, bölümü bitirmek veya yeni bir yer imi eklemek atamayı değiştirmez. Havuz tek içerikse tekrar mümkündür; havuz boşsa atama null olur ve açıklama gösterilir. Kullanıcının sistem saati değiştirilmez.

## Gerçek dinleme kaydı ve ödüller
Dinleme ilerlemesi, gerçekten yürüyen, sessize alınmamış ve ses düzeyi sıfır olmayan oynatıcının ardışık zaman aralıklarından yaklaşık çeyrek saniyelik kutularla toplanır. Otomatik eklenen cümle arası sessizlik payları başarı hesabının dışında kalır. İleri/geri sarma aralıkları dinlenmiş sayılmaz. Native timeupdate örneklemesi nedeniyle tam çalma bazen %99 gibi bir alt sınır gösterebilir; sahte %100 yazılmaz. Cihaz sesi yedeğinde yalnızca onend ile biten cümleler sayılır.

Tamamlanma için:
- Ses bölümlerinin en az %90'ı dinlenmiş olmalı.
- Tamamlanmış beş soruluk testte en az dört doğru (%80) olmalı.

Tek başına doğru test veya dosyanın sonuna atlamak tamamlanma üretmez. Tekrar denemeleri ayrı kimlik ve soru anlık görüntüsüyle saklanır; aynı soruya ikinci kez yanıt verilmez. Hatalar kaynak veya kalp kaybettirmez. Türkçe geri bildirim ve beklenen yanıt gösterilir.

Merkezî REWARDS.listening:
- Bir dinlemenin ilk gerçek tamamlanması: 15 XP + 10 mevcut bahçe parası.
- Her üç farklı tamamlanan dinlemede: 1 lavanta tohumu.
- Kimlikler listening:episode:* ve listening:milestone:*; tekrar dinleme/yenileme tekrar ödül vermez.
- XP mevcut alıştırma/gramer defterine deliverLearningXp ile yazılır. deliverGrammarXp uyumluluk bağlantısı korundu.
- Bahçe mevcut deliverGardenReward makbuzlarını kullanır; çiçekler/süsler/para sıfırlanmaz.
- Önce ilerleme ve ödül niyeti saklanır. XP + bahçe yazımı başarıyla bitince aktarım onaylanır; aradaki kapanmada tekil kimlikler mükerrer ödemeyi engeller.
- Yeni su damlası ekonomisi eklenmedi; mevcut sınırsız su ve çiçek başına sulama katkısı korunur. Günlük öneri ayrıca sahte bir su kaynağı üretmez.

Bu yerel bir uygulamadır; depolama verisi güvenilir sunucu doğrulaması veya hile önleme garantisi değildir.

## Kayıt ve veritabanı
İçerik: src/data/listening/episodes.json + audio-manifest.json. Kullanıcı verisi: deutsch-garden:listening:v1. İlerleme, duyulan aralıklar, son konum, test denemeleri, favoriler, kaydedilmiş kelime kimlikleri, günlük atamalar ve ödül kuyruğu saklanır.

Mevcut düzenle aynı :backup/:corrupt koruması, sürüm doğrulama ve erişilemeyen depolamada salt okunur kip vardır. Destek varsa Web Locks ile en son kayıt yeniden okunarak yazılır; sekmeler storage olayıyla eşitlenir. Gönderilmemiş cevap taslakları kaydedilmez. Cihazlar arası eşitleme yoktur.

Supabase bağlı değildir. supabase/migrations/202610270004_listening.sql 12 tablo hazırlar:
listening_categories, listening_episodes, listening_audio_assets, listening_transcripts, listening_questions, listening_question_answers, listening_progress, listening_quiz_attempts, listening_favorites, listening_daily_assignments, listening_saved_vocabulary, listening_reward_claims.

Doğru yanıtlar service_role'a özeldir. Katalog okunabilir; kullanıcı verisinde kendi kaydını okuma, favori/kelime listesinde kendi kaydını ekleme/silme politikaları vardır. Uzak ilerleme/ödül yazımı güvenilir sunucu işlemi ister. Migration uygulanmadı; SQL/RLS çalışma zamanı doğrulaması yapılmış sayılmaz.

npm run db:listening:generate yalnızca supabase/listening-seed.sql ve reports/listening-counts.json dosyalarını üretir. Veritabanına bağlanmaz. Seed 40 içerik satırı (10 hazır + 30 plan), 70 gerçek ses varlığı, 65 transkript, 50 soru ve 50 kabul edilen yanıt kaydı içerir.

## Kontroller ve kalan sınırlar
Otomatik testler: gerçek WAV başlığı/sessiz olmaması/SHA256/süre, cümle aralıkları, kelime bağlantıları, 50 sorunun tek doğru karşılığı, günlük sabitlik ve ertesi gün dönüşü, filtre/favori, oturum geri yükleme, kelime tekrarının eski ilerlemeyi koruması, ödül tekilliği, üç-dinleme tohumu, cihaz sesi desteği, oynat/duraklat/devam/yeniden oynat ve hız akışları.

Tarayıcıda dosya oynatma, duraklatma, hız değişikliği, yeniden oynatma, transkript/çeviri, kelime dialogu ve gerçek kelime kartına geçiş kontrol edilir. Gerekli son kontroller: npm test, npm run lint, npm run typecheck, npm run build.

A2–C2 tam sesli dersler, dış podcast bağlantıları, farklı konuşmacı sesleri, kullanıcı hesabıyla uzak eşitleme ve sunucu adaptörü sonraki içerik/altyapı işleri olarak kalır. Hiçbir dış anahtar yerel ses dinlemeyi engellemez. AI konuşma asistanı, dükkân veya günlük eklenmedi. 8. adıma başlanmadı.

Son doğrulama: 70/70 test, lint, TypeScript ve üretim derlemesi başarılı. 18 rota HTTP 200; ses dosyası byte-range isteği HTTP 206/audio-wav döndü. Telefon 375/375 ve tablet 753/753 piksel ölçümlerinde yatay taşma yok. Tarayıcıda oynat/duraklat, hız, yeniden dinleme, gerçek cümle vurgusu, çeviri, kelime kaydı/kart bağlantısı ve mini testle tamamlanma doğrulandı; son konsol hata/uyarı kaydı boştu.
