# Deutsch Garden — six new story worlds

216 original MP3 assets: 42 full scenes, 168 individual bilingual-scene German
lines, and 6 vocabulary pronunciations. Approximately 19.2 MiB, requested only
when played. A1 travel, A2 friendship, B1 life in Germany, B2 mystery, C1 fantasy
and C2 work. Existing story/audio assets and identifiers are preserved.

Public text: Deutsch Garden original authored learning material,
LicenseRef-DeutschGarden-Original. No private birthday letter, diary, conversation,
account data or credential is read or sent to any provider.

Offline synthesis: Piper TTS 1.8.0, de_DE-thorsten-medium, length scale 1.12.
Model card and Thorsten CC0 dataset attribution:
https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD
Piper engine, GPL-3.0: https://github.com/OHF-Voice/piper1-gpl
Encoder: lameenc 1.8.1 / LAME, LGPL-3.0:
https://github.com/chrisstaite/lameenc

These are synthetic single-narrator voices, not human recordings. Encoding:
64 kbit/s mono MP3. The manifest records actual MP3 frame durations, file and
source-text SHA-256 values, sample rate and model checksum. Engine/model caches
are build tools only; Render does not synthesize audio or need a persistent disk.

Reproduce with the existing local build tool/model caches:

```text
node scripts/build-story-expansion.mjs
python scripts/generate-story-expansion-audio.py
python scripts/audit-public-audio.py
```

Do not regenerate previous story catalogs. No paid API or Gemini quota is used.
Language and CEFR suitability still benefit from independent teacher review;
no such human editorial approval is claimed.
