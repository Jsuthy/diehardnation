import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trending Gear',
  description: 'The most popular college fan gear across all 130 FBS schools.',
}

export default function TrendingPage() {
  return (
    <main className="container" style={{ padding: '48px 20px' }}>
      <h1 style={{
        fontSize: 32,
        fontWeight: 900,
        letterSpacing: '-0.02em',
        marginBottom: 8,
      }}>
        TRENDING GEAR
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
        The most popular fan gear across all 130 FBS schools.
      </p>
    </main>
  )
}
