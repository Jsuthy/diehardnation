// ─────────────────────────────────────────────────────────────────────────
// VALUE-ADD CONTENT ENGINE
//
// The job of this module is to make every page deserve to rank — to answer
// Google's question "why should I rank this over eBay itself?". Each block
// pulls real, page-specific facts (location, conference, rivalry, live price
// data, color/mascot) so the copy is genuinely differentiated rather than a
// name-swapped template. The same source produces both the on-page prose and
// the FAQPage JSON-LD, so structured data always matches what users see.
//
// Everything here is deterministic (no LLM at request time) so it is free,
// instant, and stable across renders — which Google rewards.
// ─────────────────────────────────────────────────────────────────────────

import type { School } from '@/lib/supabase/types'
import { CONFERENCES } from '@/lib/constants/conferences'

// ─── Reference data: rivalries (drives unique, fan-relevant copy) ──────────
// Curated for the highest-traffic programs; absent entries fall back to
// conference-level framing so the copy is never empty.
const RIVALRIES: Record<string, { rival: string; game?: string }[]> = {
  'alabama':      [{ rival: 'Auburn', game: 'the Iron Bowl' }, { rival: 'Tennessee', game: 'the Third Saturday in October' }],
  'auburn':       [{ rival: 'Alabama', game: 'the Iron Bowl' }, { rival: 'Georgia', game: "the Deep South's Oldest Rivalry" }],
  'ohio-state':   [{ rival: 'Michigan', game: 'The Game' }],
  'michigan':     [{ rival: 'Ohio State', game: 'The Game' }, { rival: 'Michigan State', game: 'the Paul Bunyan Trophy' }],
  'texas':        [{ rival: 'Oklahoma', game: 'the Red River Rivalry' }, { rival: 'Texas A&M' }],
  'texas-am':     [{ rival: 'Texas' }, { rival: 'LSU' }],
  'georgia':      [{ rival: 'Florida', game: "the World's Largest Outdoor Cocktail Party" }, { rival: 'Auburn' }, { rival: 'Georgia Tech', game: 'Clean Old-Fashioned Hate' }],
  'florida':      [{ rival: 'Georgia' }, { rival: 'Florida State' }, { rival: 'Tennessee' }],
  'tennessee':    [{ rival: 'Alabama', game: 'the Third Saturday in October' }, { rival: 'Florida' }],
  'lsu':          [{ rival: 'Alabama' }, { rival: 'Texas A&M' }, { rival: 'Ole Miss', game: 'the Magnolia Bowl' }],
  'oklahoma':     [{ rival: 'Texas', game: 'the Red River Rivalry' }, { rival: 'Oklahoma State', game: 'Bedlam' }],
  'notre-dame':   [{ rival: 'USC', game: 'the Jeweled Shillelagh' }, { rival: 'Navy' }],
  'usc':          [{ rival: 'UCLA', game: 'the Victory Bell' }, { rival: 'Notre Dame' }],
  'ucla':         [{ rival: 'USC', game: 'the Victory Bell' }],
  'penn-state':   [{ rival: 'Ohio State' }, { rival: 'Michigan State', game: 'the Land Grant Trophy' }],
  'michigan-state': [{ rival: 'Michigan', game: 'the Paul Bunyan Trophy' }],
  'clemson':      [{ rival: 'South Carolina', game: 'the Palmetto Bowl' }],
  'oregon':       [{ rival: 'Washington' }, { rival: 'Oregon State', game: 'the Civil War' }],
  'nebraska':     [{ rival: 'Iowa', game: 'the Heroes Trophy' }, { rival: 'Wisconsin' }],
  'wisconsin':    [{ rival: 'Minnesota', game: 'Paul Bunyan’s Axe' }, { rival: 'Nebraska' }],
  'iowa':         [{ rival: 'Iowa State', game: 'the Cy-Hawk Trophy' }, { rival: 'Nebraska' }],
  'virginia-tech':[{ rival: 'Virginia', game: 'the Commonwealth Cup' }],
  'pittsburgh':   [{ rival: 'West Virginia', game: 'the Backyard Brawl' }],
  'army':         [{ rival: 'Navy', game: "the Army–Navy Game" }],
}

// US Census regions — lets copy reference geography naturally.
const STATE_REGION: Record<string, string> = {
  AL: 'the Deep South', GA: 'the Deep South', MS: 'the Deep South', LA: 'the Deep South', SC: 'the Deep South',
  TN: 'the South', KY: 'the South', AR: 'the South', FL: 'the Southeast', NC: 'the Southeast', VA: 'the Mid-Atlantic',
  TX: 'the Southwest', OK: 'the Southwest', NM: 'the Southwest', AZ: 'the Southwest',
  OH: 'the Midwest', MI: 'the Midwest', IN: 'the Midwest', IL: 'the Midwest', WI: 'the Midwest', IA: 'the Midwest',
  MN: 'the Upper Midwest', NE: 'the Great Plains', KS: 'the Great Plains', MO: 'the Midwest', ND: 'the Great Plains', SD: 'the Great Plains',
  PA: 'the Northeast', NY: 'the Northeast', NJ: 'the Northeast', MA: 'New England', CT: 'New England',
  CA: 'the West Coast', OR: 'the Pacific Northwest', WA: 'the Pacific Northwest', NV: 'the West', UT: 'the Mountain West', CO: 'the Mountain West', ID: 'the Mountain West',
  WV: 'Appalachia', MD: 'the Mid-Atlantic', HI: 'Hawaii', CT_: '',
}

function conferenceFullName(slug: string): string {
  return CONFERENCES.find(c => c.slug === slug)?.fullName ?? 'its conference'
}

function conferenceName(slug: string): string {
  return CONFERENCES.find(c => c.slug === slug)?.name ?? slug.toUpperCase()
}

function region(state: string): string {
  return STATE_REGION[state] ?? `the state of ${state}`
}

function rivalriesFor(slug: string) {
  return RIVALRIES[slug] ?? []
}

// ─── Live price statistics (computed from real product data) ───────────────

export interface PriceStat {
  count: number
  min: number
  max: number
  median: number
}

export function computePriceStat(prices: number[]): PriceStat | null {
  const clean = prices.filter(p => Number.isFinite(p) && p > 0).sort((a, b) => a - b)
  if (clean.length === 0) return null
  const mid = Math.floor(clean.length / 2)
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2
  return { count: clean.length, min: clean[0], max: clean[clean.length - 1], median: Math.round(median) }
}

// ─── Content blocks ────────────────────────────────────────────────────────

export interface ContentBlock {
  heading: string
  paragraphs: string[]
}

/**
 * A genuine buying guide that references the school's geography, conference,
 * rivalry calendar and live price range. Varies materially school to school.
 */
export function buildBuyingGuide(
  school: School,
  opts: { sportLabel?: string; priceStat?: PriceStat | null } = {}
): ContentBlock {
  const { sportLabel, priceStat } = opts
  const subject = sportLabel ? `${school.name} ${sportLabel.toLowerCase()}` : school.name
  const rivals = rivalriesFor(school.slug)
  const paras: string[] = []

  // Para 1 — geography + conference anchor (unique per school).
  paras.push(
    `${school.name} draws one of the most passionate fan bases in ${region(school.state)}, ` +
    `centered in ${school.city}, ${school.state}. As a member of the ${conferenceFullName(school.conference)}, ` +
    `the ${school.mascot} compete against the toughest schedule in college sports, and ${school.nickname} ` +
    `fans show up in team colors every week. This guide rounds up the best ${subject} gear available ` +
    `right now from eBay and Amazon, ranked for value, selection and game-day readiness.`
  )

  // Para 2 — rivalry / occasion-driven (unique when rivalry data exists).
  if (rivals.length) {
    const r = rivals[0]
    const occasion = r.game ? `${r.game} against ${r.rival}` : `the matchup against ${r.rival}`
    paras.push(
      `If you are gearing up for ${occasion}, prioritize bold, team-color apparel ` +
      `that reads from across the stadium — a ${school.nickname} hoodie or jersey in ` +
      `${school.primary_color === '#FFFFFF' ? 'the primary team color' : 'the signature shade'} is the ` +
      `classic move. For a road trip into rival territory, layer a lightweight tee under a quarter-zip ` +
      `so you can represent the ${school.mascot} whatever the weather does.`
    )
  } else {
    paras.push(
      `For game day, prioritize bold, team-color apparel — a ${school.nickname} hoodie or jersey is the ` +
      `classic move — and layer a lightweight tee under a quarter-zip so you are ready whatever the ` +
      `weather does in ${school.city}.`
    )
  }

  // Para 3 — live price guidance (unique, data-driven, refreshes with catalog).
  if (priceStat && priceStat.count >= 3) {
    paras.push(
      `Across the ${priceStat.count} ${subject} listings we are tracking today, prices run from ` +
      `$${priceStat.min} to $${priceStat.max}, with a typical price around $${priceStat.median}. ` +
      `Tees and accessories anchor the low end, hoodies and jerseys sit in the middle, and ` +
      `authentic and vintage pieces command the top of the range. Set a budget, then sort by price ` +
      `to find the best ${school.nickname} value in your range.`
    )
  }

  return {
    heading: sportLabel
      ? `${school.name} ${sportLabel} Buying Guide`
      : `How to Shop ${school.name} Fan Gear`,
    paragraphs: paras,
  }
}

/**
 * Licensed-vs-counterfeit guidance — a genuinely useful, trust-building angle
 * that aggregators usually skip. This is real value-add over a raw eBay search.
 */
export function buildLicensedGuidance(school: School): ContentBlock {
  return {
    heading: `Spotting Officially Licensed ${school.short_name} Gear`,
    paragraphs: [
      `Counterfeit college apparel is common on open marketplaces, so it pays to check a few things ` +
      `before you buy ${school.name} gear. Officially licensed ${school.mascot} products carry an ` +
      `"Officially Licensed Collegiate Products" hologram or a CLC/Learfield tag, and reputable brands ` +
      `(Nike, Champion, '47, Colosseum, Fanatics) are listed in the item details.`,
      `On eBay, favor sellers with high feedback scores and clear, original photos rather than stock ` +
      `images, and read the description for the words "licensed" or "authentic." Prices that look far ` +
      `below the ${school.nickname} norm are the most common red flag for knock-offs. When in doubt, ` +
      `vintage and thrifted ${school.short_name} pieces from established sellers are a safe, ` +
      `character-rich alternative to mass-produced replicas.`,
    ],
  }
}

/**
 * Varied, fact-driven FAQ. Returns Q/A pairs used BOTH for on-page accordions
 * and the FAQPage JSON-LD so they always match.
 */
export function buildSchoolFAQ(
  school: School,
  opts: { productCount?: number; priceStat?: PriceStat | null } = {}
): { question: string; answer: string }[] {
  const { productCount, priceStat } = opts
  const rivals = rivalriesFor(school.slug)
  const faqs: { question: string; answer: string }[] = []

  faqs.push({
    question: `Where can I buy ${school.name} fan gear online?`,
    answer:
      `DieHardNation aggregates ${school.name} ${school.mascot} gear from trusted marketplaces — ` +
      `eBay and Amazon — into one place${productCount ? `, currently ${productCount}+ live listings` : ''}. ` +
      `You browse and compare here, then check out directly with the retailer, who handles payment, ` +
      `shipping and returns.`,
  })

  if (priceStat && priceStat.count >= 3) {
    faqs.push({
      question: `How much does ${school.name} gear cost?`,
      answer:
        `Right now ${school.nickname} listings range from about $${priceStat.min} to $${priceStat.max}, ` +
        `with a typical price near $${priceStat.median}. T-shirts and accessories are the most affordable, ` +
        `while jerseys and authentic or vintage pieces sit at the top of the range.`,
    })
  }

  faqs.push({
    question: `How do I know ${school.name} gear is officially licensed?`,
    answer:
      `Look for an "Officially Licensed Collegiate Products" hologram or tag and recognizable brands ` +
      `like Nike, Champion, '47 or Fanatics in the listing. Buy from high-feedback sellers with original ` +
      `photos, and treat prices far below the ${school.nickname} norm as a counterfeit warning sign.`,
  })

  if (rivals.length) {
    const list = rivals.map(r => r.rival).slice(0, 3)
    const human = list.length > 1 ? `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}` : list[0]
    faqs.push({
      question: `Who are ${school.name}'s biggest rivals?`,
      answer:
        `${school.short_name}'s top rivals include ${human}` +
        (rivals[0].game ? `, with the marquee matchup being ${rivals[0].game}` : '') +
        `. Rivalry weeks are the busiest time for ${school.nickname} gear, so shop early before game day.`,
    })
  }

  faqs.push({
    question: `Is DieHardNation affiliated with ${school.name}?`,
    answer:
      `No. DieHardNation is an independent fan-gear aggregator and is not affiliated with ${school.name}, ` +
      `the ${conferenceName(school.conference)}, or the NCAA. We earn affiliate commissions from ` +
      `qualifying purchases made through our retailer links.`,
  })

  return faqs
}

/** Build FAQPage JSON-LD from Q/A pairs (single source of truth with on-page). */
export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

/** Rough word count of a content block, for the quality gate. */
export function wordCountOf(...blocks: (ContentBlock | { question: string; answer: string }[])[]): number {
  let n = 0
  for (const b of blocks) {
    if (Array.isArray(b)) {
      for (const qa of b) n += (qa.question + ' ' + qa.answer).split(/\s+/).length
    } else {
      n += b.heading.split(/\s+/).length
      for (const p of b.paragraphs) n += p.split(/\s+/).length
    }
  }
  return n
}
