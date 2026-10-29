export const pack = (goal, task, rows) => ({
  goal,
  task,
  rows,
  labels: rows.map(
    (r) =>
      r[3] ?? `İfadeyi keşfet: ${r[0].match(/\{([^~]+)~/)?.[1] ?? "bağlam"}`,
  ),
});
