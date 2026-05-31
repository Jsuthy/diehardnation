import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllEvents } from '@/lib/sports/queries'
import { SEED_EVENTS } from '@/lib/sports/events-seed'

export const metadata: Metadata = {
  title: 'Upcoming Sports Events — Fan Gear & Coverage | DieHardNation',
  description: 'Every major sports event — World Cup, Super Bowl, March Madness, Wimbledon, F1 and more. Shop fan gear and follow the coverage.',
  alternates: { canonical: 'https://diehardnation.com/events' },
}

export const revalidate = 3600

export default async function EventsIndexPage() {
  let events = await getAllEvents()
  // Fall back to the static seed list if the DB has not been populated yet so
  // the surge-capture pages are always discoverable.
  if (!events.length) {
    events = SEED_EVENTS.map(e => ({
      id: e.slug, slug: e.slug, name: e.name, sport_slug: e.sport_slug, league_slug: null,
      event_type: e.event_type, start_date: e.start_date, end_date: e.end_date ?? null,
      year: Number(e.start_date.slice(0, 4)), description: e.description ?? null,
      search_surge_rank: e.search_surge_rank, is_active: true, is_recurring: true,
    }))
  }
  const sorted = [...events].sort((a, b) => (a.start_date || '').localeCompare(b.start_date || ''))

  return (
    <main className="container" style={{ padding: '48px 20px 64px' }}>
      <h1 style={{ fontSize: 'clamp(32px,6vw,56px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>
        Upcoming Events
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary,#555)', marginBottom: 32 }}>
        Fan gear and coverage for every major sporting event, sorted by date.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {sorted.map(e => (
          <Link key={e.slug} href={`/events/${e.slug}`} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid var(--border,#E8E8E8)', borderRadius: 'var(--radius-md,8px)', padding: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand,#CC0000)' }}>{e.event_type}</span>
            <h2 style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.3, margin: '6px 0' }}>{e.name}</h2>
            {e.start_date && (
              <time style={{ fontSize: 13, color: 'var(--text-muted,#999)' }}>
                {new Date(e.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}
