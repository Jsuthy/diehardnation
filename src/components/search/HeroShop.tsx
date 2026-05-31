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

export default function HeroShop({ showcase = [] }: { showcase?: EbayProduct[] }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [products, setProducts] = useState<EbayProduct[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Debounced live search — fires ~400ms after typing stops (cost control).
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
  const half = Math.ceil(showcase.length / 2)
  const rowA = showcase.slice(0, half)
  const rowB = showcase.slice(half)

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', background: 'radial-gradient(120% 100% at 0% 0%, #1C2C4E 0%, #0C1428 60%)', color: '#fff', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '40px 20px 24px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-mark.png"
            alt="DieHardNation"
            style={{ height: 'clamp(78px, 11vw, 120px)', width: 'auto', display: 'block', marginBottom: 18, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.4))' }}
          />
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1 }}>
            Shop Fan Gear for <span style={{ color: '#86A8D6' }}>Every Team</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2.2vw, 20px)', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginTop: 12, marginBottom: 22, maxWidth: 640 }}>
            One search bar. Every team, league and sport. Start typing.
          </p>

          <div style={{ display: 'flex', gap: 10, maxWidth: 720 }}>
            <input
              className="dhn-hero-input"
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') seeAll() }}
              placeholder="Try “Lakers hoodie”, “Chiefs jersey”, “World Cup”…"
              autoComplete="off"
              style={{ flex: 1, height: 56, padding: '0 20px', fontSize: 17, borderRadius: 12, border: 'none', outline: 'none', background: '#fff', color: '#0A0A0A' }}
            />
            <button onClick={seeAll} aria-label="Search" style={{ height: 56, padding: '0 26px', fontSize: 16, fontWeight: 800, color: '#fff', background: 'var(--brand)', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
              Search
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {!hasQuery
              ? POPULAR.map(p => <button key={p} onClick={() => setQ(p)} style={chipDark}>{p}</button>)
              : REFINE.map(r => <button key={r} onClick={() => refine(r)} style={chipDark}>+ {r}</button>)}
          </div>
        </div>

        {/* Live merch wall — two rows scrolling opposite directions */}
        {!hasQuery && showcase.length >= 6 && (
          <div style={{ position: 'relative', zIndex: 2, padding: '10px 0 30px' }}>
            <div className="dhn-marquee" style={{ marginBottom: 14 }}>
              <div className="dhn-mq-track a">
                {[...rowA, ...rowA].map((p, i) => (
                  <a key={`a${i}`} href={p.url} target="_blank" rel="nofollow sponsored noopener" className="dhn-mq-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt={p.title} loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
            <div className="dhn-marquee">
              <div className="dhn-mq-track b">
                {[...rowB, ...rowB].map((p, i) => (
                  <a key={`b${i}`} href={p.url} target="_blank" rel="nofollow sponsored noopener" className="dhn-mq-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt={p.title} loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 6, background: 'var(--brand)', position: 'relative', zIndex: 2 }} />
      </section>

      {/* Live search results */}
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
              <button onClick={seeAll} style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer' }}>See all →</button>
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
                      <span style={{ position: 'absolute', left: 8, bottom: 8, background: 'rgba(0,0,0,0.82)', color: '#fff', fontSize: 13, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>${p.price.toFixed(2)}</span>
                    </div>
                    <div style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</div>
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
