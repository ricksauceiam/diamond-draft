export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Fetch all active MLB players for 2026
    const r = await fetch(
      'https://statsapi.mlb.com/api/v1/sports/1/players?season=2026&gameType=R',
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }
    );
    if (!r.ok) throw new Error(`MLB API ${r.status}`);
    const data = await r.json();
    const mlbPlayers = data.people || [];

    // Build a lookup: "firstname lastname" -> { id, position, teamName }
    const mlbLookup = {};
    for (const p of mlbPlayers) {
      const key = `${p.firstName} ${p.lastName}`.toLowerCase().trim();
      mlbLookup[key] = {
        mlbamId: p.id,
        position: p.primaryPosition?.abbreviation || '',
        teamName: p.currentTeam?.name || '',
        team: p.currentTeam?.abbreviation || '',
      };
      // Also index by last name only as fallback
      const lastKey = p.lastName.toLowerCase().trim();
      if (!mlbLookup[lastKey]) mlbLookup[lastKey] = mlbLookup[key];
    }

    // Return the lookup so the frontend can use it
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).json({
      total: mlbPlayers.length,
      lookup: mlbLookup
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
