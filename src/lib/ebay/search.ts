// Live eBay Browse API product search for the global team/event/league/sport pages.
// Reuses the same OAuth2 client-credentials flow as the college ingestion.
// Called from server components; results are cached by each page's ISR revalidate.

let cachedToken: { token: string; expires: number } | null = null

const CAMPAIGN_ID = (process.env.EBAY_CAMPAIGN_ID || '5339267498').trim()

async function getEbayToken(): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.expires) return cachedToken.token

  const appId = (process.env.EBAY_APP_ID || '').trim()
  const certId = (process.env.EBAY_CERT_ID || '').trim()
  if (!appId || !certId) return null

  const credentials = Buffer.from(`${appId}:${certId}`).toString('base64')
  try {
    const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
    })
    if (!res.ok) return null
    const data = await res.json()
    cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 }
    return cachedToken.token
  } catch {
    return null
  }
}

export interface EbayProduct {
  id: string
  title: string
  price: number
  currency: string
  imageUrl: string
  url: string
}

export async function searchEbayProducts(query: string, limit = 12): Promise<EbayProduct[]> {
  const token = await getEbayToken()
  if (!token) return []

  const params = new URLSearchParams({
    q: query,
    category_ids: '15687', // Sports Mem, Cards & Fan Shop
    limit: String(Math.min(limit * 2, 50)),
    filter: 'price:[10..300],priceCurrency:USD,conditions:{NEW}',
  })

  try {
    const res = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'X-EBAY-C-ENDUSERCTX': `affiliateCampaignId=${CAMPAIGN_ID}`,
      },
      // Let Next cache this fetch for the page's revalidate window.
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    const items = (data.itemSummaries || []) as Record<string, unknown>[]

    const out: EbayProduct[] = []
    const seen = new Set<string>()
    for (const item of items) {
      const id = String(item.itemId || '')
      const image = (item.image as Record<string, unknown>)?.imageUrl as string
        || (item.thumbnailImages as Record<string, unknown>[])?.[0]?.imageUrl as string
      const price = Number((item.price as Record<string, unknown>)?.value || 0)
      const title = String(item.title || '')
      if (!id || seen.has(id) || !image || price <= 0 || !title) continue
      seen.add(id)
      out.push({
        id,
        title,
        price,
        currency: String((item.price as Record<string, unknown>)?.currency || 'USD'),
        imageUrl: image.replace(/s-l\d+/, 's-l500'),
        url: (item.itemAffiliateWebUrl as string) || (item.itemWebUrl as string) || `https://www.ebay.com/itm/${id}`,
      })
      if (out.length >= limit) break
    }
    return out
  } catch {
    return []
  }
}
