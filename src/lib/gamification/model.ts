import type { ExerciseState } from "../exercises/types.ts";
import type { LearningState } from "../learning/types.ts";
import type { GrammarState } from "../grammar/types.ts";
import type { ListeningState } from "../listening/types.ts";
import type { StoryState } from "../stories/types.ts";
import type { CourseState } from "../courses/types.ts";
import type { LumiState } from "../lumi/model.ts";
import {
  growth,
  type GardenState,
  type GardenReward,
} from "../garden/model.ts";
import { localDate } from "../learning/engine.ts";
import { totalXp, XP_LIMITS } from "./rewards.ts";
export type Kind =
  | "word"
  | "exercise"
  | "grammar"
  | "listening"
  | "story"
  | "course"
  | "conversation"
  | "bloom"
  | "diary";
export type Activity = {
  id: string;
  kind: Kind;
  day: string;
  at: number | null;
  word?: string;
  session?: boolean;
  perfect?: boolean;
};
export type Mission = {
  id: string;
  kind: Kind;
  title: string;
  target: number;
  href: string;
  words?: string[];
  completedAt: number | null;
};
export type GameState = {
  version: 1;
  celebrated?: string[];
  startedOn: string;
  events: Record<string, Activity>;
  badges: Record<string, { earnedOn: string; claimed: boolean }>;
  days: Record<string, { level: string; missions: Mission[] }>;
};
export type Sources = {
  learning?: LearningState;
  exercises: ExerciseState;
  grammar?: GrammarState;
  listening?: ListeningState;
  stories?: StoryState;
  courses?: CourseState;
  lumi?: LumiState;
  garden?: GardenState;
};
export type Availability = {
  words: number;
  wordIds?: string[];
  listening: boolean;
  exercise: boolean;
  grammar: boolean;
  story: boolean;
};
export const GAME_LEVELS = [
  { title: "Tohum Kaşifi", xp: 0, icon: "🌱" },
  { title: "Küçük Filiz", xp: 100, icon: "🌿" },
  { title: "Çiçek Dostu", xp: 300, icon: "🌸" },
  { title: "Bahçe Koruyucusu", xp: 700, icon: "🦋" },
  { title: "Dil Kaşifi", xp: 1400, icon: "🌳" },
  { title: "Almanca Ustası", xp: 2500, icon: "👑" },
] as const;
export function gameLevel(xp: number) {
  const index = GAME_LEVELS.findLastIndex((l) => xp >= l.xp),
    current = GAME_LEVELS[Math.max(0, index)],
    next = GAME_LEVELS[index + 1];
  return {
    ...current,
    number: index + 1,
    next,
    percent: next
      ? Math.min(100, ((xp - current.xp) / (next.xp - current.xp)) * 100)
      : 100,
  };
}
export const BADGES = [
  {
    id: "first-vocabulary",
    name: "İlk Kelime Çiçeğim",
    description: "Bir günlük kelime listesini veya mini dersi tamamla.",
    icon: "📚",
    tone: "pink",
    reward: "2 papatya tohumu",
  },
  {
    id: "first-perfect",
    name: "Pırıl Pırıl Quiz",
    description:
      "En az 3 soruluk bir alıştırmayı ilk yanıtlarınla hatasız tamamla.",
    icon: "⭐",
    tone: "yellow",
    reward: "1 lavanta tohumu",
  },
  {
    id: "first-grammar",
    name: "Kuralların Dostu",
    description: "İlk gramer konunu tamamla.",
    icon: "🪄",
    tone: "lavender",
    reward: "1 lale tohumu",
  },
  {
    id: "first-listening",
    name: "Almancaya Kulak Ver",
    description: "İlk dinleme etkinliğini tamamla.",
    icon: "🎧",
    tone: "sky",
    reward: "1 gül tohumu",
  },
  {
    id: "first-story",
    name: "Masal Yolcusu",
    description: "İlk hikâyenin bir sonuna ulaş.",
    icon: "📖",
    tone: "peach",
    reward: "1 ayçiçeği tohumu",
  },
  {
    id: "first-diary",
    name: "İlk Satırlarım",
    description:
      "İlk ödüle uygun günlük yazını hesabına kaydet ve günlük çalışma ödülünü doğrula.",
    icon: "💌",
    tone: "pink",
    reward: "1 lale tohumu",
  },
  {
    id: "first-conversation",
    name: "Lumi ile İlk Sohbet",
    description: "Lumi ile ödüle uygun gerçek bir konuşma oturumu tamamla.",
    icon: "💬",
    tone: "mint",
    reward: "Şeker Kelebeği süsü",
  },
  {
    id: "first-bloom",
    name: "İlk Çiçeğim Açtı",
    description: "Bahçende ilk çiçeğini büyüt.",
    icon: "🌷",
    tone: "pink",
    reward: "1 kiraz çiçeği tohumu",
  },
  {
    id: "words-100",
    name: "Yüz Kelimelik Bahçe",
    description: "100 farklı kelimeyle etkin çalışma yap.",
    icon: "🌺",
    tone: "peach",
    reward: "1 ay ışığı çiçeği tohumu",
  },
  {
    id: "sessions-10",
    name: "Küçük Adımlar, Büyük Bahçe",
    description: "10 öğrenme oturumunu tamamla.",
    icon: "🦋",
    tone: "lavender",
    reward: "Yıldız Feneri süsü",
  },
] as const;
export type BadgeId = (typeof BADGES)[number]["id"];
export function badgeReward(id: string): GardenReward | null {
  const seed: Record<string, NonNullable<GardenReward["seeds"]>> = {
    "first-vocabulary": { daisy: 2 },
    "first-perfect": { lavender: 1 },
    "first-grammar": { tulip: 1 },
    "first-diary": { tulip: 1 },
    "first-listening": { rose: 1 },
    "first-story": { sunflower: 1 },
    "first-bloom": { cherry: 1 },
    "words-100": { moonflower: 1 },
  };
  if (
    !Object.hasOwn(seed, id) &&
    !["first-conversation", "sessions-10"].includes(id)
  )
    return null;
  return {
    id: "achievement:" + id,
    source: "achievement",
    ...(seed[id]
      ? {
          seeds: seed[id],
          flowers: Object.keys(seed[id]) as NonNullable<
            GardenReward["flowers"]
          >,
        }
      : {
          decorations: [
            id === "first-conversation" ? "pink-butterfly" : "lantern",
          ],
        }),
  };
}
export function activities(s: Sources, now: number): Activity[] {
  const result: Activity[] = [];
  const add = (
    id: string,
    kind: Kind,
    at: number,
    extra: Partial<Activity> = {},
  ) => {
    if (Number.isFinite(at) && at >= 0 && at <= now)
      result.push({ id, kind, at, day: localDate(new Date(at)), ...extra });
  };
  for (const [id, xp] of Object.entries(s.exercises.xp))
    if (/^diary:day:\d{4}-\d{2}-\d{2}$/.test(id) && xp === 15)
      result.push({
        id,
        kind: "diary",
        day: id.slice(10),
        at: null,
        session: false,
      });
  const word = (id: string, day: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && day <= localDate(new Date(now)))
      result.push({
        id: `word:${day}:${id}`,
        kind: "word",
        day,
        at: null,
        word: id,
      });
  };
  for (const a of Object.values(s.learning?.assignments ?? {})) {
    for (const id of Object.keys(a.answers)) word(id, a.date);
    if (
      a.newIds.length + a.reviewIds.length > 0 &&
      Object.keys(a.answers).length === a.newIds.length + a.reviewIds.length
    )
      result.push({
        id: "vocabulary-session:" + a.id,
        kind: "course",
        day: a.date,
        at: null,
        session: true,
      });
  }
  for (const [id, p] of Object.entries(s.learning?.progress ?? {}))
    if (p.lastAnsweredOn) word(id, p.lastAnsweredOn);
  for (const session of Object.values(s.exercises.sessions)) {
    for (const [id, a] of Object.entries(session.answers))
      if (!a.skipped)
        for (const wordId of session.questions.find((q) => q.id === id)
          ?.wordIds ?? [])
          add(`exercise-word:${session.id}:${id}:${wordId}`, "word", a.at, {
            word: wordId,
          });
    if (
      session.completedAt !== null &&
      Object.values(session.answers).some((a) => !a.skipped)
    )
      add("exercise:" + session.id, "exercise", session.completedAt, {
        session: true,
        perfect:
          session.questions.length >= 3 &&
          Object.values(session.answers).every(
            (a) => a.correct && !a.skipped,
          ) &&
          !(session.attempts ?? []).some((a) => !a.correct),
      });
  }
  for (const [id, p] of Object.entries(s.grammar?.progress ?? {}))
    if (p.completedAt !== null)
      add("grammar:" + id, "grammar", p.completedAt, { session: true });
  for (const [id, p] of Object.entries(s.listening?.progress ?? {}))
    if (p.completedAt !== null)
      add("listening:" + id, "listening", p.completedAt, { session: true });
  for (const id of s.stories?.completed ?? []) {
    const runs = Object.values(s.stories?.runs ?? {})
      .filter((r) => r.storyId === id)
      .sort((a, b) => a.updatedAt - b.updatedAt);
    const at = runs[0]?.updatedAt;
    if (at !== undefined) add("story:" + id, "story", at, { session: true });
  }
  for (const [id, p] of Object.entries(s.courses?.progress ?? {}))
    if (p.completedAt !== null)
      add("course:" + id, "course", p.completedAt, { session: true });
  for (const claim of s.lumi?.claims ?? [])
    if (claim.delivered)
      result.push({
        id: claim.receipt.id,
        kind: "conversation",
        day: claim.receipt.date,
        at: null,
        session: true,
      });
  for (const p of s.garden?.plots ?? [])
    if (p.plant && growth(p.plant, now).stage === "bloom")
      add(
        "bloom:" + (p.plant.id ?? p.id + ":" + p.plant.plantedAt),
        "bloom",
        p.plant.bloomedAt ?? growth(p.plant, now).readyAt,
      );
  for (const [id, c] of Object.entries(s.garden?.collection ?? {}))
    if (c) add("collected:" + id, "bloom", c.firstHarvestedAt);
  return result;
}
export function missionPlan(
  s: Sources,
  available: Availability,
  today: string,
): Mission[] {
  const make = (
    id: string,
    kind: Kind,
    title: string,
    target: number,
    href: string,
    words?: string[],
  ): Mission => ({
    id,
    kind,
    title,
    target,
    href,
    completedAt: null,
    ...(words ? { words } : {}),
  });
  const missions: Mission[] = [];
  const target = Math.min(s.learning?.goal ?? 10, available.words);
  if (target > 0)
    missions.push(
      make(
        "words",
        "word",
        `${target} farklı kelimeyle çalış`,
        target,
        "/kelimelerim",
      ),
    );
  if (available.exercise)
    missions.push(
      make("exercise", "exercise", "Bir alıştırma tamamla", 1, "/alistirmalar"),
    );
  if (available.listening)
    missions.push(
      make(
        "listening",
        "listening",
        "Bir Almanca dinleme etkinliği tamamla",
        1,
        "/dinleme-kulubu",
      ),
    );
  else if (available.grammar)
    missions.push(
      make("grammar", "grammar", "Bir gramer konusu tamamla", 1, "/gramer"),
    );
  else if (available.story)
    missions.push(
      make("story", "story", "Bir hikâyenin sonuna ulaş", 1, "/hikayeler"),
    );
  const difficult = Object.entries(s.learning?.progress ?? {})
    .filter(
      ([id, p]) =>
        !p.known &&
        p.lastAnsweredOn !== today &&
        available.words > 0 &&
        (!available.wordIds || available.wordIds.includes(id)),
    )
    .map(([id]) => id);
  if (difficult.length)
    missions.push(
      make(
        "review",
        "word",
        "Zorlandığın kelimelere yeniden bak",
        Math.min(3, difficult.length),
        "/kelimelerim",
        difficult.slice(0, 20),
      ),
    );
  return missions;
}
export function missionProgress(m: Mission, events: Activity[], day: string) {
  const candidates = events.filter(
    (e) =>
      e.day === day &&
      e.kind === m.kind &&
      (!m.words || (e.word && m.words.includes(e.word))),
  );
  return Math.min(
    m.target,
    m.kind === "word"
      ? new Set(candidates.map((e) => e.word)).size
      : candidates.length,
  );
}
export function streak(events: Activity[], today: string) {
  const days = [
    ...new Set(events.filter((e) => e.kind !== "bloom").map((e) => e.day)),
  ]
    .filter((d) => d <= today)
    .sort();
  const previous = (date: string) => {
    const d = new Date(date + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  };
  let longest = 0,
    run = 0,
    last = "";
  for (const d of days) {
    run = last === previous(d) ? run + 1 : 1;
    longest = Math.max(longest, run);
    last = d;
  }
  let current = 0,
    cursor = days.includes(today) ? today : previous(today);
  while (days.includes(cursor)) {
    current++;
    cursor = previous(cursor);
  }
  return { current, longest, days, activeToday: days.includes(today) };
}
export function reconcile(
  s: Sources,
  available: Availability,
  now: number,
): ExerciseState {
  const today = localDate(new Date(now));
  const game: GameState = structuredClone(
    s.exercises.gamification ?? {
      version: 1,
      startedOn: today,
      events: {},
      badges: {},
      days: {},
    },
  );
  for (const e of activities(s, now))
    if (e.day <= today && !game.events[e.id]) game.events[e.id] = e;
  if (!game.days[today])
    game.days[today] = {
      level: s.learning?.level ?? "A1",
      missions: missionPlan(s, available, today),
    };
  const events = Object.values(game.events),
    xp = { ...s.exercises.xp };
  // Existing historical XP is immutable. New vocabulary credit starts on enrollment day.
  for (const day of [
    ...new Set(
      events
        .filter(
          (e) =>
            e.kind === "word" &&
            e.id.startsWith("word:") &&
            e.day >= game.startedOn,
        )
        .map((e) => e.day),
    ),
  ]) {
    const words = [
      ...new Set(
        events
          .filter(
            (e) =>
              e.kind === "word" && e.id.startsWith("word:") && e.day === day,
          )
          .map((e) => e.word!),
      ),
    ].sort();
    let count = Object.keys(xp).filter((id) =>
      id.startsWith("vocabulary:" + day + ":"),
    ).length;
    for (const id of words) {
      const receipt = `vocabulary:${day}:${id}`;
      if (!xp[receipt] && count < XP_LIMITS.vocabularyPerDay) {
        xp[receipt] = XP_LIMITS.vocabularyXp;
        count++;
      }
    }
  }
  for (const [day, record] of Object.entries(game.days))
    for (const m of record.missions)
      if (m.completedAt === null && missionProgress(m, events, day) >= m.target)
        m.completedAt = now;
  const sessions = events
    .filter((e) => e.session)
    .sort((a, b) => a.day.localeCompare(b.day));
  const earliest = (kind: Kind) =>
    events
      .filter((e) => e.kind === kind)
      .sort((a, b) => a.day.localeCompare(b.day))[0]?.day;
  const earned: Record<string, string | undefined> = {
    "first-vocabulary": sessions.find((e) => e.kind === "course")?.day,
    "first-perfect": events.find((e) => e.kind === "exercise" && e.perfect)
      ?.day,
    "first-grammar": earliest("grammar"),
    "first-listening": earliest("listening"),
    "first-story": earliest("story"),
    "first-diary": earliest("diary"),
    "first-conversation": earliest("conversation"),
    "first-bloom": earliest("bloom"),
    "words-100":
      new Set(events.filter((e) => e.word).map((e) => e.word)).size >= 100
        ? today
        : undefined,
    "sessions-10": sessions.length >= 10 ? sessions[9].day : undefined,
  };
  for (const [id, day] of Object.entries(earned))
    if (day && !game.badges[id])
      game.badges[id] = { earnedOn: day, claimed: false };
  const next = { ...s.exercises, xp, gamification: game };
  return JSON.stringify(next) === JSON.stringify(s.exercises)
    ? s.exercises
    : next;
}
export const earnedXp = (s: ExerciseState) => totalXp(s.xp);
export function validGame(v: unknown): v is GameState {
  try {
    const g = v as GameState,
      record = (x: unknown) =>
        !!x && typeof x === "object" && !Array.isArray(x),
      date = (x: unknown) =>
        typeof x === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(x) &&
        !Number.isNaN(Date.parse(x + "T12:00:00Z"));
    return (
      record(g) &&
      g.version === 1 &&
      (g.celebrated === undefined ||
        (Array.isArray(g.celebrated) &&
          g.celebrated.every(
            (id) => typeof id === "string" && BADGES.some((b) => b.id === id),
          ))) &&
      date(g.startedOn) &&
      record(g.events) &&
      record(g.badges) &&
      record(g.days) &&
      Object.entries(g.events).every(
        ([id, e]) =>
          record(e) &&
          id === e.id &&
          [
            "word",
            "exercise",
            "grammar",
            "listening",
            "story",
            "course",
            "conversation",
            "bloom",
            "diary",
          ].includes(e.kind) &&
          date(e.day) &&
          (e.at === null || (Number.isFinite(e.at) && e.at >= 0)) &&
          (e.word === undefined || typeof e.word === "string") &&
          (e.session === undefined || typeof e.session === "boolean") &&
          (e.perfect === undefined || typeof e.perfect === "boolean"),
      ) &&
      Object.entries(g.badges).every(
        ([id, b]) =>
          BADGES.some((a) => a.id === id) &&
          record(b) &&
          date(b.earnedOn) &&
          typeof b.claimed === "boolean",
      ) &&
      Object.entries(g.days).every(
        ([day, d]) =>
          date(day) &&
          record(d) &&
          ["A1", "A2", "B1", "B2", "C1", "C2"].includes(d.level) &&
          Array.isArray(d.missions) &&
          d.missions.length <= 4 &&
          new Set(d.missions.map((m) => m.id)).size === d.missions.length &&
          d.missions.every(
            (m) =>
              record(m) &&
              [
                "words",
                "exercise",
                "listening",
                "grammar",
                "story",
                "review",
              ].includes(m.id) &&
              ["word", "exercise", "listening", "grammar", "story"].includes(
                m.kind,
              ) &&
              typeof m.title === "string" &&
              Number.isInteger(m.target) &&
              m.target >= 1 &&
              m.target <= 20 &&
              [
                "/kelimelerim",
                "/alistirmalar",
                "/dinleme-kulubu",
                "/gramer",
                "/hikayeler",
              ].includes(m.href) &&
              (m.completedAt === null ||
                (Number.isFinite(m.completedAt) && m.completedAt >= 0)) &&
              (m.words === undefined ||
                (Array.isArray(m.words) &&
                  m.words.every((w) => typeof w === "string"))),
          ),
      )
    );
  } catch {
    return false;
  }
}
