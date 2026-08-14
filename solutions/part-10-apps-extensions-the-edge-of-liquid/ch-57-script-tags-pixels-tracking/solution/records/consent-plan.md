# Consent plan

1. Load the `consent-tracking-api` feature through `window.Shopify.loadFeatures` before accessing `window.Shopify.customerPrivacy`.
2. Use the applicable allowed-state method, not `currentVisitorConsent()` alone, before any remaining optional browser dependency is considered.
3. Re-evaluate after `visitorConsentCollected`; this observes a visitor choice and never creates one.
4. Consent is collected only through approved visitor interaction. Do not call a setter on page load and do not read or modify Shopify cookies directly.
5. Map analytics/marketing purpose, regional policy, merchant privacy configuration, vendor processing, and release approval with the privacy owner `[VERIFY]`.
6. App-pixel privacy behavior is platform-mediated. A pixel extension does not call the Customer Privacy API; the theme-side guard is transitional only.

## Evidence required

Candidate identity, region, policy configuration, allowed-state result, action time, app/pixel version, optional-load result, sanitized event shape, and owner approval are `[VERIFY]` until observed in authorised systems.
