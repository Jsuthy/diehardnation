import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSchool, getNewsPost, getProducts } from '@/lib/supabase/queries'
import Link from 'next/link'
import SchemaScript from '@/components/SchemaScript'
import { buildNewsArticleSchema, buildBreadcrumbSchema } from '@/lib/schema'
import ProductCardGrid from '@/components/products/ProductCardGrid'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

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

  const { products: relatedProducts } = await getProducts({
    schoolSlug,
    limit: 4,
    sortBy: 'popular',
  })

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: school.short_name, url: `/${schoolSlug}` },
    { name: 'News', url: `/${schoolSlug}/news` },
    { name: post.title, url: `/${schoolSlug}/news/${slug}` },
  ]

  return (
    <main className="container" style={{ padding: '32px 20px 64px', maxWidth: 680, margin: '0 auto' }}>
      <SchemaScript schema={[
        buildNewsArticleSchema(post, school),
        buildBreadcrumbSchema(breadcrumbs),
      ]} />

      <Link
        href={`/${schoolSlug}/news`}
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: school.primary_color,
          textDecoration: 'none',
        }}
      >
        &larr; {school.short_name} News
      </Link>

      <article style={{ marginTop: 24 }}>
        <time style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: school.primary_color,
        }}>
          {new Date(post.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 44px)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          marginTop: 8,
          marginBottom: 24,
        }}>
          {post.title}
        </h1>
        <div
          style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-primary)' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Gear CTA box */}
      <div style={{
        background: 'var(--surface)',
        borderLeft: `4px solid ${school.primary_color}`,
        padding: 20,
        margin: '28px 0',
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
      }}>
        <Link
          href={`/${schoolSlug}`}
          style={{
            display: 'inline-block',
            fontSize: 14,
            fontWeight: 700,
            color: school.primary_color,
            textDecoration: 'none',
          }}
        >
          Shop {school.short_name} fan gear &rarr;
        </Link>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            Related {school.short_name} Gear
          </h3>
          <ProductCardGrid products={relatedProducts} schoolColor={school.primary_color} />
        </section>
      )}
    </main>
  )
}
