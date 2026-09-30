import { readFileSync } from "node:fs";
import postcss, { type Declaration, type Rule } from "postcss";
import { describe, expect, it } from "vitest";

// CSS contract tests: PostCSS parses the real stylesheet without fetching its
// font imports or pretending to measure grid/flex layout in a DOM emulator.
const stylesheet = postcss.parse(
  readFileSync(new URL("./index.css", import.meta.url), "utf8"),
);

const layouts = [
  "intro-grid",
  "map-layout",
  "exchange-stage",
  "sound-grid",
  "performer-grid",
  "costume-layout",
  "festival-grid",
  "why-content",
  "sources-grid",
] as const;

const childSelectors = layouts.map(layout => `.${layout} > *`);
/**
 * Normalizes a CSS selector for comparison by trimming surrounding
 * whitespace and collapsing the spacing around child combinators (`>`)
 * to a single consistent format.
 *
 * @param selector - The raw CSS selector string to normalize.
 * @returns The normalized selector string.
 */
const normalizeSelector = (selector: string) =>
  selector.trim().replace(/\s*>\s*/g, " > ");

/**
 * Finds every `min-width` declaration defined directly on rules in the
 * parsed stylesheet whose normalized selector list includes the given
 * selector. Only declarations that are direct children of a matching
 * rule are considered; nested descendant nodes are ignored.
 *
 * @param selector - The normalized selector to match against each rule's
 * selectors.
 * @returns An array of objects pairing the matching rule with its
 * `min-width` declaration.
 */
function minimumWidthsFor(selector: string) {
  const matches: { rule: Rule; declaration: Declaration }[] = [];

  stylesheet.walkRules(rule => {
    if (!rule.selectors.map(normalizeSelector).includes(selector)) return;

    // Only inspect this rule's declarations, not any nested descendants.
    for (const node of rule.nodes) {
      if (node.type === "decl" && node.prop === "min-width") {
        matches.push({ rule, declaration: node });
      }
    }
  });

  return matches;
}

describe("layout child shrinkability", () => {
  describe.each(layouts)(".%s", layout => {
    const selector = `.${layout} > *`;

    it("removes the automatic minimum width for every direct child", () => {
      const declarations = minimumWidthsFor(selector);

      expect(declarations.length).toBeGreaterThan(0);
      for (const { declaration } of declarations) {
        // Accept equivalent zero lengths while rejecting auto, min-content,
        // and positive minimums, including later breakpoint overrides.
        expect(declaration.value).toMatch(/^0(?:px|rem|em|%)?$/);
      }
    });

    it("keeps the safeguard available outside media queries and UI states", () => {
      const declarations = minimumWidthsFor(selector);

      // A mobile-only fix leaves desktop columns vulnerable (and vice versa).
      // A root rule also excludes accidental @supports or nested-state gates.
      expect(declarations.some(({ rule }) => rule.parent === stylesheet)).toBe(
        true,
      );
    });
  });

  it("scopes the safeguard to the intended layout children", () => {
    const safeguardRules = new Set(
      childSelectors.flatMap(selector =>
        minimumWidthsFor(selector).map(({ rule }) => rule),
      ),
    );

    expect(safeguardRules.size).toBeGreaterThan(0);
    for (const rule of safeguardRules) {
      for (const selector of rule.selectors.map(normalizeSelector)) {
        // Do not reset the container itself, all descendants, or unrelated
        // layouts when extending the shared selector list.
        expect(childSelectors).toContain(selector);
      }
    }
  });
});
