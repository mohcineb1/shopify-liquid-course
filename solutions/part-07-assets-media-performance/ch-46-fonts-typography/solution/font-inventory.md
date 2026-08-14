# Font inventory

| Resource | Owner/path | Variants | Fallback and locale review |
| --- | --- | --- | --- |
| Body picker | Shopify font library | Selected default only | `fallback_families`; test selected locale strings. |
| Heading picker | Shopify font library | Default plus available bold | Default face when bold is unavailable. |
| Recipe Display | Theme `assets/recipe-display-variable.woff2` | Verified weight 400–700 | Heading picker/system fallback; test title wrapping. |
