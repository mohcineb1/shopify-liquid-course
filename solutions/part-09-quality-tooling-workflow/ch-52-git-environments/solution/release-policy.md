# Live storefront branch policy

Feature branches obtain isolated unpublished previews and merge only after review. `release/spring` holds deployable candidate output and is connected to an unpublished review theme. `main` represents the controlled production relationship; its connected published theme receives only approved releases, merchant reconciliations, and rollback commits. `campaign/summer` is temporary and has an expiry plus named `main` reversion candidate.

If a build pipeline exists, source branches may contain source/tools, while the connected deploy branch contains only the default Shopify theme structure. Each deploy commit records the source SHA and build/check evidence. Do not connect a branch containing unrelated `src/` and `dist/` directories as though Shopify can choose the runtime tree.
