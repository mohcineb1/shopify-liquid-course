<!-- STATUS: final -->
# Chapter 57 — Script Tags, Pixels & Tracking

Tracking is not a theme decoration. It is a data-processing system that crosses buyer behavior, merchant privacy settings, app configuration, analytics vendors, checkout surfaces, and legal responsibility. A `theme.liquid` script can appear to record a page view while silently creating duplicate events, bypassing consent, missing checkout context, breaking performance, or exposing assumptions that no longer hold. Modern Shopify pixels move tracking toward managed event subscriptions, sandboxing, consent signals, and merchant-visible configuration. The migration goal is not “make the old script fire somewhere else.” It is an auditable measurement contract.

## 57.1 The script-tag sunset and what replaced it

Legacy tracking often accumulated in `theme.liquid`, `checkout.liquid`, Additional scripts, Preferences, snippets, tag-manager containers, or app-installed script tags. Each placement has different lifecycle, scope, privacy, and duplication behavior. Shopify’s migration guidance directs merchants to inventory manually added pixel code and migrate it to an app pixel or custom pixel, rather than retaining arbitrary theme/checkout script injection.[3]

The replacement is selected by ownership and capability:

| Need | Preferred modern surface | Why |
| --- | --- | --- |
| Vendor has maintained Shopify integration | App pixel / vendor channel app | Vendor owns event mapping, updates, and platform integration |
| Merchant needs a supported tracking integration but no app exists | Custom pixel | Merchant configures a sandboxed pixel in Customer events |
| App developer ships reusable tracking | Web pixel app extension | App-owned, versioned pixel subscribes to Shopify customer events |
| Theme behavior must announce a business-specific interaction | Theme publishes a custom customer event; pixel subscribes | Theme does not embed vendor SDK or endpoint logic |
| Inline/floating app UI | Theme app extension block/embed, not pixel | Pixels collect events; they are not UI/DOM integration surfaces |

ScriptTag-era patterns frequently relied on the document DOM, global queues, immediate vendor SDK loading, and custom checkout snippets. Web pixels use Shopify’s customer-event model instead. The theme can publish a custom event through `Shopify.analytics.publish()` when a genuine theme interaction is not represented by a standard event; the pixel subscribes and maps that event to its vendor endpoint.[3] This keeps a theme-specific action separate from vendor transport and lets a migration inventory identify precisely which old snippets may be removed, retained, or replaced.

Migration is not a blind delete. First inventory base SDKs and event calls across Liquid files, layout, Additional scripts, Preferences, checkout legacy surfaces where applicable, tag-manager configuration, and installed apps. Identify every event name, triggering condition, payload field, vendor destination, consent gate, and owner. Classify each as standard customer event, custom customer event, duplicate, unknown, or obsolete. Then choose a cutover plan that explicitly balances two risks: connecting a new pixel before old code reduces missing events but can duplicate measurement; removing old code first reduces duplication but may create a measurement gap.[3]

Do not turn a temporary overlap into permanent double tracking. Give it an owner, bounded window, expected count comparison, deduplication plan, rollback condition, and removal date. Shopify warns that post-migration counts can differ because sandboxes, privacy settings, bots, and changed event definitions affect measurement; compare like-for-like logic and the same analytics service, not unrelated dashboards.[3]

> [VERIFY] Confirm the current ScriptTag/API deprecation policy, every installed app/vendor integration, legacy checkout surface availability, merchant data-processing purpose, and approved migration owner from current Shopify/vendor/legal documentation before changing a live store.

## 57.2 Web Pixels: custom pixels, sandboxing, and the events API

Web pixels collect behavioral data from **customer events** published to Shopify’s event bus/data layer. A pixel subscribes to relevant events and transforms their payload for a configured endpoint.[1] This shifts the engineering question from “how can I scrape the page?” to “which documented event, payload, and purpose does this measurement need?”

There are two relevant sandbox models. A web pixel **app extension** runs in a **strict** sandbox using a web worker. Shopify guarantees only a limited set of globals such as `self`, `console`, timers, and `fetch`/request primitives; the endpoint must support CORS.[1] Browser-page assumptions like `window.document`, DOM scraping, or DOM writing do not work there. A **custom pixel** uses a **lax** sandbox in an iframe with `allow-scripts` and `allow-forms`; it still cannot access the top frame and can observe different values such as sandbox URL rather than the storefront’s top-frame URL.[1]

| Pixel type | Typical owner | Sandbox | Design consequence |
| --- | --- | --- | --- |
| Web pixel app extension | App developer/vendor | Strict worker | Subscribe to event APIs; do not rely on DOM/global browser APIs |
| Custom pixel | Merchant, often legacy/vendor-specific tracking | Lax iframe | Legacy JS may run with limitations; no top-frame access |
| Theme custom event publisher | Theme team | Storefront page | Announces a defined interaction; never owns vendor collection logic |

The strict sandbox is deliberate privacy and resilience architecture. It limits a pixel’s ability to scrape or modify storefront DOM, and encourages smaller libraries rather than excess DOM manipulation.[1] If a measurement requirement cannot be expressed through the documented event/context APIs, do not escape the sandbox by reintroducing an invisible theme script. Reassess whether the data is necessary, whether the vendor supports the surface, or whether a governed app integration is appropriate.

A pixel event contract needs an owner and version. For each subscription, record the standard/custom event name, documented payload, business purpose, vendor mapping, endpoint/CORS requirements, consent category, failure/retry behavior, deduplication key, expected routes, and data retention/policy owner. Avoid transmitting more customer data than needed. Do not log event payloads in production consoles; Shopify’s strict-sandbox guidance explicitly says production apps should not log content.[1]

Custom events are not a free-form analytics dumping ground. Publish one when a theme interaction has a legitimate documented meaning not already provided by a standard customer event; give it a stable name and minimal schema; document the publisher; and ensure a pixel subscribes only after consent/purpose review. A renamed theme CSS class, a click on arbitrary markup, or internal debugging state is not automatically an analytics event.

## 57.3 Consent Tracking API and privacy-compliant loading

The Customer Privacy API is the browser-based Shopify API for checking data-processing permissions and building/controlling consent behavior.[2] It must be loaded through `window.Shopify.loadFeatures` with the `consent-tracking-api` feature before `window.Shopify.customerPrivacy` is used.[2] Never assume a global object exists synchronously just because `content_for_header` rendered.

```js
window.Shopify.loadFeatures(
  [{ name: 'consent-tracking-api', version: '0.1' }],
  (error) => {
    if (error) return;
    if (window.Shopify.customerPrivacy.analyticsProcessingAllowed()) {
      // Load only the approved analytics behavior.
    }
  }
);
```

The `Allowed` methods are the safe decision point: they combine merchant configuration, visitor location, and visitor consent. Shopify documents `preferencesProcessingAllowed`, `analyticsProcessingAllowed`, `marketingAllowed`, and `saleOfDataAllowed`.[2] `currentVisitorConsent()` only reports selected values and omits critical regional/merchant-configuration factors, so it is not sufficient to decide whether processing is allowed.[2]

Consent can change while a visitor is on the page. The API publishes `visitorConsentCollected` when consent changes; subscribe before relying on a later update, noting that it does not replay merely because a listener was just added.[2] Load permitted code on a positive allowed state and respond to later changes according to the integration’s documented teardown/reload behavior. Do not retry or force tracking after a negative decision.

Recording consent belongs to a visitor interaction, such as accepting/declining in a banner—not a page-load default. Shopify cautions against recording consent automatically and against reading/modifying Shopify cookies directly; use the API to manage privacy settings so future cookie changes do not break the implementation.[2] Consent purpose is not an engineering guess. Analytics, marketing, preferences, and sale/sharing have distinct definitions and legal consequences; work with the merchant/privacy owner to map a vendor’s processing to the approved purpose.

Web pixel app extensions are compatible with Customer Privacy signals but cannot call the Customer Privacy API themselves.[1] In regions requiring consent, their callbacks execute only after consent, and earlier registered events are replayed; in opt-out regimes, callbacks run as events register until the visitor opts out.[1] This is a platform behavior, not a reason to bypass consent in theme code. If a third-party consent tool does not synchronize to Shopify through the Customer Privacy API, web pixels may not fire for visitors whose consent is not represented to Shopify.[3]

## 57.4 Migrating legacy analytics off theme code

A safe migration is a controlled evidence project. Start with a discovery table and do not remove code until its purpose and replacement are known.

| Legacy location | What to inventory | Likely migration destination | Key risk |
| --- | --- | --- | --- |
| `theme.liquid`/snippets | SDK, event calls, DOM listeners, custom properties | App/custom pixel or custom event publisher | Duplicate SDK/DOM-dependent behavior |
| Additional scripts / legacy checkout | SDK and conversion/custom event code | App/custom pixel, supported checkout surface | Checkout scope and leftover duplicates |
| Preferences | Meta/Google legacy configuration | Official channel app or reviewed custom pixel | Changed measurement/feature behavior |
| Tag manager | Container tags, triggers, consent mode, destinations | Vendor-approved pixel strategy | Unseen duplicate vendor requests |
| Installed apps | Existing app pixel/block/embed | Keep/update vendor integration | Do not add a parallel theme implementation |

Shopify’s guidance notes that manual Meta pixels and Universal Analytics tags no longer configured through their respective apps were removed from Preferences in February 2025 and converted to custom pixels for continuity attempts; it recommends channel-app migration for the most accurate tracking/performance.[3] This is a current platform fact, not a universal instruction to change a merchant’s analytics vendor. Confirm the merchant’s chosen vendor, legal basis, data-processing agreement, and reporting requirements before acting.

For standard events, remove legacy code when the replacement pixel supports collecting the same standard customer event. For non-standard events, replace old vendor calls with a theme `Shopify.analytics.publish('event_name')` publisher and have the app/custom pixel subscribe to it where supported.[3] Test event definitions, not only event names: an old product-view URL-path trigger can differ materially from a standard event. Compare the same service, same route/context, and same consent state.

A migration release record includes old-code locations and hashes, new pixel/app/custom-pixel identity/version, standard/custom event mapping, payload minimization, consent purpose and test state, expected overlap/deduplication plan, candidate routes, network evidence, count-comparison window, owner approvals, rollback target, and post-cutover cleanup deadline. Test with browser developer tools and controlled candidate data, not real buyer records. Preserve privacy: do not put tokens, personal payloads, raw customer IDs, or vendor secrets in the repository or screenshots.

The durable endpoint is not “tracking code works.” It is a measurement system where the merchant can see/configure the pixel, Shopify mediates events and privacy signals, the theme has minimal publisher responsibility, duplicate ownership is removed, and every collected data purpose has a named accountable owner.

## References

[1]: https://shopify.dev/docs/apps/build/marketing/pixels "Shopify — About web pixels"
[2]: https://shopify.dev/docs/api/customer-privacy "Shopify — Customer Privacy API"
[3]: https://help.shopify.com/en/manual/promoting-marketing/pixels/pixel-migration "Shopify Help — Migrating pixels"


## Event governance, cutover, and diagnosis

A tracking migration needs an event catalogue before code moves. For every measurement, record the business question, event name, trigger authority, standard/custom classification, minimum payload, destination, consent purpose, legitimate owner, expected frequency, deduplication key, failure observation, and retention/approval reference. This makes it possible to see when two implementations both claim the same conversion, or when a theme event leaks a field that the new pixel does not need.

| Event class | Publisher | Pixel action | Review question |
| --- | --- | --- | --- |
| Standard customer event | Shopify event bus | Subscribe and map only needed fields | Does the vendor mapping preserve the same business definition? |
| Theme custom interaction | Named theme `Shopify.analytics.publish()` call | Subscribe to stable minimal custom event | Is this a real business action rather than an implementation click? |
| Vendor-only DOM event | Legacy theme SDK/listener | Replace or retire after documented vendor review | Is there a supported event/pixel API instead of scraping? |
| Consent change | Customer Privacy API/platform signal | Load/stop according to permitted purpose | Does the allowed state, not raw selection alone, authorize processing? |
| App integration event | App pixel or app-owned source | Keep within app’s versioned contract | Is a second theme implementation duplicating it? |

Choose a cutover policy deliberately. A short parallel window can compare old/new results, but each event needs a deduplication strategy and an explicit end date. Collect comparisons from the same vendor service, same route fixture, same consent condition, and similar time window. A difference can reflect consent, sandbox limits, bots, event semantics, filters, app configuration, or actual code defect; do not declare the new pixel broken merely because a dashboard total moved. Conversely, do not accept an unexplained difference just because the new implementation is platform-supported.

Network inspection is evidence but not the whole test. Use controlled candidate routes and inspect that expected events occur once, destinations are appropriate, no unexpected payloads are present, consent-gated requests are absent before permission and appear only when allowed, and legacy SDK requests disappear after removal. Avoid capturing personal/customer data in shared logs. The reviewer needs request count, event name, status, destination class, consent state, and sanitized payload-shape evidence—not raw identity values.

A rollback restores an approved prior measurement configuration only if that is safe for privacy and duplicate collection. It must not reactivate an outdated theme script automatically just to recover a dashboard count. Record the failure, disable the faulty new pixel or rollback through the authorised merchant/admin path, revalidate consent and event uniqueness, then correct the mapped event contract. Analytics integrity and privacy compliance are both release criteria; neither is a post-launch cleanup item.


Make the pixel inventory part of normal change review. Any new app, embed, vendor SDK, custom event, campaign tag, or consent-banner change should answer the same questions: which purpose is served; which pixel owns collection; which events and destinations change; how consent is checked; what the candidate route proves; how duplicates are prevented; and how the integration is disabled or rolled back. This prevents an urgent marketing request from quietly recreating the script-tag sprawl that migration removed. A concise owner register is cheaper than reverse-engineering an unexplained request after measurement and privacy behavior diverge.


The relevant success metric is therefore not the number of scripts removed or events emitted. It is a governed, consent-aware measurement path that remains understandable when a vendor, app, campaign, privacy setting, or storefront route changes. That is the operational replacement for tracking accumulated opportunistically in theme code.
