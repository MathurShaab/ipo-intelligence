/**
 * IPO Intelligence - Application Configuration
 * Set ACTIVE_PROVIDER to 'EJIProvider' once your Vercel backend (/api) is running,
 * or keep 'DemoProvider' for offline demo mode.
 */
window.IPOConfig = {
  APP_NAME: 'IPO Intelligence',
  APP_VERSION: '0.3.0-eji-ready',
  ACTIVE_PROVIDER: 'EJIProvider',
  // Set this to your deployed Vercel URL (e.g., 'https://your-project.vercel.app/api') when hosting frontend on GitHub Pages
  API_BASE_URL: '/api',
  FALLBACK_TO_DEMO_ON_ERROR: true,
  CURRENCY_SYMBOL: '₹',
  DISCLAIMER_SHORT: 'Live EJI Finance API enabled (with automatic DemoProvider fallback if backend is offline).',
  GMP_DISCLAIMER: 'Grey Market Premium (GMP) values are unofficial, speculative indicators and do not guarantee actual listing performance.'
};
