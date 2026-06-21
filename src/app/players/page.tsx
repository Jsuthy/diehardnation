import type { Metadata } from 'next'
import Link from 'next/link'
import { PLAYERS } from '@/lib/sports/players'
import { PRO_LEAGUE_LIST } from '@/lib/sports/pro-data'

export const metadata: Metadata = {
  title: 'Player Jerseys & Fan Gear — Shop by Athlete',
  description: 'Shop jerseys and fan gear by player — Mahomes, LeBron, Ohtani, Messi and more. Live listings from eBay, updated daily.',
  alternates: { canonical: 'https://diehardnation.com/players' },
}

export const revalidate = 86400

const LEAGUE_NAME = new Map(PRO_LEAGUE_LIST.map(l => [l.slug, l.name]))

export default function PlayersIndex() {
  // Group players by league for a scannable, well-linked index.
  const byLeague = new Map<string, typeof PLAYERS>()
  for (const p of PLAYERS) {
    const arr = byLeague.get(p.league_slug) ?? []
    arr.push(p)
    byLeague.set(p.league_slug, arr)
  }

  return (
    <main className="container" style={{ padding: '48px 20px 64px' }}>
      <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>
        SHOP BY PLAYER
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 720 }}>
        Jerseys and fan gear for the biggest names in sports — home, away and throwback kits from eBay,
        updated daily. Pick a player to see live listings.
      </p>

      {[...byLeague.entries()].map(([leagueSlug, players]) => (
        <section key={leagueSlug} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 12 }}>
            {LEAGUE_NAME.get(leagueSlug) ?? leagueSlug.toUpperCase()}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {players.map(p => (
              <Link
                key={p.slug}
                href={`/player/${p.slug}`}
                style={{
                  fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 20,
                  border: '1px solid var(--border)', color: 'var(--text-secondary)',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                }}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
