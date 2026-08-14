<!-- STATUS: final -->
# Chapter 50 — Exercise

**Time:** 60–80 minutes · **Type:** operational release rehearsal

## Goal

Turn a risky collection of copied CLI commands into a reviewable theme-delivery workflow. You will configure named environments, identify a remote target before mutation, use a development theme for live feedback, create a durable unpublished candidate, and write evidence for a promotion or rollback decision. The deliverable is an operational plan and safe project configuration, not a command that publishes a theme.

## Context

Northstar Outdoors has one theme repository and three remote surfaces: a development store, a client review store/theme, and the live client store. A previous developer pasted a production store into their shell, ran a broad push after a local build, then sent a generic storefront URL to the merchant. The change was not published, but nobody can now identify the remote preview candidate or whether `config/settings_data.json` contained merchant edits.

The current repository has no environment file, a permissive ignore list, and a release note that lacks a target ID, route evidence, owner, or rollback candidate. Marketing wants a banner adjustment reviewed on a real product and collection route. The merchant wants a stable preview link after the developer logs out. You must make the workflow inspectable without embedding credentials or production publication in the starter.

## Requirements

- [ ] 1. Add `shopify.theme.toml` with named `development`, `staging`, and `production` environments. Use obviously fictitious store names and theme IDs; do not add passwords, tokens, `force`, or a production default environment.
- [ ] 2. Write `commands.md` with the exact **sequence** for `theme list`, `theme info`, `theme dev`, `theme pull`, `theme push`, `theme publish`, and `theme package`. For each, state source, target, allowed purpose, confirmation/evidence, and unsafe use.
- [ ] 3. Configure `theme dev` for the development environment and explain the hot-reload test boundary: CSS/section iteration versus full-page, checkout, build, data, and configuration verification.
- [ ] 4. Create an unpublished staging candidate workflow that yields a durable preview link. Do not treat the temporary development theme or generic live-store URL as the approval artifact.
- [ ] 5. In `release-record.md`, require store URL, remote theme ID/role, Git SHA, CLI/build version, operator, approver, candidate preview URL, named routes, market/account context, and tested outcome.
- [ ] 6. Define a code-versus-merchant-state rule for `config/settings_data.json`, JSON templates, and a section file. A pull/push must not be used to silently settle an editor conflict.
- [ ] 7. Add a rollback plan naming the prior verified candidate, the evidence that triggers rollback, who authorises it, and the command category used. Do not invent a live theme ID.
- [ ] 8. Add `.shopifyignore` patterns that exclude local notes/build input without excluding required deployable theme output. Explain each pattern in `commands.md`.
- [ ] 9. Mark any store permission, theme ID, market/account test data, merchant approval, or client policy fact that you cannot prove locally as `[VERIFY]`.

## Constraints

- Do not run `theme publish`, use `--force`, `--allow-live`, or place production credentials in a repository file.
- Do not rely on names alone to identify a remote theme; record IDs and roles after `theme list`/`theme info`.
- Do not claim hot reload validates checkout, app configuration, build output, customer data, Markets, or inventory.
- Do not replace merchant configuration to make a source tree look clean.
- Keep the starter’s `assets/`, `config/`, `layout/`, `sections/`, and `templates/` output visible to the CLI.

## Starter

```text
starter/shopify.theme.toml    unsafe default production target and a committed secret placeholder
starter/.shopifyignore        ignores deployable output too broadly
starter/release-record.md     untraceable “deployed” note with no candidate or rollback evidence
```

Copy the starter root files into a disposable theme-output directory. Before changing them, run only non-mutating inspection commands against a store you are authorised to inspect. Record the resulting store/theme IDs in your private evidence note, not in this course repository.

## Done when

| Check | Evidence |
| --- | --- |
| Environment selection | TOML has three named contexts, no secret, and no production default |
| Target identity | `commands.md` requires `list`/`info`, a remote ID, role, and store before mutation |
| Local feedback | Development-theme command and hot-reload limits are documented by route |
| Review candidate | An unpublished remote candidate and its preview link are distinct from a dev theme |
| Merchant safety | State ownership, approval, and rollback are explicit in the release record |
| Packaging | Package command applies to the reviewed release commit, not a dirty working tree |

## Stretch

Design a CI job that packages the checked release commit and pushes only to a named staging environment. Do not add real credentials or auto-publish behavior. In `commands.md`, identify which values belong in protected CI secrets, which are reviewable environment metadata, and which remaining human approval cannot responsibly be automated.

## Verification protocol

Use a controlled development store or approved client test surface. Capture `theme list` and `theme info` output before any mutation, then test the banner’s product and collection routes on the development theme. Create the staging candidate only after a clean Git/build state and code review; capture its theme ID and preview URL. Test it with the required market/account context and record the result. A failed test must be classified as source build, theme target, merchant configuration, store data, app, route, or approval evidence before anyone proposes a broad pull/push workaround.
