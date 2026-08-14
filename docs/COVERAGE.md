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
