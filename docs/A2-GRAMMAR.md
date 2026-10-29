# A2 Gramer — 12 tamamlanmış ders

Bu çalışma yalnızca A2 Gramer içeriğini ve daha uzun testler için gereken
mevcut arayüz/depolama uyarlamasını ekler. A1'in 16 dersi, beş soruluk eski
denemeleri, soru kimlikleri ve ödül modeli korunur. 66 konunun 28'i artık hazır;
B1–C2'deki diğer 38 gramer konusu hâlâ plandır.

## Konular

| Kalıcı kimlik | Konu |
| --- | --- |
| grammar-a2-01 | Dativ |
| grammar-a2-02 | Akkusativ ve Dativ karşılaştırması |
| grammar-a2-03 | İki hâlli edatlar |
| grammar-a2-04 | Perfekt |
| grammar-a2-05 | Präteritum |
| grammar-a2-06 | Dönüşlü fiiller |
| grammar-a2-07 | Komparativ ve Superlativ |
| grammar-a2-08 | Sıfat eklerine giriş |
| grammar-a2-09 | weil ve dass |
| grammar-a2-10 | Bağlaçlar |
| grammar-a2-11 | Imperativ |
| grammar-a2-12 | Geleceği ifade etmek |

Her derste Türkçe giriş ve hedefler, başlıklı sekiz ayrıntılı anlatım,
sekiz iki dilli açıklamalı örnek, hatalı/doğru biçim kartı, bir hata düzeltme
pratiği, Lumi'nin hazır ipucu ve 24 soruluk test vardır.
Toplam 96 anlatım, 96 örnek, 288 test sorusu ve 12 hata düzeltme pratiği bulunur.

Testin sekiz sorusu ek anlam/kural kontrolüdür; sekizi örneklerdeki odak biçimi
tamamlatır, sekizi verilen sözcüklerle örnek sırasını yeniden kurdurur.
Dolayısıyla 288 soru, 288 bağımsız yeni iletişim bağlamı anlamına gelmez.
Tekrarlanan örnekler kontrollü biçim ve diziliş pratiği içindir.

Anlatım, ‘hareket varsa Akkusativ’, ‘Perfekt yalnız yakın geçmiş’, ‘müssen nicht
yasaktır’ gibi yanıltıcı genellemeleri özellikle karşı örneklerle ayırır.
Sıfat dersinin kapsamı belirli artikel ve ein ailesinin temel hâlleridir;
artikelsiz güçlü çekim bütün ayrıntılarıyla tamamlandı sayılmaz.

## Çalışan öğrenme ve kayıt akışı

Konuyu oku ve onayla → işaretli hatalı kısmı düzelt → 24 soruluk testte en az
20 doğru yap. 19/24 yaklaşık %79 olduğu için geçmez; 20/24 yaklaşık %83'tür.
Bu eşik mevcut en az %80 kuralından hesaplanır. Okuma/pratik kapıları olmadan
yalnızca test çözmek tamamlanma veya ödül sağlamaz.

Her onaylı cevap ve mevcut soru sırası eski `deutsch-garden:grammar:v1`
modelinde saklanır; eski beş soruluk testler geçerli kalır. Yeni soru sayısı
dersin gerçek testine göre doğrulanır; keyfî uzun denemeler kabul edilmez.
Sonuç paydası, başarı hedefi ve kütüphane kartları da gerçek soru sayısını kullanır.

İlk tamamlama, mevcut 15 XP + 10 bahçe parası makbuzuyla çalışır;
mevcut her beş farklı gramer tamamlamasında tohum kuralı korunur.
Aynı konu tekrarından ikinci tamamlama ödülü oluşturulmaz. Bu çalışma yeni
para birimi, yeni ödül sistemi veya yeni Supabase tablosu eklemez.

Hesaplı kullanım mevcut anlık görüntü/eşitleme katmanını kullanır. Gerçek kullanıcı
hesabı ya da üretim veritabanı test için değiştirilmez. Yeni SQL veya ortam
değişkeni gerekmiyor. Gemini'ye istek yapılmaz ve Lumi ayarları değiştirilmez.

## Kaynak kod

- `src/lib/grammar/a2-specs.ts`: ilk altı dersin özgün anlatım ve örnekleri.
- `src/lib/grammar/a2-more.ts`: diğer altı ders.
- `src/lib/grammar/a2.ts`: kalıcı kimlikler, ders ve soru oluşturma.
- `src/lib/grammar/content.ts`: önceki taslak kimliklerini aynı sırada hazır derslerle eşler.
- `types.ts`: isteğe bağlı örnek açıklaması ve anlatım başlıkları; eski dersler uyumlu kalır.
- `persistence.ts`: konuya göre test uzunluğu.
- `src/components/grammar/lesson.tsx`, `library.tsx`: açıklamalar ve dinamik test sayıları.
- `src/lib/grammar/grammar.test.ts`: yeni içerik, kayıt ve ödül regresyon testleri.

## Sınırlar ve dil kaynakları

Serbest Almanca üretimi bir dil öğretmeni veya AI tarafından puanlanmaz.
Sıralama sorusu örnek dizilişini kabul eder; Almancadaki bütün doğal alternatif
yerleşimlerin kabul edildiği iddia edilmez. Onaylanmamış yazı/taş taslağının
yenilemede korunması garanti edilmez; onaylı cevaplar korunur.
İnsan öğretmen incelemesi ve CEFR sertifikasyonu yapılmış değildir.

Metinler, sorular ve çeviriler projeye özgü olarak yazıldı; kaynak alıştırmaları
kopyalanmadı. Dilbilgisel başvuru için:

- [IDS grammis — iki hâlli edatlar](https://grammis.ids-mannheim.de/progr%40mm/6858)
- [IDS grammis — dilbilgisi terimleri, zaman yapıları](https://grammis.ids-mannheim.de/pdf/sgt/verzeichnis%20grammatischer%20fachausdruecke%2017-06-2019.pdf)
- [Goethe-Institut A2 — karşılaştırma ve sonuç bağlayıcıları](https://lernplattform.goethe.de/pluginfile.php/1496709/mod_folder/content/0/DTonlineA2_K07_GR-RM_Rueckschau_DE.pdf)

## Doğrulama sonuçları

- Tam paket: **254 test başarılı**. Son düzeltmelerden sonra 15 gramer testi
  ayrıca yeniden başarılı.
- Lint uyarısız; TypeScript kontrolü ve son üretim derlemesi başarılı.
- Paket denetiminde özel dosya ve tarayıcıya sızmış mevcut sır sayısı sıfır.
- 25 ana HTTP hedefi ve 12 yeni ders bağlantısı başarılı; hazır olmayan C2
  konusu 404 kalır. HTTP başarısı tek başına ders tamamlama testi sayılmaz.
- Ayrı `127.0.0.1:3001` misafir oturumunda Dativ okuma/pratik adımları ve
  24 soruluk testin ilk cevabı denendi. Yenilemede cevap ve adımlar korundu.
- 390×844 mobil boyutta Dativ sayfasında yatay taşma görülmedi. Kütüphanede
  A2 seçildiğinde 12 konu hazır görünür. Fiziksel telefon testi değildir.
- Eski A1 kaydı ile 12 A2 tamamlanmasının birlikte geçerli bulut belgesine
  sığması yerel testte doğrulandı; canlı Supabase'e özel veri yazılmadı.

## Önizleme yolu

`npm run dev` → `/gramer` → **A2** → konu kartı.
Doğrudan ilk ders: `/gramer/grammar-a2-01`.
Bu işlem yayınlama yapmaz; mevcut yerel geliştirme adresinde görünür.
