<!-- STATUS: final -->
# Chapter 54 — Testing

Testing a Liquid theme is an evidence system, not a promise that one command can simulate a storefront. Theme Check can analyze source contracts; a preview can render a route against configured data; screenshot comparison can expose visible drift; Lighthouse can measure a controlled audit; browser automation can exercise a buyer journey; and a merchant can confirm that content and editor behavior meet the intended business outcome. Each layer sees a different class of failure. A reliable release names the layer, fixture, route, owner, and limit of each result.

## 54.1 What is testable in a Liquid theme and what isn't

Liquid is server-rendered and contextual. This makes many output contracts highly testable: a template can render a known resource, a section can expose a schema setting, a snippet can receive explicit inputs, and a form can retain a no-JavaScript baseline. It also means that a file-level result cannot prove every remote configuration, app, buyer identity, inventory state, or checkout behavior. Start by classifying a claim before selecting a test.

| Claim | Strongest practical test | What it does not prove |
| --- | --- | --- |
| Liquid/JSON/schema syntax and known static contracts | Theme Check and build validation | Merchant content, app state, rendered route experience |
| A section’s output for known data/settings | Preview route plus controlled fixture | Every market/customer/product configuration |
| A visual composition remains stable | Screenshot comparison at named viewport/data state | Keyboard use, screen-reader meaning, buyer purchase completion |
| A page stays within controlled audit budget | Lighthouse CI / controlled Lighthouse runs | Real-user performance across all traffic and devices |
| Cart/account entry journey works | Browser smoke test using a test account/data | Payment authorization, fraud, all third-party app paths |
| A merchant setting is usable | Theme-editor/manual test with merchant owner | Every future campaign’s content decision |

Test the output that ships. If a build creates `dist/`, check and preview `dist/`, not source modules that happen to look correct. Record the branch/commit, theme ID/preview URL, settings fixture, product/collection handles, market/language, customer state, viewport, browser, and test time. Without that identity, a passing screenshot or test log cannot be reproduced after a merchant changes theme configuration.

A theme test should also preserve responsibility boundaries. A test that observes an unavailable product state can prove the theme does not show an invalid purchase action. It cannot repair catalog configuration. A localization form test can prove a selected option submits and the route changes; it cannot establish that a market’s tax, delivery, legal eligibility, or pricing policy is correct. Mark such store-owned outcomes `[VERIFY]` and assign an owner.

> [VERIFY] Decide the supported browser/device, market, customer-account, app, and production-data matrix with the merchant/release owner. Those coverage choices are project-specific, not facts a theme repository can infer.

## 54.2 Visual regression testing across templates and settings presets

Visual regression tests compare a current rendering against an approved baseline. They are especially effective at detecting accidental layout, typography, spacing, missing asset, section-order, or responsive drift that a DOM assertion would miss. They fail usefully only when the render is deterministic enough to compare.

A screenshot is a contract of **route + data + configuration + viewport + state**. A generic `/products/example` baseline is too vague. Name the product fixture, template, selected variant if applicable, section preset/settings, market/language, customer state, viewport, reduced-motion policy, and date/time-dependent content control. Avoid snapshotting an ever-changing home page with live recommendations, countdowns, rotating app content, random IDs, or uncontrolled inventory; create a controlled candidate/store fixture or mask explicitly approved dynamic regions.

| Surface | Minimum visual states | Typical drift it catches |
| --- | --- | --- |
| Home/template composition | Default, each owned template/preset, desktop/mobile | Section order, CSS containment, header/footer change |
| Product | No media, multiple media, long title, sale, unavailable variant | Geometry, price wrapping, gallery and purchase-panel regressions |
| Collection/search | Empty, populated, long filter labels, pagination edge | Empty-state loss, grid overflow, controls wrapping |
| Cart | Empty, one line, long line property, discount/error state | Totals, line-key controls, accessible status layout |
| Forms/accounts | Validation error, logged-out/logged-in entry state | Missing errors, focus/label layout, brittle assumptions |

Use baseline review, not automatic acceptance. A changed screenshot may show an intentional campaign change, a browser/rendering upgrade, a fixture mutation, or a regression. A human reviewer must classify it and update the baseline only with the matching code/configuration decision. Otherwise visual testing becomes a machine for laundering unintended change into “new expected output.”

Presets deserve their own coverage. A section that works in its default preset can break with a merchant’s long heading, zero blocks, maximum blocks, alternate color scheme, dynamic source, different image crop, or optional setting disabled. Choose a bounded **preset matrix**: every public section default, each high-risk variant, each known responsive/interactive state, and each critical template composition. Do not generate hundreds of screenshots with no ownership; prioritise buyer-facing risk and set an evidence owner for every baseline.

Visual tests complement accessible and behavioral tests. A button may look perfect yet have no form submission; a label can be visually hidden incorrectly; focus can disappear; a layout can use insufficient contrast. Include keyboard and no-JavaScript manual checks for interactive surfaces. Shopify’s theme testing guidance specifically recommends disabling JavaScript to verify navigation and product forms still work.[3]

## 54.3 Lighthouse CI and performance regression gates

Performance testing needs a controlled baseline and a realistic production signal. Lighthouse is a lab audit: it reports how an emulated browser experienced one audited page at one time. Real-user monitoring tells a different story about field devices, networks, and routes. Chapter 47 established the distinction; a CI gate prevents obvious code regressions before merge, while real-user data validates outcomes after release.

Shopify’s Lighthouse CI GitHub Action runs on pull requests and audits a theme home page, product page, and collection page.[1] It requires a dedicated development store and consistent performance test data; Shopify provides a test product CSV intended for this controlled setup.[1] The action can use named product/collection handles, a non-root theme directory, and a source theme from which settings/JSON templates are pulled.[1] These options matter because an audit that uses the first accidental product or default settings can produce a result unrelated to the buyer surfaces under review.

```yaml
name: Theme performance
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shopify/lighthouse-ci-action@v1
        with:
          client_id: ${{ secrets.SHOP_CLIENT_ID }}
          client_secret: ${{ secrets.SHOP_CLIENT_SECRET }}
          store: ${{ secrets.SHOP_STORE }}
          product_handle: performance-product
          collection_handle: performance-collection
          lhci_min_score_performance: 0.7
```

The credentials remain protected repository secrets, never theme files. A password-protected development store also needs its password supplied through a secret for the audit to reach the storefront rather than the password screen.[1] Do not copy this sample without checking current action/version, secret policy, store isolation, and project thresholds.

The action’s default minimum performance score is 0.6 and default accessibility score is 0.9, but project thresholds are policy choices, not generic proof of quality.[1] Establish a baseline, understand normal variance, and tune a gate by route/risk. A tiny score movement may be noise; a material bundle addition, parser-blocking script, image regression, or Liquid hot path needs investigation. Treat a failure as a performance-owner question: which resource, code path, app, data fixture, or environment changed, and what field metric/release evidence will validate the fix?

Shopify recommends controlled audits of home, product, and collection routes, and supports a median of repeated runs for more accurate manual Lighthouse results.[2] Do not turn a benchmark score into a claim that every customer route is fast. Pair the gate with Theme Check’s static delivery signals and Shopify’s Web Performance Dashboard/Reports or other authorised RUM evidence where available.[2]

## 54.4 End-to-end smoke tests: add to cart, checkout entry, account flows

Smoke tests establish that a small set of critical buyer paths can begin and transition correctly after a candidate deploy. They are not exhaustive transaction certification. A good smoke test has a controlled fixture, an explicit expected state transition, and a cleanup/ownership plan.

| Journey | Minimum assertion | Fixture and boundary |
| --- | --- | --- |
| Add to cart | Product form adds selected eligible variant; cart reflects a line/key/count | Test product/variant; availability configured separately |
| Cart update/remove | Quantity/remove transition yields confirmed cart state | Test cart, no shared real buyer cart |
| Checkout entry | Cart’s supported checkout action reaches checkout entry | Do not claim payment, shipping, or checkout extension behavior is tested by theme code |
| Account entry | Sign-in/account route opens correct supported account surface | Use approved test account; do not expose credentials in fixtures |
| Contact/newsletter form | Valid/invalid submission preserves accessible result/error behavior | Test recipient/list configuration separately |

Use a test account and non-production buyer data where possible. Do not automate payment completion, personal details, or destructive production actions without a separately authorised procedure. The theme’s responsibility ends at supported storefront forms/navigation and the transition into platform-controlled checkout/account surfaces. Recent platform lifecycle changes also mean checkout customisation belongs to its supported extension surface, not arbitrary theme test logic; consult `docs/DEPRECATIONS.md` for project-current facts.

Each smoke test should start cleanly: clear test cart/session, establish locale/currency/customer state, create or locate the controlled resource, act through the buyer-visible interface, assert the rendered confirmation, and capture URL/state on failure. Do not assert only a JavaScript response. The no-JavaScript baseline remains important: if an enhancement fails, a buyer should still be able to submit the native form or navigate to a usable recovery route.

## 54.5 Testing against edge data: no images, long titles, 100 variants, empty collections

Happy-path fixtures make a theme look stable while hiding its data assumptions. Edge data reveals whether resource guards, geometry, labels, iteration, availability, and empty states are real contracts. Build a small owned fixture catalogue; do not improvise a giant product in a client’s live catalog.

| Edge fixture | Inspect | Common false assumption |
| --- | --- | --- |
| No image/media | Placeholder, alt, layout dimensions, purchase card | Every product has a featured image |
| Long title/vendor/option | Wrapping, truncation policy, headings, buttons | Copy fits a single line in every language |
| 100 variants | Selection control, availability, performance, URL/state recovery | A handful of swatches represent all products |
| Empty collection/search | Meaningful message, navigation/recovery, no broken grid | Collections always have results |
| Product unavailable in market | Safe card/form behavior and explanatory recovery | A configured product is universally purchasable |
| Long properties/discounts | Cart alignment, totals, accessible labels | Buyer-entered values are short/known |
| Missing optional metafield/metaobject | Omission/fallback without blank wrappers | Editorial data is complete |

The “100 variants” fixture is not a license to render every possibility expensively. It asks whether the component preserves selection and availability boundaries under a large legitimate input. Use the product/variant chapter’s bounded rendering and server/context authority rules; test keyboard/navigation and progressive fallback as well as screenshot geometry. Mark exact product limits, available option APIs, app behavior, and market outcomes `[VERIFY]` where the configured store determines them.

Make edge tests part of component acceptance. A new product card or price contract should be exercised with no image, long title, sale/non-sale, unavailable context, and the relevant market route before its baseline is accepted. This reduces the tempting “fix” of adding an arbitrary fallback that changes commercial meaning. The test’s job is to reveal the missing decision and assign it to theme, merchant content, catalog, app, or Markets configuration.

A testing program becomes trustworthy when a pass tells the team exactly what was observed and what was not. Static analysis catches source contracts; visual baselines catch rendered drift; Lighthouse gates catch controlled lab regression; smoke tests catch buyer-journey breaks; edge fixtures challenge assumptions; and merchant/configuration owners validate the contextual truth. Together they turn a theme release from a hopeful preview into a layered, reproducible argument for change.

## References

[1]: https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci "Shopify — Lighthouse CI GitHub Action"
[2]: https://shopify.dev/docs/storefronts/themes/best-practices/performance "Shopify — Theme performance best practices"
[3]: https://shopify.dev/docs/storefronts/themes/store/test-theme "Shopify — Testing a Theme Store theme"


## Fixture governance and failure triage

A fixture catalogue is production-adjacent test infrastructure. Give every fixture a stable handle or identifier, purpose, owner, creation/reset method, and restrictions on editing it. A performance product should stay isolated from campaign products; an edge-data product should retain its missing image, long title, many variants, or unavailable state; a test account should never become an employee’s real shopping account. If a fixture changes, record the change with the baseline update because the test meaning may have changed even if no theme file did.

| Failure signal | First question | Evidence before a fix | Likely owner classes |
| --- | --- | --- | --- |
| Screenshot mismatch | Did code, fixture, browser, viewport, or dynamic region change? | Candidate/baseline metadata and diff review | Theme, fixture, design owner |
| Lighthouse regression | Which route/resource/render path changed beyond normal variance? | Repeated audit, build SHA, asset diff, controlled store state | Theme, app, asset, performance owner |
| Smoke failure | Did the buyer-visible state transition fail, or did test setup drift? | URL, DOM confirmation, session/cart state, network/context log | Theme, route, fixture, app, platform configuration |
| Edge-data break | Which assumption failed: absence, length, cardinality, availability, or translation? | Exact resource/context and safe fallback expectation | Theme, merchant content, catalog, Markets owner |
| Merchant acceptance mismatch | Is implementation wrong, or is requirement/configuration ambiguous? | Candidate route and owner-approved expectation | Merchant, product, legal, theme owner |

Triage should preserve the original signal. Do not refresh a screenshot baseline, lower a Lighthouse threshold, retry a test until it passes, or replace an edge fixture before deciding why it failed. Attach the failing artifact to the issue, reproduce against the named candidate, and identify whether a safe rollback is needed. If a failure comes from a volatile third-party surface, mark the dependency and specify the retry/backoff policy; do not call it a theme success merely because a later run recovered.

Test ownership should survive handoff just like component ownership. A baseline without an owner will age; a smoke test with no fixture reset will become nondeterministic; a performance gate with no exception process will either block responsible releases or be bypassed. Keep exceptions time-bounded: record the affected route, observed metric or state, reason, owner, expiry, follow-up test, and rollback consequence. The aim is not a perfect test suite. It is a release process where failed evidence leads to an explainable decision rather than a silent accommodation.
