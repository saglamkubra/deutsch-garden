# Dinleme Kulübü — tüm seviyelerde dokuz dolu kategori

Mevcut 15 ders korunarak 50 özgün ders eklendi. 25 taslak ders aynı kimliklerle
hazır içeriğe dönüştü; seviye-kategori boşlukları için 25 ders daha eklendi.
Toplam **65 hazır dinleme, 690 soru, yaklaşık 60 dakika 58 saniye ses** bulunur.
Dinleme kitaplığında taslak kalmadı. Bu tüm dil öğreniminin tamamlandığı iddiası değildir.

| Düzey | Hazır ders | Dolu kategori |
| --- | ---: | ---: |
| A1 | 13 | 9/9 |
| A2 | 11 | 9/9 |
| B1 | 10 | 9/9 |
| B2 | 11 | 9/9 |
| C1 | 11 | 9/9 |
| C2 | 9 | 9/9 |

Kategoriler: Günlük Konuşmalar, Kısa Hikâyeler, Almanya’da Yaşam, Seyahat,
Kültür, İş ve Eğitim, Teknoloji, Gramer Dinleme, Kelime Tekrarı.
Sayaçlar seçilen düzey için hesaplanmaya devam eder; farklı seviyelerin
sayılarını birleştirerek boşluklar gizlenmedi.

## Yeni içerik

50 derste 354 iki dilli transkript bölümü ve 600 açıklamalı soru bulunur.
Bölümler birden fazla doğal cümle içerebilir. Seviye başına metin uzunluğu,
konu soyutluğu ve yapı çeşitliliği kademeli değişir. Yeni kayıtlar 34–100 saniyedir.
Her derste dört maddelik Türkçe dinleme/tekrar rehberi bulunur.

Her yeni test: dört içerik/çıkarım sorusu, dört bağlamsal biçim tamamlama,
dört kayıttaki örnek dizilişini kurma çalışmasıdır. Örneklerin yeniden kullanımı
pekiştirme içindir; 600 bağımsız bağlam veya bir CEFR sertifika sınavı değildir.
Diziliş soruları bütün doğal alternatifleri değerlendirmez.

Konular yalnız sözcük bulmayı değil kaynak, belirsizlik, zaman, koşul,
kişilerin farklı ihtiyaçları ve öneri/karar ayrımını da çalıştırır.
Haber, kurum ve araştırma örnekleri kurgusaldır; güncel haber, hukuk veya
resmî başvuru yönergesi olarak sunulmaz.

## Ses ve lisans

50 yeni ses toplam 53 dakika 40 saniye ve yaklaşık 24,6 MiB'dir.
Mevcut yerel Piper + Thorsten modeli ve LAME ile 64 kbit/s mono MP3 üretildi.
Gemini isteği, ücretli servis veya yeni çalışma zamanı bağımlılığı kullanılmadı.
Kullanıcı cihazının Almanca sesi zorunlu değildir; hazır dosya doğrudan oynar.

Bütün yeni metinler tek yapay anlatıcıyla okunur. Gerçek röportaj veya insan
seslendirmesi iddiası yoktur; rehberde bu açıkça yazılır. Bölüm aralıkları kaynak
ses parçalarının sürelerinden üretilir; sözcük düzeyinde zorlanmış hizalama değildir.
Dosya ve metin SHA-256, MP3 karelerinden gerçek süre ve örnekleme hızı ayrı
manifestte kayıtlıdır. Model/üretim araçları tarayıcıya veya Render paketine gerekmez.
Atıflar: public/audio/listening-complete/README.md.
Sesler gerektiğinde indirilir; tam çevrimdışı ses arşivi eklenmedi.

## İlerleme ve ödül

Eski içerik, transkriptler, beş/sekiz soruluk denemeler ve ses dosyaları korunur.
Yeni 12 soruluk denemeler mevcut sürümde çalışır. Dinlemenin en az yüzde 90’ı
ve testte en az yüzde 80 gerekir: 9/12 doğru yetmez, 10/12 yeterlidir.
Sona atlamak veya yalnız metni açmak dinleme tamamlaması değildir.

Mevcut ilk tamamlama ödülü 15 XP + 10 bahçe parasıdır. Her üç farklı dinlemede
mevcut lavanta tohumu makbuzu üretilir. Tekrar çözmek aynı ödülü çoğaltmaz.
Favoriler, kaldığı yer, cevaplar ve aynı gün dondurulmuş öneriler korunur.
O gün için önceden boş kaydedilmiş öneri kendiliğinden değiştirilmez; kullanıcı
kitaplıktan seçebilir, yeni gün yeni öneri alır.

Mevcut hesap anlık görüntüsü ve Supabase eşitleme katmanı kullanılır. Yeni SQL,
ortam değişkeni veya kullanıcı verisi aktarımı gerekmez. Canlı veritabanı,
Lumi, bahçe ve özel doğum günü verileri değiştirilmez.

## Dosyalar ve yeniden üretim

- scripts/listening-complete/*.mjs: seviyelere ve kategori eklerine ayrılmış özgün metinler.
- scripts/build-listening-complete.mjs: yalnız genel içerik derlemesi.
- scripts/generate-listening-complete-audio.py: yalnız yeni genel ses üretimi.
- src/data/listening/complete-episodes.json ve complete-audio.json: ayrı ek veri/manifest.
- public/audio/listening-complete/: 50 ses ve lisans notu.
- src/lib/listening/content.ts: eski ve yeni içerikleri birleştirir.
- src/lib/listening/types.ts: isteğe bağlı rehber alanı.
- src/components/listening/episode.tsx: numaralı Türkçe çalışma rehberi.
- src/lib/listening/listening.test.ts: kapsam, ses, kayıt, eşik ve ödül kontrolleri.
- README.md, docs/MEDIA-EXTENSION.md ve bu rapor: güncel kapsam.

```text
node scripts/build-listening-complete.mjs
python scripts/generate-listening-complete-audio.py
node --test src/lib/listening/listening.test.ts
npm run dev
```

Üretim komutları mevcut .cache içindeki yerel üretim araçlarını kullanır;
normal kullanımda bunlar gerekmez. Dosyalar sadece genel ders içeriğiyle çalışır.
/dinleme-kulubu sayfasında düzey ve kategori seçerek yeni içerik açılır.

## İçerik sınırı

Bağımsız öğretmen incelemesi henüz yapılmadı. Özellikle C1/C2 nüansları,
Türkçe çeviriler ve yapay ses vurguları insan tarafından ayrıca gözden geçirilmeli.
Fiziksel telefon denemesi tarayıcıdaki mobil boyut kontrolünden farklıdır.

## Son doğrulama sonuçları

- Tam test paketi: 281/281 geçti. Son dil düzeltmesinden sonra dinlemenin
  22 testi ayrıca yeniden geçti.
- Lint uyarısız, TypeScript ve güncel üretim derlemesi başarılı; 328 sayfa üretildi.
- 25 genel HTTP hedefi ve 50 yeni ders yolu HTTP 200 verdi.
  Her seviyeden yeni MP3 için HTTP Range 206 ve MP3 başlığı doğrulandı.
- 50 dosyanın kare yapısı, 64 kbit/s mono biçimi, gerçek süresi, dosya/metin
  SHA-256 ve 354 transkript bölümünün sıralı aralıkları otomatik kontrol edildi.
- Tüm seviyelerde dokuz kategoriye gerçek sesli içerik bulunduğu test edildi.
- Her yeni derste 9/12 ile başarısızlık, 10/12 ve yeterli dinlemeyle başarı,
  cevap başına kaydet/geri yükle ve ödül tekrarının engellenmesi geçti.
- Eski transkript/soru cevapları ve sesleri değişmedi. Tüm 65 dersin denemeleri,
  ilerlemesi ve tekil makbuzları mevcut hesap anlık görüntüsü kontrolünden geçti.
- Ayrı 3001 misafir ortamında yeni A1 seyahat sesi gerçekten sonuna kadar oynadı;
  yüzde 100 dinleme ve 12/12 arayüz cevabıyla tamamlanma görüldü. 15 XP
  artışı ve tamamlanma kaydı yenilemede korundu. Kelime mevcut tekrar
  listesine eklendi; yenilemeden sonra da Tekrara eklendi durumu doğrulandı.
- A1 kategori ekranında dokuz dolu sayaç ve Seyahat filtresinde yeni ders
  tarayıcıda doğrulandı. C2 kataloğu da dokuz dolu kategori gösterdi.
- 390×844 mobil boyutta tamamlanma ekranı ve yeni C2 gramer dinlemesi
  taşmadı; C2 MP3 gerçek native oynatıcıda hatasız başladı.
- Alt tamamlanma açıklamasındaki eski sabit dört doğru metni gerçek soru
  sayısından hesaplanacak şekilde düzeltildi; yeni derslerde doğru hedef 10’dur.
- Paket kontrolü: özel dosya ve tarayıcıya sızan mevcut sır sayısı sıfır.
- Gerçek Android/iPhone, canlı Supabase hesabı veya yeni Gemini isteği bu
  partide test edilmedi. Canlı veritabanı değişmedi; dağıtım yapılmadı.

Ekran kanıtları geçici test ortamına aittir; gerçek 3000 kullanıcı kaydı değiştirilmedi.
