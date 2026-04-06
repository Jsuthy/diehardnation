import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSchool, getProgrammaticPages } from '@/lib/supabase/queries'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string }>
}): Promise<Metadata> {
  const { school: slug } = await params
  const school = await getSchool(slug)
  if (!school) return {}

  return {
    title: `${school.name} Fan Gift Guide \u2014 Best ${school.mascot} Gift Ideas`,
    description: `The ultimate ${school.name} fan gift guide. Top ${school.mascot} gear picks from eBay and Amazon.`,
  }
}

export default async function GiftGuidesPage({
  params,
}: {
  params: Promise<{ school: string }>
}) {
  const { school: slug } = await params
  const school = await getSchool(slug)
  if (!school || !school.is_active) notFound()

  const pages = await getProgrammaticPages(slug)
  const giftGuides = pages.filter(p => p.page_type === 'gift-guide' || p.slug === 'gift-guide')

  return (
    <main className="container" style={{ padding: '32px 20px 64px' }}>
      <nav style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link href={`/${slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{school.short_name}</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>Gift Guides</span>
      </nav>

      <h1 style={{
        fontSize: 'clamp(28px, 5vw, 48px)',
        fontWeight: 900,
        letterSpacing: '-0.03em',
        marginBottom: 8,
      }}>
        {school.short_name.toUpperCase()} GIFT GUIDES
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
        The best {school.mascot} fan gear picks, curated for gift giving.
      </p>

      {giftGuides.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {giftGuides.map(guide => (
            <Link
              key={guide.id}
              href={`/${slug}/gift-guides/${guide.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 20,
                transition: 'box-shadow 0.15s, transform 0.15s',
              }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{guide.title}</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                  {guide.description}
                </p>
                <span style={{ fontSize: 13, fontWeight: 700, color: school.primary_color }}>
                  Browse gifts &rarr;
                </span>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>
            Gift guides coming soon for {school.short_name}. Check back after we add more products.
          </p>
          <Link
            href={`/${slug}`}
            style={{
              display: 'inline-block',
              marginTop: 16,
              padding: '10px 24px',
              background: school.primary_color,
              color: 'white',
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
            }}
          >
            Browse All {school.short_name} Gear
          </Link>
        </div>
      )}
    </main>
  )
}
