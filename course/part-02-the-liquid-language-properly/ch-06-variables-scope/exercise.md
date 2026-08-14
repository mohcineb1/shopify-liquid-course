<!-- STATUS: draft -->
# Chapter 6 — Exercise

**Time:** 45–60 minutes · **Type:** component-boundary repair

## Goal

Complete a product-page release brief that passes only explicit values into a reusable release-check component, keeps display markup separate from data preparation, and produces stable ordered checks without relying on hidden global state.

## Context

Northstar Tea’s release coordinator needs a compact panel on selected product pages. The panel should name the current product, identify the audience configured by the merchant, and list a small ordered set of release checks. A previous developer copied values directly into several places, assumed a snippet could read local section variables without arguments, and mixed a rendered label with a numeric counter. The result worked in one product section but failed when the team reused the snippet during an editor preview.

The coordinator does not need an application or client-side state. They need the theme to render the same dependable summary before JavaScript runs, with each check receiving only the value it needs. The implementation must make it obvious where the current product, merchant-controlled audience label, and numbered check are owned. A later team should be able to reuse the check component without depending on a caller’s incidental variable names.

## Requirements

- [ ] Add the supplied section to a product template and preserve its heading and audience-label settings, semantic shell, stylesheet include, list markup, and editor preset.
- [ ] Replace the summary placeholder with the current product title and configured audience label as safe text in the initial theme response.
- [ ] Render at least three release checks through the supplied reusable component. Each check receives its required values explicitly at the file boundary and may not depend on an unpassed section-local value.
- [ ] The visible checks have a stable human-readable ordinal and a distinct release-check message. Their number order is correct in storefront HTML and does not depend on browser JavaScript.
- [ ] Keep numeric work separate from its final display label. Do not capture a number as rendered markup merely to use it as an index later.
- [ ] Demonstrate one deliberate rendered-string value only where markup or assembled display text is genuinely the intended result. Its name must make that rendered role clear.
- [ ] Do not reuse `product`, `section`, `block`, or another context-root name for a different local meaning. Names identify the value’s source or role clearly enough for a reviewer to trace ownership.
- [ ] The snippet remains reusable from a different caller: no product lookup, app proxy, browser fetch, client framework, or hidden access to a parent assignment.
- [ ] Product titles and audience labels containing markup-like characters render as text rather than injected HTML.

## Constraints

Use only Liquid syntax and value behavior taught through Chapter 6. Do not change the supplied stylesheet. Do not solve the component boundary by copying the check markup three times into the section, and do not turn the snippet into a second section. A counter tag may be useful only if you can explain why its separate namespace is not being used as hidden data-sharing state.

The finished component must be meaningful when JavaScript is disabled. A snippet is not a way to mutate the caller: the caller owns source values and explicitly supplies the snippet contract. If a scope outcome depends on a Liquid nesting boundary you have not verified, record `> [VERIFY]` in learner notes and consult the tag reference rather than guessing.

## Starter

```text
starter/sections/release-brief.liquid  runnable section, settings, and placeholder regions
starter/snippets/release-check.liquid  reusable check boundary with no resolved inputs
starter/assets/release-brief.css       finished presentation; leave unchanged
```

Copy all three files into a development theme, add the section to a product template, and inspect the resulting HTML. The starter deliberately leaves data preparation, explicit render inputs, rendered-string construction, check messaging, and ordering to you.

## Done when

The panel’s product title and audience label appear as escaped text in page source. Three or more checks render in increasing order, each has its own message, and moving the snippet to another caller requires only explicitly named input values. Changing an audience label in the theme editor updates only the summary that owns it.

A reviewer can distinguish value preparation from markup construction, identify any deliberately captured rendered string by name, and point to each snippet argument at its render call. The final output has no browser-owned request and no dependence on an unseen parent variable.

## Stretch

Write a learner note proposing how a snippet could accept a product and a formatted display label without letting the formatted label replace the product object. State the argument names, the ownership of each value, and the test you would perform if the snippet rendered blank. Do not add another component or a hidden parent dependency.
