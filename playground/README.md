# Playground

Your live Shopify theme working directory. Every exercise gets tested here.

## Setup once

```bash
# Partner account -> development store -> add test products with:
#  - variants (some sold out), multiple images, video, metafields
#  - a collection with 60+ products so pagination and filters are real
#  - a second market/language so i18n chapters are testable

npm install -g @shopify/cli
git clone https://github.com/Shopify/horizon.git playground/horizon
shopify theme dev --path playground/horizon --store liquid-lab-g2sfvzyn.myshopify.com
```

The dev store is **Liquid Lab**: `liquid-lab-g2sfvzyn.myshopify.com`, admin at
`admin.shopify.com/store/liquid-lab-g2sfvzyn`. It is a free Plus development store with
test data and the Bogus Gateway. If you use a different store, swap its handle in
wherever the docs say `liquid-lab-g2sfvzyn`.

The base theme is **Horizon**. `shopify theme init` clones Skeleton by default, not
Horizon, so clone Horizon directly instead.

## Per exercise

```bash
# from the repo root
cp -r course/part-03-theme-architecture/ch-18-.../starter/* playground/horizon/
shopify theme dev --path playground/horizon
```

Keep a clean base theme on a `base` git branch so you can reset between chapters.

Not committed to this repo: see `.gitignore`.
