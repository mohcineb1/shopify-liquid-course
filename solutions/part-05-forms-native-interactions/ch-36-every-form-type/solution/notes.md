# Account-area native form evidence

| Flow | Form/context | Native/error/no-JS observation | Account-mode decision |
| --- | --- | --- | --- |
| Login | `customer_login`, legacy login | Credentials/errors tested; password never restored. | Keep only if legacy active. |
| Recovery | `recover_customer_password`, legacy login | Returned confirmation/error tested. | Keep only if legacy active. |
| Guest checkout | `guest_login`, legacy login | Store configuration verified. | Omit when unavailable. |
| Registration | `create_customer`, legacy register | Returned errors/value tested. | Separate from newsletter. |
| New/edit address | `customer_address`, new/existing address | Country/province behavior tested. | Legacy-only template context. |
| Newsletter | `customer`, standalone section | `contact[email]` and consent workflow tested. | Theme-owned marketing surface. |
| Two instances | Scoped IDs | No cross-form labels/errors. | Required. |
| Migration | Account component decision | Legacy files retired deliberately. | Owner/date recorded. |
