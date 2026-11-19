/**
 * IPO Intelligence - Status-Specific Listing Pages
 * Covers: Upcoming IPOs, Current/Open IPOs, Closed IPOs, and Listed IPOs.
 */
window.ListingPages = {
  async renderStatusPage(container, { status, title, subtitle, icon }) {
    container.innerHTML = window.UIComponents.renderDashboardSkeleton();

    try {
      const [ipos, watchedIds] = await Promise.all([
        window.ipoService.filterIPOs({ status }),
        window.watchlistService.getWatchlistIds()
      ]);

      let boardFilter = 'ALL';

      const draw = (currentBoard) => {
        const filtered = currentBoard === 'ALL' ? ipos : ipos.filter((i) => i.board === currentBoard);

        container.innerHTML = `
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <h4 class="text-white fw-bold mb-0"><i class="bi ${icon} text-info me-2"></i>${title}</h4>
                ${window.UIComponents.demoBadge()}
              </div>
              <p class="text-secondary small mb-0">${subtitle}</p>
            </div>

            <div class="d-flex align-items-center gap-2">
              ${['ALL', 'Mainboard', 'SME'].map((b) => `
                <button type="button" class="filter-chip js-status-board-btn ${currentBoard === b ? 'active' : ''}" data-board="${b}">
                  ${b === 'ALL' ? 'All Boards' : b}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="fintech-card overflow-hidden">
            ${window.UIComponents.renderIPOTable(filtered, watchedIds)}
          </div>
        `;

        container.querySelectorAll('.js-status-board-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            boardFilter = btn.getAttribute('data-board');
            draw(boardFilter);
          });
        });
      };

      draw(boardFilter);
    } catch (err) {
      container.innerHTML = window.UIComponents.renderErrorState('Failed to load IPO listing: ' + err.message);
    }
  }
};
