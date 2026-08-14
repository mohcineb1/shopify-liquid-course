(function () {
  const island = document.querySelector('[data-cart-island]');
  if (!island || !window.Shopify || !window.Shopify.routes) return;
  const count = island.querySelector('[data-cart-count]');
  const status = island.querySelector('[data-cart-status]');
  fetch(`${window.Shopify.routes.root}cart.js`).then((response) => {
    if (!response.ok) throw new Error('cart-read-failed');
    return response.json();
  }).then((cart) => { count.textContent = String(cart.item_count); }).catch(() => {
    status.textContent = 'Cart details could not be refreshed. Open your cart to continue.';
    status.hidden = false;
  });
}());
