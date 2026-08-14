<!-- STATUS: final -->
---
id: ch-65
title: "Dawn vs Horizon"
part: 12
words: 2450
---

# Chapter 65 — Dawn vs Horizon

Dawn and Horizon are not interchangeable “starter themes with different styling.” They represent different customization and component contracts. A client decision therefore begins with the selected version’s repository and real requirements—not screenshots, launch announcements, or a claim that newest automatically means best.

Shopify describes Online Store 2.0 themes as supporting sections on every page and dynamic sources. Themes that support Theme Blocks, including the Horizon family, are the latest theme architecture version and include OS 2.0 capabilities plus advanced Theme Block customization.[1] The exact feature set still varies by theme and version.[1] Treat every claim about a particular Horizon build, component, Shadow DOM surface, app, migration path, browser support, or editor behavior as `[VERIFY]` until it is tested against the client’s candidate.

## 65.1 Two architectures compared file by file

Begin with an inventory, not a label. Shopify’s theme architecture separates layout, template, section groups, sections, blocks, snippets, assets, config, and locales.[2] Both a current Dawn-based project and a Theme Block-capable Horizon project use the standard theme directories, but the ownership of page composition and reusable editorial content can differ substantially.

| Surface | Dawn/OS 2.0 baseline | Horizon/Theme Block-capable baseline | Decision evidence |
| --- | --- | --- | --- |
| `templates/` | Liquid templates contain code; JSON templates wrap sections | Same foundation; confirm selected templates/configuration `[VERIFY]` | Template inventory and route/editor fixture |
| `sections/` | Reusable page modules; often section-local blocks | Parent containers may opt into Theme Blocks | Schema, block model, editor behavior |
| `blocks/` | May be absent or unused in a legacy Dawn fork | Theme-level reusable blocks are expected capability | Actual block files, presets, targets `[VERIFY]` |
| `snippets/` | Parameterized reusable Liquid helpers | Still useful; not a replacement for merchant-editable blocks | Call sites and data contract |
| `assets/` | Global/theme or component styles and JS | Must respect newer component boundaries | Selector/event/network inventory |
| `config/` | Global settings and persisted merchant state | Same persistence risk during migration | Setting/custom CSS/data capture |
| App integration | App blocks/embeds where supported | Same platform concept; host/DOM assumptions may differ | App extension docs plus candidate test |

Dawn is a concrete theme codebase, not the synonym for OS 2.0. Horizon is a family/capability context, not a promise that any target repository has identical markup or component API. Compare actual commits and files: template count/type, section schemas, local versus `@theme` block usage, block presets, app targets, class/id/data selectors, custom elements, CSS layering, JavaScript event contracts, network dependencies, and merchant configuration. Record version, source, editor architecture label, route fixtures, owner, and test environment `[VERIFY]`.

A file-by-file comparison should answer ownership questions. Is a product-information unit a monolithic section with local block types? Does an editorial section expose an independent Theme Block picker? Is the header a layout section group? Does a script query an element by a Dawn-specific class? Does custom CSS target light-DOM descendants that may not exist? These are migration questions, not aesthetic preferences.

## 65.2 Monolithic sections vs composable nested blocks

A monolithic section centralizes markup, section settings, and local block logic. This can be a strength: a product form, price/variant state, or accessibility-critical landmark has a tight structural contract. Local section blocks are appropriate when their semantics and data depend on that parent. A Theme Block is defined at theme level in `/blocks`, may be reused across parents, and may nest.[3]

| Use a focused/local section model when | Use composable Theme Blocks when |
| --- | --- |
| The parent owns resource context, behavior, and semantic hierarchy | The unit has an independent data/markup/style contract |
| Merchant flexibility would break form/state/accessibility guarantees | Multiple parent sections need the same editor-selectable unit |
| Block relies on parent-only calculations or constraints | Block can rely on `block`, rendering `section`, and global objects |
| Layout is intentionally fixed | Nested/reordered composition is a clear merchant need |

Theme Blocks are not snippets with a better picker. Shopify documents that they can use their `block`, the rendering `section`, and globals, but cannot access variables created outside the block or receive snippet-style parameters.[3] Extraction therefore means eliminating hidden dependencies. A block that needs a product-loop variable may stay local, receive an explicit supported setting/data source `[VERIFY]`, or be redesigned; moving it mechanically creates an editor-visible component with invisible failure paths.

A parent that accepts Theme Blocks renders `{% content_for 'blocks' %}` and uses `@theme` in schema. It must choose this model rather than retain section-defined local blocks: Shopify states a section cannot support both simultaneously.[3] Nested blocks increase merchant expressiveness but also multiply test states: empty child list, reordered children, duplicate child, preset insertion, heading sequence, focus order, CSS inheritance, app block placement, dynamic sources, block depth, and recovery after deletion. Composability is a product requirement with a maintenance budget, not a default refactor.

## 65.3 Web components and Shadow DOM in the newer generation

A **Web Component** is a browser custom element with a JavaScript lifecycle and potentially an encapsulated Shadow DOM. A **Shadow DOM** is a component subtree with scoped styling/selectors; it changes what page-level selectors can see and how event targeting/composed events behave. This is architecture, not merely a new tag name.

> [VERIFY] Establish whether the selected Horizon release uses a custom element or Shadow DOM for each surface, whether its shadow root is open/closed, its documented public methods/events/parts/slots, server-rendered fallback, browser support, and accessibility behavior. Do not generalize from another Horizon version or a third-party article.

When a control moves behind a component boundary, a global `document.querySelector('.variant-picker input')`, a jQuery mutation observer, or a global CSS override may stop reaching the node. The correct response is not to pierce the boundary with unsupported selectors or duplicate internal logic. Find the documented public contract; attach behavior at an owned extension point; or decide the requirement should remain in the client’s own section/block. If no supported contract exists, record the feature as incompatible/needs redesign rather than shipping fragile DOM surgery.

Component migration affects progressive enhancement. The server-rendered HTML must preserve essential browse/buy/form behavior before an element upgrades. JavaScript must tolerate delayed upgrade, repeated section rendering, disconnected/reconnected components, and optional behavior failure. Test keyboard focus, labels, errors, live updates, no-JavaScript, motion, variant/add-to-cart flow, cart updates, and browser/device states `[VERIFY]`. Do not assume Shadow DOM automatically makes a component accessible or performant.

## 65.4 What breaks: app integrations, DOM-dependent scripts, global CSS

The largest migration risks live outside Liquid syntax. Apps may be installed through app blocks or app embeds, but an individual app’s host target, markup, stylesheet, timing, data attributes, and version compatibility must be verified. A Theme Block-capable parent can include `@app` where supported, yet app placement should be deliberate rather than a blanket compatibility claim.[3]

| Fragile dependency | Why it breaks | Safer response |
| --- | --- | --- |
| Selector to Dawn class/ID | Markup/wrapper changes or component boundary | Inventory, use documented/public hook, retest candidate |
| DOM mutation after load | Upgrade/render lifecycle replaces content | Use owned lifecycle/section contract or redesign `[VERIFY]` |
| Global CSS descendant rule | Shadow/style boundary or changed cascade | Token/public part/documented setting, or scoped owned CSS `[VERIFY]` |
| Event listener on stale node | Section rerender/component reconnect | Delegate only where appropriate; initialise/clean up per owned root |
| App injected in assumed location | Target/host/installation differs | Test current app extension/host state and fallback |
| Snippet parameter dependence | Theme Block cannot receive outer variable | Retain local/snippet or redesign explicit settings |

Create a **compatibility ledger** for every app, script, CSS override, analytics selector, accessibility customization, testing selector, and merchant custom CSS rule. Capture source/owner, target route, observed host/selector/event, timing, data reads/writes, purpose, supported contract, failure symptom, replacement, test fixture, release gate, rollback, and `[VERIFY]` facts. Do not migrate a client by running a global find-and-replace of `.product-form`, `data-*`, or stylesheet selectors.

CSS deserves its own audit. Identify broad selectors, `!important`, layout assumptions, z-index dependence, global custom properties, and class names coupled to old markup. Prefer a documented token/setting or narrowly owned component style. If a merchant has custom CSS, preserve it as data, compare the rendered outcome, and seek content-owner approval for mappings/retirements. A component boundary can protect internals, but it can also expose that a previous customization had no supported contract.

## 65.5 Choosing a base theme for a new client build

Choosing a base theme is a requirements and risk decision. Do not choose Dawn solely because the team already knows it, or Horizon solely because it supports Theme Blocks. A new client needs a documented comparison of composition needs, editorial autonomy, required apps, customization surface, component/DOM dependency, performance/accessibility constraints, update strategy, team skill, support source, migration horizon, and ownership.

| Criterion | Favor a proven Dawn/OS 2.0 baseline when | Favor a verified Horizon/Theme Block candidate when |
| --- | --- | --- |
| Delivery risk | Existing client app/CSS/JS contracts already fit | Candidate passes integration audit and component contracts are understood |
| Editor needs | Scoped predictable sections meet merchant workflow | Reusable/nested composition solves documented recurring needs |
| Team capability | Team owns current patterns and update path | Team can own Theme Block/component boundaries and tests |
| Customization | Strong constraints prevent unsafe changes | Merchant needs structured reusable flexibility |
| Support/update | Chosen version/source is known and maintained `[VERIFY]` | Same, with explicit Horizon version/release evidence `[VERIFY]` |

Run a time-boxed candidate spike for both viable bases. Use sanitized product/content fixtures; test critical buyer journeys, app placements, editor operations, accessibility, performance, localization, no-JavaScript behavior, component upgrade, update diff, and removal/rollback. Score evidence rather than opinions. The selection record should name the source/version, client requirements, excluded alternatives, compatibility findings, unresolved `[VERIFY]` items, content owner, technical owner, acceptance gates, and a reversal decision.

### A practical dependency audit

Before selecting or migrating a base, make the implicit front-end dependency graph visible. Search first for custom elements, `attachShadow`, selectors tied to classes/IDs, `MutationObserver`, `querySelector`, `closest`, global event listeners, `window` state, custom events, CSS variables, `!important`, app embed code, analytics hooks, test selectors, and merchant custom CSS. For each match, record whether it is code the team owns, an application contract, an unsupported scrape, or an unknown `[VERIFY]`. A small global rule that overrides a variant picker can be higher risk than a large isolated section because it silently assumes a specific DOM tree.

Then classify a dependency’s adaptation path: **supported public contract**, **owned refactor**, **candidate-only compatibility shim**, **merchant-approved retirement**, or **blocker**. A compatibility shim has a named owner, fixture, expiration/review date, monitoring condition, and removal test; it is not permanent code that reaches through a component boundary. A blocker is valuable information: it can make Dawn the lower-risk choice, identify a required app upgrade, or justify deferring a Horizon adoption until the selected version exposes a supported extension point.

Finally, compare the two candidates through a release lens. Can the team update the upstream theme without reapplying dozens of private DOM patches? Can a merchant rearrange intended editorial content without breaking a form landmark? Can an app render at an approved host? Can critical content/buying work when JavaScript does not enhance? The answers, evidence, owners, trade-offs, and reversal path form the real architecture decision. They are more durable than a “Dawn vs Horizon” preference document.

## Gotchas

- **Dawn equals all OS 2.0 themes:** Dawn is an implementation; architecture capability and individual theme behavior differ.
- **Theme Blocks are always more flexible:** they require a clean independent contract and add editor/test complexity.
- **Shadow DOM is a reason to scrape internals:** a component boundary calls for public APIs or redesign, not brittle bypasses.
- **An app block means every app works unchanged:** test each app’s current target, host, timing, and fallback.
- **Global CSS is harmless:** it is often a hidden dependency on a theme’s private markup.

## Checklist

| Question | Evidence |
| --- | --- |
| Is the comparison based on selected repositories/versions rather than labels? | File and editor inventory `[VERIFY]` |
| Is each local block/Theme Block decision tied to data and merchant needs? | Component contract and parent model record |
| Are component boundaries tested for essential UX and accessibility? | Public-contract and no-JS/keyboard fixtures `[VERIFY]` |
| Are apps, DOM scripts, CSS, and custom CSS inventoried? | Compatibility ledger and candidate results |
| Does the theme choice have owner-approved reversible criteria? | Selection record and candidate spike |

## References

[1]: https://help.shopify.com/en/manual/online-store/themes/managing-themes/versions "Shopify Help — Theme architecture versions and sources"
[2]: https://shopify.dev/docs/storefronts/themes/architecture "Shopify — Theme architecture"
[3]: https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start "Shopify — Theme Blocks quick start"
