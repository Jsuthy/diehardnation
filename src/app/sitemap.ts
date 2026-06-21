import type { MetadataRoute } from 'next'
import { getPublicClient } from '@/lib/supabase/server'
import { STATIC_SPORTS, STATIC_EVENTS } from '@/lib/sports/static'
import { PRO_LEAGUE_LIST, PRO_TEAM_LIST } from '@/lib/sports/pro-data'
import { MIN_INDEX_PRODUCTS, scorePage, sitemapPriority } from '@/lib/seo/quality-gate'
import { PLAYERS } from '@/lib/sports/players'

const SITE_URL = 'https://diehardnation.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getPublicClient()

  const nowIso = new Date().toISOString()
  const [schoolsResult, pagesResult, newsResult, productsResult, leaguesResult, teamsResult, eventsResult, articlesResult, momentsResult] = await Promise.allSettled([
    supabase.from('schools').select('slug').eq('is_active', true).eq('is_live', true).gte('product_count', MIN_INDEX_PRODUCTS),
    supabase.from('programmatic_pages').select('school_slug, slug, page_type, updated_at, product_count').eq('is_active', true).gte('product_count', MIN_INDEX_PRODUCTS).neq('slug', '').not('slug', 'is', null),
    supabase.from('news_posts').select('school_slug, slug, published_at').eq('is_published', true).neq('slug', '=').neq('slug', '').not('slug', 'is', null),
    supabase.from('products').select('school_slug, slug, updated_at').eq('is_active', true).or('is_featured.eq.true,click_count.gt.0').neq('slug', '').not('slug', 'is', null).limit(50000),
    supabase.from('leagues').select('slug').eq('is_active', true),
    supabase.from('teams').select('slug').eq('is_active', true).limit(100000),
    supabase.from('events').select('slug, updated_at').eq('is_active', true),
    supabase.from('articles').select('slug, updated_at').eq('is_published', true).limit(50000),
    supabase.from('moment_pages').select('slug, updated_at, product_count').eq('is_active', true).eq('indexable', true).or(`expires_at.is.null,expires_at.gt.${nowIso}`).limit(50000),
  ])

  const schools = schoolsResult.status === 'fulfilled' ? schoolsResult.value.data || [] : []
  const pages = pagesResult.status === 'fulfilled' ? pagesResult.value.data || [] : []
  const news = newsResult.status === 'fulfilled' ? newsResult.value.data || [] : []
  const products = productsResult.status === 'fulfilled' ? productsResult.value.data || [] : []
  const leagues = leaguesResult.status === 'fulfilled' ? leaguesResult.value.data || [] : []
  const teams = teamsResult.status === 'fulfilled' ? teamsResult.value.data || [] : []
  const events = eventsResult.status === 'fulfilled' ? (eventsResult.value.data || []) as { slug: string; updated_at?: string }[] : []
  const articles = articlesResult.status === 'fulfilled' ? articlesResult.value.data || [] : []
  const moments = momentsResult.status === 'fulfilled' ? (momentsResult.value.data || []) as { slug: string; updated_at?: string; product_count?: number }[] : []

  const entries: MetadataRoute.Sitemap = []

  // Static pages
  entries.push(
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/legal`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  )

  // School hubs
  for (const school of schools) {
    entries.push(
      { url: `${SITE_URL}/${school.slug}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${SITE_URL}/${school.slug}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
      { url: `${SITE_URL}/${school.slug}/gift-guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    )
  }

  // Programmatic pages — priority driven by the same quality score that gates
  // indexing, so Google spends crawl budget on the deepest catalogs first.
  for (const page of pages) {
    const score = scorePage({ productCount: (page as { product_count?: number }).product_count ?? MIN_INDEX_PRODUCTS, uniqueWordCount: 250 })
    const ceiling = page.page_type === 'sport' ? 0.9 : page.page_type === 'sport-price' ? 0.7 : 0.8
    const priority = sitemapPriority(score, ceiling)

    const frequency: 'daily' | 'weekly' = page.page_type === 'sport-price' || page.page_type === 'gift-guide' ? 'weekly' : 'daily'

    // Map page slug to URL path
    let urlPath: string
    if (page.page_type === 'gift-guide') {
      urlPath = `${SITE_URL}/${page.school_slug}/gift-guides/${page.slug}`
    } else if (page.page_type === 'sport') {
      urlPath = `${SITE_URL}/${page.school_slug}/gear/${page.slug}`
    } else {
      // sport-category or sport-price: slug is like "football-tees" or "football-under-25"
      const parts = page.slug.split('-')
      const sportSlug = parts[0]
      const filterSlug = parts.slice(1).join('-')
      urlPath = `${SITE_URL}/${page.school_slug}/gear/${sportSlug}/${filterSlug}`
    }

    entries.push({
      url: urlPath,
      lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
      changeFrequency: frequency,
      priority,
    })
  }

  // Products
  for (const product of products) {
    entries.push({
      url: `${SITE_URL}/${product.school_slug}/product/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    })
  }

  // News posts (school system)
  for (const post of news) {
    entries.push({
      url: `${SITE_URL}/${post.school_slug}/news/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  // Global sports expansion. Pages render from curated static data merged with
  // the DB, so the sitemap merges both (deduped) to match what actually resolves.
  entries.push({ url: `${SITE_URL}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 })
  entries.push({ url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 })

  // Sports — curated set only (skips thin legacy college-sport rows).
  for (const s of STATIC_SPORTS) {
    entries.push({ url: `${SITE_URL}/sport/${s.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 })
  }
  // Leagues — DB ∪ curated.
  const leagueSlugs = new Set<string>([...leagues.map(l => l.slug), ...PRO_LEAGUE_LIST.map(l => l.slug)])
  for (const slug of leagueSlugs) {
    entries.push({ url: `${SITE_URL}/league/${slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 })
  }
  // Teams — DB ∪ curated (the highest-value commercial pages).
  const teamSlugs = new Set<string>([...teams.map(t => t.slug), ...PRO_TEAM_LIST.map(t => t.slug)])
  for (const slug of teamSlugs) {
    entries.push({ url: `${SITE_URL}/team/${slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 })
  }
  // Events — DB ∪ curated. Highest priority: index months before the surge.
  const eventUpdated = new Map(events.map(e => [e.slug, e.updated_at]))
  const eventSlugs = new Set<string>([...events.map(e => e.slug), ...STATIC_EVENTS.map(e => e.slug)])
  for (const slug of eventSlugs) {
    const u = eventUpdated.get(slug)
    entries.push({ url: `${SITE_URL}/events/${slug}`, lastModified: u ? new Date(u) : new Date(), changeFrequency: 'daily', priority: 0.95 })
  }
  for (const a of articles) {
    entries.push({ url: `${SITE_URL}/news/${a.slug}`, lastModified: a.updated_at ? new Date(a.updated_at) : new Date(), changeFrequency: 'weekly', priority: 0.85 })
  }

  // Player gear pages (curated) + the players index.
  entries.push({ url: `${SITE_URL}/players`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 })
  for (const p of PLAYERS) {
    entries.push({ url: `${SITE_URL}/player/${p.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 })
  }

  // Moment pages — trend-driven, time-sensitive; crawl often while fresh.
  for (const mom of moments) {
    const score = scorePage({ productCount: mom.product_count ?? MIN_INDEX_PRODUCTS, uniqueWordCount: 200, isTimeSensitive: true })
    entries.push({
      url: `${SITE_URL}/trending/${mom.slug}`,
      lastModified: mom.updated_at ? new Date(mom.updated_at) : new Date(),
      changeFrequency: 'daily',
      priority: sitemapPriority(score, 0.85),
    })
  }

  return entries
}
