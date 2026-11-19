/**
 * IPO Intelligence - Phased Module Route Views (Phases 3-5 Scaffolded & Connected)
 * Ensures zero dead links across all 12 navigation routes while preserving strict phase discipline.
 */
window.PhasedViews = {
  renderPhaseNotice(container, { title, phaseNumber, phaseScope, icon }) {
    container.innerHTML = `
      <div class="fintech-card p-4 p-md-5">
        <div class="d-flex align-items-center gap-3 mb-3">
          <div class="kpi-icon-box bg-info-subtle text-info fs-4">
            <i class="bi ${icon}"></i>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2">
              <h4 class="text-white fw-bold mb-0">${title}</h4>
              <span class="badge bg-primary-subtle text-primary">Scheduled: Phase ${phaseNumber}</span>
            </div>
            <p class="text-secondary small mb-0">Navigation route active &amp; wired to centralized IPOService.</p>
          </div>
        </div>
        <hr class="border-subtle">
        <p class="text-light small mb-3">${phaseScope}</p>
        <div class="d-flex flex-wrap gap-2">
          <a href="#dashboard" class="btn btn-primary btn-sm"><i class="bi bi-grid-1x2 me-1"></i> Return to Dashboard</a>
          <a href="#open" class="btn btn-outline-info btn-sm">Browse Open Demo IPOs</a>
        </div>
      </div>
    `;
  },

  async renderWatchlist(container) {
    const [allIPOs, watchedIds] = await Promise.all([
      window.ipoService.fetchAllIPOs(),
      window.watchlistService.getWatchlistIds()
    ]);
    const savedIPOs = allIPOs.filter((i) => watchedIds.includes(i.id));

    container.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 class="text-white fw-bold mb-1"><i class="bi bi-bookmark-star text-primary me-2"></i>Saved Watchlist</h4>
          <p class="text-secondary small mb-0">Persisted locally via WatchlistService (localStorage) &mdash; full multi-date tracker expands in Phase 5.</p>
        </div>
        ${window.UIComponents.demoBadge()}
      </div>
      <div class="fintech-card overflow-hidden">
        ${savedIPOs.length > 0
          ? window.UIComponents.renderIPOTable(savedIPOs, watchedIds)
          : window.UIComponents.renderEmptyState(
              'Your Watchlist is Empty',
              'Bookmark any demo IPO from the Dashboard or Listing tables to track its dates and illustrative GMP here.',
              '<a href="#dashboard" class="btn btn-primary btn-sm">Explore Demo IPOs</a>'
            )}
      </div>
    `;
  }
};
