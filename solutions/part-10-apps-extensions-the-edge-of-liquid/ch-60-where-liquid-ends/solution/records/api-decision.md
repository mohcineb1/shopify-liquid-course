# API decision

Use Ajax API for current-session cart read/update in this Shopify-hosted theme, with locale-aware root and Shopify response authority. Do not expose Storefront API credentials or use Ajax for customer/order data. Storefront API is evaluated only for a genuine custom storefront with documented GraphQL/auth/cache/version ownership `[VERIFY]`.
