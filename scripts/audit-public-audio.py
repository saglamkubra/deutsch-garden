"""Decode every public recording and validate all static manifest references.
Requires build-only miniaudio in .cache/audio-audit-tools; writes a public report.
No account, diary, birthday workshop, credentials or private backups are read.
"""
from pathlib import Path
import os,sys,json,hashlib,wave,math
ROOT=Path(__file__).resolve().parents[1]
os.chdir(ROOT)
sys.path[:0]=[str(ROOT/'.cache/audio-audit-tools'),str(ROOT/'.cache/listening-tts')]
import miniaudio
import numpy as np
references={}
def walk(obj):
    if isinstance(obj,dict):
        if isinstance(obj.get('url'),str) and obj['url'].startswith('/audio/'):
            references.setdefault(obj['url'],[]).append(obj)
        for value in obj.values():walk(value)
    elif isinstance(obj,list):
        for value in obj:walk(value)
for folder in ['courses','listening','stories','learning']:
    directory=ROOT/'src/data'/folder
    if not directory.exists():continue
    for path in directory.glob('*.json'):
        if 'audio' in path.name or 'recordings' in path.name:walk(json.loads(path.read_text(encoding='utf-8')))
failures=[];warnings=[];files=[]
for url,entries in references.items():
    path=ROOT/('public'+url)
    if not path.exists():failures.append({'url':url,'reason':'missing file'});continue
    actual=hashlib.sha256(path.read_bytes()).hexdigest()
    if any(a.get('sha256') and a['sha256']!=actual for a in entries):failures.append({'url':url,'reason':'manifest hash mismatch'})
for i,path in enumerate(sorted((ROOT/'public/audio').rglob('*'))):
    if path.suffix.lower() not in ('.wav','.mp3'):continue
    url='/'+path.relative_to(ROOT/'public').as_posix()
    try:
        decoded=miniaudio.decode(path.read_bytes(),output_format=miniaudio.SampleFormat.SIGNED16,nchannels=1,sample_rate=22050)
        samples=np.array(decoded.samples,dtype=np.float64)
        if not len(samples):raise ValueError('empty decoded stream')
        absolute=np.abs(samples);peak=float(np.max(absolute));rms=float(np.sqrt(np.mean(samples*samples)))
        duration=len(samples)/22050;clipped=float(np.mean(absolute>=32760))
        row={'url':url,'seconds':round(duration,4),'peak':int(peak),'rmsDb':round(20*math.log10(max(rms,1)/32768),2),'clippedFraction':round(clipped,8),'bytes':path.stat().st_size}
        files.append(row)
        if peak<10:failures.append({'url':url,'reason':'silent recording'})
        if clipped>0.001:warnings.append({'url':url,'reason':'clipping above 0.1 percent','fraction':clipped})
        if rms>0 and row['rmsDb']<-42:warnings.append({'url':url,'reason':'very quiet recording','rmsDb':row['rmsDb']})
        for entry in references.get(url,[]):
            expected=entry.get('duration')
            if expected and abs(float(expected)-duration)>0.35:failures.append({'url':url,'reason':'duration mismatch','expected':expected,'decoded':round(duration,4)})
    except Exception as exc:failures.append({'url':url,'reason':'decode failed: '+type(exc).__name__})
report={'version':1,'method':'miniaudio decode to 22050Hz mono PCM; SHA-256; silence/clipping/level checks. Not a human listening review.','filesChecked':len(files),'referencedUrls':len(references),'totalSeconds':round(sum(r['seconds'] for r in files),2),'failureCount':len(failures),'warningCount':len(warnings),'failures':failures,'warnings':warnings,'files':files}
(ROOT/'reports/audio-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:report[k] for k in ['filesChecked','referencedUrls','totalSeconds','failureCount','warningCount']}),flush=True)
if failures:raise SystemExit(1)
