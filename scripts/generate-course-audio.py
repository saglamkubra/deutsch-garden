"""Generate original example audio with the already prepared Step 7 Piper cache."""
from pathlib import Path
import os,sys,json,wave,hashlib
ROOT=Path(__file__).resolve().parents[1];os.chdir(ROOT)
sys.path.insert(0,str(ROOT/'.cache/listening-tts'))
from piper import PiperVoice,SynthesisConfig
voice=PiperVoice.load(str(ROOT/'.cache/listening-model/de_DE-thorsten-medium.onnx'),espeak_data_dir='.cache/listening-tts/piper/espeak-ng-data')
config=SynthesisConfig(length_scale=1.12)
cache=ROOT/'.cache/listening-build';out=ROOT/'public/audio/courses';out.mkdir(parents=True,exist_ok=True)
assets={}
for c in json.loads((ROOT/'src/data/courses/mini-courses.json').read_text(encoding='utf-8')):
 for e in c['examples']:
  key=hashlib.sha256((e['de']+'|thorsten-medium|1.12').encode()).hexdigest();p=cache/(key+'.wav')
  if not p.exists() or p.stat().st_size<44:
   with wave.open(str(p),'wb') as f:voice.synthesize_wav(e['de'],f,syn_config=config)
  data=p.read_bytes();dest=out/(e['id']+'.wav');dest.write_bytes(data)
  with wave.open(str(dest),'rb') as f:duration=f.getnframes()/f.getframerate()
  assets[e['id']]=dict(url='/audio/courses/'+dest.name,duration=duration,sha256=hashlib.sha256(data).hexdigest())
 print(c['id'],'sesleri hazır',flush=True)
(ROOT/'src/data/courses/audio.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
