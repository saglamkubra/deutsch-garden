# Hikâye dünyasının genişletilmesi — 30 Ekim 2026

Mevcut 16 hikâyeye, düzey/kategori eşleşmeleri daha önce boş olan altı yeni
hikâye eklendi. Toplam 22 hikâye var. Her düzeyde her kategori dolmuş sayılmaz.

| Düzey | Kategori | Yeni hikâye | Ana dil görevi |
|---|---|---|---|
| A1 | Seyahat | Otobüsle Küçük Bir Keşif | Yön sorma, tabela okuma, yer ve zaman |
| A2 | Arkadaşlık | Kitabın Arasındaki Davet | Davet, seçenek sunma, plan değiştirme |
| B1 | Almanya’da Yaşam | Mahallenin Tamir Masası | Sorun tarif etme, gerekçe, yardımın sınırları |
| B2 | Gizem | Kütüphanedeki Kurşun Kalem İzi | Gözlem/varsayım ayrımı, kaynak karşılaştırma |
| C1 | Fantastik Maceralar | Hatıraları Dinleyen Ağaç | Mecaz, dolaylı anlatım, yorum ve rıza |
| C2 | Okul ve İş | Toplantı Tutanaklarının Arasında | Niyet/olgu, ince anlam, katkı/sorumluluk ayrımı |

Her yeni hikâyede 7 sahne, sahne başına 4 Almanca/Türkçe metin bölümü,
iki aşamalı gerçek seçimler ve 4 farklı son bulunur. Toplam ek içerik: 42 sahne,
168 iki dilli bölüm, 24 son, 42 metne dayalı açıklamalı soru ve 6 sözlük girdisi.
Her yolun sonunda yalnızca okunan üç sahnenin soruları sorulur. Seçimler aynı
hedefe giden sahte düğmeler değildir; farklı sonuçlar açar.

Sözlükte Haltestelle, Lesezeichen, Reparatur, Vermerk, Widerhall ve Urheberschaft
için artikel, Türkçe anlam ve örnek bulunur. Metindeki gerçek kelimelere
dokunularak açılır ve mevcut kelime koleksiyonuna bir kez kaydedilir. Yeni
kelimelerin hazır sesleri ortak telaffuz dizinine de eklendi; sabit ses metni
kapsamı 1.170'ten 1.176'ya yükseldi.

## Sesler

216 yeni MP3: her sahnenin bütünü, 168 tekil satır ve altı sözcük. Yaklaşık
19,2 MiB. Mevcut Piper/LAME araçlarıyla yerelde üretildi; yeni Gemini isteği,
ücretli ses servisi veya çalışma zamanı bağımlılığı yok. Model/araçlar .cache
altında kalır. Mevcut sesler değiştirilmedi. Yeni bütün seslerin tam çözümlemesi,
hash, süre, sessizlik ve aşırı seviye taraması geçti; insan dinlemesi iddiası yok.

Güncel genel tarama: 1.969 dosya, 1.968 manifest yolu, hata 0, sayısal uyarı 0.
Rapor: `reports/audio-audit.json`. Önceki ses taramasının 1.753 dosya sayısı,
bu genişletmeden önceki kapsamı gösterir.

## Saklama ve ödüller

Mevcut `deutsch-garden:stories:v1` şeması, Supabase snapshot eşitlemesi, XP ve
bahçe ödül sistemi kullanılır. İlk tamamlama XP'si, her sonun bahçe parası ve
başarılı soru ödülü mevcut idempotent kimlikleriyle çalışır; yeni para veya
ödül mekanizması yoktur. Eski hikâye kimlikleri, yollar, sesler, favoriler ve
dondurulmuş günlük atamalar korunur. Veritabanı geçişi veya sıfırlama gerekmez.

## Dosyalar ve kontrol

- Kaynak üretici: `scripts/build-story-expansion.mjs`; veriler:
  `src/data/stories/world-stories.json`, `world-glossary.json`.
- Ses üretici: `scripts/generate-story-expansion-audio.py`; manifest:
  `src/data/stories/world-audio.json`; genel sesler `public/audio/stories-worlds`.
- Katalog/oynatıcı/sözlük yeni kayıtları mevcutların sonuna ekler. Her birinin
  `/hikayeler/story-world-…` rotası normal statik derlemeye girer.
- `src/lib/stories/expansion.test.ts`: altı yeni eşleşme, gerçek kelime bağlantısı,
  24 yolun yeniden yüklenmesi, doğru/yanlış sorular, tekrarlanan ödüller,
  eski ilerleme ve günlük atama, tüm 216 sesin metin/hash/MP3 süre eşleşmesi.

CEFR etiketleri içerik hedefidir; resmî yeterlik veya öğretmen onayı değildir.
Bağımsız Almanca/Türkçe editör incelemesi ve yayındaki telefon kabulü yapılmadı.

## Son test sonuçları

- Tam test kümesi 328/328 geçti; lint ve TypeScript hatası yok.
- Webpack üretim derlemesinde 340 statik sayfa oluşturuldu.
- Yerel üretim HTTP kontrolünde altı yeni hikâye rotası 200, yeni MP3 aralık isteği 206 döndü.
- Paket güvenlik kontrolü: özel dosya 0, tarayıcıda mevcut sır 0.
- Yeni içerik ve sesler yalnızca genel eğitim varlıklarıdır. Henüz GitHub'a
  gönderilmedi veya Render'a dağıtılmadı; kullanıcı aktarımından sonra kontrol gerekir.
