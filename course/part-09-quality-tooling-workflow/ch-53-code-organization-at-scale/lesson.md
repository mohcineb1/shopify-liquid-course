<!-- STATUS: final -->
# Chapter 53 — Code Organization at Scale

A Shopify theme becomes difficult to change long before it reaches a platform limit. The failure usually arrives when names stop conveying ownership, snippets accumulate without contracts, design patterns are copied into sections, and a handoff relies on someone remembering why a setting exists. Organisation at scale is therefore not a folder-cleanup exercise. It is a set of agreements that helps a developer, merchant, app integrator, and future maintainer answer: **what is this, who owns it, where may it be reused, and what can change without breaking an existing storefront?**

The theme directories are fixed by the platform; your internal component system is not. Use that freedom to make code discoverable without pretending that a Liquid theme is a frontend framework. The goal is a thin, explicit library of stable contracts—not a generic abstraction layer that obscures commerce and editor context.

## 53.1 A naming convention for sections, blocks, snippets, and settings

A name is a navigation and compatibility promise. At minimum it should indicate the file’s layer, business/domain role, and whether the component is public, internal, generic, or variant-specific. A maintainer should not have to open ten `card-*` files to discover which one renders a product, which one is a collection layout, and which one only draws an icon.

Use kebab-case file names aligned with Shopify’s filename-derived types. Use a consistent noun-first vocabulary for resources and an explicit modifier for variation. For example:

| Surface | Convention | Example | Contract conveyed |
| --- | --- | --- | --- |
| Section | resource or page purpose | `product-purchase-panel.liquid` | Editor-addressable composition tied to a product purchase surface |
| Theme block | portable content role | `feature-item.liquid` | Public reusable block with its own schema/API |
| Private block/snippet | underscore or internal prefix where appropriate | `_purchase-divider.liquid`, `internal-price-label.liquid` | Not a broadly selectable/public building block |
| Snippet | rendered responsibility | `product-price.liquid`, `icon.liquid` | Explicit input/output fragment, not a page component |
| Asset | component/behavior responsibility | `product-purchase-panel.js` | Loaded/owned by a named surface |
| Setting ID | stable noun with an unambiguous scope | `show_compare_at_price` | A persisted editor/data key, not a prose label |

Names should reflect the **current contract**, not the implementation accident. `section-v2-final.liquid` tells a reader nothing and invites a third version. `card.liquid` is too broad unless the theme has one documented Card contract. Prefer `product-card` and `article-card` when the resource differences matter. Do not name a component after a campaign if it will survive the campaign; a `summer-promo` section that becomes the store’s permanent sale banner permanently confuses discovery and translation ownership.

Settings are special because their IDs can persist in configuration. Treat a rename as a migration, not a style edit. Changing `show_price` to `show_compare_at_price` may improve clarity, but existing section data can still carry the old key. Add a new setting intentionally, decide how old values behave, test existing instances, and remove obsolete keys under an owned migration plan. Labels may evolve for merchant clarity; identifiers deserve more stability.

Build a small vocabulary registry in the repository. Decide whether “promo” means a transient campaign, whether “announcement” is a global message, whether “feature” is a content item or marketing claim, and whether “card” is a resource representation or arbitrary box. Consistent words prevent namespace collisions more effectively than a long file-naming rule alone.

> [VERIFY] Before changing names or IDs in a live theme, inventory existing section instances, templates, locales, app references, and merchant documentation; the safe migration path is specific to the connected store configuration.

## 53.2 Building an internal component library inside a theme

A library inside a theme is a curated set of reusable contracts across sections, blocks, snippets, CSS, and JavaScript. Its unit is not “anything that looks reusable.” Its unit is a capability with clear inputs, output, ownership, and tests. A product price renderer is a good library candidate because many surfaces need the same active-price, compare-at, accessibility, and currency rules. A homepage hero with a unique merchant editing model is normally a section composition, not a generic primitive waiting for every page to consume it.

| Layer | Good library responsibility | Avoid |
| --- | --- | --- |
| Snippet | Small deterministic rendering contract with explicit arguments | Reading arbitrary global context so every caller gets hidden behavior |
| Theme block | Merchant-reusable content unit with editor/schema ownership | A public block that only makes sense inside one private section structure |
| Section | Editor-facing composition and placement boundary | Becoming a dumping ground for every implementation detail |
| CSS asset | Named component styles and documented tokens | A universal stylesheet whose selectors silently affect unrelated sections |
| JavaScript module | Bounded interaction lifecycle and DOM contract | A global initializer scanning and mutating every page without ownership |

Publish a component only after a second genuine consumer exposes its stable contract. The first implementation is often still discovering the input shape. Premature extraction creates parameters for hypothetical futures and makes the actual first consumer harder to read. Conversely, copying a known price, media, form, or icon implementation after the contract has stabilised creates drift. Use a decision record: “second consumer exists; inputs X/Y; output boundary Z; supported contexts A/B; non-goals C.”

A snippet API must be visible at the call site. Prefer:

```liquid
{% render 'product-price', product: product, show_compare_at: true %}
```

over a snippet that guesses `product`, `card_product`, or `section.settings` from whatever context happens to render it. Explicit inputs preserve the render-isolation lesson from chapter 21 and let a reviewer find every contract consumer. Document required/optional parameters, output root semantics, translation responsibility, escaping expectations, and test fixtures in `{% doc %}` or a nearby component record.

Do not turn a component library into a parallel design system disconnected from the editor. A theme component’s public surface includes schema labels, presets, dynamic-source compatibility, block permissions, merchant help text, CSS variables, and editor targeting—not only markup. If an abstraction makes those responsibilities invisible, it is too generic for a theme.

## 53.3 Shared utility snippets and a theme-level "standard library"

A standard library is smaller and more conservative than a component library. It contains cross-cutting helpers whose inputs/outputs have unusually stable meaning: safe icon lookup, a formatted price fragment, media presentation policy, a translated visually-hidden label, or a route-aware link construction helper. Each helper needs a narrow contract and an owner; otherwise `snippets/` becomes a junk drawer.

Separate **utilities** from **features**. `icon` can be a utility if it accepts a controlled icon name and emits trusted theme-owned SVG. `product-card` is a feature renderer because it carries product availability, media, localization, and interaction choices. `format-promo-copy` is probably not a utility if it reads a campaign’s settings and policy. The distinction tells a maintainer whether adding a consumer expands a stable contract or couples two unrelated business surfaces.

A practical standard-library manifest records name, purpose, required inputs, optional inputs/defaults, output/safety boundary, supported consumers, owner, and deprecation path. For instance, a `visually-hidden` snippet might own exactly the wrapper markup and escaped text input; callers own the language key and contextual label. A `price` snippet might own active money output while callers decide whether to render a product, variant, cart line, or compare-at context.

Avoid utility snippets that hide important decisions. A helper should not quietly choose a fallback product image, invent alt text, suppress a form error, or convert a price. Those are commerce/accessibility/presentation decisions that require local owners. Prefer a slightly longer explicit call to an opaque universal helper.

Standardise only what can be removed or migrated. Maintain a deprecation protocol: document the replacement, introduce it while retaining the old contract, migrate callers with a bounded search, test output contexts, then delete the old helper and its documentation. Keep a compatibility alias only where its lifetime and owner are explicit. Two permanent utilities with overlapping output are an invitation to drift.

## 53.4 Documentation that survives handoff

Documentation survives handoff when it is close enough to change with the code, small enough to read during review, and connected to evidence. A root README can explain setup, build output, CLI environments, branch/theme mapping location, check commands, and release ownership. It cannot substitute for component-level contracts or merchant-facing editor guidance.

| Documentation surface | Reader | Questions it must answer |
| --- | --- | --- |
| Root engineering README | Developer/release owner | How to build/check/preview; which output is deployable; where environments and release evidence live |
| Component record / `{% doc %}` | Implementer/reviewer | Inputs, output, ownership, supported contexts, non-goals, migration notes |
| Schema labels/help | Merchant | What setting changes, what it does not control, safe defaults, content owner |
| Decision record | Team/incident responder | Why a non-obvious architecture or exception exists, alternatives, owner, re-evaluation trigger |
| Release record | QA/merchant/release owner | Candidate identity, routes/context, approval, rollback provenance |

Write documentation as contracts, not as a diary. “Updated product cards” ages badly. “`product-card` expects a product object, owns the media/price display, does not determine purchasability, and is tested on collection/search contexts” remains useful. Link to the relevant theme file and evidence route. Give every exception a removal condition. If a document has no owner or update trigger, it will become an attractive but unreliable artifact.

Merchant-facing documentation deserves separate language. Explain the effect and constraints of a setting without exposing implementation jargon or promising outcomes owned by catalogues, Markets, apps, legal policy, or checkout. When a setting has important prerequisites, name the owner and verification step rather than encoding assumptions in help text.

## 53.5 Multi-store / multi-brand theme strategies

A multi-brand theme strategy chooses what is shared, what varies, and where variation is owned. Copying a theme per store maximises local freedom but makes security fixes, platform migrations, and library improvements expensive. One universal theme maximises shared code but can turn every merchant distinction into an unreadable conditional. The right strategy is a portfolio decision, not an exercise in the most abstract Liquid.

| Strategy | Best when | Primary benefit | Primary cost/control |
| --- | --- | --- | --- |
| Independent theme repositories | Brands differ in information architecture, commerce behavior, and release authority | Maximum local autonomy | Backport shared fixes deliberately |
| Shared base plus brand repositories | Core components/quality policy are stable; brands need owned composition | Explicit reusable foundation | Versioning and upgrade choreography |
| One configurable theme | Brands share templates, component contracts, and release cadence | One repair can benefit all brands | Settings/metafields must not become a maze of brand conditions |
| Source/deploy branch model | A build pipeline produces platform-compatible output | Source tooling plus connected-theme compatibility | Provenance and backfill of merchant edits |

Choose a variation boundary by ownership. Brand colors, fonts, logo assets, copy, market content, and a few composition choices may be configuration/brand-data concerns. Different purchase flows, different resource models, different legal regions, different app contracts, or different editor permissions can justify separate code/repositories. Do not write `if shop.name == ...` branches: they hide brand identity in deployment context and make preview, test, and handoff fragile. Use explicit brand configuration with documented valid values, or separate the code where the contract truly diverges.

Version a shared base like a product. Publish a changelog, compatibility notes, upgrade steps, test matrix, migration/rollback path, and owner. Each brand adopts a known base revision through a candidate theme, rather than pulling arbitrary current files into production. A cross-brand regression needs an ownership path just like a storefront incident.

Organisation succeeds when it makes change boring: names locate intent, components expose contracts, utilities remain small, documentation connects code to ownership, and brand variation is explicit. That discipline gives a theme team the freedom to scale stores and contributors without hiding a merchant’s storefront behind a supposedly reusable abstraction.


## Governing internal contracts over time

At scale, the difficult question is not whether a snippet can be reused today; it is whether its contract can change without silently changing twenty callers. Treat internal components as versioned interfaces even when they live in one repository. A change to argument meaning, emitted root element, schema ID, CSS class, translation key, event payload, or supported resource context is an API change. It deserves a consumer inventory and a migration plan.

| Contract change | Safe preparation | Migration evidence | Unsafe shortcut |
| --- | --- | --- | --- |
| Snippet argument changes meaning | Add a new explicit argument/default and document both paths | Search all renders; route-test each consumer class | Reuse an old argument name for a new concept |
| Markup/root change | Record CSS, editor, analytics, and JavaScript dependents | DOM and interaction tests on affected sections | Rename a class globally because the component “looks cleaner” |
| Schema setting rename | Retain/read old data or introduce an owned migration | Existing configured instances open and render correctly | Assume presets represent live merchant state |
| Utility replacement | Publish deprecation/replacement and migrate callers in bounded batches | No old callers remain; output comparisons reviewed | Leave two overlapping helpers indefinitely |
| Shared base upgrade | Publish changelog, compatibility matrix, rollback revision | Every brand candidate passes its relevant route matrix | Merge current base directly into live brand code |

This governance is intentionally lightweight. A component record with a consumer list, owner, compatibility promise, and retirement condition is usually more useful than a large architecture document. The record also creates a review question: “is this a local implementation change, or does it alter a contract another surface relies on?” That question catches breakage that Theme Check and a single page preview may not.

Repository structure should make ownership visible. Keep engineering-only documents and build tooling outside the deployable theme output, or use a source/deploy split described in chapter 52. Keep theme files near their Shopify-required directories. Do not create deep invented subfolders inside `snippets/` or `sections/` unless the platform and tooling contract supports them; a clever organisational taxonomy that breaks discovery, deployment, or a connected branch is not an improvement. Use filenames, manifests, and documentation to create the second-level organisation.

Finally, measure organisation by recovery. A new developer should be able to find the product-price contract, identify its consumers, change it in an unpublished candidate, check the correct output, and roll it back without asking which of five similarly named snippets is alive. A merchant should be able to understand a setting’s intent without reading Liquid. A release owner should identify brand/candidate provenance. If these tasks remain slow, add a precise contract or record—not another layer of abstraction.
