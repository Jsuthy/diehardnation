import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublicClient } from '@/lib/supabase/server'
import { searchEbayProducts } from '@/lib/ebay/search'
import type { MomentPage } from '@/lib/supabase/types'
import {
  buildMomentQuickAnswer,
  buildMomentGuide,
  buildMomentFaq,
  buildFaqSchema,
  computePriceStat,
} from '@/lib/seo/content-blocks'
import { ContentSection, FaqSection, QuickAnswerBox } from '@/components/seo/ValueContent'
import MomentProductGrid from '@/components/seo/MomentProductGrid'
import { evaluatePageQuality, robotsForQuality } from '@/lib/seo/quality-gate'

// Moment pages are trend-driven and numerous; render on demand and cache.
export const revalidate = 1800
export const dynamicParams = true

const SITE = 'https://diehardnation.com'

async function getMoment(slug: string): Promise<MomentPage | null> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('moment_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  return (data as MomentPage | null) ?? null
}

function isExpired(m: MomentPage): boolean {
  return !!m.expires_at && new Date(m.expires_at).getTime() < Date.now()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const m = await getMoment(slug)
  if (!m) return {}

  // Use the stored product_count for the index decision (avoids an eBay call here).
  const quality = evaluatePageQuality({
    productCount: m.product_count,
    uniqueWordCount: 200,
    isTimeSensitive: true,
  })
  const indexable = m.indexable && !isExpired(m) && quality.indexable

  return {
    title: `${m.title} | DieHardNation`,
    description: m.description,
    robots: robotsForQuality({ ...quality, indexable }),
    alternates: { canonical: `${SITE}/trending/${slug}` },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${SITE}/trending/${slug}`,
      siteName: 'DieHardNation',
      images: [{ url: `${SITE}/og-default.png`, width: 1200, height: 630, alt: m.title }],
    },
  }
}

export default async function MomentPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const m = await getMoment(slug)
  if (!m) notFound()

  // Live products at render time (ISR-cached). Falls back to stored count.
  const products = await searchEbayProducts(m.gear_query, 24)
  const priceStat = computePriceStat(products.map(p => p.price))
  const count = products.length || m.product_count

  const quickAnswer = buildMomentQuickAnswer(m.term, { productCount: count, priceStat })
  const guide = buildMomentGuide(m.term, { context: m.context, priceStat })
  const faqs = buildMomentFaq(m.term, { productCount: count, priceStat })

  return (
    <main>
      {/* JSON-LD: BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, item: { '@id': SITE, name: 'DieHardNation' } },
          { '@type': 'ListItem', position: 2, item: { '@id': `${SITE}/trending`, name: 'Trending' } },
          { '@type': 'ListItem', position: 3, item: { '@id': `${SITE}/trending/${slug}`, name: m.title } },
        ],
      }) }} />

      {/* JSON-LD: ItemList (server-rendered products) */}
      {products.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'ItemList', name: m.title,
          numberOfItems: products.length,
          itemListElement: products.slice(0, 10).map((p, i) => ({
            '@type': 'ListItem', position: i + 1,
            item: {
              '@type': 'Product', name: p.title,
              ...(p.imageUrl && { image: p.imageUrl }),
              offers: { '@type': 'Offer', price: p.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: p.url },
            },
          })),
        }) }} />
      )}

      {/* JSON-LD: FAQPage */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faqs)) }} />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="container" style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)' }}>
        <ol style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
          <li><Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>DieHardNation</Link></li>
          <li style={{ margin: '0 6px' }}>/</li>
          <li><Link href="/trending" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Trending</Link></li>
          <li style={{ margin: '0 6px' }}>/</li>
          <li style={{ color: 'var(--text-secondary)' }}>{m.term}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section style={{ background: '#111', padding: '32px 0' }}>
        <div className="container">
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FF8200', marginBottom: 8 }}>
            Trending Now
          </span>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 52px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {m.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 10 }}>
            {count}+ live listings · updated continuously
          </p>
        </div>
      </section>

      {/* Quick Answer — answer-engine extract block */}
      <QuickAnswerBox qa={quickAnswer} label={`${m.term} fan gear`} />

      {/* Server-rendered products */}
      <MomentProductGrid products={products} />

      {/* Value-add content + FAQ */}
      <ContentSection block={guide} />
      <FaqSection faqs={faqs} heading={`${m.term} Fan Gear FAQ`} />

      {/* Disclaimer */}
      <section className="container" style={{ padding: '0 20px 48px' }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 720 }}>
          DieHardNation is an independent affiliate aggregator. Products are sold by third-party
          sellers on eBay; clicking a listing takes you directly to the seller. We earn affiliate
          commissions from qualifying purchases. All trademarks are property of their respective owners.
        </p>
      </section>
    </main>
  )
}
