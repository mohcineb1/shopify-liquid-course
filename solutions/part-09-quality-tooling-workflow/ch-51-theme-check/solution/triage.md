# Finding triage

| Finding | Disposition | Evidence / owner | Review or removal trigger |
| --- | --- | --- | --- |
| `MissingAsset` for `missing-release.css` | Fix | Reference removed; code owner | Every release check |
| `ParserBlockingScript` | Fix | Deferred script plus route-order test [VERIFY] | App/loader dependency change |
| `UnusedAssign` `campaign_trace` | Scoped suppress | Integration owner [VERIFY] | Remove when integration no longer consumes it |
| Generated icon fixture | Configure | Build owner [VERIFY]; narrow ignored pattern | Generated-file pipeline change |
| `ApprovedSectionInventory` | Defer/promote | Passing/failing fixtures and team owner [VERIFY] | Promote after false-positive review |
| `DeprecatedTag` | Escalate | Platform migration owner [VERIFY] | Current deprecation ledger/release plan |
| `ImgWidthAndHeight` | Escalate | Rendered media and accessibility owner [VERIFY] | Responsive media contract review |
