// ─────────────────────────────────────────────────────────────────────────
// PAGE QUALITY GATE
//
// The single decision point for whether a programmatic page is allowed into
// Google's index. This is what makes "scale to tens of thousands of pages"
// safe instead of a thin-content liability.
//
// Google's March-2024 "scaled content abuse" policy demotes (or de-indexes)
// sites that mass-produce templated pages with no unique value. A page that
// has too few products or too little genuine content should still EXIST and be
// crawlable (so its internal links pass equity), but must be `noindex` so it
// never dilutes the site's overall quality signal — and must be kept out of
// the sitemap so we don't actively ask Google to index thin pages.
//
// Every page template (school hubs, sport pages, team/league/event pages,
// trending moment pages) routes its indexability decision through here, and
// sitemap.ts uses the same thresholds so on-page robots and sitemap never
// disagree.
// ─────────────────────────────────────────────────────────────────────────

/** Minimum live products for a commerce page to be worth indexing. */
export const MIN_INDEX_PRODUCTS = 6

/** Minimum products for a page to even render in a non-empty state. */
export const MIN_RENDER_PRODUCTS = 1

/** Minimum words of genuine, non-boilerplate body copy to index. */
export const MIN_UNIQUE_WORDS = 120

export interface PageQualitySignals {
  /** Count of live/active products on the page. */
  productCount: number
  /** Approx word count of unique, page-specific body copy (excl. shared chrome). */
  uniqueWordCount?: number
  /** Number of distinct product images (proxy for a non-empty, real catalog). */
  distinctImages?: number
  /**
   * Time-sensitive pages (events, trending moments) are indexed eagerly even
   * when the catalog is light, because their value is the moment, not depth.
   */
  isTimeSensitive?: boolean
  /** A page explicitly curated/edited by a human is always index-worthy. */
  isCurated?: boolean
}

export interface PageQualityResult {
  /** True → emit index,follow and include in sitemap. False → noindex,follow + exclude. */
  indexable: boolean
  /** 0-100 composite, used to set sitemap <priority> and crawl prioritisation. */
  score: number
  /** Human-readable reasons a page failed the gate (for admin/debug). */
  reasons: string[]
}

/**
 * Evaluate whether a page clears the quality bar for indexing.
 *
 * Decision order:
 *   1. Curated or genuinely time-sensitive pages with at least one product pass.
 *   2. Commerce pages must clear BOTH the product-count and unique-content bars.
 */
export function evaluatePageQuality(signals: PageQualitySignals): PageQualityResult {
  const {
    productCount,
    uniqueWordCount = 0,
    distinctImages = productCount,
    isTimeSensitive = false,
    isCurated = false,
  } = signals

  const reasons: string[] = []

  // Curated pages are human-vouched — always index, but still score them.
  if (isCurated) {
    return { indexable: true, score: scorePage(signals), reasons }
  }

  // Time-sensitive pages (live events, trending moments) index with a lighter
  // catalog requirement — but still need *something* real on them.
  if (isTimeSensitive) {
    if (productCount < MIN_RENDER_PRODUCTS && uniqueWordCount < MIN_UNIQUE_WORDS) {
      reasons.push('time-sensitive page has neither products nor content')
      return { indexable: false, score: scorePage(signals), reasons }
    }
    return { indexable: true, score: scorePage(signals), reasons }
  }

  // Standard commerce page: must clear both bars.
  if (productCount < MIN_INDEX_PRODUCTS) {
    reasons.push(`only ${productCount} products (need ${MIN_INDEX_PRODUCTS})`)
  }
  if (uniqueWordCount > 0 && uniqueWordCount < MIN_UNIQUE_WORDS) {
    reasons.push(`only ${uniqueWordCount} words of unique copy (need ${MIN_UNIQUE_WORDS})`)
  }
  if (distinctImages < Math.min(productCount, 3)) {
    reasons.push('too few distinct product images (possible duplicate/empty catalog)')
  }

  return {
    indexable: reasons.length === 0,
    score: scorePage(signals),
    reasons,
  }
}

/**
 * 0-100 composite quality score. Drives sitemap <priority> so Google spends
 * crawl budget on the deepest, richest pages first.
 */
export function scorePage(signals: PageQualitySignals): number {
  const { productCount, uniqueWordCount = 0, isCurated, isTimeSensitive } = signals

  // Diminishing-returns curve on catalog depth: 50 products ≈ full marks.
  const catalogScore = Math.min(1, Math.log10(productCount + 1) / Math.log10(51)) * 55
  const contentScore = Math.min(1, uniqueWordCount / 400) * 30
  const curationBonus = isCurated ? 15 : isTimeSensitive ? 10 : 0

  return Math.round(Math.min(100, catalogScore + contentScore + curationBonus))
}

/**
 * Map a quality result to a Next.js Metadata `robots` object.
 * Failing pages are `noindex` but stay `follow` so their internal links still
 * flow equity to the strong pages.
 */
export function robotsForQuality(result: PageQualityResult) {
  return result.indexable
    ? { index: true, follow: true }
    : { index: false, follow: true }
}

/**
 * Map a quality score (0-100) to a sitemap priority in [0.1, 1.0].
 * Only indexable pages should be passed here; non-indexable pages are excluded
 * from the sitemap entirely by the caller.
 */
export function sitemapPriority(score: number, ceiling = 0.95): number {
  const p = 0.1 + (score / 100) * (ceiling - 0.1)
  return Math.round(p * 100) / 100
}
