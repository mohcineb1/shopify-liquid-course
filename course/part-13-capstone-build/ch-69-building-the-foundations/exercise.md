<!-- STATUS: final -->
# Chapter 69 — Exercise

**Time:** 2–3 hours · **Type:** capstone foundation refactor

## Goal

Turn a fragile theme shell into a bounded foundation: document/document-level layout, controlled global settings and color roles, a contract-based snippet library, and progressive JavaScript components that coordinate through a minimal owned event vocabulary rather than global state.

## Context

Northstar’s starter layout contains product markup, a checkout script, a remote parser-blocking dependency, and a global listener that assumes every page has a cart. Its header group is used as a generic page container. Global settings try to hold product facts and arbitrary CSS. Snippets silently assume `product`, calculate a “sale”, and use `include`. The JavaScript base class queries the whole document, registers duplicate listeners, stores customer/cart state globally, and broadcasts unrestricted data via `window`.

Actual theme version, section-group configuration, app blocks/embeds, navigation, plan/market behavior, selected locale, product price rules, customer/cart authority, editor lifecycle, browser support, data privacy, ownership, release, and rollback are unknown. Work locally only. Do not configure section groups, enable apps, modify checkout, perform cart/customer requests, add third-party scripts, publish a theme, access store data, or claim a platform/event behavior. Mark every such fact `[VERIFY]`.

## Requirements

- [ ] 1. Create `foundation-layout-contract.md` defining document shell, section-group purpose, global assets, main/skip target, allowed global settings, color-role contract, editor boundaries, app/market policy `[VERIFY]`, route fixture, owner, release and rollback. Correct the layout so it contains no route-specific product form, checkout script or blocking remote dependency.
- [ ] 2. Create `settings-and-color-contract.md` and correct `config/settings_schema.json`. Replace arbitrary CSS and resource-like fields with semantic global choices; state role/default/consumer/valid range/focus/contrast review `[VERIFY]`, responsive behavior, prohibited use and fallback. Do not use general settings as dynamic resource data.
- [ ] 3. Create `snippet-library.md` and correct `product-card`, `price`, `icon`, and `guide-callout` snippets. For each, declare inputs, output semantics, escaping, empty behavior, CSS ownership, accessibility, load behavior, callers, test and negative contract. Use `render`, not `include`; a product card has no form and price has no calculation authority.
- [ ] 4. Create `component-and-event-contract.md`, then correct `theme-element.js` and `theme-events.js`. Scope queries to owned roots, initialise once, clean up with an abort signal, make enhancement optional, namespace events, restrict detail to minimal non-sensitive data, name producer/consumer/fallback/test, and forbid global customer/cart truth.
- [ ] 5. Create `foundation-css-contract.md` and correct `base.css` so semantic tokens, focus/visually-hidden utilities, layout primitives and component classes have deliberate ownership. Remove broad selectors that depend on other components’ internals.
- [ ] 6. Create `candidate-validation-matrix.md` for global layout/group empty state, settings/color fallback, long localized text, snippet empty/invalid input, no-JS product/card/form behavior, keyboard skip/focus, component connect/disconnect, event absence/consumer failure, editor re-render `[VERIFY]`, asset loading and rollback.
- [ ] 7. Ship real starter files under `layout/`, `config/`, `sections/`, `snippets/`, and `assets/`. Do not use a framework, real store configuration, actual customer data, or production integrations.

## Constraints

- Layout owns document shell and global composition, not product/checkout business behavior.
- A section group is not a route-page template; global settings are not a content database.
- Snippets require explicit caller data and must preserve link/button semantics.
- An event is an observable notification, not authoritative state or proof that a cart action succeeded.
- JavaScript must be progressive enhancement; native markup/form behavior remains usable without it.

## Starter

```text
starter/layout/theme.liquid                     route/checkout/global-script coupling
starter/config/settings_schema.json             arbitrary CSS and product-data global settings
starter/sections/header-group.liquid            global group misused as page container
starter/snippets/product-card.liquid            implicit context and duplicated form
starter/snippets/price.liquid                   presentation mixed with business calculation
starter/snippets/icon.liquid                    inaccessible icon-only output
starter/snippets/guide-callout.liquid           hidden resource dependency and include call
starter/assets/base.css                          cross-component global selector coupling
starter/assets/theme-element.js                 global query/listener/state lifecycle anti-pattern
starter/assets/theme-events.js                  unrestricted window event bus anti-pattern
```

## Done when

| Concern | Evidence |
| --- | --- |
| Layout/settings | Document/global responsibilities and semantic editor contract are explicit and bounded |
| Snippets | Inputs, outputs, empty state and negative responsibilities are visible at caller boundaries |
| Components/events | Lifecycle, root scope, optional enhancement, event ownership/detail/fallback and cleanup are testable |
| CSS | Tokens/utilities/layout/component styles have owners without hidden selector dependencies |
| Validation | Candidate fixtures prove contract behavior without real configuration or buyer data |

## Stretch

Write an event deprecation policy for `northstar:*` events: version marker, producer notice, consumer migration window `[VERIFY]`, test coverage, fallback, removal owner and release record. Do not emit a deprecated event or fabricate a deployment timeline.
