'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PRO_LEAGUE_LIST, proTeamsByLeague } from '@/lib/sports/pro-data'
import { contrastText, darken } from '@/lib/sports/color'

const LEAGUES = PRO_LEAGUE_LIST.filter(l => proTeamsByLeague(l.slug).length > 0)

export default function TeamExplorer() {
  const [active, setActive] = useState(LEAGUES[0]?.slug || 'nfl')
  const teams = proTeamsByLeague(active)
  const league = LEAGUES.find(l => l.slug === active)

  return (
    <div>
      {/* League tabs */}
      <div className="dhn-tabs" role="tablist" style={{ marginBottom: 18 }}>
        {LEAGUES.map(l => (
          <button
            key={l.slug}
            role="tab"
            aria-selected={active === l.slug}
            onClick={() => setActive(l.slug)}
            className={`dhn-tab ${active === l.slug ? 'active' : ''}`}
          >
            {l.short_name || l.name}
          </button>
        ))}
      </div>

      {/* Team tiles — re-mount on tab change so the pop animation replays */}
      <div key={active} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
        {teams.map((t, i) => {
          const fg = contrastText(t.primary_color)
          return (
            <Link
              key={t.slug}
              href={`/team/${t.slug}`}
              className="dhn-tile dhn-pop"
              style={{
                background: `linear-gradient(135deg, ${t.primary_color} 0%, ${darken(t.primary_color, 0.42)} 100%)`,
                color: fg,
                borderBottom: `4px solid ${t.secondary_color}`,
                animationDelay: `${Math.min(i, 18) * 0.025}s`,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 900, lineHeight: 1.15 }}>{t.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.72, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t.city?.split(',')[0] || 'Shop gear'}
              </span>
            </Link>
          )
        })}
      </div>

      {league && (
        <div style={{ marginTop: 16 }}>
          <Link href={`/league/${league.slug}`} style={{ fontSize: 14, fontWeight: 800, color: 'var(--brand)', textDecoration: 'none' }}>
            View all {league.name} gear →
          </Link>
        </div>
      )}
    </div>
  )
}
