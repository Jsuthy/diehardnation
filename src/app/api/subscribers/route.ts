import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = String(body.email || '').trim().toLowerCase()
  const first_name = body.first_name ? String(body.first_name).trim() : null
  const sport_slug = body.sport_slug ? String(body.sport_slug) : null
  const school_slug = body.school_slug ? String(body.school_slug) : null
  const source = body.source ? String(body.source) : 'website'

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const supabase = getAdminClient()
    // Ignore duplicate emails (unique constraint).
    const { error } = await supabase
      .from('subscribers')
      .upsert({ email, first_name, sport_slug, school_slug, source }, { onConflict: 'email', ignoreDuplicates: true })
    if (error) {
      return NextResponse.json({ error: 'Could not save' }, { status: 500 })
    }
  } catch {
    return NextResponse.json({ error: 'Could not save' }, { status: 500 })
  }

  // Resend integration (wire later):
  // await resend.contacts.create({ email, firstName: first_name, audienceId: process.env.RESEND_AUDIENCE_ID })
  // Google Sheets via n8n webhook (wire later):
  // await fetch(process.env.SHEETS_WEBHOOK_URL!, { method: 'POST', body: JSON.stringify({ email, first_name, source }) })

  return NextResponse.json({ success: true })
}
