// Server-rendered product grid for moment pages. Unlike the client ProductRail,
// this puts the products (and their affiliate links) directly in the HTML, which
// matters for AI/answer-engine crawlers and the ItemList schema.

import type { EbayProduct } from '@/lib/ebay/search'

export default function MomentProductGrid({ products }: { products: EbayProduct[] }) {
  if (!products.length) return null
  return (
    <section className="container" aria-label="Trending fan gear" style={{ padding: '8px 20px 16px' }}>
      <div
        className="moment-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
      >
        <style>{`
          @media (max-width: 1024px) { .moment-grid { grid-template-columns: repeat(3, 1fr) !important; } }
          @media (max-width: 640px) { .moment-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        `}</style>
        {products.map(p => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              display: 'block',
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F0F0F0' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={p.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.75)',
                color: 'white', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', padding: '3px 7px', borderRadius: 3,
              }}>
                eBay
              </span>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{
                fontSize: 13, lineHeight: 1.4, display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {p.title}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, marginTop: 6 }}>
                ${p.price.toFixed(2)}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
