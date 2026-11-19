/**
 * IPO Intelligence - Structured Demo Dataset
 * 14 Fictional Indian IPOs spanning Mainboard & SME across Upcoming, Open, Closed, and Listed statuses.
 * ALL VALUES ARE ILLUSTRATIVE DEMO DATA.
 */
window.DEMO_IPOS_DATA = [
  {
    id: 'demo-ipo-001',
    isDemo: true,
    companyName: 'AetherGrid Power Technologies Ltd.',
    symbol: 'AETHERGRID',
    sector: 'Renewable Energy & Smart Grids',
    board: 'Mainboard',
    status: 'Open',
    priceBand: { min: 410, max: 432 },
    lotSize: 34,
    issueSizeCr: 1850.00,
    freshIssueCr: 1400.00,
    ofsCr: 450.00,
    dates: {
      open: '2026-11-18',
      close: '2026-11-20',
      allotment: '2026-11-23',
      refund: '2026-11-24',
      demat: '2026-11-24',
      listing: '2026-11-25'
    },
    subscription: {
      qib: 14.80,
      nii: 9.45,
      retail: 6.12,
      employee: 2.30,
      total: 10.24,
      lastUpdated: '2026-11-19 17:00 IST (Demo)'
    },
    gmp: {
      current: 95,
      previous: 82,
      percentage: 21.99,
      lastUpdated: '2026-11-19 18:30 IST (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-14', gmp: 55 },
        { date: '2026-11-15', gmp: 64 },
        { date: '2026-11-16', gmp: 70 },
        { date: '2026-11-17', gmp: 78 },
        { date: '2026-11-18', gmp: 82 },
        { date: '2026-11-19', gmp: 95 }
      ]
    },
    financials: {
      fy24: { revenueCr: 1120.5, ebitdaCr: 246.5, patCr: 138.2 },
      fy25: { revenueCr: 1490.8, ebitdaCr: 342.9, patCr: 198.4 },
      fy26: { revenueCr: 1985.0, ebitdaCr: 476.4, patCr: 284.0 },
      revenueGrowthPct: 33.17,
      patGrowthPct: 43.15,
      ebitdaMarginPct: 24.00,
      patMarginPct: 14.31,
      eps: 14.80,
      roePct: 21.4,
      rocePct: 24.8,
      debtToEquity: 0.32,
      pePostIssue: 29.19,
      pbRatio: 5.40
    },
    listingPerformance: null,
    overview: 'AetherGrid Power Technologies manufactures grid-scale battery energy storage systems (BESS) and smart substation automation hardware for Indian utilities and commercial solar parks.',
    positives: [
      'Consistent 33%+ YoY revenue expansion with expanding EBITDA margins (24.0%).',
      'Healthy order book of ₹4,200 Cr executable over the next 24 months (Demo).',
      'Low post-issue Debt-to-Equity ratio of 0.32x strengthens balance sheet resilience.'
    ],
    negatives: [
      'High dependence on state DISCOM tenders and government renewable subsidies.',
      'Working capital cycle stretched to 118 days in FY26 (Illustrative).'
    ],
    risks: [
      'Raw material price volatility in lithium-ion cells and specialty transformers.',
      'Competitive bidding pressure in utility-scale storage tenders.'
    ],
    documents: [
      { title: 'Draft Red Herring Prospectus (DRHP) - Sample', type: 'PDF Placeholder' },
      { title: 'Red Herring Prospectus (RHP) - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-002',
    isDemo: true,
    companyName: 'VayuLogistics ColdChain Ltd.',
    symbol: 'VAYUCOLD',
    sector: 'Supply Chain & Cold Storage',
    board: 'Mainboard',
    status: 'Open',
    priceBand: { min: 265, max: 280 },
    lotSize: 53,
    issueSizeCr: 920.00,
    freshIssueCr: 620.00,
    ofsCr: 300.00,
    dates: {
      open: '2026-11-19',
      close: '2026-11-21',
      allotment: '2026-11-24',
      refund: '2026-11-25',
      demat: '2026-11-25',
      listing: '2026-11-26'
    },
    subscription: {
      qib: 2.15,
      nii: 4.10,
      retail: 3.85,
      employee: 1.10,
      total: 3.38,
      lastUpdated: '2026-11-19 17:00 IST (Demo)'
    },
    gmp: {
      current: 38,
      previous: 35,
      percentage: 13.57,
      lastUpdated: '2026-11-19 18:30 IST (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-15', gmp: 22 },
        { date: '2026-11-16', gmp: 28 },
        { date: '2026-11-17', gmp: 31 },
        { date: '2026-11-18', gmp: 35 },
        { date: '2026-11-19', gmp: 38 }
      ]
    },
    financials: {
      fy24: { revenueCr: 680.0, ebitdaCr: 115.6, patCr: 48.0 },
      fy25: { revenueCr: 845.0, ebitdaCr: 152.1, patCr: 67.5 },
      fy26: { revenueCr: 1050.0, ebitdaCr: 199.5, patCr: 92.0 },
      revenueGrowthPct: 24.26,
      patGrowthPct: 36.30,
      ebitdaMarginPct: 19.00,
      patMarginPct: 8.76,
      eps: 8.45,
      roePct: 16.8,
      rocePct: 18.2,
      debtToEquity: 0.58,
      pePostIssue: 33.14,
      pbRatio: 4.10
    },
    listingPerformance: null,
    overview: 'VayuLogistics operates 48 temperature-controlled warehousing hubs and a fleet of 1,150 reefer vehicles serving pharmaceutical and QSR brands across Tier-1 and Tier-2 cities.',
    positives: [
      'Long-term sticky contracts with top domestic pharma manufacturers.',
      'Improving fleet utilization lifted EBITDA margins from 17.0% to 19.0%.'
    ],
    negatives: [
      'Capital-intensive expansion requires continuous capex for cold hubs.',
      'Diesel and power tariff fluctuations directly impact operating margins.'
    ],
    risks: [
      'High fixed lease obligations on warehousing facilities.',
      'Regional fragmentation in Indian cold-chain logistics.'
    ],
    documents: [
      { title: 'Red Herring Prospectus (RHP) - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-003',
    isDemo: true,
    companyName: 'Kaveri Precision Robotics Ltd.',
    symbol: 'KAVERIROBO',
    sector: 'Industrial Automation',
    board: 'SME',
    status: 'Open',
    priceBand: { min: 138, max: 145 },
    lotSize: 1000,
    issueSizeCr: 68.40,
    freshIssueCr: 68.40,
    ofsCr: 0.00,
    dates: {
      open: '2026-11-18',
      close: '2026-11-20',
      allotment: '2026-11-23',
      refund: '2026-11-24',
      demat: '2026-11-24',
      listing: '2026-11-25'
    },
    subscription: {
      qib: 28.40,
      nii: 64.20,
      retail: 82.50,
      employee: 0.00,
      total: 61.90,
      lastUpdated: '2026-11-19 17:00 IST (Demo)'
    },
    gmp: {
      current: 52,
      previous: 46,
      percentage: 35.86,
      lastUpdated: '2026-11-19 18:30 IST (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-15', gmp: 30 },
        { date: '2026-11-16', gmp: 38 },
        { date: '2026-11-17', gmp: 42 },
        { date: '2026-11-18', gmp: 46 },
        { date: '2026-11-19', gmp: 52 }
      ]
    },
    financials: {
      fy24: { revenueCr: 44.2, ebitdaCr: 7.9, patCr: 4.6 },
      fy25: { revenueCr: 63.8, ebitdaCr: 12.4, patCr: 7.5 },
      fy26: { revenueCr: 91.5, ebitdaCr: 19.2, patCr: 12.1 },
      revenueGrowthPct: 43.42,
      patGrowthPct: 61.33,
      ebitdaMarginPct: 20.98,
      patMarginPct: 13.22,
      eps: 6.10,
      roePct: 26.5,
      rocePct: 29.1,
      debtToEquity: 0.21,
      pePostIssue: 23.77,
      pbRatio: 4.85
    },
    listingPerformance: null,
    overview: 'Pune-based SME designing automated welding cells, vision-guided assembly arms, and conveyor robotics for automotive tier-1 suppliers.',
    positives: [
      '100% Fresh Issue directed toward capacity expansion and R&D lab setup.',
      'Strong return ratios with ROE at 26.5% and ROCE at 29.1%.'
    ],
    negatives: [
      'Top 5 automotive clients account for 64% of total revenue (Demo).',
      'SME segment carries lower post-listing liquidity compared to Mainboard.'
    ],
    risks: [
      'Cyclical slowdown in domestic automotive capex.',
      'Imported servo motors and controllers exposed to INR/USD fluctuations.'
    ],
    documents: [
      { title: 'SME Prospectus - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-004',
    isDemo: true,
    companyName: 'Narmada FinServe Housing Ltd.',
    symbol: 'NARMADAHFC',
    sector: 'Affordable Housing Finance',
    board: 'Mainboard',
    status: 'Upcoming',
    priceBand: { min: 510, max: 535 },
    lotSize: 28,
    issueSizeCr: 2400.00,
    freshIssueCr: 1600.00,
    ofsCr: 800.00,
    dates: {
      open: '2026-11-24',
      close: '2026-11-26',
      allotment: '2026-11-27',
      refund: '2026-11-30',
      demat: '2026-11-30',
      listing: '2026-12-01'
    },
    subscription: {
      qib: 0,
      nii: 0,
      retail: 0,
      employee: 0,
      total: 0,
      lastUpdated: 'Opens Nov 24, 2026 (Demo)'
    },
    gmp: {
      current: 68,
      previous: 60,
      percentage: 12.71,
      lastUpdated: '2026-11-19 18:30 IST (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-16', gmp: 45 },
        { date: '2026-11-17', gmp: 52 },
        { date: '2026-11-18', gmp: 60 },
        { date: '2026-11-19', gmp: 68 }
      ]
    },
    financials: {
      fy24: { revenueCr: 1420.0, ebitdaCr: 890.0, patCr: 310.0 },
      fy25: { revenueCr: 1860.0, ebitdaCr: 1180.0, patCr: 425.0 },
      fy26: { revenueCr: 2390.0, ebitdaCr: 1520.0, patCr: 560.0 },
      revenueGrowthPct: 28.49,
      patGrowthPct: 31.76,
      ebitdaMarginPct: 63.60,
      patMarginPct: 23.43,
      eps: 19.20,
      roePct: 15.9,
      rocePct: 12.4,
      debtToEquity: 3.40,
      pePostIssue: 27.86,
      pbRatio: 3.25
    },
    listingPerformance: null,
    overview: 'Retail-focused affordable housing finance company with 210 branches across Madhya Pradesh, Rajasthan, Gujarat, and Maharashtra.',
    positives: [
      'Granular loan book with average ticket size of ₹11.5 Lakhs and GNPA at 1.12% (Demo).',
      'Strong NIMs of 5.8% supported by diversified bank & NHB refinance lines.'
    ],
    negatives: [
      'Geographic concentration in Central and Western India.',
      'Interest rate cycle shifts can compress spreads on fixed-rate loans.'
    ],
    risks: [
      'Asset quality sensitivity among self-employed informal borrowers.',
      'Regulatory changes in RBI housing finance capital adequacy norms.'
    ],
    documents: [
      { title: 'DRHP Filing - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-005',
    isDemo: true,
    companyName: 'MedCore Diagnostics & Genomics Ltd.',
    symbol: 'MEDCORE',
    sector: 'Healthcare & Diagnostics',
    board: 'Mainboard',
    status: 'Upcoming',
    priceBand: { min: 640, max: 675 },
    lotSize: 22,
    issueSizeCr: 1150.00,
    freshIssueCr: 450.00,
    ofsCr: 700.00,
    dates: {
      open: '2026-11-26',
      close: '2026-11-28',
      allotment: '2026-12-01',
      refund: '2026-12-02',
      demat: '2026-12-02',
      listing: '2026-12-03'
    },
    subscription: {
      qib: 0, nii: 0, retail: 0, employee: 0, total: 0,
      lastUpdated: 'Opens Nov 26, 2026 (Demo)'
    },
    gmp: {
      current: 115,
      previous: 110,
      percentage: 17.04,
      lastUpdated: '2026-11-19 18:30 IST (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-17', gmp: 95 },
        { date: '2026-11-18', gmp: 110 },
        { date: '2026-11-19', gmp: 115 }
      ]
    },
    financials: {
      fy24: { revenueCr: 590.0, ebitdaCr: 159.3, patCr: 82.6 },
      fy25: { revenueCr: 725.0, ebitdaCr: 203.0, patCr: 110.2 },
      fy26: { revenueCr: 895.0, ebitdaCr: 259.5, patCr: 146.8 },
      revenueGrowthPct: 23.45,
      patGrowthPct: 33.21,
      ebitdaMarginPct: 28.99,
      patMarginPct: 16.40,
      eps: 16.40,
      roePct: 22.8,
      rocePct: 26.1,
      debtToEquity: 0.14,
      pePostIssue: 41.16,
      pbRatio: 7.90
    },
    listingPerformance: null,
    overview: 'Specialized molecular diagnostics, oncology genomics, and pathology network operating 14 reference labs and 1,650 collection centers.',
    positives: [
      'High-margin specialized genomics tests account for 38% of revenue.',
      'Near debt-free balance sheet (D/E 0.14x) with strong free cash generation.'
    ],
    negatives: [
      '60.8% of the IPO is an Offer for Sale (OFS) by private equity investors.',
      'Rich valuation multiple at 41.2x post-issue P/E.'
    ],
    risks: [
      'Aggressive pricing competition from online aggregator diagnostic chains.',
      'Potential price caps on essential diagnostic tests by health authorities.'
    ],
    documents: [
      { title: 'DRHP Filing - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-006',
    isDemo: true,
    companyName: 'Sahyadri AgroNutrients Ltd.',
    symbol: 'SAHYADRIAG',
    sector: 'Specialty Fertilizers & Agri-Inputs',
    board: 'SME',
    status: 'Upcoming',
    priceBand: { min: 92, max: 98 },
    lotSize: 1200,
    issueSizeCr: 42.50,
    freshIssueCr: 42.50,
    ofsCr: 0.00,
    dates: {
      open: '2026-11-25',
      close: '2026-11-27',
      allotment: '2026-11-30',
      refund: '2026-12-01',
      demat: '2026-12-01',
      listing: '2026-12-02'
    },
    subscription: {
      qib: 0, nii: 0, retail: 0, employee: 0, total: 0,
      lastUpdated: 'Opens Nov 25, 2026 (Demo)'
    },
    gmp: {
      current: 14,
      previous: 14,
      percentage: 14.29,
      lastUpdated: '2026-11-19 18:30 IST (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-18', gmp: 14 },
        { date: '2026-11-19', gmp: 14 }
      ]
    },
    financials: {
      fy24: { revenueCr: 58.0, ebitdaCr: 7.5, patCr: 3.9 },
      fy25: { revenueCr: 74.0, ebitdaCr: 10.2, patCr: 5.6 },
      fy26: { revenueCr: 92.0, ebitdaCr: 13.4, patCr: 7.8 },
      revenueGrowthPct: 24.32,
      patGrowthPct: 39.29,
      ebitdaMarginPct: 14.57,
      patMarginPct: 8.48,
      eps: 4.90,
      roePct: 19.2,
      rocePct: 20.5,
      debtToEquity: 0.64,
      pePostIssue: 20.00,
      pbRatio: 3.10
    },
    listingPerformance: null,
    overview: 'Manufacturer of chelated micronutrients, bio-stimulants, and water-soluble NPK formulations for horticulture crops.',
    positives: [
      'Reasonable post-issue P/E valuation of 20.0x compared to peers.',
      'Expanding dealer network across 9 agricultural states.'
    ],
    negatives: [
      'Seasonal cash flow concentration during Kharif and Rabi sowing windows.',
      'Elevated receivables from rural distributor credit.'
    ],
    risks: [
      'Monsoon variability directly influences farmer off-take.',
      'Regulatory approvals required for new bio-stimulant formulations.'
    ],
    documents: [
      { title: 'Draft SME Prospectus - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-007',
    isDemo: true,
    companyName: 'Zentrix Cloud & CyberDefense Ltd.',
    symbol: 'ZENTRIX',
    sector: 'Enterprise SaaS & Cybersecurity',
    board: 'Mainboard',
    status: 'Upcoming',
    priceBand: { min: 780, max: 820 },
    lotSize: 18,
    issueSizeCr: 1540.00,
    freshIssueCr: 1100.00,
    ofsCr: 440.00,
    dates: {
      open: '2026-12-01',
      close: '2026-12-03',
      allotment: '2026-12-04',
      refund: '2026-12-07',
      demat: '2026-12-07',
      listing: '2026-12-08'
    },
    subscription: {
      qib: 0, nii: 0, retail: 0, employee: 0, total: 0,
      lastUpdated: 'Opens Dec 01, 2026 (Demo)'
    },
    gmp: {
      current: 165,
      previous: 150,
      percentage: 20.12,
      lastUpdated: '2026-11-19 18:30 IST (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-17', gmp: 130 },
        { date: '2026-11-18', gmp: 150 },
        { date: '2026-11-19', gmp: 165 }
      ]
    },
    financials: {
      fy24: { revenueCr: 410.0, ebitdaCr: 73.8, patCr: 41.0 },
      fy25: { revenueCr: 585.0, ebitdaCr: 122.8, patCr: 74.5 },
      fy26: { revenueCr: 820.0, ebitdaCr: 188.6, patCr: 121.0 },
      revenueGrowthPct: 40.17,
      patGrowthPct: 62.42,
      ebitdaMarginPct: 23.00,
      patMarginPct: 14.76,
      eps: 18.10,
      roePct: 24.1,
      rocePct: 27.3,
      debtToEquity: 0.05,
      pePostIssue: 45.30,
      pbRatio: 8.60
    },
    listingPerformance: null,
    overview: 'Cloud-native zero-trust security, SOC automation, and compliance telemetry platform serving BFSI and enterprise clients across India, MENA, and APAC.',
    positives: [
      'Net Dollar Retention (NDR) of 124% with 86% recurring ARR (Demo).',
      'Strong operating leverage driving 62% PAT growth in FY26.'
    ],
    negatives: [
      'Premium valuation at 45.3x post-issue earnings leaves limited margin of safety.',
      'High R&D and talent retention expenses.'
    ],
    risks: [
      'Reputational and liability risk in the event of a zero-day security breach.',
      'Global competition from large US cybersecurity vendors.'
    ],
    documents: [
      { title: 'DRHP Filing - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-008',
    isDemo: true,
    companyName: 'Bharati Precision Forgings Ltd.',
    symbol: 'BHARATFORG',
    sector: 'Auto Components & EV Drivetrains',
    board: 'Mainboard',
    status: 'Closed',
    priceBand: { min: 340, max: 358 },
    lotSize: 41,
    issueSizeCr: 1280.00,
    freshIssueCr: 880.00,
    ofsCr: 400.00,
    dates: {
      open: '2026-11-14',
      close: '2026-11-18',
      allotment: '2026-11-19',
      refund: '2026-11-20',
      demat: '2026-11-20',
      listing: '2026-11-23'
    },
    subscription: {
      qib: 48.60,
      nii: 34.20,
      retail: 14.90,
      employee: 3.40,
      total: 31.45,
      lastUpdated: '2026-11-18 19:00 IST (Final Demo)'
    },
    gmp: {
      current: 84,
      previous: 80,
      percentage: 23.46,
      lastUpdated: '2026-11-19 18:30 IST (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-13', gmp: 58 },
        { date: '2026-11-14', gmp: 65 },
        { date: '2026-11-16', gmp: 72 },
        { date: '2026-11-18', gmp: 80 },
        { date: '2026-11-19', gmp: 84 }
      ]
    },
    financials: {
      fy24: { revenueCr: 940.0, ebitdaCr: 169.2, patCr: 88.0 },
      fy25: { revenueCr: 1180.0, ebitdaCr: 224.2, patCr: 124.0 },
      fy26: { revenueCr: 1465.0, ebitdaCr: 293.0, patCr: 171.5 },
      revenueGrowthPct: 24.15,
      patGrowthPct: 38.31,
      ebitdaMarginPct: 20.00,
      patMarginPct: 11.71,
      eps: 13.60,
      roePct: 20.4,
      rocePct: 22.9,
      debtToEquity: 0.41,
      pePostIssue: 26.32,
      pbRatio: 4.50
    },
    listingPerformance: null,
    overview: 'Precision machined gears, differential assemblies, and lightweight aluminum EV housings supplied to domestic and European OEMs.',
    positives: [
      'Strong QIB institutional demand (48.6x) indicates robust anchor confidence.',
      'EV component revenue share rose from 11% in FY24 to 27% in FY26.'
    ],
    negatives: [
      'Exposure to European commercial vehicle demand slowdown.',
      'Alloy steel cost pass-through occurs with a one-quarter lag.'
    ],
    risks: [
      'Customer concentration with top 3 OEMs representing 52% of sales.',
      'Foreign exchange volatility on export receivables.'
    ],
    documents: [
      { title: 'RHP & Basis of Allotment - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-009',
    isDemo: true,
    companyName: 'SolisTex Technical Fabrics Ltd.',
    symbol: 'SOLISTEX',
    sector: 'Technical Textiles & Geosynthetics',
    board: 'SME',
    status: 'Closed',
    priceBand: { min: 112, max: 118 },
    lotSize: 1200,
    issueSizeCr: 54.00,
    freshIssueCr: 54.00,
    ofsCr: 0.00,
    dates: {
      open: '2026-11-13',
      close: '2026-11-17',
      allotment: '2026-11-18',
      refund: '2026-11-19',
      demat: '2026-11-19',
      listing: '2026-11-20'
    },
    subscription: {
      qib: 18.20,
      nii: 42.10,
      retail: 55.80,
      employee: 0.00,
      total: 41.30,
      lastUpdated: '2026-11-17 19:00 IST (Final Demo)'
    },
    gmp: {
      current: 26,
      previous: 24,
      percentage: 22.03,
      lastUpdated: '2026-11-19 18:30 IST (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-13', gmp: 15 },
        { date: '2026-11-15', gmp: 20 },
        { date: '2026-11-17', gmp: 24 },
        { date: '2026-11-19', gmp: 26 }
      ]
    },
    financials: {
      fy24: { revenueCr: 62.0, ebitdaCr: 9.3, patCr: 4.8 },
      fy25: { revenueCr: 81.5, ebitdaCr: 13.0, patCr: 7.1 },
      fy26: { revenueCr: 108.0, ebitdaCr: 18.4, patCr: 10.4 },
      revenueGrowthPct: 32.52,
      patGrowthPct: 46.48,
      ebitdaMarginPct: 17.04,
      patMarginPct: 9.63,
      eps: 5.50,
      roePct: 21.8,
      rocePct: 23.4,
      debtToEquity: 0.49,
      pePostIssue: 21.45,
      pbRatio: 3.80
    },
    listingPerformance: null,
    overview: 'Surat-based manufacturer of highway geosynthetics, agro-shade nets, and industrial filtration fabrics.',
    positives: [
      'Beneficiary of national highway and railway embankment infrastructure spending.',
      'Healthy 32.5% revenue growth with improving capacity utilization.'
    ],
    negatives: [
      'Petrochemical polymer granules form 58% of raw material cost.',
      'SME listing entails higher bid-ask spreads post-debut.'
    ],
    risks: [
      'Crude oil price spikes impacting polypropylene and polyester yarn margins.',
      'Working capital intensity in government infrastructure sub-contracts.'
    ],
    documents: [
      { title: 'SME Prospectus - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-010',
    isDemo: true,
    companyName: 'Deccan Specialty Chemicals Ltd.',
    symbol: 'DECCANCHEM',
    sector: 'Specialty Chemicals',
    board: 'Mainboard',
    status: 'Closed',
    priceBand: { min: 470, max: 495 },
    lotSize: 30,
    issueSizeCr: 1060.00,
    freshIssueCr: 700.00,
    ofsCr: 360.00,
    dates: {
      open: '2026-11-12',
      close: '2026-11-16',
      allotment: '2026-11-17',
      refund: '2026-11-18',
      demat: '2026-11-18',
      listing: '2026-11-20'
    },
    subscription: {
      qib: 6.40,
      nii: 4.80,
      retail: 2.95,
      employee: 1.05,
      total: 4.52,
      lastUpdated: '2026-11-16 19:00 IST (Final Demo)'
    },
    gmp: {
      current: 18,
      previous: 22,
      percentage: 3.64,
      lastUpdated: '2026-11-19 18:30 IST (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-12', gmp: 35 },
        { date: '2026-11-14', gmp: 28 },
        { date: '2026-11-16', gmp: 22 },
        { date: '2026-11-19', gmp: 18 }
      ]
    },
    financials: {
      fy24: { revenueCr: 790.0, ebitdaCr: 142.2, patCr: 79.0 },
      fy25: { revenueCr: 835.0, ebitdaCr: 146.1, patCr: 81.5 },
      fy26: { revenueCr: 910.0, ebitdaCr: 163.8, patCr: 93.0 },
      revenueGrowthPct: 8.98,
      patGrowthPct: 14.11,
      ebitdaMarginPct: 18.00,
      patMarginPct: 10.22,
      eps: 12.10,
      roePct: 14.5,
      rocePct: 16.2,
      debtToEquity: 0.55,
      pePostIssue: 40.91,
      pbRatio: 4.95
    },
    listingPerformance: null,
    overview: 'Produces fluorinated intermediates and agrochemical active ingredients from two manufacturing units in Dahej, Gujarat.',
    positives: [
      'Established relationships with global crop-protection innovators.',
      'Zero-liquid-discharge compliant facilities.'
    ],
    negatives: [
      'Modest 8.98% revenue growth due to global agrochemical inventory destocking.',
      'Valuation of 40.9x P/E appears expensive relative to near-term earnings growth.'
    ],
    risks: [
      'Environmental compliance and hazardous chemical handling regulations.',
      'Chinese dumping pressure in basic chemical intermediates.'
    ],
    documents: [
      { title: 'RHP Filing - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-011',
    isDemo: true,
    companyName: 'IndusPay Merchant Systems Ltd.',
    symbol: 'INDUSPAY',
    sector: 'Fintech & Payment Infrastructure',
    board: 'Mainboard',
    status: 'Listed',
    priceBand: { min: 560, max: 590 },
    lotSize: 25,
    issueSizeCr: 2150.00,
    freshIssueCr: 1350.00,
    ofsCr: 800.00,
    dates: {
      open: '2026-11-04',
      close: '2026-11-06',
      allotment: '2026-11-09',
      refund: '2026-11-10',
      demat: '2026-11-10',
      listing: '2026-11-11'
    },
    subscription: {
      qib: 62.40,
      nii: 41.80,
      retail: 18.20,
      employee: 4.50,
      total: 39.85,
      lastUpdated: 'Closed (Demo)'
    },
    gmp: {
      current: 155,
      previous: 150,
      percentage: 26.27,
      lastUpdated: 'Pre-Listing Final (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-11-04', gmp: 110 },
        { date: '2026-11-06', gmp: 135 },
        { date: '2026-11-09', gmp: 148 },
        { date: '2026-11-10', gmp: 155 }
      ]
    },
    listingPerformance: {
      issuePrice: 590,
      listingPrice: 762,
      listingGainPct: 29.15,
      cmp: 794,
      currentGainPct: 34.58
    },
    financials: {
      fy24: { revenueCr: 1180.0, ebitdaCr: 212.4, patCr: 118.0 },
      fy25: { revenueCr: 1620.0, ebitdaCr: 340.2, patCr: 205.0 },
      fy26: { revenueCr: 2210.0, ebitdaCr: 508.3, patCr: 324.0 },
      revenueGrowthPct: 36.42,
      patGrowthPct: 58.05,
      ebitdaMarginPct: 23.00,
      patMarginPct: 14.66,
      eps: 17.50,
      roePct: 23.6,
      rocePct: 26.8,
      debtToEquity: 0.08,
      pePostIssue: 33.71,
      pbRatio: 6.80
    },
    overview: 'Omnichannel POS terminals, UPI soundboxes, and merchant working-capital analytics platform serving 4.2 million Indian merchants.',
    positives: [
      'Strong debut with +29.15% listing gain and sustained post-listing institutional buying.',
      'Profitable fintech model with 23% EBITDA margins and low leverage.'
    ],
    negatives: [
      'Zero-MDR policy on UPI transactions limits direct payment processing take-rates.',
      'Intense competition from well-capitalized digital payment conglomerates.'
    ],
    risks: [
      'RBI payment aggregator regulatory oversight and KYC compliance audits.',
      'Hardware obsolescence risk in POS terminal deployments.'
    ],
    documents: [
      { title: 'Prospectus & Listing Circular - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-012',
    isDemo: true,
    companyName: 'Malabar Spices & Botanicals Ltd.',
    symbol: 'MALABARBOT',
    sector: 'FMCG & Natural Extracts',
    board: 'Mainboard',
    status: 'Listed',
    priceBand: { min: 310, max: 325 },
    lotSize: 46,
    issueSizeCr: 740.00,
    freshIssueCr: 500.00,
    ofsCr: 240.00,
    dates: {
      open: '2026-10-28',
      close: '2026-10-30',
      allotment: '2026-11-02',
      refund: '2026-11-03',
      demat: '2026-11-03',
      listing: '2026-11-04'
    },
    subscription: {
      qib: 11.20,
      nii: 8.60,
      retail: 7.40,
      employee: 1.80,
      total: 9.10,
      lastUpdated: 'Closed (Demo)'
    },
    gmp: {
      current: 28,
      previous: 30,
      percentage: 8.62,
      lastUpdated: 'Pre-Listing Final (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-10-28', gmp: 24 },
        { date: '2026-10-30', gmp: 30 },
        { date: '2026-11-03', gmp: 28 }
      ]
    },
    listingPerformance: {
      issuePrice: 325,
      listingPrice: 348,
      listingGainPct: 7.08,
      cmp: 339,
      currentGainPct: 4.31
    },
    financials: {
      fy24: { revenueCr: 520.0, ebitdaCr: 78.0, patCr: 41.6 },
      fy25: { revenueCr: 615.0, ebitdaCr: 95.3, patCr: 52.3 },
      fy26: { revenueCr: 730.0, ebitdaCr: 116.8, patCr: 65.7 },
      revenueGrowthPct: 18.70,
      patGrowthPct: 25.62,
      ebitdaMarginPct: 16.00,
      patMarginPct: 9.00,
      eps: 11.20,
      roePct: 17.5,
      rocePct: 19.1,
      debtToEquity: 0.44,
      pePostIssue: 29.02,
      pbRatio: 4.20
    },
    overview: 'Producer of oleoresins, essential oils, and standardized natural food colors exported to 45 countries.',
    positives: [
      'Long-standing B2B relationships with global flavor and fragrance houses.',
      'Stable 16% EBITDA margin profile despite agricultural commodity swings.'
    ],
    negatives: [
      '62% of revenues generated from export markets exposed to logistics delays.',
      'Inventory holding period averages 135 days due to seasonal spice procurement.'
    ],
    risks: [
      'Strict USFDA and EU pesticide residue compliance standards.',
      'Climate impact on Kerala and Karnataka spice harvests.'
    ],
    documents: [
      { title: 'Prospectus - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-013',
    isDemo: true,
    companyName: 'Aravalli InfraRail Engineering Ltd.',
    symbol: 'ARAVALLIRAIL',
    sector: 'Railway EPC & Signaling',
    board: 'Mainboard',
    status: 'Listed',
    priceBand: { min: 215, max: 228 },
    lotSize: 65,
    issueSizeCr: 890.00,
    freshIssueCr: 690.00,
    ofsCr: 200.00,
    dates: {
      open: '2026-10-21',
      close: '2026-10-23',
      allotment: '2026-10-26',
      refund: '2026-10-27',
      demat: '2026-10-27',
      listing: '2026-10-28'
    },
    subscription: {
      qib: 4.10,
      nii: 3.20,
      retail: 2.45,
      employee: 1.15,
      total: 3.18,
      lastUpdated: 'Closed (Demo)'
    },
    gmp: {
      current: -6,
      previous: 4,
      percentage: -2.63,
      lastUpdated: 'Pre-Listing Final (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-10-21', gmp: 12 },
        { date: '2026-10-23', gmp: 4 },
        { date: '2026-10-27', gmp: -6 }
      ]
    },
    listingPerformance: {
      issuePrice: 228,
      listingPrice: 216,
      listingGainPct: -5.26,
      cmp: 221,
      currentGainPct: -3.07
    },
    financials: {
      fy24: { revenueCr: 710.0, ebitdaCr: 85.2, patCr: 39.0 },
      fy25: { revenueCr: 820.0, ebitdaCr: 98.4, patCr: 45.1 },
      fy26: { revenueCr: 935.0, ebitdaCr: 112.2, patCr: 51.4 },
      revenueGrowthPct: 14.02,
      patGrowthPct: 13.97,
      ebitdaMarginPct: 12.00,
      patMarginPct: 5.50,
      eps: 8.90,
      roePct: 13.4,
      rocePct: 15.1,
      debtToEquity: 0.78,
      pePostIssue: 25.62,
      pbRatio: 2.95
    },
    overview: 'Turnkey railway electrification, overhead equipment (OHE), and electronic interlocking signaling contractor.',
    positives: [
      'Order book visibility of 2.8x FY26 revenue from Indian Railways zones.',
      'Reasonable P/B multiple of 2.95x.'
    ],
    negatives: [
      'Thin PAT margins (5.5%) typical of competitive EPC tender businesses.',
      'Listed at a -5.26% discount due to muted institutional subscription.'
    ],
    risks: [
      'Execution delays caused by right-of-way and land handover bottlenecks.',
      'High bank guarantee and retention money requirements.'
    ],
    documents: [
      { title: 'Prospectus - Sample', type: 'PDF Placeholder' }
    ]
  },
  {
    id: 'demo-ipo-014',
    isDemo: true,
    companyName: 'NexaVolt EV Chargers Ltd.',
    symbol: 'NEXAVOLT',
    sector: 'EV Charging Hardware',
    board: 'SME',
    status: 'Listed',
    priceBand: { min: 152, max: 160 },
    lotSize: 800,
    issueSizeCr: 48.00,
    freshIssueCr: 48.00,
    ofsCr: 0.00,
    dates: {
      open: '2026-10-15',
      close: '2026-10-19',
      allotment: '2026-10-20',
      refund: '2026-10-21',
      demat: '2026-10-21',
      listing: '2026-10-22'
    },
    subscription: {
      qib: 36.50,
      nii: 88.40,
      retail: 112.60,
      employee: 0.00,
      total: 84.20,
      lastUpdated: 'Closed (Demo)'
    },
    gmp: {
      current: 76,
      previous: 70,
      percentage: 47.50,
      lastUpdated: 'Pre-Listing Final (Demo)',
      source: 'Illustrative Demo Feed',
      history: [
        { date: '2026-10-15', gmp: 48 },
        { date: '2026-10-18', gmp: 64 },
        { date: '2026-10-21', gmp: 76 }
      ]
    },
    listingPerformance: {
      issuePrice: 160,
      listingPrice: 248,
      listingGainPct: 55.00,
      cmp: 264,
      currentGainPct: 65.00
    },
    financials: {
      fy24: { revenueCr: 34.0, ebitdaCr: 5.8, patCr: 3.2 },
      fy25: { revenueCr: 58.0, ebitdaCr: 11.6, patCr: 6.9 },
      fy26: { revenueCr: 94.0, ebitdaCr: 20.7, patCr: 13.1 },
      revenueGrowthPct: 62.07,
      patGrowthPct: 89.86,
      ebitdaMarginPct: 22.02,
      patMarginPct: 13.94,
      eps: 6.40,
      roePct: 28.4,
      rocePct: 31.0,
      debtToEquity: 0.18,
      pePostIssue: 25.00,
      pbRatio: 5.20
    },
    overview: 'Manufactures DC fast chargers (60kW–240kW) and OCPP cloud charge-point management software for fleet operators.',
    positives: [
      '62% YoY top-line growth backed by commercial EV fleet adoption.',
      'Strong debut (+55.0% listing gain) on the SME platform.'
    ],
    negatives: [
      'Rapid technological evolution in ultra-fast charging standards.',
      'High post-listing volatility typical of SME counters.'
    ],
    risks: [
      'Dependence on imported power semiconductor modules.',
      'Warranty and field service network expansion costs.'
    ],
    documents: [
      { title: 'SME Prospectus - Sample', type: 'PDF Placeholder' }
    ]
  }
];
