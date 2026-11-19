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

  _simulateLatency(ms = 100) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllIPOs() {
    await this._simulateLatency(90);
    const records = Array.isArray(window.DEMO_IPOS_DATA) ? window.DEMO_IPOS_DATA : [];
    return records.map((item) => ({ ...item }));
  }

  async getIPOById(id) {
    await this._simulateLatency(70);
    const records = Array.isArray(window.DEMO_IPOS_DATA) ? window.DEMO_IPOS_DATA : [];
    const found = records.find((item) => item.id === id || item.symbol === id);
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
 * EJIProvider: Connects to Vercel Serverless Proxy (/api/ipos, /api/subscription, /api/gmp, /api/company)
 * and normalizes live EJI Finance API payloads into the IPO Intelligence schema.
 */
class EJIProvider extends BaseDataProvider {
  constructor(baseUrl) {
    super('EJIProvider');
    this.baseUrl = (baseUrl || window.IPOConfig.API_BASE_URL || '/api').replace(/\/$/, '');
    this._listCache = null;
  }

  _slugify(str) {
    return String(str || 'issuer')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
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

  _normalizeRecord(raw, index = 0) {
    const cleanSymbol = raw.symbol && String(raw.symbol).trim() ? String(raw.symbol).trim() : null;
    const slugId = cleanSymbol || `eji-${this._slugify(raw.company || 'ipo')}-${index + 1}`;
    const minPrice = Number(raw.priceBandLow ?? raw.issuePrice ?? 0);
    const maxPrice = Number(raw.priceBandHigh ?? raw.issuePrice ?? minPrice);
    const totalSub = typeof raw.subscriptionTimes === 'number' ? raw.subscriptionTimes : Number(raw.subscriptionTimes || 0);

    return {
      id: slugId,
      isDemo: false,
      hasLiveSymbol: Boolean(cleanSymbol),
      companyName: raw.company || cleanSymbol || 'Unnamed Issuer',
      symbol: cleanSymbol || 'TBA',
      sector: raw.sector || raw.industry || (raw.source ? `${raw.source} Filing` : 'Indian Equities'),
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
        lastUpdated: raw.source ? `Source: ${raw.source}` : 'Live EJI Feed',
        history: []
      },
      gmp: raw.gmp
        ? raw.gmp
        : {
            current: 0,
            previous: 0,
            percentage: 0,
            lastUpdated: 'Pending GMP sync',
            source: 'EJI Unofficial GMP Feed',
            history: []
          },
      financials: raw.financials || null,
      listingPerformance: (() => {
        const iss = Number(raw.issuePrice || raw.priceBandHigh || 0);
        const lst = Number(raw.listingPrice || raw.listPrice || 0);
        const cmpVal = Number(raw.cmp || raw.currentPrice || raw.ltp || lst || 0);
        if (!iss || !lst) return null;
        const gainPct =
          typeof raw.listingGainPercent === 'number'
            ? raw.listingGainPercent
            : Number((((lst - iss) / iss) * 100).toFixed(2));
        const curPct =
          typeof raw.currentGainPercent === 'number'
            ? raw.currentGainPercent
            : Number((((cmpVal - iss) / iss) * 100).toFixed(2));
        return {
          issuePrice: iss,
          listingPrice: lst,
          listingGainPct: gainPct,
          cmp: cmpVal,
          currentGainPct: curPct
        };
      })(),
      overview:
        raw.overview ||
        raw.about ||
        `${raw.company || cleanSymbol} is a ${this._normalizeBoard(raw.segment)} primary market offering tracked via ${raw.source || 'NSE/SEBI'} disclosures.`,
      positives: Array.isArray(raw.positives) && raw.positives.length
        ? raw.positives
        : [
            `Active ${this._normalizeBoard(raw.segment)} issue tracked directly from ${raw.source || 'NSE/SEBI'} disclosures.`,
            maxPrice > 0 ? `Upper price band fixed at ₹${maxPrice} per equity share.` : 'Price band disclosure monitored.'
          ],
      negatives: Array.isArray(raw.negatives) && raw.negatives.length
        ? raw.negatives
        : [
            'Granular multi-year DRHP ratios will populate as exchange/company filings sync.',
            'Unofficial GMP figures are speculative and subject to rapid intraday shifts.'
          ],
      risks: Array.isArray(raw.risks) && raw.risks.length
        ? raw.risks
        : [
            'Verify final offer schedule, lot size, and RHP risk factors on NSE/BSE prior to bidding.',
            'Listing day price discovery depends on broader secondary market liquidity.'
          ],
      documents: [
        { title: `${raw.source || 'Exchange'} Issue Disclosure (${cleanSymbol || 'Pending Symbol'})`, type: 'Live Reference' }
      ]
    };
  }

  async getAllIPOs(forceRefresh = false) {
    if (this._listCache && !forceRefresh) {
      return this._listCache.map((i) => ({ ...i }));
    }
    const response = await fetch(`${this.baseUrl}/ipos`);
    if (!response.ok) {
      throw new Error(`Backend /api/ipos returned HTTP ${response.status}`);
    }
    const payload = await response.json();
    const list = Array.isArray(payload.data) ? payload.data : [];
    const normalized = list.map((item, idx) => this._normalizeRecord(item, idx));
    this._listCache = normalized;
    return normalized.map((i) => ({ ...i }));
  }

  async getIPOById(idOrSymbol) {
    const all = await this.getAllIPOs();
    let found = all.find(
      (item) =>
        item.id === idOrSymbol ||
        item.symbol.toLowerCase() === String(idOrSymbol).toLowerCase()
    );

    // Fallback: if URL had an old ephemeral hash like 'eji-yhg80s', default gracefully to first live IPO
    if (!found && String(idOrSymbol).startsWith('eji-') && all.length > 0) {
      found = { ...all[0] };
    }
    if (!found) return null;

    // Enrich with live subscription breakdown, GMP, and performance if symbol is available
    if (found.hasLiveSymbol && found.symbol !== 'TBA') {
      try {
        const [subRes, gmpRes, compRes] = await Promise.all([
          fetch(`${this.baseUrl}/subscription?symbol=${encodeURIComponent(found.symbol)}&history=true`),
          fetch(`${this.baseUrl}/gmp?symbol=${encodeURIComponent(found.symbol)}`),
          fetch(`${this.baseUrl}/company?symbol=${encodeURIComponent(found.symbol)}`)
        ]);

        if (subRes.ok) {
          const subJson = await subRes.json();
          const subData = subJson.data || subJson;
          if (subData) {
            const latest = Array.isArray(subData.history) && subData.history.length
              ? subData.history[subData.history.length - 1]
              : subData;
            found.subscription = {
              qib: Number(latest.qib ?? latest.qibTimes ?? subData.qib ?? found.subscription.qib),
              nii: Number(latest.nii ?? latest.niiTimes ?? subData.nii ?? found.subscription.nii),
              retail: Number(latest.retail ?? latest.retailTimes ?? subData.retail ?? found.subscription.retail),
              employee: Number(latest.employee ?? subData.employee ?? 0),
              total: Number(latest.total ?? latest.totalTimes ?? subData.total ?? found.subscription.total),
              lastUpdated: latest.updatedAt || subData.updatedAt || 'Live EJI Subscription Feed',
              history: Array.isArray(subData.history) ? subData.history : []
            };
          }
        }

        if (gmpRes.ok) {
          const gmpJson = await gmpRes.json();
          const gmpData = gmpJson.data || gmpJson;
          if (gmpData) {
            const rawHistory = Array.isArray(gmpData.history)
              ? gmpData.history
              : Array.isArray(gmpData)
              ? gmpData
              : [];
            const normalizedHistory = rawHistory.map((pt, i) => ({
              date: pt.date || pt.recordedAt || pt.timestamp || `Day ${i + 1}`,
              gmp: Number(pt.gmp ?? pt.value ?? pt.price ?? 0)
            }));
            const curGmp = Number(
              gmpData.gmp ??
                gmpData.current ??
                (normalizedHistory.length ? normalizedHistory[normalizedHistory.length - 1].gmp : 0)
            );
            const prevGmp = Number(
              gmpData.previous ??
                (normalizedHistory.length > 1 ? normalizedHistory[normalizedHistory.length - 2].gmp : curGmp)
            );
            const maxP = found.priceBand.max || 1;
            found.gmp = {
              current: curGmp,
              previous: prevGmp,
              percentage: Number(((curGmp / maxP) * 100).toFixed(2)),
              lastUpdated: gmpData.updatedAt || gmpData.lastUpdated || 'Live EJI GMP Feed',
              source: gmpData.source || 'EJI Unofficial GMP Feed',
              history: normalizedHistory
            };
          }
        }

        if (compRes.ok) {
          const compJson = await compRes.json();
          const perf = compJson.performance;
          const det = compJson.detail;
          if (det && typeof det === 'object') {
            if (det.sector) found.sector = det.sector;
            if (det.about || det.description) found.overview = det.about || det.description;
            if (det.lotSize && !found.lotSize) found.lotSize = Number(det.lotSize);
            if (det.issueSizeCr && !found.issueSizeCr) found.issueSizeCr = Number(det.issueSizeCr);
          }
          if (perf && typeof perf === 'object') {
            const iss = Number(perf.issuePrice || found.priceBand.max || 0);
            const lst = Number(perf.listingPrice || perf.listPrice || 0);
            const cmp = Number(perf.cmp || perf.currentPrice || perf.ltp || lst || 0);
            if (iss && lst) {
              found.listingPerformance = {
                issuePrice: iss,
                listingPrice: lst,
                listingGainPct:
                  typeof perf.listingGainPercent === 'number'
                    ? perf.listingGainPercent
                    : Number((((lst - iss) / iss) * 100).toFixed(2)),
                cmp: cmp,
                currentGainPct:
                  typeof perf.currentGainPercent === 'number'
                    ? perf.currentGainPercent
                    : Number((((cmp - iss) / iss) * 100).toFixed(2))
              };
            }
          }
        }
      } catch (e) {
        console.warn('Live detail enrichment partial warning:', e.message);
      }
    }

    return found;
  }

  async getGMPData(symbol) {
    const ipo = await this.getIPOById(symbol);
    return ipo ? { ...ipo.gmp, companyName: ipo.companyName, symbol: ipo.symbol, priceBand: ipo.priceBand, isDemo: false } : null;
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
