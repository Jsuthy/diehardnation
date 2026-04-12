import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Legal & Disclosures',
  description: 'DieHardNation legal disclaimers, affiliate disclosure, privacy policy, and terms of use.',
}

export default function LegalPage() {
  return (
    <main className="container" style={{ padding: '48px 20px 80px', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 32 }}>
        Legal &amp; Disclosures
      </h1>

      {/* Trademark Disclaimer */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Trademark Disclaimer</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          DieHardNation.com is an independent, unofficial fan site and affiliate aggregator.
          We are not affiliated with, endorsed by, or connected to any university, athletic
          department, conference, or licensing body including IMG College, Learfield, or NCAA.
          All team names, mascots, logos, and marks are property of their respective institutions.
          We reference them in a descriptive, nominative fair-use capacity to help fans find
          third-party products sold by officially licensed retailers.
        </p>
      </section>

      {/* Affiliate Disclosure */}
      <section id="affiliate" style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Affiliate Disclosure</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          DieHardNation is a participant in affiliate advertising programs including the eBay
          Partner Network and Amazon Services LLC Associates Program. These programs provide a
          means for us to earn advertising fees by linking to products on eBay.com and Amazon.com.
          When you click a product link and make a purchase, we may earn a commission at no
          additional cost to you. Product prices and availability are subject to change. Any price
          and availability information displayed at the time of purchase will apply.
        </p>
      </section>

      {/* Privacy Policy */}
      <section id="privacy" style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Privacy Policy</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          We collect minimal data necessary to operate this site:
        </p>
        <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 20, marginBottom: 12 }}>
          <li>Email addresses voluntarily submitted for newsletter subscriptions</li>
          <li>Anonymous click event data (product ID, timestamp) to improve product rankings</li>
          <li>Standard web server logs (IP address, user agent, referrer) for security and analytics</li>
        </ul>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          We do not sell, trade, or transfer personal information to third parties. We do not use
          cookies for tracking or advertising. Third-party sites (eBay, Amazon) have their own
          privacy policies that apply when you visit their sites through our links.
        </p>
      </section>

      {/* Terms of Use */}
      <section id="terms" style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Terms of Use</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
          By using DieHardNation.com, you agree to the following terms:
        </p>
        <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 20, marginBottom: 12 }}>
          <li>All product listings are sourced from third-party retailers and are subject to their terms and conditions</li>
          <li>We make no guarantees about product availability, pricing accuracy, or delivery</li>
          <li>This site is provided &ldquo;as is&rdquo; without warranties of any kind</li>
          <li>We reserve the right to modify or discontinue any part of this site at any time</li>
          <li>Content on this site, excluding third-party product data, is owned by DieHardNation</li>
        </ul>
      </section>

      {/* Contact */}
      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Contact</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          For questions, concerns, or takedown requests, please contact us at{' '}
          <strong>legal@diehardnation.com</strong>.
        </p>
      </section>

      {/* Navigation links — internal linking */}
      <nav aria-label="Site navigation" style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Explore DieHardNation</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
            Home &mdash; Browse All Schools
          </Link>
          <Link href="/trending" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
            Trending Gear
          </Link>
          <Link href="/news" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
            Latest News
          </Link>
          <Link href="/nebraska" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
            Nebraska
          </Link>
          <Link href="/alabama" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
            Alabama
          </Link>
          <Link href="/ohio-state" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
            Ohio State
          </Link>
          <Link href="/michigan" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
            Michigan
          </Link>
          <Link href="/texas" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
            Texas
          </Link>
        </div>
      </nav>
    </main>
  )
}
