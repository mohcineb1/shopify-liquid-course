<!-- STATUS: final -->
---
id: ch-62
title: "SEO from the Template Layer"
part: 11
words: 2450
---

# Chapter 62 — SEO from the Template Layer

The template layer cannot command crawling, indexing, ranking, or rich-result display. It can render an honest contract: page metadata, canonical signals, structured-data claims, duplicate-route behavior, and carefully governed crawler directives. Treat every output as evidence. A contradictory canonical, duplicate JSON-LD object, or broad robots change causes more damage than an omitted flourish.

## What you’ll be able to do

- Render context-aware title, description, canonical, and Open Graph data.
- Publish minimal JSON-LD that describes visible page content accurately.
- Audit canonical, pagination, filter, tag, and alternate-template route states.
- Apply a narrow, reversible `robots.txt.liquid` change only when crawler behavior is verified.
- Separate discovery, crawling, indexing, and duplicate consolidation responsibilities.

## 62.1 Title, description, and Open Graph patterns

A title identifies the document; a description is candidate search summary text; Open Graph gives a social-preview representation. They can share approved source data, but they are not one universal string. Product, collection, article, generic page, pagination, and error contexts need different states. The classic failure is a clever global concatenation that duplicates shop names, emits blank descriptions, or claims that a filter state is the primary page.

Shopify documents the baseline directly: render `page_title`, `page_description`, and `canonical_url` in the theme `<head>`.[1] Start there, escape attributes, and add a tag/page suffix only where the state changes the document meaning.

<!-- layout/theme.liquid -->
```liquid
<head>
  <title>
    {{ page_title -}}
    {%- if current_tags %} – {{ current_tags | join: ', ' }}{% endif -%}
    {%- if current_page != 1 %} – Page {{ current_page }}{% endif -%}
    {%- unless page_title contains shop.name %} – {{ shop.name }}{% endunless -%}
  </title>

  {% if page_description != blank %}
    <meta name="description" content="{{ page_description | escape }}">
  {% endif %}

  <link rel="canonical" href="{{ canonical_url }}">
</head>
```

Do not turn missing editorial data into a scraped product body fragment. It may contain markup, duplicate generic copy, or make an inaccurate promise. Choose an approved fallback: omit the description, use a reviewed setting, or obtain dedicated editorial content. Title/description ownership, locale and Markets behavior, app-injected tags, alternate-template state, and social-preview cache behavior are `[VERIFY]`.

Open Graph should derive from the same page-specific claim inventory. A product preview can use an approved visible product title/description/image; an article preview can use its article data; a page with no representative image needs an explicit fallback policy. Do not assert price, availability, variant, author, or image that the page does not visibly support.

| Context | Primary source | Wrong shortcut |
| --- | --- | --- |
| Product | Product SEO/title/description and visible product media `[VERIFY]` | Collection text or an unavailable selected-variant claim |
| Collection | Collection SEO fields and current state | Treating a transient filter as canonical content |
| Article | Article title, summary, and published media | Applying article metadata to an index card |
| Page | Page title/description | Product/offer metadata by default |
| Fallback | Shop identity only where necessary | One vague title/description on every route |

Inspect rendered head output for a product, collection, article, generic page, pagination, filter/tag state, locale/market, alternate template, and blank-description state. Metadata is a signal, not a guarantee of the platform’s chosen result display.

## 62.2 JSON-LD structured data: Product, Offer, BreadcrumbList, Organization, Article, FAQ

JSON-LD expresses machine-readable claims. Google says structured data must describe the content of the page where it appears: do not create empty markup pages or include information not visible to users.[2] JSON-LD is generally easier to maintain than interleaved markup, but valid code is neither rich-result eligibility nor an appearance guarantee.[2]

Start with a claim inventory: template, object, visible source, data owner, completeness rule, app/theme duplicate owner, fixture, test output, and removal condition. A product page may describe its displayed product and current offer; a collection is not an `Offer` for everything in its grid. An article page may describe that article, not an unrelated marketing card.

| Object | Appropriate scope | Required discipline | False claim to avoid |
| --- | --- | --- | --- |
| `Product` | Dedicated visible product page | Visible name/image/description | Product data on collection/search page |
| `Offer` | Current purchase context | Current price/currency/availability `[VERIFY]` | Default variant price while a different variant is shown |
| `BreadcrumbList` | Visible navigable hierarchy | Same labels/URLs/order | Invented taxonomy |
| `Organization` | Approved site identity | Stable identity/logo data `[VERIFY]` | Unverified social profiles |
| `Article` | Visible article detail | Accurate title/date/author/image | Blog listing marked as article |
| `FAQPage` | Visible maintained Q&A | Same rendered Q&A and owner | Hidden keyword FAQs or a rich-result promise |

Google’s current gallery lists Product, Breadcrumb, Organization, and Article features.[3] It does not promise that any valid page receives an enhanced appearance. FAQ content can be useful when visible, but current generic FAQ eligibility must be independently verified; do not market it as a guaranteed rich-result tactic `[VERIFY]`.

<!-- snippets/structured-product.liquid -->
```liquid
{% if request.page_type == 'product' %}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": {{ product.title | json }},
    "url": {{ canonical_url | json }},
    {% if product.featured_image != blank %}
      "image": [{{ product.featured_image | image_url: width: 1200 | prepend: 'https:' | json }}],
    {% endif %}
    "offers": {
      "@type": "Offer",
      "priceCurrency": {{ cart.currency.iso_code | json }},
      "price": {{ product.selected_or_first_available_variant.price | divided_by: 100.0 | json }},
      "availability": "https://schema.org/InStock"
    }
  }
  </script>
{% endif %}
```

This demonstrates shape, not unconditional production truth. Current selected variant, currency/money serialization, availability mapping, market, selling-plan, product publication, and app overlap require verification. Never emit `InStock` if the current visible purchasable variant is unavailable. Use `| json` for JSON values rather than hand-built quotes; validate the rendered page with Rich Results Test and monitor post-deploy reports.[2]

A theme, an app, and a widget can all emit `Product` or `Organization`. Inventory rendered `<script type="application/ld+json">` output and assign one owner per object/template. Google recommends fewer complete and accurate recommended properties over broad inaccurate markup.[2]

## 62.3 Canonical URLs, pagination, and filtered-collection indexing

A canonical is a consolidation hint, not a redirect, permission rule, noindex substitute, or cure for every duplicate. Shopify supplies `canonical_url` as the global object for the document canonical link.[1] Render one deliberate canonical and inspect real output. Hand-building URLs with string filters loses route, locale, market, pagination, product-in-collection, tracking, app, and alternate-template behavior.

Pagination is a user path, not an ugly URL to erase. Whether later pages need distinct title suffixes, internal links, or canonical behavior must follow verified current Shopify output and page strategy `[VERIFY]`. Do not canonicalize every page to page one solely to remove the page number if later pages contain otherwise undiscoverable products/articles.

Filtered collection routes differ from canonical collections. Shopify’s default robots rules include `Disallow: /collections/*+*`, intended to keep filtered collection variants from consuming crawl attention and creating duplicate focus.[4] That does not authorize a broad custom noindex rule or assume every filters/parameters system has that path. Crawling and indexing are different: a blocked URL may still be indexed through another discovery method.[4]

Maintain a URL decision record: source route, content/state, buyer purpose, primary route, canonical output, robots output, internal-link source, sitemap presence, current search observation `[VERIFY]`, owner, test date, and rollback. Test direct product, product-in-collection, tag/filter combination, sorting, search, article/blog/collection pagination, alternate template, locale/market, and campaign state.

## 62.4 `robots.liquid` and sitemap control

Every Shopify store has a default `robots.txt`. A `templates/robots.txt.liquid` customization can allow/disallow paths, add crawl delay, sitemap URLs, or block specified crawlers.[4] Shopify says the default works for most stores and warns that this customization is unsupported; incorrect edits can lose traffic.[4]

> **Robots controls crawler requests; it does not guarantee de-indexing.** Diagnose the crawler problem before changing a directive.

Preserve Shopify’s dynamic default behavior and make only a narrow additive/removal change with a written reason. Replacing the file with plain static text freezes assumptions Shopify may update. Record default rendered output, changed directive, affected URLs/user agents, intended outcome, candidate evidence, robots test result `[VERIFY]`, owner, review date, and rollback path. If the desired outcome is index consolidation, verify canonical/internal-link/content decisions first instead of treating robots as a universal lever.

Sitemap is discovery, not a theme-controlled index command. Shopify documents the sitemap and permits additional sitemap URLs through robots customization, but that is not an arbitrary API for forcing visibility.[4] Verify sitemap output, submitted property, domain/locale behavior, app resources, and search observation `[VERIFY]`. Do not add cart, checkout, private, or duplicate states merely because they have a route.

## 62.5 Handling duplicate content from tags, filters, and alternate templates

Duplicate content is route governance. One product may be reached through direct and collection-context URLs; collections can gain tags, filters, sorts, pagination, or alternate templates; locales and markets can publish intentional variants; apps can add query or metadata output. Decide whether each state is durable, distinct, and useful, then align visible content, internal links, canonical, robots, sitemap, and JSON-LD to that decision.

| Source | First question | Safe default response |
| --- | --- | --- |
| Tag/filter state | Is this a lasting distinct content page or discovery state? | Preserve buyer UX; inspect verified default canonical/robots behavior before custom code |
| Sort/pagination | Does state expose a meaningful different list? | Keep links functional; audit rendered canonical rather than stripping strings |
| Product-in-collection | Which product route is primary? | Use platform canonical output; prevent schema duplicates |
| Alternate template | Does it have a uniquely valuable public purpose? | Give unique content or prevent accidental exposure `[VERIFY]` |
| Locale/market | Is content intentionally localized? | Verify domain/canonical/hreflang approach `[VERIFY]` |
| App/widget | Does it add head tags, schema, or internal links? | Inventory output and nominate an owner |

This is where teams get burned: they add a `noindex`, remove the canonical, and block the route without saying which crawler/indexing problem each action solves. The system becomes contradictory and untestable. Keep one decision record per route class, and do not hide search-engine instructions in an unrelated section merely because that section appears on an affected template.

### A rendered-output verification workflow

SEO template work must be inspected after Liquid and applications have rendered, not only in a source diff. Start by naming a small fixture matrix: one approved product with an available variant, one unavailable variant, one collection with several pages, one filtered collection state, one article, one plain page, one alternate template if public, and the relevant locale/market/domain configurations `[VERIFY]`. Do not use buyer account, cart, checkout, or confidential merchant data to make an SEO fixture.

For each fixture, capture the rendered `head`: title, description, canonical, relevant Open Graph fields, robots meta if any, and all JSON-LD scripts. Then record the visible page facts that support every structured-data claim: displayed name, product image, current price/availability, breadcrumbs, article title/date, organization identity, or FAQ question and answer. A claim that cannot be traced to visible current content has no place in the output. This test detects both data mistakes and a more subtle regression: an app or alternate template emitting an old second canonical/schema object after the theme has been corrected.

Next, use the appropriate external validator as an input rather than a release authority. JSON syntax and Rich Results Test output identify malformed/unsupported markup; an HTML inspection confirms the scripts landed on the intended template; a crawler/robots test examines the actual `robots.txt`; and current search tooling provides post-release observation `[VERIFY]`. None confirms rankings, exact snippets, indexing deadlines, or business impact. Record tool/version/date, URL, fixture state, result, limitation, owner, and re-test event so a later theme release can distinguish a known platform behavior from a new regression.

Finally, compare route intent rather than counting URLs. A buyer-facing filter state may need to function flawlessly while remaining a low-discovery route; a paginated page may need a clear title and links even where its canonical behavior is platform-defined; a localized route might be intentionally distinct but still require an approved canonical/domain strategy. The correct question is not “how many pages can we block?” It is “which visible content should a search engine discover and consolidate, and which exact platform signals currently express that decision?” Every answer remains `[VERIFY]` until checked against the store’s configuration and rendered output.

## Gotchas

- Hand-built canonical URLs silently lose real route context; start with `canonical_url` and test output.
- JSON-LD from invisible/internal data breaks the visible-page claim rule.
- One global schema snippet duplicates theme/app output across irrelevant templates.
- Robots blocking is not guaranteed de-indexing.
- FAQ schema is not a rich-result promise.
- Source review is not enough: test rendered HTML, crawler controls, structured-data output, and post-release signals.

## Checklist

| Question | Evidence |
| --- | --- |
| Is head output correct for every representative state? | Rendered head capture by route/state/locale `[VERIFY]` |
| Does each JSON-LD object describe current visible content with one owner? | Claim inventory and validation output |
| Are filtered/tagged/paginated/alternate states assessed separately? | URL decision register |
| Is any robots change narrow, reversible, and tested? | Default comparison, test evidence, owner, rollback |
| Are sitemap/discovery assumptions verified? | Current sitemap and search-tool evidence `[VERIFY]` |

## Related

- [ch-52 — Theme QA and Regression](../../part-09-performance-quality-workflows/ch-52-theme-qa-and-regression/)
- [ch-61 — Accessible Liquid](../ch-61-accessible-liquid/)

## References

[1]: https://shopify.dev/docs/storefronts/themes/seo/metadata "Shopify — Add SEO metadata to your theme"
[2]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Google Search Central — Structured data introduction"
[3]: https://developers.google.com/search/docs/appearance/structured-data/search-gallery "Google Search Central — Structured-data gallery"
[4]: https://help.shopify.com/en/manual/promoting-marketing/seo/editing-robots-txt "Shopify Help — Editing robots.txt.liquid"
