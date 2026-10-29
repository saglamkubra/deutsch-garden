# Hesaplar ve bulut eşitlemesi — hesaplar için 13. adım

Bu bölüm önceki doğum günü özelliğinden ayrıdır. `STAGE-13.md` doğum günü atölyesini anlatmaya devam eder. Sonraki aşamalar eklenmedi.

## Kurulum

1. Kendi Supabase projenizi oluşturun. Project Settings / API bölümünden proje URL'sini ve **publishable** anahtarını alın. Eski projelerde `anon` anahtarı da desteklenir. Hiçbir yere örnek bir anahtarın çalıştığını varsayarak yazmayın.
2. `.env.example` içindeki `SUPABASE_URL` ve `SUPABASE_PUBLISHABLE_KEY` değerlerini `.env.local` dosyanıza veya barındırma hizmetinizin sunucu ortamına ekleyin. Sunucuyu yeniden başlatın. `/api/account/config` yalnızca URL, herkese açık publishable/anon anahtarı ve kurulum durumunu döndürür. Secret/service_role anahtarı bu yanıta katılmaz; yanlış anahtar türü reddedilir.
3. `supabase/migrations` SQL dosyalarını **sıralarıyla**, daha önce uygulanmış olanları tekrar çalıştırmadan uygulayın: `001_learning`, `002_exercises`, `003_grammar`, `004_listening`, `005_story_xp`, `202610280006_accounts_sync.sql`. Mevcut dosyaların adlarını dizinde kontrol edin. SQL Editor veya Supabase CLI migration workflow kullanılabilir. Gerçek projede çalıştırmadan önce veritabanı yedeği alın.
4. `supabase/seed.sql` ve mevcut gramer/dinleme katalog seed dosyalarını kurulum belgelerine göre uygulayın. `learning_levels` A1–C2 kayıtları profilin yabancı anahtarları için gereklidir. İlerlemeyi silen/resetleyen komut çalıştırmayın.
5. Authentication / Providers bölümünde Email'i etkinleştirin. E-posta doğrulamasını tercihinize göre açın; canlı kullanıma uygun SMTP sağlayıcısını yapılandırın. Parola alt sınırını en az 10 karakter seçin. Supabase'in Auth hız sınırlarını koruyun.
6. Authentication / URL Configuration'da Site URL'yi gerçek HTTPS site adresiniz yapın. Redirect URLs listesine aşağıdaki adresleri **tam origin ile** ekleyin:
   - `http://127.0.0.1:3000/hesap/dogrula`
   - `http://127.0.0.1:3000/hesap/sifre-guncelle`
   - Canlı sitenin aynı iki yolu. `localhost` kullanıyorsanız o origin'i de ayrıca ekleyin. Üretimde geniş wildcard kullanmayın.
7. Yeni bir e-postayla `/kayit`, doğrulama bağlantısı, `/giris`, yenileme bağlantısı, sayfa yenileme, çıkış ve ikinci cihazı gerçek projede kontrol edin. PKCE bağlantılarını isteği başlattığınız tarayıcıda açın. Bağlantı süresi dolduysa yeni istek gönderin. E-posta şablonunun Supabase'in standart doğrulama/PKCE yönlendirmesini koruması gerekir.

Resmî kaynaklar: [Auth kayıt](https://supabase.com/docs/reference/javascript/auth-signup), [parola sıfırlama](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Sayfalar ve oturum

`SUPABASE_URL` proje kök adresi olmalıdır: `https://<proje-kimliği>.supabase.co`. Sonuna `/rest/v1`, `/auth/v1` veya dashboard yolu eklemeyin. SDK bu yolları kendisi ekler; REST adresini proje URL'si olarak kullanmak kayıt isteğinde HTTP 404 hatasına neden olur. Bu yollar yapılandırma doğrulamasında reddedilir. URL değiştikten sonra açık sayfayı tam yenileyin; tarayıcıdaki istemci önceki URL'yi bellekte tutabilir.

- `/giris`, `/kayit`, `/hesap/sifre-sifirla`, `/hesap/sifre-guncelle`, `/hesap/dogrula`, `/profilim`.
- Resmî `@supabase/supabase-js`; kalıcı, otomatik yenilenen PKCE oturumu. Başlangıçta `getUser()` ile oturum sunucuda doğrulanır. Parola/e-posta uygulamanın ilerleme belgesine veya dışa aktarmaya eklenmez.
- Oturum kimliği değiştiğinde eski yazıcılar durdurulur ve tam sayfa yüklenir. Böylece bellekteki eski mağazalar başka hesaba yazamaz. Aynı kullanıcının token yenilemesi sayfayı yeniden yüklemez.
- Oturum doğrulanamıyorsa misafir verisini yanlış hesapta açmak yerine yeniden deneme/çıkış ekranı gösterilir. Supabase hiç yapılandırılmamışsa misafir özellikleri eskisi gibi çalışır.
- Ad, CEFR, günlük kelime hedefi, öğrenme niyeti, ses ve hatırlatma **tercihi** vardır. Bildirim gönderme altyapısı bu adımda eklenmedi. E-posta değişimi arayüzü yoktur; parola yenileme ve hesap silme bulunur.

## Veritabanı ve veri kaynağı

Önceden hazırlanmış kelime, günlük atama, alıştırma, gramer ve dinleme tabloları/katalogları korunur. Birbiriyle yarışan yeni para veya profil tabloları oluşturulmaz.

| Nesne | Görev |
|---|---|
| `learning_user_settings` | Mevcut profil tablosu; görünen ad, öğrenme niyeti, ses/bildirim tercihleriyle genişletildi. Seviye/hedef alanları yeniden kullanılır. |
| `user_progress` | Her hesap için tek, sürümlü ve tutarlı ilerleme belgesi; mevcut yerel modellerin kayıpsız bulut karşılığı. |
| `progress_sync_receipts` | Kullanıcı + işlem UUID'si; tekrar istek ve SHA-256 yerel aktarım kimliği için idempotent makbuz. |
| `progress_archives` | Onaylı değiştirmelerde önceki bulut belgesi; kullanıcıya ait, dışa aktarılabilir. |
| `diary_entries` | Kullanıcıya özel günlük şeması; dışa aktarma/silme hazır. Önceden günlük editörü bulunmadığı için yeni editör yapılmadı. |
| `cloud_learning_modules` | RLS'yi koruyan salt okunur görünüm: kelime/SRS, günlük atamalar, alıştırma/XP, gramer, dinleme, hikâye, mini kurs, Lumi, tercihler. |
| `garden_accounts` | Aynı belgeden bahçe, ekili alanlar, tohumlar, süsler, para, satın almalar, günlük hediyeler ve ödül kimlikleri. Ayrı bakiye tutulmaz. |
| `ai_conversation_history` | Aynı belgedeki Lumi konuşmalarının kullanıcıya özel görünümü. |

**Güncel uygulamanın bulut kaynağı `user_progress` belgesidir.** Önceden hazırlanmış normalize öğrenme tablolarına ikinci bir paralel yazma yapılmaz. Yerel kimlikler ve UUID gerektiren eski şemalar arasındaki kaybı böyle önlüyoruz. İleride normalize adaptöre geçilecekse ayrı ve test edilmiş bir veri geçişi gerekir. SQL testleri eski geçişlerin tamamıyla yeni geçişi birlikte çalıştırır.

## Güvenlik

Yeni tüm özel tablolarda RLS etkin. `auth.uid() = user_id` politikaları, kullanıcıya özel yabancı anahtarlar ve indeksler var. Görünümler `security_invoker=true` ile alttaki tablonun RLS politikasını kullanır. `anon` özel tablo/görünüm/RPC erişimi alamaz. Diğer kullanıcının günlüğüne yazma da reddedilir.

`save_learning_snapshot` güvenli `search_path` ile çalışan, yalnızca doğrulanmış kullanıcının kendi kaydına yazan RPC'dir. İstemci doğrudan belgeyi/makbuzları güncelleyemez. Satır kilidi, beklenen revizyon ve idempotent UUID aynı işlemde kontrol edilir. Negatif bakiye SQL'de reddedilir; istemci bütün mevcut model doğrulayıcılarını uygular. Bu kişisel öğrenme uygulaması hâlâ yerel etkinlik modellerini kullanır; tüm öğrenme yanıtları için sunucuda hile önleme değerlendirme sistemi eklenmemiştir.

Servis anahtarı yalnızca isteğe bağlı hesap silme endpoint'inde sunucuda okunur. Kod özel konuşmaları veya parolaları loglamaz. Mevcut Lumi sağlayıcısı ve aile erişim parolası korunur; Supabase oturumu Lumi'nin sağlayıcı anahtarının yerine geçmez. Günlükler hiçbir zaman kendiliğinden Lumi'ye aktarılmaz.

## Yerel kayıtların aktarımı

1. Misafir anahtarları değişmez. Giriş yapan her hesap `deutsch-garden:account:<UUID>:` altında ayrı cihaz kayıtları kullanır. Çıkış/switch başka hesabın önbelleğini göstermez.
2. Profilde misafir kayıtları algılanır. Aktarım **onay kutusu ve açık düğme** olmadan yapılmaz. Aktarım açıklaması Lumi sohbetlerinin de dahil olduğunu belirtir.
3. Para, envanter, alışveriş, hediyeler ve ödül kimlikleri bütün belgeyle taşınır. Kayıtlar toplanmaz; ödüller yeniden oynatılmaz. Önceki bulut ve hesap kayıtları arşivlenir. Misafir verisi hiç silinmez.
4. İşlem UUID'si ve gönderilecek belge istekten **önce** cihazda kalıcı saklanır. Bağlantı kesilirse aynı UUID tekrar denenir. Aynı kaynak hash'i tekrar ithal edilmez.
5. Yanıt belgesinin tamamı doğrulanır ve kanonik biçimde karşılaştırılır. Yerel yükleme öncesinde geri alma günlüğü yazılır; kısmi yazma/depolama hatası halinde önceki kayıt geri yüklenir. Yarım kalan günlük açılışta oyun mağazaları bağlanmadan kurtarılır.
6. Başka cihaz daha yeni bir sürüm kaydettiyse otomatik üzerine yazılmaz. Profilde bulutu veya cihaz kaydını açıkça seçersiniz. Her iki sürüm dışa aktarılabilir; bulut arşivleri SQL veya JSON dışa aktarmasıyla kurtarılabilir. Arşivleri uygulamadan tek tıkla geri yükleme arayüzü henüz yoktur.

Eski/hasarlı kayıtlar aktarımı durdurur ve olduğu gibi korunur. Dışa aktarma okunamayan ham kayıt ve yedekleri de taşır. Kaynak ve hedef tercihi tüm belgenin yerini alır; alan bazında otomatik birleştirme yoktur.

## Eşitleme ve çevrimdışı sınırlar

- Hesap ilk açılırken bulut kaydı yüklenir; otomatik kayıt yaklaşık 2,5 saniye geciktirilir. İçerik değişmediyse yazma yapılmaz. Aynı hesapta sekmeler Web Locks ile eşitleme yazılarını sıraya koyar; olmayan tarayıcılarda sunucu revizyon kontrolü çakışmayı engeller.
- Açık oturumda yeni bulut sürümü odaklanınca/dakikada bir kontrol edilir. Kullanıcı devam eden dersini kaybetmesin diye yükleme düğmesi gösterilir. Yeni cihazda başlangıç yüklemesi otomatiktir.
- İnternet kesilirse yerel ilerleme ve bekleyen işlem saklanır. Yeniden bağlanınca tekrar deneme vardır, ayrıca düğme bulunur. Çakışmalar kullanıcı seçimi gerektirir. Tam çevrimdışı çalışma veya kesintisiz çevrimdışı birleştirme iddiası yoktur; ilk oturum doğrulaması internet gerektirir.
- Belge istemcide en fazla 2 milyon karakter, SQL'de en fazla 4 MB. Arşiv ve makbuzların saklama süresi proje yöneticisi tarafından bütçeye göre yönetilmelidir; uygulama bunları sessizce silmez. Tam belgeli eşitleme çok büyük kullanıcı tabanları için optimize edilmemiştir.

## Gizlilik ve hesap silme

Profilde JSON dışa aktarma, günlük ve sohbet silme vardır. Sohbet silme bulut arşivlerini de temizler; ödül/para makbuzları korunur. Özel veri silme sürümü (`private_epoch`) eski cihazların silinmiş sohbetleri fark etmeden tekrar göndermesini engeller: bu durumda önce bulut kaydı yüklenmelidir. Diğer cihazlar bağlantı kurmadan onların yerel diskini uzaktan silmek mümkün değildir. Misafir kayıtları ve daha önce indirilmiş yedekler ayrı kalır.

Oturum ve yerel ilerleme cihazda saklandığı için ortak bilgisayarda ayrı tarayıcı profili kullanın. Çıkış yapmak yerel yedeği sessizce temizlemez. Hesap silme de kullanıcı verisinin cihaz yedeğini otomatik silmez; tarayıcının site verileri ekranından temizlemek kullanıcıya aittir.

Güvenli hesap silme için sunucu ortamına **`SUPABASE_SERVICE_ROLE_KEY`** ekleyin; asla `NEXT_PUBLIC_` kullanmayın. `/api/account/delete` aynı origin'i, geçerli bearer oturumunu, mevcut parolayla yeniden doğrulamayı ve `HESABIMI SİL` onayını denetler. Ters proxy arkasında `ACCOUNT_APP_ORIGIN` değerini gerçek HTTPS origin adresine (sonunda `/` olmadan) ayarlayın; boşsa mevcut `LUMI_APP_ORIGIN` kullanılır. Ardından Auth admin silme işlemi FK cascade ile özel tabloları temizler. Süreli istekler ve işlem başına kullanıcı deneme sınırı vardır; çok örnekli üretimde ağ seviyesinde ek hız sınırlaması gerekir.

Anahtar eklemek istemiyorsanız proje yöneticisi kullanıcı kimliğini güvenilir kanaldan doğruladıktan, dışa aktarma imkânı tanıdıktan ve silme talebini onayladıktan sonra Supabase Authentication / Users bölümünden doğru kullanıcıyı silmelidir. Uygulama bu yapılandırma eksikliğini açıkça gösterir.

## Bulut barındırma

Kodunuzu mevcut Node 24+ dağıtımınıza gönderin; Supabase ve Gemini ortam değişkenlerini o sunucuda tanımlayın. Supabase Auth redirect allowlist'ine gerçek adresi ekleyin. Mevcut Lumi SQLite ve doğum günü dosyaları için önceki belgelerdeki **kalıcı disk** gereksinimleri devam eder; Supabase bunları otomatik taşımaz. Bu değişiklik bir dağıtım yapmaz veya telefonunuza çalışan bir bulut adresi oluşturmaz. Dağıtılan HTTPS site ve Supabase hazır olunca giriş yaptığınız cihazlar bilgisayarınız kapalıyken de sunucuya ulaşabilir.

## Testler

`npm run test:accounts`: izolasyonlu cihaz anahtarları, yazıcı dondurma, kayıpsız bahçe aktarımı, değişmeyen misafir verisi, hash/idempotans, geçersiz/yeni sürüm engeli, kısmi yazma/geri alma ve sırların açık yapılandırmaya sızmaması. Resmî SDK sözleşme testi sahte HTTP transport ile kayıt/doğrulama bekleme, giriş, yeni istemcide oturum kalıcılığı, parola sıfırlama yönlendirmesi ve çıkışı sınar; gerçek e-posta göndermez.

PGlite ile **gerçek PostgreSQL motorunda**, tüm geçişler uygulanarak `anon` ve iki `authenticated` kullanıcıyla RLS, profil/günlük/sohbet/bahçe/arşiv ayrımı, doğrudan yazma reddi, atomik revizyon kontrolü, yinelenen ithalat/işlem engeli, gizlilik temizliği, eski cihazın özel veri geri yükleme engeli ve hesap silme cascade sınanır. Bu, canlı Supabase Auth/JWT altyapısı testi değildir.

`npm test`, `npm run lint`, `npm run typecheck`, `npm run build` genel kontrollerdir. Canlı Supabase kimlik bilgileri yoksa gerçek kayıt/doğrulama e-postası, canlı RLS/JWT yapılandırması ve iki fiziksel cihazda eşitleme kurulumu takiben ayrıca denenmelidir.

### Bu uygulamadaki doğrulama sonucu

172 test geçti (15 hesap/SQL/Auth/eşitleme testi dahil). Lint, TypeScript ve üretim derlemesi geçti. 390 piksel mobil profil/giriş görünümü, taşma kontrolü ve eksik yapılandırma mesajı tarayıcıda kontrol edildi. Eşitleme koordinatörünün gerçek kodu, sahte taşıma ile kayıp yanıt/aynı UUID ile tekrar, kayıt sürerken yeni değişiklik, değişmemiş veride isteği atlama, revizyon çakışması ve onaylı aktarım senaryolarından geçti. Gerçek Supabase ortam değişkenleri bulunmadığı için canlı kayıt/e-posta ve iki fiziksel cihazda eşitleme denenmedi.
