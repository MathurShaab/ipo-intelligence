/**
 * Vercel Serverless Function: /api/subscription
 * Proxies /api/ipo/{symbol}/subscription?history=true from EJI API.
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
  const { symbol, history = 'true' } = req.query;

  if (!apiKey) {
    return res.status(500).json({ status: 'error', message: 'EJI_API_KEY is not configured.' });
  }
  if (!symbol) {
    return res.status(400).json({ status: 'error', message: 'Query parameter "symbol" is required.' });
  }

  try {
    const url = `${baseUrl}/api/ipo/${encodeURIComponent(symbol)}/subscription?history=${encodeURIComponent(history)}`;
    const upstream = await fetch(url, {
      headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (error) {
    return res.status(502).json({
      status: 'error',
      message: 'Failed to fetch subscription data from EJI API.',
      details: error.message
    });
  }
}
