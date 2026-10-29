# 14. adım — XP, başarılar ve öğrenme serisi

`/basarilarim` gerçek kayıtlarla çalışır. Ana sayfanın görev/ilerleme kartları ve üst başlığın 120 XP / 3 gün demo değerleri bu kayda bağlandı. Sonraki aşama eklenmedi. Gemini, Lumi sağlayıcısı, doğum günü atölyesi, mağaza ve önceki bahçe verileri değiştirilmedi.

## Tek XP kaynağı

Mevcut `deutsch-garden:exercises:v1` içindeki `xp` işlem listesi tek bakiyedir. Gramerin kendi özet puanı veya Lumi makbuzları ikinci kez toplanmaz. `src/lib/gamification/rewards.ts` mevcut `REWARDS` değerlerini merkezi olarak tutar; eski engine importları uyumluluk için yeniden dışa aktarılır.

| Etkinlik | XP kuralı |
|---|---|
| Kelime/SRS pratiği | Bir kelimeye aynı yerel takvim gününde bir kez 5 XP; en fazla 20 kelime, 100 XP/gün. |
| Alıştırma | Doğru soruya aynı gün/düzeyde bir kez 5 XP; tüm düzey ve modlarda yeni kazanım en fazla 100 XP/gün. Yanlış ve atlanan yanıta XP yok. |
| Mini ders | Mevcut ders kimliğiyle ilk tamamlamada 20 XP. |
| Gramer | Mevcut konu kimliğiyle ilk tamamlamada 15 XP. |
| Dinleme | Mevcut bölüm kimliğiyle ilk tamamlamada 15 XP. |
| Hikâye | Mevcut hikâye kimliğiyle ilk tamamlamada 20 XP. Yeni sonların bahçe ödülleri korunur. |
| Lumi | Önceki sunucu doğrulaması ve günlük makbuzla 15 XP; konuşma koşulları değişmedi. |
| Günlük hediye | Önceden kazanılan 10 XP işlemleri toplamda korunur; öğrenme serisini uzatmaz. |
| Günlük yazımı | Editör önceki projede bulunmuyor; bu aşamada eklenmedi. XP ve rozet etkin değil. |

Yeni kelime XP'si, bu sistemin kayda ilk eklendiği günden itibaren verilir. Geçmiş günlerin kelime çalışması tanınabilir ama geçmişe dönük yeni XP üretilmez. Aynı günün daha önce yapılmış gerçek kelime yanıtları günlük sınır dahilinde tanınır. Önceden yüksek puan kazanılmış günlerin puanları azaltılmaz; yeni sınırdan sonra ek alıştırma XP'si verilmez. Görev ve rozet için ek XP yoktur; aynı çalışma ikinci kez puanlandırılmaz.

## Oyun seviyeleri

0 / 100 / 300 / 700 / 1400 / 2500 toplam XP eşiklerinde sırasıyla Tohum Kaşifi, Küçük Filiz, Çiçek Dostu, Bahçe Koruyucusu, Dil Kaşifi ve Almanca Ustası unvanları açılır. Bunlar oyun unvanlarıdır, resmî CEFR yeterlik veya seviye tespit sonucu değildir. Kullanıcının A1–C2 seçimi ayrı kalır.

## Rozetler ve mevcut bahçe

Her rozetin sabit kimliği, Türkçe açıklaması, özgün SVG madalyası, kazanıldığı gün ve ödül alınma durumu vardır:

| Kimlik | Koşul | Tek seferlik bahçe ödülü |
|---|---|---|
| `first-vocabulary` | Bir günlük kelime listesini veya mini dersi bitir | 2 papatya tohumu |
| `first-perfect` | En az 3 soruluk alıştırmayı ilk yanıtlarla hatasız bitir | 1 lavanta tohumu |
| `first-grammar` | İlk gramer konusunu tamamla | 1 lale tohumu |
| `first-listening` | İlk dinleme bölümünü tamamla | 1 gül tohumu |
| `first-story` | İlk hikâyede bir sona ulaş | 1 ayçiçeği tohumu |
| `first-diary` | Günlük editörü etkinleştiğinde kullanılabilecek tanım | Henüz etkin değil; kazanılamaz |
| `first-conversation` | Doğrulanmış ödül makbuzu teslim edilmiş Lumi pratiği | Şeker Kelebeği süsü |
| `first-bloom` | Bir çiçeğin açması veya kayıtlı ilk hasat | 1 kiraz çiçeği tohumu |
| `words-100` | 100 farklı kelimeye anlamlı yanıt ver | 1 ay ışığı çiçeği tohumu |
| `sessions-10` | 10 kelime listesi/ders/alıştırma/gramer/dinleme/hikâye/ödüle uygun konuşma oturumu | Yıldız Feneri süsü |

Ödül düğmesi mevcut `deliverGardenReward` yolunu, `achievement:<rozet-kimliği>` işlem kimliğini ve bahçe kilidini kullanır. Ayrı para veya envanter oluşturulmaz. Tohumların ilgili tür kilidi de açılır; çiçekler mevcut ekim/büyüme/hasat sisteminde, süsler mevcut yerleştirme/taşıma/çıkarma sisteminde kullanılır. Sahip olunan süs tekrar çoğaltılmaz.

Önce hak ediş kaydedilir, sonra bahçe işlemi, ardından alındı durumu yazılır. Son yazma başarısız olsa bile yeniden deneme bahçe makbuzundan ötürü iki kez ödül vermez. Çift tıklama ve sekmeler aynı alıştırma/bahçe kilitlerini paylaşır.

## Görevler, seri ve kutlama

Günlük kelime hedefi, seçili düzeyde gerçek içerik, tamamlanmamış dinleme/gramer/hikâye ve önceki zor kelimeler dikkate alınır. İçeriksiz düzeylerde hayali görev gösterilmez. Günün hedefleri ilk oluşturulduğunda sabitlenir; hedef veya düzey değişikliği o günün biten görevini sıfırlamaz. Yerel takvim günü değiştiğinde yeni plan oluşturulur. En az 30 saniyelik kontrol ve gerçek kayıt değişiklikleriyle güncellenir.

Seri; kelimeye yanıt veya tamamlanan anlamlı öğrenme oturumlarından hesaplanır. Sayfa açmak, günlük hediye almak, çiçeğin zamanla büyümesi seri oluşturmaz. Bugün henüz çalışılmadıysa dün biten seri gün boyunca sürdürülmeye hazır gösterilir. Gün kaçırıldığında yalnızca güncel sayaç yeniden başlayabilir; XP, rozetler, en uzun seri ve envanter silinmez.

Lumi'nin kutlama cümlesi hazır arayüz metnidir; AI isteği yapılmaz. Konfeti, madalya vurguları ve giriş animasyonu azaltılmış hareket tercihine uyar. Kutlamanın görüldüğü durum kaydedilir. Hediye atölyesi önizlemesinde gamification aboneliği kapalıdır; önizleme gerçek ilerleme yazmaz.

## Kayıt ve bulut kurulumu

Günlük planlar, metin içermeyen etkinlik kimlikleri, rozet hakları ve kutlama durumu mevcut `ExerciseState` içine isteğe bağlı `gamification` alanıyla eklenir. Eski kayıtlar hâlâ geçerlidir. Hesap başına mevcut localStorage ad alanı ve Supabase `user_progress` sürümlü belgesi kullanılır. Kaynak modeller okunurken mevcut doğrulayıcılar uygulanır; hatalı/yeni sürüm kayıtların üzerine başlangıç verisi yazılmaz. Eski saat bilgisi olmayan kelime kaydına yapay saat eklenmez. Hikâyenin eski kayıtlarında mevcut koşu güncelleme tarihi kullanılır.

**Canlı Supabase'de yalnızca yeni `supabase/migrations/202610280007_gamification.sql` dosyasını, önceki 001–006 geçişleri başarıyla uygulanmışsa bir kez çalıştırın. Önceki dosyaları tekrar çalıştırmayın.** Bu işlem kullanıcı verilerini sıfırlamaz. Önce mevcut veritabanı yedeğinizi koruyun. Yerel PostgreSQL testleri tüm geçişlerle birlikte çalışır; bu dosya kullanıcı adına canlı projede uygulanmadı.

Yeni geçiş:

- Mevcut snapshot RPC'sinin satır kilidi/kimlik doğrulaması/revizyon kontrolü içerisinde rozet ve kelime XP kanıtlarını denetler.
- Rozet haklarını kaynak öğrenme kayıtlarından tekrar kontrol eder. Uydurma rozetler, çalışma kaydı olmayan kelime XP'si ve 20'den fazla günlük kelime XP makbuzu reddedilir.
- Mevcut `learning_reward_receipts` tablosunu süs türünü destekleyecek şekilde genişletir. Ayrı XP bakiyesi veya ödül para birimi oluşturmaz. Kullanıcı+işlem kimliği kalıcıdır; snapshot geri alınarak rozet ödülünün tekrar yazılması reddedilir.
- RLS ve kullanıcı ayrımı korunur. Ödül makbuzlarına tarayıcıdan doğrudan yazılamaz. Yardımcı doğrulama fonksiyonları `anon` ve `authenticated` rollerine açık değildir.
- `gamification_rules_version()` yalnızca oturum açmış kullanıcıya sürüm bilgisi döndürür. Hesaplı kullanımda yeni başarı yazıcıları, bu kontrol başarılı olmadan etkinleşmez; arayüz kurulum gerektiğini söyler. Geçiş uygulandıktan sonra sayfayı yenileyin veya “Yeniden kontrol et” düğmesini kullanın.

Bulutta daha önce alınmış bir rozet ödülünü içermeyen eski bir snapshot'ı seçip sonradan aynı ödülü tekrar eklemek engellenir. Böyle bir çakışmada bulut kaydını yükleyin; eski cihaz yedeğini dışa aktarabilirsiniz. Birleştirme/otomatik para toplama yapılmaz.

### Güvenliğin kapsamı

RLS farklı kullanıcıların verisine erişimi ve sunucu doğrulaması yeni başarı makbuzlarının tekrar yazılmasını engeller. Bu, önceki yerel öğrenme mimarisini baştan sona sunucuda sınav değerlendiren bir sisteme dönüştürmez. Öğrenme kanıtı hâlâ kullanıcının mevcut snapshot'ından gelir; kendi istemcisini değiştirerek sahte kaynak kayıtları üreten bir kullanıcıya karşı tüm eski oyun bakiyelerinin mutlak hile koruması olduğu iddia edilmez. Böyle bir garanti, eski tüm öğrenme/garden işlemlerinin sunucu otoritesine ayrıca taşınmasını gerektirir. Bu adım o yeniden kurmayı yapmaz.

## Kontroller

`npm run test:gamification` saf hesaplama, metadata kalıcılığı, gerçek ödül yazıcısı ve PostgreSQL testlerini çalıştırır. Kapsam: XP tavanları, eski XP koruma, tekrarlama, yanlış/atlanan yanıt, görevlerin sabitlenmesi ve yerel gece yarısı, eksik içerik, artık yıl/kaçırılan gün serileri, gerçek rozet koşulları, nadir tohumu ekme, çift tıklama, bahçe yazıldıktan sonra metadata yazmasının kesilmesi, SQL hak ediş/XP/tekrar talep kontrolleri ve kullanıcı ayrımı. Test süreçleri bellek kullanımını sınırlamak için sırayla çalışır.

Genel kontroller: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`. Canlı Supabase geçişi ve gerçek hesaptaki kayıt kontrolü kullanıcı SQL dosyasını uyguladıktan sonra ayrıca yapılmalıdır. Yeni dağıtım veya 15. adım yapılmadı.

### Doğrulama sonucu

191 genel test geçti; 17 başarı testi buna dahil. TypeScript, lint ve üretim derlemesi başarılı. Tarayıcıda masaüstü, 820 piksel tablet ve 390 piksel mobil görünümde yatay taşma kontrol edildi. Gerçek hak edilmiş bir rozetin ödül düğmesi ve sayfa yenileme sonrası alındı durumu doğrulandı. Eski bahçe kayıtlarının yalnızca eksik yeni türlere sıfır ekleyen mevcut dönüştürücüsü snapshot okuyucusunda da tekrar kullanıldı; orijinal yerel kayıt yeniden yazılmadı veya kaynak doldurulmadı. Canlı Supabase 007 geçişi kullanıcı tarafından henüz doğrulanmadı.
