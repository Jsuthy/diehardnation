// eBay Partner Network attribution.
// customid / affiliateReferenceId lets EPNE report which page drove a click.
// Keep campid on the live DieHardNation campaign unless EBAY_CAMPAIGN_ID is set.

export const EBAY_CAMPAIGN_ID = (process.env.EBAY_CAMPAIGN_ID || '5339267498').trim()

/** EPNE customid max length. */
export const EBAY_CUSTOMID_MAX = 256

const EBAY_HOST = /(^|\.)ebay\.[a-z.]+$/i

export function sanitizeCustomId(value: string): string {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, EBAY_CUSTOMID_MAX)
}

/**
 * Taxonomy: `{pageType}` or `{pageType}-{slug}`.
 * Examples: home, team-kansas-city-chiefs, league-nfl, school-alabama,
 * search-chiefs-jersey, event-world-cup-2026, player-mahomes.
 */
export function buildCustomId(pageType: string, slug?: string | null): string {
  const raw = slug ? `${pageType}-${slug}` : pageType
  return sanitizeCustomId(raw) || sanitizeCustomId(pageType) || 'dhn'
}

/** Value for the Browse API X-EBAY-C-ENDUSERCTX header. */
export function ebayEndUserContext(customid?: string | null): string {
  const parts = [`affiliateCampaignId=${EBAY_CAMPAIGN_ID}`]
  const id = customid ? sanitizeCustomId(customid) : ''
  if (id) parts.push(`affiliateReferenceId=${id}`)
  return parts.join(',')
}

/** Set/replace customid (and campid if missing) on an eBay URL. */
export function withEbayCustomId(url: string, customid?: string | null): string {
  if (!url || !customid) return url
  const id = sanitizeCustomId(customid)
  if (!id) return url
  try {
    const u = new URL(url)
    if (!EBAY_HOST.test(u.hostname)) return url
    u.searchParams.set('customid', id)
    if (!u.searchParams.get('campid')) {
      u.searchParams.set('campid', EBAY_CAMPAIGN_ID)
    }
    return u.toString()
  } catch {
    return url
  }
}

export function buildEbaySearchUrl(query: string, customid?: string | null): string {
  const u = new URL('https://www.ebay.com/sch/i.html')
  u.searchParams.set('_nkw', query)
  u.searchParams.set('campid', EBAY_CAMPAIGN_ID)
  const id = customid ? sanitizeCustomId(customid) : ''
  if (id) u.searchParams.set('customid', id)
  return u.toString()
}
