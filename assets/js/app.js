/**
 * IPO Intelligence - Production Application Router & Global Controller
 * Connects all 12 complete pages, sidebar & mobile bottom nav states, global search, and watchlist actions.
 */
(function () {
  const ROUTES = {
    dashboard: { title: 'Market Dashboard', nav: 'dashboard' },
    upcoming: { title: 'Upcoming IPOs', nav: 'upcoming' },
    current: { title: 'Current / Open IPOs', nav: 'current' },
    open: { title: 'Current / Open IPOs', nav: 'current' },
    closed: { title: 'Closed IPOs', nav: 'closed' },
    listed: { title: 'Listed IPOs', nav: 'listed' },
    'ipo-detail': { title: 'IPO Research Detail', nav: 'dashboard' },
    'gmp-tracker': { title: 'GMP Tracker', nav: 'gmp-tracker' },
    'company-analysis': { title: 'Company Fundamental Analysis', nav: 'company-analysis' },
    comparison: { title: 'IPO Comparison Engine', nav: 'comparison' },
    'allotment-calc': { title: 'Allotment Probability Calculator', nav: 'allotment-calc' },
    'listing-calc': { title: 'Listing Gain Calculator', nav: 'listing-calc' },
    watchlist: { title: 'Saved Watchlist', nav: 'watchlist' }
  };

  function closeMobileDrawer() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('show');
    if (backdrop) backdrop.classList.remove('show');
  }

  function toggleMobileDrawer() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.toggle('show');
    if (backdrop) backdrop.classList.toggle('show');
  }

  async function updateSidebarCounts() {
    try {
      const [metrics, watchCount] = await Promise.all([
        window.ipoService.getDashboardMetrics(),
        window.watchlistService.getWatchlistCount()
      ]);

      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setTxt('nav-count-upcoming', metrics.upcomingCount);
      setTxt('nav-count-open', metrics.openCount);
      setTxt('nav-count-closed', metrics.closedCount);
      setTxt('nav-count-listed', metrics.listedCount);
      setTxt('nav-count-watchlist', watchCount);
      setTxt('header-watchlist-count', watchCount);
      setTxt('active-provider-badge', `${window.ipoService.getProviderName()} v1.0`);
    } catch (e) {
      console.error('Failed updating sidebar counts:', e);
    }
  }

  function setActiveNav(navKey) {
    document.querySelectorAll('.sidebar .nav-link, .mobile-bottom-nav a').forEach((link) => {
      const route = link.getAttribute('data-route');
      link.classList.toggle('active', route === navKey);
    });
  }

  async function handleRoute() {
    const rawHash = window.location.hash.replace(/^#/, '') || 'dashboard';
    const [routeBase, routeParam] = rawHash.split('/');
    const routeMeta = ROUTES[routeBase] || ROUTES.dashboard;

    const titleEl = document.getElementById('current-page-title');
    if (titleEl) titleEl.textContent = routeMeta.title;
    setActiveNav(routeMeta.nav);
    closeMobileDrawer();

    const view = document.getElementById('app-view');
    if (!view) return;

    switch (routeBase) {
      case 'dashboard':
        await window.DashboardPage.render(view);
        break;
      case 'upcoming':
        await window.ListingPages.renderStatusPage(view, {
          status: 'Upcoming',
          title: 'Upcoming IPOs',
          subtitle: 'Scheduled Mainboard and SME issues in the primary market pipeline.',
          icon: 'bi-calendar-event'
        });
        break;
      case 'current':
      case 'open':
        await window.ListingPages.renderStatusPage(view, {
          status: 'Open',
          title: 'Currently Open IPOs',
          subtitle: 'Active primary market issues currently open for bidding.',
          icon: 'bi-broadcast'
        });
        break;
      case 'closed':
        await window.ListingPages.renderStatusPage(view, {
          status: 'Closed',
          title: 'Recently Closed IPOs',
          subtitle: 'Issues that have closed bidding and await allotment or debut listing.',
          icon: 'bi-lock'
        });
        break;
      case 'listed':
        await window.ListingPages.renderStatusPage(view, {
          status: 'Listed',
          title: 'Recently Listed IPOs',
          subtitle: 'Debut listing prices, listing gains/losses, and secondary market performance.',
          icon: 'bi-check2-circle'
        });
        break;
      case 'ipo-detail': {
        const fallbackList = await window.ipoService.fetchAllIPOs();
        const defaultId = fallbackList.length ? fallbackList[0].id : 'demo-ipo-001';
        await window.DetailPage.render(view, routeParam || defaultId);
        break;
      }
      case 'gmp-tracker':
        await window.GMPTrackerPage.render(view, routeParam || null);
        break;
      case 'company-analysis':
        await window.CompanyAnalysisPage.render(view, routeParam || null);
        break;
      case 'comparison':
        await window.ComparisonPage.render(view);
        break;
      case 'allotment-calc':
        await window.AllotmentCalculatorPage.render(view);
        break;
      case 'listing-calc':
        await window.ListingGainCalculatorPage.render(view);
        break;
      case 'watchlist':
        await window.WatchlistPage.render(view);
        break;
      default:
        await window.DashboardPage.render(view);
    }
  }

  function initGlobalListeners() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');
    const backdrop = document.getElementById('sidebar-backdrop');

    if (toggleBtn) toggleBtn.addEventListener('click', toggleMobileDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileDrawer);
    if (backdrop) backdrop.addEventListener('click', closeMobileDrawer);

    const globalSearch = document.getElementById('global-search-input');
    const mobileSearch = document.getElementById('mobile-search-input');
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    const mobileSearchDrawer = document.getElementById('mobile-search-drawer');
    const mobileSearchClear = document.getElementById('mobile-search-clear');

    const handleSearchInput = async (query, sourceInput) => {
      if (globalSearch && sourceInput !== globalSearch) globalSearch.value = query;
      if (mobileSearch && sourceInput !== mobileSearch) mobileSearch.value = query;
      const currentHash = window.location.hash.replace(/^#/, '') || 'dashboard';
      if (currentHash !== 'dashboard') {
        window.location.hash = '#dashboard';
      }
      await window.DashboardPage.render(document.getElementById('app-view'), query);
    };

    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => handleSearchInput(e.target.value, globalSearch));
    }
    if (mobileSearch) {
      mobileSearch.addEventListener('input', (e) => handleSearchInput(e.target.value, mobileSearch));
    }
    if (mobileSearchToggle && mobileSearchDrawer) {
      mobileSearchToggle.addEventListener('click', () => {
        const isHidden = mobileSearchDrawer.style.display === 'none' || !mobileSearchDrawer.style.display;
        mobileSearchDrawer.style.display = isHidden ? 'block' : 'none';
        if (isHidden && mobileSearch) mobileSearch.focus();
      });
    }
    if (mobileSearchClear && mobileSearchDrawer) {
      mobileSearchClear.addEventListener('click', async () => {
        if (mobileSearch) mobileSearch.value = '';
        mobileSearchDrawer.style.display = 'none';
        await handleSearchInput('', mobileSearchClear);
      });
    }

    document.body.addEventListener('click', async (e) => {
      const btn = e.target.closest('.js-toggle-watchlist');
      if (!btn) return;
      const ipoId = btn.getAttribute('data-ipo-id');
      if (!ipoId) return;

      const added = await window.watchlistService.toggleWatchlist(ipoId);
      await updateSidebarCounts();
      window.UIComponents.showToast(
        added ? 'Added IPO to your Watchlist.' : 'Removed IPO from your Watchlist.',
        added ? 'success' : 'info'
      );
      await handleRoute();
    });

    window.addEventListener('hashchange', handleRoute);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    initGlobalListeners();
    await updateSidebarCounts();
    await handleRoute();
  });
})();
