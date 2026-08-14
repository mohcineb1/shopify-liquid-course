<!-- STATUS: final -->
---
id: ch-47
title: "Performance Engineering"
part: 7
---

# Chapter 47 — Performance Engineering

Performance engineering is a measurement discipline, not a promise to maximize one synthetic score. A Shopify theme influences HTML and Liquid render work, DOM complexity, media selection, CSS and JavaScript delivery, and the cost it adds through optional features. It does not control a buyer’s network, device, browser extensions, geography, the storefront platform’s complete backend path, or an app’s internal infrastructure. A useful performance program separates those categories, measures buyer impact before and after a change, and turns known regressions into reviewable budgets.

## 47.1 Core Web Vitals on Shopify: what you control and what you don't

Shopify’s Web Performance reports evaluate loading speed, interactivity, and visual stability through LCP, INP, and CLS.[1] Current report classifications label LCP good at 2500 ms or lower, INP good at 200 ms or lower, and CLS good at 0.1 or lower.[1] These thresholds are useful diagnostic targets, not a license to optimize one route while degrading another.

The theme controls the largest visual candidate it creates, its image dimensions and priority, font/CSS/JS resource choices, parser-blocking tags, and layout geometry. It controls whether Liquid loops repeat expensive work, whether templates render nonvisual sections, and whether a merchant can add a large number of blocks without a DOM strategy. It does **not** control an individual device’s CPU, connection, location, installed extension, or every app/server behavior. Shopify explicitly notes that device, network, and location can affect a buyer’s experience.[1]

| Metric | Theme levers | Non-theme context |
| --- | --- | --- |
| LCP | hero candidate/priority, render-blocking work, server Liquid cost | connection, device, platform path |
| INP | event work, bundle weight, third-party scripts, DOM complexity | input hardware, CPU contention, extensions |
| CLS | image/video geometry, font fallback, late DOM insertion | browser timing, external content behavior |

A response to poor LCP should identify the actual LCP element and resource chain, not blindly preload every asset. A response to poor INP should profile interaction work rather than replace all JavaScript with a library. A response to CLS should reserve dimensions and inspect late mutations instead of adding fixed heights that clip translated copy. Start with the buyer-visible outcome, then trace back to a code owner.

## 47.2 The Shopify Web Performance dashboard and Lighthouse in the theme editor

The Shopify performance metric summary appears from the Themes page and reports Core Web Vital experience over time; it uses real user data from the prior 30 days at the 75th percentile.[1] Reports can lag by up to 36 hours and retain only the last 90 days.[1] A new or password-protected store may lack enough real-user data, so it cannot immediately validate a deployment. Use over-time reports to locate when change occurred, page-type reports to identify template groups, and page-URL reports to isolate an outlying route.

> [VERIFY] Confirm the store’s staff permissions, password state, data volume, and report availability before treating the dashboard as a deployment gate.

Lighthouse is a controlled laboratory signal. It is excellent for repeatable before/after checks across a home page, a representative product page, and a representative collection page. It is not a substitute for real-user distributions. Keep test data, device preset, preview settings, route URLs, and run count stable. Shopify’s documented benchmark workflow uses a dedicated development store, a performance test product dataset, and median-style repeated testing discipline.[2]

A good measurement note names the route, template, test data, cache state, device profile, run dates, LCP element, transfer changes, and observed tradeoff. “Score changed from 40 to 85” is not evidence unless it explains which page changed, what was removed or delayed, and whether real buyer metrics subsequently confirm the direction.

## 47.3 Server-side render cost: expensive filters, nested loops, oversized loops, `all_products`

Liquid runs on the server. Repeating a calculation inside a loop multiplies its render cost, even if each individual operation looks cheap. Shopify’s Theme Inspector documentation gives a classic example: sorting a collection inside every product iteration is unnecessarily repetitive; compute the sorted collection once before the loop.[3]

```liquid
<!-- Wrong: same sort runs once per item. -->
{% for product in collection.products %}
  {% assign by_price = collection.products | sort: 'price' %}
  {{ product.title }}
{% endfor %}

<!-- Better: one calculation, one iteration. -->
{% assign by_price = collection.products | sort: 'price' %}
{% for product in by_price %}
  {{ product.title }}
{% endfor %}
```

Nested loops create multiplicative work. A 24-product grid that loops all products again for each card creates a very different render shape from one precomputed list. Oversized loops also create markup and image/filter work the buyer cannot see. Paginate, limit deliberately, render only the first meaningful set, and make progressive loading a server or section-rendering decision rather than delivering hundreds of hidden cards.

`all_products` is a convenience lookup, not a substitute for architecture. Repeated handle lookups within loops or blocks can hide a data-model problem and create unpredictable template work. Prefer context objects, section settings that carry the needed resource, or an explicit bounded collection. If an unavoidable lookup remains, identify its count in the performance profile and document the tradeoff.

## 47.4 The Theme Inspector profile: reading and acting on it

Theme Inspector for Chrome visualizes Liquid render profiling data as a flame graph. Each bar represents a node and its time; details identify tag/variable type, source file, line, snippet, self/child contribution, and percentage of total render time.[3] The total render duration is not TTFB because it excludes additional request/backend overhead.[3]

Read a profile from wide to narrow. First identify expensive top-level templates, sections, or snippets. Then zoom into repeated branches. The sandwich view aggregates self time separately from total time and can reveal a filter that costs little once but occurs thousands of times.[3] Use Find to count repeated nodes. Common patterns are deeply nested includes, excessive conditionals, sort/filter work inside loops, and nonvisual sections that still render on every route.

Do not remove a node merely because it is wide. Ask what buyer value it provides, how many routes invoke it, and whether the same result can be computed once, rendered lazily, or moved behind an interaction. Profile again after each small change. Render times vary slightly due to platform optimizations, so compare several controlled samples rather than treating one trace as an absolute truth.[3]

## 47.5 Reducing DOM weight in section-heavy templates

DOM weight is not just node count. It is the combined cost of parsing markup, calculating styles, layout, accessibility-tree construction, image/media descendants, and JavaScript selectors that traverse the page. A section-heavy home page often repeats wrappers, headings, empty containers, hidden desktop/mobile duplicates, and merchant block markup until the template is harder for browsers and humans to reason about.

Begin with the rendered DOM, not Liquid file count. Inspect the first viewport and then the complete page. For each wrapper ask whether it provides semantics, styling, layout, editor selection, or a scripting root. Retain it if it has an explicit job; remove it if it only survives a copied component structure. Prefer one responsive representation over separate desktop and mobile content copies where the information is identical. If a section is optional, do not render its full hidden markup merely to make a client toggle instant.

```liquid
<!-- Avoid rendering a decorative wrapper when no media exists. -->
{% if section.settings.image != blank %}
  <div class="feature__media">
    {{ section.settings.image | image_url: width: 1200 | image_tag: loading: 'lazy', alt: section.settings.image.alt }}
  </div>
{% endif %}
```

However, do not remove structural markup that has a meaningful accessibility or editor role. A heading hierarchy, list relationship, form label, section root, and `block.shopify_attributes` have purpose beyond visual CSS. DOM reduction is not a contest to make markup cryptic. It is a discipline of removing duplicated and unused structure while retaining semantic and merchant-operable roots.

Section-heavy templates also need an authoring budget: maximum block counts where repetition is expensive, a defined pagination/loading boundary for collection-like content, and a rule against nesting cards inside cards merely to reuse a snippet. Measure after the template is populated with realistic merchant content. An empty editor preview cannot reveal the DOM and Liquid cost of 25 product cards, 12 announcement blocks, or repeated app content.

## 47.6 A performance budget you can enforce in CI

A budget turns a performance preference into a review criterion. It must be route-specific, stable enough for repeatable testing, and paired with an action when it fails. Use a dedicated development store and deterministic product/collection data so performance changes are attributable to the theme rather than catalog variance. Shopify’s Lighthouse CI Action tests home, product, and collection pages and supports decimal minimum performance and accessibility score thresholds.[4]

```yaml
# .github/workflows/lighthouse-ci.yml
name: Theme performance
on: [pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shopify/lighthouse-ci-action@v1
        with:
          client_id: ${{ secrets.SHOP_CLIENT_ID }}
          client_secret: ${{ secrets.SHOP_CLIENT_SECRET }}
          store: ${{ secrets.SHOP_STORE }}
          lhci_min_score_performance: 0.70
          lhci_min_score_accessibility: 0.90
```

The shown numbers are an example policy, not a universal promise. Shopify documents default action thresholds of 0.6 for performance and 0.9 for accessibility, and the threshold inputs are decimals from 0 to 1.[4] Set a baseline from repeated runs, then ratchet deliberately. A high score with unrepresentative data is less valuable than a slightly lower stable budget that catches regressions. Keep a separate budget for measurable resource facts—maximum initial JS, no parser-blocking scripts, responsive image sizing, DOM count review—when Lighthouse score alone cannot identify an ownership failure.

A CI failure should produce investigation rather than blind retrying. Compare changed resources, LCP candidate, DOM, third-party requests, and Liquid profile. Allow an exception only with a documented buyer benefit, an owner, a removal date, and a follow-up measurement. This preserves engineering judgment while preventing a collection of “temporary” performance regressions from becoming the theme’s default state.

## Lab 18 — from a bloated theme to 85+

Treat the lab’s 40-to-85+ goal as an outcome of documented changes, not a target to game. Establish a baseline on fixed home, product, and collection routes. Inventory the LCP candidate, blocking resources, bundle sizes, font requests, DOM nodes, Liquid hot paths, and third-party tags. Make one change at a time: right-size images, remove unnecessary or parser-blocking scripts, eliminate duplicate font/style delivery, hoist loop work, defer optional modules, and remove nonsemantic markup. After each change, record the before/after metric, page route, measurement mode, code owner, and tradeoff.

The final report should include a table that distinguishes lab signal from real-user confirmation.

| Evidence | Use | Limitation |
| --- | --- | --- |
| Lighthouse median | Repeatable pre-merge regression check | Synthetic device/network model |
| Shopify RUM reports | Buyer experience over time and page cohort | Delayed and needs traffic |
| Theme Inspector | Server Liquid hot paths | Does not equal complete TTFB |
| Network/DOM inspection | Resource and markup ownership | Requires representative template data |

## Gotchas

- A metric threshold is a diagnostic, not proof that every buyer has the same experience.
- The performance dashboard is delayed; pair it with controlled route tests.[1]
- Optimize repeated work and unnecessary output before micro-optimizing one filter call.
- DOM reduction must retain semantics and editor attributes.
- CI budgets need controlled store data and an explicit exception policy.

## Checklist

- [ ] Baseline home, product, and collection routes with controlled data.
- [ ] Identify LCP, INP, CLS, resource, DOM, and Liquid owners before changing code.
- [ ] Use Theme Inspector counts and sandwich data to target repeated server work.
- [ ] Remove only markup with no semantic, styling, editor, or script-root job.
- [ ] Enforce a documented CI budget and record exceptions with follow-up evidence.

## References

[1]: https://help.shopify.com/en/manual/online-store/web-performance/web-performance-reports "Shopify — Web performance reports"
[2]: https://shopify.dev/docs/storefronts/themes/best-practices/performance "Shopify — Theme performance"
[3]: https://shopify.dev/docs/storefronts/themes/tools/theme-inspector/using-the-theme-inspector "Shopify — Theme Inspector"
[4]: https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci "Shopify — Lighthouse CI"


## Incident triage sequence

When a dashboard or CI signal regresses, freeze the comparison before changing code. First identify whether the signal is synthetic, real-user, server-render, or browser-render evidence. Then choose the affected route and its representative data, compare the network waterfall and LCP element, inspect new or expanded third-party requests, and load a Theme Inspector profile if server work is suspected. Attribute each candidate to a file, section, app, asset, or platform condition. Remove, defer, simplify, or accept the cost only after naming the buyer benefit. Repeat the same test and record the result. This sequence prevents a local improvement—such as hiding an expensive component—from being misreported as a durable performance gain when it simply changed the test route or data shape.
