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
