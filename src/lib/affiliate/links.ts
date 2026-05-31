import { getPublicClient } from '@/lib/supabase/server'
import type { AffiliateConfigRow } from '@/lib/sports/types'

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

function buildUrl(row: AffiliateConfigRow, query: string): string {
  const q = encodeURIComponent(query)
  switch (row.provider) {
    case 'amazon':
      return `https://www.amazon.com/s?k=${q}${row.tag ? `&tag=${row.tag}` : ''}`
    case 'fanatics':
      return `https://www.fanatics.com/search?query=${q}`
    case 'dicks':
      return `https://www.dickssportinggoods.com/search#query=${q}`
    case 'academy':
      return `https://www.academy.com/search?q=${q}`
    case 'ebay':
      return `https://www.ebay.com/sch/i.html?_nkw=${q}${row.tag ? `&campid=${row.tag}` : ''}`
    default:
      return `${row.base_url}${q}`
  }
}

// Build the affiliate waterfall for a query, ordered by priority.
// The first link is the primary CTA. Falls back to a static eBay link if the
// affiliate_config table is unavailable (e.g. before migration).
export async function getAffiliateLinks(params: {
  query: string
  sport?: string
  category?: string
}): Promise<AffiliateLink[]> {
  const { query } = params
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

  if (!rows.length) {
    // Static fallback — eBay link always works.
    return [{
      provider: 'ebay',
      label: 'Shop on eBay →',
      url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&campid=JEFFREYS-Nebraske-PRD-94c5ab990-4d29e217`,
      isPrimary: true,
      commissionRate: 4,
    }]
  }

  return rows.map((row, i) => ({
    provider: row.provider,
    label: `Shop on ${PROVIDER_LABELS[row.provider] || row.provider} →`,
    url: buildUrl(row, query),
    isPrimary: i === 0,
    commissionRate: Number(row.commission_rate) || 0,
  }))
}
