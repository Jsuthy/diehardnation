import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSchool, getProducts } from '@/lib/supabase/queries'
import { SPORTS } from '@/lib/constants/sports'
import SchoolShopClient from '@/components/school/SchoolShopClient'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string; sport: string }>
}): Promise<Metadata> {
  const { school: slug, sport: sportSlug } = await params
  const school = await getSchool(slug)
  const sport = SPORTS.find(s => s.slug === sportSlug)
  if (!school || !sport) return {}

  return {
    title: `${school.short_name} ${sport.name} Gear`,
    description: `Shop ${school.name} ${sport.name.toLowerCase()} fan gear. ${school.mascot} apparel from eBay and Amazon.`,
  }
}

export default async function SportPage({
  params,
}: {
  params: Promise<{ school: string; sport: string }>
}) {
  const { school: slug, sport: sportSlug } = await params
  const school = await getSchool(slug)
  const sport = SPORTS.find(s => s.slug === sportSlug)

  if (!school || !school.is_active || !sport) notFound()

  const { products, total } = await getProducts({
    schoolSlug: slug,
    sport: sportSlug,
    limit: 24,
  })

  return (
    <main>
      <section style={{ background: school.primary_color, padding: '32px 0' }}>
        <div className="container">
          <h1 style={{
            color: 'white',
            fontWeight: 900,
            fontSize: 'clamp(28px, 5vw, 48px)',
            letterSpacing: '-0.03em',
          }}>
            {school.short_name.toUpperCase()} {sport.name.toUpperCase()}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 6 }}>
            {total} products found
          </p>
        </div>
      </section>

      <SchoolShopClient
        initialProducts={products}
        totalCount={total}
        schoolSlug={slug}
        schoolColor={school.primary_color}
        school={school}
      />
    </main>
  )
}
