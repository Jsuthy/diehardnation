// eBay Browse API search — powers both the team/event product rails and the
// PicClick-style /search product engine. Reuses the college OAuth2 flow.

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
  condition?: string
  seller?: string
}

export type EbaySort = 'best' | 'price' | '-price' | 'newlyListed' | 'endingSoonest'

export interface SearchOpts {
  limit?: number
  offset?: number
  sort?: EbaySort
  category?: string
  minPrice?: number
  maxPrice?: number
}

export interface SearchResult {
  products: EbayProduct[]
  total: number
}

async function runSearch(query: string, opts: SearchOpts): Promise<SearchResult> {
  const token = await getEbayToken()
  if (!token) return { products: [], total: 0 }

  const limit = Math.min(Math.max(opts.limit ?? 24, 1), 50)
  const min = opts.minPrice ?? 5
  const max = opts.maxPrice ?? 1000
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    offset: String(Math.max(opts.offset ?? 0, 0)),
    filter: `price:[${min}..${max}],priceCurrency:USD,conditions:{NEW|USED}`,
  })
  if (opts.category) params.set('category_ids', opts.category)
  if (opts.sort && opts.sort !== 'best') params.set('sort', opts.sort)

  try {
    const res = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'X-EBAY-C-ENDUSERCTX': `affiliateCampaignId=${CAMPAIGN_ID}`,
      },
      next: { revalidate: 1800 },
    })
    if (!res.ok) return { products: [], total: 0 }
    const data = await res.json()
    const items = (data.itemSummaries || []) as Record<string, unknown>[]

    const products: EbayProduct[] = []
    const seen = new Set<string>()
    for (const item of items) {
      const id = String(item.itemId || '')
      const image = (item.image as Record<string, unknown>)?.imageUrl as string
        || (item.thumbnailImages as Record<string, unknown>[])?.[0]?.imageUrl as string
      const price = Number((item.price as Record<string, unknown>)?.value || 0)
      const title = String(item.title || '')
      if (!id || seen.has(id) || !image || price <= 0 || !title) continue
      seen.add(id)
      products.push({
        id,
        title,
        price,
        currency: String((item.price as Record<string, unknown>)?.currency || 'USD'),
        imageUrl: image.replace(/s-l\d+/, 's-l500'),
        url: (item.itemAffiliateWebUrl as string) || (item.itemWebUrl as string) || `https://www.ebay.com/itm/${id}`,
        condition: item.condition as string | undefined,
        seller: (item.seller as Record<string, unknown>)?.username as string | undefined,
      })
    }
    return { products, total: Number(data.total) || products.length }
  } catch {
    return { products: [], total: 0 }
  }
}

// Rail helper: returns just the array, with a keyword-drop fallback so an
// over-specific query never yields an empty rail.
export async function searchEbayProducts(query: string, limit = 12): Promise<EbayProduct[]> {
  let { products } = await runSearch(query, { limit })
  let words = query.trim().split(/\s+/)
  while (products.length === 0 && words.length > 2) {
    words = words.slice(0, -1)
    products = (await runSearch(words.join(' '), { limit })).products
  }
  return products
}

// Search-page helper: paginated + sortable, returns total for the result count.
export async function searchEbayPaged(query: string, opts: SearchOpts = {}): Promise<SearchResult> {
  if (!query.trim()) return { products: [], total: 0 }
  return runSearch(query, opts)
}
