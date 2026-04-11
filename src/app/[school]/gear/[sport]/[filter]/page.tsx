import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSchool, getProducts } from '@/lib/supabase/queries'
import { SPORTS } from '@/lib/constants/sports'
import { CATEGORIES } from '@/lib/constants/categories'
import { PRICE_RANGES } from '@/lib/constants/price-ranges'
import SchoolShopClient from '@/components/school/SchoolShopClient'
import { getSportCategoryMetadata, getSportPriceMetadata } from '@/lib/seo/metadata-templates'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  // We rely on ISR for filter pages — too many combos for static gen
  return []
}

function parseFilter(filter: string) {
  const category = CATEGORIES.find(c => c.slug === filter)
  if (category) return { type: 'category' as const, slug: category.slug, name: category.name }
  const priceRange = PRICE_RANGES.find(p => p.slug === filter)
  if (priceRange) return { type: 'price' as const, slug: priceRange.slug, name: priceRange.label }
  return null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string; sport: string; filter: string }>
}): Promise<Metadata> {
  const { school: slug, sport: sportSlug, filter: filterSlug } = await params
  const school = await getSchool(slug)
  const sport = SPORTS.find(s => s.slug === sportSlug)
  const filter = parseFilter(filterSlug)
  if (!school || !sport || !filter) return {}

  const meta = filter.type === 'price'
    ? getSportPriceMetadata(school, sportSlug, filterSlug)
    : getSportCategoryMetadata(school, sportSlug, filterSlug)

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://diehardnation.com/${slug}/gear/${sportSlug}/${filterSlug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://diehardnation.com/${slug}/gear/${sportSlug}/${filterSlug}`,
      siteName: 'DieHardNation',
      images: [{
        url: 'https://diehardnation.com/og-default.png',
        width: 1200,
        height: 630,
        alt: `${school.name} ${sport.name} ${filter.name}`,
      }],
    },
  }
}

export default async function FilterPage({
  params,
}: {
  params: Promise<{ school: string; sport: string; filter: string }>
}) {
  const { school: slug, sport: sportSlug, filter: filterSlug } = await params
  const school = await getSchool(slug)
  const sport = SPORTS.find(s => s.slug === sportSlug)
  const filter = parseFilter(filterSlug)

  if (!school || !school.is_active || !sport || !filter) notFound()

  const queryParams: Parameters<typeof getProducts>[0] = {
    schoolSlug: slug,
    sport: sportSlug,
    limit: 24,
  }
  if (filter.type === 'category') queryParams.category = filter.slug
  if (filter.type === 'price') queryParams.priceRange = filter.slug

  const { products, total } = await getProducts(queryParams)

  const meta = filter.type === 'price'
    ? getSportPriceMetadata(school, sportSlug, filterSlug)
    : getSportCategoryMetadata(school, sportSlug, filterSlug)

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: school.short_name, url: `/${slug}` },
    { name: `${sport.name} Gear`, url: `/${slug}/gear/${sportSlug}` },
    { name: filter.name, url: `/${slug}/gear/${sportSlug}/${filterSlug}` },
  ]

  return (
    <main>
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1,
                item: { '@id': 'https://diehardnation.com', name: 'DieHardNation' }},
              { '@type': 'ListItem', position: 2,
                item: { '@id': `https://diehardnation.com/${slug}`, name: school.name }},
              { '@type': 'ListItem', position: 3,
                item: { '@id': `https://diehardnation.com/${slug}/gear/${sportSlug}`, name: `${sport.name} Gear` }},
              { '@type': 'ListItem', position: 4,
                item: { '@id': `https://diehardnation.com/${slug}/gear/${sportSlug}/${filterSlug}`, name: filter.name }},
            ]
          })
        }}
      />

      {/* JSON-LD: ItemList */}
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${school.name} ${sport.name} ${filter.name}`,
              itemListElement: products.slice(0, 10).map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'Product',
                  name: p.title,
                  offers: {
                    '@type': 'Offer',
                    price: p.price,
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    url: p.affiliate_url,
                  }
                }
              }))
            })
          }}
        />
      )}

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="container" style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)' }}>
        <ol style={{ display: 'flex', gap: 0, listStyle: 'none', margin: 0, padding: 0 }}>
          <li><Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>DieHardNation</Link></li>
          <li style={{ margin: '0 6px' }}>/</li>
          <li><Link href={`/${slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{school.name}</Link></li>
          <li style={{ margin: '0 6px' }}>/</li>
          <li><Link href={`/${slug}/gear/${sportSlug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{sport.name} Gear</Link></li>
          <li style={{ margin: '0 6px' }}>/</li>
          <li style={{ color: 'var(--text-secondary)' }}>{filter.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section style={{ background: school.primary_color, padding: '28px 0' }}>
        <div className="container">
          <h1 style={{
            color: 'white',
            fontWeight: 900,
            fontSize: 'clamp(24px, 4vw, 44px)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}>
            {meta.h1}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 6 }}>
            {total} products found
          </p>
        </div>
      </section>

      {/* Intro paragraph — SEO text content */}
      <section className="container" style={{ padding: '24px 20px 0' }}>
        <p style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: 760,
        }}>
          {meta.intro}
        </p>
      </section>

      <section aria-label={`${school.name} ${sport.name} ${filter.name} products`} className="container" style={{ padding: '24px 20px 0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>
          {meta.h2s[0]}
        </h2>
      </section>
      <SchoolShopClient
        initialProducts={products}
        totalCount={total}
        schoolSlug={slug}
        schoolColor={school.primary_color}
        school={school}
      />

      {/* Related links */}
      <section className="container" style={{ padding: '32px 20px 48px' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>
          {meta.h2s[2]}
        </h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link
            href={`/${slug}/gear/${sportSlug}`}
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
            }}
          >
            All {sport.name} Gear
          </Link>
          <Link
            href={`/${slug}`}
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
            }}
          >
            All {school.short_name} Gear
          </Link>
        </div>
      </section>
    </main>
  )
}
