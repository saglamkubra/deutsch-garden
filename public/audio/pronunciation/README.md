# Deutsch Garden — public vocabulary and exercise recordings

477 additive MP3 recordings (about 5.94 MiB) complete the static pronunciation
catalog. Existing recordings are reused; original audio is never overwritten.
The resulting index covers 1,170 distinct authored German texts, including every
bundled vocabulary label, flashcard example and listening exercise prompt.

Text: Deutsch Garden original learning material,
LicenseRef-DeutschGarden-Original. No diary, chat, birthday letter, user name,
credential or private progress is processed by these build tools.

Generated offline with Piper TTS 1.8.0, de_DE-thorsten-medium, length scale 1.12.
Voice/model card and Thorsten CC0 dataset attribution:
https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD
Piper: https://github.com/OHF-Voice/piper1-gpl (GPL-3.0).
Encoder: lameenc 1.8.1 / LAME, LGPL-3.0,
https://github.com/chrisstaite/lameenc . MP3: 64 kbit/s mono.

These are synthetic single-narrator recordings, not professional human speech.
Source PCM is only attenuated when needed to keep 18 percent peak headroom;
quiet speech is never amplified. SHA-256 filenames are immutable.

Reproduce using existing build-only tools/model under ignored .cache:

```text
node scripts/prepare-public-pronunciation.ts
python scripts/generate-public-pronunciation.py
node scripts/export-pronunciation-audio.ts
python scripts/audit-public-audio.py
```

Piper, NumPy, LAME and miniaudio are local build/audit tools only, not Render or
browser dependencies. Ordinary npm builds use committed assets and regenerate
only the public JSON index. There are no new provider API costs.
