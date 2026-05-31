import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSport, getTopSports, getLeaguesBySport, getLatestArticles, getUpcomingEvents } from '@/lib/sports/queries'
import GearCTA from '@/components/affiliate/GearCTA'
import ProductRail from '@/components/affiliate/ProductRail'
import EmailSignup from '@/components/email/EmailSignup'

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  const sports = await getTopSports(20)
  return sports.map(s => ({ sport: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ sport: string }> }): Promise<Metadata> {
  const { sport: slug } = await params
  const sport = await getSport(slug)
  if (!sport) return {}
  return {
    title: `${sport.name} Fan Gear & News — DieHardNation`,
    description: `Shop ${sport.name} fan gear and read the latest news. Jerseys, hoodies, shirts and accessories for fans worldwide. Updated daily.`,
    alternates: { canonical: `https://diehardnation.com/sport/${slug}` },
  }
}

export default async function SportPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport: slug } = await params
  const sport = await getSport(slug)
  if (!sport) notFound()

  const [leagues, articles, events] = await Promise.all([
    getLeaguesBySport(slug, 30),
    getLatestArticles(5, slug),
    getUpcomingEvents(slug, 6),
  ])

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'SportsOrganization', name: sport.name,
        url: `https://diehardnation.com/sport/${slug}`,
      }) }} />

      <section style={{ background: 'var(--brand,#CC0000)', color: '#fff', padding: '56px 20px' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(34px,6vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {sport.name} Fan Gear &amp; News
          </h1>
          <p style={{ fontSize: 18, marginTop: 12, opacity: 0.9 }}>
            Gear, news and coverage for {sport.name} fans worldwide.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '40px 20px 64px' }}>
        {leagues.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>{sport.name} Leagues &amp; Competitions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
              {leagues.map(l => (
                <Link key={l.slug} href={`/league/${l.slug}`} style={cardStyle}>
                  <strong style={{ fontSize: 14 }}>{l.name}</strong>
                  {l.country && <span style={{ fontSize: 12, color: 'var(--text-muted,#999)', display: 'block' }}>{l.country}</span>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Latest {sport.name} News</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {articles.slice(0, 3).map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`} style={{ ...cardStyle, padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary,#555)', lineHeight: 1.5 }}>{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {events.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Upcoming {sport.name} Events</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
              {events.map(ev => (
                <Link key={ev.slug} href={`/events/${ev.slug}`} style={cardStyle}>
                  <strong style={{ fontSize: 14 }}>{ev.name}</strong>
                  {ev.start_date && <span style={{ fontSize: 12, color: 'var(--text-muted,#999)', display: 'block' }}>{new Date(ev.start_date).toLocaleDateString()}</span>}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 48 }}>
          <ProductRail query={`${sport.name} fan gear`} title={`Shop ${sport.name} Fan Gear`} />
          <GearCTA query={`${sport.name} fan gear`} title={`Browse all ${sport.name} gear`} />
        </section>

        <EmailSignup source="article" sportSlug={slug} />
      </div>
    </main>
  )
}

const cardStyle = {
  display: 'block',
  background: '#fff',
  border: '1px solid var(--border,#E8E8E8)',
  borderRadius: 'var(--radius-md,8px)',
  padding: '14px 16px',
  textDecoration: 'none',
  color: 'inherit',
} as const
