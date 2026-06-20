// ─────────────────────────────────────────────────────────────────────────
// TRENDING SOURCES
//
// Pulls currently-trending search terms from Google Trends' public "daily
// trends" RSS feed (no API key, no auth). We fetch per-geo because the Search
// Console data shows traffic is split roughly evenly between the US and the UK,
// so both markets are worth capturing.
//
// Google Trends has no official API; the RSS endpoint is the stable public
// surface. If the feed format changes or the request fails, callers get an
// empty array and the pipeline no-ops rather than throwing.
// ─────────────────────────────────────────────────────────────────────────

import * as cheerio from 'cheerio'

export interface TrendItem {
  term: string
  /** Approx. traffic string from the feed, e.g. "50,000+". Null if absent. */
  traffic: string | null
  /** Numeric lower-bound of traffic for ranking (0 if unknown). */
  trafficValue: number
  geo: string
  /** Related news headlines, useful as moment-page context. */
  context: string[]
}

const TRENDS_RSS = (geo: string) =>
  `https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`

function parseTraffic(s: string | null): number {
  if (!s) return 0
  const m = s.replace(/,/g, '').match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

/** Fetch + parse the Google Trends daily RSS feed for one geo. */
export async function fetchTrends(geo: string): Promise<TrendItem[]> {
  let xml: string
  try {
    const res = await fetch(TRENDS_RSS(geo), {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DieHardNationBot/1.0)' },
      // Trends shifts a few times/hour; cache briefly to avoid hammering it.
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    xml = await res.text()
  } catch {
    return []
  }

  try {
    const $ = cheerio.load(xml, { xmlMode: true })
    const items: TrendItem[] = []
    $('item').each((_, el) => {
      const $el = $(el)
      const term = $el.find('title').first().text().trim()
      if (!term) return
      const traffic =
        $el.find('ht\\:approx_traffic').text().trim() ||
        $el.children().filter((_, c) => c.tagName?.endsWith('approx_traffic')).text().trim() ||
        null
      const context: string[] = []
      $el.find('ht\\:news_item_title, news_item_title').each((_, c) => {
        const txt = $(c).text().trim()
        if (txt) context.push(txt)
      })
      items.push({
        term,
        traffic,
        trafficValue: parseTraffic(traffic),
        geo,
        context: context.slice(0, 5),
      })
    })
    return items
  } catch {
    return []
  }
}

/** Fetch trends across multiple geos, de-duplicated by normalized term. */
export async function fetchAllTrends(geos: string[] = ['US', 'GB']): Promise<TrendItem[]> {
  const batches = await Promise.all(geos.map(fetchTrends))
  const merged = new Map<string, TrendItem>()
  for (const batch of batches) {
    for (const item of batch) {
      const key = item.term.toLowerCase()
      const existing = merged.get(key)
      if (!existing || item.trafficValue > existing.trafficValue) {
        merged.set(key, existing ? { ...item, geo: `${existing.geo},${item.geo}` } : item)
      }
    }
  }
  return [...merged.values()].sort((a, b) => b.trafficValue - a.trafficValue)
}
