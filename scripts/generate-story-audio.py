"""Build story scene and individual-line audio with the existing licensed Piper pipeline."""
from pathlib import Path
import os,sys,json,wave,hashlib
ROOT=Path(__file__).resolve().parents[1]
os.chdir(ROOT)
sys.path.insert(0,str(ROOT/'.cache/listening-tts'))
from piper import PiperVoice,SynthesisConfig
model=ROOT/'.cache/listening-model/de_DE-thorsten-medium.onnx'
voice=PiperVoice.load(str(model),espeak_data_dir='.cache/listening-tts/piper/espeak-ng-data')
config=SynthesisConfig(length_scale=1.12)
cache=ROOT/'.cache/listening-build';cache.mkdir(exist_ok=True,parents=True)
out=ROOT/'public/audio/stories';out.mkdir(exist_ok=True,parents=True)
manifest={'version':1,'engine':'piper-tts 1.8.0','voice':'de_DE-thorsten-medium','modelSha256':hashlib.sha256(model.read_bytes()).hexdigest(),'scenes':{}}
def write(path,pcm,rate):
    with wave.open(str(path),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(pcm)
    return {'url':'/audio/stories/'+path.name,'duration':len(pcm)/2/rate,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
for s in json.loads((ROOT/'src/data/stories/stories.json').read_text(encoding='utf-8')):
    for n in s['scenes']:
        chunks=[];lines=[]
        for i,line in enumerate(n['lines']):
            text=line['de'];key=hashlib.sha256((text+'|thorsten-medium|1.12').encode()).hexdigest();p=cache/(key+'.wav')
            if not p.exists() or p.stat().st_size<44:
                with wave.open(str(p),'wb') as f:voice.synthesize_wav(text,f,syn_config=config)
            with wave.open(str(p),'rb') as f:rate=f.getframerate();pcm=f.readframes(f.getnframes())
            lines.append(write(out/(s['id']+'-'+n['id']+'-'+str(i)+'.wav'),pcm,rate))
            chunks.extend([pcm,bytes(int(rate*.3)*2)])
        manifest['scenes'][s['id']+':'+n['id']]={'full':write(out/(s['id']+'-'+n['id']+'.wav'),b''.join(chunks),rate),'lines':lines}
    print(s['id'],'hazır',flush=True)
manifest['glossary']={}
for i,word in enumerate(json.loads((ROOT/'src/data/stories/glossary.json').read_text(encoding='utf-8'))):
    text=' '.join(filter(None,[word['article'],word['word']]))
    key=hashlib.sha256((text+'|thorsten-medium|1.12').encode()).hexdigest();p=cache/(key+'.wav')
    if not p.exists() or p.stat().st_size<44:
        with wave.open(str(p),'wb') as f:voice.synthesize_wav(text,f,syn_config=config)
    with wave.open(str(p),'rb') as f:rate=f.getframerate();pcm=f.readframes(f.getnframes())
    manifest['glossary'][word['id']]=write(out/('glossary-'+str(i+1)+'.wav'),pcm,rate)
(ROOT/'src/data/stories/audio.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
