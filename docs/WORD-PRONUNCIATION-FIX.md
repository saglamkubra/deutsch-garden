# Kelime kartı telaffuzu — 30 Ekim 2026

“Wie viel kostet die Jacke?” kelime kartında `audio_url=null` olduğu için ortak Pronunciation bileşeni telefonun SpeechSynthesis motorunu kullanıyordu. Derslerde aynı ifadenin hazır Piper kaydı zaten bulunuyordu. Cihaz motorunun neden cızırtı ürettiği fiziksel olarak ölçülmedi; bu değişiklik ilgili ifade için o motoru devreden çıkarır.

`scripts/export-pronunciation-audio.ts`, mevcut genel ders örneklerini ve ses manifestini eşleştirir. `src/data/courses/pronunciation-index.json` dizininde yalnızca genel ifade, mevcut ses yolu ve dosya hash'i bulunur. Yeni ses üretilmez, AI servisi çağrılmaz, özel veri okunmaz. `prebuild` dizini günceller.

Ortak kelime telaffuz bileşeni eşleşen ifadelerde hazır ses çalar. Normal hız 1, yavaş hız 0,8 ve perde koruması kullanılır. Durdurma, bileşenden çıkış, eski oynatma geri çağrıları ve yükleme hatası ele alınır. Hazır kayıt yüklenemezse cihaz motoruna sessizce geçilmez. Dizin dışında kalan kelimelerde mevcut Almanca cihaz sesi seçeneği devam eder; tüm kelimelerde hazır ses bulunduğu iddia edilmez.

Testler: bildirilen A1 cümlesinin doğru mevcut kayda bağlanması, boşluk normalizasyonu, bütün ders örneklerinin dosya/hash eşleşmesi, bilinmeyen metinlerin güvenli cihaz sesi yolunda kalması. Gerçek telefonun hoparlör kalitesi ve son işitsel sonuç, yayın güncellendikten sonra kullanıcı tarafından doğrulanmalıdır.

İlerleme, XP, hesap, bahçe ve mevcut ses dosyaları değiştirilmez.
