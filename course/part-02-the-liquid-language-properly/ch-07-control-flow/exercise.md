<!-- STATUS: draft -->
# Chapter 7 — Exercise

**Time:** 45–60 minutes · **Type:** business-rule repair

## Goal

Complete a product-page campaign eligibility panel that applies merchant priority rules in the correct order, expresses grouped logic without unsupported parentheses, and gives a truthful fallback when a campaign notice is blank.

## Context

Northstar Tea is running a release campaign with three merchant-selected tones: standard, priority, and quiet. The merchandising team wants a product-page panel that tells a reviewer whether the current product is eligible for campaign promotion and which tone governs its message. A rushed earlier implementation put a compound condition on one line, added JavaScript-style parentheses, and showed a reassuring notice even when the product was unavailable. It also treated an empty merchant notice as evidence that no campaign state existed.

The release manager needs the theme response itself to express the correct priority. An unavailable product must never receive an eligible promotion message. An available product with the `seasonal` tag may be eligible, while a configured priority tone changes the presentation only after eligibility has been established. The panel must make its ordering inspectable to a reviewer who changes availability, tags, tone, and campaign notice in the editor.

## Requirements

- [ ] Add the supplied section to a product template and preserve its heading, campaign-tone setting, campaign-notice setting, semantic shell, stylesheet include, and editor preset.
- [ ] Replace the status placeholder with a server-rendered result that puts product availability ahead of every campaign presentation rule. An unavailable product receives a distinct non-eligible result regardless of tags or tone.
- [ ] An available product with the `seasonal` tag receives an eligible result. An available product without that tag receives a truthful non-eligible result.
- [ ] Apply the selected campaign tone only after eligibility has been decided. Standard and quiet may share an outcome where appropriate; priority remains distinguishable to the reviewer.
- [ ] Express eligibility and tone without parentheses. The source makes intended grouping obvious through branch structure or named intermediate decisions.
- [ ] Render the campaign notice as safe text when it contains usable content. When blank, show a purposeful fallback identifying the missing merchant configuration without changing product eligibility.
- [ ] Keep availability, tag membership, campaign tone, and notice presence as independent states. A change to one must not silently alter another’s outcome.
- [ ] Keep the component server-rendered. Do not use a browser fetch, app proxy, client framework, product lookup, or hidden DOM state to choose eligibility.
- [ ] Product titles and merchant campaign notices containing markup-like characters render as text, not injected HTML.

## Constraints

Use only Liquid behavior taught through Chapter 7. Do not modify the supplied stylesheet. Do not copy status markup into JavaScript or encode grouped logic in a parenthesized Liquid condition. A compact expression is not a success criterion; a reviewer must identify the outer prerequisite and dependent branch in the source.

Do not use the notice fallback to hide an invalid product property or missing snippet input. The fallback belongs to the merchant setting only. If an object-specific eligibility condition requires an unverified Shopify surface, record `> [VERIFY]` in learner notes and consult the relevant object reference rather than treating a text substring as a business classification.

## Starter

```text
starter/sections/release-eligibility.liquid  runnable section, campaign settings, and placeholder regions
starter/assets/release-eligibility.css       finished presentation; leave unchanged
```

Copy both files into a development theme, add the section to a product template, and test an unavailable product, an available seasonal product, an available untagged product, all three tone settings, and configured and blank notices. The starter leaves priority structure, intermediate decisions, output messages, and fallback ownership to you.

## Done when

Page source shows a distinct non-eligible result for unavailable products, an eligible result for available seasonal products, and a non-eligible result for available untagged products. Changing campaign tone changes only presentation permitted after eligibility. A blank notice shows a merchant-configuration fallback without changing eligibility.

A reviewer can identify how grouped logic is represented without parentheses, which condition has priority, and why the notice fallback is independent. The panel remains meaningful with JavaScript disabled and keeps supplied editor settings intact.

## Stretch

Write a learner note translating one hypothetical business rule containing two `or` clauses and one `and` clause into an ordered state table. Explain which prerequisites would be nested and which would become a named intermediate decision. Do not add a second component or a parenthesized condition.
