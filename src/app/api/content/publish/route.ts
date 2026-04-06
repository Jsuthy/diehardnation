import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { school_slug, articles } = body

    if (!school_slug || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(
        { error: 'Missing school_slug or articles array' },
        { status: 400 }
      )
    }

    const supabase = getAdminClient()

    const rows = articles.map((a: {
      title: string
      slug: string
      content: string
      excerpt?: string
      published_at?: string
    }) => ({
      school_slug,
      slug: a.slug,
      title: a.title,
      content: a.content,
      excerpt: a.excerpt || '',
      published_at: a.published_at || new Date().toISOString(),
      is_published: true,
    }))

    const { error } = await supabase
      .from('news_posts')
      .upsert(rows, { onConflict: 'school_slug,slug' })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, published: rows.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
