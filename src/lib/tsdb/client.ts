// TheSportsDB ingestion client.
// Free tier key "123" with conservative rate limiting (25 req/min).

const API_KEY = process.env.THESPORTSDB_API_KEY || '123'
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`

export interface TSDBSport {
  idSport?: string
  strSport: string
  strSportThumb?: string
  strSportDescription?: string
}

export interface TSDBLeague {
  idLeague: string
  strLeague: string
  strSport?: string
  strCountry?: string
  strLeagueAlternate?: string
}

export interface TSDBTeam {
  idTeam: string
  strTeam: string
  strTeamShort?: string
  strTeamAlternate?: string
  strCountry?: string
  strLocation?: string
  strColour1?: string
  strColour2?: string
  strDescriptionEN?: string
  strBadge?: string
}

export interface TSDBStanding {
  idStanding?: string
  intRank?: string
  strTeam?: string
  idTeam?: string
  intPoints?: string
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 25 requests/minute = 1 per 2.4 seconds. Retries once after a minute on 429.
async function rateLimitedFetch(url: string): Promise<Record<string, unknown>> {
  await delay(2400)
  const res = await fetch(url)
  if (res.status === 429) {
    await delay(60000)
    return rateLimitedFetch(url)
  }
  try {
    return (await res.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

export async function getAllSports(): Promise<TSDBSport[]> {
  const json = await rateLimitedFetch(`${BASE}/all_sports.php`)
  return (json.sports as TSDBSport[]) || []
}

export async function getAllLeagues(): Promise<TSDBLeague[]> {
  const json = await rateLimitedFetch(`${BASE}/all_leagues.php`)
  return (json.leagues as TSDBLeague[]) || []
}

export async function getLeaguesByCountry(country: string): Promise<TSDBLeague[]> {
  const json = await rateLimitedFetch(`${BASE}/search_all_leagues.php?c=${encodeURIComponent(country)}`)
  return (json.countries as TSDBLeague[]) || []
}

export async function getLeaguesBySport(sport: string): Promise<TSDBLeague[]> {
  const json = await rateLimitedFetch(`${BASE}/search_all_leagues.php?s=${encodeURIComponent(sport)}`)
  return (json.countries as TSDBLeague[]) || (json.leagues as TSDBLeague[]) || []
}

export async function getTeamsByLeague(leagueName: string): Promise<TSDBTeam[]> {
  const json = await rateLimitedFetch(`${BASE}/search_all_teams.php?l=${encodeURIComponent(leagueName)}`)
  return (json.teams as TSDBTeam[]) || []
}

export async function searchTeams(name: string): Promise<TSDBTeam[]> {
  const json = await rateLimitedFetch(`${BASE}/searchteams.php?t=${encodeURIComponent(name)}`)
  return (json.teams as TSDBTeam[]) || []
}

export async function getLeagueTable(leagueId: string): Promise<TSDBStanding[]> {
  const json = await rateLimitedFetch(`${BASE}/lookuptable.php?l=${encodeURIComponent(leagueId)}`)
  return (json.table as TSDBStanding[]) || []
}
