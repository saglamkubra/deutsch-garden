# 12. adım — Günlük hediye, hasat ve kalıcı koleksiyon

## Nasıl kullanılır?

1. **Çiçek Dükkânım** (`/cicek-dukkani`) sayfasından mevcut bahçe paranla tohum al. Hediyeler ve öğrenme kilometre taşları da tohum kazandırabilir.
2. **Bahçem** (`/bahcem`) sayfasında boş toprağa dokun, çantandaki tohumu seç. Bir ekim bir tohum kullanır.
3. Çiçeğin **Tohum → Filiz → Bitki → Tomurcuk → Çiçek** aşamalarını izle. Türe göre 45 saniye–2 dakika 45 saniye sürer. Kayıtlı zaman damgalarıyla sayfa kapalıyken de büyür; çiçekler ölmez. Ayrıntı paneli yüzdeyi ve kalan süreyi gösterir.
4. İstersen 20 saniye arayla iki kez sula; her sulama 10 saniye katkı verir. Yeni uygun öğrenme ödülleri büyüyen bitkilere 5 saniye katkı sağlar: günde en çok altı katkı, bitki başına en çok 30 saniye öğrenme katkısı. Aynı makbuz tekrar işlendiğinde katkı veya kaynak yeniden verilmez. Ek çalışma yapmadan yalnızca zamanla da büyürler.
5. Tam açan çiçeğe dokun ve **🌸 Topla · Koleksiyonuma ekle** düğmesine bas. Çiçek kalıcı **Çiçek Koleksiyonum** albümüne eklenir, toprağı boşalır. Hasat ek para veya XP üretmez; sınırsız para döngüsü yoktur. Toplamadan bahçede bırakmak da mümkündür.
6. Albümde **Bahçede göster** seç; çiçek hatıraları bölümündeki boş köşeye dokun. Gösterim koleksiyon sayısını azaltmaz. Bir türden aynı anda gösterebileceğin sayı, topladığın miktarı aşamaz. Yerleşmiş çiçeğe dokunarak taşı veya **Koleksiyonda sakla, buradan kaldır** seç. Başlangıç ve dükkân süslerinin altı köşesi ayrı korunur.
7. Hasat edilen boş toprağa yeniden tohum ek. Önceki çiçek koleksiyonda kalır. Yeni ekim ayrı kimlik taşır; eski hasat isteği yeni bitkiyi toplayamaz.

## Günlük Hediyem

`/gunluk-hediyem` sayfasında her Türkiye takvim gününde bir ücretsiz kutu açılır. Normal olasılıklar: %30 10 bahçe parası, %18 10 XP, %22 üç papatya tohumu, %12 iki lavanta tohumu, %8 Yıldız Feneri, %6 iki Ay Işığı tohumu, %4 bir Yıldız Zambağı tohumu. Zaten sahip olunan fener yerine 10 bahçe parası gelir.

Her yedinci açılış, ardışık gün şartı olmadan özel tohum garantiler; Yıldız Zambağı ve Unutma Beni dönüşümlüdür. Bunlar ayrıca 5 ve 12 uygun kayıtlı öğrenme etkinliği sonrasında, yeni öğrenme ödülü teslim edilirken birer kez açılır. Mevcut kayıtlı etkinlikler sayılır; sırf güncelleme yüklendi diye kaynak oluşturulmaz.

Animasyon, envanter kaydı başarıyla yazıldıktan sonra gösterilir. Yenilemek veya farklı sekmeden tekrar açmak sonucu değiştirmez. Geri sayım Türkiye saatiyle sonraki 00.00'a göredir. Kaçırılan günler birikmez; kutu gerçek para, ödeme veya bahis içermez. Eski son hediye gününden daha eski güne dönmek yeni kutu vermez.

## Veri ve güvenlik sınırları

Mevcut `deutsch-garden:garden:v1` kaydı genişletildi: `collection`, `flowerPlacements`, `dailyGifts`, `learningGarden`; bitkilere isteğe bağlı kimlik ve öğrenme katkısı eklendi. Önceki topraklar, para, ödül makbuzları, süs sahipliği/yerleşimi ve alışveriş geçmişi korunur. Yalnızca iki yeni türün eksik tohum alanları sıfırla tamamlanır; eski tohumlara ek başlangıç miktarı verilmez.

Günlük hediye, hasat, yerleştirme, dükkân, büyüme ve öğrenme teslimi aynı Web Locks kilidinde güncel kaydı okuyarak çalışır. Hasat/gösterim veya hediye kaydedilemezse başarılı sayılmaz; bitki, çanta ve kalıcı koleksiyon değiştirilmez. Hasat için bitki örneği kimliği, hediye için benzersiz gün makbuzu kullanılır. Kalıcı koleksiyon sayıları en çok 999.999, tohumlar tür başına 9.999; hediye geçmişi en çok 3.650 kutudur. Sınırda eski makbuzlar silinerek yeniden ödül açılmaz.

XP mevcut `deutsch-garden:exercises:v1` defterine `gift:daily:YYYY-MM-DD` kimliğiyle 10 XP olarak teslim edilir. Hediye kaydı önce yazılır, XP teslim bayrağı sonra işaretlenir. Arada kesinti olursa yeniden deneme aynı XP makbuzunu kullanır; puanı iki katına çıkarmaz. Bayrak yazımı başarısız olsa bile XP defteri tekrar teslimi tanır. Hediye ve XP defteri kilitleri iç içe tutulmaz.

Bu proje halen tarayıcı yerel kaydını kullanır; gerçek kullanıcı hesapları veya Supabase eşitlemesi bağlı değildir. Lumi'nin erişim parolası, hediye için çok kullanıcılı hesap sistemi sayılmaz. Veriler cihazlar arasında eşitlenmez. Tarayıcı kaydını silmeye/düzenlemeye veya cihaz saatini ileri taşımaya karşı sunucu tabanlı koruma yoktur; normal sayfa yenileme, çift tıklama, tekrar istek ve sekmeler arası yarışlar korunur. Yerelde ek API anahtarı veya yeni servis kurulumu gerekmez. HTTPS/localhost ve Web Locks destekli güncel tarayıcı gerekir. Güncellemeyi tüm açık uygulama sekmelerinde yenileyin.

## Doğrulama

`npm test`: 144 test geçti. Lint, TypeScript ve üretim derlemesi kontrol edildi. Yeni testler beş aşamayı, tüm türlerin çevrimdışı büyümesini, eski bitki hasadını, erken/tekrar/eski hasat isteğini, yeniden ekimi, kalıcı koleksiyonu, gösterim kapasitesini, taşıma/kaldırmayı, büyüme katkı sınırlarını, özel tohumları, olasılık aralıklarını, İstanbul gece yarısını, saat geri almayı, yedinci kutuyu, eski kayıt geçişini, bozuk kayıtları, paralel hediye/hasadı ve yarıda kalan XP teslimini kapsar.

Canlı tarayıcıda günlük kutunun üç papatya tohumu verdiği ve tek kayıt olarak korunduğu görüldü. Üçüncü alandaki bir papatya toplandı; koleksiyonda bir papatya oluştu. Sergileme birinci köşeden ikinci köşeye taşındı; sayı bir kaldı. Üçüncü toprak yeniden bir papatya tohumu ile ekildi. Eski diğer çiçekler, saksı, mantar, iki alışveriş kaydı ve 54 bahçe parası korundu.

13. adıma başlanmadı.
