import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getLatestArticles, getPublishedArticleSlugs, getSport } from '@/lib/sports/queries'
import GearCTA from '@/components/affiliate/GearCTA'
import EmailSignup from '@/components/email/EmailSignup'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPublishedArticleSlugs(50)
  return slugs.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    alternates: { canonical: `https://diehardnation.com/news/${slug}` },
  }
}

// Split content into paragraphs and inject a gear CTA after the 3rd block.
function splitContent(content: string): { before: string; after: string } {
  const hasHtml = /<\/?(p|div|h[1-6]|br)/i.test(content)
  if (hasHtml) {
    const parts = content.split(/(?<=<\/p>)/i)
    if (parts.length <= 3) return { before: content, after: '' }
    return { before: parts.slice(0, 3).join(''), after: parts.slice(3).join('') }
  }
  const paras = content.split(/\n\s*\n/)
  const toHtml = (arr: string[]) => arr.map(p => `<p>${p.trim()}</p>`).join('')
  if (paras.length <= 3) return { before: toHtml(paras), after: '' }
  return { before: toHtml(paras.slice(0, 3)), after: toHtml(paras.slice(3)) }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const [sport, related] = await Promise.all([
    article.sport_slug ? getSport(article.sport_slug) : Promise.resolve(null),
    getLatestArticles(4, article.sport_slug || undefined),
  ])
  const relatedOther = related.filter(a => a.slug !== slug).slice(0, 3)
  const { before, after } = splitContent(article.content)
  const gearQuery = article.team_slugs[0]
    ? `${article.team_slugs[0].replace(/-/g, ' ')} gear`
    : `${article.sport_slug || 'sports'} gear`.replace(/-/g, ' ')

  return (
    <main className="container" style={{ padding: '32px 20px 64px', maxWidth: 760, margin: '0 auto' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'NewsArticle', headline: article.title,
        description: article.excerpt, datePublished: article.published_at, author: { '@type': 'Organization', name: article.author },
        url: `https://diehardnation.com/news/${slug}`,
      }) }} />

      <nav style={{ fontSize: 12, color: 'var(--text-muted,#999)', marginBottom: 16 }}>
        <Link href="/" style={{ color: 'inherit' }}>Home</Link> ›{' '}
        <Link href="/news" style={{ color: 'inherit' }}>News</Link>
        {sport && <> › <Link href={`/sport/${sport.slug}`} style={{ color: 'inherit' }}>{sport.name}</Link></>}
      </nav>

      {sport && (
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--brand,#CC0000)', color: '#fff', padding: '3px 10px', borderRadius: 20 }}>{sport.name}</span>
      )}
      {article.published_at && (
        <time style={{ fontSize: 13, color: 'var(--text-muted,#999)', display: 'block', margin: '12px 0 4px' }}>
          {new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </time>
      )}

      <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, lineHeight: 1.1, margin: '8px 0 20px' }}>{article.title}</h1>

      <p style={{ fontSize: 19, lineHeight: 1.6, color: 'var(--text-secondary,#444)', borderLeft: `3px solid ${'var(--brand,#CC0000)'}`, paddingLeft: 16, marginBottom: 28 }}>
        {article.excerpt}
      </p>

      <article className="article-body" dangerouslySetInnerHTML={{ __html: before }} />

      <GearCTA query={gearQuery} title={`Shop ${gearQuery}`} />

      {after && <article className="article-body" dangerouslySetInnerHTML={{ __html: after }} />}

      {(article.team_slugs.length > 0 || article.school_slugs.length > 0) && (
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>Shop gear for teams in this story:</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {article.team_slugs.map(t => (
              <Link key={t} href={`/team/${t}`} style={pillStyle}>{t.replace(/-/g, ' ')}</Link>
            ))}
            {article.school_slugs.map(s => (
              <Link key={s} href={`/${s}`} style={pillStyle}>{s.replace(/-/g, ' ')}</Link>
            ))}
          </div>
        </section>
      )}

      <section style={{ margin: '40px 0' }}>
        <EmailSignup source="article" sportSlug={article.sport_slug || undefined} />
      </section>

      {relatedOther.length > 0 && (
        <section style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border,#E8E8E8)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>More {sport?.name || ''} Coverage</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
            {relatedOther.map(a => (
              <Link key={a.slug} href={`/news/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit', border: '1px solid var(--border,#E8E8E8)', borderRadius: 8, padding: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>{a.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .article-body p { margin-bottom: 20px; line-height: 1.8; font-size: 17px; }
        .article-body h2 { font-weight: 800; margin: 32px 0 16px; font-size: 24px; }
        .article-body strong { font-weight: 700; }
        .article-body a { color: var(--brand,#CC0000); text-decoration: underline; }
      `}</style>
    </main>
  )
}

const pillStyle = {
  fontSize: 13,
  fontWeight: 600,
  textTransform: 'capitalize' as const,
  padding: '6px 12px',
  border: '1px solid var(--border,#E8E8E8)',
  borderRadius: 20,
  textDecoration: 'none',
  color: 'var(--text-secondary,#555)',
}
