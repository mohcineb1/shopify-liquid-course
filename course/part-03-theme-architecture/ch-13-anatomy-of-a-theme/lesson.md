<!-- STATUS: final -->
---
id: ch-13
title: "Anatomy of a Theme"
part: 3
words: 2500
---

# Chapter 13 — Anatomy of a Theme

A Shopify theme is not a generic web repository whose folders can be rearranged to suit a build system. It is a platform-recognized package with named directories, special files, schema-bearing resources, and explicit ceilings. Theme architecture begins by understanding which path Shopify interprets, which filename becomes a contract, and which responsibilities must stay outside the theme runtime.

## 13.1 The directory contract: `layout/`, `templates/`, `sections/`, `blocks/`, `snippets/`, `config/`, `locales/`, `assets/`

`layout/` contains page shells such as the main theme layout. `templates/` selects the page composition for a resource or route. `sections/` holds configurable, renderable component files. `blocks/` holds reusable theme-block files. `snippets/` holds explicitly rendered partials. `config/` contains theme-level configuration surfaces. `locales/` owns translation data. `assets/` holds files resolved for storefront delivery, such as CSS, JavaScript, and static theme resources.

The directory communicates ownership. A section is not a snippet with a longer filename: it has schema and editor placement implications. A theme block is not merely a section block: its own file and filename participate in the block contract. An asset URL is not an uploaded Files URL. Place code according to Shopify’s runtime meaning rather than personal naming preference.

```liquid
{{ 'component-card.css' | asset_url | stylesheet_tag }}
{% render 'product-card', product: product %}
```

The first line resolves a theme asset. The second calls a snippet through an explicit input API. Both paths are part of the theme contract.

## 13.2 Files Shopify treats as special vs files you invent

Shopify assigns behavior to specific folders, conventional template names, schema-bearing section and block files, configuration files, and locale files. A JSON template is not arbitrary JSON; Shopify reads it as a resource layout. A section schema is not an optional comment; it determines editor settings and placement. A block filename supplies its type identity. A locale key participates in translation resolution.

By contrast, you may invent a CSS filename, a snippet name, a private helper convention, or a component class system—provided it lives in an appropriate platform directory and does not impersonate a special file. Invented names need team conventions; special files need Shopify-compatible shape.

> [VERIFY] Verify the current filename, schema, and placement rules for any special template, section, block, configuration, or locale file before creating a new architecture surface.

## 13.3 Platform limits: theme upload size, individual file size, file counts, block and section ceilings

The verified platform ledger records a **50 MB compressed** theme upload ceiling, **100,000 files** per theme, and **250 MB** of total code excluding assets. JSON templates and section-group files are limited to **512 KB**; `settings_schema.json` is **512 KB**; locale files are **1.5 MB**; and other Liquid files are **256 KB**. These are design constraints, not cleanup trivia.[1]

A JSON template can contain at most **25 sections**, while a section has at most **50 blocks** unless `max_blocks` reduces that number. A theme has at most **300 theme block files**, and theme block nesting is limited to **eight levels** beyond the section. Merchant-managed blocks have their own template or section-group ceiling. Design component boundaries before the editor becomes crowded or the repository accumulates abandoned block files.[1]

Use limits as architecture signals. A section that needs hundreds of merchant-managed items may need a different content model. A component that grows toward a Liquid file ceiling should be decomposed by responsibility, not split randomly. A block directory full of experiments is not harmless: every file counts.

## 13.4 What a theme is *not* allowed to do

A theme runs in a sandboxed render environment. It cannot make arbitrary server-side network requests, import npm packages at Liquid runtime, access a general filesystem, execute arbitrary application code, or become the authoritative engine for checkout, pricing, inventory, or customer data policy. Liquid renders the platform data Shopify supplies; browser JavaScript can enhance the delivered page but does not change the theme’s server boundary.

Do not use a theme to reimplement checkout behavior, persist private application data, invent an API integration, or bypass Shopify’s ownership of commerce and accounts. Shopify Scripts are deprecated and published scripts no longer execute; checkout customization belongs to supported extensibility surfaces rather than theme Liquid.[1]

The correct architectural response to a missing capability is to choose the right Shopify surface—theme, app, extension, function, API, or browser feature—not to hide an unsupported responsibility in a section or snippet. `ch-01-where-liquid-actually-sits` established the runtime boundary; later architecture chapters define sections, blocks, settings, and reusable APIs within it.

## Gotchas

- **Treating folders as style preferences.** Shopify reads path and file shape as runtime contracts.
- **Putting a configurable component in a snippet.** Snippets have no independent editor schema.
- **Counting only visible blocks.** Every theme block file counts toward the block-file ceiling.
- **Using assets as a general file store.** Theme assets and merchant-uploaded files have different homes and contracts.
- **Solving a platform restriction with Liquid cleverness.** A sandbox boundary is an architecture decision, not a syntax puzzle.

## Checklist

- [ ] I can name the runtime role of every top-level theme directory.
- [ ] I distinguish Shopify-special files from team-invented component names.
- [ ] I design against verified file, template, section, and block limits.
- [ ] I move responsibilities that need APIs, persistent server logic, or checkout authority outside the theme.

## Related

- `ch-01-where-liquid-actually-sits` — theme runtime boundaries.
- `ch-15-json-templates` — template composition.
- `ch-17-sections` — section schemas and editor contracts.
- `ch-18-blocks-the-three-kinds` — block architecture and limits.

[1]: ../docs/DEPRECATIONS.md

## Reading a theme as a composition graph

A useful architectural review begins at the route rather than at a familiar file. A storefront request selects a template. The template chooses sections and their order. A section may render blocks and snippets. The layout wraps the resulting page. Assets and locale data support those rendering surfaces, while configuration makes settings available to the editor. This graph is intentionally constrained: it makes the responsible file for a page region discoverable to a merchant and to a developer.

That is why copying markup between directory types is not harmless. A section copied into a snippet loses its editor schema and placement identity. A snippet copied into a section may acquire a schema but still lack a clear merchant-facing contract. A CSS file placed under `assets/` has a delivery home; the component that includes it must decide whether that delivery belongs globally, per layout, or per section. File placement is therefore an API decision for Shopify and for the next developer.

Use names that explain ownership once the directory has already explained runtime type. `sections/product-promo.liquid` says “merchant-configurable page component.” `snippets/product-price.liquid` says “explicit reusable render unit.” `assets/component-product-promo.css` says “delivered theme resource supporting a component.” Avoid names that claim a resource is universal when it only serves one template, or names that conceal a specialized editor surface behind a generic helper label.

## Special files create editor and deploy contracts

A Shopify-special file has consumers outside the Liquid renderer. The theme editor reads schemas to decide which settings to offer. Template JSON is read to determine section composition. Locale files are read to resolve translation keys. Configuration files affect theme-level settings and defaults. The deployment system validates file placement and package shape. A syntactically valid file in the wrong home can be architecturally invalid even if its contents look reasonable in an editor.

This has two implications. First, preserve the minimal required structure of a special file before adding your own conventions. Keep schema fields and template shapes aligned with documented rules. Second, make invented conventions visibly subordinate to the platform contract. A project may use a prefix for component assets or private snippets, but that prefix should not obscure where Shopify expects a section schema, block file, or locale entry.

A good test is to ask which actor needs this file: Shopify renderer, theme editor, merchant, browser, translator, deployment validator, or another theme file. If the answer is ambiguous, the responsibility probably has not been separated cleanly enough. Architecture is not a directory taxonomy exercise; it is a way of making those consumers explicit.

## Limits guide component strategy

The theme limits in `docs/DEPRECATIONS.md` should be checked before a project adopts a scaling convention. The 25-section JSON-template ceiling encourages intentional page composition instead of a template full of tiny one-purpose sections. The 50-block section ceiling encourages a section contract that groups a coherent configurable unit rather than treating every paragraph as an independently managed block. The 300 theme-block-file ceiling means experiments and abandoned block files need repository hygiene.

File-size ceilings likewise shape implementation style. A 256 KB Liquid file is ample for a focused section or snippet but is not an invitation to build a page-level application in one file. Split along stable responsibilities: page composition, merchant configuration, reusable rendering, component styles, and client behavior. Do not split one conceptual component across many files merely to make a directory visually busy; each file should make one ownership boundary easier to test and maintain.

Limits are also a reason to delete instead of merely stop referencing. An unused theme block file still counts toward the theme-block ceiling. Large legacy assets still contribute to package constraints. A private helper that became obsolete should be removed with the component that owned it. Theme architecture accumulates operational debt when the repository treats every old experiment as harmless.

## Choose the correct Shopify surface

A theme is optimized for server-rendered storefront presentation and merchant-configured content. It can render data Shopify supplies, compose sections and blocks, load theme assets, and hand small intentional payloads to browser JavaScript. It is not a persistent server application, an arbitrary webhook worker, a database layer, an unrestricted API client, or a replacement for app extensions and Shopify Functions.

When a requirement crosses that boundary, name the missing capability. Does it need protected credentials? A third-party API? Long-running processing? Checkout UI customization? Data persistence? A buyer-specific action that must be validated by server logic? The answer determines whether the next surface is an app backend, a supported extension, a Function, an API integration, or browser enhancement. It is better to record that architecture decision early than to disguise it as Liquid complexity.

The restriction protects reliability as well as security. A theme that only renders documented data remains portable across storefront requests and understandable in the editor. A theme that tries to perform application work through indirect snippets, unverified URL parameters, or hard-coded external assumptions becomes difficult to test and breaks at the platform boundary. Keep theme code focused on the rendering contract it actually owns.

## Directory review checklist

Before shipping a component, trace its files. Its section or template must be in a Shopify-recognized home. Its reusable markup must have an explicit snippet or block contract. Its assets must be delivered through the appropriate theme asset path. Its customer copy must come from a locale key where localization is required. Its settings must be declared in the correct schema owner. Its browser behavior must not be hidden in a file that the page never loads.

Then check scale: how many sections, blocks, files, and bytes does the convention add as the theme grows? A small component should not consume a new top-level architecture category or require special deployment behavior. If it does, revisit the design before copying the pattern into every template.

## Architecture decisions remain observable

A well-structured theme lets a reviewer answer ordinary operational questions without reading the entire repository. Which file owns the heading a merchant sees? Which schema controls the setting? Which template places the section? Which CSS asset is loaded for the component? Which locale key supplies customer copy? Which browser file consumes the data surface? Each answer should follow a short path through the directory contract instead of relying on hidden conventions or guesswork.

This observability also makes change safer. A merchant configuration issue should lead to a section or block schema, not a global search through snippets. A translation issue should lead to a locale key, not a hard-coded sentence in a template. A delivery issue should lead to the correct asset include and build-free theme resource, not an inferred bundler pipeline. The theme’s directories do not remove complexity, but they place complexity where Shopify, the editor, and the development team can find it.

When a component cannot be placed cleanly in this map, treat that uncertainty as an architectural signal. It may need a different Shopify surface, a clearer ownership boundary, or a verified platform contract. Do not solve the ambiguity by creating a new arbitrary top-level folder or by slipping application responsibilities into an otherwise ordinary Liquid file.
