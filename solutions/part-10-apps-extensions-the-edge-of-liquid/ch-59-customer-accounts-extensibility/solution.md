<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 59 — Solution

## The approach

The starter assumes that a legacy Liquid account template can be copied into the current account portal. That is the wrong boundary. The solution keeps the theme responsible for an accessible **storefront doorway**, while customer accounts, app extensions, B2B company/location context, and customer data remain in the appropriate hosted/app surfaces.

| Need | Chosen surface | Why |
| --- | --- | --- |
| Storefront account entry | Theme section/link | The theme owns its header/sections, not hosted account internals |
| Password/dashboard expectation | Inventory and retire/reframe `[VERIFY]` | Current accounts are passwordless hosted accounts, not a template restyle |
| Credit-policy explanation | Customer-account UI extension proposal `[VERIFY]` | It can use an approved account target and defined B2B context |
| Loyalty data | Reviewed extension/app or native option `[VERIFY]` | Browser scraping/customer-data export is not a data contract |
| Account analytics | Approved pixel strategy `[VERIFY]` | Measurement is separate from account UI and consent/domain prerequisites |
| Fully bespoke portal | Headless Customer Account API only if justified `[VERIFY]` | It requires an explicit identity, security, and operations programme |

## 1 — Inventory and migration decision

`records/account-inventory.md` records the starter as discovery evidence, rather than treating it as an implementation to preserve.

| Source | Claimed outcome | Boundary failure | Decision | Exit condition |
| --- | --- | --- | --- | --- |
| `account-entry.liquid` | Password dashboard entry | Hardcoded legacy account route/ownership claim | Replace with neutral storefront link/entry | Current route/account mode approved |
| `loyalty-scrape.liquid` | Loyalty customer identity | Scrapes hosted portal DOM/private customer data | Remove; assess reviewed app/extension need | No portal selector/data export remains |
| `account-entry.js` | Name-aware dashboard | Assumes portal DOM from storefront | Remove | No browser account-DOM dependency |
| Account CSS | Portal restyling | Theme style cannot own hosted account document | Restrict styling to theme section | Candidate storefront check |
| Password/dashboard request | Legacy sign-in and bespoke view | Current hosted account model differs | Native/app/extension/headless/retire decision `[VERIFY]` | Owner approves outcome |
| B2B note | Credit policy and payment-term change | Confuses contact, company, location, and authority | B2B scoped explanation; no mutation | Company/location policy confirmed |

Current customer accounts are hosted and passwordless; legacy customer accounts are deprecated. A migration inventory must therefore record active account mode, account domain, plan, sign-in/identity setup, native feature availability, app/version, protected-data approval, B2B configuration, policy owner, candidate, release, and rollback as `[VERIFY]`.[1] There is no automatic requirement to reconstruct a legacy dashboard.

## 2 — Corrected theme doorway

The correction removes the assumed account URL, password claim, and portal selector. It does not pretend to render a hosted account page.

```liquid
{{ 'account-entry.css' | asset_url | stylesheet_tag }}

<section class="account-entry" aria-labelledby="account-entry-heading">
  <h2 id="account-entry-heading">Your account</h2>
  <p>Sign in to view orders and account information.</p>
  <a class="account-entry__link" href="{{ routes.account_url }}">
    Go to your account
  </a>
</section>
```

```css
.account-entry { border: 1px solid currentColor; padding: 1rem; }
.account-entry__link { display: inline-block; margin-block-start: .5rem; }
```

The exact account-route behavior, account component availability, sign-in redirect, active account mode, domain, and locale/market behavior must be tested in an authorised candidate `[VERIFY]`. The important result is negative as well as positive: no JavaScript queries `.customer-account__name`, no inline script reads portal content, no theme CSS targets the hosted document, and no fake password/registration flow is added.

## 3 — B2B extension proposal

The B2B request is only to **display** an approved company credit-policy message, not change payment terms. A block target is the appropriate proposed target class because the content is independently useful and merchant placement should be controlled through the accounts editor. Exact B2B Profile target, target identifier, availability, API version, app distribution, and plan remain `[VERIFY]`.[2]

`records/extension-proposal.md` has this contract:

| Field | Decision |
| --- | --- |
| Audience | Approved B2B contacts in an eligible company/location `[VERIFY]` |
| Purpose | Explain company/location policy; no payment or order mutation |
| Target | Block class; exact B2B/customer-account target `[VERIFY]` |
| Data | Minimal declared policy metafield/configuration and permitted company/location context only `[VERIFY]` |
| Capabilities | None requested for a static/local policy message |
| Merchant control | Placement and optional safe copy/configuration |
| Empty/error state | Do not display a policy if context/configuration is absent; core account remains usable |
| Privacy | Protected-data/access review, policy owner, retention and candidate evidence `[VERIFY]` |

An extension does not receive a blank cheque to expose customer/company data. Declare only required metafields; define namespace/key, owner, reader/writer, type, scope, fallback, and lifecycle. Customer account UI extensions provide documented block, full-page, and static target families; they are isolated app components rather than page-DOM scripts.[2]

## 4 — B2B authority boundary

`records/b2b-boundary.md` distinguishes the actors:

| Context | Legitimate question | Not implied |
| --- | --- | --- |
| Consumer customer | What account information is relevant to that person? | Access to B2B company policy |
| B2B contact | Is this person eligible to view the scoped message? | Authority to edit company payment terms |
| Company | Which business policy is owned by the company? | That every location uses it |
| Company location | Which location/market-specific policy applies? | That a customer-level setting is sufficient |

If company/location context is missing, the message is omitted or a neutral support route is shown—never a guessed credit status. Market/location variations, customer/company data access, account target, merchant editor configuration, legal/payment-policy owner, and release path are `[VERIFY]`. Customer-account UI cannot be used to change payment terms simply because it displays an explanation.

## 5 — Account migration plan

The plan first verifies whether customer accounts are active and whether native options meet requirements: passwordless sign-in, account branding/editor, order history, returns, store credit, Buy again, B2B, or a reviewed app. Then it selects extension versus headless only for a named gap. Headless is a separate project when complete frontend ownership is truly required; it is not a theme escape hatch.[1]

| Outcome | Migration path | Required evidence |
| --- | --- | --- |
| Legacy password form | Retire/reframe under current account sign-in; identity provider only if eligible `[VERIFY]` | Account mode, plan, identity owner, candidate flow |
| Branding request | Editor/native account settings first | Brand owner, configuration, responsive/localized review |
| Loyalty dashboard | Reviewed app, extension full page, or headless only after comparison `[VERIFY]` | Data/minimization/capability/app review and fallback |
| B2B policy | Scoped account extension or native/operational route | Company/location policy, audience, placement, error state |
| Analytics | Pixel assessment | Custom subdomain, purpose, consent, event mapping, owner `[VERIFY]` |

## 6 — Candidate validation

`records/validation-matrix.md` covers a signed-out entry, current-account sign-in `[VERIFY]`, no-order and long/localized content, missing optional configuration, candidate extension placement, B2B company/location scope, data/capability denial, removal of legacy selectors, and optional-pixel consent. Evidence is only candidate identifier, account/app/API version, configuration state, route, sanitized output, company/location fixture class, owner decision, release window, rollback target, and cleanup deadline. Never store real customer data, identity-provider settings, session tokens, cookies, or account screenshots containing personal data.

## What people get wrong here

**Copying a theme dashboard into customer accounts.** A hosted portal is not a section mount point. Choose native features, defined account extension targets, or headless architecture based on ownership.

**Using account DOM scraping for loyalty.** It is fragile and exports private customer data without a declared contract. A reviewed data source and minimal extension/app boundary are required.

**Treating a B2B contact as the company.** Company and company-location context affect what is shown and who owns it; a display message cannot change business terms.

**Requesting capabilities by default.** A local policy message needs no remote service, Storefront API query, or consent collection. Request a capability only when a documented outcome requires it.

## References

[1]: https://help.shopify.com/en/manual/customers/customer-accounts/upgrade/compare-features "Shopify — Customer accounts and legacy customer accounts"
[2]: https://shopify.dev/docs/api/customer-account-ui-extensions/latest "Shopify — Customer account UI extensions"
[3]: https://help.shopify.com/en/manual/customers/customer-accounts/upgrade/customization-options "Shopify — Customer-account customization options"
