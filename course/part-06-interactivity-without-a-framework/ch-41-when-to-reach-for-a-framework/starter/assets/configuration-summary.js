// Intentional smell: do not mount or redraw the full Liquid section.
const section = document.querySelector('[data-configurator-section]');

function mountWholeConfigurator() {
  // TODO: remove this page-wide ownership model.
  // The completed exercise should enhance only [data-configuration-summary]
  // after a buyer expresses configuration intent.
  section?.setAttribute('data-client-rendered', 'true');
}

mountWholeConfigurator();
