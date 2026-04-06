import { NextRequest, NextResponse } from 'next/server'
import { getPublicClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const schoolSlug = searchParams.get('school_slug')
  const title = searchParams.get('title')

  if (!schoolSlug || !title) {
    return NextResponse.json({ error: 'Missing school_slug or title' }, { status: 400 })
  }

  const supabase = getPublicClient()

  // Extract significant words (3+ chars) from the query title
  const words = title
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length >= 3)
    .slice(0, 6)

  if (words.length === 0) {
    return NextResponse.json({ exists: false })
  }

  // Fetch recent posts and check for overlap
  const { data: posts } = await supabase
    .from('news_posts')
    .select('title')
    .eq('school_slug', schoolSlug)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(50)

  if (!posts || posts.length === 0) {
    return NextResponse.json({ exists: false })
  }

  // Check if any existing post shares 3+ significant words with the query
  const exists = posts.some(post => {
    const postWords = post.title.toLowerCase().split(/\s+/).filter((w: string) => w.length >= 3)
    const matches = words.filter(w => postWords.includes(w))
    return matches.length >= 3
  })

  return NextResponse.json({ exists })
}
