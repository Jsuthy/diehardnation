import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const limit = Math.min(Number(searchParams.get('limit') || 5), 20)

  const supabase = getAdminClient()

  const { data: schools } = await supabase
    .from('schools')
    .select('*')
    .eq('is_active', false)
    .eq('is_live', false)
    .not('build_status', 'eq', 'building')
    .order('fan_size_rank', { ascending: true })
    .limit(limit)

  const { count: totalRemaining } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', false)
    .eq('is_live', false)

  return NextResponse.json({
    schools: schools || [],
    total_remaining: totalRemaining || 0,
  })
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { school_slug, status } = body

    if (!school_slug || !status) {
      return NextResponse.json({ error: 'Missing school_slug or status' }, { status: 400 })
    }

    const validStatuses = ['pending', 'building', 'complete', 'failed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase
      .from('schools')
      .update({ build_status: status })
      .eq('slug', school_slug)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
