import { NextRequest, NextResponse } from 'next/server'
import { getPublicClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const activeOnly = searchParams.get('active')

  const supabase = getPublicClient()
  let query = supabase
    .from('schools')
    .select('*')
    .order('fan_size_rank', { ascending: true })

  if (activeOnly === 'true') {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}
