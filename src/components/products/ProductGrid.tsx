'use client'

import type { Product } from '@/lib/supabase/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  schoolColor?: string
  schoolSlug?: string
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  totalCount?: number
}

export default function ProductGrid({
  products,
  schoolColor,
  loading,
  onLoadMore,
  hasMore,
  totalCount,
}: ProductGridProps) {
  return (
    <div>
      {totalCount !== undefined && (
        <p style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 16,
        }}>
          {totalCount} products found
        </p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
      }}>
        <style>{`
          @media (max-width: 1024px) {
            .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
          @media (max-width: 640px) {
            .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>

        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: '#F0F0F0',
                borderRadius: 'var(--radius-md)',
                aspectRatio: '3/4',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))
        ) : (
          products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              schoolColor={schoolColor}
            />
          ))
        )}
      </div>

      {hasMore && onLoadMore && (
        <button
          onClick={onLoadMore}
          style={{
            display: 'block',
            margin: '32px auto 0',
            padding: '12px 48px',
            border: `2px solid ${schoolColor || 'var(--brand)'}`,
            background: 'transparent',
            color: schoolColor || 'var(--brand)',
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = schoolColor || 'var(--brand)'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = schoolColor || 'var(--brand)'
          }}
        >
          Load More
        </button>
      )}
    </div>
  )
}
