export type RecognitionResultEvent = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: { isFinal: boolean; 0: { transcript: string } };
  };
};
export type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
export function recognitionConstructor() {
  if (typeof window === "undefined") return null;
  const w = window as typeof window & {
    SpeechRecognition?: new () => RecognitionLike;
    webkitSpeechRecognition?: new () => RecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
export const recognitionError = (code: string) =>
  code === "not-allowed" || code === "service-not-allowed"
    ? "Mikrofon izni verilmedi. Tarayıcı ayarından izin verebilir veya yazarak devam edebilirsin."
    : code === "audio-capture"
      ? "Mikrofon bulunamadı. Metin sohbetiyle devam edebilirsin."
      : code === "no-speech"
        ? "Konuşma duyulmadı. Yeniden deneyebilir veya yazabilirsin."
        : "Ses yazıya çevrilemedi. Metinle devam edebilirsin.";
export function recognizedText(e: RecognitionResultEvent) {
  let final = "",
    interim = "";
  for (let i = e.resultIndex; i < e.results.length; i++) {
    if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
    else interim += e.results[i][0].transcript + " ";
  }
  return { final: final.trim(), interim: interim.trim() };
}
