/**
 * Vercel Serverless Function: /api/analysis
 * Endpoint scaffold for server-side scoring & fundamental enrichment.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'success',
    message: 'IPO Intelligence Analysis Endpoint Ready',
    weights: {
      financialPerformance: 25,
      businessFundamentals: 20,
      valuation: 20,
      managementGovernance: 15,
      ipoStructure: 10,
      marketSentiment: 10
    }
  });
}
