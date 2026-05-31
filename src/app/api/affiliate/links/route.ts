import { NextResponse } from 'next/server'
import { getAffiliateLinks } from '@/lib/affiliate/links'

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || 'fan gear'
  const sport = searchParams.get('sport') || undefined
  const category = searchParams.get('category') || undefined

  const links = await getAffiliateLinks({ query, sport, category })

  return NextResponse.json(
    { links },
    { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } }
  )
}
