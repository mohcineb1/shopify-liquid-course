# Change log

| Change | Route/owner | Evidence | Buyer benefit and rollback signal |
| --- | --- | --- | --- |
| Hoist sort and cap grid | Collection/theme section | Inspector node counts before/after | Faster server/render work; rollback if merchandising needs more visible cards. |
| One responsive list | Home/theme section | DOM count and visual comparison | Less duplicate markup; rollback if layout/accessibility fails. |
| Module enhancement | Collection/theme asset | Blocked-JS link test | Parsing and links remain usable; rollback if navigation regresses. |
