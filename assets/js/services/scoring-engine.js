/**
 * IPO Intelligence - Phase 4 Company Fundamental Analysis & 100-Point Scoring Engine
 * Configurable weights (default: Financial 25, Business 20, Valuation 20, Governance 15, Structure 10, Sentiment 10).
 * Computes category scores, overall score, positive/negative indicators, missing data, and data confidence.
 * Informational analytical framework only — never presented as guaranteed investment advice.
 */
window.IPOScoringEngine = {
  DEFAULT_WEIGHTS: {
    financialPerformance: 25,
    businessFundamentals: 20,
    valuation: 20,
    managementGovernance: 15,
    ipoStructure: 10,
    marketSentiment: 10
  },

  STORAGE_KEY: 'ipo_intelligence_scoring_weights_v1',

  getWeights() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...this.DEFAULT_WEIGHTS, ...parsed };
      }
    } catch (e) {
      console.warn('Could not read custom scoring weights:', e);
    }
    return { ...this.DEFAULT_WEIGHTS };
  },

  saveWeights(weights) {
    const clean = {
      financialPerformance: Number(weights.financialPerformance) || 0,
      businessFundamentals: Number(weights.businessFundamentals) || 0,
      valuation: Number(weights.valuation) || 0,
      managementGovernance: Number(weights.managementGovernance) || 0,
      ipoStructure: Number(weights.ipoStructure) || 0,
      marketSentiment: Number(weights.marketSentiment) || 0
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clean));
    return clean;
  },

  resetWeights() {
    localStorage.removeItem(this.STORAGE_KEY);
    return { ...this.DEFAULT_WEIGHTS };
  },

  analyzeIPO(ipo, customWeights = null) {
    const weights = customWeights || this.getWeights();
    const totalWeight =
      weights.financialPerformance +
      weights.businessFundamentals +
      weights.valuation +
      weights.managementGovernance +
      weights.ipoStructure +
      weights.marketSentiment || 100;

    const fin = ipo.financials || null;
    const missingData = [];
    const positiveIndicators = [];
    const negativeIndicators = [];
    let availableSignalWeight = 0;

    // 1. Financial Performance Ratio (0.0 to 1.0)
    let finRatio = 0.5;
    if (fin) {
      availableSignalWeight += 25;
      let pts = 0;
      if (fin.revenueGrowthPct >= 25) {
        pts += 0.35;
        positiveIndicators.push(`Strong YoY revenue growth of ${fin.revenueGrowthPct.toFixed(1)}%.`);
      } else if (fin.revenueGrowthPct >= 12) {
        pts += 0.22;
      } else {
        pts += 0.1;
        negativeIndicators.push(`Moderate top-line expansion (${fin.revenueGrowthPct.toFixed(1)}% YoY).`);
      }

      if (fin.patGrowthPct >= 30) {
        pts += 0.35;
        positiveIndicators.push(`High PAT growth momentum (${fin.patGrowthPct.toFixed(1)}% YoY).`);
      } else if (fin.patGrowthPct >= 15) {
        pts += 0.22;
      } else {
        pts += 0.1;
      }

      if (fin.ebitdaMarginPct >= 20) {
        pts += 0.30;
        positiveIndicators.push(`Healthy EBITDA margin profile at ${fin.ebitdaMarginPct.toFixed(1)}%.`);
      } else if (fin.ebitdaMarginPct >= 14) {
        pts += 0.20;
      } else {
        pts += 0.10;
        negativeIndicators.push(`Thin operating EBITDA margin (${fin.ebitdaMarginPct.toFixed(1)}%).`);
      }
      finRatio = Math.min(1, pts);
    } else {
      missingData.push('Multi-year Revenue, EBITDA & PAT growth statements');
    }

    // 2. Business Fundamentals & Return Ratios (0.0 to 1.0)
    let bizRatio = 0.5;
    if (fin) {
      availableSignalWeight += 20;
      let pts = 0;
      if (fin.roePct >= 20) {
        pts += 0.4;
        positiveIndicators.push(`Superior Return on Equity (ROE: ${fin.roePct}%).`);
      } else if (fin.roePct >= 14) {
        pts += 0.26;
      } else {
        pts += 0.12;
        negativeIndicators.push(`Sub-15% ROE (${fin.roePct}%) indicates modest capital efficiency.`);
      }

      if (fin.rocePct >= 22) {
        pts += 0.35;
        positiveIndicators.push(`Strong ROCE of ${fin.rocePct}%.`);
      } else if (fin.rocePct >= 15) {
        pts += 0.22;
      } else {
        pts += 0.10;
      }

      if (fin.debtToEquity <= 0.4) {
        pts += 0.25;
        positiveIndicators.push(`Conservative leverage (Debt/Equity: ${fin.debtToEquity}x).`);
      } else if (fin.debtToEquity <= 0.85) {
        pts += 0.15;
      } else {
        pts += 0.05;
        negativeIndicators.push(`Elevated leverage (Debt/Equity: ${fin.debtToEquity}x).`);
      }
      bizRatio = Math.min(1, pts);
    } else {
      missingData.push('ROE, ROCE, and Debt-to-Equity balance sheet metrics');
    }

    // 3. Valuation Comfort (0.0 to 1.0)
    let valRatio = 0.5;
    if (fin && fin.pePostIssue) {
      availableSignalWeight += 20;
      if (fin.pePostIssue <= 24) {
        valRatio = 0.92;
        positiveIndicators.push(`Attractive post-issue P/E multiple (${fin.pePostIssue}x).`);
      } else if (fin.pePostIssue <= 32) {
        valRatio = 0.72;
      } else if (fin.pePostIssue <= 40) {
        valRatio = 0.50;
        negativeIndicators.push(`Full valuation at ${fin.pePostIssue}x post-issue P/E.`);
      } else {
        valRatio = 0.30;
        negativeIndicators.push(`Expensive post-issue P/E multiple (${fin.pePostIssue}x) leaves limited margin of safety.`);
      }
    } else {
      missingData.push('Post-issue P/E and Price-to-Book (P/B) valuation multiples');
    }

    // 4. Management & Governance Proxy (0.0 to 1.0)
    let govRatio = 0.65;
    if (ipo.board === 'Mainboard') {
      govRatio += 0.15;
      availableSignalWeight += 10;
    } else {
      availableSignalWeight += 8;
    }
    if (ipo.documents && ipo.documents.length > 0) {
      govRatio += 0.10;
    } else {
      missingData.push('Detailed promoter holding & board governance disclosures');
    }
    govRatio = Math.min(1, govRatio);

    // 5. IPO Structure (Fresh Issue vs OFS) (0.0 to 1.0)
    let structRatio = 0.55;
    if (ipo.issueSizeCr > 0) {
      availableSignalWeight += 10;
      const freshPct = (ipo.freshIssueCr / ipo.issueSizeCr) * 100;
      if (freshPct >= 80) {
        structRatio = 0.95;
        positiveIndicators.push(`${freshPct.toFixed(0)}% Fresh Issue channels capital directly into business growth.`);
      } else if (freshPct >= 50) {
        structRatio = 0.72;
      } else {
        structRatio = 0.42;
        negativeIndicators.push(`High Offer-for-Sale (OFS) component (${(100 - freshPct).toFixed(0)}%) exits existing shareholders.`);
      }
    } else {
      missingData.push('Fresh Issue vs. Offer-for-Sale (OFS) capital split');
    }

    // 6. Market Sentiment (Subscription + Unofficial GMP) (0.0 to 1.0)
    let sentRatio = 0.45;
    const subTotal = ipo.subscription?.total || 0;
    const gmpPct = ipo.gmp?.percentage || 0;
    if (subTotal > 0 || gmpPct !== 0) {
      availableSignalWeight += 15;
      let pts = 0;
      if (subTotal >= 25) {
        pts += 0.55;
        positiveIndicators.push(`Strong overall subscription demand (${subTotal.toFixed(2)}x).`);
      } else if (subTotal >= 5) {
        pts += 0.38;
      } else if (subTotal > 0) {
        pts += 0.20;
      } else {
        pts += 0.20;
      }

      if (gmpPct >= 20) {
        pts += 0.45;
        positiveIndicators.push(`Positive indicative GMP trend (+${gmpPct.toFixed(1)}%, unofficial).`);
      } else if (gmpPct > 0) {
        pts += 0.30;
      } else if (gmpPct < 0) {
        pts += 0.05;
        negativeIndicators.push(`Negative indicative GMP (${gmpPct.toFixed(1)}%, unofficial).`);
      } else {
        pts += 0.15;
      }
      sentRatio = Math.min(1, pts);
    } else {
      missingData.push('Live bidding subscription multiplier & grey market trend');
    }

    // Scale category scores proportionally if user customized weights away from 100
    const scaleFactor = 100 / totalWeight;
    const categories = [
      {
        key: 'financialPerformance',
        label: 'Financial Performance',
        weight: weights.financialPerformance,
        score: Number((finRatio * weights.financialPerformance * scaleFactor).toFixed(1)),
        maxScore: Number((weights.financialPerformance * scaleFactor).toFixed(1))
      },
      {
        key: 'businessFundamentals',
        label: 'Business Fundamentals',
        weight: weights.businessFundamentals,
        score: Number((bizRatio * weights.businessFundamentals * scaleFactor).toFixed(1)),
        maxScore: Number((weights.businessFundamentals * scaleFactor).toFixed(1))
      },
      {
        key: 'valuation',
        label: 'Valuation Comfort',
        weight: weights.valuation,
        score: Number((valRatio * weights.valuation * scaleFactor).toFixed(1)),
        maxScore: Number((weights.valuation * scaleFactor).toFixed(1))
      },
      {
        key: 'managementGovernance',
        label: 'Management & Governance',
        weight: weights.managementGovernance,
        score: Number((govRatio * weights.managementGovernance * scaleFactor).toFixed(1)),
        maxScore: Number((weights.managementGovernance * scaleFactor).toFixed(1))
      },
      {
        key: 'ipoStructure',
        label: 'IPO Structure (Fresh/OFS)',
        weight: weights.ipoStructure,
        score: Number((structRatio * weights.ipoStructure * scaleFactor).toFixed(1)),
        maxScore: Number((weights.ipoStructure * scaleFactor).toFixed(1))
      },
      {
        key: 'marketSentiment',
        label: 'Market Sentiment',
        weight: weights.marketSentiment,
        score: Number((sentRatio * weights.marketSentiment * scaleFactor).toFixed(1)),
        maxScore: Number((weights.marketSentiment * scaleFactor).toFixed(1))
      }
    ];

    const overallScore = Math.min(
      100,
      Math.round(categories.reduce((sum, c) => sum + c.score, 0))
    );

    const dataConfidencePct = Math.min(100, Math.round(availableSignalWeight));
    const confidenceLabel =
      dataConfidencePct >= 80 ? 'High' : dataConfidencePct >= 50 ? 'Moderate' : 'Low (Partial Data)';

    // Simple illustrative risk score (0-100, lower = lower risk)
    const riskScore = Math.max(15, Math.min(90, 100 - overallScore + (ipo.board === 'SME' ? 10 : 0)));

    return {
      overallScore,
      riskScore,
      categories,
      positiveIndicators: positiveIndicators.length ? positiveIndicators : ipo.positives || [],
      negativeIndicators: negativeIndicators.length ? negativeIndicators : ipo.negatives || [],
      missingData,
      dataConfidencePct,
      confidenceLabel
    };
  }
};
