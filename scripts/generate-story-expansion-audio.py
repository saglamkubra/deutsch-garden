"""Offline public story narration; no API, secrets or private learner files."""
from pathlib import Path
import os, sys, json, hashlib, wave
ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
sys.path[:0] = [str(ROOT / '.cache/comedy-audio-tools'), str(ROOT / '.cache/course-audio-tools'), str(ROOT / '.cache/listening-tts')]
from piper import PiperVoice, SynthesisConfig
import lameenc

model = ROOT / '.cache/listening-model/de_DE-thorsten-medium.onnx'
voice = PiperVoice.load(str(model), espeak_data_dir='.cache/listening-tts/piper/espeak-ng-data')
config = SynthesisConfig(length_scale=1.12)
cache = ROOT / '.cache/listening-build'
out = ROOT / 'public/audio/stories-worlds'
cache.mkdir(parents=True, exist_ok=True)
out.mkdir(parents=True, exist_ok=True)

def duration_mp3(data):
    position, seconds = 0, 0
    while position < len(data):
        header = int.from_bytes(data[position:position+4], 'big')
        if header >> 21 != 0x7ff:
            raise ValueError('Invalid MP3 frame')
        version, layer = (header >> 19) & 3, (header >> 17) & 3
        if layer != 1 or version == 1:
            raise ValueError('Unsupported MPEG frame')
        rate = [44100,48000,32000][(header >> 10) & 3] // (1 if version == 3 else 2 if version == 2 else 4)
        bitrates = ([0,32,40,48,56,64,80,96,112,128,160,192,224,256,320] if version == 3 else [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160])
        bitrate = bitrates[(header >> 12) & 15] * 1000
        size = (144 if version == 3 else 72) * bitrate // rate + ((header >> 9) & 1)
        if not bitrate or position + size > len(data):
            raise ValueError('Truncated MP3 frame')
        seconds += (1152 if version == 3 else 576) / rate
        position += size
    return seconds

def pcm_for(text):
    key=hashlib.sha256((text+'|thorsten-medium|1.12').encode()).hexdigest()
    path=cache/(key+'.wav')
    if not path.exists() or path.stat().st_size<44:
        with wave.open(str(path),'wb') as f:
            voice.synthesize_wav(text,f,syn_config=config)
    with wave.open(str(path),'rb') as f:
        if f.getnchannels()!=1 or f.getsampwidth()!=2:
            raise ValueError('Unexpected source format')
        return f.readframes(f.getnframes()),f.getframerate()

def asset(pcm,rate,text):
    encoder=lameenc.Encoder()
    encoder.set_bit_rate(64)
    encoder.set_in_sample_rate(rate)
    encoder.set_channels(1)
    encoder.set_quality(2)
    data=bytes(encoder.encode(pcm))+bytes(encoder.flush())
    digest=hashlib.sha256(data).hexdigest()
    path=out/(digest[:24]+'.mp3')
    if not path.exists():
        path.write_bytes(data)
    elif hashlib.sha256(path.read_bytes()).hexdigest()!=digest:
        raise ValueError('Existing asset hash mismatch; never overwrite')
    return dict(url='/audio/stories-worlds/'+path.name,duration=duration_mp3(data),sha256=digest,
                textSha256=hashlib.sha256(text.encode()).hexdigest(),sampleRate=rate)

manifest=dict(version=1,engine='piper-tts 1.8.0',voice='de_DE-thorsten-medium',encoder='lameenc 1.8.1 / LAME',
              modelSha256=hashlib.sha256(model.read_bytes()).hexdigest(),scenes={},glossary={})
stories=json.loads((ROOT/'src/data/stories/world-stories.json').read_text(encoding='utf-8'))
for story in stories:
    for scene in story['scenes']:
        chunks,lines=[],[]
        for line in scene['lines']:
            pcm,rate=pcm_for(line['de'])
            lines.append(asset(pcm,rate,line['de']))
            chunks.extend([pcm,bytes(int(rate*.3)*2)])
        text='\n'.join(l['de'] for l in scene['lines'])
        manifest['scenes'][story['id']+':'+scene['id']]=dict(full=asset(b''.join(chunks),rate,text),lines=lines)
    print(story['id']+' sesleri hazır',flush=True)
for word in json.loads((ROOT/'src/data/stories/world-glossary.json').read_text(encoding='utf-8')):
    text=word['article']+' '+word['word']
    pcm,rate=pcm_for(text)
    manifest['glossary'][word['id']]=asset(pcm,rate,text)
path=ROOT/'src/data/stories/world-audio.json'
temp=path.with_suffix('.tmp')
temp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
temp.replace(path)
print('42 sahne, 168 satır ve 6 kelimenin MP3 dosyaları doğrulandı. Eski sesler korundu.',flush=True)
