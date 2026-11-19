/**
 * IPO Intelligence - Phase 3 Complete IPO Detail Page
 * Includes: Company Overview, IPO Details, Price Band, Lot Size, Issue Size,
 * Fresh Issue/OFS breakdown, Important Dates, Subscription Breakdown, GMP + GMP History Chart,
 * Financial Highlights, Positives/Negatives/Risks, Preliminary 100-Pt Score Preview, and Documents.
 * Fully responsive for mobile & desktop viewports.
 */
window.DetailPage = {
  charts: {},

  destroyCharts() {
    Object.values(this.charts).forEach((c) => {
      if (c && typeof c.destroy === 'function') c.destroy();
    });
    this.charts = {};
  },

  _computeQuickScore(ipo) {
    // Preliminary transparent 100-pt readiness breakdown (expanded with full fundamental engine in Phase 4)
    let fin = 12, biz = 12, val = 11, gov = 9, struct = 6, sent = 5;
    let availablePts = 0;

    if (ipo.financials) {
      availablePts += 45;
      fin = ipo.financials.patGrowthPct >= 25 ? 21 : ipo.financials.patGrowthPct >= 15 ? 16 : 11;
      biz = ipo.financials.roePct >= 20 ? 17 : ipo.financials.roePct >= 15 ? 13 : 9;
      val = ipo.financials.pePostIssue <= 25 ? 17 : ipo.financials.pePostIssue <= 35 ? 13 : 8;
    }
    if (ipo.issueSizeCr > 0) {
      availablePts += 20;
      struct = ipo.ofsCr === 0 ? 9 : ipo.freshIssueCr >= ipo.ofsCr ? 7 : 5;
    }
    if ((ipo.subscription && ipo.subscription.total > 0) || (ipo.gmp && ipo.gmp.current !== 0)) {
      availablePts += 20;
      const subScore = ipo.subscription.total >= 20 ? 5 : ipo.subscription.total >= 5 ? 4 : 2;
      const gmpScore = ipo.gmp.percentage >= 20 ? 5 : ipo.gmp.percentage > 0 ? 3 : 1;
      sent = Math.min(10, subScore + gmpScore);
    }
    const total = fin + biz + val + gov + struct + sent;
    const confidence = availablePts >= 75 ? 'High' : availablePts >= 40 ? 'Moderate' : 'Preliminary';
    return { total, fin, biz, val, gov, struct, sent, confidence };
  },

  async render(container, ipoId) {
    this.destroyCharts();
    container.innerHTML = window.UIComponents.renderDashboardSkeleton();

    try {
      const [allIPOs, ipo] = await Promise.all([
        window.ipoService.fetchAllIPOs(),
        window.ipoService.fetchIPOById(ipoId)
      ]);

      if (!ipo) {
        container.innerHTML = window.UIComponents.renderEmptyState(
          'IPO Record Not Found',
          'The requested IPO identifier could not be matched in the active provider.',
          '<a href="#dashboard" class="btn btn-primary btn-sm">Return to Dashboard</a>'
        );
        return;
      }

      const isWatched = await window.watchlistService.isWatched(ipo.id);
      const minLotAmount = ipo.lotSize ? ipo.priceBand.max * ipo.lotSize : null;
      const estListingPrice = ipo.priceBand.max ? ipo.priceBand.max + (ipo.gmp?.current || 0) : null;
      const gmpDelta = (ipo.gmp?.current || 0) - (ipo.gmp?.previous || 0);
      const score = this._computeQuickScore(ipo);

      const selectorOptions = allIPOs
        .map(
          (item) =>
            `<option value="${item.id}" ${item.id === ipo.id ? 'selected' : ''}>${item.companyName} (${item.symbol}) — ${item.status}</option>`
        )
        .join('');

      container.innerHTML = `
        <!-- Top Navigation & Quick IPO Switcher Bar -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-2 mb-3">
          <a href="#dashboard" class="text-secondary text-decoration-none small hover-primary d-inline-flex align-items-center">
            <i class="bi bi-arrow-left me-1"></i> Back to Market Dashboard
          </a>

          <div class="d-flex align-items-center gap-2">
            <label for="detail-ipo-switcher" class="text-secondary small text-nowrap d-none d-sm-inline">Switch IPO:</label>
            <select id="detail-ipo-switcher" class="form-select form-select-sm bg-surface-2 border-subtle text-white" style="min-width: 220px;">
              ${selectorOptions}
            </select>
          </div>
        </div>

        <!-- Company Header Card -->
        <div class="fintech-card p-3 p-md-4 mb-4">
          <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h3 class="text-white fw-bold mb-0 fs-4 fs-md-3">${ipo.companyName}</h3>
                ${window.UIComponents.boardBadge(ipo.board)}
                ${window.UIComponents.statusBadge(ipo.status)}
                ${ipo.isDemo ? window.UIComponents.demoBadge() : '<span class="badge bg-success-subtle text-success border border-success-subtle">LIVE EJI</span>'}
              </div>
              <div class="text-secondary small">
                Symbol: <span class="font-mono text-light">${ipo.symbol}</span> &bull;
                Category/Source: <span class="text-light">${ipo.sector}</span>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <button class="btn btn-sm ${isWatched ? 'btn-primary' : 'btn-outline-primary'} js-toggle-watchlist" data-ipo-id="${ipo.id}">
                <i class="bi ${isWatched ? 'bi-bookmark-fill' : 'bi-bookmark'} me-1"></i>
                ${isWatched ? 'Saved in Watchlist' : 'Watchlist'}
              </button>
              <a href="#gmp-tracker/${ipo.id}" class="btn btn-sm btn-outline-info">
                <i class="bi bi-activity me-1"></i> GMP Tracker
              </a>
              <a href="#company-analysis/${ipo.id}" class="btn btn-sm btn-outline-light">
                <i class="bi bi-building-gear me-1"></i> Full Analysis
              </a>
            </div>
          </div>

          <hr class="border-subtle my-3">
          <p class="text-light small mb-0">${ipo.overview}</p>
        </div>

        <!-- Primary Issue KPI Strip (2 cols mobile, 4 cols desktop) -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-lg-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">Price Band</div>
              <div class="kpi-value fs-5 fs-md-4">
                ${ipo.priceBand.max > 0 ? `₹${ipo.priceBand.min} – ₹${ipo.priceBand.max}` : 'TBA'}
              </div>
              <div class="text-secondary" style="font-size:0.74rem;">Per Equity Share</div>
            </div>
          </div>

          <div class="col-6 col-lg-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">Lot Size &amp; Min Retail</div>
              <div class="kpi-value fs-5 fs-md-4">${ipo.lotSize ? `${ipo.lotSize} Shares` : 'TBA'}</div>
              <div class="text-secondary font-mono" style="font-size:0.74rem;">
                ${minLotAmount ? `₹${minLotAmount.toLocaleString('en-IN')} (1 Lot)` : 'Awaiting lot disclosure'}
              </div>
            </div>
          </div>

          <div class="col-6 col-lg-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">Total Issue Size</div>
              <div class="kpi-value fs-5 fs-md-4">${ipo.issueSizeCr > 0 ? `₹${ipo.issueSizeCr.toLocaleString('en-IN')} Cr` : 'TBA'}</div>
              <div class="text-secondary" style="font-size:0.74rem;">
                ${ipo.issueSizeCr > 0 ? `Fresh: ₹${ipo.freshIssueCr} Cr | OFS: ₹${ipo.ofsCr} Cr` : 'Fresh / OFS split TBA'}
              </div>
            </div>
          </div>

          <div class="col-6 col-lg-3">
            <div class="kpi-card">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="text-secondary small">GMP (${ipo.isDemo ? 'Demo' : 'Unofficial'})</span>
                <span class="font-mono small ${gmpDelta >= 0 ? 'text-success' : 'text-danger'}">
                  ${gmpDelta >= 0 ? '+' : ''}₹${gmpDelta} vs prev
                </span>
              </div>
              <div class="kpi-value fs-5 fs-md-4 ${ipo.gmp.current > 0 ? 'text-success' : ipo.gmp.current < 0 ? 'text-danger' : 'text-light'}">
                ${ipo.gmp.current > 0 ? '+' : ''}₹${ipo.gmp.current} (${ipo.gmp.percentage}%)
              </div>
              <div class="text-secondary font-mono" style="font-size:0.74rem;">
                ${estListingPrice ? `Indicative Listing: ₹${estListingPrice}` : 'Indicative listing TBA'}
              </div>
            </div>
          </div>
        </div>

        <!-- GMP Trend Chart & IPO Scoring Breakdown -->
        <div class="row g-3 mb-4">
          <div class="col-12 col-lg-7">
            <div class="fintech-card p-3 p-md-4 h-100">
              <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
                <div>
                  <h6 class="text-white fw-semibold mb-0"><i class="bi bi-graph-up text-info me-2"></i>GMP Trend &amp; Indicative Listing</h6>
                  <span class="text-secondary small">Source: ${ipo.gmp.source} &bull; Updated: ${ipo.gmp.lastUpdated}</span>
                </div>
                <a href="#gmp-tracker/${ipo.id}" class="btn btn-sm btn-outline-info">Open GMP Tracker</a>
              </div>
              ${
                ipo.gmp.history && ipo.gmp.history.length > 0
                  ? `<div class="chart-wrapper"><canvas id="detailGmpChart"></canvas></div>`
                  : `<div class="p-4 rounded bg-surface-2 border border-subtle text-center my-2">
                       <i class="bi bi-bar-chart-line text-secondary fs-3 d-block mb-2"></i>
                       <div class="text-light small fw-semibold">No Multi-Day GMP History Series Available for This Record</div>
                       <div class="text-secondary small mt-1">Current reported GMP: <span class="font-mono text-info">₹${ipo.gmp.current}</span> (${ipo.gmp.percentage}%).</div>
                     </div>`
              }
              <div class="mt-3 p-2 rounded bg-surface-2 border border-subtle text-secondary" style="font-size:0.74rem;">
                <i class="bi bi-info-circle text-warning me-1"></i>
                ${window.IPOConfig.GMP_DISCLAIMER}
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-5">
            <div class="fintech-card p-3 p-md-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 class="text-white fw-semibold mb-0">IPO Readiness Score (100-Pt Model)</h6>
                    <span class="text-secondary small">Data Confidence: <strong class="text-info">${score.confidence}</strong></span>
                  </div>
                  <div class="px-3 py-1 rounded bg-primary-subtle border border-primary-subtle font-mono fw-bold text-primary fs-5">
                    ${score.total}/100
                  </div>
                </div>

                <div class="d-flex flex-column gap-2 small">
                  ${[
                    { label: 'Financial Performance', val: score.fin, max: 25 },
                    { label: 'Business Fundamentals', val: score.biz, max: 20 },
                    { label: 'Valuation Comfort', val: score.val, max: 20 },
                    { label: 'Management & Governance', val: score.gov, max: 15 },
                    { label: 'IPO Structure (Fresh/OFS)', val: score.struct, max: 10 },
                    { label: 'Market Sentiment & Demand', val: score.sent, max: 10 }
                  ]
                    .map(
                      (row) => `
                    <div>
                      <div class="d-flex justify-content-between mb-1">
                        <span class="text-secondary">${row.label}</span>
                        <span class="font-mono text-light">${row.val}/${row.max}</span>
                      </div>
                      <div class="progress bg-surface-2" style="height:6px;">
                        <div class="progress-bar bg-info" style="width:${Math.round((row.val / row.max) * 100)}%"></div>
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <div class="mt-3 pt-2 border-top border-subtle text-secondary" style="font-size:0.72rem;">
                Informational framework only — not an investment recommendation. Full configurable weights available in Phase 4.
              </div>
            </div>
          </div>
        </div>

        <!-- Important Dates & Subscription Breakdown -->
        <div class="row g-3 mb-4">
          <div class="col-12 col-lg-6">
            <div class="fintech-card p-3 p-md-4 h-100">
              <h6 class="text-white fw-semibold mb-3"><i class="bi bi-calendar2-check text-info me-2"></i>Important IPO Schedule</h6>
              <div class="table-responsive">
                <table class="table table-sm fintech-table">
                  <tbody>
                    <tr><td class="text-secondary">IPO Open Date</td><td class="font-mono text-end text-white">${ipo.dates.open}</td></tr>
                    <tr><td class="text-secondary">IPO Close Date</td><td class="font-mono text-end text-white">${ipo.dates.close}</td></tr>
                    <tr><td class="text-secondary">Basis of Allotment</td><td class="font-mono text-end text-white">${ipo.dates.allotment}</td></tr>
                    <tr><td class="text-secondary">Initiation of Refunds</td><td class="font-mono text-end text-white">${ipo.dates.refund}</td></tr>
                    <tr><td class="text-secondary">Credit to Demat Account</td><td class="font-mono text-end text-white">${ipo.dates.demat}</td></tr>
                    <tr><td class="text-secondary">Tentative Listing Date</td><td class="font-mono text-end text-info fw-semibold">${ipo.dates.listing}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6">
            <div class="fintech-card p-3 p-md-4 h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-white fw-semibold mb-0"><i class="bi bi-people text-success me-2"></i>Subscription Breakdown</h6>
                <span class="text-secondary" style="font-size:0.74rem;">${ipo.subscription.lastUpdated}</span>
              </div>
              <div class="table-responsive">
                <table class="table table-sm fintech-table">
                  <thead>
                    <tr><th>Investor Category</th><th class="text-end">Subscription (x)</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Qualified Institutional Buyers (QIB)</td><td class="font-mono text-end">${ipo.subscription.qib > 0 ? ipo.subscription.qib.toFixed(2) + 'x' : '—'}</td></tr>
                    <tr><td>Non-Institutional Investors (NII / HNI)</td><td class="font-mono text-end">${ipo.subscription.nii > 0 ? ipo.subscription.nii.toFixed(2) + 'x' : '—'}</td></tr>
                    <tr><td>Retail Individual Investors (RII)</td><td class="font-mono text-end">${ipo.subscription.retail > 0 ? ipo.subscription.retail.toFixed(2) + 'x' : '—'}</td></tr>
                    <tr class="fw-bold text-info"><td>Total Issue Subscription</td><td class="font-mono text-end">${ipo.subscription.total > 0 ? ipo.subscription.total.toFixed(2) + 'x' : 'Awaiting'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Highlights Snapshot -->
        <div class="fintech-card p-3 p-md-4 mb-4">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <div>
              <h6 class="text-white fw-semibold mb-0"><i class="bi bi-cash-coin text-warning me-2"></i>Financial Highlights &amp; Valuation Snapshot</h6>
              <span class="text-secondary small">Key restated financial metrics (${ipo.isDemo ? 'Illustrative Demo Data' : 'Exchange / Company Filings'})</span>
            </div>
            <a href="#company-analysis/${ipo.id}" class="btn btn-sm btn-outline-light">Deep Fundamental Analysis</a>
          </div>
          ${
            ipo.financials
              ? `<div class="row g-2 g-md-3">
                  <div class="col-6 col-md-4 col-lg-2"><div class="p-2 p-md-3 rounded bg-surface-2 border border-subtle"><div class="text-secondary" style="font-size:0.72rem;">FY26 Revenue</div><div class="font-mono fw-bold text-white">₹${ipo.financials.fy26.revenueCr} Cr</div></div></div>
                  <div class="col-6 col-md-4 col-lg-2"><div class="p-2 p-md-3 rounded bg-surface-2 border border-subtle"><div class="text-secondary" style="font-size:0.72rem;">FY26 PAT</div><div class="font-mono fw-bold text-success">₹${ipo.financials.fy26.patCr} Cr</div></div></div>
                  <div class="col-6 col-md-4 col-lg-2"><div class="p-2 p-md-3 rounded bg-surface-2 border border-subtle"><div class="text-secondary" style="font-size:0.72rem;">EBITDA Margin</div><div class="font-mono fw-bold text-info">${ipo.financials.ebitdaMarginPct}%</div></div></div>
                  <div class="col-6 col-md-4 col-lg-2"><div class="p-2 p-md-3 rounded bg-surface-2 border border-subtle"><div class="text-secondary" style="font-size:0.72rem;">ROE / ROCE</div><div class="font-mono fw-bold text-white">${ipo.financials.roePct}% / ${ipo.financials.rocePct}%</div></div></div>
                  <div class="col-6 col-md-4 col-lg-2"><div class="p-2 p-md-3 rounded bg-surface-2 border border-subtle"><div class="text-secondary" style="font-size:0.72rem;">Debt / Equity</div><div class="font-mono fw-bold text-white">${ipo.financials.debtToEquity}x</div></div></div>
                  <div class="col-6 col-md-4 col-lg-2"><div class="p-2 p-md-3 rounded bg-surface-2 border border-subtle"><div class="text-secondary" style="font-size:0.72rem;">Post-Issue P/E</div><div class="font-mono fw-bold text-warning">${ipo.financials.pePostIssue}x</div></div></div>
                </div>`
              : `<div class="p-3 rounded bg-surface-2 border border-subtle text-secondary small">
                   Multi-year restated P&amp;L and balance sheet ratios are not included in the basic exchange summary for <strong>${ipo.companyName}</strong>. Switch to Demo records or connect DRHP financial feeds in Phase 4.
                 </div>`
          }
        </div>

        <!-- Strengths, Negatives, Risks & Documents -->
        <div class="row g-3">
          <div class="col-12 col-md-6 col-xl-3">
            <div class="fintech-card p-3 p-md-4 h-100">
              <h6 class="text-success fw-semibold mb-3"><i class="bi bi-plus-circle me-2"></i>Positive Factors</h6>
              <ul class="small text-light ps-3 mb-0 d-flex flex-column gap-2">
                ${ipo.positives.map((p) => `<li>${p}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="col-12 col-md-6 col-xl-3">
            <div class="fintech-card p-3 p-md-4 h-100">
              <h6 class="text-warning fw-semibold mb-3"><i class="bi bi-dash-circle me-2"></i>Negative Factors</h6>
              <ul class="small text-light ps-3 mb-0 d-flex flex-column gap-2">
                ${ipo.negatives.map((n) => `<li>${n}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="col-12 col-md-6 col-xl-3">
            <div class="fintech-card p-3 p-md-4 h-100">
              <h6 class="text-danger fw-semibold mb-3"><i class="bi bi-shield-exclamation me-2"></i>Key Risk Factors</h6>
              <ul class="small text-light ps-3 mb-0 d-flex flex-column gap-2">
                ${ipo.risks.map((r) => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="col-12 col-md-6 col-xl-3">
            <div class="fintech-card p-3 p-md-4 h-100">
              <h6 class="text-info fw-semibold mb-3"><i class="bi bi-file-earmark-text me-2"></i>Documents &amp; Sources</h6>
              <div class="d-flex flex-column gap-2">
                ${(ipo.documents && ipo.documents.length
                  ? ipo.documents
                  : [{ title: 'Exchange Filing Reference', type: 'Metadata' }]
                )
                  .map(
                    (doc) => `
                  <div class="p-2 rounded bg-surface-2 border border-subtle d-flex justify-content-between align-items-center gap-2">
                    <span class="small text-light">${doc.title}</span>
                    <span class="badge bg-secondary-subtle text-secondary">${doc.type}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      // Bind quick IPO switcher dropdown
      const switcher = document.getElementById('detail-ipo-switcher');
      if (switcher) {
        switcher.addEventListener('change', (e) => {
          window.location.hash = `#ipo-detail/${e.target.value}`;
        });
      }

      // Render GMP History Line Chart if history points exist
      if (typeof Chart !== 'undefined' && ipo.gmp.history && ipo.gmp.history.length > 0) {
        const ctx = document.getElementById('detailGmpChart');
        if (ctx) {
          this.charts.gmp = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ipo.gmp.history.map((h) => h.date),
              datasets: [
                {
                  label: 'GMP (₹ per share)',
                  data: ipo.gmp.history.map((h) => h.gmp),
                  borderColor: '#38bdf8',
                  backgroundColor: 'rgba(56, 189, 248, 0.14)',
                  borderWidth: 2.5,
                  pointRadius: 4,
                  pointBackgroundColor: '#38bdf8',
                  tension: 0.3,
                  fill: true
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: '#cbd5e1', font: { size: 11 } } }
              },
              scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } }
              }
            }
          });
        }
      }
    } catch (err) {
      console.error(err);
      container.innerHTML = window.UIComponents.renderErrorState('Unable to load IPO detail view: ' + err.message);
    }
  }
};
