/**
 * IPO Intelligence - Phase 3 Complete GMP Tracker Page
 * Features:
 * - Unofficial Grey Market Premium (GMP) Disclaimer Banner
 * - Interactive IPO Selector & Multi-Day GMP History Chart
 * - Current GMP, GMP %, Previous GMP, Delta, Indicative Listing Price & Gain
 * - Full Cross-IPO GMP Comparison Table with Board & Status Filters
 * - Responsive Mobile & Desktop Layout
 */
window.GMPTrackerPage = {
  charts: {},
  state: {
    selectedId: null,
    boardFilter: 'ALL',
    statusFilter: 'ALL'
  },

  destroyCharts() {
    Object.values(this.charts).forEach((c) => {
      if (c && typeof c.destroy === 'function') c.destroy();
    });
    this.charts = {};
  },

  async render(container, preselectedId = null) {
    this.destroyCharts();
    if (preselectedId) {
      this.state.selectedId = preselectedId;
    }

    container.innerHTML = window.UIComponents.renderDashboardSkeleton();

    try {
      const allIPOs = await window.ipoService.fetchAllIPOs();
      if (!allIPOs || allIPOs.length === 0) {
        container.innerHTML = window.UIComponents.renderEmptyState(
          'No IPO Records Available',
          'No IPO records are currently loaded to display GMP tracking.'
        );
        return;
      }

      // Default to first IPO with GMP history or first available IPO
      const selectedIPO =
        allIPOs.find((i) => i.id === this.state.selectedId) ||
        allIPOs.find((i) => i.gmp && i.gmp.history && i.gmp.history.length > 0) ||
        allIPOs[0];
      this.state.selectedId = selectedIPO.id;

      // Enrich selected IPO in case live provider needs per-symbol GMP fetch
      const enrichedIPO = (await window.ipoService.fetchIPOById(selectedIPO.id)) || selectedIPO;

      const curGmp = enrichedIPO.gmp?.current ?? 0;
      const prevGmp = enrichedIPO.gmp?.previous ?? curGmp;
      const delta = curGmp - prevGmp;
      const maxPrice = enrichedIPO.priceBand?.max || 0;
      const gmpPct = maxPrice > 0 ? ((curGmp / maxPrice) * 100).toFixed(2) : (enrichedIPO.gmp?.percentage ?? 0);
      const indicativePrice = maxPrice > 0 ? maxPrice + curGmp : null;
      const lotGain = enrichedIPO.lotSize ? curGmp * enrichedIPO.lotSize : null;

      const filteredList = allIPOs.filter((item) => {
        const matchBoard = this.state.boardFilter === 'ALL' || item.board === this.state.boardFilter;
        const matchStatus = this.state.statusFilter === 'ALL' || item.status === this.state.statusFilter;
        return matchBoard && matchStatus;
      });

      container.innerHTML = `
        <!-- Unofficial Data Disclaimer Banner -->
        <div class="alert border-warning bg-warning-subtle text-warning d-flex align-items-start gap-3 mb-4" role="alert">
          <i class="bi bi-exclamation-triangle-fill fs-5 mt-1"></i>
          <div class="small">
            <strong>Unofficial Grey Market Premium (GMP) Disclaimer:</strong>
            Grey Market Premium figures are unregulated, informal, and speculative indicators. They do not represent official NSE/BSE exchange quotes and <strong>do not guarantee actual listing gains or losses</strong>.
          </div>
        </div>

        <!-- Header & IPO Selector -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <h4 class="text-white fw-bold mb-0"><i class="bi bi-activity text-info me-2"></i>Grey Market Premium (GMP) Tracker</h4>
              ${enrichedIPO.isDemo ? window.UIComponents.demoBadge() : '<span class="badge bg-success-subtle text-success border border-success-subtle">LIVE EJI</span>'}
            </div>
            <p class="text-secondary small mb-0">Track current vs. previous GMP trends, percentage premium, and indicative listing estimates.</p>
          </div>

          <div class="d-flex align-items-center gap-2">
            <select id="gmp-ipo-selector" class="form-select form-select-sm bg-surface-2 border-subtle text-white" style="min-width: 240px;">
              ${allIPOs
                .map(
                  (item) =>
                    `<option value="${item.id}" ${item.id === enrichedIPO.id ? 'selected' : ''}>${item.companyName} (${item.symbol})</option>`
                )
                .join('')}
            </select>
            <a href="#ipo-detail/${enrichedIPO.id}" class="btn btn-sm btn-outline-info text-nowrap">Full Detail</a>
          </div>
        </div>

        <!-- Selected IPO GMP KPI Cards (2 cols mobile, 4 cols desktop) -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-lg-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">Current GMP</div>
              <div class="kpi-value fs-4 ${curGmp > 0 ? 'text-success' : curGmp < 0 ? 'text-danger' : 'text-white'}">
                ${curGmp > 0 ? '+' : ''}₹${curGmp}
              </div>
              <div class="font-mono small ${delta >= 0 ? 'text-success' : 'text-danger'}">
                ${delta >= 0 ? '▲ +' : '▼ '}₹${delta} vs Previous (₹${prevGmp})
              </div>
            </div>
          </div>

          <div class="col-6 col-lg-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">GMP Percentage</div>
              <div class="kpi-value fs-4 ${Number(gmpPct) >= 0 ? 'text-warning' : 'text-danger'}">
                ${Number(gmpPct) >= 0 ? '+' : ''}${gmpPct}%
              </div>
              <div class="text-secondary" style="font-size:0.74rem;">
                Over upper band ${maxPrice ? `(₹${maxPrice})` : ''}
              </div>
            </div>
          </div>

          <div class="col-6 col-lg-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">Indicative Listing Price</div>
              <div class="kpi-value fs-4 text-info">
                ${indicativePrice ? `₹${indicativePrice}` : 'TBA'}
              </div>
              <div class="text-secondary font-mono" style="font-size:0.74rem;">
                ${lotGain !== null ? `Est. 1-Lot Gain: ${lotGain >= 0 ? '+' : ''}₹${lotGain.toLocaleString('en-IN')}` : 'Lot size TBA'}
              </div>
            </div>
          </div>

          <div class="col-6 col-lg-3">
            <div class="kpi-card">
              <div class="text-secondary small mb-1">Feed Metadata</div>
              <div class="fw-semibold text-white small mt-1">${enrichedIPO.gmp?.source || 'IPO Intelligence Feed'}</div>
              <div class="text-secondary mt-1" style="font-size:0.72rem;">
                Updated: ${enrichedIPO.gmp?.lastUpdated || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Multi-Day GMP History Chart -->
        <div class="fintech-card p-3 p-md-4 mb-4">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <div>
              <h6 class="text-white fw-semibold mb-0">GMP Trend History &mdash; ${enrichedIPO.companyName}</h6>
              <span class="text-secondary small">Daily indicative grey market movement (₹ per share)</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              ${window.UIComponents.boardBadge(enrichedIPO.board)}
              ${window.UIComponents.statusBadge(enrichedIPO.status)}
            </div>
          </div>

          ${
            enrichedIPO.gmp?.history && enrichedIPO.gmp.history.length > 0
              ? `<div class="chart-wrapper"><canvas id="gmpHistoryMainChart"></canvas></div>`
              : `<div class="p-4 rounded bg-surface-2 border border-subtle text-center">
                   <i class="bi bi-activity text-secondary fs-3 d-block mb-2"></i>
                   <div class="text-light small fw-semibold">No Historical GMP Series Reported Yet for ${enrichedIPO.companyName}</div>
                   <div class="text-secondary small mt-1">Select another IPO from the dropdown above or check back as grey market quotes update.</div>
                 </div>`
          }
        </div>

        <!-- All IPOs GMP Tracker Matrix -->
        <div class="fintech-card overflow-hidden">
          <div class="p-3 p-md-4 border-bottom border-subtle d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h5 class="text-white fw-semibold mb-1">All Tracked IPOs — GMP Monitor</h5>
              <p class="text-secondary small mb-0">Click any row's chart button to inspect its GMP trajectory.</p>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <div class="d-flex gap-1">
                ${['ALL', 'Mainboard', 'SME']
                  .map(
                    (b) =>
                      `<button type="button" class="filter-chip js-gmp-board ${this.state.boardFilter === b ? 'active' : ''}" data-board="${b}">${
                        b === 'ALL' ? 'All Boards' : b
                      }</button>`
                  )
                  .join('')}
              </div>
              <div class="d-flex flex-wrap gap-1">
                ${['ALL', 'Upcoming', 'Open', 'Closed', 'Listed']
                  .map(
                    (s) =>
                      `<button type="button" class="filter-chip js-gmp-status ${this.state.statusFilter === s ? 'active' : ''}" data-status="${s}">${
                        s === 'ALL' ? 'All Status' : s
                      }</button>`
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover fintech-table align-middle">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Price Band</th>
                  <th>Current GMP</th>
                  <th>Prev GMP</th>
                  <th>Est. Listing</th>
                  <th>Indicative Gain</th>
                  <th>Last Updated</th>
                  <th class="text-end">Inspect</th>
                </tr>
              </thead>
              <tbody>
                ${filteredList
                  .map((item) => {
                    const g = item.gmp?.current ?? 0;
                    const p = item.gmp?.previous ?? g;
                    const maxP = item.priceBand?.max || 0;
                    const estP = maxP > 0 ? maxP + g : null;
                    const pct = maxP > 0 ? ((g / maxP) * 100).toFixed(2) : (item.gmp?.percentage ?? 0);
                    const cls = g > 0 ? 'text-success' : g < 0 ? 'text-danger' : 'text-secondary';

                    return `
                      <tr class="${item.id === enrichedIPO.id ? 'table-active' : ''}">
                        <td>
                          <a href="#ipo-detail/${item.id}" class="text-white fw-semibold text-decoration-none d-block">${item.companyName}</a>
                          <div class="d-flex align-items-center gap-1 mt-1">
                            <span class="font-mono text-secondary" style="font-size:0.72rem;">${item.symbol}</span>
                            ${window.UIComponents.boardBadge(item.board)}
                            ${item.isDemo ? window.UIComponents.demoBadge() : ''}
                          </div>
                        </td>
                        <td>${window.UIComponents.statusBadge(item.status)}</td>
                        <td class="font-mono">${maxP ? `₹${item.priceBand.min}–₹${maxP}` : 'TBA'}</td>
                        <td class="font-mono fw-bold ${cls}">${g > 0 ? '+' : ''}₹${g}</td>
                        <td class="font-mono text-secondary">₹${p}</td>
                        <td class="font-mono text-info">${estP ? `₹${estP}` : '—'}</td>
                        <td class="font-mono fw-semibold ${cls}">${Number(pct) >= 0 ? '+' : ''}${pct}%</td>
                        <td class="text-secondary small">${item.gmp?.lastUpdated || '—'}</td>
                        <td class="text-end">
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-info js-select-gmp-ipo" data-id="${item.id}" title="View GMP Chart">
                              <i class="bi bi-graph-up"></i>
                            </button>
                            <a href="#ipo-detail/${item.id}" class="btn btn-outline-secondary">Details</a>
                          </div>
                        </td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Bind selector and filter events
      const selector = document.getElementById('gmp-ipo-selector');
      if (selector) {
        selector.addEventListener('change', (e) => {
          this.render(container, e.target.value);
        });
      }

      container.querySelectorAll('.js-select-gmp-ipo').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.render(container, id);
        });
      });

      container.querySelectorAll('.js-gmp-board').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.state.boardFilter = btn.getAttribute('data-board');
          this.render(container, this.state.selectedId);
        });
      });

      container.querySelectorAll('.js-gmp-status').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.state.statusFilter = btn.getAttribute('data-status');
          this.render(container, this.state.selectedId);
        });
      });

      // Render main GMP History Chart
      if (typeof Chart !== 'undefined' && enrichedIPO.gmp?.history && enrichedIPO.gmp.history.length > 0) {
        const ctx = document.getElementById('gmpHistoryMainChart');
        if (ctx) {
          this.charts.mainGmp = new Chart(ctx, {
            type: 'line',
            data: {
              labels: enrichedIPO.gmp.history.map((pt) => pt.date),
              datasets: [
                {
                  label: `${enrichedIPO.symbol} GMP (₹)`,
                  data: enrichedIPO.gmp.history.map((pt) => pt.gmp),
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.14)',
                  borderWidth: 2.5,
                  pointRadius: 4,
                  pointBackgroundColor: '#10b981',
                  tension: 0.25,
                  fill: true
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: '#cbd5e1', font: { size: 12 } } }
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
      container.innerHTML = window.UIComponents.renderErrorState('Failed to load GMP Tracker: ' + err.message);
    }
  }
};
