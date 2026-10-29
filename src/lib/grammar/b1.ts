import { createGrammarTopics } from "./builder.ts";
import { b1First } from "./b1-first.ts";
import { b1Second } from "./b1-second.ts";
export const b1Specs = [...b1First, ...b1Second];
export const b1Topics = createGrammarTopics("B1", b1Specs);
