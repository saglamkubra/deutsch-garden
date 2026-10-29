# Deutsch Garden — son kalite raporu (16. adım)

28 Ekim 2026. Kod yeniden kurulmadı; kullanıcı kayıtları, Supabase tabloları ve .env.local değiştirilmedi. Test bahçesi farklı yerel üretim origin'i 127.0.0.1:3001 üzerinde açıldı; 3000 adresindeki gerçek ilerlemeye dokunulmadı. Tüm kritik canlı akışlar doğrulanmadığından uygulama bütünüyle teslim edildi veya canlıda yayında denmez.

## İncelenen kapsam
| Bölüm | Durum ve sınır |
|---|---|
| Ana sayfa, Lumi maskotu, gezinme | Çalışan bileşenler, asıl yollar HTTP 200; XP/seri gerçek ortak kayıttan |
| Bahçe | Ekim, sulama, zamanla büyüme, toplama, koleksiyon, süs yerleştirme/taşıma; yalnızca A1 dünyası oynanabilir, diğer dünyalar önizleme |
| CEFR haritası | A1–C2 seçimi ve plan var, tüm seviyeler için hazır içerik yok |
| Kelimeler | 60 özgün A1 kayıt, benzersiz ID, günlük atama ve tekrar; A2–C2 hazır kelime yok |
| Dersler | 2 zenginleştirilmiş mini ders; planlanan diğer dersleri tamamlandı saymayın |
| Alıştırma/quiz | Mevcut kelimeden gerçek sorular, cevap denetimi, hata tekrarı ve sınırlı ödül |
| Gramer | 66 konu başlığı, 16 hazır A1 dersi; diğerleri plan |
| Dinleme | 10 A1 ders, gerçek WAV, transkript ve sorular |
| Hikâyeler | 4 A1 + 2 A2 hikâye; dallar/sonlar ve cevaplar testli; B1–C2 plan |
| Almanca günlük | /gunlugum etiketlenmiş taslak. Yazma editörü ve günlük XP/rozeti uygulanmadı |
| Lumi AI | Model doğrulama ve gerçek API üzerinden doğrulanmış yanıt başarılı. Model: gemini-3.5-flash-lite. Üretimde parola/sır/origin kurulumu gerekiyor |
| Çiçek dükkânı | Aynı para/envanter, bakiye kontrolü, onay ve idempotent satın alma testleri |
| Günlük hediye | Günde tek hak, aynı bahçe kaydı; cihaz saatine dayanır, tam sunucu anti-cheat yok |
| Hesaplar | Resmi Supabase SDK, giriş/kayıt/reset ve oturum akışları testlerde geçiyor. Canlı e-posta ve ikinci cihaz testi bu aşamada yapılmadı |
| XP/başarılar | Aynı XP defteri, sınırlar, görevler, seri ve tekrar engeli testleri geçiyor. 007 canlı migration uygulaması henüz teyit edilmedi |
| Doğum günü | İlk ziyaret/tekrar/kalıcı çelenk testli. Ad boş, otomatik karşılama kapalı; geliştirici etkinleştirmeli |

## Bu adımda düzeltilenler
- Gemini model metadata erişilebilirken sohbetin yapılandırılmış yanıtı eski 25 saniyelik sınırı aşabiliyordu. Aynı gerçek istek 45 saniyelik sınırla doğrulandı. SDK sınırı 45 saniye; bir deneme, aynı token ve günlük kota. Son Lumi API testi HTTP 200, geçerli şema, yaklaşık 8 saniye. Anahtar, çerez ve konuşma çıktısı loglara basılmadı. Basit Gemini ve metadata kontrolü tek başına sohbet testi yerine sayılmadı.
- Bekleyen konuşma kilidi 35 saniyeden 120 saniyeye çıkarıldı; model doğrulama + üretim süreleri bitmeden başka ücretli üretim başlamaması için. Yeni test 40. saniyede BUSY ve ek kota tüketilmediğini, 120 saniye sonrası kesintiden toparlanmayı kontrol ediyor.
- Bahçe, dükkân ve günlük hediyedeki eski “bulut eşitlemesi yok” metinleri mevcut hesap eşitleme davranışıyla tutarlılaştırıldı. Kayıt motoru değiştirilmedi.
- Manifest PNG 192/512 ikonları, ayrı maskable 512 ve Apple 180 ikonu, tema rengi ve standalone; Profilim’de kurulum açıklaması ve desteklenince yükleme düğmesi.
- Üretimde /sw.js kaydı. Özel HTML/API/RSC/ses önbelleğe alınmaz; yalnızca genel bağlantı ekranı ve ikonlar. Tam offline çalışma/push bildirim yok.
- X-Frame-Options, nosniff, referrer ve kamera/konum/mikrofon politikaları; API no-store; worker güncelleme önbelleği kapalı; X-Powered-By kaldırıldı.
- Özel içerik/anahtar içermeyen /api/health, salt okunur qa:http, Render tek servis + disk örneği, yayın ve SQL denetim yönergeleri. Nunito OFL lisans dosyası public/licenses altına eklendi.

## Doğrulamalar
- npm test: **204/204**. Birim ve entegrasyon: öğrenme, quiz, gramer, dinleme, hikâye grafiği, yerel saklama, satın alma, bakiye, ödül, bulut CAS/ithalat, RLS kullanıcı izolasyonu, AI, doğum günü, PWA.
- npm run lint, npm run typecheck, npm run build: başarılı; son kozmetik metinler de son derlemeye dahil edildi.
- npm run qa:http -- http://127.0.0.1:3001: **25 hedef 200**, bilinmeyen sayfa 404. Bu kontrol ders tamamlaması veya Auth giriş testi değildir. Son derlemenin prerender manifestindeki 115 üretilmiş sayfa/varlık da ayrı HTTP taramasında 115 başarılı, 0 hatayla geçti.
- Üretim bağımlılıkları npm audit --omit=dev: **0 bildirilen açık**; bu penetrasyon testi veya ilerideki açıklar için garanti değil.
- GEMINI_API_KEY mevcut gerçek değeri .next/static tarayıcı paketinde bulunmadı. Boş yönetici anahtarını taranmış çalışan anahtar olarak raporlamıyoruz.
- API Cache-Control private,no-store; worker no-cache,no-store; X-Frame-Options DENY HTTP üzerinden görüldü. Statik kişisiz HTML kabuğu CDN tarafından önbelleklenebilir; özel kullanıcı verisi sunucu HTML'sinde yer almıyor.
- 390×844 telefon ve 820×1080 tablet ölçülerinde profil/bahçe belge genişliği taşmıyor; ekim paneli klavyeden erişilebilir, tohum ekimi, sulama aracı, sayfa yenileme ve sekmeyi kapatıp yeniden açmada aynı papatya/11 tohum korundu. Gerçek Android/iPhone dokunma ve ses izni testi değildir.
- Önceki doğum günü klavye/ilk ziyaret testleri korundu. Hareket azaltma CSS/Motion desteği var. PWA worker cache/offline davranışı VM entegrasyonunda test edildi; fiziksel cihazda kurulum ve uçak modu kabulü henüz yapılmadı.
- Hazır seslerin boyut/süre/SHA ve içerik bağlantıları mevcut testlerde geçiyor; ses oynatıcılar metadata dışında tüm dosyaları önceden indirmiyor. Yaklaşık 37 MB public varlık yerelde; worker bunları topluca indirmez. Yeni runtime bağımlılığı eklenmedi. Lighthouse skoru veya gerçek ağ performansı ölçülmüş gibi sunulmaz.

## Öğrenici yolculuğu
Yerel/domain modellerinde seviye seçimi, günlük kelime, alıştırma, gramer, dinleme, hikâye, XP, para, satın alma, ekim/sulama ve kayıt yükleme entegrasyonları ayrı testlerle doğrulanıyor. Tarayıcıda üretim bahçesi ekimi ve yeniden açılması ayrıca denendi. Lumi gerçek HTTP uçtan uca yanıt verdi. Gerçek hesap girişi, e-posta doğrulaması, yeni cihazdan senkronizasyon ve gerçek telefon izinleri kullanıcı tarafından tamamlanmalı. Günlük editörü eksik olduğundan istenen 15 maddelik tam kullanıcı yolculuğunun bütünü başarılı sayılmaz.

## Güvenlik ve içerik sınırları
RLS, auth.uid sahiplik, anon erişim reddi, CAS çakışması, import ve gizlilik silme SQL'leri PGlite'da test edildi; canlı Supabase projesinde aynı migration/politikaların uygulanmış olduğunu bu test ispatlamaz. SQL Editor doğrulaması ve iki canlı hesap testi gerekli. Client localStorage, öğrenme kanıtının mutlak güvenli kaynağı değildir; bu kişisel uygulama rekabetçi/gerçek para ekonomisi anti-cheat hizmeti sunmaz. Sunucu doğrudan özel kayıt yazma izinlerini sınırlar; her yerel olay kriptografik kanıt değildir. Mevcut güvenliği düşürmedik.

Üretimde Lumi ve atölye ortak erişim parolaları Supabase hesabından ayrı yetkilendirme katmanıdır. Gemini'ye yalnızca açık kullanıcı isteği gönderilir; günlük otomatik gönderilmez. Servis rolü tarayıcıda yok. Desteklenmeyen ses tanımada yazılı sohbet sürer; gerçek mikrofon/test doğruluğu iddiası yok.

İçerik ve SVG'ler özgün kaydıyla etiketli; Piper/Thorsten kaynak ve lisans notları public/audio altındaki README'lerde; Nunito OFL ekli. Otomatik testler Türkçe çevirinin üslubunu, her Almanca cümlenin pedagojik doğruluğunu veya CEFR sertifikasyonunu kanıtlamaz. Teslim öncesi Almanca bilen birinin 60 kelimeyi, hazır ders/soruları, TTS telaffuzunu ve çevirileri gözden geçirmesi gerekir. Üst seviyeler tamamlanmış gibi tanıtılmamalı.

## Canlı yayın ve yapılacaklar
**Dağıtım yapılmadı; doğrulanmış canlı URL yok.** Yetkilendirilmiş barındırma projesi seçilmedi. Mevcut mimari için kalıcı diskli tek Docker servisi hazırlandı; Vercel sunucusuz ortamına aynen dağıtım uygun değil. Docker imajı bu makinede çalıştırılıp doğrulanmadı. Supabase mevcut; service-role boş; üretim Lumi parolası/sırrı ve atölye parolası eksik. Kişisel sürpriz henüz açık değil.

Kesin sıra, maliyet kalemleri, SQL dosyaları ve üretim kabul listesi: DEPLOYMENT.md. Hediye tesliminden önce yedek al, 007 durumunu doğrula, gerçek hesap/e-posta/iki cihaz akışını tamamla, barındırıcıda parola/sır/HTTPS origin ve kalıcı disk ayarla, Supabase redirect adreslerini güncelle, gerçek telefonda PWA/ses/bahçe/AI dene, doğum günü mesajını kişiselleştirip etkinleştir. Günlük özelliğinin şu an bulunmadığı teslim kapsamına açıkça yazılmalı veya ayrı geliştirmeyle tamamlanmalı.
