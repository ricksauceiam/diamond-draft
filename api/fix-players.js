export default async function handler(req, res) {
  try {
    const r = await fetch('https://statsapi.mlb.com/api/v1/sports/1/players?season=2026&gameType=R');
    const data = await r.json();
    const people = data.people || [];
    const byFull = {}, byLast = {}, byLastFirst = {};
    people.forEach(p => {
      const fn = (p.firstName||'').toLowerCase().trim();
      const ln = (p.lastName||'').toLowerCase().trim();
      const full = fn + ' ' + ln;
      const lastFirst = ln + ' ' + fn;
      const entry = { mlbamId: p.id, firstName: p.firstName, lastName: p.lastName, team: p.currentTeam?.abbreviation, teamName: p.currentTeam?.name };
      byFull[full] = entry;
      byLastFirst[lastFirst] = entry;
      if(!byLast[ln]) byLast[ln] = [];
      byLast[ln].push(entry);
    });
    res.json({ total: people.length, byFull, byLast, byLastFirst });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
