# Deutsch Garden — özgün Almanca sesler

Bu klasördeki WAV dosyaları proje için özgün hazırlanmış metinlerden yerel olarak üretilmiştir. Profesyonel podcast veya insan ses kaydı değildir.

- Ses motoru: Piper TTS 1.8.0 (yalnızca üretim aracı; çalışma zamanında uygulamaya eklenmez).
- Ses modeli: de_DE-thorsten-medium.
- Model kaynağı ve veri lisansı: https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD (model kartında veri kümesi CC0 olarak belirtilir).
- Piper: https://github.com/OHF-Voice/piper1-gpl (GPL-3.0; motor/model dosyaları bu public klasöründe dağıtılmaz).
- Metinler, çeviriler ve sorular: Deutsch Garden özgün içeriği.
- Her listen-a1-*.wav bir tam dinleme dosyasıdır.
- dg-a1-*.wav mevcut kelime kayıtlarının artikelli telaffuzudur.
- Süreler ve cümle sınırları gerçek PCM örnek sayısından ölçülür; src/data/listening/audio-manifest.json içinde saklanır.
- Yeniden üretim: scripts/generate-listening-audio.py; gerekli araç/model yalnızca .cache/ altında tutulur.
