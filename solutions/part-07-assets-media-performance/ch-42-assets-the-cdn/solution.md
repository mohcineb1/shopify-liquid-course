<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 42 — Solution

## The approach

The starter fails because it treats a resolved CDN URL as source code. The fix begins with ownership, not a string replacement. The campaign CSS, JavaScript, and icon are developer-owned implementation files and therefore live in the current theme’s flat `assets/` namespace. The packing-list PDF is merchant-owned content from Admin Files. Each receives the filter matching its owner: `asset_url` for the theme files and `file_url` for the uploaded PDF. There is no resource in this task that justifies a Shopify or global asset namespace.

The cache solution is equally simple: name a stable final asset through Liquid and let Shopify resolve its CDN URL and version. Removing the timestamp is not a performance cosmetic; it restores cache reuse and makes deployment evidence meaningful. The section loads the module with `defer`, so HTML can be parsed and campaign content remains useful if the module does not execute.

## Walkthrough

**1 — remove copied delivery paths.** Every `/cdn/shop/t/...` value and manually constructed version query disappears. A source file should never contain a theme identifier or cache token because those values belong to the platform’s resolved output.

**2 — current-theme implementation files.** The stylesheet, enhancement module, and `campaign-travel-light.svg` icon are all named through `asset_url`. Their final delivery names are flat and semantic: `campaign-travel-light.css`, `campaign-travel-light.js`, and `campaign-travel-light.svg`.

**3 — uploaded content.** The packing list is intentionally not checked into source. `file_url` refers to a filename in Shopify Admin Files, allowing content operations to replace it without a theme deployment.

**4 — build translation.** Development source can remain nested in a separate source directory, but the uploaded theme contains the three final flat names. The mapping is documented so an asset reference is reviewable and a bundler cannot silently create a path Liquid cannot resolve.

**5 — non-blocking enhancement.** `defer` preserves document parsing order while the content, heading, image alternative text, and PDF link remain ordinary HTML. The starter module only adds a class; its absence cannot remove campaign information.

**6 — evidence-led caching.** The notes give the proper diagnostic order: target theme, rendered filter output, deployed filename, then cold load. No timestamp is appended because it creates a new URL even when no content changed.

**7 — inventory.** The only classifications are theme and Admin Files. The global/Shopify categories are explicitly unused, rather than guessed from a filter name.

**8 — accessible baseline.** The image retains useful alternative text, and the PDF is an ordinary link that works before or without JavaScript.

## Full code

### `sections/travel-light-campaign.liquid`

```liquid
{{ 'campaign-travel-light.css' | asset_url | stylesheet_tag }}
<script src="{{ 'campaign-travel-light.js' | asset_url }}" defer="defer"></script>

<section class="travel-light-campaign">
  <img src="{{ 'campaign-travel-light.svg' | asset_url }}" alt="Packed carry-on luggage">
  <h2>Travel light</h2>
  <p>Pack with confidence using the seasonal checklist.</p>
  <a href="{{ 'packing-list.pdf' | file_url }}">Download the packing list</a>
</section>

{% schema %}
{"name":"Travel light campaign","settings":[],"presets":[{"name":"Travel light campaign"}]}
{% endschema %}
```

### `assets/campaign-travel-light.js`

```js
document.documentElement.classList.add('travel-light-enhanced');
```

### `assets/campaign-travel-light.css`

```css
.travel-light-campaign { padding: 2rem; }
.travel-light-campaign img { display: block; max-width: 12rem; }
.travel-light-enhanced .travel-light-campaign { border-inline-start: .25rem solid currentColor; }
```

### `asset-inventory.md`

```md
# Asset inventory

| Source name | Final delivery name | Owner | URL filter | Reason |
| --- | --- | --- | --- | --- |
| `src/campaign/travel-light.css` | `campaign-travel-light.css` | Theme | `asset_url` | Developer-owned presentation. |
| `src/campaign/travel-light.js` | `campaign-travel-light.js` | Theme | `asset_url` | Developer-owned progressive enhancement. |
| `src/icons/travel-light.svg` | `campaign-travel-light.svg` | Theme | `asset_url` | Theme implementation icon. |
| Admin Files `packing-list.pdf` | `packing-list.pdf` | Admin Files | `file_url` | Merchant-replaceable download. |
| Shopify/global resource | — | [VERIFY] | — | No documented resource is required by this section. |
```

### `notes.md`

```md
# Delivery and cache evidence

1. Confirm the browser is viewing the intended preview or published theme.
2. Inspect rendered HTML and confirm each theme file is emitted by `asset_url`.
3. Confirm the final flat filename is present in that theme deployment.
4. Cold-load the buyer route and verify stylesheet, module, icon, and PDF link.

There is no timestamp or manual version query. Shopify resolves a versioned delivery URL for changed theme assets; its query value is diagnostic output, not source data.

| Source path | Final asset name |
| --- | --- |
| `src/campaign/travel-light.css` | `campaign-travel-light.css` |
| `src/campaign/travel-light.js` | `campaign-travel-light.js` |
| `src/icons/travel-light.svg` | `campaign-travel-light.svg` |
```

## What people get wrong here

**Using `asset_url` for the PDF.** It may appear to work only if a developer uploaded a copy into the theme. That makes merchant content deploy with code and breaks the stated ownership contract. Admin Files requires `file_url`.

**Appending a timestamp.** It forces a different URL whether content changed or not, sacrifices cache reuse, and hides whether the expected theme was actually deployed.

**Preserving nested bundle paths.** A source folder layout is not a theme delivery contract. Final uploaded names must be intentional and flat enough for the theme asset namespace.

**Using `global_asset_url` as a fallback.** The filter name does not grant a generic public CDN. Without a documented Shopify-owned resource, it is the wrong ownership model.

## Stretch: direction only

Build the review check from two declared sets: final uploaded asset names and Liquid `asset_url` names extracted from theme files. Report uploads with no reference and references with no upload, but allow documented dynamic includes through an explicit exception list. The check validates deployment completeness; it must never alter URL versions or generate cache-busting parameters.


## Migration and recovery checks

The safest migration changes ownership references before changing build tooling. First upload the final flat developer-owned files into the theme and replace every hardcoded include with an `asset_url` expression. Then ensure the merchant has uploaded the PDF in Admin Files and replace the old theme reference with `file_url`. Preview the campaign in a copied theme before publishing. This isolates a wrong asset name from a wrong environment: if the browser source contains the correct filter expression but the response is missing, inspect the uploaded theme asset; if the source itself names an old manual path, the Liquid deployment is stale.

Do not delete a legacy asset until every Liquid include and dynamic conditional reference is accounted for. Use a short transition inventory: old name, new final name, first route verified, and removal owner. After publication, test a cold browser profile and a buyer route that actually includes the section. A warm local cache can prove only that a previous URL worked, not that the new theme resolves the correct file. If rollback is required, restore both the previous Liquid include and its known deployed final asset; do not solve the incident with a random query value.

The content path has a different recovery rule. If an Admin Files upload is unavailable or renamed, retain an honest accessible link state or remove the optional download until the merchant replaces it. Do not silently point buyers to a developer-owned stale PDF. The distinction keeps publishing responsibility visible: theme deployment changes code assets, while Admin Files changes merchant content.
