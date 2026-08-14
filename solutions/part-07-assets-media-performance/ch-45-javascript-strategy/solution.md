<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 45 — Solution

## The approach

The product form already works as HTML: a native radio input carries the variant ID and the form submits normally. The solution does not replace it. It adds a `type="module"` asset that only enhances roots marked `data-variant-status-root`. Each root contains an inert JSON data node produced with `| json`; no merchant content is embedded in executable JavaScript. The module reads only within the root, updates only its own status, and keeps no global product helper.

The reviews script is absent from the section. Its application owns whether and where it loads; the solution records the route trigger, consent condition, and removal test rather than copying a vendor URL. The build contract maps a source entry to a stable final `assets/` file and treats bundler rebuilding and theme syncing as separate observable steps.

## Walkthrough

**1 — loading.** `type="module"` gives this independently scoped component module semantics and deferred loading. No parser-blocking external asset remains.

**2 — boundary.** The feature module is the product-status owner. A route-wide bootstrap is unnecessary because no common behavior needs it.

**3 — data.** An `application/json` node contains a narrow object encoded by Liquid’s `json` filter. The script parses text content rather than evaluating a JavaScript string.

**4 — roots.** `connectVariantStatus(root)` finds controls and status inside its parameter. Multiple forms cannot overwrite the first matching status.

**5 — fallback.** Native radio inputs and the submit button remain normal server form controls. A failed module leaves selection and purchase intact.

**6 and 7 — governance.** Vendor ownership and final build outputs live in records, not scattered script tags.

**8 — verification.** The notes cover cold load, failures, two roots, replacement, vendor blocking, and final asset delivery.

## Full code

### `sections/product-variant-status.liquid`

```liquid
<script type="module" src="{{ 'product-variant-status.js' | asset_url }}"></script>
<form class="product-form" action="/cart/add" method="post" data-variant-status-root>
  <label><input type="radio" name="id" value="{{ product.selected_or_first_available_variant.id }}" checked> Default variant</label>
  <p data-variant-status aria-live="polite">Choose a variant</p>
  <script type="application/json" data-variant-status-config>
    {{ product.selected_or_first_available_variant | json }}
  </script>
  <button type="submit">Add to cart</button>
</form>
```

### `assets/product-variant-status.js`

```js
function connectVariantStatus(root) {
  const status = root.querySelector('[data-variant-status]');
  const configNode = root.querySelector('[data-variant-status-config]');
  if (!status || !configNode) return;

  let initial;
  try { initial = JSON.parse(configNode.textContent); } catch { return; }

  const update = (input) => {
    if (!input?.checked) return;
    status.textContent = input.value === String(initial.id)
      ? `Selected: ${initial.title}`
      : `Selected variant ${input.value}`;
  };

  root.addEventListener('change', (event) => {
    if (event.target.matches('input[name="id"]')) update(event.target);
  });
  update(root.querySelector('input[name="id"]:checked'));
}

document.querySelectorAll('[data-variant-status-root]').forEach(connectVariantStatus);
```

### `tag-inventory.md`

```md
# Tag inventory

| Field | Reviews integration |
| --- | --- |
| Owner | Installed reviews app or its app block |
| Trigger | Product route where its app block is rendered |
| Consent | Confirm current app/privacy contract [VERIFY] |
| Loading | App-owned documented behavior [VERIFY] |
| Removal test | Remove block, block vendor host, inspect no remaining request |
```

### `build-contract.md`

```md
# Build contract

| Source | Final theme asset | Owner |
| --- | --- | --- |
| `src/product-variant-status.js` | `assets/product-variant-status.js` | product status section |

Source maps follow documented production policy. The bundler rebuild and Shopify CLI theme sync are separate checks. Verify current command integration before automation.
```

### `notes.md`

```md
- Cold load: module request is non-blocking; native form remains present.
- Failure: block module URL; radio and submit controls still work.
- Two roots: each status updates only inside its own form.
- Editor replacement: new root is initialized by the current section lifecycle adapter [VERIFY].
- Vendor: block remote host; product form remains usable.
- Sync: confirm emitted asset changed, synced, and was fetched cache-bypassed.
```

## What people get wrong here

**Putting JSON in an executable script.** A hand-concatenated string breaks on merchant content and invites syntax errors. Use `| json` in an inert data node.

**Using `document.querySelector` inside every handler.** It updates the first status on the page and breaks two forms. Query from the component root.

**Replacing form submission with JavaScript.** A network or module failure then removes the buyer’s purchase path. Preserve the native form.

**Loading the vendor from every product section.** Installation is not route ownership. The app’s block and documented integration own its script.

## Stretch: direction only

Use a real size-guide link as the baseline. Add an intent trigger that imports the dialog module only after activation, preserve navigation if the import fails, and measure the initial product route before and after to prove the deferred module did not enter first-view work.


## Delivery and failure analysis

Start by testing the form before its module is requested. The radio input must remain a valid `name="id"` control and the submit button must still post to the native endpoint. This test prevents the common mistake of evaluating the enhancement only on a warm desktop browser where JavaScript always succeeds. Next block the module request in developer tools. The status paragraph remains at its server text, which is acceptable; the buyer can still select the radio and submit the form. A status label is enhancement, not transactional authority.

The root boundary matters once a template contains a quick-add form as well as the main product form. In the starter, `document.querySelector('[data-variant-status]')` finds the first matching status regardless of which form changed. The solution receives one root at a time, parses the configuration adjacent to that root, and writes inside it. Confirm this by rendering two forms with different selected variants and changing each control in turn. A feature that passes with one root can still be structurally wrong for a real theme.

The initializer is intentionally simple, but an editor-aware theme must also run it after a relevant section is inserted or replaced. The lifecycle adapter should discover the new root and call the same `connectVariantStatus` function; it should not duplicate document-wide listeners. Confirm the exact editor event and replacement behavior in the target theme before adding that adapter, because the component module should not infer an editor API from browser events alone.

Treat vendor scripts as a separate governance problem. The solution does not defer-load the sample reviews URL in an attempt to make it acceptable. A remote tag needs an owner, a page/block trigger, consent review, observed request chain, and deletion test. Block the host and inspect the network after removing the app block. If the product form breaks, the theme coupled a core buyer task to the wrong dependency. If no request remains, the removal boundary is real rather than merely hidden by cache.

Finally, observe the build boundary directly. Change the source entry, confirm the expected final `assets/product-variant-status.js` changes, then confirm the theme development process uploads that final file. Reload the store preview with cache disabled and inspect the fetched URL and response. A source rebuild without an uploaded asset is a tooling failure; a new uploaded asset with an old behavior can be a caching or initialization failure. These checks make diagnosis deterministic rather than adding random script attributes until a preview seems to work.

The output naming policy also needs longevity. Stable final names work well when Liquid includes the file directly through `asset_url`. If a future build adopts content hashes, introduce a deliberate manifest-to-Liquid mechanism rather than allowing imports to reference guesses. Source maps should follow a documented development/production policy: they can aid debugging, but publishing them is a release decision, not a side effect of the bundler.
