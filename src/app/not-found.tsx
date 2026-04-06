import Link from 'next/link'
import { Suspense } from 'react'
import SchoolSearch from '@/components/layout/SchoolSearch'

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h1 style={{
        fontSize: 'clamp(48px, 8vw, 96px)',
        fontWeight: 900,
        letterSpacing: '-0.04em',
        color: 'var(--text-primary)',
        lineHeight: 1,
      }}>
        404
      </h1>
      <p style={{
        fontSize: 18,
        color: 'var(--text-secondary)',
        marginTop: 12,
        marginBottom: 32,
      }}>
        Page not found. Let&apos;s find your school instead.
      </p>
      <Suspense fallback={<div style={{ height: 52, maxWidth: 400, margin: '0 auto' }} />}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <SchoolSearch
            placeholder="Search for your school..."
            inputStyle={{
              width: '100%',
              height: 52,
              border: '2px solid var(--text-primary)',
              borderRadius: 4,
              padding: '0 20px',
              fontSize: 16,
            }}
          />
        </div>
      </Suspense>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          marginTop: 24,
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--brand)',
          textDecoration: 'none',
        }}
      >
        &larr; Back to DieHardNation
      </Link>
    </main>
  )
}
