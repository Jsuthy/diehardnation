import { NextRequest, NextResponse } from 'next/server'
import { getPublicClient, getAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const schoolSlug = searchParams.get('school_slug')

  if (!schoolSlug) {
    return NextResponse.json({ error: 'Missing school_slug' }, { status: 400 })
  }

  const limit = Math.min(Number(searchParams.get('limit') || 10), 50)
  const offset = Number(searchParams.get('offset') || 0)

  const supabase = getPublicClient()
  const { data, count } = await supabase
    .from('news_posts')
    .select('*', { count: 'exact' })
    .eq('school_slug', schoolSlug)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return NextResponse.json({ posts: data || [], total: count || 0 })
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { school_slug, slug, title, content, excerpt, published_at } = body

    if (!school_slug || !slug || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: school_slug, slug, title, content' },
        { status: 400 }
      )
    }

    const supabase = getAdminClient()
    const { error } = await supabase
      .from('news_posts')
      .upsert(
        {
          school_slug,
          slug,
          title,
          content,
          excerpt: excerpt || '',
          published_at: published_at || new Date().toISOString(),
          is_published: true,
        },
        { onConflict: 'school_slug,slug' }
      )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, slug })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
