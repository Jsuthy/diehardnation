import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { school_slug, terms } = body as {
      school_slug: string
      terms: Record<string, string[]>
    }

    if (!school_slug || !terms) {
      return NextResponse.json(
        { error: 'Missing school_slug or terms' },
        { status: 400 }
      )
    }

    const supabase = getAdminClient()
    const rows: { school_slug: string; term: string; sport: string }[] = []

    for (const [sport, termList] of Object.entries(terms)) {
      for (const term of termList) {
        rows.push({ school_slug, term, sport })
      }
    }

    const { error } = await supabase
      .from('school_search_terms')
      .upsert(rows, { onConflict: 'school_slug,term' })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: rows.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
