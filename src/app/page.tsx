import type { Metadata } from 'next'
import { Suspense } from 'react'
import HeroSearch from '@/components/home/HeroSearch'
import ConferenceSchoolGrid from '@/components/home/ConferenceSchoolGrid'
import Link from 'next/link'
import { getPublicClient } from '@/lib/supabase/server'
import type { Product, NewsPost, School } from '@/lib/supabase/types'
import { getLatestArticles, getUpcomingEvents } from '@/lib/sports/queries'
import type { Article, SportEvent } from '@/lib/sports/types'
import EmailSignup from '@/components/email/EmailSignup'
import SectionHeading from '@/components/sports/SectionHeading'

const HOME_TITLE = 'DieHardNation — Fan Gear & Sports News for Every Team'
const HOME_DESCRIPTION =
  'Shop fan gear and follow the latest sports news for every team in every sport. NFL, NBA, soccer, college, cricket, F1 and more. Updated daily by fans, for fans.'

const SPORT_CARDS = [
  { slug: 'american-football', label: 'NFL & Football' },
  { slug: 'basketball', label: 'NBA & Basketball' },
  { slug: 'baseball', label: 'MLB & Baseball' },
  { slug: 'ice-hockey', label: 'NHL & Hockey' },
  { slug: 'soccer', label: 'Soccer' },
  { slug: 'rugby', label: 'Rugby' },
  { slug: 'cricket', label: 'Cricket' },
  { slug: 'tennis', label: 'Tennis' },
  { slug: 'golf', label: 'Golf' },
  { slug: 'motorsport', label: 'Formula 1' },
  { slug: 'mma', label: 'MMA' },
  { slug: 'multi-sport', label: 'Olympics' },
  { slug: 'cycling', label: 'Cycling' },
]

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams
  const hasConference = !!params.conference

  return {
    title: { absolute: HOME_TITLE },
    description: HOME_DESCRIPTION,
    alternates: { canonical: 'https://diehardnation.com' },
    ...(hasConference && { robots: { index: false, follow: true } }),
    openGraph: {
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      url: 'https://diehardnation.com',
      siteName: 'DieHardNation',
      images: [{
        url: 'https://diehardnation.com/og-default.png',
        width: 1200,
        height: 630,
        alt: HOME_TITLE,
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

async function getLatestArticlesSafe(): Promise<Article[]> {
  try { return await getLatestArticles(3) } catch { return [] }
}

async function getUpcomingEventsSafe(): Promise<SportEvent[]> {
  try { return await getUpcomingEvents(undefined, 8) } catch { return [] }
}

export const revalidate = 600

export default async function HomePage() {
  const [trendingProducts, latestNews, allSchools, latestArticles, upcomingEvents] = await Promise.all([
    getTrendingProducts(),
    getLatestNews(),
    getActiveSchools(),
    getLatestArticlesSafe(),
    getUpcomingEventsSafe(),
  ])

  return (
    <main>
      {/* Hero — global */}
      <section style={{ background: 'linear-gradient(160deg, #0A0A0A 0%, #1A0606 100%)', color: '#fff' }}>
        <div className="container" style={{ padding: '72px 20px 56px' }}>
          <h1 style={{
            fontSize: 'clamp(42px, 7vw, 84px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
          }}>
            Fan Gear &amp; Sports News<br />for <span style={{ color: 'var(--brand)' }}>Every Team</span>
          </h1>
          <p style={{
            fontSize: 'clamp(17px, 3vw, 24px)',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.72)',
            marginTop: 14,
            marginBottom: 28,
            maxWidth: 720,
          }}>
            Every sport, every league, every team — worldwide. Shop the gear, follow the action.
          </p>
          <Suspense fallback={<div style={{ height: 52, maxWidth: 480 }} />}>
            <HeroSearch />
          </Suspense>
        </div>
        <div style={{ height: 6, background: 'var(--brand)' }} />
      </section>

      {/* Browse Every Sport — primary entry point */}
      <section id="sports" className="container" aria-label="Browse every sport" style={{ padding: '40px 20px 16px' }}>
        <SectionHeading>Browse Every Sport</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
          {SPORT_CARDS.map(s => (
            <Link key={s.slug} href={`/sport/${s.slug}`} className="dhn-card" style={{ fontSize: 14, fontWeight: 700, padding: '16px 18px' }}>
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming events strip */}
      {upcomingEvents.length > 0 && (
        <section className="container" aria-label="Upcoming events" style={{ padding: '36px 20px 16px' }}>
          <SectionHeading href="/events">Coming Up</SectionHeading>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {upcomingEvents.map(ev => (
              <Link key={ev.slug} href={`/events/${ev.slug}`} className="dhn-card" style={{ flex: '0 0 220px', padding: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand)', marginBottom: 6 }}>
                  {ev.event_type}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3, marginBottom: 6 }}>{ev.name}</div>
                {ev.start_date && (
                  <time style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* College Fan Gear — conference grid */}
      <section className="container" aria-label="Browse schools by conference" style={{ padding: '36px 20px 16px' }}>
        <SectionHeading>College Fan Gear — Browse by Conference</SectionHeading>
        <ConferenceSchoolGrid />
      </section>

      {/* Trending gear */}
      {trendingProducts.length > 0 && (
        <section className="container" aria-label="Trending fan gear" style={{ padding: '40px 20px' }}>
          <SectionHeading>Trending Fan Gear</SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
            {trendingProducts.map(p => (
              <div key={p.id} className="dhn-card" style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>
                  ${p.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest news */}
      {latestNews.length > 0 && (
        <section className="container" aria-label="Latest news" style={{ padding: '40px 20px 64px' }}>
          <SectionHeading href="/news">Latest College News</SectionHeading>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
            gap: 16,
          }}>
            {latestNews.map(post => (
              <article key={post.id} className="dhn-card" style={{ padding: 16 }}>
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
        <section className="container" aria-label="Browse all schools" style={{ padding: '40px 20px' }}>
          <SectionHeading>Browse All Schools</SectionHeading>
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

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section className="container" aria-label="Latest articles" style={{ padding: '0 20px 48px' }}>
          <SectionHeading href="/news">Latest from DieHardNation</SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {latestArticles.map(a => (
              <Link key={a.slug} href={`/news/${a.slug}`} className="dhn-card" style={{ padding: 16 }}>
                {a.sport_slug && (
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand)', marginBottom: 6 }}>
                    {a.sport_slug.replace(/-/g, ' ')}
                  </div>
                )}
                <h3 style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{a.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Email signup */}
      <section className="container" style={{ padding: '0 20px 48px', maxWidth: 720 }}>
        <EmailSignup source="homepage" />
      </section>

      {/* About DieHardNation — SEO text content */}
      <section style={{ maxWidth: 800, margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
          The Fan Gear &amp; Sports News Hub for Every Team
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 16 }}>
          DieHardNation is an independent fan gear and sports news hub covering every sport, league
          and team in the world — the NFL, NBA, MLB and NHL, global soccer, cricket, rugby, Formula 1,
          tennis, golf, MMA, the Olympics and more, alongside all 130 college FBS programs. We connect
          fans with the best hoodies, jerseys, shirts, hats and accessories from trusted retailers, and
          publish fresh coverage daily.
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
