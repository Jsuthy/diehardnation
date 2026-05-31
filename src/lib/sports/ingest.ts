// Core ingestion logic shared by the CLI script and the /api/sports/sync route.
// Respects TheSportsDB rate limits (calls sleep 2.4s each inside the client).

import { getAdminClient } from '@/lib/supabase/server'
import {
  getAllSports, getLeaguesBySport, getTeamsByLeague,
} from '@/lib/tsdb/client'
import { slugify, detectCategory, toHex } from './utils'
import { SEED_EVENTS, CORE_SPORTS } from './events-seed'

export interface IngestResult {
  sports: number
  leagues: number
  teams: number
  events: number
  duration_ms: number
}

const SPORTS_TO_FETCH = [
  'Soccer', 'Basketball', 'American Football', 'Baseball', 'Ice Hockey', 'Rugby',
  'Cricket', 'Tennis', 'Golf', 'Motorsport', 'Boxing', 'MMA', 'Cycling', 'Athletics',
  'Swimming', 'Volleyball', 'Handball', 'Field Hockey', 'Lacrosse', 'Badminton',
  'Table Tennis', 'Snooker', 'Darts', 'Esports', 'Sumo', 'Australian Football',
  'Netball', 'Water Polo', 'Rowing', 'Sailing', 'Skiing', 'Curling', 'Equestrian',
]

// Top leagues to fetch teams for, by name as TheSportsDB knows them.
const TOP_LEAGUES = [
  'English Premier League', 'Spanish La Liga', 'German Bundesliga', 'Italian Serie A',
  'French Ligue 1', 'American Major League Soccer', 'Mexican Primera League',
  'Scottish Premier League', 'Dutch Eredivisie', 'Portuguese Primeira Liga',
  'Brazilian Serie A', 'Turkish Super Lig', 'Japanese J League', 'Saudi Pro League',
  'NFL', 'CFL', 'NBA', 'WNBA', 'EuroLeague Basketball', 'Spanish Liga ACB',
  'Italian Lega Basket Serie A', 'MLB', 'Japanese Baseball League',
  'NHL', 'Swedish Hockey League', 'Russian KHL', 'German DEL',
  'English Premiership Rugby', 'French Top 14', 'Indian Premier League',
  'Australian Big Bash League', 'Australian A-League', 'English League Championship',
]

// Upsert helper that ignores conflicts on slug.
async function upsert(table: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return 0
  const supabase = getAdminClient()
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'slug', ignoreDuplicates: false })
  if (error) {
    // Log but continue — one bad batch shouldn't abort the whole run.
    console.error(`[ingest] upsert ${table} failed:`, error.message)
    return 0
  }
  return rows.length
}

export async function seedCoreSportsAndEvents(): Promise<{ sports: number; events: number }> {
  const sportsRows = CORE_SPORTS.map(s => ({
    slug: s.slug, name: s.name, tsdb_name: s.tsdb_name,
    category: s.category, region: s.region, fan_size_rank: s.fan_size_rank, is_active: true,
  }))
  const sports = await upsert('sports', sportsRows)

  const eventRows = SEED_EVENTS.map(e => ({
    slug: e.slug, name: e.name, sport_slug: e.sport_slug,
    league_slug: e.league_slug ?? null, event_type: e.event_type,
    start_date: e.start_date, end_date: e.end_date ?? null,
    year: e.start_date ? Number(e.start_date.slice(0, 4)) : null,
    description: e.description ?? null, search_surge_rank: e.search_surge_rank,
    is_active: true, is_recurring: true,
  }))
  const events = await upsert('events', eventRows)
  return { sports, events }
}

export async function ingestSports(): Promise<number> {
  const tsdbSports = await getAllSports()
  const rows = tsdbSports
    .filter(s => s.strSport)
    .map(s => ({
      slug: slugify(s.strSport),
      name: s.strSport,
      tsdb_name: s.strSport,
      category: detectCategory(s.strSport),
      region: 'global',
      is_active: true,
    }))
  return upsert('sports', rows)
}

export async function ingestLeagues(): Promise<number> {
  let total = 0
  for (const sport of SPORTS_TO_FETCH) {
    const leagues = await getLeaguesBySport(sport)
    const rows = leagues
      .filter(l => l.strLeague)
      .map(l => ({
        slug: slugify(l.strLeague),
        name: l.strLeague,
        short_name: l.strLeagueAlternate || null,
        sport_slug: slugify(l.strSport || sport),
        country: l.strCountry || null,
        region: 'global',
        tsdb_id: l.idLeague || null,
        is_active: true,
      }))
    total += await upsert('leagues', rows)
  }
  return total
}

export async function ingestTeams(): Promise<number> {
  let total = 0
  for (const leagueName of TOP_LEAGUES) {
    const teams = await getTeamsByLeague(leagueName)
    const rows = teams
      .filter(t => t.strTeam)
      .map(t => ({
        slug: slugify(`${t.strTeam}-${t.strCountry || ''}`),
        name: t.strTeam,
        short_name: t.strTeamShort || null,
        nickname: t.strTeamAlternate || null,
        city: t.strLocation || null,
        country: t.strCountry || 'US',
        league_slug: slugify(leagueName),
        primary_color: toHex(t.strColour1, '#000000'),
        secondary_color: toHex(t.strColour2, '#FFFFFF'),
        tsdb_id: t.idTeam || null,
        is_active: true,
      }))
    total += await upsert('teams', rows)
  }
  return total
}

// Full ingestion. seedFirst guarantees event/sport pages resolve even if the
// rate-limited TSDB calls fail partway through.
export async function runFullIngestion(): Promise<IngestResult> {
  const started = Date.now()
  const { sports: seedSports, events } = await seedCoreSportsAndEvents()
  const apiSports = await ingestSports().catch(e => { console.error(e); return 0 })
  const leagues = await ingestLeagues().catch(e => { console.error(e); return 0 })
  const teams = await ingestTeams().catch(e => { console.error(e); return 0 })
  return {
    sports: seedSports + apiSports,
    leagues,
    teams,
    events,
    duration_ms: Date.now() - started,
  }
}
