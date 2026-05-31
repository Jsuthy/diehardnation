// Types for the global sports expansion (sports/leagues/teams/events/articles).
// College (schools/products) types live in src/lib/supabase/types.ts and are untouched.

export interface Sport {
  id: string
  slug: string
  name: string
  tsdb_name: string | null
  category: string
  region: string
  is_active: boolean
  fan_size_rank: number
  created_at?: string
}

export interface League {
  id: string
  slug: string
  name: string
  short_name: string | null
  sport_slug: string | null
  country: string | null
  region: string
  tsdb_id: string | null
  is_active: boolean
  fan_size_rank: number
  created_at?: string
}

export interface Team {
  id: string
  slug: string
  name: string
  short_name: string | null
  nickname: string | null
  city: string | null
  country: string
  league_slug: string | null
  sport_slug: string | null
  primary_color: string
  secondary_color: string
  tsdb_id: string | null
  is_active: boolean
  fan_size_rank: number
  created_at?: string
}

export interface SportEvent {
  id: string
  slug: string
  name: string
  sport_slug: string | null
  league_slug: string | null
  event_type: string
  start_date: string | null
  end_date: string | null
  year: number | null
  description: string | null
  search_surge_rank: number
  is_active: boolean
  is_recurring: boolean
  created_at?: string
}

export interface Article {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  author: string
  sport_slug: string | null
  league_slug: string | null
  team_slugs: string[]
  school_slugs: string[]
  event_slug: string | null
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
  published_at: string | null
  created_at?: string
  updated_at?: string
}

export interface AffiliateConfigRow {
  id: string
  provider: string
  is_active: boolean
  priority: number
  tag: string | null
  base_url: string
  commission_rate: number | null
  notes: string | null
  updated_at?: string
}
