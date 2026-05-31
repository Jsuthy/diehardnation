import Link from 'next/link'
import { Suspense } from 'react'
import UniversalSearch from './UniversalSearch'
import SportsMenu from './SportsMenu'
import MobileMenu from './MobileMenu'

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
        gap: 12,
      }}>
        <Link href="/" aria-label="DieHardNation home" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="DieHardNation" style={{ height: 44, width: 'auto', display: 'block' }} />
        </Link>

        {/* Desktop */}
        <div className="nav-desktop-only">
          <Suspense fallback={<div style={{ flex: 1 }} />}>
            <UniversalSearch style={{ flex: 1, maxWidth: 420 }} />
          </Suspense>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
            <Link href="/search" style={navLinkStyle}>Shop</Link>
            <SportsMenu />
            <Link href="/events" style={navLinkStyle}>Events</Link>
            <Link href="/news" style={navLinkStyle}>News</Link>
          </div>
        </div>

        {/* Mobile */}
        <div className="nav-mobile-only">
          <MobileMenu />
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
