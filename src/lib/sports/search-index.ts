// Client-safe universal search across sports, leagues, teams, events and schools.
// Powers the navbar search so "baseball", "chiefs", "world cup" or "nebraska"
// all route to the right page instead of only matching colleges.

import { searchSchools } from '@/lib/constants/schools'
import { STATIC_SPORTS, STATIC_EVENTS } from './static'
import { PRO_LEAGUE_LIST, PRO_TEAM_LIST } from './pro-data'

export type SearchType = 'Team' | 'League' | 'Sport' | 'Event' | 'School'

export interface SearchResult {
  type: SearchType
  label: string
  sub: string
  href: string
  color?: string
}

// Pre-built index for the global (non-school) entities.
const INDEX: SearchResult[] = [
  ...PRO_TEAM_LIST.map(t => ({ type: 'Team' as const, label: t.name, sub: t.city || 'Pro team', href: `/team/${t.slug}`, color: t.primary_color })),
  ...PRO_LEAGUE_LIST.map(l => ({ type: 'League' as const, label: l.name, sub: l.country || 'League', href: `/league/${l.slug}` })),
  ...STATIC_SPORTS.map(s => ({ type: 'Sport' as const, label: s.name, sub: 'Sport', href: `/sport/${s.slug}` })),
  ...STATIC_EVENTS.map(e => ({ type: 'Event' as const, label: e.name, sub: e.event_type, href: `/events/${e.slug}` })),
]

export function searchAll(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []

  // Score: prefix match on label beats substring; teams/leagues rank above sports.
  const typeRank: Record<SearchType, number> = { Team: 0, League: 1, Event: 2, School: 3, Sport: 4 }
  const scored = INDEX
    .map(r => {
      const label = r.label.toLowerCase()
      if (label.startsWith(q)) return { r, score: 0 }
      if (label.includes(q)) return { r, score: 1 }
      return null
    })
    .filter((x): x is { r: SearchResult; score: number } => x !== null)
    .sort((a, b) => a.score - b.score || typeRank[a.r.type] - typeRank[b.r.type])
    .map(x => x.r)

  const schools: SearchResult[] = searchSchools(query).slice(0, 4).map(s => ({
    type: 'School' as const,
    label: s.name,
    sub: `${s.mascot} · College`,
    href: `/${s.slug}`,
    color: s.primary_color,
  }))

  return [...scored, ...schools].slice(0, limit)
}
