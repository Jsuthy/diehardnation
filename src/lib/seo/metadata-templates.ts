import type { School } from '@/lib/supabase/types'

// Product type keywords — KD 2-19, commercial intent
// These go in titles and H1s — fastest ranking opportunity
export const CATEGORY_KEYWORDS: Record<string, {
  singular: string
  plural: string
  alt: string
  titlePlural: string
}> = {
  tees: {
    singular: 'T-Shirt',
    plural: 'T-Shirts',
    alt: 'Shirts',
    titlePlural: 'T-Shirts & Shirts',
  },
  hoodies: {
    singular: 'Hoodie',
    plural: 'Hoodies',
    alt: 'Sweatshirts',
    titlePlural: 'Hoodies & Sweatshirts',
  },
  hats: {
    singular: 'Hat',
    plural: 'Hats',
    alt: 'Caps',
    titlePlural: 'Hats & Caps',
  },
  jerseys: {
    singular: 'Jersey',
    plural: 'Jerseys',
    alt: 'Uniforms',
    titlePlural: 'Jerseys & Uniforms',
  },
  womens: {
    singular: "Women's",
    plural: "Women's Gear",
    alt: 'Ladies Apparel',
    titlePlural: "Women's Apparel & Gear",
  },
  youth: {
    singular: 'Youth',
    plural: 'Youth Gear',
    alt: 'Kids Apparel',
    titlePlural: 'Youth & Kids Gear',
  },
  accessories: {
    singular: 'Accessory',
    plural: 'Accessories',
    alt: 'Fan Gear',
    titlePlural: 'Accessories & Fan Gear',
  },
}

// Sport keyword data
export const SPORT_KEYWORDS: Record<string, {
  name: string
  abbrev: string
  productTerms: string[]
}> = {
  football:   { name: 'Football',   abbrev: 'FB',         productTerms: ['Jerseys', 'Hoodies', 'Shirts'] },
  basketball: { name: 'Basketball', abbrev: 'Basketball', productTerms: ['Jerseys', 'Hoodies', 'Shirts'] },
  volleyball: { name: 'Volleyball', abbrev: 'VB',         productTerms: ['Shirts', 'Sweatshirts', 'Hoodies'] },
  wrestling:  { name: 'Wrestling',  abbrev: 'Wrestling',  productTerms: ['Shirts', 'Hoodies', 'Gear'] },
  baseball:   { name: 'Baseball',   abbrev: 'Baseball',   productTerms: ['Jerseys', 'Hats', 'Shirts'] },
  softball:   { name: 'Softball',   abbrev: 'Softball',   productTerms: ['Jerseys', 'Shirts', 'Gear'] },
  track:      { name: 'Track',      abbrev: 'Track',      productTerms: ['Shirts', 'Gear', 'Apparel'] },
  general:    { name: '',            abbrev: '',           productTerms: ['Hoodies', 'Jerseys', 'Shirts'] },
}

// Price range labels
export const PRICE_KEYWORDS: Record<string, {
  title: string
  description: string
}> = {
  'under-25':  { title: 'Under $25',  description: 'under $25' },
  '25-to-50':  { title: '$25\u201350',    description: '$25 to $50' },
  '50-to-100': { title: '$50\u2013100',   description: '$50 to $100' },
  'over-100':  { title: 'Over $100',  description: 'over $100' },
}

// School-specific nickname overrides based on Semrush data
// Fans search these terms, not the official nickname
export const SCHOOL_NICKNAME_OVERRIDES: Record<string, string> = {
  'nebraska':   'Husker',
  'tennessee':  'Tennessee Vols',
  'georgia':    'UGA',
  'lsu':        'LSU',
  'notre-dame': 'Notre Dame',
  'penn-state': 'Penn State',
  'ohio-state': 'Ohio State',
  'michigan':   'Michigan',
  'alabama':    'Alabama',
  'texas':      'Texas Longhorns',
}

// School-specific primary product overrides based on Semrush data
// These go in title/H1 — ordered by search volume for that school
export const SCHOOL_PRODUCT_OVERRIDES: Record<string, string[]> = {
  'penn-state':  ['Hats', 'Jerseys', 'Hoodies'],
  // penn state hat KD 3 (1,900 vol), jersey KD 11 (1,900 vol)
  'tennessee':   ['Hoodies', 'Sweatshirts', 'Shirts'],
  // tennessee hoodie KD 5, vols sweatshirt KD 8
  'lsu':         ['Polos', 'Jerseys', 'Hoodies'],
  // lsu polo KD 6 (720 vol), lsu polos KD 6 (720 vol)
  'notre-dame':  ['Jerseys', 'Hoodies', 'Polos'],
  // notre dame helmet KD 4, polo KD 9
  'nebraska':    ['Hoodies', 'Jerseys', 'Shirts'],
  // nebraska hoodie KD 6, jersey KD 7
  'ohio-state':  ['Hoodies', 'Crewnecks', 'Shirts'],
  // ohio state hoodie KD 14 (4,400 vol), crewneck KD 4
  'michigan':    ['Hoodies', 'Sweatshirts', 'Jerseys'],
  // michigan hoodie KD 7, sweatshirt KD 9
  'georgia':     ['Hoodies', 'Jerseys', 'Shirts'],
  // uga hoodie KD 11, uga jersey KD 17
  'alabama':     ['Jerseys', 'Hoodies', 'Polos'],
  // alabama jersey KD 9, polo shirts KD 10
  'texas':       ['Jerseys', 'Shirts', 'Hoodies'],
  // texas longhorn jersey KD 12, shirts KD 16
}

// Helper: get fan-search nickname for a school
function getFanNickname(school: School): string {
  return SCHOOL_NICKNAME_OVERRIDES[school.slug] || school.nickname
}

// Helper: get primary product terms for a school
function getPrimaryProducts(school: School): string[] {
  return SCHOOL_PRODUCT_OVERRIDES[school.slug] || ['Hoodies', 'Jerseys', 'Shirts']
}

// -----------------------------------------------
// SCHOOL HUB -- /[school]
// Targets: [school] hoodie/jersey/shirt (KD 2-19)
// -----------------------------------------------
export function getSchoolMetadata(school: School) {
  const nick = getFanNickname(school)
  const [p1, p2, p3] = getPrimaryProducts(school)

  return {
    title: `${school.name} Fan Gear \u2014 ${nick} ${p1}, ${p2} & ${p3}`,
    description: `Shop ${school.name} fan gear. ${nick} ${p1.toLowerCase()}, ${p2.toLowerCase()}, ${p3.toLowerCase()} and hats from eBay and Amazon. Independent fan aggregator \u2014 updated daily.`,
    h1: `${school.name.toUpperCase()} FAN GEAR`,
    h2s: [
      `${school.name} ${p1} & ${p2}`,
      `${nick} ${p3} & Apparel`,
      `Shop ${school.short_name} by Sport`,
      `Best ${school.name} Fan Gear Deals`,
      `Latest ${school.short_name} News`,
    ],
    intro: `Shop ${school.name} fan gear \u2014 ${nick} ${p1.toLowerCase()}, ${p2.toLowerCase()}, ${p3.toLowerCase()}, hats and more from eBay and Amazon. Everything a die-hard ${school.nickname} fan needs, updated daily.`,
  }
}

// -----------------------------------------------
// SPORT PAGE -- /[school]/gear/[sport]
// Targets: [school] [sport] jersey/hoodie/shirt (KD 5-25)
// -----------------------------------------------
export function getSportMetadata(school: School, sportSlug: string) {
  const sport = SPORT_KEYWORDS[sportSlug]
  const nick = getFanNickname(school)

  if (!sport || sportSlug === 'general') {
    const [p1, p2, p3] = getPrimaryProducts(school)
    return {
      title: `${school.name} Fan Gear \u2014 ${nick} ${p1}, ${p2} & ${p3}`,
      description: `Shop ${school.name} fan gear including ${p1.toLowerCase()}, ${p2.toLowerCase()} and ${p3.toLowerCase()}. Find ${nick} apparel from eBay and Amazon, updated daily.`,
      h1: `${school.name.toUpperCase()} FAN GEAR`,
      h2s: [
        `${school.name} ${p1} & ${p2}`,
        `${nick} ${p3} & Apparel`,
        `${school.name} Hats & Accessories`,
        `Shop by Sport`,
      ],
      intro: `Shop all ${school.name} fan gear \u2014 ${p1.toLowerCase()}, ${p2.toLowerCase()}, ${p3.toLowerCase()}, hats and more. Browse ${nick} apparel from top sellers on eBay and Amazon, updated daily.`,
    }
  }

  const [p1, p2, p3] = sport.productTerms

  return {
    title: `${school.name} ${sport.name} Gear \u2014 ${nick} ${sport.name} ${p1}, ${p2} & ${p3}`,
    description: `Shop ${school.name} ${sport.name.toLowerCase()} gear. ${nick} ${sport.name.toLowerCase()} ${p1.toLowerCase()}, ${p2.toLowerCase()} and ${p3.toLowerCase()} from eBay and Amazon. Updated daily.`,
    h1: `${school.name.toUpperCase()} ${sport.name.toUpperCase()} GEAR`,
    h2s: [
      `${school.name} ${sport.name} ${p1} & ${p2}`,
      `${nick} ${sport.abbrev} ${p3}`,
      `${school.name} ${sport.name} Gear by Category`,
      `More ${school.short_name} Fan Gear`,
    ],
    intro: `Shop ${school.name} ${sport.name.toLowerCase()} gear \u2014 ${nick} ${sport.name.toLowerCase()} ${p1.toLowerCase()}, ${p2.toLowerCase()}, ${p3.toLowerCase()} and more. Find the best ${nick} ${sport.abbrev} apparel from eBay and Amazon, updated daily.`,
  }
}

// -----------------------------------------------
// SPORT + CATEGORY -- /[school]/gear/[sport]/[category]
// Targets: [school] [sport] [product] (KD 2-20, highest priority)
// -----------------------------------------------
export function getSportCategoryMetadata(
  school: School,
  sportSlug: string,
  categorySlug: string
) {
  const sport = SPORT_KEYWORDS[sportSlug]
  const cat = CATEGORY_KEYWORDS[categorySlug]
  const nick = getFanNickname(school)

  if (!cat) {
    const sportLabel = (!sport || sportSlug === 'general') ? '' : `${sport.name} `
    return {
      title: `${school.name} ${sportLabel}Gear | DieHardNation`,
      description: `Shop ${school.name} ${sportLabel.toLowerCase()}fan gear from eBay and Amazon.`,
      h1: `${school.name.toUpperCase()} ${sportLabel.toUpperCase()}GEAR`,
      h2s: [`Shop ${school.short_name} ${sportLabel}Gear`, `More ${school.name} Fan Gear`],
      intro: `Shop ${school.name} ${sportLabel.toLowerCase()}gear from eBay and Amazon, updated daily.`,
    }
  }

  const sportLabel = (!sport || sportSlug === 'general') ? '' : `${sport.name} `
  const abbrevLabel = (!sport || sportSlug === 'general') ? '' : `${sport.abbrev} `

  return {
    title: `${school.name} ${sportLabel}${cat.titlePlural} \u2014 ${nick} ${abbrevLabel}${cat.alt}`,
    description: `Shop ${school.name} ${sportLabel.toLowerCase()}${cat.plural.toLowerCase()} and ${cat.alt.toLowerCase()}. Find the best ${nick} fan ${cat.singular.toLowerCase()} from eBay and Amazon, updated daily.`,
    h1: `${school.name.toUpperCase()} ${sportLabel.toUpperCase()}${cat.plural.toUpperCase()}`,
    h2s: [
      `Best ${school.short_name} ${sportLabel}${cat.plural}`,
      `${nick} ${abbrevLabel}${cat.alt} for Game Day`,
      `Shop More ${school.name} ${sportLabel}Gear`,
      `Filter by Price`,
    ],
    intro: `Shop ${school.name} ${sportLabel.toLowerCase()}${cat.plural.toLowerCase()} \u2014 the best ${nick} ${abbrevLabel.toLowerCase()}${cat.alt.toLowerCase()} from top sellers on eBay and Amazon. Updated daily with fresh listings.`,
  }
}

// -----------------------------------------------
// SPORT + PRICE -- /[school]/gear/[sport]/[price]
// -----------------------------------------------
export function getSportPriceMetadata(
  school: School,
  sportSlug: string,
  priceSlug: string
) {
  const sport = SPORT_KEYWORDS[sportSlug]
  const price = PRICE_KEYWORDS[priceSlug]
  const nick = getFanNickname(school)
  const sportLabel = (!sport || sportSlug === 'general') ? '' : `${sport.name} `

  if (!price) {
    return {
      title: `${school.name} ${sportLabel}Fan Gear | DieHardNation`,
      description: `Browse ${school.name} ${sportLabel.toLowerCase()}fan gear from eBay and Amazon.`,
      h1: `${school.name.toUpperCase()} ${sportLabel.toUpperCase()}GEAR`,
      h2s: [`Shop ${school.short_name} ${sportLabel}Gear`, `More ${school.name} Fan Gear`],
      intro: `Browse ${school.name} ${sportLabel.toLowerCase()}fan gear from eBay and Amazon, updated daily.`,
    }
  }

  return {
    title: `${school.name} ${sportLabel}Fan Gear ${price.title} \u2014 ${nick} Apparel`,
    description: `Browse ${school.name} ${sportLabel.toLowerCase()}fan gear ${price.description}. Find affordable ${nick} hoodies, jerseys and shirts from eBay and Amazon.`,
    h1: `${school.name.toUpperCase()} ${sportLabel.toUpperCase()}GEAR ${price.title.toUpperCase()}`,
    h2s: [
      `Best ${school.short_name} Deals ${price.title}`,
      `Affordable ${nick} Fan Gear`,
      `Shop by Category`,
      `More ${school.name} Fan Gear`,
    ],
    intro: `Find ${school.name} ${sportLabel.toLowerCase()}fan gear ${price.description} \u2014 affordable ${nick} hoodies, jerseys, shirts and hats from eBay and Amazon. Updated daily.`,
  }
}

// -----------------------------------------------
// GIFT GUIDE -- /[school]/gift-guides/[slug]
// -----------------------------------------------
export function getGiftGuideMetadata(school: School, guideTitle: string) {
  const nick = getFanNickname(school)
  return {
    title: `${guideTitle} | DieHardNation`,
    description: `${guideTitle} \u2014 the best ${school.name} fan gifts including hoodies, jerseys and hats from eBay and Amazon.`,
    h1: guideTitle,
    h2s: [
      `Top ${nick} Fan Picks`,
      `${school.name} Gifts by Sport`,
      `Shop by Budget`,
      `More ${school.name} Gift Guides`,
    ],
  }
}

// -----------------------------------------------
// NEWS ARTICLE -- /[school]/news/[slug]
// -----------------------------------------------
export function getNewsMetadata(
  school: School,
  post: { title: string; excerpt: string }
) {
  return {
    title: `${post.title} | ${school.short_name} News \u2014 DieHardNation`,
    description: post.excerpt,
  }
}

// -----------------------------------------------
// HUB HOMEPAGE -- /
// Targets: college sweatshirts KD 13, college jacket KD 14,
//          collegiate sweaters KD 3, college hoodie KD 10
// -----------------------------------------------
export const HUB_METADATA = {
  title: 'College Fan Gear \u2014 Hoodies, Jerseys & Sweatshirts for Every School',
  description: 'Shop college fan gear for all 130 FBS schools. Hoodies, jerseys, sweatshirts and hats from eBay and Amazon. Find your school, shop your team.',
  h1: 'COLLEGE FAN GEAR FOR EVERY SCHOOL',
  h2s: [
    'College Hoodies & Sweatshirts',
    'College Jerseys & Shirts',
    'Find Your School',
    'Trending Fan Gear',
    'Latest College Fan News',
  ],
}
