<!-- STATUS: final -->
# Chapter 59 — Exercise

**Time:** 75–90 minutes · **Type:** customer-account migration and extension boundary

## Goal

Replace a theme-owned “account dashboard” assumption with an evidence-backed customer-account plan. You will classify legacy templates and sign-in expectations, preserve only legitimate storefront entry work in the theme, design a minimal customer-account extension proposal, and account for B2B company/location context without exposing private customer data or changing a live account configuration.

## Context

Northstar Outdoors has a customized password account template, a theme script that scrapes account-order markup for loyalty points, a header link that hardcodes an old account path, and a B2B request to display a company credit-policy message. A stakeholder wants the new account portal to “look like the theme, show the old dashboard exactly, require a profile form before sign-in, and collect all customer fields for the loyalty widget.” Nobody has verified the active account mode, plan, identity provider, customer-data approval, B2B setup, company location, account domain, editor placements, or app/pixel state.

Work locally. Do not activate customer accounts, change sign-in, create an app, request protected-data access, configure an identity provider, alter B2B/company data, inspect customer records, install a pixel, or test real accounts. Treat all production facts as `[VERIFY]`.

## Requirements

- [ ] 1. Write `account-inventory.md` that classifies every starter artifact by legacy/current account relevance, buyer outcome, data boundary, current owner, replacement/retire choice, migration risk, candidate fixture, deletion condition, and `[VERIFY]` fact.
- [ ] 2. Write `surface-decision.md`. Assign each need to theme storefront entry, native customer-account feature/editor, customer-account UI extension, reviewed app, pixel, headless Customer Account API, or retire. Explain why the theme/DOM alternative lacks authority.
- [ ] 3. Correct only the starter header/link and storefront account callout. Make them accessible and honest about account navigation; remove the hardcoded legacy path and DOM/account-data assumption. Do not create or style hosted account markup.
- [ ] 4. Write `extension-proposal.md` for the B2B credit-policy explanation. Specify target **class** (block/full page/static), audience, company/company-location context, minimal declared data/metafield contract, merchant placement/configuration, capabilities requested or deliberately absent, empty/error state, protected-data review, and exact facts `[VERIFY]`.
- [ ] 5. Write `b2b-boundary.md` separating consumer, B2B contact, company, and company-location authority. Include missing context, market/location variation, message ownership, and why a displayed policy is not a payment-term mutation.
- [ ] 6. Write `account-migration-plan.md` for password/registration expectations, account branding, native feature review, app/extension alternative, headless decision threshold, candidate test accounts, rollback, and legacy-template cleanup.
- [ ] 7. Write `validation-matrix.md` covering signed-out entry, current-account sign-in `[VERIFY]`, no-order/long-content states, unavailable optional data, extension placement/configuration, B2B company-location scope, data denial/error, legacy removal, and optional pixel consent. Use sanitized candidate evidence only.
- [ ] 8. Mark active account mode, domain, plan, sign-in/identity behavior, target/API/version, app distribution, protected-data approval, B2B/company/location/market context, pixel/consent state, candidate, owner, release, and rollback `[VERIFY]`.

## Constraints

- Do not mimic a hosted customer-account page with a theme template, CSS selector, password form, or browser scrape.
- Do not require registration/custom fields before sign-in, hide built-in portal content, or assume customer identity/portal DOM is theme-owned.
- Do not request `network_access`, `api_access`, or buyer-consent collection unless the proposal demonstrates the specific need and its review boundary.
- Do not treat a B2B company-level explanation as authority to mutate payment terms or expose company/customer data.
- Ship real starter theme files and notes. This is a planning/correction exercise, not a request to build/deploy an account app.

## Starter

```text
starter/sections/account-entry.liquid          hardcoded legacy account link and account-data claim
starter/snippets/loyalty-scrape.liquid         portal DOM/identity scraping anti-pattern
starter/assets/account-entry.js                browser query of assumed account markup
starter/assets/account-entry.css               legacy dashboard styling assumption
starter/account-notes.md                       unowned password/dashboard/analytics request
starter/b2b-notes.md                           company credit-policy request with no scope
```

## Done when

| Concern | Evidence |
| --- | --- |
| Architecture | Legacy/current account differences and portal boundary drive every decision |
| Theme | Only safe storefront doorway code remains; no hosted markup/data/DOM ownership claim |
| Extension | Target class, data, capability, merchant/B2B context, errors, and protected-data boundary are explicit |
| B2B | Company and company-location scope are distinct from consumer/customer assumptions |
| Migration | Native/app/extension/headless/retire alternatives have owner, candidate, rollback, and cleanup decisions |
| Validation | Candidate matrix proves task states without real customer, company, identity, or consent data |

## Stretch

Add a proposal for a loyalty dashboard. Decide whether an account block, full-page extension, native/reviewed app, or headless account experience best fits. Explain why data minimization and capability choice change, how an unavailable loyalty service fails safely, and which current plan/API/protected-data facts require `[VERIFY]`.
