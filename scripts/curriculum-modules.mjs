import { basicModules } from "./curriculum-modules-basic.mjs";
import { middleModules } from "./curriculum-modules-middle.mjs";
import { advancedModules } from "./curriculum-modules-advanced.mjs";
export const modules = {
  ...basicModules,
  ...middleModules,
  ...advancedModules,
};
