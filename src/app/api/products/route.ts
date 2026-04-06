import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/supabase/queries'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const school = searchParams.get('school')
  if (!school) {
    return NextResponse.json({ error: 'Missing school parameter' }, { status: 400 })
  }

  const limit = Math.min(Number(searchParams.get('limit') || 24), 96)
  const offset = Number(searchParams.get('offset') || 0)
  const sport = searchParams.get('sport') || undefined
  const category = searchParams.get('category') || undefined
  const priceRange = searchParams.get('priceRange') || undefined
  const sortBy = (searchParams.get('sortBy') || 'popular') as 'popular' | 'price-asc' | 'price-desc' | 'newest'
  const q = searchParams.get('q') || undefined

  const { products, total } = await getProducts({
    schoolSlug: school,
    sport,
    category,
    priceRange,
    limit,
    offset,
    sortBy,
    q,
  })

  return NextResponse.json({
    products,
    total,
    hasMore: offset + products.length < total,
  })
}
