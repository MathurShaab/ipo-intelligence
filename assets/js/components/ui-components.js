/**
 * IPO Intelligence - Reusable UI Component Library
 * Provides standardized fintech cards, badges, loading skeletons, empty states, and tables.
 */
window.UIComponents = {
  formatCurrency(val) {
    if (val === null || val === undefined || isNaN(val)) return '—';
    return '₹' + Number(val).toLocaleString('en-IN');
  },

  formatCr(val) {
    if (val === null || val === undefined || isNaN(val)) return '—';
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Cr';
  },

  statusBadge(status) {
    const map = {
      Open: '<span class="status-pill status-open"><i class="bi bi-circle-fill" style="font-size:0.45rem;"></i> Open</span>',
      Upcoming: '<span class="status-pill status-upcoming"><i class="bi bi-clock"></i> Upcoming</span>',
      Closed: '<span class="status-pill status-closed"><i class="bi bi-lock-fill"></i> Closed</span>',
      Listed: '<span class="status-pill status-listed"><i class="bi bi-check-circle-fill"></i> Listed</span>'
    };
    return map[status] || `<span class="badge bg-secondary">${status}</span>`;
  },

  boardBadge(board) {
    const cls = board === 'Mainboard' ? 'badge-mainboard' : 'badge-sme';
    return `<span class="badge ${cls}">${board}</span>`;
  },

  demoBadge() {
    return `<span class="badge badge-demo" title="Illustrative Demo Record">DEMO DATA</span>`;
  },

  gmpDisplay(gmp, maxPrice) {
    if (!gmp) return '<span class="text-secondary">—</span>';
    const sign = gmp.current > 0 ? '+' : '';
    const colorClass = gmp.current > 0 ? 'text-success' : gmp.current < 0 ? 'text-danger' : 'text-secondary';
    const estPrice = maxPrice ? maxPrice + gmp.current : null;
    return `
      <div class="font-mono fw-semibold ${colorClass}">${sign}₹${gmp.current} (${sign}${gmp.percentage.toFixed(1)}%)</div>
      ${estPrice ? `<div class="text-secondary" style="font-size:0.72rem;">Est. Listing: ₹${estPrice}</div>` : ''}
    `;
  },

  renderDashboardSkeleton() {
    return `
      <div class="row g-3 mb-4">
        ${Array(6).fill(`
          <div class="col-6 col-md-4 col-xl-2">
            <div class="kpi-card">
              <div class="skeleton mb-2" style="height:14px;width:60%;"></div>
              <div class="skeleton mb-2" style="height:28px;width:45%;"></div>
              <div class="skeleton" style="height:12px;width:80%;"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="fintech-card p-4">
        <div class="skeleton mb-3" style="height:20px;width:30%;"></div>
        <div class="skeleton mb-2" style="height:42px;width:100%;"></div>
        <div class="skeleton mb-2" style="height:42px;width:100%;"></div>
        <div class="skeleton" style="height:42px;width:100%;"></div>
      </div>
    `;
  },

  renderEmptyState(title, description, actionHtml = '') {
    return `
      <div class="fintech-card p-5 text-center my-3">
        <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-surface-2 text-info mb-3" style="width:54px;height:54px;">
          <i class="bi bi-inbox fs-4"></i>
        </div>
        <h5 class="text-white fw-semibold mb-1">${title}</h5>
        <p class="text-secondary small mx-auto mb-3" style="max-width:460px;">${description}</p>
        ${actionHtml}
      </div>
    `;
  },

  renderErrorState(message) {
    return `
      <div class="alert alert-danger border-danger bg-danger-subtle text-danger d-flex align-items-center gap-3 my-3" role="alert">
        <i class="bi bi-exclamation-triangle-fill fs-4"></i>
        <div>
          <div class="fw-bold">Data Retrieval Error</div>
          <div class="small">${message}</div>
        </div>
      </div>
    `;
  },

  renderIPOTable(ipos, watchedIds = []) {
    if (!ipos || ipos.length === 0) {
      return this.renderEmptyState(
        'No Matching Demo IPO Records',
        'No IPOs matched your selected board, status, or search filter. Reset filters to view all illustrative records.'
      );
    }

    const rows = ipos.map((ipo) => {
      const isWatched = watchedIds.includes(ipo.id);
      const minInvest = ipo.lotSize ? ipo.priceBand.max * ipo.lotSize : null;
      const subText = ipo.subscription && ipo.subscription.total > 0
        ? `<span class="font-mono fw-semibold text-info">${ipo.subscription.total.toFixed(2)}x</span>`
        : `<span class="text-secondary small">Awaiting</span>`;

      const listingCell = ipo.listingPerformance
        ? `<span class="font-mono fw-semibold ${ipo.listingPerformance.listingGainPct >= 0 ? 'text-success' : 'text-danger'}">
             ₹${ipo.listingPerformance.listingPrice} (${ipo.listingPerformance.listingGainPct >= 0 ? '+' : ''}${ipo.listingPerformance.listingGainPct.toFixed(2)}%)
           </span>`
        : `<span class="text-secondary small">${ipo.dates.listing}</span>`;

      return `
        <tr>
          <td>
            <div class="d-flex align-items-start gap-2">
              <div>
                <a href="#ipo-detail/${ipo.id}" class="text-white fw-semibold text-decoration-none hover-primary d-block">
                  ${ipo.companyName}
                </a>
                <div class="d-flex flex-wrap align-items-center gap-1 mt-1">
                  <span class="font-mono text-secondary" style="font-size:0.72rem;">${ipo.symbol}</span>
                  ${this.boardBadge(ipo.board)}
                  ${ipo.isDemo ? this.demoBadge() : '<span class="badge bg-success-subtle text-success border border-success-subtle" style="font-size:0.65rem;">LIVE EJI</span>'}
                </div>
              </div>
            </div>
          </td>
          <td>${this.statusBadge(ipo.status)}</td>
          <td>
            <div class="font-mono text-white">₹${ipo.priceBand.min} – ₹${ipo.priceBand.max}</div>
            <div class="text-secondary" style="font-size:0.72rem;">${ipo.lotSize ? `Lot: ${ipo.lotSize} sh (${this.formatCurrency(minInvest)})` : 'Lot size TBA'}</div>
          </td>
          <td class="font-mono">${this.formatCr(ipo.issueSizeCr)}</td>
          <td>
            <div class="small text-light">${ipo.dates.open}</div>
            <div class="text-secondary" style="font-size:0.72rem;">to ${ipo.dates.close}</div>
          </td>
          <td>${subText}</td>
          <td>${this.gmpDisplay(ipo.gmp, ipo.priceBand.max)}</td>
          <td>${listingCell}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button class="btn ${isWatched ? 'btn-primary' : 'btn-outline-secondary'} js-toggle-watchlist" data-ipo-id="${ipo.id}" title="${isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}">
                <i class="bi ${isWatched ? 'bi-bookmark-fill' : 'bi-bookmark'}"></i>
              </button>
              <a href="#ipo-detail/${ipo.id}" class="btn btn-outline-info">
                Analyze
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="table-responsive">
        <table class="table table-hover fintech-table align-middle">
          <thead>
            <tr>
              <th>Company / Board</th>
              <th>Status</th>
              <th>Price Band &amp; Lot</th>
              <th>Issue Size</th>
              <th>Offer Window</th>
              <th>Subscription</th>
              <th>Demo GMP</th>
              <th>Listing / Date</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const id = 'toast-' + Date.now();
    const bgClass = type === 'success' ? 'text-bg-success' : type === 'warning' ? 'text-bg-warning' : 'text-bg-dark border border-subtle';
    const html = `
      <div id="${id}" class="toast align-items-center ${bgClass}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body small">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    const toastEl = document.getElementById(id);
    const toast = new bootstrap.Toast(toastEl, { delay: 2600 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }
};
