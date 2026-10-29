> Güncel ek: İlk kapsamlı A2 ünitesi ayrıca hazırlandı. Ayrıntılar: [A2-01.md](A2-01.md). Aşağıdaki rapor önceki A1 partisinin kapsamını anlatır.

# Öğrenme yolu · İçerik zenginleştirme, ilk parti

Haritanın dünyaları, düğümleri, kartları, mevcut ders kimlikleri ve gezinme tasarımı korundu. Bu parti **yalnızca iki mevcut A1 Kelime Patikası dersinin içini** mini-kursa dönüştürür. Tüm derslerin zenginleştirildiği iddia edilmez.

| Mevcut ders ID | Konu | Öğretim adımı | Açıklamalı/sesli örnek | Yönlendirmeli | Bağımsız |
| --- | --- | ---: | ---: | ---: | ---: |
| a1-01-words | Selamlaşma ve Tanışma | 4 | 14 | 6 | 16 |
| a1-02-words | Aile ve Arkadaşlar | 5 | 13 | 6 | 16 |
| Toplam | 2 A1 mini-kurs | 9 | 27 | 12 | 32 |

A1'in diğer sekiz kelime patikası önceki kart etkinlikleriyle çalışır. İletişim atölyeleri ve A2–C2 ders planları bu partide zenginleştirilmedi. Gramer, dinleme, hikâyeler ve diğer mevcut özellikler korunur.

## Öğretim içeriği

Selamlaşma dersinde saat/duruma göre hitap, heißen çekimi, du/Sie ayrımı, soru dizilişi, wohnen + in, kommen + aus, hâl hatır sorma, teşekkür ve veda öğretilir. Name ve freundlich dahil mevcut altı temel kelime örneklerle bağlama yerleştirilir.

Aile dersinde isim/artikel/büyük harf, Das ist… tanıtma kalıbı, er/sie, sein, yalın hâlde mein/meine/dein/deine, Eltern çoğulu, haben ve einen Bruder ile sınırlı Akkusativ girişi, helfen → hilft mir kalıbı öğretilir. Yalın hâl ve nesne hâli kapsamları açıkça ayrılır. Freund/Freundin'in bağlama göre arkadaş/sevgili anlamı olabileceği belirtilir; gramatik cinsiyetin doğal cinsiyetle her zaman aynı olmadığı açıklanır.

Her öğretim adımı giriş, kural, kullanım durumu, cümle yapısı, sık yapılan hata ve hatırlama ipucu içerir. Sekiz etkileşimli tablo, tıklanabilir satırlarla doğru biçim ve anlamı açar. Kurallar sırayla çalışılır; önceki adımlar tekrar açılabilir.

27 örneğin her birinde Almanca cümle, açılır Türkçe çeviri, cümlenin neden doğru olduğuna dair açıklama, tam sözcük sınırlarına uyan vurgu ve gerçek WAV kaydı vardır. Önce Almancayı anlamayı denemek teşvik edilir. Sesler mevcut Piper/Thorsten altyapısıyla çevrimdışı üretildi; cihazda Almanca ses veya API anahtarı gerektirmez. Kaynak/lisans bilgisi `public/audio/courses/README.md` içinde. Uydurma süre veya senkron vurgu kullanılmaz.

## Pratik ve hata tekrarı

Her derste altı yönlendirmeli soru var. Yanlıştan sonra açıklama, kural, uygun sorularda seçeneğe özel hata nedeni gösterilir. İpucu açılır ve aynı soru doğru anlaşılana kadar yeniden denenebilir; tüm denemeler korunur.

16 bağımsız soru; çoktan seçmeli, boşluk doldurma, Almancaya çeviri, sözcüklerle cümle kurma, hata düzeltme, kısa metni anlama ve bir gerçek sesli anlama etkinliğini kapsar. İlk yanıt değiştirilemez. Sözcük sıralamada başlangıç sözcüğü belirtilir; beklenen yapı belirsiz bırakılmaz. Mevcut `Question`, `AnswerInput`, `normalize` ve `isCorrect` yeniden kullanılır.

Yanlış bağımsız yanıtlar ayrı tekrar bölümünde saklanır. Kural tekrar açıklanır; düzeltilen yanıt ilk hatayı silmez. Yönlendirmeli çalışmadaki hatalar da geçmişte görünür. İlgili **gerçek kelime kaydı** bulunan hatalar mevcut `queueWordReview` SRS listesine eklenir. Bir sözcükle doğrudan ilişkili olmayan dilbilgisi hatası için sahte veritabanı eşleşmesi yapılmaz; ders içinde tekrar edilir. Aynı ders/kelime için aktarım makbuzu benzersizdir.

## Tamamlanma ve eski ilerleme

Yeni mini-kurs ancak şunların tümü tamamlanınca biter:

1. Bütün öğretim adımlarını çalışıp işaretleme.
2. Bütün açıklamalı örnekleri çalışıp işaretleme.
3. Altı yönlendirmeli soruyu doğru yanıtlayarak ilerleme.
4. 16 bağımsız soruyu yanıtlama ve yanlışların tümünü tekrar bölümünde düzeltme.
5. Ders özetini okuyup tamamlamayı onaylama.

Özet 7 ana çıkarım, temel kelime/yapılar, sık hatalar ve üç örnek cümle içerir; sonradan tekrar için açılabilir. İlk bağımsız çalışma doğruluk sayısı, sonraki düzeltmelerden ayrı tutulur. Tamamlanan ders yeniden açılır; ödül tekrarlanmaz.

Eski kelime turu kilometre taşları, SRS yanıtları, günlük seçimler ve bahçe kaynakları silinmez veya yeniden yorumlanmaz. Haritanın eski “Kelime turu çalışıldı” işaretleri aynen korunur; bunlar yeni mini-kurs tamamlanma kaydıyla aynı şey değildir. Yeni mini-kursun durumu içindeki gerçek etkinlik göstergesinden okunur. Mini-kurs ilk kez tamamlanırsa **aynı mevcut ders ID'si** öğrenme kilometre taşlarına da eklenir; sonraki patika mevcut kuralla açılır. Kelimeleri sahte “biliniyor” yanıtlarıyla doldurmaz.

İlk mini-kurs tamamlanması merkezi `REWARDS.courses` üzerinden **20 XP + 10 bahçe parası** verir. XP mevcut ortak deftere, para mevcut bahçe ödül bağdaştırıcısına aktarılır. `course:lesson:{lessonId}` makbuzu önce kayıt edilir, teslim sonra onaylanır. Yenileme, tekrar açma veya aktarım hatası aynı ödülü çoğaltmaz. Her yanıt için ek XP veya ayrı para birimi eklenmedi.

## Mimari ve kayıt

- `src/data/courses/mini-courses.json`: konuya özgü tüm açıklamalar, örnekler, sorular, gerekçeler ve özetler.
- `src/data/courses/audio.json`, `public/audio/courses/`: 27 gerçek ses dosyası, süre/hash bilgileri.
- `src/lib/courses/`: türler, içerik çözümleme, saf ilerleme motoru, kayıt doğrulama, store ve ders URL durumu.
- `src/components/courses/mini-course.tsx`: yeniden kullanılabilir öğretim, tablo, örnek, pratik, özet ve hata bileşenleri.
- `src/app/mini-courses.css`: yalnızca ders içi zenginleştirme stilleri.
- `src/components/learning/level-map.tsx`: mevcut açma düğmesi, ilk iki dersin içinde mini-kursu gösterir; diğer sekiz A1 patikasında eski Flashcards sürer.
- `scripts/create-course-content.py`, `scripts/generate-course-audio.py`: özgün içerik kaynağı ve mevcut Piper önbelleğini kullanan üretim araçları; uygulama çalışma zamanı bağımlılığı değildir.

`deutsch-garden:mini-courses:v1` diğer mevcut kayıtları değiştirmeyen sürümlü bir uzantıdır. Okunan adımlar/örnekler, soru konumu, ilk yanıtlar, yeniden denemeler, tamamlanma, SRS ve ödül makbuzları saklanır. Kayıtlar her değişiklikte doğrulanır, yedeklenir; bozuk ham kayıt ayrı korunur. İleri sürümler ve kullanılamayan depolama salt okunur olur. Web Locks, her işlemde en güncel kaydı okuma ve `storage` olayı mevcut yerel mimariyle uyumludur.

`/derslerim#ders-a1-01-words` ve `/derslerim#ders-a1-02-words` aynı harita içinde dersi geri açar. Yenilemeden sonra dersin etkinlik ilerlemesi ve soru konumu korunur; bölüm sekmesi yeniden seçilebilir. CEFR başlangıç seviyesi bu bağlantılarla değiştirilmez. Sunucu veya Supabase değişikliği yapılmadı; mevcut hazırlanmış 20 XP şeması yeterlidir. İlerleme cihazlar arasında eşitlenmez.

## Elle kontrol

`npm run dev` ardından Derslerim → A1 → Selamlaşma ve Tanışma → Kelime patikasını aç.

Bir öğretim tablosu satırını aç, sık hatayı göster, açıklamaları sırayla işaretle. Örnek çevirisini aç ve sesi dinle. Yönlendirmeli soruda bilerek yanlış yanıtla; kuralı okuyup düzelt. Bağımsız soruda yanlış yapıp yenile: ders ve soru konumu korunur. Hatalarımı Tekrar Et bölümünde düzeltmeden özeti onaylamak mümkün değildir. Tamamlayınca ikinci ünite mevcut patikada açılır. Tekrar açmak ikinci ödül vermez.

## Doğrulama

98 otomatik test geçti (12 yeni mini-kurs testi dahil). İçerik sayıları, gerçek kelime bağlantıları, her sorunun tek doğru seçeneği, cümle sözcükleri, 27 WAV'ın PCM/süre/hash değerleri, tamamlanma kapıları, yanlış tekrarları, kayıt geri yükleme, eski ilerleme ve tekil ödüller doğrulandı. TypeScript ve üretim derlemesi başarılı.

Tarayıcıda ilk mini-kurs baştan sona çalışıldı: açılır tablo/hata, çeviri, gerçek ses, yazma/sıralama soruları, iki kez yanlış yapıp düzeltme, yenilemede ikinci bağımsız soruya dönme, hatayla tamamlamanın engellenmesi ve bitirince Aile ve Arkadaşlar dersinin açılması doğrulandı. Bu test ilk dersin yeni mini-kurs ilerlemesini ve 20 XP/10 para ödülünü gerçek yerel kayda ekledi; eski veriler temizlenmedi.

390 px mobilde belge/scroll genişliği 375/375, 768 px tablette 753/753 ölçüldü; yatay taşma yok. Test ekran boyutu sıfırlandı. Tarayıcı hata/uyarı günlüğü boştu.
