import { getAdminClient, getPublicClient } from './server'
import type { School, Product, NewsPost, ProgrammaticPage } from './types'

// ─── Schools ───────────────────────────────────────────

export async function getSchool(slug: string): Promise<School | null> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', slug)
    .single()
  return data as School | null
}

export async function getActiveSchools(): Promise<School[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('schools')
    .select('*')
    .eq('is_active', true)
    .order('fan_size_rank', { ascending: true })
  return (data as School[]) || []
}

export async function getAllSchools(): Promise<School[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('schools')
    .select('*')
    .order('fan_size_rank', { ascending: true })
  return (data as School[]) || []
}

export async function getSchoolsByConferenceDB(conference: string): Promise<School[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('schools')
    .select('*')
    .eq('conference', conference)
    .order('fan_size_rank', { ascending: true })
  return (data as School[]) || []
}

// ─── Products ──────────────────────────────────────────

export async function getProducts(params: {
  schoolSlug: string
  sport?: string
  category?: string
  priceRange?: string
  limit?: number
  offset?: number
  sortBy?: 'popular' | 'price-asc' | 'price-desc' | 'newest'
  q?: string
}): Promise<{ products: Product[]; total: number }> {
  const supabase = getPublicClient()
  const limit = Math.min(params.limit || 24, 96)
  const offset = params.offset || 0

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('school_slug', params.schoolSlug)
    .eq('is_active', true)

  if (params.sport && params.sport !== 'all' && params.sport !== 'general') {
    query = query.eq('sport', params.sport)
  }
  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }
  if (params.priceRange && params.priceRange !== 'all') {
    query = query.eq('price_range', params.priceRange)
  }
  if (params.q) {
    query = query.ilike('title', `%${params.q}%`)
  }

  switch (params.sortBy) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('click_count', { ascending: false })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, count } = await query
  return {
    products: (data as Product[]) || [],
    total: count || 0,
  }
}

export async function getFeaturedProducts(schoolSlug: string, limit = 8): Promise<Product[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('school_slug', schoolSlug)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('click_count', { ascending: false })
    .limit(limit)
  return (data as Product[]) || []
}

export async function getProductBySlug(schoolSlug: string, slug: string): Promise<Product | null> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('school_slug', schoolSlug)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data as Product | null
}

export async function getTrendingProducts(limit = 8): Promise<Product[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('click_count', { ascending: false })
    .limit(limit)
  return (data as Product[]) || []
}

// ─── News ──────────────────────────────────────────────

export async function getNewsPosts(schoolSlug: string, limit = 10): Promise<NewsPost[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('news_posts')
    .select('*')
    .eq('school_slug', schoolSlug)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)
  return (data as NewsPost[]) || []
}

export async function getNewsPost(schoolSlug: string, slug: string): Promise<NewsPost | null> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('news_posts')
    .select('*')
    .eq('school_slug', schoolSlug)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data as NewsPost | null
}

export async function getLatestNewsAllSchools(limit = 6): Promise<NewsPost[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('news_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)
  return (data as NewsPost[]) || []
}

// ─── Programmatic Pages ────────────────────────────────

export async function getProgrammaticPage(schoolSlug: string, slug: string): Promise<ProgrammaticPage | null> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('programmatic_pages')
    .select('*')
    .eq('school_slug', schoolSlug)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data as ProgrammaticPage | null
}

export async function getProgrammaticPages(schoolSlug: string): Promise<ProgrammaticPage[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('programmatic_pages')
    .select('*')
    .eq('school_slug', schoolSlug)
    .eq('is_active', true)
    .order('product_count', { ascending: false })
  return (data as ProgrammaticPage[]) || []
}

// ─── Stats ─────────────────────────────────────────────

export async function getSchoolStats(schoolSlug: string): Promise<{
  productCount: number
  newsCount: number
  pageCount: number
}> {
  const supabase = getPublicClient()

  const [products, news, pages] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('school_slug', schoolSlug)
      .eq('is_active', true),
    supabase
      .from('news_posts')
      .select('*', { count: 'exact', head: true })
      .eq('school_slug', schoolSlug)
      .eq('is_published', true),
    supabase
      .from('programmatic_pages')
      .select('*', { count: 'exact', head: true })
      .eq('school_slug', schoolSlug)
      .eq('is_active', true),
  ])

  return {
    productCount: products.count || 0,
    newsCount: news.count || 0,
    pageCount: pages.count || 0,
  }
}
