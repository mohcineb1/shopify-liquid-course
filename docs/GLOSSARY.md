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
| Option-value selection | The ordered selection of product-option value IDs used to determine or request the next product variant state. | ch-28 |
| Top-down availability | An option-value availability model where a value is available when a purchasable path exists beneath it in the selected option tree. | ch-28 |
| Adjacent availability | An option-value availability model that treats choices as graph nodes and asks whether the associated variant is purchasable. | ch-28 |
| Combined-listing sibling | A related product reached when an option value’s `product_url` identifies a separate product in a combined listing. | ch-28 |
| Selected-state boundary | The rule that all dependent purchase surfaces must update from one resolved variant or explicit no-variant state. | ch-28 |
| Bounded variant projection | A deliberately limited JSON serialization of only the variant fields a specific browser component consumes. | ch-28 |
| Collection query state | The server-owned combination of collection filters, sorting, pagination, and relevant result context represented by the current URL. | ch-29 |
| Facet | A storefront filter dimension, such as availability, price, vendor, variant option, or configured metafield. | ch-29 |
| Filter transition URL | The Shopify-generated URL that adds, removes, or clears a filter state while preserving the relevant query contract. | ch-29 |
| Price-range filter | A storefront filter with minimum and maximum values whose parameter names and money context come from the filter object. | ch-29 |
| Pagination window | The bounded server result page established by `{% paginate %}`, including its navigable page state. | ch-29 |
| Page-size budget | A deliberate number of rendered results chosen from card and facet cost rather than an arbitrary maximum. | ch-29 |
| Handle lookup cap | The maximum of 20 unique product handles accessible through `all_products` on a page. | ch-29 |
| Cart state | The current Shopify-owned set of cart items, totals, discounts, currency context, notes, and attributes that the theme must render rather than recalculate. | ch-30 |
| Line-item key | A cart-specific identifier composed from a variant ID and line characteristics; it is unique at a moment but can change after properties or discounts change. | ch-30 |
| Line property | A customer-provided name/value detail attached to one cart line through a product-form or cart API property field. | ch-30 |
| Cart attribute | Additional customer-provided data attached to the cart as a whole rather than to one line item. | ch-30 |
| Discount allocation | The amount and discount application showing how a discount affects an item or cart context. | ch-30 |
| Final line price | The current unit or aggregate line price after line-level discounts, distinct from original price fields. | ch-30 |
| Commerce authority boundary | The distinction between theme display/intent capture and the backend rules that validate pricing, promotions, bundles, and checkout eligibility. | ch-30 |
| Customer context | A Liquid context in which a customer object is defined, generally because the customer is logged in or the template/object explicitly carries customer data. | ch-31 |
| Latest customer accounts | Shopify-controlled customer-account experience extended through supported components and customer account UI extensions rather than theme Liquid account pages. | ch-31 |
| Legacy account template | A `customers/*` Liquid template used by legacy customer accounts; it is a maintenance surface, not the default path for new account work after deprecation. | ch-31 |
| Account component | The Shopify-controlled `<shopify-account>` web component that exposes a header account menu and current sign-in/account experience. | ch-31 |
| Order-history disclosure | The deliberate rendering of buyer-relevant historic order data without exposing payment receipts, operational data, or current-product assumptions. | ch-31 |
| Presentation gate | A customer-state or tag-based UI condition that changes what is shown but does not enforce authorization. | ch-31 |
| Content-object contract | The object-specific fields, lifecycle, and semantic rendering rules that distinguish articles, pages, comments, blogs, and search results. | ch-32 |
| Rich-text rendering boundary | The rule that structured Shopify rich content uses its type-aware rendering contract while external or untrusted text never gains arbitrary HTML execution. | ch-32 |
| Editorial taxonomy | Navigable content classification, such as article tags, owned by the blog/archive result state rather than a client-side subset. | ch-32 |
| Result shaping | Selecting a type-appropriate, bounded set of fields for a result surface rather than forcing every resource into one data model. | ch-32 |
| Predictive-search context | The section/API rendering context in which the `predictive_search` object is populated for a query. | ch-32 |
| Full-search recovery | An ordinary full-search route available when a compact suggestion surface is incomplete or client enhancement fails. | ch-32 |
| Metafield definition | The typed, validated merchant-data contract that names an owner resource, namespace/key, and intended value model. | ch-33 |
| Owner type | The Shopify resource class to which a metafield definition/value belongs, such as product, variant, collection, page, or metaobject. | ch-33 |
| Namespace/key contract | The stable two-part Liquid access path of a metafield, treated as a theme and integration API rather than a cosmetic label. | ch-33 |
| Reference list | A list metafield whose values resolve to Shopify resource objects and whose documented length is obtained with `count`. | ch-33 |
| Type-aware renderer | A deliberate output method, such as `metafield_tag`, that respects the type and semantic representation of a metafield. | ch-33 |
| Dynamic source | A compatible resource attribute, metafield, or visible metaobject field bound to a section or block setting in the theme editor. | ch-33 |
| Schema migration | A planned change from one merchant-data definition/model to another that preserves or deliberately retires consumers and values. | ch-33 |
| Metaobject definition | The reusable schema and capability contract defining fields, validation, and lifecycle for a class of structured merchant content. | ch-34 |
| Metaobject entry | One record of a metaobject definition, containing typed field values and a unique handle. | ch-34 |
| Entry handle | The unique identifier used with a metaobject definition type to access a specific entry in Liquid. | ch-34 |
| Publishable entry | A metaobject entry eligible for storefront output according to its definition capability and active publication state. | ch-34 |
| Metaobject template | A reusable theme template whose `metaobject` object is the entry currently rendered for a metaobject page. | ch-34 |
| Embedded entity | A structured record rendered inside another resource/page rather than as its own canonical route. | ch-34 |
| Entity lifecycle | The planned draft, review, publication, reference, update, and retirement process for structured content records. | ch-34 |
| Native form contract | Shopify’s form-type-specific endpoint, generated fields, submission protocol, and returned server state created by the Liquid `form` tag. | ch-35 |
| Generated form field | A hidden or type-specific input emitted by Shopify’s `form` tag that should survive theme customization. | ch-35 |
| Form return state | The documented post-render form values, errors, and success information supplied through the `form` object. | ch-35 |
| Translated error field | The localized field name accessed from `form.errors.translated_fields` for an error category. | ch-35 |
| Error summary | An accessible early-form message group that identifies submission problems and links to associated controls where possible. | ch-35 |
| Progressive form baseline | A native, no-JavaScript-capable form workflow retained as the functional and recovery path for enhancements. | ch-35 |
| Form-family decision | Selecting a native Shopify form by intended server workflow, required context, and field contract rather than visual similarity. | ch-36 |
| Resource-bound form | A native form type that requires a Shopify object such as product, cart, article, or address to establish its transaction context. | ch-36 |
| Line item property | Buyer-supplied contextual data submitted as `properties[...]` with a product form and attached to the resulting cart line. | ch-36 |
| Cart attribute | Cart-level buyer/context data submitted as `attributes[...]`, distinct from a line item property or cart note. | ch-36 |
| Form context | The template/resource/account/merchant configuration in which a particular native form type is valid and meaningful. | ch-36 |
| Recipient-property workflow | The documented gift-card delivery flow that submits recipient data as required product-form line item properties. | ch-36 |
| Native form evidence | Recorded rendered-markup and behavior checks proving a form remains aligned with its expected Shopify server contract. | ch-36 |
| Section-response contract | The explicit URL, requested section IDs, response shape, DOM roots, null/error handling, and recovery behavior for a partial server-render update. | ch-37 |
| Dynamic section ID | The rendered instance identifier Shopify assigns to a section in a JSON template or section group, distinct from its section type/file name. | ch-37 |
| Partial-update transaction | The ordered request, validation, parse, coherent DOM commit, restoration, history, and recovery lifecycle of a section update. | ch-37 |
| Stale response | A valid response whose requested UI state has been superseded by a later interaction and must not mutate the current DOM. | ch-37 |
| Root replacement | Replacing a validated stable section root with its server-rendered counterpart rather than splicing unverified inner markup. | ch-37 |
| Current-request token | A monotonically increasing request identity used to reject a response that is no longer current after asynchronous overlap. | ch-37 |
| Native navigation fallback | The ordinary URL/form behavior preserved as accessible recovery when a partial JavaScript update fails or is unavailable. | ch-37 |
| Cart transition | A named, ordered cart mutation lifecycle from intent through server reconciliation, UI commit, subscriber notification, and failure recovery. | ch-38 |
| Mutation coordinator | The single theme-side module that executes cart mutations, validates/reconciles responses, and publishes confirmed changes. | ch-38 |
| Bundled section response | A cart-mutation response that includes updated cart data and requested rendered sections from the same server-side transition. | ch-38 |
| Confirmed cart state | Cart data or rendered cart UI accepted from a current authoritative Shopify response, not a user-action prediction. | ch-38 |
| Optimistic snapshot | The prior confirmed UI/state retained so a temporary cart prediction can reconcile or roll back safely. | ch-38 |
| Line-key volatility | The fact that a cart line key can change when its characteristics, such as properties or discounts, change. | ch-38 |
| Cart subscriber | An independently owned component that renders a confirmed cart transition without issuing its own competing cart mutation. | ch-38 |
| Predictive resource scope | The intentionally selected predictive resource types, limits, limit distribution, and availability policy for a suggestion request. | ch-39 |
| Suggestion lifecycle | The explicit idle, pending, open, empty, error/unavailable, and committed-navigation states of predictive search. | ch-39 |
| Server-rendered suggestion slot | A stable browser container whose content is supplied by a Liquid section rendered with the `predictive_search` object. | ch-39 |
| Active descendant | The `aria-activedescendant` relationship that exposes the current combobox option while focus stays in the input. | ch-39 |
| Request throttle recovery | The behavior that reduces/refrains from predictive requests and preserves full search after a 429 response. | ch-39 |
| Search submission fallback | The ordinary localized search-form submission retained when prediction is disabled, unavailable, empty, or fails. | ch-39 |
| Component boundary | The server-rendered DOM region whose interactive behavior is owned by one custom-element instance. | ch-40 |
| Connection lifecycle | The `connectedCallback()` and `disconnectedCallback()` transitions for a particular custom-element instance. | ch-40 |
| Editor adapter | Small document-level code that translates a Shopify theme-editor event into a narrow component method. | ch-40 |
| Light-DOM default | The decision to preserve ordinary theme DOM and its extension contracts unless Shadow DOM has a specific tested benefit. | ch-40 |
| Attribute configuration | Escaped scalar Liquid settings passed from server markup to a component through HTML attributes. | ch-40 |
| Interaction island | A local enhanced interaction whose HTML baseline remains useful without its JavaScript. | ch-40 |
| Framework decision record | A testable written statement of an interaction’s buyer task, baseline, boundary, loading, ownership, failure behavior, and removal test. | ch-41 |
| Removal test | The check that deleting an enhancement runtime still leaves the buyer’s core task operational. | ch-41 |
| Client-rendering duplication | Recreating in client code markup, localization, or rules already owned by Liquid. | ch-41 |
| Interaction-boundary load trigger | The moment a runtime is loaded only after the buyer reaches the feature that needs it. | ch-41 |
| Headless signal | An explicit rendering, routing, workflow, state, or multi-channel requirement that a theme cannot responsibly own. | ch-41 |
| Asset ownership | The decision about whether a file belongs to theme source, Shopify Admin Files, or a Shopify-owned namespace. | ch-42 |
| Resolved asset URL | The CDN URL Shopify emits for a named theme asset through `asset_url`. | ch-42 |
| Flat delivery namespace | The theme asset naming contract that avoids assuming nested public paths. | ch-42 |
| Build-output translation | The deliberate mapping from organized development sources to final theme asset names. | ch-42 |
| Cache-busting anti-pattern | Adding arbitrary URL variation instead of deploying changed assets through the platform’s versioned resolution. | ch-42 |
| Rendered slot | The CSS space an image occupies, used to derive accurate `sizes` and candidate widths. | ch-43 |
| Source candidate | One width-qualified image URL offered in a responsive `srcset`. | ch-43 |
| Intrinsic geometry | The image dimensions and aspect ratio information that reserves layout space before loading. | ch-43 |
| Crop contract | The documented decision about what image content may be discarded to fill a target aspect ratio. | ch-43 |
| Focal-point preservation | Using merchant-defined focal positioning to retain the intended subject within a crop. | ch-43 |
| Art direction | Choosing a different image composition for a different responsive or contextual presentation. | ch-43 |
| Trusted inline SVG | Reviewed theme-owned SVG markup emitted directly into the document for a specific UI purpose. | ch-43 |
| Stylesheet responsibility | The documented base, feature, section, or output role assigned to a CSS file. | ch-44 |
| Critical CSS removal test | A cold-load check that validates whether a small inline rule set protects essential initial geometry. | ch-44 |
| Build-output contract | The declared mapping from source styles to final theme asset names and includes. | ch-44 |
| Local design token | A bounded CSS custom property emitted on a section root from merchant configuration. | ch-44 |
| Section-root boundary | The selector and variable boundary that prevents one section instance’s styles from leaking into another. | ch-44 |
| Parser-blocking script | An external script that stops DOM construction until it loads and executes. | ch-45 |
| Module boundary | The route and component ownership boundary used to decide which JavaScript ships together. | ch-45 |
| JSON data island | An inert `application/json` script node that transfers structured Liquid data to nearby JavaScript. | ch-45 |
| Tag inventory | A recorded owner, trigger, loading, consent, and removal contract for external scripts. | ch-45 |
| Watch-loop split | The distinction between a source bundler rebuilding assets and Shopify CLI syncing final theme files. | ch-45 |
| Font object | The Shopify Liquid value returned by a `font_picker` setting, exposing family, variants, fallback and metadata. | ch-46 |
| Font variant fallback | The explicit available font used when a requested `font_modify` variant returns nil. | ch-46 |
| FOUT policy | The deliberate readable-fallback and swap behavior selected through `font-display` and fallback metrics. | ch-46 |
| Font ownership path | The correct Shopify delivery location and URL filter for a font based on theme-management workflow. | ch-46 |
| Variable-font axis contract | The verified supported axis range that a bounded merchant setting may safely expose. | ch-46 |
| Performance owner | The theme, app, resource, route, or environment factor accountable for an observed performance cost. | ch-47 |
| P75 RUM signal | The 75th-percentile real-user metric used by Shopify performance reporting. | ch-47 |
| Sandwich view | Theme Inspector aggregation that separates repeated node self time from total time including children. | ch-47 |
| Liquid hot path | A repeatedly executed Liquid tag, filter, loop, or include responsible for material server render cost. | ch-47 |
| DOM responsibility | The semantic, styling, editor, or scripting job that justifies a rendered DOM node. | ch-47 |
| Performance-budget exception | A documented time-limited deviation from a CI performance rule with owner and follow-up measurement. | ch-47 |
| Default locale | The one `*.default` locale file per storefront or schema catalog type that defines a theme’s baseline translations. | ch-48 |
| Storefront locale | A `.json` locale catalog used by `t` for customer-facing theme language. | ch-48 |
| Schema locale | A `.schema.json` locale catalog used by schema `t:` references for merchant-facing editor text. | ch-48 |
| Translation key contract | The stable key, interpolation names, plural forms, audience, and context agreed between Liquid and a locale catalog. | ch-48 |
| HTML translation | A translation whose key ends `_html`, intentionally emitted unescaped and therefore subject to markup review. | ch-48 |
| Catalogue inventory | A maintained record of translation keys, audiences, variables, ownership, and source surfaces. | ch-48 |
| Development theme | A temporary, hidden store theme used by `shopify theme dev` to render local theme files against store data. | ch-50 |
| Unpublished candidate | A non-live theme-library entry used as a durable remote review or release target. | ch-50 |
| Environment precedence | The CLI rule that command flags override environment variables, which override a named `shopify.theme.toml` environment. | ch-50 |
| Theme target record | The recorded store, theme ID, role, environment, Git revision, and command context for a remote theme operation. | ch-50 |
| Code/merchant-state boundary | The explicit decision about whether a file or value is governed by version-controlled theme code or merchant-administered configuration. | ch-50 |
| Release rollback target | A previously verified remote theme/version selected in advance for recovery from a faulty storefront release. | ch-50 |
| Static-analysis boundary | The distinction between source contracts Theme Check can inspect and runtime/storefront behavior it cannot execute or prove. | ch-51 |
| Check disposition | The documented decision to fix, configure, locally suppress, defer, or escalate a Theme Check finding. | ch-51 |
| Severity threshold | The configured finding level that makes a Theme Check run fail, such as an error-level merge gate. | ch-51 |
| Scoped suppression | A minimal documented Theme Check disable comment limited to the relevant rule and source span. | ch-51 |
| Custom-check contract | A versioned team convention with named diagnostics, fixtures, configuration, owner, and maintenance policy. | ch-51 |
| Merge gate | A reproducible decision rule that blocks integration until agreed build and static-quality evidence is satisfied. | ch-51 |
