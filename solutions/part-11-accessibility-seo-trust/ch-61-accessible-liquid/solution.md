<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 61 — Solution

## The approach

The starter attempts to repair accessibility with generic `div`s, a container-wide live region, hidden focus, and a scan-only release. The correction starts one layer earlier: render valid semantic HTML, use native form controls, assign focus ownership to the drawer, and make each announcement a bounded event. Automation remains useful, but the release evidence is task-based keyboard and content review.

| Problem | Correction | Why |
| --- | --- | --- |
| Generic card/div output | Heading, list/list-item, image alt rule, link/button distinction | Meaning survives without JavaScript or CSS |
| Clickable variant `div` | Fieldset/legend/radios/labels | Native selection and keyboard behavior |
| Whole cart `aria-live` | Dedicated concise status element | Announces relevant changes without replaying a tree |
| Visual drawer only | Named dialog + deliberate focus/return contract | Keyboard users retain a coherent task position |
| “Image” setting | Purpose-oriented author guidance and review record | Theme cannot infer useful alt/caption/contrast |
| Scanner-only release | Automated + HTML + keyboard + assistive-technology/manual states | Static tooling cannot judge interaction meaning |

## 1 — Semantic output contract

The product cards are a list. The title is a heading within each item. A product link navigates; a cart trigger is a button. An image needs an `alt` decision, not a missing attribute. IDs use the section/block/item context so repeated sections do not collide.

```liquid
<section class="product-results" aria-labelledby="product-results-{{ section.id }}">
  <h2 id="product-results-{{ section.id }}">{{ section.settings.heading | escape }}</h2>

  <ul class="product-results__list" role="list">
    {% for product in collection.products %}
      {% assign title_id = 'product-title-' | append: section.id | append: '-' | append: product.id %}
      <li class="product-results__item">
        <article class="product-card">
          <a href="{{ product.url }}" aria-labelledby="{{ title_id }}">
            {% if product.featured_image != blank %}
              {{ product.featured_image | image_url: width: 720 | image_tag: alt: product.featured_image.alt, loading: 'lazy' }}
            {% endif %}
            <h3 id="{{ title_id }}">{{ product.title }}</h3>
          </a>
          <button type="button" data-open-cart>Open cart</button>
        </article>
      </li>
    {% endfor %}
  </ul>
</section>
```

`semantic-contract.md` specifies that the section heading requires a nonblank authored value or needs an alternative safe label/omission decision `[VERIFY]`; product image alternative text is reviewed for purpose and may be empty only when truly decorative; and section/product IDs are inspected when repeated/current data contains edge cases. A theme cannot manufacture a good alt description or meaningful heading merely by escaping a string.

## 2 — Native variant and feedback contract

A mutually exclusive option group is a fieldset. Radios are not a visual compromise: they give users an accessible name, selected state, and expected keyboard model before enhancements run.

```liquid
{% for option in product.options_with_values %}
  <fieldset class="variant-picker" data-option-position="{{ option.position }}">
    <legend>{{ option.name }}</legend>
    {% for value in option.values %}
      {% assign id = 'variant-' | append: section.id | append: '-' | append: option.position | append: '-' | append: forloop.index %}
      <input
        id="{{ id }}"
        type="radio"
        name="options[{{ option.name | escape }}]"
        value="{{ value | escape }}"
        {% if option.selected_value == value %}checked{% endif %}
      >
      <label for="{{ id }}">{{ value }}</label>
    {% endfor %}
  </fieldset>
{% endfor %}
<p class="product-status" data-product-status aria-live="polite" aria-atomic="true"></p>
```

The solution does not guess variant availability. `announcement-map.md` says a confirmed selection may announce a concise price/availability outcome from the actual current product data contract `[VERIFY]`; it does not announce every pointer movement, raw DOM mutation, or a full product description. Focus stays on the radio the user selected. If a value is unavailable, the current product configuration determines whether it is disabled, explained, or represented another way `[VERIFY]`; color alone never expresses that status.

## 3 — Drawer focus and concise status feedback

The cart drawer has a programmatic name and an explicit return target. The code illustrates policy rather than claiming a complete universal focus-trap library.

```liquid
<div
  class="cart-drawer"
  data-cart-drawer
  role="dialog"
  aria-modal="true"
  aria-labelledby="cart-drawer-title"
  hidden
>
  <h2 id="cart-drawer-title" tabindex="-1" data-drawer-title>Your cart</h2>
  <button type="button" data-close-cart>Close cart</button>
  <div data-cart-status aria-live="polite" aria-atomic="true"></div>
</div>
```

```js
(function () {
  const drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer) return;
  let returnFocus = null;

  function open(trigger) {
    returnFocus = trigger;
    drawer.hidden = false;
    drawer.querySelector('[data-drawer-title]').focus();
  }

  function close() {
    drawer.hidden = true;
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
    returnFocus = null;
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-cart]');
    if (trigger) open(trigger);
    if (event.target.closest('[data-close-cart]')) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !drawer.hidden) close();
  });
}());
```

`focus-contract.md` defines opener, initial focus, containment implementation/review, Escape, close control, return focus, background inertness, nested-dialog rule, drawer rerender behavior, missing-launcher fallback, editor lifecycle, and candidate fixtures `[VERIFY]`. If markup is replaced, capture only a valid semantic return target and reinitialize safely; do not hold stale references or move focus merely because a fetch resolved. A full modal implementation must be verified against current native/dialog or WAI pattern guidance, including containment and background behavior.

`announcement-map.md` makes feedback narrow:

| Event | Status message | Focus move | Suppression/failure policy |
| --- | --- | --- | --- |
| Item added | “Added [item] to cart.” `[VERIFY]` item-safe wording | No; launcher remains task context | One message per successful action |
| Variant confirmed | Current price/availability summary `[VERIFY]` | No; selected radio remains focused | No announcement for unconfirmed UI state |
| Cart refresh failure | “Cart could not be refreshed. Open cart to continue.” | No automatic move | Link remains usable |
| Form invalid | Error summary/first invalid field per form contract | Yes, if correction requires it | Link control to clear error text |

## 4 — Merchant-content boundary

`merchant-boundary.md` distinguishes reliable scaffolding from authored meaning:

| Content | Theme provides | Merchant/reviewer must decide |
| --- | --- | --- |
| Heading | Correct element, safe blank behavior, setting label/help | Meaningful hierarchy and wording |
| Image | `alt` attribute pathway and decorative option rules | Purpose-relevant alternative text |
| Rich text | Semantic surrounding template and review route | Heading/list/link structure and clarity |
| Color | Contrast-aware defaults and visible focus baseline | Actual palette combination review |
| Video/audio | Correct container/control expectation | Captions, descriptions, transcript and media purpose |
| Link | Real link element and context slot | Clear destination/purpose text |

The editor guidance should state the decision rather than pretend automation can answer it. Record template, locale/market, content setting, reviewer, media/contrast state, exception, remediation owner, and re-test date `[VERIFY]`. No course code certifies legal conformance or silently rewrites a merchant’s business meaning.

## 5 — Keyboard pass and layered audit

`keyboard-pass.md` contains a mouse-free sequence: skip link; header/navigation; product-link and variant selection; add/cart result; drawer open, cycle, Escape/close/return; cart quantity/removal; invalid form; facets; carousel/modal where present; zoom/reflow/reduced motion. For each, capture route, fixture, initial element, key, visible focus, resulting focus, accessible feedback, fallback, owner, and disposition.

`audit-matrix.md` adds automated scanner, rendered-HTML validation, manual keyboard, screen-reader observation, zoom/touch/motion, and merchant-content review. Shopify lists Lighthouse, Accessibility Insights, WAVE, and Lighthouse CI as useful inputs, but its guidance explicitly does not guarantee complete accessibility.[1] W3C likewise frames WCAG testing as technology-neutral and supported by automated and human evaluation.[2]

A finding is a defect, content task, false positive, blocked verification, accepted risk, or known limitation only when evidence, owner, deadline, and re-test condition are recorded. Positive `tabindex`, hidden focus outlines, stale drawer references, scan-score-only acceptance, and content inference are not dispositions; they are defects or unverified design claims.

## What people get wrong here

**Adding ARIA to a `div` instead of using a button or radio.** Roles do not provide the full native keyboard, form, focus, and state contract for free.

**Putting `aria-live` around a whole rerendered cart.** It can announce a large unrelated tree and still leave focus lost. Announce the specific result and manage focus separately.

**Treating a dialog title focus as a complete modal solution.** Name, containment, Escape, close, inert background, return target, lifecycle, and failure behavior must all be defined and tested.

**Treating a scan as an audit.** Automated checks are useful regression signals, but only a task-based manual pass finds many focus, interaction, meaning, and authored-content failures.

## References

[1]: https://shopify.dev/docs/storefronts/themes/best-practices/accessibility "Shopify — Accessibility best practices for themes"
[2]: https://www.w3.org/TR/WCAG22/ "W3C — Web Content Accessibility Guidelines 2.2"
[3]: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html "W3C — Understanding Focus Order"
[4]: https://www.w3.org/WAI/ARIA/apg/ "W3C — ARIA Authoring Practices Guide"
