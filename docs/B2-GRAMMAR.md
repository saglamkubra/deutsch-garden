# B2 Gramer — 10 hazır konu

Mevcut grammar-b2-01–grammar-b2-10 kimlikleri korunarak taslaklar dolduruldu.
A1–B1 dersleri ve kayıtları korunur. Toplam 66 konunun 50’si hazırdır;
C1’in dokuz, C2’nin yedi konusu hâlâ taslaktır.

## Kapsam

1. İleri edilgen: süreç, durum ve modal yapı
2. Karmaşık ilgi cümleleri: dessen, deren ve was
3. İsimleştirme
4. Ortaçlı yapılar
5. Geçmişe dönük Konjunktiv II
6. İleri sözcük dizimi
7. Resmî yazılı Almanca
8. İleri bağlayıcılar
9. Dolaylı anlatım
10. İleri edat yapıları

Her konuda Türkçe giriş ve hedefler, sekiz başlıklı ayrıntılı anlatım,
sekiz çevirili ve açıklamalı örnek, hata karşılaştırması, düzeltme pratiği
ve 24 açıklamalı test sorusu bulunur. Toplam 80 anlatım, 80 örnek,
240 test sorusu ve 10 pratiktir. Soruların sekizi kavram kontrolü,
sekizi örnek odaklı boşluk doldurma, sekizi verilen örnek dizilişini kurmadır.
Örnekler pekiştirmede tekrar kullanılır; 240 bağımsız bağlam değildir.

## Kayıt ve ödüller

Mevcut gramer deposu ve hesap anlık görüntüsü kullanılır. Yeni tablo,
SQL veya ortam değişkeni gerekmez. Okuma + doğru pratik + en az yüzde 80
başarı gerekir: 19/24 yetmez, 20/24 yeterlidir. İlk tamamlama mevcut
15 XP + 10 bahçe parası makbuzunu üretir; yeniden çözmek ödülü çoğaltmaz.
Her beş farklı tamamlamanın mevcut tohum kuralı korunur.

## Kontroller

Otomatik testler tüm B2 derslerinde soru kimliklerini, seçenekleri,
örnek metinlerini, bağımsız referans cevaplarını, her cevapta kaydet/devam et,
üç tamamlanma koşulunu, başarı eşiğini, tekrar ödülünü ve A1/A2/B1 geçmişinin
hesap anlık görüntüsünde korunmasını denetler. Canlı Supabase değiştirilmez.

## Önizleme ve sınırlar

`npm run dev` ardından `/gramer` sayfasında B2’yi seç.
İlk ders: `/gramer/grammar-b2-01`.
Bu içerik bağımsız öğretmen incelemesinden geçirilmiş veya CEFR sınavı
olarak sertifikalandırılmış değildir. Otomatik değerlendirme kontrollü
cevapları ölçer; serbest yazının bütün doğal alternatiflerini değerlendirmez.
Gramer örneklerinin seslendirmesi mevcut cihaz ses desteğini kullanır;
ders haritasındaki hazır ses dosyası sistemiyle aynı değildir.

## Kaynak denetimi

Özgün Türkçe açıklamalar ve Almanca örnekler yazılmıştır. Kip/dolaylı anlatım
ayrımları için IDS grammis başvuru kaynakları:
- https://grammis.ids-mannheim.de/sgt/2233?termini=term
- https://grammis.ids-mannheim.de/systematische-grammatik/543

## Dosyalar

- src/lib/grammar/b2.ts: B2 kataloğu
- src/lib/grammar/b2-first.ts ve b2-second.ts: özgün ders içerikleri
- src/lib/grammar/content.ts: mevcut kimliklere bağlantı
- src/lib/grammar/grammar.test.ts: B2 ve eski kayıt uyumluluğu testleri
- README.md ve bu rapor: güncel kapsam

## Bu partide alınan sonuçlar

- npm test: 265/265 geçti (gramer: 24 test).
- Lint, TypeScript ve üretim derlemesi geçti; 262 sayfa üretildi.
- Ayrı üretim test sunucusunda 25 HTTP kontrolü ve 10 B2 ders yolu geçti.
  C1 taslak ders yolu beklenen 404 yanıtını verdi.
- Paket kontrolünde özel dosya ve tarayıcı paketinde mevcut sır bulunmadı.
- 390×844 tarayıcı görünümünde yatay taşma görülmedi. İlk B2 dersinde
  okuma, doğru pratik, test cevabı ve yenileme sonrası geri yükleme denendi.
- Gerçek telefonda, canlı hesapta veya Gemini ile yeni test yapılmadı.
  Mevcut üretim veritabanı ve ortam sırları değiştirilmedi; dağıtım yapılmadı.
