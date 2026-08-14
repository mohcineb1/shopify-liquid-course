<!-- STATUS: final -->
# Chapter 35 — Exercise

## Goal
Refactor a visually polished but protocol-fragile contact component into a **native Shopify contact form** with accessible server error states, preserved values, scoped IDs, and a verified no-JavaScript recovery path.

## Context
Atelier North’s contact page contains two inquiry components: “Product help” and “Wholesale.” A prior developer duplicated a raw HTML `<form action="/contact">` in each section, sent generic input names, shows a green success banner immediately on click, and has a global red error box that is not connected to a control. The merchant reports that submissions sometimes arrive without context, invalid email feedback is confusing, and a page with both sections has duplicated `ContactEmail` and `ContactErrors` IDs.

Use Shopify’s native `contact` form contract. The editor needs a per-section heading and inquiry subject label, but the endpoint/protocol belongs to Shopify. The form must produce an accessible response after a real server render. A user with JavaScript disabled must be able to submit, correct an invalid address, retain their message, and understand whether the contact request succeeded.

Plan **45–60 minutes**. Test valid submission, blank/invalid email, blank body, a generic server error if available, keyboard navigation, page with two section instances, and JavaScript disabled. Inspect rendered HTML to confirm the native generated action/method/hidden fields survive your implementation.

## Requirements

- [ ] Replace the raw HTML form with `{% form 'contact' %}` and retain Shopify-generated form infrastructure. Do not manually recreate its action or hidden fields.
- [ ] Give every visible control the documented contact naming contract, an explicit label, a unique scoped ID, and useful autocomplete where applicable.
- [ ] Show a success message only when `form.posted_successfully?` is true after submission. Explain why a click handler is not sufficient confirmation.
- [ ] On `form.errors`, render an early accessible summary that uses `form.errors.translated_fields` and `form.errors.messages`, treats `form` errors as general feedback, and links field errors to actual scoped controls.
- [ ] Preserve safe returned contact values after invalid submission while never restoring secrets or emitting user content into data attributes/debug output.
- [ ] Pass an ID, class, and a minimal `data-*` hook through the form tag. Use one form instance’s identifier consistently in labels, summaries, input descriptions, and possible future enhancement hooks.
- [ ] Record valid/invalid/no-JavaScript/duplicate-instance/accessibility test evidence in `notes.md`, including observed action/method/hidden fields and any target-store-specific uncertainty.

> [VERIFY] Confirm the target store’s actual contact validation/output, translated error categories, contact delivery workflow, generated native fields, and focus behavior after server errors. Test these in the real development environment before release.

## Constraints

Do not hand-code `/contact`, `form_type`, or `utf8` fields. Do not use JavaScript to suppress the native submit. Do not announce success before a confirmed server state. Do not use a duplicate static ID in two section instances. Do not rely on color alone for error or success. Keep this exercise in the starter paths and do not extend into asynchronous requests, spam mitigation systems, or account registration.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/contact-inquiry.liquid` | Raw duplicated/unsafe contact markup and unscoped IDs. |
| `starter/snippets/form-feedback.liquid` | Decorative feedback that does not consume `form` state. |
| `starter/assets/contact-inquiry.css` | Finished visual styles for success, errors, and fields. |
| `starter/notes.md` | Server-state, accessibility, rendered-protocol, and no-JS test record. |

The starter’s visual result is acceptable; its submission contract and response semantics are not. Preserve the component’s visual structure where it does not conflict with native form behavior.

## Done when

Both inquiry sections can render on one page with independent, valid associations. A native submission retains Shopify’s generated infrastructure. Valid and invalid server responses are semantically distinct; error links lead to the exact control; safely entered contact values reappear after failure; and the no-JavaScript path is operational.

## Stretch

Add a `return_to` decision for a form type where a deliberate post-submit route is appropriate. Explain why redirect handling belongs to the documented form contract and why the contact component should not accept an arbitrary user-provided URL. Do not implement an asynchronous replacement.
