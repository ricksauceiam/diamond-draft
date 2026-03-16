export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const date = req.query.date || new Date().toISOString().split('T')[0];

  try {
    // sportId=1 = MLB regular season, sportId=17 = spring training
    // Fetch both and merge so we always get games regardless of time of year
    const [regularRes, springRes] = await Promise.all([
      fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=linescore,team`, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
      }),
      fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=17&date=${date}&hydrate=linescore,team`, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
      })
    ]);

    const [regularData, springData] = await Promise.all([
      regularRes.json(),
      springRes.json()
    ]);

    // Merge games from both
    const regularGames = regularData?.dates?.[0]?.games || [];
    const springGames = springData?.dates?.[0]?.games || [];
    const allGames = [...regularGames, ...springGames];

    // Return in same format the frontend expects
    const merged = {
      dates: allGames.length > 0 ? [{ date, games: allGames }] : [],
      isSpringTraining: springGames.length > 0 && regularGames.length === 0
    };

    res.status(200).json(merged);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
