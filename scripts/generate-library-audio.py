"""Resumable offline audio for public validated story drafts/final catalog only.
No API keys, private learner data or external speech requests are used.
Run --watch-drafts to overlap local audio with bounded public draft generation.
"""
from pathlib import Path
import os,sys,json,hashlib,wave,time
ROOT=Path(__file__).resolve().parents[1]
os.chdir(ROOT)
sys.path[:0]=[str(ROOT/'.cache/comedy-audio-tools'),str(ROOT/'.cache/listening-tts')]
from piper import PiperVoice,SynthesisConfig
import lameenc
import numpy as np
model=ROOT/'.cache/listening-model/de_DE-thorsten-medium.onnx'
voice=PiperVoice.load(str(model),espeak_data_dir='.cache/listening-tts/piper/espeak-ng-data')
config=SynthesisConfig(length_scale=1.12)
cache=ROOT/'.cache/listening-build';cache.mkdir(parents=True,exist_ok=True)
progress=ROOT/'.cache/story-library-audio-progress';progress.mkdir(parents=True,exist_ok=True)
out=ROOT/'public/audio/stories-library';out.mkdir(parents=True,exist_ok=True)
plans=json.loads((ROOT/'src/data/stories/library-plans.json').read_text(encoding='utf-8'))
manifest={'version':1,'engine':'piper-tts 1.8.0','voice':'de_DE-thorsten-medium','encoder':'lameenc 1.8.1 / LAME 64kbps mono','modelSha256':hashlib.sha256(model.read_bytes()).hexdigest(),'scenes':{},'glossary':{}}

def duration_mp3(data):
    position,seconds=0,0
    while position<len(data):
        h=int.from_bytes(data[position:position+4],'big');version=(h>>19)&3
        if h>>21!=0x7ff or (h>>17)&3!=1 or version==1:raise ValueError('Invalid MP3 frame')
        rate=[44100,48000,32000][(h>>10)&3]//(1 if version==3 else 2 if version==2 else 4)
        rates=[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320] if version==3 else [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160]
        bitrate=rates[(h>>12)&15]*1000;size=(144 if version==3 else 72)*bitrate//rate+((h>>9)&1)
        if not bitrate or position+size>len(data):raise ValueError('Truncated MP3')
        position+=size;seconds+=(1152 if version==3 else 576)/rate
    return seconds

def pcm_for(text):
    key=hashlib.sha256((text+'|thorsten-medium|1.12').encode()).hexdigest();path=cache/(key+'.wav')
    if not path.exists():
        with wave.open(str(path),'wb') as f:voice.synthesize_wav(text,f,syn_config=config)
    with wave.open(str(path),'rb') as f:
        if f.getnchannels()!=1 or f.getsampwidth()!=2:raise ValueError('Invalid source PCM')
        return f.readframes(f.getnframes()),f.getframerate()

def asset(pcm,rate,text):
    samples=np.frombuffer(pcm,dtype='<i2').astype(np.float64)
    if not len(samples) or np.max(np.abs(samples))<10:raise ValueError('Silent source')
    gain=min(1.0,.82*32767/np.max(np.abs(samples)))
    pcm=np.rint(samples*gain).astype('<i2').tobytes()
    encoder=lameenc.Encoder();encoder.set_bit_rate(64);encoder.set_in_sample_rate(rate);encoder.set_channels(1);encoder.set_quality(2)
    data=bytes(encoder.encode(pcm))+bytes(encoder.flush());digest=hashlib.sha256(data).hexdigest();path=out/(digest+'.mp3')
    if not path.exists():path.write_bytes(data)
    elif hashlib.sha256(path.read_bytes()).hexdigest()!=digest:raise ValueError('Existing recording mismatch')
    return {'url':'/audio/stories-library/'+path.name,'duration':duration_mp3(data),'sha256':digest,'textSha256':hashlib.sha256(text.encode()).hexdigest(),'sampleRate':rate}

def source_for(plan):
    final=ROOT/'src/data/stories/library-stories.json'
    if final.exists():
        stories=json.loads(final.read_text(encoding='utf-8'));glossary=json.loads((ROOT/'src/data/stories/library-glossary.json').read_text(encoding='utf-8'))
        s=next((s for s in stories if s['id']==plan['id']),None)
        if s:return s,[w for w in glossary if w['id'].startswith(s['id']+':')]
    draft=ROOT/'.cache/story-library-drafts'/(plan['id']+'.json')
    if draft.exists():
        try:
            data=json.loads(draft.read_text(encoding='utf-8'))
            if data.get('story') and data.get('glossary'):return data['story'],data['glossary']
        except json.JSONDecodeError:pass
    return None

finished={};deadline=time.time()+1800
while len(finished)<len(plans):
    worked=False
    for plan in plans:
        source=source_for(plan)
        if not source:continue
        story,glossary=source
        fingerprint=hashlib.sha256(json.dumps([story,glossary],ensure_ascii=False,sort_keys=True).encode()).hexdigest()
        if finished.get(story['id'])==fingerprint:continue
        checkpoint=progress/(story['id']+'.json')
        saved=json.loads(checkpoint.read_text(encoding='utf-8')) if checkpoint.exists() else None
        if saved and saved.get('fingerprint')==fingerprint:
            scene_assets=saved['scenes'];word_assets=saved['glossary']
        else:
            scene_assets={};word_assets={}
            for scene in story['scenes']:
                chunks=[];lines=[]
                for line in scene['lines']:
                    pcm,rate=pcm_for(line['de']);lines.append(asset(pcm,rate,line['de']));chunks.extend([pcm,bytes(int(rate*.3)*2)])
                scene_assets[story['id']+':'+scene['id']]={'full':asset(b''.join(chunks),rate,'\n'.join(l['de'] for l in scene['lines'])),'lines':lines}
            for word in glossary:
                text=' '.join(filter(None,[word['article'],word['word']]))
                pcm,rate=pcm_for(text);word_assets[word['id']]=asset(pcm,rate,text)
            temp=checkpoint.with_suffix('.tmp');temp.write_text(json.dumps({'fingerprint':fingerprint,'scenes':scene_assets,'glossary':word_assets},ensure_ascii=False),encoding='utf-8');temp.replace(checkpoint)
        manifest['scenes'].update(scene_assets);manifest['glossary'].update(word_assets);finished[story['id']]=fingerprint;worked=True
        target=ROOT/'src/data/stories/library-audio.json';temp=target.with_suffix('.tmp');temp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');temp.replace(target)
        print(str(len(finished))+'/38 audio complete: '+story['id'],flush=True)
    if len(finished)==len(plans):break
    if '--watch-drafts' not in sys.argv or time.time()>deadline:
        print('Audio preparation incomplete; finished assets preserved. Run again after editorial validation.',flush=True);raise SystemExit(1)
    if not worked:time.sleep(8)
print('All 38 stories have complete scene, line and vocabulary audio. Originals preserved.',flush=True)
