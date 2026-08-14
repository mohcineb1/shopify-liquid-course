# Collection query verification

| Scenario | URL/state evidence | Result or recovery |
| --- | --- | --- |
| Two facets | Both Shopify filter parameters remain present. | Grid and count match server result. |
| Sort while filtered | Active values persist with `sort_by`. | Correct sorted filtered result. |
| Price boundary | Filter-supplied param names submitted. | Values restore from filter state. |
| Remove / clear | Transition URLs remain clickable. | Query can return to collection URL. |
| Later page | Paginate link represents current result window. | Filter changes reset through Shopify URL. |
| Empty result | Active values and clear link remain visible. | Customer can recover. |
| No filters returned | Facet nav is absent. | Grid remains functional. |
| Long-value facet | Display budget tested. | No client-built value universe. |
