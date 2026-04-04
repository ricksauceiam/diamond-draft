export default async function handler(req, res) {
  const { endpoint, _, ...rest } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });
  try {
    // Reconstruct full query string from all params except 'endpoint' and cache-buster '_'
    const extraParams = Object.entries(rest).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&');
    const cleanEndpoint = endpoint.replace(/&?_=\d+/, '');
    const separator = cleanEndpoint.includes('?') ? '&' : '?';
    const url = `https://statsapi.mlb.com/api/v1${cleanEndpoint}${extraParams ? separator+extraParams : ''}`;
    const r = await fetch(url);
    const data = await r.json();
    const isSchedule = cleanEndpoint.includes('/schedule');
    res.setHeader('Cache-Control', isSchedule ? 'no-store' : 's-maxage=60');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
