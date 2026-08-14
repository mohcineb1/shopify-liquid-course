<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 53 — Solution

## The approach

The solution extracts exactly one proven shared capability: product-price rendering. It has two real consumers, product card and purchase panel, so its input/output contract is now worth stabilising. The campaign badge remains local because one consumer and campaign-specific editor settings do not justify a public abstraction. The former global `helpers` snippet is removed in favor of a single explicit `visually-hidden` utility; it no longer chooses product context, price currency, alt text, or campaign policy.

The core rule is: **reuse behavior only after its caller contract is known; preserve configuration behavior until a named owner approves its migration.** Naming, documentation, and multi-brand strategy make this contract discoverable and upgradeable.

## Walkthrough

**1 — names are compatibility surfaces.** Sections use resource/purpose names, reusable snippets use responsibility names, local-only pieces carry an internal/private signal, and setting IDs remain stable. `show_compare_at_price` is not renamed again in the exercise. In a live theme, inventory configured section instances first; if a better ID is required, introduce it alongside an owned compatibility/migration plan rather than treating it as formatting.

**2 — one explicit price API.** Both consumers now render `product-price` with a named product and a named compare-at policy. The snippet reads no hidden `product`, `card_product`, `section`, or global `settings`. Its documentation names the expected product-like input, output root, consumers, non-goals, owner, and migration evidence.

**3 — the campaign remains a section.** `campaign-badge` owns unique campaign copy/tone settings and has only one real consumer. Extracting it would create a public contract before evidence exists. A second independently owned surface with the same inputs/output and editor behavior would trigger a component decision record.

**4 — standard library stays small.** `icon`, `visually-hidden`, and `product-price` have different contracts. The manifest prevents `helpers` from becoming a second invisible component system. Each entry names caller-owned decisions and deprecation policy.

**5 — no hidden helper.** `visually-hidden` accepts explicit text and outputs only an escaped hidden span. It does not guess a translation key or product. The caller owns the meaningful accessible label.

**6 — handoff is a contract.** The handoff file points to deployable output, component owners, migration status, known routes, and update triggers. It is maintained when the contract changes, not filled with dated prose.

**7 — brands vary by owner.** Palette/copy/logo and bounded content are configuration/data choices. A different purchase contract, legal model, app integration, or information architecture may require a shared-base fork or independent repository. No Liquid branch inspects `shop.name`.

**8 — consumer and rollback evidence.** Changing a snippet root, CSS class, setting ID, or argument requires consumer search, candidate route checks, configuration inventory, and a prior implementation/revision for recovery. Store/brand ownership remains `[VERIFY]` until confirmed.

## Full files

### `snippets/product-price.liquid`

```liquid
{% doc %}
  Renders an active product price and optional compare-at price.

  @param {product} product - Required product-like object with price values.
  @param {boolean} show_compare_at - Optional; output compare-at when applicable.

  Consumers: product card and product purchase panel.
  Owner: product-surface component owner [VERIFY].
  Non-goals: availability, discount claims, currency conversion, purchase eligibility.
{% enddoc %}

<p class="product-price">
  {% if show_compare_at and product.compare_at_price > product.price %}
    <s class="product-price__compare">{{ product.compare_at_price | money }}</s>
  {% endif %}
  <span class="product-price__current">{{ product.price | money }}</span>
</p>
```

The snippet preserves Shopify’s active money formatting. It does not convert a base price, choose an eligible variant, or decide whether a product may be purchased. Those decisions belong to the caller/resource context.

### `snippets/product-card.liquid`

```liquid
{% doc %}
  @param {product} product - Required resource for card title, URL, and price.
{% enddoc %}

<article class="product-card">
  <a href="{{ product.url }}">{{ product.title }}</a>
  {% render 'product-price', product: product, show_compare_at: true %}
</article>
```

### `sections/product-purchase-panel.liquid`

```liquid
{{ 'product-surfaces.css' | asset_url | stylesheet_tag }}

<section class="product-purchase-panel">
  <h2>{{ product.title }}</h2>
  {% render 'product-price', product: product, show_compare_at: section.settings.show_compare_at_price %}
</section>

{% schema %}
{
  "name": "Purchase panel",
  "settings": [
    { "type": "checkbox", "id": "show_compare_at_price", "label": "Show compare-at price", "default": true }
  ]
}
{% endschema %}
```

The setting ID is retained. Before a live rename, export/inventory existing instances and document how the old configuration is read, migrated, or retired. A label correction is safer than an identifier rename when only the merchant language is unclear.

### `snippets/visually-hidden.liquid`

```liquid
{% doc %}
  @param {string} text - Required already-selected accessible text.
  Outputs escaped text in the shared visually-hidden wrapper.
{% enddoc %}

<span class="visually-hidden">{{ text }}</span>
```

This is the replacement for `helpers`. Callers choose the text and translation context explicitly:

```liquid
{% render 'visually-hidden', text: 'products.product.price' | t %}
```

### `standard-library.md`

```md
# Theme standard library

| Entry | Responsibility / inputs | Output boundary and consumers | Owner / deprecation policy |
| --- | --- | --- | --- |
| `icon` | Controlled theme-owned icon name | Trusted inline SVG only; callers own meaning/label | Design-system owner [VERIFY]; replace with named icon mapping |
| `visually-hidden` | Required `text` string | Escaped hidden span; callers own translation/context | Accessibility owner [VERIFY]; migrate callers before deletion |
| `product-price` | `product`, optional `show_compare_at` | Price paragraph; card and purchase panel | Product-surface owner [VERIFY]; introduce replacement before changing API |
```

### `component-contract.md`

```md
# Component contracts

## `product-price`

Inputs: required product; optional compare-at display boolean. Output: `.product-price` root with current/conditional compare price. Supported consumers: `product-card`, `product-purchase-panel`. Non-goals: availability, discount math, conversion, eligibility. Change procedure: inventory renders/classes/tests, add compatible API path, candidate-test collection and product routes, then retire old path with owner approval.

## `campaign-badge`

Local section owner: campaign/merchant content owner [VERIFY]. It remains local because it has one consumer and its copy/tone schema is campaign-specific. Extraction threshold: a second independently owned surface needs the same inputs, output, editor behavior, and test matrix; then write a new contract before creating a reusable block/snippet.
```

### `naming.md`

```md
# Naming and migration convention

- Sections: `resource-or-page-purpose.liquid` (for example `product-purchase-panel`).
- Public reusable snippets: `resource-responsibility.liquid` (for example `product-price`).
- Local/private implementation: an internal/private prefix only when it should not be broadly discovered or selected.
- Assets: owning surface/behavior (`product-surfaces.css`).
- Setting IDs: stable scoped nouns; labels may change independently.

Before a live setting-ID change, [VERIFY] inventory JSON templates/settings data, editor instances, locales, app references, and merchant guidance. Add/migrate/test a compatible path, record owners/routes/rollback, then remove the old key only with approval.
```

### `handoff.md`

```md
# Product surface handoff

Deployable theme output: [VERIFY] project output path and build command. `product-price` is owned by the product-surface team and is consumed by `product-card` and `product-purchase-panel`. Test collection-card and product-panel routes in relevant market/language/price state [VERIFY]. The `show_compare_at_price` ID is persisted configuration; follow the naming migration record before changing it. Campaign badge copy/tone is merchant-owned local section state. Update this document when an API, consumer, setting migration, build target, brand boundary, or verification route changes.
```

### `brand-strategy.md`

```md
# Northstar / Coastline strategy

Use a shared base for product-price, utility contracts, quality policy, and compatible product surfaces. Brand-owned configuration/data may provide palette tokens, logo assets, copy, and bounded content. Do not branch on `shop.name`.

Adopt separate repositories or a deliberate shared-base fork when purchase workflows, legal regions, information architecture, app contracts, or release authority diverge. A base upgrade records base version, API compatibility, candidate routes, merchant configuration checks, owner, and rollback revision [VERIFY].
```

## What people get wrong here

**Extracting on first use.** The campaign badge looks reusable only because every piece of markup can be copied. Its editor contract has not met a second independent consumer, so extraction would publish unsupported parameters.

**Keeping an implicit price snippet.** A global `product` works until the snippet renders inside a card, block, search result, or different resource context. Explicit inputs make callers and tests discoverable.

**Treating a setting ID like a CSS class.** A class rename can break consumers; a persisted setting ID can also strand configuration. Both need inventories, but the latter requires merchant/editor reconciliation.

**Using utilities to hide commercial choices.** A utility can escape text or render a controlled icon. It should not decide product identity, availability, price conversion, brand policy, or accessible meaning.

**Configuring brand with store-name branches.** A deployment identity is not a content API. Use explicit configuration/brand data or separate code where contracts truly diverge.

## Stretch: direction only

A third brand adopts `product-price` by recording the shared-base version, argument/root compatibility, candidate collection/product routes, market/merchant configuration evidence, owner, and rollback revision. It does not add a third-brand condition to the snippet; variation belongs at a documented brand boundary.
