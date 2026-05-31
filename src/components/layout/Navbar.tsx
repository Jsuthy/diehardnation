import Link from 'next/link'
import { Suspense } from 'react'
import UniversalSearch from './UniversalSearch'
import SportsMenu from './SportsMenu'

export default function Navbar() {
  return (
    <nav style={{
      height: 60,
      background: '#FFFFFF',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
      }}>
        <Link href="/" aria-label="DieHardNation home" style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="DieHardNation" style={{ height: 46, width: 'auto', display: 'block' }} />
        </Link>

        <Suspense fallback={<div style={{ width: 320 }} />}>
          <UniversalSearch style={{ width: 320 }} />
        </Suspense>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/search" style={navLinkStyle}>Shop</Link>
          <SportsMenu />
          <Link href="/events" style={navLinkStyle}>Events</Link>
          <Link href="/news" style={navLinkStyle}>News</Link>
        </div>
      </div>
    </nav>
  )
}

const navLinkStyle = {
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textDecoration: 'none',
} as const
