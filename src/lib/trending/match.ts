// ─────────────────────────────────────────────────────────────────────────
// TREND → ENTITY MATCHER
//
// Takes a free-text trending search term (e.g. "argentina world cup", "aaron
// judge", "lakers vs celtics") and maps it to an entity we already have a page
// for — a school, pro team, league, event, or sport — so a trend can boost the
// right existing page. Terms that are clearly sports-related but match nothing
// become "moment page" candidates for new page generation.
//
// All matching is deterministic substring/alias matching over an index built
// once from our static catalogs. No network, no LLM.
// ─────────────────────────────────────────────────────────────────────────

import { SCHOOLS } from '@/lib/constants/schools'
import { PRO_TEAM_LIST, PRO_LEAGUE_LIST } from '@/lib/sports/pro-data'
import { SEED_EVENTS, CORE_SPORTS } from '@/lib/sports/events-seed'

export type EntityType = 'school' | 'team' | 'league' | 'event' | 'sport'

export interface EntityMatch {
  type: EntityType
  slug: string
  name: string
  /** URL path of the page this trend should boost. */
  path: string
  /** The alias that matched (longest wins → most specific). */
  alias: string
}

interface AliasEntry {
  alias: string
  type: EntityType
  slug: string
  name: string
  path: string
}

// Generic words that must never become standalone aliases (too ambiguous —
// e.g. "draft" must not let "nhl draft" match the NFL Draft event). Multi-word
// aliases that merely contain these are unaffected.
const STOPWORDS = new Set([
  'the', 'state', 'city', 'tech', 'a&m', 'university', 'college', 'tigers',
  'bulldogs', 'wildcats', 'eagles', 'cardinals', 'south', 'north', 'east', 'west',
  'union', 'fc', 'sc', 'club', 'red', 'blue', 'green', 'gold',
  // generic event words
  'draft', 'season', 'playoff', 'playoffs', 'final', 'finals', 'championship',
  'championships', 'tournament', 'cup', 'series', 'open', 'classic', 'game',
  'games', 'bowl', 'weekend', 'ceremony', 'day', 'derby', 'masters',
])

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function addAlias(index: AliasEntry[], alias: string, e: Omit<AliasEntry, 'alias'>) {
  const a = norm(alias)
  if (a.length < 3 || STOPWORDS.has(a)) return
  index.push({ alias: a, ...e })
}

// Build the alias index once (module-level, reused across requests).
function buildIndex(): AliasEntry[] {
  const index: AliasEntry[] = []

  for (const s of SCHOOLS) {
    const base = { type: 'school' as const, slug: s.slug, name: s.name, path: `/${s.slug}` }
    addAlias(index, s.name, base)        // "Georgia Bulldogs"
    addAlias(index, s.short_name, base)  // "Georgia"
    // nickname/mascot only when distinctive enough on their own
    addAlias(index, `${s.short_name} ${s.mascot}`, base)
    addAlias(index, `${s.nickname} ${s.mascot}`, base)
  }

  for (const t of PRO_TEAM_LIST) {
    const base = { type: 'team' as const, slug: t.slug, name: t.name, path: `/team/${t.slug}` }
    addAlias(index, t.name, base)        // "Kansas City Chiefs"
  }

  for (const l of PRO_LEAGUE_LIST) {
    const base = { type: 'league' as const, slug: l.slug, name: l.name, path: `/league/${l.slug}` }
    addAlias(index, l.name, base)        // "NFL"
  }

  for (const ev of SEED_EVENTS) {
    const base = { type: 'event' as const, slug: ev.slug, name: ev.name, path: `/events/${ev.slug}` }
    addAlias(index, ev.name, base)                                  // "FIFA World Cup 2026"
    // Strip trailing year + roman-numeral and leading sanctioning body so bare
    // terms like "world cup" / "super bowl" still match the right event.
    const core = ev.name
      .replace(/\s+20\d\d(-\d\d)?$/, '')                            // drop year
      .replace(/\s+[ivxlcdm]+$/i, '')                               // drop roman numerals
      .replace(/^(fifa|uefa|icc|ncaa|ufc|nba|nfl|mlb|nhl|the)\s+/i, '') // drop org/article
      .trim()
    if (core && core !== ev.name) addAlias(index, core, base)       // "world cup", "super bowl"
  }

  for (const sp of CORE_SPORTS) {
    addAlias(index, sp.name, { type: 'sport', slug: sp.slug, name: sp.name, path: `/sport/${sp.slug}` })
  }

  // Longest alias first so the most specific match wins.
  index.sort((a, b) => b.alias.length - a.alias.length)
  return index
}

const INDEX = buildIndex()

/** Match a trending term to the most specific entity we have a page for. */
export function matchEntity(term: string): EntityMatch | null {
  const t = ` ${norm(term)} `
  for (const e of INDEX) {
    if (t.includes(` ${e.alias} `)) {
      return { type: e.type, slug: e.slug, name: e.name, path: e.path, alias: e.alias }
    }
  }
  return null
}

// Sports lexicon — used to decide whether an unmatched trending term is still
// sports-related enough to capture as a moment-page candidate.
const SPORTS_LEXICON = [
  'football', 'soccer', 'basketball', 'baseball', 'hockey', 'tennis', 'golf',
  'cricket', 'rugby', 'boxing', 'ufc', 'mma', 'nascar', 'formula 1', 'f1',
  'olympics', 'world cup', 'super bowl', 'playoff', 'playoffs', 'finals',
  'championship', 'tournament', 'march madness', 'draft', 'transfer', 'trade',
  'jersey', 'jerseys', 'kit', 'apparel', 'merch', 'gear', 'hoodie', 'cleats',
  'vs', 'game', 'match', 'score', 'standings', 'roster', 'lineup', 'highlights',
  'nfl', 'nba', 'mlb', 'nhl', 'mls', 'ncaa', 'fifa', 'uefa', 'premier league',
  'la liga', 'serie a', 'bundesliga', 'champions league', 'stanley cup',
  'wimbledon', 'masters', 'derby', 'grand prix', 'open',
]

/** True when a term looks sports-related even if it matched no known entity. */
export function isSportsRelated(term: string): boolean {
  if (matchEntity(term)) return true
  const t = ` ${norm(term)} `
  return SPORTS_LEXICON.some(kw => t.includes(` ${kw} `))
}
