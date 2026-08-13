<!-- STATUS: draft -->
---
id: ch-02
title: "Translating What You Already Know"
part: 1
words: 2327
---

# Chapter 2 — Translating What You Already Know

The fastest way to write brittle Liquid is to treat it as React with unfamiliar delimiters. That mental substitution makes you reach for expressions, state, lifecycle, imports, and reusable components that do not exist at the theme render boundary. This chapter gives you a stricter translation: what your existing frontend instincts mean in Liquid, where they fail, and where they remain useful.

## What you'll be able to do

- Decide whether a familiar JSX or template-language pattern belongs in Liquid, browser JavaScript, or neither.
- Recognize why a server-rendered Shopify theme is not automatically an SSR application framework.
- Avoid React habits that create unmaintainable theme code.
- Choose between a section, a block, and a snippet by the responsibility it has in the storefront and the theme editor.

## 2.1 Liquid vs JSX: no expressions, no callbacks, no component state

JSX is JavaScript syntax for describing UI. Its expression positions run JavaScript; a component can close over variables, receive callbacks, retain client state, and re-render after state changes. Liquid is a **template language**: Shopify supplies a **render context**, Liquid selects and formats values from that context, and the result is HTML for this response. It does not run arbitrary JavaScript inside `{{ }}` or `{% %}`.

The visible punctuation can conceal the difference. JSX braces mean “evaluate this JavaScript expression.” Liquid output delimiters mean “output this Liquid value, optionally passed through documented filters.” Liquid tags mean “perform a documented template instruction.” Neither delimiter is a general execution escape hatch.

Here is a familiar JSX instinct. It is intentionally JSX, not Liquid:

```jsx
// ProductAvailability.jsx — JSX, not a Shopify theme file
function ProductAvailability({ product }) {
  const [label, setLabel] = useState(product.available ? 'In stock' : 'Sold out');

  return (
    <button onClick={() => setLabel('Checking availability…')}>
      {label}
    </button>
  );
}
```

The equivalent *server-rendered decision* in a product-template section is much smaller. It can decide which HTML Shopify sends, but it has no `useState`, event callback, or later re-rendering step:

```liquid
<!-- sections/product-availability.liquid — use in a product template -->
{% if product.available %}
  <p class="product-availability">In stock</p>
{% else %}
  <p class="product-availability">Sold out</p>
{% endif %}
```

> **The boundary to remember:** Liquid can choose the initial HTML from the request data. Browser JavaScript can react to a click after that HTML arrives. They are separate runtimes, not two syntaxes in one component.

An `assign` is not component state. It gives a value a name for the current Liquid render; it does not persist across requests, trigger an update, or create a value the buyer’s browser can mutate. Likewise, a Liquid output cannot accept an event handler. If interaction is part of the requirement, render a stable HTML hook with Liquid and put the browser behavior in a JavaScript asset. The request-specific model from `ch-01-where-liquid-actually-sits` still applies.

Do not replace an unavailable JavaScript expression with clever Liquid contortions. Liquid has tags, filters, comparisons, and loops, but no function literals, array methods, promise handling, or callback mechanism. If the work needs those capabilities after page delivery, it belongs on the browser side. If it needs a new commerce response outside a theme render, that is a different runtime boundary, not a longer Liquid tag.

## 2.2 Liquid vs Handlebars/Nunjucks/Twig/ISML: the closest analogues and where they mislead you

Handlebars, Nunjucks, Twig, and ISML are better first analogies than JSX because they are template systems. All teach a useful starting instinct: keep markup close to presentation logic, receive data from a host platform, and use a compact syntax for conditional output. Liquid also has output, tags, filters, and reusable partial-like files.

That shared surface is not portability. Syntax that looks plausible can still be unavailable, and a familiar construct can carry a different scope rule or platform responsibility. Shopify’s Liquid reference is the authority for the tags, filters, and objects in a theme; another engine’s reference is not a compatibility layer.[1]

The closest reusable-code analogue is a **snippet**. A snippet is a reusable Liquid file rendered with `{% render %}`. It is not a JSX component instance, a Twig macro, or a Handlebars helper. In particular, variables created by the caller are isolated from a rendered snippet unless passed as named parameters. Shopify documents that scope rule explicitly.[2]

```liquid
<!-- sections/product-teaser.liquid — use in a product template -->
<article class="product-teaser">
  <h2>{{ product.title | escape }}</h2>
  {% render 'price-line', product: product %}
</article>
```

```liquid
<!-- snippets/price-line.liquid -->
<p class="product-teaser__price">{{ product.price | money }}</p>
```

The caller supplies the `product` input deliberately. That is closer to an explicit component prop than ambient template scope, but it is still a server-side render. The snippet returns markup only; it cannot hand a callback to its caller or preserve internal state between renders.

A second trap is legacy syntax. You may encounter `{% include %}` in older themes or in material written for an earlier Liquid era. Shopify retained it but deprecated it in favor of `{% render %}`; new theme code should use `render`.[3] Do not treat an older template language feature as a reason to reproduce it in a current theme.

Finally, Shopify Liquid is not generic open-source Liquid with an arbitrary object model. Shopify supplies a commerce-specific variation with documented objects, tags, and filters.[1] Whether `product` is available depends on the render context. Whether a filter accepts a value depends on the filter’s contract. Familiar delimiters do not make Shopify data available everywhere, and `ch-03-the-shopify-object-graph` will address that object availability in detail.

## 2.3 Liquid vs SSR frameworks: no hydration story, no build step, no bundler by default

A Shopify theme is server-rendered: Liquid produces HTML before the response reaches the browser. That overlap with SSR frameworks is real, but it is not enough to import an application-framework mental model.

In a framework SSR application, server-rendered markup is often paired with a JavaScript runtime that hydrates it, restores component state, and takes responsibility for later UI updates. A theme render has no built-in hydration contract. Liquid does not serialize component state for a client framework, emit framework bundles, or reconnect an event handler after delivery. If a theme needs behavior, the theme author includes a JavaScript asset and writes that behavior directly for the browser.

```liquid
<!-- sections/shipping-note.liquid -->
<section class="shipping-note" data-shipping-note>
  <button type="button" data-shipping-note-toggle aria-expanded="false">
    Show delivery note
  </button>
  <p hidden data-shipping-note-message>
    Delivery estimates appear at checkout.
  </p>
</section>

{{ 'shipping-note.js' | asset_url | script_tag }}
```

```js
// assets/shipping-note.js
const notes = document.querySelectorAll('[data-shipping-note]');

notes.forEach((note) => {
  const toggle = note.querySelector('[data-shipping-note-toggle]');
  const message = note.querySelector('[data-shipping-note-message]');

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    message.hidden = isExpanded;
  });
});
```

Liquid owns the initial markup and asset reference. The asset owns the click. This is ordinary progressive browser behavior, not hydration; the JavaScript does not recover a Liquid component or call back into the completed theme render.

A theme also has no build step or bundler **by default**. Theme files are organized in Shopify’s prescribed directories, while CSS and JavaScript assets live in `assets/`.[4] You can choose local tooling in your development workflow, but tooling does not alter Liquid’s runtime: imports and npm packages do not become capabilities of a `.liquid` file. Treat a bundler as an optional authoring concern, never as an assumption a theme needs in order to render.

This is where people get burned: “server-rendered” does not mean “a full-stack framework that happens to use templates.” Shopify owns the request, the Liquid execution environment, and the theme file model. Your theme participates through documented files and surfaces, not through a server process you can extend at will.

## 2.4 The unlearning list: patterns that are idiomatic in React and harmful in Liquid

The following habits are sensible in React applications and produce the wrong design when carried unchanged into a Liquid theme.

| React habit | Why it harms a Liquid theme | Translation to use instead |
|---|---|---|
| Put a JavaScript expression inside markup to derive any value | Liquid delimiters do not evaluate JavaScript. | Use documented Liquid output, tags, filters, and request data; move post-delivery logic to browser JavaScript. |
| Keep UI truth in component state | A Liquid `assign` is scoped to one render and cannot trigger a re-render. | Render the request’s current truth; use browser state only for browser interaction. |
| Pass callbacks down a component tree | Liquid cannot pass or invoke functions. | Use semantic HTML and browser event listeners where interaction is required. |
| Assume a server component will hydrate | Liquid sends HTML, not a client component tree. | Add a focused asset only when the buyer needs browser behavior. |
| Import a library from a template | Theme Liquid has no module resolver or npm runtime. | Deliver any deliberately chosen browser code as an asset; keep Liquid independent of it. |
| Treat a component file as an isolated application boundary | A theme feature must also fit Shopify’s editor, schemas, and render context. | Choose a section, block, or snippet based on who configures it and where it may appear. |

The unlearning is not “write less JavaScript.” It is “assign work to the runtime that can perform it.” Liquid is good at deterministic server-side presentation from supplied commerce data. The browser is good at events and short-lived client interaction. A headless storefront owns an application runtime when the product calls for one. Trying to make one layer impersonate another is the source of most theme-level complexity.

## 2.5 Where "component thinking" *does* map: sections, blocks, snippets

Component thinking remains valuable when it means **clear responsibility, explicit inputs, reusable markup, and a small public surface**. The mapping changes because Shopify themes have a merchant-facing editor in addition to storefront markup.

| If you would build a component for… | The theme-level fit | The defining responsibility |
|---|---|---|
| A configurable page region, such as a campaign banner | **Section** | Gives merchants settings and a place to add, remove, or reorder the region. |
| A repeatable child item inside that region | **Block** | Gives merchants a managed unit of content within its parent section. |
| Repeated implementation detail, such as a heading or price line | **Snippet** | Reuses code without creating a merchant-visible editor unit. |

A section is not merely a function that returns markup. It is a `.liquid` file with schema that participates in the theme editor. A block is not merely a child component; its parent section controls the block relationship and its merchant editing affordances. A snippet is the closest code-reuse primitive, but it stays invisible to merchants and should receive the values it needs explicitly. Shopify’s theme architecture uses these same three layers: sections and blocks organize merchant-customizable content, while snippets are reusable code rendered across a theme.[4]

Here is a deliberately small section-plus-snippet pair. The section owns the editor setting and its placement; the snippet owns one reusable markup responsibility.

```liquid
<!-- sections/promotion-feature.liquid -->
{% assign heading_id = 'Promotion-' | append: section.id %}

<section class="promotion-feature" aria-labelledby="{{ heading_id }}">
  {% render 'feature-heading', heading: section.settings.heading, heading_id: heading_id %}
</section>

{% schema %}
{
  "name": "Promotion feature",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Seasonal offers"
    }
  ],
  "presets": [
    {
      "name": "Promotion feature"
    }
  ]
}
{% endschema %}
```

```liquid
<!-- snippets/feature-heading.liquid -->
{% if heading != blank %}
  <h2 id="{{ heading_id }}">{{ heading | escape }}</h2>
{% endif %}
```

The named arguments make the snippet’s dependency visible. The schema makes the section’s merchant input visible. Neither file contains state or behavior; either can be paired later with a scoped browser asset if a product requirement needs interaction.

Do not over-generalize this mapping. The detailed distinctions among section blocks, theme blocks, app blocks, placement, and schema constraints belong in `ch-17-sections-as-editor-contracts` and `ch-18-blocks-the-three-kinds`. This chapter only gives you the architectural translation needed to stop treating every reusable theme file as a React component.

## Gotchas

- **Writing JavaScript in Liquid delimiters.** `{{ }}` outputs Liquid values; it does not run methods, callbacks, or promises.
- **Calling `assign` state.** It is a value for the current server render, not a client-side state container.
- **Assuming another template engine’s syntax is Shopify Liquid.** Check the Shopify Liquid reference before using a tag, filter, or object.[1]
- **Using `{% include %}` in new code.** It is deprecated; use `{% render %}` with explicit inputs.[3]
- **Making a snippet absorb merchant configuration.** A snippet is code reuse. If a merchant must place or configure the unit, begin by considering a section or block.
- **Calling browser behavior hydration.** A hand-authored theme asset that responds to a click is browser JavaScript, not an automatic continuation of the Liquid render.

## Checklist

- [ ] I can explain why `{{ product.title }}` is template output, not the equivalent of a JSX expression slot.
- [ ] I can distinguish an initial Liquid render from browser behavior that happens after a click.
- [ ] I know that `render` gives a snippet explicit inputs and isolates caller-created variables.
- [ ] I do not expect a theme to hydrate, compile, bundle, or resolve npm imports by default.
- [ ] I can choose a section for merchant-configurable placement, a block for managed child content, and a snippet for reusable implementation detail.

## Related

- `ch-01-where-liquid-actually-sits` — the runtime boundaries behind these translations.
- `ch-03-the-shopify-object-graph` — where Liquid data exists and how to traverse it.
- `ch-17-sections-as-editor-contracts` — the schema and editor contract of a section.
- `ch-18-blocks-the-three-kinds` — the block types deliberately left out of this first translation.
- `app-a-liquid-tag-reference` and `app-b-filter-reference` — the documented Liquid surface used in a theme.

[1]: https://shopify.dev/docs/api/liquid "Shopify Liquid reference"
[2]: https://shopify.dev/docs/api/liquid/tags/render "Shopify Liquid render tag"
[3]: https://shopify.dev/docs/api/liquid/tags/include "Shopify Liquid include tag"
[4]: https://shopify.dev/docs/storefronts/themes/architecture "Shopify theme architecture"
