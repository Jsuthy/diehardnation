import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSchool, getProducts, getSchoolStats, getNewsPosts } from '@/lib/supabase/queries'
import { CONFERENCES } from '@/lib/constants/conferences'
import { SCHOOLS } from '@/lib/constants/schools'
import SchoolShopClient from '@/components/school/SchoolShopClient'
import Link from 'next/link'
import { getSchoolMetadata } from '@/lib/seo/metadata-templates'
import { getLogoUrl } from '@/lib/schools/logos'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  return SCHOOLS
    .filter(s => s.fan_size_rank <= 20)
    .map(s => ({ school: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string }>
}): Promise<Metadata> {
  const { school: slug } = await params
  const school = await getSchool(slug)
  if (!school) return {}

  const meta = getSchoolMetadata(school)

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://diehardnation.com/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://diehardnation.com/${slug}`,
      siteName: 'DieHardNation',
      images: [{
        url: 'https://diehardnation.com/og-default.png',
        width: 1200,
        height: 630,
        alt: `${school.name} Fan Gear`,
      }],
    },
  }
}

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ school: string }>
}) {
  const { school: slug } = await params
  const school = await getSchool(slug)
  if (!school || !school.is_active) notFound()

  const [{ products: initialProducts, total: totalCount }, stats, newsPosts] = await Promise.all([
    getProducts({ schoolSlug: slug, limit: 24 }),
    getSchoolStats(slug),
    getNewsPosts(slug, 3),
  ])

  const conference = CONFERENCES.find(c => c.slug === school.conference)
  const meta = getSchoolMetadata(school)

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
                item: { '@id': `https://diehardnation.com/${school.slug}`, name: school.name }},
            ]
          })
        }}
      />

      {/* JSON-LD: ItemList */}
      {initialProducts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${school.name} Fan Gear`,
              itemListElement: initialProducts.slice(0, 10).map((p, i) => ({
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

      {/* JSON-LD: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `Where can I buy ${school.name} fan gear?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `DieHardNation aggregates ${school.name} ${school.mascot} fan gear from trusted retailers like eBay and Amazon. Browse ${stats.productCount}+ products including jerseys, hoodies, hats, and more — all in one place.`,
                },
              },
              {
                '@type': 'Question',
                name: `What are the best ${school.name} gifts for fans?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Popular ${school.mascot} gifts include game day apparel, vintage-style tees, and officially licensed accessories. Check our ${school.short_name} gift guides for curated picks across every budget.`,
                },
              },
              {
                '@type': 'Question',
                name: `Does DieHardNation ship ${school.name} gear?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `DieHardNation is an affiliate aggregator — we link you directly to retailers like eBay and Amazon who handle shipping. This means you get their shipping speeds, return policies, and buyer protection.`,
                },
              },
              {
                '@type': 'Question',
                name: `What ${school.name} sports gear is available?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `We carry ${school.mascot} gear across football, basketball, baseball, and more. Browse by sport to find ${school.short_name} apparel for any season. Currently ${stats.productCount} products available across ${stats.pageCount} categories.`,
                },
              },
            ],
          })
        }}
      />

      {/* School hero */}
      <section style={{
        background: school.primary_color,
        padding: '40px 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {(() => {
            const logoUrl = getLogoUrl(school.slug)
            return logoUrl ? (
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <img
                  src={logoUrl}
                  alt={`${school.name} logo`}
                  width={64}
                  height={64}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ) : null
          })()}
          <div>
          <h1 style={{
            color: 'white',
            fontWeight: 900,
            fontSize: 'clamp(32px, 6vw, 64px)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}>
            {meta.h1}
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 16,
            marginTop: 8,
          }}>
            {school.name} fan gear &mdash; every sport, all in one place
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 13,
            marginTop: 12,
          }}>
            {stats.productCount} products &middot; {stats.newsCount} news articles &middot; {stats.pageCount} pages
          </p>
          </div>
        </div>
      </section>

      {/* School intro paragraph — SEO text content */}
      <section className="container" style={{ padding: '24px 20px 0' }}>
        <p style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: 760,
          marginBottom: 12,
        }}>
          {meta.intro}
        </p>
        <p style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: 760,
        }}>
          Browse {school.name} gear by sport using the navigation above — shop {school.nickname}
          football jerseys and hoodies for game day, {school.nickname} basketball apparel for hoops
          season, or {school.nickname} volleyball shirts and sweatshirts year-round. Every category
          is updated daily with fresh listings from eBay and Amazon so you always find the best
          selection and prices.
        </p>
      </section>

      {/* Client shop section: search, filters, grid */}
      <section aria-label={`${school.name} fan gear products`}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          padding: '24px 20px 0',
        }} className="container">
          {meta.h2s[3]}
        </h2>
      </section>
      <SchoolShopClient
        initialProducts={initialProducts}
        totalCount={totalCount}
        schoolSlug={slug}
        schoolColor={school.primary_color}
        school={school}
      />

      {/* Latest news */}
      {newsPosts.length > 0 && (
        <section className="container" aria-label={`Latest ${school.name} news`} style={{ padding: '48px 20px' }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}>
            {meta.h2s[4]}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}>
            {newsPosts.map(post => (
              <Link
                key={post.id}
                href={`/${slug}/news/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  transition: 'box-shadow 0.15s',
                }}>
                  <time style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {new Date(post.published_at).toLocaleDateString()}
                  </time>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginTop: 4 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                    {post.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About section — SEO text content */}
      <section className="container" style={{ padding: '32px 20px' }}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          marginBottom: 12,
        }}>
          About {school.name} Fan Gear on DieHardNation
        </h2>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: 720,
          marginBottom: 12,
        }}>
          DieHardNation is an independent fan gear aggregator — not affiliated
          with {school.name}, the {conference?.fullName || school.conference} conference,
          or the NCAA. We connect {school.mascot} fans with the best gear from trusted
          retailers including eBay and Amazon. All products are sold by third-party
          sellers; clicking View Deal takes you directly to the retailer where you
          can purchase securely.
        </p>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: 720,
          marginBottom: 12,
        }}>
          Looking for specific {school.name} gear? Use the sport tabs to browse {school.nickname}
          football jerseys and hoodies, basketball apparel, volleyball sweatshirts, wrestling gear,
          baseball jerseys, and softball apparel. Filter by category to find exactly what you need
          — whether that&apos;s a {school.nickname} hoodie under $25, a premium {school.name} jersey,
          or the perfect fan gift.
        </p>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: 720,
        }}>
          Our {school.name} fan gear catalog updates every six hours with new listings from eBay,
          ensuring you always have access to the latest {school.nickname} apparel, vintage finds,
          and game day essentials. Bookmark this page and check back regularly for new arrivals
          and deals on {school.mascot} gear.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="container" style={{ padding: '16px 20px 64px' }}>
        <p style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          maxWidth: 720,
        }}>
          DieHardNation is an independent, unofficial fan site and affiliate aggregator.
          Not affiliated with {school.name}, {conference?.fullName || school.conference},
          or NCAA. All trademarks are property of their respective owners.
          We earn affiliate commissions from qualifying purchases.
        </p>
      </section>
    </main>
  )
}
