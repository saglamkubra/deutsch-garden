"""Build public authored German audio offline; never read secrets or learner data.
Uses existing build-only Piper/model/LAME caches. Only new hashed assets and their
own manifest are written. Old lesson/audio manifests are left untouched.
"""
from pathlib import Path
import os
import sys
import json
import hashlib
import wave

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
sys.path[:0] = [str(ROOT / '.cache/course-audio-tools'), str(ROOT / '.cache/listening-tts')]
from piper import PiperVoice, SynthesisConfig
import lameenc

model = ROOT / '.cache/listening-model/de_DE-thorsten-medium.onnx'
voice = PiperVoice.load(str(model), espeak_data_dir='.cache/listening-tts/piper/espeak-ng-data')
config = SynthesisConfig(length_scale=1.12)
cache = ROOT / '.cache/listening-build'
out = ROOT / 'public/audio/listening-complete'
cache.mkdir(parents=True, exist_ok=True)
out.mkdir(parents=True, exist_ok=True)


def duration_mp3(data):
    position, seconds = 0, 0
    while position < len(data):
        header = int.from_bytes(data[position:position + 4], 'big')
        if header >> 21 != 0x7ff:
            raise ValueError('Invalid MP3 frame')
        version, layer = (header >> 19) & 3, (header >> 17) & 3
        if layer != 1 or version == 1:
            raise ValueError('Unsupported MPEG frame')
        rate = [44100, 48000, 32000][(header >> 10) & 3] // (1 if version == 3 else 2 if version == 2 else 4)
        bitrates = ([0,32,40,48,56,64,80,96,112,128,160,192,224,256,320] if version == 3
                    else [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160])
        bitrate = bitrates[(header >> 12) & 15] * 1000
        size = (144 if version == 3 else 72) * bitrate // rate + ((header >> 9) & 1)
        if not bitrate or position + size > len(data):
            raise ValueError('Truncated MP3 frame')
        seconds += (1152 if version == 3 else 576) / rate
        position += size
    return seconds


manifest = {'version':1,'engine':'piper-tts 1.8.0','voice':'de_DE-thorsten-medium',
            'encoder':'lameenc 1.8.1 / LAME', 'modelSha256':hashlib.sha256(model.read_bytes()).hexdigest(), 'episodes':{}}
episodes = json.loads((ROOT / 'src/data/listening/complete-episodes.json').read_text(encoding='utf-8'))
for ep in episodes:
    chunks, segments, position = [], [], 0
    for sentence in ep['sentences']:
        text = sentence['de']
        key = hashlib.sha256((text + '|thorsten-medium|1.12').encode()).hexdigest()
        path = cache / (key + '.wav')
        if not path.exists() or path.stat().st_size < 44:
            with wave.open(str(path), 'wb') as f:
                voice.synthesize_wav(text, f, syn_config=config)
        with wave.open(str(path), 'rb') as f:
            if f.getnchannels() != 1 or f.getsampwidth() != 2:
                raise ValueError('Unexpected source PCM')
            rate = f.getframerate()
            pcm = f.readframes(f.getnframes())
        end = position + len(pcm) / 2 / rate
        segments.append({'id':sentence['id'], 'start':position, 'end':end})
        chunks.extend([pcm, bytes(int(rate * .35) * 2)])
        position = end + int(rate * .35) / rate
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(64)
    encoder.set_in_sample_rate(rate)
    encoder.set_channels(1)
    encoder.set_quality(2)
    data = bytes(encoder.encode(b''.join(chunks))) + bytes(encoder.flush())
    duration = duration_mp3(data)
    digest = hashlib.sha256(data).hexdigest()
    name = digest[:24] + '.mp3'
    target = out / name
    if not target.exists():
        target.write_bytes(data)
    manifest['episodes'][ep['id']] = {'url':'/audio/listening-complete/' + name,
        'duration':duration, 'sampleRate':rate, 'sha256':digest, 'segments':segments,
        'textSha256':hashlib.sha256('\n'.join(s['de'] for s in ep['sentences']).encode()).hexdigest()}
    print(ep['id'] + ' hazır: ' + str(round(duration)) + ' saniye', flush=True)

path = ROOT / 'src/data/listening/complete-audio.json'
temp = path.with_suffix('.tmp')
temp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
temp.replace(path)
print(str(len(episodes)) + ' gerçek ses dosyası ve ayrı manifest tamamlandı. Eski içerikler korundu.',flush=True)
