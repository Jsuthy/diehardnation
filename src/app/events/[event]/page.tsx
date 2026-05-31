import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEvent, getSport, getAllEvents, getArticlesByEvent, getUpcomingEvents } from '@/lib/sports/queries'
import GearCTA from '@/components/affiliate/GearCTA'
import ProductRail from '@/components/affiliate/ProductRail'
import SoccerGarageCTA from '@/components/affiliate/SoccerGarageCTA'
import EmailSignup from '@/components/email/EmailSignup'
import Countdown from '@/components/sports/Countdown'
import PageHero from '@/components/sports/PageHero'
import SectionHeading from '@/components/sports/SectionHeading'
import { sportColor } from '@/lib/sports/color'

export const revalidate = 3600
export const dynamicParams = true

// ALL events are pre-built — this is the surge-capture strategy.
export async function generateStaticParams() {
  const events = await getAllEvents()
  return events.map(e => ({ event: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ event: string }> }): Promise<Metadata> {
  const { event: slug } = await params
  const event = await getEvent(slug)
  if (!event) return {}
  return {
    title: `${event.name} — Fan Gear, News & Coverage | DieHardNation`,
    description: `Everything for ${event.name} fans — gear, jerseys, hoodies and daily coverage. Shop fan apparel and follow the action.`,
    alternates: { canonical: `https://diehardnation.com/events/${slug}` },
  }
}

function formatDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function EventPage({ params }: { params: Promise<{ event: string }> }) {
  const { event: slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  const [sport, articles] = await Promise.all([
    event.sport_slug ? getSport(event.sport_slug) : Promise.resolve(null),
    getArticlesByEvent(slug, 6),
  ])
  const related = event.sport_slug
    ? (await getUpcomingEvents(event.sport_slug, 7)).filter(e => e.slug !== slug).slice(0, 6)
    : []

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'SportsEvent', name: event.name,
        startDate: event.start_date, endDate: event.end_date || event.start_date,
        sport: sport?.name, url: `https://diehardnation.com/events/${slug}`,
      }) }} />

      <PageHero
        title={`${event.name} — Fan Gear & Coverage`}
        baseColor={sportColor(event.sport_slug)}
        eyebrow={event.event_type}
        subtitle={event.start_date ? `Starting ${formatDate(event.start_date)}` : undefined}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Events', href: '/events' },
          ...(sport ? [{ label: sport.name, href: `/sport/${sport.slug}` }] : []),
          { label: event.name },
        ]}
      >
        <Countdown date={event.start_date} />
      </PageHero>

      <div className="container" style={{ padding: '40px 20px 64px' }}>
        <section style={{ marginBottom: 56 }}>
          <ProductRail query={event.name} title={`Shop ${event.name} Gear`} />
          <GearCTA query={`${event.name} gear jersey hoodie`} title={`Browse all ${event.name} gear`} />
          {event.sport_slug === 'soccer' && <SoccerGarageCTA query={`${event.name} jersey`} />}
        </section>

        <section style={{ marginBottom: 56 }}>
          <SectionHeading>About {event.name}</SectionHeading>
          {event.description && <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 16 }}>{event.description}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
            {sport && <div><strong style={{ color: 'var(--text-primary)' }}>Sport:</strong> <Link href={`/sport/${sport.slug}`} style={{ color: 'var(--brand)', textDecoration: 'none' }}>{sport.name}</Link></div>}
            {event.start_date && <div><strong style={{ color: 'var(--text-primary)' }}>Dates:</strong> {formatDate(event.start_date)}{event.end_date ? ` – ${formatDate(event.end_date)}` : ''}</div>}
            <div><strong style={{ color: 'var(--text-primary)' }}>Type:</strong> {event.event_type}</div>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <EmailSignup source="event" sportSlug={event.sport_slug || undefined} variant="dark" />
        </section>

        <section style={{ marginBottom: 56 }}>
          <SectionHeading>{event.name} News &amp; Coverage</SectionHeading>
          {articles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {articles.map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`} className="dhn-card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--text-secondary)' }}>
              Coverage coming soon — check back as {event.name} approaches.
            </div>
          )}
        </section>

        {related.length > 0 && (
          <section>
            <SectionHeading href="/events">Related Events</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
              {related.map(e => (
                <Link key={e.slug} href={`/events/${e.slug}`} className="dhn-card" style={{ padding: 16 }}>
                  <strong style={{ fontSize: 14 }}>{e.name}</strong>
                  {e.start_date && <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>{formatDate(e.start_date)}</span>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
