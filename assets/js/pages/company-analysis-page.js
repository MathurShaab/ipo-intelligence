/**
 * IPO Intelligence - Phase 4 Company Fundamental Analysis & 100-Point Scoring Page
 * Covers:
 * - All required fundamental metrics (Revenue, Revenue growth, EBITDA, EBITDA margin, PAT, PAT growth, PAT margin, EPS, ROE, ROCE, Debt-to-Equity, P/E, P/B)
 * - Multi-year Financial Growth Chart (FY24-FY26) & Margin/Return Radar/Bar Chart
 * - Business Overview, Industry Overview, Valuation Analysis, Risk Analysis
 * - Positive & Negative Factors + Peer Comparison Table
 * - Interactive Configurable 100-Point IPO Scoring Engine with Weight Sliders & Confidence Meter
 */
window.CompanyAnalysisPage = {
  charts: {},
  selectedId: null,

  destroyCharts() {
    Object.values(this.charts).forEach((c) => {
      if (c && typeof c.destroy === 'function') c.destroy();
    });
    this.charts = {};
  },

  async render(container, preselectedId = null) {
    this.destroyCharts();
    if (preselectedId) this.selectedId = preselectedId;

    container.innerHTML = window.UIComponents.renderDashboardSkeleton();

    try {
      const allIPOs = await window.ipoService.fetchAllIPOs();
      if (!allIPOs || allIPOs.length === 0) {
        container.innerHTML = window.UIComponents.renderEmptyState(
          'No IPO Records Available',
          'No company records are loaded for fundamental analysis.'
        );
        return;
      }

      // Prefer IPO with rich financials if none selected yet
      const selectedIPO =
        allIPOs.find((i) => i.id === this.selectedId) ||
        allIPOs.find((i) => i.financials !== null) ||
        allIPOs[0];
      this.selectedId = selectedIPO.id;

      const ipo = (await window.ipoService.fetchIPOById(selectedIPO.id)) || selectedIPO;
      const weights = window.IPOScoringEngine.getWeights();
      const analysis = window.IPOScoringEngine.analyzeIPO(ipo, weights);
      const fin = ipo.financials;

      // Build peer comparison list (same board or sector, up to 4 peers)
      const peers = allIPOs
        .filter((p) => p.id !== ipo.id && (p.board === ipo.board || p.financials))
        .slice(0, 4);

      container.innerHTML = `
        <!-- Top Header & Company Selector -->
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center gap-3 mb-4">
          <div>
            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h4 class="text-white fw-bold mb-0"><i class="bi bi-building-gear text-info me-2"></i>Company Fundamental Analysis</h4>
              ${ipo.isDemo ? window.UIComponents.demoBadge() : '<span class="badge bg-success-subtle text-success border border-success-subtle">LIVE EJI</span>'}
            </div>
            <p class="text-secondary small mb-0">Multi-year financial performance, valuation multiples, peer benchmarking &amp; configurable 100-point scoring.</p>
          </div>

          <div class="d-flex flex-wrap align-items-center gap-2">
            <select id="analysis-ipo-selector" class="form-select form-select-sm bg-surface-2 border-subtle text-white" style="min-width: 240px;">
              ${allIPOs
                .map(
                  (item) =>
                    `<option value="${item.id}" ${item.id === ipo.id ? 'selected' : ''}>${item.companyName} (${item.symbol})</option>`
                )
                .join('')}
            </select>
            <a href="#ipo-detail/${ipo.id}" class="btn btn-sm btn-outline-info">IPO Detail</a>
            <a href="#comparison" class="btn btn-sm btn-outline-light">Compare</a>
          </div>
        </div>

        <!-- Business & Industry Overview Banner -->
        <div class="fintech-card p-3 p-md-4 mb-4">
          <div class="row g-3">
            <div class="col-12 col-lg-8">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h5 class="text-white fw-bold mb-0">${ipo.companyName}</h5>
                ${window.UIComponents.boardBadge(ipo.board)}
                ${window.UIComponents.statusBadge(ipo.status)}
              </div>
              <p class="text-light small mb-2">${ipo.overview}</p>
              <div class="text-secondary small">
                <strong class="text-info">Industry Context:</strong> Operating within <strong>${ipo.sector}</strong> on the Indian ${ipo.board} segment.
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <div class="p-3 rounded bg-surface-2 border border-subtle h-100 d-flex flex-column justify-content-center">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="text-secondary small">Composite IPO Score</span>
                  <span class="badge bg-info-subtle text-info">Confidence: ${analysis.dataConfidencePct}%</span>
                </div>
                <div class="d-flex align-items-baseline gap-2">
                  <span class="font-mono fw-bold text-white" style="font-size:2rem;">${analysis.overallScore}</span>
                  <span class="text-secondary font-mono">/ 100 pts</span>
                </div>
                <div class="text-secondary mt-1" style="font-size:0.72rem;">
                  Analytical framework only &mdash; not an investment recommendation.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 13 Core Fundamental & Valuation KPIs -->
        ${
          fin
            ? `
          <div class="row g-2 g-md-3 mb-4">
            ${[
              { label: 'FY26 Revenue', val: `₹${fin.fy26.revenueCr} Cr`, sub: `YoY: +${fin.revenueGrowthPct}%`, cls: 'text-white' },
              { label: 'FY26 EBITDA', val: `₹${fin.fy26.ebitdaCr} Cr`, sub: `Margin: ${fin.ebitdaMarginPct}%`, cls: 'text-info' },
              { label: 'FY26 PAT', val: `₹${fin.fy26.patCr} Cr`, sub: `YoY: +${fin.patGrowthPct}%`, cls: 'text-success' },
              { label: 'PAT Margin & EPS', val: `${fin.patMarginPct}%`, sub: `EPS: ₹${fin.eps}`, cls: 'text-white' },
              { label: 'ROE / ROCE', val: `${fin.roePct}% / ${fin.rocePct}%`, sub: 'Return Ratios', cls: 'text-warning' },
              { label: 'Valuation & Leverage', val: `${fin.pePostIssue}x P/E`, sub: `P/B: ${fin.pbRatio}x | D/E: ${fin.debtToEquity}x`, cls: 'text-white' }
            ]
              .map(
                (k) => `
              <div class="col-6 col-md-4 col-xl-2">
                <div class="kpi-card">
                  <div class="text-secondary small mb-1">${k.label}</div>
                  <div class="kpi-value fs-5 ${k.cls}">${k.val}</div>
                  <div class="text-secondary mt-1 font-mono" style="font-size:0.72rem;">${k.sub}</div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>

          <!-- Financial Trend Charts -->
          <div class="row g-3 mb-4">
            <div class="col-12 col-lg-7">
              <div class="fintech-card p-3 p-md-4 h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 class="text-white fw-semibold mb-0">3-Year Financial Trajectory (FY24 &ndash; FY26)</h6>
                    <span class="text-secondary small">Revenue, EBITDA &amp; Net Profit (PAT) in ₹ Crores (${ipo.isDemo ? 'Illustrative' : 'Reported'})</span>
                  </div>
                  ${ipo.isDemo ? window.UIComponents.demoBadge() : ''}
                </div>
                <div class="chart-wrapper">
                  <canvas id="companyFinancialBarChart"></canvas>
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-5">
              <div class="fintech-card p-3 p-md-4 h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 class="text-white fw-semibold mb-0">Profitability &amp; Return Ratios (%)</h6>
                    <span class="text-secondary small">Margins &amp; capital efficiency comparison</span>
                  </div>
                </div>
                <div class="chart-wrapper">
                  <canvas id="companyRatiosChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        `
            : `
          <div class="alert border-info bg-info-subtle text-info mb-4 small">
            <i class="bi bi-info-circle-fill me-2"></i>
            <strong>Partial Financial Data Notice:</strong> Detailed multi-year Revenue, EBITDA, PAT, ROE, ROCE, and P/E ratios are not present in the basic live exchange summary for <strong>${ipo.companyName}</strong>. Select any demo record from the dropdown above to inspect full 3-year financial charts, or evaluate the available IPO structure and subscription metrics below.
          </div>
        `
        }

        <!-- Configurable 100-Point IPO Scoring Engine -->
        <div class="fintech-card p-3 p-md-4 mb-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
            <div>
              <h5 class="text-white fw-semibold mb-1"><i class="bi bi-sliders text-primary me-2"></i>Configurable 100-Point IPO Scoring Engine</h5>
              <p class="text-secondary small mb-0">Customize category weights below to dynamically recalculate the composite score and risk profile.</p>
            </div>
            <div class="d-flex gap-2">
              <button id="btn-reset-weights" class="btn btn-sm btn-outline-secondary">Reset Default Weights</button>
            </div>
          </div>

          <div class="row g-4">
            <!-- Weight Sliders -->
            <div class="col-12 col-lg-6">
              <div class="p-3 rounded bg-surface-2 border border-subtle">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="fw-semibold text-white small">Category Weight Configuration</span>
                  <span class="badge bg-secondary-subtle text-light font-mono" id="total-weight-indicator">
                    Total Weight: ${
                      weights.financialPerformance +
                      weights.businessFundamentals +
                      weights.valuation +
                      weights.managementGovernance +
                      weights.ipoStructure +
                      weights.marketSentiment
                    }%
                  </span>
                </div>

                <div class="d-flex flex-column gap-3">
                  ${[
                    { key: 'financialPerformance', label: 'Financial Performance', val: weights.financialPerformance },
                    { key: 'businessFundamentals', label: 'Business Fundamentals', val: weights.businessFundamentals },
                    { key: 'valuation', label: 'Valuation Multiples', val: weights.valuation },
                    { key: 'managementGovernance', label: 'Management & Governance', val: weights.managementGovernance },
                    { key: 'ipoStructure', label: 'IPO Structure (Fresh/OFS)', val: weights.ipoStructure },
                    { key: 'marketSentiment', label: 'Market Sentiment & Demand', val: weights.marketSentiment }
                  ]
                    .map(
                      (w) => `
                    <div>
                      <div class="d-flex justify-content-between small mb-1">
                        <label class="text-light" for="weight-${w.key}">${w.label}</label>
                        <span class="font-mono text-info fw-semibold" id="val-${w.key}">${w.val} pts</span>
                      </div>
                      <input type="range" class="form-range js-weight-slider" id="weight-${w.key}" data-key="${w.key}" min="0" max="50" step="5" value="${w.val}">
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            </div>

            <!-- Score Output, Confidence & Missing Data -->
            <div class="col-12 col-lg-6">
              <div class="p-3 rounded bg-surface-2 border border-subtle h-100 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div>
                      <div class="text-secondary small">Weighted Overall Score</div>
                      <div class="font-mono fw-bold text-white fs-3">${analysis.overallScore} / 100</div>
                    </div>
                    <div class="text-end">
                      <div class="text-secondary small">Data Confidence</div>
                      <span class="badge ${analysis.dataConfidencePct >= 75 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} font-mono">
                        ${analysis.dataConfidencePct}% (${analysis.confidenceLabel})
                      </span>
                    </div>
                  </div>

                  <div class="d-flex flex-column gap-2 mb-3">
                    ${analysis.categories
                      .map(
                        (cat) => `
                      <div>
                        <div class="d-flex justify-content-between small mb-1">
                          <span class="text-secondary">${cat.label}</span>
                          <span class="font-mono text-white">${cat.score} / ${cat.maxScore}</span>
                        </div>
                        <div class="progress bg-surface-1" style="height:7px;">
                          <div class="progress-bar bg-primary" style="width:${cat.maxScore > 0 ? Math.round((cat.score / cat.maxScore) * 100) : 0}%"></div>
                        </div>
                      </div>
                    `
                      )
                      .join('')}
                  </div>

                  ${
                    analysis.missingData.length > 0
                      ? `<div class="p-2 rounded bg-surface-1 border border-subtle mb-2">
                           <div class="text-warning fw-semibold" style="font-size:0.75rem;"><i class="bi bi-exclamation-circle me-1"></i>Missing / Pending Inputs:</div>
                           <ul class="mb-0 ps-3 text-secondary" style="font-size:0.72rem;">
                             ${analysis.missingData.map((m) => `<li>${m}</li>`).join('')}
                           </ul>
                         </div>`
                      : ''
                  }
                </div>

                <div class="text-secondary border-top border-subtle pt-2" style="font-size:0.72rem;">
                  <strong>Important Disclaimer:</strong> This quantitative score reflects configured fundamental and market-sentiment weights only. It is not a SEBI-registered recommendation or guarantee of listing performance.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Valuation, Risk & Positives/Negatives Grid -->
        <div class="row g-3 mb-4">
          <div class="col-12 col-md-4">
            <div class="fintech-card p-3 p-md-4 h-100">
              <h6 class="text-success fw-semibold mb-3"><i class="bi bi-check-circle me-2"></i>Positive Indicators</h6>
              <ul class="small text-light ps-3 mb-0 d-flex flex-column gap-2">
                ${analysis.positiveIndicators.map((p) => `<li>${p}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="fintech-card p-3 p-md-4 h-100">
              <h6 class="text-warning fw-semibold mb-3"><i class="bi bi-dash-circle me-2"></i>Negative Indicators</h6>
              <ul class="small text-light ps-3 mb-0 d-flex flex-column gap-2">
                ${analysis.negativeIndicators.map((n) => `<li>${n}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="fintech-card p-3 p-md-4 h-100">
              <h6 class="text-danger fw-semibold mb-3"><i class="bi bi-shield-exclamation me-2"></i>Risk Analysis</h6>
              <ul class="small text-light ps-3 mb-0 d-flex flex-column gap-2">
                ${(ipo.risks || []).map((r) => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- Peer Comparison Table -->
        <div class="fintech-card overflow-hidden">
          <div class="p-3 p-md-4 border-bottom border-subtle d-flex justify-content-between align-items-center">
            <div>
              <h5 class="text-white fw-semibold mb-1">Peer &amp; Sector Benchmarking</h5>
              <p class="text-secondary small mb-0">Comparative snapshot against tracked ${ipo.board} issuers.</p>
            </div>
            <a href="#comparison" class="btn btn-sm btn-outline-info">Open Full Comparison Tool</a>
          </div>
          <div class="table-responsive">
            <table class="table table-hover fintech-table align-middle">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Board</th>
                  <th>Rev Growth</th>
                  <th>PAT Growth</th>
                  <th>ROE</th>
                  <th>ROCE</th>
                  <th>Debt/Eq</th>
                  <th>Post-IPO P/E</th>
                  <th>IPO Score</th>
                </tr>
              </thead>
              <tbody>
                ${[ipo, ...peers]
                  .map((peer) => {
                    const pScore = window.IPOScoringEngine.analyzeIPO(peer, weights).overallScore;
                    const pf = peer.financials;
                    return `
                      <tr class="${peer.id === ipo.id ? 'table-active' : ''}">
                        <td>
                          <a href="#company-analysis/${peer.id}" class="text-white fw-semibold text-decoration-none">${peer.companyName}</a>
                          ${peer.id === ipo.id ? '<span class="badge bg-primary ms-1">Selected</span>' : ''}
                        </td>
                        <td>${window.UIComponents.boardBadge(peer.board)}</td>
                        <td class="font-mono">${pf ? `+${pf.revenueGrowthPct}%` : '—'}</td>
                        <td class="font-mono">${pf ? `+${pf.patGrowthPct}%` : '—'}</td>
                        <td class="font-mono">${pf ? `${pf.roePct}%` : '—'}</td>
                        <td class="font-mono">${pf ? `${pf.rocePct}%` : '—'}</td>
                        <td class="font-mono">${pf ? `${pf.debtToEquity}x` : '—'}</td>
                        <td class="font-mono">${pf ? `${pf.pePostIssue}x` : '—'}</td>
                        <td class="font-mono fw-bold text-info">${pScore}/100</td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Bind selector
      const selector = document.getElementById('analysis-ipo-selector');
      if (selector) {
        selector.addEventListener('change', (e) => {
          this.render(container, e.target.value);
        });
      }

      // Bind weight sliders
      container.querySelectorAll('.js-weight-slider').forEach((slider) => {
        slider.addEventListener('input', (e) => {
          const key = e.target.getAttribute('data-key');
          const lbl = document.getElementById(`val-${key}`);
          if (lbl) lbl.textContent = `${e.target.value} pts`;
        });
        slider.addEventListener('change', () => {
          const updated = {};
          container.querySelectorAll('.js-weight-slider').forEach((s) => {
            updated[s.getAttribute('data-key')] = Number(s.value);
          });
          window.IPOScoringEngine.saveWeights(updated);
          this.render(container, ipo.id);
        });
      });

      const resetBtn = document.getElementById('btn-reset-weights');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.IPOScoringEngine.resetWeights();
          window.UIComponents.showToast('Scoring weights reset to default 100-point model.', 'info');
          this.render(container, ipo.id);
        });
      }

      // Render Financial Charts if financial data is available
      if (typeof Chart !== 'undefined' && fin) {
        const barCtx = document.getElementById('companyFinancialBarChart');
        if (barCtx) {
          this.charts.finBar = new Chart(barCtx, {
            type: 'bar',
            data: {
              labels: ['FY24', 'FY25', 'FY26'],
              datasets: [
                {
                  label: 'Revenue (₹ Cr)',
                  data: [fin.fy24.revenueCr, fin.fy25.revenueCr, fin.fy26.revenueCr],
                  backgroundColor: '#3b82f6',
                  borderRadius: 5
                },
                {
                  label: 'EBITDA (₹ Cr)',
                  data: [fin.fy24.ebitdaCr, fin.fy25.ebitdaCr, fin.fy26.ebitdaCr],
                  backgroundColor: '#38bdf8',
                  borderRadius: 5
                },
                {
                  label: 'PAT (₹ Cr)',
                  data: [fin.fy24.patCr, fin.fy25.patCr, fin.fy26.patCr],
                  backgroundColor: '#10b981',
                  borderRadius: 5
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: '#cbd5e1', font: { size: 11 } } } },
              scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } }
              }
            }
          });
        }

        const ratioCtx = document.getElementById('companyRatiosChart');
        if (ratioCtx) {
          this.charts.ratios = new Chart(ratioCtx, {
            type: 'bar',
            data: {
              labels: ['EBITDA Margin', 'PAT Margin', 'ROE', 'ROCE'],
              datasets: [
                {
                  label: 'Percentage (%)',
                  data: [fin.ebitdaMarginPct, fin.patMarginPct, fin.roePct, fin.rocePct],
                  backgroundColor: ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'],
                  borderRadius: 6
                }
              ]
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } },
                y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(148,163,184,0.08)' } }
              }
            }
          });
        }
      }
    } catch (err) {
      console.error(err);
      container.innerHTML = window.UIComponents.renderErrorState('Unable to load Company Analysis: ' + err.message);
    }
  }
};
