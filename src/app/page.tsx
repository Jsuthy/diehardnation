import type { Metadata } from 'next'
import Link from 'next/link'
import HeroShop from '@/components/search/HeroShop'
import ConferenceSchoolGrid from '@/components/home/ConferenceSchoolGrid'
import EmailSignup from '@/components/email/EmailSignup'
import SectionHeading from '@/components/sports/SectionHeading'
import { getLatestArticles, getUpcomingEvents } from '@/lib/sports/queries'
import type { Article, SportEvent } from '@/lib/sports/types'
import { PRO_TEAM_LIST } from '@/lib/sports/pro-data'
import { contrastText } from '@/lib/sports/color'

const HOME_TITLE = 'DieHardNation — Fan Gear & Sports News for Every Team'
const HOME_DESCRIPTION =
  'Shop fan gear for every team in every sport — NFL, NBA, MLB, NHL, soccer, college and more. Search live jerseys, hoodies and hats from top retailers, updated constantly.'

const VALUE_PROPS = [
  { icon: '🌍', title: 'Every Team, Every Sport', body: 'NFL, NBA, MLB, NHL, global soccer, college and more — all in one place.' },
  { icon: '🔥', title: 'Live Deals, Updated Constantly', body: 'Real-time listings from top retailers, sorted so you find the best price fast.' },
  { icon: '🏷️', title: 'Your Team in Seconds', body: 'Jerseys, hoodies, hats and collectibles — search and shop in a couple clicks.' },
]

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

const POPULAR_TEAM_SLUGS = [
  'kansas-city-chiefs', 'dallas-cowboys', 'philadelphia-eagles', 'san-francisco-49ers',
  'los-angeles-lakers', 'boston-celtics', 'golden-state-warriors', 'new-york-knicks',
  'new-york-yankees', 'los-angeles-dodgers', 'boston-red-sox', 'chicago-cubs',
  'boston-bruins', 'new-york-rangers', 'detroit-red-wings', 'toronto-maple-leafs',
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

const teamBySlug = Object.fromEntries(PRO_TEAM_LIST.map(t => [t.slug, t]))

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

export const revalidate = 600

export default async function HomePage() {
  const [latestArticles, upcomingEvents] = await Promise.all([getArticlesSafe(), getEventsSafe()])
  const popularTeams = POPULAR_TEAM_SLUGS.map(s => teamBySlug[s]).filter(Boolean)

  return (
    <main>
      {/* Hero — live product shop search */}
      <HeroShop />

      {/* Value props */}
      <section className="container" style={{ padding: '44px 20px 12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
          {VALUE_PROPS.map(v => (
            <div key={v.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{v.icon}</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by League */}
      <section className="container" style={{ padding: '32px 20px 8px' }}>
        <SectionHeading>Shop by League</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
          {LEAGUE_TILES.map(l => (
            <Link key={l.slug} href={`/league/${l.slug}`} className="dhn-prod" style={{
              background: l.color, color: '#fff', padding: '22px 18px', minHeight: 92,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.01em' }}>{l.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>Shop gear ›</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Teams */}
      <section className="container" style={{ padding: '32px 20px 8px' }}>
        <SectionHeading href="/sport/american-football" linkLabel="More teams →">Popular Teams</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
          {popularTeams.map(t => {
            const fg = contrastText(t.primary_color)
            return (
              <Link key={t.slug} href={`/team/${t.slug}`} className="dhn-prod" style={{
                background: t.primary_color, color: fg, padding: 16, minHeight: 88,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                borderLeft: `5px solid ${t.secondary_color}`,
              }}>
                <span style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.2 }}>{t.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.78 }}>Shop gear ›</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Browse Every Sport */}
      <section id="sports" className="container" style={{ padding: '32px 20px 8px' }}>
        <SectionHeading>Browse Every Sport</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
          {SPORT_CARDS.map(s => (
            <Link key={s.slug} href={`/sport/${s.slug}`} className="dhn-card" style={{ fontSize: 14, fontWeight: 700, padding: '15px 18px' }}>
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Coming Up — events */}
      {upcomingEvents.length > 0 && (
        <section className="container" style={{ padding: '32px 20px 8px' }}>
          <SectionHeading href="/events">Coming Up</SectionHeading>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {upcomingEvents.map(ev => (
              <Link key={ev.slug} href={`/events/${ev.slug}`} className="dhn-card" style={{ flex: '0 0 220px', padding: 16 }}>
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
      )}

      {/* Latest articles (only when published) */}
      {latestArticles.length > 0 && (
        <section className="container" style={{ padding: '32px 20px 8px' }}>
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

      {/* College — demoted to one section */}
      <section className="container" style={{ padding: '32px 20px 8px' }}>
        <SectionHeading>College Fan Gear</SectionHeading>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, maxWidth: 640 }}>
          All 130 FBS programs, organized by conference — find your school for hoodies, jerseys, hats and more.
        </p>
        <ConferenceSchoolGrid />
      </section>

      {/* Email signup */}
      <section className="container" style={{ padding: '32px 20px 16px', maxWidth: 720 }}>
        <EmailSignup source="homepage" />
      </section>

      {/* Tight SEO line — no walls of text */}
      <section style={{ maxWidth: 820, margin: '24px auto 64px', padding: '0 20px' }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)' }}>
          DieHardNation is an independent fan-gear hub covering every sport, league and team — the NFL, NBA, MLB and NHL,
          global soccer, college and more. Search live jerseys, hoodies, hats and collectibles from trusted retailers.
          We&apos;re not affiliated with any league, team or the NCAA, and we earn a small affiliate commission at no extra cost to you.
        </p>
      </section>
    </main>
  )
}
