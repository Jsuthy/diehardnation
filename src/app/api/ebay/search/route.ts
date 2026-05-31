import { NextResponse } from 'next/server'
import { searchEbayProducts } from '@/lib/ebay/search'

// Cached eBay product search for the client-side ProductRail.
export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || 'fan gear'
  const limit = Math.min(Number(searchParams.get('limit')) || 12, 24)

  const products = await searchEbayProducts(q, limit)

  return NextResponse.json(
    { products },
    { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' } }
  )
}
