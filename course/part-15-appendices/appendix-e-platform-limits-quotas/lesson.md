<!-- STATUS: final -->
---
id: app-e
title: "Platform Limits & Quotas"
part: 15
words: 2350
---

# Appendix E — Platform Limits & Quotas

Limits are design inputs, not errors to discover at release. A theme that only works until an editor adds the next block, a content team translates the next locale, or a catalog reaches the next pagination boundary is not robust. Use this appendix as a planning and review reference. It reproduces only the verified values in `docs/DEPRECATIONS.md` (verified 2026-08-13); any quota, timeout, API behavior, plan entitlement, store setting, app restriction or future platform change not recorded there stays `> [VERIFY]`.

A limit has four practical effects: it constrains architecture, shapes editor experience, creates a test boundary, and requires an operational response before it becomes a blocker. Do not design to a ceiling. Give every high-cardinality surface a deliberate local budget, a fixture near its expected maximum, an owner, and an escape path.

## File sizes, theme size, section and block ceilings, nesting depth, pagination caps, `all_products` limits, request timeouts

### Template, group, section and block limits

The verified theme ledger allows **1,000 JSON templates per theme**, **25 sections per JSON template**, **20 section groups per theme**, and **25 sections per section group**.[1] A section may contain **50 blocks**, although its schema can declare a lower `max_blocks`. A JSON template or section group may contain **1,250 merchant-managed blocks**, including app blocks and theme blocks but excluding statically rendered blocks.[1]

The numbers describe maximum accepted structure; they do not say a page with that structure is understandable, performant or supportable. A theme information architecture should set a smaller, route-specific budget based on content/editor tasks. For example, a header group may need a tiny, well-defined set of navigational components; an editorial landing template may allow more composition but still needs predictable reading order and a practical review workflow.

| Verified ceiling | Architecture implication | Local design response |
| --- | --- | --- |
| 25 sections per JSON template | Composition cannot expand indefinitely | Set route-specific section guidance and audit template intent |
| 20 section groups per theme | Global/section-group patterns are finite | Reserve groups for genuine repeated placement contracts |
| 25 sections per group | A global region has a bounded editorial stack | Limit presets and document ordering/removal effects |
| 50 blocks per section | A single section cannot become a page builder | Set a lower `max_blocks` tied to content and performance |
| 1,250 merchant-managed blocks | Nested/combined editor composition has aggregate cost | Test dense editor fixtures; avoid accidental multiplication |

Theme Blocks add independent inventory limits. Shopify permits **300 `.liquid` files in `blocks/` per theme**; every file counts whether or not a section references it. Theme Block nesting has a maximum depth of **eight levels**, excluding the section level.[1] Do not create block files as abandoned experiments or use nesting to evade section design. A block needs a parent context, a clear data contract, an accessible DOM responsibility, an editor reason, and an owner for support/migration.

A static block can be useful for fixed placement and editor targeting, but it does not make the surrounding tree free. Count both human cognitive depth and platform depth. At each composition boundary ask: can an editor discover where this content comes from, can a reviewer test a blank/long/reordered state, and can a component be removed without leaving an invalid landmark or heading hierarchy?

### Files, packages and aggregate theme size

The verified size limits are granular. A JSON template, a section-group file, and `config/settings_schema.json` may each be **512 KB**. `config/settings_data.json` and each locale file may be **1.5 MB**. Other Liquid files—including sections, snippets and layouts—may be **256 KB**. A single `liquid` setting accepts **50 KB** of content.[1]

The theme package uploaded in compressed form is limited to **50 MB**. Total code excluding assets is limited to **250 MB**, and a theme may contain **100,000 files**.[1] These values mean a theme can fail because of one oversized schema/file, the upload package, total non-asset code, or file count; passing one measurement says nothing about the others.

| Asset/code pressure | Dangerous reaction | Better response |
| --- | --- | --- |
| Large schema/settings data | Add opaque JSON/text settings to avoid model decisions | Split responsibility; use typed, bounded settings and structured content `[VERIFY]` |
| Large Liquid file | Accumulate unrelated route, component and editor behavior | Separate stable components with explicit input contracts |
| Large locale files | Duplicate strings/keys without ownership or lifecycle | Maintain a literal inventory and translation ownership |
| Large package | Minify blindly or hide third-party payloads | Audit asset provenance, route use, loading strategy and deletion policy |
| File-count growth | Generate dormant variations for every case | Prefer composable variants with documented constraints |

A 50 KB `liquid` setting is not an invitation to store application state, provider configuration or a page’s content model in rich editor markup. Large free-form settings are difficult to translate, audit, migrate, constrain and recover. If content needs lifecycle, references, fields, permissions or reuse, establish the correct structured-content/data contract `[VERIFY]`.

Naming limits shape editor copy. Theme names are limited to **50 characters**, schema `name` attributes for sections or blocks to **25 characters**, and merchant-customized section/block names to **100 characters**.[1] Design labels for the smallest verified limit. Do not rely on truncation to clarify a long name, and do not use labels as a substitute for documentation or a content policy.

### Pagination is a product constraint

Collection pages are commonly the first place where theme authors mistake a presentation loop for catalog access. Shopify’s collection guidance says products are limited to **50 per page**, so a collection needs `paginate` to make its products accessible across pages.[2] The collection template supports its own URL-driven sort and filtering concerns; a client-only reorder of cards does not create a shareable, complete collection state.

```liquid
{% paginate collection.products by 24 %}
  <ul role="list">
    {% for product in collection.products %}
      <li>{% render 'product-card', product: product, image_loading: 'lazy' %}</li>
    {% endfor %}
  </ul>
  {{ paginate | default_pagination }}
{% endpaginate %}
```

Choose a page size from buyer task, card complexity, image cost, server-rendered markup, device performance and evaluation evidence—not from the maximum visible product count. Test first/next/last page, empty/filtered state `[VERIFY]`, long titles, unavailable products `[VERIFY]`, disabled JavaScript, locale-aware URL behavior, focus and announcement after any enhancement. A theme that fetches cards and hides the rest in browser memory has made a catalogue limit into a correctness defect.

### `all_products` is not a catalog API

`all_products` is appropriate for a small, intentional handle-based lookup where the template context and fallback are known. Its exact per-page/distinct-handle restriction, caching behavior, lookup semantics and current platform exceptions are not stated in the verified project ledger; therefore treat any number as `> [VERIFY]` against current Shopify Liquid documentation before implementing it.

The safe design rule does not require the number: never use `all_products` as a search index, recommendation engine, bulk product loader, collection substitute or a way to bypass Liquid collection/pagination behavior. Every lookup needs an explicit handle source, blank/not-found behavior, product availability/market decision `[VERIFY]`, and a reason it belongs in theme code rather than a collection, reference, Search & Discovery configuration or application/service boundary.

| Candidate use | Appropriate? | Design question |
| --- | --- | --- |
| Curated known product callout | Possibly, after limit/context verification | What appears when handle/product is absent or unavailable? |
| Product-card rail for an editor-selected collection | No lookup required | Use the explicit collection source and pagination policy |
| Search/autocomplete | No | Use an approved search surface/API `[VERIFY]` |
| Related-product engine | No | Use recommendation intent/configuration `[VERIFY]` |
| Catalog-wide filter | No | Use storefront filtering and a URL-driven collection state `[VERIFY]` |

### Request timeouts and runtime budgets

The verified ledger does not contain a numeric theme request timeout. Do not invent one, reverse-engineer a budget from an incidental observation, or promise that a complex Liquid render completes under a specific duration. Record current runtime limits, theme tooling behavior, app interactions, edge/cache behavior and any platform guidance as `> [VERIFY]` before using them in an acceptance criterion.

You can still design responsibly without a number. Make Liquid work bounded: paginate collections, avoid repeated expensive-looking work in inner loops, pass snippet inputs explicitly, avoid unbounded handle lookups, keep editor structure intentional, load only route-relevant assets, and treat asynchronous enhancement as optional. Measure named routes with realistic content/device/network fixtures where project access permits `[VERIFY]`. A performance budget is meaningful only with a metric, environment, baseline, owner, decision rule and retained raw evidence.

When a perceived timeout or slow render occurs, triage before optimising: reproduce the route/state, capture candidate revision and data fixture, separate server/page/network/client effects, identify recently changed content/apps/configuration `[VERIFY]`, and use the supported diagnostic/release process. Deleting accessibility, localization or error behavior to improve a score is not performance work; it is a regression.

### Turn limits into budgets

A platform ceiling answers “what is accepted?” A team budget answers “what do we intentionally permit before review?” Keep them separate. A page might be valid with 25 sections but its local design budget could be twelve because that preserves a coherent editing, loading, translation and accessibility workflow. A theme could legally contain hundreds of block files while the component library budget admits only maintained, documented block types. The budget makes growth visible early; the ceiling is the final guardrail.

Record budgets beside the relevant template, component catalogue or release evidence. Each budget should name scope, measured unit, current count, warning threshold, maximum, exception owner, expiry and review trigger. Do not create a dashboard that counts things nobody acts on. A warning that a locale file grew may trigger a translation/data audit; a warning that a template acquired sections may trigger a reading-order/editor usability review; an approaching package limit may trigger asset-provenance cleanup rather than more compression.

| Budget subject | Useful local signal | Escalation question |
| --- | --- | --- |
| Template composition | Section count and intended editorial sequence | Does every section still have a buyer/editor purpose? |
| Block library | Maintained public/private block types | Who owns documentation, fixtures and migration? |
| Liquid file | Responsibility count and size trend | Should this become smaller explicit components instead? |
| Locale/content | Key lifecycle and file-size trend | Is repeated copy a translation/data-model problem? |
| Assets/package | Route use, bytes and provenance | Can an unused or duplicate asset be removed safely? |
| Catalog output | Page size, card complexity and state matrix | Does navigation remain complete and usable? |

Budgets also protect review time. A reviewer cannot meaningfully assess 50 unspecialised blocks merely because the schema permits them. Restricting choices is often a better merchant experience than exposing every experimental variation. Document the exception path: why a limit is exceeded, which route/fixture demonstrates safety, who owns it, when it is revisited, and what becomes harder to maintain.

### Diagnose limit failures without hiding them

When a CLI, upload, editor or runtime reports a limit problem, preserve the original message and candidate revision before changing files. Classify the affected object: schema, JSON template, group, block file, locale, Liquid file, package, aggregate code, file count, catalog page, handle lookup or an unverified timeout. Then measure the relevant scope rather than treating all failures as “theme too large.” A 512 KB schema failure has a different remedy from a 50 MB compressed package failure, and neither proves that the page has a performance issue.

Make the smallest structural repair that preserves the intended contract. Delete obsolete assets rather than duplicating them under new names. Move repeated structured content into an approved model only after its visibility/ownership is verified. Split a Liquid file at a real component boundary rather than passing globals through a chain of snippets. Lower an editor limit only after considering existing merchant configuration and migration communication `[VERIFY]`. Retest the exact failure path, plus the buyer/editor flows affected by the correction.

A limit alert can reveal a design smell: a giant schema can mean content responsibilities are blurred; a file-count surge can mean variants are being generated instead of designed; a pagination workaround can mean a team is trying to use theme Liquid as a data service. Write that root cause into the change record. Otherwise the next contributor will recreate the pressure under another filename.

## Limit review checklist

| Before shipping a theme change | Evidence |
| --- | --- |
| Composition is inside both platform and intentional local limits | Template/group/block inventory and dense-editor fixture |
| File/package/code counts have a known budget | Per-file, package, non-asset code and file-count audit |
| Settings remain bounded and explainable | Schema/default/empty-state/content-owner review |
| Catalog surfaces remain complete | Pagination and URL/fallback state tests |
| Handle lookup has a verified purpose | Current `all_products` constraint plus absent/market fixture `[VERIFY]` |
| Performance claim has conditions | Route, revision, fixture, environment, raw output and owner |

## References

[1]: ../../docs/DEPRECATIONS.md "Verified theme limits ledger"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/templates/collection "Shopify — Collection template"
