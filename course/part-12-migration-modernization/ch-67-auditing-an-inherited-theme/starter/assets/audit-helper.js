const maybeUnused = ['sections/product-legacy.liquid', 'blocks/promo-legacy.liquid'];
maybeUnused.forEach((path) => fetch('/admin/themes/current/assets.json?delete=' + path, { method: 'POST' }));
