'use client'

import { useEffect, useState } from 'react'

interface EbayProduct {
  id: string
  title: string
  price: number
  currency: string
  imageUrl: string
  url: string
}

interface Props {
  query: string
  title?: string
  limit?: number
}

// Client-side product grid — fetches the cached /api/ebay/search route so
// products load reliably at runtime regardless of build state.
export default function ProductRail({ query, title, limit = 12 }: Props) {
  const [products, setProducts] = useState<EbayProduct[] | null>(null)

  useEffect(() => {
    let active = true
    setProducts(null)
    fetch(`/api/ebay/search?q=${encodeURIComponent(query)}&limit=${limit}`)
      .then(r => r.json())
      .then(d => { if (active) setProducts(d.products || []) })
      .catch(() => { if (active) setProducts([]) })
    return () => { active = false }
  }, [query, limit])

  // Hide the whole section once we know there are no products.
  if (products && products.length === 0) return null

  return (
    <section style={{ margin: '8px 0 24px' }}>
      {title && (
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>{title}</h2>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
        {products === null
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ border: '1px solid var(--border,#E8E8E8)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ aspectRatio: '1 / 1', background: '#F0F0F0' }} />
                <div style={{ padding: 12 }}>
                  <div style={{ height: 12, background: '#EEE', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 16, width: 60, background: '#EEE', borderRadius: 4 }} />
                </div>
              </div>
            ))
          : products.map(p => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="dhn-prod"
              >
                <div style={{ aspectRatio: '1 / 1', background: '#F5F5F5', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.title}
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 16, fontWeight: 800 }}>${p.price.toFixed(2)}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#E43137' }}>eBay →</span>
                  </div>
                </div>
              </a>
            ))}
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted,#999)', marginTop: 12 }}>
        Live listings from eBay. Affiliate links — we earn a commission at no cost to you.
      </p>
    </section>
  )
}
