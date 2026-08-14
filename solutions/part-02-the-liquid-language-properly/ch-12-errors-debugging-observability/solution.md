<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-12-solution
title: "Solution — Build a guarded section diagnostic"
chapter: ch-12
---

# Solution — Build a guarded section diagnostic

The completed spotlight treats its normal customer output and its development diagnostic as separate contracts. It reads only the merchant-selected `section.settings.collection`; distinguishes a missing setting from a selected collection with no products; and emits diagnostics only when `settings.enable_theme_debug` is true. The debug snippet receives three explicit values and serializes only the title and count needed to test the hypothesis.

## 1. Establish the normal states first

The section first checks whether a collection has been selected. A missing setting is configuration feedback, not an empty collection. Once a collection exists, the section can loop its products and let the loop’s `else` handle the selected-but-empty state. This order makes the rendered behavior reproducible and prevents an absent setting from looking like a collection that happens to contain no products.

```liquid
{% if section.settings.collection != blank %}
  {% for product in section.settings.collection.products limit: 4 %}
    <li>{{ product.title | escape }}</li>
  {% else %}
    <p>This selected collection has no products yet.</p>
  {% endfor %}
{% else %}
  <p>Select a collection to configure this spotlight.</p>
{% endif %}
```

The bounded loop is normal component output, not debug data. It keeps a selected collection preview small and makes the rendering state easy to reproduce in the editor.

## 2. Guard diagnostics at the caller

All diagnostic markup is nested beneath `settings.enable_theme_debug`. When the guard is false, the response has no `<pre>` tag, no diagnostic JSON, and no label revealing the internal state. The guard is controlled at the caller so the reusable snippet stays a narrow formatter rather than discovering settings or storefront data by itself.

```liquid
{% if settings.enable_theme_debug %}
  {% render 'debug',
    label: 'Selected collection',
    title: section.settings.collection.title,
    count: section.settings.collection.products_count
  %}
{% endif %}
```

> [VERIFY] Confirm the actual ownership and default state of a production debug guard before relying on it. A theme setting is a workflow control, not a secret or authorization mechanism.

## 3. Serialize only the tested fields

The snippet owns a minimal diagnostic presentation. `label` is escaped as text; `title` and `count` are serialized with `json` inside static JSON structure. Passing fields rather than the collection Drop prevents the helper from broadening its own exposure surface.

```liquid
<pre class="debug-output">
{{ label | escape }}
{
  "title": {{ title | json }},
  "count": {{ count | json }}
}
</pre>
```

This remains valid when a collection title contains quotes. It does not serialize products, tags, metafields, cart state, customer data, or a broad collection object. `inspect` is not used because diagnostic representation is not a public data contract.

## 4. Validate the three reproduction states

Test each state independently: no selected collection; selected empty collection; selected collection with debug disabled; and selected collection with debug enabled. Record the editor setting and guard state with the URL used to inspect output. In the debug-enabled state, inspect the text content of the `<pre>` and ensure it contains only the label plus title/count payload. In the normal storefront state, search the rendered DOM for `debug-output` and confirm there is no match.

This is a diagnostic tool, so its release condition is removal from normal output. The component should keep serving its ordinary spotlight when the guard is off. If a production issue persists, collect a comparable page state and use a Theme Inspector profile for evidence rather than leaving the debug boundary enabled indefinitely.

## Validation matrix

| State | Expected output |
| --- | --- |
| No selected collection | Configuration message only. |
| Selected empty collection | Customer-facing collection-empty message. |
| Selected collection, guard off | Bounded normal list with no debug markup. |
| Selected collection, guard on | Normal list plus label/title/count diagnostic only. |
| Title with quotation marks | Parseable diagnostic JSON structure. |

## Checklist

- [x] Missing configuration and selected-empty states are distinct.
- [x] The guarded snippet receives explicit values and discovers no data itself.
- [x] The diagnostic contract serializes only title and count.
- [x] Normal storefront output has no diagnostic markup when the guard is false.
- [x] The solution mirror provides the section, CSS, and debug snippet.

## 5. Keep normal output and diagnostics separate

The section does not place its normal list inside the debug guard. A buyer viewing a configured collection should receive the same bounded spotlight whether diagnostics are on or off. The only difference is that a developer-enabled request includes the small `<pre>` block after the normal component output. This separation keeps the guard from changing the customer feature while making a debugging state easy to compare with the ordinary storefront response.

The selected collection setting is checked before its product relationship is read. That prevents a missing configuration from being treated as an empty array and gives the merchant a specific configuration message. Once the setting exists, the `for` tag owns the empty collection state. These two branches should not be collapsed: one identifies a section setup problem, while the other describes a legitimate collection state the customer can understand.

## 6. Treat the debug snippet as a narrow API

The snippet accepts `label`, `title`, and `count`. It does not read `section`, `collection`, `cart`, or any caller-local value. This is the same contract discipline as a production snippet: the caller supplies exactly what the renderer needs, and the renderer has no reason to discover a broader Drop. The label is escaped because it is ordinary HTML text. The title and count are serialized individually because their diagnostic payload must remain valid JSON even when the title contains punctuation.

A tempting shortcut is to pass the entire selected collection and render `{{ collection | json }}`. That changes a one-question diagnostic into an uncontrolled public payload. It may add unnecessary HTML weight, reveal fields unrelated to the issue, and make future debugging depend on the accidental representation of a Shopify Drop. The minimal payload answers the only question the section needs: which collection title arrived, and how many products are associated with it.

## 7. Verify release behavior

Test with the guard disabled after every diagnostic change. Inspect the rendered DOM and page source for `debug-output`, the selected collection title payload, and the diagnostic label; none should appear in an ordinary storefront response. Then test the same selected collection with the guard enabled and confirm that the normal card list did not change. Record the route, editor setting, selected collection, and guard state so another developer can reproduce the observation.

If a performance concern remains after the data contract is correct, capture a comparable Theme Inspector profile rather than extending the snippet with more data. The debug output establishes a small server-side fact; the profile establishes measured render work. Combining them without a clear hypothesis creates an over-broad diagnostic surface rather than better observability.

## Implementation checklist

- [x] The setting branch comes before the selected collection loop.
- [x] The selected-empty state belongs to the loop’s `else`.
- [x] The normal spotlight renders independently of the debug guard.
- [x] The snippet accepts explicit fields and serializes only title and count.
- [x] A guard-off response is verified to contain no diagnostic markup or data.
