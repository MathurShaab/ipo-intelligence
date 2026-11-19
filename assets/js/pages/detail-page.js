/**
 * IPO Intelligence - Preliminary IPO Detail View (Linked from Dashboard & Tables)
 * Will be expanded in Phase 3 & Phase 4 with full interactive GMP History Charts and 100-Point Scoring Engine.
 */
window.DetailPage = {
  async render(container, ipoId) {
    container.innerHTML = window.UIComponents.renderDashboardSkeleton();

    try {
      const ipo = await window.ipoService.fetchIPOById(ipoId);
      if (!ipo) {
        container.innerHTML = window.UIComponents.renderEmptyState(
          'Demo IPO Record Not Found',
          'The requested IPO identifier does not exist in the illustrative dataset.',
          '<a href="#dashboard" class="btn btn-primary btn-sm">Return to Dashboard</a>'
        );
        return;
      }

      const isWatched = await window.watchlistService.isWatched(ipo.id);
      const minLotAmount = ipo.priceBand.max * ipo.lotSize;

      container.innerHTML = `
        <div class="mb-3">
          <a href="#dashboard" class="text-secondary text-decoration-none small hover-primary">
            <i class="bi bi-arrow-left me-1"></i> Back to Market Dashboard
          </a>
        </div>

        <!-- Company Header Card -->
        <div class="fintech-card p-4 mb-4">
          <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h3 class="text-white fw-bold mb-0">${ipo.companyName}</h3>
                ${window.UIComponents.boardBadge(ipo.board)}
                ${window.UIComponents.statusBadge(ipo.status)}
                ${window.UIComponents.demoBadge()}
              </div>
              <div class="text-secondary small">
                Symbol: <span class="font-mono text-light">${ipo.symbol}</span> &bull; Sector: <span class="text-light">${ipo.sector}</span>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <button class="btn ${isWatched ? 'btn-primary' : 'btn-outline-primary'} js-toggle-watchlist" data-ipo-id="${ipo.id}">
                <i class="bi ${isWatched ? 'bi-bookmark-fill' : 'bi-bookmark'} me-1"></i>
                ${isWatched ? 'Saved in Watchlist' : 'Add to Watchlist'}
              </button>
              <a href="#gmp-tracker" class="btn btn-outline-info">GMP Tracker</a>
              <a href="#company-analysis" class="btn btn-outline-light">Fundamental Analysis</a>
            </div>
          </div>

          <hr class="border-subtle my-3">
          <p class="text-light small mb-0">${ipo.overview}</p>
        </div>

        <!-- Key Issue Metrics -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-md-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">Price Band</div>
              <div class="kpi-value fs-4">₹${ipo.priceBand.min} – ₹${ipo.priceBand.max}</div>
              <div class="text-secondary small">Per Equity Share</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">Lot Size &amp; Min Retail</div>
              <div class="kpi-value fs-4">${ipo.lotSize} Shares</div>
              <div class="text-secondary small font-mono">₹${minLotAmount.toLocaleString('en-IN')} (1 Lot)</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">Total Issue Size</div>
              <div class="kpi-value fs-4">₹${ipo.issueSizeCr} Cr</div>
              <div class="text-secondary small">Fresh: ₹${ipo.freshIssueCr} Cr | OFS: ₹${ipo.ofsCr} Cr</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">Illustrative Demo GMP</div>
              <div class="kpi-value fs-4 ${ipo.gmp.current >= 0 ? 'text-success' : 'text-danger'}">
                ${ipo.gmp.current >= 0 ? '+' : ''}₹${ipo.gmp.current} (${ipo.gmp.percentage}%)
              </div>
              <div class="text-secondary small">Unofficial sample indicator</div>
            </div>
          </div>
        </div>

        <!-- Schedule & Subscription -->
        <div class="row g-3 mb-4">
          <div class="col-12 col-lg-6">
            <div class="fintech-card p-4 h-100">
              <h6 class="text-white fw-semibold mb-3">Important IPO Timeline (Demo)</h6>
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
            <div class="fintech-card p-4 h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-white fw-semibold mb-0">Subscription Breakdown (Demo)</h6>
                <span class="text-secondary" style="font-size:0.75rem;">${ipo.subscription.lastUpdated}</span>
              </div>
              <div class="table-responsive">
                <table class="table table-sm fintech-table">
                  <thead>
                    <tr><th>Investor Category</th><th class="text-end">Times Subscribed</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Qualified Institutional Buyers (QIB)</td><td class="font-mono text-end">${ipo.subscription.qib.toFixed(2)}x</td></tr>
                    <tr><td>Non-Institutional Investors (NII / HNI)</td><td class="font-mono text-end">${ipo.subscription.nii.toFixed(2)}x</td></tr>
                    <tr><td>Retail Individual Investors (RII)</td><td class="font-mono text-end">${ipo.subscription.retail.toFixed(2)}x</td></tr>
                    <tr class="fw-bold text-info"><td>Total Subscription</td><td class="font-mono text-end">${ipo.subscription.total.toFixed(2)}x</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Strengths & Risks -->
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <div class="fintech-card p-4 h-100">
              <h6 class="text-success fw-semibold mb-3"><i class="bi bi-plus-circle me-2"></i>Key Positives (Illustrative)</h6>
              <ul class="small text-light ps-3 mb-0 d-flex flex-column gap-2">
                ${ipo.positives.map((p) => `<li>${p}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="fintech-card p-4 h-100">
              <h6 class="text-warning fw-semibold mb-3"><i class="bi bi-dash-circle me-2"></i>Key Negatives (Illustrative)</h6>
              <ul class="small text-light ps-3 mb-0 d-flex flex-column gap-2">
                ${ipo.negatives.map((n) => `<li>${n}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="fintech-card p-4 h-100">
              <h6 class="text-danger fw-semibold mb-3"><i class="bi bi-shield-exclamation me-2"></i>Risk Factors (Illustrative)</h6>
              <ul class="small text-light ps-3 mb-0 d-flex flex-column gap-2">
                ${ipo.risks.map((r) => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = window.UIComponents.renderErrorState('Error rendering IPO detail page: ' + err.message);
    }
  }
};
