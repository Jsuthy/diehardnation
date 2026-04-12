import type { Metadata } from 'next'
import { Suspense } from 'react'
import HeroSearch from '@/components/home/HeroSearch'
import ConferenceSchoolGrid from '@/components/home/ConferenceSchoolGrid'
import Link from 'next/link'
import { getPublicClient } from '@/lib/supabase/server'
import type { Product, NewsPost, School } from '@/lib/supabase/types'
import { HUB_METADATA } from '@/lib/seo/metadata-templates'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams
  const hasConference = !!params.conference

  return {
    title: HUB_METADATA.title,
    description: HUB_METADATA.description,
    alternates: { canonical: 'https://diehardnation.com' },
    ...(hasConference && { robots: { index: false, follow: true } }),
    openGraph: {
      title: HUB_METADATA.title,
      description: HUB_METADATA.description,
      url: 'https://diehardnation.com',
      siteName: 'DieHardNation',
      images: [{
        url: 'https://diehardnation.com/og-default.png',
        width: 1200,
        height: 630,
        alt: HUB_METADATA.title,
      }],
    },
  }
}

async function getTrendingProducts(): Promise<Product[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('click_count', { ascending: false })
      .limit(8)
    return (data as Product[]) || []
  } catch {
    return []
  }
}

async function getActiveSchools(): Promise<School[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('schools')
      .select('*')
      .eq('is_active', true)
      .eq('is_live', true)
      .order('name', { ascending: true })
    return (data as School[]) || []
  } catch {
    return []
  }
}

async function getLatestNews(): Promise<NewsPost[]> {
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('news_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(6)
    return (data as NewsPost[]) || []
  } catch {
    return []
  }
}

export const revalidate = 600

export default async function HomePage() {
  const [trendingProducts, latestNews, allSchools] = await Promise.all([
    getTrendingProducts(),
    getLatestNews(),
    getActiveSchools(),
  ])

  return (
    <main>
      {/* Hero */}
      <section className="container" style={{ padding: '80px 20px 60px' }}>
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          color: 'var(--text-primary)',
        }}>
          {HUB_METADATA.h1}
        </h1>
        <p style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          marginTop: 12,
          marginBottom: 32,
        }}>
          Find your school. Shop your team.
        </p>
        <Suspense fallback={<div style={{ height: 52, maxWidth: 480 }} />}>
          <HeroSearch />
        </Suspense>
      </section>

      {/* Conference tabs + school grid */}
      <section className="container" aria-label="Browse schools by conference">
        <h2 style={{
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          padding: '32px 20px 16px',
        }}>
          {HUB_METADATA.h2s[2]}
        </h2>
        <ConferenceSchoolGrid />
      </section>

      {/* Trending gear */}
      {trendingProducts.length > 0 && (
        <section className="container" aria-label="Trending fan gear" style={{ padding: '48px 20px' }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}>
            {HUB_METADATA.h2s[3].toUpperCase()}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}>
            {trendingProducts.map(p => (
              <div key={p.id} style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                padding: 12,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  ${p.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest news */}
      {latestNews.length > 0 && (
        <section className="container" aria-label="Latest news" style={{ padding: '48px 20px 80px' }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}>
            {HUB_METADATA.h2s[4].toUpperCase()}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}>
            {latestNews.map(post => (
              <article key={post.id} style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
              }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--brand)',
                  marginBottom: 6,
                }}>
                  {post.school_slug}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {post.excerpt}
                </p>
                <time style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, display: 'block' }}>
                  {new Date(post.published_at).toLocaleDateString()}
                </time>
              </article>
            ))}
          </div>
        </section>
      )}
      {/* Browse All Schools — internal linking for crawlability */}
      {allSchools.length > 0 && (
        <section className="container" aria-label="Browse all schools" style={{ padding: '48px 20px' }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            BROWSE ALL SCHOOLS
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Explore fan gear for all {allSchools.length} FBS schools — click any school to shop hoodies, jerseys, hats and more.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 8,
          }}>
            {allSchools.map(s => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'border-color 0.15s',
                }}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About DieHardNation — SEO text content */}
      <section style={{ maxWidth: 800, margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
          The College Fan Gear Hub for Every School
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 16 }}>
          DieHardNation is an independent college fan gear aggregator covering all 130 FBS schools
          across every conference — SEC, Big Ten, Big 12, ACC, and more. We connect fans with the
          best hoodies, jerseys, shirts, hats and accessories from trusted sellers on eBay and
          Amazon, updated every six hours so you always find the freshest deals.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Whether you&apos;re shopping for Nebraska Cornhuskers volleyball gear, Alabama Crimson Tide
          football jerseys, Ohio State Buckeyes hoodies, Penn State Nittany Lions hats, or Tennessee
          Volunteers sweatshirts — DieHardNation has your school covered. Browse by conference, search
          for your team, or explore trending gear from fans across the nation.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 32 }}>
          DieHardNation is not affiliated with any university, athletic department, conference, or the
          NCAA. All products are sold by independent third-party retailers. Clicking any product link
          takes you directly to eBay or Amazon where you can complete your purchase securely. We earn
          a small affiliate commission at no extra cost to you.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Shop College Fan Gear by Conference
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          Browse all 130 FBS schools organized by conference. The SEC features powerhouse fan bases
          including Alabama, Georgia, Tennessee, LSU, and Auburn. The Big Ten covers Michigan, Ohio
          State, Penn State, Nebraska, and Wisconsin among others. The Big 12 includes Texas,
          Oklahoma, Kansas State, and Iowa State. The ACC features Clemson, Notre Dame, Miami, and
          Florida State. Every school has its own dedicated fan gear hub with sport-specific pages
          for football, basketball, volleyball, wrestling, baseball, softball, and track.
        </p>
      </section>
    </main>
  )
}
