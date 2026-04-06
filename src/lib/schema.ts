import type { Product, NewsPost, School } from '@/lib/supabase/types'

const SITE_URL = 'https://diehardnation.com'

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DieHardNation',
    url: SITE_URL,
    description: 'Independent college fan gear aggregator covering all 130 FBS schools.',
  }
}

export function buildProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    ...(product.image_url && { image: product.image_url }),
    ...(product.brand && { brand: { '@type': 'Brand', name: product.brand } }),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: product.affiliate_url,
    },
  }
}

export function buildItemListSchema(products: Product[], title: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/${p.school_slug}/product/${p.slug}`,
    })),
  }
}

export function buildNewsArticleSchema(post: NewsPost, school: School) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    publisher: {
      '@type': 'Organization',
      name: 'DieHardNation',
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/${school.slug}/news/${post.slug}`,
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}
