import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLeague, getSport, getTeamsByLeague, getLatestArticles } from '@/lib/sports/queries'
import GearCTA from '@/components/affiliate/GearCTA'
import EmailSignup from '@/components/email/EmailSignup'

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
      <section style={{ background: 'var(--brand,#CC0000)', color: '#fff', padding: '56px 20px' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(34px,6vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {league.name} Fan Gear &amp; News
          </h1>
          {sport && (
            <p style={{ fontSize: 16, marginTop: 12, opacity: 0.9 }}>
              <Link href={`/sport/${sport.slug}`} style={{ color: '#fff' }}>{sport.name}</Link>
              {league.country ? ` · ${league.country}` : ''}
            </p>
          )}
        </div>
      </section>

      <div className="container" style={{ padding: '40px 20px 64px' }}>
        {teams.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>{league.name} Teams</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
              {teams.map(t => (
                <Link key={t.slug} href={`/team/${t.slug}`} style={cardStyle}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: t.primary_color, marginRight: 8, verticalAlign: 'middle' }} />
                  <strong style={{ fontSize: 14 }}>{t.name}</strong>
                </Link>
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Latest News</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {articles.slice(0, 3).map(a => (
                <Link key={a.slug} href={`/news/${a.slug}`} style={{ ...cardStyle, padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary,#555)', lineHeight: 1.5 }}>{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Shop {league.name} Gear</h2>
          <GearCTA query={`${league.name} gear`} />
        </section>

        <EmailSignup source="article" sportSlug={league.sport_slug || undefined} />
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
