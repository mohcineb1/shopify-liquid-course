# Pixel inventory

| Source/event | Purpose | Classification | Destination / consent purpose | Replacement | Duplicate risk | Cleanup state |
| --- | --- | --- | --- | --- | --- | --- |
| `layout/theme.liquid` remote SDK | Acquisition measurement `[VERIFY]` | Unknown SDK | Vendor/purpose `[VERIFY]` | Supported app pixel `[VERIFY]` | High for standard page events | Remove after accepted comparison |
| SDK page view | Page measurement `[VERIFY]` | Standard-like | Vendor/purpose `[VERIFY]` | Pixel standard event mapping `[VERIFY]` | High during overlap | Compare same service first |
| Implied commerce events | Conversion reporting `[VERIFY]` | Unknown | Checkout placement/purpose `[VERIFY]` | Observed standard mapping `[VERIFY]` | Critical purchase double count | Inspect authorised config |
| `guide:opened` queue | Guide engagement | Custom | Vendor/purpose `[VERIFY]` | `guide_opened` publisher + pixel subscription | One custom action can double fire | Legacy queue removed |
| Direct cookie read | Local gate | Unsupported | N/A | Privacy allowed-state check | Consent bypass | Removed |
| Automatic consent setter | Consent manufacture | Invalid | N/A | Approved visitor interaction | Unlawful collection risk | Removed |

All pixel identifiers, application versions, locations, policy regions, payload keys, final purpose mappings, owners, evidence URLs, and retirement approvals remain `[VERIFY]` until an authorised owner observes them.
