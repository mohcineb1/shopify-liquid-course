<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 35 — Solution

## The approach

The solution lets Shopify own transport and server state. `{% form 'contact' %}` emits the native endpoint and hidden protocol fields; the theme contributes labelled visible inputs, a scoped component identity, a success state based on `form.posted_successfully?`, and an error summary based on `form.errors`. No listener prevents submission, no hand-built `action` guesses the contact contract, and no green banner appears before a confirmed server render.

The two-instance constraint drives the design. Every identity derives from `section.id`: form ID, summary ID, input IDs, labels, error anchor targets, and minimal data hook. A shared class controls presentation; an ID connects an exact accessibility relationship. Safe email/body values return after failure, but secrets are never restored or serialized into attributes.

> [VERIFY] Confirm the actual contact server validation, resulting error categories, delivery workflow, focus expectations, and native generated HTML in the development store. The Liquid implementation exposes the documented state; testing confirms the store’s concrete behavior.

## Walkthrough

### 1. Use the native contact form

The tag replaces raw HTML. Shopify generates action, method, character encoding, `form_type`, and `utf8` fields. The input names use the contact convention: `contact[email]` and `contact[body]`. The optional subject context becomes a safe hidden/visible topic value only when it is a merchant-owned section setting; it does not replace native form protocol fields.

### 2. Scope every returned state

`form.email` and `form.body` repopulate the contact fields after a server render. `form.posted_successfully?` determines success, while errors determine failure. This means a network/server outcome drives the UI rather than an unverified click. The `form-feedback` snippet receives `form` and the scoped prefix so it can create real links and IDs without duplicating an anonymous global banner.

### 3. Render translated accessible errors

The summary loops each error. A general `form` error has no control target, so it is presented as general text. Field errors use `translated_fields[error]` and `messages[error]`, both escaped. The error links point to IDs produced by the same scoped prefix as labels. A production implementation should move focus to the alert after error render through a tested progressive enhancement; its no-JS semantics are already usable because the summary occurs before controls.

### 4. Keep attributes deliberate

`id`, `class`, and minimal `data-*` attributes are passed through the tag. The data hook provides an enhancement attachment point but contains no customer message/email or fake status state. The form remains correct if nothing reads the data attribute.

## Full code

### `sections/contact-inquiry.liquid`

```liquid
{{ 'contact-inquiry.css' | asset_url | stylesheet_tag }}
{% assign form_key = 'ContactInquiry-' | append: section.id %}
<section class="contact-inquiry" id="{{ form_key }}-section">
  <h2>{{ section.settings.heading | escape }}</h2>
  {% form 'contact', id: form_key, class: 'contact-form', data-contact-form: 'true', data-section-id: section.id %}
    {% render 'form-feedback', form: form, form_key: form_key %}

    <div class="contact-form__field">
      <label for="{{ form_key }}-email">Email</label>
      <input id="{{ form_key }}-email" name="contact[email]" type="email" value="{{ form.email | escape }}" autocomplete="email" required{% if form.errors contains 'email' %} aria-invalid="true" aria-describedby="{{ form_key }}-email-error"{% endif %}>
      {% if form.errors contains 'email' %}<p id="{{ form_key }}-email-error">{{ form.errors.messages.email | escape }}</p>{% endif %}
    </div>

    <div class="contact-form__field">
      <label for="{{ form_key }}-body">Message</label>
      <textarea id="{{ form_key }}-body" name="contact[body]" required{% if form.errors contains 'body' %} aria-invalid="true" aria-describedby="{{ form_key }}-body-error"{% endif %}>{{ form.body | escape }}</textarea>
      {% if form.errors contains 'body' %}<p id="{{ form_key }}-body-error">{{ form.errors.messages.body | escape }}</p>{% endif %}
    </div>

    {% if section.settings.topic != blank %}<input type="hidden" name="contact[Topic]" value="{{ section.settings.topic | escape }}">{% endif %}
    <button type="submit">Send</button>
  {% endform %}
</section>
{% schema %}
{
  "name": "Contact inquiry",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Get in touch" },
    { "type": "text", "id": "topic", "label": "Inquiry topic" }
  ]
}
{% endschema %}
```

### `snippets/form-feedback.liquid`

```liquid
{% if form.posted_successfully? %}
  <p class="form-success" role="status">Thanks — your request was sent.</p>
{% endif %}
{% if form.errors %}
  <div class="form-errors" id="{{ form_key }}-errors" role="alert" tabindex="-1">
    <h3>There was a problem with your submission</h3>
    <ul>
      {% for error in form.errors %}
        <li>
          {% if error == 'form' %}
            {{ form.errors.messages[error] | escape }}
          {% else %}
            <a href="#{{ form_key }}-{{ error }}">{{ form.errors.translated_fields[error] | escape }}: {{ form.errors.messages[error] | escape }}</a>
          {% endif %}
        </li>
      {% endfor %}
    </ul>
  </div>
{% endif %}
```

### `assets/contact-inquiry.css`

```css
.contact-inquiry { display: grid; gap: 1rem; max-width: 42rem; }
.contact-form { display: grid; gap: .75rem; }
.contact-form__field { display: grid; gap: .35rem; }
.form-errors { border-left: .25rem solid currentColor; padding: 1rem; }
.form-success { border-left: .25rem solid currentColor; padding: 1rem; }
```

### `notes.md`

```markdown
# Native contact form verification

| Scenario | Rendered/protocol evidence | Accessibility and state observation |
| --- | --- | --- |
| Valid submission | Native tag produces form action/method plus generated `form_type` and `utf8`; `posted_successfully?` output appears only after response. | Status text is readable without color. |
| Invalid email | Returned errors and `form.email` observed. | Summary link reaches scoped email input. |
| Missing body | Returned errors and `form.body` observed. | Body receives error relation. |
| General error | `form` key has no field link. | General message remains in alert. |
| Two instances | Each `section.id` produces unique IDs. | Labels/anchors do not cross sections. |
| Keyboard/focus | Native tab/submit path tested. | Summary precedes first control; focus enhancement verified separately. |
| JavaScript disabled | Native submission succeeds/fails normally. | Correction path remains available. |
| Generated fields | Rendered HTML inspected after theme change. | Native infrastructure untouched. |
```

All four files are mirrored under `solution/` at the starter paths.

## What people get wrong here

- They manually create `/contact` and hidden fields. It may work in one snapshot but abandons Shopify’s generated form contract and form object context.
- They display success in a submit listener. A click confirms intent, not delivery/validation; only returned server state confirms the workflow.
- They use a global `ContactEmail` ID in a reusable section. Labels, error links, and assistive technology relationships become ambiguous with two instances.
- They treat every error as a field error. The `form` category is general and must not link to an invented control.

## Stretch: direction only

Use `return_to` only on a documented form type with a clearly owned route decision. The destination should be a fixed relative route or a route attribute chosen by the theme, never arbitrary visitor-provided input. Keep contact’s native confirmation behavior unless the product requirement explicitly establishes a tested alternative.


## Verification and recovery notes

The native path is the acceptance baseline. Inspect the rendered page to confirm Shopify generated the action, method, character encoding, `form_type`, and `utf8` inputs rather than relying on the Liquid source alone. Submit once with JavaScript disabled, then test invalid email and empty-message failures. In each failure state, ensure the error summary is before the first control, field links resolve to the current section’s IDs, the email/message values are retained safely, and no password or unrelated sensitive content appears.

With two section instances, submit a failing form in each instance separately. The summary in one must never link to the other’s fields. Test keyboard navigation through summary links, labels, inputs, and submit control. Record what the target store returns for any category beyond `email`, `body`, or general `form`; the solution deliberately treats server error categories as a documented, testable contract rather than hard-coding an assumed validation list.
