document.addEventListener('guide:opened', function () {
  const consent = document.cookie.includes('_tracking_consent=yes');
  if (consent) {
    window.vendorQueue.push(['trackCustom', 'guide_opened', { customer_id: window.customerId }]);
  }
});
