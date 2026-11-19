/**
 * IPO Intelligence - Phase 5 Interactive Investor Calculators
 * 1. Allotment Probability Calculator (AllotmentCalculatorPage)
 * 2. Listing Gain / Loss Scenario Calculator (ListingGainCalculatorPage)
 */
window.AllotmentCalculatorPage = {
  async render(container) {
    const allIPOs = await window.ipoService.fetchAllIPOs();
    const defaultIPO = allIPOs.find((i) => i.subscription && i.subscription.retail > 0) || allIPOs[0];
    const defaultRetailSub = defaultIPO && defaultIPO.subscription?.retail > 0 ? defaultIPO.subscription.retail : 6.12;

    container.innerHTML = `
      <div class="mb-4">
        <h4 class="text-white fw-bold mb-1"><i class="bi bi-pie-chart text-info me-2"></i>IPO Allotment Probability Calculator</h4>
        <p class="text-secondary small mb-0">Estimate illustrative retail allotment odds under SEBI's proportional/lottery allotment rules.</p>
      </div>

      <div class="row g-4">
        <div class="col-12 col-lg-6">
          <div class="fintech-card p-3 p-md-4 h-100">
            <h6 class="text-white fw-semibold mb-3">Application &amp; Subscription Inputs</h6>

            <div class="mb-3">
              <label class="form-label small text-secondary" for="allot-ipo-preset">Prefill from Tracked IPO (Optional)</label>
              <select id="allot-ipo-preset" class="form-select form-select-sm bg-surface-2 border-subtle text-white">
                <option value="">-- Custom Manual Inputs --</option>
                ${allIPOs
                  .map(
                    (i) =>
                      `<option value="${i.id}" data-sub="${i.subscription?.retail || 0}">${i.companyName} (${i.symbol}) — Retail Sub: ${
                        i.subscription?.retail > 0 ? i.subscription.retail + 'x' : 'N/A'
                      }</option>`
                  )
                  .join('')}
              </select>
            </div>

            <div class="row g-3">
              <div class="col-12 col-sm-6">
                <label class="form-label small text-secondary" for="allot-valid-apps">Valid Retail Applications</label>
                <input type="number" id="allot-valid-apps" class="form-control bg-surface-2 border-subtle text-white font-mono" value="612000" min="1">
              </div>
              <div class="col-12 col-sm-6">
                <label class="form-label small text-secondary" for="allot-successful-apps">Est. Successful Applicants (1-Lot Pool)</label>
                <input type="number" id="allot-successful-apps" class="form-control bg-surface-2 border-subtle text-white font-mono" value="100000" min="1">
              </div>
              <div class="col-12 col-sm-6">
                <label class="form-label small text-secondary" for="allot-retail-sub">Retail Subscription Multiplier (x)</label>
                <input type="number" id="allot-retail-sub" class="form-control bg-surface-2 border-subtle text-white font-mono" value="${defaultRetailSub}" step="0.01" min="0.1">
              </div>
              <div class="col-12 col-sm-6">
                <label class="form-label small text-secondary" for="allot-lots">Number of Lots Applied (Single PAN)</label>
                <input type="number" id="allot-lots" class="form-control bg-surface-2 border-subtle text-white font-mono" value="1" min="1" max="15">
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="fintech-card p-3 p-md-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h6 class="text-white fw-semibold mb-3">Illustrative Allotment Estimate</h6>
              <div class="p-4 rounded bg-surface-2 border border-subtle text-center mb-3">
                <div class="text-secondary small mb-1">Estimated Probability of Receiving 1 Lot</div>
                <div class="font-mono fw-bold text-info" style="font-size:2.4rem;" id="allot-prob-output">16.34%</div>
                <div class="text-light small mt-1 font-mono" id="allot-odds-output">Approx. 1 in 6.12 applications</div>
              </div>

              <div class="p-3 rounded bg-surface-2 border border-subtle small">
                <div class="fw-semibold text-white mb-1">SEBI Retail Allotment Rules &amp; Assumptions:</div>
                <ul class="text-secondary ps-3 mb-0 d-flex flex-column gap-1">
                  <li>In oversubscribed Retail Individual Investor (RII) categories (&gt;1x), every valid applicant is treated equally for <strong>1 minimum lot</strong> via computerized lottery, regardless of applying for 1 lot or multiple lots on the same PAN.</li>
                  <li>Probability is derived from both the application ratio (<code>Successful Pool / Valid Applications</code>) and the Retail Subscription multiple (<code>1 / Retail Sub</code>).</li>
                  <li>Actual allotment depends on final valid bids after UPI mandate approvals and technical rejections.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const validInput = document.getElementById('allot-valid-apps');
    const succInput = document.getElementById('allot-successful-apps');
    const subInput = document.getElementById('allot-retail-sub');
    const lotsInput = document.getElementById('allot-lots');
    const probOut = document.getElementById('allot-prob-output');
    const oddsOut = document.getElementById('allot-odds-output');

    const recalc = (source = 'sub') => {
      const valid = Math.max(1, Number(validInput.value) || 1);
      const succ = Math.max(1, Number(succInput.value) || 1);
      const sub = Math.max(0.1, Number(subInput.value) || 1);

      let probPct = 100;
      if (source === 'apps') {
        probPct = Math.min(100, (succ / valid) * 100);
        subInput.value = (valid / succ).toFixed(2);
      } else {
        probPct = sub <= 1 ? 100 : (1 / sub) * 100;
        validInput.value = Math.round(succ * sub);
      }

      const oneIn = probPct >= 100 ? '1.00 (Guaranteed if valid)' : `1 in ${(100 / probPct).toFixed(2)} applicants`;
      probOut.textContent = `${probPct.toFixed(2)}%`;
      oddsOut.textContent = `Illustrative Odds: ${oneIn}`;
    };

    validInput.addEventListener('input', () => recalc('apps'));
    succInput.addEventListener('input', () => recalc('apps'));
    subInput.addEventListener('input', () => recalc('sub'));
    lotsInput.addEventListener('input', () => recalc('sub'));

    const preset = document.getElementById('allot-ipo-preset');
    if (preset) {
      preset.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        const s = Number(opt?.getAttribute('data-sub') || 0);
        if (s > 0) {
          subInput.value = s;
          recalc('sub');
        }
      });
    }

    recalc('sub');
  }
};

window.ListingGainCalculatorPage = {
  async render(container) {
    const allIPOs = await window.ipoService.fetchAllIPOs();
    const defaultIPO = allIPOs.find((i) => i.priceBand?.max > 0 && i.lotSize > 0) || allIPOs[0];

    const initPrice = defaultIPO?.priceBand?.max || 432;
    const initGmp = defaultIPO?.gmp?.current ?? 95;
    const initLot = defaultIPO?.lotSize || 34;

    container.innerHTML = `
      <div class="mb-4">
        <h4 class="text-white fw-bold mb-1"><i class="bi bi-calculator text-success me-2"></i>Listing Gain / Loss Scenario Calculator</h4>
        <p class="text-secondary small mb-0">Model Optimistic, Neutral (Base GMP), and Pessimistic debut outcomes across single or multiple lots.</p>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-12 col-lg-5">
          <div class="fintech-card p-3 p-md-4 h-100">
            <h6 class="text-white fw-semibold mb-3">Position &amp; GMP Parameters</h6>

            <div class="mb-3">
              <label class="form-label small text-secondary" for="lg-ipo-preset">Load from Tracked IPO</label>
              <select id="lg-ipo-preset" class="form-select form-select-sm bg-surface-2 border-subtle text-white">
                <option value="">-- Custom Parameters --</option>
                ${allIPOs
                  .map(
                    (i) =>
                      `<option value="${i.id}" data-price="${i.priceBand?.max || 0}" data-gmp="${i.gmp?.current || 0}" data-lot="${
                        i.lotSize || 1
                      }">${i.companyName} (${i.symbol})</option>`
                  )
                  .join('')}
              </select>
            </div>

            <div class="row g-3">
              <div class="col-6">
                <label class="form-label small text-secondary" for="lg-issue-price">Issue Price (₹)</label>
                <input type="number" id="lg-issue-price" class="form-control bg-surface-2 border-subtle text-white font-mono" value="${initPrice}" min="1">
              </div>
              <div class="col-6">
                <label class="form-label small text-secondary" for="lg-gmp">Indicative GMP (₹)</label>
                <input type="number" id="lg-gmp" class="form-control bg-surface-2 border-subtle text-white font-mono" value="${initGmp}">
              </div>
              <div class="col-6">
                <label class="form-label small text-secondary" for="lg-lot-size">Lot Size (Shares)</label>
                <input type="number" id="lg-lot-size" class="form-control bg-surface-2 border-subtle text-white font-mono" value="${initLot}" min="1">
              </div>
              <div class="col-6">
                <label class="form-label small text-secondary" for="lg-num-lots">Number of Lots</label>
                <input type="number" id="lg-num-lots" class="form-control bg-surface-2 border-subtle text-white font-mono" value="1" min="1" max="100">
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-7">
          <div class="fintech-card p-3 p-md-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="text-white fw-semibold mb-0">Projected Listing Scenarios</h6>
              <span class="font-mono text-secondary small" id="lg-total-invested">Capital Required: ₹0</span>
            </div>

            <div class="row g-3" id="lg-scenarios-grid"></div>

            <div class="mt-3 p-2 rounded bg-surface-2 border border-subtle text-secondary" style="font-size:0.74rem;">
              <i class="bi bi-exclamation-triangle text-warning me-1"></i>
              <strong>Disclaimer:</strong> Grey Market Premium (GMP) is unofficial and volatile. Actual NSE/BSE listing price discovery depends on institutional demand, broader market indices, and liquidity on debut day.
            </div>
          </div>
        </div>
      </div>
    `;

    const priceIn = document.getElementById('lg-issue-price');
    const gmpIn = document.getElementById('lg-gmp');
    const lotIn = document.getElementById('lg-lot-size');
    const numIn = document.getElementById('lg-num-lots');
    const invEl = document.getElementById('lg-total-invested');
    const gridEl = document.getElementById('lg-scenarios-grid');

    const renderScenarios = () => {
      const price = Math.max(1, Number(priceIn.value) || 1);
      const gmp = Number(gmpIn.value) || 0;
      const lot = Math.max(1, Number(lotIn.value) || 1);
      const lots = Math.max(1, Number(numIn.value) || 1);

      const totalShares = lot * lots;
      const invested = price * totalShares;
      invEl.textContent = `Total Investment (${totalShares.toLocaleString('en-IN')} shares): ₹${invested.toLocaleString('en-IN')}`;

      const scenarios = [
        {
          name: 'Optimistic (+30% GMP Boost)',
          estGmp: Math.round(gmp * 1.3 + (gmp === 0 ? price * 0.1 : 0)),
          badge: 'bg-success-subtle text-success'
        },
        {
          name: 'Neutral (Base Reported GMP)',
          estGmp: gmp,
          badge: 'bg-info-subtle text-info'
        },
        {
          name: 'Pessimistic (-50% GMP Haircut)',
          estGmp: Math.round(gmp * 0.5 - (gmp <= 0 ? price * 0.05 : 0)),
          badge: 'bg-warning-subtle text-warning'
        }
      ];

      gridEl.innerHTML = scenarios
        .map((sc) => {
          const listPrice = Math.max(1, price + sc.estGmp);
          const grossGain = (listPrice - price) * totalShares;
          const retPct = (((listPrice - price) / price) * 100).toFixed(2);
          const cls = grossGain >= 0 ? 'text-success' : 'text-danger';

          return `
            <div class="col-12 col-md-4">
              <div class="p-3 rounded bg-surface-2 border border-subtle h-100">
                <span class="badge ${sc.badge} mb-2">${sc.name}</span>
                <div class="text-secondary small">Est. Listing Price</div>
                <div class="font-mono fw-bold text-white fs-5 mb-2">₹${listPrice.toLocaleString('en-IN')}</div>
                <div class="text-secondary small">Gross Est. Gain / Loss</div>
                <div class="font-mono fw-bold ${cls}">${grossGain >= 0 ? '+' : ''}₹${grossGain.toLocaleString('en-IN')}</div>
                <div class="font-mono small ${cls}">(${Number(retPct) >= 0 ? '+' : ''}${retPct}%)</div>
              </div>
            </div>
          `;
        })
        .join('');
    };

    [priceIn, gmpIn, lotIn, numIn].forEach((el) => el.addEventListener('input', renderScenarios));

    const preset = document.getElementById('lg-ipo-preset');
    if (preset) {
      preset.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        const p = Number(opt?.getAttribute('data-price') || 0);
        const g = Number(opt?.getAttribute('data-gmp') || 0);
        const l = Number(opt?.getAttribute('data-lot') || 0);
        if (p > 0) priceIn.value = p;
        gmpIn.value = g;
        if (l > 0) lotIn.value = l;
        renderScenarios();
      });
    }

    renderScenarios();
  }
};
