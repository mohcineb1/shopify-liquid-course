<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 63 — Solution

## The approach

The starter treats every vendor as essential, records acceptance automatically, edits a Shopify cookie, and calls an unsupported compliance claim a trust page. The solution changes the architecture, not only the popup. The theme loads the Customer Privacy API, queries the specific **Allowed** method before optional processing, responds to a real consent-change event, keeps optional integrations off on error, and makes policy content an owner-reviewed release surface. It does not decide which laws apply or what a merchant may process.

| Starter failure | Correct contract |
| --- | --- |
| Scripts load in the document head | Optional code has an approved purpose and starts only when its Allowed method permits it |
| `localStorage` authorizes tracking | Allowed methods combine settings, location, and visitor decision |
| Cookie edited/direct auto-accept | Consent is set only through an explicit visitor interaction and supported API |
| Two banners | One approved provider/entry point `[VERIFY]` |
| “100% compliant” copy | Accurate, owner-approved statement/policy content only |
| `display: none` focus strategy | Reachable accessible UI plus no-JS/essential storefront fallback |

## 1 — Processing register and asset classification

`records/processing-register.md` is the first deliverable. It prevents the vague word “essential” from turning every commercial script into an exemption.

| Asset/event | Proposed purpose | Gate | Data boundary | Owner/test/removal |
| --- | --- | --- | --- | --- |
| Storefront core behavior | Required buyer navigation/cart behavior `[VERIFY]` | No optional-vendor gate if genuinely required | Minimal platform/theme data | Theme owner, degraded-mode test, asset removal review |
| Analytics vendor | Usage measurement `[VERIFY]` | `analyticsProcessingAllowed()` | Approved minimal event fields/destination `[VERIFY]` | Vendor/merchant owner, decline/change fixture, removal path |
| Marketing vendor | Attribution/advertising `[VERIFY]` | `marketingAllowed()` | Approved minimal fields/destination `[VERIFY]` | Vendor/merchant owner, decline/change fixture, removal path |
| Pixel | Shopify-supported measurement/pixel purpose `[VERIFY]` | Supported pixel/privacy behavior | Pixel event contract | Pixel owner, configuration/consent candidate `[VERIFY]` |
| Preference helper | Visitor preference purpose `[VERIFY]` | `preferencesProcessingAllowed()` | Minimal necessary state | Theme owner, failure/retirement fixture |

Every actual purpose, essential status, region, merchant configuration, destination, retention, vendor agreement, pixel setup, policy owner, candidate, release, and rollback is `[VERIFY]`. This is a technical inventory, not a legal determination.

## 2 — Corrected privacy loader

The loader does not insert vendor scripts in `theme.liquid`. It first loads the supported capability, uses purpose-specific permissions, and treats error as “do not start optional processing.” It also re-evaluates owned integrations when consent changes.

<!-- solution/assets/privacy-loader.js -->
```js
(function () {
  const state = {analytics: false, marketing: false};

  function loadPrivacyApi() {
    return new Promise((resolve, reject) => {
      window.Shopify.loadFeatures(
        [{name: 'consent-tracking-api', version: '0.1'}],
        (error) => error ? reject(error) : resolve(window.Shopify.customerPrivacy)
      );
    });
  }

  function startApprovedAnalytics() {
    // Load the approved analytics integration exactly once.
  }

  function startApprovedMarketing() {
    // Load the approved marketing integration exactly once.
  }

  function stopOrDisableAnalytics() {
    // Follow the approved vendor stop/disable contract [VERIFY].
  }

  function stopOrDisableMarketing() {
    // Follow the approved vendor stop/disable contract [VERIFY].
  }

  function reconcile(privacy) {
    const analyticsAllowed = privacy.analyticsProcessingAllowed();
    const marketingAllowed = privacy.marketingAllowed();

    if (analyticsAllowed && !state.analytics) {
      startApprovedAnalytics();
      state.analytics = true;
    } else if (!analyticsAllowed && state.analytics) {
      stopOrDisableAnalytics();
      state.analytics = false;
    }

    if (marketingAllowed && !state.marketing) {
      startApprovedMarketing();
      state.marketing = true;
    } else if (!marketingAllowed && state.marketing) {
      stopOrDisableMarketing();
      state.marketing = false;
    }
  }

  loadPrivacyApi().then((privacy) => {
    reconcile(privacy);
    document.addEventListener('visitorConsentCollected', () => reconcile(privacy));
  }).catch(() => {
    // Optional analytics/marketing remain off. Core storefront still works.
  });
}());
```

Shopify documents that Allowed methods combine merchant settings, location, and consent; `currentVisitorConsent()` does not.[1] The `visitorConsentCollected` event publishes on a changed decision, not merely when the listener is installed.[1] The code deliberately avoids a generic “load all tags” function, direct Shopify-cookie access, automatic `setTrackingConsent`, and pretending that deleting a script element proves a vendor has stopped processing. Vendor change-state behavior has to be verified and owned.

The corrected layout loads only theme assets and the supported privacy loader; it contains no inline analytics/marketing/heat-map includes.

<!-- solution/layout/theme.liquid -->
```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    {{ content_for_header }}
    {{ 'privacy-loader.js' | asset_url | script_tag: defer: true }}
  </head>
  <body>
    {% section 'privacy-notice' %}
    {{ content_for_layout }}
  </body>
</html>
```

> [VERIFY] Confirm the exact supported `script_tag` attribute behavior in the target theme/runtime and test the rendered output. The essential point is that optional vendor tags are not preloaded before the privacy decision.

## 3 — Consent-change and banner contract

`records/consent-change-contract.md` specifies no-choice, decline, accept, later-change, API failure, duplicate provider, data-sale opt-out, pixel, and vendor-stop cases. `shouldShowBanner()` is a banner-display indicator for a configured eligible region and unset consent; it is not an authorization method. `saleOfDataRegion()` indicates configured opt-out availability; Global Privacy Control may be honored automatically in applicable settings.[1] Exact regional/builder/provider behavior is `[VERIFY]`.

The solution does not implement an independent banner when Shopify or an approved app owns the active interface. Where a theme-owned entry point is approved, it is a semantic preference launcher—not a device that records consent itself.

<!-- solution/sections/privacy-notice.liquid -->
```liquid
<section class="privacy-notice" aria-labelledby="privacy-notice-heading" data-privacy-notice hidden>
  <h2 id="privacy-notice-heading">Privacy choices</h2>
  <p>Review and update your privacy preferences.</p>
  <button type="button" data-open-privacy-preferences>
    Manage privacy preferences
  </button>
</section>
{% schema %}
{
  "name": "Privacy preference entry",
  "settings": [],
  "presets": [{"name": "Privacy preference entry"}]
}
{% endschema %}
```

```css
/* solution/assets/privacy-banner.css */
.privacy-notice { border-top: 1px solid currentColor; padding: 1rem; }
.privacy-notice:focus-within { outline: 3px solid currentColor; outline-offset: 3px; }
```

The actual preference modal/provider invocation, whether a notice is shown, its region/category copy, focus policy, close behavior, and layout reservation are `[VERIFY]`. Do not hide the only control with a transform, make a close icon the only path, or display two consent systems. Test LCP, INP, CLS, keyboard, zoom, no-JavaScript, decline, acceptance, later change, and API failure against controlled fixtures.

## 4 — Theme and merchant/legal boundary

`records/theme-boundary.md` makes the limits explicit:

| Theme team | Merchant/legal/operations owner |
| --- | --- |
| Purpose-gated optional loading, minimal browser payload, accessible UI, release evidence | Regional privacy settings, lawful purpose, notices, contracts, retention, request process, legal assessment |
| Inventory of assets/events/destinations | Vendor approval and data-flow accountability |
| Pixel/event technical contract | Marketing/analytics policy and measurement need |
| Policy page rendering/links/readability | Policy wording, effective date, contact, exception and legal approval |
| Failure/rollback tests | Incident, privacy, support, and change-management ownership |

No developer should attach `GDPR`, `CCPA`, “compliant,” or “essential” labels to a vendor merely from implementation convenience. The correct record asks the accountable owner for the stated purpose and captures it as `[VERIFY]` until approved.

## 5 — Trust pages and validation

`records/trust-page-record.md` defines privacy/cookie, accessibility statement, terms/returns, and preference entry pages as reachable, semantic, readable release surfaces. Each has stable route/link, title/headings, content version, locale/market, support contact, accessibility review, owner, update cadence, exception/known-limitation handling, and re-test criteria `[VERIFY]`. The unsupported “100% compliant” line is removed. The theme does not author policy conclusions.

`records/privacy-validation-matrix.md` uses only neutral fixtures. It records API load/result; no-choice, decline, accept, later-change; optional network activity; pixel/event state; duplicate banner check; keyboard/zoom/no-JS; LCP/INP/CLS; page readability; owner, release, rollback, and re-test. It excludes visitor identifiers, customer/order data, cookies, consent IDs, sessions, vendor keys, and real-store screenshots.

## What people get wrong here

**A stored “accept” flag equals permission.** It misses region and merchant configuration. Use the purpose-specific Allowed method.

**Automatic consent is a harmless default.** Shopify requires a visitor interaction before consent is recorded.

**Removing a `<script>` stops all processing.** A loaded vendor may hold state or need an approved shutdown procedure. Verify behavior rather than assume it.

**A cookie page proves compliance.** The theme can make content reachable and usable; content/legal decisions belong to accountable owners and advisers.

## Stretch: direction only

A vendor-retirement record begins by mapping all theme, app embed, pixel, checkout/account, and legacy placements to technical owner and declared purpose `[VERIFY]`. Test that the removal produces no owned request/event in controlled fixtures, identify the vendor-side closure responsibility, and prove product/cart/navigation fallback. Do not execute the retirement or contact vendors as part of this exercise.

## References

[1]: https://shopify.dev/docs/api/customer-privacy "Shopify — Customer Privacy API"
[2]: https://help.shopify.com/en/manual/privacy-and-security/privacy/customer-privacy-settings "Shopify Help — Managing customer privacy settings"
[3]: https://shopify.dev/docs/storefronts/themes/best-practices/accessibility "Shopify — Accessibility best practices for themes"
