<!-- STATUS: final -->
# Chapter 60 — Exercise

**Time:** 75–90 minutes · **Type:** storefront-runtime decision and hybrid boundary

## Goal

Repair a theme cart interaction without turning it into an accidental headless storefront. You will classify Ajax versus Storefront API responsibilities, turn a global client script into a bounded Liquid-shell island, and prepare an evidence-led Hydrogen/Oxygen decision record. The objective is not to adopt a framework; it is to identify the smallest runtime that can safely own the buyer task.

## Context

Northstar Outdoors has a cart drawer script that fetches `/cart.js` from a hardcoded root, assumes a global customer object, rewrites totals locally, and adds a Storefront API token to the DOM “for future headless.” Product leaders now request a React rebuild because the cart animation feels slow. No one has measured the theme, documented cart failures, identified public/private data, checked theme apps/Markets/accounts/checkout behavior, or priced ongoing ownership.

Work locally. Do not create a Storefront token, call an API, scaffold Hydrogen, install a channel, deploy Oxygen, alter cart/checkout/account state, or inspect real customer traffic. Every store, token, API version, plan, runtime, integration, publishing, route, performance, owner, cost, and release fact is `[VERIFY]` until observed through authorised systems.

## Requirements

- [ ] 1. Write `api-decision.md` comparing the starter task against Ajax API, Storefront API, and no new API. Cover storefront home, auth/token boundary, cart authority, customer/order data restriction, locale routing, response shape, error handling, and why Storefront API is not a cart-drawer default.
- [ ] 2. Correct the starter cart island. Use a locale-aware Ajax cart read/update pattern, remove the token/customer assumption and local total calculation, preserve a server-rendered cart link, expose only a minimal config contract, and provide pending/error/accessible status behavior. Do not build a SPA or invoke an endpoint in this exercise.
- [ ] 3. Write `island-contract.md` with mount point, owner, inputs, data source, authority limits, lifecycle/stale-response policy, loading/empty/error states, accessibility, performance budget, editor/design-mode expectations, candidate fixtures, and removal path.
- [ ] 4. Write `headless-decision.md`. Compare theme repair, hybrid island, and Hydrogen/Oxygen against named buyer outcome, measured baseline, APIs/data, merchant editing, apps/pixels/accounts/checkout, SEO/routing, Markets/B2B, security, people, operations, cost, candidate slice, rollback, and explicit no-go criteria.
- [ ] 5. Write `migration-register.md` for a hypothetical approved vertical slice. Cover cart continuity, product publication, Shopify-hosted checkout/subdomain, redirects/canonicals, feeds, notifications, account/auth, analytics/consent, app integrations, observability, release, and rollback. Mark all actual values `[VERIFY]`.
- [ ] 6. Write `maintenance-model.md` distinguishing implementation effort from ongoing API versioning, cache/query ownership, bundles, SSR, environments/secrets, CI/CD, monitoring/incidents, content workflows, support, and dependency retirement.
- [ ] 7. Create `validation-matrix.md` for baseline/target performance, locale root, cart success/failure/repeated action, no-JS fallback, payload minimization, island removal, theme/app compatibility, candidate headless slice, shared-cart/check-out continuity, redirect/SEO, and release/rollback evidence. Use sanitized candidate data only.
- [ ] 8. Mark all runtime/platform/API/authentication/token/plan/Oxygen/hosting/product-publication/checkout/domain/app/account/market/consent/metric/cost/approval facts `[VERIFY]`.

## Constraints

- Ajax API is for Shopify-hosted themes; do not propose it for a custom storefront.
- Do not read customer/order data through Ajax, expose Storefront credentials, or build an unbounded client data layer for a cart count.
- Do not let the browser calculate authoritative price, eligibility, inventory, shipping, payment, checkout, or customer state.
- Do not call headless a performance solution without a measured bottleneck and an owned operational plan.
- Ship real starter files: a Liquid shell, minimal CSS, and intentionally unsafe JavaScript/notes. The solution corrects the theme boundary; it does not deploy a headless app.

## Starter

```text
starter/sections/cart-island.liquid           Liquid shell with token/customer/local-total anti-patterns
starter/assets/cart-island.js                 hardcoded cart root and global app state
starter/assets/cart-island.css                client-only cart hiding style
starter/snippets/storefront-token.liquid      token-in-DOM anti-pattern
starter/headless-request.md                   framework-first migration request
starter/integration-notes.md                  unowned app/account/checkout/SEO notes
```

## Done when

| Concern | Evidence |
| --- | --- |
| API choice | Ajax, Storefront, and no-new-API boundaries are compared against the actual task |
| Hybrid | Liquid retains meaningful shell/fallback; the island owns only explicit interaction and no commerce authority |
| Headless | A measured, funded, operational decision framework identifies go/no-go and a thin slice |
| Migration | Cart, checkout, routing, SEO, feeds, notifications, accounts, apps, consent, and rollout are registered |
| Maintenance | Team/runtime/version/cache/deployment/incident/content ownership is explicit |
| Validation | Candidate matrix proves state, fallback, performance, continuity, compatibility, and rollback without real data |

## Stretch

Design a product-configurator decision record. State whether it needs a theme island, Storefront API custom storefront, Shopify Function, app extension, or a combination. Separate buyer interaction, authoritative commerce calculation, checkout, customer data, accessibility, content editing, and operational cost. Do not write an implementation or provision an API token.
