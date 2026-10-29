# Deutsch Garden — original listening narration

50 offline-generated German MP3 recordings, approximately 24.6 MiB and 53 minutes
40 seconds at original playback speed. Texts and Turkish translations are original
Deutsch Garden content, LicenseRef-DeutschGarden-Original. They are fictional
educational scripts, not recordings of real interviews, official guidance or news.
Dialogues are read by one synthetic narrator; no human speaker recording is claimed.

Voice: de_DE-thorsten-medium; Thorsten dataset/model attribution (CC0):
https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD
Engine: Piper TTS 1.8.0, https://github.com/OHF-Voice/piper1-gpl (GPL-3.0).
Encoder: lameenc 1.8.1 / LAME, https://github.com/chrisstaite/lameenc (LGPL-3.0).

The engine, model and encoder are existing build tools and are not shipped to
browsers or required by the deployed server. Generated assets use 64 kbit/s mono
MP3 and are fetched on demand. This does not provide an offline audio library.

Reproduce using the existing local build caches:

```text
node scripts/build-listening-complete.mjs
python scripts/generate-listening-complete-audio.py
```

The separate complete-audio.json manifest records file/text SHA-256, frame-derived
duration, sample rate and synthesized paragraph ranges. Paragraph highlighting is
not word-level forced alignment. Old audio/manifests and private progress are not
read or overwritten by this generation workflow.
