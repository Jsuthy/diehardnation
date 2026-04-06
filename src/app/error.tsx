'use client'

import Link from 'next/link'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h1 style={{
        fontSize: 32,
        fontWeight: 900,
        letterSpacing: '-0.02em',
        marginBottom: 8,
      }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24 }}>
        An unexpected error occurred. Please try again.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
            background: 'var(--brand)',
            color: 'white',
            fontWeight: 700,
            fontSize: 14,
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
        <Link
          href="/"
          style={{
            padding: '10px 24px',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            textDecoration: 'none',
          }}
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}
