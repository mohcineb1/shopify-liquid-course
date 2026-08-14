<!-- STATUS: final -->
---
id: ch-10-exercise
title: "Build a Shopify-aware product signal card"
chapter: ch-10
---

# Exercise — Build a Shopify-aware product signal card

A product template needs a compact “signal card” beside its purchase controls. It must show the product’s media, a correctly formatted price, one optional typed product fact, and localized UI copy. The starter has the semantic shell and CSS; it deliberately omits every Shopify-specific output boundary. Complete the component without reconstructing platform-managed URLs, money, media markup, localization, or metafield representation by hand.

## The brief

Finish the section, stylesheet, and snippet in `starter/`. The section runs in a product context and must use `product` and `section.settings` only. Render the setting heading with a translation key fallback, not a hand-built customer-facing sentence. Keep the translation output inside the supplied heading element.

Render the current product price using an appropriate Shopify money filter. Do not divide, append a currency sign, parse a formatted string, or use CSS to hide portions of a price. The card’s visual contract is a single, customer-facing price representation.

If `product.featured_image` exists, render it through the current object-aware image route. Request a bounded rendition suitable for this small card, supply useful alt text from the product title, and preserve the CSS hook. Do not use legacy filename image filters or build an `<img>` URL manually. If no featured image exists, retain the supplied text fallback instead of outputting an empty image element.

The card also exposes the optional `product.metafields.custom.material` fact. Preserve the starter’s wrapper only when the metafield is present, and let the typed metafield filter own its interior representation. Do not assume that this namespace/key will always be plain text or add resource-specific fallback copy.

Finally, finish the supplied JSON snippet so it emits only the product’s declared title and URL using field-level `json` serialization. It is a non-executing data boundary for a later browser consumer, not a place to dump `product`, use `inspect`, or construct quoted JSON by string concatenation.

## Constraints

| Area | Requirement |
| --- | --- |
| Heading | Resolve the supplied locale key with `t`; do not hard-code shopper copy. |
| Price | Use one Shopify money-formatting filter on `product.price`. |
| Image | Use `image_url` followed by `image_tag` only when a featured image exists. |
| Metafield | Use `metafield_tag` for the optional typed value and conditionally render its wrapper. |
| JSON | Serialize only title and URL with `json` within the provided data script. |
| Scope | Do not add payment buttons, compare-at logic, color/font work, cart behavior, structured data, a legacy filter, or JavaScript. |

> [VERIFY] Before changing the chosen metafield or image options in production, verify its current type and the supported image-filter options. This exercise needs no inferred inventory, availability, or price policy.

## Acceptance criteria

A product with an image produces one sized image element with product-title alt text. A product without an image produces the visible fallback and no empty image element. A product price is formatted through a Shopify money filter, so its representation follows the active store context. A present material metafield receives typed markup inside the designated wrapper; an absent one produces no empty wrapper. The final data script is valid JSON even if the product title has quotation marks.

Inspect the rendered source as well as the visual result. The price should contain the output of a money filter rather than manually added punctuation. The image path should originate from an image object. The JSON script should contain only the two declared keys, with string values serialized independently. These checks make platform ownership visible and prevent a component that merely looks correct from carrying an unsafe or brittle representation.

## Files to work in

```text
course/part-02-the-liquid-language-properly/ch-10-filters-the-shopify-specific-set/
├── exercise.md
└── starter/
    ├── assets/section-product-signal-card.css
    ├── sections/product-signal-card.liquid
    └── snippets/product-signal-data.liquid
```

## Self-review

- [ ] Each value is rendered through the Shopify-aware filter that owns its output boundary.
- [ ] Missing image and metafield states do not leave empty structural markup.
- [ ] The displayed price is platform-formatted, not string-built.
- [ ] The JSON boundary serializes only declared fields.
- [ ] All three starter files remain usable in a current theme.
