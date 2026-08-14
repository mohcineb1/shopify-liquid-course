# Delivery and cache evidence

1. Confirm intended preview or published theme.
2. Inspect emitted `asset_url` and `file_url` output.
3. Confirm final flat asset filenames in that theme deployment.
4. Cold-load the buyer route and verify all resources.

No timestamp or manual version query is used; resolved CDN version output is diagnostic, not source data.

| Source path | Final asset name |
| --- | --- |
| `src/campaign/travel-light.css` | `campaign-travel-light.css` |
| `src/campaign/travel-light.js` | `campaign-travel-light.js` |
| `src/icons/travel-light.svg` | `campaign-travel-light.svg` |
