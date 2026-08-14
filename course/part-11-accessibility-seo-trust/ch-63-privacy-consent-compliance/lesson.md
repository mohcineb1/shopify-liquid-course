<!-- STATUS: final -->
---
id: ch-63
title: "Privacy, Consent & Compliance"
part: 11
words: 2450
---

# Chapter 63 — Privacy, Consent & Compliance

A theme does not make a merchant compliant by displaying a banner. It can, however, avoid breaking the privacy controls Shopify provides, avoid loading optional processing before it is allowed, provide accessible transparent interfaces, and document what the implementation actually does. Compliance depends on law, merchant settings, jurisdiction, data flows, contracts, apps, and operations. This chapter is technical information, not legal advice; Shopify likewise tells merchants that privacy requirements vary and they should seek their own legal counsel.[1]

## What you’ll be able to do

- Load and use the Customer Privacy API without reading Shopify cookies or inventing consent.
- Gate optional analytics/marketing code by allowed processing purpose rather than a local boolean.
- Design a banner or preferences path that is accessible and performance-bounded.
- Separate theme implementation duties from merchant/legal/accountability duties.
- Build legal and accessibility-page templates that make current policy content usable without making unsupported claims.

## 63.1 Customer Privacy API and consent gating

The Customer Privacy API is the browser API for checking processing permissions and building consent interfaces. It applies consent decisions to Shopify-managed surfaces such as pixels, audiences, and checkout.[2] It must be loaded through `window.Shopify.loadFeatures` before `window.Shopify.customerPrivacy` is used. A theme must not read or mutate Shopify cookies directly: Shopify cautions that doing so can fail as platform implementations change.[2]

<!-- assets/privacy-gate.js -->
```js
function loadPrivacyApi() {
  return new Promise((resolve, reject) => {
    window.Shopify.loadFeatures(
      [{name: 'consent-tracking-api', version: '0.1'}],
      (error) => error ? reject(error) : resolve(window.Shopify.customerPrivacy)
    );
  });
}

async function startAnalyticsIfAllowed() {
  try {
    const privacy = await loadPrivacyApi();
    if (!privacy.analyticsProcessingAllowed()) return;
    // Start the approved analytics integration here.
  } catch (error) {
    // Keep optional processing off; preserve storefront functionality.
  }
}
```

The important word is **allowed**. `analyticsProcessingAllowed`, `marketingAllowed`, `preferencesProcessingAllowed`, and `saleOfDataAllowed` combine merchant privacy settings, visitor location, and the visitor’s consent decision.[2] `currentVisitorConsent()` alone only reports recorded choices; it does not contain the merchant/location context needed to decide whether processing is allowed. A blank consent field does not mean an integration may choose a default for the visitor.

| Need | Correct technical question | Wrong shortcut |
| --- | --- | --- |
| Analytics SDK | Is analytics processing allowed now? | `localStorage.analytics === 'true'` |
| Marketing tag | Is marketing allowed now? | Load tag then hide banner |
| Preference feature | Is preference processing allowed? | Treat locale UI as marketing consent |
| Data sale/sharing flow | Is that purpose allowed/opt-out applicable? | Map it automatically to marketing |
| Pixel | Does Shopify/privacy configuration permit its events? | Copy theme script into checkout/account contexts |

Consent can change after the first page load. The API publishes `visitorConsentCollected` when consent changes; it does not replay the current state merely because a listener was added.[2] Load the API, assess allowed purposes, subscribe to meaningful change, then start or stop only the owned optional processing. Keep a registry with vendor, purpose, category, code entry point, initial decision, later-change behavior, data sent, owner, test fixture, removal path, and `[VERIFY]` facts. This prevents an ordinary theme asset from quietly becoming an unreviewed tracking system.

Recording consent is also bounded. `setTrackingConsent` is for an actual visitor interaction with a choice UI; Shopify says not to record consent automatically on behalf of a visitor.[2] The UI must communicate the purposes it offers and preserve a decline path according to the merchant’s approved design `[VERIFY]`. The API supports preferences, analytics, marketing, and sale-of-data signals; the merchant/legal owner decides the lawful purpose/category mapping. A developer does not infer it from a vendor’s name.

> [VERIFY] Verify the merchant’s regional settings, enabled banner/provider, visitor region behavior, pixels, vendor contracts, data destinations, precise processing purpose, and release approval on an authorised candidate. A generic course cannot determine what a particular business may process.

## 63.2 Cookie banners that don't break Core Web Vitals

A consent interface has two jobs: present a meaningful choice and avoid turning the storefront into a blocking, inaccessible overlay. “Delay all JavaScript until consent” can break required Shopify/theme behavior; “load all tags then ask” defeats the gate. Classify assets first.

| Asset class | Expected treatment | Evidence needed |
| --- | --- | --- |
| Essential storefront/platform behavior | Preserve only when genuinely required `[VERIFY]` | Purpose, owner, technical necessity |
| Preference behavior | Check preference processing permission | API decision and fallback |
| Analytics | Delay optional vendor processing until allowed | Purpose mapping, event/data contract |
| Marketing/attribution | Delay until marketing allowed | Vendor, consent, destination, owner |
| Pixel/app extension | Use its supported privacy model | Pixel type/configuration and test evidence |

A banner should render as ordinary, accessible UI: semantic landmark/dialog decision, readable purpose information, keyboard controls, visible focus, labels, logical order, preference access, and state feedback. Do not trap focus in a non-modal notice; if it is a real modal, it needs the full dialog contract from chapter 61: accessible name, initial focus, containment, Escape/close behavior where appropriate, and return-focus policy. Do not put critical legal or choice text behind hover, color alone, or a tiny close icon.

Performance begins with scope. Load the privacy capability early enough to decide optional processing, but do not turn the banner into a blocking bundle that delays primary rendering. Render a light server HTML shell or platform-supported banner; load vendor scripts after an allowed decision; avoid layout shift by reserving predictable space or using a stable overlay policy; and test LCP, INP, CLS, keyboard focus, no-JavaScript behavior, declined path, accepted path, changed preference, and API failure `[VERIFY]`. The banner’s own animation is not worth losing a buyer’s ability to navigate or add a product.

`shouldShowBanner()` is useful for deciding whether the current visitor is in a configured region that should see a banner and has not already set consent; it is not a generic permission decision.[2] Likewise, `saleOfDataRegion()` indicates configured availability for a data-sale opt-out and Global Privacy Control can be automatically honored in applicable settings.[2] Do not create a second contradictory banner from a theme simply because a store already has Shopify or an app providing one. Inventory the active provider before adding code.

## 63.3 GDPR-adjacent theme responsibilities

“GDPR-adjacent” here means technical obligations that commonly intersect with privacy programs, not a claim that one code path satisfies a legal regime. The theme author owns accurate rendering, minimal browser data exposure, consent-aware optional loading, accessible controls, data-flow documentation, and safe failure. The merchant and advisors own legal basis, notices, retention, processor/vendor decisions, regional policy, requests, records, and jurisdiction-specific conclusions `[VERIFY]`.

| Theme responsibility | Merchant/legal/operations responsibility |
| --- | --- |
| Do not embed unreviewed third-party code or secret identifiers | Decide vendor approval, purpose, lawful basis, contracts, and retention |
| Use allowed-purpose checks before optional processing | Configure privacy regions, banner text, categories, and escalation process |
| Keep customer/order/private data out of public JS payloads | Determine data-subject rights workflow and response ownership |
| Make privacy controls accessible and reversible where configured | Publish approved notices/policies and assess regional requirements |
| Record assets/events/data destinations and release evidence | Audit vendors, analytics configuration, transfers, security, and incidents |

Do not confuse a public storefront identifier with an absence of privacy impact. An event can combine product, URL, device, customer, order, campaign, or inferred data downstream. Document the minimal event payload and destination; remove fields not required for the approved purpose; do not put email, account fields, cart notes, order data, access tokens, or raw consent identifiers into theme logs or repositories. The right implementation may be to retire a tag rather than find a way to load it later.

This boundary also applies to custom events. Publishing a technical event does not authorize any subscriber to receive it. For Web Pixels, chapter 57’s sandbox and consent model applies; a theme should publish a minimal approved event contract and a pixel should consume it according to supported privacy behavior. Do not use DOM scraping, manual checkout script injection, or a hidden image request to bypass gating.

A privacy implementation needs a release record: region/market fixture `[VERIFY]`, merchant privacy configuration `[VERIFY]`, banner/provider/version, asset inventory, allowed-method result, initial/changed/declined behavior, data destination, accessibility/performance evidence, owner, rollback, and re-test trigger. This record is more useful than an undocumented “GDPR mode” flag.

## 63.4 Accessibility statements and legal page patterns

A legal or accessibility page is content with navigation, readability, and maintenance requirements. It should be reachable from a stable location, use a meaningful page title and heading hierarchy, expose last-updated or version information where the approved content supplies it, retain readable links, work at zoom and keyboard navigation, and avoid a client-only document embed that hides content from users. The theme renders the approved statement; it does not declare a legal outcome on behalf of the merchant.

For an accessibility statement, publish only claims approved by the responsible owner `[VERIFY]`. A useful pattern has a statement purpose, supported way to contact the business about barriers, a date/review owner where supplied, and plain language about known limitations/remediation process. Do not say “fully WCAG compliant” because a theme passed one automated scan. Shopify notes that its accessibility guidance alone does not guarantee complete accessibility.[3]

| Page pattern | Theme contribution | Claim boundary |
| --- | --- | --- |
| Privacy/cookie page | Semantic page template, stable route/link, readable content | Policy text and jurisdiction are merchant-approved `[VERIFY]` |
| Accessibility statement | Heading structure, contact link/form accessibility, date display | Conformance/known limitations need responsible-owner approval |
| Terms/returns/legal page | Readable rich text, links, print/zoom/keyboard behavior | Legal promises and effective dates are not theme-generated |
| Preference entry point | Accessible control that opens supported preference interface | Provider/region availability and outcome are `[VERIFY]` |

Merchant-authored legal content may be blank, outdated, poorly structured, or localized differently. The theme can provide editor guidance, safe fallback/empty behavior, structured rich-text output, and a review record; it cannot decide legal accuracy. Treat policy pages as release surfaces: locale/market, content version, link routes, fallback, accessibility review, policy owner, support contact, and update cadence remain `[VERIFY]`.

### A processing and release test record

A consent gate is maintainable only if a future developer can tell which code is optional, why it is optional, and what happens when permission changes. Keep a processing register alongside the theme release record. For each script, pixel, app embed, custom event, remote request, cookie/local-storage use, and server endpoint touched from the storefront, record the technical name, owner, deployment path, loading trigger, declared business purpose from the accountable owner, allowed-purpose method, data fields, destination, whether the code is essential or optional `[VERIFY]`, failure mode, removal procedure, and candidate evidence. This is technical inventory, not a legal classification made by the theme team.

The test sequence should start from a clean authorised candidate state. Record whether the privacy API loads; its relevant Allowed-method result; banner/prefs entry behavior; no-choice, decline, accept, and later-change scenarios; optional script network activity; pixel/event behavior; focus/keyboard behavior; and performance impact. A change from denied to allowed may start only the relevant integration. A change from allowed to denied must follow the integration’s approved stop/disable contract `[VERIFY]`; deleting an injected `<script>` is not proof that downstream processing or a vendor session has stopped. If a vendor cannot meet the change-state behavior required by the responsible owner, that is a vendor/architecture decision, not an invitation to bypass Shopify controls.

Use neutral fixtures. Do not capture real visitor identifiers, cookies, consent IDs, email addresses, customer/order data, checkout sessions, or vendor secrets in logs, issue trackers, screenshots, or the repository. Evidence can instead name candidate version, region configuration class, API method/result, synthetic route, integration state, request class, timestamp, test owner, outcome, defect disposition, release gate, and rollback result. This makes privacy work testable without creating a second unnecessary data store.

## Gotchas

- **Using `currentVisitorConsent()` as authorization:** it omits merchant setting and location factors; use the relevant Allowed method.
- **Saving consent on page load:** Shopify requires a visitor interaction before recording the choice.
- **Two banner providers:** duplicate UI and contradictory state are a governance failure, not a theme enhancement.
- **Making the banner a blocking app shell:** essential storefront behavior, focus, LCP, INP, and CLS all need separate testing.
- **Calling a policy page proof of compliance:** it is a content/display surface; legal conclusions need the responsible owner and counsel.

## Checklist

| Question | Evidence |
| --- | --- |
| Are optional assets classified and gated by allowed processing purpose? | Asset/vendor/purpose register and candidate API results `[VERIFY]` |
| Is consent recorded only after a real visitor choice? | UI interaction and API-event test evidence |
| Does the banner/preference flow preserve keyboard access and performance? | Focus, zoom, LCP/INP/CLS, decline/change/failure fixtures |
| Are legal/accessibility pages readable and ownership-bounded? | Content version, route, locale, owner, review record `[VERIFY]` |
| Is every data destination and rollback known? | Release record and removal test |

## Related

- [ch-57 — Script Tags, Pixels and Tracking](../../part-10-apps-extensions-the-edge-of-liquid/ch-57-script-tags-pixels-tracking/)
- [ch-61 — Accessible Liquid](../ch-61-accessible-liquid/)
- [ch-62 — SEO from the Template Layer](../ch-62-seo-from-the-template-layer/)

## References

[1]: https://help.shopify.com/en/manual/privacy-and-security/privacy/customer-privacy-settings "Shopify Help — Managing customer privacy settings"
[2]: https://shopify.dev/docs/api/customer-privacy "Shopify — Customer Privacy API"
[3]: https://shopify.dev/docs/storefronts/themes/best-practices/accessibility "Shopify — Accessibility best practices for themes"
