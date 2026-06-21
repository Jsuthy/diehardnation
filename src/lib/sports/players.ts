import { slugify } from './utils'

// Curated star athletes whose jerseys/merch have high commercial search volume.
// Player pages render live eBay gear (quality-gated) like moment pages — no DB
// needed. Keep this list to genuinely high-demand names so every page clears
// the product threshold and stays non-thin.

export interface PlayerSeed {
  name: string
  team: string
  league_slug: string
  sport_slug: string
}

const SEED: PlayerSeed[] = [
  // NFL
  { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', league_slug: 'nfl', sport_slug: 'american-football' },
  { name: 'Josh Allen', team: 'Buffalo Bills', league_slug: 'nfl', sport_slug: 'american-football' },
  { name: 'Jalen Hurts', team: 'Philadelphia Eagles', league_slug: 'nfl', sport_slug: 'american-football' },
  { name: 'Justin Jefferson', team: 'Minnesota Vikings', league_slug: 'nfl', sport_slug: 'american-football' },
  { name: 'Lamar Jackson', team: 'Baltimore Ravens', league_slug: 'nfl', sport_slug: 'american-football' },
  { name: 'Joe Burrow', team: 'Cincinnati Bengals', league_slug: 'nfl', sport_slug: 'american-football' },
  { name: 'Travis Kelce', team: 'Kansas City Chiefs', league_slug: 'nfl', sport_slug: 'american-football' },
  { name: 'CeeDee Lamb', team: 'Dallas Cowboys', league_slug: 'nfl', sport_slug: 'american-football' },
  { name: 'Tyreek Hill', team: 'Miami Dolphins', league_slug: 'nfl', sport_slug: 'american-football' },
  { name: 'Micah Parsons', team: 'Dallas Cowboys', league_slug: 'nfl', sport_slug: 'american-football' },
  // NBA
  { name: 'LeBron James', team: 'Los Angeles Lakers', league_slug: 'nba', sport_slug: 'basketball' },
  { name: 'Stephen Curry', team: 'Golden State Warriors', league_slug: 'nba', sport_slug: 'basketball' },
  { name: 'Nikola Jokic', team: 'Denver Nuggets', league_slug: 'nba', sport_slug: 'basketball' },
  { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', league_slug: 'nba', sport_slug: 'basketball' },
  { name: 'Luka Doncic', team: 'Los Angeles Lakers', league_slug: 'nba', sport_slug: 'basketball' },
  { name: 'Jayson Tatum', team: 'Boston Celtics', league_slug: 'nba', sport_slug: 'basketball' },
  { name: 'Victor Wembanyama', team: 'San Antonio Spurs', league_slug: 'nba', sport_slug: 'basketball' },
  { name: 'Kevin Durant', team: 'Phoenix Suns', league_slug: 'nba', sport_slug: 'basketball' },
  { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', league_slug: 'nba', sport_slug: 'basketball' },
  // MLB
  { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', league_slug: 'mlb', sport_slug: 'baseball' },
  { name: 'Aaron Judge', team: 'New York Yankees', league_slug: 'mlb', sport_slug: 'baseball' },
  { name: 'Mookie Betts', team: 'Los Angeles Dodgers', league_slug: 'mlb', sport_slug: 'baseball' },
  { name: 'Ronald Acuna Jr', team: 'Atlanta Braves', league_slug: 'mlb', sport_slug: 'baseball' },
  { name: 'Mike Trout', team: 'Los Angeles Angels', league_slug: 'mlb', sport_slug: 'baseball' },
  { name: 'Juan Soto', team: 'New York Mets', league_slug: 'mlb', sport_slug: 'baseball' },
  // NHL
  { name: 'Connor McDavid', team: 'Edmonton Oilers', league_slug: 'nhl', sport_slug: 'ice-hockey' },
  { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', league_slug: 'nhl', sport_slug: 'ice-hockey' },
  { name: 'Auston Matthews', team: 'Toronto Maple Leafs', league_slug: 'nhl', sport_slug: 'ice-hockey' },
  { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', league_slug: 'nhl', sport_slug: 'ice-hockey' },
  // Soccer
  { name: 'Lionel Messi', team: 'Inter Miami CF', league_slug: 'mls', sport_slug: 'soccer' },
  { name: 'Cristiano Ronaldo', team: 'Al Nassr', league_slug: 'premier-league', sport_slug: 'soccer' },
  { name: 'Kylian Mbappe', team: 'Real Madrid', league_slug: 'la-liga', sport_slug: 'soccer' },
  { name: 'Erling Haaland', team: 'Manchester City', league_slug: 'premier-league', sport_slug: 'soccer' },
  { name: 'Vinicius Junior', team: 'Real Madrid', league_slug: 'la-liga', sport_slug: 'soccer' },
  { name: 'Jude Bellingham', team: 'Real Madrid', league_slug: 'la-liga', sport_slug: 'soccer' },
  { name: 'Mohamed Salah', team: 'Liverpool FC', league_slug: 'premier-league', sport_slug: 'soccer' },
  { name: 'Harry Kane', team: 'Bayern Munich', league_slug: 'bundesliga', sport_slug: 'soccer' },
]

export interface Player extends PlayerSeed {
  slug: string
}

export const PLAYERS: Player[] = SEED.map(p => ({ ...p, slug: slugify(p.name) }))

export function findPlayer(slug: string): Player | null {
  return PLAYERS.find(p => p.slug === slug) ?? null
}
