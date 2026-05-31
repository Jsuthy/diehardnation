import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server'

// Token-protected read of recent subscribers, for the Google Sheets sync script
// to pull from (avoids putting the Supabase service key in Apps Script).
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')
  if (token !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const supabase = getAdminClient()
    const { data } = await supabase
      .from('subscribers')
      .select('id,email,first_name,source,sport_slug,school_slug,created_at')
      .order('created_at', { ascending: false })
      .limit(500)
    return NextResponse.json({ subscribers: data || [] })
  } catch {
    return NextResponse.json({ subscribers: [] })
  }
}
