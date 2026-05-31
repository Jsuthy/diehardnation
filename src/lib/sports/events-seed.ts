// Hardcoded major events for surge-capture pages. These change rarely.
// Pre-building these pages months ahead is the core SEO strategy.

export interface SeedEvent {
  slug: string
  name: string
  sport_slug: string
  league_slug?: string | null
  event_type: string
  start_date: string
  end_date?: string | null
  search_surge_rank: number
  description?: string
}

export const SEED_EVENTS: SeedEvent[] = [
  // US events 2026-2027
  { slug: 'super-bowl-lxi', name: 'Super Bowl LXI', sport_slug: 'american-football', event_type: 'championship', start_date: '2027-02-07', search_surge_rank: 1, description: 'Super Bowl LXI — the championship game of the NFL season.' },
  { slug: 'ncaa-march-madness-2027', name: 'NCAA March Madness 2027', sport_slug: 'basketball', event_type: 'tournament', start_date: '2027-03-14', search_surge_rank: 2, description: 'The NCAA Division I Men’s Basketball Tournament.' },
  { slug: 'nfl-draft-2027', name: 'NFL Draft 2027', sport_slug: 'american-football', event_type: 'draft', start_date: '2027-04-23', search_surge_rank: 3 },
  { slug: 'nba-finals-2027', name: 'NBA Finals 2027', sport_slug: 'basketball', event_type: 'championship', start_date: '2027-06-01', search_surge_rank: 4 },
  { slug: 'cfp-championship-2027', name: 'CFP National Championship 2027', sport_slug: 'american-football', event_type: 'championship', start_date: '2027-01-19', search_surge_rank: 5 },
  { slug: 'world-series-2026', name: 'World Series 2026', sport_slug: 'baseball', event_type: 'championship', start_date: '2026-10-21', search_surge_rank: 6 },
  { slug: 'nhl-stanley-cup-2027', name: 'Stanley Cup Finals 2027', sport_slug: 'ice-hockey', event_type: 'championship', start_date: '2027-05-26', search_surge_rank: 7 },
  { slug: 'heisman-2026', name: 'Heisman Trophy Ceremony 2026', sport_slug: 'american-football', event_type: 'awards', start_date: '2026-12-12', search_surge_rank: 8 },
  { slug: 'nba-draft-2026', name: 'NBA Draft 2026', sport_slug: 'basketball', event_type: 'draft', start_date: '2026-06-25', search_surge_rank: 9 },
  { slug: 'cfb-season-2026', name: 'College Football Season 2026', sport_slug: 'american-football', event_type: 'season', start_date: '2026-08-29', search_surge_rank: 10 },
  { slug: 'ncaa-volleyball-2026', name: 'NCAA Volleyball Championship 2026', sport_slug: 'volleyball', event_type: 'championship', start_date: '2026-12-18', search_surge_rank: 11 },
  { slug: 'ncaa-wrestling-2027', name: 'NCAA Wrestling Championships 2027', sport_slug: 'wrestling', event_type: 'championship', start_date: '2027-03-19', search_surge_rank: 12 },
  { slug: 'nfl-playoffs-2027', name: 'NFL Playoffs 2027', sport_slug: 'american-football', event_type: 'tournament', start_date: '2027-01-11', search_surge_rank: 13 },
  { slug: 'nba-all-star-2027', name: 'NBA All-Star Weekend 2027', sport_slug: 'basketball', event_type: 'allstar', start_date: '2027-02-15', search_surge_rank: 14 },
  { slug: 'mlb-opening-day-2027', name: 'MLB Opening Day 2027', sport_slug: 'baseball', event_type: 'season', start_date: '2027-03-26', search_surge_rank: 15 },
  { slug: 'nfl-season-2026', name: 'NFL Season 2026', sport_slug: 'american-football', event_type: 'season', start_date: '2026-09-10', search_surge_rank: 16 },
  { slug: 'nba-season-2026', name: 'NBA Season 2026-27', sport_slug: 'basketball', event_type: 'season', start_date: '2026-10-21', search_surge_rank: 17 },
  { slug: 'masters-2027', name: 'The Masters 2027', sport_slug: 'golf', event_type: 'tournament', start_date: '2027-04-05', search_surge_rank: 18 },
  { slug: 'us-open-golf-2027', name: 'US Open Golf 2027', sport_slug: 'golf', event_type: 'tournament', start_date: '2027-06-14', search_surge_rank: 19 },
  { slug: 'kentucky-derby-2027', name: 'Kentucky Derby 2027', sport_slug: 'horse-racing', event_type: 'race', start_date: '2027-05-01', search_surge_rank: 20 },

  // Global events 2026-2028
  { slug: 'world-cup-2026', name: 'FIFA World Cup 2026', sport_slug: 'soccer', event_type: 'tournament', start_date: '2026-06-11', search_surge_rank: 1, description: 'The FIFA World Cup 2026, hosted across the United States, Canada and Mexico.' },
  { slug: 'champions-league-final-2026', name: 'UCL Final 2026', sport_slug: 'soccer', event_type: 'championship', start_date: '2026-05-30', search_surge_rank: 2 },
  { slug: 'wimbledon-2026', name: 'Wimbledon 2026', sport_slug: 'tennis', event_type: 'tournament', start_date: '2026-06-29', search_surge_rank: 3 },
  { slug: 'us-open-tennis-2026', name: 'US Open 2026', sport_slug: 'tennis', event_type: 'tournament', start_date: '2026-08-24', search_surge_rank: 4 },
  { slug: 'french-open-2026', name: 'Roland Garros 2026', sport_slug: 'tennis', event_type: 'tournament', start_date: '2026-05-25', search_surge_rank: 5 },
  { slug: 'australian-open-2027', name: 'Australian Open 2027', sport_slug: 'tennis', event_type: 'tournament', start_date: '2027-01-12', search_surge_rank: 6 },
  { slug: 'f1-season-2026', name: 'Formula 1 Season 2026', sport_slug: 'motorsport', event_type: 'season', start_date: '2026-03-15', search_surge_rank: 7 },
  { slug: 'f1-monaco-gp-2026', name: 'Monaco Grand Prix 2026', sport_slug: 'motorsport', event_type: 'race', start_date: '2026-05-24', search_surge_rank: 8 },
  { slug: 'tour-de-france-2026', name: 'Tour de France 2026', sport_slug: 'cycling', event_type: 'race', start_date: '2026-07-04', search_surge_rank: 9 },
  { slug: 'rugby-world-cup-2027', name: 'Rugby World Cup 2027', sport_slug: 'rugby', event_type: 'tournament', start_date: '2027-09-05', search_surge_rank: 10 },
  { slug: 'cricket-world-cup-2027', name: 'ICC Cricket World Cup 2027', sport_slug: 'cricket', event_type: 'tournament', start_date: '2027-10-01', search_surge_rank: 11 },
  { slug: 'ipl-2027', name: 'IPL 2027', sport_slug: 'cricket', event_type: 'tournament', start_date: '2027-03-22', search_surge_rank: 12 },
  { slug: 'ufc-313', name: 'UFC 313', sport_slug: 'mma', event_type: 'event', start_date: '2026-06-07', search_surge_rank: 13 },
  { slug: 'copa-america-2026', name: 'Copa América 2026', sport_slug: 'soccer', event_type: 'tournament', start_date: '2026-06-01', search_surge_rank: 14 },
  { slug: 'euros-2028', name: 'UEFA Euro 2028', sport_slug: 'soccer', event_type: 'tournament', start_date: '2028-06-09', search_surge_rank: 15 },
  { slug: 'olympics-2028', name: 'Summer Olympics 2028', sport_slug: 'multi-sport', event_type: 'tournament', start_date: '2028-07-14', search_surge_rank: 16 },
  { slug: 'winter-olympics-2026', name: 'Winter Olympics 2026', sport_slug: 'multi-sport', event_type: 'tournament', start_date: '2026-02-06', search_surge_rank: 17 },
  { slug: 'commonwealth-games-2026', name: 'Commonwealth Games 2026', sport_slug: 'multi-sport', event_type: 'tournament', start_date: '2026-07-17', search_surge_rank: 18 },
  { slug: 'asian-games-2026', name: 'Asian Games 2026', sport_slug: 'multi-sport', event_type: 'tournament', start_date: '2026-09-19', search_surge_rank: 19 },
  { slug: 'pan-american-games-2027', name: 'Pan American Games 2027', sport_slug: 'multi-sport', event_type: 'tournament', start_date: '2027-11-20', search_surge_rank: 20 },
]

// Sports referenced by events / nav that must exist even before TSDB ingestion.
// These guarantee event pages and the homepage sport grid resolve immediately.
export const CORE_SPORTS: { slug: string; name: string; tsdb_name: string | null; category: string; region: string; fan_size_rank: number }[] = [
  { slug: 'american-football', name: 'American Football', tsdb_name: 'American Football', category: 'team_sport', region: 'us', fan_size_rank: 1 },
  { slug: 'basketball', name: 'Basketball', tsdb_name: 'Basketball', category: 'team_sport', region: 'global', fan_size_rank: 2 },
  { slug: 'soccer', name: 'Soccer', tsdb_name: 'Soccer', category: 'team_sport', region: 'global', fan_size_rank: 3 },
  { slug: 'baseball', name: 'Baseball', tsdb_name: 'Baseball', category: 'team_sport', region: 'global', fan_size_rank: 4 },
  { slug: 'ice-hockey', name: 'Ice Hockey', tsdb_name: 'Ice Hockey', category: 'team_sport', region: 'global', fan_size_rank: 5 },
  { slug: 'tennis', name: 'Tennis', tsdb_name: 'Tennis', category: 'individual', region: 'global', fan_size_rank: 6 },
  { slug: 'golf', name: 'Golf', tsdb_name: 'Golf', category: 'individual', region: 'global', fan_size_rank: 7 },
  { slug: 'mma', name: 'MMA', tsdb_name: 'Fighting', category: 'combat', region: 'global', fan_size_rank: 8 },
  { slug: 'rugby', name: 'Rugby', tsdb_name: 'Rugby', category: 'team_sport', region: 'global', fan_size_rank: 9 },
  { slug: 'cricket', name: 'Cricket', tsdb_name: 'Cricket', category: 'team_sport', region: 'global', fan_size_rank: 10 },
  { slug: 'motorsport', name: 'Motorsport', tsdb_name: 'Motorsport', category: 'motorsport', region: 'global', fan_size_rank: 11 },
  { slug: 'cycling', name: 'Cycling', tsdb_name: 'Cycling', category: 'individual', region: 'global', fan_size_rank: 12 },
  { slug: 'volleyball', name: 'Volleyball', tsdb_name: 'Volleyball', category: 'team_sport', region: 'global', fan_size_rank: 13 },
  { slug: 'wrestling', name: 'Wrestling', tsdb_name: 'Wrestling', category: 'combat', region: 'global', fan_size_rank: 14 },
  { slug: 'horse-racing', name: 'Horse Racing', tsdb_name: 'Horse Racing', category: 'individual', region: 'global', fan_size_rank: 15 },
  { slug: 'multi-sport', name: 'Olympics & Multi-Sport', tsdb_name: null, category: 'multi_sport', region: 'global', fan_size_rank: 16 },
]
