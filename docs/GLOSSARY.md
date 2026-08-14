# Glossary

One agreed term per concept, used identically across every chapter. Add on first
use; never introduce a synonym for something already listed.

| Term | Definition | First used |
|---|---|---|
| Liquid | Shopify's sandboxed, server-side template language. | ch-01 |
| Drop | A lazy proxy object exposing Shopify data to Liquid. Property access can be expensive. | ch-03 |
| Section | A `.liquid` file in `sections/` with a schema, addable to templates and section groups. | ch-17 |
| Theme block | A reusable `.liquid` file in `blocks/`, usable across sections and nestable. | ch-18 |
| Section block | A block defined inside a single section's schema, usable only there. | ch-18 |
| App block | A block supplied by a merchant-installed app via a theme app extension. | ch-18 |
| Section group | A JSON file composing sections into a layout region (header, footer, aside). | ch-16 |
| Private block | A theme block whose filename begins with an underscore; excluded from the `@theme` wildcard and only available where a parent lists it by type. | ch-18 |
| Static block | A theme block rendered at a fixed position by `{% content_for 'block' %}`. Merchants can hide it but not delete or reorder it. | ch-18 |
| `@theme` wildcard | A block type entry admitting every non-private theme block in `blocks/`. | ch-18 |
| Block picker | The theme editor UI a merchant uses to add a block to a section. | ch-18 |
| Liquid tag | An instruction enclosed in `{% %}` that controls flow, rendering, output, or theme behavior. | app-a |
| Static section | A section rendered with `{% section %}`; merchants cannot add, remove, or reorder it like a section in a JSON template or section group. | app-a |
| Snippet | A reusable Liquid file in `snippets/`, rendered with `{% render %}` and isolated from caller-created variables unless they are passed as parameters. | app-a |
| Liquid filter | A transformation applied with the pipe operator (`|`) to a Liquid value; chained filters receive the preceding filter’s output from left to right. | app-b |
| Context-bound filter | A filter whose valid input depends on a particular Shopify object or rendering context, such as a cart, form, customer, or media object. | app-b |
| Liquid object | A Shopify-supplied data object available to Liquid in a documented global, template, or local rendering context. | app-c |
| Template-scoped object | A Liquid object supplied by a particular template or resource context, such as `product` on a product template or `collection` on a collection template. | app-c |
| Traversal access | Reading an associated object or collection from a Liquid object, such as `cart.items` or `product.variants`, rather than a scalar property already on the current Drop. | app-c |
| Input setting | A schema entry that stores a merchant-configurable value and is defined by a documented setting `type`. | app-d |
| Schema home | The file and schema scope in which a setting is declared: a section, a local section block, a theme block, or `settings_schema.json`. | app-d |
| Resource picker | An input setting that selects a Shopify resource and returns its Liquid object or `blank`, rather than a free-form identifier. | app-d |
| Schema placement constraint | A validation rule governing where a schema attribute may be used, such as theme-only color palettes or mutually exclusive `enabled_on` and `disabled_on`. | app-d |
| Render context | The documented request-specific objects and settings Shopify makes available to a Liquid template during one render. | ch-01 |
| Template language | A language that combines fixed source with supplied data to produce a response, rather than an unrestricted application runtime. | ch-01 |
| Runtime boundary | The separation of capabilities between Shopify’s Liquid render, the buyer’s browser, a Function target, and a headless application runtime. | ch-01 |
| Theme render | Shopify’s constrained server-side execution of a theme’s Liquid source for a storefront response. | ch-01 |
| Headless storefront | A custom storefront that consumes Shopify commerce APIs and owns its application runtime rather than using the native theme rendering model. | ch-01 |
| Hydration | The browser-side process by which a framework attaches its client runtime, state, and event handlers to server-rendered markup. | ch-02 |
| Build step | An authoring process that transforms source assets before delivery; Shopify Liquid does not perform one as part of a theme render. | ch-02 |
| Bundler | A tool that packages client-side modules into delivery assets; optional authoring tooling, not a Liquid runtime capability. | ch-02 |
| Object graph | The documented set of Shopify objects available from a render context and the relationships that can be traversed from them. | ch-03 |
| Global object | A Liquid object documented as broadly available across Shopify theme Liquid files, subject to its own access contract. | ch-03 |
| Scoped object | A Liquid value supplied by an enclosing rendering unit or tag, such as `section`, `block`, or a loop item, rather than globally. | ch-03 |
| Output markup | Liquid syntax enclosed in `{{ }}` that renders a value into the response. | ch-04 |
| Whitespace control | A hyphen placed inside a Liquid delimiter to trim adjacent source whitespace from rendered output. | ch-04 |
| Raw block | A `{% raw %}`…`{% endraw %}` region in which Liquid leaves enclosed source literal rather than parsing Liquid delimiters. | ch-04 |
| Doc block | A `{% doc %}`…`{% enddoc %}` region that documents a Liquid file’s purpose and contract without rendering its documentation to the storefront. | ch-04 |
| Truthiness | The Liquid rule that a value is falsy only when it is `false` or `nil`; empty strings, empty arrays, and `0` remain truthy. | ch-05 |
| EmptyDrop | A Shopify empty object-shaped result whose handling follows the contract of the specific lookup or object surface. | ch-05 |
| Blank comparison | A comparison to `blank` that tests presentation-level absence, including absent, false, or content-empty values. | ch-05 |
| Empty comparison | A comparison to `empty` that tests whether a string or collection is empty, rather than the broader concept of presentation absence. | ch-05 |
| Type coercion | A documented transformation of a Liquid value’s usable representation, often performed deliberately through a filter. | ch-05 |
| Silent failure | Liquid’s behavior of rendering a missing or invalidly addressed value as no visible output rather than throwing a storefront runtime exception. | ch-05 |
| Rendered-string semantics | The behavior of `capture`, which stores the rendered content of its block as a string rather than preserving a source object or calculation value. | ch-06 |
| Counter namespace | The separate named-counter space used by `increment` and `decrement`, independent of values made with `assign` or `capture`. | ch-06 |
| Render isolation | The boundary created by `render` in which a snippet receives only its documented arguments rather than a caller’s arbitrary local variables. | ch-06 |
| Shadowing | Reusing a name in a narrower context so that it obscures an already meaningful outer value. | ch-06 |
| Snippet input contract | The explicit named values a snippet expects at its render call and may rely on inside its isolated scope. | ch-06 |
| Branch order | The ordered priority of `if`, `elsif`, and `else` branches, where the first matching condition determines the rendered result. | ch-07 |
| Value dispatch | Selecting output from one expression’s known literal variants through `case` and `when`. | ch-07 |
| Right-to-left precedence | Liquid’s evaluation order for compound `and` and `or` conditions, which cannot be changed with parentheses. | ch-07 |
| Intermediate decision | A named assigned flag that expresses one business condition before a later branch renders its outcome. | ch-07 |
| Ternary-style pattern | Assigning a normal value first and replacing it in an explicit exception branch because Liquid has no ternary expression. | ch-07 |
| Fallback operator | The `default` filter used to render an alternative when a value is blank, without validating the source contract. | ch-07 |
| Loop boundary | The declared source and parameters that determine which members a loop may traverse and render. | ch-08 |
| Loop metadata | The `forloop` values that describe the current iteration’s position, length, and parent traversal context. | ch-08 |
| Collection-empty branch | The `else` branch of a `for` tag, rendered only when its input collection has no members. | ch-08 |
| Cycle group | A named `cycle` sequence whose alternating values are independent of other cycle sequences in the same loop. | ch-08 |
| Iteration cost curve | The multiplicative increase in rendered work caused by nested loops and each iteration body’s additional traversal or rendering. | ch-08 |
| Filter pipeline | A left-to-right sequence in which each Liquid filter receives and transforms the preceding value. | ch-09 |
| Output-context encoding | A transformation selected for the value’s final boundary, such as HTML text, a URL component, or serialized JSON. | ch-09 |
| Minor-unit money arithmetic | Calculation that keeps a Shopify money amount in its integer minor-unit representation until money formatting. | ch-09 |
| Array shaping | Deliberate transformation of an existing array through filters such as `map`, `where`, `compact`, `sort`, or `join`. | ch-09 |
| Display boundary | The last transformation point where a source value is formatted for a specific reader or rendering context. | ch-09 |
| Shopify-owned output filter | A Liquid filter whose correct input and output behavior depends on a Shopify-managed object, context, or runtime contract. | ch-10 |
| Resource home | The Shopify-managed location that owns a resolved resource, such as a theme asset, uploaded file, media object, or platform asset. | ch-10 |
| Type-aware metafield rendering | Rendering a metafield through its declared value-type contract rather than assuming its namespace and key imply a text representation. | ch-10 |
| Generated markup contract | The semantic and contextual obligation that remains when a filter produces HTML rather than a plain value. | ch-10 |
| Structured-data boundary | A deliberate JSON output surface containing only the page-relevant fields and representation a consuming system expects. | ch-10 |
| Drop interface | The documented, context-controlled Liquid surface through which Shopify exposes a resource’s permitted properties and relationships. | ch-11 |
| Deferred relationship access | A Drop relationship read whose resolution may be delayed until the template requests it. | ch-11 |
| Access shape | The combined source, cardinality, nested traversal, and render-boundary pattern that determines a Liquid data request’s review cost. | ch-11 |
| Public payload contract | The explicit list of serialized fields intentionally exposed in storefront HTML for a browser consumer. | ch-11 |
| Payload minimization | Limiting rendered JSON to the smallest declared public data set a consumer requires. | ch-11 |
| Silent output absence | A Liquid result in which an unavailable, blank, or false value produces no visible output without a parse or render error. | ch-12 |
| Diagnostic boundary | A deliberately minimal development output surface used to test one server-side data hypothesis. | ch-12 |
| Reproduction state | The recorded route, preview, editor, and resource conditions required to observe a specific theme behavior. | ch-12 |
| Environment guard | A team-controlled condition that prevents development-only diagnostic output from rendering in a normal storefront response. | ch-12 |
| Flame-profile hypothesis | A concrete explanation of measured render work that can be tested by one comparable template change. | ch-12 |
| Directory contract | The Shopify-defined runtime meaning assigned to a theme directory and the files it contains. | ch-13 |
| Special file | A theme file whose location, filename, or structure Shopify interprets for rendering, editor, configuration, localization, or deployment behavior. | ch-13 |
| Resource home | The platform-recognized location that owns a theme resource and determines how it is resolved or consumed. | ch-13 |
| Theme composition graph | The route-to-template-to-section-to-block-or-snippet relationship through which a theme assembles storefront output. | ch-13 |
| Architecture surface | A file or platform boundary whose shape creates an observable contract for Shopify, merchants, browsers, or theme developers. | ch-13 |
| Document frame | The layout-owned HTML document structure surrounding the active template’s rendered page composition. | ch-14 |
| Header injection slot | The single `content_for_header` placeholder in a layout head where Shopify emits platform-managed head output. | ch-14 |
| Layout render slot | The `content_for_layout` placeholder through which the active template’s rendered output enters a layout. | ch-14 |
| Alternate layout | A distinct document frame explicitly selected for a template when its global page shell truly differs. | ch-14 |
| Special layout contract | Platform-defined behavior associated with a special layout filename such as `password.liquid` or `gift_card.liquid`. | ch-14 |
| Template family | The base route and resource category, such as product or collection, that determines a template’s primary storefront contract. | ch-15 |
| Template suffix | The alternate composition identifier appended to a base template type, such as `promo` in `product.promo.json`. | ch-15 |
| Section instance | A configured occurrence of a section type declared by an ID, type, and settings in template composition. | ch-15 |
| Composition manifest | The JSON template structure that declares section instances, their configuration, and their rendered order. | ch-15 |
| Assignment lifecycle | The operational management of merchant-assigned templates through creation, replacement, migration, and removal. | ch-15 |
| Section group | A Shopify-managed ordered composition of sections mounted once in a persistent layout region. | ch-16 |
| Persistent composition boundary | A layout-owned region whose configurable section composition applies across the relevant document frame. | ch-16 |
| Group mount | The deliberate layout position where a section group renders through the `sections` tag. | ch-16 |
| Group-level composition | Merchant-managed section ordering for persistent layout content rather than one route template. | ch-16 |
| Overlay group | A persistent section-group region used as a document mount for global drawers, popup layers, or announcement infrastructure. | ch-16 |
| Section type | The Shopify-recognized section file and schema that define a reusable merchant-configurable component capability. | ch-17 |
| Section instance | One rendered, configured occurrence of a section type with its own ID, settings, blocks, and placement. | ch-17 |
| Schema contract | The validated editor-facing definition of a section’s settings, blocks, limits, placement, defaults, and localized labels. | ch-17 |
| Static section | A section rendered from Liquid at a fixed code-defined placement using the `section` tag. | ch-17 |
| Dynamic section | A schema-backed section instance placed and ordered through a JSON template or section group. | ch-17 |
| Placement restriction | A schema rule that limits the templates or groups where a section can be added. | ch-17 |
| Aggregated section resource | CSS or JavaScript declared in a section resource block that Shopify aggregates for the sections rendered on a page. | ch-17 |
| Public block | A theme block file intended to be available as an editor-addable child type in compatible parent contracts. | ch-19 |
| Private block | An underscore-prefixed theme block used as an internal compositional dependency rather than an editor-addable public type. | ch-19 |
| Parent block contract | The declared layout, semantics, inputs, compatibility, and fallback rules a parent establishes for its child block region. | ch-19 |
| Open block acceptance | A parent block or section capability that accepts compatible types through wildcard entries such as `@theme` or `@app`. | ch-19 |
| Static theme block | A fixed-position block declared by its parent that can be configured or hidden but not normally deleted or reordered. | ch-19 |
| Block library governance | The inventory, naming, usage tracing, deprecation, and cleanup discipline applied to theme block files. | ch-19 |
| Child render slot | The `{% content_for 'blocks' %}` position where Shopify renders a parent instance’s configured dynamic child blocks. | ch-20 |
| Static block render | The singular `content_for 'block'` call that renders one declared fixed-position static block by type and ID. | ch-20 |
| Composition order source of truth | The Shopify JSON/editor configuration that determines the order of dynamic block instances. | ch-20 |
| Child wrapper API | An explicit snippet interface that receives already-rendered child content captured from a `content_for` slot. | ch-20 |
| Composable parent contract | The bounded purpose, child eligibility, ordering, semantics, empty-state, and lifecycle rules of a parent section or block. | ch-20 |
| Render isolation | The explicit snippet scope created by `render`, which requires values to cross the call boundary as parameters. | ch-21 |
| Snippet API | The documented required inputs, optional defaults, valid shapes, guards, and output behavior of a reusable snippet. | ch-21 |
| Guard clause | An early snippet decision that handles a missing or invalid required input before incomplete markup is emitted. | ch-21 |
| Recursive snippet | A snippet that renders a smaller child portion of a hierarchical input through an explicit self-render call. | ch-21 |
| Snippet documentation | A colocated `{% doc %}` description of snippet purpose, parameters, types, defaults, and output. | ch-21 |
| Renderer boundary | The explicit division between a caller that selects data and a snippet that renders supplied data. | ch-21 |
| Settings schema API | The versioned global editor contract formed by setting IDs, types, groups, defaults, labels, and descriptions in `settings_schema.json`. | ch-22 |
| Merchant-owned state | Theme configuration values retained for a merchant in `settings_data.json`, which schema changes must preserve or deliberately migrate. | ch-22 |
| Conditional setting | A setting whose editor visibility is controlled by a predicate such as `visible_if`, while its persisted value still requires safe rendering behavior. | ch-22 |
| Color scheme | A named, coherent selection of design-token values applied as a system instead of independent local color overrides. | ch-22 |
| Settings ownership | The choice of whether a decision belongs to global theme settings, a section, a block, a template, or a content resource. | ch-22 |
| Editor instance boundary | The stable root DOM scope for one section or block instance that the theme editor can mount, target, replace, select, or reorder. | ch-23 |
| Editor identity attribute | The Shopify-generated attributes emitted through `section.shopify_attributes` or `block.shopify_attributes` to connect editor actions with rendered markup. | ch-23 |
| Lifecycle cleanup | The explicit destruction of listeners, observers, timers, and third-party state when an editor-managed instance unloads. | ch-23 |
| Dynamic source | A compatible editor connection between a setting and structured data available from the current resource context. | ch-23 |
| Onboarding default | A safe initial setting or preset value that produces a usable new installation without overwriting merchant-owned configuration. | ch-23 |
| Generated theme block | A theme block created through the theme editor’s generation workflow and retained as a Liquid file in the theme `blocks/` directory. | ch-24 |
| Acceptance surface | A section or wrapper contract that intentionally allows a category of child blocks such as `@theme` or `@app`. | ch-24 |
| Generated-block wrapper | The special `_blocks.liquid` section used by Shopify to situate generated theme blocks that are added as a new section. | ch-24 |
| Wrapper precondition | A required capability of `_blocks.liquid`: `@theme`, `@app`, presets, a `content_for 'blocks'` slot, and no `templates` restriction. | ch-24 |
| Generated-code review | The accessibility, responsiveness, compatibility, performance, token, and ownership assessment applied before retaining generated block code. | ch-24 |
| Liquid-first composition | The developer-preview model in which a Liquid template names and composes page blocks directly rather than relying only on JSON composition. | ch-25 |
| Direct block call | A developer-preview `{% block %}` invocation that renders a named theme block from `blocks/` with parameters and optional body content. | ch-25 |
| Block body content | The markup nested between a direct block call and its end tag, rendered by the block through `block.content`. | ch-25 |
| Named partial | A developer-preview region of server-rendered HTML declared with `{% partial %}` and addressable for a targeted update. | ch-25 |
| Partial refresh | A request-and-apply update that replaces one or more named partial regions without a full page reload. | ch-25 |
| Preview-track discipline | The isolation, validation, explicit labeling, observability, and reversibility required when evaluating an unstable platform feature. | ch-25 |
| Request-scoped context | Information that belongs to the current storefront request, such as host, path, locale, page type, or editor state, rather than to the shop resource. | ch-26 |
| Route-generated URL | A storefront URL produced by a `routes` property so it follows the store’s supported URL, account, language, and market contracts. | ch-26 |
| Localization selection | The country, language, and market currently selected for a storefront request, distinct from the countries and languages available to choose. | ch-26 |
| Navigation tree | The merchant-managed hierarchy of menu links accessed through `linklists` and rendered through `link` objects and their children. | ch-26 |
| Context audit | The practice of recording data ownership, minimum context, absence behavior, and rendering purpose before introducing a global Liquid read. | ch-26 |
| Current variant | The selected or deliberate fallback variant whose price, media, availability and purchase constraints a product surface must render consistently. | ch-27 |
| Variant deep link | A product URL whose `variant` parameter identifies a product-page variant selection. | ch-27 |
| Price range | Product-level minimum/maximum pricing data used to summarize multiple variants, distinct from a selected variant’s transactional price. | ch-27 |
| Quantity rule | The context-sensitive minimum, maximum and increment contract governing purchasable quantity for a variant. | ch-27 |
| Quantity price break | A context-sensitive variant pricing tier for a qualifying quantity, often supplied by a B2B catalog. | ch-27 |
| Selling-plan allocation | The selected or available plan-specific purchase and price result associated with a variant. | ch-27 |
| Product media ordering | The product-owned order of media objects, which can include images, videos, 3D models and external videos. | ch-27 |
