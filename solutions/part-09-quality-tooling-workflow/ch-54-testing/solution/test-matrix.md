# Candidate test matrix

| Claim | Method / route-state | Fixture / evidence | Owner | Non-coverage |
| --- | --- | --- | --- | --- |
| Liquid/schema/output contract | Theme Check on deployable output | SHA, configuration, report [VERIFY] | Theme owner | Runtime/configuration/merchant outcome |
| Rendered composition | Visual baseline: named route/preset/viewport | Screenshot metadata and reviewer | Design/theme owner [VERIFY] | Keyboard, screen-reader, purchase completion |
| Lab performance | Lighthouse CI home/product/collection | Controlled store/handles, report [VERIFY] | Performance owner | Field/RUM performance |
| Add/cart transition | Browser smoke: clean test cart | Product/variant, URL, rendered cart confirmation | Theme/QA owner | Payment/shipping/fraud |
| Checkout entry | Browser smoke: cart → supported checkout action | Candidate URL/state [VERIFY] | Release owner | Checkout implementation/payment |
| Account/form entry | Browser smoke: approved test account/form | Account route or error/success result [VERIFY] | Account/content owner | Identity provider/email delivery |
| Market/catalog outcome | Route/manual check | Country/language/catalog evidence [VERIFY] | Markets/catalog owner | Theme code cannot set eligibility |
| Merchant acceptance | Candidate review | Approval record [VERIFY] | Merchant/release owner | Automated certification |
