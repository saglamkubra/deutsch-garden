# Original Deutsch Garden comedy narration

215 on-demand MP3 files (16.34 MiB): 42 full scenes, 168 individual bilingual-story
German lines and 5 glossary pronunciations. Full-scene audio totals approximately
18 minutes 10 seconds; individual-line files repeat that narration for replay.
Six fictional, original German/Turkish stories, LicenseRef-DeutschGarden-Original.
These are synthetic educational recordings, not human performances.

Voice: de_DE-thorsten-medium, Thorsten model/dataset, CC0:
https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD
Engine: Piper TTS 1.8.0, GPL-3.0: https://github.com/OHF-Voice/piper1-gpl
Encoder: lameenc 1.8.1 / LAME, LGPL-3.0: https://github.com/chrisstaite/lameenc

Build tools and voice models are not browser dependencies and are not needed on
Render. Files use 64 kbit/s mono MP3. No provider quota or paid API is used.
There is no claim of full offline availability or human editorial approval.

Reproduce with existing local Piper/voice caches and build-only lameenc:

```text
node scripts/build-comedy-stories.mjs
python scripts/generate-comedy-audio.py
```

Manifest: `src/data/stories/comedy-audio.json`. Each entry records the complete
file SHA-256, German source SHA-256, frame-derived duration and sample rate.
Existing public content/audio and all private learner records are untouched.
