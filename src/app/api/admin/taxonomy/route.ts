import { NextResponse } from 'next/server'
import { getPublicClient } from '@/lib/supabase/server'

// Lightweight taxonomy feed for the admin publish dropdowns.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = getPublicClient()
    const [sportsRes, leaguesRes, eventsRes, recentRes] = await Promise.allSettled([
      supabase.from('sports').select('slug, name').eq('is_active', true).order('fan_size_rank', { ascending: true }),
      supabase.from('leagues').select('slug, name, sport_slug').eq('is_active', true).order('fan_size_rank', { ascending: true }).limit(500),
      supabase.from('events').select('slug, name').eq('is_active', true).order('search_surge_rank', { ascending: true }),
      supabase.from('articles').select('slug, title, sport_slug, is_published, published_at').order('updated_at', { ascending: false }).limit(10),
    ])

    const val = <T,>(r: PromiseSettledResult<{ data: T[] | null }>): T[] =>
      r.status === 'fulfilled' ? (r.value.data || []) : []

    return NextResponse.json({
      sports: val(sportsRes),
      leagues: val(leaguesRes),
      events: val(eventsRes),
      recent: val(recentRes),
    })
  } catch {
    return NextResponse.json({ sports: [], leagues: [], events: [], recent: [] })
  }
}
