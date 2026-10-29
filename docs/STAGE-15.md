# 15. adım — Kişisel doğum günü karşılaması ve görsel son dokunuşlar

Bu adım önceki tarihli doğum günü atölyesini değiştirmez. `/hediye-atolyesi`, gizli tarih/mektup ayarları, `/hatira-bahcem`, önceki yıldız çiçekleri ve bütün öğrenme kayıtları korunur. Yeni karşılama isteğe bağlıdır; varsayılan olarak kapalıdır. 16. adım eklenmedi.

## Mesajı kişiselleştirme

Yalnızca **`src/config/birthday-welcome.ts`** dosyasını düzenleyin:

```ts
export const birthdayWelcome: WelcomeConfiguration = {
  enabled: false,
  recipientName: "",
  senderSignature: "",
  message: `...`,
};
```

- `recipientName`: Alıcının görünen adı. Boş bırakmak mümkündür; isim uydurulmaz veya hesap e-postasından türetilmez.
- `message`: Çok paragraflı kişisel mesaj. Mevcut dosyada talep edilen Türkçe doğum günü mesajı ve “Alles Gute zum Geburtstag! 💜” kapanışı aynen bulunur. Paragraflar arasında boş satır bırakın. En fazla 8000 karakter.
- `senderSignature`: İsteğe bağlı imza. Boşsa imza satırı gösterilmez.
- `enabled`: İlk ziyaret karşılamasını açmak için `true`, kapatmak için `false`.

Ad ve imza en fazla 80 karakterdir. Ayarı değiştirdikten sonra açık sayfayı tam yenileyin. Üretimde değişikliği yeniden derleyip dağıtın. Bu dosya yalnızca sunucu API'sinden okunur; istemci bileşenleri dosyayı doğrudan içe aktarmaz. Kapalı karşılamanın kişisel metni normal durum isteğinde döndürülmez.

Bu ayarda doğum günü tarihi istenmez veya varsayılmaz. `enabled: true` olduğunda ilk uygun ziyaret karşılaması gösterilir; mevcut atölyenin takvim kontrollü sürprizi kendi kurallarıyla çalışmaya devam eder.

## Önizleme ve tekrar izleme

1. `npm run dev` ile uygulamayı açın.
2. `http://127.0.0.1:3000/dogum-gunu?onizleme=1` adresine gidin.
3. Mesajı ve hediye animasyonunu deneyin. “İlk ziyaret penceresini dene” düğmesi, aynı içeriği yerel `<dialog>` penceresinde açar; Tab, Shift+Tab ve Esc davranışları da böyle denenebilir.

Önizleme **gerçek hediye, görüldü kaydı, XP veya bahçe yazması oluşturmaz**. Giriş düğmesi yalnızca bileşenin yerel animasyon durumunu değiştirir. Önizleme sayfasında otomatik karşılama, eski doğum günü giriş bandı ve oyunlaştırma yazıcısı devre dışıdır. Profildeki “Kayıtsız önizleme” bağlantısı geliştirme ortamında görünür. Üretimde önizleme mevcut kurucu oturumuyla korunur; giriş yapılmamışsa özel içerik gösterilmez.

Gerçek karşılamadan sonra **Profilim → Doğum günü karşılamam → Karşılamamı yeniden izle** yolunu kullanın. `/dogum-gunu` kaydedilmiş ilk mesajı ve imzayı gösterir. Tekrar izlemek yeni ödül veya yeni görüldü zamanı oluşturmaz. Karşılama sonradan kapatılsa ya da yapılandırma metni değiştirilse bile ilk kaydedilmiş hatıra korunur; dosyadaki yeni metin geliştirici önizlemesinde görülebilir.

## İlk ziyaret ve erişim

Lumi, özgün SVG hediye paketi, açan çiçekler, kelebekler, yumuşak konfeti ve kişisel mesaj bir arada gösterilir. Yerel modal pencere klavye odağını korur; kapanışta önceki odağa döner. Esc yalnızca o oturum için geçer; kalıcı kaydı giriş düğmesi oluşturur. Kayıt hatasında tekrar deneme ve o oturumda kaydetmeden devam etme seçeneği vardır. Karşılama hizmeti ulaşılamazsa öğrenme uygulaması engellenmez.

Hesap doğrulama/giriş/kayıt/parola yenileme sayfaları ve kurucu atölyesi kesilmez. Görüldü durumu mevcut hesabın veya misafirin bahçe kaydına aittir; çıkış/girişle farklı hesaba geçmek başka kişinin özel mesajını göstermez. Misafir kaydını hesaba taşıma, önceki açık onaylı aktarım akışını kullanır; otomatik aktarım yapılmaz. Ayrı bir hesap veya temizlenmiş tarayıcı henüz görülmemiş kabul edilebilir.

Mevcut `BIRTHDAY_ACCESS_PASSWORD` veya `LUMI_ACCESS_PASSWORD` ayarı varsa aynı alıcı oturumu kullanılır. Yetkisiz istek yalnızca erişim gerektiğini öğrenir; kişisel mesajı alamaz. Profil veya karşılama bağlantısı mevcut alıcı erişim formunu açar. Supabase hesap parolasıyla bu ayrı erişim parolası karıştırılmaz. Gönderimlerde mevcut origin kontrolü uygulanır. Oturum anahtarları veya özel konuşmalar loglanmaz; Lumi/Gemini isteği yapılmaz.

## Tek özel hediye ve kalıcılık

Yeni bir envanter veya ikinci doğum günü ekonomisi oluşturulmaz. Önceki sistemdeki satın alınamayan, özgün çiçekli SVG çizimine sahip **Dilek Çelengi (`birthday-arch`)** kullanılır. Karşılama hediyesi XP, para veya ek tohum vermez.

`birthday:welcome-v1` sabit işlem kimliğiyle mevcut bahçe kilidi altında **tek atomik yazma**, hem çelengi hem ilk mesajın kopyasını hem görüldü zamanını kaydeder. Çelenk önceki tarihli doğum günü sürprizinden zaten alınmışsa yeni kopya oluşturulmaz. Çift tıklama, paralel sekmeler veya tekrar izleme envanteri çoğaltmaz. Taşıma ve bahçeden kaldırma, mevcut süs sistemiyle çalışır; sahiplik kalıcıdır. Önceki doğum günü mektupları, tohumları ve paraları aynen kalır.

`GardenState.birthdayWelcome` isteğe bağlıdır; eski kayıtlar geçerliliğini korur. Mevcut hesap başına localStorage alanı ve Supabase `user_progress` belgesi/RLS politikaları kullanılır. Başka cihazda hatıranın görünmesi için önce buluta kaydedilmiş olması gerekir; eşitleme durumu profilden takip edilir. Çakışmalar mevcut revizyon ve açık seçim akışına tabidir. **15. adım için yeni SQL veya anahtar gerekmez.** 14. adım başarı ödüllerinin kendi `007` geçiş gereksinimi devam eder.

## Görsel ve erişilebilirlik iyileştirmeleri

- Var olan Nunito, pastel renkler, düğmeler ve Lumi çizimleri yeniden kullanıldı.
- Hediye paketi yeni özgün SVG'dir; yeni görsel servisi veya bağımlılık eklenmedi.
- Yeni mesajda paragraflar korunur, ad ve imza taşmadan sarılır. Uzun içerik modal içinde kaydırılabilir.
- Konfeti kısa sürer; çiçek/kelebek hareketleri yumuşaktır. `prefers-reduced-motion` ile animasyonlar durur, konfeti gizlenir.
- Klavye odak halkaları ve küçük metinlerin kontrastı hesap/başarı/doğum günü sayfalarında tutarlılaştırıldı. İşleyen sayfalar yeniden yazılmadı.
- Önizleme veya yükleme sırasında bilinmeyen XP/seri değerleri sıfır gibi gösterilmez.

## Testler

`npm run test:birthday-welcome`: varsayılan metin, isimsiz/kapalı ayar, alan doğrulaması, ilk ziyaret koşulları, giriş ve kurucu sayfalarının dışlanması, tek kalıcı süs, eski hediyenin korunması, yerleştirme/taşıma/kaldırma, tekrar izleme, yerel/hesap kalıcılığı, kullanıcı izolasyonu, başarısız yazmada görüldü kaydının oluşmaması, paralel talepler, üretim önizleme yetkisi, alıcı parolası ve origin kontrolleri.

Genel kontroller: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`. Tarayıcıda geliştirici önizlemesi, modal klavye odağı/Esc ve mobil görünüm ayrıca kontrol edilir. Önizlemeyi gerçek karşılama gibi etkinleştirmek veya özel kullanıcının görüldü kaydını sıfırlamak test için gerekmez.
