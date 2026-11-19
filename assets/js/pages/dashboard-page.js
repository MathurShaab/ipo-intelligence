/**
 * IPO Intelligence - Main Dashboard Page (Phase 2 Complete Implementation)
 * Displays KPIs, Market Overview Charts, Subscription Overview, Calendar,
 * Recent Listing Performance, and Interactive Filterable IPO Screener.
 */
window.DashboardPage = {
  state: {
    statusFilter: 'ALL',
    boardFilter: 'ALL',
    searchQuery: ''
  },
  charts: {},

  destroyCharts() {
    Object.values(this.charts).forEach((chart) => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts = {};
  },

  async render(container, initialSearch = '') {
    this.destroyCharts();
    if (initialSearch !== undefined) {
      this.state.searchQuery = initialSearch;
    }

    container.innerHTML = window.UIComponents.renderDashboardSkeleton();

    try {
      const [metrics, watchedIds] = await Promise.all([
        window.ipoService.getDashboardMetrics(),
        window.watchlistService.getWatchlistIds()
      ]);

      const filteredIPOs = await window.ipoService.filterIPOs({
        status: this.state.statusFilter,
        board: this.state.boardFilter,
        search: this.state.searchQuery
      });

      container.innerHTML = `
        <!-- Top KPI Summary Grid -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-md-4 col-xl-2">
            <div class="kpi-card">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="text-secondary small fw-medium">Upcoming IPOs</span>
                <div class="kpi-icon-box bg-info-subtle text-info"><i class="bi bi-calendar-event"></i></div>
              </div>
              <div class="kpi-value">${metrics.upcomingCount}</div>
              <div class="text-secondary mt-1" style="font-size:0.72rem;">Scheduled pipeline (Demo)</div>
            </div>
          </div>

          <div class="col-6 col-md-4 col-xl-2">
            <div class="kpi-card">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="text-secondary small fw-medium">Currently Open</span>
                <div class="kpi-icon-box bg-success-subtle text-success"><i class="bi bi-broadcast"></i></div>
              </div>
              <div class="kpi-value text-success">${metrics.openCount}</div>
              <div class="text-secondary mt-1" style="font-size:0.72rem;">Active bidding window</div>
            </div>
          </div>

          <div class="col-6 col-md-4 col-xl-2">
            <div class="kpi-card">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="text-secondary small fw-medium">Recently Closed</span>
                <div class="kpi-icon-box bg-warning-subtle text-warning"><i class="bi bi-hourglass-split"></i></div>
              </div>
              <div class="kpi-value">${metrics.closedCount}</div>
              <div class="text-secondary mt-1" style="font-size:0.72rem;">Awaiting allotment/listing</div>
            </div>
          </div>

          <div class="col-6 col-md-4 col-xl-2">
            <div class="kpi-card">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="text-secondary small fw-medium">Recently Listed</span>
                <div class="kpi-icon-box bg-primary-subtle text-primary"><i class="bi bi-graph-up"></i></div>
              </div>
              <div class="kpi-value">${metrics.listedCount}</div>
              <div class="text-secondary mt-1" style="font-size:0.72rem;">Secondary market active</div>
            </div>
          </div>

          <div class="col-6 col-md-4 col-xl-2">
            <div class="kpi-card">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="text-secondary small fw-medium">Total Tracked</span>
                <div class="kpi-icon-box bg-secondary-subtle text-light"><i class="bi bi-layers"></i></div>
              </div>
              <div class="kpi-value">${metrics.totalTracked}</div>
              <div class="text-secondary mt-1" style="font-size:0.72rem;">Mainboard &amp; SME Demo</div>
            </div>
          </div>

          <div class="col-6 col-md-4 col-xl-2">
            <div class="kpi-card">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="text-secondary small fw-medium">Avg. Demo GMP</span>
                <div class="kpi-icon-box bg-warning-subtle text-warning"><i class="bi bi-lightning-charge"></i></div>
              </div>
              <div class="kpi-value ${metrics.avgGmpPct >= 0 ? 'text-warning' : 'text-danger'}">
                ${metrics.avgGmpPct >= 0 ? '+' : ''}${metrics.avgGmpPct}%
              </div>
              <div class="text-secondary mt-1" style="font-size:0.72rem;">Illustrative sample only</div>
            </div>
          </div>
        </div>

        <!-- Analytics Row: Market Overview Chart & Subscription Breakdown Chart -->
        <div class="row g-3 mb-4">
          <div class="col-12 col-lg-5">
            <div class="fintech-card p-3 p-md-4 h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 class="text-white fw-semibold mb-0">IPO Market Overview (Issue Size by Board)</h6>
                  <span class="text-secondary small">Capital raised across demo pipeline (₹ Crores)</span>
                </div>
                ${window.UIComponents.demoBadge()}
              </div>
              <div class="chart-wrapper">
                <canvas id="marketOverviewChart"></canvas>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-7">
            <div class="fintech-card p-3 p-md-4 h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 class="text-white fw-semibold mb-0">Subscription Overview (Open &amp; Closed Issues)</h6>
                  <span class="text-secondary small">Category demand multiplier (QIB vs NII vs Retail)</span>
                </div>
                ${window.UIComponents.demoBadge()}
              </div>
              <div class="chart-wrapper">
                <canvas id="subscriptionOverviewChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle Row: Upcoming IPO Calendar & Recent Listing Performance -->
        <div class="row g-3 mb-4">
          <div class="col-12 col-lg-6">
            <div class="fintech-card p-3 p-md-4 h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 class="text-white fw-semibold mb-0"><i class="bi bi-calendar3 text-info me-2"></i>Upcoming IPO Calendar</h6>
                  <span class="text-secondary small">Scheduled open, close &amp; listing milestones (Demo)</span>
                </div>
                <a href="#upcoming" class="btn btn-sm btn-outline-info">View All</a>
              </div>
              <div class="d-flex flex-column gap-2">
                ${metrics.upcomingIPOs.map((ipo) => `
                  <div class="p-3 rounded bg-surface-2 border border-subtle d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                    <div>
                      <div class="d-flex align-items-center gap-2">
                        <a href="#ipo-detail/${ipo.id}" class="text-white fw-semibold text-decoration-none">${ipo.companyName}</a>
                        ${window.UIComponents.boardBadge(ipo.board)}
                      </div>
                      <div class="text-secondary small mt-1">
                        Band: <span class="font-mono text-light">₹${ipo.priceBand.min}–₹${ipo.priceBand.max}</span> &bull;
                        Size: <span class="font-mono text-light">₹${ipo.issueSizeCr} Cr</span>
                      </div>
                    </div>
                    <div class="text-sm-end">
                      <span class="badge bg-info-subtle text-info font-mono">Opens: ${ipo.dates.open}</span>
                      <div class="text-secondary mt-1" style="font-size:0.72rem;">Est. Listing: ${ipo.dates.listing}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6">
            <div class="fintech-card p-3 p-md-4 h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 class="text-white fw-semibold mb-0"><i class="bi bi-award text-success me-2"></i>Recent Listing Performance</h6>
                  <span class="text-secondary small">Issue price vs debut listing &amp; current market price (Demo)</span>
                </div>
                <a href="#listed" class="btn btn-sm btn-outline-secondary">All Listed</a>
              </div>
              <div class="table-responsive">
                <table class="table table-sm fintech-table align-middle">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Issue</th>
                      <th>Listing</th>
                      <th>Debut Gain</th>
                      <th>CMP</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${metrics.listedIPOs.length === 0 ? `
                      <tr><td colspan="5" class="text-center text-secondary py-3 small">No listed IPO records returned yet.</td></tr>
                    ` : metrics.listedIPOs.slice(0, 8).map((ipo) => {
                      const lp = ipo.listingPerformance;
                      const issuePrice = lp?.issuePrice ?? ipo.priceBand?.max ?? null;
                      const listingPrice = lp?.listingPrice ?? null;
                      const gainPct = typeof lp?.listingGainPct === 'number' ? lp.listingGainPct : null;
                      const cmp = lp?.cmp ?? null;
                      const gainCls = gainPct === null ? 'text-secondary' : gainPct >= 0 ? 'text-success' : 'text-danger';
                      return `
                        <tr>
                          <td>
                            <a href="#ipo-detail/${ipo.id}" class="text-white fw-medium text-decoration-none d-block">${ipo.companyName}</a>
                            <span class="text-secondary" style="font-size:0.7rem;">${ipo.board} &bull; Listed ${ipo.dates.listing}</span>
                          </td>
                          <td class="font-mono">${issuePrice ? '₹' + issuePrice : '—'}</td>
                          <td class="font-mono">${listingPrice ? '₹' + listingPrice : '—'}</td>
                          <td class="font-mono fw-semibold ${gainCls}">${gainPct !== null ? (gainPct >= 0 ? '+' : '') + gainPct.toFixed(2) + '%' : 'Pending'}</td>
                          <td class="font-mono text-light">${cmp ? '₹' + cmp : '—'}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Master Filterable IPO Screener Table -->
        <div class="fintech-card overflow-hidden">
          <div class="p-3 p-md-4 border-bottom border-subtle">
            <div class="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3">
              <div>
                <h5 class="text-white fw-semibold mb-1">IPO Research Screener (Demo Dataset)</h5>
                <p class="text-secondary small mb-0">Filter across Mainboard, SME, Upcoming, Open, Closed, and Listed IPOs.</p>
              </div>

              <!-- Filter Controls -->
              <div class="d-flex flex-wrap align-items-center gap-2">
                <!-- Board Filters -->
                <div class="btn-group btn-group-sm" role="group" aria-label="Board Filter">
                  ${['ALL', 'Mainboard', 'SME'].map((b) => `
                    <button type="button" class="filter-chip ${this.state.boardFilter === b ? 'active' : ''}" data-board="${b}">
                      ${b === 'ALL' ? 'All Boards' : b}
                    </button>
                  `).join('')}
                </div>

                <span class="text-secondary d-none d-md-inline">|</span>

                <!-- Status Filters -->
                <div class="d-flex flex-wrap gap-1" role="group" aria-label="Status Filter">
                  ${['ALL', 'Upcoming', 'Open', 'Closed', 'Listed'].map((s) => `
                    <button type="button" class="filter-chip ${this.state.statusFilter === s ? 'active' : ''}" data-status="${s}">
                      ${s === 'ALL' ? 'All Status' : s}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Secondary Search Bar inside Screener -->
            <div class="row g-2 mt-2">
              <div class="col-12 col-md-6 col-lg-4">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-surface-2 border-subtle text-secondary"><i class="bi bi-funnel"></i></span>
                  <input type="text" id="dashboard-table-search" class="form-control bg-surface-2 border-subtle text-white"
                    value="${this.state.searchQuery}" placeholder="Filter by company, symbol, or sector...">
                  ${this.state.searchQuery || this.state.statusFilter !== 'ALL' || this.state.boardFilter !== 'ALL'
                    ? `<button id="reset-dashboard-filters" class="btn btn-outline-warning" type="button">Reset</button>`
                    : ''}
                </div>
              </div>
              <div class="col-12 col-md-6 col-lg-8 d-flex align-items-center justify-content-md-end">
                <span class="text-secondary small">Showing <strong class="text-white">${filteredIPOs.length}</strong> of ${metrics.totalTracked} demo records</span>
              </div>
            </div>
          </div>

          <div id="dashboard-ipo-table-container">
            ${window.UIComponents.renderIPOTable(filteredIPOs, watchedIds)}
          </div>
        </div>
      `;

      this.initCharts(metrics);
      this.bindEvents(container);
    } catch (err) {
      console.error(err);
      container.innerHTML = window.UIComponents.renderErrorState('Unable to load dashboard demo metrics. ' + err.message);
    }
  },

  initCharts(metrics) {
    if (typeof Chart === 'undefined') return;

    // 1. Market Overview Chart (Issue Size by Status & Board)
    const statuses = ['Upcoming', 'Open', 'Closed', 'Listed'];
    const mainboardTotals = statuses.map((st) =>
      metrics.allIPOs
        .filter((i) => i.status === st && i.board === 'Mainboard')
        .reduce((sum, i) => sum + i.issueSizeCr, 0)
    );
    const smeTotals = statuses.map((st) =>
      metrics.allIPOs
        .filter((i) => i.status === st && i.board === 'SME')
        .reduce((sum, i) => sum + i.issueSizeCr, 0)
    );

    const marketCtx = document.getElementById('marketOverviewChart');
    if (marketCtx) {
      this.charts.market = new Chart(marketCtx, {
        type: 'bar',
        data: {
          labels: statuses,
          datasets: [
            {
              label: 'Mainboard (₹ Cr)',
              data: mainboardTotals,
              backgroundColor: '#3b82f6',
              borderRadius: 6
            },
            {
              label: 'SME (₹ Cr)',
              data: smeTotals,
              backgroundColor: '#a855f7',
              borderRadius: 6
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

    // 2. Subscription Overview Chart (Open & Closed IPOs)
    const activeSubIPOs = [...metrics.openIPOs, ...metrics.closedIPOs];
    const subCtx = document.getElementById('subscriptionOverviewChart');
    if (subCtx) {
      this.charts.subscription = new Chart(subCtx, {
        type: 'bar',
        data: {
          labels: activeSubIPOs.map((i) => i.symbol),
          datasets: [
            {
              label: 'QIB (x)',
              data: activeSubIPOs.map((i) => i.subscription.qib),
              backgroundColor: '#38bdf8',
              borderRadius: 4
            },
            {
              label: 'NII / HNI (x)',
              data: activeSubIPOs.map((i) => i.subscription.nii),
              backgroundColor: '#f59e0b',
              borderRadius: 4
            },
            {
              label: 'Retail (x)',
              data: activeSubIPOs.map((i) => i.subscription.retail),
              backgroundColor: '#10b981',
              borderRadius: 4
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
  },

  bindEvents(container) {
    container.querySelectorAll('[data-board]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.state.boardFilter = btn.getAttribute('data-board');
        this.render(container, this.state.searchQuery);
      });
    });

    container.querySelectorAll('[data-status]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.state.statusFilter = btn.getAttribute('data-status');
        this.render(container, this.state.searchQuery);
      });
    });

    const tableSearch = document.getElementById('dashboard-table-search');
    if (tableSearch) {
      tableSearch.addEventListener('input', async (e) => {
        this.state.searchQuery = e.target.value;
        const [filtered, watchedIds] = await Promise.all([
          window.ipoService.filterIPOs({
            status: this.state.statusFilter,
            board: this.state.boardFilter,
            search: this.state.searchQuery
          }),
          window.watchlistService.getWatchlistIds()
        ]);
        const tblContainer = document.getElementById('dashboard-ipo-table-container');
        if (tblContainer) {
          tblContainer.innerHTML = window.UIComponents.renderIPOTable(filtered, watchedIds);
        }
      });
    }

    const resetBtn = document.getElementById('reset-dashboard-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.state = { statusFilter: 'ALL', boardFilter: 'ALL', searchQuery: '' };
        const globalSearch = document.getElementById('global-search-input');
        if (globalSearch) globalSearch.value = '';
        this.render(container, '');
      });
    }
  }
};