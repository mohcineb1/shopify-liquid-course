# Playground

Your live Shopify theme working directory. Every exercise gets tested here.

## Setup once

```bash
# Partner account -> development store -> add test products with:
#  - variants (some sold out), multiple images, video, metafields
#  - a collection with 60+ products so pagination and filters are real
#  - a second market/language so i18n chapters are testable

npm install -g @shopify/cli
shopify theme init
shopify theme dev --store your-dev-store.myshopify.com
```

## Per exercise

```bash
cp -r ../course/part-03-theme-architecture/ch-18-.../starter/* .
shopify theme dev
```

Keep a clean base theme on a `base` git branch so you can reset between chapters.

Not committed to this repo: see `.gitignore`.
