"""Offline, resumable public vocabulary speech. No keys, private text or AI requests.
Only additive content-hashed MP3 assets are written. Legacy recordings stay intact.
"""
from pathlib import Path
import os, sys, json, hashlib, wave
ROOT=Path(__file__).resolve().parents[1]
os.chdir(ROOT)
sys.path[:0]=[str(ROOT/'.cache/comedy-audio-tools'),str(ROOT/'.cache/listening-tts')]
from piper import PiperVoice,SynthesisConfig
import lameenc
import numpy as np

source=json.loads((ROOT/'.cache/public-pronunciation-input.json').read_text(encoding='utf-8'))
model=ROOT/'.cache/listening-model/de_DE-thorsten-medium.onnx'
voice=PiperVoice.load(str(model),espeak_data_dir='.cache/listening-tts/piper/espeak-ng-data')
config=SynthesisConfig(length_scale=1.12)
out=ROOT/'public/audio/pronunciation'
out.mkdir(parents=True,exist_ok=True)
cache=ROOT/'.cache/listening-build'
cache.mkdir(parents=True,exist_ok=True)
target=ROOT/'src/data/learning/pronunciation-recordings.json'
target.parent.mkdir(parents=True,exist_ok=True)
manifest={'version':1,'engine':'piper-tts 1.8.0','voice':'de_DE-thorsten-medium','encoder':'lameenc 1.8.1 / LAME 64 kbps mono','modelSha256':hashlib.sha256(model.read_bytes()).hexdigest(),'entries':{}}
previous=json.loads(target.read_text(encoding='utf-8'))['entries'] if target.exists() else {}

for i,text in enumerate(source['texts']):
    if text in source['existing']:
        manifest['entries'][text]=source['existing'][text]
        continue
    old=previous.get(text)
    if old and (ROOT/('public'+old['url'])).exists() and hashlib.sha256((ROOT/('public'+old['url'])).read_bytes()).hexdigest()==old['sha256']:
        manifest['entries'][text]=old
        continue
    key=hashlib.sha256((text+'|thorsten-medium|1.12').encode()).hexdigest()
    wav=cache/(key+'.wav')
    if not wav.exists():
        with wave.open(str(wav),'wb') as f:voice.synthesize_wav(text,f,syn_config=config)
    with wave.open(str(wav),'rb') as f:
        if f.getnchannels()!=1 or f.getsampwidth()!=2:raise ValueError('Invalid source format')
        rate=f.getframerate();pcm=f.readframes(f.getnframes())
    samples=np.frombuffer(pcm,dtype='<i2').astype(np.float64)
    if len(samples)==0 or np.max(np.abs(samples))<10:raise ValueError('Silent source')
    # Keep headroom before encoding; never amplify quiet speech.
    gain=min(1.0,0.82*32767/np.max(np.abs(samples)))
    pcm=np.rint(samples*gain).astype('<i2').tobytes()
    encoder=lameenc.Encoder();encoder.set_bit_rate(64);encoder.set_in_sample_rate(rate);encoder.set_channels(1);encoder.set_quality(2)
    data=bytes(encoder.encode(pcm))+bytes(encoder.flush())
    digest=hashlib.sha256(data).hexdigest();dest=out/(digest+'.mp3')
    if not dest.exists():dest.write_bytes(data)
    elif hashlib.sha256(dest.read_bytes()).hexdigest()!=digest:raise ValueError('Existing asset mismatch')
    manifest['entries'][text]={'url':'/audio/pronunciation/'+dest.name,'sha256':digest,'textSha256':hashlib.sha256(text.encode()).hexdigest(),'sourceDuration':len(samples)/rate,'sampleRate':rate,'gain':round(gain,6)}
    if (i+1)%50==0:
        target.write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
        print(str(i+1)+' / '+str(len(source['texts']))+' public texts ready',flush=True)
target.write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
print(str(len(manifest['entries']))+' public texts complete. Private data and original assets preserved.',flush=True)
