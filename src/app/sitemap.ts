import type { MetadataRoute } from 'next'
import { getPublicClient } from '@/lib/supabase/server'

const SITE_URL = 'https://diehardnation.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getPublicClient()

  const [schoolsResult, pagesResult, newsResult, productsResult] = await Promise.allSettled([
    supabase.from('schools').select('slug').eq('is_active', true),
    supabase.from('programmatic_pages').select('school_slug, slug, page_type, updated_at').eq('is_active', true).gte('product_count', 3),
    supabase.from('news_posts').select('school_slug, slug, published_at').eq('is_published', true),
    supabase.from('products').select('school_slug, slug, updated_at').eq('is_active', true).limit(50000),
  ])

  const schools = schoolsResult.status === 'fulfilled' ? schoolsResult.value.data || [] : []
  const pages = pagesResult.status === 'fulfilled' ? pagesResult.value.data || [] : []
  const news = newsResult.status === 'fulfilled' ? newsResult.value.data || [] : []
  const products = productsResult.status === 'fulfilled' ? productsResult.value.data || [] : []

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

  // Programmatic pages
  for (const page of pages) {
    let priority = 0.75
    if (page.page_type === 'sport') priority = 0.85
    else if (page.page_type === 'sport-price') priority = 0.65
    else if (page.page_type === 'gift-guide') priority = 0.7

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

  // News posts
  for (const post of news) {
    entries.push({
      url: `${SITE_URL}/${post.school_slug}/news/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  return entries
}
