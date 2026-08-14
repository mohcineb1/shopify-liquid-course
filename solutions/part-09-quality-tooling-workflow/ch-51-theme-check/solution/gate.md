# Theme Check merge gate

1. Build the deployable `dist/` output from a clean checkout. Record build and tool versions [VERIFY].
2. Run Theme Check against `.theme-check.yml`; archive the report. CI fails at `error` severity.
3. Every warning has a triage row with disposition, owner, and review/removal trigger. No blanket ignore or file-wide disable is accepted.
4. Verify a named candidate route after upload: source/build output, section render, and asset delivery.
5. Verify keyboard/focus/visual behavior, relevant market/account/store data, app behavior, and merchant settings separately [VERIFY].
6. Require candidate approval, target record, and rollback owner before production promotion [VERIFY].

| Check category | Static signal | It cannot certify |
| --- | --- | --- |
| Correctness | `MissingAsset` | Remote asset/cache or merchant outcome |
| Performance | `ParserBlockingScript` | Field performance or safe dependency order |
| Deprecation | `DeprecatedTag` | Migration behavior on every route |
| Accessibility-adjacent | `UnclosedHTMLElement`, `ImgWidthAndHeight` | Keyboard order, contrast, useful alternative text |
