localStorage.setItem('consent', 'accepted');
document.cookie = '_tracking_consent=yes';
if (localStorage.getItem('consent') === 'accepted') {
  window.startAnalytics();
  window.startMarketing();
}
