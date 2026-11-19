/**
 * IPO Intelligence - Data Provider Abstraction Layer
 * Supports DemoProvider and live EJIProvider (via Vercel Serverless Proxy).
 */

class BaseDataProvider {
  constructor(name) {
    this.name = name;
  }

  async getAllIPOs() {
    throw new Error('Method getAllIPOs() must be implemented by concrete provider.');
  }

  async getIPOById(id) {
    throw new Error('Method getIPOById() must be implemented by concrete provider.');
  }

  async getGMPData(id) {
    throw new Error('Method getGMPData() must be implemented by concrete provider.');
  }

  async getCompanyFinancials(id) {
    throw new Error('Method getCompanyFinancials() must be implemented by concrete provider.');
  }
}

/**
 * DemoProvider: Serves structured, clearly labeled illustrative IPO records.
 */
class DemoProvider extends BaseDataProvider {
  constructor() {
    super('DemoProvider');
  }

  _simulateLatency(ms = 120) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllIPOs() {
    await this._simulateLatency(100);
    const records = Array.isArray(window.DEMO_IPOS_DATA) ? window.DEMO_IPOS_DATA : [];
    return records.map((item) => ({ ...item }));
  }

  async getIPOById(id) {
    await this._simulateLatency(80);
    const records = Array.isArray(window.DEMO_IPOS_DATA) ? window.DEMO_IPOS_DATA : [];
    const found = records.find((item) => item.id === id);
    return found ? { ...found } : null;
  }

  async getGMPData(id) {
    const ipo = await this.getIPOById(id);
    return ipo ? { ...ipo.gmp, companyName: ipo.companyName, priceBand: ipo.priceBand, isDemo: true } : null;
  }

  async getCompanyFinancials(id) {
    const ipo = await this.getIPOById(id);
    return ipo ? { ...ipo.financials, companyName: ipo.companyName, isDemo: true } : null;
  }
}

/**
 * EJIProvider: Connects to Vercel Serverless Proxy (/api/ipos, /api/subscription, /api/gmp)
 * and normalizes live EJI Finance API payloads into the IPO Intelligence schema.
 */
class EJIProvider extends BaseDataProvider {
  constructor(baseUrl) {
    super('EJIProvider');
    this.baseUrl = (baseUrl || window.IPOConfig.API_BASE_URL || '/api').replace(/\/$/, '');
  }

  _capitalizeStatus(st) {
    if (!st) return 'Upcoming';
    const lower = String(st).toLowerCase();
    if (lower === 'open') return 'Open';
    if (lower === 'upcoming') return 'Upcoming';
    if (lower === 'closed') return 'Closed';
    if (lower === 'listed') return 'Listed';
    return st.charAt(0).toUpperCase() + st.slice(1);
  }

  _normalizeBoard(seg) {
    if (!seg) return 'Mainboard';
    return String(seg).toLowerCase() === 'sme' ? 'SME' : 'Mainboard';
  }

  _normalizeRecord(raw) {
    const minPrice = Number(raw.priceBandLow ?? raw.issuePrice ?? 0);
    const maxPrice = Number(raw.priceBandHigh ?? raw.issuePrice ?? minPrice);
    const totalSub = typeof raw.subscriptionTimes === 'number' ? raw.subscriptionTimes : 0;

    return {
      id: raw.symbol || `eji-${Math.random().toString(36).slice(2, 8)}`,
      isDemo: false,
      companyName: raw.company || raw.symbol || 'Unnamed Issuer',
      symbol: raw.symbol || 'N/A',
      sector: raw.sector || raw.source || 'Indian Equities',
      board: this._normalizeBoard(raw.segment),
      status: this._capitalizeStatus(raw.status),
      priceBand: { min: minPrice, max: maxPrice },
      lotSize: Number(raw.lotSize || 0),
      issueSizeCr: Number(raw.issueSizeCr || 0),
      freshIssueCr: Number(raw.freshIssueCr || raw.issueSizeCr || 0),
      ofsCr: Number(raw.ofsCr || 0),
      dates: {
        open: raw.openDate || 'TBA',
        close: raw.closeDate || 'TBA',
        allotment: raw.allotmentDate || 'TBA',
        refund: raw.refundDate || 'TBA',
        demat: raw.dematDate || raw.refundDate || 'TBA',
        listing: raw.listingDate || 'TBA'
      },
      subscription: {
        qib: Number(raw.qibSubscription || 0),
        nii: Number(raw.niiSubscription || 0),
        retail: Number(raw.retailSubscription || 0),
        employee: Number(raw.employeeSubscription || 0),
        total: totalSub,
        lastUpdated: raw.source ? `Source: ${raw.source}` : 'Live Feed'
      },
      gmp: raw.gmp
        ? raw.gmp
        : {
            current: 0,
            previous: 0,
            percentage: 0,
            lastUpdated: 'Pending GMP fetch',
            source: raw.source || 'EJI API',
            history: []
          },
      financials: raw.financials || null,
      listingPerformance:
        raw.issuePrice && raw.listingPrice
          ? {
              issuePrice: Number(raw.issuePrice),
              listingPrice: Number(raw.listingPrice),
              listingGainPct: Number((((raw.listingPrice - raw.issuePrice) / raw.issuePrice) * 100).toFixed(2)),
              cmp: Number(raw.cmp || raw.listingPrice),
              currentGainPct: Number(((( (raw.cmp || raw.listingPrice) - raw.issuePrice) / raw.issuePrice) * 100).toFixed(2))
            }
          : null,
      overview: `${raw.company || raw.symbol} (${this._normalizeBoard(raw.segment)} IPO) tracked via ${raw.source || 'NSE/SEBI'} disclosures.`,
      positives: raw.positives || ['Live exchange issue data synced via EJI Finance API.'],
      negatives: raw.negatives || ['Detailed DRHP ratios pending company fundamentals endpoint sync.'],
      risks: raw.risks || ['Verify final offer dates and price band on NSE/BSE before bidding.'],
      documents: []
    };
  }

  async getAllIPOs() {
    const response = await fetch(`${this.baseUrl}/ipos`);
    if (!response.ok) {
      throw new Error(`Backend /api/ipos returned HTTP ${response.status}`);
    }
    const payload = await response.json();
    const list = Array.isArray(payload.data) ? payload.data : [];
    return list.map((item) => this._normalizeRecord(item));
  }

  async getIPOById(symbol) {
    const all = await this.getAllIPOs();
    const found = all.find((item) => item.id === symbol || item.symbol === symbol);
    if (!found) return null;

    // Enrich single IPO detail with live subscription breakdown & GMP in parallel
    try {
      const [subRes, gmpRes] = await Promise.all([
        fetch(`${this.baseUrl}/subscription?symbol=${encodeURIComponent(found.symbol)}&history=true`),
        fetch(`${this.baseUrl}/gmp?symbol=${encodeURIComponent(found.symbol)}`)
      ]);

      if (subRes.ok) {
        const subJson = await subRes.json();
        const subData = subJson.data || subJson;
        if (subData) {
          found.subscription = {
            qib: Number(subData.qib ?? subData.qibTimes ?? found.subscription.qib),
            nii: Number(subData.nii ?? subData.niiTimes ?? found.subscription.nii),
            retail: Number(subData.retail ?? subData.retailTimes ?? found.subscription.retail),
            employee: Number(subData.employee ?? 0),
            total: Number(subData.total ?? subData.totalTimes ?? found.subscription.total),
            lastUpdated: subData.updatedAt || 'Live EJI Subscription Feed'
          };
        }
      }

      if (gmpRes.ok) {
        const gmpJson = await gmpRes.json();
        const gmpData = gmpJson.data || gmpJson;
        if (gmpData && (gmpData.gmp !== undefined || gmpData.current !== undefined)) {
          const curGmp = Number(gmpData.gmp ?? gmpData.current ?? 0);
          const maxP = found.priceBand.max || 1;
          found.gmp = {
            current: curGmp,
            previous: Number(gmpData.previous ?? curGmp),
            percentage: Number(((curGmp / maxP) * 100).toFixed(2)),
            lastUpdated: gmpData.updatedAt || 'Live EJI GMP Feed',
            source: 'EJI Finance API',
            history: Array.isArray(gmpData.history) ? gmpData.history : []
          };
        }
      }
    } catch (e) {
      console.warn('Optional enrichment warning:', e.message);
    }

    return found;
  }

  async getGMPData(symbol) {
    const response = await fetch(`${this.baseUrl}/gmp?symbol=${encodeURIComponent(symbol)}`);
    if (!response.ok) throw new Error('Failed to fetch GMP data');
    return response.json();
  }

  async getCompanyFinancials(symbol) {
    const response = await fetch(`${this.baseUrl}/company?symbol=${encodeURIComponent(symbol)}`);
    if (!response.ok) throw new Error('Failed to fetch Company Financials');
    return response.json();
  }
}

window.DataProviders = {
  BaseDataProvider,
  DemoProvider,
  EJIProvider
};
