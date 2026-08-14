<!-- STATUS: final -->
# Chapter 61 — Exercise

**Time:** 90–120 minutes · **Type:** accessible theme interaction repair

## Goal

Repair a product/card and cart-drawer interaction without treating ARIA as decorative markup. You will make generated Liquid semantic, define focus behavior across a simulated rerender, replace faux controls with native contracts, document what merchant-authored settings cannot guarantee, and create an audit matrix combining automation with a manual keyboard pass.

## Context

Northstar Outdoors has a product options widget made from clickable `div`s, a cart drawer that opens visually but leaves focus in the page, a list of cards rendered as generic containers, a live region wrapped around the whole cart, and a merchant setting called “Image” with no guidance. A stakeholder asks to “add ARIA everywhere” and use a scan score as release proof. The current theme/editor state, product configuration, translations, screen-reader/browser combination, assistive-technology use, accessibility target, tool version, candidate route, and release approval are unknown.

Work locally only. Do not alter a live theme, customer cart, merchant content, accessibility statement, third-party widget, checkout, app, or store setting. Do not make a legal conformance claim. Record all observed-content, configuration, tool, assistive-technology, candidate, owner, exception, and release facts as `[VERIFY]`.

## Requirements

- [ ] 1. Replace the starter’s generic product-card wrappers with semantic structure: meaningful heading, list/list item relationship, real links versus actions, image alternative-text rule, and stable section-scoped IDs. Explain empty/duplicate/merchant-content cases in `semantic-contract.md`.
- [ ] 2. Replace the faux variant picker with native `fieldset`, `legend`, radio inputs, and labels. Define selected/unavailable state, price/availability feedback, keyboard behavior, and a concise announcement contract; do not use color alone or invent availability facts.
- [ ] 3. Repair the cart drawer so it has a named dialog contract, deliberate opening focus, keyboard containment, Escape/close behavior, return focus, and a no-stale-reference policy across replacement. Create `focus-contract.md`; do not claim a partial snippet is a universal focus trap.
- [ ] 4. Replace the whole-cart `aria-live` strategy with a minimal status target and write `announcement-map.md` mapping meaningful event, message, politeness, focus movement, duplicate-suppression, and failure behavior.
- [ ] 5. Create `merchant-boundary.md` for headings, images/alt text, rich text, colors, captions, links, and blank settings. State safe template scaffolding, merchant decision, editor guidance/default, review evidence, and what the theme cannot infer.
- [ ] 6. Create `keyboard-pass.md` and `audit-matrix.md`. Cover skip link, header/navigation, variant selection, add/cart result, drawer open/close, cart quantity/removal, form error, facets, carousel/modal if present, zoom/reflow/reduced motion, automated scan, HTML validation, and manual keyboard/screen-reader observations. Every test needs route/fixture/tool/state/owner/disposition.
- [ ] 7. Keep a server-rendered product/cart link and no-JavaScript recovery path. Do not hide critical controls while JavaScript initializes, use positive `tabindex`, make static text focusable without reason, or move focus merely because a request completed.
- [ ] 8. Mark product/variant/availability, merchant setting/content, section multiplicity, cart/drawer lifecycle, browser/assistive tech, route/fixture, scan result, WCAG target, exception, reviewer, and release approval `[VERIFY]`.

## Constraints

- Use native HTML before ARIA; roles/states do not repair wrong elements, missing keyboard logic, or a meaningless accessible name.
- A live region announces a bounded update; it does not replace focus management or a correct form-error destination.
- Do not infer meaningful alt text, heading hierarchy, link purpose, contrast, captions, or language from an uploaded file or rich-text setting.
- A scanner is a regression signal, not a complete accessibility audit or legal conclusion.
- Ship real starter Liquid, JavaScript, and CSS files; solution work stays in the solution mirror.

## Starter

```text
starter/sections/product-accessibility.liquid generic card/div markup, faux variant controls, unlabeled image setting
starter/assets/product-accessibility.js        global click handlers, whole-container live update, focus loss
starter/assets/product-accessibility.css       hidden focus/control styling
starter/snippets/cart-drawer.liquid            unnamed drawer with no return-focus contract
starter/merchant-content-notes.md              unowned alt/rich-text/color/media request
starter/audit-notes.md                         scan-only release request
```

## Done when

| Concern | Evidence |
| --- | --- |
| Semantics | Output contract retains heading/list/link/control/image meaning under repeated/empty merchant states |
| Focus | Drawer/rerender policy names opening, containment, close, return and stale-reference behavior |
| Widgets | Variant and status feedback use native controls, concise announcements, and predictable keyboard behavior |
| Content | Merchant boundary makes guidance, defaults, reviews, and unautomatable responsibility explicit |
| Audit | Automated, HTML, keyboard, screen-reader, zoom/motion, fixture, disposition, owner, and re-test evidence coexist |
| Recovery | Essential product/cart task remains available without successful enhancement |

## Stretch

Add a product-media carousel decision record. State whether it should remain a list, use native media controls, or implement a documented carousel pattern. Define pause/next/previous behavior, slide visibility/focus, reduced-motion, captions/descriptions, merchant media responsibility, and manual test states. Do not add an ARIA role without its complete keyboard and lifecycle contract.
