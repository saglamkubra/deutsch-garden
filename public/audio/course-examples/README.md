# Original Deutsch Garden example narration

608 MP3 assets cover the 1,392 previously missing course examples; identical
German text shares one file. The original 27 A1 WAV files and manifest are unchanged.
Text: original Deutsch Garden curriculum, LicenseRef-DeutschGarden-Original.

Generated offline using Piper TTS 1.8.0 and de_DE-thorsten-medium.
Model card and Thorsten CC0 dataset attribution:
https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD
Piper engine: https://github.com/OHF-Voice/piper1-gpl (GPL-3.0).
MP3 encoder: lameenc 1.8.1 / LAME, LGPL-3.0, https://github.com/chrisstaite/lameenc

These are generated single-narrator voices, not human recordings. Engines and
model are build tools only and are not served to browsers or required by Render.
MP3s use 48 kbit/s mono, approximately 9 MiB in total, requested on demand.
This does not implement offline audio-library caching.

Reproduce with the existing Piper cache and build-only lameenc under
`.cache/course-audio-tools`:

```text
node scripts/export-course-audio.ts
python scripts/generate-course-extension-audio.py
```

`src/data/courses/extra-audio.json` records actual frame-derived durations,
source-text and file SHA-256 values, model checksum and voice/encoder attribution.
No private progress, diary, chat, birthday letter or environment secret is read.
