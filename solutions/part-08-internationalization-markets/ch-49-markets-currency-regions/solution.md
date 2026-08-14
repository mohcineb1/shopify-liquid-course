<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 49 — Solution

## The approach

The solution treats Markets as storefront context owned by Shopify configuration. The section reads current country, language, and market from `localization`, renders only available options, and changes context through a real localization form. It removes the browser-side exchange calculation and displays Shopify’s active money value. The Canadian message is a narrow merchant-owned presentation condition, while product/catalog availability remains configuration-led. Finally, the layout preserves `content_for_header`, uses `canonical_url`, and removes the duplicate manual hreflang links so automatic Markets annotations have one source.

The solution deliberately does not promise a country, catalog, tax, or price outcome. Those facts require configured-store verification. The test record names observed context and routes; the decision log separates platform/configuration owner from the theme presentation owner.

## Walkthrough

**1 — context.** The section prints the active localization context and loops only available countries/languages.

**2 and 3 — form.** `{% form 'localization' %}` posts native `country_code` and `locale_code` controls. A submit button is retained, so JavaScript is optional.

**4 — active price.** The theme uses `money_with_currency` instead of conversion, rounding, or symbol mutation.

**5 and 6 — bounded regional content.** A Canadian notice is conditional and merchant-owned. The card checks whether a product resource exists before promising a purchase.

**7 — SEO owner.** `content_for_header` remains in the head; hard-coded alternates disappear. Canonical uses `canonical_url`.

**8 and 9 — evidence.** Route tests and decisions distinguish configured outputs from code assumptions.

## Full code

### `sections/market-desk.liquid`

```liquid
<section class="market-desk" {{ section.shopify_attributes }}>
  <p>{{ localization.country.name }} · {{ localization.language.endonym_name }}</p>
  {% form 'localization', id: 'MarketDeskLocalization' %}
    <label for="MarketCountry">Country or region</label>
    <select id="MarketCountry" name="country_code">
      {% for country in localization.available_countries %}
        <option value="{{ country.iso_code }}" {% if country.iso_code == localization.country.iso_code %}selected{% endif %}>
          {{ country.name }} ({{ country.currency.iso_code }})
        </option>
      {% endfor %}
    </select>
    <label for="MarketLanguage">Language</label>
    <select id="MarketLanguage" name="locale_code">
      {% for language in localization.available_languages %}
        <option value="{{ language.iso_code }}" {% if language.iso_code == localization.language.iso_code %}selected{% endif %}>
          {{ language.endonym_name }}
        </option>
      {% endfor %}
    </select>
    <button type="submit">{{ 'general.update' | t }}</button>
  {% endform %}

  {% if product != blank %}
    <p class="price">{{ product.price | money_with_currency }}</p>
    <a href="{{ product.url }}">{{ product.title }}</a>
  {% else %}
    <p>{{ 'products.product.unavailable' | t }}</p>
  {% endif %}

  {% if localization.country.iso_code == 'CA' and section.settings.show_canada_delivery_notice %}
    <aside class="market-notice">{{ section.settings.canada_delivery_notice }}</aside>
  {% endif %}
</section>
```

### `layout/theme.liquid`

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  {{ content_for_header }}
  <link rel="canonical" href="{{ canonical_url }}">
</head>
<body>{{ content_for_layout }}</body>
</html>
```

### `assets/market-desk.js`

```js
const form = document.querySelector('#MarketDeskLocalization');
form?.addEventListener('change', (event) => {
  if (event.target.matches('select')) form.requestSubmit();
});
```

The module is optional convenience only. The labelled selects and submit button continue to work if it fails or is absent.

### `market-test.md`

```md
| Context | Verify |
| --- | --- |
| CA / English | selected country/language, active CAD display, configured notice, canonical and one hreflang source |
| FR / French | localized URL, French labels, market product/catalog availability, no CA notice |
| BE / French | available selector values, active price context, direct URL, canonical/head output |

Repeat each selector submission with JavaScript disabled. Record configuration evidence separately from theme output.
```

### `decision-log.md`

```md
| Change | Configuration owner | Theme owner | Rollback signal |
| --- | --- | --- | --- |
| Country/language selector | Markets availability/routing | Form labels and fallback | Selected context fails to update |
| Price | Market currency/rounding/catalog | Active money presentation | Card and checkout conflict |
| Canadian notice | Merchant policy text | Bounded display condition | Claim is not valid in configured CA route |
| SEO tags | Markets domain/language settings | Preserve header/canonical | Duplicate or missing head annotation |
```

## What people get wrong here

**Changing only a symbol.** A visible euro sign does not establish a market, price, catalog, or checkout context.

**Hard-coding country choices.** A control can promise a destination that Markets does not make available.

**Using a country branch as catalog logic.** Theme conditions can display messaging; catalog sellability remains configuration ownership.

**Duplicating hreflang.** Automatic and manual tags together create conflicting annotations. Choose one documented source.

## Stretch: direction only

Model notices as merchant-managed market content with explicit eligibility and fallback. Keep legal/catalog authority outside arbitrary per-country Liquid branches.


## Ownership and verification analysis

The form is the boundary between user intent and Shopify’s configured market context. Its country and language options are generated from the corresponding available arrays, which prevents the theme from advertising a destination or language unavailable to this storefront. The selected attributes reflect current context rather than a cookie or local JavaScript state. On submission, Shopify—not a string concatenation around a path—decides the correct localized route and related storefront behavior. Retaining the submit button makes this result available with JavaScript disabled; the small change listener only removes an extra click for buyers whose browser can enhance it.

Pricing follows the same ownership rule. `money_with_currency` formats the active price provided by Shopify. The solution never reads an embedded base amount and never uses a browser exchange rate. This avoids the false precision of a rate that ignores configured adjustments, rounding rules, tax display, catalog state, or checkout context. The product link and active price render only when a product resource is actually present. In a real Market setup, the route-level test must confirm what the configured catalog exposes; a theme cannot make an unavailable catalog item sellable merely by constructing an Add to cart button.

The Canadian notice illustrates a bounded presentation concern. A merchant controls whether the notice is enabled and its content, while the country condition scopes where it appears. This is suitable for a validated delivery explanation, not for determining legal eligibility, catalog membership, price, or tax. The no-match behavior is intentionally ordinary storefront output: no empty promotion container and no contradictory claim. If the merchant expands the policy to another market, update configuration/content ownership and test it rather than accumulating scattered `iso_code` branches.

SEO has a single source. Shopify’s automatic Markets hreflang output reaches the document head through `content_for_header`; manual alternates in the starter are removed. The layout retains `canonical_url`, which lets each localized page identify its appropriate canonical URL. The result must be inspected in a configured route because source code cannot prove that a market owns a domain/subfolder or that automatic annotations are active. The test should confirm one hreflang set, no app-injected duplicate, and a self-referencing canonical on each localized URL. If a separate-store integration demands manual hreflang, it needs an explicit documented replacement owner before automatic tags are disabled.

The market test record is deliberately a matrix rather than a declaration. CA/en, FR/fr, and BE/fr may differ in available countries, localized route behavior, active language, catalog entries, and currency presentation. For every row, capture evidence after form submission and after a direct URL visit; repeat with JavaScript blocked. A raw template condition, preview URL, or formatted symbol is not evidence of configured market behavior. Assign observed failures to Markets configuration, catalog, translations, selector markup, price rendering, theme content, or SEO output. That diagnosis prevents an innocent display fix from concealing a commercial configuration defect.

Finally, keep buyer claims conservative. A generic Canadian delivery notice may need carrier, threshold, product, and remote-region qualifications; only an authorised merchant policy owner can validate its wording. The solution’s condition demonstrates architecture, not a legal promise. Mark such facts for verification and design rollback as an immediate setting/content disable rather than an emergency code edit. This preserves trust while allowing the theme to present configured Markets context clearly.
