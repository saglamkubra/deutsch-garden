"""Generate ORIGINAL German listening/word audio offline. No cloud API or runtime dependency."""
from pathlib import Path
import sys, json, wave, io, hashlib, os
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".cache" / "listening-tts"))
from piper import PiperVoice, SynthesisConfig
MODEL = ROOT / ".cache/listening-model/de_DE-thorsten-medium.onnx"
os.chdir(ROOT)
# Relative ASCII path avoids espeak's narrow Windows path handling under Unicode usernames.
voice = PiperVoice.load(str(MODEL), espeak_data_dir=".cache/listening-tts/piper/espeak-ng-data")
config = SynthesisConfig(length_scale=1.12)
cache = ROOT / ".cache/listening-build"
out = ROOT / "public/audio/deutsch-garden"
cache.mkdir(parents=True, exist_ok=True)
out.mkdir(parents=True, exist_ok=True)
episodes = json.loads((ROOT / "src/data/listening/episodes.json").read_text(encoding="utf-8"))
words = json.loads((ROOT / "src/data/vocabulary.json").read_text(encoding="utf-8"))
def synth(text):
    key = hashlib.sha256((text + "|thorsten-medium|1.12").encode()).hexdigest()
    path = cache / (key + ".wav")
    if not path.exists() or path.stat().st_size < 44:
        with wave.open(str(path), "wb") as wav:
            voice.synthesize_wav(text, wav, syn_config=config)
    with wave.open(str(path), "rb") as wav:
        assert wav.getnchannels() == 1 and wav.getsampwidth() == 2
        return wav.getframerate(), wav.readframes(wav.getnframes())
manifest = {"version":1, "voice":"Piper · Thorsten (Almanca)", "engine":"piper-tts 1.8.0", "modelSha256":hashlib.sha256(MODEL.read_bytes()).hexdigest(), "modelSource":"https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD", "episodes":{}, "words":{}}
for ep in episodes:
    chunks, segments, cursor, rate = [], [], 0, 22050
    for sentence in ep["sentences"]:
        rate, pcm = synth(sentence["de"])
        pause = bytes(int(rate * 0.3) * 2)
        segments.append({"id":sentence["id"],"start":round(cursor / rate, 6),"end":round((cursor + len(pcm)//2) / rate, 6)})
        chunks.extend([pcm, pause])
        cursor += (len(pcm) + len(pause)) // 2
    path = out / (ep["id"] + ".wav")
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(rate); wav.writeframes(b"".join(chunks))
    manifest["episodes"][ep["id"]] = {"url":"/audio/deutsch-garden/"+path.name,"duration":round(cursor/rate,6),"sampleRate":rate,"sha256":hashlib.sha256(path.read_bytes()).hexdigest(),"segments":segments}
    print(ep["id"], round(cursor/rate,1), "sn", flush=True)
for word in words:
    text = " ".join(filter(None,[word["article"],word["german_word"]]))
    rate, pcm = synth(text)
    path = out / (word["id"] + ".wav")
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(rate); wav.writeframes(pcm)
    manifest["words"][word["id"]] = {"url":"/audio/deutsch-garden/"+path.name,"duration":round(len(pcm)/2/rate,6)}
(ROOT / "src/data/listening/audio-manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("Tamamlandı:",len(episodes),"bölüm,",len(words),"kelime.",flush=True)
