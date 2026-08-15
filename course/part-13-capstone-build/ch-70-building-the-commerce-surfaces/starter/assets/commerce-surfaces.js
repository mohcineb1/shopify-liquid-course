const fragment = document.querySelector('#CartDrawer');

export async function refreshCart() {
  const response = await fetch('/cart?sections=cart-drawer,header');
  const sections = await response.json();
  fragment.innerHTML = sections['cart-drawer'];
  window.dispatchEvent(new CustomEvent('cart:changed', { detail: window.cart }));
}

document.querySelector('[data-browser-sort]')?.addEventListener('change', (event) => {
  [...document.querySelectorAll('#CollectionProducts > li')]
    .sort((left, right) => Number(left.dataset.price) - Number(right.dataset.price))
    .forEach((item) => document.querySelector('#CollectionProducts').append(item));
});
