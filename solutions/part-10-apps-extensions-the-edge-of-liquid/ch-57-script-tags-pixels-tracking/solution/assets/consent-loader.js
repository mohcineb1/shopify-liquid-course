(function () {
  function evaluateOptionalLoading() {
    if (!window.Shopify || !Shopify.customerPrivacy) return;

    const allowed = Shopify.customerPrivacy.analyticsProcessingAllowed();
    window.dispatchEvent(new CustomEvent('northstar:analytics-allowed', {
      detail: { allowed: allowed === true }
    }));
  }

  window.Shopify.loadFeatures(
    [{ name: 'consent-tracking-api', version: '0.1' }],
    function (error) {
      if (error) return;
      evaluateOptionalLoading();
      document.addEventListener('visitorConsentCollected', evaluateOptionalLoading);
    }
  );
}());
