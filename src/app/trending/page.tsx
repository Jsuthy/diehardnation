import type { Metadata } from 'next'
import { getTrendingProducts } from '@/lib/supabase/queries'
import { getSchoolBySlug } from '@/lib/constants/schools'

export const metadata: Metadata = {
  title: 'Trending College Fan Gear \u2014 Most Popular Right Now',
  description: 'The most-clicked college fan gear across all 130 FBS schools. Nebraska, Alabama, Michigan, Ohio State and more.',
}

export const revalidate = 600

export default async function TrendingPage() {
  const products = await getTrendingProducts(48)

  return (
    <main className="container" style={{ padding: '48px 20px 64px' }}>
      <h1 style={{
        fontSize: 'clamp(32px, 6vw, 56px)',
        fontWeight: 900,
        letterSpacing: '-0.03em',
        marginBottom: 8,
      }}>
        TRENDING GEAR
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
        The most-clicked college fan gear across all schools right now.
      </p>

      {products.length > 0 ? (
        <div>
          {/* School badges above cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}>
            <style>{`
              @media (max-width: 1024px) { .trending-grid { grid-template-columns: repeat(3, 1fr) !important; } }
              @media (max-width: 640px) { .trending-grid { grid-template-columns: repeat(2, 1fr) !important; } }
            `}</style>
            {products.map(p => {
              const school = getSchoolBySlug(p.school_slug)
              return (
                <div key={p.id}>
                  {school && (
                    <div style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: school.primary_color,
                      marginBottom: 4,
                    }}>
                      {school.short_name}
                    </div>
                  )}
                  <div style={{ position: 'relative' }}>
                    {/* Inline ProductCard equivalent to avoid import issues */}
                    <a
                      href={p.affiliate_url}
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
                        transition: 'box-shadow 0.2s, transform 0.2s',
                      }}
                    >
                      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F0F0F0' }}>
                        {p.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image_url}
                            alt={p.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                        <span style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(0,0,0,0.75)',
                          color: 'white',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '3px 7px',
                          borderRadius: 3,
                        }}>
                          {p.source === 'ebay' ? 'eBay' : p.source}
                        </span>
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{
                          fontSize: 13,
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const,
                          overflow: 'hidden',
                          marginBottom: 8,
                        }}>
                          {p.title}
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>
                          ${p.price.toFixed(2)}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)', padding: '48px 0', textAlign: 'center' }}>
          No trending products yet. Products will appear here once fans start clicking.
        </p>
      )}
    </main>
  )
}
