import original from "../../data/courses/audio.json" with { type: "json" };
import additional from "../../data/courses/extra-audio.json" with { type: "json" };
export type CourseAudioAsset = {
  url: string;
  duration: number;
  sha256: string;
  textSha256?: string;
};
// Original IDs and WAVs remain authoritative. New recordings are generated offline.
export const courseAudio: Record<string, CourseAudioAsset> = {
  ...additional.examples,
  ...original,
};
