export default async function handler(req, res) {
  const { endpoint } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });
  try {
    // Strip cache-busting param before forwarding
    const cleanEndpoint = endpoint.replace(/&?_=\d+/, '');
    const url = `https://statsapi.mlb.com/api/v1${cleanEndpoint}`;
    const r = await fetch(url);
    const data = await r.json();
    // No cache for schedule endpoints, short cache for others
    const isSchedule = cleanEndpoint.includes('/schedule');
    res.setHeader('Cache-Control', isSchedule ? 'no-store' : 's-maxage=60');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
