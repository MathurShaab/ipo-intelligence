/**
 * IPO Intelligence - Phase 5 Multi-IPO Side-by-Side Comparison Page
 * Compares up to 4 IPOs across: Revenue growth, PAT growth, ROE, ROCE, P/E,
 * Debt-to-Equity, Issue size, Subscription, GMP, IPO score, and Risk score.
 */
window.ComparisonPage = {
  selectedIds: [],

  async render(container) {
    container.innerHTML = window.UIComponents.renderDashboardSkeleton();

    try {
      const allIPOs = await window.ipoService.fetchAllIPOs();
      if (!allIPOs || allIPOs.length === 0) {
        container.innerHTML = window.UIComponents.renderEmptyState(
          'No IPO Records Available',
          'No IPOs are available for side-by-side comparison.'
        );
        return;
      }

      if (this.selectedIds.length === 0) {
        this.selectedIds = allIPOs.slice(0, Math.min(3, allIPOs.length)).map((i) => i.id);
      }

      const selectedIPOs = this.selectedIds
        .map((id) => allIPOs.find((item) => item.id === id))
        .filter(Boolean);

      const weights = window.IPOScoringEngine.getWeights();
      const analyzed = selectedIPOs.map((ipo) => ({
        ipo,
        score: window.IPOScoringEngine.analyzeIPO(ipo, weights)
      }));

      const metricsRows = [
        { label: 'Board / Segment', render: (a) => window.UIComponents.boardBadge(a.ipo.board) },
        { label: 'Current Status', render: (a) => window.UIComponents.statusBadge(a.ipo.status) },
        {
          label: 'Price Band',
          render: (a) =>
            a.ipo.priceBand.max > 0 ? `₹${a.ipo.priceBand.min} – ₹${a.ipo.priceBand.max}` : 'TBA'
        },
        {
          label: 'Issue Size',
          render: (a) => (a.ipo.issueSizeCr > 0 ? `₹${a.ipo.issueSizeCr.toLocaleString('en-IN')} Cr` : 'TBA')
        },
        {
          label: 'Total Subscription',
          render: (a) =>
            a.ipo.subscription?.total > 0 ? `${a.ipo.subscription.total.toFixed(2)}x` : 'Awaiting'
        },
        {
          label: 'Indicative GMP',
          render: (a) => {
            const g = a.ipo.gmp?.current ?? 0;
            const p = a.ipo.gmp?.percentage ?? 0;
            const cls = g > 0 ? 'text-success' : g < 0 ? 'text-danger' : 'text-secondary';
            return `<span class="${cls} fw-semibold">${g > 0 ? '+' : ''}₹${g} (${p}%)</span>`;
          }
        },
        {
          label: 'Revenue Growth (YoY)',
          render: (a) => (a.ipo.financials ? `+${a.ipo.financials.revenueGrowthPct}%` : '—')
        },
        {
          label: 'PAT Growth (YoY)',
          render: (a) => (a.ipo.financials ? `+${a.ipo.financials.patGrowthPct}%` : '—')
        },
        {
          label: 'ROE (%)',
          render: (a) => (a.ipo.financials ? `${a.ipo.financials.roePct}%` : '—')
        },
        {
          label: 'ROCE (%)',
          render: (a) => (a.ipo.financials ? `${a.ipo.financials.rocePct}%` : '—')
        },
        {
          label: 'Post-Issue P/E',
          render: (a) => (a.ipo.financials ? `${a.ipo.financials.pePostIssue}x` : '—')
        },
        {
          label: 'Debt-to-Equity',
          render: (a) => (a.ipo.financials ? `${a.ipo.financials.debtToEquity}x` : '—')
        },
        {
          label: 'Composite IPO Score',
          render: (a) => `<span class="badge bg-primary-subtle text-primary fs-6">${a.score.overallScore} / 100</span>`
        },
        {
          label: 'Illustrative Risk Score',
          render: (a) => {
            const r = a.score.riskScore;
            const cls = r <= 35 ? 'text-success' : r <= 60 ? 'text-warning' : 'text-danger';
            return `<span class="${cls} fw-semibold">${r} / 100 ${r <= 35 ? '(Lower)' : r <= 60 ? '(Moderate)' : '(Higher)'}</span>`;
          }
        }
      ];

      container.innerHTML = `
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 class="text-white fw-bold mb-1"><i class="bi bi-columns-gap text-info me-2"></i>Side-by-Side IPO Comparison</h4>
            <p class="text-secondary small mb-0">Select up to 4 IPOs to benchmark financial growth, return ratios, valuation, GMP, and composite scores.</p>
          </div>
          <div class="d-flex gap-2">
            <select id="comp-add-select" class="form-select form-select-sm bg-surface-2 border-subtle text-white" style="min-width: 220px;">
              <option value="">+ Add IPO to Compare...</option>
              ${allIPOs
                .filter((i) => !this.selectedIds.includes(i.id))
                .map((i) => `<option value="${i.id}">${i.companyName} (${i.symbol})</option>`)
                .join('')}
            </select>
          </div>
        </div>

        <!-- Selected Chips -->
        <div class="d-flex flex-wrap gap-2 mb-4">
          ${selectedIPOs
            .map(
              (item) => `
            <span class="badge bg-surface-2 border border-subtle text-white px-3 py-2 d-inline-flex align-items-center gap-2">
              <span>${item.companyName}</span>
              ${
                selectedIPOs.length > 1
                  ? `<button type="button" class="btn-close btn-close-white js-remove-comp" data-id="${item.id}" style="font-size:0.6rem;" aria-label="Remove"></button>`
                  : ''
              }
            </span>
          `
            )
            .join('')}
        </div>

        <!-- Comparison Matrix Table -->
        <div class="fintech-card overflow-hidden">
          <div class="table-responsive">
            <table class="table table-hover fintech-table align-middle">
              <thead>
                <tr>
                  <th style="min-width: 180px;">Evaluation Metric</th>
                  ${analyzed
                    .map(
                      (a) => `
                    <th style="min-width: 190px;">
                      <a href="#ipo-detail/${a.ipo.id}" class="text-white text-decoration-none d-block">${a.ipo.companyName}</a>
                      <span class="font-mono text-secondary" style="font-size:0.7rem;">${a.ipo.symbol}</span>
                    </th>
                  `
                    )
                    .join('')}
                </tr>
              </thead>
              <tbody>
                ${metricsRows
                  .map(
                    (row) => `
                  <tr>
                    <td class="text-secondary fw-medium">${row.label}</td>
                    ${analyzed.map((a) => `<td class="font-mono">${row.render(a)}</td>`).join('')}
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      const addSel = document.getElementById('comp-add-select');
      if (addSel) {
        addSel.addEventListener('change', (e) => {
          const val = e.target.value;
          if (!val) return;
          if (this.selectedIds.length >= 4) {
            window.UIComponents.showToast('Maximum 4 IPOs can be compared simultaneously. Remove one first.', 'warning');
            return;
          }
          this.selectedIds.push(val);
          this.render(container);
        });
      }

      container.querySelectorAll('.js-remove-comp').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          this.selectedIds = this.selectedIds.filter((x) => x !== id);
          this.render(container);
        });
      });
    } catch (err) {
      container.innerHTML = window.UIComponents.renderErrorState('Comparison page error: ' + err.message);
    }
  }
};
