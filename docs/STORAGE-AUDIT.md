# Durumsuz barındırma — mevcut depolama denetimi

28 Ekim 2026. Runtime src altında dosya/SQLite erişimleri ile localStorage, sunucu oturumları ve içerik üretim araçları incelendi. Canlı Supabase veritabanı bu çalışma sırasında sorgulanmadı veya değiştirilmedi. Aşağıdaki yerel kayıt incelemesi salt okunur; özel mektup, anahtar, çerez ve konuşma içeriği çıktıya yazılmadı.

| Mevcut konum | Amaç / kapsam | Özel veri? | Yeniden başlatmada korunmalı mı? | Yeni durum |
|---|---|---|---|---|
| .cache/lumi/usage.sqlite (ve WAL/SHM), LUMI_DATA_DIR ile değişebilir | lumi_conversations: sahiplik kimliği, ayarlar, bağlam hash, tur/karakter/zaman ve bekleyen istek | Evet, konuşma metni değil ama kullanım metadata'sı | Evet; sahiplik ve akış doğrulaması | dg_server_state / lumi-ledger-v1 |
| Aynı SQLite, lumi_calls | İstek kimliği/hash/durum, tekrarlı ücretli çağrı engeli | Evet | Evet; yeniden başlatma tekrar üretim izni vermemeli | Aynı atomik Postgres kaydı |
| Aynı SQLite, lumi_usage | Oturum ve uygulama genelinde dakika/gün sınırları | Evet | Evet | Aynı atomik Postgres kaydı |
| Aynı SQLite, lumi_awards | Günlük tek gerçek Lumi pratiği ödül makbuzları | Evet | Evet, süresiz tekrar engeli | Aynı kayıtta korunur |
| Aynı SQLite, lumi_access_attempts | Parola deneme sınırı | Zaman metadata'sı | Evet | Aynı kayıtta korunur |
| .cache/lumi/session-secret | Yerelde oluşturulmuş HttpOnly oturum ve ödül imza sırrı | Kritik sır | Evet; rastgele yeniden üretme kimliği bozar | Aynı değer LUMI_SESSION_SECRET ortamında; yedeğe değer yazılmaz, hash ile eşleşme denetlenir |
| .cache/birthday/config.json, BIRTHDAY_DATA_DIR ile değişebilir | Etkinlik ID/revizyon, tarih, adlar, özel mektup | Evet | Evet | dg_server_state / birthday-config-v1, sadece yetkili atölye API'si |
| .cache/birthday/session-secret | Atölye/alıcı oturum imzası | Kritik sır | Evet | Aynı BIRTHDAY_SESSION_SECRET; mevcut Lumi fallback önceliği korunur |
| BirthdayServer.attempts RAM listesi | Ortak atölye/alıcı parola denemeleri | Zaman metadata'sı | Evet, koruma yeniden başlamayla sıfırlanmamalı | birthday-access-v1. Önceki RAM denemeleri dışa aktarılamadığından kesimde 15 dakikalık güvenli bekleme başlatılır |
| LumiService.cache RAM, 2 dakika | Son AI yanıtının kısa süreli tekrar kopyası | Evet | Hayır; tam metnin gereksiz kalıcı kopyası oluşturulmaz | Kaybolunca RETRY_EXPIRED; kalıcı tamamlanmış istek tekrar AI üretmez. Yanıt geçmişi tarayıcı/hesap kaydında kalır |
| Gemini model kontrolü RAM, 15 dakika | Model erişimi metadata önbelleği, anahtar hash ile indeksli | İç kimlik | Hayır, yeniden doğrulanabilir | Değişmedi; cold start model doğrulaması yapabilir |
| Sunucu singleton'ları / eski yerel dosya kilitleri | İşlem içi koordinasyon | Özel içerik geçici bulunabilir | İçerik değil; eşzamanlılık garantisi süreç dışında olmalı | Postgres revizyon/CAS ve transaction advisory lock. Eski yerel mod aynen mevcut |
| Tarayıcı deutsch-garden:* ve hesap UUID ad alanları | Profil, CEFR, günlük atama, kelime, quiz, gramer, dinleme, hikâye, mini ders, Lumi metin geçmişi, bahçe, para, tohum, süs, alışveriş, günlük kutu, doğum günü anıları, XP/rozet | Evet | Evet | Render diskiyle ilgisiz. Mevcut user_progress belgesi, CAS, RLS ve açık onaylı yerel içe aktarım korunur |
| Tarayıcı Auth oturumu, pending-sync ve arşiv kayıtları | Oturum, kopan aktarım, geri dönüş/yedek | Evet, Auth token kritik | Evet | Değişmedi; tarayıcı temizlenmedikçe durur. Supabase hesap kaydıyla diğer cihazdan yüklenir |
| user_progress, progress_archives, progress_sync_receipts ve mevcut Supabase özel tabloları | Bulut öğrenme kaydı, arşiv ve işlem idempotansı; diary_entries ayrı özel tablo | Evet | Evet | 001–007 değiştirilmedi. 009 yalnızca yeni kalıcı ödül makbuz tablosu ve atomik yazma tetikleyicisi ekler |
| src/config/birthday-welcome.ts | Sürüm kontrollü varsayılan ilk ziyaret mesajı/opt-in ayarı | Şu an genel varsayılan, ad boş | Derleme kaynağında bulunur | Değişmedi. Özel kişisel mektubu Git'e yazmak yerine korunan atölyeyi kullanın |
| src/data JSON, public/audio ve SVG/PNG | Özgün ders/içerik ve hazır sesler | Hayır | Dağıtım artefaktında bulunmalı | Postgres'e gereksiz kopyalanmaz; Render yeniden imajla getirir |
| scripts/* içerik/SQL/ses üretimi; .cache/listening-model, listening-tts, listening-build | Geliştirme araçları, model dosyaları ve geçici üretim çıktıları | Özel kullanıcı kaydı değil | Çalışma anında gerekmez | Docker .cache'i dışlar; public/audio dosyaları korunur |
| .cache/birthday-qa-* gibi eski test dizinleri | Test artefaktları | Sahte test içeriği olabilir | Üretim verisi sayılmaz | Silinmedi; otomatik gerçek mektup olarak içe alınmaz |
| .next ve PWA genel offline/ikon önbelleği | Yeniden oluşturulabilir framework/arayüz önbelleği | Özel içerik önbelleğe alınmaz | Hayır | Ephemeral kalabilir; PWA API/kişisel sayfaları tutmaz |
| .env.local ve barındırıcı ortamı | Gemini, Supabase, erişim parolaları ve oturum sırları | Kritik sırlar | Değerleri barındırıcıda sabit tutulmalı | .env.local değiştirilmedi, Git/imaj dışı; yeni anahtar yalnızca sunucu ortamına eklenir |

## Bu çalışma anındaki yerel durum
LUMI_DATA_DIR ve BIRTHDAY_DATA_DIR için özel override yok; varsayılan .cache dizinleri kullanılıyor. Yerel SQLite salt okunur kontrolünde 6 konuşma metadata'sı, 15 istek, 19 kullanım satırı, 0 ödül ve 0 erişim denemesi bulundu. Bunlar o andaki sayılardır; uygulama kullanıldıkça değişebilir. SQLite ana dosyası 40.960 bayt; WAL içeriği ayrıca bulunabilir, bu yüzden kopyalamak yerine tutarlı SQLite okuması kullanılmalı.

Varsayılan atölye dizininde config.json bulunmadı; session-secret mevcut. Bu, dosyanın bu çalışmada silindiği anlamına gelmez: hiçbir mevcut dosya silinmedi. Tarayıcı/bulut doğum günü anıları ve kaynak varsayılan mesaj ayrı yerlerdir; onlara dokunulmadı. Başka bir yedek veya dizindeki mektup varsa operatör onu ayrıca seçmeli; test dizinleri otomatik taranıp yüklenmez.

Yeni SUPABASE_SERVER_SECRET_KEY ve mevcut SUPABASE_SERVICE_ROLE_KEY boş/eksik. Bu nedenle gerçek Postgres sunucu deposuna geçiş veya özel kayıt yüklemesi yapılmadı. Mevcut publishable hesap ve Gemini ayarları korunuyor.

## Paketleme denetiminde düzeltilen risk
Next standalone tracing, eski node:fs erişimlerinden .cache içindeki SQLite ve session-secret dosyalarını yerel derleme kopyasına dahil edebiliyordu. Henüz yayın yoktu; tarayıcı paketinde mevcut sır bulunmadı. next.config.ts tracing excludes eklendi; qa:package özel .env/.cache/SQLite/DB dosyası veya bilinen sır değeri görürse başarısız olur. Docker build de bu kontrolle kapatıldı. Orijinal .cache kayıtları silinmedi.

Son paketleme doğrulaması başarılı: özel dosya sayısı 0, tarayıcı paketinde bulunan mevcut sır değeri sayısı 0.
