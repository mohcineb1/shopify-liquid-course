# Platform facts, dates and limits

> **Fill this in first, and verify against the Shopify developer changelog before
> generating any chapter.** Every chapter quotes this file rather than restating
> platform facts from memory. Anything unverified stays marked `[VERIFY]`.

## Removed / deprecated

| Thing | Status | Date | Replacement |
|---|---|---|---|
| `{% include %}` | Deprecated | — | `{% render %}` |
| `checkout.liquid` — information / shipping / payment steps | Unsupported | 2024-08-13 | Checkout UI Extensions |
| `checkout.liquid` + additional scripts — Thank You / Order Status | Sunset | 2025-08-28 | Checkout UI Extensions |
| Script tags on Thank You / Order Status — non-Plus stores | Sunset | 2026-08-26 | Web Pixels / extensions |
| Shopify Scripts (Ruby) | Discontinued | 2026-06-30 | Shopify Functions |

## Limits

| Limit | Value | Notes |
|---|---|---|
| Sections per JSON template / section group | 25 | |
| Blocks per section | 50 | |
| Theme blocks per theme | 300 | every file in `blocks/` counts, referenced or not |
| Theme block nesting depth | 8 levels | excluding the section level |
| Theme upload size | 50 MB | |
| Individual file size | 20 MB | |

## Preview-track (teach as preview, never as stable)

| Feature | Introduced | Notes |
|---|---|---|
| `{% block %}` / `{% partial %}` Liquid tags | Liquid July '26 developer preview (2026-07-21) | page composition directly in a template; partials refresh server-rendered regions without a full reload |

## Verified on

_(date + what you checked against)_
