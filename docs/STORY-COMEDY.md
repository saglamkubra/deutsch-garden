# Hikâye Dünyası: komik hikâyeler

Boş olan Komik Hikâyeler kategorisine her CEFR düzeyi için bir özgün hikâye
eklendi. Kütüphanede toplam 16 hikâye var: A1 5, A2 3, B1–C2 ikişer.
Sekiz kategorinin tamamında en az bir hikâye var; her kategorinin her seviyede
dolu olduğu iddia edilmez.

| Düzey | Yeni hikâye | Dil odağı |
| --- | --- | --- |
| A1 | Pastanın Başındaki Bekçi | Günlük eylemler, yer ifadeleri, basit seçimler |
| A2 | Yanlış Bavul, Doğru Kahkaha | Perfekt, nazik rica, neden ve niyet |
| B1 | Provadaki Şemsiye | Gerekçe, amaç, öneri, olay sırası |
| B2 | Ciddiyetle Karışan Roller | Bağlam, çok anlamlılık, dolaylı anlatım |
| C1 | Sessizlik İlanının Gürültüsü | Üslup, ironi, genellemenin sınırları |
| C2 | Çaydanlığın Kesin Tanıklığı | Güvenilmez anlatıcı, örtük anlam, kanıt ayrımı |

Her hikâyede 7 sahne, sahne başına 4 Almanca/Türkçe bölüm, 4 farklı son ve
7 açıklamalı soru var. Bir okuma rotası 3 sahneyi ve o sahnelere ait 3 soruyu
kapsar. Bütün sonları görmek için farklı seçimlerle tekrar okunabilir.
Toplam ek içerik: 42 sahne, 168 iki dilli bölüm, 24 son, 42 soru ve 5 sözlük maddesi.

## Kayıt ve ödül uyumluluğu

Yeni kimlikler `story-comedy-` önekiyle ayrı tutulur. Önceki 10 hikâyenin
kimlikleri, sahneleri, soru cevapları ve ses dosyaları değiştirilmedi. Eski
günlük hikâye atamaları korunur; yeni güne ait seçimler genişleyen katalogdan
yapılabilir. Yeni SQL veya ortam değişkeni gerekmez; canlı DB'ye işlem yapılmaz.

Mevcut hikâye kayıt/ödül motoru kullanılır: ilk bitirmeye 20 XP, yeni bir sona
10 bahçe parası ve başarılı hikâye testine bir defalık lavanta tohumu.
Aynı son veya test tekrar ödüllendirilmez. Bu kurallar değiştirilmedi.
Günlük bölümünün XP ödülü hâlâ ayrı olarak kapalıdır.

## Ses ve içerik doğrulaması

215 MP3 dosyası, yaklaşık 16,34 MiB. 42 tam sahne 18 dakika 10 saniye sürer;
satır kayıtları aynı metnin ayrı yeniden dinleme dosyalarıdır. Tarayıcıdaki
Almanca sistem sesine ihtiyaç duyulmaz. Sesler tek yapay anlatıcıdır; doğal
çok kişili oyuncu kaydı oldukları iddia edilmez. Lisans bilgileri
`public/audio/stories-comedy/README.md` içindedir.

`node --test src/lib/stories/stories.test.ts` bütün grafikleri/dalları, soruların
ziyaret edilen sahnelere ait olmasını, yenileme devamını, başarısız testi,
tekrarlanan ödülü, eski atamaları, sözlük kaydını, mevcut hesap snapshot
uyumluluğunu ve tüm eski/yeni ses dosyalarını kontrol eder. MP3 testleri dosya
ve metin hash'lerini, tüm MPEG çerçevelerini, mono biçimi ve süreleri doğrular.

İçerikler CEFR hedeflerine göre yazıldı; bağımsız bir Almanca öğretmeninin son
editoryal incelemesi henüz yapılmadı. Bu hikâyeleri bitirmek resmî seviye belgesi
veya yeterlik kazanıldığı anlamına gelmez.

## Bu geliştirmedeki test sonuçları

- Genel paket: 296/296 test başarılı; hikâye paketi: 21/21 başarılı.
- Tam lint kontrolü, TypeScript kontrolü ve `npm run build -- --webpack` üretim derlemesi başarılı (334 sayfa). Windows ortamındaki önceki Turbopack alt süreç sorunu nedeniyle doğrulama webpack ile yapıldı; proje build komutu değiştirilmedi.
- 215 yeni ses HTTP 200 ve doğru audio MIME ile erişilebilir. Altı yeni hikâye rotası HTTP 200; altı başlangıç MP3 dosyasında byte-range HTTP 206 doğrulandı.
- Ayrı 3001 misafir test ortamında A2 hikâyesinin sesini sonuna kadar oynatma, iki seçimle sona ulaşma, Koffer kelimesini kaydetme, üç soruda %100 başarı ve yenileme sonrası sonucun korunması gerçek tarayıcıdan doğrulandı.
- A2 ve uzun C2 metninde 390×844 görünümde yatay taşma yok. C2 Türkçe çeviri açma ve hazır MP3 oynatma kontrol edildi.
- Canlı Supabase hesabına, ana 3000 tarayıcı verisine, Gemini/Lumi kurulumuna veya veritabanı migration’larına yazılmadı. İkinci fiziksel telefonla canlı hesap testi ve bağımsız öğretmen incelemesi ayrıca gerekir.

Son UI kontrolünde kütüphanedeki eski sabit “6 özgün macera” metni bulundu ve gerçek `stories.length` değerine bağlandı. Kayıt açıklaması mevcut hesap/cihaz durum göstergesine yönlendirildi. Önceki 10 hikâyenin iki içerik dosyası ve iki ses manifesti başlangıç SHA-256 değerleriyle birebir karşılaştırıldı; değişmedikleri doğrulandı. C2 başlangıç sesi de gerçek tarayıcıda sonuna kadar hatasız oynadı.
