'use client'

import { useState } from 'react'
import Link from 'next/link'
import UniversalSearch from './UniversalSearch'

const SPORTS = [
  { label: 'NFL & Football', href: '/sport/american-football' },
  { label: 'NBA & Basketball', href: '/sport/basketball' },
  { label: 'MLB & Baseball', href: '/sport/baseball' },
  { label: 'NHL & Hockey', href: '/sport/ice-hockey' },
  { label: 'Soccer', href: '/sport/soccer' },
  { label: 'Golf', href: '/sport/golf' },
  { label: 'Tennis', href: '/sport/tennis' },
  { label: 'MMA', href: '/sport/mma' },
]

const PRIMARY = [
  { label: 'Shop', href: '/search' },
  { label: 'Events', href: '/events' },
  { label: 'News', href: '/news' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        style={{
          width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)',
        }}
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <>
          <div onClick={close} style={{ position: 'fixed', inset: '60px 0 0 0', background: 'rgba(0,0,0,0.35)', zIndex: 90 }} />
          <div style={{
            position: 'fixed', top: 60, left: 0, right: 0, background: '#fff',
            borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', zIndex: 95,
            padding: 16, maxHeight: 'calc(100dvh - 60px)', overflowY: 'auto',
          }}>
            <div style={{ marginBottom: 18 }}>
              <UniversalSearch style={{ width: '100%' }} onNavigate={close} />
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {PRIMARY.map(l => (
                <Link key={l.href} href={l.href} onClick={close} style={primaryLink}>{l.label}</Link>
              ))}

              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: '16px 4px 8px' }}>
                Sports
              </div>
              {SPORTS.map(s => (
                <Link key={s.href} href={s.href} onClick={close} style={subLink}>{s.label}</Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  )
}

const primaryLink: React.CSSProperties = {
  fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', textDecoration: 'none',
  padding: '13px 4px', borderBottom: '1px solid var(--border)',
}
const subLink: React.CSSProperties = {
  fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none', padding: '10px 4px',
}
