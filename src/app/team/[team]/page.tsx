import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTeam, getLeague, getTeamsByLeague, getArticlesByTeam, getTopTeams } from '@/lib/sports/queries'
import GearCTA from '@/components/affiliate/GearCTA'
import ProductRail from '@/components/affiliate/ProductRail'
import EmailSignup from '@/components/email/EmailSignup'
import PageHero from '@/components/sports/PageHero'
import SectionHeading from '@/components/sports/SectionHeading'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const teams = await getTopTeams(200)
  return teams.map(t => ({ team: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ team: string }> }): Promise<Metadata> {
  const { team: slug } = await params
  const team = await getTeam(slug)
  if (!team) return {}
  return {
    title: `${team.name} Fan Gear — ${team.name} Jerseys, Hoodies & Shirts`,
    description: `Shop ${team.name} fan gear including jerseys, hoodies and shirts. Find ${[team.city, team.name].filter(Boolean).join(' ')} apparel from top retailers, updated daily.`,
    alternates: { canonical: `https://diehardnation.com/team/${slug}` },
  }
}

export default async function TeamPage({ params }: { params: Promise<{ team: string }> }) {
  const { team: slug } = await params
  const team = await getTeam(slug)
  if (!team) notFound()

  const [league, articles] = await Promise.all([
    team.league_slug ? getLeague(team.league_slug) : Promise.resolve(null),
    getArticlesByTeam(slug, 3),
  ])
  const related = team.league_slug
    ? (await getTeamsByLeague(team.league_slug, 8)).filter(t => t.slug !== slug).slice(0, 6)
    : []

  const breadcrumb = [
    { label: 'Home', href: '/' },
    ...(team.sport_slug ? [{ label: team.sport_slug.replace(/-/g, ' '), href: `/sport/${team.sport_slug}` }] : []),
    ...(league ? [{ label: league.name, href: `/league/${league.slug}` }] : []),
    { label: team.name },
  ]

  return (
    <main>
      <PageHero
        title={`${team.name} Fan Gear`}
        baseColor={team.primary_color || '#CC0000'}
        accentColor={team.secondary_color}
        eyebrow={league ? `${league.name} · Fan Shop` : 'Fan Shop'}
        breadcrumb={breadcrumb}
        badges={[
          ...(team.city ? [{ label: team.city }] : []),
          ...(league ? [{ label: league.name, href: `/league/${league.slug}` }] : []),
        ]}
      />

      <div className="container" style={{ padding: '40px 20px 64px' }}>
        <section style={{ marginBottom: 56 }}>
          <ProductRail query={team.name} title={`Shop ${team.name} Gear`} />
          <GearCTA query={`${team.name} fan gear`} title={`Browse all ${team.name} gear`} teamName={team.name} />
        </section>

        <section style={{ marginBottom: 56 }}>
          <SectionHeading href="/news">Latest {team.name} News</SectionHeading>
          {articles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {articles.map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`} className="dhn-card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--text-secondary)' }}>
              No coverage yet.{' '}
              <Link href="/admin/publish" style={{ color: 'var(--brand)', fontWeight: 700, textDecoration: 'none' }}>
                Be the first to cover {team.name} →
              </Link>
            </div>
          )}
        </section>

        {related.length > 0 && league && (
          <section style={{ marginBottom: 56 }}>
            <SectionHeading href={`/league/${league.slug}`}>More {league.name} Teams</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
              {related.map(t => (
                <Link key={t.slug} href={`/team/${t.slug}`} className="dhn-chip">
                  <span className="dhn-dot" style={{ background: t.primary_color }} />
                  {t.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <EmailSignup source="team" sportSlug={team.sport_slug || undefined} />

        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 32 }}>
          DieHardNation is not affiliated with any team, league or governing body.
        </p>
      </div>
    </main>
  )
}
