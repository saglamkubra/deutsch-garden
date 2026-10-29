import { createGrammarTopics } from "./builder.ts";
import { c1First } from "./c1-first.ts";
import { c1Second } from "./c1-second.ts";
import { c1Third } from "./c1-third.ts";

export const c1Specs = [...c1First, ...c1Second, ...c1Third];
export const c1Topics = createGrammarTopics("C1", c1Specs);
