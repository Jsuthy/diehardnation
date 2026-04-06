import type { NormalizedProduct } from './utils'
import { detectSport, detectBrand, categorizeByTitle, generateSlug, isSchoolProduct } from './utils'
import type { School } from '@/lib/supabase/types'

let cachedToken: { token: string; expires: number } | null = null

async function getEbayToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token
  }

  const appId = process.env.EBAY_APP_ID!
  const certId = process.env.EBAY_CERT_ID!
  const credentials = Buffer.from(`${appId}:${certId}`).toString('base64')

  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`eBay token error ${res.status}: ${text}`)
  }

  const data = await res.json()
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  }
  return cachedToken.token
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function searchEbay(token: string, query: string, limit = 25): Promise<unknown[]> {
  const params = new URLSearchParams({
    q: query,
    category_ids: '15687',
    limit: String(limit),
    filter: 'price:[5..300],priceCurrency:USD,conditions:{NEW}',
    sort: 'price',
  })

  const res = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'X-EBAY-C-ENDUSERCTX': 'affiliateCampaignId=5339267498',
    },
  })

  if (!res.ok) {
    console.error(`eBay search error ${res.status} for "${query}"`)
    return []
  }

  const data = await res.json()
  return data.itemSummaries || []
}

export async function fetchEbayProductsForSchool(
  school: School,
  searchTerms: string[]
): Promise<NormalizedProduct[]> {
  const token = await getEbayToken()
  const allItems: NormalizedProduct[] = []
  const seenIds = new Set<string>()

  const schoolMatchTerms = [
    school.name.toLowerCase(),
    school.short_name.toLowerCase(),
    school.mascot.toLowerCase(),
    school.nickname.toLowerCase(),
  ]

  for (const term of searchTerms) {
    try {
      const items = await searchEbay(token, term, 25)

      for (const item of items as Record<string, unknown>[]) {
        const itemId = String(item.itemId || '')
        if (!itemId || seenIds.has(itemId)) continue

        const title = String(item.title || '')
        if (!isSchoolProduct(title, schoolMatchTerms)) continue

        const price = Number(
          (item.price as Record<string, unknown>)?.value || 0
        )
        if (price <= 0) continue

        seenIds.add(itemId)

        const imageUrl =
          (item.image as Record<string, unknown>)?.imageUrl as string ||
          ((item.thumbnailImages as Record<string, unknown>[]))?.[0]?.imageUrl as string ||
          null

        const affiliateUrl =
          (item.itemAffiliateWebUrl as string) ||
          (item.itemWebUrl as string) ||
          `https://www.ebay.com/itm/${itemId}`

        allItems.push({
          school_slug: school.slug,
          external_id: itemId,
          source: 'ebay',
          title,
          description: String(item.shortDescription || ''),
          price,
          original_price: null,
          image_url: imageUrl ? imageUrl.replace(/s-l\d+/, 's-l500') : null,
          affiliate_url: affiliateUrl,
          slug: generateSlug(title, itemId),
          category: categorizeByTitle(title),
          sport: detectSport(title),
          brand: detectBrand(title),
        })
      }
    } catch (err) {
      console.error(`Error fetching eBay for term "${term}":`, err)
    }

    await delay(250)
  }

  return allItems
}
