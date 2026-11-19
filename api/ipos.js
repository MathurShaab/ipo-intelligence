/**
 * Vercel Serverless Function: /api/ipos
 * Proxies requests securely to EJI Finance IPO API using server-side EJI_API_KEY.
 * Supports query params: ?status=open|upcoming|closed|listed & ?symbol=CRYSTALCP
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

  if (!apiKey) {
    return res.status(500).json({
      status: 'error',
      message: 'EJI_API_KEY is not configured in server environment variables.'
    });
  }

  try {
    const { status, symbol } = req.query;

    // Fetch single IPO detail or status-filtered list
    if (symbol) {
      const detailUrl = `${baseUrl}/api/ipo/${encodeURIComponent(symbol)}`;
      const upstream = await fetch(detailUrl, {
        headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
      });
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    }

    if (status && status !== 'ALL') {
      const listUrl = `${baseUrl}/api/ipo?status=${encodeURIComponent(status.toLowerCase())}`;
      const upstream = await fetch(listUrl, {
        headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
      });
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    }

    // Fetch all 4 statuses in parallel when full dataset is requested
    const statuses = ['open', 'upcoming', 'closed', 'listed'];
    const responses = await Promise.all(
      statuses.map((st) =>
        fetch(`${baseUrl}/api/ipo?status=${st}`, {
          headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
        }).then((r) => (r.ok ? r.json() : { data: [] }))
      )
    );

    const combined = responses.flatMap((r) => (Array.isArray(r.data) ? r.data : []));
    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      count: combined.length,
      data: combined
    });
  } catch (error) {
    return res.status(502).json({
      status: 'error',
      message: 'Upstream EJI API request failed.',
      details: error.message
    });
  }
}
