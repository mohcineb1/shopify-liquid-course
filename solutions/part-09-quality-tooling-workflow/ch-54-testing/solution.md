<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 54 — Solution

## The approach

The solution replaces “one preview passed” with a layered release argument. Static analysis verifies source/build contracts. Visual baselines verify controlled rendered states. Lighthouse CI detects controlled lab regression. Smoke tests verify the first buyer-visible storefront transitions. Edge fixtures reveal missing assumptions. Configuration, Markets, app behavior, checkout, accessibility, and merchant approval remain separately owned evidence layers.

The purchase panel itself becomes safe for two fixtures: missing product media omits the image rather than emitting a broken URL, and a long title can wrap. It does not claim that a no-image product should be unavailable, that all catalogue data is complete, or that the theme owns market eligibility. Those are deliberately tested and classified elsewhere.

## Walkthrough

**1 — evidence matrix.** Every claim names a method, route/state, fixture, owner, artifact, and non-coverage. A green static run cannot certify a visual, account, market, checkout, or merchant result.

**2 — deterministic visuals.** Baselines have fixed candidate SHA/theme, route, fixture, settings/preset, market/language/customer state, viewport/browser, dynamic-region policy, reviewer, and update decision. The live dynamic home page is not used as an uncontrolled baseline.

**3 — controlled performance gate.** Lighthouse CI runs against an isolated test store with declared product/collection handles and repository secrets. Reports are retained. The score threshold is a release-policy choice [VERIFY]; repeated run variance and RUM/field behavior are not hidden by a rerun or a lowered threshold.

**4 — buyer smoke paths.** Test cart/session state starts clean. The checks assert add-to-cart, cart update/remove, checkout entry, account entry, and form feedback as buyer-visible transitions. Checkout payment, account identity, delivery, and external apps are platform/configuration boundaries.

**5 — edge catalogue.** Missing media, long title, 100 variants, empty results, unavailable market catalog, long cart property, and absent editorial data each have a safe presentation expectation. No fixture invents commercial eligibility.

**6 — corrected section.** The media condition prevents a broken `<img>`; the title and CSS allow wrapping. The native form is retained. Real product availability, selected variant logic, and market behavior require route evidence.

**7 — failure triage.** Artifacts are preserved first. Screenshot, performance, smoke, edge, and merchant failures have distinct questions, likely owners, and rollback/escalation paths.

**8 — [VERIFY] boundaries.** Tool/browser versions, candidate IDs, test handles, secrets, thresholds, market/account state, app output, and approvals are environment evidence, not placeholder facts.

## Full files

### `sections/purchase-test-panel.liquid`

```liquid
{{ 'purchase-test-panel.css' | asset_url | stylesheet_tag }}

<section class="purchase-test-panel" {{ section.shopify_attributes }}>
  {% if section.settings.show_media and product.featured_image != blank %}
    {{ product.featured_image | image_url: width: 640 | image_tag: widths: '320, 480, 640', sizes: '(min-width: 750px) 12rem, 100vw', alt: product.title }}
  {% endif %}

  <div class="purchase-test-panel__content">
    <h1>{{ product.title }}</h1>
    <p class="purchase-test-panel__price">{{ product.price | money_with_currency }}</p>
    {% form 'product', product %}
      <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
      <button type="submit">{{ 'products.product.add_to_cart' | t }}</button>
    {% endform %}
  </div>
</section>

{% schema %}
{
  "name": "Purchase test panel",
  "settings": [
    { "type": "checkbox", "id": "show_media", "label": "Show media", "default": true }
  ]
}
{% endschema %}
```

### `assets/purchase-test-panel.css`

```css
.purchase-test-panel {
  display: grid;
  gap: 1rem;
}

@media (min-width: 750px) {
  .purchase-test-panel { grid-template-columns: minmax(0, 12rem) minmax(0, 1fr); }
}

.purchase-test-panel img { width: 100%; height: auto; }
.purchase-test-panel__content { min-width: 0; }
.purchase-test-panel h1 { overflow-wrap: anywhere; }
.purchase-test-panel__price { font-weight: 700; }
```

The CSS does not reserve fixed visual space when media is absent. Whether a design should use a branded placeholder is a design/content decision; test both states and document the owner.

### `test-matrix.md`

```md
# Candidate test matrix

| Claim | Method / route-state | Fixture / evidence | Owner | Non-coverage |
| --- | --- | --- | --- | --- |
| Liquid/schema/output contract | Theme Check on deployable output | SHA, configuration, report [VERIFY] | Theme owner | Runtime/configuration/merchant outcome |
| Rendered composition | Visual baseline: named route/preset/viewport | Screenshot metadata and reviewer | Design/theme owner [VERIFY] | Keyboard, screen-reader, purchase completion |
| Lab performance | Lighthouse CI home/product/collection | Controlled store/handles, report [VERIFY] | Performance owner | Field/RUM performance |
| Add/cart transition | Browser smoke: clean test cart | Product/variant, URL, rendered cart confirmation | Theme/QA owner | Payment/shipping/fraud |
| Checkout entry | Browser smoke: cart → supported checkout action | Candidate URL/state [VERIFY] | Release owner | Checkout implementation/payment |
| Account/form entry | Browser smoke: approved test account/form | Account route or error/success result [VERIFY] | Account/content owner | Identity provider/email delivery |
| Market/catalog outcome | Route/manual check | Country/language/catalog evidence [VERIFY] | Markets/catalog owner | Theme code cannot set eligibility |
| Merchant acceptance | Candidate review | Approval record [VERIFY] | Merchant/release owner | Automated certification |
```

### `visual-baselines.md`

```md
# Visual baseline contract

| Surface | Route / fixture / preset | State and viewport | Dynamic policy / reviewer | Baseline update rule |
| --- | --- | --- | --- | --- |
| Home | Controlled candidate home composition [VERIFY] | Desktop + mobile, default locale | Mask approved recommendation slot; design owner [VERIFY] | Code/config decision plus reviewer approval |
| Product | No-image and long-title product routes [VERIFY] | Sale/non-sale, mobile + desktop, locale/market recorded | No uncontrolled app content | Preserve old/new diff and decision |
| Collection/search | Populated and empty fixture [VERIFY] | Filter/long label state | Freeze data or mask approved volatile region | Owner approves route-specific change |
| Cart | Empty and long-property test cart [VERIFY] | Desktop + mobile | Reset cart before capture | Update only after behavior decision |
| Account/form | Logged-out entry and validation error [VERIFY] | Supported account surface | Test account/no credentials in artifact | Content/account owner review |
```

### `lighthouse-policy.md`

```md
# Lighthouse policy

Run the Shopify Lighthouse CI action against a dedicated development store with controlled performance product and collection handles [VERIFY]. Store client credentials, password, and optional status token only as protected repository secrets. Record action/version, SHA, store fixture revision, handles, theme root, reports, and run timestamps [VERIFY].

Thresholds: performance/accessibility values are owned release policy [VERIFY], not a universal score. Investigate variance with repeated controlled runs; retain failure reports and baseline history. Do not lower a threshold, rerun until green, or treat a lab score as RUM/field performance. Pair CI with Theme Check and authorised field performance review.
```

### `smoke-tests.md`

```md
# Buyer smoke tests

| Journey | Clean fixture and assertion | Explicit boundary |
| --- | --- | --- |
| Add to cart | Reset test cart; add selected configured test variant; assert rendered cart line/count [VERIFY] | Catalog availability/variant eligibility is configured state |
| Update/remove | Change quantity or remove in test cart; assert confirmed cart output | No real buyer cart/session |
| Checkout entry | From test cart, activate supported checkout control; assert checkout entry URL/state [VERIFY] | No payment, shipping, or checkout customization claim |
| Account entry | Open supported account route with approved test account state [VERIFY] | No identity-provider/credential certification |
| Contact/newsletter form | Submit valid/invalid controlled input; assert visible native result/error | No deliverability/list-app guarantee |
```

### `edge-fixtures.md`

```md
# Edge-data catalogue

| Fixture | Expected safe presentation | Owner/boundary |
| --- | --- | --- |
| No images | Omit media or approved placeholder; no broken image | Theme/design owner [VERIFY] |
| Long title | Wrap without overlap or lost meaning | Theme/content owner |
| 100 variants | Bounded usable selection and availability recovery | Theme + catalog owner [VERIFY] |
| Empty collection/search | Meaningful empty state and navigation recovery | Theme/merchandising owner |
| Unavailable market product | No invalid purchase promise; route evidence | Markets/catalog owner [VERIFY] |
| Long cart property | Wrapped readable line/totals | Theme owner |
| Missing editorial data | Omit optional wrapper or owned fallback | Content/theme owner |
```

### `triage.md`

```md
# Test failure triage

| Signal | Preserve first | First question / likely owners | Escalation or rollback |
| --- | --- | --- | --- |
| Screenshot mismatch | Baseline/current image, metadata, diff | Code, fixture, viewport, browser, dynamic region, or design decision? | Do not accept baseline without reviewer decision |
| Lighthouse regression | Report, SHA, asset/build diff, repeated run | Route/resource/variance/app/fixture change? | Performance owner; candidate rollback if material [VERIFY] |
| Smoke failure | URL, rendered state, cart/session, trace | Buyer transition or setup/configuration drift? | Theme/route/app/config owner; stop promotion |
| Edge-data break | Exact resource/context and safe expectation | Absence/length/cardinality/availability assumption? | Theme/content/catalog/Markets owner |
| Merchant mismatch | Candidate route and approved expectation | Implementation or requirement/configuration ambiguity? | Merchant/release owner decision; preserve candidate evidence |
```

## What people get wrong here

**Using a live homepage baseline.** Dynamic recommendations, campaigns, apps, inventory, and editor state make comparison meaningless. Use controlled candidate data or explicitly owned masking.

**Refreshing every screenshot.** A changed image is evidence, not an instruction to update the expectation. Review the source/configuration/fixture change first.

**Making a score the release.** Lighthouse detects one controlled lab result. It cannot certify real-user performance, conversion, browser diversity, or commercial correctness.

**Testing payment with a theme smoke test.** A theme can verify cart and checkout entry. Payment, shipping, fraud, and checkout extension behavior require their own authorised platform-level procedure.

**Hiding edge failures by changing data.** A no-image or 100-variant fixture is valuable precisely because it challenges an assumption. Fix or assign the contract; do not turn the fixture into the happy path.

## Stretch: direction only

Attach screenshots, Lighthouse reports, smoke traces, fixture revisions, and test metadata to candidate SHA/theme ID under access controls. Redact URLs, account information, personal data, and secrets as policy requires. Merchant approval and production rollback authority remain named human decisions even when evidence collection is automated.
