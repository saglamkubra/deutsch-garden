# Dinleme ve hikâye genişletmesi — ilk parti

Bu belge ilk partinin tarihsel raporudur. Sonraki dinleme genişletmesiyle 65 hazır
ders ve her seviyede dokuz dolu kategori oluştu; güncel rapor LISTENING-COMPLETE.md.

Bu parti ders haritasını yeniden oluşturmaz; mevcut 60 ünite, 692 kelime/ifade,
eski dinlemeler, hikâyeler ve kullanıcı kayıtları korunur.

## Hazır içerik

| Düzey | Yeni sesli dinleme | Yeni dallanan hikâye |
| --- | --- | --- |
| A2 | Hafta sonu planları | Önceki iki hikâye korunur |
| B1 | İş yerinde konuşmalar | Bir Mektubun İzinde |
| B2 | Röportajlar | İki Yolun Arasında |
| C1 | Akademik tartışmalar | Şehrin Hafızası |
| C2 | İnce ayrımlı tartışmalar | Satır Arasındaki Sesler |

Her dinleme: 10 iki dilli transkript parçası, gerçek ses dosyası,
8 açıklamalı anlama/dil sorusu. Beş ders toplam 40 yeni soru içerir.
Dinleme süreleri yaklaşık 49, 58, 62, 73 ve 70 saniyedir.
Normal hızdaki toplam süre yaklaşık 5 dakika 12 saniye; oynatıcı daha yavaş
dinlemeyi, transkript üzerinden tekrar etmeyi ve Türkçe çeviriyi destekler.

Her yeni hikâye: 7 sahne, sahne başına 4 iki dilli anlatım parçası,
2 gerçek karar aşaması, 4 farklı son ve izlenen yola ait 3 açıklamalı soru.
Toplam 28 yeni sahne sorusu vardır; bir oynayışta yalnızca ziyaret edilen üçü sorulur.
Tam sahne ve tek satır sesleri ile dört yeni açıklamalı sözlük maddesi bulunur.
Bütün yeni sahnelerin dalları dahil anlatım süresi yaklaşık 13 dakika 18 saniyedir;
bu rakam tek bir hikâye yolculuğunun süresi değildir.

Toplam katalog artık 15 hazır dinleme ve 10 hazır hikâye içerir.
**Diğer 25 dinleme konusu hâlâ plandır; sesli ders olarak gösterilmez.**
Bu ilk parti bütün dinleme müfredatının tamamlandığı anlamına gelmez.
Düzeyler yazar hedefidir; dışarıdan CEFR sertifikasyonu veya insan editör
onayı alınmış değildir. Özellikle ileri düzey dil, çeviri ve yapay ses vurgusu
bir Almanca öğretmeni tarafından ayrıca gözden geçirilmelidir.

## Dosyalar ve üretim

- Kaynak: `scripts/media-extension.mjs`.
- Ek içerik: `src/data/listening/extra-episodes.json`,
  `src/data/stories/extra-stories.json`, `extra-glossary.json`.
- Ses üretimi: `scripts/generate-media-extension.py`.
- Sesler: `public/audio/extensions/` (149 WAV dosyası, yaklaşık 79 MiB;
  tam sahne ve tek satır dosyaları ayrı olduğu için içerik kısmen tekrarlanır).
- Süre, PCM cümle aralıkları ve SHA-256: iki modülün `extra-audio.json` dosyaları.
- Ses/model lisans atıfları: `public/audio/extensions/README.md`.

Piper mevcut yerel önbellekten çalıştırıldı. Gemini isteği, yeni paket,
ortam değişkeni veya ücretli servis gerekmedi. Ses üretim motoru ve model
tarayıcıya gönderilmez; WAV dosyaları ilgili ders açıldığında yüklenir.
Telefon tarayıcıları ses için internet bağlantısı gerektirir; bu partiye
tam çevrimdışı ses kütüphanesi eklenmedi.

## Kayıt ve uyumluluk

Eski dinleme sorularının üretimi ve eski ses manifestleri değiştirilmedi.
Önceden planlanan beş dinleme kimliği, aynı konu için hazır içeriğe dönüştürüldü.
Diğer planlar hazır içerikten ayrı tutulur.

Dinleme doğrulayıcısındaki sabit beş soru sınırı, ilgili dersin gerçek soru
sayısıyla değiştirildi. Eski beş soruluk kayıtlar ve yeni sekiz soruluk kayıtlar
aynı sürümde geçerlidir. Mevcut A2 sözlük kelimeleri artık dinleme bölümünden
kaydedilip geri yüklenebilir. Eski kayıtları sıfırlayan bir geçiş yapılmadı.

Bugün için önceden kaydedilmiş boş günlük öneriler de değiştirilmez:
kullanıcı yeni içeriği kütüphaneden seçebilir; sonraki gün yeni öneri atanır.
Hikâye arayüzü bu durumu açıklar. Hikâye sözlüğü yeni seslerle birleştirilir;
özgün sözlük kayıtları korunur.

İlerleme mevcut hesap/depolama/eşitleme katmanından geçer. Yeni SQL migration,
üretim veritabanına müdahale veya yeni ödül sistemi yoktur. Dinleme bitirme
şartları gerçek dinleme kapsamı + en az %80 test başarısı olarak korunur.
Sekiz soruda altı doğru (%75) yetmez, yedi doğru yeterlidir. Eski ödül kimlikleri
ve tekrar ödül önleme kuralları kullanılır.

## Kontroller

- Tüm dalların erişilebilirliği, döngü ve aynı hedefe sahte seçim kontrolü.
- Tüm eski/yeni seslerin PCM içeriği, süre, SHA-256 ve cümle sınırları.
- A2–C2 testlerinde her cevapta kayıt/geri yükleme, başarısız deneme ve yeniden deneme.
- Ses dinlenmeden tamamlanma verilmemesi, tekrar tamamlamada çift ödül verilmemesi.
- Yeni sözlük maddeleri ve hikâye yollarının kalıcılığı, eski günlük önerilerin korunması.
- Tam test paketi, lint, TypeScript ve üretim derlemesi.

Sonuç: 250 test geçti. Son içerikle ilgili 33 dinleme/hikâye testi ayrıca
yeniden geçti. Lint uyarısız, TypeScript ve üretim derlemesi başarılı.
Paket kontrolünde özel dosya ve tarayıcıya sızmış mevcut sır sayısı sıfır.
25 ana rota ve 9 yeni içerik rotası HTTP 200; beş yeni ses için HTTP Range
yanıtı ve WAV başlığı doğrulandı.

Tarayıcıda C2 dinleme ve C1 hikâye sesi gerçekten oynatıldı; C1 hikâyesinde
bir dal bitirilip üç soru doğru yanıtlandı. Yenilemede hikâye sonucu ve C2
test cevabı korundu. 390×844 telefon görünümünde bu iki sayfada yatay taşma
görülmedi. Bunlar masaüstü tarayıcıda mobil boyut testleridir; fiziksel iPhone
ve Android cihazlarında test yapılmış sayılmaz.

## Önizleme

`npm run dev` ile mevcut sunucuyu aç; Dinleme Kulübü veya Hikâye Dünyam’da
istediğin düzeyi seç. Örnek yollar:

- `/dinleme-kulubu/listen-c2-plan-1`
- `/hikayeler/story-c1-stadt`

Bu çalışma yayınlama yapmaz; canlı Supabase hesabında yeni içerikle uçtan uca
eşitleme ayrıca doğrulanmalıdır. Önceki bulut eşitleme testleri sahte kullanıcılar
ve yerel veritabanıyla çalıştırılır; özel gerçek kullanıcı verileri test için kullanılmaz.
