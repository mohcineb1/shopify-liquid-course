# Pixel migration plan

| Measurement | Chosen owner | Basis | Precondition | Retirement condition |
| --- | --- | --- | --- | --- |
| Page/product/cart/purchase | Supported app pixel `[VERIFY]` | Standard commerce mapping | Pixel active, consent/config confirmed | Same-service semantic and uniqueness comparison approved |
| `guide_opened` | Theme publisher + selected pixel | Theme observes interaction; pixel owns transport | Event contract/version approved | Subscriber evidence and no legacy queue |
| Legacy SDK | None after cutover | Theme transport is retired | Validation cases accepted | Removal approval and monitoring end |

## Sequence

1. Freeze this inventory and nominate privacy, analytics, pixel, checkout and release owners `[VERIFY]`.
2. Confirm target app/custom pixel identifier, version, standard-event mapping, purpose, candidate activation and regional settings `[VERIFY]`.
3. Ship the custom publisher with no vendor queue. Any explicitly approved standard-event overlap has a documented identity rule and short comparison window.
4. Compare the same service, same event definition, candidate fixture, route and consent state. Check payload shape and uniqueness, not aggregate counts alone.
5. Delete legacy SDK, automatic consent, direct cookie read, and authorised old placements after acceptance. Keep records rather than executable fallback code.

## Rollback

Restore the immediately prior approved pixel/configuration version, pause the new mapping, preserve sanitized evidence, and create an incident record. Do not restore automatic consent, Shopify-cookie reads, or uncontrolled dual transport. Target version and owner: `[VERIFY]`.
