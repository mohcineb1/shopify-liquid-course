# Coverage ledger

Append one entry per generated unit, in generation order. The AI author reads this
before writing, so it knows what has already been taught and what it may assume.

**Format:** see `docs/CONTENT_CONTRACT.md`.

---

<!-- entries below, newest last -->

### ch-18 — Blocks: The Three Kinds
**Taught:** section blocks defined in a section schema; theme blocks as files in `blocks/`; app blocks via `@app` and `{% render block %}`; `block.type` / `block.id` / `block.settings` / `block.shopify_attributes`; `max_blocks` and per-type `limit`; the filename-is-the-type contract; underscore-prefixed private blocks; `"tag": null`; the `@theme` wildcard; the four ceilings (25 / 50 / 300 / 8); the decision rule for choosing a kind.
**Introduced terms:** theme block, section block, app block, private block, static block, block picker, `@theme` wildcard.
**Assumed known from earlier:** section schema and `section.blocks` (ch-17), JSON templates and section groups (ch-15, ch-16), `{% case %}` and `{% for %}` (ch-07, ch-08), `image_url` / `image_tag` (referenced only — taught properly in ch-43).
**Deliberately deferred:** nesting mechanics, static blocks in depth, full block schema → ch-19. `content_for 'blocks'` / `content_for 'block'` → ch-20. Snippet-vs-block boundary → ch-21. Theme app extensions and app embeds → ch-56.
**Exercise:** refactor a duplicated section-block component into public/private theme blocks plus a static heading, across two sections, admitting app blocks.

### app-a — Complete Liquid Tag Reference
**Taught:** current Shopify theme Liquid tags, grouped by control flow, iteration, variable creation and output, theme composition, markup and authoring, syntax, and developer preview; their canonical signatures; `content_for` dynamic versus static rendering; `render` isolation; `paginate` limits; legacy and preview boundaries.
**Introduced terms:** Liquid tag, static section, snippet.
**Assumed known from earlier:** Liquid output delimiters, basic objects, filters, conditions, and loops; this appendix is a reference, not their first teaching pass.
**Deliberately deferred:** control-flow patterns → ch-07; iteration cost and `forloop` → ch-08; filter behavior → app-b; section architecture → ch-17; `content_for` semantics → ch-20; snippet API design → ch-21; forms → ch-35 and ch-36.

### app-b — Complete Filter Reference
**Taught:** all currently documented Shopify theme Liquid filters by string, math, array, date, default, URL, hosted-file, media, HTML, money, localization, customer, cart, payment, color, font, metafield, data, cryptographic, and event categories; their input/output types, signatures, context requirements, and edge cases; current `image_url` versus deprecated image URL filters; `translate` and its `t` alias.
**Introduced terms:** Liquid filter, context-bound filter.
**Assumed known from earlier:** Liquid tags and output delimiters (app-a), basic objects, filters as a concept, conditions, and loops.
**Deliberately deferred:** filter chaining patterns and performance → ch-09; resource, media, localization, and commerce filters in depth → ch-10; metafield modelling → ch-33; forms → ch-35 and ch-36; client-side use of rendered JSON → ch-37 to ch-41.

### app-c — Complete Object Reference
**Taught:** every current Shopify theme Liquid object grouped by global/storefront, localization/navigation, product/collection, cart/customer/order, content/search/media, and local rendering contexts; their property surfaces, availability, relationship traversal, and authoring cost labels; the 20-handle `all_products` ceiling; contextual versus global object access.
**Introduced terms:** Liquid object, template-scoped object, traversal access.
**Assumed known from earlier:** Liquid output, tags, filters, snippets, sections, blocks, and the filter input/output model (app-a and app-b).
**Deliberately deferred:** the object graph and Drop internals → ch-03 and ch-11; global objects → ch-26; products/variants → ch-27 and ch-28; collections/filtering/pagination → ch-29; cart/line items → ch-30; accounts → ch-31; content/search → ch-32; metafields and metaobjects → ch-33 and ch-34.

### app-d — Schema & Settings Reference
**Taught:** every current basic and specialized input-setting type for Shopify section, local-block, theme-block, and theme settings schemas; complete JSON definitions; returned values; resource/list limits; section, block, preset, placement, wrapper, and metadata validation rules.
**Introduced terms:** input setting, schema home, resource picker, schema placement constraint.
**Assumed known from earlier:** Liquid output and objects; the section/block setting access paths (app-c); tags and filters (app-a and app-b).
**Deliberately deferred:** section architecture → ch-17; theme/local/app blocks → ch-18 and ch-19; block rendering → ch-20; settings UX and dynamic sources → ch-24 and ch-25; product, media, menu, and metaobject display patterns → ch-27 to ch-34.

### ch-01 — Where Liquid Actually Sits
**Taught:** Liquid as a sandboxed server-side template language; the storefront request path through route, template, layout, delivery, and browser; runtime boundaries among Liquid, browser JavaScript, Shopify Functions, Storefront API, and Hydrogen/Oxygen; why theme renders have no arbitrary fetch, await, imports, or npm; a practical Liquid-versus-headless decision matrix.
**Introduced terms:** render context, template language, runtime boundary, theme render, headless storefront.
**Assumed known from earlier:** basic HTML, browser JavaScript, and a frontend build tool.
**Deliberately deferred:** the four concrete Shopify surfaces → ch-02; the Shopify object graph → ch-03; themes versus app architecture → ch-04; first Liquid implementation → ch-05; detailed Functions, Storefront API, and headless development → later specialized chapters.

### ch-02 — Translating What You Already Know
**Taught:** Liquid versus JSX (template output and tags rather than arbitrary expressions, callbacks, or component state); Liquid versus Handlebars, Nunjucks, Twig, and ISML (shared template ideas but non-portable syntax and Shopify-specific context); theme rendering versus SSR frameworks (no built-in hydration, build step, or bundler); React habits that harm theme code; the responsibility mapping from component thinking to sections, blocks, and snippets.
**Introduced terms:** hydration, build step, bundler.
**Assumed known from earlier:** Liquid’s sandboxed render boundary and theme render (ch-01); Liquid tags, filters, objects, snippets, sections, blocks, and schema surfaces (appendices A–D).
**Deliberately deferred:** object availability and Drops → ch-03 and ch-11; theme-versus-app architecture → ch-04; first theme implementation → ch-05; section contracts → ch-17; block types and schema constraints → ch-18 and ch-19; snippet API design → ch-21; client-side theme patterns → ch-37 to ch-41.

### ch-03 — The Shopify Object Graph
**Taught:** the difference between data supplied to a theme render and data that requires another runtime; global, template-scoped, and local scoped objects; Drops as lazy Shopify proxies; deliberate traversal access; a practical object-graph map from request context through product, collection, cart, section, block, and loop scopes.
**Introduced terms:** object graph, global object, scoped object.
**Assumed known from earlier:** render context and theme render (ch-01); explicit snippet inputs and runtime boundaries (ch-02); Liquid objects, template-scoped objects, and traversal access (app-c).
**Deliberately deferred:** detailed resource object surfaces → ch-26 to ch-34; data shaping and iteration patterns → ch-09; API and data-ownership architecture → ch-04; render-cost measurement and optimization → ch-11.

### ch-04 — Syntax Fundamentals
**Taught:** the distinction between output markup and tag markup; deliberate whitespace control; Liquid block comments, browser-visible HTML comments, and `#` comments in `{% liquid %}`; multi-line `{% liquid %}` syntax; literal Liquid preservation with `{% raw %}`; and `{% doc %}` as non-rendered structured file documentation.
**Introduced terms:** output markup, whitespace control, raw block, doc block.
**Assumed known from earlier:** render context and object availability (ch-01 and ch-03); Liquid tags and filters (appendices A and B); explicit snippet inputs (ch-02).
**Deliberately deferred:** assignments and value types → ch-05; conditions → ch-06; data shaping and capture patterns → ch-09; section and block contracts → ch-17 and ch-18; detailed snippet APIs → ch-21; browser data serialization → ch-37.

### ch-05 — Types, Truthiness & Nil
**Taught:** Liquid’s practical value categories; truthiness where only `false` and `nil` are falsy; the distinction between `nil` and EmptyDrop; `blank` versus `empty`; deliberate filter coercion; and silent missing-value output as a contract and debugging concern.
**Introduced terms:** truthiness, EmptyDrop, blank comparison, empty comparison, type coercion, silent failure.
**Assumed known from earlier:** render context and Drops (ch-03); output and tag syntax (ch-04); Liquid objects and filters (appendices A–C).
**Deliberately deferred:** condition grammar and operators → ch-06; collection iteration → ch-07; capture and data shaping → ch-09; resource-specific empty states → ch-26 to ch-34; settings UX → ch-24.

### ch-06 — Variables & Scope
**Taught:** `assign` versus `capture`; isolated `increment` and `decrement` counters; scope boundaries across templates, layouts, sections, blocks, snippets, and loops; render isolation; reassignment and shadowing traps; and names as scalable component contracts.
**Introduced terms:** rendered-string semantics, counter namespace, render isolation, shadowing, snippet input contract.
**Assumed known from earlier:** Liquid values and truthiness (ch-05); output and tag syntax (ch-04); object and context boundaries (ch-03).
**Deliberately deferred:** complete condition grammar → ch-07; iteration state and collection patterns → ch-08; data shaping → ch-09; detailed snippet APIs → ch-21.

### ch-07 — Control Flow
**Taught:** ordered `if`/`elsif`/`else` and `unless`; `case`/`when` dispatch; comparison, logical, and `contains` operators; right-to-left logical precedence without parentheses; named intermediate boolean decisions; and ternary-style assignments with `default`.
**Introduced terms:** branch order, value dispatch, right-to-left precedence, intermediate decision, ternary-style pattern, fallback operator.
**Assumed known from earlier:** truthiness and blank values (ch-05); local variables and rendered-string semantics (ch-06); output and tag syntax (ch-04).
**Deliberately deferred:** iteration and loop controls → ch-08; larger data shaping → ch-09; resource-specific eligibility rules → ch-26 to ch-34; snippet API design → ch-21.
### ch-08 — Iteration
**Taught:** bounded `for` loops with `limit`, `offset`, `reversed`, and ranges; `forloop` position and nesting metadata; `break`, `continue`, and the collection-empty `else`; named `cycle` groups; the semantic boundary of `tablerow`; nested-loop cost multiplication; and contextual, bounded sources before broad collection or `all_products` lookup.
**Introduced terms:** loop boundary, loop metadata, collection-empty branch, cycle group, iteration cost curve.
**Assumed known from earlier:** Liquid conditions and ordered branching (ch-07); values, truthiness, and blank values (ch-05); scope and render isolation (ch-06).
**Deliberately deferred:** filtering, sorting, grouping, and data preparation → ch-09; resource-specific collection contracts → ch-26 to ch-34; rendering profiles and production performance measurement → ch-11.
### ch-09 — Filters: The Core Set
**Taught:** left-to-right filter pipelines and type transitions; string normalization and handle derivation; HTML, URL, and JSON output boundaries; numerical filters, division behavior, and minor-unit money discipline; contextual array shaping; date formatting with explicit timezone and locale assumptions; and the different roles of `default`, `json`, `inspect`, and the `raw` tag.
**Introduced terms:** filter pipeline, output-context encoding, minor-unit money arithmetic, array shaping, display boundary.
**Assumed known from earlier:** value categories and blank semantics (ch-05); assignments and render isolation (ch-06); control flow (ch-07); bounded contextual iteration (ch-08).
**Deliberately deferred:** composed rendered strings → ch-10; performance measurement → ch-11; resource-specific money, localization, and product data contracts → ch-26 to ch-34; browser JSON consumption → ch-37.
### ch-10 — Filters: The Shopify-Specific Set
**Taught:** Shopify-owned money formatting; asset, file, collection-scoped, and legacy URL paths; current object-aware media rendering; markup-generating helpers; type-aware metafield output; translation and localization helpers; color and font transformations; context-bound cart, payment, and customer helpers; and hosted-file or structured-data output boundaries.
**Introduced terms:** Shopify-owned output filter, resource home, type-aware metafield rendering, generated markup contract, structured-data boundary.
**Assumed known from earlier:** generic filter pipeline and output-context encoding (ch-09); value and blank semantics (ch-05); contextual traversal (ch-08).
**Deliberately deferred:** product and variant media/pricing contracts → ch-27 and ch-28; cart/payment/customer workflows → ch-30 and ch-31; metafield and metaobject modelling → ch-33 and ch-34; browser behavior and data consumption → ch-37.
### ch-11 — Drops in Depth
**Taught:** Drops as controlled contextual Shopify interfaces; deferred relationship access and its review cost; scalar versus multiplied access shapes; safe bounded iteration across related Drops; and minimal public JSON serialization instead of broad Drop dumps.
**Introduced terms:** Drop interface, deferred relationship access, access shape, public payload contract, payload minimization.
**Assumed known from earlier:** Drop availability and object graph (ch-03); blank and EmptyDrop semantics (ch-05); render isolation (ch-06); iteration bounds (ch-08); JSON serialization (ch-09).
**Deliberately deferred:** detailed product, collection, cart, customer, and metafield contracts → ch-27 to ch-34; browser-side JSON consumption → ch-37; reusable snippet API design → ch-21.
### ch-12 — Errors, Debugging & Observability
**Taught:** syntax versus render versus silent-output failure classes; minimal JSON diagnostics; current URL and editor inspection workflows; guarded debug snippet contracts; and evidence-led Theme Inspector flame-profile analysis.
**Introduced terms:** silent output absence, diagnostic boundary, reproduction state, environment guard, flame-profile hypothesis.
**Assumed known from earlier:** Drop access shapes and public payload contracts (ch-11); JSON serialization (ch-09); explicit snippet inputs (ch-06).
**Deliberately deferred:** section editor architecture → ch-17; formal snippet APIs → ch-21; browser implementation and console workflows → ch-37; resource-specific diagnostics → ch-27 to ch-34.
### ch-13 — Anatomy of a Theme
**Taught:** the runtime roles of theme directories; Shopify-special versus team-invented files; verified package, file, template, section, and block limits; and the application, checkout, data, and network responsibilities a theme must not absorb.
**Introduced terms:** directory contract, special file, resource home, theme composition graph, architecture surface.
**Assumed known from earlier:** Liquid runtime boundaries (ch-01); explicit snippet inputs (ch-06); theme asset filters (ch-10).
**Deliberately deferred:** JSON template composition → ch-15; section groups → ch-16; section and block schemas → ch-17 to ch-20; snippet APIs → ch-21; settings UX → ch-24.
### ch-14 — Layouts
**Taught:** `theme.liquid` as the global document frame; the single documented placement of `content_for_header` and `content_for_layout`; alternate layout selection; special password and gift-card frames; and checkout’s migration away from theme-owned `checkout.liquid`.
**Introduced terms:** document frame, header injection slot, layout render slot, alternate layout, special layout contract.
**Assumed known from earlier:** theme directory and special-file contracts (ch-13); theme asset delivery (ch-10); runtime boundaries (ch-01).
**Deliberately deferred:** JSON template composition → ch-15; persistent section groups → ch-16; checkout extensibility → ch-56; browser data behavior → ch-37.
### ch-15 — Templates
**Taught:** storefront template families; JSON versus Liquid composition; alternate suffix routing; JSON `sections`, `order`, `settings`, and block instances; template-scoped resource context; and merchant template-assignment lifecycle.
**Introduced terms:** template family, template suffix, section instance, composition manifest, assignment lifecycle.
**Assumed known from earlier:** theme directory and special-file contracts (ch-13); layouts and render slots (ch-14); context-dependent Drops (ch-03 and ch-11).
**Deliberately deferred:** section groups → ch-16; section schema design → ch-17; blocks → ch-18 to ch-20; product and collection objects → ch-27; metaobjects → ch-35.
### ch-16 — Section Groups
**Taught:** persistent composition boundaries; header, footer, and aside group files; layout wiring through `{% sections %}`; group versus template ownership; and global overlay placement with separate behavior/accessibility contracts.
**Introduced terms:** section group, persistent composition boundary, group mount, group-level composition, overlay group.
**Assumed known from earlier:** layouts and render slots (ch-14); template JSON composition (ch-15); section settings and context discipline (ch-03 and ch-11).
**Deliberately deferred:** detailed section schemas → ch-17; block systems → ch-18 to ch-20; overlay JavaScript and accessibility implementation → ch-37 and later UI chapters.
### ch-17 — Sections
**Taught:** section-file anatomy; the contextual section object; schema attributes and placement controls; static versus dynamic placement; verified section/block ceilings; aggregated section resources; and localized merchant-facing schema copy.
**Introduced terms:** section type, section instance, schema contract, static section, dynamic section, placement restriction, aggregated section resource.
**Assumed known from earlier:** template composition (ch-15); section groups (ch-16); object/context discipline (ch-03 and ch-11).
**Deliberately deferred:** blocks in depth → ch-18 to ch-20; snippets as APIs → ch-21; theme settings → ch-24; client interaction implementation → ch-37.
### ch-19 — Theme Blocks in Depth
**Taught:** public versus private block-file conventions; block schema and parent differences; bounded nesting; `@theme` and `@app` acceptance; static versus dynamic block position; verified 300-file accounting; and editor identity through `block.shopify_attributes`.
**Introduced terms:** public block, private block, parent block contract, open block acceptance, static theme block, block library governance.
**Assumed known from earlier:** section schemas and editor contracts (ch-17); the three block models (ch-18); theme directory and verified limits (ch-13).
**Deliberately deferred:** detailed cross-block composition patterns → ch-20; snippet API boundaries → ch-21; app embedding mechanics → ch-56.
### ch-20 — `content_for`
**Taught:** dynamic child slots; singular static-block rendering; JSON/editor ordering ownership; capture-and-render wrapper APIs; and the bounded parent contract required for genuinely composable sections.
**Introduced terms:** child render slot, static block render, composition order source of truth, child wrapper API, composable parent contract.
**Assumed known from earlier:** section schema contracts (ch-17); theme-block child contracts (ch-19); snippet APIs (previewed, ch-21 follows).
**Deliberately deferred:** reusable snippet API design → ch-21; client behavior inside composed sections → ch-37; application blocks in depth → ch-56.
### ch-21 — Snippets
**Taught:** isolated `render`; the deprecated shared scope of `include`; named/with/for parameter passing; constrained snippet APIs; recursive menu rendering; `{% doc %}` documentation; and snippet/block/section ownership decisions.
**Introduced terms:** render isolation, snippet API, guard clause, recursive snippet, snippet documentation, renderer boundary.
**Assumed known from earlier:** Liquid scope (ch-06); sections and blocks (ch-17 to ch-20); current deprecations (docs/DEPRECATIONS.md).
**Deliberately deferred:** JSON data boundaries → ch-22; menu object specifics → ch-32; client-side menu interaction → ch-37.
### ch-22 — Settings Architecture
**Taught:** global `settings_schema.json` structure and ordering; supported input and sidebar setting categories; conditional visibility through `visible_if`; the merchant-owned state represented by `settings_data.json` and presets; color schemes as design-token systems; and merchant-focused settings UX.
**Introduced terms:** settings schema API, merchant-owned state, conditional setting, color scheme, design token, settings ownership.
**Assumed known from earlier:** section schemas and local controls (ch-17); blocks and composition ownership (ch-18 to ch-20); explicit snippet rendering contracts (ch-21).
**Deliberately deferred:** Liquid consumption of global settings → ch-24; detailed navigation data → ch-32; structured content sources → ch-35.
### ch-23 — The Theme Editor Contract
**Taught:** editor instance mounting, targeting and reordering; `shopify_attributes` identity on sections and blocks; editor lifecycle events; reorder-resilient sections; dynamic-source ownership; and first-install defaults.
**Introduced terms:** editor instance boundary, editor identity attribute, lifecycle cleanup, live-reorder resilience, dynamic source, onboarding default.
**Assumed known from earlier:** section schema and instances (ch-17); block identity and composition (ch-19 to ch-20); global settings ownership (ch-22).
**Deliberately deferred:** metafield type rendering → ch-35; client interaction architecture → ch-37; advanced accessibility behavior → ch-45.
### ch-24 — AI-Generated Blocks
**Taught:** merchant-generated theme blocks; intentional `@theme` and `@app` acceptance; block render slots; the special `_blocks.liquid` wrapper contract; and design-system governance for generated code.
**Introduced terms:** generated theme block, acceptance surface, generated-block wrapper, wrapper precondition, generated-code review.
**Assumed known from earlier:** section schemas (ch-17); block contracts and public blocks (ch-19); `content_for` composition (ch-20); settings systems (ch-22); editor behavior (ch-23).
**Deliberately deferred:** full app extension implementation → ch-56; general JavaScript architecture → ch-37; block library migration strategy → ch-59.
### ch-25 — On the Horizon: `{% block %}` and `{% partial %}`
**Taught:** the Liquid July ’26 developer preview; direct block composition; named server-rendered partial regions; Liquid-first template ownership; coexistence with JSON and section groups; and reversible preview discipline.
**Introduced terms:** Liquid-first composition, direct block call, block body content, named partial, partial refresh, preview-track discipline.
**Assumed known from earlier:** theme blocks and child contracts (ch-19); `content_for` and JSON-owned order (ch-20); snippet APIs (ch-21); section/editor ownership (ch-23).
**Deliberately deferred:** stable client-side architecture → ch-37; production app integration → ch-56; future platform migration governance → ch-59.
### ch-26 — Global Objects
**Taught:** store identity/capability reads through `shop`; request-scoped context; route-generated URLs; global settings, templates, canonical URLs, handles, pagination and tags; localization selections; and merchant-managed navigation trees.
**Introduced terms:** request-scoped context, route-generated URL, canonical URL, localization selection, navigation tree, context audit.
**Assumed known from earlier:** Liquid object access (ch-03); schema-owned global settings (ch-22); snippet API rendering (ch-21).
**Deliberately deferred:** product and collection resource detail → ch-27 to ch-28; metaobjects → ch-35; full client-side navigation behavior → ch-37.
### ch-27 — Products
**Taught:** product versus selected-variant responsibilities; option ordering and swatches; variant deep links; product and variant pricing; availability, quantity rules and breaks; ordered multi-media; selling-plan data; product metafields; and organizational metadata.
**Introduced terms:** current variant, variant deep link, price range, quantity rule, quantity price break, selling-plan allocation, product media ordering.
**Assumed known from earlier:** global object/context discipline (ch-26); settings ownership (ch-22); Liquid rendering and guards (ch-05 to ch-09).
**Deliberately deferred:** collection filtering and product lists → ch-28; metaobject modeling → ch-35; dynamic variant interaction implementation → ch-37.
### ch-28 — Variants
**Taught:** the full variant transaction object; option-value matching and unavailable combinations; high-variant constraints; combined-listing sibling transitions; progressive variant rendering; and minimal, JSON-safe browser state.
**Introduced terms:** option-value selection, top-down availability, adjacent availability, combined-listing sibling, selected-state boundary, bounded variant projection.
**Assumed known from earlier:** product/variant presentation state (ch-27); global context and routes (ch-26); Liquid rendering guards.
**Deliberately deferred:** full interaction lifecycle → ch-37; Ajax and section rendering request architecture → ch-38; cart transaction behavior → ch-30 and ch-38.
### ch-29 — Collections, Filtering & Pagination
**Taught:** collection result and sort ownership; filter/facet objects and URL transitions; type-specific facet rendering; links-first degradation; pagination range and fetching constraints; `all_products` lookup limits; and facet render-performance discipline.
**Introduced terms:** collection query state, facet, filter transition URL, price-range filter, pagination window, page-size budget, handle lookup cap.
**Assumed known from earlier:** products and filtered variant context (ch-27 to ch-28); global URL/context discipline (ch-26); Liquid guards and snippets.
**Deliberately deferred:** search-specific result behavior → ch-32; client-side request implementation → ch-37 and ch-38; collection data modeling → ch-33 to ch-35.
### ch-30 — Cart & Line Items
**Taught:** cart totals and context; line-item identity and final prices; personalization properties and uploads; discount allocations; cart versus line scopes; and backend authority for free gifts and bundles.
**Introduced terms:** cart state, line-item key, line property, cart attribute, discount allocation, final line price, commerce authority boundary.
**Assumed known from earlier:** product and selling-plan data (ch-27); global context/URLs (ch-26); quantity and variant state (ch-28).
**Deliberately deferred:** Ajax cart mutation implementation → ch-38; customer accounts and orders → ch-31; app/extensions and backend commerce integrations → ch-52 onward.
### ch-31 — Customers & Accounts
**Taught:** guarded customer identity/orders/addresses/tags; the legacy-account deprecation and latest account-component boundary; customers-template roles; buyer-safe order/fulfillment/transaction presentation; and tag personalization versus authorization.
**Introduced terms:** customer context, latest customer accounts, legacy account template, account component, order-history disclosure, presentation gate.
**Assumed known from earlier:** cart/order transition and line data (ch-30); Liquid context/guards (ch-03 and ch-26); pagination (ch-29).
**Deliberately deferred:** customer-account extension implementation → ch-52; security/privacy enforcement → ch-56; app/backend customer APIs → later integration chapters.
### ch-32 — Content Objects
**Taught:** blog/article/comment/page semantics; type-aware rich text and metafield rendering; tag/archive navigation; typed full-search results; predictive-search section context and compact resource shaping.
**Introduced terms:** content-object contract, rich-text rendering boundary, editorial taxonomy, result shaping, predictive-search context, full-search recovery.
**Assumed known from earlier:** pagination/query-state navigation (ch-29); context guards and output safety (ch-03); customer account privacy boundary (ch-31).
**Deliberately deferred:** metafield design → ch-33; metaobject content modeling → ch-34; client-side interaction lifecycle → ch-37; request mechanics → ch-38.
### ch-33 — Metafields
**Taught:** definition ownership and namespace/key stability; scalar/rich/measurement/money/JSON/reference type selection; lists and count/size behavior; reference rendering; `metafield_tag`/manual/`metafield_text` choices; dynamic-source compatibility; merchant-maintainable schema design.
**Introduced terms:** metafield definition, owner type, namespace/key contract, reference list, type-aware renderer, dynamic source, schema migration.
**Assumed known from earlier:** Liquid guards and output context (ch-03); rich content output (ch-32); product/variant data (ch-27 and ch-28).
**Deliberately deferred:** metaobject definitions and reusable entries → ch-34; broader data-model architecture → ch-35; client data/API consumption → ch-37 and ch-38.
### ch-34 — Metaobjects
**Taught:** definitions versus entries; Liquid lookup/reference/template context; publishable web pages and routes; real entity models; page/metafield/metaobject decisions; and compatible settings references.
**Introduced terms:** metaobject definition, metaobject entry, entry handle, publishable entry, metaobject template, embedded entity, entity lifecycle.
**Assumed known from earlier:** metafield types/references/dynamic sources (ch-33); content templates/routing semantics (ch-32).
**Deliberately deferred:** full data-model architecture → ch-35; interactive client consumption → ch-37; API request mechanics → ch-38.
### ch-35 — The `{% form %}` Tag
**Taught:** native form generation and hidden protocol fields; form state/value/error behavior; translated accessible error summaries; and attribute/ID/return-path contracts.
**Introduced terms:** native form contract, generated form field, form return state, translated error field, error summary, progressive form baseline.
**Assumed known from earlier:** Liquid conditional/output/escape discipline (ch-03); cart/customer ownership boundaries (ch-30 and ch-31).
**Deliberately deferred:** browser enhancement lifecycle → ch-37; asynchronous storefront requests → ch-38; form-specific workflows and advanced interactions → ch-36 and beyond.
### ch-36 — Every Form Type
**Taught:** native product/cart/account/address/contact/newsletter/comment/localization/guest/password/gift-card form families, required contexts, data scopes, and tested native recovery paths.
**Introduced terms:** form-family decision, resource-bound form, line item property, cart attribute, form context, recipient-property workflow, native form evidence.
**Assumed known from earlier:** generated form protocol and accessible form state (ch-35); cart/customer/account boundaries (ch-30 and ch-31).
**Deliberately deferred:** JavaScript enhancement → ch-37; asynchronous requests → ch-38; advanced commerce workflows outside theme authority.
### ch-37 — The Section Rendering API
**Taught:** `sections`/`section_id` requests; URL/context/response contracts; filters/cart/pagination partial updates; DOM root swapping; race safety; and server/browser cost modelling.
**Introduced terms:** section-response contract, dynamic section ID, partial-update transaction, stale response, root replacement, current-request token, native navigation fallback.
**Assumed known from earlier:** collection/filter URL semantics (ch-29); cart display boundary (ch-30); native form progressive baseline (ch-35 and ch-36).
**Deliberately deferred:** Cart API mutation implementation → ch-38; component lifecycle design → ch-39; advanced browser data/interaction architecture → ch-40 and ch-41.
### ch-38 — The Cart AJAX API
**Taught:** all Cart AJAX endpoints; locale-aware mutations; bundled section rendering; optimistic reconciliation; JSON error/quantity handling; and confirmed cart pub/sub transitions.
**Introduced terms:** cart transition, mutation coordinator, bundled section response, confirmed cart state, optimistic snapshot, line-key volatility, cart subscriber.
**Assumed known from earlier:** cart and line-item semantics (ch-30); native cart/product forms (ch-35 and ch-36); partial rendering contracts (ch-37).
**Deliberately deferred:** component lifecycle architecture → ch-39; browser data ownership → ch-40; advanced product/media interaction → ch-41.
### ch-39 — Search & Suggest APIs
**Taught:** predictive resource/query contracts, server-rendered `predictive_search` sections, debounced/cancellation-safe request lifecycle, and accessible combobox/listbox keyboard behavior.
**Introduced terms:** predictive resource scope, suggestion lifecycle, server-rendered suggestion slot, active descendant, request throttle recovery, search submission fallback.
**Assumed known from earlier:** full storefront search and content result semantics (ch-29 and ch-32); partial HTML/root replacement (ch-37).
**Deliberately deferred:** durable browser-state ownership → ch-40; media/product interaction systems → ch-41; external search infrastructure.

### ch-40 — Web Components in a Liquid Theme
**Taught:** custom elements as section-bound interaction boundaries; DOM lifecycle versus theme-editor events; Shadow DOM integration costs; attribute-driven Liquid configuration; a lightweight abortable component base; islands and no-JavaScript fallbacks.
**Introduced terms:** component boundary, connection lifecycle, editor adapter, light-DOM default, attribute configuration, theme component base, interaction island.
**Assumed known from earlier:** section schema (ch-17), assets (ch-10), progressive enhancement (ch-30), accessible interaction state (ch-38).
**Deliberately deferred:** product/media behavior -> ch-41; cart mutation -> ch-42; fetch/render protocols -> ch-43.

### ch-41 — When to Reach for a Framework
**Taught:** honest Liquid-storefront trade-offs among Alpine, htmx, Stimulus, and Preact; bundle cost as a buyer-task and conversion-path risk; hard architectural signals for headless.
**Introduced terms:** framework decision record, removal test, client-rendering duplication, interaction-boundary load trigger, headless signal.
**Assumed known from earlier:** progressive enhancement (ch-30), server-rendered fragments (ch-37), accessible interactive state (ch-38), custom-element lifecycle (ch-40).
**Deliberately deferred:** actual cart behavior -> ch-42; migration architecture and external storefront implementation -> later advanced topics.

### ch-42 — Assets & the CDN
**Taught:** theme asset ownership and CDN resolution; URL-filter ownership choices; flat asset delivery names and build-output constraints; platform-managed cache versioning and disciplined busting.
**Introduced terms:** asset ownership, resolved asset URL, flat delivery namespace, build-output translation, cache-busting anti-pattern.
**Assumed known from earlier:** Liquid filters (ch-06), theme file roles (ch-10), progressive enhancement (ch-30).
**Deliberately deferred:** Shopify image objects and responsive media -> ch-43 and ch-44; performance measurement -> later part-07 units.

### ch-43 — Images & Media
**Taught:** image URL transformations; responsive `image_tag` markup and source arithmetic; layout reservation and placeholders; focal points versus art direction; video, external video, 3D media, and SVG boundaries.
**Introduced terms:** rendered slot, source candidate, intrinsic geometry, crop contract, focal-point preservation, art direction, media-type renderer, trusted inline SVG.
**Assumed known from earlier:** asset ownership/CDN URLs (ch-42), Liquid filters (ch-06), component styling (ch-40).
**Deliberately deferred:** responsive-image audit and performance measurement -> ch-44 and later part-07 units.

### ch-44 — CSS Strategy
**Taught:** bundle versus section stylesheet decisions; critical CSS without a build; theme-compatible SCSS/PostCSS/Tailwind output; local design tokens from settings; instance scoping without global leakage.
**Introduced terms:** stylesheet responsibility, critical CSS removal test, build-output contract, local design token, section-root boundary.
**Assumed known from earlier:** asset delivery (ch-42), responsive geometry (ch-43), section settings (ch-17).
**Deliberately deferred:** font loading -> ch-45; broader performance audit -> later part-07 units.

### ch-45 — JavaScript Strategy
**Taught:** script loading modes; bundle/module boundaries; data contracts from Liquid; third-party/app tag governance; final build assets and development watch loops.
**Introduced terms:** parser-blocking script, module boundary, JSON data island, tag inventory, build-output contract, watch-loop split.
**Assumed known from earlier:** component lifecycle (ch-40), asset delivery (ch-42), CSS delivery ownership (ch-44).
**Deliberately deferred:** feature-specific AJAX behavior -> later interaction chapters and performance measurement -> later part-07 units.

### ch-46 — Fonts & Typography
**Taught:** Shopify font picker/object filters; custom-font ownership, preload and font-display decisions; bounded variable-font settings.
**Introduced terms:** font object, font variant fallback, FOUT policy, font ownership path, variable-font axis contract.
**Assumed known from earlier:** asset delivery (ch-42), CSS custom properties and settings tokens (ch-44).
**Deliberately deferred:** full performance measurement and accessibility audits -> later performance units.

### ch-47 — Performance Engineering
**Taught:** Shopify Core Web Vitals/RUM boundaries; dashboard and controlled Lighthouse use; Liquid render profiling; DOM reduction; enforceable CI budgets; documented performance-lab workflow.
**Introduced terms:** performance owner, P75 RUM signal, sandwich view, Liquid hot path, DOM responsibility, performance-budget exception.
**Assumed known from earlier:** asset/media strategy (ch-42–46), section architecture, progressive enhancement.
**Deliberately deferred:** security/accessibility audits and advanced deployment observability -> later units.

### ch-48 — Translations
**Taught:** storefront/schema locale files, translation filter contracts, interpolation/plurals, schema localization, missing-key review, and scalable catalogue governance.
**Introduced terms:** default locale, storefront locale, schema locale, translation key contract, `_html` translation, catalogue inventory.
**Assumed known from earlier:** Liquid filters, JSON schema, section ownership and theme assets.
**Deliberately deferred:** Markets URL/currency behaviour and client-side locale routing -> chapters 49–50.
### ch-49 — Markets, Currency & Regions
**Taught:** market-aware localization context, real country/language forms, active-market money presentation, bounded regional content, catalog ownership, and a single automatic international SEO owner.
**Introduced terms:** localization form, active-market price, market-content owner, route-level market evidence, hreflang source owner.
**Assumed known from earlier:** Liquid objects/forms, translations, theme layout/head composition, and presentation/configuration boundaries.
**Deliberately deferred:** CLI environment management and deployment workflow -> chapter 50.
### ch-50 — The Shopify CLI
**Taught:** command direction and remote-target discipline for `dev`, `pull`, `push`, `publish`, `list`, and `package`; hot-reload boundaries; named TOML environments; preview-surface lifecycle; and safe real-data release practice.
**Introduced terms:** development theme, unpublished candidate, environment precedence, theme target record, code/merchant-state boundary, release rollback target.
**Assumed known from earlier:** default theme structure, source/build output boundary, Git review, Markets route testing, and configuration ownership.
**Deliberately deferred:** CI/CD implementation, Theme Check configuration, and production release automation -> later quality/workflow units.
### ch-51 — Theme Check
**Taught:** static-analysis boundaries; local/editor/CI execution; correctness, composition, performance, deprecation, and accessibility-adjacent checks; YAML policy; custom-check design; finding triage; and merge-gate evidence.
**Introduced terms:** static-analysis boundary, check disposition, severity threshold, scoped suppression, custom-check contract, merge gate.
**Assumed known from earlier:** CLI environments and target records (ch-50), output/build boundary (ch-45), performance ownership (ch-47), translations/schema/theme architecture.
**Deliberately deferred:** CI/CD implementation and release automation -> later quality/workflow units.
### ch-52 — Git & Environments
**Taught:** connected branch-to-theme identity, merchant/configuration ownership, `settings_data.json` reconciliation, JSON-template drift, live-store branching, release/rollback evidence, and production merchant-edit handling.
**Introduced terms:** branch-theme mapping, configuration ownership model, template drift, deploy branch, merchant-edit reconciliation, rollback provenance.
**Assumed known from earlier:** CLI environments and target records (ch-50), Theme Check/static gates (ch-51), source/output boundary, route-level Markets evidence.
**Deliberately deferred:** automated deployment workflows, semantic JSON merge tooling, and GitHub Actions implementation -> later quality/workflow units.
### ch-53 — Code Organization at Scale
**Taught:** naming contracts, internal theme component-library boundaries, standard-library utilities, handoff documentation, internal API evolution, multi-brand portfolio choices, and component recovery/governance.
**Introduced terms:** component contract, standard-library manifest, setting migration, handoff contract, brand variation boundary, shared-base upgrade, contract change inventory.
**Assumed known from earlier:** snippets/render isolation, sections/blocks/schema, CSS/JavaScript ownership, CLI targets, Git branch/theme provenance.
**Deliberately deferred:** automated architectural enforcement, theme app extension packaging, and visual-regression implementation -> later quality/app units.
### ch-54 — Testing
**Taught:** layered theme-test boundaries; deterministic visual baseline and preset matrices; Lighthouse CI versus field performance; buyer-journey smoke tests; edge-data fixtures; and test failure/fixture governance.
**Introduced terms:** test evidence layer, visual baseline contract, preset matrix, smoke-test fixture, edge-data catalogue, fixture governance, test disposition.
**Assumed known from earlier:** Theme Check and merge gates (ch-51), release provenance (ch-52), component contracts (ch-53), performance owner/RUM boundary (ch-47).
**Deliberately deferred:** detailed accessibility audit methodology, browser-automation implementation, and production observability automation -> later quality units.
### ch-55 — AI-Assisted Theme Development
**Taught:** current-reference Dev MCP use; bounded agent workflows; explicit Liquid/schema context; review/security/release guardrails; agent-readable contracts; and autonomy/evidence governance.
**Introduced terms:** current-reference workflow, agent task envelope, context acquisition boundary, protected operation, agent-readable contract, proposal counterfactual.
**Assumed known from earlier:** Theme Check loops, CLI/release targets, component contracts, testing evidence layers, Liquid `{% doc %}` and explicit render inputs.
**Deliberately deferred:** app/agent connector implementation, autonomous production operations, and detailed AI policy/legal governance -> later integrations/operations units.
### ch-56 — Theme App Extensions
**Taught:** app blocks versus app embeds; merchant editor placement/activation; JSON-section `@app` contracts and Apps wrapper behavior; third-party markup containment; versioned app-integration evidence and removal safety.
**Introduced terms:** app block, app embed block, Apps wrapper, `@app` admission, app-autofill ambiguity, outer layout boundary, integration register.
**Assumed known from earlier:** JSON sections/blocks, schema/editor boundaries, asset ownership, performance/privacy review, candidate/release evidence.
**Deliberately deferred:** app extension creation/deployment, app-data metafields, deep-link implementation, and checkout/customer extension development -> later extension units.
### ch-57 — Script Tags, Pixels & Tracking
**Taught:** migration from legacy tracking placements; Web Pixel sandbox/event contracts; Customer Privacy API allowed-state loading; consent-safe custom events; analytics cutover, deduplication, and event governance.
**Introduced terms:** web pixel, strict sandbox, lax sandbox, customer event, custom customer event, allowed-state consent check, pixel inventory, measurement cutover.
**Assumed known from earlier:** app/theme extension boundaries, external asset performance, release evidence, customer-data ownership, Markets/localization context.
**Deliberately deferred:** building an app pixel, vendor-specific analytics configuration, legal advice, and headless privacy implementation -> later app/operations units.
### ch-58 — Checkout Is No Longer Yours
**Taught:** `checkout.liquid`/ScriptTag and Scripts retirement timelines; checkout UI extension targets/capabilities/plan gating; Functions for discounts, delivery, payments, and validation; strict theme cart/pre-checkout boundary; Thank you, Order status, and post-purchase surface selection.
**Introduced terms:** checkout extension target, block/static/runnable target, checkout capability, Shopify Function, cart and checkout validation, Scripts customizations report, pre-checkout contract, Thank you page, Order status page, post-purchase extension.
**Assumed known from earlier:** theme cart rendering, app extension/pixel boundaries, customer-event consent principles, metafield/attribute contracts, candidate/release evidence.
**Deliberately deferred:** building/deploying checkout apps, Function implementation details, payment-provider integration, protected customer-data approval, and live checkout migration -> later application/operations work.
### ch-59 — Customer Accounts Extensibility
**Taught:** current versus legacy customer-account architecture; passwordless/hosted account boundaries; theme-owned storefront doorway versus account-portal limits; customer-account extension targets/capabilities/metafields; B2B company/location-aware design; account analytics and headless decision boundaries.
**Introduced terms:** customer accounts, legacy customer accounts, account portal boundary, customer account UI extension, account extension target, protected customer data, account integration record, company-location scope.
**Assumed known from earlier:** theme/app-extension boundaries, pixels and consent, checkout/account editor concepts, metafield ownership, candidate/release evidence.
**Deliberately deferred:** account-extension implementation/deployment, headless Customer Account API implementation, identity-provider configuration, B2B operations, and production account migration -> later application/operations work.
### ch-60 — Where Liquid Ends
**Taught:** Ajax versus Storefront API ownership/authentication/cart boundaries; Liquid-shell API islands; an evidence-led Hydrogen/Oxygen migration decision; shared-cart/checkout/routing migration concerns; and lifecycle cost/team/maintenance accounting.
**Introduced terms:** Ajax API, Storefront API, API-driven island, architecture register, headless storefront, Hydrogen, Oxygen, vertical migration slice.
**Assumed known from earlier:** Liquid/theme rendering, cart basics, assets/browser interactions, pixels/checkout/account boundaries, candidate/release evidence.
**Deliberately deferred:** full Storefront API implementation, Hydrogen application development, Oxygen deployment, custom-storefront authentication, and headless production migration -> specialised application/operations work.
### ch-61 — Accessible Liquid
**Taught:** semantic Liquid output and generated markup; focus ownership through rerenders/drawers; accessible contracts for variants, facets, carousels, modals and live feedback; merchant-content limits; and automated/manual keyboard-led accessibility audits.
**Introduced terms:** semantic output contract, focus ownership, return-focus target, accessible name, live-region event contract, merchant-content boundary, keyboard pass, accessibility disposition.
**Assumed known from earlier:** Liquid rendering/sections/blocks, browser interaction basics, cart/product data boundaries, candidate/release evidence.
**Deliberately deferred:** a legal conformance assessment, full ARIA widget implementation, assistive-technology research studies, and organization-wide accessibility governance -> later specialist practice.
### ch-62 — SEO from the Template Layer
**Taught:** title/description/canonical/Open Graph rendering; visible-page JSON-LD claim discipline; Product/Offer/Breadcrumb/Organization/Article/FAQ scope; canonical/pagination/filter route analysis; narrow robots and sitemap governance; duplicate URL output verification.
**Introduced terms:** claim inventory, structured-data owner, canonical signal, URL decision record, crawl versus index, robots customization record, rendered-output verification workflow.
**Assumed known from earlier:** Liquid objects/context, themes/layout head, QA/candidate evidence, merchant content and accessibility boundaries.
**Deliberately deferred:** legal SEO advice, ranking prediction, Search Console operations, full schema feature implementation, and third-party SEO-app configuration -> specialised marketing/operations work.
### ch-63 — Privacy, Consent & Compliance
**Taught:** Customer Privacy API loading and Allowed-method gating; consent-change handling; accessible/performance-bounded banner design; technical privacy responsibilities versus merchant/legal ownership; and accessible policy/accessibility-page release records.
**Introduced terms:** allowed processing, processing register, consent-change contract, privacy asset classification, merchant/legal boundary, policy release surface, neutral privacy fixture.
**Assumed known from earlier:** browser assets and progressive enhancement, pixels/event governance, accessibility focus/keyboard contracts, candidate/release evidence.
**Deliberately deferred:** legal advice, jurisdiction-specific GDPR/CCPA analysis, vendor-contract review, privacy-admin configuration, data-subject request handling, and custom-storefront consent installation -> legal/privacy/operations specialists.
### ch-64 — Vintage → OS 2.0 → Theme Blocks
**Taught:** architecture generation inventory; safe Liquid-to-JSON template conversion; local section-block versus reusable Theme Block decision; `content_for 'blocks'` parent contract; and merchant-content preservation/rehearsal/rollback records.
**Introduced terms:** architecture inventory, JSON template instance, Theme Block contract, block-model fork, content preservation ledger, migration outcome, candidate migration rehearsal.
**Assumed known from earlier:** sections/schema, local blocks, app blocks, dynamic sources, theme QA, candidate/release evidence.
**Deliberately deferred:** live theme migration, settings_data transformation, app migration, automated content transfer, CLI deployment, and post-cutover operations -> migration delivery work.
### ch-65 — Dawn vs Horizon
**Taught:** file-by-file architecture comparison; local/monolithic versus composable Theme Block decisions; Web Component/Shadow DOM boundaries; app/DOM/CSS compatibility audit; and evidence-led base-theme selection.
**Introduced terms:** component boundary, dependency audit, compatibility ledger, adaptation path, candidate-only compatibility shim, base-theme selection record.
**Assumed known from earlier:** OS 2.0 templates, sections, Theme Blocks, `content_for`, app blocks, candidate migration and accessibility testing.
**Deliberately deferred:** live Dawn/Horizon migration, installation of a selected Horizon release, app upgrades, Shadow DOM internals, performance benchmarking, and source-control/deployment operations -> implementation delivery.
### ch-66 — Arriving from Another Platform
**Taught:** SFCC/SFRA-to-Shopify translation; Magento/WooCommerce/BigCommerce mental-model mapping; control/velocity/hosting trade-offs; custom-attribute modeling with metafields/metaobjects/references; and frontend-lead re-platforming/gap/cutover checklist.
**Introduced terms:** authority map, source-to-target migration map, target-surface disposition, gap register, data-model migration, cutover communication contract.
**Assumed known from earlier:** Liquid/theme architecture, Ajax and Storefront APIs, extensions/functions, metafields/metaobjects, accessibility/performance/privacy and migration candidate evidence.
**Deliberately deferred:** live data export/import, SFCC controller/cartridge conversion, API authentication implementation, headless build, ERP/OMS integration, redirect deployment, and production cutover -> cross-functional migration delivery.
### ch-67 — Auditing an Inherited Theme
**Taught:** 30-point inherited-theme audit; evidence-led dead/orphaned-code discovery; deprecation portfolio; honest ranges/assumptions; client-ready finding prioritisation and report structure.
**Introduced terms:** audit finding, candidate orphan, proof ladder, deprecation portfolio, finding confidence, gap/readback record, report acceptance baseline.
**Assumed known from earlier:** theme architecture, editor state, app blocks/embeds, candidate testing, platform deprecations, performance/accessibility/privacy and migration evidence.
**Deliberately deferred:** live audit execution, production deletions, client/vendor interviews, Theme Check/Lighthouse runs, actual checkout/pixel migration, and paid proposal negotiation -> authorised delivery work.
### ch-68 — Brief & Architecture
**Taught:** multi-market apparel brief translation; route/content/data architecture; semantic design-token and settings contract; section/block/snippet inventory; and performance/accessibility budget governance.
**Introduced terms:** content decision record, settings contract, component card, market decision log, budget register, budget exception.
**Assumed known from earlier:** theme architecture, metafields/metaobjects, dynamic sources, Theme Blocks, markets, accessibility, performance testing and candidate migration evidence.
**Deliberately deferred:** actual capstone implementation, real market configuration, store-plan activation, source data migration, performance testing against a store, app selection and launch deployment -> later capstone chapters.
### ch-69 — Building the Foundations
**Taught:** layout/section-group/global-setting/color-scheme boundaries; explicit snippet-library contracts; foundation CSS ownership; progressive Web Component lifecycle; and minimal documented event-bus coordination.
**Introduced terms:** section-group contract, color-scheme contract, negative snippet contract, foundation CSS ownership, event vocabulary, foundation contract review.
**Assumed known from earlier:** template/section/block architecture, dynamic source boundaries, semantic settings, accessibility/performance budgets, component cards and candidate validation.
**Deliberately deferred:** capstone commerce interactions, actual cart API use, editor event implementation, app integration, real section-group configuration and production asset testing -> later capstone chapters.
### ch-70 — Building the Commerce Surfaces
**Taught:** composable homepage constraints; URL-driven collection filtering/sorting/pagination; scalable product gallery/option/spec/recommendation contracts; cart-page/drawer section-rendering boundaries; search/account/content template responsibilities; and typed size-guide/store-locator patterns.
**Introduced terms:** commerce surface, transaction boundary, owned fragment, option-value picker, recommendation intent, cart-page fallback, structured content reference.
**Assumed known from earlier:** sections/blocks/snippets, dynamic sources, accessibility, performance, event vocabulary, Ajax/Section Rendering, metaobjects and content decisions.
**Deliberately deferred:** real collection/filter configuration, actual cart mutation, production analytics, account configuration, customer data, maps/geolocation, third-party APIs, recommendation setup and store deployment -> later capstone/operations work.
### ch-70 — Exercise: Repair the commerce-surface boundary
**Practised:** turning six unsafe commerce surfaces into bounded candidate contracts: home rail, URL collection controls, high-variant product selection, guarded section refresh, route/data boundaries, and static structured-location fallback.
**Evidence shipped:** multi-file starter with intentionally unsafe collection/product/cart/locator code and a six-surface authority/fallback record.
**Review focus:** no browser-only collection truth; no full-variant serialization; one form owner; null-fragment/error guard; no global cart/customer event; no assumed map/account/recommendation/metaobject state.
### ch-70 — Solution: Repair the commerce-surface boundary
**Solved:** bounded collection home rail; URL/server-state collection rendering; a single high-variant-aware product form; explicit spec/guide snippets; guarded locale-aware fragment replacement; static locator; and a six-surface verification matrix.
**Key decisions:** `product-card` is display-only; full-page/cart-page/static paths are durable recovery; a null section is failure; every provider/account/metaobject/recommendation/mutation assumption remains a release gate.
### ch-71 — Hardening & Shipping
**Taught:** evidence-based Theme Check/performance/accessibility gates; multi-market/translation matrices; safe defaults/presets; role-based handoff/training; and reversible, observable release/iteration practices.
**Introduced terms:** release evidence row, quality gate, route-state matrix, literal inventory, onboarding safety, rollback artifact, observable hypothesis.
**Assumed known from earlier:** component authority, accessibility, Section Rendering, markets, structured content, testing and deployment boundaries.
**Deliberately deferred:** running tools, accepting actual thresholds, store configuration, translation publishing, analytics/consent, release permissions and live deployment -> verified project operations.
### ch-71 — Exercise: Build a release-evidence packet
**Practised:** replacing unsupported quality/release claims with a route-state evidence matrix, literal inventory, safe default, role handoff, release gate and time-bounded triage record.
**Evidence shipped:** starter theme section plus deficient quality, market, handoff, deploy and triage records for review-driven correction.
**Review focus:** no fabricated tools/scores/targets/markets/monitoring/permissions; every claim has version, fixture, owner, raw-evidence location, decision and `[VERIFY]` boundary.
### ch-71 — Solution: Build a release-evidence packet
**Solved:** source and manual quality evidence matrix; literal/market inventory; neutral merchant-safe onboarding; role handoff/training; gated deployment/observation/iteration; and accountable triage template.
**Key decisions:** candidate records never claim observed results; locale-aware request behavior is cited; unverified store/permission/consent/analytics/release facts remain gates.
### ch-72 — The Professional Layer
**Taught:** Theme Store evidence discipline; client-versus-product boundaries; risk-aware scope; maintenance/platform-change practice; changelog/preview intake; and role-based career development.
**Introduced terms:** requirement matrix, supported configuration envelope, dependency/risk register, platform-change intake, decision record, reconsideration trigger.
**Assumed known from earlier:** theme architecture, structured content, quality/release evidence, markets, performance and accessibility boundaries.
**Deliberately deferred:** real submission eligibility, pricing/terms, legal/tax/employment choices, negotiated maintenance terms, preview access and individual career decisions -> verified project and personal contexts.
### Appendix E — Platform Limits & Quotas
**Taught:** verified template/group/block/file/package/naming ceilings; bounded pagination; cautious `all_products` use; unverified timeout discipline; local budgets; and limit-failure triage.
**Introduced terms:** platform ceiling, local budget, dense-editor fixture, composition inventory, limit-failure classification.
**Assumed known from earlier:** sections/blocks, schema, collections/pagination, structured content, performance evidence and release triage.
**Deliberately deferred:** current `all_products` quota, runtime timeout, plan-specific quotas, app/API quotas and actual store/tool behavior -> verify current authoritative sources.
### Appendix F — Deprecated & Removed
**Taught:** dated migrations for `include`, checkout surfaces, ScriptTags and Shopify Scripts; cautious vintage/account discovery; replacement evidence; and reversible deprecation workflow.
**Introduced terms:** deprecation inventory, replacement-capability matrix, active-use verification, closure review.
**Assumed known from earlier:** snippets, checkout/theme boundaries, Functions, accounts, section architecture and release evidence.
**Deliberately deferred:** real store checkout/account configuration, extensions, app eligibility, consent, customer data, platform permissions and migration outcome -> verify with owners and current sources.
### Appendix G — Snippet Cookbook
**Taught:** forty-four narrow snippet recipes for money, media, icons/navigation, product/collection UI and structured content; plus explicit caller contracts, accessibility tests, asset ownership and lifecycle.
**Introduced terms:** recipe contract, display-only card, snippet caller contract, recipe lifecycle, compatibility window.
**Assumed known from earlier:** render isolation, Liquid objects, product/collection surfaces, accessibility, structured content and component ownership.
**Deliberately deferred:** actual rating/review/filter/unit-price/market/recommendation/JSON-LD/location data and provider behavior -> verify data source and current platform configuration.
### Appendix H — Cheat Sheets (printable)
**Taught:** printable syntax, filter, object, directory, debugging and deprecation cards, extended with component-contract, route-state, safe-data, incident and update workflows.
**Introduced terms:** printable card set, safe data access, card update owner, card retirement record.
**Assumed known from earlier:** Liquid render/objects, theme directories, debugging, accessibility, deprecations and release evidence.
**Deliberately deferred:** actual account/recommendation/filter/metafield/provider/market configurations and current object/filter availability -> verify in current documentation/store context.
### Appendix I — Glossary
**Taught:** the canonical glossary’s architecture, commerce, interaction, operations and professional vocabulary; context distinctions; design-review language; and definition-maintenance discipline.
**Introduced terms:** glossary context check, term-confusion matrix, stable definition, local convention label.
**Assumed known from earlier:** all chapter and appendix terminology, route/data/component boundaries, release evidence and platform-change intake.
**Deliberately deferred:** store-specific object availability, account/market/provider configuration and future platform terminology -> verify current context and documentation.
### Appendix J — Resources
**Taught:** hierarchy of official docs/changelog/reference/community/project/store evidence; reference-theme and tooling boundaries; resource-validation loop; source-map/review practice; and continuing learning cadence.
**Introduced terms:** evidence hierarchy, resource-validation loop, personal source map, bounded review question.
**Assumed known from earlier:** platform change/deprecation, reference themes, testing/release evidence, component contracts and professional practice.
**Deliberately deferred:** access, eligibility, support/certification/partner outcome, actual store configuration and career outcome -> verify with current authorised sources.
### Front Matter — Front Matter & Course Setup
**Taught:** three reading paths, chapter/code conventions, prerequisites, deliberate exclusions, environment preparation, current-version/deprecation discipline and working-agreement setup.
**Introduced terms:** reading mode, course candidate, working agreement, discovery pass, setup evidence.
**Assumed known from earlier:** semantic frontend foundations, Git/npm/terminal/JSON, HTTP and frontend development practice.
**Deliberately deferred:** Shopify account/store/CLI/auth/editor/reference-theme access, actual merchant/admin operations, app/headless implementation and release permissions -> verify authorised project context.
