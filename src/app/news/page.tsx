import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest college fan gear news and deals from across the nation.',
}

export default function NewsPage() {
  return (
    <main className="container" style={{ padding: '48px 20px' }}>
      <h1 style={{
        fontSize: 32,
        fontWeight: 900,
        letterSpacing: '-0.02em',
        marginBottom: 8,
      }}>
        LATEST FROM THE NATION
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
        News and deals from across all 130 FBS schools.
      </p>
    </main>
  )
}
