# C2 Gramer — 7 hazır konu

Mevcut grammar-c2-01–grammar-c2-07 kimlikleri aynı sırada hazır içerikle
bağlandı. A1–C1 dersleri ve ilerleme kimlikleri korunur. Mevcut 66 konuluk
gramer kataloğunda artık taslak kalmadı. Bu, Almanca eğitiminin, tüm CEFR
becerilerinin veya Deutsch Garden’ın bütün özelliklerinin tamamlandığı iddiası değildir.

## İçerik

| Kalıcı kimlik | Konu |
| --- | --- |
| grammar-c2-01 | İleri üslup dönüşümü: odak ve bilgi sadakati |
| grammar-c2-02 | Deyimsel dilbilgisi: işlev fiili ve sabit kalıp |
| grammar-c2-03 | Dil düzeyi ve nüans: parçacık, odak, yorum sınırı |
| grammar-c2-04 | Karmaşık akademik yapılar: koşul, ölçüt ve genelleme |
| grammar-c2-05 | Söylem yapıları: sav, karşıtlık, düzeltme ve çıkarım |
| grammar-c2-06 | Kip ve kiplik: varsayım, çıkarım ve olumsuzluk kapsamı |
| grammar-c2-07 | Cümle dönüşümü: örtük özne, hâl ve mantıksal ilişki |

Her konuda Türkçe giriş, üç hedef, sekiz başlıklı uzun anlatım, sekiz
Almanca–Türkçe örnek ve gerekçesi, hatalı/doğru kartı, bir düzeltme pratiği,
Lumi ipucu ve 24 soruluk açıklamalı test bulunur.
Toplam **56 anlatım, 56 örnek, 168 test sorusu ve 7 pratik** eklendi.

Sorular sekiz kavram, sekiz örnek odaklı boşluk doldurma ve sekiz verilen
sözcüklerle örnek dizilişi kurma çalışmasıdır. Örnekler pekiştirmede yeniden
kullanılır; 168 bağımsız yeni bağlam veya tam bir C2 yeterlik sınavı değildir.
Karmaşık düşünceyi açık anlatmak hedeflenir; metin uzunluğu tek başına başarı sayılmaz.

## Kayıt ve ödül

Mevcut v1 gramer deposu ve hesap anlık görüntüsü sürer. Okuma onayı,
doğru düzeltme pratiği ve testte en az yüzde 80 başarı gerekir: 19/24 yetmez,
20/24 yeterlidir. İlk tamamlamada mevcut 15 XP + 10 bahçe parası makbuzu,
her beş farklı konuda mevcut lavanta tohumu kuralı kullanılır.
Tekrar çözmek yeni tamamlanma ödülü üretmez.

Yeni SQL, servis, ortam değişkeni veya veri aktarımı gerekmez.
Canlı Supabase, Gemini/Lumi ve özel doğum günü verileri değiştirilmez.

## Dosyalar ve önizleme

- src/lib/grammar/c2.ts: C2 kataloğu.
- src/lib/grammar/c2-first.ts: üslup, kalıplar ve nüans.
- src/lib/grammar/c2-second.ts: akademik yapılar ve söylem.
- src/lib/grammar/c2-third.ts: kiplik ve dönüşümler.
- src/lib/grammar/content.ts: aynı kalıcı kimliklere bağlantı.
- src/lib/grammar/grammar.test.ts: bağımsız referans cevapları ve kayıt uyumluluğu.
- next.config.ts: bellek taşmasına karşı derleme çalışanı ve çalışan başına
  statik sayfa eşzamanlılığı ikiyle sınırlandı. Uygulama davranışı değişmez.
- src/lib/grammar/c1-second.ts: iki hâl tamamlayıcısının yanlış Edat
  etiketleri kaldırıldı; eski soru cevapları ve kimlikleri değişmedi.
- README.md, docs/GRAMMAR.md ve bu rapor: güncel kapsam.

`npm run dev` ardından Gramer → C2 seç.
İlk ders `/gramer/grammar-c2-01` adresindedir.

## İçerik sınırları

İçerik özgün yazıldı; bağımsız Almanca öğretmeni incelemesi henüz yapılmadı.
Yazılı parçacık örnekleri gerçek ses tonunu değerlendirmez. Kontrollü cevap
sistemi serbest yazıdaki bütün doğal alternatifleri kabul eden dil modeli değildir.
Bu parti yeni ses dosyası üretmez; mevcut gramer ses davranışı korunur.

Kalıp, parçacık ve karşılaştırma başvuruları:
- https://grammis.ids-mannheim.de/vggf/2202
- https://grammis.ids-mannheim.de/kontrastive-grammatik/3840
- https://grammis.ids-mannheim.de/systematische-grammatik/1001

## Son doğrulama

- `npm test`: 275/275 geçti; gramerde 34 test.
- Lint, TypeScript ve üretim derlemesi geçti; 278 statik sayfa üretildi.
- İlk derleme 15 çalışanla bellek hatası verdi. Çalışan sayısı ve çalışan
  başına statik eşzamanlılık ikiye indirilince güncel derleme başarıyla geçti.
  Bu, Render’da canlı dağıtım veya kaynak kapasitesi doğrulaması değildir.
- Ayrı yerel üretim sunucusunda 25 genel HTTP kontrolü ve yedi C2 ders yolu
  geçti. Bilinmeyen konu beklenen HTTP 404 yanıtını verdi.
- Paket denetiminde özel dosya ve tarayıcı paketinde mevcut sır bulunmadı.
- Her C2 dersinde kimlikler, seçenekler, bağımsız referans cevapları,
  her cevapta kaydet/geri yükle, üç tamamlanma koşulu, 19/24 ile başarısızlık,
  20/24 ile başarı ve tekrarlanan ödülün engellenmesi test edildi.
- A1–C1 denemeleri ve makbuzlarının korunduğu, tüm 66 tamamlanmış gramer
  dersinin mevcut hesap anlık görüntüsünde doğrulandığı sentetik testlerle gösterildi.
- Tarayıcıda C2 kataloğundaki yedi hazır ders, ilk derste okuma onayı,
  doğru pratik, ilk test cevabı ve yenileme sonrası geri yükleme denendi.
- 390×844 mobil tarayıcı görünümünde yatay taşma görülmedi. Gerçek telefonda,
  canlı hesapla veya yeni Gemini isteğiyle bu partide test yapılmadı.
- Canlı Supabase değiştirilmedi; dağıtım, veri silme veya sıfırlama yapılmadı.

Güncel gramer toplamı: 66 ders, 1.280 test sorusu, 66 düzeltme pratiği.
Dinleme ve diğer modüllerin kalan içerikleri bu rakamlara dahil değildir.
