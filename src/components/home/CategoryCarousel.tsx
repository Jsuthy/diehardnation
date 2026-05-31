'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface EbayProduct { id: string; title: string; price: number; imageUrl: string; url: string }

const TABS = [
  { label: 'Throwbacks', q: 'throwback jersey' },
  { label: 'Jerseys', q: 'team jersey stitched' },
  { label: 'Hoodies', q: 'team hoodie' },
  { label: 'Hats', q: 'fitted hat team' },
  { label: 'Vintage', q: 'vintage sports' },
]

export default function CategoryCarousel() {
  const [active, setActive] = useState(0)
  const [cache, setCache] = useState<Record<number, EbayProduct[]>>({})
  const [loading, setLoading] = useState(false)
  const products = cache[active]

  useEffect(() => {
    if (cache[active]) return
    let on = true
    setLoading(true)
    fetch(`/api/ebay/search?q=${encodeURIComponent(TABS[active].q)}&limit=12&mode=rail`)
      .then(r => r.json())
      .then(d => { if (on) setCache(c => ({ ...c, [active]: d.products || [] })) })
      .catch(() => { if (on) setCache(c => ({ ...c, [active]: [] })) })
      .finally(() => { if (on) setLoading(false) })
    return () => { on = false }
  }, [active, cache])

  return (
    <div>
      <div className="dhn-tabs" style={{ marginBottom: 16 }}>
        {TABS.map((t, i) => (
          <button key={t.label} onClick={() => setActive(i)} className={`dhn-tab ${active === i ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="dhn-hscroll">
        {!products && loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ flex: '0 0 180px' }}>
                <div style={{ aspectRatio: '1 / 1', background: '#F0F0F0', borderRadius: 10 }} />
              </div>
            ))
          : (products || []).map(p => (
              <a key={p.id} href={p.url} target="_blank" rel="nofollow sponsored noopener" className="dhn-prod" style={{ flex: '0 0 180px' }}>
                <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#F5F5F5', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', left: 8, bottom: 8, background: 'rgba(0,0,0,0.82)', color: '#fff', fontSize: 13, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>${p.price.toFixed(2)}</span>
                </div>
                <div style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</div>
              </a>
            ))}
        {products && products.length === 0 && !loading && (
          <p style={{ padding: '24px 4px', color: 'var(--text-muted)', fontSize: 14 }}>No listings right now — try the search.</p>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <Link href={`/search?q=${encodeURIComponent(TABS[active].q)}`} style={{ fontSize: 14, fontWeight: 800, color: 'var(--brand)', textDecoration: 'none' }}>
          Shop all {TABS[active].label.toLowerCase()} →
        </Link>
      </div>
    </div>
  )
}
