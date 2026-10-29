# Deutsch Garden — 5. adım

## Çalışan özellikler
/alistirmalar artık “Almanca Oyun Alanım”. Sekiz mod: çoktan seçmeli, boşluk doldurma, kelime eşleştirme, cümle oluşturma, Türkçeden Almancaya, Almancadan Türkçeye, dinleme ve günlük karışık test. Tam ekran native dialog klavye odağını tutar; Escape veya Çık oturumu saklar. Sonuçlarda tekrar, hataları çalışma, bahçe ve ana sayfa bağlantıları çalışır. Yanlış yanıtlar kalp veya kaynak kaybettirmez.

İlk dört adımın localStorage anahtarları ve verileri sıfırlanmaz. Üst başlık/ana sayfa profil XP'si hâlâ açıkça örnek veridir; alıştırmanın kendi XP defteri gerçektir.

## İçerik ve soru üretimi
generateQuestions, mevcut VocabularyRepository arayüzünü kullanır. İçerik kaynağı aynı 60 özgün A1 kelimesidir; ayrı sabit soru dizisi yoktur. A2–C2 için içerik uydurulmaz. Alıştırma düzeyi geçici olarak seçilebilir; ders başlangıç düzeyi değiştirilmez.

Çoktan seçmeli ve dinleme: aynı sözcük türündeki çeldiriciler önceliklidir; tüm tanımlı karşılıklar karşılaştırılır, eş anlamlı veya yinelenen seçenekler ayıklanır. Yeterli içerikte dört seçenek, küçük havuzda daha az seçenek; tek seçenekli soru üretilmez.

grammar.ts içinde 12 özgün A1 cümlesinin çekim biçimleri, eksik fiili, kabul edilen sözcük dizilişleri ve Türkçe açıklaması vardır. Bunlar kelimenin depodaki örnek cümlesiyle tam eşleşirse kullanılır. Rastgele sözcük silme yapılmaz. “Sie arbeitet” sorusunda sie'nin tekil olduğu belirtilir. Sözcük karolarının farklı geçerli sıralamaları kabul edilir. Sürükleme yerine telefon ve klavyede çalışan dokun/tıkla etkileşimi kullanılır; geri al ve sıfırla vardır.

Çeviri: kelime karşılıkları ve noktalı virgülle ayrılan alternatifler, ayrıca sınırlı elle tanımlı eş anlamlılar kullanılır. NFC, dilin büyük/küçük harf kuralları, ß/ss, boşluk ve yaygın noktalama normalleştirilir. Umlautlar anlam taşıdığı için rastgele silinmez. Artikel isteğe bağlıdır. Bu bir serbest metin anlamsal değerlendirme modeli değildir. Örnek cümleler ve çevirileri yanıt sonrasında açıklamada gösterilir.

Eşleştirmede dört benzersiz çift, tamamlanan çiftler ve hatalı denemeler kaydedilir. Çiftler tamamlanınca oyun yanıtı bir kez kaydedilir. Son kayıttan önce kapanma durumuna karşı “Eşleştirmeyi tamamla” kurtarma eylemi bulunur. Başarılar ve hatalar sonraki oyunların öncelik puanına katılır. Tekrarlayan hata daha kolay seçenekli soruya yönlendirir; üç veya daha fazla başarılı yanıttan sonra uygun sözcük karışık testte cümle sorusuna dönüşebilir. Bu, kurala dayalı uyarlamadır.

## Günlük test ve kayıt
Yerel takvim günü, öğrenme düzeyi ve sabit tohum üzerinden deterministik seçim yapılır. Varsayılan 10 soru; yetersiz içerikte daha kısa veya açık boş durum vardır. Günlük kelimeler ve zamanı gelmiş tekrarlar önceliklidir. Aynı günün ilk soru anlık görüntüsü; tarih, soru kimlikleri, seçenekler, kabul edilen yanıtlar ve sıra ile birlikte saklanır. Yenilemede yeniden üretilmez. Bir sonraki yerel günde farklı tohumla yeni atama oluşur. Gece yarısından önce başlamış oyun kendi tarihiyle tamamlanabilir.

Anahtar: deutsch-garden:exercises:v1. Oturumlar, yanıtlar, eşleştirme denemeleri, zaman damgaları, konum, XP işlemleri, günlük atamalar, kelime hata sayaçları ve ödül aktarım kuyruğu bu anahtardadır. Geçerli önceki kayıt :backup, bozuk ham kayıt :corrupt altında korunur. Daha yeni sürüm salt okunurdur. Depolama yoksa ilerleme kaydedilmiş gibi davranılmaz. Desteklenen tarayıcılarda Web Locks ile yazmadan önce en güncel kayıt yeniden okunur; sekmeler storage olayıyla eşitlenir. Web Locks olmayan tarayıcıda tek sekme kullanılması önerilir; cihazlar arası eşitleme yoktur.

Henüz gönderilmemiş çeviri taslağı veya tamamlanmamış cümle karo seçimi yenilemede temizlenebilir. Onaylanmış yanıtlar ve tamamlanmış eşleştirme çiftleri korunur.

## Ödüller
engine.ts REWARDS tek hesaplama yeridir:
- İlk doğru yanıt +5 XP: yerel gün + düzey + sabit soru kimliği başına bir kez.
- Günün ilk tamamlanan oyunu +10 bahçe parası: tüm modlar için gün + düzey başına tek hak.
- İlk denemesinde tüm yanıtları doğru, hatalı eşleştirme denemesi olmayan günlük teste +1 lavanta tohumu: gün + düzey başına tek hak.
- Tüm soruları atlanan oturum ödül üretmez. Ses sorusu puansız atlanabilir; yanlış sayılmaz.

Tekrar çalışması yapılabilir; önceden kazanılmış haklar yenilenmez. Kısaltılmış hata çalışmaları veya günlük test tekrarları kusursuz test tohumu vermez. Bir tekrar önceki yanlış soruyu ilk kez doğru yanıtlarsa o sorunun henüz kazanılmamış XP'sini alabilir. Sonuçtaki XP yalnızca o oturumda eklenen puandır. Pekiştirilen kelime sayısı kesin ustalık veya CEFR yeterliği iddiası değildir. Sonuçlarda yanıt açıklamaları yeniden incelenebilir.

Önce yanıt ve ödül niyeti kalıcı kaydedilir. Ardından mevcut deliverGardenReward adaptörü exercise kaynaklı tekil makbuzla kaynakları ekler. Başarılı aktarım kuyrukta işaretlenir. İki kayıt arasındaki kapanmada bahçe makbuzu tekrar eklemeyi engeller. Başarısız aktarım bekler ve yeniden denenebilir. Bahçe çiçekleri, parası ve düzeni sıfırlanmaz. Yeni su damlası ekonomisi eklenmedi; örnek ödüller arasından mevcut para ve tohum kaynakları kullanıldı.

## Dinleme
Mevcut Pronunciation bileşeni, kullanıcı isteğiyle de-DE (veya başka Almanca) cihaz sesi kullanır. Normal/yavaş çalma, yeniden dinleme ve durdurma vardır. Sesler geç yüklenirse beklenir; destek/ses yoksa Türkçe mesaj, isteğe bağlı yazılı ipucu veya puansız geçme sunulur. İnsan kaydı olduğu söylenmez; ses kendiliğinden çalmaz.

## Veritabanı hazırlığı
Supabase hâlâ bağlı değildir. Tüm çalışan ilerleme yereldir.
supabase/migrations/202610270002_exercises.sql 10 tablo hazırlar:
exercise_question_types, exercise_questions, exercise_correct_answers, exercise_sessions, exercise_user_answers, exercise_attempts, exercise_daily_assignments, exercise_xp_transactions, exercise_reward_claims, exercise_learning_mistakes.
Mevcut öğrenme tablolarına yabancı anahtarlar, günlük atama/yanıt/ödül için benzersizlikler ve RLS politikaları vardır. Kabul edilen yanıtlar özel tabloda, ödül/yanıt yazma yetkisi yalnızca service_role tarafındadır. Genel katalog okunabilir, kullanıcı kendi oturumlarını okuyabilir. Gerçek uzak kullanım için Auth, uzak adaptör, sunucuda güvenilir değerlendirme/ödül işlemi ve iki kullanıcıyla RLS testleri gerekir. Migration uygulanmadı; SQL/RLS çalışma zamanı doğrulaması yapılmış sayılmaz. Yerel kayıt güvenilir sunucu veya hile önleme sistemi değildir.

## Dosyalar ve doğrulama
- src/lib/exercises/: tipler, üretici, dilbilgisi metadatası, saf motor, doğrulamalı kayıt adaptörü, React mağazası ve otomatik testler.
- src/components/exercises/exercise-center.tsx: merkez, oturum, sonuç ve etkileşimler.
- src/app/alistirmalar/page.tsx + src/app/exercises.css: özel rota ve duyarlı tema.
- supabase/migrations/202610270002_exercises.sql: uygulanmamış uzak şema.

npm test, npm run lint, npm run typecheck, npm run build ile kontrol edilir. Tarayıcıda günlük testin tüm modları, doğru/yanlış yanıt, alternatif cümle dizilişi, Türkçe büyük harf, kayıt sonrası yenileme, eşleştirme çiftinin geri yüklenmesi ve Almanca ses yokluğu akışı kontrol edildi. Mobil 390px görünümde dokunma alanları ve taşma ölçüldü.

6. adıma başlanmadı.
