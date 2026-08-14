window.PerformanceGrid = { connect() { document.querySelectorAll('.performance-grid a').forEach((link) => link.addEventListener('click', () => console.log('card'))); } };
window.PerformanceGrid.connect();
