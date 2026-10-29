# Ders örneklerinin sesi ve onay düğmesi

## Neden

İlk iki A1 dersinde 27 hazır WAV vardı. Sonradan eklenen 1.392 örnek yalnızca
cihazın Almanca `speechSynthesis` sesine dayanıyordu. Almanca ses bulunmayan
tarayıcıda ‘Cihazında Almanca ses bulunamadı’ görünmesi bu yüzden gerçekleşiyordu.
Bu bir Gemini veya mikrofon sorunu değildir.

‘Bu örneği anladım’ düğmesi ses dinlemeye bağlı değildir. Öğretim adımları
tamamlanmamışsa veya önceki örnek atlanmışsa motor onayı kabul etmez. Önceden
sıra kilidinin nedeni kartın yanında yeterince açık değildi.

## Düzeltme

- Tüm 60 dersin 1.419 örneğinde hazır ses var. Eski 27 WAV korunur.
- Ek 1.392 örnek için 608 tekil MP3 üretildi; aynı Almanca cümle aynı dosyayı
  paylaşır. Toplam ek ses yaklaşık 9 MiB, uygulama açılırken topluca indirilmez.
- Cihazda Almanca ses kurulması gerekmez. İnternet bağlantısı gerekir;
  tam çevrimdışı ses kütüphanesi uygulanmadı.
- Normal/yavaş/çok yavaş hız seçimi, duraklatma ve yeniden yükleme hata durumu var.
- Eksik anlatımın numarası/başlığı ve ‘Eksik anlatıma dön’ düğmesi gösterilir.
- Atlanan önceki örnek için ‘Sıradaki tamamlanmamış örneğe dön’ düğmesi vardır.
- UI ve kayıt motoru aynı `exampleGate` koşulunu kullanır. Onay ve ödül
  şartları kaldırılmaz; gerçek ilerleme veya eski kayıt sıfırlanmaz.

## Dosyalar

`src/lib/courses/audio.ts`, `src/data/courses/extra-audio.json`,
`public/audio/course-examples/`, `scripts/export-course-audio.ts`,
`scripts/generate-course-extension-audio.py`,
`src/lib/courses/engine.ts`, `src/components/courses/mini-course.tsx`,
`src/app/mini-courses.css`, `src/lib/courses/courses.test.ts`.

Sesler yerel Piper ve derleme aracı lameenc 1.8.1 ile üretildi. Model ve
kodlayıcı yalnızca `.cache` altındadır; Render çalışma zamanında gerekli değildir.
Atıflar ve yeniden üretim: `public/audio/course-examples/README.md`.
Gemini isteği, yeni ortam değişkeni veya SQL migration gerekmez.

## Test

256 test, lint, TypeScript ve üretim derlemesi başarılı. Seslerin içerik
eşleşmesi, SHA-256, MP3 frame bütünlüğü, süreleri ve bütün örneklerin kapsamı
test edilir. 60 derste eksik anlatım ve atlanan örnek onayı engeller; doğru
sırada ses dinlemeden onay kabul edilir. Mevcut ödül/idempotence testleri korunur.

Ayrı 3001 misafir oturumunda ekran görüntüsündeki A2 cümlesi gerçekten çalındı;
2,351 saniyelik ses sonuna ulaştı ve tarayıcı ses hatası vermedi. C2 dersinde
eksik ikinci anlatıma dönüş, anlatım sonrasında etkinleşen onay, atlanan örnekten
geri dönüş ve onayın sonraki örneğe ilerlemesi UI üzerinden doğrulandı.
Gerçek kullanıcı 3000 ilerlemesi test için değiştirilmedi.
