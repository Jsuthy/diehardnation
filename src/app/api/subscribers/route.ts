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

  // Mirror to Google Sheets (fire-and-forget; never block the response).
  if (process.env.SHEETS_WEBHOOK_URL) {
    fetch(process.env.SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, first_name, source, sport_slug, school_slug }),
    }).catch(() => {})
  }

  // Add to Resend audience (activates automatically once the env vars are set).
  if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.contacts.create({
        email,
        firstName: first_name || undefined,
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      })
    } catch {
      // Don't fail the signup if Resend is down.
    }
  }

  return NextResponse.json({ success: true })
}
