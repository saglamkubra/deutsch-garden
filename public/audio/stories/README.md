# Deutsch Garden — original story narration

These 156 WAV files narrate the original bilingual story source in `src/data/stories/stories.json` (42 scenes and 84 individual lines) and 30 authored glossary entries in `src/data/stories/glossary.json`.
They are generated speech, not recordings of human performers. All characters use one narrator.

Generated offline with Piper TTS 1.8.0 and `de_DE-thorsten-medium`, 22,050 Hz mono PCM.
Model card: https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD
The model card identifies the Thorsten dataset as CC0. Model checksum and each output checksum are recorded in `src/data/stories/audio.json`.
Piper project: https://github.com/OHF-Voice/piper1-gpl (GPL-3.0 engine; not shipped to browsers).
Reproduction: `python scripts/generate-story-audio.py` after preparing the existing Step 7 Piper cache.
No model, Python engine or third-party book/podcast is served with the website.

Story text and illustrations: Deutsch Garden original content, LicenseRef-DeutschGarden-Original.
