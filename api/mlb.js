export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { endpoint } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

  try {
    const url = `https://statsapi.mlb.com/api/v1${endpoint}`;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    });
    if (!r.ok) return res.status(r.status).json({ error: `MLB API: ${r.status}` });
    const data = await r.json();
    // Cache for 60 seconds during live games
    res.setHeader('Cache-Control', 's-maxage=60');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
