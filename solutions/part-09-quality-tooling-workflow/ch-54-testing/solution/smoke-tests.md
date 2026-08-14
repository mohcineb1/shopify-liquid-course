# Buyer smoke tests

| Journey | Clean fixture and assertion | Explicit boundary |
| --- | --- | --- |
| Add to cart | Reset test cart; add selected configured test variant; assert rendered cart line/count [VERIFY] | Catalog availability/variant eligibility is configured state |
| Update/remove | Change quantity or remove in test cart; assert confirmed cart output | No real buyer cart/session |
| Checkout entry | From test cart, activate supported checkout control; assert checkout entry URL/state [VERIFY] | No payment, shipping, or checkout customization claim |
| Account entry | Open supported account route with approved test account state [VERIFY] | No identity-provider/credential certification |
| Contact/newsletter form | Submit valid/invalid controlled input; assert visible native result/error | No deliverability/list-app guarantee |
