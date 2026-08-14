const form = document.querySelector('#MarketDeskLocalization');
form?.addEventListener('change', (event) => {
  if (event.target.matches('select')) form.requestSubmit();
});
