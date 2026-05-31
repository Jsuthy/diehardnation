import type { Metadata } from 'next'
import Link from 'next/link'
import { getLatestArticles } from '@/lib/sports/queries'
import { getLatestNewsAllSchools } from '@/lib/supabase/queries'
import { getSchoolBySlug } from '@/lib/constants/schools'

export const metadata: Metadata = {
  title: 'Sports News — Latest from DieHardNation',
  description: 'Latest sports news and fan gear coverage. NFL, NBA, soccer, college sports and more, updated daily.',
  alternates: { canonical: 'https://diehardnation.com/news' },
}

export const revalidate = 600

const FILTERS = [
  { label: 'All', slug: '' },
  { label: 'NFL', slug: 'american-football' },
  { label: 'NBA', slug: 'basketball' },
  { label: 'Soccer', slug: 'soccer' },
  { label: 'Baseball', slug: 'baseball' },
]

export default async function NewsPage() {
  const [articles, schoolPosts] = await Promise.all([
    getLatestArticles(20),
    getLatestNewsAllSchools(10),
  ])

  return (
    <main className="container" style={{ padding: '48px 20px 64px' }}>
      <h1 style={{ fontSize: 'clamp(32px,6vw,56px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>
        Sports News
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary,#555)', marginBottom: 24 }}>
        NFL, NBA, soccer, college sports and more — updated daily.
      </p>

      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        {FILTERS.map(f => (
          <Link key={f.label} href={f.slug ? `/sport/${f.slug}` : '/news'}
            style={{ fontSize: 13, fontWeight: 700, padding: '6px 14px', border: '1px solid var(--border,#E8E8E8)', borderRadius: 20, textDecoration: 'none', color: 'var(--text-secondary,#555)' }}>
            {f.label}
          </Link>
        ))}
      </nav>

      {articles.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
          {articles.map(a => (
            <Link key={a.slug} href={`/news/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid var(--border,#E8E8E8)', borderRadius: 'var(--radius-md,8px)', padding: 18 }}>
              {a.sport_slug && (
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand,#CC0000)' }}>{a.sport_slug.replace(/-/g, ' ')}</span>
              )}
              <h2 style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.35, margin: '6px 0' }}>{a.title}</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary,#555)', lineHeight: 1.5 }}>{a.excerpt}</p>
              {a.published_at && (
                <time style={{ fontSize: 11, color: 'var(--text-muted,#999)', marginTop: 8, display: 'block' }}>
                  {new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </time>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted,#999)', padding: '32px 0' }}>
          No articles published yet. Check back soon — or{' '}
          <Link href="/admin/publish" style={{ color: 'var(--brand,#CC0000)' }}>publish the first one</Link>.
        </p>
      )}

      {/* College news from the original school system */}
      {schoolPosts.length > 0 && (
        <section style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--border,#E8E8E8)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>College Fan News</h2>
          <div style={{ maxWidth: 720 }}>
            {schoolPosts.map(post => {
              const school = getSchoolBySlug(post.school_slug)
              return (
                <Link key={post.id} href={`/${post.school_slug}/news/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article style={{ padding: '16px 0', borderBottom: '1px solid var(--border,#E8E8E8)' }}>
                    {school && (
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', background: school.primary_color, color: '#fff', padding: '2px 6px', borderRadius: 3 }}>{school.short_name}</span>
                    )}
                    <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, margin: '6px 0 4px' }}>{post.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary,#555)' }}>{post.excerpt}</p>
                  </article>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
