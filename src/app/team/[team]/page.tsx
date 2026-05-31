import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTeam, getLeague, getTeamsByLeague, getArticlesByTeam, getTopTeams } from '@/lib/sports/queries'
import GearCTA from '@/components/affiliate/GearCTA'
import ProductRail from '@/components/affiliate/ProductRail'
import EmailSignup from '@/components/email/EmailSignup'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const teams = await getTopTeams(100)
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

  return (
    <main>
      <section style={{ background: team.primary_color || 'var(--brand,#CC0000)', color: '#fff', padding: '56px 20px' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(34px,6vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {team.name} Fan Gear
          </h1>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {team.city && <span style={badgeStyle}>{team.city}</span>}
            {league && <Link href={`/league/${league.slug}`} style={{ ...badgeStyle, textDecoration: 'none', color: '#fff' }}>{league.name}</Link>}
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '40px 20px 64px' }}>
        <section style={{ marginBottom: 48 }}>
          <ProductRail query={`${team.name} jersey hoodie`} title={`Shop ${team.name} Gear`} />
          <GearCTA query={`${team.name} fan gear`} title={`Browse all ${team.name} gear`} teamName={team.name} />
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Latest {team.name} News</h2>
          {articles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {articles.map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`} style={{ ...cardStyle, padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary,#555)', lineHeight: 1.5 }}>{a.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : (
            <Link href="/admin/publish" style={{ color: 'var(--brand,#CC0000)', fontWeight: 700, textDecoration: 'none' }}>
              Be the first to cover {team.name} →
            </Link>
          )}
        </section>

        {related.length > 0 && league && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>More {league.name} Teams</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
              {related.map(t => (
                <Link key={t.slug} href={`/team/${t.slug}`} style={cardStyle}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: t.primary_color, marginRight: 8, verticalAlign: 'middle' }} />
                  <strong style={{ fontSize: 14 }}>{t.name}</strong>
                </Link>
              ))}
            </div>
          </section>
        )}

        <EmailSignup source="team" sportSlug={team.sport_slug || undefined} />

        <p style={{ fontSize: 12, color: 'var(--text-muted,#999)', marginTop: 32 }}>
          Affiliate links — commission earned at no cost to you. DieHardNation is not affiliated with any team, league or governing body.
        </p>
      </div>
    </main>
  )
}

const cardStyle = {
  display: 'block',
  background: '#fff',
  border: '1px solid var(--border,#E8E8E8)',
  borderRadius: 'var(--radius-md,8px)',
  padding: '14px 16px',
  textDecoration: 'none',
  color: 'inherit',
} as const

const badgeStyle = {
  fontSize: 13,
  fontWeight: 700,
  background: 'rgba(255,255,255,0.2)',
  padding: '4px 12px',
  borderRadius: 20,
} as const
