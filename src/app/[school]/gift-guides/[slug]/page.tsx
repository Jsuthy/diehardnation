import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSchool, getProducts, getProgrammaticPage, getProgrammaticPages } from '@/lib/supabase/queries'
import SchemaScript from '@/components/SchemaScript'
import { buildBreadcrumbSchema, buildItemListSchema } from '@/lib/schema'
import ProductCardGrid from '@/components/products/ProductCardGrid'

export const revalidate = 3600

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string; slug: string }>
}): Promise<Metadata> {
  const { school: schoolSlug, slug } = await params
  const page = await getProgrammaticPage(schoolSlug, slug)
  if (!page) return {}

  return {
    title: page.title,
    description: page.description,
  }
}

export default async function GiftGuidePage({
  params,
}: {
  params: Promise<{ school: string; slug: string }>
}) {
  const { school: schoolSlug, slug } = await params
  const [school, page] = await Promise.all([
    getSchool(schoolSlug),
    getProgrammaticPage(schoolSlug, slug),
  ])

  if (!school || !page) notFound()

  const queryParams: Parameters<typeof getProducts>[0] = {
    schoolSlug,
    limit: 16,
    sortBy: 'popular',
  }
  if (page.sport) queryParams.sport = page.sport
  if (page.category) queryParams.category = page.category
  if (page.price_range) queryParams.priceRange = page.price_range

  const { products } = await getProducts(queryParams)

  const allPages = await getProgrammaticPages(schoolSlug)
  const relatedGuides = allPages
    .filter(p => p.page_type === 'gift-guide' && p.slug !== slug)
    .slice(0, 3)

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: school.short_name, url: `/${schoolSlug}` },
    { name: 'Gift Guides', url: `/${schoolSlug}/gift-guides` },
    { name: page.title, url: `/${schoolSlug}/gift-guides/${slug}` },
  ]

  return (
    <main className="container" style={{ padding: '16px 20px 64px' }}>
      <SchemaScript schema={[
        buildBreadcrumbSchema(breadcrumbs),
        ...(products.length > 0 ? [buildItemListSchema(products, page.title)] : []),
      ]} />

      <nav style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link href={`/${schoolSlug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{school.short_name}</Link>
        {' / '}
        <Link href={`/${schoolSlug}/gift-guides`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Gift Guides</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>{page.title}</span>
      </nav>

      <h1 style={{
        fontSize: 'clamp(24px, 4vw, 40px)',
        fontWeight: 900,
        letterSpacing: '-0.02em',
        marginBottom: 8,
      }}>
        {page.title}
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16, maxWidth: 640 }}>
        {page.description}
      </p>

      {/* Affiliate disclosure */}
      <div style={{
        fontSize: 12,
        color: 'var(--text-muted)',
        background: 'var(--surface)',
        padding: '10px 14px',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 24,
      }}>
        This page contains affiliate links. We may earn a commission when you click and buy.
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <ProductCardGrid products={products} schoolColor={school.primary_color} />
      ) : (
        <p style={{ color: 'var(--text-muted)', padding: '32px 0' }}>
          No products available yet for this guide. Check back soon.
        </p>
      )}

      {/* Why these picks */}
      <section style={{ marginTop: 40, maxWidth: 640 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Why these picks</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Whether you&apos;re shopping for a die-hard {school.mascot} fan or looking for the perfect
          game day gift, these {school.nickname} picks are fan favorites from eBay and Amazon.
          We curate the best deals across multiple retailers so you can compare prices and find
          exactly what you&apos;re looking for &mdash; all in one place.
        </p>
      </section>

      {/* Related guides */}
      {relatedGuides.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>More {school.short_name} Gift Guides</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            {relatedGuides.map(g => (
              <Link
                key={g.id}
                href={`/${schoolSlug}/gift-guides/${g.slug}`}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '8px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                }}
              >
                {g.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
