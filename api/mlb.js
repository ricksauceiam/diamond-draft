export default async function handler(req, res) {
  const { endpoint } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });
  try {
    const url = `https://statsapi.mlb.com/api/v1${endpoint}`;
    const r = await fetch(url);
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=60');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
