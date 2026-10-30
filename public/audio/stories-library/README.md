# Deutsch Garden — additional story library audio

Original public educational narration for the 38 additive `story-library-`
stories. Generated speech, one narrator; not human studio performances.
The manifest `src/data/stories/library-audio.json` contains whole-scene,
individual-paragraph and vocabulary recordings with exact source-text SHA-256,
file SHA-256, sample rate and duration. Identical outputs may be reused.

Generated offline with Piper, `de_DE-thorsten-medium`, and LAME via lameenc;
22,050 Hz mono source, 64 kbps mono MP3. PCM peak headroom is applied before
encoding. Voice tools/models remain build tools and are not shipped to clients.

Existing model/license reference:
- [Thorsten model card](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD), which identifies the dataset as CC0.
- [Piper engine](https://github.com/OHF-Voice/piper1-gpl), GPL-3.0.
- [lameenc](https://github.com/chrisstaite/lameenc), LGPL-3.0; wraps the LGPL LAME encoder.

Text: original Deutsch Garden educational content, with AI-assisted drafts and
editorial revisions; not extracts from third-party books or podcasts.
LicenseRef-DeutschGarden-Original. See `docs/STORY-LIBRARY.md` for scope and review
limitations. No private account, diary, birthday or chat data was used.

Reproduction after preparing the existing local Piper/LAME caches:
`python scripts/generate-library-audio.py`. Runtime never invokes Python/TTS.
