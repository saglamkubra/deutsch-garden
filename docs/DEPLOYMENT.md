> Son eklemeler, 010/011 SQL ve bildirim kurulumu: [REMAINING-SETUP.md](REMAINING-SETUP.md).

> Güncel Render Free seçeneği: [STATELESS-HOSTING.md](STATELESS-HOSTING.md). Aşağıdaki disk gereksinimi eski yerel backend içindir; doğrulanmış Supabase backend'i kalıcı web diski istemez. Geçiş/dağıtım henüz uygulanmadı.

# Deutsch Garden — yayın ve hediye teslimi

## Uygun barındırma
Mevcut Lumi SQLite kullanım kaydı ve doğum günü atölyesinin özel dosyaları kalıcı disk gerektirir. Bu sürümü tek örnekli Docker/Node 24 sunucusunda çalıştırın. Vercel sunucusuz işlevlerine aynen taşımak kalıcı kullanım sınırlarını ve atölye verisini korumaz; Vercel yayını yapılmış sayılmaz. Render uyumlu örnek yapılandırma kökteki render.yaml dosyasındadır. Bu dosya tek başına servis oluşturmaz. Proje seçmeden dağıtım başlatılmadı. Render kalıcı disk ücretli servis gerektirir: https://render.com/docs/disks

## Sıra
1. Profilim üzerinden mevcut cihaz verisini dışa aktarın. Yerel tarayıcı verisini ve .cache klasörünü silmeyin. Yayın adresi farklı bir origin olduğundan yerel 127.0.0.1 kaydı telefona kendiliğinden taşınmaz. Çalışan hesaba giriş ve onaylı yerel içe aktarım/buluta kaydetme ile taşıyın. Başarılı yükleme ve yeni cihaz kontrolüne kadar yedeği tutun.
2. Kullanıcının seçtiği özel Git deposuna kodu ekleyin; .env.local ve .cache dosyalarını yüklemeyin. .dockerignore bunları imaja dahil etmez. Docker imajı oluşturmak yayın değildir.
3. Render'da ilgili depoyu seçin, Docker web servisi, Node 24 tabanlı mevcut Dockerfile, tek örnek, /data mount edilmiş kalıcı disk kullanın. Disk node kullanıcısı UID 1000 tarafından yazılabilir olmalıdır. LUMI_DATA_DIR=/data/lumi, BIRTHDAY_DATA_DIR=/data/birthday mevcut Dockerfile'da ayarlanır. Ölçeklemeyi artırmayın. HTTP sağlık yolu /api/health yalnızca uygulama sürecini kontrol eder; Supabase ve Gemini sağlığı iddiası değildir.
4. Barındırıcının gizli ortam değişkenlerine aşağıdakileri girin. Anahtarları Git'e, sohbete veya ekran görüntüsüne koymayın. Build loglarında ortam dökümü çalıştırmayın.
5. Servis adresi belli olunca origin değişkenlerini gerçek HTTPS adresiyle, sonunda / olmadan ayarlayıp yeniden dağıtın. Telefon bu adresi kullanır; 127.0.0.1 bulut adresi değildir.
6. Supabase ayarları ve aşağıdaki doğrulama tamamlandıktan sonra hediyeyi etkinleştirin.

## Ortam değişkenleri
| Değişken | Gereksinim |
|---|---|
| SUPABASE_URL | Supabase proje kökü; /rest/v1 eklemeyin |
| SUPABASE_PUBLISHABLE_KEY | Publishable veya anon anahtarı; RLS zorunlu |
| SUPABASE_SERVICE_ROLE_KEY | İsteğe bağlı; yalnızca sunucuda yeniden parola doğrulamalı hesap silme. Boşken yönetici destekli silme yönergesi geçerli |
| LUMI_PROVIDER | gemini; openai isteğe bağlı alternatif |
| GEMINI_API_KEY | Google anahtarı, yalnızca sunucuda |
| GEMINI_MODEL | gemini-3.5-flash-lite; npm run lumi:verify ile erişimi kontrol et |
| LUMI_ACCESS_PASSWORD | Üretimde en az 12 karakter, öğreniciyle ayrı kanaldan paylaş |
| LUMI_SESSION_SECRET | Üretimde en az 32 karakter rastgele sır, yeniden dağıtımda koru |
| LUMI_APP_ORIGIN | Gerçek HTTPS adresi |
| ACCOUNT_APP_ORIGIN | Aynı gerçek HTTPS adresi |
| BIRTHDAY_CREATOR_PASSWORD | Atölye gerekiyorsa öğreniciden ayrı en az 12 karakter |
| BIRTHDAY_SESSION_SECRET | Boşsa Lumi sırrını kullanır; ayrıysa en az 32 karakter |
| BIRTHDAY_ACCESS_PASSWORD | Boşsa Lumi erişim parolasını kullanır |
| BIRTHDAY_APP_ORIGIN | Boşsa Lumi adresini kullanır |

Anahtar veya üretim parolası yoksa kurulum gerekli durumu doğrudur. OpenAI seçilmedikçe OpenAI anahtarı gerekmez. Gemini ve barındırma kullanımı ücret doğurabilir. Uygulama sınırları parasal garanti değildir; Google hesabında kota/bütçe de belirleyin.

## Supabase
Yeni boş veritabanında sırayla supabase/migrations altındaki 001_learning, 002_exercises, 003_grammar, 004_listening, 005_story_xp, 006_accounts_sync, 007_gamification SQL dosyalarını çalıştırın. Ardından supabase/seed.sql, grammar-seed.sql, listening-seed.sql. Dosyaların tam adları klasörde tarih önekiyle bulunur.
Mevcut projede tabloları yeniden oluşturmayın: 001–006 ve içerik SQL'leri kullanıcı tarafından daha önce uygulanmıştı. 007'nin uygulanması henüz doğrulanmadı. Eksik dosyayı belirleyip yalnızca onu çalıştırın; 'already exists' alınca tablo silmeyin. Önce yedek alın. 16. adım yeni migration gerektirmiyor.

Auth > Sign In / Providers: Email açık; e-posta doğrulama tercihine göre açık. Gerçek SMTP ve gönderici adresini ayarlayın; Supabase'in test e-posta kotası gerçek teslimat için yeterli olmayabilir. Auth > URL Configuration: Site URL gerçek HTTPS adresi; Redirect URLs listesine tam /hesap/dogrula ve /hesap/sifre-guncelle yollarını ekleyin. Yerel geliştirme adreslerini ayrıca tutabilirsiniz. Gelen e-postadaki yönlendirmeyi gerçek cihazda test edin.

RLS SQL politikaları ve PGlite izolasyon testleri mevcut. Canlı projenizde supabase/verify-production.sql dosyasını SQL Editor'de çalıştırın: salt okunurdur, veri değiştirmez. true RLS tek başına yeterli değildir; kullanıcıya özel koşulları ve anon yazma izinlerini de inceleyin. Test iki ayrı gerçek kullanıcıyla sonlandırılmalıdır. SQL Editor yönetici rolü RLS kullanıcı testinin yerine geçmez.

## Komutlar
- npm ci
- npm test
- npm run lint
- npm run typecheck
- npm run build
- npm run start -- --port 3001 (yerel üretim denemesi)
- npm run qa:http -- http://127.0.0.1:3001
- docker build -t deutsch-garden .
- docker run --rm -p 3000:3000 --env-file .env.local -v deutsch-garden-data:/data deutsch-garden
Docker imajı için ortam dosyasındaki üretim origin değerleri açılan adresle eşleşmelidir. Yerel Lumi üretim parolası yoksa üretim önizlemesinde AI kapalı görünür; geliştirme bağlantısını bozmak için .env.local değiştirilmez.

## Canlı kabul listesi — tamamlanmadan teslim edildi demeyin
- HTTPS URL /api/health 200; npm run qa:http -- https://GERCEK-ADRES hata vermiyor.
- Kayıt, doğrulama e-postası, giriş, tarayıcıyı kapatıp açınca oturum, çıkış, parola yenileme.
- Ayrı kullanıcı B, A'nın günlüğüne, sohbetine, profiline ve envanterine erişemiyor.
- Yerel içe aktarım yalnızca onayla; ikinci cihazda aynı seviye, XP, çiçekler ve bakiyeler; eski yerel yedek korunuyor.
- A1 günlük kelime, alıştırma, gramer, dinleme, hikâye; ödüller bir kez; tohum satın al, dik, sula; günlük kutuyu bir kez aç; yeniden girişte aynı durum.
- Almanca günlük yazma henüz uygulanmadı. Bu adımı tamamlandı olarak işaretlemeyin.
- Lumi parolasıyla gerçek mesaj gönder, doğrulanmış Almanca yanıt/Türkçe açıklama al; kota/yeniden deneme durumu anlaşılır. Telefon mikrofonu yalnızca izin verilince ve destek varsa; telaffuz puanı yok.
- Android Chrome ve iPhone Safari gerçek cihazlarda yükle/ana ekrana ekle, ses çal/durdur, bahçe dokunma, sohbet klavyesi ve modalı dene. Boyut emülasyonu gerçek cihaz testi değildir.
- Uçak modunda yalnızca genel bağlantı ekranı; özel önceki kullanıcı sayfası önbellekten açılmıyor. Çevrimdışı öğrenme/eşitleme vaat edilmez.
- src/config/birthday-welcome.ts içindeki gerçek ad, mesaj, imza ve enabled:true; yeniden build/deploy; ilk girişte bir kez hediye, profilden tekrar izleme. Atölye mektubu ayrıca kullanılacaksa yerel .cache/birthday/config.json özel yedeğini kalıcı diske güvenle taşı veya atölyeden yeniden hazırla; otomatik Git'e yükleme yok.
- Sunucuyu yeniden başlatınca Lumi kullanım kaydı ve atölye mektubu korunuyor. /data ve Supabase yedekleri; sırlara erişim sınırlı. Diskli tek servis güncellemesinde kısa kesinti olabilir.

## PWA sınırları
Manifest, özgün PNG ikonlar (192/512, maskable ve Apple 180), standalone, tema rengi, yalnızca üretimde service worker. Önbellek sadece genel offline.html ve ikonlar. HTML sayfaları her zaman ağdan no-store; API, RSC, diğer origin ve ses dosyaları SW tarafından tutulmaz. Güncelleme mevcut sayfayı zorla yenilemez. iOS kurulum/izin desteği işletim sistemi sürümüne bağlıdır. Push bildirim gönderimi yok; tercihi saklamak gönderim değildir.
