<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 68 — Solution

## The approach

The starter confuses global design settings with storefront data, duplicates purchase authority in a card, assumes every market/locale feature is available, and calls a parser-blocking external bundle a performance strategy. The solution defines the capstone before implementation: it retains unknown store facts as `[VERIFY]`, uses typed route/content decisions, exposes semantic and bounded settings, assigns one product-form owner, and treats performance/accessibility as release budgets rather than slogans.

| Concern | Solution decision |
| --- | --- |
| Proposed markets | Default/market/submarket decision log, not forked templates by default |
| Product/campaign data | Resource metafields/references or section content with owner/lifecycle |
| Global settings | Semantic tokens and safe global defaults only |
| Purchase interaction | Main product section owns form/selected state |
| Reusable card | Presentation-only snippet with explicit `product` input |
| Quality | Route/fixture/tool/owner/exception budget register |

## 1 — Client brief and information architecture

`records/client-brief.md` turns “multi-market apparel” into a bounded project. It records buyer jobs—discover, understand fit/material/care, select variant, add to cart—and merchant jobs—compose campaigns, maintain guides, choose safe market-sensitive content. It excludes custom checkout authority, browser secrets, customer-data access, price/eligibility calculation in theme code, unapproved third-party tags, and unverified localization/legal claims.

The default market is the baseline; domestic and international variants are hypotheses until actual Markets hierarchy, plan, languages, currencies, domain, catalog, content workflow and approval owner are verified. Shopify documents that market theme customization is available on Advanced or Plus and that defaults can be inherited/overridden across markets/submarkets.[1] This supports the decision log model; it does not prove Northstar can configure a particular market.

`records/information-architecture.md` maps home, collection, product, guide, campaign/journal and cart to buyer intent, resource, merchant composition, fallback, landmark, quality risk and fixture. `records/content-decision-record.md` keeps material/fit as product attributes; models reusable care guidance as a structured record referenced from products `[VERIFY]`; treats campaign panels as bounded editorial composition; and rejects customer segments and operational eligibility as theme text settings.

## 2 — Settings and token contract

The solution replaces arbitrary CSS/HTML/data fields with a semantic foundation. General theme settings retain stable global choices; dynamic data belongs to compatible section/block contexts. Shopify documents that dynamic sources are not available for general theme settings and depend on compatible resource context.[2]

<!-- solution/config/settings_schema.json -->
```json
[
  {
    "name": "Design system",
    "settings": [
      {"type": "color", "id": "color_surface", "label": "Surface color", "default": "#ffffff"},
      {"type": "color", "id": "color_text", "label": "Text color", "default": "#151515"},
      {"type": "select", "id": "layout_density", "label": "Layout density", "default": "standard", "options": [
        {"value": "compact", "label": "Compact"},
        {"value": "standard", "label": "Standard"},
        {"value": "roomy", "label": "Roomy"}
      ]}
    ]
  }
]
```

`records/settings-contract.md` specifies roles, defaults, consumers, valid ranges, contrast-review requirement `[VERIFY]`, responsive effects, market policy, and prohibited uses. Editors cannot inject arbitrary HTML/CSS, turn a global token into product truth, or disable focus/labels through a visual control.

## 3 — Component inventory and corrected files

`records/component-inventory.md` gives each component a parent/context, inputs, landmark/output, editor controls, dynamic-data rule, empty state, CSS/JS owner, accessibility behavior, performance cost, fixture and removal condition. The main product section remains the only product-form owner.

<!-- solution/snippets/product-card.liquid -->
```liquid
<article class="product-card">
  <a href="{{ product.url }}" class="product-card__link">
    {% if product.featured_image != blank %}
      {{ product.featured_image | image_url: width: 800 | image_tag: loading: 'lazy', alt: product.featured_image.alt }}
    {% endif %}
    <h2>{{ product.title | escape }}</h2>
    <p>{{ product.price | money }}</p>
  </a>
</article>
```

<!-- solution/snippets/guide-callout.liquid -->
```liquid
{% if guide != blank %}
  <aside class="guide-callout" aria-labelledby="guide-title-{{ section.id }}">
    <h2 id="guide-title-{{ section.id }}">{{ guide.title | escape }}</h2>
    {{ guide.instructions | metafield_tag }}
  </aside>
{% endif %}
```

The guide is passed explicitly by its parent. Actual metaobject field shape/visibility, market policy and display location remain `[VERIFY]`; the snippet makes no hidden product assumption.

<!-- solution/sections/campaign-hero.liquid -->
```liquid
<section class="campaign-hero campaign-hero--{{ section.settings.tone }}">
  {% if section.settings.heading != blank %}<h2>{{ section.settings.heading | escape }}</h2>{% endif %}
  {% if section.settings.text != blank %}<div class="campaign-hero__text">{{ section.settings.text }}</div>{% endif %}
  {% if section.settings.image != blank %}
    {{ section.settings.image | image_url: width: 1800 | image_tag: alt: section.settings.image.alt }}
  {% endif %}
</section>
{% schema %}
{"name":"Campaign hero","settings":[{"type":"select","id":"tone","label":"Tone","default":"surface","options":[{"value":"surface","label":"Surface"},{"value":"quiet","label":"Quiet"}]},{"type":"text","id":"heading","label":"Heading"},{"type":"richtext","id":"text","label":"Text"},{"type":"image_picker","id":"image","label":"Image"}]}
{% endschema %}
```

## 4 — Market decision and budget registers

`records/market-decision-log.md` records default behavior, proposed override, trigger, content owner, market/locale review `[VERIFY]`, fallback/reset, component, fixture, acceptance and removal date. It does not create a market override. `records/budget-register.md` names home/product/collection/cart fixtures, device/network assumptions `[VERIFY]`, progressive enhancement, image, JavaScript, visual stability and accessibility rules, tool, owner, exception and regression action.

Shopify recommends basic commerce behavior without required JavaScript, IIFE scoping, responsive images, no lazy-load for above-fold media, and a 16 KB or less minified JavaScript bundle.[3] The solution’s script is scoped and opt-in; it does not load a third-party framework.

<!-- solution/assets/capstone.js -->
```js
(function () {
  document.documentElement.classList.add('capstone-js');
}());
```

Accessibility acceptance includes keyboard traversal, visible focus, logical landmark/heading structure, labelled forms, error/dynamic announcements, modal focus behavior where later introduced, and 44px primary touch targets.[4] The candidate matrix requires fixtures and manual review; it does not report a live score or certification.

## 5 — Candidate validation

`records/candidate-validation-matrix.md` tests default/market/reset hypotheses, product data and empty guide state, editor composition, navigation/form/cart/no-JS, keyboard/focus/errors, responsive image behavior, script loading, visual stability, touch targets and budget exceptions/rollback. No market is configured, no real content is uploaded, and no target is claimed met.

### Handoff into the build chapters

The chapter-68 records are inputs to the next capstone chapters, not documentation that is filed away. Chapter 69 should implement only components whose cards state a route, parent, data contract and fallback. Chapter 70 should add interaction only where the progressive-enhancement and lifecycle contract allows it. Chapter 71 should exercise the editor, app and quality assertions in the register. Chapter 72 should use the ownership, exception, reset and rollback records during launch and handover. When implementation reveals a missing decision, update the decision record and return it to the named owner `[VERIFY]`; do not hide the gap in a special-case setting or a one-off script or unsafe workaround.

## What people get wrong here

**A market request means duplicate templates.** Start with default inheritance and a documented override decision.

**Global settings are convenient data storage.** They have different scope and cannot act as dynamic source connections.

**A product card can own purchase behavior.** It should link/present; product form state remains in its parent context.

**A budget is a score in a document.** It needs fixtures, thresholds, tools, owners, exceptions and regression action.

## Stretch: direction only

For a candidate campaign override, record default inheritance, override rationale, content/translation owner `[VERIFY]`, image crop/alt/load priority, setting/component, route fixture, budget impact, acceptance, reset and removal. Do not configure the market or invent approval.

## References

[1]: https://help.shopify.com/en/manual/online-store/themes/customizing-themes-for-markets "Shopify Help — Adapting themes for specific markets"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources "Shopify — Dynamic data sources"
[3]: https://shopify.dev/docs/storefronts/themes/best-practices/performance "Shopify — Performance best practices for themes"
[4]: https://shopify.dev/docs/storefronts/themes/best-practices/accessibility "Shopify — Accessibility best practices for themes"
