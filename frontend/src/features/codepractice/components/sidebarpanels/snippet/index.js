import { HCJ_SNIPPETS } from "./hcj.snippets";
import { JAVA_SNIPPETS } from "./java.snippets";
import { PYTHON_SNIPPETS } from "./python.snippets";

export { PYTHON_SNIPPETS } from "./python.snippets";
export { JAVA_SNIPPETS } from "./java.snippets";
export { HCJ_SNIPPETS } from "./hcj.snippets";
export { SNIPPET_CATEGORIES } from "./snippet.types";

export const SNIPPETS_BY_LANGUAGE = {
  PYTHON: PYTHON_SNIPPETS,
  JAVA: JAVA_SNIPPETS,
  CSS_HTML_JS: HCJ_SNIPPETS,
};
