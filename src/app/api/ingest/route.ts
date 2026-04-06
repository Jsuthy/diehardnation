import { NextRequest, NextResponse } from 'next/server'
import { runIngestionForSchool } from '@/lib/ingestion'
import { getAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const schoolSlug = body.school_slug as string | undefined

    if (schoolSlug) {
      const result = await runIngestionForSchool(schoolSlug)
      return NextResponse.json(result)
    }

    // Run for all active schools
    const supabase = getAdminClient()
    const { data: schools } = await supabase
      .from('schools')
      .select('slug')
      .eq('is_active', true)

    const results = []
    for (const school of schools || []) {
      const result = await runIngestionForSchool(school.slug)
      results.push(result)
    }

    return NextResponse.json({ results })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ status: 'ok', message: 'Use POST to trigger ingestion' })
}
