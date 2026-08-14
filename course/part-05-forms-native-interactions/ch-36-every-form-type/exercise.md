<!-- STATUS: final -->
# Chapter 36 — Exercise

## Goal
Build **Lab 13**, a complete no-JavaScript account-area baseline for a store that has confirmed it is using the relevant **legacy customer-account templates**. The work must separate authentication, recovery, registration, address editing, guest checkout, newsletter consent, and native form state rather than collapsing them into a generic account component.

## Context
Atelier North operates a transitional B2B storefront. It has legacy customer account templates enabled for a controlled maintenance period and needs a usable account area while it prepares its latest-account migration. The current theme has a login form that posts to a guessed route, a newsletter checkbox inside registration, address inputs with a fixed list of provinces, and a “guest checkout” link that does not represent Shopify’s native guest flow. It also loses field values and shows identical red banners after every failed form.

The area must work without JavaScript. Account forms belong only in their matching legacy template context; the theme must not claim that the same code applies to latest customer accounts. You will build account login, registration, password recovery, address create/edit, and guest checkout affordances from native forms; then add a separate newsletter component that uses the correct customer form. You will document form context, generated fields, error recovery, and migration boundary.

Plan **75–90 minutes**. Test valid and invalid login, registration collision/error, password-recovery request, new/edit address, country/province behavior, guest flow when the store enables it, newsletter signup, keyboard use, and JavaScript disabled. Capture which flows are unavailable because the store uses latest accounts or the configuration does not expose the legacy surface.

## Requirements

- [ ] Create a legacy customer login template area using `customer_login`, `recover_customer_password`, and `guest_login` only in their correct contexts. Give each form accessible server error/success treatment and separate IDs.
- [ ] Add a legacy register area using `create_customer`, with native returned form state and no password restoration. Explain why registration is not a newsletter signup substitute.
- [ ] Add an addresses area using `customer_address` for both `customer.new_address` and an existing address. Use country/province selector contracts rather than hard-coded jurisdiction lists.
- [ ] Add a standalone newsletter section using `customer` and `contact[email]`, with clear merchant-approved consent copy placeholder and a documented distinction from account creation.
- [ ] Pass required resource/context arguments to every form. Do not hand-write account endpoints, type fields, or generated hidden inputs.
- [ ] Make valid, invalid, unsubmitted, and unavailable account-mode states distinct. The UI must clearly state when legacy templates are not the active store surface.
- [ ] In `notes.md`, record form type, template context, returned fields/errors, no-JS evidence, two-instance ID check, country/province behavior, guest configuration, and latest-account migration decision.

> [VERIFY] Confirm the store’s account mode, enabled legacy templates, guest checkout configuration, exact account form fields/errors, country/province helper behavior, and current account-component migration plan before release.

## Constraints

No JavaScript. Do not extend an inactive legacy account surface just because template files exist. Do not use `customer` to register an account or `create_customer` to obtain newsletter consent. Do not display/repopulate passwords. Do not hard-code country/province options. Do not confuse a guest-login form with a direct checkout URL. Keep this exercise inside its starter paths.

## Starter

| File | Purpose |
| --- | --- |
| `starter/templates/customers/login.liquid` | Guessed login endpoint, recovery and guest links, duplicate IDs. |
| `starter/templates/customers/register.liquid` | Raw registration form that incorrectly doubles as newsletter signup. |
| `starter/templates/customers/addresses.liquid` | Static address country/province inputs and no edit/new distinction. |
| `starter/sections/newsletter-consent.liquid` | Raw newsletter input with no native customer form state. |
| `starter/snippets/account-form-feedback.liquid` | Global non-specific error banner. |
| `starter/assets/account-area.css` | Finished baseline account styles. |
| `starter/notes.md` | Form-context, error, no-JS, account-mode, and migration evidence. |

## Done when

A verified legacy-account store can use the native account flows without JavaScript, correct errors with understandable feedback, and manage addresses through the form context Shopify provides. Newsletter consent is separate and honest. The notes make current account-mode limitations explicit so the same files are not mistakenly deployed as a latest-account replacement.

## Stretch

Sketch an account-area migration map that replaces legacy template entry points with the supported account component while keeping storefront links understandable. Identify what remains theme-owned and what becomes Shopify-owned. Do not implement the migration.
