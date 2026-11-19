# IPO Intelligence — Indian Primary Market Research & Analytics Platform

A complete, production-ready Indian IPO research, fundamental analysis, GMP tracking, and investor calculation platform built with **HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, Bootstrap Icons, Chart.js, and Vercel Serverless Functions**.

## Completed Production Modules (All 12 Pages)
1. **Market Dashboard:** Real-time KPI summary, Market Overview & Subscription charts, Upcoming IPO Calendar, Recent Listing Performance, and multi-filter screener (Mainboard, SME, Upcoming, Open, Closed, Listed).
2. **Upcoming IPOs**
3. **Current / Open IPOs**
4. **Closed IPOs**
5. **Listed IPOs**
6. **IPO Research Detail:** Issue metadata, Fresh/OFS split, schedule, subscription breakdown, GMP trend chart, 100-point score breakdown, strengths/risks, and documents.
7. **GMP Tracker:** Current vs. previous GMP delta, indicative listing price, multi-day GMP chart, unofficial-data disclaimer, and cross-IPO GMP monitor.
8. **Company Fundamental Analysis & Configurable 100-Point Scoring Engine:** Multi-year Revenue/EBITDA/PAT charts, ROE/ROCE/Debt-to-Equity/P-E/P-B ratios, peer benchmarking, customizable category weights, missing data detection, and confidence scoring.
9. **Side-by-Side IPO Comparison:** Benchmark up to 4 IPOs across financial growth, valuation, subscription, GMP, composite score, and risk score.
10. **Allotment Probability Calculator:** Interactive SEBI retail lottery allotment probability estimator with transparent assumptions.
11. **Listing Gain / Loss Calculator:** Optimistic, Neutral, and Pessimistic debut projection calculator.
12. **Saved Watchlist:** `localStorage`-backed milestone and GMP tracker.

## Deployment (Vercel & GitHub Pages)
- **Vercel (Full-Stack):** Push to GitHub, import into Vercel, add `EJI_API_KEY` and `EJI_API_BASE_URL=https://fin.ejiapi.com` in **Settings → Environment Variables**, and deploy.
- **GitHub Pages (Static Frontend):** Update `API_BASE_URL` in `assets/js/config.js` to your deployed Vercel `/api` URL.
