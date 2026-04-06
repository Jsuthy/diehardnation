import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSchool, getProductBySlug, getProducts } from '@/lib/supabase/queries'
import { CATEGORIES } from '@/lib/constants/categories'
import SchemaScript from '@/components/SchemaScript'
import { buildProductSchema, buildBreadcrumbSchema } from '@/lib/schema'
import ProductCardGrid from '@/components/products/ProductCardGrid'

export const revalidate = 21600
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string; slug: string }>
}): Promise<Metadata> {
  const { school: schoolSlug, slug } = await params
  const [school, product] = await Promise.all([
    getSchool(schoolSlug),
    getProductBySlug(schoolSlug, slug),
  ])
  if (!school || !product) return {}

  return {
    title: `${product.title} \u2014 ${school.name} Fan Gear`,
    description: `Shop ${product.title}. $${product.price.toFixed(2)}. Find ${school.mascot} fan gear at DieHardNation.`,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ school: string; slug: string }>
}) {
  const { school: schoolSlug, slug } = await params
  const [school, product] = await Promise.all([
    getSchool(schoolSlug),
    getProductBySlug(schoolSlug, slug),
  ])

  if (!school || !product) notFound()

  const category = CATEGORIES.find(c => c.slug === product.category)
  const sourceLabel = product.source === 'ebay' ? 'eBay' : product.source === 'amazon' ? 'Amazon' : product.source

  const { products: similar } = await getProducts({
    schoolSlug,
    category: product.category,
    limit: 4,
  })
  const similarProducts = similar.filter(p => p.slug !== product.slug).slice(0, 4)

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: school.short_name, url: `/${schoolSlug}` },
    { name: category?.name || 'Gear', url: `/${schoolSlug}/gear/${product.sport}` },
    { name: product.title, url: `/${schoolSlug}/product/${slug}` },
  ]

  return (
    <main className="container" style={{ maxWidth: 900, padding: '16px 20px 64px' }}>
      <SchemaScript schema={[buildProductSchema(product), buildBreadcrumbSchema(breadcrumbs)]} />

      {/* Breadcrumb */}
      <nav style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link href={`/${schoolSlug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{school.short_name}</Link>
        {' / '}
        <Link href={`/${schoolSlug}/gear/${product.sport}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{category?.name || 'Gear'}</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>Product</span>
      </nav>

      {/* Product layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <style>{`
          @media (max-width: 640px) {
            .product-detail-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Image */}
        <div className="product-detail-grid" style={{ position: 'relative', aspectRatio: '1', background: '#F0F0F0', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: school.primary_color,
            }}>
              <span style={{ fontSize: 96, fontWeight: 900, color: 'rgba(255,255,255,0.3)' }}>
                {school.short_name.charAt(0)}
              </span>
            </div>
          )}
          <span style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'rgba(0,0,0,0.75)',
            color: 'white',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 4,
          }}>
            Available on {sourceLabel}
          </span>
        </div>

        {/* Info */}
        <div>
          {category && (
            <span style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: school.primary_color,
              color: 'white',
              padding: '3px 8px',
              borderRadius: 3,
              marginBottom: 12,
            }}>
              {category.name}
            </span>
          )}

          <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.3, marginBottom: 16 }}>
            {product.title}
          </h1>

          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 28, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span style={{ fontSize: 16, color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 10 }}>
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Trust signals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
            <span>Ships from {sourceLabel}</span>
            <span>Affiliate disclosure applies</span>
            <span>Opens on {sourceLabel} &mdash; secure checkout</span>
          </div>

          {/* CTA */}
          <a
            href={product.affiliate_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              display: 'block',
              width: '100%',
              height: 52,
              background: school.primary_color,
              color: 'white',
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: '0.04em',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              textAlign: 'center',
              lineHeight: '52px',
              marginBottom: 12,
            }}
          >
            View Deal on {sourceLabel} &rarr;
          </a>

          <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Affiliate link &mdash; we may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>

      {/* Similar gear */}
      {similarProducts.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            More {school.short_name} {category?.name || 'Gear'}
          </h2>
          <ProductCardGrid products={similarProducts} schoolColor={school.primary_color} />
        </section>
      )}
    </main>
  )
}
