# Deutsch Garden

Bir doğum günü hediyesi olarak hazırlanan Almanca öğrenme bahçesi. Arayüz dili Türkçe; öğretilen dil Almanca.

Hikâye Dünyam'da artık **A1–C2'nin her seviyesinde 10, toplam 60 hikâye** var. Her seviyede sekiz kategorinin tamamı dolu. Önceki 22 hikâye ve kayıtları korunarak 38 seçimli, açıklamalı sorulu ve hazır Almanca sesli hikâye eklendi. [Hikâye kitaplığı raporu](docs/STORY-LIBRARY.md).

Günlük ödülleri, onaylı Lumi yazı incelemesi, çevrimdışı dersler ve bildirimler için [son eklemeler ve kurulum](docs/REMAINING-SETUP.md). Yeni 010/011 SQL dosyaları canlı veritabanına otomatik uygulanmaz.

## Güncel ders haritası · A1–C2

60 ünitenin tamamı açıklamalı ders ve pratik içerir. Önceki beş ders korunarak 55 yeni ders eklenmiştir: yeni her derste 14 anlatım adımı, 24 açıklamalı örnek ve 80 soru vardır. Toplam 4.684 kontrollü soru ve 692 kelime/ifade kaydı bulunur. Kapsam, sınırlamalar, dosyalar ve testler: [Tam ders raporu](docs/COMPLETE-CURRICULUM.md).

İçeriği yeniden üretmek için `npm run content:build`, katalog testleri için `npm run test:curriculum` kullanılır. Aşağıdaki bölüm raporları önceki içerik partilerinin tarihçesidir.

Dinleme Kulübü artık **65 hazır ders ve 690 soru** içerir. A1–C2’nin her birinde dokuz kategorinin tamamı doludur. Eski 15 ders korunarak 50 özgün, gerçek ses dosyalı ders eklendi; 25 taslak kalıcı kimliği korundu. Toplam yaklaşık 61 dakika ses vardır. [Dinleme tamamlanma raporu](docs/LISTENING-COMPLETE.md). Önceki hikâye genişletmelerinin tarihçesi [MEDIA-EXTENSION.md](docs/MEDIA-EXTENSION.md) içindedir; güncel hikâye sayısı 60'tır.

A2 Gramer'in 12 konusu da hazır: her derste sekiz anlatım, sekiz açıklamalı örnek ve 24 soruluk test var. A1 kayıtları korunur. Ayrıntılar: [A2 Gramer raporu](docs/A2-GRAMMAR.md).

B1 Gramer'in 12 konusu da eklendi: 96 anlatım, 96 açıklamalı örnek, 288 soru ve 12 hata düzeltme pratiği. Bu partinin ayrıntıları: [B1 Gramer raporu](docs/B1-GRAMMAR.md).

B2 Gramer'in 10 konusu hazır: 80 başlıklı anlatım, 80 açıklamalı örnek, 240 test sorusu ve 10 hata düzeltme pratiği. B2 partisi tamamlandı. [B2 Gramer raporu](docs/B2-GRAMMAR.md).

C1 Gramer'in 9 konusu da hazır: 72 ayrıntılı anlatım, 72 açıklamalı örnek, 216 test sorusu ve 9 hata düzeltme pratiği. C1 partisi tamamlandı. [C1 Gramer raporu](docs/C1-GRAMMAR.md).

C2 Gramer'in son 7 konusu da hazır: 56 ayrıntılı anlatım, 56 açıklamalı örnek, 168 test sorusu ve 7 hata düzeltme pratiği. Mevcut gramer kataloğundaki **66 konunun tamamında ders var**; bu, bütün CEFR becerilerinin veya sitenin tamamlandığı anlamına gelmez. [C2 Gramer raporu](docs/C2-GRAMMAR.md).

Ders haritasındaki 1.419 örneğin tamamında artık hazır Almanca ses dosyası bulunur; cihazın Almanca sesine bağımlılık kaldırıldı. Eksik anlatım/önceki örnek nedeniyle kilitlenen onaylar, hangi adıma dönüleceğini gösterir. [Ses ve örnek onayı düzeltmesi](docs/COURSE-AUDIO-FIX.md).

## Yeni kapsamlı A2 dersi

İlk A2 ünitesi: 14 öğretim adımı, 24 açıklamalı örnek, 36 kelime, 20 yönlendirmeli ve 60 bağımsız soru. Kapsam ve önizleme: [A2 · Günlük Deneyimler](docs/A2-01.md).

Sağlık ve Randevular ile Ev ve Komşuluk da hazır: her birinde 14 anlatım, 24 örnek, 30 kelime ve 80 soru. Ayrıntılar ve patika sırası: [A2 ikinci içerik partisi](docs/A2-02-03.md). A2’nin ilk üç ünitesi hazır; kalan yedisi ve B1–C2 henüz tamamlanmadı.

## Çalıştırma

Uygulama için Node.js 24 veya üstü ve npm gerekir. Lumi’nin kalıcı kullanım sınırları Node’un dahili SQLite modülünü kullanır; ek veritabanı paketi gerekmez.

```sh
npm ci
npm run dev
```

Tarayıcıda http://127.0.0.1:3000 adresini aç.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

Üretim sunucusu için önce derleme gerekir. Geliştirme ve üretim sunucusunu aynı portta eşzamanlı çalıştırma.

## Tamamlanan 2. adım

- “Bugünkü Maceram” ana sayfası; mevcut pastel tema ve uygulama kabuğu korundu.
- SVG Lumi: mutlu, heyecanlı, düşünen, cesaret veren ve kutlayan beş ifade.
- Lumi’ye dokunarak veya klavyeyle mesaj değiştirme; 12 saniyelik hazır mesaj döngüsü.
- Otomatik mesajları durdurma; Lumi alanında fare veya klavye odağı varken döngü durur.
- Hareket azaltma tercihinde otomatik mesaj döngüsü ve CSS animasyonları kapalıdır; elle mesaj değişimi kullanılabilir.
- Dört örnek günlük görev, ilerleme çubukları, XP ödül önizlemesi ve bölüm bağlantıları.
- Günlük XP halkası, A1 seviyesi, çalışma hedefi, ders ve seri önizlemeleri.
- Resimli sihirli bahçe önizlemesi ve yedi kısayol.
- Artikeli Almanca kelime, Türkçe anlamı ve iki dilde örnek cümle.
- Tarayıcının Speech Synthesis API’siyle isteğe bağlı Almanca telaffuz; ses yüklenmesi, destek eksikliği, ses bulunamaması ve hata durumları için Türkçe açıklamalar.
- Duyarlı düzenler, odak stilleri ve dokunmaya uygun eylemler.
- Uygulama manifesti ile PWA için temel meta veriler. Çevrimdışı önbellek veya servis çalışanı eklenmedi; tam PWA kurulabilirliği henüz hedeflenmedi.

## Demo sınırı

**Ana sayfa ve üst başlıktaki profil, XP, seri, günlük görev ilerlemesi, ders ve çalışma istatistikleri örnektir.** Alıştırmalar sayfasındaki kazanılmış XP ise gerçek yerel kayıttır. Gerçek kullanıcı verisi, kalıcı kayıt veya kazanılmış ödül değildir. Görev bağlantılarına tıklamak ilerlemeyi değiştirmez.

Ana sayfadaki Lumi mesajları önceden yazılmıştır. /lumi-ai gerçek sunucu tarafı Gemini veya isteğe bağlı OpenAI kullanır; anahtar yoksa kurulum durumu gösterir. 4. adımda kelime alanı gerçek yerel günlük seçime bağlandı; her yerel gün yeni seçim hazırlanır. Telaffuz cihazda Almanca ses bulunmasına bağlıdır; bazı sesler işletim sisteminin çevrimiçi ses hizmetini kullanabilir.

Günlük, çiçek dükkânı ve günlük hediye açıklamalı taslak sayfalardır. Sohbet, alışveriş ve hediye alma işlevleri eklenmedi. A1 bahçesi yerel olarak oynanabilir. 5. adımda alıştırma motoru, 6. adımda Gramer Bahçem, 7. adımda Dinleme Kulübüm ve 8. adımda Hikâye Dünyam eklendi. **9. adıma başlanmadı.**

## Dosya yapısı

- `src/app/page.tsx`: ana sayfa bileşenlerini birleştirir.
- `src/app/adventure.css`: yalnızca 2. adım ana sayfasının stilleri ve animasyonları.
- `src/components/home/welcome.tsx`: Lumi mesajları, durdurma ve karşılama.
- `src/components/garden/lumi-mascot.tsx`: tekrar kullanılabilir, beş ifadeli SVG maskot.
- `src/components/home/missions.tsx`: günlük görev kartları.
- `src/components/home/daily-progress.tsx`: örnek günlük istatistikler.
- `src/components/home/garden-preview.tsx`: görsel bahçe önizlemesi.
- `src/components/home/quick-access.tsx`: yedi kısayol.
- `src/components/home/daily-word.tsx`: Almanca kelime ve tarayıcı seslendirmesi.
- `src/lib/home-demo.ts`: gelecekteki gerçek kullanıcı verisinden ayrı demo veriler ve yeni taslak bölümler.
- `src/app/[section]/page.tsx`: mevcut ve yeni taslak sayfaları üretir; tanımsız yollar 404 olur.
- `src/app/layout.tsx`, `globals.css`, `src/components/layout/`: 1. adımdan korunan ortak kabuk, tema ve gezinme.
- `src/components/ui/`: özelleştirilmiş shadcn/ui temelli Button ve Radix Progress.
- `src/app/manifest.ts`: PWA temel manifesti.

## Rotalar

`/`, `/bahcem`, `/derslerim`, `/kelimelerim`, `/alistirmalar`, `/gramer`, `/dinleme-kulubu`, `/lumi-ai`, `/basarilarim`, `/profilim`, `/hikayeler`, `/gunlugum`, `/cicek-dukkani`, `/gunluk-hediyem`.

## Doğrulama

Lint, TypeScript ve üretim derlemesi çalıştırıldı. Ana sayfadaki tüm dahili sayfa bağlantıları HTTP 200 döndü. Tarayıcıda beş Lumi ifadesi Enter tuşuyla döndürüldü; mesajları durdurma ve Maceraya Başla bağlantısı doğrulandı. Mobil ve tablet yerleşimleri yatay taşma olmadan incelendi. Test cihazında Almanca ses bulunmadığı için beklenen Türkçe geri bildirim doğrulandı; sesin gerçekten duyulması bu cihazda doğrulanamadı. İlk açılıştaki hareket tercihi kaynaklı hydration uyarısı useSyncExternalStore ile düzeltildi.

Manuel kontrol: Lumi’ye tıkla ve klavyeyle etkinleştir; beş ifadenin döndüğünü gör. Mesaj döngüsünü durdur. “Maceraya Başla”, görev ve yedi kısayolu aç. Mobil menüyü ve yatay taşmayı kontrol et. “Telaffuzu dinle” ile cihaz ses desteğini dene; ses çalarken durdurmayı ve sayfa değiştirince sesin durmasını kontrol et. İşletim sisteminin azaltılmış hareket tercihinde animasyonların ve otomatik mesajların durduğunu doğrula.

## Tamamlanan 3. adım

Bahçem artık 12 ekim alanlı gerçek bir mini oyun. Altı çiçek türü, dört büyüme aşaması, sınırlı sulama katkısı, beş taşınabilir süs, başlangıç çantası, ses açma/kapatma, Lumi geri bildirimi ve kilitli dünya önizlemeleri eklendi. localStorage kaydı doğrulanır ve yedeklenir; büyüme sayfa kapalıyken de zaman damgalarından hesaplanır. Ana sayfanın demo XP ve görev verileri ayrı tutulur.

Kurallar, dosyalar, yerel kaydın sınırları ve test adımları: [Bahçe belgesi](docs/GARDEN.md). Otomatik oyun mantığı ve kayıt testleri için npm test çalıştır.

## Tamamlanan 4. adım

Derslerim: altı CEFR dünyası, 60 ünite/120 ders planı, düzeyden başlama ve 10 gerçek A1 kelime patikası. Kelimelerim: 60 özgün A1 kaydı, sabit günlük seçim, 5/10/15/20 hedefi, ayrı tekrarlar, kartlar, normal/yavaş cihaz sesi ve sayfalı filtreli kütüphane. Öğrenme kaynakları mevcut bahçeye kimlikli ödül makbuzlarıyla bağlanır.

Supabase bağlı değildir; içerik ve ilerleme yereldir. A2–C2 kelime havuzları boştur. SQL migration/seed dosyaları hazırlanmıştır, veritabanına uygulanmamıştır. Kaynak izinleri, tablo listesi, raporlar, SRS kuralları ve geçiş gereksinimleri: [Öğrenme belgesi](docs/LEARNING.md).

Gün değişimini cihaz saatine dokunmadan test etmek için: npm run vocab:rotation -- 2026-10-27.

## Tamamlanan 5. adım

Sekiz etkileşimli alıştırma modu, yerel tarihe bağlı günlük test, oturum geri yükleme, hatalardan tekrar listesi ve bahçeye tekil ödül aktarımı eklendi. Teknik ayrıntılar, ödül sınırları ve doğrulama: [docs/EXERCISES.md](docs/EXERCISES.md).

## Tamamlanan 6. adım

/gramer: A1–C2 kataloğunda 66 hazır ders, 1.280 test sorusu ve 66 hata düzeltme pratiği. A1 testleri beş, A2–C2 testleri 24 soruludur. Yer imleri, devam etme, kalıcı test geçmişi ve mevcut XP/bahçe ödülleri bağlıdır. Ayrıntılar: [docs/GRAMMAR.md](docs/GRAMMAR.md).

## Tamamlanan 7. adım

/dinleme-kulubu: 65 hazır A1–C2 dinleme, dokuz kategorinin her seviyede dolu olduğu kitaplık, 690 soru ve gerçek WAV/MP3 dosyaları. Yeni derslerde Türkçe çalışma rehberi ve 12 açıklamalı soru bulunur; eski beş/sekiz soruluk kayıtlar korunur. Dinlemek için Python veya API anahtarı gerekmez. Ayrıntılar: [docs/LISTENING.md](docs/LISTENING.md).

## Tamamlanan 8. adım

/hikayeler: dört A1 ve iki A2 özgün dallanan hikâye; toplam 42 sahne, 36 dal bağlantısı, 24 son. Sesli okuyucu, cümle cümle Türkçe çeviri, günlük öneri, favoriler, sonlar albümü, yola özel testler ve kaydet/devam et akışı. 156 gerçek WAV dosyası hazırdır. Kelime kütüphanesi ve 30 açıkça yazılmış hikâye sözlüğü maddesi ayrılır; ödüller mevcut XP ve bahçe defterlerine tekil makbuzla aktarılır. B1–C2 plan aşamasındadır. Ayrıntılar ve elle deneme: [docs/STORIES.md](docs/STORIES.md). İçerik raporu: `node scripts/report-stories.ts`.

## Öğrenme yolu ders zenginleştirme · İlk parti

Harita ve kart tasarımı korunarak `a1-01-words` (Selamlaşma ve Tanışma) ve `a1-02-words` (Aile ve Arkadaşlar) derslerinin içi altı bölümlü mini-kursa dönüştürüldü. Toplam 27 açıklamalı/sesli örnek, 12 yönlendirmeli ve 32 bağımsız soru; özet, kalıcı hata tekrarı, SRS bağlantısı ve tekil tamamlama ödülü var. Diğer sekiz A1 kelime patikası ve A2–C2 bu partide zenginleştirilmedi. Detaylar: [docs/COURSE-ENRICHMENT.md](docs/COURSE-ENRICHMENT.md); sayım: `reports/course-enrichment-counts.json`. Bu çalışma 9. adımı başlatmaz.

## Lumi AI kurulumu

Gemini modeli: `gemini-3.5-flash-lite`. Sunucuda `GEMINI_API_KEY` ayarlayın; `npm run lumi:verify` ile hesabın model erişimini doğrulayın. Gemini için OpenAI anahtarı gerekmez. Yerel kullanım ve kalıcı diskli bulut dağıtımı: [Lumi kurulum rehberi](docs/LUMI.md).

## 11. adım — Çiçek Dükkânım

`/cicek-dukkani` sayfasında yedi kategorili 16 ürünlük vitrin, mevcut bahçe parasıyla alışveriş, envanter teslimi, CEFR kilitleri ve satın alma geçmişi çalışır. Kalıcı süsler bahçede yerleştirilir/taşınır; tohumlar gerçekten yetişir. Kayıt ve sınırlar: [Çiçek Dükkânı rehberi](docs/FLOWER-SHOP.md).

## 12. adım — Günlük sürpriz, hasat ve çiçek koleksiyonu

`/gunluk-hediyem` günlük ücretsiz kutuyu, `/bahcem` beş büyüme aşamasını, hasadı, kalıcı albümü ve çiçek sergilemeyi içerir. Öğrenme etkinlikleri sınırlı büyüme katkısı ve özel tohumlar kazandırır. Kullanım, kayıt geçişi, XP teslimi ve yerel kayıt sınırları: [12. adım rehberi](docs/STAGE-12.md).

## 13. adım — Doğum günü sürprizi ve Hatıra Bahçem

`/hediye-atolyesi` ayrı kurucu parolasıyla tarih, adlar ve çok paragraflı mektup düzenlemeyi; gerçek kayıtları değiştirmeyen önizlemeyi sunar. `/hatira-bahcem` kişisel mektubu, buketi, anı kartını, ilk açılışı ve özel bahçe hediyelerini saklar. Tarihten önce kişisel içerik sunucu tarafından gizlenir. Kurulum, bulut diski ve kayıt sınırları: [13. adım rehberi](docs/STAGE-13.md). 14. adıma başlanmadı.


## Hesaplar ve bulut ilerlemesi (13. adım)

Supabase Auth, hesap başına cihaz önbelleği, onaylı misafir aktarımı, sürümlü bulut eşitlemesi ve gizlilik işlemleri eklendi. Kurulum: [Hesaplar ve bulut rehberi](docs/ACCOUNTS-CLOUD.md). Mevcut doğum günü özelliği ve kayıtları korunur. `SUPABASE_URL` ve `SUPABASE_PUBLISHABLE_KEY` yoksa uygulama dürüstçe yerel kullanım/kurulum gerekli durumunda çalışır. SQL geçişlerini uygulamadan bulut eşitlemesi hazır sayılmaz.

Önizleme: `npm run dev`, ardından http://127.0.0.1:3000/profilim. Hesap testleri: `npm run test:accounts`.


## 14. adım — Başarılar, XP ve öğrenme serisi

`/basarilarim` mevcut XP işlem listesini kullanır; ana sayfa görevleri ve üst başlık gerçek kayıtlara bağlandı. Kurallar, rozet ödülleri, testler ve gerekli yeni Supabase geçişi: [14. adım rehberi](docs/STAGE-14.md). Hesaplı başarı ödülleri için `202610280007_gamification.sql` bir kez uygulanmalıdır. Önceki SQL dosyalarını yeniden çalıştırmayın. `npm run test:gamification` ile kontrolleri çalıştırabilirsiniz.


## 15. adım — Kişisel doğum günü karşılaması

İsteğe bağlı karşılama ayarı: `src/config/birthday-welcome.ts`. Varsayılan olarak kapalı, alıcı adı ve imza boştur. Önizleme: http://127.0.0.1:3000/dogum-gunu?onizleme=1. Profil üzerinden tekrar izlenebilir; mevcut Dilek Çelengi tek kopya olarak korunur. Yeni SQL veya API anahtarı gerekmez. Ayrıntılar: [15. adım rehberi](docs/STAGE-15.md).


## 16. adım: kalite, PWA ve yayın
Yayın sırası, ortam değişkenleri, veritabanı kontrolü ve gerçek cihaz kabul listesi: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Güncel kapsam ve doğrulama sınırları: [docs/FINAL-QA.md](docs/FINAL-QA.md). PWA tam çevrimdışı öğrenme sunmaz. Canlı dağıtım ayrıca yetkilendirilmiş barındırma projesi gerektirir.


## Render Free için durumsuz sunucu hazırlığı
Güncel ücretsiz barındırma planı: [docs/STATELESS-HOSTING.md](docs/STATELESS-HOSTING.md). Tam depolama envanteri: [docs/STORAGE-AUDIT.md](docs/STORAGE-AUDIT.md). Yeni 008/009 SQL dosyaları manuel onayla uygulanır; özel veriler kendiliğinden yüklenmez. render.yaml Free/disksiz, eski diskli örnek render-disk.yaml. Canlı geçiş ve dağıtım henüz yapılmadı.

### Almanca Günlüğüm

`/gunlugum`: özel günlük yazma, düzenleme, arama, ay filtresi, JSON yedeği ve onaylı misafir aktarımı. Mevcut `diary_entries` tablosunu kullanır; yeni SQL gerekmez. Taslak cihazda, açıkça kaydedilen hesap yazısı Supabase’dedir. Otomatik AI düzeltmesi ve günlük XP ödülü etkin değildir. Ayrıntılar: [docs/DIARY.md](docs/DIARY.md).

### Hikâye Dünyası · Komik Hikâyeler

A1–C2 için altı özgün seçimli hikâye eklendi. Toplam kütüphane 16 hikâye; sekiz kategorinin tamamında içerik var. Yeni hikâyelerde 42 iki dilli sahne, 24 son, 42 açıklamalı soru ve 215 hazır MP3 kaydı bulunur. Eski hikâye ilerlemesi ve mevcut ödül sistemi korunur. Ayrıntılar: [docs/STORY-COMEDY.md](docs/STORY-COMEDY.md).

### Altı oynanabilir bahçe dünyası

`/bahcem`: A1–C2 temalı altı dünya artık ekim, sulama, toplama ve süsleme için kullanılabilir. Dünyaların alanları ayrı; envanter, para, koleksiyon ve ödüller ortaktır. A1 verileri yerinde korunur. Yeni SQL gerekmez. Kurallar ve kayıt ayrıntıları: [docs/GARDEN-WORLDS.md](docs/GARDEN-WORLDS.md).
