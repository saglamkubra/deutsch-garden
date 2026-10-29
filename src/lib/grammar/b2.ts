import { createGrammarTopics } from "./builder.ts";
import { b2First } from "./b2-first.ts";
import { b2Second } from "./b2-second.ts";
export const b2Specs = [...b2First, ...b2Second];
export const b2Topics = createGrammarTopics("B2", b2Specs);
