import { getPublicClient } from '@/lib/supabase/server'
import type { Sport, League, Team, SportEvent, Article } from './types'

// All queries are wrapped in try/catch and return empty/null on failure so pages
// render gracefully before the migration + ingestion have run.

export async function getSport(slug: string): Promise<Sport | null> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase.from('sports').select('*').eq('slug', slug).maybeSingle()
    return (data as Sport) || null
  } catch { return null }
}

export async function getTopSports(limit = 20): Promise<Sport[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('sports').select('*').eq('is_active', true)
      .order('fan_size_rank', { ascending: true }).limit(limit)
    return (data as Sport[]) || []
  } catch { return [] }
}

export async function getLeague(slug: string): Promise<League | null> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase.from('leagues').select('*').eq('slug', slug).maybeSingle()
    return (data as League) || null
  } catch { return null }
}

export async function getLeaguesBySport(sportSlug: string, limit = 30): Promise<League[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('leagues').select('*').eq('sport_slug', sportSlug).eq('is_active', true)
      .order('fan_size_rank', { ascending: true }).limit(limit)
    return (data as League[]) || []
  } catch { return [] }
}

export async function getTeam(slug: string): Promise<Team | null> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase.from('teams').select('*').eq('slug', slug).maybeSingle()
    return (data as Team) || null
  } catch { return null }
}

export async function getTeamsByLeague(leagueSlug: string, limit = 30): Promise<Team[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('teams').select('*').eq('league_slug', leagueSlug).eq('is_active', true)
      .order('fan_size_rank', { ascending: true }).limit(limit)
    return (data as Team[]) || []
  } catch { return [] }
}

export async function getTopTeams(limit = 100): Promise<Team[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('teams').select('slug').eq('is_active', true)
      .order('fan_size_rank', { ascending: true }).limit(limit)
    return (data as Team[]) || []
  } catch { return [] }
}

export async function getEvent(slug: string): Promise<SportEvent | null> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase.from('events').select('*').eq('slug', slug).maybeSingle()
    return (data as SportEvent) || null
  } catch { return null }
}

export async function getAllEvents(): Promise<SportEvent[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('events').select('*').eq('is_active', true)
      .order('search_surge_rank', { ascending: true })
    return (data as SportEvent[]) || []
  } catch { return [] }
}

export async function getUpcomingEvents(sportSlug?: string, limit = 12): Promise<SportEvent[]> {
  try {
    const supabase = getPublicClient()
    let q = supabase.from('events').select('*').eq('is_active', true)
    if (sportSlug) q = q.eq('sport_slug', sportSlug)
    const { data } = await q.order('search_surge_rank', { ascending: true }).limit(limit)
    return (data as SportEvent[]) || []
  } catch { return [] }
}

export async function getLatestArticles(limit = 20, sportSlug?: string): Promise<Article[]> {
  try {
    const supabase = getPublicClient()
    let q = supabase.from('articles').select('*').eq('is_published', true)
    if (sportSlug) q = q.eq('sport_slug', sportSlug)
    const { data } = await q.order('published_at', { ascending: false }).limit(limit)
    return (data as Article[]) || []
  } catch { return [] }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('articles').select('*').eq('slug', slug).eq('is_published', true).maybeSingle()
    return (data as Article) || null
  } catch { return null }
}

export async function getArticlesByTeam(teamSlug: string, limit = 3): Promise<Article[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('articles').select('*').eq('is_published', true)
      .contains('team_slugs', [teamSlug])
      .order('published_at', { ascending: false }).limit(limit)
    return (data as Article[]) || []
  } catch { return [] }
}

export async function getArticlesByEvent(eventSlug: string, limit = 6): Promise<Article[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('articles').select('*').eq('is_published', true).eq('event_slug', eventSlug)
      .order('published_at', { ascending: false }).limit(limit)
    return (data as Article[]) || []
  } catch { return [] }
}

export async function getPublishedArticleSlugs(limit = 50): Promise<{ slug: string }[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('articles').select('slug').eq('is_published', true)
      .order('published_at', { ascending: false }).limit(limit)
    return (data as { slug: string }[]) || []
  } catch { return [] }
}
