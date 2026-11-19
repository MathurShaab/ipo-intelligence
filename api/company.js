/**
 * Vercel Serverless Function: /api/company
 * Proxies /api/ipo/{symbol}/performance and company metadata from EJI API.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const baseUrl = (process.env.EJI_API_BASE_URL || 'https://fin.ejiapi.com').replace(/\/$/, '');
  const apiKey = process.env.EJI_API_KEY;
  const { symbol } = req.query;

  if (!apiKey) {
    return res.status(500).json({ status: 'error', message: 'EJI_API_KEY is not configured.' });
  }
  if (!symbol) {
    return res.status(400).json({ status: 'error', message: 'Query parameter "symbol" is required.' });
  }

  try {
    const [detailRes, perfRes] = await Promise.all([
      fetch(`${baseUrl}/api/ipo/${encodeURIComponent(symbol)}`, {
        headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
      }),
      fetch(`${baseUrl}/api/ipo/${encodeURIComponent(symbol)}/performance`, {
        headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
      })
    ]);

    const detailJson = detailRes.ok ? await detailRes.json() : null;
    const perfJson = perfRes.ok ? await perfRes.json() : null;

    return res.status(200).json({
      status: 'success',
      symbol,
      detail: detailJson?.data || detailJson,
      performance: perfJson?.data || perfJson
    });
  } catch (error) {
    return res.status(502).json({
      status: 'error',
      message: 'Failed to fetch company/performance data from EJI API.',
      details: error.message
    });
  }
}
