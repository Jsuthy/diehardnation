// Static fallback data so the core navigable surface (sports + events) works
// BEFORE the DB migration + ingestion have run. Derived from the same seed
// lists used by the ingestion script, so the site is never full of 404s.

import type { Sport, SportEvent } from './types'
import { CORE_SPORTS, SEED_EVENTS } from './events-seed'

export const STATIC_SPORTS: Sport[] = CORE_SPORTS.map(s => ({
  id: s.slug,
  slug: s.slug,
  name: s.name,
  tsdb_name: s.tsdb_name,
  category: s.category,
  region: s.region,
  is_active: true,
  fan_size_rank: s.fan_size_rank,
}))

export const STATIC_EVENTS: SportEvent[] = SEED_EVENTS.map(e => ({
  id: e.slug,
  slug: e.slug,
  name: e.name,
  sport_slug: e.sport_slug,
  league_slug: e.league_slug ?? null,
  event_type: e.event_type,
  start_date: e.start_date,
  end_date: e.end_date ?? null,
  year: Number(e.start_date.slice(0, 4)),
  description: e.description ?? null,
  search_surge_rank: e.search_surge_rank,
  is_active: true,
  is_recurring: true,
}))

export function findStaticSport(slug: string): Sport | null {
  return STATIC_SPORTS.find(s => s.slug === slug) || null
}

export function findStaticEvent(slug: string): SportEvent | null {
  return STATIC_EVENTS.find(e => e.slug === slug) || null
}
