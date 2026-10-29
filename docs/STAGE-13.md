# 13. adım — Doğum günü sürprizi ve Hatıra Bahçem

## Kurucu kurulumu

1. Sunucu ortamında veya yerelde `.env.local` dosyasında `BIRTHDAY_CREATOR_PASSWORD` ayarla. En az 12 karakter, alıcının uygulama parolasından farklı, güçlü bir parola seç. Bu değeri `NEXT_PUBLIC_` değişkenine yazma ve alıcıyla paylaşma.
2. Yerelde `npm run dev` sunucusunu yeniden başlat. http://127.0.0.1:3000/hediye-atolyesi adresini açıp kurucu parolasıyla giriş yap. Bu adres ana gezinmede gösterilmez; doğrudan adres bilinmesi ayarları okuma veya değiştirme yetkisi vermez.
3. **Doğum günü etkinlik tarihi**, **Alıcının adı**, **Gönderenin adı**, **Karşılama mesajı** ve **Kişisel doğum günü mektubun** alanlarını doldur. Tarih, kutlamanın yapılacağı yılın tarihidir; kişinin doğum yılı gerekmez. Adlar isteğe bağlıdır; boşsa genel hitap kullanılır. Hiçbir kişisel ad veya tarih kaynak koda sabit yazılmadı.
4. Mektupta paragraflar arasına boş satır bırak. En çok 8.000 karakter, adlarda 80, karşılamada 300 karakter desteklenir. HTML çalıştırılmaz. Hazır metin kişisel anı uydurmayan, değiştirebileceğin sade bir başlangıçtır.
5. İstersen geri sayımı kapat. **Ayarları kaydet** ile özel sunucu dosyasına kaydet. Aynı etkinliğin adını, tarihini veya mektubunu değiştirmek yeni ödül hakkı oluşturmaz.

Kurucu parolası eksik veya kısaysa atölye kapalı kalır ve kurulum açıklaması gösterilir. Gerçek kişisel tarih, adlar ve mektup bu geliştirme sırasında atanmadı; bunları kurucu seçmelidir.

## Güvenli önizleme

Giriş yaptıktan sonra atölyenin **Güvenli önizleme** bölümünü kullan. Kaydetmeden de formdaki metni görebilirsin. **Doğum günü öncesi**, **Doğum günü** ve **Doğum günü sonrası** görünümlerini seç; **Sürprizimi Aç** ile kutu ve mektubu dene. **Kutuyu yeniden dene** yalnızca önizlemeyi sıfırlar.

Önizleme hiçbir gerçek açılış isteği veya bahçe ödül teslimi yapmaz. Gerçek bahçe cüzdanı, XP, tohumlar ve doğum günü makbuzu değiştirilmez. Atölyede gerçek alıcı kutlama bandı da gösterilmez. Önizleme metin ve görselleri kurucuya özeldir; `?preview=1` gibi bir adres parametresi halka açık API'nin tarih kontrolünü aşamaz.

## Alıcının deneyimi

Sunucu günü **Europe/Istanbul** saatine göre hesaplar. Tarihten önce yalnızca izin verilmiş küçük geri sayım döner; kişisel ad, mektup, etkinlik kimliği ve hediye ayrıntıları halka açık yanıtın içinde bulunmaz. Geri sayım kapalıysa kutlamaya dair içerik gösterilmez. Doğum Günü Yıldızı da açılana kadar normal çanta, ekim listesi ve albümde görünmez.

Doğru gün uygulama açıldığında Lumi ile yumuşak bir kutlama bandı belirir. **🎁 Sürprizimi Aç** düğmesi `/hatira-bahcem` alanına götürür. Kutuyu açmak sunucunun tarih kontrolünü ve ardından mevcut bahçe kaydına güvenli teslimi yapar. Kalıcı kayıt başarıyla yazılmadan mektubun açılmış veya ödüllerin teslim edilmiş olduğu söylenmez.

Bir etkinlik için bir kez **1 Doğum Günü Yıldızı tohumu**, **20 mevcut bahçe parası** ve **Dilek Çelengi** kalıcı süsü verilir. Bu çiçek normal toprağa ekilir, iki dakikada büyür, sulanır, toplanır ve mevcut kalıcı çiçek albümünde saklanır. Sergilemek, taşımak veya kaldırmak koleksiyon sayısını azaltmaz. Hasat ek XP/para üretmez. Çelenk mevcut altı süs köşesinden birine yerleşir.

Hatıra Bahçem, kişisel mektubu, buketi, anı kartını, ilk açılış tarih/saatini, özel çiçeği ve açılan süsü gösterir. **Mektubumu Tekrar Oku** ile yeniden okumak mümkündür. Doğum günü geçse de kaybolmaz; o gün açamayan alıcı daha sonra da açabilir. Açılış anındaki mektup kopyası hatırada korunur; kurucunun sonradan düzenlemesi eski mektubu sessizce değiştirmez. Başka bir yıl için atölyedeki açık onaylı **Ayrı bir doğum günü etkinliği oluştur** seçeneği farklı kimlik üretir; önceki hatıraları silmez.

Lumi'nin Türkçe kutlaması ve üç Almanca doğum günü ifadesi hazır içeriktir; AI isteği yapmaz. Gerçek doğum gününde Lumi sohbet sayfasında da bu not görünür. Bir ifadeye dokunmak yalnızca mesaj taslağını doldurur; otomatik göndermez. Gemini sohbeti isteğe bağlı kalır; kişisel mektup AI'ye gönderilmez.

## Erişim ve dağıtım

Üretimde `BIRTHDAY_SESSION_SECRET` için en az 32 karakterlik rastgele sır kullan. Boşsa mevcut `LUMI_SESSION_SECRET` kullanılabilir. Yerelde güvenli sır dosyası otomatik oluşturulur. `BIRTHDAY_APP_ORIGIN` gerçek HTTPS origin olmalı; boşsa `LUMI_APP_ORIGIN` kullanılır. Sonuna `/` ekleme. Kurucu girişi HttpOnly, SameSite=Strict, üretimde Secure, dört saatlik imzalı çerezle korunur. Başarısız girişler sınırlıdır; özel metinler uygulama loglarına yazılmaz.

Alıcı erişimi isteniyorsa `BIRTHDAY_ACCESS_PASSWORD` kullanılabilir. Boşsa uygulamada zaten varsa `LUMI_ACCESS_PASSWORD` geçerlidir. Bu bir kurucu parolası değildir; kurucu oturumu alıcının gerçek hediyesini açma yetkisini otomatik vermez. Yerelde ikisi de boşsa, uygulamanın diğer genel alanları gibi doğum günü sonrasında erişilebilir.

Özel ayar `BIRTHDAY_DATA_DIR/config.json` içinde tutulur; varsayılan yer `.cache/birthday` dizinidir. Dosya web'e sunulan `public/` altında değildir. Güncelleme geçici dosya ve atomik yeniden adlandırma ile, sürüm kontrolüyle yapılır. Bozuk dosya sessizce sıfırlanmaz. Sunucuda tek uygulama örneği ve kalıcı disk kullan; bulutta `BIRTHDAY_DATA_DIR=/data/birthday`, mevcut `/data` kalıcı diski uygundur. Docker yapılandırması bu dizini hazırlar. Parolaları ve oturum sırlarını çalışma anında barındırıcının gizli ortam ayarlarından ver.

Alıcıdaki açılış makbuzu ve mektup kopyası mevcut `deutsch-garden:garden:v1` kaydının `birthdayMemories` alanındadır. Para, tohum, süs ve makbuz aynı kayda yazılır; Web Locks birden fazla sekmenin ikinci kez ödül vermesini engeller. Yeni etkinlik kimliği açıkça oluşturulmadıkça ödül tekrarlanmaz. Mevcut alışverişler, günlük hediyeler, koleksiyon ve XP değiştirilmez. En çok 100 doğum günü hatırası tutulur; eski makbuzlar silinerek yeni ödül hakkı yaratılmaz.

Henüz tam kullanıcı hesabı veya cihazlar arası Supabase eşitlemesi bağlı değildir. Ödül tekliği aynı tarayıcı veri kümesi içindir; yerel kaydı elle silmeye/düzenlemeye veya ayrı cihazda yeni kayıt başlatmaya karşı merkezi hesap defteri yoktur. Tarih kapısı ise sunucudadır; cihaz saatini ileri almak gelecekteki mektubu açamaz. Ek AI anahtarı veya yeni veritabanı gerekmez.

## Kontroller

157 test geçti; lint, TypeScript ve üretim derlemesi başarılı. Testler tarih öncesi/günü/sonrası, gizli geri sayım, yetkisiz kurucu erişimi, hatalı ve süresi dolmuş çerezler, giriş sınırı, alıcı erişimi, çok paragraflı mektup, atomik ayar kaydı, eski sürümle çakışma, ayrı etkinlik, ilk ziyaret, tekrar/sekme yarışı, başarısız kayıt, önceki ilerlemenin korunması ve özel çiçeğin ekim/hasat/sergileme döngüsünü kapsar. `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` kullanılır.

Görsel ve gerçek açılış testi ayrı portta, ayrı sunucu ayar dizininde ve kişisel ad içermeyen örnek etkinlikle yapıldı. Kurucu girişi, öncesi/sonrası önizlemeler, mobil/tablet taşma kontrolü, gerçek test açılışı, yenilemede aynı ilk açılış zamanı ve mevcut çantaya 20 para/1 özel tohum/1 çelenk teslimi doğrulandı. Asıl alıcının kaydına doğum günü ödülü verilmedi. Test sunucusu kapatıldı; örnek ayarlar `.cache/` içinde, sürüm kontrolü ve Docker bağlamı dışında kalır.

14. adıma başlanmadı.
