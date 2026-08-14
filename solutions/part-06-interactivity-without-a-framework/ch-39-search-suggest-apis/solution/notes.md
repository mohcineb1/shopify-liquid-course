# Predictive search contract and evidence

| Concern | Evidence/decision |
| --- | --- |
| Locale URL/feature availability | Root URL and target buyer locale/feature checked. |
| Resource scope/limit | Product, collection, query; cap 6/all scope. |
| Section ID/result root | `predictive-search` and `#predictive-search-results` verified. |
| Empty/pending/open/error states | Empty/error closes; current valid response opens. |
| Debounce/abort/version | 250ms, abort predecessor, current version commits only. |
| 422/417/429 behavior | Close/recover native form; respect throttle guidance. |
| Keyboard/ARIA contract | Input owns active descendant; arrows/Enter/Escape/Tab tested. |
| Pointer/full submit/no-JS | Links/form/natural submit validated. |
