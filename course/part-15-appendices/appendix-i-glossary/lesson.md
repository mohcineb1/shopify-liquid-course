<!-- STATUS: final -->
---
id: app-i
title: "Glossary"
part: 15
words: 2350
---

# Appendix I — Glossary

This appendix is the reading index for Shopify-specific vocabulary used throughout the course. The canonical, append-only term table lives in [`docs/GLOSSARY.md`](../../../docs/GLOSSARY.md); it records the chapter that introduced each term. Use the definitions here to orient yourself when arriving from another platform, then return to the originating chapter for route, data, editor, accessibility and failure-state context. A term does not imply an entitlement, store configuration or current feature availability. Confirm configuration-dependent behavior with `> [VERIFY]`.

## Architecture and rendering

| Term | Definition for a cross-platform developer |
| --- | --- |
| **Liquid** | Shopify’s server-side template language used to render theme markup from the route and available objects. It is not a general application runtime. |
| **Theme** | A versioned storefront code package containing layouts, templates, sections, snippets, assets, config and locales. |
| **Layout** | The document shell that wraps template output and establishes shared markup/asset boundaries. |
| **Template** | A route/resource composition file, often JSON, that selects and orders sections. |
| **JSON template** | A template configuration that references sections and stores their settings/order; not an invitation to put Liquid directly in JSON. |
| **Section** | An editor-facing theme component with Liquid, schema and route/group placement context. |
| **Section group** | A bounded reusable composition region, commonly used for global placements; actual placement/support is `[VERIFY]`. |
| **Section block** | A block declared and rendered inside its parent section’s schema/markup contract. |
| **Theme Block** | A reusable block file in `blocks/`, with its own schema and parent/availability constraints. |
| **App block** | A block supplied by an app through Shopify’s extension model; theme code must keep an explicit insertion/ownership boundary. |
| **Static block** | A block rendered by section code in a fixed position rather than freely added/reordered as a normal merchant block. |
| **Snippet** | A narrow reusable Liquid presentation unit invoked with `{% render %}` and named inputs. |
| **Render isolation** | The fact that a rendered snippet receives explicit inputs instead of automatically sharing the caller’s local scope. |
| **Schema** | JSON inside a section/block declaring editor settings, blocks, presets and related constraints. |
| **Preset** | A safe initial configuration offered to an editor; it is not a substitute for approved content/data. |
| **Dynamic source** | Editor connection to compatible store/content data; availability/type is configuration dependent `[VERIFY]`. |
| **Design mode** | Theme-editor rendering context used for editor-specific cues; exact behavior must be verified. |

## Liquid data and commerce

| Term | Definition for a cross-platform developer |
| --- | --- |
| **Object** | A Liquid value supplied by the current rendering context, such as `product`, `collection`, `cart`, `section` or `request`. |
| **Filter** | A Liquid value transformation such as `money`, `image_url`, `escape` or `default`; output depends on input type/context. |
| **Tag** | Liquid control/output construct such as `if`, `for`, `assign`, `capture`, `render`, `paginate` or `form`. |
| **Handle** | A URL-safe identifier used by Shopify resources; do not assume a transformed string identifies a real resource. |
| **Product** | Store product resource rendered in an appropriate product/list context; product data varies by route/configuration. |
| **Variant** | Purchasable product option combination with price/availability state. Do not assume all variants are loaded: `product.variants` has a documented maximum of 250.[1] |
| **Product option value** | Contextual option selection value used for scalable product-option interfaces; availability/selection semantics require current docs. |
| **Collection** | A product grouping resource with collection page context, sort options and paginated products. |
| **Pagination** | Server-rendered division of a matching set into pages; collection products are limited to 50 per page.[2] |
| **Cart** | The current storefront cart context; a browser counter/event cache is not authoritative cart data. |
| **Product form** | Shopify theme form boundary used to submit a product selection; one component should own its accessible purchase controls. |
| **Metafield** | Typed custom field attached to a Shopify resource; definition/type/visibility must be confirmed. |
| **Metaobject** | Structured reusable content record type defined in a store; actual fields/references/storefront access are `[VERIFY]`. |
| **Reference** | A typed relationship from a setting/metafield/content field to another resource/content record. |
| **Recommendation intent** | The merchandising purpose governing related/complementary product output and its configuration/empty state. |
| **Storefront filtering** | Shopify-supported collection filtering surface; actual filters/configuration are store facts `[VERIFY]`. |

## Interaction, accessibility and operations

| Term | Definition for a cross-platform developer |
| --- | --- |
| **Section Rendering API** | A request mechanism returning rendered theme section HTML for a supplied page/context. It supports up to five section IDs; individual results can be `null` even with HTTP 200.[3] |
| **Owned fragment** | DOM/section region whose requesting, replacement, lifecycle and failure handling belong to one named component. |
| **Transaction boundary** | Explicit request/response/focus/error/recovery boundary for a commerce interaction. |
| **Progressive enhancement** | Optional client behavior layered over a complete, usable server-rendered baseline. |
| **Cart-page fallback** | The durable cart route used when a drawer or asynchronous update fails. |
| **Locale-aware URL** | A route built to preserve selected language/country context; `window.Shopify.routes.root` is documented for Section Rendering requests.[3] |
| **Accessibility baseline** | Semantic, keyboard, focus, status, label and alternative-text behavior that survives absent/failed enhancement. |
| **Route-state matrix** | Test inventory pairing routes with content, interaction, failure, locale and accessibility states. |
| **Release evidence row** | Reproducible record connecting a quality/release claim to candidate version, route, fixture, environment, raw output, owner and decision. |
| **Quality gate** | A decision point with evidence, owner, abort/response condition and verification boundary. |
| **Rollback artifact** | Identified prior deployable version/procedure used to reverse a release under a named owner. |
| **Observable hypothesis** | A claim tied to a defined signal/metric, baseline, owner and response action—not a vague desired outcome. |
| **Time-bounded exception** | Accepted risk with approver, control, expiry and reopening condition rather than permanent silent debt. |

## Boundaries, maintainability and professional practice

| Term | Definition for a cross-platform developer |
| --- | --- |
| **Commerce surface** | Buyer-facing route/component defined by task, authority, baseline, enhancement, accessibility and failure contracts. |
| **Component contract** | Named caller, inputs, output, semantics, data owner, blank behavior, assets and test fixture for a component. |
| **Caller contract** | Responsibilities that remain with the parent route/section, including resource context, landmark, form, data and errors. |
| **Structured content reference** | Explicit typed content relationship with a defined empty/archive/fallback contract. |
| **Platform ceiling** | Verified maximum accepted by Shopify, distinct from a project’s smaller design budget. |
| **Local budget** | Project threshold that triggers review before reaching a platform maximum or degrading quality. |
| **Dense-editor fixture** | Deliberately content-rich template/group used to test editor, composition and performance boundaries. |
| **Deprecation inventory** | Dated record of legacy surfaces, source status, owners, replacement choice and migration evidence. |
| **Active-use verification** | Evidence that a found source artifact is actually used by the relevant published/configured environment. |
| **Requirement matrix** | Source-linked map from external requirement to theme surface, evidence, owner and remediation state. |
| **Supported configuration envelope** | Documented merchant/data/integration conditions a theme product can handle safely. |
| **Dependency/risk register** | Maintained inventory of platform, app, data and operational dependencies with impact/owner/review dates. |
| **Platform-change intake** | Process for classifying authoritative platform updates and recording an adopt/defer/ignore decision. |
| **Reconsideration trigger** | Event that requires a previous decision to be reviewed, such as an app update or deprecation. |

## Terms that are easy to confuse

| Do not confuse | With | Practical distinction |
| --- | --- | --- |
| **Section** | **Snippet** | A section is editor/placement-aware and has schema; a snippet is an explicitly invoked presentation contract. |
| **Theme Block** | **Section block** | A Theme Block is a block file with reusable type/parent rules; a section block belongs to one section’s block model. |
| **Template** | **Layout** | A template composes a route; a layout wraps document-level structure around output. |
| **Setting** | **Dynamic source** | A setting is configured value; a dynamic source connects compatible store/content data `[VERIFY]`. |
| **Metafield** | **Metaobject** | A metafield is a typed field on a resource; a metaobject is a reusable structured record type. |
| **Reference** | **Handle** | A reference is typed content/resource relation; a handle is a URL-safe identifier and not proof of resource access. |
| **Collection** | **Search result** | Both can show products, but their URL/filter/pagination/data contracts differ. |
| **Product** | **Variant** | Product is the parent commerce resource; variant is a purchasable option combination. |
| **Cart page** | **Cart drawer** | Cart page is a durable route; drawer is optional progressive enhancement. |
| **Theme code** | **Checkout extensibility** | A theme owns storefront surfaces, not unsupported checkout modifications. |
| **Platform ceiling** | **Local budget** | Ceiling is maximum acceptance; budget is intentional review threshold. |
| **Requirement** | **Evidence** | Requirement states what must be true; evidence records how/where it was tested. |

### Context changes the meaning

Liquid terminology is deliberately contextual. The same string can be technically valid but architecturally wrong. `product` might be available in a product section yet absent on the home page. `section.settings` exists only while rendering a section. `block.shopify_attributes` belongs on a Theme/section Block root in its appropriate editor context. `customer` may exist in a supported customer route but cannot be used to reconstruct an account service. A `cart` rendering context does not grant authority to persist cart data in a browser global.

For this reason, glossary definitions name boundaries rather than promise universal availability. Before using an object or recipe, identify the current route, template, section, snippet caller, data definition, market/locale and enhancement state. If a definition feels incomplete, that is often a sign that the term is configuration-dependent and needs current source/store verification rather than a broader claim.

### From terminology to design review

The glossary is useful in pull-request, code-review and handoff language. Instead of saying “this component is generic,” ask whether it has a **component contract** and **supported configuration envelope**. Instead of “the cart is updated,” ask which **transaction boundary**, **owned fragment** and **cart-page fallback** make that statement meaningful. Instead of “the issue is fixed,” ask which **route-state matrix** and **release evidence row** show it. Instead of “we support markets,” ask which locale-aware routes, availability fixtures and content ownership are verified.

This vocabulary reduces false agreement across frontend, content, operations and app teams. It turns vague handoffs into reviewable questions and makes documented uncertainty legitimate. A term marked `[VERIFY]` is not a gap in professionalism; it is an honest boundary until the authoritative source, store configuration and observed behavior are available.

### Updating definitions after platform change

When a Shopify change affects a term, do not silently rewrite every occurrence in course material. First record the dated source and exact impact. Determine whether the change affects a stable definition, an example, a limit, a deprecated surface, a supported configuration envelope or merely a project convention. Update the canonical definition and links, annotate affected chapters/appendices, add a deprecation or migration note when needed, and keep the old/new evidence accessible to maintainers.

| Change type | Glossary action | Course action |
| --- | --- | --- |
| New stable object/feature | Add concise definition with source chapter | Teach only after current documentation/availability review |
| Preview feature | Mark preview and environment explicitly | Do not present as baseline behavior |
| Changed limit | Update source/date and affected budget guidance | Recheck appendices, examples and release fixtures |
| Deprecation/removal | Add date/replacement/detection term | Link migration workflow and affected boundaries |
| Local convention | Label as project policy, not platform fact | Keep it out of generic object definitions |

## How to use the canonical glossary

When you encounter a term, first identify whether it is a stable language/architecture term, a contextual Liquid object, an editor/data term, a platform integration, or a project operating term. Then ask three questions: **where is it available, who owns it, and what happens when it is absent?** Those questions prevent familiar words such as “cart,” “customer,” “settings,” “filter,” “section,” and “recommendation” from being used as unexamined globals.

The glossary grows only when a course unit introduces a durable term. Do not add synonyms solely to make a concept sound more technical. Prefer the existing canonical term, link to its source chapter, and update the definition if a verified platform change makes it inaccurate. Preserve prior wording in a change record where a definition has operational impact.

## Glossary maintenance checklist

| Before adding or changing a term | Check |
| --- | --- |
| Is it Shopify-specific or a necessary project concept? | Avoid generic programming vocabulary already understood by the reader. |
| Is the definition platform-factual? | Cite/verify current documentation or mark `[VERIFY]`. |
| Does it name an owner/boundary? | Avoid a definition that turns a configuration into a guarantee. |
| Is its source chapter recorded? | Keep the canonical table navigable. |
| Does it conflict with an existing term? | Consolidate rather than duplicate. |

## References

[1]: https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products "Shopify — Support high-variant products"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/templates/collection "Shopify — Collection template"
[3]: https://shopify.dev/docs/api/ajax/section-rendering "Shopify — Section Rendering API"
