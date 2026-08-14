<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 57 — Solution

## The approach

This is not a JavaScript refactor. It is a **collection-boundary migration**. The theme stops owning vendor transport and buyer identity; Shopify’s event and pixel surfaces own standard commerce events, while the theme publishes only the one custom interaction it can actually observe. The records make that boundary auditable before any code is removed.

The key decisions are deliberately narrow. A maintained vendor integration belongs in an **app pixel**. A merchant-owned configuration with no app extension can be a **custom pixel**, subject to its iframe limitations. `guide_opened` is neither a standard commerce event nor a reason to add an SDK to the theme, so the theme emits a minimal custom event and the chosen pixel subscribes to it. Legacy loading remains only long enough for an approved, consent-safe comparison; it never becomes the permanent fallback.

> Web pixel app extensions run in a strict worker sandbox, while custom pixels use a lax iframe sandbox. Neither model makes DOM scraping, top-frame access, or theme-side vendor queues an acceptable replacement for an event contract. [1]

## 1 — A decision-quality inventory

The inventory is not proof that the underlying configuration is correct. It is the evidence request that tells the migration owner what to inspect in authorised systems. The `status` values are intentionally not “done” until an owner has observed the replacement.

| Legacy source or event | Classification and purpose | Destination / consent purpose | Replacement and duplicate risk | Owner / state |
| --- | --- | --- | --- | --- |
| `theme.liquid` remote SDK | Unknown bundle; claimed acquisition analytics | Vendor `[VERIFY]`; analytics/marketing purpose `[VERIFY]` | App pixel for supported vendor `[VERIFY]`; high risk if page events overlap | Marketing + privacy `[VERIFY]`; inventory only |
| Theme SDK page view | Standard-like page measurement | Vendor `[VERIFY]`; purpose `[VERIFY]` | Pixel standard event mapping `[VERIFY]`; high overlap during transition | Analytics `[VERIFY]`; compare first |
| Product/cart/purchase implied by notes | Unknown; do not infer from file location | Vendor and checkout configuration `[VERIFY]` | Pixel standard events after observed mapping `[VERIFY]`; critical conversion duplicate risk | Checkout owner `[VERIFY]`; inspect separately |
| `guide:opened` queue call | Custom engagement interaction | Existing vendor queue `[VERIFY]`; analytics purpose `[VERIFY]` | `Shopify.analytics.publish('guide_opened', …)`; do not preserve queue | Theme + pixel owner `[VERIFY]`; replace |
| `_tracking_consent` cookie read | Unsupported local consent decision | Direct cookie; purpose unverified | Customer Privacy API allowed state; no cookie access | Privacy `[VERIFY]`; remove |
| `consent-loader.js` automatic set | Invalid consent collection behavior | Shopify consent state | Remove; consent is visitor interaction, not boot code | Privacy `[VERIFY]`; remove |
| Checkout-era note | Unobserved historical placement | `[VERIFY]` | Explicit source inspection and migration record | Checkout/release `[VERIFY]`; blocked |

For each row, the actual record also stores first observed route, payload keys, SDK/pixel version, app/custom-pixel identifier, region, legal basis/merchant purpose, and cleanup date. The `customer_id` in the starter is expressly **not** a migration payload: it is removed before code reaches a candidate. Data minimisation starts with the contract, rather than attempting to redact data after a vendor call has happened.

## 2 — Destination choice and cutover record

The app-supported integration is the default decision, subject to confirming its pixel and event support. An app-pixel extension has the appropriate event subscription boundary and honours Customer Privacy signals. A custom pixel is appropriate only if the merchant truly owns the configuration and the vendor can be implemented within its iframe sandbox; it still cannot use the top frame as an escape hatch. The theme remains a publisher, not an analytics transport.

`records/migration-plan.md` should make the decision executable:

```md
# Pixel migration plan

| Measurement | Chosen owner | Decision basis | Precondition | Retirement condition |
| --- | --- | --- | --- | --- |
| Page/product/cart/purchase | Supported app pixel `[VERIFY]` | Standard commerce event mapping | Pixel installed, active, consent/config checked | Same-service semantic/count comparison approved |
| guide_opened | Theme publisher + selected pixel subscriber | Theme owns the interaction; pixel owns transport | Event contract/version approved | Subscriber proof and no legacy queue call |
| Legacy SDK | None after cutover | Theme transport is being retired | All mapped events pass validation | Removal PR approved and monitoring window closed |

## Cutover sequence

1. Freeze an inventory snapshot, define event identity and nominate privacy, analytics, pixel and release owners `[VERIFY]`.
2. Confirm the target app/custom pixel, its version, its consent purpose mapping, standard-event support and candidate activation `[VERIFY]`.
3. Release the custom publisher without legacy custom transport. If an overlap is explicitly approved for a standard event, label both paths and deduplicate by a pre-agreed event identity; do not send unbounded permanent doubles.
4. Compare the **same service**, same event definition, route, candidate fixture, consent state and time window. Investigate semantic or unique-count differences before widening traffic.
5. Remove the remote SDK, queue call, automatic consent code and obsolete checkout/additional-script placement only after the recorded acceptance decision. Retain an artefact, not executable fallback code.

## Rollback

Rollback restores the immediately prior approved pixel/configuration version, pauses the new mapping, preserves sanitized evidence, and opens an incident record. It does not reintroduce direct cookie reads or automatic consent. Owner and target version: `[VERIFY]`.
```

The important distinction is **event identity**, not a magical count threshold. For a custom interaction, one browser action should produce one `guide_opened` event in one defined destination after consent permits it. For standard events, a candidate comparison can prove that two paths are semantically aligned only when service, definition, context and consent state match.

## 3 — Minimal theme custom-event publisher

The corrected theme code removes the global queue and personal identifier. The event name is versioned by governance, not changed casually; this example uses the stable, low-cardinality `guide_opened`. It means “a visitor intentionally opened this guide card,” not “the guide became visible,” “a buyer read content,” or “a conversion occurred.” The pixel subscriber decides whether the approved destination needs it.

```js
// assets/guide-tracking.js
(function () {
  const guide = document.querySelector('[data-guide-open]');

  if (!guide || !window.Shopify || !Shopify.analytics) return;

  guide.addEventListener('click', function () {
    Shopify.analytics.publish('guide_opened', {
      surface: 'guide_card',
      schema_version: 1
    });
  });
}());
```

The payload has no email, customer ID, cart lines, URL query values, raw referrer, free text, or vendor-specific key. `surface` and `schema_version` exist to preserve semantic meaning and permit controlled evolution. `[VERIFY]` the final event name, fields, purpose, retention, destination mapping, and whether a guide interaction is needed at all. The selected pixel subscribes to the custom event; the theme must not import its SDK or call its endpoint.

The section can retain the button and attach the asset, but it no longer dispatches a second bespoke DOM event. One interaction, one publisher call:

```liquid
{{ 'guide-tracking.js' | asset_url | script_tag }}

<article class="guide-card">
  <h2>{{ section.settings.heading }}</h2>
  <button type="button" data-guide-open>Open guide</button>
</article>
```

## 4 — Consent plan, not consent manufacture

Customer Privacy API capability is loaded through `window.Shopify.loadFeatures`, then the theme asks an appropriate **allowed-state** method before optional browser loading. `currentVisitorConsent()` alone is not a loading decision because Shopify combines merchant configuration, location, and consent signals when it determines whether processing is allowed. Consent changes are observed, but consent is recorded only after an actual visitor interaction through the approved UI. Direct access to Shopify cookies is excluded. [2]

```js
// assets/consent-loader.js
(function () {
  function evaluateOptionalLoading() {
    if (!window.Shopify || !Shopify.customerPrivacy) return;

    const allowed = Shopify.customerPrivacy.analyticsProcessingAllowed();
    // Load only an approved transition dependency here when `allowed` is true.
    // No SDK URL, token, customer identity, or vendor call belongs in this exercise.
    window.dispatchEvent(new CustomEvent('northstar:analytics-allowed', {
      detail: { allowed: allowed === true }
    }));
  }

  window.Shopify.loadFeatures(
    [{ name: 'consent-tracking-api', version: '0.1' }],
    function (error) {
      if (error) return;
      evaluateOptionalLoading();
      document.addEventListener('visitorConsentCollected', evaluateOptionalLoading);
    }
  );
}());
```

> [VERIFY] Confirm the final API version, required purpose (`analytics` versus `marketing`), event listener surface, regional policy and merchant configuration against current Shopify documentation and authorised privacy owners before release.

An app-pixel extension receives privacy behavior through its platform context; it does not invoke the Customer Privacy API. The theme-side plan above matters only for an authorised remaining browser dependency during transition. The end state has no manual SDK to gate in the theme, which reduces this code path rather than expanding it.

## 5 — Sandbox boundary notes

`records/sandbox-notes.md` states that a strict app pixel runs in a worker: `window.document`, DOM reading/writing, and scraping rendered product markup are unavailable. This is intentional isolation, so a migration cannot demand “just query the Buy button.” It must use pixel event data or a designed custom event. A lax custom pixel is in an iframe and may use different browser capabilities, but it cannot access the top frame; therefore parent-page DOM inspection and manipulative page behavior are still not a valid design. [1]

| Choice | It can do | It must not assume | Design response |
| --- | --- | --- | --- |
| App pixel, strict worker | Subscribe to Shopify events in isolated context | `window.document`, DOM scraping/writing | Use standard events or published custom data |
| Custom pixel, lax iframe | Run merchant-configured pixel code in iframe | Top-frame access or DOM control | Keep transport/config self-contained |
| Theme | Observe authored interaction | Vendor authority or Shopify-cookie ownership | Publish minimum custom event only |

## 6 — Candidate validation and release evidence

The validation matrix protects against the two common migration failures: collecting when permission is not allowed and counting the same action twice. It uses a controlled candidate and sanitized records only—never a real buyer, production customer record, secret, full network payload, or live payment flow.

| Case | Expected result | Sanitized evidence | Owner / disposition |
| --- | --- | --- | --- |
| Optional purpose not allowed | No optional legacy dependency/event transport; no cookie read | Candidate, allowed=`false`, event name/count=0 | Privacy `[VERIFY]` |
| Allowed state | Target mapping runs once per defined action | Route, fixture, allowed=`true`, name, count, payload keys only | Analytics `[VERIFY]` |
| Consent change | Re-evaluate allowed state; do not fabricate consent | Before/after state and listener observation | Privacy `[VERIFY]` |
| Standard candidate event | Target pixel mapping matches same-service semantics | Pixel/app version, destination class, unique identity policy | Pixel owner `[VERIFY]` |
| `guide_opened` | One click publishes one custom event, no vendor queue | Click fixture, event name, `surface`, schema version | Theme/pixel `[VERIFY]` |
| Legacy removal | SDK/queue/automatic consent absent; approved target remains | Diff, asset list, acceptance/rollback ID | Release `[VERIFY]` |

The release record names the pixel configuration/version, candidate, route and fixture, region, consent status, event identity rule, expected count, payload-key allowlist, evidence location, comparison interval, approver, monitoring end date, rollback target, and cleanup owner. All values are `[VERIFY]` until observed and approved. The old source is deleted at the deadline rather than preserved “just in case”; the rollback record, not executable dual tracking, preserves recoverability.

## What people get wrong here

**Treating an app pixel as a better script tag.** The strict sandbox changes the source of truth. If data is not in the event contract, trying to scrape it from the storefront reintroduces fragility and conflicts with the intended isolation.

**Checking only a consent value.** A raw visitor-consent object cannot answer whether processing is allowed in a given configuration and location. Use the appropriate allowed-state decision and let the approved consent experience collect a choice.

**Moving a vendor SDK into a custom pixel without an inventory.** This can move duplicate purchase/page tracking, unknown payload fields, and unowned purpose declarations to a new surface without fixing them. Classify, map, validate, then remove.

**Using count parity alone as proof.** Two events with equal counts can differ in context, destination, consent state, or identity. Compare the same service and definition, check uniqueness, and inspect only sanitized event shape.

## References

[1]: https://shopify.dev/docs/apps/build/marketing/pixels "Shopify Web Pixels"
[2]: https://shopify.dev/docs/api/customer-privacy "Shopify Customer Privacy API"
[3]: https://help.shopify.com/en/manual/promoting-marketing/pixels/pixel-migration "Migrate legacy pixels"
