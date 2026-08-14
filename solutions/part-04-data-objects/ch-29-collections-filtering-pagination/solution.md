<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 29 — Solution

## The approach

This catalog renders Shopify’s current collection query instead of inventing one. The section resolves the active sort from `collection.sort_by` or `collection.default_sort_by`, loops only the returned `collection.filters`, and wraps the grid in a 24-item pagination window. The facet snippet relies on filter transition URLs for add/remove/clear behavior, so every selection is an ordinary anchor or form request before any client enhancement exists.

The related panel is a `collection` setting rather than a string of handles. Its cardinality and product membership are managed by the merchant in a collection, not through `all_products`; this avoids the 20 unique-handle cap and permits a clearly bounded grid. The solution does not need JavaScript to meet the requirements. A later enhancement can intercept the same links and form, but the server URL remains the durable source of query state.

> [VERIFY] Confirm the filter types and their precise field/display properties in the target Shopify version. The section uses documented object shapes, but merchant filter configuration determines which types actually arrive for a collection.

## Walkthrough

### 1. Current collection state and sorting

`collection.products_count` is the result count after filters, unlike `all_products_count`. The sort select loops `collection.sort_options`; no display name or allowed value is duplicated. Its GET form preserves active filter inputs by iterating their parameter names and values, so a sort transition does not discard a facet selection. The exact hidden-input source is intentionally built from current filter state, rather than from guessed query parameters.

### 2. Facets from Shopify objects

The snippet branches only on the filter type. List and boolean values are link-first controls using `url_to_add` or `url_to_remove`; each label retains count and selected meaning. Price inputs use the parameter names supplied by minimum and maximum values. The swatch-capable branch keeps the text label in the accessible name and renders a visual representation only when the display object provides one. The no-filter path simply omits the navigation.

### 3. Progressive baseline and empty state

All filter actions are anchors or GET submits. A customer can open a result in a new tab, bookmark it, use browser history, or recover after a script failure. When zero products remain, the section keeps active-facet removal links and a clear-all destination. It does not hide the controls that are required to leave the empty query state.

### 4. Pagination and related content

The page size is 24, appropriate for a moderate product card with image and price. `{% paginate %}` both makes the result window explicit and limits what the section needs to render. The related source is a collection setting; the markup shows only a bounded subset. It does not call `all_products`, whose 20-handle cap is a lookup constraint rather than a catalog data model.

### 5. Test the URL contract

Record links for two facets, a sort change, a price range, a later page and an empty result. Confirm a filter transition resets or changes pagination through Shopify’s URL instead of retaining an invalid page number. Test a collection that returns no filters and a long list where presentation must remain bounded. The right result is a reproducible URL and a server-rendered result, not merely a grid that appears to have changed.

## Full code

### `sections/collection-results.liquid`

```liquid
{{ 'collection-results.css' | asset_url | stylesheet_tag }}
{% assign active_sort = collection.sort_by | default: collection.default_sort_by %}
<section class="collection-results page-width" data-collection-results>
  <header>
    <h1>{{ collection.title | escape }}</h1>
    <p>{{ collection.products_count }} products</p>
    <form method="get">
      {% for filter in collection.filters %}
        {% for value in filter.active_values %}
          <input type="hidden" name="{{ value.param_name }}" value="{{ value.value }}">
        {% endfor %}
      {% endfor %}
      <label for="SortBy">Sort</label>
      <select id="SortBy" name="sort_by">
        {% for option in collection.sort_options %}
          <option value="{{ option.value }}" {% if option.value == active_sort %}selected{% endif %}>{{ option.name | escape }}</option>
        {% endfor %}
      </select>
      <button type="submit">Apply sort</button>
    </form>
  </header>

  {% render 'collection-facets', collection: collection %}

  {% paginate collection.products by 24 %}
    {% if collection.products_count > 0 %}
      <ul class="collection-results__grid">
        {% for product in collection.products %}
          <li><a href="{{ product.url }}">{{ product.title | escape }}</a></li>
        {% endfor %}
      </ul>
      {% if paginate.pages > 1 %}{{ paginate | default_pagination }}{% endif %}
    {% else %}
      <div class="collection-results__empty">
        <p>No products match these filters.</p>
        {% render 'collection-facets', collection: collection, active_only: true %}
        <a href="{{ collection.url }}">Clear all filters</a>
      </div>
    {% endif %}
  {% endpaginate %}

  {% if section.settings.related_collection != blank %}
    {% assign related_collection = collections[section.settings.related_collection] %}
    {% if related_collection != blank %}
      <aside aria-label="Related products"><ul>{% for product in related_collection.products limit: 4 %}<li><a href="{{ product.url }}">{{ product.title | escape }}</a></li>{% endfor %}</ul></aside>
    {% endif %}
  {% endif %}
</section>
{% schema %}
{
  "name": "Collection results",
  "settings": [
    { "type": "collection", "id": "related_collection", "label": "Related collection" }
  ]
}
{% endschema %}
```

### `snippets/collection-facets.liquid`

```liquid
{% if collection.filters != blank %}
  <nav aria-label="Filters">
    {% for filter in collection.filters %}
      {% if active_only %}
        {% for value in filter.active_values %}
          <a href="{{ value.url_to_remove }}">Remove {{ value.label | escape }}</a>
        {% endfor %}
      {% elsif filter.type == 'price_range' %}
        <form method="get">
          <h2>{{ filter.label | escape }}</h2>
          <label>Minimum <input name="{{ filter.min_value.param_name }}" value="{{ filter.min_value.value }}"></label>
          <label>Maximum <input name="{{ filter.max_value.param_name }}" value="{{ filter.max_value.value }}"></label>
          <button type="submit">Apply price</button>
        </form>
      {% else %}
        <section><h2>{{ filter.label | escape }}</h2><ul>
          {% for value in filter.values %}
            <li>
              <a href="{% if value.active %}{{ value.url_to_remove }}{% else %}{{ value.url_to_add }}{% endif %}" {% if value.active %}aria-current="true"{% endif %}>
                {% if value.display and value.display.type == 'swatch' %}<span aria-hidden="true">●</span>{% endif %}
                {{ value.label | escape }} ({{ value.count }})
              </a>
            </li>
          {% endfor %}
        </ul></section>
      {% endif %}
    {% endfor %}
  </nav>
{% endif %}
```

### `assets/collection-results.css`

```css
.collection-results { display: grid; gap: 1rem; }
.collection-results__grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); list-style: none; padding: 0; }
.collection-results__empty { padding: 2rem; border: 1px solid currentColor; }
.collection-results [aria-busy="true"] { opacity: .65; }
.collection-results nav ul { display: flex; flex-wrap: wrap; gap: .75rem; list-style: none; padding: 0; }
```

### `notes.md`

```markdown
# Collection query verification

| Scenario | URL/state evidence | Result or recovery |
| --- | --- | --- |
| Two facets | Both Shopify filter parameters remain present. | Grid and count match server result. |
| Sort while filtered | Active values persist with `sort_by`. | Correct sorted filtered result. |
| Price boundary | Filter-supplied param names submitted. | Values restore from filter state. |
| Remove / clear | Transition URLs remain clickable. | Query can return to collection URL. |
| Later page | Paginate link represents current result window. | Filter changes reset through Shopify URL. |
| Empty result | Active values and clear link remain visible. | Customer can recover. |
| No filters returned | Facet nav is absent. | Grid remains functional. |
| Long-value facet | Display budget tested. | No client-built value universe. |
```

All four files are mirrored under `solution/` at the starter paths.

## What people get wrong here

- They render `all_products_count` after filters. That reports the original collection instead of the result the customer sees.
- They manually concatenate filter parameters. Filter URLs encode the correct add/remove/reset transition and preserve query semantics.
- They rely on `for limit` to control collection fetching. It limits rendering, while `paginate` establishes the query window.
- They replace a handle list with a larger `all_products` list. The 20 unique-handle cap still makes it an unsuitable catalog source.

## Stretch: direction only

Keep each filter link as the baseline, then attach a scoped request controller to the catalog surface. Abort prior requests, parse the returned section, replace the grid/facets atomically, restore focus to the initiating control, and update history only after success. Decide separately whether a pagination link, sort form, price submission, or clear-all action is worth intercepting; all must remain valid navigation when the controller is absent.
