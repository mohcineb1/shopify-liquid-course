# Commerce surface contract — candidate solution

| Surface | Authority and baseline | Enhancement/error boundary | Evidence or release gate |
| --- | --- | --- | --- |
| Home | Explicit selected collection; blank/design fallback | No required client behavior | Verify editor section use and catalog selection |
| Collection | Resource URL + Liquid sorting/pagination | Owned result replacement retains URL/full request | Verify filters, labels, focus and query preservation |
| Product | Product section owns form/options; explicit spec/guide inputs | No full-variant serialization; selected-state enhancement is separate | Verify form behavior, metafield/reference types and product fixtures |
| Cart | Cart page is durable recovery | Up to five locale-aware guarded fragments; null is failure | Verify mutation/bundled rendering, dialog/focus/order/analytics/consent |
| Search/account/blog | Route-specific full-page content baseline | No customer/auth or assumed predictive search client | Verify account mode, search results, privacy/localization/content model |
| Guide/locator | Typed published structured records and static list | No provider/geolocation until separately authorised | Verify fields, visibility, market/locale, consent, provider and archive owner |

> [VERIFY] Test valid/invalid sort URL, empty collection, 24-plus products, no-JavaScript submit, unavailable option, no selected variant, absent specs/guide, recommendation empty result, null section response, missing target, network error, cart-page recovery, content/account routes and stale location record before release.
