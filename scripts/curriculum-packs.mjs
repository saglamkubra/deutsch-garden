import { basicPacks } from "./curriculum-packs-basic.mjs";
import { b1Packs } from "./curriculum-packs-b1.mjs";
import { b2Packs } from "./curriculum-packs-b2.mjs";
import { c1Packs } from "./curriculum-packs-c1.mjs";
import { c2Packs } from "./curriculum-packs-c2.mjs";
export const packs = {
  ...basicPacks,
  ...b1Packs,
  ...b2Packs,
  ...c1Packs,
  ...c2Packs,
};
