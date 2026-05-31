import { NextResponse } from 'next/server'
import { getAdminClient, getPublicClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/sports/utils'

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// POST — create an article (admin only).
export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
    || new URL(request.url).searchParams.get('token')
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const title = String(body.title || '').trim()
  const content = String(body.content || '').trim()
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
  }

  const excerpt = body.excerpt
    ? String(body.excerpt).trim()
    : stripHtml(content).slice(0, 160)

  const baseSlug = slugify(title).slice(0, 80) || 'article'
  const is_published = body.is_published === true

  const row = {
    slug: baseSlug,
    title,
    content,
    excerpt,
    author: body.author ? String(body.author) : 'DieHardNation',
    sport_slug: body.sport_slug ? String(body.sport_slug) : null,
    league_slug: body.league_slug ? String(body.league_slug) : null,
    team_slugs: Array.isArray(body.team_slugs) ? body.team_slugs : [],
    school_slugs: Array.isArray(body.school_slugs) ? body.school_slugs : [],
    event_slug: body.event_slug ? String(body.event_slug) : null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    meta_title: body.meta_title ? String(body.meta_title) : `${title} | DieHardNation`,
    meta_description: body.meta_description ? String(body.meta_description) : excerpt.slice(0, 160),
    is_published,
    published_at: is_published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }

  try {
    const supabase = getAdminClient()
    // Ensure unique slug by appending a numeric suffix on conflict.
    let slug = baseSlug
    for (let i = 0; i < 6; i++) {
      const { error } = await supabase.from('articles').insert({ ...row, slug })
      if (!error) {
        return NextResponse.json({ success: true, slug, url: `/news/${slug}` })
      }
      if (error.code === '23505') {
        slug = `${baseSlug}-${i + 2}`
        continue
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Could not generate a unique slug' }, { status: 500 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// GET — list published articles.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')
  const limit = Math.min(Number(searchParams.get('limit')) || 10, 100)
  const offset = Number(searchParams.get('offset')) || 0

  try {
    const supabase = getPublicClient()
    let q = supabase.from('articles').select('*').eq('is_published', true)
    if (sport) q = q.eq('sport_slug', sport)
    const { data } = await q
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return NextResponse.json({ articles: data || [] })
  } catch {
    return NextResponse.json({ articles: [] })
  }
}
