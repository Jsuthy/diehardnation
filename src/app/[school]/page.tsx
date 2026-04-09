import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSchool, getProducts, getSchoolStats, getNewsPosts } from '@/lib/supabase/queries'
import { CONFERENCES } from '@/lib/constants/conferences'
import { SCHOOLS } from '@/lib/constants/schools'
import SchoolShopClient from '@/components/school/SchoolShopClient'
import Link from 'next/link'

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

  const title = `${school.name} Fan Gear — Jerseys, Hoodies & More`
  const description = `Shop ${school.name} fan gear. ${school.mascot} jerseys, hoodies, hats and more from eBay and Amazon. Independent fan aggregator.`

  return {
    title,
    description,
    alternates: { canonical: `https://diehardnation.com/${slug}` },
    openGraph: {
      title: `${school.name} Fan Gear | DieHardNation`,
      description,
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

  return (
    <main>
      {/* School hero */}
      <section style={{
        background: school.primary_color,
        padding: '40px 0',
      }}>
        <div className="container">
          <h1 style={{
            color: 'white',
            fontWeight: 900,
            fontSize: 'clamp(32px, 6vw, 64px)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}>
            {school.name.toUpperCase()}
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
      </section>

      {/* Client shop section: search, filters, grid */}
      <SchoolShopClient
        initialProducts={initialProducts}
        totalCount={totalCount}
        schoolSlug={slug}
        schoolColor={school.primary_color}
        school={school}
      />

      {/* Latest news */}
      {newsPosts.length > 0 && (
        <section className="container" style={{ padding: '48px 20px' }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}>
            {school.name.toUpperCase()} NEWS
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

      {/* Disclaimer */}
      <section className="container" style={{ padding: '32px 20px 64px' }}>
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

      {/* JSON-LD: Organization + FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'DieHardNation',
              url: `https://diehardnation.com/${school.slug}`,
              description: `Shop ${school.name} fan gear. ${school.mascot} jerseys, hoodies, hats and more from eBay and Amazon.`,
            },
            {
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
            },
          ]),
        }}
      />
    </main>
  )
}
