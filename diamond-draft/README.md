# ⚾ Diamond Draft

Fantasy baseball card game — collect MLB players, fuse cards to upgrade rarity, and battle rivals.

## Setup (5 minutes)

### 1. Supabase
1. Go to [supabase.com](https://supabase.com) → New project
2. After it's ready, go to **Settings → API**
3. Copy your **Project URL** and **anon/public** key
4. Go to **Authentication → Email** and enable email/password sign-in

### 2. Add your keys to the code
Open `public/index.html` and replace lines near the top:
```js
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### 3. Deploy to Vercel
```bash
# Install Vercel CLI if needed
npm i -g vercel

# From project root
vercel

# Follow prompts — it auto-detects the structure
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deploys.

### 4. Set environment variables in Vercel (optional but recommended)
Rather than hardcoding keys, use Vercel env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then update the code to use `process.env.NEXT_PUBLIC_SUPABASE_URL`.

---

## Game Features

- **590 MLB players** across 5 rarity tiers
- **2 packs per day** (5 cards each) — resets at midnight
- **Daily streak** tracking — keep opening packs every day
- **Fuse system** — collect duplicates to upgrade rarity: Common → Rare → Epic → Legendary → Mythic
- **Battle system** — build a 4-card lineup (1 pitcher + 3 batters) and challenge rivals
- **localStorage** persistence — data saved per browser/device

## Pack Odds (per card)
| Rarity | Chance |
|--------|--------|
| Common | 55% |
| Rare | 28% |
| Epic | 12% |
| Legendary | 4% |
| Mythic | 1% |

*At least 1 Rare guaranteed per pack.*

## Rarity Distribution (590 players)
| Rarity | Count | % |
|--------|-------|---|
| Common | ~303 | 51% |
| Rare | ~122 | 21% |
| Epic | ~68 | 12% |
| Legendary | ~29 | 5% |
| Mythic | ~8 | 1% |

## Adding Real Database (future)
When ready to persist data server-side instead of localStorage:
1. Create Supabase tables: `user_collections`, `user_packs`, `user_streaks`
2. Replace `localStorage.getItem/setItem` calls with Supabase queries
3. All the auth is already wired up — user IDs are already tracked
