import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSport, getTopSports, getLeaguesBySport, getLatestArticles, getUpcomingEvents } from '@/lib/sports/queries'
import GearCTA from '@/components/affiliate/GearCTA'
import ProductRail from '@/components/affiliate/ProductRail'
import SoccerGarageCTA from '@/components/affiliate/SoccerGarageCTA'
import EmailSignup from '@/components/email/EmailSignup'
import PageHero from '@/components/sports/PageHero'
import SectionHeading from '@/components/sports/SectionHeading'
import { sportColor } from '@/lib/sports/color'

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

function fmtDate(d: string | null) {
  return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
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

      <PageHero
        title={`${sport.name} Fan Gear & News`}
        baseColor={sportColor(slug)}
        eyebrow="Sport"
        subtitle={`Gear, news and coverage for ${sport.name} fans worldwide.`}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: sport.name }]}
      />

      <div className="container" style={{ padding: '40px 20px 64px' }}>
        <section style={{ marginBottom: 56 }}>
          <ProductRail query={`${sport.name} fan gear`} title={`Shop ${sport.name} Fan Gear`} />
          <GearCTA query={`${sport.name} fan gear`} title={`Browse all ${sport.name} gear`} />
          {slug === 'soccer' && <SoccerGarageCTA query="soccer jersey" />}
        </section>

        {leagues.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <SectionHeading>{sport.name} Leagues &amp; Competitions</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
              {leagues.map(l => (
                <Link key={l.slug} href={`/league/${l.slug}`} className="dhn-card" style={{ padding: '14px 16px' }}>
                  <strong style={{ fontSize: 14 }}>{l.name}</strong>
                  {l.country && <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>{l.country}</span>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {events.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <SectionHeading href="/events">Upcoming {sport.name} Events</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
              {events.map(ev => (
                <Link key={ev.slug} href={`/events/${ev.slug}`} className="dhn-card" style={{ padding: 16 }}>
                  <strong style={{ fontSize: 14 }}>{ev.name}</strong>
                  {ev.start_date && <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>{fmtDate(ev.start_date)}</span>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <SectionHeading href="/news">Latest {sport.name} News</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {articles.slice(0, 3).map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`} className="dhn-card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <EmailSignup source="article" sportSlug={slug} />
      </div>
    </main>
  )
}
