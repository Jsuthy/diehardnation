export type SportSlug =
  | 'football' | 'basketball' | 'volleyball' | 'wrestling'
  | 'baseball' | 'softball' | 'track' | 'general'

export type CategorySlug =
  | 'tees' | 'hoodies' | 'hats' | 'jerseys'
  | 'womens' | 'youth' | 'accessories'

export type PriceRangeSlug =
  | 'under-25' | '25-to-50' | '50-to-100' | 'over-100'

export type ProductSource = 'ebay' | 'amazon' | 'fanatics' | 'manual'

export type ConferenceSlug =
  | 'sec' | 'big-ten' | 'big-12' | 'acc'
  | 'american' | 'mountain-west' | 'sun-belt'
  | 'mac' | 'cusa' | 'independent'

export interface School {
  id: string
  slug: string
  name: string
  short_name: string
  mascot: string
  nickname: string
  city: string
  state: string
  conference: ConferenceSlug
  primary_color: string
  secondary_color: string
  fan_size_rank: number
  is_active: boolean
  is_live: boolean
}

export interface Product {
  id: string
  school_slug: string
  external_id: string
  source: ProductSource
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
  price_range: PriceRangeSlug
  is_featured: boolean
  is_active: boolean
  click_count: number
  created_at: string
}

export interface ProgrammaticPage {
  id: string
  school_slug: string
  slug: string
  page_type: string
  sport: string | null
  category: string | null
  price_range: string | null
  title: string
  description: string
  product_count: number
  is_active: boolean
}

export interface NewsPost {
  id: string
  school_slug: string
  slug: string
  title: string
  content: string
  excerpt: string
  is_published: boolean
  published_at: string
}
