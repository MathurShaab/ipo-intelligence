/**
 * IPO Intelligence - Application Router & Global Controller
 * Coordinates SPA hash navigation, sidebar badges, global search, and watchlist interactions.
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
    'gmp-tracker': { title: 'GMP Tracker (Demo)', nav: 'gmp-tracker' },
    'company-analysis': { title: 'Company Fundamental Analysis', nav: 'company-analysis' },
    comparison: { title: 'IPO Comparison Engine', nav: 'comparison' },
    'allotment-calc': { title: 'Allotment Probability Calculator', nav: 'allotment-calc' },
    'listing-calc': { title: 'Listing Gain Calculator', nav: 'listing-calc' },
    watchlist: { title: 'Saved Watchlist', nav: 'watchlist' }
  };

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
    document.querySelectorAll('.sidebar .nav-link').forEach((link) => {
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

    // Close mobile sidebar after navigation
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('show');

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
          subtitle: 'Scheduled Mainboard and SME issues in the demo pipeline.',
          icon: 'bi-calendar-event'
        });
        break;
      case 'current':
      case 'open':
        await window.ListingPages.renderStatusPage(view, {
          status: 'Open',
          title: 'Currently Open IPOs',
          subtitle: 'Active primary market issues accepting bids (Illustrative Demo Data).',
          icon: 'bi-broadcast'
        });
        break;
      case 'closed':
        await window.ListingPages.renderStatusPage(view, {
          status: 'Closed',
          title: 'Recently Closed IPOs',
          subtitle: 'Issues that have closed bidding and await allotment or listing (Demo).',
          icon: 'bi-lock'
        });
        break;
      case 'listed':
        await window.ListingPages.renderStatusPage(view, {
          status: 'Listed',
          title: 'Recently Listed IPOs',
          subtitle: 'Debut listing prices, gains/losses, and current market performance (Demo).',
          icon: 'bi-check2-circle'
        });
        break;
      case 'ipo-detail':
        const fallbackList = await window.ipoService.fetchAllIPOs();
        const defaultId = fallbackList.length ? fallbackList[0].id : 'demo-ipo-001';
        await window.DetailPage.render(view, routeParam || defaultId);
        break;
      case 'gmp-tracker':
        await window.GMPTrackerPage.render(view, routeParam || null);
        break;
      case 'company-analysis':
        window.PhasedViews.renderPhaseNotice(view, {
          title: 'Company Fundamental Analysis & 100-Point Scoring Engine',
          phaseNumber: 4,
          icon: 'bi-building-gear',
          phaseScope: 'Phase 4 implements the multi-year Revenue/EBITDA/PAT financial charts, ROE/ROCE/Debt-to-Equity/P-E ratio analysis, peer comparison, and configurable 100-point IPO Scoring Engine.'
        });
        break;
      case 'comparison':
        window.PhasedViews.renderPhaseNotice(view, {
          title: 'Multi-IPO Side-by-Side Comparison',
          phaseNumber: 5,
          icon: 'bi-columns-gap',
          phaseScope: 'Phase 5 enables side-by-side comparison of multiple demo IPOs across Revenue growth, PAT growth, ROE, ROCE, P/E, Debt-to-Equity, Subscription, GMP, and IPO Score.'
        });
        break;
      case 'allotment-calc':
        window.PhasedViews.renderPhaseNotice(view, {
          title: 'IPO Allotment Probability Calculator',
          phaseNumber: 5,
          icon: 'bi-pie-chart',
          phaseScope: 'Phase 5 delivers an interactive Retail & NII allotment probability simulator with transparent mathematical assumptions and disclaimers.'
        });
        break;
      case 'listing-calc':
        window.PhasedViews.renderPhaseNotice(view, {
          title: 'Listing Gain / Loss Scenario Calculator',
          phaseNumber: 5,
          icon: 'bi-calculator',
          phaseScope: 'Phase 5 provides Optimistic, Neutral, and Pessimistic listing gain projections based on issue price, lot size, and illustrative GMP.'
        });
        break;
      case 'watchlist':
        await window.PhasedViews.renderWatchlist(view);
        break;
      default:
        await window.DashboardPage.render(view);
    }
  }

  function initGlobalListeners() {
    // Mobile sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => sidebar.classList.toggle('show'));
    }
    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', () => sidebar.classList.remove('show'));
    }

    // Global Search Bar -> routes to Dashboard screener seamlessly
    const globalSearch = document.getElementById('global-search-input');
    if (globalSearch) {
      globalSearch.addEventListener('input', async (e) => {
        const query = e.target.value;
        const currentHash = window.location.hash.replace(/^#/, '') || 'dashboard';
        if (currentHash !== 'dashboard') {
          window.location.hash = '#dashboard';
        }
        await window.DashboardPage.render(document.getElementById('app-view'), query);
      });
    }

    // Delegated Watchlist Toggle Click Handler across all tables & detail pages
    document.body.addEventListener('click', async (e) => {
      const btn = e.target.closest('.js-toggle-watchlist');
      if (!btn) return;
      const ipoId = btn.getAttribute('data-ipo-id');
      if (!ipoId) return;

      const added = await window.watchlistService.toggleWatchlist(ipoId);
      await updateSidebarCounts();
      window.UIComponents.showToast(
        added ? 'Added demo IPO to your Watchlist.' : 'Removed demo IPO from your Watchlist.',
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
