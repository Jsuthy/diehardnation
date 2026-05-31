'use client'

import Link from 'next/link'
import { useState } from 'react'

const US_SPORTS = [
  { label: 'NFL', href: '/league/nfl' },
  { label: 'NBA', href: '/league/nba' },
  { label: 'MLB', href: '/league/mlb' },
  { label: 'NHL', href: '/league/nhl' },
  { label: 'College Football', href: '/sport/american-football' },
  { label: 'College Basketball', href: '/sport/basketball' },
  { label: 'MMA', href: '/sport/mma' },
  { label: 'Golf', href: '/sport/golf' },
  { label: 'Tennis', href: '/sport/tennis' },
]

const GLOBAL_SPORTS = [
  { label: 'Soccer / Football', href: '/sport/soccer' },
  { label: 'Cricket', href: '/sport/cricket' },
  { label: 'Rugby', href: '/sport/rugby' },
  { label: 'Formula 1', href: '/sport/motorsport' },
  { label: 'Cycling', href: '/sport/cycling' },
  { label: 'Olympics', href: '/sport/multi-sport' },
]

export default function SportsMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        Sports ▾
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8,
          background: '#fff', border: '1px solid var(--border,#E8E8E8)', borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: 20, display: 'flex', gap: 32, zIndex: 200,
        }}>
          <div>
            <div style={colHeader}>US Sports</div>
            {US_SPORTS.map(s => <Link key={s.label} href={s.href} style={itemStyle}>{s.label}</Link>)}
          </div>
          <div>
            <div style={colHeader}>Global</div>
            {GLOBAL_SPORTS.map(s => <Link key={s.label} href={s.href} style={itemStyle}>{s.label}</Link>)}
            <Link href="/sport/soccer" style={{ ...itemStyle, color: 'var(--brand,#CC0000)', fontWeight: 700, marginTop: 8 }}>All Sports →</Link>
          </div>
        </div>
      )}
    </div>
  )
}

const colHeader = {
  fontSize: 11, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.06em',
  color: 'var(--text-muted,#999)', marginBottom: 8, whiteSpace: 'nowrap' as const,
}
const itemStyle = {
  display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary,#555)',
  textDecoration: 'none', padding: '5px 0', whiteSpace: 'nowrap' as const,
}
