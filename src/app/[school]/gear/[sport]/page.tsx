import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSchool, getProducts } from '@/lib/supabase/queries'
import { SPORTS } from '@/lib/constants/sports'
import { SCHOOLS } from '@/lib/constants/schools'
import { CONFERENCES } from '@/lib/constants/conferences'
import SchoolShopClient from '@/components/school/SchoolShopClient'
import { getSportMetadata } from '@/lib/seo/metadata-templates'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const sportSlugs = SPORTS.map(s => s.slug)
  const topSchools = SCHOOLS.filter(s => s.fan_size_rank <= 20)
  return topSchools.flatMap(school =>
    sportSlugs.map(sport => ({ school: school.slug, sport }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string; sport: string }>
}): Promise<Metadata> {
  const { school: slug, sport: sportSlug } = await params
  const school = await getSchool(slug)
  const sport = SPORTS.find(s => s.slug === sportSlug)
  if (!school || !sport) return {}

  const meta = getSportMetadata(school, sportSlug)

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://diehardnation.com/${slug}/gear/${sportSlug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://diehardnation.com/${slug}/gear/${sportSlug}`,
      siteName: 'DieHardNation',
      images: [{
        url: 'https://diehardnation.com/og-default.png',
        width: 1200,
        height: 630,
        alt: `${school.name} ${sport.name} Gear`,
      }],
    },
  }
}

export default async function SportPage({
  params,
}: {
  params: Promise<{ school: string; sport: string }>
}) {
  const { school: slug, sport: sportSlug } = await params
  const school = await getSchool(slug)
  const sport = SPORTS.find(s => s.slug === sportSlug)

  if (!school || !school.is_active || !sport) notFound()

  const { products, total } = await getProducts({
    schoolSlug: slug,
    sport: sportSlug,
    limit: 24,
  })

  const otherSports = SPORTS.filter(s => s.slug !== sportSlug && s.slug !== 'general')

  const conference = CONFERENCES.find(c => c.slug === school.conference)
  const meta = getSportMetadata(school, sportSlug)

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
              name: `${school.name} ${sport.name} Gear`,
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
          <li style={{ color: 'var(--text-secondary)' }}>{sport.name} Gear</li>
        </ol>
      </nav>

      {/* Hero */}
      <section style={{ background: school.primary_color, padding: '32px 0' }}>
        <div className="container">
          <h1 style={{
            color: 'white',
            fontWeight: 900,
            fontSize: 'clamp(28px, 5vw, 52px)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}>
            {meta.h1}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 8 }}>
            Shop {school.mascot} {sport.name.toLowerCase()} apparel &mdash; updated daily
          </p>
          <span style={{
            display: 'inline-block',
            marginTop: 12,
            fontSize: 12,
            fontWeight: 700,
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 12,
          }}>
            {total} products
          </span>
        </div>
      </section>

      {/* Sport intro paragraph — SEO text content */}
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

      {/* Products */}
      <section aria-label={`${school.name} ${sport.name} fan gear products`} className="container" style={{ padding: '24px 20px 0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>
          {meta.h2s[2]}
        </h2>
      </section>
      <SchoolShopClient
        initialProducts={products}
        totalCount={total}
        schoolSlug={slug}
        schoolColor={school.primary_color}
        school={school}
      />

      {/* Related sports */}
      {otherSports.length > 0 && (
        <nav aria-label={`Other ${school.name} sports`} className="container" style={{ padding: '32px 20px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>
            {meta.h2s[3]}
          </h2>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
            {otherSports.map(s => (
              <Link
                key={s.slug}
                href={`/${slug}/gear/${s.slug}`}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* About section — SEO text content */}
      <section className="container" aria-label={`About ${school.name} ${sport.name} gear`} style={{ padding: '16px 20px 48px' }}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          marginBottom: 12,
        }}>
          About {school.name} {sport.name} Gear
        </h2>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: 720,
          marginBottom: 12,
        }}>
          Shop the best {school.name} {sport.name.toLowerCase()} gear on DieHardNation — an
          independent fan aggregator connecting {school.nickname} fans with hoodies, jerseys,
          shirts, hats and accessories from eBay and Amazon. Our {school.nickname}{' '}
          {sport.name.toLowerCase()} gear catalog updates daily with fresh listings so you
          always find current styles and competitive prices.
        </p>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: 720,
          marginBottom: 12,
        }}>
          Whether you&apos;re shopping for game day, looking for a gift, or adding to your{' '}
          {school.nickname} collection, browse our full selection of {school.name}{' '}
          {sport.name.toLowerCase()} apparel. Filter by category to find hoodies and sweatshirts,
          jerseys and uniforms, t-shirts and shirts, or hats and caps. Sort by price to find deals
          in your budget — from affordable options under $25 to premium fan gear over $100.
        </p>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: 720,
        }}>
          DieHardNation is not affiliated with {school.name}, the{' '}
          {conference?.fullName || school.conference} conference, or the NCAA. All products are
          sold by third-party sellers; clicking View Deal takes you directly to the retailer
          where you can purchase securely.
        </p>
      </section>
    </main>
  )
}
