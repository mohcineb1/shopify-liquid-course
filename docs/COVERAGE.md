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
