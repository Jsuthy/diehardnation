import type { SportSlug, CategorySlug } from '@/lib/supabase/types'

export function detectSport(title: string): SportSlug {
  const t = title.toLowerCase()
  if (/\bfootball\b/.test(t)) return 'football'
  if (/\bbasketball\b/.test(t)) return 'basketball'
  if (/\bvolleyball\b/.test(t)) return 'volleyball'
  if (/\bwrestl(ing|e)\b/.test(t)) return 'wrestling'
  if (/\bbaseball\b/.test(t)) return 'baseball'
  if (/\bsoftball\b/.test(t)) return 'softball'
  if (/\btrack\b|\bcross\s*country\b/.test(t)) return 'track'
  return 'general'
}

export function detectBrand(title: string): string | null {
  const t = title.toLowerCase()
  if (/\bnike\b/.test(t)) return 'Nike'
  if (/\badidas\b/.test(t)) return 'Adidas'
  if (/\bfanatics\b/.test(t)) return 'Fanatics'
  if (/\bchampion\b/.test(t)) return 'Champion'
  if (/\b'?47\b|\bforty\s*seven\b/.test(t)) return "'47"
  if (/\bcolumbia\b/.test(t)) return 'Columbia'
  if (/\bunder\s*armou?r\b/.test(t)) return 'Under Armour'
  if (/\bnew\s*era\b/.test(t)) return 'New Era'
  if (/\bmitchell\s*&?\s*ness\b/.test(t)) return 'Mitchell & Ness'
  if (/\bcolosseum\b/.test(t)) return 'Colosseum'
  return null
}

export function categorizeByTitle(title: string): CategorySlug {
  const t = title.toLowerCase()
  if (/hoodie|sweatshirt|crewneck|fleece|pullover/.test(t)) return 'hoodies'
  if (/\bhat\b|\bcap\b|snapback|beanie|visor/.test(t)) return 'hats'
  if (/jersey/.test(t)) return 'jerseys'
  if (/women|ladies|girl/.test(t)) return 'womens'
  if (/kid|youth|child|toddler|infant|baby/.test(t)) return 'youth'
  if (/phone|case|pin|flag|mug|accessory|sticker|decal|keychain|lanyard|blanket|towel/.test(t)) return 'accessories'
  return 'tees'
}

export function generateSlug(title: string, externalId: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
  const suffix = externalId.replace(/[^a-z0-9]/gi, '').slice(-6)
  return `${base}-${suffix}`
}

export function isSchoolProduct(title: string, schoolTerms: string[]): boolean {
  const t = title.toLowerCase()
  return schoolTerms.some(term => t.includes(term.toLowerCase()))
}

export interface NormalizedProduct {
  school_slug: string
  external_id: string
  source: 'ebay' | 'amazon'
  title: string
  description: string
  price: number
  original_price: number | null
  image_url: string | null
  affiliate_url: string
  slug: string
  category: CategorySlug
  sport: SportSlug
  brand: string | null
}
