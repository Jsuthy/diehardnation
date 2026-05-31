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

export const PRO_TEAMS: SeedTeam[] = [
  ...NFL.map(t => ({ ...t, league_slug: 'nfl', sport_slug: 'american-football' })),
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
