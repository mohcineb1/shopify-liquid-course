# Pixel sandbox notes

| Runtime | Useful boundary | Unsupported assumption | Resulting design |
| --- | --- | --- | --- |
| App pixel extension, strict worker | Shopify event subscription in isolated execution | `window.document`, DOM reading/writing, DOM scraping | Use standard events or a designed custom event |
| Custom pixel, lax iframe | Merchant-configured pixel execution | Top-frame access and storefront DOM control | Keep mapping and transport self-contained |
| Theme | Authored interaction observation | Vendor endpoint ownership or Shopify-cookie control | Publish a minimal custom event only |

The sandbox is a design constraint, not an obstacle to bypass. The pixel must consume platform event data or the explicit `guide_opened` contract. Any required vendor capability, event fields, persistence, network access, CORS behavior, or configuration is `[VERIFY]` with the vendor, pixel owner and authorised candidate.
