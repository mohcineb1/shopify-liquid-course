<!-- STATUS: final -->
---
id: ch-14
title: "Layouts"
part: 3
words: 2500
---

# Chapter 14 — Layouts

A layout is the global frame Shopify places around a rendered template. It owns document-level structure, the `<head>`, persistent shell regions, and exactly where the page’s template output enters the document. Because this frame affects every route that uses it, layouts should be sparse, stable, and faithful to Shopify’s required render slots rather than becoming an unstructured container for page-specific features.

## 14.1 `theme.liquid` — the single frame around everything

`layout/theme.liquid` is the primary storefront frame. It normally owns the document declaration, `<html>` attributes, `<head>`, global CSS and JavaScript delivery, and the persistent body shell. A product, collection, article, or other template renders **inside** this frame through the layout slot; it does not replace the frame.

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    {{ content_for_header }}
  </head>
  <body>
    {{ content_for_layout }}
  </body>
</html>
```

Keep global concerns here: document language, shared shell structure, deliberate global assets, and platform-injected header content. A layout should not contain a product-specific data decision, a collection loop, or a page-specific section setting. Those belong to templates and sections, which can be composed and configured without changing every route.

The layout is a dependency boundary. A template can assume that a normal document shell exists, while the layout can assume only that it receives a template’s rendered content at its slot. This makes route-level work and document-level work independently reviewable.

## 14.2 `content_for_header` — what Shopify injects and why you must not move it

`content_for_header` is a Shopify-provided output placeholder intended for the document `<head>`. Shopify uses it to inject required and platform-managed head content, which can include storefront scripts, app-related output, analytics-related output, and other resources the platform determines the page needs. It is not a string you should capture, relocate into the body, conditionally suppress, or duplicate.

```liquid
<head>
  <meta charset="utf-8">
  {{ content_for_header }}
  {{ 'base.css' | asset_url | stylesheet_tag }}
</head>
```

The correct question is not “which exact tags does this output today?” Its contents can vary by store, apps, editor state, and platform behavior. The contract is the placement: include it once in the head of the appropriate layout and let Shopify own its contents. Moving it to a snippet or beneath the body to improve source-file aesthetics can break app integrations, editor behavior, or document loading assumptions.

> [VERIFY] Verify any planned custom head-delivery strategy against the current Shopify layout documentation before changing the placement or count of `content_for_header`.

## 14.3 `content_for_layout` and the render slot

`content_for_layout` is the layout’s template-render slot. Shopify supplies the rendered output of the active template or page composition, and the layout places it where the document’s main content should appear. It is not a section, not a snippet call, and not a value you should wrap in arbitrary filtering logic.

```liquid
<main id="MainContent" role="main" tabindex="-1">
  {{ content_for_layout }}
</main>
```

A persistent header or footer can sit beside the main render slot, but their architecture belongs to later section-group and section chapters. Keep the slot singular and evident. Duplicating it renders page composition twice; removing it creates a document shell with no page content; moving it into a script or conditional branch makes normal route rendering unpredictable.

The semantic wrapper around the slot is a layout decision. It should support a consistent page landmark strategy and keyboard navigation without requiring every template to recreate the same main region. Templates then own the content inside that landmark.

## 14.4 Alternate layouts and the `{% layout %}` tag

A theme may contain alternate layout files for genuinely different document frames, such as a minimal landing-page shell. A template can select a layout with the `{% layout %}` tag. This is a document-level decision, not a styling shortcut for one component.

```liquid
{% layout 'minimal' %}
```

An alternate layout must still provide the platform and document contracts its template requires. If it omits the standard global shell, verify the intended route, required assets, app behavior, accessibility landmarks, and header injection. Prefer a section or template composition change when the difference is page content rather than the global document frame.

Use `{% layout none %}` only when a response genuinely requires no theme document frame, such as a narrowly defined alternate response contract. It is not a convenient way to make an AJAX endpoint or bypass normal storefront ownership. Browser behavior and data endpoints belong in their appropriate architectures.

> [VERIFY] Confirm the current supported use of alternate layouts and `layout none` for the target template type before deploying a nonstandard render frame.

## 14.5 `password.liquid` and `gift_card.liquid`

`layout/password.liquid` provides the document frame for a password-protected storefront. It is a special layout surface with its own access-state purpose, not a variation of the normal page shell. Keep its document structure, head injection, and necessary password-page output aligned with Shopify’s password storefront contract.

`layout/gift_card.liquid` provides the frame for gift card pages. It is likewise special because the page has a focused commerce and redemption context. Avoid treating it as a generic product layout or assuming normal navigation, apps, and page regions apply unchanged. The correct implementation begins from Shopify’s required structure and adds only the presentation the gift-card context needs.

Both files demonstrate a broader rule: special layout filenames carry platform meaning. A team can invent a `minimal.liquid` layout name, but it cannot invent the runtime semantics of `password.liquid` or `gift_card.liquid`. Verify special layout expectations before refactoring them into a shared abstraction.

## 14.6 Historical note: `checkout.liquid` and why checkout is no longer yours

Historically, some themes used `layout/checkout.liquid` to customize checkout pages. That surface is no longer a normal theme responsibility. `checkout.liquid` for Information, Shipping, and Payment steps became unsupported on **2024-08-13**. Customization of the Thank You and Order Status pages through `checkout.liquid` and additional scripts sunset on **2025-08-28**. Checkout customization now belongs to supported Checkout Extensibility surfaces, not Liquid layout work.[1]

This is a concrete architecture boundary. A storefront theme controls the Online Store presentation it is designed to render; it does not own Shopify’s checkout runtime. Do not restore old checkout patterns from a legacy repository, use theme layout code to imitate checkout customizations, or treat an outdated file as an integration path. Choose a supported UI extension, web pixel, or other documented checkout surface based on the actual requirement.

## Gotchas

- **Putting page-specific queries in `theme.liquid`.** A layout change affects every route using the frame.
- **Moving or duplicating `content_for_header`.** Its Shopify-owned head placement and single inclusion are contracts.
- **Using `content_for_layout` twice.** It duplicates template output rather than creating another slot.
- **Creating an alternate layout to solve a local component style issue.** Use sections or template composition when the document frame is unchanged.
- **Treating password and gift-card layouts as normal templates.** Their special filenames have platform semantics.
- **Reviving `checkout.liquid` customization.** Checkout now uses supported extensibility surfaces.

## Checklist

- [ ] `theme.liquid` owns a stable document shell and global delivery only.
- [ ] `content_for_header` appears once in the head and remains Shopify-owned.
- [ ] `content_for_layout` appears once in the primary content landmark.
- [ ] I choose an alternate layout only for a real document-frame difference.
- [ ] I treat password, gift-card, and checkout surfaces as platform-specific contracts.

## Related

- `ch-13-anatomy-of-a-theme` — directory contracts and special files.
- `ch-15-json-templates` — template-level section composition.
- `ch-16-section-groups` — persistent page regions.
- `ch-56-app-extensions` — app and checkout-adjacent extension surfaces.

[1]: ../docs/DEPRECATIONS.md

## Document-level invariants

The layout is the right place for invariants that must survive every template choice. The document language, viewport configuration, global body class strategy, skip-link target, global asset delivery, and primary landmark are layout concerns because every template rendered inside the frame benefits from the same contract. A template should not need to remember to recreate the `<main>` target or include a core stylesheet on every route.

The inverse is equally important. A layout should not decide which collection a page highlights, which product relation a card needs, or whether a section setting is configured. Those values vary by route and merchant context. Putting them in a global frame makes a local data dependency execute across unrelated pages and obscures which template actually owns the feature. The layout remains easier to change when its body is composed of durable shell regions plus the one template render slot.

A practical review asks whether a line would be correct on a product page, collection page, search page, article page, and customer page. If it only makes sense on one resource, it likely belongs below the layout boundary. If it establishes document structure or a global delivery policy, it likely belongs in the layout.

## Preserve Shopify-owned placeholders

`content_for_header` and `content_for_layout` are not ordinary variables with interchangeable placement. They are platform integration points. Their surrounding markup can be intentionally designed, but the values themselves should not be captured, transformed, filtered, serialized, or passed as snippet inputs. The platform owns what enters the head placeholder; the active template composition owns what enters the layout placeholder.

This distinction helps with app compatibility. An app may rely on Shopify’s head injection path rather than a specific theme asset list. A template may change from a Liquid template to a JSON composition while the layout still receives the resulting content through the same slot. Keeping each placeholder in its documented position preserves those independent evolutions.

When debugging a missing page or app behavior, first confirm that the relevant placeholder exists once in the correct layout. Do not duplicate it as an experiment: duplication can produce two copies of scripts, markup, or template output and create a new failure that hides the original one. Restore the single documented slot before investigating a lower-level component.

## Alternate frames require a full contract review

A minimal layout is not simply `theme.liquid` with header and footer deleted. It must still make deliberate choices about language attributes, head injection, required assets, main landmarks, focus management, and the content slot. If a landing page needs less navigation, an alternate frame can be valid. If one section needs a different background or margin, the page should retain the normal layout and change the section or template composition instead.

Before adding an alternate layout, enumerate the routes that use it and compare their operational needs with the standard frame. Does the theme editor need its normal behavior? Do installed apps rely on head output? Does the route need navigation to be reachable? Does the document still expose a main landmark? A real frame difference will survive this review; a cosmetic local preference will not.

`layout none` is even more constrained. Removing the document frame changes the response contract entirely. A consumer expecting a full HTML document, standard platform head output, or normal storefront navigation will not receive it. Use it only after verifying the documented template use case and specifying the actual consumer of the resulting response.

## Special layouts and migration discipline

Password and gift-card layouts are reminders that special file names bring special consumers. The password frame supports a storefront access state. The gift-card frame supports a redemption-oriented page. Their markup, form behavior, required content, and navigation assumptions should be checked against Shopify documentation rather than generalized from a normal product page. Refactoring should preserve the special runtime contract first and share code only where the shared behavior is truly stable.

Checkout migration requires the same discipline. A legacy theme may still contain old checkout-related code, but presence in a repository is not evidence of a supported customization surface. The verified deprecation ledger is the source of truth: retained historical files, old additional scripts, and unsupported checkout patterns should be replaced by the relevant supported extensibility architecture, not copied into a modern layout.

## Layout review checklist

Review every layout as a document contract. Confirm one `content_for_header` in the head, one `content_for_layout` in the primary content location, and no resource-specific data traversal. Verify the global CSS and JavaScript delivery path, document landmarks, special-layout behavior, and any alternate-layout route selection. Finally, inspect a normal storefront response and a preview/editor response to ensure the frame supports both the customer experience and Shopify’s platform integrations.
 A layout that makes these invariants explicit remains stable while templates, sections, apps, and route-specific content evolve beneath its documented frame.
 The result is a predictable storefront document, a coherent editor frame, and a maintainable integration boundary for the theme.
 It is deliberately singular, correctly placed, platform-aware, accessible, testable, and durable across all normal storefront routes.
 This contract remains visible to merchants, developers, apps, accessibility tools, and Shopify itself.
 Predictable, focused, and consistently documented.
 Always.
