import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server'

function authed(request: Request): boolean {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
    || new URL(request.url).searchParams.get('token')
  return token === process.env.ADMIN_TOKEN
}

// PATCH — update an article.
export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const allowed = [
    'title', 'content', 'excerpt', 'author', 'sport_slug', 'league_slug',
    'team_slugs', 'school_slugs', 'event_slug', 'tags', 'meta_title',
    'meta_description', 'is_published',
  ]
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const k of allowed) {
    if (k in body) update[k] = body[k]
  }
  if (body.is_published === true && !('published_at' in update)) {
    update.published_at = new Date().toISOString()
  }

  try {
    const supabase = getAdminClient()
    const { error } = await supabase.from('articles').update(update).eq('slug', slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, slug })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// DELETE — unpublish (soft).
export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  try {
    const supabase = getAdminClient()
    const { error } = await supabase
      .from('articles')
      .update({ is_published: false, updated_at: new Date().toISOString() })
      .eq('slug', slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, slug })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
