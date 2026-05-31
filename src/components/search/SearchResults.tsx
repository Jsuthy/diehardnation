'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface EbayProduct {
  id: string
  title: string
  price: number
  currency: string
  imageUrl: string
  url: string
  condition?: string
}

interface Props {
  query: string
  sort: string
  initial: EbayProduct[]
  total: number
}

const SORT_OPTIONS = [
  { value: 'best', label: 'Best Match' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'newlyListed', label: 'Newly Listed' },
  { value: 'endingSoonest', label: 'Ending Soonest' },
]

const PAGE = 48

export default function SearchResults({ query, sort, initial, total }: Props) {
  const router = useRouter()
  const [products, setProducts] = useState<EbayProduct[]>(initial)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(initial.length >= total)
  const seen = useRef(new Set(initial.map(p => p.id)))

  // Reset when the query/sort (i.e. server-provided initial set) changes.
  useEffect(() => {
    setProducts(initial)
    setDone(initial.length >= total)
    seen.current = new Set(initial.map(p => p.id))
  }, [initial, total])

  async function loadMore() {
    if (loading || done) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ q: query, offset: String(products.length), limit: String(PAGE) })
      if (sort && sort !== 'best') params.set('sort', sort)
      const res = await fetch(`/api/ebay/search?${params.toString()}`)
      const data = await res.json()
      const fresh: EbayProduct[] = (data.products || []).filter((p: EbayProduct) => !seen.current.has(p.id))
      fresh.forEach(p => seen.current.add(p.id))
      setProducts(prev => [...prev, ...fresh])
      if (!fresh.length || products.length + fresh.length >= total) setDone(true)
    } catch {
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  function changeSort(value: string) {
    const params = new URLSearchParams({ q: query })
    if (value !== 'best') params.set('sort', value)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, margin: '20px 0 18px' }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>{total.toLocaleString()}</strong> results for{' '}
          <strong style={{ color: 'var(--text-primary)' }}>“{query}”</strong>
        </p>
        <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          Sort:
          <select
            value={sort}
            onChange={e => changeSort(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-strong)', fontSize: 13, fontWeight: 600 }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
        {products.map(p => (
          <a key={p.id} href={p.url} target="_blank" rel="nofollow sponsored noopener" className="dhn-prod">
            <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#F5F5F5', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageUrl} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <span style={{
                position: 'absolute', left: 8, bottom: 8, background: 'rgba(0,0,0,0.82)', color: '#fff',
                fontSize: 14, fontWeight: 800, padding: '4px 9px', borderRadius: 6,
              }}>
                ${p.price.toFixed(2)}
              </span>
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {p.title}
              </div>
              <span style={{ marginTop: 'auto', fontSize: 10, fontWeight: 700, color: '#E43137' }}>eBay →</span>
            </div>
          </a>
        ))}
      </div>

      {products.length === 0 && (
        <p style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          No listings found. Try a different search.
        </p>
      )}

      {!done && products.length > 0 && (
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <button onClick={loadMore} disabled={loading} style={{
            padding: '14px 32px', fontSize: 15, fontWeight: 800, borderRadius: 8, cursor: 'pointer',
            background: loading ? 'var(--surface)' : 'var(--text-primary)', color: loading ? 'var(--text-muted)' : '#fff', border: 'none',
          }}>
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 24 }}>
        Live listings from eBay. Affiliate links — DieHardNation earns a commission at no cost to you.
      </p>
    </div>
  )
}
