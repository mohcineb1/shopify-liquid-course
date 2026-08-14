document.querySelectorAll('[data-payment-method]').forEach((method) => {
  if (method.textContent.includes('Manual invoice')) method.hidden = true;
});

window.vendorQueue.push(['purchase', { checkout_token: window.checkoutToken }]);
