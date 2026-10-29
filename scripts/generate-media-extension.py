"""Generate only the additional original lessons using the existing local Piper model.

No API, private data, original audio, original manifests or learner storage is touched.
Requires the previously prepared .cache/listening-tts and .cache/listening-model.
License and model attribution: public/audio/ and docs/STAGE-7.md.
"""
from pathlib import Path
import os
import sys
import json
import wave
import hashlib

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
sys.path.insert(0, str(ROOT / '.cache/listening-tts'))
from piper import PiperVoice, SynthesisConfig

model = ROOT / '.cache/listening-model/de_DE-thorsten-medium.onnx'
voice = PiperVoice.load(str(model), espeak_data_dir='.cache/listening-tts/piper/espeak-ng-data')
config = SynthesisConfig(length_scale=1.12)
cache = ROOT / '.cache/listening-build'
cache.mkdir(parents=True, exist_ok=True)
out = ROOT / 'public/audio/extensions'
out.mkdir(parents=True, exist_ok=True)


def read(path):
    return json.loads((ROOT / path).read_text(encoding='utf-8'))


def synth(text):
    key = hashlib.sha256((text + '|thorsten-medium|1.12').encode()).hexdigest()
    path = cache / (key + '.wav')
    if not path.exists() or path.stat().st_size < 44:
        with wave.open(str(path), 'wb') as f:
            voice.synthesize_wav(text, f, syn_config=config)
    with wave.open(str(path), 'rb') as f:
        if f.getnchannels() != 1 or f.getsampwidth() != 2:
            raise ValueError('Unexpected PCM format')
        return f.readframes(f.getnframes()), f.getframerate()


def write(name, pcm, rate):
    path = out / (name + '.wav')
    with wave.open(str(path), 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(rate)
        f.writeframes(pcm)
    return {'url': '/audio/extensions/' + path.name, 'duration': len(pcm) / 2 / rate,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}


meta = {'version': 1, 'engine': 'piper-tts 1.8.0', 'voice': 'de_DE-thorsten-medium',
        'modelSha256': hashlib.sha256(model.read_bytes()).hexdigest()}
listening = {**meta, 'episodes': {}}
for ep in read('src/data/listening/extra-episodes.json'):
    chunks, segments, position = [], [], 0
    for sentence in ep['sentences']:
        pcm, rate = synth(sentence['de'])
        end = position + len(pcm) / 2 / rate
        segments.append({'id': sentence['id'], 'start': position, 'end': end})
        chunks.extend([pcm, bytes(int(rate * .3) * 2)])
        position = end + int(rate * .3) / rate
    listening['episodes'][ep['id']] = {**write(ep['id'], b''.join(chunks), rate),
                                      'sampleRate': rate, 'segments': segments}
    print(ep['id'] + ' audio ready', flush=True)

stories = {**meta, 'scenes': {}, 'glossary': {}}
for story in read('src/data/stories/extra-stories.json'):
    for scene in story['scenes']:
        name = story['id'] + '-' + scene['id']
        chunks, lines = [], []
        for i, line in enumerate(scene['lines']):
            pcm, rate = synth(line['de'])
            lines.append(write(name + '-' + str(i), pcm, rate))
            chunks.extend([pcm, bytes(int(rate * .3) * 2)])
        stories['scenes'][story['id'] + ':' + scene['id']] = {
            'full': write(name, b''.join(chunks), rate), 'lines': lines}
    print(story['id'] + ' audio ready', flush=True)
for word in read('src/data/stories/extra-glossary.json'):
    pcm, rate = synth(word['article'] + ' ' + word['word'])
    stories['glossary'][word['id']] = write(word['id'], pcm, rate)

for path, data in [('src/data/listening/extra-audio.json', listening),
                   ('src/data/stories/extra-audio.json', stories)]:
    (ROOT / path).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Additional audio manifests ready; original files preserved.', flush=True)
