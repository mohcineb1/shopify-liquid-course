<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 47 — Solution

## The approach

The solution changes the section only after establishing a controlled baseline. It bounds the visible grid to eight products, sorts the collection once before the loop, and uses the product already provided by the collection rather than performing `all_products` lookups. The hero renders at normal priority with width and height. One list/card tree serves all viewports; CSS changes layout without maintaining a duplicate mobile copy. The optional click enhancement is a module, so a blocked script leaves ordinary product links usable.

The accompanying records matter as much as code. They distinguish a synthetic before/after trace from delayed real-user evidence, explain how a Theme Inspector profile directs the Liquid change, preserve a responsibility reason for each DOM element, and express the CI rule as a budget with an exception policy rather than a fictional score guarantee.

## Walkthrough

**1 — baseline.** Record home, product, and collection routes under consistent preview/test data and repeat runs. RUM is confirmation after its reporting delay; Lighthouse is controlled pre-merge evidence.

**2 — server work.** Sorting happens once and the loop is explicitly limited. `product` already supplies the card resource, so repeated handle lookup disappears.

**3 — hero.** First-view media is not lazy-loaded and its intrinsic geometry is present, protecting LCP discovery and CLS.

**4 — enhancement.** A `type="module"` script has non-blocking semantics. Its local event listener is optional; an anchor still navigates without JavaScript.

**5 — DOM.** A semantic list has one card per product. Responsive CSS has no hidden duplicate card subtree.

**6 through 9 — proof.** Profile, DOM, budget, and change records name observation, owner, tradeoff, and rollback signal.

## Full code

### `sections/featured-performance-grid.liquid`

```liquid
<script type="module" src="{{ 'featured-performance-grid.js' | asset_url }}"></script>
<section class="performance-grid" {{ section.shopify_attributes }}>
  {% if section.settings.image != blank %}
    {{ section.settings.image | image_url: width: 2000 | image_tag: width: 2000, height: 800, alt: section.settings.image.alt }}
  {% endif %}
  {% assign featured_products = collection.products | sort: 'price' %}
  <ul class="cards" role="list">
    {% for product in featured_products limit: 8 %}
      <li class="card"><a href="{{ product.url }}" data-performance-card>{{ product.title }}</a></li>
    {% endfor %}
  </ul>
</section>
```

### `assets/featured-performance-grid.js`

```js
document.querySelectorAll('[data-performance-card]').forEach((link) => {
  link.addEventListener('click', () => {
    link.dataset.intent = 'product-card';
  }, { once: true });
});
```

### `assets/featured-performance-grid.css`

```css
.cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.card { min-width: 0; }
@media (max-width: 749px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
```

### `baseline.md`

```md
# Controlled baseline

| Route | Synthetic evidence | RUM evidence | LCP candidate |
| --- | --- | --- | --- |
| Home | Three mobile cold-cache runs; record median/range | Dashboard pending/delayed | Hero image |
| Product | Same device, data and preview state | Compare page-type P75 later | Product media |
| Collection | Same controlled collection | Compare URL/P75 later | Collection hero/grid |
```

### `profile-notes.md`

```md
# Profile notes

Hypothesis: repeated sorting and card loops dominate server work. In Theme Inspector, compare node count and sandwich self/total times before and after. Changed lines move sort outside loop and cap cards at eight. Re-profile with the same route/data; do not equate Liquid render time with complete TTFB.
```

### `dom-inventory.md`

```md
# DOM inventory

| Element | Responsibility |
| --- | --- |
| `section.performance-grid` | Section/editor and layout root |
| Hero image | First-view media with intrinsic geometry |
| `ul.cards` | Semantic grouping and responsive grid |
| `li.card` | One product item |

Removed: duplicate desktop/mobile card lists and presentation-only wrappers.
```

### `budget.md`

```md
# Budget policy

Audit home, product, and collection routes with stable test data. Start at an evidence-based performance threshold (for example `0.70`) and accessibility `0.90`; adjust only after repeated baseline review. Exceptions require owner, expiry, buyer benefit, rollback signal, and remeasurement.
```

## What people get wrong here

**Calling a single Lighthouse run the result.** Use repeated controlled samples; compare delayed RUM separately.

**Deleting merchant content for a score.** Remove duplication and waste first, then document any feature tradeoff.

**Treating every wide flame-graph bar as removable.** Inspect repetition, self versus total time, and buyer value.

**Using two markup trees for responsiveness.** It doubles DOM and creates content-drift risk. Use one semantic tree plus CSS.

## Stretch: direction only

For analytics, establish owner and consent before choosing idle or interaction loading. If it has no current buyer/merchant value, removal is safer than deferral.


## Evidence and rollback analysis

The performance claim starts with controlled routes, not with a dashboard screenshot. The home, product, and collection routes use fixed test data, the same device emulation, a declared cache condition, and at least three synthetic samples. Record median and range because a single score is too easily influenced by run variance. The RUM dashboard then answers a different question: whether real buyers improved over a later window. Its delay means it cannot certify a just-deployed refactor, and an observed change must be compared with app installs, theme updates, traffic mix, and page cohort.

On the collection route, Theme Inspector provides the server-side evidence. Before the change, sorting inside the card loop repeats the same calculation and the unbounded loop multiplies every card’s tags, filters, output, and `all_products` lookup. After the change, the profile should show the sort once and fewer repeated card nodes. Use the sandwich view to separate a node’s own repetitive time from time inherited from children. This makes the target concrete: reduce avoidable executions, not merely shorten a line of Liquid.

The grid limit is a product decision as well as a performance decision. Eight visible products meet the stated first-view goal, while a link or pagination path should lead to the complete catalog. If merchandising requires more cards, increase the limit deliberately and repeat the profile, DOM, and page measurement. Hiding the extra cards in CSS would keep the server, DOM, image, and accessibility cost while pretending the visual page is lighter.

The hero change protects both loading and stability. Above-fold media must be discovered normally, and width/height allow the browser to reserve geometry. Confirm the actual LCP candidate in a trace after deployment; if the candidate changes, reevaluate the resource decision rather than retaining a stale priority assumption. The solution does not add speculative preloads because a request hint must be justified by the actual critical path and compete with other initial resources.

The JavaScript module has no authority over navigation. Its listener records optional intent after a normal anchor click begins; if the asset is blocked, the link still routes to the product. Test that failure explicitly. A non-blocking attribute alone is insufficient if an enhancement removes native behavior or installs document-wide handlers on every card repeatedly.

The CI budget is intentionally an example policy. Repository secrets remain placeholders and the threshold is a decimal gate selected after baseline review. A failed run requires an owner to compare routes, resource deltas, LCP candidate, DOM, and Liquid profile. An exception is not a silent rerun: it has a buyer benefit, expiry, rollback signal, and remeasurement date. This is how performance remains an enforceable engineering constraint without confusing a synthetic score with every customer’s reality.
