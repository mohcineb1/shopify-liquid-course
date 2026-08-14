<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 62 — Solution

## The approach

The starter makes three incompatible claims: every page has one generic title, every route has `Product`/FAQ data, and broad crawler blocks are an indexing remedy. The correction assigns one output owner per concern. The layout renders page-context metadata and one canonical. Template-scoped snippets make only visible, current claims. The robots proposal preserves the dynamic default and refuses a live change until a narrow crawler problem is verified.

| Concern | Decision | Rejected assumption |
| --- | --- | --- |
| Head metadata | One context-aware title, optional description, one `canonical_url`, page-specific Open Graph `[VERIFY]` | Hardcoded collection URL and duplicated canonical |
| JSON-LD | Minimal template-scoped objects with visible sources and one owner | Global Product/FAQ graph |
| URL states | Route decision record before directives | “Block every filter/page two” |
| Robots | Preserve default; narrow conditional proposal only | Static replacement that disallows products/collections |
| Validation | Rendered output, validators, route fixtures, monitoring | Source diff or ranking promise |

## 1 — Corrected metadata contract

The layout uses Shopify’s documented metadata objects. `page_description` is omitted rather than replaced with invented copy. Page-specific social properties must be selected from approved visible content and tested on rendered pages `[VERIFY]`.

<!-- solution/layout/theme.liquid -->
```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
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

    {% if request.page_type == 'product' and product.featured_image != blank %}
      <meta property="og:type" content="product">
      <meta property="og:title" content="{{ product.title | escape }}">
      <meta property="og:url" content="{{ canonical_url }}">
      <meta property="og:image" content="{{ product.featured_image | image_url: width: 1200 | prepend: 'https:' }}">
    {% elsif request.page_type == 'article' %}
      <meta property="og:type" content="article">
      <meta property="og:title" content="{{ article.title | escape }}">
      <meta property="og:url" content="{{ canonical_url }}">
    {% endif %}

    {% render 'seo-schema' %}
  </head>
  <body>{{ content_for_layout }}</body>
</html>
```

`records/metadata-inventory.md` lists product, collection, article, page, pagination, filter/tag, locale/market, alternate-template, and blank-content fixtures. Each row records source, fallback, visible claim, theme/app owner, route, rendered capture, reviewer, and `[VERIFY]` configuration. It rejects the old second canonical and does not assume `request.locale`, social cache behavior, canonical domain, or Open Graph property support without a candidate check.

## 2 — Template-scoped JSON-LD ownership

The solution emits product data only on a product page. All string values use `| json`; availability is conditional on the visible selected-or-first variant and still needs candidate verification for market, selling plan, purchase state, and app overlap.

<!-- solution/snippets/seo-schema.liquid -->
```liquid
{% if request.page_type == 'product' %}
  {% assign variant = product.selected_or_first_available_variant %}
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
      "price": {{ variant.price | divided_by: 100.0 | json }},
      "availability": {% if variant.available %}"https://schema.org/InStock"{% else %}"https://schema.org/OutOfStock"{% endif %}
    }
  }
  </script>
{% endif %}
```

This is not permission to claim every possible schema property. `records/claim-inventory.md` makes the template/data relationship explicit:

| Object | Scope | Visible source | Owner | Validation |
| --- | --- | --- | --- | --- |
| Product/Offer | Product detail only | Displayed product/variant price/availability `[VERIFY]` | Theme unless app already owns it `[VERIFY]` | Rendered script + Rich Results Test |
| BreadcrumbList | Only visible navigable breadcrumb | Same labels/URLs/order | Named theme/app owner `[VERIFY]` | Rendered link/schema comparison |
| Organization | Approved stable site identity | Visible identity/logo where relevant `[VERIFY]` | One global owner | Source and app collision review |
| Article | Article detail only | Visible article title/date/author/image `[VERIFY]` | Theme/app owner | Rendered page validation |
| FAQPage | Visible maintained Q&A only | Same Q&A in page content | Content owner + one emitter | Content review; no rich-result promise |

The records require source, completeness rule, duplicate owner, route fixture, test output, reviewer, removal condition, and `[VERIFY]` fact. A review app that emits schema must be inventoried; adding a second theme graph “to be safe” is a conflict, not redundancy.

## 3 — URL and canonical decision record

`records/url-decision-record.md` separates buyer utility from crawler behavior.

| Route class | Buyer use | Decision evidence |
| --- | --- | --- |
| Direct product/product-in-collection | Product discovery | Inspect platform canonical; one product-schema owner `[VERIFY]` |
| Tags/filters/sorts | Discovery refinement | Keep UX working; inspect current route/canonical/default robots behavior |
| Pagination | Reach later list results | Retain crawlable pagination; inspect title/canonical state `[VERIFY]` |
| Search | Query result task | Use current platform/default crawler policy, not assumed canonical logic |
| Alternate template | Only if public distinct purpose exists | Unique content or prevent accidental public exposure `[VERIFY]` |
| Locale/market | Intentional localized experience | Verify domain, canonical and language strategy `[VERIFY]` |
| Campaign/app URL | Measurement/integration state | Identify parameter/owner and canonical rendered output |

Every row records URL, content state, canonical output, robots output, internal-link source, sitemap observation, source fixture, owner, release, and rollback. Canonical consolidates preferred content; it is not a redirect or index command. Route states should never be transformed by hardcoded path manipulation when Shopify’s actual `canonical_url` output can be inspected.

## 4 — Robots and sitemap proposal

The correct current proposal is **no broad directive change**. Shopify’s default `robots.txt` is intended to work for most stores; its default includes rules such as filtered collection patterns, cart, checkout, search, and administrative paths.[1] `robots.txt.liquid` may be customized, but Shopify warns mistakes can lose traffic and recommends preserving Liquid/dynamic behavior rather than a static replacement.[1]

<!-- solution/templates/robots.txt.liquid -->
```liquid
{% comment %}
  No directive change is approved until an authorised owner verifies a specific
  crawler-request problem, affected route, current default output, and rollback.
  Preserve Shopify's default dynamic robots behavior.
{% endcomment %}
{{ robots.default_groups }}
```

> [VERIFY] Confirm the current supported `robots` object API and default group rendering against Shopify documentation before shipping any exact template expression. The exercise records intent; it does not deploy an unverified robots implementation.

`records/robots-proposal.md` states the verified crawler purpose, existing default output, narrowly affected route/user agent, exact proposed directive, expected impact, crawl-versus-index explanation, tester evidence, owner, review date, and deletion rollback. It rejects the starter because static `Disallow: /collections/` and `/products/` suppress legitimate discovery, while a robots rule does not guarantee a URL disappears from an index.

Sitemap observation belongs in the same record but is not a broad theme index-control mechanism. Record the current sitemap path/output, property/domain/locale state, app resources, observation, owner, and `[VERIFY]` status. Do not add carts, checkout, private content, or duplicate routes merely because a route exists.

## 5 — Rendered-output matrix

`records/rendered-output-matrix.md` defines fixtures rather than running live SEO operations:

| Check | Fixture evidence | Expected decision |
| --- | --- | --- |
| Head | Product, collection, article, page, pagination/filter | One intended title/description/canonical and appropriate OG output |
| Schema | Product available/unavailable, article, visible FAQ | Valid JSON and only visible current claims |
| Collisions | App/theme scripts per template | One owner/object or documented intentional non-overlap |
| Robots | Current rendered default and candidate proposal | Narrow request only; crawl/index distinction documented |
| Sitemap | Current output/domain/locale `[VERIFY]` | Discovery observed, no artificial duplicate insertion |
| Routes | Direct, context, tag/filter/sort/search/alternate/localized | URL decision record aligns output and purpose |
| Monitoring | Validation/tool results and later search observation `[VERIFY]` | No ranking, indexing, or rich-result guarantee |

The matrix captures tool/version/date, route, fixture state, visible source, output, limitation, disposition, owner, release gate, and re-test condition. No customer data, production credentials, Search Console action, published robots change, or indexing request is required to complete it.

## What people get wrong here

**A second canonical is “safer.”** Two different canonical signals are ambiguous; render one deliberate current `canonical_url` output.

**JSON-LD can describe internal data.** The page must visibly support the claim. A hidden FAQ or default variant inventory value is not a truthful page assertion.

**Robots removes search results.** Crawling and indexing differ. Diagnose the issue and use the smallest verified control.

**Schema app overlap is harmless.** Duplicated/conflicting object ownership creates untestable output. Inventory scripts and nominate one owner.

## Stretch: direction only

For review-schema work, first identify the visible moderated review source, its app/theme owner, and the current eligibility/data facts `[VERIFY]`. Compare rendered output to visible review content and never synthesize aggregate ratings or testimonials to create a search claim. Keep the decision in the same claim inventory, including validation and removal ownership.

## References

[1]: https://help.shopify.com/en/manual/promoting-marketing/seo/editing-robots-txt "Shopify Help — Editing robots.txt.liquid"
[2]: https://shopify.dev/docs/storefronts/themes/seo/metadata "Shopify — Add SEO metadata to your theme"
[3]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Google Search Central — Structured data introduction"
