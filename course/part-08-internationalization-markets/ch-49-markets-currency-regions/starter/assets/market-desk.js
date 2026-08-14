document.querySelector('[data-currency]')?.addEventListener('click', () => {
  const price = document.querySelector('[data-base-price]');
  price.textContent = `€${(Number(price.dataset.basePrice) / 100 * 0.92).toFixed(2)}`;
});
