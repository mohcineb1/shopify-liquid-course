# Shopify CLI — command reference

Every command and flag below was read from the CLI actually installed in this repo,
not from memory.

```
@shopify/cli/4.7.1   node v25.9.0
```

Check your own with `shopify version`. Flags move between major versions — when this
file and `shopify <command> --help` disagree, the CLI is right.

> **Node requirement.** CLI 4.x needs **Node ≥ 22.12**. On Node 18 it fails at startup
> with `enableCompileCache`, and the 3.9x line fails on a Node 20+ regex feature. If you
> hit either, upgrade Node rather than downgrading the CLI.

---

## Install and update

```bash
npm install -g @shopify/cli@latest    # install
shopify version                       # confirm
shopify upgrade                       # update in place
```

Using nvm? Global npm packages are **per Node version**. Switch Node and `shopify`
disappears until you install it again under the new version.

---

## Sign in

```bash
shopify auth login       # opens a browser; needed before any store command
shopify auth logout
```

`login` requires an interactive browser. It cannot be completed from a script or a
non-interactive shell.

---

## The daily loop

Three commands cover most theme work.

```bash
# 1. Start a local dev server against your store, with live reload
shopify theme dev --path playground/dawn --store your-store.myshopify.com

# 2. Send local files up to a theme
shopify theme push --path playground/dawn

# 3. Bring remote files down (merchant edits happen in the editor, not your editor)
shopify theme pull --path playground/dawn
```

`theme dev` uploads your work as a **development theme** — a hidden, temporary theme —
and prints editor and preview URLs. It is the safe place to work. Nothing you do there
touches the live storefront.

---

## All theme commands

| Command | What it does |
|---|---|
| `theme init` | Clone a Git repo as a starting point for a new theme |
| `theme dev` | Upload as a development theme and sync changes live |
| `theme push` | Upload local files to a remote theme |
| `theme pull` | Download remote theme files locally |
| `theme check` | Validate the theme (runs locally, no auth needed) |
| `theme console` | Liquid REPL — evaluate Liquid against a real store |
| `theme profile` | Profile Liquid rendering of a page |
| `theme list` | List store themes with IDs and statuses |
| `theme info` | Show theme environment info and current store |
| `theme open` | Open the remote theme preview |
| `theme preview` | Apply JSON overrides and return a preview URL |
| `theme share` | Create a shareable unpublished theme with a random name |
| `theme duplicate` | Duplicate a theme in your library |
| `theme rename` | Rename an existing theme |
| `theme package` | Package the theme into a `.zip` for Online Store upload |
| `theme publish` | Make a remote theme the **live** theme |
| `theme delete` | Delete remote themes — **cannot be undone** |
| `theme metafields pull` | Download metafield definitions to a local file |
| `theme language-server` | Start the LSP server (editors use this) |

---

## Flags worth knowing

Shared by `dev`, `push` and `pull`:

| Flag | Meaning |
|---|---|
| `--path=<dir>` | Which directory to act on. Essential here — your theme is in `playground/dawn`, not the repo root |
| `-s, --store=<value>` | Target store, e.g. `your-store.myshopify.com` |
| `-t, --theme=<value>` | Target a theme by ID or name |
| `-e, --environment=<value>` | Use a named environment from `shopify.theme.toml` |
| `-o, --only=<pattern>` | Restrict to matching files |
| `-x, --ignore=<pattern>` | Skip matching files (`dev`, `pull`) |
| `-n, --nodelete` | Never delete files on the other side |
| `-d, --development` | Act on your development theme |
| `-l, --live` | Act on the **live** theme |
| `-a, --allow-live` | Required confirmation before touching the live theme |

`theme dev` also has:

| Flag | Meaning |
|---|---|
| `--live-reload=<mode>` | Control hot reload behaviour |
| `--error-overlay=<default\|silent>` | Show or suppress the in-browser error overlay |
| `--host=<value>` / `--port=<value>` | Bind the local server differently |
| `--theme-editor-sync=<keep-local\|keep-remote\|abort>` | Decide who wins when a merchant edits the theme in the editor while you are working |

`theme push` also has:

| Flag | Meaning |
|---|---|
| `-p, --publish` | Publish the theme after pushing |
| `-j, --json` | Machine-readable output |
| `-c, --development-context=<value>` | Select the development context |

`theme init`:

| Flag | Meaning |
|---|---|
| `-u, --clone-url=<url>` | Repo to clone. **Default is Shopify's Skeleton theme, not Dawn** |
| `-l, --latest` | Use the latest release of the clone URL |

---

## Commands that can break a live store

Treat these as production operations. Read them twice before you press enter.

| Command | Risk |
|---|---|
| `theme push --live` | Overwrites the live storefront immediately |
| `theme push --publish` | Pushes, then makes that theme live |
| `theme publish` | Switches which theme customers see |
| `theme delete` | Permanent. There is no undo |
| `theme pull` on a theme with merchant edits | Can overwrite work done in the theme editor |

The safe habits: work through `theme dev`, push to an **unpublished** theme, preview it,
and only then publish. `--nodelete` while you are still learning what a sync removes.

---

## Store, org and docs

```bash
shopify store list                 # stores in an organization
shopify store info                 # metadata about a store
shopify store open                 # open the store in a browser
shopify store graphiql             # local GraphiQL UI against a store
shopify store execute              # run GraphQL queries/mutations
shopify organization list          # organizations you can access
```

Documentation lookup, straight from the terminal:

```bash
shopify search "section rendering api"   # find relevant shopify.dev docs
shopify doc fetch <path>                 # download a full document verbatim
```

`search` is for discovery; `doc fetch` retrieves a whole page. Both are useful when a
`[VERIFY]` marker in the course sends you to confirm a current platform fact.

---

## Using this repo

Your theme lives in `playground/dawn`, so nearly every command needs `--path`:

```bash
shopify theme check --path playground/dawn
shopify theme dev   --path playground/dawn --store your-store.myshopify.com
```

Or `cd playground/dawn` first and drop the flag entirely.

`playground/` is git-ignored except its README, so nothing you do there can pollute the
course repo. Break it freely — that is what it is for.

Dawn was cloned with its own `.git` directory. Committing inside `playground/dawn`
commits to **Dawn's** history, not yours. Delete that `.git` if you want a clean slate.

---

## Other topics

`shopify app` and `shopify hydrogen` build Shopify apps and Hydrogen storefronts. Both
are outside this course's scope — it covers apps only where they meet the theme, at app
blocks and extensions. See `shopify app --help` if you need them anyway.
