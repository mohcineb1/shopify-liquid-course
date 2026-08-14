# Lighthouse policy

Run the Shopify Lighthouse CI action against a dedicated development store with controlled performance product and collection handles [VERIFY]. Store client credentials, password, and optional status token only as protected repository secrets. Record action/version, SHA, store fixture revision, handles, theme root, reports, and run timestamps [VERIFY].

Thresholds: performance/accessibility values are owned release policy [VERIFY], not a universal score. Investigate variance with repeated controlled runs; retain failure reports and baseline history. Do not lower a threshold, rerun until green, or treat a lab score as RUM/field performance. Pair CI with Theme Check and authorised field performance review.
