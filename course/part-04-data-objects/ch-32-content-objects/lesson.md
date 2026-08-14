<!-- STATUS: final -->
---
id: ch-32
title: "Content Objects"
part: 4
---

# Chapter 32 — Content Objects

Content is often the first theme surface where merchant-authored HTML, editorial taxonomy, mixed result types, and live search behavior meet. A theme must preserve the meaning of an article, page, or search result without flattening it into a generic card; it must render rich merchant fields through type-aware contracts instead of raw interpolation; and it must let progressive search enhance—not replace—the navigable server search. Build a content system around object context, safe semantic output, explicit result shaping, and server-owned search state.

## What you’ll be able to do

- Render blogs, articles, comments, and pages from their actual object contracts.
- Choose rich-text and metafield output paths that preserve allowed formatting without treating merchant content as arbitrary executable markup.
- Build tags and archives as navigable editorial taxonomy rather than client-side filtering theater.
- Shape full search results by object type and current server result state.
- Use predictive-search resources only in the section/API context that supplies them.

## 32.1 `blog`, `article`, `comment`, `page`

A blog is a collection of articles; an article is a published editorial object with content, metadata, tags, image, comment configuration, and URL; a comment is a visitor response subject to the blog’s comment policy; and a page is a merchant-authored standalone content resource. They share presentation needs but not the same fields, URLs, or lifecycle. A content card should be explicit about which object it consumes rather than assuming every title/content pair is interchangeable.

Article properties include `title`, `url`, `author`, `published_at`, `updated_at`, `image`, `excerpt`, `content`, `excerpt_or_content`, `tags`, `comments`, `comments_count`, `comments_enabled?`, `moderated?`, `comment_post_url`, and metafields. `excerpt_or_content` is useful in an index because it uses a configured excerpt when present and otherwise falls back to the article body. Render article content as merchant content, not as a text string to be escaped into invisibility; render title/author/date in their own semantic elements. [1]

```liquid
<article>
  <h2><a href="{{ article.url }}">{{ article.title | escape }}</a></h2>
  <p>By {{ article.author | escape }} · {{ article.published_at | date: '%B %d, %Y' }}</p>
  {% if article.image %}{{ article.image | image_url: width: 960 | image_tag: alt: article.title, loading: 'lazy' }}{% endif %}
  <div>{{ article.excerpt_or_content }}</div>
</article>
```

An article’s `content` and merchant-configured rich text are meant to contain formatted HTML. Do not indiscriminately apply `escape` to those trusted Shopify-rendered content fields, but do escape separate text values such as title, tag labels, author names, or user-provided strings in custom markup. “Merchant authored” is not a license to execute script or build a custom HTML sanitizer in Liquid; the source/editor and platform rendering contract decide what markup exists.

Comments need defensive states. `article.comments` contains published comments and is empty when comments are disabled; `comments_enabled?` and `moderated?` describe whether a UI should invite/comment and whether a submitted comment may be pending. Comments can be paginated up to 50 per page. Do not claim immediate publication when moderation is enabled. [1]

> [VERIFY] Confirm the current comment form and moderation workflow for the store before implementing a submission surface. This chapter establishes display contracts; specific form behavior belongs to the documented article/comment template context.

## 32.2 Rich text output, `metafield_tag`, and sanitising merchant HTML

Content types matter more than a generic “output value” rule. A `rich_text_field` metafield is a structured Shopify value that should be rendered through `metafield_tag`. The filter emits type-aware HTML—for a rich text field, a wrapper `div`; for references, dates, money, files, and other supported types, it emits appropriate elements/formatting. It is better than reaching into `.value` and assuming the result is safe/complete HTML. [2]

```liquid
{% assign field = article.metafields.editorial.callout %}
{% if field != blank %}
  <aside class="article-callout">{{ field | metafield_tag }}</aside>
{% endif %}
```

The wrong pattern is to bypass the type contract and concatenate a rich value into custom HTML or script data:

```liquid
<!-- Incorrect: assumes every metafield is text and redefines its rendering contract. -->
<div data-content="{{ article.metafields.editorial.callout.value }}"></div>
```

The correct pattern selects a rendering path for the metafield definition: `metafield_tag` for a supported display value, a deliberate reference/file renderer where necessary, or escaped text when the field is text. `metafield_tag` does not support all list metafields; Shopify documents support for `list.single_line_text_field` and `list.metaobject_reference` among list types. Keep unsupported types explicit instead of silently treating their data as HTML. [2]

Sanitization has layers. Shopify controls the rich-text editor/output contract; a theme controls where rendered markup lands; browser code must not insert untrusted query, comment, or external API content through `innerHTML`. If a merchant needs an embed or custom script, use a governed, reviewed extension/app/settings capability—not a generic rich-text escape hatch. Separating merchant content from external/untrusted input is the key design decision.

## 32.3 Blog tagging, filtering, and archive patterns

Article tags are editorial taxonomy. `article.tags` lets a theme show a post’s categories, and a tag can report its total count in the documented blog context. A blog archive needs stable navigation: blog index, tag/archive link, article URL, pagination, empty state, and accessible current-state indication. Use Shopify-generated blog/tag paths or documented object URLs rather than `handleize`-based guessed query strings.

A tags navigation should remain ordinary links. That gives the reader a shareable URL, works without JavaScript, respects browser history, and keeps filtering on the server where the full blog archive exists. Client-side filtering of only the cards already rendered creates a false archive: it omits other pages, drifts after an editor publishes a post, and changes the visible count without changing the URL.

```liquid
<nav aria-label="Article tags"><ul>
  {% for tag in blog.all_tags %}
    <li><a href="{{ blog.url }}/tagged/{{ tag | handleize }}">{{ tag | escape }}</a></li>
  {% endfor %}
</ul></nav>
```

> [VERIFY] Confirm the current theme’s blog tag URL contract and localized route behavior before hard-coding an archive pattern. Use generated/current theme navigation where available and test links with spaces, punctuation, and translated tags.

Archive cards should use excerpts, dates, title, byline, and optional image consistently. Do not put whole article bodies into a large index. Paginate article collections and keep a clear “no posts in this archive” response. For author/date archives, clarify whether they are editorial navigation, merchant administration concepts, or a separate content-model feature; do not invent a query grammar that the blog object cannot support.

## 32.4 The `search` object, result types, and search result templates

`search` is the server result of a storefront search. `search.performed` tells you whether a query was successfully made, `terms` is the entered query, `results` holds result items, `results_count` gives the count, and `types` tells which object types were searched. Full search results can be articles, pages, or products. A result carries `object_type`, so branch explicitly before reading type-specific properties. [3]

```liquid
{% if search.performed %}
  <h1>Results for {{ search.terms | escape }}</h1>
  {% paginate search.results by 24 %}
    {% for result in search.results %}
      {% case result.object_type %}
        {% when 'product' %}{% render 'search-product-card', product: result %}
        {% when 'article' %}{% render 'search-article-card', article: result %}
        {% when 'page' %}{% render 'search-page-card', page: result %}
      {% endcase %}
    {% endfor %}
    {{ paginate | default_pagination }}
  {% endpaginate %}
{% endif %}
```

Search result templates need at least three states: no query yet, query with no results, and query with results. Do not display an empty-result apology before search was performed. Search supports filters when relevant, but the filter array is empty when results contain more than 1,000 products; design the template to work without facet controls. Search result pagination can show up to 50 results per page. [3]

When excerpting a heterogeneous result, prefer a type-specific source. Product descriptions, article excerpt/content, and page content have different semantic roles. `strip_html` and a truncate filter can form a plain-text search preview, while `highlight: search.terms` can mark terms where appropriate. Escape the visible query and preserve an actual link to the result URL.

## 32.5 Predictive search resources and result shaping

Predictive search is not the `search` object with faster JavaScript. The `predictive_search` object returns data only when a section is rendered through the Predictive Search API together with the Section Rendering API. Outside that request/section context, `performed` is false and resources are not a general global cache. [4]

Predictive resources are grouped by type: articles, collections, pages, and products. The request’s `type` parameter determines which types were searched; render each group only when it has results, provide headings so mixed content is understandable, and cap/shape output as a compact suggestion surface. The full search link is an essential escape hatch for a longer query and comprehensive results.

```liquid
{% if predictive_search.performed %}
  {% if predictive_search.resources.products.size > 0 %}
    <h2>Products</h2>
    {% for product in predictive_search.resources.products %}<a href="{{ product.url }}">{{ product.title | escape }}</a>{% endfor %}
  {% endif %}
  {% if predictive_search.resources.articles.size > 0 %}
    <h2>Articles</h2>
    {% for article in predictive_search.resources.articles %}<a href="{{ article.url }}">{{ article.title | escape }}</a>{% endfor %}
  {% endif %}
{% endif %}
```

The browser owns input timing, cancellation, focus, and live-result announcement; Liquid owns the rendered resource shape. Keep an ordinary search form and results link for recovery. Do not scrape/rerank results client-side using a stale section response, and do not treat predictive results as the complete search corpus. Interaction details belong in `ch-37-client-side-javascript` and API request mechanics in `ch-38-ajax-api`.

## Gotchas

- You escape article body/rich-text output until legitimate formatting is destroyed, or insert untrusted external text as HTML.
- You use a metafield’s raw value for every type instead of respecting `metafield_tag` and its supported-type boundary.
- You filter only the currently rendered article cards and call the result a blog archive.
- You treat every search result like a product and access product-only image/price fields on pages or articles.
- You show “no results” before `search.performed` is true or assume filters always exist on large result sets.
- You expect `predictive_search` to exist in an ordinary page render rather than the documented API/section context.

## Checklist

- [ ] Content cards distinguish article/page/blog/comment semantics and preserve formatted merchant body content deliberately.
- [ ] Metafields use a type-aware rendering path; external/untrusted content never gains arbitrary HTML execution.
- [ ] Tag/archive navigation is server-navigable and paginated.
- [ ] Full search branches on `object_type`, preserves query states, and supports result-type diversity.
- [ ] Predictive resources are rendered only in their API/section context with a full-search recovery path.

## Related

- `ch-29-collections-filtering-pagination` — filters, query state, result pagination, and links-first navigation.
- `ch-33-metafields` — metafield definitions, types, and broader modeling strategy.
- `ch-34-metaobjects` — reusable structured content beyond individual content-object fields.
- `ch-37-client-side-javascript` — focus, races, and progressive component lifecycle.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/article "Shopify — Liquid object: article"
[2]: https://shopify.dev/docs/api/liquid/filters/metafield_tag "Shopify — Liquid filter: metafield_tag"
[3]: https://shopify.dev/docs/api/liquid/objects/search "Shopify — Liquid object: search"
[4]: https://shopify.dev/docs/api/liquid/objects/predictive_search "Shopify — Liquid object: predictive_search"

## Content-governance and search-state audit

Before publishing a content template, test a long article, no excerpt, rich-text metafield, blank metafield, featured image without alt assumptions, comments disabled, comments moderated, a tag containing punctuation, and a blog archive with enough posts to paginate. The aim is not merely visual consistency. Each state must keep its meaning: an absent excerpt is not an empty article, a disabled comments area is not a failed request, and a rich-text field is not a generic string. Ensure that editor-managed links, headings, lists, and accessible media preserve the platform’s intended semantics rather than being stripped by a convenience template filter.

For search, test an unperformed form, a zero-result query, each returned object type, a broad query with pagination, and a predictive response containing more than one resource group. The page must retain the submitted terms in a safe visible form, and the predictive section must have a truthful fallback to full search. Results in a suggestion panel are selected resources for the request—not an assertion that the complete catalog/content corpus has been exhausted. This distinction prevents a compact UI from silently replacing the standard search results page.

A useful shaping rule is to limit each content preview to its decision-making information: title, object type, concise excerpt, image when available, and direct URL. Do not load whole article markup into a predictive result or expose product-specific details on a page result just to make the cards look uniform. Uniform visual components need a type-aware data contract, not identical underlying objects.

This audit also protects merchant workflow: editors should know whether a field accepts formatted content, a reference, a value, or a taxonomy label, and the theme should make that type visible through stable, appropriate output.

That discipline keeps templates understandable, predictable, accessible, and safer across editorial changes over time.

It also gives readers reliable routes back to complete, current, server-rendered results whenever a compact preview is insufficient.
