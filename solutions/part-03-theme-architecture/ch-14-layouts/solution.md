<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-14-solution
title: "Solution — Build a minimal but correct alternate layout"
chapter: ch-14
---

# Solution — Build a minimal but correct alternate layout

The finished `minimal.liquid` is an alternate **document frame**, not a page template and not a stripped-down `theme.liquid` copied without its platform contracts. It owns one HTML document, the head injection slot, a compact persistent brand, an accessible main landmark, and the one template render slot. The campaign snippet remains inside template composition and accepts explicit content inputs only.

## 1. Keep Shopify slots singular and correctly placed

The two required placeholders have non-negotiable placement rules. `content_for_header` appears once, unmodified, in `<head>`. `content_for_layout` appears once, unmodified, inside the primary `<main>` landmark. They are not captured into variables, rendered from a snippet, put behind a section setting, or duplicated as a fallback.

```liquid
<head>
  <meta charset="utf-8">
  {{ 'layout-minimal.css' | asset_url | stylesheet_tag }}
  {{ content_for_header }}
</head>
<body class="layout-minimal">
  <a class="layout-minimal__skip-link" href="#MainContent">Skip to content</a>
  <main id="MainContent" class="layout-minimal__main" role="main" tabindex="-1">
    {{ content_for_layout }}
  </main>
</body>
```

This gives Shopify its platform head-delivery point and gives the active template one predictable location in the document. The layout does not need to know whether the active template is a product, page, collection, or an existing campaign composition. It simply frames its output.

## 2. Give the alternate frame only frame responsibilities

The alternate layout includes language metadata, one theme asset, the skip link, a compact brand link, and the main landmark. These are stable document concerns that should exist for every route deliberately assigned to the minimal frame. The brand is not a page-specific campaign component; it is the persistent identity affordance of this document shell.

The layout does **not** access a product, collection, section setting, or literal handle. It does not contain a campaign message, card loop, page title strategy tied to one resource, checkout branch, password flow, or browser interaction. If the route’s content changes, the template remains responsible for that variation while the frame continues to satisfy its document contract.

> [VERIFY] Verify current compatibility for the target template type before selecting `layout 'minimal'` in a production theme. The validity of a document frame depends on the template surface that selects it.

## 3. Keep the campaign callout a narrow snippet

The supplied `campaign-callout` snippet receives `heading` and `body` and renders a local `<aside>`. It cannot see or replace `content_for_header`, `content_for_layout`, document tags, the layout asset, or the layout’s brand. This explicit API makes it usable from a compatible template without coupling it to the surrounding document frame.

```liquid
{% render 'campaign-callout',
  heading: 'Shipping information',
  body: 'Orders leave our warehouse in two business days.'
%}
```

The template may render this snippet anywhere inside its page composition. The layout’s job is finished once it provides the document and render slot. Keeping the boundary this clear avoids a common anti-pattern: using a snippet to imitate a layout, then trying to pass Shopify’s platform placeholders through an arbitrary render call.

## 4. Load the frame asset through Shopify’s theme path

The CSS is stored in `assets/layout-minimal.css` and loaded by name through `asset_url` and `stylesheet_tag`. The file belongs to theme delivery, not a merchant Files upload and not a hard-coded external URL. This lets the layout declare the resource it owns while retaining Shopify’s asset resolution behavior.

The stylesheet handles frame-level rules: skip-link visibility, shell width, compact brand spacing, main spacing, and callout presentation. It does not need product-card or collection-grid assumptions because those are template/component concerns. A small layout asset makes the alternate frame portable across the compatible templates that select it.

## 5. Test the document contract

Test the layout with a route that has no product or collection context. Confirm that the HTML document has one head and one body; the skip link points to `MainContent`; the brand link resolves to the storefront root; and the active template renders once. Inspect source or rendered DOM to confirm exactly one head slot and exactly one layout slot. Test keyboard navigation so the skip link reaches the main landmark.

Then compare the normal and minimal frames. The minimal frame may omit normal navigation, but it must not silently lose Shopify head output or page composition. If the desired change is only a campaign panel’s spacing, retain the normal layout and change the section/template. Use an alternate layout only when the persistent document frame itself is intentionally different.

## Validation matrix

| Test | Expected result |
| --- | --- |
| Head inspection | One unmodified `content_for_header` in head. |
| Main inspection | One unmodified `content_for_layout` in `#MainContent`. |
| Route without resource Drop | Frame remains valid and renders template content once. |
| Keyboard test | Skip link moves focus to the main landmark. |
| Snippet test | Literal heading/body render without layout-context dependency. |
| Asset test | CSS uses the theme asset route. |

## Checklist

- [x] The alternative layout has one document, one platform head slot, and one template slot.
- [x] The main landmark is the skip-link target.
- [x] Persistent frame concerns remain in the layout; campaign content remains in the snippet/template.
- [x] No resource lookup, checkout, password, gift-card, or client-runtime behavior was added.
- [x] The mirror includes the layout, CSS asset, and callout snippet.

## 6. Why the frame stays minimal

A layout is shared infrastructure for the templates that select it. Every additional data access or feature branch in the frame becomes a dependency of every such route. This solution therefore limits the minimal frame to universal document concerns: language, head injection, asset delivery, a skip target, a compact brand, and the render slot. The campaign content remains below the slot, where a template can add, move, or remove it without changing the document contract.

The alternative is not to hide the campaign markup in `minimal.liquid`. Doing so would make a single marketing requirement render on every template that uses the frame and would make the layout depend on campaign copy or resource state. It also encourages later authors to add product, collection, or section-setting logic to an ostensibly generic document shell. The clear separation keeps layout review short: a reader can check global correctness without understanding page-specific content.

## 7. Review platform and accessibility behavior together

Verify the frame in a storefront preview that represents its intended template route. Confirm that platform-managed head output remains present, then inspect the page structure: one head, one body, a reachable skip link, one main landmark, and one template output region. Test a route whose content is short and a route whose content is long; neither should change the document ownership of the layout.

The skip link is intentionally visible only on keyboard focus through the frame stylesheet. Its `href` matches the unique `MainContent` ID, and the main landmark is focusable. These details are layout-level because every template rendered in the frame shares them. A template should not have to recreate navigation escape hatches or guess which main ID its surrounding document uses.

## 8. Decide whether a different frame is actually needed

Before committing an alternate layout, state the persistent frame change in one sentence: for example, “this campaign route needs a compact brand and no normal navigation.” If the sentence instead describes only a component’s visual spacing, use the standard layout and adjust the component. This decision rule preserves app and platform compatibility by avoiding unnecessary changes to global document structure.

The same discipline excludes special layout and checkout work from this exercise. A password page, gift-card page, and checkout extension have their own platform contracts. A minimal informational frame should not imitate or absorb those contexts simply because it is also a layout file.

## Implementation checklist

- [x] Head and template placeholders each occur exactly once in their documented locations.
- [x] The frame’s global elements are accessible and route-agnostic.
- [x] The explicit snippet API remains below the layout render boundary.
- [x] Theme asset delivery uses the current theme path.
- [x] Alternate-frame use is assessed as a document decision, not a cosmetic shortcut.
