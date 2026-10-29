import { createGrammarTopics } from "./builder.ts";
import { c2First } from "./c2-first.ts";
import { c2Second } from "./c2-second.ts";
import { c2Third } from "./c2-third.ts";

export const c2Specs = [...c2First, ...c2Second, ...c2Third];
export const c2Topics = createGrammarTopics("C2", c2Specs);
