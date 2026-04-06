import { NextRequest, NextResponse } from 'next/server'
import { generateProgrammaticPagesForSchool } from '@/lib/programmatic/generate-pages'
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
      const result = await generateProgrammaticPagesForSchool(schoolSlug)
      return NextResponse.json({ school_slug: schoolSlug, ...result })
    }

    // All active schools
    const supabase = getAdminClient()
    const { data: schools } = await supabase
      .from('schools')
      .select('slug')
      .eq('is_active', true)

    const results = []
    for (const school of schools || []) {
      const result = await generateProgrammaticPagesForSchool(school.slug)
      results.push({ school_slug: school.slug, ...result })
    }

    return NextResponse.json({ results })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
