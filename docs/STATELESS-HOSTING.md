# Render Hobby + Free Web Service — hazırlık, henüz dağıtım yok

Bu aşama kod ve SQL hazırlığıdır. Canlı Supabase'e yazılmadı, özel mektup/kullanım kayıtları otomatik yüklenmedi, Render servisi oluşturulmadı. 001–007 uygulanmış mevcut projeyi kullanırız; bu dosyalar değiştirilmedi. Yerel çalışma .env.local değiştirilmeden eski depoyla sürer.

## Mimari
- SERVER_STORAGE=supabase: yalnızca yeni, tarayıcıya kapalı dg_server_state tablosu Postgres'te kalıcı sunucu metadata'sını ve atölye config'ini tutar. 3 sabit anahtar: lumi-ledger-v1, birthday-config-v1, birthday-access-v1.
- Lumi'nin doğrulanmış kurallarını kopyalamamak için mevcut SQLite state machine yalnızca :memory: üzerinde çalıştırılır. Bu, kalıcı SQLite dosyası veya Render diski değildir. Her mutasyonda Postgres sürümü okunur, aynı kurallar uygulanır ve CAS ile tek atomik yazma denenir. Yanıt gelmeden önce rezervasyon Postgres'te kesinleşir; provider çağrısı açık bir DB transaction içinde bekletilmez.
- Ayrı süreçlerin eşzamanlı yazıları Postgres transaction/advisory lock + expected revision ile sıralanır. En fazla 12 CAS çakışma denemesi, ağda aynı işlem kimliğiyle en fazla bir tekrar. Hata halinde ödeme/kota koruması kapatılmaz ve diske fallback yapılmaz.
- Güncel Lumi sınırları: oturum 3/dakika, 400/gün; uygulama 10/dakika, 450/gün. Tur, bağlam, token, model ve Gemini SDK entegrasyonu değişmedi. Bütçe takvimi İstanbul; aynı uygulamanın tüm istekleri tek kalıcı kayıt üzerinden değerlendirilir.
- 009, user_progress kaydının mevcut atomik CAS işlemine yeni kalıcı makbuz koruması bağlar: gift:daily:*, birthday:* ve lumi:daily:*. Bakiye/envanter ve makbuz aynı transaction'da değişir; eski snapshot'a dönüp aynı makbuzu tekrar eklemek reddedilir. Önceden alınmış bulut makbuzları yalnızca yeni tabloya kaydedilir; user_progress yeniden yazılmaz.
- Mevcut kullanıcı verisi mevcut user_progress/profile/diary/RLS sistemiyle kalır. Atölye bir aile/uygulama için ortak özel konfigürasyondur, her Supabase kullanıcısına ayrı mektup servisi oluşturulmadı. Kurucu parolası, signed HttpOnly cookie ve origin kontrolü aynen korunur. Lumi konuşma sahipliği mevcut imzalı oturum kimliğiyle doğrulanır; uygulama geneli sınır çerez değiştirerek aşılamaz.

## Güvenlik ve yeni ortam değişkenleri
| Değişken | Değer / amacı |
|---|---|
| SERVER_STORAGE | Render Free için supabase. Yerelde local veya boş. Üretimde boş/yanlış değer güvenli biçimde hizmeti kapatır |
| SUPABASE_SERVER_SECRET_KEY | Supabase secret key (sb_secret_...) veya legacy service_role; yalnızca sunucuda. Boşsa mevcut SUPABASE_SERVICE_ROLE_KEY fallback'i kullanılabilir |
| SERVER_LOCAL_DISK_CONFIRMED | Yalnızca eski kalıcı diskli yerel üretim için true. Free modda boş bırakılır; local seçilse bile bu onay yoksa üretim reddeder |

SUPABASE_URL, publishable anahtarı, GEMINI_API_KEY, GEMINI_MODEL, LUMI_PROVIDER, origin, erişim parolaları ve oturum sırları mevcut adlarıyla sürer. GEMINI_MODEL=gemini-3.5-flash-lite korunur. Yeni Supabase sunucu anahtarı normal kullanıcı SDK'sına verilmez; yeni değişkene verilmesi mevcut isteğe bağlı hesap silme anahtarını gereksiz yere açmaz.

Secret/service-role RLS'yi aşabilir; bu yüzden frontend'de, NEXT_PUBLIC_* altında, Git'te veya loglarda bulunamaz. Sunucu RPC'leri yalnızca service_role için; anon/authenticated tablo/RPC erişimi yok. API'ler ayrıca kendi parola/signed-cookie/origin yetkilerini denetler. Kullanıcıya ait kalıcı ödül makbuzları yalnızca auth.uid=user_id ile okunabilir, doğrudan yazılamaz. Referans: https://supabase.com/docs/guides/getting-started/api-keys

Oturum sırlarını rastgele yenileriyle değiştirmeyin: .cache/lumi/session-secret ve .cache/birthday/session-secret içindeki mevcut etkin değerler, bu özellikler için ortamda sabitlenmeli. Zaten ortamda sır varsa dosyadan önce o değer geçerlidir. Araç yedeğe sırları koymaz, yalnızca SHA256 parmak izlerini ekler; içe aktarmada aynı değerleri doğrular. Eski cookie/ödül doğrulamasını bozacak farklı değerle import reddedilir. Sırları bu sohbete göndermeyin.

## Yeni dosyalar ve değişen entegrasyon
- src/lib/server-state/store.ts: ayrı yetkili sunucu istemcisi, kapalı üretim davranışı, RPC/CAS.
- src/lib/server-state/backup.ts: özel yedek biçimi, bütünlük ve oturum sırrı eşleşmesi.
- src/lib/lumi/cloud-ledger.ts: Postgres ile mevcut bellek içi kuralların bağlanması.
- src/lib/birthday/cloud-repository.ts: kalıcı mektup/revizyon ve parola deneme sınırı.
- src/lib/lumi/ledger.ts, service.ts, runtime.ts ve api/lumi/chat: async depo portu, yerel seçeneği koruma; tamamlanmış istek başarısız ack yüzünden failed olarak geri çevrilmez.
- src/lib/birthday/server.ts, runtime.ts: ortak doğrulama ve isteğe bağlı bulut repository; eski JSON sınıfı duruyor.
- src/lib/account/errors.ts: daha önce alınmış ödül çakışması için anlaşılır Türkçe hata.
- scripts/server-storage.ts: yalnızca operatörün açık komutuyla export/import/verify/export-cloud/restore-local.
- Yeni SQL: 008, 009 ve salt okunur verify-stateless.sql.
- package.json test ve aktarım komutları; yeni stateless/backup testleri, Lumi async test uyarlaması; .env.example, .gitignore, .dockerignore, render.yaml, render-disk.yaml ve belgeler.
- next.config.ts özel dosyaları standalone trace dışına alır. scripts/verify-package.ts ve qa:package, .env/.cache/SQLite/DB veya bilinen sır değerinin dağıtım/tarayıcı paketine girmesini engeller; Dockerfile bu kontrolü build kapısı olarak çalıştırır.
- Yeni runtime bağımlılığı yok. Dockerfile Node 24 ve standalone olarak kalır; cloud modda /data kullanılmaz. render.yaml Free ve disksizdir; eski ücretli disk örneği render-disk.yaml olarak korundu. Bunlar dağıtım gerçekleştirmez.

## SQL Editor için sıra — onay olmadan otomatik uygulanmaz
Her dosya ayrı bir işlem olarak ilerletilir. Önce yerel yedeği ve mevcut öğrenme JSON yedeğini güvenle saklayın. Sonra:
1. Yeni SQL Editor sorgusuna supabase/migrations/202610280008_stateless_server.sql dosyasının tamamını koyup Run. Yeni özel sunucu tablosu ve iki RPC oluşturur. 001–007'yi yeniden çalıştırmayın. 008, user_progress veya mevcut bahçeyi değiştirmez.
2. İlk dosyanın Success sonucunu teyit ettikten sonra yeni sorguda supabase/migrations/202610280009_reward_claim_guards.sql. Yeni makbuz tablosunu oluşturur, mevcut bulut makbuzlarını oraya kopyalar, user_progress üzerinde koruma tetikleyicisi ekler. Mevcut bakiye/tohum/XP'yi sıfırlamaz veya değiştirmez.
3. İkinci Success sonrası supabase/verify-stateless.sql: salt okunur kontrol. dg_server_state, dg_permanent_claims ve user_progress için RLS true. anon/authenticated için server_read/server_update/server_cas false. direct_reward_insert authenticated için false. service_role ayrıcalıkları true. Makbuz politikası auth.uid=user_id; dg_server_state için client politikası olmaması bilinçlidir. Tetikleyici adı dg_preserve_reward_claims, tgenabled=O. Mevcut oyun sürümü 14 kalır; bu 009'un numarası değildir.
4. Henüz veri aktarılmadığından dg_server_state kayıt sayısı 0 olabilir: normaldir. Bu aşamada uygulamayı supabase moduna çevirmeyin. Import/verify sonrasında üç kayıt ve revision>=1 beklenir. SQL Editor'de payload veya mektup dökümü çalıştırmayın.

Migration'lar tekrar çalıştırılacak şekilde DROP/yeniden oluşturma içermez. already exists olursa tablo silmeyin, hangi işlemin tamamlandığını kontrol edin. Şema değişiklikleri canlı projede yalnızca sizin onayınızla yapılmalı.

## Açık ve geri alınabilir yerel aktarım
Aşağıdaki komutlar bu çalışma sırasında gerçek kayıtlar için çalıştırılmadı. Durdurulmuş kaynakla aynı noktadan yedek alınmalıdır. WAL dosyasını ayrı kopyalayıp tutarsız DB üretmeyin; araç salt okunur SQLite transaction ile beş tabloyu birlikte okur.

İlk yerel yedek (buluta veri göndermez):

    npm run server:storage -- export-local --out .cache/server-backups/render-free-oncesi.json

Kaynak .env.local, SQLite ve JSON üzerinde yazma yapmaz. Önceden aynı isimde yedek varsa üzerine yazmaz; farklı ad seçin. Kullanılan LUMI_DATA_DIR/BIRTHDAY_DATA_DIR override varsa onları okur. Gerçek bir SQLite hiç oluşturulmamış yeni kurulumda ancak bunu doğruladıktan sonra --allow-empty-lumi eklenebilir; mevcut bozuk DB'yi boş saymaz. Atölye config.json yoksa açık null config yedeklenir, başka test dizinleri aranmaz. Önceden sadece RAM'de olan atölye denemeleri için kesimde güvenli 15 dakikalık bekleme kaydı eklenir.

Yedek, ad/mektup ve özel kullanım metadata'sı içerebilir; Git'e, bu sohbete veya public klasörüne koymayın. .cache ve *.sqlite/*.db imaj/Git dışında tutulur. Yedek hash'i ve şeması importtan önce denetlenir. Gerçek kaynaklarda export bu çalışma sırasında yapılmadı; yalnızca sentetik test dosyaları kullanıldı.

008/009 onaylanıp doğrulanınca, aynı oturum sırları ve yetkili Supabase anahtarı yalnızca yerel sunucu ortamına girilir. Mevcut sunucuyu durdurun veya yeni Lumi/atölye yazısı yapılmayacağından emin olun; kesim yedeğinden sonra aynı anda yerel ve bulut yazıcı çalıştırmayın. İşlemi açıkça onaylamadan şu komutları ÇALIŞTIRMAYIN:

    npm run server:storage -- import --file .cache/server-backups/render-free-oncesi.json --project-ref GERCEK_PROJE_KIMLIGI --confirm-private-import --confirm-source-stopped
    npm run server:storage -- verify --file .cache/server-backups/render-free-oncesi.json --project-ref GERCEK_PROJE_KIMLIGI

Import yalnızca boş hedef anahtarları oluşturur. Hedefte aynı veri varsa güvenle devam eder; farklı veri varsa üzerine yazmaz. Üç anahtar tek büyük işlem yerine ayrı CAS ile taşınır; yarıda kesilirse aynı yedekle tekrar çalıştırılabilir. Her anahtar geri okunup karşılaştırılır, ayrıca verify yapılır. Kaynaklar hiçbir zaman silinmez. SQL, yerel yedek veya verification hatasında production cloud moduna geçmeyin. Başka bir depo doluyken otomatik merge/overwrite yok.

Ancak veri doğrulandıktan sonra SERVER_STORAGE=supabase seçilir. Henüz kayıt yoksa servis, sessizce boş sayaç başlatmak yerine hata verir. Üretimde sır/anahtar eksikliği veya Postgres kesintisinde eski dosyaya düşmez. Mevcut öğrenme verisi/RLS bağımsız kalır; Lumi/atölye özelliği güvenli biçimde bekler.

## Geri dönüş
Bulut açılmadan önce eski dosyalar aynen durur; yerelde SERVER_STORAGE=local ile geri dönülebilir. Bulut kullanılmaya başladıktan sonra eski SQLite'a dönmek güncel kota/ödülleri geri sarabilir; bunu yapmayın. Yazıcıları durdurup güncel bulutu ayrı bir özel yedeğe alın:

    npm run server:storage -- export-cloud --project-ref GERCEK_PROJE_KIMLIGI --out .cache/server-backups/buluttan-geri-donus.json --confirm-private-export
    npm run server:storage -- restore-local --file .cache/server-backups/buluttan-geri-donus.json --out .cache/server-restores/geri-donus-1 --confirm-private-restore

Bu indirme/geri dönüş de otomatik yapılmaz. Restore yalnızca yeni, önceden var olmayan .cache/server-restores alt dizinine yazar; ilk dosyaların üzerine yazmaz. Yeni lumi/birthday alt dizinlerini ilgili DATA_DIR ayarlarına verip aynı oturum sırlarını ortamda tutun. Eski yerel modu üretimde kullanmak gerçekten kalıcı disk ve SERVER_LOCAL_DISK_CONFIRMED=true gerektirir; Render Free'de geri dönüş için kullanılmaz. Eski yerel atölye parola denemeleri RAM tabanlı olduğundan geri dönüşte yazıcıları açmadan en az 15 dakika bekleyin; cloud deneme engelini sıfırlayarak giriş açmayın. Yeni SQL tablolarını/trigger'ı geri dönüş bahanesiyle silmeyin; uygulamanın eski kayıt yolunu seçmek yedekleri korur.

## Test ve kabul sınırları
Yerel testler PGlite/Postgres üzerinde tüm 001–009 geçişlerini yürütür; mevcut hesap eşitleme, RLS, CAS, içe aktarım, XP/garden testleri de sürer. Yeni testler süreç yerine yeni service/repository örnekleri oluşturarak yeniden başlatmayı simüle eder; paralel istek, cookie değiştirme ile günlük global bütçe, bireysel limit, mektup/revizyon, yetkisiz erişim, kalıcı reward, cevap ack kaybı, yedek bütünlüğü ve sentetik export/restore kapsanır. Bu, canlı Supabase veya Render restart kabulü yerine geçmez.

Komutlar: npm run test:stateless, npm test, npm run lint, npm run typecheck, npm run build. Gerçek Google üretimi yerine provider fixture kullanıldı; Gemini anahtarı/modeli değiştirilmedi. Gerçek yeni service-role/secret anahtarı yokken canlı import test edilmiş gibi raporlanmaz. docker/container ve Render gerçek cold-start testi henüz yapılmadı.

Render'da dağıtım ileride ayrıca onaylanınca: kendi seçtiğiniz projede Free web service + mevcut Dockerfile + render.yaml; persistent disk eklemeyin. SUPABASE_SERVER_SECRET_KEY, aynı session sırları ve parolalar, HTTPS origin, account redirect URL'leri kurulmalı. İki bağımsız oturumda aynı envanter/bakiye, tek günlük kutu ve gerçek Lumi yanıtını kontrol edin; servisi yeniden başlatıp sayaç ve özel mektubun korunduğunu doğrulayın. Bu aşamada dağıtım yapılmayacak.

## Ücretsiz barındırma sınırları
Render Free 15 dakika hareketsizlikten sonra uyuyabilir; yeniden açılış yaklaşık bir dakika sürebilir. Geçici dosyalar restart/redeploy/uykuda kaybolur. Kalıcı veri Supabase'te olduğu için web servisi diski gerekmez. Render Free saat/bant genişliği/build/dış istek kotaları ve Supabase/Gemini kotaları geçerlidir; kesintisiz veya sınırsız ücretsiz hizmet garantisi yok. Render'ın resmî Free belgesi: https://render.com/docs/free . Uyku engellemek için sahte ping/cron eklenmedi.

Durum satırı başına 2 MB güvenlik sınırı var; bu küçük aile uygulaması içindir. Güncel uygulama sınırı 450 AI girişimi/gündür. Sınır aşılırsa veri kırpılmaz veya sayaç sıfırlanmaz; güvenli hata ve operatör incelemesi gerekir. Yüksek trafik için satırları bölmek/normalleştirmek ayrı çalışmadır. SQLite burada yalnızca bellek motorudur; Node 24 gerekir.

Model metadata/son yanıt cache'i yeniden başlamada kaybolabilir. Tamamlanmış istek kalıcı olduğundan cevap kopyası yoksa RETRY_EXPIRED döner; sahte cevap veya otomatik ikinci üretim yoktur. İşlem provider tarafında tamamlanıp sunucu bunu kaydedemeden ölürse haricî sağlayıcı ücretinin tam exactly-once garantisi yok; manuel yeniden deneme bütçe tüketebilir, otomatik tekrar kapalıdır.

Günlük hediye/öğrenme içeriği hâlâ mevcut istemci etkinlik kanıtına dayanır. Yeni makbuzlar ve atomik snapshot aynı ödül kimliğinin tekrarını önler; bu çalışma bütün öğrenme olayları için sunucu anti-cheat veya gerçek para ekonomisi oluşturmaz. Misafir kullanımında cihaz kaydı ve tarayıcı kilidi sürer; cihazlar arası garanti oturum açılmış, başarıyla buluta kaydedilmiş hesaplar içindir. Almanca günlük editörünün önceki eksik durumu değiştirilmedi.

## Oturum ve alan adı sınırı
Aynı alan adında yeniden başlatma, aynı ortam sırları korununca imzalı oturumları bozmaz. 127.0.0.1 adresinden yeni Render alan adına geçişte ise tarayıcı çerezleri taşınmaz; hesap ve Lumi/atölye erişimi için yeniden giriş gerekir. Eski sohbet metinleri mevcut hesap yedeğinde kalır; önceki imzalı tarayıcı kimliğine bağlı açık bir Lumi sohbetine yeni alan adı/cihazdan devam etmek mümkün olmayabilir. Böyle bir durumda geçmişi silmeden yeni konuşma başlatın. Bu aşamada anonim çerez sahipliğini otomatik başka kullanıcıya devreden güvensiz bir işlem eklenmedi.

## Bu hazırlığın son kontrol sonucu
- npm test: 220/220 başarılı (16 yeni durumsuz depo/yedek testi dahil).
- npm run lint: başarılı, uyarı yok.
- npm run typecheck: başarılı.
- npm run build: başarılı, mevcut yollar korundu.
- npm run qa:package: özel dosya 0; mevcut sır değerinin tarayıcı paketinde bulunma sayısı 0.
- verify-stateless.sql yerel Postgres/PGlite üzerinde yürütüldü; sözdizimi ve sorgular geçti.
- Gerçek .cache kayıtları yalnızca salt okunur sayım için açıldı; gerçek export/import/restore veya uzak state okuması yapılmadı. CLI export/restore yalnızca benzersiz sentetik test dizinlerinde denendi, orijinal dosyalara dokunulmadı.
- .env.local, mevcut 001–007 SQL dosyaları, Gemini model ayarı ve öğrenme/garden kayıtları korunuyor.
- Render'a dağıtım, canlı migration uygulama, gerçek service key ile bağlantı, gerçek Supabase backend restart ve iki cihaz kabulü henüz yapılmadı. Bu nedenle geçiş tamamlandı denmez.
