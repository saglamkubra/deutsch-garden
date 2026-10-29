"""Offline public example speech. Never overwrites original audio or learner data.

Prepare input: node scripts/export-course-audio.ts
Build-only tools: existing Piper cache + lameenc==1.8.1 in .cache/course-audio-tools.
The engine, MP3 encoder and model are not runtime/application dependencies.
"""
from pathlib import Path
import os
import sys
import json
import wave
import hashlib

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
sys.path[:0] = [str(ROOT / '.cache/course-audio-tools'), str(ROOT / '.cache/listening-tts')]
from piper import PiperVoice, SynthesisConfig
import lameenc

model = ROOT / '.cache/listening-model/de_DE-thorsten-medium.onnx'
voice = PiperVoice.load(str(model), espeak_data_dir='.cache/listening-tts/piper/espeak-ng-data')
config = SynthesisConfig(length_scale=1.12)
cache = ROOT / '.cache/listening-build'
cache.mkdir(parents=True, exist_ok=True)
out = ROOT / 'public/audio/course-examples'
out.mkdir(parents=True, exist_ok=True)


def duration_mp3(data):
    position, seconds = 0, 0
    while position < len(data):
        header = int.from_bytes(data[position:position + 4], 'big')
        if header >> 21 != 0x7ff:
            raise ValueError('Invalid MP3 frame')
        version, layer = (header >> 19) & 3, (header >> 17) & 3
        if layer != 1 or version == 1:
            raise ValueError('Unsupported MPEG format')
        rates = [44100, 48000, 32000]
        rate = rates[(header >> 10) & 3] // (1 if version == 3 else 2 if version == 2 else 4)
        bitrates = ([0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
                    if version == 3 else [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160])
        bitrate = bitrates[(header >> 12) & 15] * 1000
        samples = 1152 if version == 3 else 576
        size = (144 if version == 3 else 72) * bitrate // rate + ((header >> 9) & 1)
        if not bitrate or position + size > len(data):
            raise ValueError('Truncated MP3 frame')
        position += size
        seconds += samples / rate
    return seconds


manifest = {'version': 1, 'engine': 'piper-tts 1.8.0', 'voice': 'de_DE-thorsten-medium',
            'encoder': 'lameenc 1.8.1 / LAME', 'modelSha256': hashlib.sha256(model.read_bytes()).hexdigest(),
            'examples': {}}
rows = json.loads((ROOT / '.cache/course-audio-input.json').read_text(encoding='utf-8'))
for i, row in enumerate(rows):
    text = row['de']
    text_hash = hashlib.sha256(text.encode()).hexdigest()
    key = hashlib.sha256((text + '|thorsten-medium|1.12').encode()).hexdigest()
    wav = cache / (key + '.wav')
    if not wav.exists() or wav.stat().st_size < 44:
        with wave.open(str(wav), 'wb') as f:
            voice.synthesize_wav(text, f, syn_config=config)
    with wave.open(str(wav), 'rb') as f:
        if f.getnchannels() != 1 or f.getsampwidth() != 2:
            raise ValueError('Unexpected source PCM format')
        rate, frames = f.getframerate(), f.getnframes()
        pcm = f.readframes(frames)
    dest = out / (key + '.mp3')
    if not dest.exists():
        encoder = lameenc.Encoder()
        encoder.set_bit_rate(48)
        encoder.set_in_sample_rate(rate)
        encoder.set_channels(1)
        encoder.set_quality(2)
        encoded = bytes(encoder.encode(pcm)) + bytes(encoder.flush())
        duration_mp3(encoded)
        dest.write_bytes(encoded)
    data = dest.read_bytes()
    manifest['examples'][row['id']] = {
        'url': '/audio/course-examples/' + dest.name,
        'duration': duration_mp3(data), 'sourceDuration': frames / rate,
        'sampleRate': rate, 'sha256': hashlib.sha256(data).hexdigest(), 'textSha256': text_hash,
    }
    if (i + 1) % 100 == 0:
        print(str(i + 1) + '/' + str(len(rows)) + ' examples ready', flush=True)

(ROOT / 'src/data/courses/extra-audio.json').write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(str(len(rows)) + ' examples complete; original audio and private data preserved.', flush=True)
