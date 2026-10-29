# C1 Gramer — 9 hazır konu

Mevcut grammar-c1-01–grammar-c1-09 kimlikleri aynı sırada hazır derslerle
bağlandı. A1–B2 içerikleri, soru kimlikleri, yer imleri ve kayıtlar korunur.
Bu C1 partisinin sonunda 66 konunun 59’u hazırdı. Sonraki C2 partisiyle
katalogdaki 66 konunun tamamına ders eklendi; güncel rapor C2-GRAMMAR.md içindedir.

## Kapsam

| Kalıcı kimlik | İçerik |
| --- | --- |
| grammar-c1-01 | Konjunktiv I: kişi, zaman ilişkisi, edilgenlik ve yerine geçen biçimler |
| grammar-c1-02 | İleri dolaylı anlatım: zamir, yer/zaman, soru ve rica aktarımı |
| grammar-c1-03 | Karmaşık cümle yapıları: katman, gönderim, koşul, amaç ve sonuç |
| grammar-c1-04 | Nominalstil: rol, Genitiv, edat, olumsuzluk ve bilgi kaybı |
| grammar-c1-05 | Geniş ortaçlı nitelemeler: çekirdek, hâl, etkenlik ve zu |
| grammar-c1-06 | Akademik yazı: amaç, yöntem, bulgu, ihtiyat ve kaynak |
| grammar-c1-07 | İleri kiplik: zorunluluk, çıkarım, duyum ve geçmiş mastarı |
| grammar-c1-08 | Üslup seçenekleri: hitap, nezaket, açık rica ve kesinlik |
| grammar-c1-09 | Edilgen alternatifleri: yapılabilirlik, gereklilik ve alıcı odağı |

Her derste Türkçe giriş, üç hedef, sekiz başlıklı ayrıntılı açıklama,
sekiz Almanca–Türkçe örnek ve her örneğin gerekçesi, hatalı/doğru kartı,
bir düzeltme pratiği, Lumi ipucu ve 24 soruluk açıklamalı test vardır.
Toplam **72 anlatım, 72 örnek, 216 test sorusu ve 9 pratik** eklenmiştir.

Testler sekiz kavram sorusu, sekiz örnek odaklı boşluk doldurma ve sekiz
verilen sözcükle örnek dizilişi kurma etkinliğidir. Bu 216 soru, 216 bağımsız
bağlam değildir; örnekler kontrollü pekiştirmede yeniden kullanılır.

## Değerlendirme ve koruma

Mevcut okuma + doğru pratik + yüzde 80 test başarısı koşulları sürer.
19/24 doğru yetmez, 20/24 yeterlidir. İlk tamamlamada mevcut
15 XP + 10 bahçe parası makbuzu kullanılır; tekrar çözmek ödülü çoğaltmaz.
Beş farklı tamamlamada mevcut tohum kuralı korunur. Yeni ödül sistemi yoktur.

Mevcut gramer deposu ve hesap anlık görüntüsü kullanılır. Yeni SQL,
ortam değişkeni veya veri aktarımı gerekmez. Gemini, Lumi, özel doğum günü
kayıtları ve canlı Supabase veritabanında değişiklik yapılmaz.

## Dosyalar

- src/lib/grammar/c1.ts: C1 kataloğunu mevcut üreticiye bağlar.
- src/lib/grammar/c1-first.ts: ilk üç özgün ders.
- src/lib/grammar/c1-second.ts: isim anlatımı, ortaçlar ve akademik yazı.
- src/lib/grammar/c1-third.ts: kiplik, üslup ve edilgen alternatifleri.
- src/lib/grammar/content.ts: aynı kalıcı kimliklere hazır içerik bağlantısı.
- src/lib/grammar/grammar.test.ts: içerik, bağımsız cevaplar ve kayıt testleri.
- README.md, docs/GRAMMAR.md ve bu belge: kapsam raporu.

## Önizleme

`npm run dev` ile uygulamayı aç; Gramer → C1 seç.
İlk ders `/gramer/grammar-c1-01` adresindedir. Taslak C2 konuları tamamlanmış
olarak sunulmaz ve bunlardan ödül kazanılmaz.

## Sınırlar ve kaynaklar

Dersler özgün içeriktir; bağımsız Almanca öğretmeni incelemesi veya CEFR
sınav sertifikası değildir. Kontrollü sorular bütün serbest yazı alternatiflerini
değerlendirmez. Konuşma parçacıkları ve modal kesinlik dereceleri bağlama bağlıdır;
mutlak yüzdeler veya her durumda geçerli eşanlamlılık iddiaları verilmez.
Gramerdeki mevcut ses desteği değiştirilmedi; bu parti yeni ses dosyası eklemez.

Kip ve aktarım ayrımları için başvuru denetimi:
- https://grammis.ids-mannheim.de/sgt/2233?termini=term
- https://grammis.ids-mannheim.de/kontrastive-grammatik/3363

## Doğrulama sonuçları

- `npm test`: 270/270 geçti; gramer bölümünde 29 test.
- `npm run lint`, `npm run typecheck`, `npm run build`: geçti.
- Üretim derlemesinde 271 sayfa üretildi.
- Ayrı yerel üretim test sunucusunda 25 genel HTTP kontrolü ve dokuz C1
  ders yolu HTTP 200 verdi. C2 taslak yolu beklenen HTTP 404 verdi.
- Paket kontrolünde özel dosya sayısı ve tarayıcı paketinde mevcut sır sayısı sıfırdı.
- Tüm C1 testleri her cevapta kaydet/geri yükle, 19/24 ile başarısızlık,
  20/24 ile başarı, üç tamamlanma koşulu ve tekrar ödülünün engellenmesini kapsar.
- Tüm 59 hazır konunun tamamlanmış denemeleri ve makbuzları mevcut hesap
  anlık görüntüsü doğrulamasından geçti. Bu sentetik testtir; canlı veri aktarımı değildir.
- Tarayıcıda C1 kataloğunun dokuz hazır dersi, ilk derste okuma onayı,
  yanlış/doğru pratik açıklamaları, ilk test cevabı ve yenileme sonrası
  okuma/pratik/cevap geri yüklemesi doğrulandı.
- 390×844 mobil tarayıcı boyutunda yatay taşma görülmedi. Gerçek telefon,
  canlı hesap eşitlemesi veya yeni Gemini isteği bu partide test edilmedi.
- Canlı Supabase değişikliği, veri sıfırlama veya dağıtım yapılmadı.
