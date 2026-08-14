# Style plan

| File | Classification | Inclusion owner | Decision |
| --- | --- | --- | --- |
| `base.css` | Base | `layout/theme.liquid` once | Shared box sizing and minimal geometry. |
| `section-seasonal-edit.css` | Section | `sections/seasonal-edit.liquid` once | Section-root rules and local tokens. |
| `all-sections.css` | Obsolete | None | Remove after references are deleted. |

A future build may map nested sources to these same two flat final assets.
