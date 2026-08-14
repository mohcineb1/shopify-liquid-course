<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 32 — Solution

## The approach

This solution separates content by object and search by request context. The article section renders Shopify-managed formatted article body content as content, renders the editorial callout through `metafield_tag`, and exposes comment state only when comments are enabled. The search template branches on the result’s `object_type`, so articles, pages, and products receive the fields they actually own. A blog tag is an ordinary archive link rather than a browser-only subset of the first page.

Predictive search is intentionally only a result-section partial. It checks `predictive_search.performed`, groups returned resources, and includes a full-search link. It does not expect predictive data in a normal document render or turn suggestions into the only search interface. The current server-rendered full search remains the comprehensive recovery route.

> [VERIFY] Confirm the deployed Predictive Search API and Section Rendering integration, current blog tag route behavior, comment form configuration, and metafield definition types. The Liquid structure follows documented object contexts; the invoking request and merchant configuration decide what arrives.

## Walkthrough

### 1. Preserve content-object semantics

An article card renders an escaped title/byline/date, optional image, and `excerpt_or_content` as formatted editorial output. The article section uses `article.content` for the published body. Comment markup is behind `comments_enabled?`; when moderation applies, the UI should not promise immediate publication. Pages are not silently rendered as articles because they lack article-specific author/tag/comment assumptions.

### 2. Use type-aware rich text

The callout metafield is blank-guarded and passed to `metafield_tag`. That tells Shopify to generate output appropriate to the metafield definition, including rich text formatting. The solution does not serialize a raw value into a `data-*` attribute, concatenate it into a script, or add it through browser HTML insertion. Structured merchant content and external/untrusted content have different trust and rendering paths.

### 3. Make archives actual navigation

The tag snippet is a list of links, not buttons that hide the cards already present. The archive route can represent the full server data set, be bookmarked, and work without a client controller. The blog/index section must paginate its articles and present an empty state that links back to the blog.

### 4. Shape full search by result type

The search template first distinguishes unperformed search from a performed query with zero results. Its result loop branches on `object_type`, choosing a product card, article card, or page card. Search terms are escaped where displayed, and results are paginated. No product price or image is read from a page/article result.

### 5. Restrict predictive output to its request context

The predictive snippet can be used by a section that is rendered through the documented predictive-search/section-rendering request. It displays groups only when they contain resources and points to a normal search URL for the terms. The theme’s browser controller belongs to a later chapter; this output layer simply receives and shapes a valid server response.

## Full code

### `sections/article-content.liquid`

```liquid
<article class="article-content">
  <h1>{{ article.title | escape }}</h1>
  <p>By {{ article.author | escape }} · {{ article.published_at | date: '%B %d, %Y' }}</p>
  {% if article.image %}{{ article.image | image_url: width: 1440 | image_tag: alt: article.title, loading: 'lazy' }}{% endif %}
  <div class="article-content__body">{{ article.content }}</div>
  {% assign callout = article.metafields.editorial.callout %}
  {% if callout != blank %}<aside class="article-content__callout">{{ callout | metafield_tag }}</aside>{% endif %}
  {% if article.comments_enabled? %}
    <section><h2>Comments ({{ article.comments_count }})</h2>
      {% paginate article.comments by 20 %}{% for comment in article.comments %}<article><p>{{ comment.content | escape }}</p></article>{% endfor %}{{ paginate | default_pagination }}{% endpaginate %}
      {% if article.moderated? %}<p>Comments are moderated before publication.</p>{% endif %}
    </section>
  {% endif %}
</article>
{% schema %}
{ "name": "Article content", "settings": [] }
{% endschema %}
```

### `templates/search.liquid`

```liquid
<section class="search-results page-width">
  {% if search.performed %}
    <h1>Results for {{ search.terms | escape }}</h1>
    {% if search.results_count == 0 %}<p class="content-empty">No results. Try another search.</p>{% else %}
      {% paginate search.results by 24 %}
        <ul class="search-results__grid">
          {% for result in search.results %}
            <li>
              {% case result.object_type %}
                {% when 'product' %}<a href="{{ result.url }}">{{ result.title | escape }}</a>{% if result.featured_image %}{{ result.featured_image | image_url: width: 300 | image_tag: alt: result.title, loading: 'lazy' }}{% endif %}<p>{{ result.price | money }}</p>
                {% when 'article' %}<a href="{{ result.url }}">{{ result.title | escape }}</a><p>{{ result.excerpt_or_content | strip_html | truncatewords: 30 }}</p>
                {% when 'page' %}<a href="{{ result.url }}">{{ result.title | escape }}</a><p>{{ result.content | strip_html | truncatewords: 30 }}</p>
              {% endcase %}
            </li>
          {% endfor %}
        </ul>
        {{ paginate | default_pagination }}
      {% endpaginate %}
    {% endif %}
  {% else %}
    <h1>Search</h1><p>Enter a term to search products and content.</p>
  {% endif %}
</section>
```

### `snippets/blog-tags.liquid`

```liquid
{% if blog.all_tags != blank %}
  <nav class="blog-tags" aria-label="Article tags"><ul>
    {% for tag in blog.all_tags %}
      <li><a href="{{ blog.url }}/tagged/{{ tag | handleize }}">{{ tag | escape }}</a></li>
    {% endfor %}
  </ul></nav>
{% endif %}
```

### `snippets/predictive-results.liquid`

```liquid
{% if predictive_search.performed %}
  <div class="predictive-results">
    {% if predictive_search.resources.products.size > 0 %}<section class="predictive-results__group"><h2>Products</h2>{% for product in predictive_search.resources.products %}<a href="{{ product.url }}">{{ product.title | escape }}</a>{% endfor %}</section>{% endif %}
    {% if predictive_search.resources.articles.size > 0 %}<section class="predictive-results__group"><h2>Articles</h2>{% for article in predictive_search.resources.articles %}<a href="{{ article.url }}">{{ article.title | escape }}</a>{% endfor %}</section>{% endif %}
    {% if predictive_search.resources.pages.size > 0 %}<section class="predictive-results__group"><h2>Pages</h2>{% for page in predictive_search.resources.pages %}<a href="{{ page.url }}">{{ page.title | escape }}</a>{% endfor %}</section>{% endif %}
    <a href="{{ routes.search_url }}?q={{ predictive_search.terms | url_encode }}">See all results for {{ predictive_search.terms | escape }}</a>
  </div>
{% endif %}
```

### `assets/content-search.css`

```css
.article-content, .search-results { display: grid; gap: 1rem; }
.search-results__grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); list-style: none; padding: 0; }
.predictive-results__group { display: grid; gap: .5rem; }
.content-empty { border: 1px solid currentColor; padding: 1rem; }
```

### `notes.md`

```markdown
# Content and search verification

| Scenario | Observed output/state | Recovery or contract |
| --- | --- | --- |
| Article with excerpt | Editorial card uses excerpt-or-content. | Article route remains canonical. |
| Article without excerpt | Content fallback is formatted. | No raw HTML injection. |
| Rich metafield | `metafield_tag` renders type-aware markup. | Blank guard remains safe. |
| Blank metafield | Callout is omitted. | No empty wrapper required. |
| Punctuation tag | Archive link is tested in target route. | Blog index is recovery. |
| Unperformed search | Prompt renders; no false zero state. | Native search form available. |
| Zero results | Performed empty state is clear. | New query route remains. |
| Mixed result types | Type branches use valid fields only. | Full search remains paginated. |
| Predictive context | Group output appears only in API/section render. | Full search link is fallback. |
```

All six files are mirrored under `solution/` at the starter paths.

## What people get wrong here

- They escape every content field, which destroys legitimate article/rich-text formatting, or compensate by injecting raw strings with JavaScript.
- They turn the first rendered blog page into a client-side tag archive. That cannot represent the full server archive or a shareable tag state.
- They render `result.price` on every search result. Pages and articles are not products and need their own card fields.
- They reference `predictive_search` globally. It is populated only in the documented predictive-search/section-rendering context.

## Stretch: direction only

Retain a real search form and full-search URL first. A client controller can delay input, cancel superseded requests, replace only the suggestion section, announce changes, and preserve the input’s focus. It must not add history for every keystroke or make suggestion results the only way to access the broader query result.
