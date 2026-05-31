import { searchEbayProducts } from '@/lib/ebay/search'

interface Props {
  query: string
  title?: string
  limit?: number
}

// Async server component — fetches live eBay products, cached by the page's ISR.
// Renders nothing if eBay returns no results (the GearCTA fallback covers that).
export default async function ProductRail({ query, title, limit = 12 }: Props) {
  const products = await searchEbayProducts(query, limit)
  if (!products.length) return null

  return (
    <section style={{ margin: '8px 0 24px' }}>
      {title && (
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>{title}</h2>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
        {products.map(p => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="nofollow sponsored noopener"
            style={{
              display: 'flex', flexDirection: 'column', background: '#fff',
              border: '1px solid var(--border,#E8E8E8)', borderRadius: 'var(--radius-md,8px)',
              overflow: 'hidden', textDecoration: 'none', color: 'inherit',
            }}
          >
            <div style={{ aspectRatio: '1 / 1', background: '#F5F5F5', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={p.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, lineHeight: 1.35,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
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
