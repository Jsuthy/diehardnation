import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLeague, getSport, getTeamsByLeague, getLatestArticles } from '@/lib/sports/queries'
import GearCTA from '@/components/affiliate/GearCTA'
import ProductRail from '@/components/affiliate/ProductRail'
import EmailSignup from '@/components/email/EmailSignup'
import PageHero from '@/components/sports/PageHero'
import SectionHeading from '@/components/sports/SectionHeading'
import { sportColor } from '@/lib/sports/color'

export const revalidate = 86400
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ league: string }> }): Promise<Metadata> {
  const { league: slug } = await params
  const league = await getLeague(slug)
  if (!league) return {}
  const short = league.short_name || league.name
  return {
    title: `${league.name} Fan Gear — Shop ${short} Jerseys, Hoodies & Apparel`,
    description: `Shop official-style ${league.name} fan gear. Browse all ${league.name} teams for jerseys, hoodies and apparel from top retailers.`,
    alternates: { canonical: `https://diehardnation.com/league/${slug}` },
  }
}

export default async function LeaguePage({ params }: { params: Promise<{ league: string }> }) {
  const { league: slug } = await params
  const league = await getLeague(slug)
  if (!league) notFound()

  const [teams, articles, sport] = await Promise.all([
    getTeamsByLeague(slug, 30),
    getLatestArticles(5, league.sport_slug || undefined),
    league.sport_slug ? getSport(league.sport_slug) : Promise.resolve(null),
  ])

  return (
    <main>
      <PageHero
        title={`${league.name} Fan Gear`}
        baseColor={sportColor(league.sport_slug)}
        eyebrow={[sport?.name, league.country].filter(Boolean).join(' · ') || 'League'}
        subtitle={`Shop jerseys, hoodies and apparel for every ${league.short_name || league.name} team.`}
        breadcrumb={[
          { label: 'Home', href: '/' },
          ...(sport ? [{ label: sport.name, href: `/sport/${sport.slug}` }] : []),
          { label: league.name },
        ]}
      />

      <div className="container" style={{ padding: '40px 20px 64px' }}>
        <section style={{ marginBottom: 56 }}>
          <ProductRail query={`${league.name} gear`} title={`Shop ${league.name} Gear`} />
          <GearCTA query={`${league.name} gear`} title={`Browse all ${league.name} gear`} />
        </section>

        {teams.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <SectionHeading>{league.name} Teams</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
              {teams.map(t => (
                <Link key={t.slug} href={`/team/${t.slug}`} className="dhn-chip">
                  <span className="dhn-dot" style={{ background: t.primary_color }} />
                  {t.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <SectionHeading href="/news">Latest News</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {articles.slice(0, 3).map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`} className="dhn-card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <EmailSignup source="article" sportSlug={league.sport_slug || undefined} />
      </div>
    </main>
  )
}
