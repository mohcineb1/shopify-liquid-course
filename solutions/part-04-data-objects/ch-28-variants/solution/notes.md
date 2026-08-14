# Variant picker verification

| Scenario | Observed state | Server recovery / outcome |
| --- | --- | --- |
| Available selection | Price, form ID, media, quantity and plan match returned variant. | Fresh section replaces the component. |
| Unavailable variant | Selection remains visible; submit is disabled. | No fallback variant is selected. |
| Nonexistent combination | No form ID; unavailable message is rendered. | Server returns explicit null-variant state. |
| Rapid changes | Earlier request is aborted. | Most recent response owns the surface. |
| Keyboard selection | Focus returns to stable option-value control. | Live status announces update. |
| Combined-listing sibling | Product title/media/options can change together. | `product_url` fetch replaces full surface. |
