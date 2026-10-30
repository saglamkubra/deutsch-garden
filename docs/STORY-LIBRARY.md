# A1–C2: her seviyede 10 hikâye

30 Ekim 2026. Önceki 22 hikâye aynen korunarak 38 hikâye eklendi. A1, A2,
B1, B2, C1 ve C2'nin her birinde **10**, toplam **60 hikâye** bulunur. Her
seviyede sekiz kategorinin tamamından içerik vardır: günlük hayat, arkadaşlık,
gizem, fantastik maceralar, seyahat, okul ve iş, Almanya'da yaşam, komedi.

## İçerik ve kullanım

Yeni her hikâye 7 sahne, sahne başına 4 Almanca/Türkçe metin bölümü ve iki
aşamalı seçimle ulaşılan 4 farklı son içerir. Ek kapsam: 266 sahne, 1.064 iki
dilli bölüm, 152 son, 266 açıklamalı soru ve 256 bağlama bağlı sözlük girdisi.
Bütün katalog 420 sahne ve 1.596 iki dilli bölüm içerir.

`/hikayeler` sayfasında düzeyi ve kategoriyi seç. Her yolun sonunda yalnızca
ziyaret edilen üç sahneye ilişkin sorular sorulur. Metindeki vurgulu kelimeye
dokunarak artikel, anlam ve örneği açabilir, mevcut kelime koleksiyonuna
kaydedebilirsin. Çekimli biçimler tam sözcük olarak eşleşir; farklı bağlamdaki
aynı sözcük, başka bir hikâyenin anlamıyla rastgele değiştirilmez.

Sorular, açıklamalar, sahne başlıkları ve diğer arayüz metinleri Türkçedir.
Almanca başlık, öykü metni ve seçimler öğretim içeriğidir. CEFR etiketleri hedef
düzeydir; resmî yeterlik değerlendirmesi veya bağımsız öğretmen onayı değildir.

## Sesler ve kaynak

Yeni manifestte 1.586 ses başvurusu, tekrar kullanılanlar birleştirildiğinde
1.543 benzersiz MP3 vardır; yaklaşık 134,1 MiB. Tam sahne, tek paragraf ve
kelime sesleri hazırdır. Ortak telaffuz dizini 1.360 genel ifadeyi kapsar.
Dinleme için Gemini isteği, ücretli ses API'si veya cihazda Almanca ses gerekmez.

Sesler yerelde Piper/Thorsten ve LAME ile üretildi; insan seslendirmesi veya
stüdyo kaydı olarak sunulmaz. Araçlar ve ses modeli tarayıcıya gönderilmez.
Kaynak/lisans notları: `public/audio/stories-library/README.md`.

33 hikâye için Gemini taslaklarından yararlanıldı; beş hikâye ayrıca yerelde
yazıldı. Tamamen yeniden yazılan sahneler ve Türkçe sorular dâhil düzenlemeler
vardır. Toplam 46 sınırlandırılmış üretim denemesi yapıldı; başarısız/kesilmiş
yanıtlar da bu sayıya dahildir. Kullanım `reports/story-library-generation.json`
içinde raporlanır. Çalışan uygulama bu dosyalar için yeniden içerik üretmez.
Kaynaklar özgün eğitim içeriğidir; özel günlükler, Lumi geçmişi ve doğum günü
mektupları içerik üretimine gönderilmedi. Bağımsız Almanca/Türkçe editör
incelemesi ve her kaydın insan tarafından dinlenmesi yapılmış sayılmaz.

## Saklama ve korunan veriler

Eski dört hikâye kataloğu ve eski sesler değiştirilmedi. Yeni kimlikler
`story-library-` önekiyle eklenir. Mevcut hikâye durumu, favoriler, etkin okuma,
dondurulmuş günlük atamalar, Supabase snapshot eşitlemesi ve XP/bahçe ödül
işlemleri kullanılır. Yeniden okumak aynı ilk tamamlama/başarılı test ödülünü
yeniden oluşturmaz. Yeni para birimi, veritabanı tablosu veya SQL geçişi yoktur.

## Dosyalar ve kontroller

- `src/data/stories/library-plans.json`: 38 sabit kimlikli içerik planı.
- `library-stories.json`, `library-glossary.json`, `library-audio.json`: yayımlanan içerik.
- `scripts/generate-story-library.ts`: yalnızca açık eğitim planlarını kullanan,
  sınırlı Gemini taslak aracı; normal derlemede veya kullanıcı isteğinde çalışmaz.
- `scripts/review-story-library.mjs` ve `write-library-*.mjs`: yerel taslaklar
  üzerinde yeniden uygulanabilir içerik düzenlemeleri ve ek yazım.
- `scripts/generate-library-audio.py`: yerel model hazırlanmışken devam
  edebilen ses üretimi; mevcut ses dosyalarını üzerine yazmaz.
- `src/lib/stories/library.test.ts`: seviyeler/kategoriler, 152 yolun
  kaydetme/geri yüklemesi, doğru/yanlış testler, ödül tekrarları, günlük atama,
  kelime eşleşmesi ve tüm yeni seslerin metin/hash/MP3 süre denetimi.
- `reports/audio-audit.json`: bütün genel seslerin tam çözümleme, sessizlik,
  kesilme ve seviye taraması; sayısal test insan dinlemesinin yerine geçmez.

Yerel önizleme: `npm run dev`, ardından `/hikayeler`. Canlı sürümün güncellenmesi
için GitHub'a gönderme ve Render dağıtımının tamamlanması ayrıca gerekir.

### Bu değişiklik için doğrulanan sonuçlar

- Tam test kümesi: **334/334**; yeni kitaplık testleri: **6/6**.
- Lint ve `tsc --noEmit`: hata yok.
- `npm run build -- --webpack`: başarılı, **378 statik sayfa**.
- Üretim standalone paketinde 60 hikâye rotası ve sayfalardaki 31 JavaScript
  paketi HTTP 200; bilinmeyen hikâye 404.
  Altı seviyenin örnek MP3'lerinde HTTP 206 ve doğru byte-range/mime yanıtı.
  Yeniden kontrol: `node scripts/qa-story-library.ts http://127.0.0.1:3103`.
- Bütün genel seslerde **3.559 dosya** tam çözümlendi; hata **0**, sayısal uyarı
  **0**. Yeni manifestin bütün 1.586 başvurusunda metin/hash/süre eşleşmesi geçti.
- Üretim paket denetimi: özel dosya **0**, tarayıcıya sızan mevcut sır **0**.
- Bu kapsamda canlı veritabanı değiştirilmedi, Render dağıtımı başlatılmadı.
  Yeni hikâyelerin gerçek telefondaki görsel/dokunmatik kabulü ayrıca yapılmalı.
