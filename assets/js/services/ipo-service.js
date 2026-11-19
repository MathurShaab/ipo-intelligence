/**
 * IPO Intelligence - Centralized IPO Domain Service
 * Automatically routes to EJIProvider (via Vercel backend) and gracefully falls back
 * to DemoProvider if opened locally via file:// without a running Vercel server.
 */
class IPOService {
  constructor() {
    this.provider =
      window.IPOConfig.ACTIVE_PROVIDER === 'EJIProvider'
        ? new window.DataProviders.EJIProvider(window.IPOConfig.API_BASE_URL)
        : new window.DataProviders.DemoProvider();
    this._cache = null;
  }

  setProvider(providerInstance) {
    this.provider = providerInstance;
    this._cache = null;
  }

  getProviderName() {
    return this.provider ? this.provider.name : 'Unknown';
  }

  async fetchAllIPOs(forceRefresh = false) {
    if (this._cache && !forceRefresh) {
      return [...this._cache];
    }
    try {
      const data = await this.provider.getAllIPOs();
      this._cache = data;
      return [...data];
    } catch (err) {
      if (this.provider.name === 'EJIProvider' && window.IPOConfig.FALLBACK_TO_DEMO_ON_ERROR) {
        console.warn('EJIProvider unreachable (likely running without Vercel server). Falling back to DemoProvider:', err.message);
        this.provider = new window.DataProviders.DemoProvider();
        const badge = document.getElementById('active-provider-badge');
        if (badge) badge.textContent = 'DemoProvider (Fallback)';
        const demoData = await this.provider.getAllIPOs();
        this._cache = demoData;
        return [...demoData];
      }
      throw err;
    }
  }

  async fetchIPOById(id) {
    if (this.provider.name === 'EJIProvider') {
      try {
        return await this.provider.getIPOById(id);
      } catch (err) {
        console.warn('Falling back to cached/demo record for ID:', id);
      }
    }
    if (this._cache) {
      const cached = this._cache.find((item) => item.id === id);
      if (cached) return { ...cached };
    }
    return this.provider.getIPOById(id);
  }

  async filterIPOs({ status = 'ALL', board = 'ALL', search = '' } = {}) {
    const all = await this.fetchAllIPOs();
    const query = search.trim().toLowerCase();

    return all.filter((ipo) => {
      const matchStatus = status === 'ALL' || ipo.status.toLowerCase() === status.toLowerCase();
      const matchBoard = board === 'ALL' || ipo.board.toLowerCase() === board.toLowerCase();
      const matchSearch =
        !query ||
        ipo.companyName.toLowerCase().includes(query) ||
        ipo.symbol.toLowerCase().includes(query) ||
        ipo.sector.toLowerCase().includes(query);

      return matchStatus && matchBoard && matchSearch;
    });
  }

  async getDashboardMetrics() {
    const all = await this.fetchAllIPOs();
    const upcoming = all.filter((i) => i.status === 'Upcoming');
    const open = all.filter((i) => i.status === 'Open');
    const closed = all.filter((i) => i.status === 'Closed');
    const listed = all.filter((i) => i.status === 'Listed');

    const activeGmpRecords = all.filter((i) => i.gmp && typeof i.gmp.percentage === 'number' && i.gmp.current !== 0);
    const avgGmpPct =
      activeGmpRecords.length > 0
        ? activeGmpRecords.reduce((acc, cur) => acc + cur.gmp.percentage, 0) / activeGmpRecords.length
        : 0;

    return {
      totalTracked: all.length,
      upcomingCount: upcoming.length,
      openCount: open.length,
      closedCount: closed.length,
      listedCount: listed.length,
      avgGmpPct: Number(avgGmpPct.toFixed(2)),
      upcomingIPOs: upcoming,
      openIPOs: open,
      closedIPOs: closed,
      listedIPOs: listed,
      allIPOs: all
    };
  }
}

window.ipoService = new IPOService();
