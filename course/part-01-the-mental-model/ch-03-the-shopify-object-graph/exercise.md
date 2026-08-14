<!-- STATUS: final -->
# Chapter 3 — Exercise

**Time:** 45–60 minutes · **Type:** investigation and theme implementation

## Goal

Build a merchant-visible context probe that helps the Northstar Tea team inspect which Shopify objects are actually available on a product page, a collection page, and the cart page, without mistaking template context for an arbitrary data API.

## Context

Northstar Tea’s merchandising team has added several small theme features over the last quarter. Some behave correctly on product pages and quietly render blanks on collection or cart pages. The most common explanation in pull requests is “Liquid could not find the object,” which is not actionable: nobody records which template rendered the feature, which object was expected, or whether the missing value was a global object, a template-scoped object, or a value that only existed in a local scope.

The team needs a temporary diagnostic panel for a dev theme. It must let a developer confirm the current template context while demonstrating the object graph to a merchandiser who uses the theme editor. The panel is intentionally narrow: it is not a data export, an admin dashboard, or a replacement for Shopify documentation. Its job is to show enough truthful information to make the context boundary visible before the team creates another feature that assumes a product object exists everywhere.

## Requirements

- [ ] Create a merchant-addable diagnostic panel that can be placed on a product template, a collection template, and the cart template in a development theme.
- [ ] The panel visibly identifies the current template or request context using an object that is available broadly in a theme render.
- [ ] On each supported template, display a meaningful identity from the appropriate template-scoped object when it exists, such as the current product or collection.
- [ ] Make an unavailable template-scoped object visibly distinct from an available one; do not hide the distinction behind a generic empty string or invented fallback data.
- [ ] Include the current cart state as a separately labeled globally available value; do not describe it as a template-scoped resource.
- [ ] Include one locally scoped value from the panel’s own configuration and label it differently from the request and template data.
- [ ] Render a short explanation that identifies the three access classes used by the panel: global object, template-scoped object, and scoped object.
- [ ] Keep the first response self-contained: no browser fetch, no Storefront API, no app proxy, and no client framework.
- [ ] Use text output that remains safe and readable when merchant-configured text or a resource title contains punctuation or markup-like characters.

## Constraints

Do not turn the panel into a catalogue browser, dump a whole object tree, enumerate store resources, or query arbitrary product handles. Do not add browser JavaScript merely to discover what Liquid already knows during the render. Do not use an app, an external endpoint, a headless storefront, or `{% include %}`. The panel must communicate absence honestly: a missing object is evidence about context, not a condition to disguise.

Keep the diagnostic language useful for a dev theme but calm enough that a merchant can read it. Use the supplied stylesheet rather than spending the exercise on presentation changes. Avoid claiming that a displayed cart, product, or collection value has been fetched by the panel. The display should make clear that Shopify supplied the value for this request, and that the panel only renders it.

## Starter

Begin with `starter/assets/context-probe.css`. It supplies the finished presentation for a diagnostic panel but deliberately does not decide its Liquid boundary, editor-facing configuration, template placement, or object-access logic. Decide the minimal surface required to make each access class inspectable. Before implementing, plan how you will test the same panel on all three template types without copying it into three unrelated features.

## Done when

In a development theme, a merchant or developer can add the panel to product, collection, and cart templates through normal theme editing. On each page, the panel names the current context and displays the appropriate template-specific identity where Shopify supplies one. The panel also displays the globally available cart state and one merchant-controlled local value, and a reviewer can tell which visible values come from global, template-scoped, and scoped access.

A reviewer can deliberately compare the three pages and see that the panel has not invented data for an unavailable context. Viewing page source shows the diagnostic content in the initial HTML. Disabling JavaScript does not remove, change, or repair any of the findings. A title containing `&`, quotes, or angle brackets appears as text rather than as injected markup.

## Stretch

Write a short developer note, without implementing it, describing how you would investigate a value that is absent from all three supported template contexts. State the evidence you would collect from the template, the documented object graph, and the product requirement before choosing a different Shopify surface. Do not propose an arbitrary request or a broad data dump as the first response.
