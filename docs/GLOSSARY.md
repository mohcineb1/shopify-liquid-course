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
