export const REWARDS = {
  lumi: { practiceXp: 15, practiceCoins: 10 },
  courses: { lessonXp: 20, lessonCoins: 10 },
  stories: { storyXp: 20, endingCoins: 10, quizPass: 80 },
  listening: {
    episodeXp: 15,
    episodeCoins: 10,
    seedInterval: 3,
    coverage: 0.9,
  },
  grammar: { topicXp: 15, topicCoins: 10, seedInterval: 5 },
  correctXp: 5,
  completionCoins: 10,
  perfectSeed: "lavender",
} as const;

export const XP_LIMITS = {
  vocabularyPerDay: 20,
  vocabularyXp: 5,
  exerciseXpPerDay: 100,
} as const;
export function totalXp(ledger: Record<string, number>) {
  return Object.values(ledger).reduce((n, x) => n + x, 0);
}
export function validXpReceipt(id: string, amount: number) {
  return (
    (amount === 5 &&
      !id.startsWith("vocabulary:") &&
      !id.startsWith("gift:") &&
      !id.startsWith("diary:")) ||
    (/^vocabulary:\d{4}-\d{2}-\d{2}:.+/.test(id) &&
      amount === XP_LIMITS.vocabularyXp) ||
    (/^gift:daily:\d{4}-\d{2}-\d{2}$/.test(id) && amount === 10) ||
    ((id.startsWith("story:complete:") || id.startsWith("course:lesson:")) &&
      amount === REWARDS.stories.storyXp) ||
    ((id.startsWith("grammar:topic:") ||
      id.startsWith("listening:episode:") ||
      id.startsWith("lumi:daily:") ||
      /^diary:day:\d{4}-\d{2}-\d{2}$/.test(id)) &&
      amount === 15)
  );
}
