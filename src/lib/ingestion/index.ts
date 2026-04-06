import { getAdminClient } from '@/lib/supabase/server'
import { fetchEbayProductsForSchool } from './ebay'
import { generateProgrammaticPagesForSchool } from '@/lib/programmatic/generate-pages'
import type { School } from '@/lib/supabase/types'
import type { NormalizedProduct } from './utils'

export interface IngestionResult {
  school_slug: string
  ebay_fetched: number
  upserted: number
  pages_created: number
  errors: string[]
  sport_breakdown: Record<string, number>
}

export async function runIngestionForSchool(schoolSlug: string): Promise<IngestionResult> {
  const supabase = getAdminClient()
  const errors: string[] = []

  // Get school
  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', schoolSlug)
    .single()

  if (!school) {
    return { school_slug: schoolSlug, ebay_fetched: 0, upserted: 0, pages_created: 0, errors: ['School not found'], sport_breakdown: {} }
  }

  // Get search terms
  const { data: terms } = await supabase
    .from('school_search_terms')
    .select('term')
    .eq('school_slug', schoolSlug)
    .eq('is_active', true)

  const searchTerms = terms?.map(t => t.term) || [
    `${school.name} shirt`,
    `${school.short_name} hoodie`,
    `${school.mascot} gear`,
    `${school.nickname} merchandise`,
  ]

  // Fetch from eBay
  let ebayProducts: NormalizedProduct[] = []
  try {
    ebayProducts = await fetchEbayProductsForSchool(school as School, searchTerms)
  } catch (err) {
    errors.push(`eBay fetch error: ${err}`)
  }

  // Upsert products in batches
  let upserted = 0
  const batchSize = 50
  for (let i = 0; i < ebayProducts.length; i += batchSize) {
    const batch = ebayProducts.slice(i, i + batchSize)
    const { error } = await supabase
      .from('products')
      .upsert(
        batch.map(p => ({
          school_slug: p.school_slug,
          external_id: p.external_id,
          source: p.source,
          title: p.title,
          description: p.description,
          price: p.price,
          original_price: p.original_price,
          image_url: p.image_url,
          affiliate_url: p.affiliate_url,
          slug: p.slug,
          category: p.category,
          sport: p.sport,
          brand: p.brand,
          is_active: true,
        })),
        { onConflict: 'school_slug,external_id,source' }
      )

    if (error) {
      errors.push(`Upsert batch error: ${error.message}`)
    } else {
      upserted += batch.length
    }
  }

  // Generate programmatic pages
  let pagesCreated = 0
  try {
    const result = await generateProgrammaticPagesForSchool(schoolSlug)
    pagesCreated = result.created
  } catch (err) {
    errors.push(`Page generation error: ${err}`)
  }

  // Compute sport breakdown
  const sportBreakdown: Record<string, number> = {}
  for (const p of ebayProducts) {
    sportBreakdown[p.sport] = (sportBreakdown[p.sport] || 0) + 1
  }

  return {
    school_slug: schoolSlug,
    ebay_fetched: ebayProducts.length,
    upserted,
    pages_created: pagesCreated,
    errors,
    sport_breakdown: sportBreakdown,
  }
}
