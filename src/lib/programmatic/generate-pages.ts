import { getAdminClient } from '@/lib/supabase/server'
import { SPORTS } from '@/lib/constants/sports'
import { CATEGORIES } from '@/lib/constants/categories'
import { PRICE_RANGES } from '@/lib/constants/price-ranges'

const MIN_PRODUCTS = 3

export async function generateProgrammaticPagesForSchool(
  schoolSlug: string
): Promise<{ created: number }> {
  const supabase = getAdminClient()

  // Get school info
  const { data: school } = await supabase
    .from('schools')
    .select('name, short_name, mascot')
    .eq('slug', schoolSlug)
    .single()

  if (!school) return { created: 0 }

  const pages: {
    school_slug: string
    slug: string
    page_type: string
    sport: string | null
    category: string | null
    price_range: string | null
    title: string
    description: string
    product_count: number
  }[] = []

  // Get product counts by sport
  for (const sport of SPORTS) {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('school_slug', schoolSlug)
      .eq('is_active', true)
      .eq('sport', sport.slug)

    if ((count || 0) >= MIN_PRODUCTS) {
      pages.push({
        school_slug: schoolSlug,
        slug: sport.slug === 'general' ? 'all-gear' : sport.slug,
        page_type: 'sport',
        sport: sport.slug,
        category: null,
        price_range: null,
        title: `${school.short_name} ${sport.name} Gear`,
        description: `Shop ${school.name} ${sport.name.toLowerCase()} fan gear. ${school.mascot} apparel from eBay and Amazon.`,
        product_count: count || 0,
      })

      // Sport + category combos
      for (const cat of CATEGORIES) {
        const { count: catCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('school_slug', schoolSlug)
          .eq('is_active', true)
          .eq('sport', sport.slug)
          .eq('category', cat.slug)

        if ((catCount || 0) >= MIN_PRODUCTS) {
          pages.push({
            school_slug: schoolSlug,
            slug: `${sport.slug === 'general' ? '' : sport.slug + '-'}${cat.slug}`,
            page_type: 'sport-category',
            sport: sport.slug,
            category: cat.slug,
            price_range: null,
            title: `${school.short_name} ${sport.slug === 'general' ? '' : sport.name + ' '}${cat.name}`,
            description: `${school.name} ${sport.slug === 'general' ? '' : sport.name.toLowerCase() + ' '}${cat.name.toLowerCase()}. Shop ${school.mascot} apparel.`,
            product_count: catCount || 0,
          })
        }
      }

      // Sport + price range combos
      for (const pr of PRICE_RANGES) {
        const { count: prCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('school_slug', schoolSlug)
          .eq('is_active', true)
          .eq('sport', sport.slug)
          .eq('price_range', pr.slug)

        if ((prCount || 0) >= MIN_PRODUCTS) {
          pages.push({
            school_slug: schoolSlug,
            slug: `${sport.slug === 'general' ? '' : sport.slug + '-'}${pr.slug}`,
            page_type: 'sport-price',
            sport: sport.slug,
            category: null,
            price_range: pr.slug,
            title: `${school.short_name} ${sport.slug === 'general' ? '' : sport.name + ' '}Gear ${pr.label}`,
            description: `${school.name} ${sport.slug === 'general' ? '' : sport.name.toLowerCase() + ' '}gear ${pr.label.toLowerCase()}. Affordable ${school.mascot} fan apparel.`,
            product_count: prCount || 0,
          })
        }
      }
    }
  }

  // Gift guide page
  const { count: totalCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('school_slug', schoolSlug)
    .eq('is_active', true)

  if ((totalCount || 0) >= MIN_PRODUCTS) {
    pages.push({
      school_slug: schoolSlug,
      slug: 'gift-guide',
      page_type: 'gift-guide',
      sport: null,
      category: null,
      price_range: null,
      title: `${school.short_name} Fan Gift Guide`,
      description: `The ultimate ${school.name} fan gift guide. Top ${school.mascot} gear picks from eBay and Amazon.`,
      product_count: totalCount || 0,
    })
  }

  // Upsert all pages
  if (pages.length > 0) {
    const { error } = await supabase
      .from('programmatic_pages')
      .upsert(pages, { onConflict: 'school_slug,slug' })

    if (error) {
      console.error('Page upsert error:', error.message)
    }
  }

  return { created: pages.length }
}
