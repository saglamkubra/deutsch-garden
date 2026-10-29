# Deutsch Garden — original mini-course examples

27 original German examples, generated offline with the existing Piper TTS 1.8.0 / de_DE-thorsten-medium pipeline (22,050 Hz mono PCM). This is generated speech, not a human recording. No API key or German device voice is required to play these WAV files.

Source text: `src/data/courses/mini-courses.json`. Audio duration and SHA-256: `src/data/courses/audio.json`.
Model card (Thorsten dataset: CC0): https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD
Piper engine (GPL-3.0, not served to browsers): https://github.com/OHF-Voice/piper1-gpl
Reproduction with the already prepared Step 7 cache: `python scripts/generate-course-audio.py`.
Text: Deutsch Garden original content, LicenseRef-DeutschGarden-Original.
