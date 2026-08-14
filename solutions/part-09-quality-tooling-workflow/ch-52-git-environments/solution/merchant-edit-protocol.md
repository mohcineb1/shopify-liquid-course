# Merchant edited production protocol

1. Pause or coordinate concurrent admin/Git edits; capture production branch SHA, candidate SHA, theme IDs/roles, integration-log events, and current preview routes [VERIFY].
2. Inspect the Shopify-authored commit and theme-editor context. Ask the merchant owner whether the edit is intentional and current [VERIFY].
3. Classify each changed setting/template as retain, backfill, migrate, or reverse. Record the decision and owner; do not select the newest file automatically.
4. Apply the approved state to an unpublished candidate, run build/static checks, and test the named home/product/collection routes in required market/account context [VERIFY].
5. Obtain candidate approval. Promote only with a prior-live rollback target; after release, capture route results and reconcile source/state follow-up work.

Use integration logs to diagnose sync events. Use reset-to-last-commit only after the owner explicitly approves discarding the current admin state and after capturing it for recovery.
