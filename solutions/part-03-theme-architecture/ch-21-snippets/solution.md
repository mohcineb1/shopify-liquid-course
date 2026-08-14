<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-21-solution
title: "Solution — Build a documented recursive navigation snippet"
chapter: ch-21
---

# Solution — Build a documented recursive navigation snippet

The solution replaces legacy shared-scope `include` code with a small `render` API. The section chooses a navigation menu through its setting. The snippet receives the selected links, accessible label, and current nesting level explicitly. It renders one level, stops when no links exist, and recursively renders only a link’s child collection. No ambient assignment, product object, or hidden menu lookup crosses the boundary.

## 1. Define the snippet API where it is implemented

The `{% doc %}` block describes the component’s actual contract: `links` is required; `label` and `level` are optional; the snippet returns no list for blank links; and each link must provide a title, URL, and possible child links. The documentation is useful only when it remains synchronized with implementation.

```liquid
{% doc %}
  Renders one accessible navigation list level.

  @param {linklist} links - Required links for this level.
  @param {string} label - Optional accessible navigation label.
  @param {number} level - Optional current nesting level.
{% enddoc %}
```

This is an API declaration, not a replacement for caller review. A caller can see exactly which values it must pass; a future maintainer can tell that menu selection is intentionally outside the snippet.

> [VERIFY] Confirm current `{% doc %}` tooling support and navigation-link object properties before relying on this exact documentation syntax or recursion model in production.

## 2. Guard the required input

The snippet first handles a blank `links` value. It should not emit an empty `ul` merely because a section was configured without a menu or recursion reached a leaf. The blank state is a valid no-output result for this renderer.

```liquid
{% if links == blank %}
  {% break %}
{% endif %}
```

The appropriate early-exit form depends on the supported Liquid context, but the contract remains: invalid or absent required data produces a documented empty result rather than partial navigation markup. Optional values receive local defaults; they do not cause a global fallback query.

## 3. Render one level and recurse only into children

The list renderer uses semantic nested lists. Each link creates one list item with escaped visible text. If `link.links` is nonblank, the snippet calls itself with the smaller child collection, a derived label, and an incremented level.

```liquid
<ul class="menu-links__list menu-links__list--level-{{ level | default: 1 }}" aria-label="{{ label | escape }}">
  {% for link in links %}
    <li class="menu-links__item">
      <a href="{{ link.url }}">{{ link.title | escape }}</a>
      {% if link.links != blank %}
        {% assign next_level = level | default: 1 | plus: 1 %}
        {% render 'menu-list',
          links: link.links,
          label: link.title,
          level: next_level
        %}
      {% endif %}
    </li>
  {% endfor %}
</ul>
```

The base case is structural: leaf links have no child collection, so no further call is made. The recursive API is isolated because every invocation receives a named `links` value. It does not reuse a caller-local `menu_links` assignment. The output remains valid for one or several levels, provided the source menu data is hierarchical.

## 4. Keep selection in the section

The section owns merchant configuration and menu selection. It retrieves the selected menu from its section setting, then invokes the renderer only if that menu is available.

```liquid
{{ 'section-menu-links.css' | asset_url | stylesheet_tag }}

{% if section.settings.menu != blank %}
  <nav class="menu-links" aria-label="{{ section.settings.label | escape }}">
    {% render 'menu-list',
      links: section.settings.menu.links,
      label: section.settings.label,
      level: 1
    %}
  </nav>
{% endif %}
```

The section is the merchant-configurable page region. The snippet is only the reusable renderer. A different section can call the same snippet with another menu and label. The snippet must not inspect `section.settings.menu`, because that would make its API dependent on one caller.

## 5. Scope the CSS without inventing behavior

The stylesheet can style list indentation by level and remove default list decoration. It must not hide an unrendered branch, impose an arbitrary two-level cap, or claim to implement a disclosure menu. The output is server-rendered navigation structure. Keyboard interaction, focus control, mobile toggle behavior, and expanded-state semantics require a later client behavior contract.

## 6. Validate recursion and isolation

Test a blank menu, a single link, a one-level menu, and a nested menu. Confirm leaves terminate recursion. Test a second section with another menu to prove that no caller-local assignment is required. Inspect every call for named inputs and every output for escaped title/label values. If the navigation source has a documented finite depth, verify it from current platform documentation rather than assuming the recursive component can support unlimited levels.

## Validation matrix

| Test | Expected result |
| --- | --- |
| Blank links | No empty list output. |
| One-level menu | One labeled list with escaped links. |
| Nested links | Child list rendered by a smaller recursive input. |
| Second caller | Same snippet works with different explicit links/label. |
| Legacy audit | No `include` or ambient assignment dependency remains. |
| Documentation | Required, optional, and blank behavior are visible at the snippet. |

## Checklist

- [x] `render` passes only named inputs needed for one navigation level.
- [x] The documented API guards blank links and has a terminating recursive step.
- [x] The section owns menu selection; the snippet owns only supplied-level rendering.
- [x] Nested list markup remains semantic and escaped without claiming client behavior.
- [x] The solution eliminates deprecated shared-scope `include` dependencies.

## 7. Review the renderer boundary

The completed implementation has one clear boundary: the section owns merchant configuration and selects `section.settings.menu.links`; the snippet owns only supplied-level rendering. A different caller can pass a footer menu, a utility menu, or a nested child collection without changing the snippet. This is the practical result of render isolation. No caller assignment leaks into the renderer, and no renderer query silently chooses a different menu.

Review every recursive call as if it were a new caller. It must provide the links for the next level, a suitable label, and the next level number. The recursive input is smaller because it is a child collection, so the base case is reachable. A static two-level navigation may be simpler without recursion, but a genuinely hierarchical source benefits from one well-documented renderer rather than duplicated markup for each possible depth.

## 8. Accessibility and lifecycle checks

The snippet creates navigation/list semantics only. Its links are readable without JavaScript, titles and labels are escaped, and nested lists remain within their parent list items. If later requirements add disclosure toggles, keyboard interaction, or mobile state, introduce a separate client behavior contract rather than implying it exists because nested lists render server-side.

Before migration, search for every legacy `include` caller and identify ambient values each one depended on. Convert those dependencies into named `render` inputs, test blank menus and nested menus, and delete the shared-scope assumption rather than preserving it under a new tag. The API is complete when the section, snippet documentation, and call sites all describe the same inputs and outputs.
