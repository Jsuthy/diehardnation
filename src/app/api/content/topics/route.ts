import { NextRequest, NextResponse } from 'next/server'
import { getPublicClient } from '@/lib/supabase/server'
import { getTopicForWeek } from '@/lib/content/calendar'
import type { School } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const schoolSlug = searchParams.get('school_slug')
  const weekParam = searchParams.get('week')

  if (!schoolSlug) {
    return NextResponse.json({ error: 'Missing school_slug' }, { status: 400 })
  }

  const supabase = getPublicClient()
  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', schoolSlug)
    .single()

  if (!school) {
    return NextResponse.json({ error: 'School not found' }, { status: 404 })
  }

  const weekNumber = weekParam ? Number(weekParam) : undefined
  const result = getTopicForWeek(school as School, weekNumber)

  return NextResponse.json(result)
}
