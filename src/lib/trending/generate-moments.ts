// ─────────────────────────────────────────────────────────────────────────
// MOMENT-PAGE GENERATOR (Phase 2 completion)
//
// Turns sports-related trending terms that DON'T map to an existing entity
// (the "candidates" from the trending pipeline) into real, indexable gear
// pages — but only when there are enough genuine products to clear the quality
// gate. This is "capture every long-tail trend" done without thin content.
//
// Flow: candidate term → cleaned commercial query → live eBay search → if
// >= MIN_INDEX_PRODUCTS, upsert a moment_page (live-rendered at /trending/slug).
// ─────────────────────────────────────────────────────────────────────────

import { getAdminClient } from '@/lib/supabase/server'
import { searchEbayProducts } from '@/lib/ebay/search'
import { MIN_INDEX_PRODUCTS } from '@/lib/seo/quality-gate'

// Non-commercial noise words to strip from a trend before searching for gear.
const NOISE = new Set([
  'vs', 'v', 'live', 'score', 'scores', 'result', 'results', 'standings',
  'standing', 'highlights', 'lineup', 'lineups', 'roster', 'today', 'tonight',
  'game', 'match', 'fixture', 'prediction', 'odds', 'news', 'update', 'stream',
  'watch', 'free', 'channel', 'time', 'date', 'where', 'how', 'what', 'when',
  'the', 'a', 'an', 'to', 'of', 'in', 'on', 'for', 'and', 'is', 'are',
])

export function slugifyTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Build a commercial eBay query from a raw trend term. */
export function momentGearQuery(term: string): string {
  const words = term
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(w => w && !NOISE.has(w))
  const base = words.join(' ').trim()
  if (!base) return ''
  // Append a commercial anchor; the eBay helper keyword-drops if too specific.
  return /jersey|shirt|hoodie|gear|kit|hat|merch|apparel/.test(base) ? base : `${base} jersey`
}

function titleFor(term: string): string {
  const t = term.trim().replace(/\b\w/g, c => c.toUpperCase())
  return `${t} Fan Gear — Jerseys, Shirts & Merch`
}

function descriptionFor(term: string, count: number): string {
  return `Shop ${term} fan gear — jerseys, shirts, hoodies and merch from eBay, ${count}+ live listings. Trending now on DieHardNation, updated continuously.`
}

export interface MomentGenResult {
  considered: number
  created: number
  skippedThin: number
  created_slugs: string[]
}

/**
 * Generate moment pages for the top unhandled candidate trends.
 * Idempotent: re-running refreshes product_count / indexable for existing slugs.
 */
export async function generateMomentPages(opts: { limit?: number; minTraffic?: number } = {}): Promise<MomentGenResult> {
  const limit = opts.limit ?? 8
  const minTraffic = opts.minTraffic ?? 0
  const supabase = getAdminClient()

  // Pull the strongest recent candidates (sports-related, no entity match).
  const { data: candidates } = await supabase
    .from('trending_signals')
    .select('term, normalized_term, traffic, traffic_value, sport_slug:matched_slug, context')
    .eq('is_candidate', true)
    .gte('traffic_value', minTraffic)
    .order('traffic_value', { ascending: false })
    .limit(limit * 3) // over-fetch; many will be filtered by the gear-query/product checks

  const result: MomentGenResult = { considered: 0, created: 0, skippedThin: 0, created_slugs: [] }
  if (!candidates?.length) return result

  const seenSlugs = new Set<string>()
  for (const c of candidates as { term: string; traffic: string | null; traffic_value: number; context: string[] | null }[]) {
    if (result.created >= limit) break
    const slug = slugifyTerm(c.term)
    if (!slug || seenSlugs.has(slug)) continue
    seenSlugs.add(slug)

    const gearQuery = momentGearQuery(c.term)
    if (!gearQuery) continue
    result.considered++

    // Quality gate: only build a page backed by real products.
    const products = await searchEbayProducts(gearQuery, 24)
    if (products.length < MIN_INDEX_PRODUCTS) {
      result.skippedThin++
      continue
    }

    const expires = new Date()
    expires.setDate(expires.getDate() + 90) // moment pages expire to avoid stale thin content

    const { error } = await supabase.from('moment_pages').upsert(
      {
        slug,
        term: c.term,
        title: titleFor(c.term),
        description: descriptionFor(c.term, products.length),
        gear_query: gearQuery,
        context: c.context ?? [],
        traffic: c.traffic,
        product_count: products.length,
        indexable: true,
        is_active: true,
        expires_at: expires.toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug', ignoreDuplicates: false }
    )

    if (!error) {
      result.created++
      result.created_slugs.push(slug)
    }
  }

  return result
}
