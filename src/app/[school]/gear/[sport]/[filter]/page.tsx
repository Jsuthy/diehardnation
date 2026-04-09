import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSchool, getProducts, getProgrammaticPage } from '@/lib/supabase/queries'
import { SPORTS } from '@/lib/constants/sports'
import { CATEGORIES } from '@/lib/constants/categories'
import { PRICE_RANGES } from '@/lib/constants/price-ranges'
import SchoolShopClient from '@/components/school/SchoolShopClient'
import SchemaScript from '@/components/SchemaScript'
import { buildBreadcrumbSchema, buildItemListSchema } from '@/lib/schema'

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

  const pageSlug = `${sportSlug === 'general' ? '' : sportSlug + '-'}${filterSlug}`
  const page = await getProgrammaticPage(slug, pageSlug)

  const title = page?.title || `${school.name} ${sport.name} ${filter.name} | DieHardNation`
  const description = page?.description || `${school.name} ${sport.name.toLowerCase()} ${filter.name.toLowerCase()}. Shop ${school.mascot} fan apparel from eBay and Amazon.`

  return {
    title,
    description,
    alternates: { canonical: `https://diehardnation.com/${slug}/gear/${sportSlug}/${filterSlug}` },
    openGraph: {
      title: `${school.name} ${sport.name} ${filter.name} | DieHardNation`,
      description,
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

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: school.short_name, url: `/${slug}` },
    { name: `${sport.name} Gear`, url: `/${slug}/gear/${sportSlug}` },
    { name: filter.name, url: `/${slug}/gear/${sportSlug}/${filterSlug}` },
  ]

  return (
    <main>
      <SchemaScript schema={[
        buildBreadcrumbSchema(breadcrumbs),
        ...(products.length > 0 ? [buildItemListSchema(products, `${school.short_name} ${sport.name} ${filter.name}`)] : []),
      ]} />

      {/* Breadcrumb */}
      <nav className="container" style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link href={`/${slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{school.short_name}</Link>
        {' / '}
        <Link href={`/${slug}/gear/${sportSlug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{sport.name} Gear</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>{filter.name}</span>
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
            {school.short_name.toUpperCase()} {sport.name.toUpperCase()} {filter.name.toUpperCase()}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 6 }}>
            {total} products found
          </p>
        </div>
      </section>

      <SchoolShopClient
        initialProducts={products}
        totalCount={total}
        schoolSlug={slug}
        schoolColor={school.primary_color}
        school={school}
      />
    </main>
  )
}
