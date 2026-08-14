document.addEventListener('click', (event) => {
  if (event.target.matches('[data-variant]')) document.querySelector('.product-cards').textContent = 'Variant changed';
  if (event.target.matches('[data-open-cart]')) document.querySelector('[data-cart-drawer]').hidden = false;
});
