<!-- STATUS: final -->
---
id: ch-12
title: "Errors, Debugging & Observability"
part: 2
words: 2500
---

# Chapter 12 — Errors, Debugging & Observability

Liquid failures rarely look like a browser stack trace. A syntax error may stop a template from rendering, a context mistake may render a controlled error surface, and a missing property may quietly produce nothing at all. Effective theme debugging therefore starts by classifying the observed behavior, making only the necessary data visible in a safe development boundary, and measuring real render work before “optimizing” a Drop relationship or snippet.

## 12.1 Liquid errors: syntax vs render vs silent nothing

A **syntax error** means Liquid cannot parse the template: a tag is malformed, a block is not closed, or an expression uses unsupported syntax. Fix the smallest parse failure first; later template behavior cannot be trusted until Liquid can compile the file. A **render error** happens after parsing when a template reaches an invalid runtime surface, such as an incompatible tag context or a resource assumption that the current page cannot satisfy. The storefront, editor, or development preview may show an error message rather than the expected component.

The third category is more common and more dangerous: **silent nothing**. Liquid commonly renders absent values as no visible output. A property can be unavailable in the current template, a relationship can be blank, a setting can be empty, or a condition can be false. None necessarily creates an error screen.

```liquid
{% if product.featured_image %}
  {{ product.featured_image | image_url: width: 320 | image_tag: alt: product.title }}
{% else %}
  <p>No product image is available.</p>
{% endif %}
```

Do not turn every blank output into a generic fallback. First decide whether absence is an allowed resource state, an incorrect context, or a failed data contract. A product without a featured image may need a local component fallback; a product Drop missing on a non-product template means the component belongs elsewhere or needs an explicit input.

**Wrong — treating silence as proof that the property is safe:**

```liquid
<p>{{ product.metafields.custom.material }}</p>
```

**Right — make the expected contract and optional state visible:**

```liquid
{% if product.metafields.custom.material != blank %}
  <div>{{ product.metafields.custom.material | metafield_tag }}</div>
{% endif %}
```

The second version does not magically validate the metafield definition. It makes the rendering boundary intentional and prevents empty wrapper markup.

## 12.2 `{{ object | json }}` and pretty-printing techniques

`json` is useful for examining a **small declared value** during development, but it is also public storefront output. Do not debug by dumping broad Drops such as `product | json`, `cart | json`, or a customer-related relation into a production page. Instead, expose the narrow fields required to diagnose the current question, inside a temporary development-only boundary.

```liquid
<pre class="debug-output">
  {{ product.title | json }}
</pre>
```

For a small object-shaped payload, line-break the static JSON structure and serialize each dynamic field:

```liquid
<pre class="debug-output">
{
  "title": {{ product.title | json }},
  "url": {{ product.url | json }}
}
</pre>
```

This “pretty-printing” technique improves human inspection without hand-escaping dynamic strings. It also forces the author to name the diagnostic contract. If you need to inspect an array, first use a bounded contextual subset, then serialize only the values you are checking. `inspect` can be useful as a temporary Liquid diagnostic, but it is not a browser-data format and should never be left in customer-facing output.

> [VERIFY] Before serializing any Drop or relationship, inspect the rendered response and verify its current JSON field surface. Cart, customer, order, metafield, and merchant-maintained values need an explicit exposure review.

## 12.3 URL debugging parameters: `?view=`, `?section_id=`, `?preview_theme_id=`, `?_fd=0`

URL parameters are a quick way to change the rendering surface you inspect without changing data or publishing a theme. `?view=` selects an alternate template view when the theme defines the relevant alternate template. `?section_id=` can request the rendered output of a section for focused inspection. `?preview_theme_id=` previews a non-live theme by ID. `?_fd=0` is commonly used in theme-debugging workflows to suppress Shopify’s frame or redirect behavior while inspecting a response directly.

These are diagnostic entry points, not feature flags. Preserve the normal path and query parameters when comparing output so you know which context changed. A preview URL can show different theme code while still reading the same store data; a section request can have a narrower context than the full page. Record the exact URL you tested in a bug report.

> [VERIFY] Confirm the current availability, authentication requirements, response context, and behavior of `view`, `section_id`, `preview_theme_id`, and `_fd` parameters in Shopify’s current theme documentation before depending on them in a team workflow.

## 12.4 Theme editor console and inspector workflows

The theme editor is both a merchant tool and a controlled development context. Use it to select the template and section that owns the failing component, change a safe setting, and observe whether the setting reaches the expected section or block path. Inspect the rendered DOM to verify that Liquid output created the intended markup before debugging CSS or JavaScript behavior.

A reliable workflow is narrow: reproduce one state; inspect the page and editor state; identify the responsible template/section/snippet boundary; make one change; repeat the exact state. Do not debug an editor setting and a storefront resource relationship in the same speculative edit. This obscures the first failed assumption.

Browser console messages are useful for client-side failures, but Liquid executes on Shopify’s rendering side before the browser receives HTML. A JavaScript console cannot reveal a server-side Liquid value that was never emitted. Use a minimal guarded debug output for the server boundary, then use the console for the client consumer of an intentional JSON payload. `ch-37-javascript-in-themes` develops that browser-side half.

## 12.5 Building a `debug.liquid` snippet with an environment guard

A reusable debug snippet should have a tiny explicit API and a guard that prevents it from emitting customer-facing diagnostics in the normal storefront. The guard can be a theme setting, a development-only template condition, or another documented environment signal your team controls. Do not assume a preview URL alone is a reliable security boundary.

```liquid
{% if settings.enable_theme_debug %}
  {% render 'debug', label: 'Product title', value: product.title %}
{% endif %}
```

The snippet should receive the value it displays, rather than reaching through the caller’s arbitrary context. That keeps its exposure surface explicit:

```liquid
{%- doc -%}
  @param {string} label - Development label.
  @param {object} value - Declared value to inspect.
{%- enddoc -%}
<pre class="debug-output">{{ label | escape }}: {{ value | json }}</pre>
```

Remove or disable the guard before production handoff, then test the production response to ensure the debug markup and data do not render. A guard is not permission to serialize sensitive Drops broadly; it is a safety rail for small, intentional diagnostics while developing.

> [VERIFY] Verify the team’s actual development/preview signal before adopting an environment guard. Shopify theme code does not provide a universal secret runtime environment flag suitable for exposing sensitive data.

## 12.6 Reading the Shopify Theme Inspector flame profile

A flame profile visualizes where a theme render spent time. Wider bars represent more time relative to the captured request; nested bars show calls or rendering work within their parent. Start from the broadest expensive region, then follow the stack inward to identify a section, snippet, loop, or relation pattern that dominates the trace.

Do not treat a single bar label as a verdict. Compare representative states: a collection with typical product count, a product with media and variants, an empty state, and a real editor configuration. A loop with bounded visible work may be acceptable; a repeated snippet or relation inside every card may dominate only on a large collection. Measure before changing structure.

The useful output of a profile is a concrete hypothesis: “this card loops six times and its nested snippet reads a relationship each time,” not “Liquid is slow.” Make one bounded change, profile the same request, and compare the shape. Preserve customer-visible behavior and resource contracts while reducing unnecessary repeated access. Drop-cost analysis from `ch-11-drops-in-depth` gives the code-review model; the flame profile gives evidence.

## Gotchas

- **Debugging silent nothing as a syntax error.** First classify parse failure, render failure, and optional/missing output.
- **Dumping a broad Drop with `json`.** Debug output is public HTML and must have a minimal contract.
- **Assuming a browser console can inspect server-only Liquid.** Emit a guarded diagnostic at the server boundary instead.
- **Relying on a URL parameter as a privacy control.** Preview and direct-response modes are workflow tools, not secret environments.
- **Optimizing from intuition.** Use a comparable Theme Inspector profile and change one access shape at a time.
- **Leaving debug snippets enabled.** Test a production response after the debugging task ends.

## Checklist

- [ ] I can classify the observed Liquid behavior before changing code.
- [ ] I inspect only the smallest data surface necessary to test the hypothesis.
- [ ] I record the URL and editor state that reproduce the issue.
- [ ] My debug snippet has explicit inputs and a team-controlled guard.
- [ ] I read flame profiles as evidence about repeated rendering work, not as generic performance labels.

## Related

- `ch-11-drops-in-depth` — relationship access shapes and public JSON contracts.
- `ch-17-sections` — section settings and editor ownership.
- `ch-21-snippets-as-apis` — explicit snippet inputs.
- `ch-37-javascript-in-themes` — browser consumers of rendered data.

[1]: https://shopify.dev/docs/storefronts/themes/tools/theme-inspector "Shopify Theme Inspector"

## A repeatable diagnostic sequence

When a component fails, reduce the problem before changing it. Start with the rendered page and determine whether the failure is syntax, a visible render error, or silent output absence. Then identify the exact request URL, template, theme preview state, editor selection, and resource state. A product without variants, an empty collection, a blank setting, and a missing context object can all look like “nothing rendered,” but they are different contracts and require different fixes.

Next, test the smallest hypothesis. If the question is whether a title reaches a section, render only the title through a guarded debug snippet. If the question is whether a metafield is blank, inspect only that typed value. If the question is whether a snippet receives its input, pass a literal test value and compare the result. Do not add an all-purpose `product | json` dump, change CSS, and alter a section setting in the same edit; the result will not establish which assumption was wrong.

After the server-side value is confirmed, inspect the HTML boundary. Check element structure, text escaping, URL attributes, and non-executing data scripts in the browser DOM. Only then move to browser console diagnostics for JavaScript that consumes already-rendered output. This order prevents client-side tools from being used to diagnose data Liquid never emitted.

## Capture comparable performance evidence

A Theme Inspector profile is only useful when its request and state are comparable. Record the route, preview theme, logged-in state if relevant, collection size, product media/variant state, and editor configuration. Capture a baseline, make one focused change, then capture the same state again. A meaningful improvement changes a measured expensive access shape without discarding buyer-visible output or shifting the work into an unmeasured client-side path.

Use profile evidence to prioritize. A small utility filter may be visually prominent in a template but consume little render time. A repeated section, nested loop, or relationship-heavy snippet may dominate the trace even when its markup is modest. Follow the stack from a wide region to its concrete template boundary, check the cardinality of the parent loop, and decide whether the work is necessary, can be bounded, or can be removed. Record the reason for the change alongside the profile comparison so later maintainers do not restore the expensive path accidentally.

## Debug output ownership

Debug output needs the same ownership discipline as production output. A section can own a local development state, while a reusable debug snippet owns only its declared label and value. The caller decides whether the guard is active and chooses the smallest value to inspect. The snippet should not reach into `product`, `cart`, or `customer` by convenience because that turns a debugging helper into an uncontrolled exposure mechanism.

Before a theme handoff, search for the guard setting, debug snippet renders, `<pre>` outputs, and temporary JSON scripts. Verify a normal storefront response contains none of the development data. Treat this as a release check rather than a cleanup preference: a diagnostic that helped one developer can become a public payload or an accidental dependency for browser code if it survives.
 This keeps diagnostic evidence specific, reproducible, and removable when the investigation is complete.
 Always.
