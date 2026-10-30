// Explicit operator build task: public plans only, bounded server-side Gemini use.
// Does not read user progress, diary entries, birthday letters, or conversations.
import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { validateStory } from "../src/lib/stories/graph.ts";
import vocabulary from "../src/data/vocabulary.json" with { type: "json" };
import originalGlossary from "../src/data/stories/glossary.json" with { type: "json" };
import extraGlossary from "../src/data/stories/extra-glossary.json" with { type: "json" };
import comedyGlossary from "../src/data/stories/comedy-glossary.json" with { type: "json" };
import worldGlossary from "../src/data/stories/world-glossary.json" with { type: "json" };
import type { Story } from "../src/lib/stories/types.ts";
const plans = JSON.parse(
  readFileSync("src/data/stories/library-plans.json", "utf8"),
) as {
  id: string;
  level: string;
  category: string;
  title: string;
  plot: string;
  art: string;
}[];
const key = process.env.GEMINI_API_KEY?.trim() ?? "",
  model = process.env.GEMINI_MODEL?.trim() ?? "";
if (!key || !model)
  throw Error(
    "GEMINI_API_KEY / GEMINI_MODEL required in server environment; no values printed.",
  );
const client = new GoogleGenAI({
  apiKey: key,
  httpOptions: { timeout: 120000, retryOptions: { attempts: 1 } },
});
const directory = ".cache/story-library-drafts";
mkdirSync(directory, { recursive: true });
const ids = [
  "start",
  "path-a",
  "path-b",
  "end-a1",
  "end-a2",
  "end-b1",
  "end-b2",
];
const string = { type: "string" },
  pair = {
    type: "object",
    properties: { de: string, tr: string },
    required: ["de", "tr"],
    additionalProperties: false,
  };
const focusSchema = {
  type: "object",
  properties: {
    word: string,
    form: string,
    article: { type: "string", enum: ["der", "die", "das"] },
    meaning: string,
    plural: string,
    de: string,
    tr: string,
  },
  required: ["word", "form", "article", "meaning", "plural", "de", "tr"],
  additionalProperties: false,
};
const schema = {
  type: "object",
  properties: {
    germanTitle: string,
    description: string,
    scenes: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        properties: {
          id: { type: "string", enum: ids },
          title: string,
          lines: { type: "array", minItems: 4, maxItems: 4, items: pair },
          choices: { type: "array", minItems: 0, maxItems: 2, items: pair },
          ending: string,
          focus: focusSchema,
          question: {
            type: "object",
            properties: {
              prompt: string,
              options: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: string,
              },
              correctIndex: { type: "integer", minimum: 0, maximum: 2 },
              explanation: string,
            },
            required: ["prompt", "options", "correctIndex", "explanation"],
            additionalProperties: false,
          },
        },
        required: [
          "id",
          "title",
          "lines",
          "choices",
          "ending",
          "question",
          "focus",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["germanTitle", "description", "scenes"],
  additionalProperties: false,
};
type Focus = {
  word: string;
  form?: string;
  article: string;
  meaning: string;
  plural: string;
  de: string;
  tr: string;
};
type Draft = {
  germanTitle: string;
  description: string;
  scenes: {
    id: string;
    title: string;
    lines: { de: string; tr: string }[];
    choices: { de: string; tr: string }[];
    ending: string;
    focus?: Focus;
    question: {
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  }[];
  glossary?: Focus[];
};
function convert(plan: (typeof plans)[number], d: Draft) {
  const candidates = [
    ...d.scenes.map((n) => n.focus).filter((f): f is Focus => !!f),
    ...(d.glossary ?? []),
    ...originalGlossary,
    ...extraGlossary,
    ...comedyGlossary,
    ...worldGlossary,
    ...vocabulary
      .filter((w) => w.word_type === "noun")
      .map((w) => ({
        word: w.german_word,
        article: w.article ?? "",
        plural: w.plural_form ?? "",
        meaning: w.turkish_meaning,
        de: w.example_sentence_de,
        tr: w.example_sentence_tr,
      })),
  ] as Focus[];
  const glossary: (Focus & {
    id: string;
    repository: boolean;
    forms?: string[];
  })[] = [];
  if (d.glossary)
    glossary.push(
      ...d.glossary.map((w, i) => ({
        ...w,
        id: plan.id + ":word-" + (i + 1),
        repository: false,
      })),
    );
  const scenes = ids.map((id, i) => {
    const n = d.scenes.find((s) => s.id === id);
    if (!n) throw Error("Missing scene " + id);
    const targets =
      i === 0
        ? ["path-a", "path-b"]
        : i === 1
          ? ["end-a1", "end-a2"]
          : i === 2
            ? ["end-b1", "end-b2"]
            : [];
    const lines = n.lines.map((l) => ({ de: l.de.trim(), tr: l.tr.trim() }));
    let words: string[];
    if (n.focus) {
      const tokens = lines.flatMap((l) => l.de.split(/[^\p{L}’-]+/u));
      const match = (f: Focus) =>
        [f.form, f.word, f.plural]
          .filter((x): x is string => !!x)
          .map((form) =>
            tokens.find(
              (t) => t.toLocaleLowerCase("de") === form.toLocaleLowerCase("de"),
            ),
          )
          .find(Boolean);
      let focus = n.focus,
        form = match(focus);
      if (!form) {
        const alternative = candidates.find(
          (c) => /^[\p{L}’-]+$/u.test(c.word) && match(c),
        );
        if (alternative) {
          focus = alternative;
          form = match(focus);
        }
      }
      if (!form || !/^[\p{L}’-]+$/u.test(focus.word))
        throw Error(plan.id + ": focus form must be an exact word from " + id);
      const word = {
        ...focus,
        form,
        id: plan.id + ":" + id + ":word",
        repository: false,
        forms: [form],
      };
      glossary.push(word);
      words = [word.id];
    } else
      words = glossary
        .filter((w) =>
          lines.some((l) =>
            l.de
              .split(/[^\p{L}]+/u)
              .some(
                (token) =>
                  token.toLocaleLowerCase("de") ===
                  w.word.toLocaleLowerCase("de"),
              ),
          ),
        )
        .map((w) => w.word);
    return {
      id,
      title: n.title,
      art: plan.art,
      lines,
      words,
      choices: n.choices.map((c, j) => ({
        id: id + "-" + (j + 1),
        de: c.de,
        tr: c.tr,
        to: targets[j],
      })),
      ...(i > 2 ? { ending: n.ending } : {}),
      question: {
        prompt: n.question.prompt,
        options: n.question.options,
        correct: n.question.options[n.question.correctIndex],
        explanation: n.question.explanation,
      },
    };
  });
  const story = {
    id: plan.id,
    title: plan.title,
    germanTitle: d.germanTitle,
    level: plan.level,
    category: plan.category,
    description: d.description,
    art: plan.art,
    minutes: plan.level === "A1" ? 8 : plan.level === "A2" ? 9 : 12,
    start: "start",
    scenes,
  } as Story;
  const errors = validateStory(story);
  const minAverage = (
    { A1: 6, A2: 8, B1: 10, B2: 12, C1: 15, C2: 18 } as Record<string, number>
  )[plan.level];
  if (glossary.length < 2) errors.push("Glossary required");
  for (const n of scenes) {
    if (
      n.lines.length !== 4 ||
      n.lines.some(
        (l) =>
          l.de.length < 20 ||
          l.tr.length < 20 ||
          l.de === l.tr ||
          l.de.length > 650 ||
          l.tr.length > 850,
      )
    )
      errors.push("Four substantial bilingual lines required in " + n.id);
    if (
      n.lines.reduce((a, l) => a + l.de.split(/\s+/).length, 0) / 4 <
      minAverage
    )
      errors.push("Language too short for level in " + n.id);
    if (!n.words.length)
      errors.push("A clickable vocabulary word must appear in " + n.id);
    if (n.question.explanation.length < 75)
      errors.push("Turkish teaching explanation too short in " + n.id);
    if (n.ending !== undefined && !n.ending.trim())
      errors.push("Ending label missing in " + n.id);
    const excerpts = [
      ...n.question.explanation.matchAll(/[“„«"]([^”"“„»]+)[”"“»]/g),
    ].map((m) => m[1].replace(/[.!?]+$/u, ""));
    if (
      !excerpts.some(
        (e) => e.length >= 4 && n.lines.some((l) => l.de.includes(e)),
      )
    )
      errors.push(
        "Explanation must quote exact German evidence from its own scene in " +
          n.id,
      );
  }
  if (/<\/?(?:script|iframe|a|img)\b/i.test(JSON.stringify(d)))
    errors.push("HTML is forbidden");
  if (errors.length) throw Error([...new Set(errors)].join("; "));
  return { story, glossary };
}
const language: Record<string, string> = {
  A1: "Very simple present-tense German. 7-16 words per line, mostly main clauses; familiar everyday vocabulary. Avoid subordinate clauses, literary idioms and complex past tenses.",
  A2: "Accessible A2 German. 12-24 words per line, simple Perfekt and common weil/dass clauses. Concrete events and short connected narration.",
  B1: "Connected B1 narration. 18-30 words per line; clear reasons, past experience and moderate subordinate clauses, no dense abstract prose.",
  B2: "B2 narrative with 24-38 words per line; contrast, plausible inference and varied connective clauses. Keep plot concrete and comprehensible.",
  C1: "C1 literary but readable narration, 30-46 words per line. Nuanced register, indirect speech, ambiguity and contrasting perspectives; avoid empty philosophizing.",
  C2: "Rich C2 German, 35-52 words per line. Precise idiomatic prose, subtext, pragmatic nuance and varied syntax. Still a coherent warm story, not an academic essay or repetitive corporate text.",
};
function prompt(plan: (typeof plans)[number], repair = "") {
  return `Write ONE original, family-friendly branching German learning story with faithful Turkish translations. This is public educational content, not private user text. All headings, descriptions, ending labels, quiz prompts/options/explanations and meanings must be natural Turkish. Every quiz prompt MUST be a complete Turkish question, NEVER a German sentence-completion exercise or a German question. Narration, choices, glossary lemma/example and German title are German. Never quote copyrighted works. No real personal data, violence, grief, sexual content, legal/medical advice, humiliation or supernatural factual claims. Fictional settings only.
Story plan: ${JSON.stringify(plan)}
Language target: ${language[plan.level]}
Fixed binary graph in EXACT scene order: start, path-a, path-b, end-a1, end-a2, end-b1, end-b2. start has TWO choices leading respectively to path-a/path-b. path-a has TWO choices to end-a1/end-a2; path-b to end-b1/end-b2. Ending scenes have NO choices and a unique meaningful Turkish ending label. Non-ending ending field is empty string. Each scene has FOUR substantial de/tr paragraph pairs. The root establishes an engaging situation; middle scenes develop distinct information and a real second decision. Each of four endings must have its own events and consequences consistent with what was read on that path. Explicitly verify that EACH German/Turkish choice actually leads to what its target scene describes (same place, agreed plan and participants). Never choose a restaurant and then silently narrate a home visit. Check singular/plural subject-verb agreement and Turkish translations before output. Neither all-good/all-bad moralizing nor four cosmetically renamed identical endings. No clues or knowledge from unread branches. Do not make every ending a forced lesson about friendship.
Each scene has its own focus vocabulary object. Choose ONE useful SINGLE-WORD German NOUN occurring naturally in THAT scene. word is the dictionary lemma, form is the EXACT single word spelling that appears in that scene (inflected or plural allowed), article is the singular noun's article, meaning is its contextually correct Turkish meaning, plural is the plural noun form (empty for mass nouns), de/tr is a bilingual example. Do not force the same word into unrelated endings. Use at least three different vocabulary lemmas across the story. A compound is a separate word, not a match for a shorter lemma. Both lemma and form must contain letters only (hyphens allowed).
Each scene needs ONE nontrivial comprehension/inference question based ONLY on its own four lines. Exactly THREE plausible distinct Turkish options and correctIndex 0,1,2. The Turkish explanation must be at least 90 characters, teach why the correct answer follows, and quote an EXACT short German excerpt from that scene in curly quotes “...”. Avoid ambiguous answers and questions about a learner's moral worth or German pronunciation scores. A1 questions should be factual, higher-level ones can use inference explicitly supported by the scene.
Provide a concise Turkish description explaining the plot and language practice. No markdown or commentary outside the required JSON. Review German grammar and Turkish meaning before responding.
${repair ? "A previous draft failed these checks. Correct them while preserving this plan: " + repair : ""}`;
}
const budgetPath = directory + "/budget.json";
const initialBudget = existsSync(budgetPath)
  ? JSON.parse(readFileSync(budgetPath, "utf8"))
  : existsSync(directory + "/usage.json")
    ? JSON.parse(readFileSync(directory + "/usage.json", "utf8"))
    : {};
let calls = initialBudget.requestsTotal ?? initialBudget.requestsThisRun ?? 0,
  inputTokens = initialBudget.inputTokens ?? 0,
  outputTokens = initialBudget.outputTokens ?? 0,
  extra =
    initialBudget.repairsTotal ?? initialBudget.repairRequestsThisRun ?? 0,
  next = 0,
  stopped = false,
  lastStart = 0;
const startCalls = calls,
  startRepairs = extra;
const saveBudget = () =>
  writeFileSync(
    budgetPath,
    JSON.stringify({
      requestsTotal: calls,
      repairsTotal: extra,
      inputTokens,
      outputTokens,
    }),
  );
saveBudget();
let gate = Promise.resolve();
async function pace() {
  const previous = gate;
  let release!: () => void;
  gate = new Promise((r) => (release = r));
  await previous;
  try {
    await new Promise((r) =>
      setTimeout(r, Math.max(0, 8000 - (Date.now() - lastStart))),
    );
    lastStart = Date.now();
  } finally {
    release();
  }
}
const assembleOnly = process.argv.includes("--assemble-only");
if (!assembleOnly) {
  try {
    const meta = await client.models.get({ model });
    if (!meta.supportedActions?.includes("generateContent"))
      throw Error("Unsupported model");
  } catch {
    throw Error(
      "Model availability could not be verified. Credentials and provider details omitted.",
    );
  }
}
for (const plan of plans) {
  const path = directory + "/" + plan.id + ".json",
    rejected = directory + "/" + plan.id + ".rejected.json";
  if (!existsSync(path) && existsSync(rejected)) {
    try {
      const { draft } = JSON.parse(readFileSync(rejected, "utf8"));
      const result = convert(plan, draft);
      writeFileSync(
        path,
        JSON.stringify({ model, draft, ...result }, null, 2) + "\n",
      );
      console.log("Revalidated public vocabulary forms: " + plan.id);
    } catch (error) {
      writeFileSync(
        directory + "/" + plan.id + ".validation.txt",
        error instanceof Error ? error.message : "Invalid draft",
      );
      console.log("Local review required: " + plan.id);
    }
  }
}
async function worker() {
  while (!stopped) {
    const plan = plans[next++];
    if (!plan) return;
    if (
      process.argv.includes("--skip-editorial") &&
      [
        "story-library-c1-reparierteuhr",
        "story-library-c2-reisefuehrer",
        "story-library-c2-stadtgespraech",
      ].includes(plan.id)
    )
      continue;
    const path = directory + "/" + plan.id + ".json";
    if (existsSync(path)) {
      try {
        const saved = JSON.parse(readFileSync(path, "utf8"));
        convert(plan, saved.draft);
        console.log("Preserved " + plan.id);
        continue;
      } catch {
        /* Revalidate invalid public drafts; never alter existing learner data. */
      }
    }
    let reason = "";
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt) {
        if (extra >= 8) {
          break;
        }
        extra++;
      }
      if (calls >= 46) {
        stopped = true;
        break;
      }
      await pace();
      // Check again after the shared pacing gate: another worker may have
      // consumed the final request while this one was waiting.
      if (stopped || calls >= 46) {
        stopped = true;
        return;
      }
      calls++;
      saveBudget();
      let reviewDraft: unknown;
      try {
        const response = await client.models.generateContent({
          model,
          contents: prompt(plan, reason),
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: schema,
            maxOutputTokens: 18000,
            temperature: 0.65,
          },
        });
        inputTokens += response.usageMetadata?.promptTokenCount ?? 0;
        outputTokens += response.usageMetadata?.candidatesTokenCount ?? 0;
        if (!response.text) throw Error("Empty or refused provider response");
        writeFileSync(
          directory + "/" + plan.id + ".response.txt",
          response.text,
        );
        const draft = JSON.parse(response.text) as Draft;
        reviewDraft = draft;
        saveBudget();
        const result = convert(plan, draft);
        writeFileSync(
          path,
          JSON.stringify({ model, draft, ...result }, null, 2) + "\n",
        );
        console.log(
          "Validated " +
            plan.id +
            " (" +
            plans.filter((p) => existsSync(directory + "/" + p.id + ".json"))
              .length +
            "/38)",
        );
        break;
      } catch (error) {
        const status =
          typeof error === "object" && error !== null && "status" in error
            ? Number(error.status)
            : 0;
        if (status) {
          console.log(
            "Provider failure HTTP " +
              status +
              "; saved drafts preserved. No automatic provider retry.",
          );
          stopped = true;
          break;
        }
        if (reviewDraft)
          writeFileSync(
            directory + "/" + plan.id + ".rejected.json",
            JSON.stringify({ draft: reviewDraft }, null, 2),
          );
        reason = error instanceof Error ? error.message : "Invalid draft";
        writeFileSync(directory + "/" + plan.id + ".validation.txt", reason);
        console.log(
          "Draft validation failed: " +
            plan.id +
            "; bounded repair " +
            (attempt + 1),
        );
      }
    }
  }
}
if (!assembleOnly) await Promise.all([worker(), worker()]);
const results = plans
  .filter((p) => existsSync(directory + "/" + p.id + ".json"))
  .map((p) => {
    const saved = JSON.parse(
      readFileSync(directory + "/" + p.id + ".json", "utf8"),
    );
    return convert(p, saved.draft);
  });
const usage = {
  model,
  requestsThisRun: calls - startCalls,
  requestsTotal: calls,
  repairRequestsThisRun: extra - startRepairs,
  repairsTotal: extra,
  inputTokens,
  outputTokens,
  completed: results.length,
  planned: 38,
};
writeFileSync(directory + "/usage.json", JSON.stringify(usage, null, 2));
console.log(JSON.stringify(usage));
if (results.length !== 38) process.exitCode = 1;
else {
  writeFileSync(
    "src/data/stories/library-stories.json",
    JSON.stringify(
      results.map((r) => r.story),
      null,
      2,
    ) + "\n",
  );
  writeFileSync(
    "src/data/stories/library-glossary.json",
    JSON.stringify(
      results.flatMap((r) => r.glossary),
      null,
      2,
    ) + "\n",
  );
  writeFileSync(
    "reports/story-library-generation.json",
    JSON.stringify(
      {
        ...usage,
        provider: "Google Gemini",
        purpose: "public educational content drafts",
        humanEditorialApproval: false,
        aiAssistedStories: plans.filter(
          (p) =>
            JSON.parse(readFileSync(directory + "/" + p.id + ".json", "utf8"))
              .model !== "editorial-original",
        ).length,
        editorialOriginalStories: plans.filter(
          (p) =>
            JSON.parse(readFileSync(directory + "/" + p.id + ".json", "utf8"))
              .model === "editorial-original",
        ).length,
        sourceSha256: createHash("sha256")
          .update(JSON.stringify(results))
          .digest("hex"),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "38 public stories exported. Existing catalogs and all learner records preserved.",
  );
}
