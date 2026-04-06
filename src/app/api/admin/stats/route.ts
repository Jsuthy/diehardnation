import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getAdminClient()

  const [
    totalSchools,
    liveSchools,
    pendingSchools,
    totalProducts,
    ebayProducts,
    totalPages,
    totalArticles,
    buildQueue,
  ] = await Promise.all([
    supabase.from('schools').select('*', { count: 'exact', head: true }),
    supabase.from('schools').select('*', { count: 'exact', head: true }).eq('is_live', true),
    supabase.from('schools').select('*', { count: 'exact', head: true }).eq('is_active', false),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('source', 'ebay'),
    supabase.from('programmatic_pages').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('news_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase
      .from('schools')
      .select('slug, name, short_name, conference, fan_size_rank, build_status')
      .eq('is_active', false)
      .order('fan_size_rank', { ascending: true })
      .limit(10),
  ])

  return NextResponse.json({
    total_schools: totalSchools.count || 0,
    schools_live: liveSchools.count || 0,
    schools_pending: pendingSchools.count || 0,
    total_products: totalProducts.count || 0,
    total_pages: totalPages.count || 0,
    total_articles: totalArticles.count || 0,
    products_by_source: {
      ebay: ebayProducts.count || 0,
      amazon: 0,
    },
    build_queue: buildQueue.data || [],
  })
}
