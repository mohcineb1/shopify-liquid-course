# Content and search verification

| Scenario | Observed output/state | Recovery or contract |
| --- | --- | --- |
| Article with excerpt | Editorial card uses excerpt-or-content. | Article route remains canonical. |
| Article without excerpt | Content fallback is formatted. | No raw HTML injection. |
| Rich metafield | `metafield_tag` renders type-aware markup. | Blank guard remains safe. |
| Blank metafield | Callout is omitted. | No empty wrapper required. |
| Punctuation tag | Archive link is tested in target route. | Blog index is recovery. |
| Unperformed search | Prompt renders; no false zero state. | Native search form available. |
| Zero results | Performed empty state is clear. | New query route remains. |
| Mixed result types | Type branches use valid fields only. | Full search remains paginated. |
| Predictive context | Group output appears only in API/section render. | Full search link is fallback. |
