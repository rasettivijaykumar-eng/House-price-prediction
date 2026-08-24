// Set this to the public Render URL before deploying the frontend to Vercel.
window.HOMEPRICE_API_URL = window.HOMEPRICE_API_URL || '';

window.apiUrl = function apiUrl(path) {
  return `${window.HOMEPRICE_API_URL.replace(/\/$/, '')}${path}`;
};