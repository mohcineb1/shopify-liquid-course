<!-- STATUS: final -->
---
id: ch-68
title: "Brief & Architecture"
part: 13
words: 2450
---

# Chapter 68 — Brief & Architecture

The capstone begins before Liquid. A theme can be syntactically valid, visually polished, and still fail a merchant if it has no agreed market strategy, content ownership, editor model, component boundary, or quality budget. This chapter converts an ambiguous apparel brief into a compact architecture record that later chapters can build, test, launch, and hand over.

The project is intentionally fictional. Do not infer a real merchant plan, catalog, country, currency, market configuration, app, content owner, performance baseline, or accessibility acceptance result. Those become named decisions or `> [VERIFY]` items, not made-up requirements.

## 68.1 The client brief: a multi-market apparel store

Assume **Northstar Apparel** sells durable everyday clothing through a default storefront and two proposed market experiences: a domestic market and an international market. The brief requires product discovery, editorial storytelling, size/care guidance, seasonal collection landing pages, a cart, and a merchant-editable home page. It also says that messaging, imagery, assortment emphasis, and legal/editorial content may differ by market. “May” is not a technical specification.

Translate the request into outcomes, constraints, owners, and evidence. A buyer needs to find a garment, understand its material/fit/care, select a variant, add it to cart, and recover if JavaScript does not enhance the page. A merchant needs to update campaigns without source edits, choose approved content, and understand which changes affect the store default or one market. A delivery team needs a bounded component inventory, quality budgets, and release tests.

| Brief statement | Architecture question | Evidence needed |
| --- | --- | --- |
| “Sell internationally” | Which markets, languages, currencies, domains, products, policies, and owners exist? | Markets/admin/configuration and content plan `[VERIFY]` |
| “Localized campaigns” | Is this a market setting override, market-specific data, separate template, or editorial process? | Change examples and editor workflow `[VERIFY]` |
| “Flexible home page” | Which blocks are safe to reorder/add; which landmarks stay structural? | Merchant jobs and accessibility contract |
| “Premium apparel” | What product facts and media are mandatory versus optional? | Data model, content owner, fallback fixture |
| “Fast and accessible” | Which routes/devices/metrics/tests decide acceptance? | Baseline, budget, tool, owner `[VERIFY]` |

Shopify lets a store default be inherited by markets/submarkets unless a setting is overridden. Market-specific theme customization is plan-dependent, supports up to 250 markets and five levels of submarket inheritance.[1] Those platform capabilities do not establish that Northstar has the qualifying plan or any proposed market. The project record should name its market hierarchy, source of inherited settings, override rationale, content steward, translator/reviewer, fallback if an override is removed, and candidate fixture for every market-sensitive choice.

A good brief records exclusions as carefully as features: no custom checkout behavior in this theme; no secret-bearing browser integration; no price or eligibility authority in Liquid/JavaScript; no assumed real-time inventory model; no unreviewed third-party tags; and no claim that a localized string is culturally or legally approved. These exclusions keep the capstone from becoming an unbounded commerce-platform rewrite.

## 68.2 Information architecture and content modelling

Information architecture describes the buyer routes and the merchant-maintained content that makes those routes useful. Start with a route map, then map each route to an intent, primary resource, required content, editable composition, fallbacks, accessibility landmark, performance risk, owner, and acceptance fixture.

| Route | Buyer intent | Primary model | Merchant composition | Critical fallback |
| --- | --- | --- | --- | --- |
| Home | Understand brand and discover entry points | Store/default or market editorial data | Curated sections and safe blocks | Meaningful intro and navigation |
| Collection | Browse a category/campaign | Collection, product cards | Filter/sort/collection explanation `[VERIFY]` | Product list and pagination |
| Product | Evaluate, select and buy | Product, variants, product data | Product information plus bounded editorial support | Form, price, variant, add-to-cart |
| Size and care | Reduce purchase uncertainty | Reusable structured guidance | Referenced guide/content block | Text alternative and link from product |
| Journal/campaign | Learn brand context | Article/page/metaobject `[VERIFY]` | Editorial sections | Reading order and related route |
| Cart | Review intent before checkout | Current cart | Compact recommendation/message only | Update/remove/checkout control |

Do not model content by copying a visual layout. Classify it. A product-specific fact such as material is a typed attribute of the product. A reusable size or care guide is a structured entity that may be referenced from several products. A campaign panel is presentation content with an editor contract. An operational rule belongs to its authoritative system, not to a text setting. The result is a **content decision record**: content name, semantic owner, data type, cardinality, edit workflow, market behavior, locale behavior, visibility, fallback, migration source, consumer component, and removal/archive rule.

Dynamic sources help merchants connect section or block settings to resource attributes, metafields, and metaobjects. They are unavailable for general theme settings, and their availability depends on template/resource context and compatible data.[2] A section that expects product material should exist in a product context or own an explicit product setting; it must not assume `product` exists on a landing page. Shopify also documents limits such as 100 dynamic sources in a JSON template and 50 in one static section or one setting.[2] Treat these as design constraints, not a reason to fill every setting with a data connection.

For Northstar, separate stable **design vocabulary** (tokens), reusable **content entities** (guides, badges, editorial stories), and route-specific **composition** (sections/blocks). That makes it possible to improve a product card without duplicating product truth, or revise an international campaign without forking a global theme layout.

## 68.3 Design tokens and the settings contract

A design token is a named, reusable decision: color role, font role, spacing step, border radius, shadow, content width, touch target, or motion duration. A settings contract says which decisions a merchant may safely change, what the valid range/meaning is, where it is consumed, what accessibility/performance condition applies, and how a fallback works.

| Contract layer | Examples | Owner and restriction |
| --- | --- | --- |
| Foundation token | color roles, type scale, spacing, width | Theme team defines semantics; merchant chooses approved values |
| Theme setting | logo, font preset, color scheme, layout density | Stable global choice; not a data source |
| Section setting | heading, image, alignment, content width | Local, documented editorial choice |
| Block setting | card content, CTA, icon, tone | Independent unit with semantic constraints |
| Dynamic connection | product guide, collection image, story field | Compatible context only; explicit empty state |

Do not expose a raw setting because a designer might use it once. A free-form CSS field, arbitrary HTML, unbounded color input, or global component toggle can undermine contrast, heading hierarchy, performance, localization, or upgrades. Prefer semantic options: `surface`, `text`, `accent`, `quiet`; `compact`, `standard`, `roomy`; `heading`, `body`, `caption`. Document allowed values, defaults, dependencies, responsive behavior, market override policy `[VERIFY]`, and what editors must never use the setting for.

Accessibility belongs in the contract. Shopify’s guidance calls for visible focus, keyboard-operable controls, logical focus order, correct language/heading structure, labelled forms, dynamic announcements, modal focus management, and primary touch targets of at least 44 by 44 pixels.[4] A color scheme should therefore have approved contrast pairs; an icon-only control should have a label; a drawer setting cannot disable focus restoration; a block cannot create a second page `h1` merely because an editor typed a big heading.

## 68.4 Component inventory: sections, blocks, snippets

A component inventory converts the route/content model into ownership boundaries. **Sections** are editor-facing modules that establish landmarks and composition. **Blocks** are bounded configurable children. **Snippets** are reusable implementation helpers that should not become hidden merchant content models. The inventory prevents duplicate product forms, three slightly different promotional cards, or a snippet that silently requires variables from an unrelated section.

| Component | Type | Contract | Reuse boundary |
| --- | --- | --- | --- |
| Header/footer | Section groups | Navigation, skip target, market-aware wording `[VERIFY]` | Global layout |
| Hero/story | Section + blocks | One heading hierarchy, media/text/CTA contract | Home/campaign templates |
| Product information | Section with local blocks | Product form and selected-state semantics stay parent-owned | Product template only |
| Product card | Snippet | Explicit product/card context, image/price/title/link | Collections, recommendations, search |
| Guide callout | Theme Block or section block `[VERIFY]` | Typed guide reference, heading/reading order/fallback | Product/editorial parents |
| Price/status | Snippet | Presentational output; no authority/business calculation | Product/card/cart contexts |

Write a component card for each entry: purpose; permitted parent/context; input contract; output/landmark; editor controls; data/dynamic-source rules; empty/error behavior; CSS/JS ownership; accessibility behavior; performance cost; tests; owner; and deprecation/removal rule. A section that needs a product form is not automatically reusable on a home page. A snippet is not automatically safe as a Theme Block because blocks have distinct data and editor contracts.

### A decision log for markets and content

A capstone needs a decision log because market variability otherwise becomes untraceable conditionals. Each entry names the buyer/merchant problem, market scope, default behavior, override trigger, content/data owner, editor action, translation/review path `[VERIFY]`, component affected, fallback, test fixture, acceptance owner, release date, and reset/removal condition. A request such as “show a different campaign in Canada” may be an inherited setting override, a data reference, an intentionally distinct template composition, or a request that should stay out of the theme. The record forces that choice before implementation creates duplicate markup.

The same discipline applies to editorial content. A campaign image has a source, alt-text owner, crop contract, market/locale relation, load priority and removal date. A guide needs semantic fields, product relationship, market policy, empty state and editor preview. A CTA needs label, destination, behavior, analytics/privacy implications `[VERIFY]`, and fallback if a market-specific destination is unavailable. These small records prevent the common late-stage failure in which a beautifully composed section cannot safely support real content changes.

## 68.5 Performance and accessibility budgets agreed up front

A budget is a release boundary agreed before implementation. It turns “fast” and “accessible” into observable acceptance conditions. The capstone should maintain a **budget register** with route, device/network fixture `[VERIFY]`, metric, threshold, test tool, owner, exception process, and regression action. Budgets are project commitments, not claims about an untested live storefront.

Shopify recommends HTML/CSS-first commerce behavior, JavaScript as progressive enhancement, a minified JavaScript bundle of 16 KB or less, responsive images, sparing resource hints, and no lazy loading of above-the-fold images.[3] Shopify Theme Store benchmarking requires an average Lighthouse performance score of at least 60 across home, product, and collection pages.[3] Northstar may choose stricter targets, but any target/baseline/device/network/test URL is `[VERIFY]` until the team agrees it.

| Budget category | Candidate acceptance rule |
| --- | --- |
| Core journey | Browse, select variant, add cart, update cart work without JavaScript enhancement where platform forms permit |
| JavaScript | No framework by default; each script has owner, route trigger, byte budget, lifecycle and removal condition |
| Images | Responsive `image_tag`; dimensions/alt; no lazy load for identified above-fold image |
| Accessibility | Keyboard traversal, visible focus, landmarks/headings, form labels/errors, dynamic update announcements, 44px primary targets |
| Visual stability | Reserve media dimensions; avoid late injection/motion surprise `[VERIFY]` |
| Testing | Candidate home/product/collection plus error/no-JS/market fixtures, manual keyboard review and automated checks |

Do not use a score alone as proof. Shopify notes that following theme accessibility practices does not guarantee complete accessibility.[4] A Lighthouse number does not prove a buyer can complete a variant flow. Combine automated checks with deliberate route fixtures, keyboard testing, screen-reader-informed review `[VERIFY]`, performance trace, content/editor exercise, and regression ownership.

### Budget review rhythm

Agree when the budget is assessed: before a component is added, in pull-request/candidate review, before release, and after a reported regression. An exception must state the route, reason, measured cost, buyer/merchant value, owner, expiry, compensating change, and re-test date `[VERIFY]`. A component cannot claim “only a small script” without declaring its bytes, trigger, lifecycle, interaction with other scripts, fallback and removal rule. A large editorial image cannot be accepted merely because the design board has one; its responsive rendition, dimensions, alt text, above-fold status and candidate impact must be chosen.

This rhythm protects delivery velocity. It allows the team to reject an unbounded feature before code exists, or knowingly accept a time-bounded exception rather than creating a hidden permanent regression. The next chapters inherit the register: every section, interaction and app-facing surface is built against a published component and quality contract.

## Checklist

| Decision | Evidence before chapter 69 builds it |
| --- | --- |
| Market strategy | Hierarchy, override, owner, fallback and plan capability `[VERIFY]` |
| Content model | Typed owner/data/relation/editor/fallback record |
| Settings | Semantic tokens, bounded controls and accessibility contract |
| Components | Parent/input/output/editor/quality contract card |
| Budgets | Route/device/threshold/tool/owner/regression register |

## References

[1]: https://help.shopify.com/en/manual/online-store/themes/customizing-themes-for-markets "Shopify Help — Adapting themes for specific markets"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources "Shopify — Dynamic data sources"
[3]: https://shopify.dev/docs/storefronts/themes/best-practices/performance "Shopify — Performance best practices for themes"
[4]: https://shopify.dev/docs/storefronts/themes/best-practices/accessibility "Shopify — Accessibility best practices for themes"
