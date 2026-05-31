import { NextResponse } from 'next/server'
import { searchEbayProducts, searchEbayPaged, type EbaySort } from '@/lib/ebay/search'

export const revalidate = 1800

const SORTS = new Set(['best', 'price', '-price', 'newlyListed', 'endingSoonest'])

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || 'fan gear'
  const limit = Math.min(Number(searchParams.get('limit')) || 24, 50)
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0)
  const sortParam = searchParams.get('sort') || 'best'
  const sort = (SORTS.has(sortParam) ? sortParam : 'best') as EbaySort

  // Rail mode (offset 0, no sort): use the keyword-drop fallback for resilience.
  if (offset === 0 && sort === 'best' && searchParams.get('mode') === 'rail') {
    const products = await searchEbayProducts(q, limit)
    return NextResponse.json(
      { products, total: products.length },
      { headers: { 'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400' } }
    )
  }

  const result = await searchEbayPaged(q, { limit, offset, sort })
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400' },
  })
}
