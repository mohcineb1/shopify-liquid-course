<!-- STATUS: final -->
# Chapter 61 — Accessible Liquid

Accessibility is not a CSS pass applied after a theme “works.” Liquid chooses which HTML exists, in what order it appears, what content is named, which form relationships are present, and which initial state a browser and assistive technology receive. JavaScript then changes that rendered document. A theme is accessible only when those two layers preserve meaning, operation, focus, feedback, and recovery for real tasks—not when a scanner returns a high score on a static page.

Shopify’s theme guidance frames the work through perceivable, operable, understandable, and robust experiences, while also warning that its best-practice list alone cannot guarantee complete accessibility.[1] WCAG 2.2 is technology-neutral and explicitly expects a combination of automated testing and human evaluation.[2] The practical implication is simple: Liquid must produce a semantic baseline, interaction code must preserve keyboard/focus contracts, merchant configuration must expose its limits honestly, and an audit must exercise workflows rather than merely inspect markup.

## 61.1 Semantic output from generated markup

Generated markup can be invalid or misleading even when each Liquid fragment looks plausible alone. A section rendered many times may duplicate `id` values. A block setting used as a heading can skip hierarchy. A card whose whole surface is clickable may contain nested links. A visual icon may have no accessible name. A list of products can become a generic pile of `div`s because the author optimized first for CSS. These are output-contract failures, not screen-reader edge cases.

Start with native HTML that expresses the content’s meaning. Shopify recommends valid generated HTML, a `lang` attribute on `<html>`, a visible-on-focus skip link, logical heading order, and a main-content container that can receive focus.[1] Native elements already carry semantics and keyboard behavior that custom roles must recreate correctly.

| Intended meaning | Prefer | Do not substitute merely for styling |
| --- | --- | --- |
| New location/document | `<a href>` | `<div role="button">` with click handler |
| In-page action, disclosure, modal launcher | `<button type="button">` | Anchor without meaningful destination |
| Repeated comparable items | `<ul>`/`<ol>` and `<li>` | Unrelated generic wrappers |
| Tabular relationship | `<table>`, `<caption>`, scoped `<th>` | CSS grid announcing unrelated text |
| Primary document topic | One meaningful `<h1>` | A styled `<p>` or image-only title |
| Form control | `<label for>` plus named input | Placeholder-only field |
| Decorative image | `alt=""` | Filename announced as content |
| Meaningful image | Concise purpose-relevant `alt` | Empty alt or visual-only filename |

Liquid must keep its data model and DOM model aligned. A product-card loop is normally a list; a navigation loop is normally a navigation landmark containing a list; a collection heading must reflect the template’s primary subject, not a merchant’s decorative typography. Do not create a heading level only because its CSS size is convenient. If a section has an optional heading, render its heading element only when meaningful content exists, and give the surrounding landmark or `aria-labelledby` relationship a stable valid target.

```liquid
<section class="collection-grid" aria-labelledby="collection-grid-heading">
  <h2 id="collection-grid-heading">{{ section.settings.heading | escape }}</h2>
  <ul class="collection-grid__list" role="list">
    {% for product in collection.products %}
      <li class="collection-grid__item">
        {% render 'product-card', product: product %}
      </li>
    {% endfor %}
  </ul>
</section>
```

> [VERIFY] A label/heading setting can be blank, translated, or author-written. Define the empty-state behavior and validate IDs when a section can appear more than once; do not assume the shown string is always safe or meaningful.

Escaping output is essential for a text context, but it is not an accessibility transformation. It does not turn an unhelpful label into a helpful one, convert a prose URL into link purpose, resolve duplicate IDs, or create alternative text. Likewise, `aria-label` is not a repair kit for a design whose visible text is vague. An accessible name should match the user task and remain consistent with the visible control where possible.

Generated forms need explicit relationships. Every input has a programmatic label; required state is communicated with native `required` where applicable; errors are connected through `aria-describedby`; and an error summary or feedback target receives focus after a failed submission when that preserves the user’s task. Shopify’s guidance says returned form errors should be focused and announced promptly, with clear descriptions and live notification as appropriate.[1] Do not write Liquid that lists errors visually but leaves keyboard/screen-reader users at an unchanged control with no explanation.

Semantic output also has order. CSS can arrange a gallery, drawer, badges, or controls visually, but the DOM and focus order must retain meaningful operation. W3C explains that sequential focus must preserve meaning and operability; a positive `tabindex` manufactured to match a visual layout is a common failure.[3] Prefer source order that makes sense before CSS and use `tabindex="-1"` only for deliberate programmatic focus destinations such as `<main>` after a skip link or a validated error summary.

## 61.2 Focus management across section re-renders and drawers

A dynamic update can destroy the user’s position even when its final pixels look correct. Replacing a section with `innerHTML`, refreshing cart markup, closing a drawer, switching a variant, or filtering a collection may remove the element that held focus. A keyboard user can appear to “vanish” to the browser body; a screen-reader user can receive an announcement disconnected from the operation they initiated.

Focus is state. Before a render replacement, identify the trigger and the intended post-update task. After it completes, restore focus to the logical surviving equivalent, move it to a relevant result/status, or retain it on the launcher if the user remains there. Do not force focus to a result because any asynchronous request completed. The desired destination follows the interaction contract.

| Interaction | Focus when opened/updated | Focus when closed/failed |
| --- | --- | --- |
| Cart drawer | Dialog label/first purposeful control; keep keyboard interaction inside | Return to launching cart button; announce result/error where needed |
| Modal | A meaningful dialog destination, not an arbitrary wrapper | Return to launcher unless launcher no longer exists |
| Filter submit/re-render | Preserve relevant filter control if it survived, or move to updated results/status under a documented rule | Keep clear error/fallback and visible focus |
| Variant selection | Stay on selected radio/button; announce changed availability/price through targeted status | Do not throw focus to product top |
| Form failure | Error summary or first invalid control according to the error contract | Leave correction path usable and described |
| Carousel next/previous | Keep focus on activated next/previous control | Do not move focus into passive changing slides |

A drawer/modal has more than `role="dialog"`. Shopify’s theme guidance calls for focus moving to the element that labels an opened drawer/modal, keyboard navigation staying within it, `Escape` closing it, and focus returning to the launcher.[1] Use native `<dialog>` where it fits the supported design and browser policy, or implement an equivalent well-tested dialog contract: accessible name, modal semantics, backdrop/inert behavior, keyboard trap, close controls, return target, and no background scroll/focus leak. Consult the WAI-ARIA Authoring Practices pattern when building a custom widget rather than composing role attributes from memory.[4]

```js
function openCartDrawer(trigger, drawer) {
  const heading = drawer.querySelector('[data-drawer-title]');
  drawer.dataset.returnFocusId = trigger.id;
  drawer.hidden = false;
  heading.tabIndex = -1;
  heading.focus();
}

function closeCartDrawer(drawer) {
  drawer.hidden = true;
  const trigger = document.getElementById(drawer.dataset.returnFocusId);
  if (trigger) trigger.focus();
}
```

The code is incomplete by design: it illustrates explicit return-focus ownership rather than a universal dialog implementation. `[VERIFY]` the actual rendering lifecycle, active element survival, multiple trigger IDs, nested dialogs, scroll locking, `<dialog>` support policy, editor mode, and cleanup before release. Never assume that a section reload leaves existing event listeners, element IDs, or focus references valid.

Live regions announce a **change**; they do not move focus. Use a concise dedicated status region for events such as “Added to cart,” “3 filters applied,” or a variant availability change. Avoid placing a large container in `aria-live`, which can repeat every child after re-render. Do not announce ordinary visual updates unnecessarily, and do not use a polite live region as a substitute for an error that requires the user to correct a field.

## 61.3 Accessible variant pickers, facets, carousels, modals, and announcements

Interactive patterns are contracts involving semantic roles, accessible names, state, keyboard model, pointer behavior, focus movement, dynamic announcements, and failure behavior. The most accessible option is often a native control styled carefully—not a custom widget.

**Variant pickers.** A group of mutually exclusive variants maps naturally to radio inputs with a `<fieldset>` and `<legend>`. The selected variant remains a real control; unavailable values use clear native disabled/availability semantics and text, not color alone. When selection changes price, image, availability, or add-to-cart state, announce only the meaningful change and keep focus on the selected control. Shopify specifically calls for dynamic variant price/availability changes to be communicated to screen readers with `aria-live`.[1]

```liquid
<fieldset class="variant-picker">
  <legend>{{ option.name }}</legend>
  {% for value in option.values %}
    {% assign input_id = section.id | append: '-' | append: option.position | append: '-' | append: forloop.index %}
    <input type="radio" id="{{ input_id }}" name="options[{{ option.name | escape }}]" value="{{ value | escape }}">
    <label for="{{ input_id }}">{{ value }}</label>
  {% endfor %}
</fieldset>
```

> [VERIFY] Variant availability, selling-plan, combined-listing, locale, and application behavior vary by product configuration. Validate the actual data contract rather than teaching a visual “sold out” label as authoritative.

**Facets.** A filter is normally a form: checkbox/radio/select controls with a submit/update route, a visible applied-filter summary, reset action, result count, and predictable focus policy. Avoid making every visual chip a non-semantic clickable `span`. If enhancements refresh results asynchronously, retain the interaction’s keyboard context and announce a concise result update. Filter controls, result order, URL/history behavior, and no-JavaScript submission form a single user contract.

**Carousels.** A carousel is optional complexity, not a default layout. Content must not change unexpectedly. Auto-advancing content needs a pause/stop mechanism, and slides need usable next/previous controls; Shopify makes both expectations explicit.[1] Do not remove offscreen slides from reading order in a way that strands focus. If implementing a full carousel keyboard model, use a recognized WAI pattern and test it with reduced motion, touch, keyboard, screen reader, and resize states `[VERIFY]`.

**Modals/drawers.** Use dialog semantics only for a true interruption that needs modal behavior. A size guide or cart could be a dialog; a normal navigation submenu is not automatically one. The launcher needs an accessible name and a state indication when appropriate; focus must not escape into the inert page; `Escape` and an explicit close action work; and return focus is deterministic. Do not trap focus in a panel that is visually hidden, nor auto-open a promotional modal merely because a timer fired.

**Announcements.** Announce results, not implementation details. “Added Trail Jacket, size M, to cart” may be useful; “renderCart() complete” is not. A failed validation needs the actionable error at the correct control/summary; a visual loading spinner does not need to be read repeatedly. Keep a written event-to-announcement table so a future refactor does not silently create duplicate or absent feedback.

## 61.4 Merchant-authored content and the accessibility you cannot control

A theme provides an authoring system, not perfect content. Merchants can write vague headings, upload image files with poor alt text, choose low-contrast color combinations, add unstructured rich text, omit link purpose, use a video without captions, or configure a heading as blank. A theme cannot guarantee the accessibility of every decision, but it can make the safe path easy and make unsupported claims impossible.

| Theme responsibility | Merchant responsibility | Honest boundary |
| --- | --- | --- |
| Semantic template, labeled settings, defaults, constraints, preview | Meaningful heading/link/alt/copy/media choice | Theme cannot infer an image’s purpose or rewrite a business claim |
| Color tokens and contrast-aware defaults | Selected colors/content combinations | Custom palette needs contrast review `[VERIFY]` |
| Correct native controls and editor labels | Intentional configuration and review | Settings cannot force meaningful prose |
| Safe rich-text output boundary | Proper heading/list/link structure in supplied content | Rich text may still contain inaccessible authoring |
| Accessibility guidance and evidence | Accessible uploads, captions, descriptions | No automated score certifies every content change |

A setting label is part of accessibility tooling. “Image” is weaker than “Decorative image (hidden from screen readers)” versus “Product image: describe information needed to choose it.” Provide help text that explains purpose, a safe default, and the effect of leaving a setting blank. Where a design requires a heading, make that requirement visible in the component contract; where a heading is optional, avoid an empty landmark reference. Do not turn all uploaded images into `alt=""` to silence filename output, because meaningful product/content imagery needs equivalent purpose text.

Rich text needs containment but cannot be reduced to plain text automatically. Allow merchant content where the data model calls for it; make surrounding template structure semantic; do not use CSS that breaks focus outlines or hides heading structure; and review actual author-created pages as part of release evidence. Content governance belongs in the release plan: owner, selected templates, locale/market, required media alternatives, contrast state, review date, known exception, remediation owner, and `[VERIFY]` claim level.

Do not claim legal conformance from a theme control. WCAG’s testable criteria are valuable, but W3C notes that even high conformance does not meet every user need and recommends applying multiple layers of guidance.[2] The appropriate promise is practical: the theme preserves semantics and usable controls, surfaces authoring responsibility, and records what remains to review.

## 61.5 Auditing a theme: automated checks plus manual keyboard passes

Automation is a regression signal, not an accessibility verdict. Shopify lists tools such as Accessibility Insights, Lighthouse, WAVE, and its Lighthouse CI action as useful theme testing inputs.[1] They can catch missing names, color heuristics, invalid patterns, and changes in a controlled page state. They cannot reliably decide whether a product picker’s interaction model makes sense, whether focus returns to the correct launcher, whether merchant content explains a link, or whether a real buyer can complete a task under time, zoom, motion, assistive technology, and error conditions.

An audit is a stateful matrix, not one home-page run.

| Layer | What it tests | Evidence | Known non-coverage |
| --- | --- | --- | --- |
| Static/automated scan | Obvious markup/name/contrast-pattern failures | Tool/version, route, fixture, viewport, results | Meaning, keyboard flow, content quality |
| HTML validation | Generated markup structure | Rendered URL/state and validator output | Behavioral semantics after scripts run |
| Keyboard pass | Tab/Shift+Tab, Enter/Space, Escape, arrows where pattern requires | Ordered focus notes and result for each task | Screen-reader announcement quality alone |
| Screen-reader check | Names, state, status, errors, reading order | Tool/browser/version and concise observations | Full disability/user-context coverage |
| Zoom/reflow/touch/motion | Visual focus, target reachability, responsive interaction | Viewport/zoom/input preference fixture | Business correctness/authoring quality |
| Merchant-content review | Actual heading/alt/link/media choices | Template/locale/market/settings and reviewer | Future content changes |

A manual keyboard pass starts with no mouse. Navigate the header and skip link; open/close a menu; search; select product options; add to cart; open/close cart drawer; change quantity/remove line; submit an invalid form; filter/sort/paginate; interact with any carousel/modal; and complete the route’s relevant checkout transition without claiming control over hosted checkout. At each step record: visible focus, logical order, key used, action result, announcement/error, escape/return focus, no-JavaScript fallback where relevant, and defect owner.

Focus order should preserve meaning and operation, not merely mirror a CSS layout; W3C warns against positive `tabindex` reordering and against confusing nested focusable elements.[3] An audit needs different data states: long translated titles, blank headings, product variants unavailable, empty cart, cart error, sold-out product, multiple sections, mobile viewport, reduced-motion preference, high zoom, and merchant rich text. If a test needs credentials, customer data, a real payment, or a production configuration, stop and obtain the authorised candidate/fixture rather than improvising.

Finally, give findings dispositions. A tool warning can be a defect, false positive, known limitation, blocked verification, accepted risk, or content task—but each disposition needs evidence, owner, deadline, and re-test condition. “No errors in Lighthouse” is neither a completion definition nor an accessibility statement. Accessibility is maintained through semantic Liquid contracts, interaction tests, merchant guidance, and recurring human review.

## References

[1]: https://shopify.dev/docs/storefronts/themes/best-practices/accessibility "Shopify — Accessibility best practices for themes"
[2]: https://www.w3.org/TR/WCAG22/ "W3C — Web Content Accessibility Guidelines 2.2"
[3]: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html "W3C — Understanding Focus Order"
[4]: https://www.w3.org/WAI/ARIA/apg/ "W3C — ARIA Authoring Practices Guide"
