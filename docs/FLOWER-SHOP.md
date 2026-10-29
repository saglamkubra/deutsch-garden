# 11. adım: Çiçek Dükkânım

Adres: `/cicek-dukkani`. Geliştirme: `npm run dev`; önizleme: http://127.0.0.1:3000/cicek-dukkani

## Katalog

Yedi kategori, 16 ürün: altı başlangıç türü için tohum paketleri; B2 Ay Işığı ve C2 Kraliyet çiçeği tohumları; Naneli Bulut Saksı, Yıldız Feneri, A2 Şeker Kelebeği, B1 Dilek Ağacı, C1 Kristal Kümesi, C2 Kraliyet Kemeri, Sonbahar Balkabağı ve satışa kapalı Kış Küresi önizlemesi. Toplam 15 ürün satın alınabilir. Tüm çizimler projeye ait SVG/CSS'tir. Fiyat, kategori, seviye, stok durumu ve envanter davranışı `src/lib/shop/catalog.ts` içindedir.

Saksı ve ağaçlar kalıcı süstür; mevcut altı süs köşesinde kullanılır, ekim alanı kapasitesini artırmaz. Yeni çiçekler gerçekten ekilir, sulanır ve büyür. Tohum paketleri yeni işlem kimliğiyle tekrar alınabilir; kalıcı süsler yalnızca bir kez alınır. Önceden sahip olunan ürünler veya düzey değişince çantadaki eşyalar kaldırılmaz. CEFR kilitleri mevcut öğrenme ayarına bağlıdır; yeterlik belgesi değildir. Altı başlangıç çiçeği açık kalır.

## Kayıt ve işlem güvenliği

Mevcut `deutsch-garden:garden:v1` localStorage kaydı kullanılır. Para, tohum, süs sahipliği ve `purchases` makbuzları aynı JSON'a tek `setItem` ile yazılır. Eski kayıtlarda sadece iki yeni çiçeğin eksik tohum alanları sıfırla tamamlanır; eski para, tohum, bitki, yerleşim ve ödüller değiştirilmez. İşlem kaydında sabit ürün ve işlem kimliği, fiyat, miktar, önceki/sonraki bakiye ve zaman bulunur. Kayıt doğrulanır, son sağlam yedek ve hasarlı kayıt kurtarma davranışı korunur.

Satın alma, ekim/sulama/yerleşim, büyüme kaydı ve öğrenme ödülleri aynı Web Locks kilidini kullanır. Her işlem kilidin içinde güncel bahçeyi yeniden okur. İşlem kimliği tekrar kullanılırsa ikinci kez para düşülmez. Aynı kimlikle farklı ürün reddedilir. Çift tıklama ayrıca arayüzde eşzamanlı korumayla engellenir. Yetersiz bakiye, kilitli/satış dışı ürün, dolu tohum kapasitesi, sahip olunan kalıcı süs ve başarısız depolama işlemi satın almayı engeller. Başarısız yazımda başarı gösterilmez ve çanta değiştirilmez. Diğer öğrenme modülleri ödül teslimi tamamlanmadan makbuzu teslim edildi saymaz.

Bu bir sunucu ekonomisi değildir: tarayıcı verisini elle değiştiren kullanıcıya karşı merkezi doğrulama, hesaplar arası eşitleme veya veritabanı işlemi yoktur. Satın alma, güvenli bağlamda Web Locks destekleyen güncel tarayıcı gerektirir (HTTPS veya localhost). Destek yoksa alışveriş dürüst bir açıklamayla kapalı kalır. En fazla 1000 işlem kaydı tutulur; sınırda eski makbuzlar silinmez, yeni alışveriş durdurulur. Gerçek para, ödeme, şans oyunu ve ikinci para birimi eklenmedi.

## Doğrulama

`npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.

Yeni testler yedi kategoriyi, fiyat/kilit kurallarını, yetersiz bakiyeyi, satış dışı ürünü, çift işlemi, kalıcı sahipliği, tekrar tohum alımını, yeni çiçek büyümesini, süs taşıma/kaldırmayı, eski kayıt geçişini, sayfa yenilemesini, bozuk makbuzu, kapasiteyi, paralel ödül/satın alma/ekimi ve depolama hatasını kapsar.

Canlı arayüzde 8 bahçe parasına üç papatya tohumu ve 18 bahçe parasına Naneli Bulut Saksı alınmıştır; var olan 80 bakiye 54'e düşmüştür. Bir papatya üçüncü boş alana ekilmiş, saksı birinci süs köşesine yerleştirilmiştir. Eski birinci/ikinci papatyalar, on ikinci gül ve beşinci köşedeki mantar korunmuştur. Bunlar gerçek yerel işlemlerdir; test için para üretilmemiş ve kayıt sıfırlanmamıştır.

12. adıma başlanmadı.
