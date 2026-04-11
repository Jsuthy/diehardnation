import type { Metadata } from 'next'
import { Suspense } from 'react'
import HeroSearch from '@/components/home/HeroSearch'
import ConferenceSchoolGrid from '@/components/home/ConferenceSchoolGrid'
import { getPublicClient } from '@/lib/supabase/server'
import type { Product, NewsPost } from '@/lib/supabase/types'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams
  const hasConference = !!params.conference

  return {
    title: 'DieHardNation — College Fan Gear for Every School',
    description: 'Shop college fan gear across all 130 FBS schools. Jerseys, hoodies, hats and more from eBay and Amazon. Find your school, shop your team.',
    alternates: { canonical: 'https://diehardnation.com' },
    ...(hasConference && { robots: { index: false, follow: true } }),
    openGraph: {
      title: 'DieHardNation — College Fan Gear for Every School',
      description: 'Shop college fan gear across all 130 FBS schools. Jerseys, hoodies, hats and more from eBay and Amazon.',
      url: 'https://diehardnation.com',
      siteName: 'DieHardNation',
      images: [{
        url: 'https://diehardnation.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'DieHardNation — College Fan Gear for Every School',
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
  const [trendingProducts, latestNews] = await Promise.all([
    getTrendingProducts(),
    getLatestNews(),
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
          COLLEGE FAN GEAR FOR EVERY SCHOOL
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
      <section className="container">
        <h2 style={{
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          padding: '32px 20px 16px',
        }}>
          FIND YOUR SCHOOL
        </h2>
        <ConferenceSchoolGrid />
      </section>

      {/* Trending gear */}
      {trendingProducts.length > 0 && (
        <section className="container" style={{ padding: '48px 20px' }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}>
            TRENDING GEAR ACROSS THE NATION
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
        <section className="container" style={{ padding: '48px 20px 80px' }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}>
            LATEST NEWS FROM THE NATION
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
    </main>
  )
}
