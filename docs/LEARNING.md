# Öğrenme sistemi · 4. adım

## Kapsam ve gerçek veri miktarı

Derslerim rotası altı CEFR dünyasını gösterir. Her düzeyde 10 ünite ve iki ders başlığı vardır: toplam 60 ünite, 120 ders başlığı. Yalnızca 10 A1 kelime patikasında gerçek içerik vardır; kalan 110 ders başlığı plan aşamasındadır. Kelime patikası tamamlanması CEFR yeterliği, sınav başarısı veya tüm dersin bitirilmesi anlamına gelmez.

| Düzey | Özgün kelime kaydı | Hazır kelime ünitesi |
| ----- | -----------------: | -------------------: |
| A1    |                 60 |                   10 |
| A2    |                  0 |                    0 |
| B1    |                  0 |                    0 |
| B2    |                  0 |                    0 |
| C1    |                  0 |                    0 |
| C2    |                  0 |                    0 |

A1 veri seti isim, fiil, sıfat, zarf, sayı ve yaygın ifadeler içerir. İsimlerin artikeli ve çoğulu/çoğul notu vardır. Türkçe açıklamalar ve Almanca/Türkçe örnek cümleler bu proje için özgün yazıldı; sözcük türleri, çoğullar, örnek dil bilgisi ve zorunlu alanlar gözden geçirildi. Bu bir tam veya resmî A1 listesi ya da bağımsız uzman onaylı ders kitabı değildir.

## Kaynak araştırması ve izin kararı

Kontrol tarihi: 27 Ekim 2026.

- AlmancaABC ana dizini: https://almancaabc.com/almanca-kelimeler/
- İncelenen düzey sayfaları: /almanca-a1-kelimeleri/, /almanca-a2-kelimeleri/, /almanca-b1-kelimeleri/, /almanca-b1-b2-kelimeleri/, /almanca-b2-kelimeler/, /almanca-c1-kelimeleri/.
- robots.txt: https://almancaabc.com/robots.txt adresi okundu. Genel sayfalara tarama izni var; bu yeniden kullanım lisansı değildir.
- Kullanım koşulları: https://almancaabc.com/kullanim-kosullari/ özellikle bölüm 10 incelendi. Başka uygulamada sözlük veritabanı kullanımı için izin bulunmadığından tablo/örnek/PDF/ses aktarılmadı.
- Gizlilik bağlantısı da incelendi. Impressum bağlantısı web aracında erişilemedi; koşullar sayfası ve robots dosyası erişilebildi.
- Kaynakta A1, A2, B1, B1–B2, B2 Beruf ve C1 bağlantıları doğrulandı. C2 listesi varsayılmadı.
- Kaynak yalnızca konu düzeni referansıdır. AlmancaABC’den içe aktarılan kayıt sayısı: **0**.
- CEFR çerçeve referansı: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions . Betimleyiciler kopyalanmadı; özgün öğretim planını yönlendirdi.
- Sınırlı dil bilgisi karşılaştırması: Duden’in Apfel ve Wasser maddeleri (https://www.duden.de/rechtschreibung/Apfel ve https://www.duden.de/rechtschreibung/Wasser). Duden tanımları, örnekleri veya sesi aktarılmadı.
- Haricî lisanslı veri seti içe aktarılmadı. Özgün kayıtlar source_name = “Deutsch Garden · özgün içerik”, source_url = null ve license = “LicenseRef-DeutschGarden-Original” taşır. Bu etiket proje içi özgün içerik üstverisidir; üçüncü taraf lisansı veya otomatik yeniden yayın izni değildir.
- Genel JSON hattı özgün kayıtlar ile kaynağı belirtilmiş CC0-1.0, CC-BY-4.0 ve CC-BY-SA-4.0 etiketlerini doğrulayabilir. Gerçek izin ve atıf yükümlülükleri ayrıca değerlendirilmelidir; şu anda bunlardan aktarılmış kayıt yoktur. Hatta ses URL’si eklemek reddedilir. Web kazıyıcısı veya ücretli içerik indirme kodu yoktur.

## Veri mimarisi ve dosyalar

- src/lib/learning/types.ts: kelime, müfredat, günlük görev, yanıt ve kayıt tipleri.
- curriculum.ts: altı düzeyin özgün ünite/ders üstverisi; kelime içeriğinden ayrı.
- seed.ts: 60 özgün başlangıç kaydının editoryal kaynağı.
- import.ts: alan/lisans doğrulama, NFC normalizasyonu, indeksli tekrar denetimi ve eklenen/güncellenen/atlanan/reddedilen raporu.
- repository.ts: tipli VocabularyRepository ve LocalVocabularyRepository; arama ve en fazla 50, arayüzde 12 kayıt/sayfa.
- src/data/vocabulary.json: doğrulanmış, uygulamayla sunulan veri.
- engine.ts: günlük seçim, takvim günü hesabı, basit SRS, ünite kilometre taşları ve ödül niyetleri. React veya tarayıcı depolamasına bağlı değildir.
- persistence.ts: sürümlü LearningPersistence arayüzü ve yerel kayıt uygulaması.
- store.ts: UI aboneliği, sözlük önbelleği, kayıt ve bahçe ödülü kuyruğu.
- src/components/learning/: harita, kütüphane, kartlar ve normal/yavaş telaffuz.
- src/app/derslerim/ ve kelimelerim/: gerçek sayfalar. Diğer önceki rotalar korunur.
- Ana sayfanın Günün Kelimeleri bölümü bu gerçek seçimden gelir; üstteki eski XP/seri/görev kartları hâlâ açıkça demo olarak gösterilir.

Bir kelime birden fazla düzey, konu ve üniteye bağlanabilir. Aynı anlamın yeni ünitede kullanılması yeni sözlük satırı oluşturmaz. Normal anahtar sözcük+tür+artikel+anlam kimliğini kullanır; aynı Almanca/Türkçe anlam için ek maruz kalma denetimi de vardır. Almanca umlautlar kimlikte korunur; ß/ss karşılaştırılabilir. Aramada Türkçe aksan ve Almanca umlaut sadeleştirmesi yapılır.

## Yerel kalıcılık ve günlük seçim

Supabase yapılandırması bulunmadı; **Supabase bağlı değil**. Uzak tablo oluşturulmadı. İçerik JSON dosyasında ve tarayıcı sözlük önbelleğinde, öğrenme yanıtları localStorage içinde saklanır. Bahçenin mevcut kaydı ayrı anahtarında korunur.

- Öğrenme kaydı: deutsch-garden:learning:v1.
- Sözlük önbelleği: deutsch-garden:vocabulary:v1.
- Var olan bahçe: deutsch-garden:garden:v1.
- Hatalı öğrenme verisi korunarak sağlam yedek denenir; yeni sürüm veya erişilemeyen depolamada yanıtlar kapatılır. Yazma başarısızsa yanıt işlenmez.
- Gün tarayıcının yerel takvimine göre hesaplanır. UTC gece yarısı esas alınmaz.
- Her tarih+düzey için tek, kalıcı günlük seçim oluşturulur. Aynı gün yenileme veya hedef değişimi listeyi değiştirmez. Yeni hedef sonraki gün uygulanır.
- Hiç tanıtılmamış kelimeler önce seçilir. Henüz yanıtlanmamış tanıtımlar da ertesi gün tekrar kuyruğuna girer. Yeni kelimeler ve zamanı gelen tekrarlar ayrı listelerdir.
- Yeni kelime hedefi 5/10/15/20; günlük tekrar listesi en fazla 20 kayıttır.
- Sözcük havuzu bitince mevcut sayı gösterilir; sahte veya başka düzeyde kelime eklenmez.
- Sekme odağı, görünürlük değişimi, yanıt eylemi ve 30 saniyelik kontrol gün değişimini izler.
- Yanıt planı: Biliyorum → 1, 3, 7, 14, 30 gün; Tekrar Etmeliyim → 1 gün. Aynı gün aynı sözcüğün SRS sayacı bir kez artar. Bu, öğrenenin öz değerlendirmesidir.
- Ünite kilidi önceki ünitenin mevcut kelimeleri çalışılınca açılır. Üst düzeyden başlama önceki derslere tamamlama işareti vermez.
- Öğrenme düzeyi seçimi, henüz uygulanmamış yüksek düzey bahçelerini oynanabilir hale getirmez.

## Bahçe bağlantısı

Yalnızca günlük yeni kartlar kaynak kazandırır: 5 farklı yeni kelimeye Biliyorum → 1 papatya tohumu; 10’unda toplam 2; tüm yeni kartlar yanıtlanınca 5 bahçe parası. İnceleme, kartı çevirme veya boş liste ödül vermez. Ünite turları ayrıca ödüllendirilmez. Tekrar için su damlası ödülü bu adımda bağlı değildir; önce bahçede ayrı su envanteri tasarlanmalıdır.

Önce öğrenme yanıtı ve ödül niyeti kaydedilir. Sonra merkezi deliverGardenReward/grantReward bağlantısı mevcut bahçe kaydını okuyarak kimliği bir kez işler. Bahçe yazımı başarılıysa öğrenme kuyruğu teslim edildi olarak kaydedilir. İkinci yazma yarıda kalırsa tekrar deneme aynı bahçe makbuzu sayesinde kaynak çoğaltmaz. Bahçe kaydı başarısızsa ödül bekler. Çiçekler, tohumlar, para ve süsler sıfırlanmaz.

## SQL migration ve uzak geçiş

supabase/migrations/202610270001_learning.sql dosyası 14 tablo tanımlar:

1. learning_levels
2. learning_units
3. learning_lessons
4. vocabulary
5. vocabulary_levels
6. vocabulary_topics
7. vocabulary_units
8. learning_user_settings
9. daily_vocabulary_assignments
10. daily_vocabulary_items
11. vocabulary_learning_progress
12. unit_vocabulary_responses
13. learning_milestones
14. learning_reward_receipts

Düzey/konu/Almanca sözcük indeksleri, arama GIN indeksi, çoklu bağlam ilişkileri, benzersiz günlük görev ve ödül makbuzu anahtarları hazırdır. Katalog tabloları salt okunur; kullanıcı verileri auth.uid() sahibine sınırlandırılır. Ödül makbuzuna istemciden yazma izni verilmez; üretimde ödül sunucu tarafında doğrulanmış bir işlem/RPC ile uygulanmalıdır. Tasarım referansı: https://supabase.com/docs/guides/database/postgres/row-level-security .

Migration ve supabase/seed.sql bu oturumda bir veritabanına uygulanmadı. SQL/RLS için canlı çalışma veya güvenlik testi yapıldığı iddia edilmez.

Uzak geçiş için: Supabase projesi ve Auth kurulumu; migration/seed uygulama; yerel öğrenme JSON’unu oturum sahibine bağlayarak açık onayla bir defa aktaran adaptör; sunucu tarafı günlük atama/yanıt/ödül işlemleri; sayfalı veritabanı sorgularını kullanan repository; iki farklı kullanıcıyla RLS izin/ret testleri gerekir. Service-role anahtarı tarayıcıya konmamalıdır. Mevcut localStorage kaydı başarıyla doğrulanmadan silinmemelidir.

## Komutlar ve testler

Node.js 24 kullanılır.

- npm run vocab:seed — özgün veri hattını tekrar çalıştırır. Sonraki çalıştırma 0 eklenen / 0 güncellenen / 60 atlanan / 0 reddedilen üretir.
- node scripts/import-vocabulary.ts --input izinli-kayitlar.json --output src/data/vocabulary.json — yalnızca izinli, üstverisi doğrulanmış yerel JSON’u işler. Aynı çıktı dosyası güncellenir; bozuk mevcut çıktı üzerine yazılmaz.
- npm run db:seed:generate — SQL seed dosyasını hazırlar; veritabanına göndermez.
- npm run vocab:rotation -- 2026-10-27 — iki ardışık günü bellekte simüle eder. Tarayıcıdaki ilerlemeyi veya cihaz saatini değiştirmez.
- npm test — önceki bahçe ve yeni öğrenme testleri.
- npm run lint, npm run typecheck, npm run build — kod kontrolleri.

İçe aktarma raporları reports/vocabulary-seed-initial.json ve vocabulary-import.json içindedir. İlk çalıştırma: 60 eklenen, 0 güncellenen, 0 atlanan, 0 reddedilen. Yeni gün testinde ilk günün yeni kelimeleri ikinci günün yeni listesinde tekrarlanmaz; zamanı gelenler ayrı tekrar listesinde görünür.

Tarayıcıda kart çevirme, tekrar yanıtı, arama, ses bulunamadı geri bildirimi, dünya seçimi ve A1 kelime patikasının açılması kontrol edilir. Test için verilen Tekrar Etmeliyim yanıtı tarayıcı kaydında tutulur; uydurma Biliyorum serisiyle kaynak üretilmez.
