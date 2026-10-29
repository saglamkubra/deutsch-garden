> Güncel Render Free seçeneği: [STATELESS-HOSTING.md](STATELESS-HOSTING.md). Aşağıdaki disk gereksinimi eski yerel backend içindir; doğrulanmış Supabase backend'i kalıcı web diski istemez. Geçiş/dağıtım henüz uygulanmadı.

# Lumi: Gemini kurulumu

Node.js 24+ ve resmî `@google/genai` SDK kullanılır. Tercih edilen kararlı model: **gemini-3.5-flash-lite**. Resmî model sayfası: https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite

## Yerelde çalıştırma

`.env.example` dosyasını `.env.local` olarak kopyalayın. `LUMI_PROVIDER=gemini`, `GEMINI_MODEL=gemini-3.5-flash-lite` ve Google AI Studio'dan aldığınız `GEMINI_API_KEY` değerini sunucuda ayarlayın. Anahtarı sohbet alanına yazmayın. Gemini seçiliyken OpenAI anahtarı gerekmez. Alternatif sağlayıcı için `LUMI_PROVIDER=openai`, `OPENAI_API_KEY` ve yapılandırılmış Responses çıktısını destekleyen `OPENAI_MODEL` ayarlanabilir. Eski yalnızca OpenAI ortamları çalışmaya devam eder.

`npm run lumi:verify` hesabınızla model metadata erişimini ve metin üretim desteğini kontrol eder; sohbet üretmez. Anahtar yoksa hesap erişimi doğrulanmış sayılmaz. Sunucu da ilk kullanımda doğrular; başarılı kontrol 15 dakika, model hatası 5 dakika, bağlantı/kota hatası 30 saniye önbelleğe alınır. Eşzamanlı kontroller paylaşılır. Geçersiz model sessizce değiştirilmez.

`npm run dev` sonrasında http://127.0.0.1:3000/lumi-ai adresini açın. Ortam değişikliği sonrası sunucuyu yeniden başlatın.

Yerel geliştirmede boş `LUMI_ACCESS_PASSWORD` desteklenir; boş `LUMI_SESSION_SECRET` için `.cache/lumi/session-secret` içinde kalıcı rastgele sır oluşturulur. Bunlar üretimde zorunludur. Next dev, API isteğinin URL'sini `localhost` olarak normalleştirebilir; Lumi yalnızca yerelde aynı port, tam eşleşen Host ve POST Origin ile bu loopback farkını kabul eder. Üretim origin kontrolü korunur. Durum ve oturum isteği `GET /api/lumi/chat`, sohbet `POST /api/lumi/chat`, parola girişi `POST /api/lumi/access`, ödül doğrulaması `POST /api/lumi/reward` üzerinden çalışır; ayrı bir health/config/session endpoint'i yoktur. Sunucu hataları arayüzde Türkçe gerçek hata mesajıyla gösterilir.

## Bilgisayardan bağımsız bulut kurulumu

Dockerfile, Next.js bağımsız Node sunucusunu paketler. Railway, Render veya eşdeğer sürekli Node/Docker barındırıcısında bu depoyu dağıtın. Tek servis örneği çalıştırın, 3000 portuna HTTPS yönlendirin ve **/data yoluna kalıcı disk** bağlayın. Disk yazma izinlerini `node` kullanıcısına (UID 1000) verin. `LUMI_DATA_DIR=/data/lumi` kullanın. Geçici disk, birden çok kopya veya salt sunucusuz işlevler mevcut SQLite kullanım kaydına uygun değildir.

Barındırıcının gizli ortam değişkenlerine Gemini anahtar/model/sağlayıcısını; en az 12 karakterlik `LUMI_ACCESS_PASSWORD`, en az 32 karakterlik rastgele `LUMI_SESSION_SECRET`, gerçek HTTPS adresini `LUMI_APP_ORIGIN` olarak ekleyin. Origin sonunda `/` olmamalı. Sırlar imaja kopyalanmaz; çalışma anında verilir. Disk ve oturum sırrını yeniden dağıtımlarda koruyun. Platformun dış HTTPS origin bilgisini Next'e doğru aktardığını doğrulayın. Sağlık kontrolü `/` olabilir; AI yolunu sürekli sorgulamayın.

İmaj: `docker build -t deutsch-garden .`. Çalıştırma: `docker run --rm -p 3000:3000 --env-file .env.local -v deutsch-garden-lumi:/data deutsch-garden`. Üretim origin ayarı açılan adresle eşleşmelidir. Docker imajı bu çalışma sırasında çalıştırılmadı. Dağıtım hesabı, anahtar ve barındırma hizmeti kullanıcı tarafından sağlanmalıdır. HTTPS bulut adresi dağıtıldıktan sonra telefon bu adresten bilgisayar kapalıyken de erişebilir. Yerel 127.0.0.1 adresi bunu sağlamaz.

## Maliyet ve kayıtlar

Her imzalı tarayıcı oturumuna dakikada 3 ve günde 400; uygulama geneline dakikada 10 ve günde 450 üretim girişimi sınırı uygulanır. Günlük sınırlar İstanbul saatine göredir. Bir konuşmada 12 tur, mesajda 800 karakter, toplam bağlamda 14.000 karakter, yanıtta 1200 token sınırı vardır. Kelime çevirisi ve özet de bütçeden düşer. Sağlayıcı hataları girişim bütçesini tüketir. Otomatik üretim tekrarları kapalıdır; tamamlanan aynı istek iki dakika içinde ek ücret olmadan önbellekten döner. Kota, bağlantı, erişim, geçersiz model ve uygunsuz JSON Türkçe hatayla gösterilir. Bunlar kesin parasal tavan değildir; Google projesinde ayrıca bütçe/kota ayarlayın.

HttpOnly imzalı 7 günlük oturum çerezi sahiplik ve temel kullanıcı sınırını sağlar. Üretimde ortak ev erişim parolası zorunludur; bu tam çok kullanıcılı hesap sistemi değildir. Çerez silinse de genel sınırlar korunur.

Sohbet, ayarlar ve kaydedilen ifadeler hesap başına ayrılmış localStorage'da tutulur. Misafir kaydı cihazda kalır; Supabase hesabıyla giriş yapılıp buluta başarıyla kaydedildiğinde mevcut ilerleme belgesiyle diğer cihazlara eşitlenir. Yalnızca uygulamayı buluta dağıtmak, misafir verisini kendiliğinden taşımaz. Sunucu SQLite kaydı konuşma metnini içermez: sahiplik, içerik özeti/hash, kullanım, zaman ve ödül makbuzları tutulur. Konuşma metadata'sı 30 gün, kullanım 7 gün, istek kaydı 2 gün; ödül makbuzları tekrar ödülü önlemek için saklanır. Yanıt önbelleği iki dakika RAM'de kalır. Silme cihaz geçmiş/yedeklerini ve ilgili sunucu konuşma kaydını temizler; kullanım ve ödül engellerini kaldırmaz. Günlük içerikleri otomatik gönderilmez. Açık onay sonrası yalnızca seçili sohbet ve kelime isteği sağlayıcıya gönderilir; Google'ın hesabınıza uygulanan veri koşullarını inceleyin. Özel sohbetler uygulama loglarına yazılmaz.

## Ses, ödüller ve kontroller

Mikrofon tarayıcının Almanca konuşma tanıması varsa çalışır; HTTPS ve açık izin gerekir. Destek yoksa metin sohbeti çalışır. Seslendirme cihazın Almanca sesine bağlıdır; tekrar/durdur bulunur. Telaffuz puanlaması yapılmaz. Anahtar ve mikrofon izni olmadan canlı ses/AI doğrulaması yapıldığı iddia edilmez.

Gerçek en az 4 tur, 60 karakter ve 60 saniye pratik sonrası günlük tek imzalı ödül: 15 XP ve 10 bahçe parası. Yinelenen istek/silme/yeniden açma ödülü çoğaltmaz. `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` kontrolleri kullanılır. Sağlayıcı testleri deneme yanıtları kullanır; canlı hesap testi yerine geçmez.


16. adım canlı kontrolü: model metadata erişimi başarılıyken yapılandırılmış yanıt eski 25 saniyelik süreyi aşabildi. Gemini SDK süre sınırı 45 saniyeye çıkarıldı; otomatik yeniden deneme hâlâ tek girişim, token ve günlük kotalar aynı. Uzun bekleme kota veya kesintisiz hizmet garantisi değildir.
