import Link from 'next/link'
import { Suspense } from 'react'
import SchoolSearch from './SchoolSearch'

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
        {/* Logo */}
        <Link href="/" style={{
          fontWeight: 900,
          fontSize: 20,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          textDecoration: 'none',
        }}>
          DIEHARDNATION
        </Link>

        {/* Center search — desktop only */}
        <Suspense fallback={<div style={{ width: 320 }} />}>
          <SchoolSearch
            style={{ width: 320 }}
            placeholder="Find your school..."
          />
        </Suspense>

        {/* Right nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/trending" style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}>
            Trending
          </Link>
          <Link href="/news" style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}>
            News
          </Link>
        </div>
      </div>
    </nav>
  )
}
