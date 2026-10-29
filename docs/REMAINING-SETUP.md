# Son eklemeler ve kurulum — 30 Ekim 2026

Canlı veritabanına otomatik SQL uygulanmadı, Render dağıtımı yapılmadı. Mevcut Gemini modeli ve kullanıcı verileri değiştirilmedi.

## Önce SQL: bir dosya, ardından doğrulama

001–009 uygulanmış proje için ilk işlem: `supabase/migrations/202610290010_diary_practice.sql` dosyasının tamamını Supabase SQL Editor'de çalıştırın. Başarı sonucunu görmeden 011'e geçmeyin. Bu dosyalar bir defalık migration'dır; yeniden çalıştırmayın. Tablo veya kullanıcı verisi silmezler.

010: kayıtlı, kullanıcıya ait en az 20 kelime / 80 karakterlik günlükten Türkiye takvim gününde bir 15 XP makbuzu üretir. Aynı gün yeniden denemek aynı makbuzu döndürür. İlk günlük rozeti bir lale tohumu verir. Kayıt silinse de kazanılan makbuz korunur; hesap silindiğinde ilişkili kayıtlar silinir. Misafir yazıları otomatik gönderilmez ve doğrulanmış bulut ödülü kazanmaz.

Ardından isteğe bağlı `supabase/migrations/202610290011_push_reminders.sql` dosyasını çalıştırın. RLS abonelikleri kullanıcıya sınırlar; günde bir gönderim rezervasyonu yalnızca service role tarafından alınabilir. Kullanıcı son gönderim tarihini değiştiremez. Hesap başına beş cihaz sınırı vardır.

Her dosyadan sonra aşağıdaki salt okunur kontrolü çalıştırın. 010 sonrası ilk üç, 011 sonrası tüm sonuçlar true olmalıdır:

```sql
select
 to_regclass('public.diary_practice_claims') is not null as gunluk_tablo,
 to_regprocedure('public.claim_diary_practice(uuid)') is not null as gunluk_islev,
 coalesce((select relrowsecurity from pg_class where oid=to_regclass('public.diary_practice_claims')),false) as gunluk_rls,
 to_regclass('public.push_subscriptions') is not null as bildirim_tablo,
 to_regprocedure('public.claim_push_batch()') is not null as bildirim_islev,
 coalesce((select relrowsecurity from pg_class where oid=to_regclass('public.push_subscriptions')),false) as bildirim_rls;
```

## Günlük AI incelemesi

Günlük ekranında taslağı gönderme onayı ve ayrı düğme bulunur. Kendiliğinden gönderim yoktur. En fazla 800 karakter mevcut güvenli Lumi API'sine gider, mevcut Gemini kotasını kullanır. Türkçe açıklama ve Almanca düzeltmeler gösterilir; yazı otomatik değiştirilmez. Kurulu Lumi erişimi gerekir. Bu inceleme ayrıca sohbet tamamlama ödülü kazandırmaz. Hassas metni göndermemeyi tercih edebilirsiniz.

## Çevrimdışı dersler

Profilim → Çevrimdışı ders çantam veya `/cevrimdisi.html`. Önce çevrimiçiyken bir düzeyi indirin, sonra dersin örnek seslerini ayrı indirin. A1–C2 için 60 ders; açıklamalar, sorular, çözümler ve mevcut 1.419 örnek sesine bağlantılar vardır. İndirilmiş sesler çevrimdışı aralık isteklerini destekler. Özel sayfalar, günlükler ve API cevapları ortak önbelleğe alınmaz.

Bu, çevrimdışı tekrar okuyucusudur: çevrimdışı cevaplar XP veya bulut ilerlemesine yazılmaz. Tarayıcı cihaz alanını temizlerse tekrar indirmek gerekir. Bahçe, hesap ve Gemini için internet gerekir. Yeni derlemede paketler `prebuild` ile güncellenir. Fiziksel uçak modu testi henüz yapılmadı.

## Bildirimler — isteğe bağlı ek kurulum

Uygulama açıkken cihaz hatırlatıcısı ayrı çalışır. Kapalı uygulama push bildirimi için 011, HTTPS, destekleyen tarayıcı ve kullanıcı izni gerekir.

1. `npm run push:keys` çalıştırın. Anahtarlar yalnızca `.cache/push-vapid.env` dosyasına yazılır; var olan dosyanın üstüne yazılmaz. Dosyayı paylaşmayın, Git'e eklemeyin.
2. Sunucu ortamına `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY`, `WEB_PUSH_CONTACT=mailto:GERCEK_ADRESINIZ` ve en az 32 karakter rastgele `REMINDER_CRON_SECRET` girin. Privileged Supabase erişimi mevcut `SUPABASE_SERVER_SECRET_KEY` üzerinden sürer. Public VAPID anahtarı tarayıcıya verilebilir; private ve service role verilemez.
3. GitHub Actions kullanıyorsanız depo secrets alanına `DEUTSCH_GARDEN_URL` (gerçek HTTPS yayın kökü) ve aynı `REMINDER_CRON_SECRET` ekleyin. `.github/workflows/reminders.yml` Türkiye saatiyle yaklaşık 18.05'te POST gönderir. İlk testi o saat aralığında elle başlatın. Zamanlayıcı gecikebilir; 18.00–18.59 dışındaki çağrı göndermez.
4. Telefonda Profilim üzerinden push izni verin. iPhone'da önce ana ekrana eklemek gerekebilir. Gerçek cihaz bildirimi henüz doğrulanmadı; anahtar ve zamanlayıcı olmadan çalışıyor sayılmaz.

Gönderim en iyi çabadır; günlük rezervasyondan sonraki sağlayıcı hatasında aynı gün yeniden gönderilmez. Bildirimde özel içerik yoktur. Free sunucunun uyanması ve tarayıcı izinleri teslimatı etkiler.

## Yayına hazırlık

Güncel disk istemeyen yol: `docs/STATELESS-HOSTING.md`, mevcut `render.yaml`, Dockerfile. Eski diskli örnek `render-disk.yaml` bu kurulum için kullanılmaz. Render servisi henüz oluşturulmadı. Önce SQL ve test sonuçları, sonra seçtiğiniz özel Git deposu ile Docker / Free Web Service; kalıcı disk eklemeyin. `.env.local`, `.cache`, SQLite ve özel mektuplar yüklenmez.

Gerçek HTTPS adresi oluşunca mevcut origin değişkenleri ile Supabase Site URL / redirect URL'leri bu adrese uyarlanmalıdır. Telefondan hesap, bulut ilerlemesi, Lumi, satın alma, ekim, günlük hediye ve tekrar açılış birlikte doğrulanmadan teslim tamamlandı sayılmaz.

## Açık kalanlar

- Hikâye kütüphanesi 16 hikâyedir; her düzeyde sekiz kategorinin tamamını dolduran 48 hikâye seti henüz yoktur. Yeni içerik üretildiği iddia edilmez.
- Öğretmen tarafından bağımsız Almanca / çeviri / CEFR incelemesi yapılmadı.
- Canlı 010/011 kurulumu, push teslimi, Render HTTPS ve gerçek telefon kontrolleri bekliyor.
- Günlük için gerçek özel metin kullanılarak AI testi yapılmadı; otomatik test sahte sağlayıcı kullanır ve kota tüketmez.

## Bu oturumdaki doğrulama

- Tam otomatik küme: 311 test geçti. Sonraki çevrimdışı aralık isteği ve paket temizleyici eklemeleri dahil hedefli 9 test de geçti.
- Lint ve TypeScript kontrolü; webpack üretim derlemesi: geçti. Standart Turbopack Windows ortamında daha önce süreç başlatma hatası verdiğinden `npm run build -- --webpack` kullanıldı.
- Üretim HTTP denetimi: sağlık, günlük, profil, çevrimdışı okuyucu ve A1/C2 paketleri 200; yetkisiz bildirim gönderimi 401.
- Next'in Windows izleyicisi dışlama ayarına rağmen özel yerel dosya kopyalarını standalone paketine aldı. Yeni `postbuild` yalnızca üretilmiş standalone kopyalarını ve trace referanslarını çıkarır; kaynakları korur. Sentetik test bunu doğrular. Son paket denetimi: özel dosya 0, tarayıcıda mevcut sır 0. Bu kapı Docker build'de korunur.
- Bu oturumda tarayıcı kullanımı Work ayarlarında kapalı olduğundan yeni ekranların görsel/mobil kabulü yapılamadı. HTTP ve otomatik test, gerçek telefon testi yerine geçmez.

Başlıca değişiklikler: günlük `reward.tsx` / `review.tsx`, ortak XP ve gamification, Lumi özel inceleme modu, 010/011 migration'ları, push API / profil ayarları / zamanlayıcı, public çevrimdışı okuyucu ve altı paket, service worker, paket güvenlik adımı, testler ve ortam örneği. Mevcut özel kayıtlar ve Gemini modeli değiştirilmedi.
