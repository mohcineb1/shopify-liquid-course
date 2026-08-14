<!-- STATUS: final -->
# Chapter 49 — Markets, Currency & Regions

A Markets-aware theme does not implement a private currency switcher. A market can affect country, language, prices, catalog availability, localized content, URL, and SEO annotations. Theme code must expose current storefront context, submit choices through Shopify’s localization mechanism, and avoid overriding price or URL relationships that Shopify coordinates.

## 49.1 The `localization` object and market-aware rendering

The Liquid `localization` object describes storefront options and current context. Shopify documents `available_countries`, `available_languages`, current `country`, `language`, and `market`.[1] Use it for a selector and bounded buyer-facing presentation. It is not permission to infer a visitor’s eligibility from IP or hard-code country lists.

```liquid
<p class="market-context">
  {{ localization.country.name }} · {{ localization.language.endonym_name }}
</p>
{% if localization.market %}<p>{{ localization.market.handle }}</p>{% endif %}
```

Expose this context where it helps a buyer: a footer selector, shipping notice, policy link, or market-owned banner. Do not scatter branches on `localization.country.iso_code` across unrelated sections. A durable theme names the business rule, gives it a merchant owner, then renders it only in the market context that owns it.

The available arrays are a contract. A country or language absent from `localization.available_countries` or `localization.available_languages` must not appear in custom controls. Markets configuration, catalogs, and availability belong to Shopify’s configured context; the theme consumes it rather than recreating it. Unsupported options create promises the storefront cannot keep.

> [VERIFY] Confirm current market object properties and market-specific catalog behavior in the target store before branching on a market handle or country identifier.

## 49.2 Country and language selectors as real forms

Changing country or language changes storefront context. It needs a Liquid localization form, not a button that rewrites a URL or JavaScript that changes a symbol. Form submission lets Shopify apply the choice, route to a proper localized URL, and coordinate price, catalog, and translation context.

```liquid
{% form 'localization', id: 'FooterLocalization' %}
  <label for="Country">Country or region</label>
  <select id="Country" name="country_code">
    {% for country in localization.available_countries %}
      <option value="{{ country.iso_code }}" {% if country.iso_code == localization.country.iso_code %}selected{% endif %}>
        {{ country.name }} ({{ country.currency.iso_code }})
      </option>
    {% endfor %}
  </select>
  <label for="Language">Language</label>
  <select id="Language" name="locale_code">
    {% for language in localization.available_languages %}
      <option value="{{ language.iso_code }}" {% if language.iso_code == localization.language.iso_code %}selected{% endif %}>
        {{ language.endonym_name }}
      </option>
    {% endfor %}
  </select>
  <button type="submit">{{ 'general.update' | t }}</button>
{% endform %}
```

The baseline works without JavaScript. Enhancement can submit on change, but must preserve labels, keyboard operation, visible state, and submit fallback. Avoid flag-only controls: flags represent countries imperfectly and do not represent a language. Explicit text makes separate country and language choices clear.

Let Shopify maintain localized routing. Do not concatenate locale prefixes around `request.path` or assume every localized resource keeps the same handle. Test country change, language change, no-JavaScript submission, direct localized URLs, and the selector after navigation.

## 49.3 Multi-currency display, rounding, and price presentation rules

Price is a market result, not a numeric value the theme converts. Render Shopify’s active price objects through the appropriate money filter; include currency codes where symbols could be ambiguous.

```liquid
<p class="price">{{ product.price | money_with_currency }}</p>
```

Never multiply a base price by a guessed exchange rate, round with JavaScript, or attach a generic symbol. Market configuration can affect currency, rounding, price adjustments, catalog availability, tax display, and compare-at presentation. Use the active rendered amount consistently in cards, forms, cart totals, discounts, and notices. A card that displays one computed value while checkout has another market value loses buyer trust.

Rounding is an active-market business result. Theme code must not reformat it into a contradictory amount. If a visual design usually omits codes, reintroduce one when multi-currency browsing or symbol overlap would make the price unclear.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/localization "Shopify — localization object"


## 49.4 Region-specific content, catalogs, and conditional sections

Region-specific content needs a declared owner. Product availability and sellability come from configured Markets and catalogs; a theme should not show an unavailable product merely because a section setting says a region should see it. Use Liquid context to present a market-owned notice, legal message, shipping explanation, or editorial block only when the configured business rule applies. Keep the condition narrow and test both eligible and ineligible markets.

```liquid
{% if localization.country.iso_code == 'CA' and section.settings.show_canada_notice %}
  <aside class="market-notice">{{ section.settings.canada_notice }}</aside>
{% endif %}
```

This is appropriate only when the merchant deliberately owns the CA notice. It is not a replacement for catalog or compliance configuration. Prefer market-aware content entries and merchant settings to dozens of hard-coded country branches. A section must still have meaningful fallback behavior when the market does not match: render the regular collection, omit an optional notice, and avoid a blank container or inaccessible “unavailable” promise.

Catalog review and visual review are separate. A market can make a product unavailable while the theme’s generic card still assumes price, image, or Add to cart behavior. Exercise target-market routes with a representative product set. Check product page, collection, search, cart, direct localized URL, and selector changes. Record which layer owns a failure: market/catalog configuration, translation, section condition, pricing display, or an app.

> [VERIFY] Validate current catalog availability, selling-plan, tax, and region policy outcomes in the configured target store before writing a region-specific buyer claim.

## 49.5 hreflang, canonical, and international SEO from Liquid

Do not generate a second set of international SEO annotations by habit. When a store uses Shopify Markets, Shopify automatically adds `hreflang` tags through `content_for_header` in the `<head>` of `layout/theme.liquid`.[2] They reflect market languages and regions, update when domains/languages change, and stay aligned with page canonical URLs.[2] The layout must keep `{{ content_for_header }}` in its head for this platform output.

```liquid
<head>
  {{ content_for_header }}
  <link rel="canonical" href="{{ canonical_url }}">
</head>
```

Shopify warns that adding manual hreflang on top of automatic tags can produce duplicate or conflicting annotations.[2] First inspect rendered head output and determine whether the automatic feature is active. In ordinary Markets setups, preserve the automatic source. Manual implementation is an exception: for example, an external system or separate-store strategy that Markets cannot coordinate. If manual tags are required, turn off automatic output first, generate alternate URLs dynamically from localization context, and ensure every localized page uses a self-referencing canonical.[2]

International SEO is not only tags. Markets can coordinate hreflang, canonical URLs, sitemaps, and crawler access when domains, subfolders, or subdomains are configured.[3] Avoid location redirects that force crawlers away from the URL they requested. Test actual localized URLs, page head annotations, self canonical, language/region variants, and a product whose localized handle differs before treating an implementation as complete.

## Checklist

- [ ] Render active and available localization context rather than hard-coded countries/languages.
- [ ] Use a real localization form with an accessible submit fallback.
- [ ] Render Shopify market prices; never perform client-side exchange conversion or rounding.
- [ ] Give regional content a merchant/configuration owner and a nonmatching fallback.
- [ ] Preserve automatic `content_for_header` SEO output unless a documented manual replacement owns it.

## References

[2]: https://shopify.dev/docs/storefronts/themes/seo/hreflang "Shopify — hreflang"
[3]: https://help.shopify.com/en/manual/markets/seo "Shopify — Markets SEO"


## Designing selectors as market controls

A localization form is a buyer-facing transaction of context, even though it does not purchase anything. Give it a clear heading, labelled controls, and a submit result a buyer can understand. The country label should say “Country or region” if the underlying choice determines more than currency; calling it “Currency” misrepresents its effect on catalog, policy, tax, and delivery context. The language label should use the language’s endonym when available, alongside enough context for a multilingual shopper. Do not silently change both values when the buyer chose only one without confirming the configured outcome.

Place the selector in a stable global surface such as header, footer, or an accessible drawer. A product card should display a contextual link to the selector rather than embedding separate selectors in every card. This reduces duplicate form state and makes testing controllable. A JavaScript enhancement may submit when a `<select>` changes, but an explicit button remains necessary for no-JavaScript, slow-browser, and assistive-technology paths. Test focus return after submission and ensure the selected option reflects the new context.

The form baseline also prevents a common pricing error: changing a visible symbol alone. If a buyer selects Canada, Shopify must establish the corresponding context, not merely turn `$20.00` into `CA$20.00` with client code. Display the current currency code where it disambiguates a symbol, render the full active-market price object, and keep price fragments together in accessible text. Avoid putting a visually hidden base-currency message beside a market price unless it is a verified legal or merchant requirement; two figures can make a discount or tax presentation ambiguous.

## A market presentation audit

Evaluate a market experience by route rather than by a single product screenshot. The following audit separates objects that look related but are owned by different systems.

| Surface | Theme responsibility | Configuration/verification responsibility |
| --- | --- | --- |
| Header/footer selector | Real localization form, labels, selected context, fallback submit | Available country/language options and routing outcome |
| Product price | Render active money result consistently | Market currency, rounding, price adjustments, catalog eligibility |
| Collection/search | Graceful unavailable/empty state, no stale claim | Market catalog membership and merchandising rules |
| Regional notice | Display merchant-owned content in bounded condition | Legal, shipping, policy, and market correctness |
| SEO head | Preserve `content_for_header` and canonical structure | Markets domain/language setup and automatic output state |

The audit should use a buyer account or preview context capable of changing Markets. A theme developer cannot prove Canadian catalog behavior from a default local preview alone. Capture active country, language, currency, market, route URL, rendered price, product availability, form submission outcome, and head tags. When a result differs from expectation, avoid immediately adding Liquid exceptions. First establish whether the configuration, catalog, localization form, or theme presentation layer owns the mismatch.

## Price states beyond a simple amount

Multi-currency presentation becomes harder around compare-at prices, percentage discounts, unit prices, subscriptions, gifts, and cart totals. The principle remains stable: use the values and money filters supplied for the active storefront instead of recalculating relationships in JavaScript. A rounded active price can make a percentage derived from an old base price misleading. If a discount badge must be shown, calculate or render it from the active price objects in the context Shopify exposes, and test it in each market. If the context does not provide a reliable value, omit the badge rather than show a confident but incorrect claim.

The same principle applies to shipping and tax messaging. “Free shipping over $50” may be true in one market and untrue, differently rounded, or legally incomplete in another. Give that message an explicit market/content owner; don’t make a generic theme string pretend it is universal. If a regional condition hides it, preserve the rest of the product page’s meaning. An empty promotional wrapper, a blank heading, or an inaccessible hidden alert is a theme error even if the market rule itself is valid.

## SEO verification discipline

Automatic international SEO works only when the theme preserves Shopify’s head output. Search the layout for `content_for_header`, inspect an actual localized page head, and verify that automatic hreflang/canonical output appears once. Then change a market domain, language, or subfolder configuration in an authorised test environment and confirm the output updates as the platform documents. Never copy a result from one localized product into a fixed Liquid list: translated resource handles and market URLs can differ.

If a legacy theme or application adds manual hreflang, choose one owner. Leaving both automatic and manual output active makes duplicate annotations likely. Before disabling Shopify automatic output, document the reason, implementation owner, dynamic URL source, self-referencing canonical test, alternate coverage, and rollback route. This is an SEO deployment decision, not a minor theme-style adjustment.

## Release checklist

- [ ] Available country/language options come directly from `localization`.
- [ ] Selector changes submit through a real localization form with labels and no-JavaScript fallback.
- [ ] Prices, discounts, and totals use active Shopify market values; no browser exchange calculation exists.
- [ ] Regional content has a documented business owner, condition, and nonmatching fallback.
- [ ] Localized URLs, canonical, hreflang, sitemap expectations, and `content_for_header` are inspected without duplicate tag sources.
- [ ] Every buyer claim is tested in relevant configured market context and marked `[VERIFY]` where store policy controls it.
Test every selector transition with a visible confirmation and a route-level price comparison.
Record this comparison in the market release checklist.
Keep that evidence with releases.
