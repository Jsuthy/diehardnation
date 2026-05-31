'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface EbayProduct {
  id: string
  title: string
  price: number
  imageUrl: string
  url: string
}

const POPULAR = ['Lakers', 'Chiefs', 'Cowboys', 'Yankees', 'Celtics', 'Real Madrid', 'World Cup 2026']
const REFINE = ['Jersey', 'Hoodie', 'Hat', 'Shirt', 'Jacket']

export default function HeroShop() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [products, setProducts] = useState<EbayProduct[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Debounced live search — only fires ~400ms after typing stops (cost control).
  useEffect(() => {
    const query = q.trim()
    if (timer.current) clearTimeout(timer.current)
    if (query.length < 2) { setProducts([]); setTotal(0); setLoading(false); return }
    setLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/ebay/search?q=${encodeURIComponent(query)}&limit=18`)
        const d = await res.json()
        setProducts(d.products || [])
        setTotal(d.total || 0)
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [q])

  function refine(word: string) {
    setQ(prev => {
      const base = prev.trim()
      return base.toLowerCase().includes(word.toLowerCase()) ? base : `${base} ${word}`.trim()
    })
  }

  function seeAll() {
    if (q.trim().length >= 2) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const hasQuery = q.trim().length >= 2

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #0A0A0A 0%, #1A0606 100%)', color: '#fff' }}>
        <div className="container" style={{ padding: '64px 20px 40px' }}>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 76px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95 }}>
            Shop Fan Gear for <span style={{ color: 'var(--brand)' }}>Every Team</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2.4vw, 22px)', fontWeight: 600, color: 'rgba(255,255,255,0.72)', marginTop: 14, marginBottom: 24, maxWidth: 680 }}>
            Search live jerseys, hoodies and hats across every sport — start typing.
          </p>

          <div style={{ display: 'flex', gap: 10, maxWidth: 720 }}>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') seeAll() }}
              placeholder="Try “Lakers hoodie”, “Chiefs jersey”, “World Cup”…"
              autoComplete="off"
              style={{ flex: 1, height: 56, padding: '0 20px', fontSize: 17, borderRadius: 10, border: 'none', outline: 'none', background: '#fff', color: '#0A0A0A' }}
            />
            <button onClick={seeAll} style={{ height: 56, padding: '0 28px', fontSize: 16, fontWeight: 800, color: '#fff', background: 'var(--brand,#CC0000)', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
              Search
            </button>
          </div>

          {/* Quick chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {!hasQuery
              ? POPULAR.map(p => (
                  <button key={p} onClick={() => setQ(p)} style={chipDark}>{p}</button>
                ))
              : REFINE.map(r => (
                  <button key={r} onClick={() => refine(r)} style={chipDark}>+ {r}</button>
                ))}
          </div>
        </div>
        <div style={{ height: 6, background: 'var(--brand)' }} />
      </section>

      {/* Live results */}
      {hasQuery && (
        <section className="container" aria-label="Search results" style={{ padding: '24px 20px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>
              {loading && products.length === 0
                ? `Searching “${q.trim()}”…`
                : total > 0
                  ? <>{total.toLocaleString()} results for “{q.trim()}”</>
                  : `No results for “${q.trim()}”`}
            </h2>
            {total > 0 && (
              <button onClick={seeAll} style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer' }}>
                See all →
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
            {products.length === 0 && loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ aspectRatio: '1 / 1', background: '#F0F0F0' }} />
                    <div style={{ height: 30 }} />
                  </div>
                ))
              : products.map(p => (
                  <a key={p.id} href={p.url} target="_blank" rel="nofollow sponsored noopener" className="dhn-prod">
                    <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#F5F5F5', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <span style={{ position: 'absolute', left: 8, bottom: 8, background: 'rgba(0,0,0,0.82)', color: '#fff', fontSize: 13, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                        ${p.price.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.title}
                    </div>
                  </a>
                ))}
          </div>

          {total > products.length && products.length > 0 && (
            <div style={{ textAlign: 'center', margin: '20px 0 4px' }}>
              <Link href={`/search?q=${encodeURIComponent(q.trim())}`} style={{ fontSize: 14, fontWeight: 800, color: 'var(--brand)', textDecoration: 'none' }}>
                See all {total.toLocaleString()} results →
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  )
}

const chipDark: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.14)',
  border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer',
}
