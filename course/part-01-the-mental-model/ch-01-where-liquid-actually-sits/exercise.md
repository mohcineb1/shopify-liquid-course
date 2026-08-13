<!-- STATUS: final -->
# Chapter 1 — Exercise

## Goal

Build a product-page runtime brief that renders Shopify-owned product information in the initial document, enhances one buyer interaction in the browser, and labels a checkout decision as platform-owned rather than pretending the theme can implement it.

## Context

Northstar Tea is about to launch a limited seasonal product. The merchant wants a small briefing panel on every product page so the team can see which concerns belong to the theme render, which are browser-only enhancements, and which must remain a platform checkout rule. The current implementation is confusing those boundaries: a designer has asked for “live discount logic” in the section and an external availability request during the Liquid render.

Your panel must make the boundary visible while still being useful to a buyer. It must show the current product’s identity before JavaScript runs, allow the buyer to choose a dispatch preference that updates an on-page preview, and state where discount eligibility belongs.

## Requirements

- [ ] Add the starter section to a product template through the theme editor. The completed panel appears only in a product context.
- [ ] The panel shows the current product’s title in its server-rendered HTML. With JavaScript disabled, the title remains correct and visible on the storefront.
- [ ] A buyer can choose either a standard or priority dispatch preference. Changing the choice updates the dispatch-preview sentence without a page reload.
- [ ] The product identity, dispatch preview, and discount-eligibility statement each visibly identify their runtime owner as **Theme render**, **Browser**, or **Shopify platform rule**.
- [ ] The discount-eligibility statement says that the theme does not calculate the rule. It remains visible and accurate before and after the browser enhancement runs.
- [ ] The completed section does not make a network request and does not rely on a package, app framework, or custom storefront endpoint.
- [ ] Product pages with a title containing punctuation or non-ASCII characters render that title as text, not markup.

## Constraints

Do not use the Storefront API, an app proxy, an external endpoint, a Shopify Function, or checkout Liquid. Do not calculate discounts in the browser. Do not replace the product template with a headless application. Keep the behavior in the starter section and its companion asset.

## Starter

Begin with `starter/sections/runtime-brief.liquid` and `starter/assets/runtime-brief.js`. The section supplies the semantic shell and editor preset; the asset only locates the shell. Decide which values belong to the initial render, which can change in the browser, and how each responsibility should be described.

## Done when

On a product page, viewing the page source reveals the actual current product title and the platform-rule statement. In the loaded storefront, changing dispatch preference updates only the preview owned by the browser. The page shows three distinct runtime owners, contains no network request, and remains understandable when JavaScript is disabled.

## Stretch

Design a documentation-only decision table for a future team requirement that needs personalized delivery pricing. State the questions the team must answer before choosing a platform rule, browser enhancement, or headless implementation. Do not implement any pricing or API call.
