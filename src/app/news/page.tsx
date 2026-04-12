import type { Metadata } from 'next'
import Link from 'next/link'
import { getLatestNewsAllSchools } from '@/lib/supabase/queries'
import { getSchoolBySlug } from '@/lib/constants/schools'

const POPULAR_SCHOOLS = [
  { slug: 'nebraska', name: 'Nebraska' },
  { slug: 'alabama', name: 'Alabama' },
  { slug: 'ohio-state', name: 'Ohio State' },
  { slug: 'michigan', name: 'Michigan' },
  { slug: 'texas', name: 'Texas' },
  { slug: 'georgia', name: 'Georgia' },
  { slug: 'penn-state', name: 'Penn State' },
  { slug: 'lsu', name: 'LSU' },
  { slug: 'notre-dame', name: 'Notre Dame' },
  { slug: 'tennessee', name: 'Tennessee' },
  { slug: 'clemson', name: 'Clemson' },
  { slug: 'florida', name: 'Florida' },
]

export const metadata: Metadata = {
  title: 'College Fan News \u2014 Latest from DieHardNation',
  description: 'Latest college fan gear news and deals from across all 130 FBS schools.',
}

export const revalidate = 600

export default async function NewsPage() {
  const posts = await getLatestNewsAllSchools(20)

  return (
    <main className="container" style={{ padding: '48px 20px 64px' }}>
      <h1 style={{
        fontSize: 'clamp(32px, 6vw, 56px)',
        fontWeight: 900,
        letterSpacing: '-0.03em',
        marginBottom: 8,
      }}>
        LATEST FROM THE NATION
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
        News and deals from across all 130 FBS schools.
      </p>

      {posts.length > 0 ? (
        <div style={{ maxWidth: 720 }}>
          {posts.map(post => {
            const school = getSchoolBySlug(post.school_slug)
            return (
              <Link
                key={post.id}
                href={`/${post.school_slug}/news/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article style={{
                  padding: '20px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {school && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        background: school.primary_color,
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: 3,
                      }}>
                        {school.short_name}
                      </span>
                    )}
                    <time style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </time>
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {post.excerpt}
                  </p>
                </article>
              </Link>
            )
          })}
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)', padding: '48px 0', textAlign: 'center' }}>
          News coming soon. Check back after the next game day.
        </p>
      )}
      {/* School news links — internal links */}
      <nav aria-label="Browse school news" style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)', maxWidth: 720 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>School News</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {POPULAR_SCHOOLS.map(s => (
            <Link
              key={s.slug}
              href={`/${s.slug}/news`}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '6px 12px',
                border: '1px solid var(--border)',
                borderRadius: 20,
              }}
            >
              {s.name} News
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
            View all schools &rarr;
          </Link>
        </div>
      </nav>
    </main>
  )
}
