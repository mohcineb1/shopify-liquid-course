# Theme standard library

| Entry | Responsibility / inputs | Output boundary and consumers | Owner / deprecation policy |
| --- | --- | --- | --- |
| `icon` | Controlled theme-owned icon name | Trusted inline SVG only; callers own meaning/label | Design-system owner [VERIFY]; replace with named icon mapping |
| `visually-hidden` | Required `text` string | Escaped hidden span; callers own translation/context | Accessibility owner [VERIFY]; migrate callers before deletion |
| `product-price` | `product`, optional `show_compare_at` | Price paragraph; card and purchase panel | Product-surface owner [VERIFY]; introduce replacement before changing API |
