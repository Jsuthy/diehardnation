// Curated pro leagues + teams for the top US/global leagues.
// Gear-first strategy: team pages are the product, so we ship accurate, complete
// data for high-demand leagues rather than depend on flaky/free-tier API matching.
// NFL is fully populated (flagship); other majors have league rows so their
// league-level gear pages monetize. Add teams league-by-league over time.

import type { League, Team } from './types'
import { slugify } from './utils'

interface SeedLeague {
  slug: string
  name: string
  short_name: string
  sport_slug: string
  country: string
  fan_size_rank: number
}

interface SeedTeam {
  name: string
  city: string
  league_slug: string
  sport_slug: string
  primary: string
  secondary: string
}

export const PRO_LEAGUES: SeedLeague[] = [
  { slug: 'nfl', name: 'NFL', short_name: 'NFL', sport_slug: 'american-football', country: 'USA', fan_size_rank: 1 },
  { slug: 'nba', name: 'NBA', short_name: 'NBA', sport_slug: 'basketball', country: 'USA', fan_size_rank: 2 },
  { slug: 'mlb', name: 'MLB', short_name: 'MLB', sport_slug: 'baseball', country: 'USA', fan_size_rank: 3 },
  { slug: 'nhl', name: 'NHL', short_name: 'NHL', sport_slug: 'ice-hockey', country: 'USA', fan_size_rank: 4 },
  { slug: 'mls', name: 'Major League Soccer', short_name: 'MLS', sport_slug: 'soccer', country: 'USA', fan_size_rank: 8 },
  { slug: 'premier-league', name: 'Premier League', short_name: 'EPL', sport_slug: 'soccer', country: 'England', fan_size_rank: 5 },
  { slug: 'la-liga', name: 'La Liga', short_name: 'La Liga', sport_slug: 'soccer', country: 'Spain', fan_size_rank: 6 },
  { slug: 'champions-league', name: 'UEFA Champions League', short_name: 'UCL', sport_slug: 'soccer', country: 'Europe', fan_size_rank: 7 },
]

const NFL: Omit<SeedTeam, 'league_slug' | 'sport_slug'>[] = [
  { name: 'Buffalo Bills', city: 'Buffalo, NY', primary: '#00338D', secondary: '#C60C30' },
  { name: 'Miami Dolphins', city: 'Miami, FL', primary: '#008E97', secondary: '#FC4C02' },
  { name: 'New England Patriots', city: 'Foxborough, MA', primary: '#002244', secondary: '#C60C30' },
  { name: 'New York Jets', city: 'East Rutherford, NJ', primary: '#125740', secondary: '#FFFFFF' },
  { name: 'Baltimore Ravens', city: 'Baltimore, MD', primary: '#241773', secondary: '#000000' },
  { name: 'Cincinnati Bengals', city: 'Cincinnati, OH', primary: '#FB4F14', secondary: '#000000' },
  { name: 'Cleveland Browns', city: 'Cleveland, OH', primary: '#311D00', secondary: '#FF3C00' },
  { name: 'Pittsburgh Steelers', city: 'Pittsburgh, PA', primary: '#FFB612', secondary: '#101820' },
  { name: 'Houston Texans', city: 'Houston, TX', primary: '#03202F', secondary: '#A71930' },
  { name: 'Indianapolis Colts', city: 'Indianapolis, IN', primary: '#002C5F', secondary: '#FFFFFF' },
  { name: 'Jacksonville Jaguars', city: 'Jacksonville, FL', primary: '#006778', secondary: '#9F792C' },
  { name: 'Tennessee Titans', city: 'Nashville, TN', primary: '#0C2340', secondary: '#4B92DB' },
  { name: 'Denver Broncos', city: 'Denver, CO', primary: '#FB4F14', secondary: '#002244' },
  { name: 'Kansas City Chiefs', city: 'Kansas City, MO', primary: '#E31837', secondary: '#FFB81C' },
  { name: 'Las Vegas Raiders', city: 'Las Vegas, NV', primary: '#000000', secondary: '#A5ACAF' },
  { name: 'Los Angeles Chargers', city: 'Los Angeles, CA', primary: '#0080C6', secondary: '#FFC20E' },
  { name: 'Dallas Cowboys', city: 'Arlington, TX', primary: '#003594', secondary: '#869397' },
  { name: 'New York Giants', city: 'East Rutherford, NJ', primary: '#0B2265', secondary: '#A71930' },
  { name: 'Philadelphia Eagles', city: 'Philadelphia, PA', primary: '#004C54', secondary: '#A5ACAF' },
  { name: 'Washington Commanders', city: 'Landover, MD', primary: '#5A1414', secondary: '#FFB612' },
  { name: 'Chicago Bears', city: 'Chicago, IL', primary: '#0B162A', secondary: '#C83803' },
  { name: 'Detroit Lions', city: 'Detroit, MI', primary: '#0076B6', secondary: '#B0B7BC' },
  { name: 'Green Bay Packers', city: 'Green Bay, WI', primary: '#203731', secondary: '#FFB612' },
  { name: 'Minnesota Vikings', city: 'Minneapolis, MN', primary: '#4F2683', secondary: '#FFC62F' },
  { name: 'Atlanta Falcons', city: 'Atlanta, GA', primary: '#A71930', secondary: '#000000' },
  { name: 'Carolina Panthers', city: 'Charlotte, NC', primary: '#0085CA', secondary: '#101820' },
  { name: 'New Orleans Saints', city: 'New Orleans, LA', primary: '#D3BC8D', secondary: '#101820' },
  { name: 'Tampa Bay Buccaneers', city: 'Tampa, FL', primary: '#D50A0A', secondary: '#34302B' },
  { name: 'Arizona Cardinals', city: 'Glendale, AZ', primary: '#97233F', secondary: '#FFB612' },
  { name: 'Los Angeles Rams', city: 'Los Angeles, CA', primary: '#003594', secondary: '#FFA300' },
  { name: 'San Francisco 49ers', city: 'Santa Clara, CA', primary: '#AA0000', secondary: '#B3995D' },
  { name: 'Seattle Seahawks', city: 'Seattle, WA', primary: '#002244', secondary: '#69BE28' },
]

const NBA: Omit<SeedTeam, 'league_slug' | 'sport_slug'>[] = [
  { name: 'Boston Celtics', city: 'Boston, MA', primary: '#007A33', secondary: '#BA9653' },
  { name: 'Brooklyn Nets', city: 'Brooklyn, NY', primary: '#000000', secondary: '#FFFFFF' },
  { name: 'New York Knicks', city: 'New York, NY', primary: '#006BB6', secondary: '#F58426' },
  { name: 'Philadelphia 76ers', city: 'Philadelphia, PA', primary: '#006BB6', secondary: '#ED174C' },
  { name: 'Toronto Raptors', city: 'Toronto, ON', primary: '#CE1141', secondary: '#000000' },
  { name: 'Chicago Bulls', city: 'Chicago, IL', primary: '#CE1141', secondary: '#000000' },
  { name: 'Cleveland Cavaliers', city: 'Cleveland, OH', primary: '#860038', secondary: '#FDBB30' },
  { name: 'Detroit Pistons', city: 'Detroit, MI', primary: '#C8102E', secondary: '#1D42BA' },
  { name: 'Indiana Pacers', city: 'Indianapolis, IN', primary: '#002D62', secondary: '#FDBB30' },
  { name: 'Milwaukee Bucks', city: 'Milwaukee, WI', primary: '#00471B', secondary: '#EEE1C6' },
  { name: 'Atlanta Hawks', city: 'Atlanta, GA', primary: '#E03A3E', secondary: '#C1D32F' },
  { name: 'Charlotte Hornets', city: 'Charlotte, NC', primary: '#1D1160', secondary: '#00788C' },
  { name: 'Miami Heat', city: 'Miami, FL', primary: '#98002E', secondary: '#F9A01B' },
  { name: 'Orlando Magic', city: 'Orlando, FL', primary: '#0077C0', secondary: '#C4CED4' },
  { name: 'Washington Wizards', city: 'Washington, DC', primary: '#002B5C', secondary: '#E31837' },
  { name: 'Denver Nuggets', city: 'Denver, CO', primary: '#0E2240', secondary: '#FEC524' },
  { name: 'Minnesota Timberwolves', city: 'Minneapolis, MN', primary: '#0C2340', secondary: '#236192' },
  { name: 'Oklahoma City Thunder', city: 'Oklahoma City, OK', primary: '#007AC1', secondary: '#EF3B24' },
  { name: 'Portland Trail Blazers', city: 'Portland, OR', primary: '#E03A3E', secondary: '#000000' },
  { name: 'Utah Jazz', city: 'Salt Lake City, UT', primary: '#002B5C', secondary: '#00471B' },
  { name: 'Golden State Warriors', city: 'San Francisco, CA', primary: '#1D428A', secondary: '#FFC72C' },
  { name: 'LA Clippers', city: 'Los Angeles, CA', primary: '#C8102E', secondary: '#1D428A' },
  { name: 'Los Angeles Lakers', city: 'Los Angeles, CA', primary: '#552583', secondary: '#FDB927' },
  { name: 'Phoenix Suns', city: 'Phoenix, AZ', primary: '#1D1160', secondary: '#E56020' },
  { name: 'Sacramento Kings', city: 'Sacramento, CA', primary: '#5A2D81', secondary: '#63727A' },
  { name: 'Dallas Mavericks', city: 'Dallas, TX', primary: '#00538C', secondary: '#002B5E' },
  { name: 'Houston Rockets', city: 'Houston, TX', primary: '#CE1141', secondary: '#000000' },
  { name: 'Memphis Grizzlies', city: 'Memphis, TN', primary: '#5D76A9', secondary: '#12173F' },
  { name: 'New Orleans Pelicans', city: 'New Orleans, LA', primary: '#0C2340', secondary: '#C8102E' },
  { name: 'San Antonio Spurs', city: 'San Antonio, TX', primary: '#000000', secondary: '#C4CED4' },
]

const MLB: Omit<SeedTeam, 'league_slug' | 'sport_slug'>[] = [
  { name: 'Baltimore Orioles', city: 'Baltimore, MD', primary: '#DF4601', secondary: '#000000' },
  { name: 'Boston Red Sox', city: 'Boston, MA', primary: '#BD3039', secondary: '#0C2340' },
  { name: 'New York Yankees', city: 'New York, NY', primary: '#003087', secondary: '#E4002C' },
  { name: 'Tampa Bay Rays', city: 'St. Petersburg, FL', primary: '#092C5C', secondary: '#8FBCE6' },
  { name: 'Toronto Blue Jays', city: 'Toronto, ON', primary: '#134A8E', secondary: '#1D2D5C' },
  { name: 'Chicago White Sox', city: 'Chicago, IL', primary: '#27251F', secondary: '#C4CED4' },
  { name: 'Cleveland Guardians', city: 'Cleveland, OH', primary: '#00385D', secondary: '#E50022' },
  { name: 'Detroit Tigers', city: 'Detroit, MI', primary: '#0C2340', secondary: '#FA4616' },
  { name: 'Kansas City Royals', city: 'Kansas City, MO', primary: '#004687', secondary: '#BD9B60' },
  { name: 'Minnesota Twins', city: 'Minneapolis, MN', primary: '#002B5C', secondary: '#D31145' },
  { name: 'Houston Astros', city: 'Houston, TX', primary: '#002D62', secondary: '#EB6E1F' },
  { name: 'Los Angeles Angels', city: 'Anaheim, CA', primary: '#003263', secondary: '#BA0021' },
  { name: 'Athletics', city: 'West Sacramento, CA', primary: '#003831', secondary: '#EFB21E' },
  { name: 'Seattle Mariners', city: 'Seattle, WA', primary: '#0C2C56', secondary: '#005C5C' },
  { name: 'Texas Rangers', city: 'Arlington, TX', primary: '#003278', secondary: '#C0111F' },
  { name: 'Atlanta Braves', city: 'Atlanta, GA', primary: '#CE1141', secondary: '#13274F' },
  { name: 'Miami Marlins', city: 'Miami, FL', primary: '#00A3E0', secondary: '#000000' },
  { name: 'New York Mets', city: 'New York, NY', primary: '#002D72', secondary: '#FF5910' },
  { name: 'Philadelphia Phillies', city: 'Philadelphia, PA', primary: '#E81828', secondary: '#002D72' },
  { name: 'Washington Nationals', city: 'Washington, DC', primary: '#AB0003', secondary: '#14225A' },
  { name: 'Chicago Cubs', city: 'Chicago, IL', primary: '#0E3386', secondary: '#CC3433' },
  { name: 'Cincinnati Reds', city: 'Cincinnati, OH', primary: '#C6011F', secondary: '#000000' },
  { name: 'Milwaukee Brewers', city: 'Milwaukee, WI', primary: '#12284B', secondary: '#FFC52F' },
  { name: 'Pittsburgh Pirates', city: 'Pittsburgh, PA', primary: '#27251F', secondary: '#FDB827' },
  { name: 'St. Louis Cardinals', city: 'St. Louis, MO', primary: '#C41E3A', secondary: '#0C2340' },
  { name: 'Arizona Diamondbacks', city: 'Phoenix, AZ', primary: '#A71930', secondary: '#E3D4AD' },
  { name: 'Colorado Rockies', city: 'Denver, CO', primary: '#33006F', secondary: '#C4CED4' },
  { name: 'Los Angeles Dodgers', city: 'Los Angeles, CA', primary: '#005A9C', secondary: '#EF3E42' },
  { name: 'San Diego Padres', city: 'San Diego, CA', primary: '#2F241D', secondary: '#FFC425' },
  { name: 'San Francisco Giants', city: 'San Francisco, CA', primary: '#FD5A1E', secondary: '#27251F' },
]

const NHL: Omit<SeedTeam, 'league_slug' | 'sport_slug'>[] = [
  { name: 'Boston Bruins', city: 'Boston, MA', primary: '#FFB81C', secondary: '#000000' },
  { name: 'Buffalo Sabres', city: 'Buffalo, NY', primary: '#003087', secondary: '#FFB81C' },
  { name: 'Detroit Red Wings', city: 'Detroit, MI', primary: '#CE1126', secondary: '#FFFFFF' },
  { name: 'Florida Panthers', city: 'Sunrise, FL', primary: '#041E42', secondary: '#C8102E' },
  { name: 'Montreal Canadiens', city: 'Montreal, QC', primary: '#AF1E2D', secondary: '#192168' },
  { name: 'Ottawa Senators', city: 'Ottawa, ON', primary: '#C52032', secondary: '#000000' },
  { name: 'Tampa Bay Lightning', city: 'Tampa, FL', primary: '#002868', secondary: '#FFFFFF' },
  { name: 'Toronto Maple Leafs', city: 'Toronto, ON', primary: '#00205B', secondary: '#FFFFFF' },
  { name: 'Carolina Hurricanes', city: 'Raleigh, NC', primary: '#CC0000', secondary: '#000000' },
  { name: 'Columbus Blue Jackets', city: 'Columbus, OH', primary: '#002654', secondary: '#CE1126' },
  { name: 'New Jersey Devils', city: 'Newark, NJ', primary: '#CE1126', secondary: '#000000' },
  { name: 'New York Islanders', city: 'Elmont, NY', primary: '#00539B', secondary: '#F47D30' },
  { name: 'New York Rangers', city: 'New York, NY', primary: '#0038A8', secondary: '#CE1126' },
  { name: 'Philadelphia Flyers', city: 'Philadelphia, PA', primary: '#F74902', secondary: '#000000' },
  { name: 'Pittsburgh Penguins', city: 'Pittsburgh, PA', primary: '#000000', secondary: '#FCB514' },
  { name: 'Washington Capitals', city: 'Washington, DC', primary: '#041E42', secondary: '#C8102E' },
  { name: 'Chicago Blackhawks', city: 'Chicago, IL', primary: '#CF0A2C', secondary: '#000000' },
  { name: 'Colorado Avalanche', city: 'Denver, CO', primary: '#6F263D', secondary: '#236192' },
  { name: 'Dallas Stars', city: 'Dallas, TX', primary: '#006847', secondary: '#8F8F8C' },
  { name: 'Minnesota Wild', city: 'St. Paul, MN', primary: '#154734', secondary: '#A6192E' },
  { name: 'Nashville Predators', city: 'Nashville, TN', primary: '#FFB81C', secondary: '#041E42' },
  { name: 'St. Louis Blues', city: 'St. Louis, MO', primary: '#002F87', secondary: '#FCB514' },
  { name: 'Utah Hockey Club', city: 'Salt Lake City, UT', primary: '#6CACE4', secondary: '#010101' },
  { name: 'Winnipeg Jets', city: 'Winnipeg, MB', primary: '#041E42', secondary: '#004C97' },
  { name: 'Anaheim Ducks', city: 'Anaheim, CA', primary: '#F47A38', secondary: '#B09862' },
  { name: 'Calgary Flames', city: 'Calgary, AB', primary: '#C8102E', secondary: '#F1BE48' },
  { name: 'Edmonton Oilers', city: 'Edmonton, AB', primary: '#FF4C00', secondary: '#041E42' },
  { name: 'Los Angeles Kings', city: 'Los Angeles, CA', primary: '#111111', secondary: '#A2AAAD' },
  { name: 'San Jose Sharks', city: 'San Jose, CA', primary: '#006D75', secondary: '#EA7200' },
  { name: 'Seattle Kraken', city: 'Seattle, WA', primary: '#001628', secondary: '#99D9D9' },
  { name: 'Vancouver Canucks', city: 'Vancouver, BC', primary: '#00205B', secondary: '#00843D' },
  { name: 'Vegas Golden Knights', city: 'Las Vegas, NV', primary: '#B4975A', secondary: '#333F42' },
]

export const PRO_TEAMS: SeedTeam[] = [
  ...NFL.map(t => ({ ...t, league_slug: 'nfl', sport_slug: 'american-football' })),
  ...NBA.map(t => ({ ...t, league_slug: 'nba', sport_slug: 'basketball' })),
  ...MLB.map(t => ({ ...t, league_slug: 'mlb', sport_slug: 'baseball' })),
  ...NHL.map(t => ({ ...t, league_slug: 'nhl', sport_slug: 'ice-hockey' })),
]

function toTeam(t: SeedTeam): Team {
  const slug = slugify(t.name)
  return {
    id: slug, slug, name: t.name, short_name: null, nickname: null,
    city: t.city, country: 'USA', league_slug: t.league_slug, sport_slug: t.sport_slug,
    primary_color: t.primary, secondary_color: t.secondary, tsdb_id: null,
    is_active: true, fan_size_rank: 1,
  }
}

function toLeague(l: SeedLeague): League {
  return {
    id: l.slug, slug: l.slug, name: l.name, short_name: l.short_name,
    sport_slug: l.sport_slug, country: l.country, region: 'global', tsdb_id: null,
    is_active: true, fan_size_rank: l.fan_size_rank,
  }
}

export const PRO_TEAM_LIST: Team[] = PRO_TEAMS.map(toTeam)
export const PRO_LEAGUE_LIST: League[] = PRO_LEAGUES.map(toLeague)

export function findProTeam(slug: string): Team | null {
  return PRO_TEAM_LIST.find(t => t.slug === slug) || null
}
export function findProLeague(slug: string): League | null {
  return PRO_LEAGUE_LIST.find(l => l.slug === slug) || null
}
export function proTeamsByLeague(leagueSlug: string): Team[] {
  return PRO_TEAM_LIST.filter(t => t.league_slug === leagueSlug)
}
export function proLeaguesBySport(sportSlug: string): League[] {
  return PRO_LEAGUE_LIST.filter(l => l.sport_slug === sportSlug)
}
