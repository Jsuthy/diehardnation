'use client'

import Image from 'next/image'
import type { Product } from '@/lib/supabase/types'

interface ProductCardProps {
  product: Product
  schoolColor?: string
}

export default function ProductCard({ product, schoolColor }: ProductCardProps) {
  const handleClick = async () => {
    try {
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
    } catch {
      // silent fail
    }
    window.open(product.affiliate_url, '_blank', 'noopener,noreferrer')
  }

  const sourceLabel = product.source === 'ebay' ? 'eBay'
    : product.source === 'amazon' ? 'Amazon'
    : product.source === 'fanatics' ? 'Fanatics'
    : product.source

  const schoolInitial = product.school_slug?.charAt(0).toUpperCase() || 'D'
  const color = schoolColor || 'var(--school-color, var(--brand))'

  return (
    <article
      onClick={handleClick}
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'none'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F0F0F0' }}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={`${product.title} — ${product.school_slug} fan gear`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: 'linear-gradient(135deg, #F0F0F0, #E0E0E0)',
          }}>
            <span style={{
              fontSize: 48,
              fontWeight: 900,
              color: color,
            }}>
              {schoolInitial}
            </span>
          </div>
        )}

        {/* Source badge */}
        <span style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(0,0,0,0.75)',
          color: 'white',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          padding: '3px 7px',
          borderRadius: 3,
        }}>
          {sourceLabel}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{
          fontSize: 13,
          lineHeight: 1.4,
          color: 'var(--text-primary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
          marginBottom: 8,
        }}>
          {product.title}
        </div>

        <footer style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <span style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                textDecoration: 'line-through',
                marginLeft: 6,
              }}>
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            style={{
              background: color,
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              padding: '5px 10px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            View Deal
          </button>
        </footer>
      </div>
    </article>
  )
}
