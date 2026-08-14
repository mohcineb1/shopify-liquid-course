(function () {
  const guide = document.querySelector('[data-guide-open]');

  if (!guide || !window.Shopify || !Shopify.analytics) return;

  guide.addEventListener('click', function () {
    Shopify.analytics.publish('guide_opened', {
      surface: 'guide_card',
      schema_version: 1
    });
  });
}());
