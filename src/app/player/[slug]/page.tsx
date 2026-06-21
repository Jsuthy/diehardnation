import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { findPlayer, PLAYERS } from '@/lib/sports/players'
import { searchEbayProducts } from '@/lib/ebay/search'
import {
  buildPlayerQuickAnswer,
  buildPlayerGuide,
  buildPlayerFaq,
  buildFaqSchema,
  computePriceStat,
} from '@/lib/seo/content-blocks'
import { ContentSection, FaqSection, QuickAnswerBox } from '@/components/seo/ValueContent'
import MomentProductGrid from '@/components/seo/MomentProductGrid'
import { evaluatePageQuality, robotsForQuality } from '@/lib/seo/quality-gate'

export const revalidate = 3600
export const dynamicParams = true

const SITE = 'https://diehardnation.com'

export async function generateStaticParams() {
  return PLAYERS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const player = findPlayer(slug)
  if (!player) return {}

  // eBay fetch is cached (revalidate), so this is shared with the page render.
  const products = await searchEbayProducts(`${player.name} jersey`, 24)
  const quality = evaluatePageQuality({ productCount: products.length, uniqueWordCount: 180 })

  return {
    title: `${player.name} Jersey & Fan Gear — ${player.team} | DieHardNation`,
    description: `Shop ${player.name} jerseys and fan gear — ${player.team} home, away and throwback jerseys, shirts and hoodies from eBay, updated daily.`,
    robots: robotsForQuality(quality),
    alternates: { canonical: `${SITE}/player/${slug}` },
    openGraph: {
      title: `${player.name} Jersey & Fan Gear`,
      description: `Shop ${player.name} (${player.team}) jerseys and gear, updated daily.`,
      url: `${SITE}/player/${slug}`,
      siteName: 'DieHardNation',
      images: [{ url: `${SITE}/og-default.png`, width: 1200, height: 630, alt: `${player.name} gear` }],
    },
  }
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const player = findPlayer(slug)
  if (!player) notFound()

  const products = await searchEbayProducts(`${player.name} jersey`, 24)
  const priceStat = computePriceStat(products.map(p => p.price))
  const count = products.length

  const quickAnswer = buildPlayerQuickAnswer(player.name, { team: player.team, productCount: count, priceStat })
  const guide = buildPlayerGuide(player.name, { team: player.team, priceStat })
  const faqs = buildPlayerFaq(player.name, { team: player.team, productCount: count, priceStat })

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, item: { '@id': SITE, name: 'DieHardNation' } },
          { '@type': 'ListItem', position: 2, item: { '@id': `${SITE}/players`, name: 'Players' } },
          { '@type': 'ListItem', position: 3, item: { '@id': `${SITE}/player/${slug}`, name: player.name } },
        ],
      }) }} />
      {products.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'ItemList', name: `${player.name} Jersey & Fan Gear`,
          numberOfItems: products.length,
          itemListElement: products.slice(0, 10).map((p, i) => ({
            '@type': 'ListItem', position: i + 1,
            item: {
              '@type': 'Product', name: p.title,
              ...(p.imageUrl && { image: p.imageUrl }),
              offers: { '@type': 'Offer', price: p.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: p.url },
            },
          })),
        }) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faqs)) }} />

      <nav aria-label="breadcrumb" className="container" style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)' }}>
        <ol style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
          <li><Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>DieHardNation</Link></li>
          <li style={{ margin: '0 6px' }}>/</li>
          <li><Link href="/players" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Players</Link></li>
          <li style={{ margin: '0 6px' }}>/</li>
          <li style={{ color: 'var(--text-secondary)' }}>{player.name}</li>
        </ol>
      </nav>

      <section style={{ background: '#111', padding: '32px 0' }}>
        <div className="container">
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FF8200', marginBottom: 8 }}>
            {player.team}
          </span>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 52px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {player.name} Jersey &amp; Fan Gear
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 10 }}>
            {count}+ live listings · updated daily
          </p>
        </div>
      </section>

      <QuickAnswerBox qa={quickAnswer} label={`${player.name} jerseys`} />
      <MomentProductGrid products={products} />
      <ContentSection block={guide} />
      <FaqSection faqs={faqs} heading={`${player.name} Jersey FAQ`} />

      <section className="container" style={{ padding: '0 20px 48px' }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 720 }}>
          DieHardNation is an independent affiliate aggregator and is not affiliated with {player.name},
          {' '}{player.team}, or any league. Products are sold by third-party sellers on eBay; we earn
          affiliate commissions from qualifying purchases. All trademarks are property of their respective owners.
        </p>
      </section>
    </main>
  )
}
