<!-- STATUS: final -->
---
id: ch-21
title: "Snippets"
part: 3
---

# Chapter 21 — Snippets

A snippet is a reusable Liquid partial with an explicit call boundary. Unlike a section or theme block, it has no merchant-facing schema, no editor placement identity, and no independent composition lifecycle. Its value is code reuse through a small input API. A well-designed snippet makes dependencies visible at the call site; a weak one relies on ambient variables, hidden assumptions, and accidental scope.

## 21.1 `{% render %}` — the isolated call

`{% render %}` invokes a snippet in isolated scope. Pass every value the snippet needs as an explicit parameter. This makes the call readable as an API invocation and prevents a snippet from silently inheriting arbitrary caller assignments.

```liquid
{% render 'price',
  product: product,
  show_compare_at: true
%}
```

The snippet receives `product` and `show_compare_at` by name. It should not assume that a caller has a particular `card_product`, `collection`, or temporary `assign` available. Isolation improves reuse: the same `price` snippet can be called from product, collection, cart, or search composition as long as the caller provides the documented input.

Use descriptive parameter names that state the snippet contract. `product`, `media`, `class`, `label`, and `content` are better than generic names such as `item` when the API has a specific domain. Avoid passing a broad object merely because it contains a needed value if a smaller explicit value expresses the dependency more clearly.

> [VERIFY] Verify current render scope and parameter semantics for any Liquid feature whose behavior depends on assignment visibility or mutation across a snippet boundary.

## 21.2 `{% include %}` — deprecated, and the exact reasons why

`{% include %}` is deprecated in Shopify themes. It shared scope with the calling template, allowing snippets to read and modify variables in ways that were difficult to see at the call site. This made dependencies implicit and increased the risk of variable collisions, accidental mutation, and components that worked only in one caller’s context.[1]

`render` replaces that model with isolation and explicit parameters. The migration is not merely a spelling change from `include` to `render`: an old snippet that relied on ambient values needs a documented parameter contract. A caller must supply values deliberately; a snippet must guard required inputs and avoid expecting private caller state.

Do not maintain both forms as compatibility style. New code should use `render`; legacy `include` should be treated as technical debt to replace after identifying every implicit dependency. The visible call becomes the source of truth for what the snippet needs.

## 21.3 Passing parameters, `with`, `for`, and aliasing

Named parameters are the clearest default:

```liquid
{% render 'badge', label: product.vendor, class: 'card__badge' %}
```

`with` renders a snippet with one object under the snippet’s expected variable name. `for` renders the snippet once for each item in a collection. Aliasing names the passed item explicitly when the snippet API needs a domain-specific input name.

```liquid
{% render 'product-card', with: product as card_product %}
{% render 'product-card', for: collection.products as card_product %}
```

Choose the form that makes the contract obvious. Named parameters are often most readable when a snippet has several controls. `with` is concise for one clearly named primary object. `for` is appropriate when the snippet represents one repeated item and the collection iteration is part of the caller’s intent. Do not use aliasing to obscure what the snippet receives; use it to avoid collisions and make repeated-item APIs consistent.

The caller owns selection and iteration scope. A `product-card` snippet renders one supplied product; it should not query `collection.products` itself. This keeps snippets testable and prevents hidden costs or context assumptions. Use a parent section or template to choose data, then pass the selected item to the reusable renderer.

## 21.4 Designing a snippet API: required params, defaults, guard clauses

Design a snippet API like a small function signature. Identify required parameters, optional parameters with defaults, valid shapes, and output guarantees. At the top of the snippet, use a guard clause when a required value is absent rather than emitting incomplete markup or relying on a later failure.

```liquid
{% if product == blank %}
  {% break %}
{% endif %}

<article class="product-card {{ class | default: '' }}">
  <h3>{{ product.title | escape }}</h3>
</article>
```

The exact guard mechanism should suit the call context, but the intent is stable: do not make an invalid input look like a valid empty component. Default optional presentation values locally and document them. Do not hide required data behind global fallback lookups such as `all_products` merely to avoid changing callers.

A good API answers: what is required; what is optional; which output state is produced for blank input; which values are escaped; and which markup responsibility belongs to the caller. A snippet that expects ten unrelated values may be a symptom that the calling component lacks its own boundary or that the snippet is trying to serve unrelated roles.

## 21.5 Recursion with `{% render %}` (menus, nested navigation)

A snippet can render itself recursively for hierarchical data such as nested navigation menus. The caller passes one level of links; the snippet renders that level and invokes itself only when a child collection exists.

```liquid
<ul>
  {% for link in links %}
    <li>
      <a href="{{ link.url }}">{{ link.title | escape }}</a>
      {% if link.links != blank %}
        {% render 'menu-list', links: link.links %}
      {% endif %}
    </li>
  {% endfor %}
</ul>
```

Recursion is appropriate when data structure is genuinely recursive. It is not an abstraction trick for a fixed two-level menu. Establish a termination condition, preserve accessible nested-list semantics, and ensure the input decreases toward leaves. Be cautious with markup, active-state rules, and performance when menus are large. The snippet’s isolation is helpful because each recursive call receives its own explicit `links` input.

> [VERIFY] Verify the current navigation link depth, fields, and storefront behavior relevant to the menu data source before relying on a particular recursion depth or property.

## 21.6 Documenting snippets with `{% doc %}` for editor autocomplete

`{% doc %}` documents a snippet’s purpose, parameters, accepted types, defaults, and output for tooling and editor autocomplete. Place the documentation with the snippet so its API travels with implementation rather than living only in a distant README.

```liquid
{% doc %}
  Renders one product card.

  @param {product} product - Required product to render.
  @param {string} class - Optional additional CSS class.
{% enddoc %}
```

Documentation should describe actual behavior, not aspirations. Record required versus optional parameters, blank-input behavior, whether provided content is already rendered HTML, and relevant markup obligations. Update the doc block when callers or defaults change. This is especially valuable for snippets shared across sections, blocks, templates, and layout regions.

> [VERIFY] Verify current `{% doc %}` syntax and editor/tooling support before depending on a specific autocomplete or validation behavior.

## 21.7 Snippet vs block vs section — the decision tree

Choose a **snippet** when the primary need is reusable Liquid rendering with explicit developer-supplied inputs. Choose a **theme block** when a merchant needs to add, configure, reorder, or nest an item within a parent’s editor contract. Choose a **section** when a merchant needs a configurable page region with its own schema and placement in a template or group.

| Need | Appropriate surface |
| --- | --- |
| Reuse a renderer with explicit inputs | Snippet |
| Merchant-managed item inside a parent | Theme block |
| Merchant-configurable page region | Section |
| Shared route/document composition | Template or section group |

Do not make a snippet into a block merely because it is reused; reuse alone does not require editor identity. Do not make a block into a snippet when merchants must select it in the editor. Do not make a section when the only need is to render one supplied value in several locations. The decision is about ownership: developer API, merchant item, or merchant region.

## Gotchas

- **Using `include` in new code.** Its shared scope is deprecated; migrate dependencies to explicit render parameters.
- **Letting snippets read caller-local variables.** Render isolation makes those assumptions brittle.
- **Passing a giant context object.** Prefer the smallest API that expresses actual dependency.
- **Making snippets select their own data.** Callers own queries, filtering, and iteration.
- **Recursive rendering without a base condition.** Ensure every call advances toward leaf data.
- **Treating docs as comments only.** `doc` is part of the snippet API surface.

## Checklist

- [ ] Every render call makes inputs visible and names them consistently.
- [ ] Required inputs, optional defaults, guards, and output behavior are documented.
- [ ] Iteration and data selection remain in callers rather than reusable renderers.
- [ ] Recursive snippets have a finite, accessible data model.
- [ ] Snippet, block, and section choices follow ownership rather than implementation convenience.

## Related

- `ch-19-theme-blocks-in-depth` — merchant-facing block composition.
- `ch-20-content-for` — parent composition and explicit wrapper APIs.
- `ch-22-liquid-and-json` — passing data safely across output boundaries.

[1]: ../docs/DEPRECATIONS.md

## Isolation is a maintenance tool

The isolation provided by `render` changes how a theme is reviewed. A caller can be inspected to see which objects cross the boundary, while a snippet can be inspected to see how it treats those objects. This local reasoning is the practical benefit of replacing `include`. With shared scope, a change to a caller assignment could alter a distant partial. With explicit parameters, a change must be made deliberately at the invocation boundary.

Isolation does not remove responsibility for object shape. A snippet receiving `product` should state whether it tolerates a blank product, whether it renders available variants, and which fields it escapes. A snippet receiving `content` should state whether the content is already rendered markup rather than text to escape. API names should make these distinctions visible. Passing `html: child_content` is different from passing `label: product.title`; their safe output handling is not interchangeable.

A small API also controls coupling. If a badge only needs a label and class, passing the entire product object encourages future hidden dependencies. If a product card genuinely needs product data, passing `product` is honest and readable. The goal is not maximum parameter minimalism; it is an interface that matches the reusable renderer’s real responsibility.

## Guard clauses and predictable output

A guard clause is a contract decision, not merely defensive code. For a missing required object, decide whether the snippet should render nothing, render a documented placeholder, or allow the caller to provide a fallback. Do not emit an empty heading, empty link, or incomplete landmark simply because a required parameter was absent. The caller and snippet should agree on the blank state.

Optional parameters need similarly predictable defaults. A default class may be empty. A display flag may default to false. A visually required heading should not quietly default to an unrelated product title unless that behavior is stated in the API. Defaults make callers shorter only when they preserve a stable component meaning.

Test APIs with valid, blank, and repeated inputs. A snippet used once in a product section may later appear in a collection grid or search result. Its output should depend on documented inputs, not on accidental location. If location itself matters, the caller should pass a named context flag or a different renderer should own the specialized role.

## Recursive navigation review

Recursive snippets are powerful because the data structure, not the code file count, determines the number of levels. But the input must progress toward a leaf. Each invocation receives `links` for one level; it renders child links only when `link.links` is not blank. The base case is the absence of children. Avoid recursion that passes the same collection unchanged or relies on a global menu object at every level.

Accessible navigation requires more than nested `ul` elements. The caller or parent component must decide its landmark label, trigger behavior for disclosure controls, current-link indicators, and mobile interaction model. The recursive snippet can preserve nested semantics and explicit link data, but it should not silently become a complete interactive-menu system without a documented API and behavior contract.

## Surface decision review

When deciding between a snippet, block, and section, begin with who needs control. A developer who needs repeatable markup and can supply all inputs needs a snippet. A merchant who needs to add, configure, or reorder one item within a parent needs a block. A merchant who needs a configurable page region needs a section. Choosing a larger editor surface merely to reuse markup creates unnecessary schemas, presets, limits, and support responsibilities. Choosing a snippet where merchant configuration is required hides a business control in code.

This decision tree also prevents duplicated output logic. A product card can be a snippet used by a block, or a section may call the snippet for a fixed render. The snippet stays the renderer; the section/block owns merchant composition. Clear ownership makes later changes—such as a new card setting or an alternate page template—less likely to leak context through unrelated files.
