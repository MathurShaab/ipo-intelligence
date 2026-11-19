/**
 * Vercel Serverless Function: /api/gmp
 * Proxies /api/ipo/{symbol}/gmp (or list) from EJI API.
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

  try {
    const endpoint = symbol
      ? `${baseUrl}/api/ipo/${encodeURIComponent(symbol)}/gmp`
      : `${baseUrl}/api/ipo/gmp`;

    const upstream = await fetch(endpoint, {
      headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (error) {
    return res.status(502).json({
      status: 'error',
      message: 'Failed to fetch GMP data from EJI API.',
      details: error.message
    });
  }
}
