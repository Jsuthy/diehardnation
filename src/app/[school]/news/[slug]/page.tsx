import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSchool, getNewsPost } from '@/lib/supabase/queries'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string; slug: string }>
}): Promise<Metadata> {
  const { school: schoolSlug, slug } = await params
  const post = await getNewsPost(schoolSlug, slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ school: string; slug: string }>
}) {
  const { school: schoolSlug, slug } = await params
  const [school, post] = await Promise.all([
    getSchool(schoolSlug),
    getNewsPost(schoolSlug, slug),
  ])

  if (!school || !post) notFound()

  return (
    <main className="container" style={{ padding: '32px 20px 64px', maxWidth: 720 }}>
      <Link
        href={`/${schoolSlug}`}
        style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}
      >
        &larr; Back to {school.short_name}
      </Link>

      <article style={{ marginTop: 24 }}>
        <time style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {new Date(post.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 style={{
          fontSize: 32,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          marginTop: 8,
          marginBottom: 24,
        }}>
          {post.title}
        </h1>
        <div
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--text-primary)',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  )
}
