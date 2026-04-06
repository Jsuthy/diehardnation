import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()
    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
    }

    const supabase = getAdminClient()
    await supabase.rpc('increment_click_count', { product_id: productId })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
