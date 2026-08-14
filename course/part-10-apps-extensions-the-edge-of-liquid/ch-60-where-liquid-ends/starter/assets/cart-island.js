const state = {cart: null, customer: window.customer, token: window.storefrontToken};
fetch('/cart.js').then(r => r.json()).then(cart => {
  state.cart = cart;
  document.querySelector('[data-cart-total]').textContent = cart.items.reduce((n, item) => n + item.price, 0);
});
