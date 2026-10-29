# B1 Gramer — 12 hazır konu

Bu parti B1'in mevcut 12 taslak kimliğini aynı sırada hazır derslerle doldurur.
A1 ve A2 içeriği, geçmiş denemeleri ve kazanılmış ödüller değiştirilmez.
Katalog toplam 66 konu: **40 hazır ders**, B2–C2'de **26 taslak konu**.

| Kalıcı kimlik | Konu |
| --- | --- |
| grammar-b1-01 | İlgi cümleleri |
| grammar-b1-02 | Konjunktiv II: varsayım ve nezaket |
| grammar-b1-03 | Edilgen yapıya giriş |
| grammar-b1-04 | zu ile mastar |
| grammar-b1-05 | Gelişmiş yan cümleler |
| grammar-b1-06 | Plusquamperfekt |
| grammar-b1-07 | Genitiv |
| grammar-b1-08 | Edatlı fiiller |
| grammar-b1-09 | Sıfat çekimi |
| grammar-b1-10 | Zaman cümleleri |
| grammar-b1-11 | Koşul cümleleri |
| grammar-b1-12 | Dolaylı sorular |

## İçerik ve çalışma düzeni

Her derste Türkçe giriş, üç hedef, sekiz başlıklı anlatım, sekiz açıklamalı
Almanca–Türkçe örnek, hatalı/doğru kartı, bir hata düzeltme pratiği,
hazır Lumi ipucu ve 24 soruluk test vardır. Toplam **96 anlatım, 96 örnek,
288 test sorusu ve 12 hata düzeltme pratiği** eklenir.

Test başına sekiz ek anlam/kural sorusu, sekiz odak biçim tamamlama ve sekiz
verilen sözcüklerle örnek dizilişini kurma etkinliği bulunur. Dolayısıyla
288 soru, 288 bağımsız yeni bağlam anlamına gelmez; örnekler kontrollü
pekiştirme için iki soru türünde tekrar kullanılır.

Özellikle şu ayrımlar açıklanır:

- İlgi zamirinin cinsiyet/sayısı bağlı isimden, hâli yan cümledeki görevden gelir.
- Konjunktiv II geçmiş bildirme değildir; hätte/hatte ve könnte/konnte ayrılır.
- Edilgen Perfektte worden, değişim fiilinde geworden kullanılır.
- zu'lu grubun örtük öznesi her fiilde ana cümlenin öznesi olmak zorunda değildir.
- Genişletilmiş zu gruplarının virgülü, güncel 2024 resmî düzenine göre anlatılır.
- Dativ isteyen edatlı fiiller, yer edatlarının konum/hedef kuralına indirgenmez.
- als/wenn, damit/sodass, ob/wenn ve gerekli koşul/garanti ayrımları korunur.
- Dolaylı sorunun son noktalaması ana cümlenin türüne göre seçilir.

## Kayıt ve ödül uyumu

Yeni dersler mevcut `grammar-b1-01`–`grammar-b1-12` kimliklerini kullanır.
Önceden konulmuş yer imleri geçerlidir. Mevcut v1 gramer deposu, hesap
anlık görüntüsü ve eşitleme katmanı kullanılır; yeni tablo, SQL migration,
ortam değişkeni veya alternatif XP sistemi yoktur.

Tamamlanma: okuma onayı + doğru hata düzeltme pratiği + en az %80 test başarısı.
24 soruda 19 doğru yetmez; **20 doğru** yeterlidir. Her onaylı cevap ve deneme
korunur; yanlış denemenin geçmişi daha sonraki başarılı denemeyle silinmez.
İlk konu ödülü mevcut 15 XP + 10 bahçe parası makbuzudur. Her beş farklı
gramer tamamlamasında mevcut tohum kuralı işler. Tekrar ve yeniden yükleme
aynı ödülü yeniden oluşturmaz.

## Dosyalar

- `src/lib/grammar/b1-first.ts`: ilk altı konunun özgün kaynak metni ve soruları.
- `src/lib/grammar/b1-second.ts`: diğer altı konu.
- `src/lib/grammar/b1.ts`: B1 kataloğu.
- `src/lib/grammar/builder.ts`: konuya özgü kalıcı soru/örnek oluşturucu.
- `src/lib/grammar/content.ts`: aynı taslak kimliklerini hazır konularla eşler.
- `src/lib/grammar/grammar.test.ts`: yeni içerik ve eski kayıt regresyonları.

Eski A2 üreticisi yeniden yazılmadı. Ortak üreticinin A2 kaynaklarıyla
oluşturduğu sonuç, mevcut A2 dersleri ve soru anlık görüntüleriyle derin
eşitlik testiyle karşılaştırılır; sonuç aynıdır.

## Sınırlar

Bu içerik önerilen B1 öğretim sırasıdır; resmî CEFR sertifikasyonu veya insan
öğretmen onayı alınmış değildir. Serbest Almanca üretimi otomatik dil öğretmeni
gibi notlandırılmaz. Sıralama etkinliği verilen örnek dizilişini denetler;
bütün doğal alternatif dizilişlerin kabul edildiği iddia edilmez.

Bu parti Gramer'e sesli örnek oynatıcısı eklemez; mevcut Derslerim bölümünün
1.419 hazır örnek sesi korunur. İki ayrı bölümün ses kapsamı karıştırılmamalıdır.
Gemini/Lumi ayarları, özel mektuplar ve üretim veritabanı değiştirilmedi.
Yayınlama yapılmadı; gerçek cihaz ve canlı hesap eşitlemesi ayrıca doğrulanmalıdır.

## Dilbilgisi başvuruları

Metinler, örnekler ve çeviriler özgün yazıldı; kaynak alıştırmaları kopyalanmadı.

- [IDS grammis — ilgi cümleleri ve hâl seçimi](https://grammis.ids-mannheim.de/progr%40mm/6867)
- [IDS grammis — Aktiv ve Passiv](https://grammis.ids-mannheim.de/progr%40mm/6723)
- [IDS grammis — mastar cümleleri](https://grammis.ids-mannheim.de/progr%40mm/6865)
- [IDS grammis — güncel yan cümle virgül kuralları, §73](https://grammis.ids-mannheim.de/rechtschreibung/6203)
- [Rat für deutsche Rechtschreibung — resmî 2024 düzeni](https://www.rechtschreibrat.com/regeln-und-woerterverzeichnis/)

## Doğrulama sonuçları

- Tam test paketi: **261 başarılı test**. Gramer modülünde 20 test var.
- Lint uyarısız; TypeScript ve son üretim derlemesi başarılı.
- Paket denetiminde özel dosya ve tarayıcıya sızmış mevcut sır sayısı sıfır.
- 25 ana HTTP hedefi ve 12 yeni B1 ders yolu başarılı; hazır olmayan B2
  konusu 404 kalıyor. HTTP başarısı tek başına öğrenme akışı testi değildir.
- Ayrı `127.0.0.1:3001` misafir oturumunda ilk B1 dersinin okuma onayı,
  hata düzeltmesi ve ilk test cevabı UI üzerinden çalıştırıldı. Yenilemede
  tamamlanan adımlar ve onaylı cevap korundu. B1 kütüphanesinde 12 hazır konu var.
- 390×844 mobil boyutta ilgi cümleleri sayfasında yatay taşma görülmedi.
  Bu, fiziksel Android/iPhone üzerinde test yapıldığı anlamına gelmez.
- Testler her B1 konusunda her cevapta kayıt/geri yüklemeyi, 19/24 başarısız ve
  20/24 başarılı eşiğini, okuma/pratik kapılarını ve tekrar ödül engelini sınar.
- Canlı Supabase kullanıcısında yeni bir tamamlama veya ödül oluşturulmadı.

## Önizleme yolu

`npm run dev` → **Gramer → B1**. İlk konu `/gramer/grammar-b1-01`.
