<!-- STATUS: final -->
# Chapter 62 — Exercise

**Time:** 75–90 minutes · **Type:** template-level SEO claim and route audit

## Goal

Turn a contradictory theme SEO implementation into an auditable template contract. You will correct context-aware metadata, design minimal visible-page structured-data ownership, classify duplicate URL states, propose a narrow robots/sitemap decision, and define rendered-output evidence without making changes to a live search property or claiming rankings.

## Context

Northstar Outdoors has a global head snippet that emits the same title/description on all pages, two canonical links, hardcoded `Product` JSON-LD on collection and article pages, an invisible FAQ graph, and a `robots.txt.liquid` replacement that blocks all collections. The team believes every tag/filter URL must be “removed from Google,” an app may also emit schema, and no one has captured the current domain, Markets/locales, sitemap, app output, Search Console property, product/variant state, crawler directives, or indexing observations.

Work locally. Do not publish a theme, submit a sitemap, edit a live robots file, configure Search Console, request indexing, change a product/collection/article, activate an app, or make a ranking/indexing/rich-result promise. Treat actual route, domain, market, content, app, crawler, tool, candidate, owner, approval, release, and rollback data as `[VERIFY]`.

## Requirements

- [ ] 1. Correct the starter head into one context-aware title, optional escaped description, one `canonical_url` link, and a page-appropriate Open Graph contract. Write `metadata-inventory.md` with source, fallback, visible claim, duplicate owner, fixture, and `[VERIFY]` fields for product, collection, article, generic page, pagination, tag/filter, locale/market, and alternate-template states.
- [ ] 2. Replace the global JSON-LD with template-scoped proposal files for `Product`/`Offer`, `BreadcrumbList`, `Organization`, `Article`, and visible FAQ content. Create `claim-inventory.md` mapping every property to a current visible source, data owner, completeness rule, app/theme overlap, validation, and removal condition. Do not emit FAQ data for hidden content or promise rich-result display.
- [ ] 3. Create `url-decision-record.md` that classifies direct product, product-in-collection, tag/filter, sort, pagination, search, alternate-template, locale/market, and campaign/app URL states by buyer purpose, primary content, canonical output, robots behavior, internal-link source, sitemap presence, test, owner, and rollback.
- [ ] 4. Replace the starter robots approach with `robots-proposal.md`: default rendered output to preserve, one narrow proposed directive only if its crawler purpose is verified, crawlers/routes affected, crawl-versus-index explanation, test evidence, review date, and deletion rollback. State why a static full-file replacement is rejected.
- [ ] 5. Create `rendered-output-matrix.md` covering final head capture, visible structured-data sources, JSON/Rich Results validation, robots output, sitemap observation, app/schema collision, locale/market, product availability, blank content, pagination, filter state, and post-release monitoring `[VERIFY]`.
- [ ] 6. Keep a real starter layout, JSON-LD snippet, robots template, CSS, and route notes. Use `| json` for JSON values; do not hand-concatenate merchant/customer-controlled strings into JSON or invent availability/currency/current-variant truth.
- [ ] 7. Mark all actual search engine, store, route, configuration, SEO owner, app/schema, content, product/variant, domain, locale/market, robots, sitemap, tool, candidate, release, and rollback facts `[VERIFY]`.

## Constraints

- Canonical is a consolidation signal, not a redirect, access control, or universal noindex replacement.
- Robots crawler instructions do not guarantee de-indexing; do not block broad paths to “fix SEO.”
- JSON-LD must describe content visible on the same page and has one designated owner per object/template.
- Do not use `robots.txt.liquid` as static copied text; preserve dynamic platform behavior in any proposal.
- A validator or scanner is evidence, not a guarantee of ranking, indexing, or rich-result appearance.

## Starter

```text
starter/layout/theme.liquid               duplicate hardcoded metadata/canonical and global schema include
starter/snippets/seo-schema.liquid        product/FAQ claims on every route with hand-built JSON
starter/templates/robots.txt.liquid       static broad disallow replacement
starter/assets/seo-preview.css            preview styling that hides claim-source problems
starter/route-notes.md                    unsupported duplicate/indexing assumptions
starter/app-schema-notes.md               likely app overlap with no ownership decision
```

## Done when

| Concern | Evidence |
| --- | --- |
| Metadata | One context-aware head contract has visible source, fallback, duplicate owner, and rendered fixture evidence |
| Structured data | Each template-scoped object is visible, accurate, minimally complete, validated, and singly owned |
| URLs | Filter/tag/pagination/alternate/localized states have explicit intent and canonical/robots/sitemap decisions |
| Robots | Proposal is narrow, reversible, preserves defaults, distinguishes crawl/index, and is testable |
| Validation | Rendered head/schema/route/robots/sitemap/app collision states are captured without live-operation claims |

## Stretch

Add a product review-schema decision. Determine the current visible review source, ownership across theme/app, eligibility and moderation facts `[VERIFY]`, what a reviewer can validate, and why synthetic aggregate ratings or copied testimonials cannot be emitted as a search claim.
