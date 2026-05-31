import type { Metadata } from 'next'
import Link from 'next/link'
import { searchEbayPaged, type EbaySort } from '@/lib/ebay/search'
import ProductSearchBar from '@/components/search/ProductSearchBar'
import SearchResults from '@/components/search/SearchResults'

const SORTS = new Set(['best', 'price', '-price', 'newlyListed', 'endingSoonest'])

const POPULAR = [
  'Chiefs jersey', 'Cowboys hoodie', 'Lakers jersey', 'Yankees hat',
  'World Cup 2026', 'Bruins jersey', 'Eagles gear', 'Celtics shirt',
]

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams
  if (!q) {
    return {
      title: 'Search Fan Gear — Jerseys, Hoodies & More | DieHardNation',
      description: 'Search live fan gear listings across every team and sport — jerseys, hoodies, hats and collectibles from eBay.',
    }
  }
  return {
    title: `${q} — Shop Fan Gear | DieHardNation`,
    description: `Shop ${q} — live jerseys, hoodies, hats and fan gear listings, sorted and updated continuously.`,
    alternates: { canonical: `https://diehardnation.com/search?q=${encodeURIComponent(q)}` },
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string }> }) {
  const { q = '', sort: sortParam = 'best' } = await searchParams
  const sort = (SORTS.has(sortParam) ? sortParam : 'best') as EbaySort
  const query = q.trim()

  const result = query ? await searchEbayPaged(query, { limit: 48, sort }) : { products: [], total: 0 }

  return (
    <main className="container" style={{ padding: '32px 20px 64px' }}>
      <h1 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
        {query ? `Shop “${query}”` : 'Search Fan Gear'}
      </h1>

      <ProductSearchBar initialQuery={query} sort={sort} />

      {query ? (
        <SearchResults query={query} sort={sort} initial={result.products} total={result.total} />
      ) : (
        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14 }}>
            Search live listings across every team and sport — or try one of these:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {POPULAR.map(p => (
              <Link key={p} href={`/search?q=${encodeURIComponent(p)}`} style={{
                fontSize: 13, fontWeight: 600, padding: '8px 14px', border: '1px solid var(--border)',
                borderRadius: 20, textDecoration: 'none', color: 'var(--text-secondary)', background: '#fff',
              }}>
                {p}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
