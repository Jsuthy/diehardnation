import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSchool, getNewsPosts } from '@/lib/supabase/queries'

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
    title: `${school.name} News \u2014 Latest ${school.mascot} Updates`,
    description: `Latest ${school.name} fan gear news, deals, and game day updates from DieHardNation.`,
  }
}

export default async function SchoolNewsPage({
  params,
}: {
  params: Promise<{ school: string }>
}) {
  const { school: slug } = await params
  const school = await getSchool(slug)
  if (!school || !school.is_active) notFound()

  const posts = await getNewsPosts(slug, 20)

  return (
    <main className="container" style={{ padding: '32px 20px 64px' }}>
      <nav style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link href={`/${slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{school.short_name}</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>News</span>
      </nav>

      <h1 style={{
        fontSize: 'clamp(28px, 5vw, 48px)',
        fontWeight: 900,
        letterSpacing: '-0.03em',
        marginBottom: 8,
      }}>
        {school.short_name.toUpperCase()} NEWS
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
        Latest {school.mascot} fan gear news and deals.
      </p>

      {posts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          <style>{`
            @media (max-width: 640px) {
              .news-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/${slug}/news/${post.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article style={{
                padding: '20px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <time style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: school.primary_color,
                }}>
                  {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
                <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginTop: 4, marginBottom: 6 }}>
                  {post.title}
                </h2>
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                }}>
                  {post.excerpt}
                </p>
                <span style={{ fontSize: 13, fontWeight: 600, color: school.primary_color, marginTop: 8, display: 'inline-block' }}>
                  Read more &rarr;
                </span>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>
            {school.short_name} news coming soon &mdash; check back after the next game.
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
            Browse {school.short_name} Gear
          </Link>
        </div>
      )}
    </main>
  )
}
