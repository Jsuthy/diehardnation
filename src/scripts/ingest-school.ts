import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fetchEbayProductsForSchool } from '../lib/ingestion/ebay.js'
import { generateProgrammaticPagesForSchool } from '../lib/programmatic/generate-pages.js'
import type { School } from '../lib/supabase/types.js'

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim()
    }
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const schoolSlug = process.argv[2] || 'nebraska'
  console.log(`\nIngesting products for: ${schoolSlug}`)

  // Get school
  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', schoolSlug)
    .single()

  if (!school) {
    console.error(`School "${schoolSlug}" not found in DB. Run seed-schools first.`)
    process.exit(1)
  }

  // Define Nebraska search terms
  const NEBRASKA_SEARCH_TERMS = [
    'nebraska cornhuskers football',
    'huskers football shirt',
    'nebraska football hoodie',
    'nebraska football jersey',
    'go big red shirt',
    'nebraska cornhuskers basketball',
    'huskers basketball shirt',
    'nebraska basketball hoodie',
    'nebraska cornhuskers volleyball',
    'huskers volleyball shirt',
    'nebraska volleyball hoodie',
    'nebraska cornhuskers gear',
    'huskers merchandise',
    'cornhuskers shirt',
    'nebraska huskers hoodie',
    'go big red',
    'nebraska wrestling shirt',
    'huskers wrestling gear',
    'nebraska cornhuskers baseball',
    'huskers baseball hat',
  ]

  // Upsert search terms into DB
  console.log(`Upserting ${NEBRASKA_SEARCH_TERMS.length} search terms...`)
  for (const term of NEBRASKA_SEARCH_TERMS) {
    const sport = term.includes('football') ? 'football'
      : term.includes('basketball') ? 'basketball'
      : term.includes('volleyball') ? 'volleyball'
      : term.includes('wrestling') ? 'wrestling'
      : term.includes('baseball') ? 'baseball'
      : 'general'

    await supabase
      .from('school_search_terms')
      .upsert({ school_slug: schoolSlug, term, sport }, { onConflict: 'school_slug,term' })
  }

  // Fetch from eBay
  console.log('\nFetching from eBay...')
  const products = await fetchEbayProductsForSchool(school as School, NEBRASKA_SEARCH_TERMS)
  console.log(`Fetched ${products.length} products from eBay`)

  // Sport breakdown
  const sportBreakdown: Record<string, number> = {}
  for (const p of products) {
    sportBreakdown[p.sport] = (sportBreakdown[p.sport] || 0) + 1
  }
  console.log('\nSport breakdown:')
  for (const [sport, count] of Object.entries(sportBreakdown).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${sport}: ${count}`)
  }

  // Upsert products
  console.log('\nUpserting products...')
  let upserted = 0
  const batchSize = 50
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize)
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
      console.error(`Batch error:`, error.message)
    } else {
      upserted += batch.length
    }
  }
  console.log(`Upserted: ${upserted} products`)

  // Generate programmatic pages
  console.log('\nGenerating programmatic pages...')
  const pageResult = await generateProgrammaticPagesForSchool(schoolSlug)
  console.log(`Pages created: ${pageResult.created}`)

  // Final count
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('school_slug', schoolSlug)
    .eq('is_active', true)
  console.log(`\nTotal active products for ${schoolSlug}: ${count}`)

  console.log('\nDone!')
}

main().catch(console.error)
