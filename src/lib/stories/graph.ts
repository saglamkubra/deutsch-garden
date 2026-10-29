import type { Story } from "./types.ts";
export function validateStory(s: Story): string[] {
  const errors: string[] = [];
  const nodes = new Map(s.scenes.map((n) => [n.id, n]));
  if (nodes.size !== s.scenes.length) errors.push("Tekrarlanan sahne kimliği");
  if (!nodes.has(s.start)) errors.push("Geçersiz başlangıç");
  for (const n of s.scenes) {
    if (!n.lines.length || n.lines.some((l) => !l.de || !l.tr))
      errors.push("Eksik iki dilli metin: " + n.id);
    if (
      n.ending
        ? n.choices.length > 0
        : n.choices.length < 2 || n.choices.length > 3
    )
      errors.push("Geçersiz karar/son: " + n.id);
    if (new Set(n.choices.map((c) => c.id)).size !== n.choices.length)
      errors.push("Tekrarlanan seçim: " + n.id);
    if (new Set(n.choices.map((c) => c.to)).size !== n.choices.length)
      errors.push("Aynı hedefe sahte seçim: " + n.id);
    for (const c of n.choices)
      if (!nodes.has(c.to)) errors.push("Bozuk dal: " + n.id + " → " + c.to);
    if (
      !n.question.options.includes(n.question.correct) ||
      new Set(n.question.options).size !== n.question.options.length
    )
      errors.push("Geçersiz soru: " + n.id);
  }
  const visited = new Set<string>(),
    stack = new Set<string>();
  function walk(id: string) {
    if (stack.has(id)) {
      errors.push("Sonsuz döngü: " + id);
      return;
    }
    if (visited.has(id) || !nodes.has(id)) return;
    visited.add(id);
    stack.add(id);
    for (const c of nodes.get(id)!.choices) walk(c.to);
    stack.delete(id);
  }
  walk(s.start);
  for (const n of s.scenes)
    if (!visited.has(n.id)) errors.push("Ulaşılamayan sahne/son: " + n.id);
  if (s.scenes.filter((n) => n.ending && visited.has(n.id)).length < 2)
    errors.push("En az iki erişilebilir son gerekli");
  return errors;
}
export function validPath(s: Story, path: string[], choices: string[]) {
  if (
    !path.length ||
    path[0] !== s.start ||
    choices.length !== path.length - 1 ||
    new Set(path).size !== path.length
  )
    return false;
  return path.every(
    (id, i) =>
      s.scenes.some((n) => n.id === id) &&
      (i === 0 ||
        s.scenes
          .find((n) => n.id === path[i - 1])
          ?.choices.some((c) => c.id === choices[i - 1] && c.to === id)),
  );
}
export function longestRemaining(s: Story, id: string): number {
  const n = s.scenes.find((n) => n.id === id);
  return !n || !n.choices.length
    ? 0
    : 1 + Math.max(...n.choices.map((c) => longestRemaining(s, c.to)));
}
