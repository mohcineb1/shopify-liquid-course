window.ProductHelper = {
  connect() {
    document.querySelectorAll('.product-form').forEach((form) => {
      form.addEventListener('change', () => {
        document.querySelector('[data-variant-status]').textContent = window.variantConfig.title;
      });
    });
  }
};
window.ProductHelper.connect();
