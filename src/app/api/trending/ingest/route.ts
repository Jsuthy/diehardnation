import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server'
import { fetchAllTrends } from '@/lib/trending/sources'
import { matchEntity, isSportsRelated } from '@/lib/trending/match'

// Real-time trending capture (Phase 2).
//
// Pulls Google Trends sports terms, maps each to an existing page (school /
// team / league / event / sport) it should boost, and records unmatched-but-
// sports-related terms as "moment page" candidates for new page generation.
//
// Auth: Vercel cron sends `Authorization: Bearer ${INGEST_SECRET}` (set
// CRON_SECRET-style env), and manual runs pass `?token=` — mirrors /api/ingest.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function run() {
  const supabase = getAdminClient()
  const trends = await fetchAllTrends(['US', 'GB'])

  const sports = trends.filter(t => isSportsRelated(t.term))
  const today = new Date().toISOString().slice(0, 10)

  const rows = sports.map(t => {
    const match = matchEntity(t.term)
    return {
      term: t.term,
      normalized_term: t.term.toLowerCase().trim(),
      source: 'google_trends',
      geo: t.geo,
      traffic: t.traffic,
      traffic_value: t.trafficValue,
      matched_type: match?.type ?? null,
      matched_slug: match?.slug ?? null,
      matched_path: match?.path ?? null,
      context: t.context,
      is_candidate: !match, // sports-related but no existing page → moment candidate
      captured_at: new Date().toISOString(),
    }
  })

  let upserted = 0
  if (rows.length) {
    // De-dupe within this batch on (normalized_term, day) to satisfy the
    // unique index, keeping the highest-traffic instance.
    const byKey = new Map<string, (typeof rows)[number]>()
    for (const r of rows) {
      const key = `${r.normalized_term}|${today}`
      const cur = byKey.get(key)
      if (!cur || r.traffic_value > cur.traffic_value) byKey.set(key, r)
    }
    const deduped = [...byKey.values()]
    const { error } = await supabase
      .from('trending_signals')
      .upsert(deduped, { onConflict: 'normalized_term,captured_at::date', ignoreDuplicates: false })
    if (!error) upserted = deduped.length
  }

  const matched = rows.filter(r => r.matched_type)
  const candidates = rows.filter(r => r.is_candidate)

  return {
    fetched: trends.length,
    sportsRelated: sports.length,
    matched: matched.length,
    candidates: candidates.length,
    upserted,
    // Surface the top boosts + candidates so the cron log is actionable.
    topBoosts: matched.slice(0, 10).map(r => ({ term: r.term, type: r.matched_type, path: r.matched_path, traffic: r.traffic })),
    topCandidates: candidates.slice(0, 10).map(r => ({ term: r.term, traffic: r.traffic })),
  }
}

function authorized(request: NextRequest): boolean {
  const secret = process.env.INGEST_SECRET
  if (!secret) return false
  const auth = request.headers.get('authorization')
  if (auth === `Bearer ${secret}`) return true
  return new URL(request.url).searchParams.get('token') === secret
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return NextResponse.json(await run())
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
