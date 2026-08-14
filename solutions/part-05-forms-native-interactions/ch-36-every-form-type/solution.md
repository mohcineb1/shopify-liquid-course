<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 36 — Solution

## The approach

This solution starts with a non-negotiable deployment condition: the store has verified that it still uses the relevant legacy customer-account templates. Current latest customer accounts are not theme-owned, so these files are a maintenance baseline for a confirmed legacy environment, not a replacement for the current account component. Each native form remains inside its matching template/context: login/recovery/guest in login, registration in register, address new/edit in addresses, and marketing email in a standalone customer form.

One feedback snippet receives a form object and scoped key. It shows success only from returned server state and errors only from `form.errors`. Each template creates its own IDs; no password returns to markup. Country/province controls use Shopify’s country option source and a documented enhancement/configuration boundary rather than a hard-coded state list. The native no-JavaScript workflow remains usable even if optional selector enhancement is absent.

> [VERIFY] Before deployment, verify account mode, legacy-template availability, guest checkout configuration, returned account errors, address selector setup, and the planned migration to the account component in the target store.

## Walkthrough

### 1. Login, recovery, and guest flows

`customer_login` receives credentials; `recover_customer_password` is a separate recovery transaction; `guest_login` belongs in the legacy login context and represents Shopify’s guest checkout flow. These are not alternative actions of one guessed raw form. Each gets a different ID prefix and summary, so a server error is associated only with its own fields.

### 2. Registration is distinct from newsletter consent

`create_customer` creates a legacy customer account. It may use the returned state/error model, but does not restore password values. The newsletter uses `customer` with `contact[email]`; Shopify treats that flow as a customer/email-marketing signup rather than account creation. Keeping them separate makes the user’s action and merchant consent workflow honest.

### 3. Addresses have new and edit contexts

Use `customer.new_address` for a creation form and each existing `address` in its own edit form. The native form supplies endpoint/context. Country options come from `all_country_option_tags`; the province select is kept as a controlled output target rather than a static list. The actual country/province initializer is verified in the target legacy theme because the native form does not make arbitrary custom selects self-updating.

### 4. Document unavailable surfaces and migration

If latest accounts are enabled, show/use the supported account component rather than shipping these templates as active account pages. The notes record the evidence and migration ownership. Native-form code should be removed or retained only in accordance with the store’s account-mode decision, not because it happens to compile.

## Full code

### `templates/customers/login.liquid`

```liquid
<section class="account-area">
  <h1>Sign in</h1>
  {% form 'customer_login', id: 'CustomerLogin' %}
    {% render 'account-form-feedback', form: form, key: 'CustomerLogin' %}
    <label for="CustomerLogin-email">Email</label>
    <input id="CustomerLogin-email" name="customer[email]" type="email" value="{{ form.email | escape }}" autocomplete="email" required>
    <label for="CustomerLogin-password">Password</label>
    <input id="CustomerLogin-password" name="customer[password]" type="password" autocomplete="current-password" required>
    <button type="submit">Sign in</button>
  {% endform %}

  {% form 'recover_customer_password', id: 'RecoverPassword' %}
    {% render 'account-form-feedback', form: form, key: 'RecoverPassword' %}
    <label for="RecoverPassword-email">Email</label><input id="RecoverPassword-email" name="email" type="email" autocomplete="email" required>
    <button type="submit">Send recovery email</button>
  {% endform %}

  {% form 'guest_login', id: 'GuestLogin' %}<button type="submit">Continue as guest</button>{% endform %}
</section>
```

### `templates/customers/register.liquid`

```liquid
<section class="account-area">
  <h1>Create account</h1>
  {% form 'create_customer', id: 'CreateCustomer' %}
    {% render 'account-form-feedback', form: form, key: 'CreateCustomer' %}
    <label for="CreateCustomer-email">Email</label><input id="CreateCustomer-email" name="customer[email]" type="email" value="{{ form.email | escape }}" autocomplete="email" required>
    <label for="CreateCustomer-password">Password</label><input id="CreateCustomer-password" name="customer[password]" type="password" autocomplete="new-password" required>
    <button type="submit">Create account</button>
  {% endform %}
</section>
```

### `templates/customers/addresses.liquid`

```liquid
<section class="account-area"><h1>Addresses</h1>
  {% form 'customer_address', customer.new_address, id: 'AddressNew' %}
    {% render 'account-form-feedback', form: form, key: 'AddressNew' %}
    <label for="AddressCountryNew">Country</label><select id="AddressCountryNew" name="address[country]" data-default="{{ form.country }}">{{ all_country_option_tags }}</select>
    <label for="AddressProvinceNew">Province</label><select id="AddressProvinceNew" name="address[province]" data-default="{{ form.province }}"></select>
    <button type="submit">Add address</button>
  {% endform %}
  {% for address in customer.addresses %}
    {% form 'customer_address', address, id: 'Address-' | append: address.id %}
      <label for="Address-{{ address.id }}-city">City</label><input id="Address-{{ address.id }}-city" name="address[city]" value="{{ form.city | escape }}">
      <button type="submit">Save address</button>
    {% endform %}
  {% endfor %}
</section>
```

### `sections/newsletter-consent.liquid`

```liquid
<section class="newsletter-consent"><h2>{{ section.settings.heading | escape }}</h2>
  {% form 'customer', id: 'Newsletter-' | append: section.id %}
    {% render 'account-form-feedback', form: form, key: 'Newsletter-' | append: section.id %}
    <label for="NewsletterEmail-{{ section.id }}">Email</label>
    <input id="NewsletterEmail-{{ section.id }}" type="email" name="contact[email]" value="{{ form.email | escape }}" autocomplete="email" required>
    <p>{{ section.settings.consent_copy | escape }}</p><button type="submit">Subscribe</button>
  {% endform %}
</section>
{% schema %}{ "name": "Newsletter consent", "settings": [{ "type": "text", "id": "heading", "label": "Heading", "default": "Newsletter" }, { "type": "text", "id": "consent_copy", "label": "Consent copy" }] }{% endschema %}
```

### `snippets/account-form-feedback.liquid`

```liquid
{% if form.posted_successfully? %}<p class="form-success" role="status">Your request was completed.</p>{% endif %}
{% if form.errors %}<div class="form-errors" id="{{ key }}-errors" role="alert"><h2>Please correct the following</h2><ul>{% for error in form.errors %}<li>{% if error == 'form' %}{{ form.errors.messages[error] | escape }}{% else %}{{ form.errors.translated_fields[error] | escape }}: {{ form.errors.messages[error] | escape }}{% endif %}</li>{% endfor %}</ul></div>{% endif %}
```

### `assets/account-area.css`

```css
.account-area, .newsletter-consent { display: grid; gap: 1rem; max-width: 42rem; }
.account-area form, .newsletter-consent form { display: grid; gap: .5rem; }
.form-errors { border-left: .25rem solid currentColor; padding: 1rem; }
.form-success { border-left: .25rem solid currentColor; padding: 1rem; }
```

### `notes.md`

```markdown
# Account-area native form evidence

| Flow | Form/context | Native/error/no-JS observation | Account-mode decision |
| --- | --- | --- | --- |
| Login | `customer_login`, legacy login | Credentials/errors tested; password never restored. | Keep only if legacy active. |
| Recovery | `recover_customer_password`, legacy login | Returned confirmation/error tested. | Keep only if legacy active. |
| Guest checkout | `guest_login`, legacy login | Store configuration verified. | Omit when unavailable. |
| Registration | `create_customer`, legacy register | Returned errors/value tested. | Separate from newsletter. |
| New/edit address | `customer_address`, new/existing address | Country/province behavior tested. | Legacy-only template context. |
| Newsletter | `customer`, standalone section | `contact[email]` and consent workflow tested. | Theme-owned marketing surface. |
| Two instances | Scoped IDs | No cross-form labels/errors. | Required. |
| Migration | Account component decision | Legacy files retired deliberately. | Owner/date recorded. |
```

All seven starter paths are mirrored under `solution/`.

## What people get wrong here

- They deploy legacy login templates on a latest-account store. The storefront may show a theme page, but it no longer represents the supported account experience.
- They use `create_customer` for a newsletter because both take email. It changes the customer action from marketing signup to account creation.
- They hard-code provinces. Country-specific address behavior then diverges from the active market/address contract.
- They reuse one `AccountErrors` ID across login, recovery, and register forms. Error relationships cease to be reliable.

## Stretch: direction only

Map each legacy entry point to the current account-component or Shopify-owned account surface, then identify which storefront links, disclosure copy, and support routes remain theme responsibilities. Treat it as an account-mode migration plan, not a CSS port of the old templates.


A final implementation review verifies that every template appears only when its legacy account context is enabled, and that a no-JavaScript submission still carries each generated Shopify field unchanged.
