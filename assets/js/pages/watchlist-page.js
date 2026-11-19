/**
 * IPO Intelligence - Phase 5 Complete Watchlist & Milestone Tracker
 * Persists via WatchlistService (localStorage) with important date countdowns and GMP snapshots.
 */
window.WatchlistPage = {
  async render(container) {
    container.innerHTML = window.UIComponents.renderDashboardSkeleton();

    try {
      const [allIPOs, watchedIds] = await Promise.all([
        window.ipoService.fetchAllIPOs(),
        window.watchlistService.getWatchlistIds()
      ]);

      const savedIPOs = allIPOs.filter((i) => watchedIds.includes(i.id));

      container.innerHTML = `
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 class="text-white fw-bold mb-1"><i class="bi bi-bookmark-star text-primary me-2"></i>Saved Watchlist &amp; Date Tracker</h4>
            <p class="text-secondary small mb-0">Track offer open/close dates, allotment dates, listing milestones, and indicative GMP.</p>
          </div>
          <div class="d-flex gap-2">
            <a href="#comparison" class="btn btn-sm btn-outline-info">Compare IPOs</a>
            <a href="#dashboard" class="btn btn-sm btn-primary">+ Browse More IPOs</a>
          </div>
        </div>

        ${
          savedIPOs.length === 0
            ? window.UIComponents.renderEmptyState(
                'Your Watchlist is Empty',
                'Click the bookmark button on any IPO across the Dashboard, Listings, or Detail pages to track its dates and GMP here.',
                '<a href="#dashboard" class="btn btn-primary btn-sm">Explore IPO Screener</a>'
              )
            : `
          <!-- Watchlist Milestone Cards -->
          <div class="row g-3 mb-4">
            ${savedIPOs
              .map((ipo) => {
                const g = ipo.gmp?.current ?? 0;
                const p = ipo.gmp?.percentage ?? 0;
                const cls = g > 0 ? 'text-success' : g < 0 ? 'text-danger' : 'text-secondary';
                return `
                  <div class="col-12 col-md-6 col-xl-4">
                    <div class="fintech-card p-3 p-md-4 h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                          <div>
                            <a href="#ipo-detail/${ipo.id}" class="text-white fw-bold text-decoration-none d-block">${ipo.companyName}</a>
                            <div class="d-flex align-items-center gap-1 mt-1">
                              <span class="font-mono text-secondary" style="font-size:0.72rem;">${ipo.symbol}</span>
                              ${window.UIComponents.boardBadge(ipo.board)}
                              ${window.UIComponents.statusBadge(ipo.status)}
                            </div>
                          </div>
                          <button class="btn btn-sm btn-outline-danger js-toggle-watchlist" data-ipo-id="${ipo.id}" title="Remove from Watchlist">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>

                        <div class="row g-2 my-2 small">
                          <div class="col-6">
                            <div class="p-2 rounded bg-surface-2 border border-subtle">
                              <div class="text-secondary" style="font-size:0.7rem;">Price Band</div>
                              <div class="font-mono text-white fw-semibold">₹${ipo.priceBand.min}–₹${ipo.priceBand.max}</div>
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="p-2 rounded bg-surface-2 border border-subtle">
                              <div class="text-secondary" style="font-size:0.7rem;">Indicative GMP</div>
                              <div class="font-mono fw-semibold ${cls}">${g > 0 ? '+' : ''}₹${g} (${p}%)</div>
                            </div>
                          </div>
                        </div>

                        <div class="small text-secondary mt-2 d-flex flex-column gap-1">
                          <div class="d-flex justify-content-between"><span>Offer Window:</span><span class="font-mono text-light">${ipo.dates.open} &rarr; ${ipo.dates.close}</span></div>
                          <div class="d-flex justify-content-between"><span>Allotment Date:</span><span class="font-mono text-light">${ipo.dates.allotment}</span></div>
                          <div class="d-flex justify-content-between"><span>Listing Date:</span><span class="font-mono text-info fw-semibold">${ipo.dates.listing}</span></div>
                        </div>
                      </div>

                      <div class="mt-3 pt-2 border-top border-subtle d-flex gap-2">
                        <a href="#ipo-detail/${ipo.id}" class="btn btn-sm btn-outline-info flex-grow-1">Detail</a>
                        <a href="#company-analysis/${ipo.id}" class="btn btn-sm btn-outline-light flex-grow-1">Analysis</a>
                      </div>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        `
        }
      `;
    } catch (err) {
      container.innerHTML = window.UIComponents.renderErrorState('Watchlist error: ' + err.message);
    }
  }
};
