import { SPORTS } from '@/lib/constants/sports'
import { CATEGORIES } from '@/lib/constants/categories'
import { PRICE_RANGES } from '@/lib/constants/price-ranges'

const SPORT_SLUGS = new Set<string>(SPORTS.map(s => s.slug))
const CAT_SLUGS = new Set<string>(CATEGORIES.map(c => c.slug))
const PRICE_SLUGS = new Set<string>(PRICE_RANGES.map(p => p.slug))

export interface ProgrammaticPageRef {
  school_slug: string
  slug: string
  page_type: string
  sport?: string | null
  category?: string | null
  price_range?: string | null
}

/**
 * Map a programmatic_pages row to a path the App Router will actually resolve.
 * Returns null when the row cannot be turned into a 200 gear/gift-guide route
 * (those URLs must stay out of the sitemap).
 *
 * Historical bug: sitemap split slugs on the first hyphen, so
 * `all-gear` → /gear/all-gear, `tees` → /gear/tees, `under-25` → /gear/under/25.
 */
export function programmaticPagePath(page: ProgrammaticPageRef): string | null {
  const school = (page.school_slug || '').trim()
  const slug = (page.slug || '').trim()
  if (!school || !slug) return null

  if (page.page_type === 'gift-guide') {
    return `/${school}/gift-guides/${slug}`
  }

  const gear = resolveGearRoute(page)
  if (!gear) return null
  return gear.filter
    ? `/${school}/gear/${gear.sport}/${gear.filter}`
    : `/${school}/gear/${gear.sport}`
}

function resolveGearRoute(page: ProgrammaticPageRef): { sport: string; filter?: string } | null {
  const slug = (page.slug || '').trim()

  if (page.page_type === 'sport' || !page.page_type) {
    const sport = canonicalSport(page.sport) || canonicalSport(slug)
    return sport ? { sport } : null
  }

  if (page.page_type === 'sport-category') {
    return resolveFiltered(page, slug, CAT_SLUGS, page.category)
  }

  if (page.page_type === 'sport-price') {
    return resolveFiltered(page, slug, PRICE_SLUGS, page.price_range)
  }

  return null
}

function resolveFiltered(
  page: ProgrammaticPageRef,
  slug: string,
  allowed: Set<string>,
  column?: string | null,
): { sport: string; filter: string } | null {
  const sport = canonicalSport(page.sport) || sportFromPrefixedSlug(slug)
  const fromColumn = column && allowed.has(column) ? column : null
  const fromSlug = filterFromSlug(slug, sport, allowed)
  const filter = fromColumn || fromSlug
  const resolvedSport = sport || (fromSlug && !sportFromPrefixedSlug(slug) ? 'general' : null)
  if (resolvedSport && filter) return { sport: resolvedSport, filter }
  return null
}

function canonicalSport(value?: string | null): string | null {
  if (!value) return null
  if (value === 'all-gear') return 'general'
  return SPORT_SLUGS.has(value) ? value : null
}

function sportFromPrefixedSlug(slug: string): string | null {
  let best: string | null = null
  for (const sport of SPORT_SLUGS) {
    if (slug === sport || slug.startsWith(`${sport}-`)) {
      if (!best || sport.length > best.length) best = sport
    }
  }
  return best
}

function filterFromSlug(slug: string, sport: string | null, allowed: Set<string>): string | null {
  if (sport && slug.startsWith(`${sport}-`)) {
    const rest = slug.slice(sport.length + 1)
    return allowed.has(rest) ? rest : null
  }
  return allowed.has(slug) ? slug : null
}
