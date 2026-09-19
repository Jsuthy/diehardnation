import { getPublicClient } from '@/lib/supabase/server'
import type { AffiliateConfigRow } from '@/lib/sports/types'
import { EBAY_CAMPAIGN_ID, buildEbaySearchUrl, sanitizeCustomId } from './customid'

export interface AffiliateLink {
  provider: string
  label: string
  url: string
  isPrimary: boolean
  commissionRate: number
}

const PROVIDER_LABELS: Record<string, string> = {
  amazon: 'Amazon',
  fanatics: 'Fanatics',
  dicks: "Dick's Sporting Goods",
  academy: 'Academy',
  ebay: 'eBay',
}

function buildUrl(row: AffiliateConfigRow, query: string, customid?: string): string {
  const q = encodeURIComponent(query)
  switch (row.provider) {
    case 'amazon':
      // Only emit a tagged Associates URL. Untagged Amazon search is not "live".
      return row.tag
        ? `https://www.amazon.com/s?k=${q}&tag=${encodeURIComponent(row.tag)}`
        : ''
    case 'fanatics':
      return `https://www.fanatics.com/search?query=${q}`
    case 'dicks':
      return `https://www.dickssportinggoods.com/search#query=${q}`
    case 'academy':
      return `https://www.academy.com/search?q=${q}`
    case 'ebay': {
      const campid = (row.tag || EBAY_CAMPAIGN_ID).trim()
      const u = new URL('https://www.ebay.com/sch/i.html')
      u.searchParams.set('_nkw', query)
      u.searchParams.set('campid', campid)
      const id = customid ? sanitizeCustomId(customid) : ''
      if (id) u.searchParams.set('customid', id)
      return u.toString()
    }
    default:
      return `${row.base_url}${q}`
  }
}

function amazonIsLive(row: AffiliateConfigRow): boolean {
  return !!row.tag?.trim()
}

// Build the affiliate waterfall for a query, ordered by priority.
// The first link is the primary CTA. Falls back to a static eBay link if the
// affiliate_config table is unavailable (e.g. before migration).
// Amazon is omitted until an Associates tag exists on the config row.
export async function getAffiliateLinks(params: {
  query: string
  sport?: string
  category?: string
  customid?: string
}): Promise<AffiliateLink[]> {
  const { query, customid } = params
  let rows: AffiliateConfigRow[] = []
  try {
    const supabase = getPublicClient()
    const { data } = await supabase
      .from('affiliate_config').select('*')
      .eq('is_active', true).order('priority', { ascending: true })
    rows = (data as AffiliateConfigRow[]) || []
  } catch {
    rows = []
  }

  rows = rows.filter(row => row.provider !== 'amazon' || amazonIsLive(row))

  if (!rows.length) {
    return [{
      provider: 'ebay',
      label: 'Shop on eBay →',
      url: buildEbaySearchUrl(query, customid),
      isPrimary: true,
      commissionRate: 4,
    }]
  }

  return rows
    .map((row, i) => ({
      provider: row.provider,
      label: `Shop on ${PROVIDER_LABELS[row.provider] || row.provider} →`,
      url: buildUrl(row, query, customid),
      isPrimary: i === 0,
      commissionRate: Number(row.commission_rate) || 0,
    }))
    .filter(link => !!link.url)
}
