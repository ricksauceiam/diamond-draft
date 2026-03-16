export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const [r1, r2] = await Promise.all([
      fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=linescore,team`),
      fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=17&date=${date}&hydrate=linescore,team`),
    ]);

    const [d1, d2] = await Promise.all([r1.json(), r2.json()]);

    const games1 = d1?.dates?.[0]?.games || [];
    const games2 = d2?.dates?.[0]?.games || [];
    const allGames = [...games1, ...games2];

    const result = {
      dates: allGames.length > 0 ? [{ date, games: allGames }] : [],
      isSpringTraining: games2.length > 0 && games1.length === 0,
    };

    return new Response(JSON.stringify(result), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, dates: [] }), { status: 500, headers });
  }
}
