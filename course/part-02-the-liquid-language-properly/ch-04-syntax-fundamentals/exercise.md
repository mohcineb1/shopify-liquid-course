<!-- STATUS: final -->
# Chapter 4 — Exercise

**Time:** 45–60 minutes · **Type:** syntax repair

## Goal

Turn a launch-quality placeholder into a merchant-visible syntax audit that renders dependable Liquid output, keeps its source readable, and preserves a browser-owned template literally where needed.

## Context

Northstar Tea is preparing a seasonal product launch. A previous contractor left the `syntax-audit` section in the dev theme as a visual shell with static copy, plus a separate client-side message template that must remain readable by the browser. The merchandising lead wants the panel completed before launch because recent changes have produced whitespace-heavy source, leaked a private implementation note into browser output, and broken a literal browser placeholder when Liquid tried to interpret it.

The completed panel is not a product card and it is not a client application. It is a small quality-check display on a product page. Its visible output should identify the current product, state whether the product is available, and present a short audit message selected from the product state. The source must also remain useful to the next developer who maintains the section: a temporary implementation note must not reach shoppers, and the reusable-file contract must be documented for tooling rather than hidden in browser output.

## Requirements

- [ ] Add the supplied section to a product template and preserve its existing heading setting, semantic shell, stylesheet include, and editor preset.
- [ ] Replace the static report placeholder with the current product’s title as safe text and an availability-specific audit message. The title and message are present in the initial HTML before browser JavaScript runs.
- [ ] Make the audit message result from Liquid control flow, not from a JavaScript-style expression placed into an output delimiter.
- [ ] Keep the Liquid preparation for the audit message readable as one compact, tag-only group; do not put HTML inside that group.
- [ ] Ensure the delivered report has no indentation-only blank line before or after the selected audit message. Preserve intentional spaces in buyer-facing prose.
- [ ] Add one author-only implementation note that does not appear in page source or the rendered storefront. It must explain a non-obvious maintenance decision rather than repeat a tag name.
- [ ] Add one short comment inside the multi-line Liquid preparation that clarifies why the current product context is used instead of a lookup.
- [ ] Include a literal browser-template placeholder in the report source that the browser receives unchanged. Liquid must not attempt to parse that placeholder as its own output syntax.
- [ ] Add non-rendered documentation to the section that identifies its purpose, its product-context expectation, and the merchant-controlled heading input. The documentation must not become storefront copy.
- [ ] Keep the component server-rendered: no browser fetch, app proxy, Storefront API, client framework, or package dependency.

## Constraints

Use only syntax covered in this chapter and earlier units. Do not replace the section with a snippet, add a second component file, or use `{% include %}`. Do not remove the existing heading setting merely to avoid describing it. Do not solve whitespace by minifying the whole file or by deleting all formatting; the source should remain legible while the relevant response boundary is clean.

Treat the literal browser placeholder as a syntax-preservation problem, not as dynamic customer data. Do not store merchant text in an HTML comment, and do not put private notes in a comment type that a buyer can inspect in page source. The supplied stylesheet is finished; do not rewrite it.

## Starter

Begin with these real theme files:

```text
starter/sections/syntax-audit.liquid  runnable section shell, schema, and placeholder report
starter/assets/syntax-audit.css        finished presentation; leave unchanged
```

Copy both files into a dev theme and add the section to a product template before changing its report content. The starter deliberately leaves the syntax choices, the source-only notes, the literal browser template, and the audit-message decision to you.

## Done when

On an available product and an unavailable product, the storefront shows the correct escaped product title and a different audit message in the initial response. Inspecting page source shows no private implementation note, no indentation-only blank line around the report message, and the literal browser placeholder exactly as required. The theme editor still exposes the existing heading setting, and the stylesheet remains the supplied one.

A reviewer can read the section source and distinguish value output from control flow, find a concise tag-only preparation group, find a non-rendered documentation block, and see that browser-template syntax was preserved without disabling unrelated Liquid output. Disabling JavaScript does not change the product title or audit message because both belong to the theme render.

## Stretch

Write a short source-only note describing how you would document a reusable snippet that receives both a product and a variant. State the contract you would record and one example call, but do not create the snippet or introduce a new implementation file.
