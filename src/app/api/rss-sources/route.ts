import { NextRequest, NextResponse } from 'next/server'
import { getPublicClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const schoolSlug = searchParams.get('school_slug')

  if (!schoolSlug) {
    return NextResponse.json({ error: 'Missing school_slug' }, { status: 400 })
  }

  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('rss_sources')
    .select('*')
    .eq('school_slug', schoolSlug)
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}
