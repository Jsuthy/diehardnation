import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEvent, getSport, getAllEvents, getArticlesByEvent, getUpcomingEvents } from '@/lib/sports/queries'
import GearCTA from '@/components/affiliate/GearCTA'
import EmailSignup from '@/components/email/EmailSignup'
import Countdown from '@/components/sports/Countdown'

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

      <section style={{ background: 'var(--brand,#CC0000)', color: '#fff', padding: '56px 20px' }}>
        <div className="container">
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20 }}>
            {event.event_type}
          </span>
          <h1 style={{ fontSize: 'clamp(34px,6vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 14 }}>
            {event.name} — Fan Gear &amp; Coverage
          </h1>
          {event.start_date && <p style={{ fontSize: 16, marginTop: 12, opacity: 0.9 }}>Starting {formatDate(event.start_date)}</p>}
          <Countdown date={event.start_date} />
        </div>
      </section>

      <div className="container" style={{ padding: '40px 20px 64px' }}>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>About {event.name}</h2>
          {event.description && <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-secondary,#555)', marginBottom: 16 }}>{event.description}</p>}
          <ul style={{ fontSize: 14, color: 'var(--text-secondary,#555)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}>
            {sport && <li><strong>Sport:</strong> <Link href={`/sport/${sport.slug}`} style={{ color: 'var(--brand,#CC0000)' }}>{sport.name}</Link></li>}
            {event.start_date && <li><strong>Dates:</strong> {formatDate(event.start_date)}{event.end_date ? ` – ${formatDate(event.end_date)}` : ''}</li>}
          </ul>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Shop {event.name} Gear</h2>
          <GearCTA query={`${event.name} gear jersey hoodie`} />
        </section>

        <section style={{ marginBottom: 48 }}>
          <EmailSignup source="event" sportSlug={event.sport_slug || undefined} variant="dark" />
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>{event.name} News &amp; Coverage</h2>
          {articles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {articles.map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`} style={{ ...cardStyle, padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary,#555)', lineHeight: 1.5 }}>{a.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted,#999)' }}>Coverage coming soon — check back as {event.name} approaches.</p>
          )}
        </section>

        {related.length > 0 && (
          <section>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Related Events</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
              {related.map(e => (
                <Link key={e.slug} href={`/events/${e.slug}`} style={cardStyle}>
                  <strong style={{ fontSize: 14 }}>{e.name}</strong>
                  {e.start_date && <span style={{ fontSize: 12, color: 'var(--text-muted,#999)', display: 'block' }}>{formatDate(e.start_date)}</span>}
                </Link>
              ))}
            </div>
          </section>
        )}
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
