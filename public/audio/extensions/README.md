# Deutsch Garden — additional listening and story audio

Original bilingual material: `src/data/listening/extra-episodes.json`,
`src/data/stories/extra-stories.json`, `src/data/stories/extra-glossary.json`.
LicenseRef-DeutschGarden-Original. Existing audio and manifests remain unchanged.

Generated offline with Piper TTS 1.8.0, `de_DE-thorsten-medium`,
22,050 Hz mono 16-bit PCM. These are synthesized narrations, not human recordings;
one narrator voices all parts. No model or synthesis runtime is shipped to clients.

Model card: https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD
The Thorsten dataset is identified as CC0 in the model card.
Engine: https://github.com/OHF-Voice/piper1-gpl (GPL-3.0).
Model and generated-file SHA-256 values, actual PCM durations and listening
sentence intervals are recorded in the two `extra-audio.json` manifests.

Reproduction, after preparing the existing local Piper cache:

```text
node scripts/media-extension.mjs
python scripts/generate-media-extension.py
```

This generator only writes extension files. It does not read environment secrets,
contact AI providers, regenerate original lessons, or alter learner storage.
Audio is requested on the relevant lesson page, not downloaded as a whole library.
