export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const date = req.query.date || new Date().toISOString().split('T')[0];

  try {
    const [r1, r2] = await Promise.all([
      fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=linescore,team`),
      fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=17&date=${date}&hydrate=linescore,team`),
    ]);
    const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
    const games1 = d1?.dates?.[0]?.games || [];
    const games2 = d2?.dates?.[0]?.games || [];
    const allGames = [...games1, ...games2];
    res.status(200).json({
      dates: allGames.length > 0 ? [{ date, games: allGames }] : [],
      isSpringTraining: games2.length > 0 && games1.length === 0,
    });
  } catch (e) {
    res.status(500).json({ error: e.message, dates: [] });
  }
}
