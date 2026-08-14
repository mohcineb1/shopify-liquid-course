# Branch state — starter

- `main` is probably live, but nobody recorded the store, theme ID, role, or last commit.
- `release/spring` might be staging, or it might be an old campaign preview.
- `campaign/summer` is connected somewhere; the expiry and reversion target are unknown.
- A Shopify-authored commit changed `settings_data.json`. Delete it before merging because it is not developer code.
- To fix staging, copy production files over it and force-push whichever branch looks newest.
