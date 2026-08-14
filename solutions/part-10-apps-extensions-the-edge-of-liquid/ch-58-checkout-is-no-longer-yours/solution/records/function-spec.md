# Restricted-item validation Function contract

## Rule

A cart containing a product in the approved restricted set must meet the approved eligibility condition before purchase can complete. Restricted products, condition, exceptions, markets, and owner are `[VERIFY]`.

## Minimal input and output

Request only cart lines, merchandise/configuration identifiers, quantities, and sanctioned context needed by the documented rule `[VERIFY]`. Do not request payment data, buyer identity, or broad address data unless approved rule/API documentation requires it. Return a localized buyer-safe validation error explaining what to change without exposing internal policy details. Exact Function API target/schema, input fields, error shape, locale behavior, configuration, plan, and availability are `[VERIFY]`.

## Fixtures

| Fixture | Expected result |
| --- | --- |
| Restricted line fails condition | One clear validation error |
| Restricted line meets condition | No error |
| Unrestricted line | No error |
| Mixed cart, quantity edge, absent configuration | Documented safe behavior; no false claim |
| Supported cart and checkout path `[VERIFY]` | Same rule semantics |

Record Function/app version, business owner, settings/metafield configuration, conflict/combination behavior, accessibility reviewer, candidate evidence, rollout, monitoring, rollback target, and release approval as `[VERIFY]`.
