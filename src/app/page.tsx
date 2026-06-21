import type { Metadata } from 'next'
import Link from 'next/link'
import HeroShop from '@/components/search/HeroShop'
import CategoryCarousel from '@/components/home/CategoryCarousel'
import TeamExplorer from '@/components/home/TeamExplorer'
import ConferenceSchoolGrid from '@/components/home/ConferenceSchoolGrid'
import EmailSignup from '@/components/email/EmailSignup'
import SectionHeading from '@/components/sports/SectionHeading'
import Reveal from '@/components/util/Reveal'
import { getLatestArticles, getUpcomingEvents } from '@/lib/sports/queries'
import { searchEbayProducts } from '@/lib/ebay/search'
import type { Article, SportEvent } from '@/lib/sports/types'
import { darken } from '@/lib/sports/color'

const HOME_TITLE = 'DieHardNation — Fan Gear & Sports News for Every Team'
const HOME_DESCRIPTION =
  'Shop fan gear for every team in every sport — NFL, NBA, MLB, NHL, soccer, college and more. Search live jerseys, hoodies and hats from top retailers, updated constantly.'

const LEAGUE_TILES = [
  { slug: 'nfl', name: 'NFL', color: '#013369' },
  { slug: 'nba', name: 'NBA', color: '#C8102E' },
  { slug: 'mlb', name: 'MLB', color: '#0C2340' },
  { slug: 'nhl', name: 'NHL', color: '#111418' },
  { slug: 'premier-league', name: 'Premier League', color: '#37003C' },
  { slug: 'la-liga', name: 'La Liga', color: '#E08C00' },
  { slug: 'mls', name: 'MLS', color: '#00305B' },
  { slug: 'champions-league', name: 'Champions League', color: '#061C57' },
]

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
      images: [{ url: 'https://diehardnation.com/og-default.png', width: 1200, height: 630, alt: HOME_TITLE }],
    },
  }
}

async function getArticlesSafe(): Promise<Article[]> {
  try { return await getLatestArticles(3) } catch { return [] }
}
async function getEventsSafe(): Promise<SportEvent[]> {
  try { return await getUpcomingEvents(undefined, 8) } catch { return [] }
}
async function getShowcaseSafe() {
  try { return await searchEbayProducts('jersey', 24) } catch { return [] }
}

export const revalidate = 600

export default async function HomePage() {
  const [latestArticles, upcomingEvents, showcase] = await Promise.all([
    getArticlesSafe(), getEventsSafe(), getShowcaseSafe(),
  ])

  return (
    <main>
      {/* Interactive hero: instant search + live merch wall */}
      <HeroShop showcase={showcase} />

      {/* World Cup 2026 banner — flagship event, flows equity to the hub */}
      <Link
        href="/events/world-cup-2026"
        style={{
          display: 'block', background: 'linear-gradient(90deg,#002868,#006847)', color: 'white',
          textDecoration: 'none', textAlign: 'center', padding: '12px 20px', fontSize: 14, fontWeight: 700,
          letterSpacing: '0.01em',
        }}
      >
        🏆 World Cup 2026 is here — shop national team jerseys &amp; fan gear by country →
      </Link>

      {/* Trending — tabbed live product carousel */}
      <Reveal>
        <section className="container" style={{ padding: '40px 20px 8px' }}>
          <SectionHeading href="/search?q=jersey">Trending Gear</SectionHeading>
          <CategoryCarousel />
        </section>
      </Reveal>

      {/* Explore Teams — tabbed league → team picker */}
      <Reveal>
        <section className="container" style={{ padding: '24px 20px 8px' }}>
          <SectionHeading>Explore Teams</SectionHeading>
          <TeamExplorer />
        </section>
      </Reveal>

      {/* Shop by League — gradient tiles */}
      <Reveal>
        <section className="container" style={{ padding: '24px 20px 8px' }}>
          <SectionHeading>Shop by League</SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
            {LEAGUE_TILES.map(l => (
              <Link key={l.slug} href={`/league/${l.slug}`} className="dhn-tile" style={{
                background: `linear-gradient(135deg, ${l.color} 0%, ${darken(l.color, 0.42)} 100%)`,
              }}>
                <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: '-0.01em' }}>{l.name}</span>
                <span className="dhn-tile-cta">Shop gear →</span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Browse Every Sport */}
      <Reveal>
        <section id="sports" className="container" style={{ padding: '24px 20px 8px' }}>
          <SectionHeading>Browse Every Sport</SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
            {SPORT_CARDS.map(s => (
              <Link key={s.slug} href={`/sport/${s.slug}`} className="dhn-card" style={{ fontSize: 14, fontWeight: 700, padding: '15px 18px' }}>
                {s.label}
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Coming Up — events */}
      {upcomingEvents.length > 0 && (
        <Reveal>
          <section className="container" style={{ padding: '24px 20px 8px' }}>
            <SectionHeading href="/events">Coming Up</SectionHeading>
            <div className="dhn-hscroll">
              {upcomingEvents.map(ev => (
                <Link key={ev.slug} href={`/events/${ev.slug}`} className="dhn-card" style={{ flex: '0 0 230px', padding: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand)', marginBottom: 6 }}>{ev.event_type}</div>
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
        </Reveal>
      )}

      {/* Latest articles (only when published) */}
      {latestArticles.length > 0 && (
        <Reveal>
          <section className="container" style={{ padding: '24px 20px 8px' }}>
            <SectionHeading href="/news">Latest from DieHardNation</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
              {latestArticles.map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`} className="dhn-card" style={{ padding: 16 }}>
                  {a.sport_slug && (
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand)', marginBottom: 6 }}>{a.sport_slug.replace(/-/g, ' ')}</div>
                  )}
                  <h3 style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* College — one compact section */}
      <Reveal>
        <section className="container" style={{ padding: '24px 20px 8px' }}>
          <SectionHeading>College Fan Gear</SectionHeading>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, maxWidth: 640 }}>
            All 130 FBS programs by conference — find your school for hoodies, jerseys, hats and more.
          </p>
          <ConferenceSchoolGrid />
        </section>
      </Reveal>

      {/* Email signup */}
      <section className="container" style={{ padding: '32px 20px 16px', maxWidth: 720 }}>
        <EmailSignup source="homepage" />
      </section>

      {/* Tight SEO line */}
      <section style={{ maxWidth: 820, margin: '24px auto 64px', padding: '0 20px' }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)' }}>
          DieHardNation is an independent fan-gear hub covering every sport, league and team — the NFL, NBA, MLB and NHL,
          global soccer, college and more. Search live jerseys, hoodies, hats and collectibles from trusted retailers.
          We&apos;re not affiliated with any league, team or the NCAA.
        </p>
      </section>
    </main>
  )
}
