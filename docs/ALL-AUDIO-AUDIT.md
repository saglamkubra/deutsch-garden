# Bütün ses kaynaklarının taraması — 30 Ekim 2026

## Bulgular ve düzeltmeler

Alıştırma dinleme soruları `Pronunciation` bileşenine artikel + kelimeyi
gönderiyordu. Önceki dizin yalnızca 633 ders ifadesini içerdiği için kelimelerin
çoğunda telefonun SpeechSynthesis sesi devreye giriyordu. Aynı yol kelime
kütüphanesi, günlük kartlar, kayıtlı Lumi kelimeleri ve hikâye sözlüğü yedeğinde
de kullanılıyordu. Kullanıcının önceki cızırtı sorunu hazır kayıtla düzelmişti.

- Bütün 692 sabit sözlük kaydının kelime, artikel, örnek ve kart metinleri;
  derslerin örnek/sesli soruları ve sabit hikâye sözlüğü tarandı.
- 477 yeni kısa MP3 yerelde üretildi (yaklaşık 5,94 MiB). Mevcut 693 metnin
  kayıtları tekrar kullanıldı. Toplam 1.170 farklı sabit metin hazır kayda bağlı.
- Altı CEFR düzeyindeki üretilen dinleme alıştırmalarının ses metinlerinin
  tamamının dizinde bulunduğu test edildi. Kullanıcının eklediği yeni özel
  kelimeler bu sabit katalog kapsamına otomatik girmez.
- Ders, hikâye ve dinleme oynatıcılarında başlangıç hızı 1× oldu; yavaşlatma
  seçenekleri korunur. Perde koruması açıkça etkinleştirildi. Kelime düğmesinin
  yavaş hızı 0,8× olarak devam eder.
- Yeni ses yolları açık indirme önbelleği izin listesine eklendi; özel sayfa ve
  API cevapları önbelleğe alınmaz. Yeni dosyalar otomatik olarak tümüyle cihaza
  indirilmez.

## Sayısal dosya kontrolü

`reports/audio-audit.json`: tüm 1.753 MP3/WAV dosyası miniaudio ile PCM'e
çözümlendi. 1.752 farklı manifest yolu incelendi; toplam ses yaklaşık 176 dakika.
Dosya varlığı, kayıtlı SHA-256, çözümlenen süre, boş/sessiz veri, RMS seviyesi ve
örnek kırpılması kontrol edildi. Hata: 0; sayısal uyarı: 0.

Uyarı eşikleri: örneklerin yüzde 0,1'inden fazlası 16-bit tavanına ulaşırsa
kırpılma uyarısı; RMS -42 dBFS altında ise çok düşük seviye uyarısı. Bunlar
telefon hoparlörü, Bluetooth, işletim sistemi veya algısal telaffuz kalitesi
testi değildir. Her dosya insan tarafından dinlendi iddiasında bulunulmaz.

## Ses yollarının durumu

| Alan | Kaynak / sınır |
|---|---|
| Alıştırmalar ve sabit kelime kartları | Hazır Almanca kayıt; bilinmeyen özel metinde mevcut cihaz sesi yedeği |
| A1–C2 ders örnekleri | Mevcut 1.419 örnek kaydı korunur |
| Dinleme Kulübü | Mevcut 65 bölüm kaydı; cihaz sesi yalnızca açıkça seçilen yedek yol |
| Hikâyeler | Mevcut sahne, cümle ve sözlük kayıtları; cihaz sesi açıkça seçilen yedek yol |
| Lumi canlı AI yanıtları | Anlık/özel metin olduğu için cihaz sesi; etiket bunu açıkça belirtir. Kalite cihazdaki sese bağlıdır. Özel yanıtlar ses üretimi için dış servise otomatik gönderilmez. |
| Bahçe efektleri | İki sinüs tonu, düşük gain ve yumuşak zarf; kod incelendi, kullanıcı tercihi korunur |

## Tekrar üretim ve güvenlik

Kaynak seçimi `src/lib/learning/audio-catalog.ts`; hazırlama
`scripts/prepare-public-pronunciation.ts`; yerel üretim
`scripts/generate-public-pronunciation.py`; dizin
`scripts/export-pronunciation-audio.ts`; tam dosya taraması
`scripts/audit-public-audio.py`. Araçlar yalnızca açık, yazılmış eğitim
içeriğini okur. Üretim anahtarları veya bulut veritabanı kullanılmaz. TTS modeli
ve Python araçları .cache altında kalır, Git/Render paketine girmez.

Güncel dizin ve sesler Git'e kaydedilir; Render yalnızca mevcut dosyaları sunar.
npm prebuild ses üretmez veya ağ isteği yapmaz. Yeni metin ses üretimi
tamamlanmadan eklenirse kapsam kontrolü derlemeyi durdurur. Mevcut ses dosyaları,
hesap, ilerleme, bahçe, XP ve ödül kayıtları değiştirilmez; SQL gerekmez.

Yayın güncellendikten sonra telefonda alıştırma dinleme sorusu, kelime kartı,
ders, hikâye ve dinleme bölümünü normal/yavaş hızda kontrol etmek gerekir.
Önceki tek cümle için kullanıcı teyidi var; bu genişletmenin yeni telefon
kabulü henüz yapılmadı.

## Son doğrulama

- Tam test kümesi: 324/324 geçti. Yeni ses yollarının çevrimdışı aralık isteği testi ayrıca geçti.
- Lint, TypeScript ve webpack üretim derlemesi başarılı.
- Paket güvenlik kontrolü: özel dosya 0, tarayıcı paketinde mevcut sır 0.
- Toplam 1.753 dosyanın çözümlenmesi, manifest/hash, sessizlik, süre ve seviye taraması: hata 0 / uyarı 0.
- Gerçek telefonun yeni alıştırma sesleri için kullanıcı kabulü yayın sonrasında bekliyor.
