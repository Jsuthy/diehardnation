'use client'

import type { Product } from '@/lib/supabase/types'
import ProductCard from './ProductCard'

export default function ProductCardGrid({
  products,
  schoolColor,
}: {
  products: Product[]
  schoolColor?: string
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
    }}>
      <style>{`
        @media (max-width: 640px) {
          .pcg { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
      {products.map(p => (
        <ProductCard key={p.id} product={p} schoolColor={schoolColor} />
      ))}
    </div>
  )
}
