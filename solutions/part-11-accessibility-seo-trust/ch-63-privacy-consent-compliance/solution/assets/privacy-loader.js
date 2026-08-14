(function () {
  const state = {analytics: false, marketing: false};
  function loadPrivacyApi() { return new Promise((resolve, reject) => window.Shopify.loadFeatures([{name: 'consent-tracking-api', version: '0.1'}], (error) => error ? reject(error) : resolve(window.Shopify.customerPrivacy))); }
  function reconcile(privacy) {
    const analyticsAllowed = privacy.analyticsProcessingAllowed();
    const marketingAllowed = privacy.marketingAllowed();
    if (analyticsAllowed && !state.analytics) { /* start approved analytics */ state.analytics = true; }
    if (!analyticsAllowed && state.analytics) { /* approved stop contract [VERIFY] */ state.analytics = false; }
    if (marketingAllowed && !state.marketing) { /* start approved marketing */ state.marketing = true; }
    if (!marketingAllowed && state.marketing) { /* approved stop contract [VERIFY] */ state.marketing = false; }
  }
  loadPrivacyApi().then((privacy) => { reconcile(privacy); document.addEventListener('visitorConsentCollected', () => reconcile(privacy)); }).catch(() => { /* optional processing remains off */ });
}());
