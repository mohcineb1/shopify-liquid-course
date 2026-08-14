<!-- STATUS: final -->
---
id: ch-35
title: "The `{% form %}` Tag"
part: 5
---

# Chapter 35 — The `{% form %}` Tag

A native Shopify form is an endpoint contract, not just a styled group of inputs. The `{% form %}` tag chooses the endpoint, method, generated hidden fields, and form-specific context that Shopify expects; a hand-written `<form action="…">` can appear correct while silently omitting the protocol that makes cart, contact, account, localization, and comment workflows reliable. Use the tag as the transport boundary, then make its success/error states accessible and its identifiers deliberate.

## What you’ll be able to do

- Select a form type and required object parameter without guessing an endpoint.
- Understand what the tag generates and why native hidden fields must survive customization.
- Use the returned `form` object for values, success, errors, and form-specific state.
- Build an accessible, translated error summary with usable field association.
- Add classes, IDs, data attributes, and safe return paths without replacing the native contract.

## 35.1 How `form` generates action, method, and hidden auth fields

`{% form %}` emits an HTML `<form>` configured for a named Shopify form type and includes required hidden inputs to submit to the matching endpoint. The exact output depends on the type. A product form accepts a product object and targets cart add; a cart form accepts `cart`; a `new_comment` form accepts `article`; customer-address forms accept a new-address object or existing address. Contact, customer signup, login/recovery, localization, password, and customer-registration forms each have their own contract. [1]

```liquid
{% form 'contact', id: 'ContactForm', class: 'contact-form' %}
  <label for="ContactEmail">Email</label>
  <input id="ContactEmail" type="email" name="contact[email]" value="{{ form.email | escape }}" autocomplete="email" required>
  <label for="ContactBody">Message</label>
  <textarea id="ContactBody" name="contact[body]">{{ form.body | escape }}</textarea>
  <button type="submit">Send message</button>
{% endform %}
```

The generated output contains a form action/method, character encoding, a `form_type` hidden input, a `utf8` hidden input, and any type-specific infrastructure. Product/cart/localization forms can have `enctype` and type-specific hidden fields. The theme owns visible fields, labels, layout, and progressive enhancement; Shopify owns the server action and protocol. Do not remove/replace the generated internals after inspecting an output sample.

The wrong pattern guesses a native endpoint and only sends visible fields:

```liquid
<!-- Incorrect: endpoint and required Shopify-generated fields are guessed. -->
<form method="post" action="/contact">
  <input type="email" name="email">
</form>
```

The correct form tag maintains Shopify’s transport contract and lets Liquid receive a `form` object after submission. This is especially important when a form type requires a resource argument, uses a specific field naming convention, or changes behavior with store configuration. [1]

Form selection is intent-specific. Use a contact form to send a merchant contact submission, not a customer form merely because both collect email. Use `create_customer` for account registration and `customer` for an email/customer-information collection without account registration. Use `localization`, not the deprecated `currency` form, for country/language currency context. [1]

> [VERIFY] Confirm the required form type, object parameter, expected visible field names, and merchant workflow in the target template/store. Form endpoint behavior and account configuration can vary by the concrete form and storefront account mode.

## 35.2 The `form` object: `errors`, `posted_successfully?`, and returned values

Inside a `{% form %}` block, `form` describes the current form submission/render state. It includes `id`, `errors`, `posted_successfully?`, and fields relevant to the type, such as contact/comment body/email, customer name/address fields, or product-recipient details. These values are not a general request-body object; only use properties documented for that form type. [2]

`form.errors` is `nil` when there are no errors. `form.posted_successfully?` is true after successful submission and false when the form has errors. One documented exception matters: `customer_address` always returns true, so an address UI needs form-type-aware testing rather than a universal success assumption. [2]

Returned values let a failed form preserve a user’s entered information. Escape values when inserting them into text inputs/textarea content and avoid repopulating credentials/secrets. The contact example above returns `form.email`/`form.body`; an address form has address properties; a new-comment form has author/body. The scope determines what can safely be restored.

```liquid
{% if form.posted_successfully? %}
  <p class="form-status" role="status">Thanks. Your message was sent.</p>
{% endif %}
{% if form.errors %}
  {%- comment -%} Render summary before the first control; see 35.3. {%- endcomment -%}
{% endif %}
```

A success message must describe a confirmed server outcome, not merely that JavaScript intercepted a click. If the UX replaces a native request with an asynchronous pattern later, it must update the same semantic states based on a real response; browser implementation is developed in `ch-37-client-side-javascript` and request behavior in `ch-38-ajax-api`.

## 35.3 Error handling, `form.errors.translated_fields`, and accessible error summaries

Errors are not a decorative red line. A user must learn that submission failed, what needs correction, and how to reach the field. `form_errors` exposes error categories such as `author`, `body`, `email`, `password`, and general `form`, plus translated `messages` and `translated_fields` keyed by each error. The `default_errors` filter is a valid rapid default, but a custom summary can connect field-specific errors to controls more precisely. [3]

```liquid
{% if form.errors %}
  <div class="form-errors" role="alert" tabindex="-1" id="ContactErrors">
    <h2>There was a problem with your submission</h2>
    <ul>
      {% for error in form.errors %}
        <li>
          {% if error == 'form' %}
            {{ form.errors.messages[error] | escape }}
          {% else %}
            <a href="#Contact{{ error | capitalize }}">
              {{ form.errors.translated_fields[error] | escape }}: {{ form.errors.messages[error] | escape }}
            </a>
          {% endif %}
        </li>
      {% endfor %}
    </ul>
  </div>
{% endif %}
```

The summary must sit early in the form and receive focus after an unsuccessful server render when the experience supports it. Each error link must match a real control ID; do not construct an anchor naming scheme that does not correspond to your fields. Add input-level context when helpful, for example `aria-describedby="ContactEmailError"`, but do not invent errors in Liquid when Shopify returned none. A general `form` error has no field anchor, so display it as general feedback.

Use translated field names/messages rather than hard-coded English labels when you are composing a localized summary. Escape messages in custom markup. Keep success and error messaging distinct: a role/status success message should not remain visible as an alert on later unrelated renders, and errors should not be hidden only by color.

> [VERIFY] Test screen-reader announcement, focus movement, translations, and all returned error categories in a development store. Exact errors depend on the form type, configuration, and server validation state.

## 35.4 Passing extra attributes, IDs, and classes

The tag accepts extra HTML attributes as parameters. `id`, `class`, and `data-` attributes are emitted on the generated `<form>`, allowing stable CSS hooks, multiple-form distinction, and progressive-enhancement attachment without reproducing the form element yourself. Shopify documents this pattern directly. [1]

```liquid
{% form 'product', product,
  id: 'ProductForm-' | append: section.id,
  class: 'product-form',
  data-section-id: section.id,
  data-product-form: 'true' %}
  <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
  <button type="submit">Add to cart</button>
{% endform %}
```

Use a unique form ID when a template can render multiple instances; combine a stable prefix with a section/block/resource identifier. A CSS class should describe presentation/component role, not a mutable business condition. Data attributes should expose a small browser contract, not serialize sensitive customer/product state or duplicate the native form protocol.

`return_to` can request a return route after supported form submission: `back`, a relative path, or a `routes` attribute. Use it for a deliberate navigation outcome and test it in the actual form flow. Do not trust a user-controlled URL parameter as a redirect destination, and do not use return paths to paper over an incorrect form type. [1]

```liquid
{% form 'customer_login', return_to: routes.root_url, id: 'CustomerLogin' %}
  <label for="CustomerEmail">Email</label>
  <input id="CustomerEmail" name="customer[email]" type="email" autocomplete="email" required>
  <label for="CustomerPassword">Password</label>
  <input id="CustomerPassword" name="customer[password]" type="password" autocomplete="current-password" required>
  <button type="submit">Sign in</button>
{% endform %}
```

The login example remains a legacy-template/native-form lesson. Customer account configuration and the current account component boundary are covered in `ch-31-customers-accounts`; do not infer that a theme should recreate Shopify-controlled latest account surfaces merely because the form tag exists.

## Gotchas

- You hand-write a form endpoint or remove generated hidden fields because a rendered sample “looks simple.”
- You use a form type that collects similarly named data but has a different business/endpoint contract.
- You read a returned `form` property that does not belong to the current form type.
- You show “success” after a click rather than after `posted_successfully?` or a confirmed response.
- You show raw errors in a color-only banner without translated names, anchors, focus, or valid IDs.
- You use duplicate IDs on repeated forms or turn `data-*` attributes into an ungoverned state dump.
- You continue to build a currency selector with the deprecated `currency` form instead of `localization`.

## Checklist

- [ ] The form tag type/argument matches the exact Shopify workflow and its native fields remain intact.
- [ ] Returned values, errors, and success state are used only in their documented form scope.
- [ ] Error summary messages are translated, escaped, reachable, and associated with real controls.
- [ ] Success, error, and unsubmitted states remain distinct and do not depend solely on client clicks.
- [ ] IDs/classes/data attributes are unique and minimal; return paths are deliberate/tested.

## Related

- `ch-31-customers-accounts` — account-surface boundaries and customer-related workflow ownership.
- `ch-30-cart-line-items` — cart input scope and commerce authority boundary.
- `ch-37-client-side-javascript` — focus, progressive enhancement, and component lifecycle.
- `ch-38-ajax-api` — request/response architecture after native form baseline is correct.

## References

[1]: https://shopify.dev/docs/api/liquid/tags/form "Shopify — Liquid tag: form"
[2]: https://shopify.dev/docs/api/liquid/objects/form "Shopify — Liquid object: form"
[3]: https://shopify.dev/docs/api/liquid/objects/form_errors "Shopify — Liquid object: form_errors"

## Native-form verification workflow

Test a form as a server interaction before adding any client enhancement. Submit valid data and record the landing route, confirmation state, preserved fields, and merchant/admin outcome. Submit each expected invalid state and confirm the response uses the same form instance, exposes an error summary before the first input, keeps non-sensitive values, and gives the keyboard a predictable starting point. Disable JavaScript entirely: the form must still submit, report errors, and deliver the expected return behavior because the form tag—not browser script—is the functional baseline.

When a page has multiple forms, IDs and summary anchors must be instance-specific. A generic `ContactEmail` ID duplicated in two sections makes labels and error links ambiguous. Use a scoped identifier such as `ContactEmail-{{ section.id }}`, then generate matching `aria-describedby`/error summary href values from the same identifier. Do not mistake a CSS class for a unique identity; classes are shared component hooks, while IDs associate controls, labels, summaries, and browser behavior.

Return values also deserve a privacy boundary. It is helpful to restore an email or contact message after validation failure, but passwords, payment data, and security-sensitive values should not be echoed into markup. The theme should only restore form properties documented for the current form type and only where the user benefits from correction. Never turn returned values into a debug log, custom data attribute, or analytics payload.

## Form contract matrix

| Concern | Theme responsibility | Shopify form contract |
| --- | --- | --- |
| Submission | Labels, controls, semantic layout, valid names | Endpoint, required hidden fields, server processing |
| Failure | Accessible summary, field association, safe restoration | Returned errors/messages/translated fields |
| Success | Confirmed clear status and follow-up route | `posted_successfully?` or configured response |
| Enhancement | Progressive behavior after native baseline works | Native submission remains recovery path |
| Identity | Unique IDs and minimal data hooks | Form type and generated form infrastructure |

This separation keeps a visual redesign from accidentally becoming a protocol rewrite. It also makes later asynchronous enhancement testable: compare its states and messages with a known-good native submission rather than inventing a second behavior model.

A final release check should inspect rendered HTML, not only Liquid source. Confirm the generated form has its intended action and method, native hidden inputs remain, each label resolves to a single control, data hooks contain no sensitive values, and no client listener prevents the fallback request without a tested response path. Repeat this after a theme update or form-component refactor because a harmless wrapper change can duplicate IDs or detach an error summary from its input.

Treat generated inputs as part of the platform boundary during code review. Compare the native tag output before and after customization, exercise keyboard-only submission, and capture at least one server validation response. This evidence is more reliable than a visually successful form because it proves the form still communicates with the intended Shopify workflow.

Record the tested form type, template context, expected endpoint outcome, validation sample, and recovery behavior in release notes. A future maintainer can then distinguish a platform contract from a cosmetic component decision.
